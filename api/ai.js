// OmniThynk AI endpoint — runs on Vercel, calls AI Gateway with the project's OIDC token.
// No API key needed: Vercel issues the token to this project automatically.
// Modes: "site" (website/app concept as JSON), "chat" (concierge), "summary" (intake brief).

const GATEWAY = 'https://ai-gateway.vercel.sh/v1/chat/completions';
const MODEL = process.env.AI_MODEL || 'anthropic/claude-haiku-5.5';

const ICONS = ['cookie','cake','coffee','bread','pizza','burger','taco','leaf','flame','snowflake','wrench','home','bolt','droplet','scissors','sparkle','heart','star','dumbbell','run','book','music','camera','gift','gem','shirt','paw','car','tooth','medical','calendar','chat','cart','bag','tag','truck','users','globe','shield','clock','pin','chart','smile','sun','brush','graduation','church','briefcase'];

const BRAND = `OmniThynk LLC (tagline: Built to Think. Trained to Evolve.) designs and builds websites, mobile apps, online stores, AI helpers, business dashboards and secure hosting for everyday businesses and people who just have an idea.
Products: OmniLaunch (websites, apps and online stores from your idea), OmniAI (AI helpers that answer customers and handle busywork), ThinkLayer (simple dashboards and smart reports), OmniSec (security and keeping customer data safe), Smart Infrastructure (fast, reliable hosting and ongoing care).
How it works: Talk (tell us your idea), See it (clickable preview first), Build (we build, test and launch), Grow (we keep improving it).
Founder and CEO: Dr. Devin Faggs, U.S. Air Force veteran with two decades leading major technology and R&D programs. Contact: omnithynk@gmail.com, +1 (513) 497-0420.`;

const CHAT_RULES = `You are the friendly assistant on OmniThynk's website.
${BRAND}
Rules: Answer in 2 to 5 short sentences, plain text, no markdown. Speak to people with no technical background; avoid jargon and explain any technical word you must use. Many visitors only have an idea; reassure them that is enough to start. Never invent prices, guaranteed timelines, client names or statistics; for cost or timeline say it depends on the project and suggest telling us their idea through the form on this page. If asked something unrelated, answer briefly and steer back.`;

function sitePrompt({ business, goal, feel, kind }) {
  return `Design a realistic concept for a ${kind === 'app' ? 'mobile app' : 'website'} for this business. It is a sales demo, so make it specific, appealing and believable.
Business: ${business}
What it should do: ${goal || 'Attract customers and make it easy to buy or book.'}
Desired feel: ${feel || 'Modern and friendly'}

Reply with ONLY one JSON object, no other text, in exactly this shape:
{"name":"brand name (use the business's own name if given, otherwise invent a fitting one)",
"style":"one of warm|bold|elegant|playful|clean",
"palette":{"bg":"#RRGGBB page background, usually light","surface":"#RRGGBB card background","text":"#RRGGBB readable on bg","accent":"#RRGGBB main brand color","accent2":"#RRGGBB complementary second color"},
"logoIcon":"icon",
"nav":["4 short menu labels"],
"hero":{"title":"headline, max 8 words","text":"one sentence, max 22 words","cta":"button, max 3 words","badge":"short highlight, max 4 words"},
"productsTitle":"section title for their products or services, max 4 words",
"products":[{"name":"real-sounding product or service name","desc":"max 9 words","price":"like $4.50 or From $89","icon":"icon"}] (exactly 6),
"features":[{"title":"max 4 words","text":"max 12 words","icon":"icon"}] (exactly 3),
"about":"max 30 words, warm and specific",
"ctaBand":{"title":"max 8 words","button":"max 3 words"},
"app":{"greeting":"max 5 words","promo":{"title":"max 5 words","text":"max 10 words","button":"max 2 words"},"categories":["4 one-word categories"],"listTitle":"max 3 words","actionTitle":"what users schedule or order, max 3 words","actionButton":"max 2 words","tabs":[{"label":"one word","icon":"icon"}] (exactly 4, first is Home),"rewardsTitle":"max 3 words"}}
Every "icon" value must be one of: ${ICONS.join(', ')}.
Products must match the business exactly (a cookie shop lists actual cookies with prices; an HVAC company lists services like AC repair). Colors must suit the business and the feel, with strong contrast between text and bg.`;
}

// best-effort per-instance rate limit
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000, max = 25;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > max;
}

const clip = (v, n) => String(v ?? '').slice(0, n);

async function getToken(req) {
  if (process.env.AI_GATEWAY_API_KEY) return process.env.AI_GATEWAY_API_KEY;
  const h = req.headers['x-vercel-oidc-token'];
  if (h) return h;
  try {
    const { getVercelOidcToken } = require('@vercel/oidc');
    return await getVercelOidcToken();
  } catch (_) {}
  return process.env.VERCEL_OIDC_TOKEN || null;
}

function parseJSON(text) {
  try { return JSON.parse(text); } catch (_) {}
  const f = text.match(/```(?:json)?\s*([\s\S]*?)```/); if (f) { try { return JSON.parse(f[1]); } catch (_) {} }
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(text.slice(a, b + 1)); } catch (_) {} }
  return null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'rate_limited' });

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch (_) { return {}; } })() : (req.body || {});
  const mode = body.mode;
  let messages, maxTokens = 400, wantJSON = false;

  if (mode === 'site') {
    const kind = body.kind === 'app' ? 'app' : 'website';
    const business = clip(body.business, 160).trim();
    if (!business) return res.status(400).json({ error: 'missing_business' });
    messages = [{ role: 'user', content: sitePrompt({ business, goal: clip(body.goal, 300), feel: clip(body.feel, 40), kind }) }];
    maxTokens = 1800; wantJSON = true;
  } else if (mode === 'chat') {
    const turns = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const clean = turns.filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: clip(m.content, 1200) }));
    if (!clean.length || clean[clean.length - 1].role !== 'user') return res.status(400).json({ error: 'bad_messages' });
    messages = [{ role: 'system', content: CHAT_RULES }, ...clean];
  } else if (mode === 'summary') {
    messages = [{ role: 'system', content: CHAT_RULES },
      { role: 'user', content: `Write a 3-sentence, friendly summary of this person's idea and what OmniThynk would build first, in plain language with no jargon. Plain text, no greeting.\n\n${clip(body.brief, 1500)}` }];
    maxTokens = 250;
  } else {
    return res.status(400).json({ error: 'unknown_mode' });
  }

  const token = await getToken(req);
  if (!token) return res.status(503).json({ error: 'ai_not_configured' });

  try {
    const r = await fetch(GATEWAY, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature: wantJSON ? 0.8 : 0.6 })
    });
    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300);
      console.error('gateway_error', r.status, detail);
      return res.status(502).json({ error: 'gateway_error', status: r.status, detail: detail.slice(0, 220) });
    }
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content || '';
    if (!wantJSON) return res.status(200).json({ text: text.trim() });
    const data = parseJSON(text);
    if (!data || !Array.isArray(data.products)) return res.status(502).json({ error: 'bad_json' });
    return res.status(200).json({ data });
  } catch (e) {
    console.error('ai_failure', e && e.message);
    return res.status(502).json({ error: 'ai_failure' });
  }
};
