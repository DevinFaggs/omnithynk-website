(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sb = window.supabase.createClient('https://zksudmrnpebscnoztcai.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprc3VkbXJucGVic2Nub3p0Y2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzcwMTMsImV4cCI6MjEwNzk1MzAxM30.MynAEK0g4GBFsHkNYR7AIYiJ7Ga7Ug6PBSyIS5S0fqI',
    { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'implicit' } });
  const views = ['v-login', 'v-denied', 'v-app'];
  const show = v => views.forEach(x => ($(x).hidden = x !== v));
  let me = null, settings = {}, quotes = [], filter = 'all';
  const say = (id, text, ok) => { const el = $(id); el.textContent = text; el.className = ok ? 'msg-ok' : 'msg-err'; if (ok) setTimeout(() => (el.textContent = ''), 3000); };

  /* ---------- auth ---------- */
  $('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('l-email').value.trim().toLowerCase(), st = $('l-status');
    $('l-go').disabled = true; st.className = 'status'; st.textContent = 'Sending…';
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + '/admin' } });
    $('l-go').disabled = false;
    if (error) { st.className = 'status err'; st.textContent = /rate|seconds/i.test(error.message) ? 'Please wait a minute before requesting another link.' : 'Could not send the link: ' + error.message; return; }
    st.className = 'status ok'; st.textContent = 'Check your inbox for a sign-in link from Supabase. It can take a minute. Open it on this device.';
  });
  async function signOut() { await sb.auth.signOut(); me = null; $('who').hidden = true; show('v-login'); }
  $('signout').onclick = signOut; $('denied-out').onclick = signOut;

  async function onSession(session) {
    if (!session) { $('who').hidden = true; show('v-login'); return; }
    me = session.user.email.toLowerCase();
    $('who-email').textContent = me; $('who').hidden = false;
    const { data: ok, error } = await sb.rpc('is_admin');
    if (error || !ok) { $('denied-email').textContent = me; show('v-denied'); return; }
    show('v-app'); loadAll();
  }
  sb.auth.onAuthStateChange((_ev, session) => { if (_ev === 'INITIAL_SESSION' || _ev === 'SIGNED_IN' || _ev === 'SIGNED_OUT') onSession(session); });

  /* ---------- tabs ---------- */
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-pressed', x === b));
    ['quotes', 'contact', 'pricing', 'admins'].forEach(t => ($('t-' + t).hidden = t !== b.dataset.tab));
  }));

  async function loadAll() { await Promise.all([loadSettings(), loadQuotes(), loadAdmins()]); }

  /* ---------- quotes ---------- */
  const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];
  ['all', ...STATUSES].forEach(s => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = s[0].toUpperCase() + s.slice(1); b.setAttribute('aria-pressed', s === filter); b.onclick = () => { filter = s; [...$('q-filter').children].forEach(x => x.setAttribute('aria-pressed', x === b)); renderQuotes(); }; $('q-filter').appendChild(b); });
  async function loadQuotes() {
    const { data, error } = await sb.from('quotes').select('*').order('created_at', { ascending: false }).limit(500);
    if (error) { $('q-list').innerHTML = `<p class="empty">Could not load requests: ${esc(error.message)}</p>`; return; }
    quotes = data || []; renderQuotes();
  }
  function renderQuotes() {
    const list = quotes.filter(q => filter === 'all' || q.status === filter);
    if (!list.length) { $('q-list').innerHTML = `<p class="empty">${quotes.length ? 'No requests with this status.' : 'No quote requests yet. They will show up here the moment someone sends one.'}</p>`; return; }
    $('q-list').innerHTML = list.map(q => {
      const d = new Date(q.created_at), est = q.estimate || {};
      const rows = [['Email', `<a href="mailto:${esc(q.email)}">${esc(q.email)}</a>`], ['Phone', esc(q.phone || '—')], ['Business', esc(q.business || '—')], ['Wants', esc(q.project_type || '—')],
        ['Features', esc((q.features || []).join(', ') || '—')], ['Needed by', esc(q.timeline || '—')], ['Budget', esc(q.budget || '—')],
        ['Estimate they saw', est.tier ? esc(`${est.tier} package, ${est.weeks || ''}`) : '—'],
        ['Their design', q.concept_id ? `<a href="/concept?c=${encodeURIComponent(q.concept_id)}" target="_blank" rel="noopener">Open design</a>` : '—'],
        ['Details', esc(q.details || '—')]];
      return `<article class="card q" data-id="${q.id}">
        <div class="q-head"><div><h3>${esc(q.name)}</h3><small>${d.toLocaleString()} · ${q.email_sent ? '<span class="badge ok">Emailed</span>' : '<span class="badge warn">Not emailed</span>'}</small></div>
        <div class="row-actions"><label class="sr" for="st-${q.id}">Status</label><select id="st-${q.id}" data-act="status" style="width:auto">${STATUSES.map(s => `<option value="${s}" ${s === q.status ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select></div></div>
        <dl>${rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl>
        <div class="field"><label for="nt-${q.id}">Private notes</label><textarea id="nt-${q.id}" data-act="notes">${esc(q.notes || '')}</textarea></div>
        <div class="row-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="save-notes">Save notes</button><button type="button" class="btn btn-sm btn-danger" data-act="delete">Delete</button><span class="q-msg" aria-live="polite"></span></div>
      </article>`;
    }).join('');
  }
  $('q-list').addEventListener('change', async e => {
    if (e.target.dataset.act !== 'status') return;
    const card = e.target.closest('[data-id]'), id = card.dataset.id;
    const { error } = await sb.from('quotes').update({ status: e.target.value }).eq('id', id);
    const m = card.querySelector('.q-msg'); m.textContent = error ? 'Could not save' : 'Status saved'; m.className = 'q-msg ' + (error ? 'msg-err' : 'msg-ok');
    if (!error) { const q = quotes.find(x => x.id === id); q.status = e.target.value; }
  });
  $('q-list').addEventListener('click', async e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const card = b.closest('[data-id]'), id = card.dataset.id, m = card.querySelector('.q-msg');
    if (b.dataset.act === 'save-notes') {
      const notes = card.querySelector('textarea').value;
      const { error } = await sb.from('quotes').update({ notes }).eq('id', id);
      m.textContent = error ? 'Could not save' : 'Notes saved'; m.className = 'q-msg ' + (error ? 'msg-err' : 'msg-ok');
      if (!error) quotes.find(x => x.id === id).notes = notes;
    } else if (b.dataset.act === 'delete') {
      if (b.dataset.confirm !== '1') { b.dataset.confirm = '1'; b.textContent = 'Click again to delete'; setTimeout(() => { b.dataset.confirm = ''; b.textContent = 'Delete'; }, 4000); return; }
      const { error } = await sb.from('quotes').delete().eq('id', id);
      if (error) { m.textContent = 'Could not delete'; m.className = 'q-msg msg-err'; return; }
      quotes = quotes.filter(x => x.id !== id); renderQuotes();
    }
  });
  $('q-refresh').onclick = loadQuotes;
  $('q-csv').onclick = () => {
    const cols = ['created_at', 'status', 'name', 'email', 'phone', 'business', 'project_type', 'features', 'timeline', 'budget', 'details', 'concept_id', 'notes'];
    const cell = v => `"${String(Array.isArray(v) ? v.join('; ') : v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...quotes.map(q => cols.map(c => cell(q[c])).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'omnithynk-quote-requests.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  /* ---------- settings ---------- */
  async function loadSettings() {
    const { data } = await sb.from('settings').select('key,value');
    (data || []).forEach(r => { settings[r.key] = r.value; });
    const c = settings.contact || {};
    $('s-quote').value = c.quote_email || ''; $('s-display').value = c.display_email || ''; $('s-phone').value = c.phone || '';
    $('s-li').value = c.linkedin || ''; $('s-ig').value = c.instagram || ''; $('s-fb').value = c.facebook || '';
    const p = settings.pricing || { types: [], tiers: [] };
    $('p-types').innerHTML = (p.types || []).map((t, i) => `<tr><td><label class="sr" for="pt-l-${i}">Label</label><input id="pt-l-${i}" data-i="${i}" data-f="label" value="${esc(t.label)}"></td><td><label class="sr" for="pt-w-${i}">Timeline</label><input id="pt-w-${i}" data-i="${i}" data-f="weeks" value="${esc(t.weeks)}"></td><td><label class="sr" for="pt-p-${i}">Price</label><input id="pt-p-${i}" data-i="${i}" data-f="price" value="${esc(t.price)}" placeholder="e.g. $2,500"></td></tr>`).join('');
    $('p-tiers').innerHTML = (p.tiers || []).map((t, i) => `<tr><td><label class="sr" for="tt-l-${i}">Package</label><input id="tt-l-${i}" data-i="${i}" data-f="label" value="${esc(t.label)}"></td><td><label class="sr" for="tt-d-${i}">Description</label><input id="tt-d-${i}" data-i="${i}" data-f="desc" value="${esc(t.desc)}"></td><td><label class="sr" for="tt-p-${i}">Price</label><input id="tt-p-${i}" data-i="${i}" data-f="price" value="${esc(t.price)}" placeholder="e.g. $1,500"></td></tr>`).join('');
    $('p-note').value = p.note || '';
  }
  async function saveSetting(key, value, msgId) {
    const { data, error } = await sb.from('settings').update({ value, updated_at: new Date().toISOString(), updated_by: me }).eq('key', key).select();
    if (error || !data || !data.length) { say(msgId, 'Could not save: ' + (error ? error.message : 'not allowed')); return false; }
    settings[key] = value; say(msgId, 'Saved. The website shows it right away.', true); return true;
  }
  $('t-contact').addEventListener('submit', e => {
    e.preventDefault();
    const url = v => { v = v.trim(); return !v || /^https?:\/\//i.test(v) ? v : 'https://' + v; };
    const v = Object.assign({}, settings.contact, { quote_email: $('s-quote').value.trim().toLowerCase(), display_email: $('s-display').value.trim(), phone: $('s-phone').value.trim(), linkedin: url($('s-li').value), instagram: url($('s-ig').value), facebook: url($('s-fb').value) });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.quote_email)) { say('c-msg', 'Please enter a valid email for quote requests.'); return; }
    saveSetting('contact', v, 'c-msg');
  });
  $('t-pricing').addEventListener('submit', e => {
    e.preventDefault();
    const p = JSON.parse(JSON.stringify(settings.pricing || {}));
    document.querySelectorAll('#p-types input').forEach(inp => { p.types[+inp.dataset.i][inp.dataset.f] = inp.value.trim(); });
    document.querySelectorAll('#p-tiers input').forEach(inp => { p.tiers[+inp.dataset.i][inp.dataset.f] = inp.value.trim(); });
    p.note = $('p-note').value.trim();
    saveSetting('pricing', p, 'p-msg');
  });

  /* ---------- admins ---------- */
  async function loadAdmins() {
    const { data, error } = await sb.from('admins').select('email,added_at').order('added_at');
    if (error) { $('a-list').innerHTML = `<li>Could not load admins</li>`; return; }
    $('a-list').innerHTML = (data || []).map(a => `<li><span>${esc(a.email)}${a.email === me ? ' <span class="badge">You</span>' : ''}</span>${a.email === me ? '' : `<button type="button" class="btn btn-sm btn-danger" data-rm="${esc(a.email)}">Remove</button>`}</li>`).join('');
  }
  $('a-list').addEventListener('click', async e => {
    const b = e.target.closest('[data-rm]'); if (!b) return;
    if (b.dataset.confirm !== '1') { b.dataset.confirm = '1'; b.textContent = 'Click again to remove'; setTimeout(() => { b.dataset.confirm = ''; b.textContent = 'Remove'; }, 4000); return; }
    const { error } = await sb.from('admins').delete().eq('email', b.dataset.rm);
    if (error) say('a-msg', 'Could not remove: ' + error.message); else { say('a-msg', 'Removed.', true); loadAdmins(); }
  });
  $('a-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('a-email').value.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { say('a-msg', 'Please enter a valid email.'); return; }
    const { error } = await sb.from('admins').insert({ email });
    if (error) say('a-msg', /duplicate/i.test(error.message) ? 'Already an admin.' : 'Could not add: ' + error.message);
    else { $('a-email').value = ''; say('a-msg', 'Added. They can sign in now.', true); loadAdmins(); }
  });
})();
