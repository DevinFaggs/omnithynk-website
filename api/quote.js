// Quote requests: save to the OmniThynk database, then email the team.
// The destination email comes from Settings (editable on /admin), so changing it needs no code change.
const { SUPABASE_URL, SUPABASE_KEY } = require('./_config.js');

const clip = (v, n) => (v == null ? '' : String(v)).slice(0, n).trim();
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 60 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter(t => now - t < win); arr.push(now); hits.set(ip, arr);
  return arr.length > 8;
}
async function sb(path, body, method) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: method || (body ? 'POST' : 'GET'),
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch (_) {}
  return { ok: r.ok, status: r.status, json, text };
}
const esc = s => String(s).replace(/[<>]/g, '');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'rate_limited' });
  const b = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch (_) { return {}; } })() : (req.body || {});
  if (b.website_url) return res.status(200).json({ ok: true }); // honeypot: bots fill hidden field

  const q = {
    p_name: clip(b.name, 120), p_email: clip(b.email, 200).toLowerCase(), p_phone: clip(b.phone, 40), p_business: clip(b.business, 160),
    p_project_type: clip(b.project_type, 60), p_features: (Array.isArray(b.features) ? b.features : []).slice(0, 20).map(f => clip(f, 60)),
    p_size: clip(b.size, 40), p_timeline: clip(b.timeline, 60), p_budget: clip(b.budget, 60), p_details: clip(b.details, 3000),
    p_concept_id: clip(b.concept_id, 20), p_estimate: (b.estimate && typeof b.estimate === 'object') ? b.estimate : null
  };
  if (!q.p_name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(q.p_email)) return res.status(400).json({ error: 'missing_contact' });

  const ins = await sb('rpc/submit_quote', q);
  if (!ins.ok) {
    const tooMany = /too_many_requests/.test(ins.text);
    console.error('quote_insert_failed', ins.status, ins.text.slice(0, 200));
    return res.status(tooMany ? 429 : 500).json({ error: tooMany ? 'rate_limited' : 'save_failed' });
  }
  const id = ins.json;

  // where to send it (Settings → contact.quote_email)
  let to = 'omnithynk@gmail.com';
  const s = await sb('settings?key=eq.contact&select=value');
  if (s.ok && Array.isArray(s.json) && s.json[0]?.value?.quote_email) to = s.json[0].value.quote_email;

  const site = `https://${req.headers['x-forwarded-host'] || req.headers.host || 'omnithynk-website.vercel.app'}`;
  const est = q.p_estimate || {};
  let emailed = false, emailNote = '';
  try {
    const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: site, Referer: site + '/' },
      body: JSON.stringify({
        _subject: `New quote request: ${q.p_name}${q.p_business ? ' (' + q.p_business + ')' : ''}`,
        _template: 'table', _captcha: 'false', _replyto: q.p_email,
        Name: esc(q.p_name), Email: q.p_email, Phone: q.p_phone || '-', Business: esc(q.p_business || '-'),
        'Project type': q.p_project_type || '-', Features: q.p_features.join(', ') || '-', Size: q.p_size || '-',
        'Wanted by': q.p_timeline || '-', Budget: q.p_budget || '-', Details: esc(q.p_details || '-'),
        'Estimate shown': est.tier ? `${est.tier} package, ${est.weeks || ''}` : '-',
        'Their design': q.p_concept_id ? `${site}/concept?c=${q.p_concept_id}` : '-',
        'Reference': id, 'Manage all requests': `${site}/admin`
      })
    });
    const j = await r.json().catch(() => ({}));
    emailed = r.ok && String(j.success) === 'true';
    if (!emailed) { emailNote = String(j.message || r.status).slice(0, 160); console.error('email_not_sent', r.status, JSON.stringify(j).slice(0, 200)); }
  } catch (e) { emailNote = 'email_error'; console.error('email_error', e && e.message); }
  if (emailed) await sb('rpc/mark_quote_emailed', { p_id: id });

  return res.status(200).json({ ok: true, id, emailed, email_note: emailNote || undefined });
};
