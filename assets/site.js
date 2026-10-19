(function () {
  const $ = id => document.getElementById(id);
  const M = window.OmniMockup;
  const SB = 'https://zksudmrnpebscnoztcai.supabase.co';
  const SBKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprc3VkbXJucGVic2Nub3p0Y2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzcwMTMsImV4cCI6MjEwNzk1MzAxM30.MynAEK0g4GBFsHkNYR7AIYiJ7Ga7Ug6PBSyIS5S0fqI';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const domain = n => (String(n).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '').slice(0, 22) || 'yourbusiness') + '.com';
  const W = (name, size) => M.icon(name, size || 20, '#fff', 1.9);
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));

  async function ai(mode, payload, timeoutMs) {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeoutMs || 30000);
    try {
      const r = await fetch('/api/ai', { method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ mode }, payload)) });
      let j = {}; try { j = await r.json(); } catch (_) {}
      if (!r.ok) throw Object.assign(new Error(j.error || 'ai_error'), { code: j.error || r.status });
      return j;
    } finally { clearTimeout(t); }
  }
  async function rpc(fn, args) {
    const r = await fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: SBKEY, Authorization: `Bearer ${SBKEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(args) });
    if (!r.ok) throw new Error('db_' + r.status);
    return r.json();
  }

  /* ---------- settings (editable on /admin) ---------- */
  let SETTINGS = {
    contact: { display_email: 'omnithynk@gmail.com', phone: '+1 (513) 497-0420', linkedin: '', instagram: '', facebook: '' },
    pricing: {
      note: 'Every project is different. Timelines depend on scope and complexity, and you get an exact quote before any work starts.',
      types: [{ id: 'website', label: 'Website', weeks: '2–4 weeks', price: '' }, { id: 'store', label: 'Online store', weeks: '3–6 weeks', price: '' }, { id: 'app', label: 'Mobile app', weeks: '8–14 weeks', price: '' }, { id: 'ai', label: 'AI helper', weeks: '2–5 weeks', price: '' }, { id: 'tool', label: 'Business tool or dashboard', weeks: '4–8 weeks', price: '' }, { id: 'unsure', label: 'Not sure yet', weeks: 'We will map it out together', price: '' }],
      tiers: [{ id: 'starter', label: 'Starter', desc: 'A focused first version with the essentials, launched fast.', price: '' }, { id: 'growth', label: 'Growth', desc: 'More pages and features, like bookings, payments or an AI helper.', price: '' }, { id: 'custom', label: 'Custom', desc: 'Bigger builds, apps and integrations, scoped together with you.', price: '' }]
    }
  };
  async function loadSettings() {
    try {
      const r = await fetch(`${SB}/rest/v1/settings?select=key,value`, { headers: { apikey: SBKEY, Authorization: `Bearer ${SBKEY}` } });
      if (!r.ok) return;
      (await r.json()).forEach(row => { SETTINGS[row.key] = Object.assign({}, SETTINGS[row.key], row.value); });
    } catch (_) {}
    applySettings();
  }
  function applySettings() {
    const c = SETTINGS.contact;
    if (c.phone) $('c-phone').textContent = c.phone;
    if (c.display_email) $('c-email').textContent = c.display_email;
    [['f-li', c.linkedin], ['f-ig', c.instagram], ['f-fb', c.facebook]].forEach(([id, url]) => { const a = $(id); if (url && /^https?:\/\//.test(url)) { a.href = url; a.hidden = false; a.target = '_blank'; a.rel = 'noopener'; } else a.hidden = true; });
    buildEstimator(); buildQuoteOptions(); renderEstimate();
  }

  /* ---------- screen scaling ---------- */
  const store = new WeakMap();
  const ro = new ResizeObserver(es => es.forEach(e => {
    const el = e.target, w = e.contentRect.width;
    if (w) el.style.fontSize = (w / (el.dataset.fit === 'app' ? 23.5 : 64)) + 'px';
  }));
  function fit(el, kind) { el.dataset.fit = kind; ro.observe(el); }
  function showSite(el, data, build) { store.set(el, { data, kind: 'site' }); el.innerHTML = M.renderSite(data); if (build) animateBuild(el); }
  function showApp(el, data, screen, build) { store.set(el, { data, kind: 'app' }); el.innerHTML = M.renderApp(data, screen || 0); if (build) animateBuild(el); }
  function animateBuild(el) { if (reduce) return; el.classList.remove('building'); void el.offsetWidth; el.classList.add('building'); setTimeout(() => el.classList.remove('building'), 2200); }
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.mk-app [data-screen]'); if (!b) return;
    const scr = b.closest('.screen'), st = store.get(scr); if (!st) return;
    showApp(scr, st.data, +b.dataset.screen); if (scr === demoApp) { demo.screen = +b.dataset.screen; if (editing) setEditable(true); }
  });

  /* ---------- cursor glow + magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    const g = document.querySelector('.cursor-glow'); let gx = -999, gy = -999, raf = 0;
    window.addEventListener('pointermove', e => { gx = e.clientX; gy = e.clientY; if (!raf) raf = requestAnimationFrame(() => { g.style.transform = `translate(${gx}px,${gy}px)`; raf = 0; }); }, { passive: true });
    document.addEventListener('pointermove', e => { const m = e.target.closest && e.target.closest('.mag'); if (!m) return; const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px,${(e.clientY - r.top - r.height / 2) * .22}px)`; }, { passive: true });
    document.addEventListener('pointerout', e => { const m = e.target.closest && e.target.closest('.mag'); if (m && !m.contains(e.relatedTarget)) m.style.transform = ''; });
  }

  /* ---------- hero network ---------- */
  (function () {
    const cv = $('net'), ctx = cv.getContext('2d'), hero = document.querySelector('.hero');
    let Wd = 0, H = 0, nodes = [], pulses = [], mouse = { x: -9999, y: -9999, on: false }, run = true;
    function resize() {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      Wd = r.width; H = r.height; cv.width = Wd * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(90, Math.max(30, Wd * H / 16000)));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * Wd, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: 1 + Math.random() * 1.8 }));
      if (reduce) draw();
    }
    const L = 130;
    function draw() {
      ctx.clearRect(0, 0, Wd, H);
      for (const p of nodes) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > Wd) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
        if (mouse.on) { const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy); if (d < 200 && d > 1) { p.x += dx / d * .5; p.y += dy / d * .5; } }
      }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < L * L) {
          const dd = Math.sqrt(d2), near = mouse.on && Math.hypot(mouse.x - (a.x + b.x) / 2, mouse.y - (a.y + b.y) / 2) < 170;
          ctx.strokeStyle = near ? `rgba(167,139,250,${.7 * (1 - dd / L)})` : `rgba(150,140,255,${.18 * (1 - dd / L)})`;
          ctx.lineWidth = near ? 1.2 : .8; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if (!reduce && Math.random() < (near ? .004 : .0005) && pulses.length < 30) pulses.push({ a, b, t: 0 });
        }
      }
      for (const p of nodes) { ctx.fillStyle = 'rgba(200,190,255,.6)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const s = pulses[k]; s.t += .025; if (s.t >= 1) { pulses.splice(k, 1); continue; }
        const c = k % 2 ? '#A78BFA' : '#22D3EE'; ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(s.a.x + (s.b.x - s.a.x) * s.t, s.a.y + (s.b.y - s.a.y) * s.t, 2.3, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
      }
    }
    function loop() { if (run) draw(); requestAnimationFrame(loop); }
    hero.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true; });
    hero.addEventListener('pointerleave', () => { mouse.on = false; });
    new ResizeObserver(resize).observe(hero); resize();
    if (!reduce) { new IntersectionObserver(es => { run = es[0].isIntersecting; }).observe(hero); requestAnimationFrame(loop); }
  })();

  /* ---------- hero devices ---------- */
  const HERO_ORDER = ['cookie', 'salon', 'hvac', 'fitness', 'restaurant', 'church', 'realestate', 'pets'];
  const heroSite = $('hero-site'), heroApp = $('hero-app'); fit(heroSite, 'site'); fit(heroApp, 'app');
  let hi = 0, heroVisible = true;
  function heroShow() { const d = M.PRESETS[HERO_ORDER[hi]]; showSite(heroSite, d); showApp(heroApp, d, 0); $('hero-url').textContent = domain(d.name); $('hero-caption').textContent = 'Example: ' + d.name; }
  heroShow();
  if (!reduce) {
    new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }).observe($('hero-stage'));
    setInterval(() => { if (heroVisible && !document.hidden) { hi = (hi + 1) % HERO_ORDER.length; heroShow(); } }, 6000);
    const stage = $('hero-stage'), hb = $('hero-browser'), hp = $('hero-phone');
    stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; hb.style.transform = `rotateY(${x * 8 - 6}deg) rotateX(${-y * 6 + 2}deg)`; hp.style.transform = `translateZ(60px) rotateY(${x * 12 - 8}deg) rotateX(${-y * 8}deg)`; });
    stage.addEventListener('pointerleave', () => { hb.style.transform = ''; hp.style.transform = ''; });
  }

  /* ---------- live demo: instant template, then AI personalizes ---------- */
  let editing = false;
  const demo = { kind: 'website', feel: '', data: M.full(M.PRESETS.cookie), screen: 0, busy: false, conceptId: null, run: 0 };
  const demoSite = $('demo-site'), demoApp = $('demo-app'); fit(demoSite, 'site'); fit(demoApp, 'app');
  function demoRender(build) {
    const isApp = demo.kind === 'app';
    $('demo-browser').hidden = isApp; $('demo-phone').hidden = !isApp;
    $('demo-note').textContent = isApp ? 'Tap the icons at the bottom of the phone to switch screens.' : 'Scroll inside the screen to explore the whole page.';
    if (isApp) showApp(demoApp, demo.data, demo.screen, build); else { showSite(demoSite, demo.data, build); if (build) demoSite.scrollTop = 0; }
    $('demo-url').textContent = domain(demo.data.name);
    if (editing) setEditable(true);
    markTheme();
  }
  function setDesign(d, build) { demo.data = M.full(d); demo.conceptId = null; demo.screen = 0; demoRender(build); }
  demoRender(false);
  document.querySelectorAll('#demo-form .seg-b').forEach(b => b.addEventListener('click', () => {
    demo.kind = b.dataset.kind; demo.screen = 0; demo.conceptId = null;
    document.querySelectorAll('#demo-form .seg-b').forEach(x => x.setAttribute('aria-pressed', x === b));
    demoRender(true);
  }));
  document.querySelectorAll('#d-feel .chip').forEach(c => c.addEventListener('click', () => { demo.feel = c.dataset.v; document.querySelectorAll('#d-feel .chip').forEach(x => x.setAttribute('aria-pressed', x === c)); }));
  const PRESET_LABELS = [['cookie', 'Cookie shop'], ['hvac', 'HVAC company'], ['salon', 'Hair salon'], ['fitness', 'Fitness coach'], ['restaurant', 'Restaurant'], ['realestate', 'Real estate'], ['church', 'Church'], ['foodtruck', 'Food truck']];
  PRESET_LABELS.forEach(([k, label]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = label; b.addEventListener('click', () => loadPreset(k, label)); $('d-presets').appendChild(b); });

  const STEPS = ['Reading your idea…', 'Picking your colors…', 'Writing your headlines…', 'Designing your products…', 'Building the layout…'];
  let genTimer;
  function genOn() { const g = $('gen'); g.hidden = false; let i = 0; $('gen-step').textContent = STEPS[0]; clearInterval(genTimer); genTimer = setInterval(() => { i = Math.min(i + 1, STEPS.length - 1); $('gen-step').textContent = STEPS[i]; }, 700); }
  function genOff() { clearInterval(genTimer); $('gen').hidden = true; }
  const status = (t, cls) => { const s = $('d-status'); s.innerHTML = t || ''; s.className = 'status' + (cls ? ' ' + cls : ''); };

  async function loadPreset(k, label) {
    $('d-biz').value = label; $('d-goal').value = '';
    genOn(); status(''); await wait(1200); genOff();
    setDesign(M.PRESETS[k], true); status('Here is an example we designed for a ' + esc(label.toLowerCase()) + '. Try the colors and styles below, or edit the words.');
  }
  async function generate() {
    const business = $('d-biz').value.trim();
    if (!business) { status('Tell us your business or idea first.', 'err'); $('d-biz').focus(); return; }
    const run = ++demo.run; demo.busy = true; $('d-go').disabled = true; status('');
    const goal = $('d-goal').value.trim();
    genOn(); await wait(1300); genOff();
    const inst = M.instant(business, goal, demo.feel);
    setDesign(inst.data, true);
    status('<span class="pulse-dot"></span> Your instant draft is ready. Personalizing it with AI…', 'live');
    try {
      const { data } = await ai('site', { business, goal, feel: demo.feel || 'Modern and friendly', kind: demo.kind }, 28000);
      if (run !== demo.run) return;
      setDesign(data, true);
      status('✦ Personalized by AI for ' + esc(M.normalize(data).name) + '. Customize it below.', 'ok');
    } catch (e) {
      if (run !== demo.run) return;
      status('Your instant draft is ready. Change the colors, style or words below to make it yours.');
    } finally { if (run === demo.run) { demo.busy = false; $('d-go').disabled = false; } }
  }
  $('demo-form').addEventListener('submit', e => { e.preventDefault(); generate(); });
  function sendToDemo(text, kind) {
    $('d-biz').value = text; $('d-goal').value = '';
    const k = kind || (/\b(app|mobile|phone|iphone|android)\b/i.test(text) ? 'app' : 'website');
    demo.kind = k; demo.screen = 0;
    document.querySelectorAll('#demo-form .seg-b').forEach(x => x.setAttribute('aria-pressed', x.dataset.kind === k));
    $('demo').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  $('hero-form').addEventListener('submit', e => { e.preventDefault(); const v = $('hero-idea').value.trim(); if (!v) { $('hero-idea').focus(); return; } sendToDemo(v); setTimeout(generate, reduce ? 0 : 450); });
  $('ideas-form').addEventListener('submit', e => { e.preventDefault(); const v = $('ideas-input').value.trim(); if (!v) { $('ideas-input').focus(); return; } sendToDemo(v); setTimeout(generate, reduce ? 0 : 450); });
  const PH = ['An online store for my cookie shop', 'A booking app for my hair salon', 'A website for my HVAC company', 'A workout app for my clients', 'An app for our church', 'A website for my dental office'];
  if (!reduce) { let p = 0; setInterval(() => { const el = $('hero-idea'); if (document.activeElement !== el && !el.value) { p = (p + 1) % PH.length; el.placeholder = PH[p]; } }, 3200); }

  /* ---------- live editor ---------- */
  Object.entries(M.THEMES).forEach(([k, t]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'sw'; b.dataset.theme = k; b.title = t.label; b.setAttribute('aria-label', t.label + ' colors');
    b.style.background = `linear-gradient(135deg, ${t.palette.accent} 0 50%, ${t.palette.accent2} 50% 100%)`;
    b.addEventListener('click', () => { demo.data.palette = Object.assign({}, t.palette); demo.conceptId = null; demoRender(false); });
    $('ed-colors').appendChild(b);
  });
  [['warm', 'Friendly'], ['bold', 'Bold'], ['elegant', 'Elegant'], ['playful', 'Playful'], ['clean', 'Clean']].forEach(([k, l]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.dataset.style = k; b.textContent = l;
    b.addEventListener('click', () => { demo.data.style = k; demo.conceptId = null; demoRender(false); });
    $('ed-style').appendChild(b);
  });
  function markTheme() {
    document.querySelectorAll('#ed-style .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.style === demo.data.style));
    document.querySelectorAll('#ed-colors .sw').forEach(s => s.setAttribute('aria-pressed', M.THEMES[s.dataset.theme].palette.accent.toLowerCase() === String(demo.data.palette.accent).toLowerCase()));
  }
  function setPath(obj, path, val) { const ks = path.split('.'); let o = obj; ks.slice(0, -1).forEach(k => { if (o[k] == null) o[k] = {}; o = o[k]; }); o[ks[ks.length - 1]] = val; }
  function setEditable(on) {
    const root = demo.kind === 'app' ? demoApp : demoSite;
    root.querySelectorAll('[data-edit]').forEach(el => { if (on) { el.contentEditable = 'plaintext-only'; if (el.contentEditable !== 'plaintext-only') el.contentEditable = 'true'; el.spellcheck = false; } else el.removeAttribute('contenteditable'); });
    root.classList.toggle('editing', on);
  }
  demoSite.addEventListener('input', onEdit); demoApp.addEventListener('input', onEdit);
  function onEdit(e) { const el = e.target.closest('[data-edit]'); if (!el) return; setPath(demo.data, el.dataset.edit, el.textContent.slice(0, 200)); demo.conceptId = null; if (el.dataset.edit === 'name') $('demo-url').textContent = domain(el.textContent); }
  [demoSite, demoApp].forEach(r => r.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.closest && e.target.closest('[data-edit]')) { e.preventDefault(); e.target.blur(); } }));
  $('ed-text').addEventListener('click', () => { editing = !editing; $('ed-text').setAttribute('aria-pressed', editing); $('ed-hint').hidden = !editing; setEditable(editing); });

  /* ---------- share + QR ---------- */
  async function saveConcept() {
    if (demo.conceptId) return demo.conceptId;
    demo.conceptId = await rpc('save_concept', { p_kind: demo.kind === 'app' ? 'app' : 'website', p_data: demo.data });
    return demo.conceptId;
  }
  const conceptUrl = id => `${location.origin}/concept?c=${encodeURIComponent(id)}${demo.kind === 'app' ? '&v=app' : ''}`;
  let qrLoaded = null;
  function loadQR() { if (qrLoaded) return qrLoaded; qrLoaded = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@2.0.4/dist/qrcode.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); return qrLoaded; }
  let lastFocus = null;
  async function openShare(phone) {
    const btn = phone ? $('ed-phone') : $('ed-share'); const label = btn.textContent; btn.textContent = 'Saving…'; btn.disabled = true;
    try {
      const id = await saveConcept(); const url = conceptUrl(id);
      $('share-title').textContent = phone ? 'Open it on your phone' : 'Your design is saved';
      $('share-sub').textContent = phone ? 'Point your phone’s camera at this code and tap the link that appears.' : 'Copy the link to share it, or scan the code with your phone.';
      $('share-url').textContent = url; $('share-copy').dataset.copy = url;
      $('share-qr').innerHTML = '<span class="fine">Making your code…</span>';
      lastFocus = document.activeElement; $('share-modal').hidden = false; $('share-x').focus();
      try { await loadQR(); const q = window.qrcode(0, 'M'); q.addData(url); q.make(); $('share-qr').innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); }
      catch (_) { $('share-qr').innerHTML = '<span class="fine">Could not draw the code. Use the link below.</span>'; }
    } catch (_) { status('We could not save your design just now. Please try again in a moment.', 'err'); }
    finally { btn.textContent = label; btn.disabled = false; }
  }
  function closeShare() { $('share-modal').hidden = true; if (lastFocus) lastFocus.focus(); }
  $('ed-share').addEventListener('click', () => openShare(false));
  $('ed-phone').addEventListener('click', () => openShare(true));
  $('share-x').addEventListener('click', closeShare);
  $('share-modal').addEventListener('click', e => { if (e.target === $('share-modal')) closeShare(); });
  $('ed-quote').addEventListener('click', async () => {
    const b = $('ed-quote'); b.disabled = true;
    try { const id = await saveConcept(); attachConcept(id, demo.data.name); } catch (_) { attachConcept(null, demo.data.name); }
    finally { b.disabled = false; }
    const k = demo.kind === 'app' ? 'app' : 'website'; $('q-type').value = k; if (!$('q-biz').value) $('q-biz').value = demo.data.name;
    $('quote').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); setTimeout(() => $('q-name').focus({ preventScroll: true }), reduce ? 0 : 700);
  });

  /* ---------- voice input ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  document.querySelectorAll('[data-mic]').forEach(btn => {
    if (!SR) return; btn.hidden = false;
    let rec = null;
    btn.addEventListener('click', () => {
      if (rec) { rec.stop(); return; }
      const input = $(btn.dataset.mic); rec = new SR(); rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = false;
      const before = input.value ? input.value.trim() + ' ' : '';
      btn.classList.add('on'); btn.setAttribute('aria-label', 'Stop listening');
      rec.onresult = ev => { let t = ''; for (const r of ev.results) t += r[0].transcript; input.value = before + t; };
      rec.onerror = () => {}; rec.onend = () => { rec = null; btn.classList.remove('on'); btn.setAttribute('aria-label', 'Speak instead of typing'); input.focus(); };
      try { rec.start(); } catch (_) { rec = null; btn.classList.remove('on'); }
    });
  });

  /* ---------- ideas marquee ---------- */
  const IDEAS = [
    ['calendar', 'A booking app for my salon', 'app', 'salon'], ['cookie', 'An online cookie shop', 'website', 'cookie'],
    ['snowflake', 'A website for my HVAC company', 'website', 'hvac'], ['dumbbell', 'A workout app for my clients', 'app', 'fitness'],
    ['church', 'An app for our church', 'app', 'church'], ['taco', 'A food truck ordering app', 'app', 'foodtruck'],
    ['chat', 'An AI helper that answers my customers', 'chat', null], ['home', 'A real estate listings site', 'website', 'realestate'],
    ['paw', 'A pet grooming booking app', 'app', 'pets'], ['tooth', 'A website for my dental office', 'website', 'dental'],
    ['book', 'A tutoring app for students', 'app', 'tutoring'], ['leaf', 'A landscaping company website', 'website', 'landscaping'],
    ['shirt', 'A boutique clothing store', 'website', 'boutique'], ['scissors', 'A barbershop app with rewards', 'app', 'barber'],
    ['camera', 'A wedding photographer portfolio', 'website', 'photo'], ['coffee', 'A coffee shop loyalty app', 'app', 'coffee']
  ];
  function pill(it, hidden) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'pill-idea'; if (hidden) b.tabIndex = -1;
    b.innerHTML = `<span class="ic">${W(it[0], 18)}</span>${esc(it[1])}<small>${it[2] === 'app' ? 'App' : it[2] === 'chat' ? 'AI helper' : 'Website'}</small>`;
    b.addEventListener('click', () => pickIdea(it)); return b;
  }
  function fillMarquee(id, items) { const m = $(id); [false, true].forEach(h => { const t = document.createElement('div'); t.className = 'track'; if (h) t.setAttribute('aria-hidden', 'true'); items.forEach(it => t.appendChild(pill(it, h))); m.appendChild(t); }); }
  fillMarquee('marquee-1', IDEAS.slice(0, 8)); fillMarquee('marquee-2', IDEAS.slice(8));
  async function pickIdea(it) {
    if (it[2] === 'chat') { openChat(); askChat('Can you build an AI helper that answers my customers? What would it do?'); return; }
    sendToDemo(it[1], it[2]); await wait(400);
    genOn(); await wait(1200); genOff();
    setDesign(M.PRESETS[it[3]], true);
    status('Here is an example for: ' + esc(it[1]) + '. Try the colors and styles below, or type your own idea above.');
  }

  /* ---------- what we build ---------- */
  const SHOW = [
    { t: 'Websites', d: 'A website that looks great, loads fast and brings you customers.', pw: 'OmniLaunch', kind: 'site', preset: 'hvac' },
    { t: 'Mobile apps', d: 'Your own app on iPhone and Android, with bookings, orders and rewards.', pw: 'OmniLaunch', kind: 'app', preset: 'fitness' },
    { t: 'Online stores', d: 'Sell your products online and get paid easily, any time of day.', pw: 'OmniLaunch', kind: 'site', preset: 'cookie' },
    { t: 'AI helpers', d: 'A smart assistant that answers customers and handles busywork for you.', pw: 'OmniAI', kind: 'chat' },
    { t: 'Business tools', d: 'Simple tools and dashboards that replace messy spreadsheets.', pw: 'ThinkLayer', kind: 'dash' },
    { t: 'Security & care', d: 'We keep everything safe, backed up, fast and running.', pw: 'OmniSec + Smart Infrastructure', kind: 'sec' }
  ];
  const list = $('show-list'), sstage = $('show-stage');
  SHOW.forEach((s, i) => { const li = document.createElement('li'); li.innerHTML = `<button type="button"><span class="t"><span>${esc(s.t)}</span><small>0${i + 1}</small></span><span class="d">${esc(s.d)}<span class="pw">Powered by ${esc(s.pw)}</span></span></button>`; li.firstElementChild.addEventListener('click', () => { showItem(i); restartShow(); }); list.appendChild(li); });
  let si = 0, showTimer, showPaused = false, showVisible = false;
  function showItem(i) {
    si = i; [...list.children].forEach((li, j) => { li.firstElementChild.classList.toggle('on', j === i); li.firstElementChild.setAttribute('aria-pressed', j === i); });
    const s = SHOW[i];
    if (s.kind === 'site') {
      sstage.innerHTML = `<div class="dev-browser"><div class="bar"><i></i><i></i><i></i><span class="url">${esc(domain(M.PRESETS[s.preset].name))}</span></div><div class="screen"></div></div>`;
      const sc = sstage.querySelector('.screen'); fit(sc, 'site'); showSite(sc, M.PRESETS[s.preset]);
      if (s.t === 'Online stores') setTimeout(() => { const sec = sc.querySelector('.mk-sec'); if (sec) sc.scrollTop = sec.offsetTop; }, 60);
    } else if (s.kind === 'app') {
      sstage.innerHTML = `<div class="dev-phone"><div class="notch"></div><div class="screen"></div></div>`;
      const sc = sstage.querySelector('.screen'); fit(sc, 'app'); showApp(sc, M.PRESETS[s.preset], 0);
    } else if (s.kind === 'chat') {
      const msgs = [['u', 'Hi! Do you have gluten-free cookies?'], ['a', 'Yes! Our Oat Crunch and Almond Cloud are both gluten-free. Want me to save some for pickup today?'], ['u', 'Yes, 6 please. Around 3pm?'], ['a', 'Done! 6 cookies reserved for 3:00 PM. We will text you when they are ready.']];
      sstage.innerHTML = `<div class="dev-phone mock-chat"><div class="notch"></div><div class="screen">${msgs.map((m, k) => `<div class="bub ${m[0]}" style="animation-delay:${k * .9}s">${m[0] === 'a' ? '<b>AI helper</b>' : ''}${esc(m[1])}</div>`).join('')}</div></div>`;
    } else if (s.kind === 'dash') {
      const bars = [38, 52, 46, 61, 58, 74, 69, 83, 79, 92];
      sstage.innerHTML = `<div class="mock-dash"><div class="kpis"><div><span>Orders this week</span><b>248</b><em>▲ 12%</em></div><div><span>Revenue</span><b>$6,940</b><em>▲ 8%</em></div><div><span>Hours saved</span><b>31</b><em>▲ new</em></div></div><div class="bars">${bars.map((h, k) => `<i style="height:${h}%;animation-delay:${k * .06}s"></i>`).join('')}</div><div class="cap"><span>Example dashboard</span><span>Last 10 weeks</span></div></div>`;
    } else {
      sstage.innerHTML = `<div class="mock-sec"><span class="ring"></span><span class="ring"></span><div class="core">${W('shield', 64)}</div><div class="checks">${['Backups complete', 'Payments protected', 'No threats found'].map((c, k) => `<span style="animation-delay:${.4 + k * .6}s">${M.icon('check', 16, '#34E5D8', 2.4)} ${c}</span>`).join('')}</div></div>`;
    }
  }
  function restartShow() { clearInterval(showTimer); if (reduce) return; showTimer = setInterval(() => { if (!showPaused && showVisible && !document.hidden) showItem((si + 1) % SHOW.length); }, 5000); }
  const showEl = document.querySelector('.show');
  showEl.addEventListener('pointerenter', () => { showPaused = true; list.classList.add('paused'); });
  showEl.addEventListener('pointerleave', () => { showPaused = false; list.classList.remove('paused'); });
  new IntersectionObserver(es => { showVisible = es[0].isIntersecting; }).observe(showEl);
  showItem(0); restartShow();

  /* ---------- AI helper in action ---------- */
  const STAGES = [['Comes in', 'A message arrives'], ['Understands', 'Reads it like a person would'], ['Decides', 'Checks your rules'], ['Takes care of it', 'Does the work'], ['Gets smarter', 'Learns for next time']];
  const POWER = ['Smart Infrastructure', 'OmniAI', 'OmniAI', 'ThinkLayer', 'ThinkLayer'];
  const SCEN = {
    'Customer complaint': [['A customer emails: "I was charged twice for my order."', 'from: maria@example.com\nsubject: "Charged twice for order #4471"'], ['The AI reads it, sees she is upset about billing, and pulls up her order.', 'topic: billing problem\nmood: frustrated\norder #4471: 2 charges found'], ['Your rule says double charges under $500 can be refunded right away.', 'rule: refund if under $500\nresult: approved'], ['Refund sent, a friendly apology emailed, and the issue closed.', 'refund: sent\nreply: sent\nissue: resolved'], ['It notices this happened 3 times this week and alerts your team.', 'pattern: 3rd double charge this week\naction: team alerted']],
    'New customer inquiry': [['Someone fills out the form on your website.', 'name: J. Patel\nnote: "Do you cater office lunches?"'], ['The AI understands they want catering for about 40 people.', 'need: office catering\nsize: about 40 people'], ['It picks the best next step: offer a menu and a call.', 'next step: send menu + book call'], ['A personal reply goes out and a call is booked on your calendar.', 'email: sent\ncall: booked Thursday 2:00 PM'], ['It remembers which replies turn into sales and gets better at them.', 'learning: updated']],
    'Supplier bill': [['A supplier’s bill arrives as a PDF.', 'file: invoice_8812.pdf\nfrom: Midwest Supply'], ['The AI reads every line and compares it to what you ordered.', '14 items checked\n13 match\n1 wrong quantity'], ['One item doesn’t match, so it asks a person instead of paying.', 'billed 40, received 36\nsend to: you for review'], ['You get a one-tap summary; the correct items are scheduled to be paid.', 'review: sent to you\npayment: scheduled for 13 items'], ['It keeps track of which suppliers make mistakes.', 'supplier score: updated']]
  };
  const fs = $('flow-stages'), fd = $('flow-detail'), fp = $('flow-play'), fsc = $('flow-sc');
  const fl = { sc: 'Customer complaint', i: 0, play: !reduce, t: null, vis: false };
  STAGES.forEach((s, i) => { const li = document.createElement('li'); li.innerHTML = `<button type="button" class="flow-stage"><span class="n">${i + 1}</span><span><b>${s[0]}</b><small>${s[1]}</small></span></button>`; li.firstElementChild.onclick = () => { fl.i = i; setPlay(false); flowUpdate(); }; fs.appendChild(li); });
  Object.keys(SCEN).forEach(k => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = k; b.setAttribute('aria-pressed', k === fl.sc); b.onclick = () => { fl.sc = k; fl.i = 0; [...fsc.children].forEach(c => c.setAttribute('aria-pressed', c.textContent === k)); flowUpdate(); tick(); }; fsc.appendChild(b); });
  function flowUpdate() {
    [...fs.children].forEach((li, j) => { const b = li.firstElementChild; b.classList.toggle('done', j < fl.i); b.classList.toggle('cur', j === fl.i); if (j === fl.i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    const st = SCEN[fl.sc][fl.i];
    fd.innerHTML = `<span class="eyebrow">Step ${fl.i + 1} · ${STAGES[fl.i][0]} · ${esc(POWER[fl.i])}</span><p class="big-t">${esc(st[0])}</p><div><span class="eyebrow" style="font-size:12px">What the AI sees</span><div class="payload" style="margin-top:8px">${esc(st[1])}</div></div>`;
  }
  function tick() { clearTimeout(fl.t); if (!fl.play || !fl.vis) return; fl.t = setTimeout(() => { fl.i = (fl.i + 1) % STAGES.length; flowUpdate(); tick(); }, 3000); }
  function setPlay(p) { fl.play = p; fp.textContent = p ? 'Pause' : 'Play'; tick(); }
  fp.onclick = () => setPlay(!fl.play);
  new IntersectionObserver(es => { fl.vis = es[0].isIntersecting; tick(); }).observe(fs);
  flowUpdate(); if (reduce) setPlay(false);

  /* ---------- trust ---------- */
  const TRUST = [['sparkle', 'No tech skills needed', 'If you can describe it, we can build it. We ask the right questions for you.'], ['camera', 'See it before it’s built', 'You get a clickable preview first, so there are no surprises.'], ['tag', 'Clear quotes up front', 'You’ll know what it costs before any work starts.'], ['gem', 'You own what we build', 'Your website, your app and your data belong to you.'], ['shield', 'Safe and secure', 'Security is built in from day one, not added later.'], ['star', 'Experienced leadership', 'Led by a U.S. Air Force veteran with two decades managing major technology programs.']];
  $('trust-grid').innerHTML = TRUST.map(t => `<div class="tcard"><span class="ic">${W(t[0], 22)}</span><b>${esc(t[1])}</b><p>${esc(t[2])}</p></div>`).join('');

  /* ---------- project estimator (no dollar figures unless set by an admin) ---------- */
  const TYPE_ICON = { website: 'globe', store: 'bag', app: 'smile', ai: 'chat', tool: 'chart', unsure: 'sparkle' };
  const FEATURES = ['Online booking', 'Take payments', 'Product catalog', 'Customer accounts', 'AI chat helper', 'Rewards or loyalty', 'Blog or updates', 'Admin dashboard', 'Connect my current tools'];
  const TYPE_W = { website: 0, store: 1, app: 3, ai: 1, tool: 2, unsure: 1 };
  const SIZE = [['starter', 'Starter', 0], ['growing', 'Growing', 2], ['big', 'Big', 4]];
  const WHEN = [['flex', 'Flexible'], ['soon', '1–3 months'], ['asap', 'ASAP']];
  const est = { type: 'website', feats: new Set(['Online booking']), size: 'starter', when: 'flex' };
  let estBuilt = false;
  function segBtns(el, items, key) {
    el.innerHTML = ''; items.forEach(([v, l]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'seg-b'; b.textContent = l; b.dataset.v = v; b.setAttribute('aria-pressed', est[key] === v); b.onclick = () => { est[key] = v; [...el.children].forEach(x => x.setAttribute('aria-pressed', x === b)); renderEstimate(); }; el.appendChild(b); });
  }
  function buildEstimator() {
    const types = SETTINGS.pricing.types || [];
    const tg = $('est-type'); tg.innerHTML = '';
    types.forEach(t => { const b = document.createElement('button'); b.type = 'button'; b.className = 'type-card'; b.dataset.v = t.id; b.setAttribute('aria-pressed', est.type === t.id); b.innerHTML = `<span class="ic">${W(TYPE_ICON[t.id] || 'sparkle', 20)}</span><b>${esc(t.label)}</b>`; b.onclick = () => { est.type = t.id; [...tg.children].forEach(x => x.setAttribute('aria-pressed', x === b)); renderEstimate(); }; tg.appendChild(b); });
    if (!estBuilt) {
      FEATURES.forEach(f => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = f; b.setAttribute('aria-pressed', est.feats.has(f)); b.onclick = () => { est.feats.has(f) ? est.feats.delete(f) : est.feats.add(f); b.setAttribute('aria-pressed', est.feats.has(f)); renderEstimate(); }; $('est-feat').appendChild(b); });
      segBtns($('est-size'), SIZE, 'size'); segBtns($('est-when'), WHEN, 'when'); estBuilt = true;
    }
  }
  function estimate() {
    const t = (SETTINGS.pricing.types || []).find(x => x.id === est.type) || { label: 'Your project', weeks: '' };
    const score = TYPE_W[est.type] + est.feats.size + SIZE.find(s => s[0] === est.size)[2];
    const tierId = score <= 3 ? 'starter' : score <= 7 ? 'growth' : 'custom';
    const tier = (SETTINGS.pricing.tiers || []).find(x => x.id === tierId) || { label: tierId, desc: '' };
    return { type: t, tier, score, weeks: t.weeks, extra: est.feats.size >= 5 || est.size === 'big' };
  }
  function renderEstimate() {
    if (!estBuilt) return;
    const e = estimate();
    const price = e.tier.price || e.type.price;
    $('est-out').innerHTML = `
      <span class="eyebrow">Your plan</span>
      <div class="est-tier"><small>Recommended package</small><b>${esc(e.tier.label)}</b><p>${esc(e.tier.desc)}</p></div>
      <div class="est-kv"><div><small>Typical timeline</small><b>${esc(e.weeks || 'We will map it out')}</b>${e.extra ? '<em>Plus a little more for the extra features</em>' : ''}</div>
      <div><small>Price</small><b>${price ? 'Starting at ' + esc(price) : 'Exact quote after a quick chat'}</b></div></div>
      ${est.feats.size ? `<ul class="est-list">${[...est.feats].map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
      <p class="fine">${esc(SETTINGS.pricing.note || '')}</p>
      <button type="button" class="btn btn-primary mag" id="est-go">Get my exact quote →</button>`;
    $('est-go').onclick = () => {
      $('q-type').value = est.type;
      document.querySelectorAll('#q-feat .chip').forEach(c => c.setAttribute('aria-pressed', est.feats.has(c.textContent)));
      $('q-when').value = { asap: 'As soon as possible', soon: 'In 1–3 months', flex: 'Flexible' }[est.when];
      quoteEstimate = { tier: e.tier.label, weeks: e.weeks, type: e.type.label, size: est.size };
      $('quote').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); setTimeout(() => $('q-name').focus({ preventScroll: true }), reduce ? 0 : 700);
    };
  }

  /* ---------- time saver (hours only) ---------- */
  function saver() {
    const t = +$('s-team').value, h = +$('s-hrs').value, p = +$('s-pct').value / 100;
    $('o-team').textContent = t; $('o-hrs').textContent = h; $('o-pct').textContent = Math.round(p * 100) + '%';
    const wk = t * h * p; $('r-week').textContent = Math.round(wk).toLocaleString();
    const days = wk * 4.3 / 8; $('r-month').textContent = days >= 1 ? `About ${Math.round(days)} workday${Math.round(days) === 1 ? '' : 's'} a month` : 'A few hours a month';
  }
  ['s-team', 's-hrs', 's-pct'].forEach(id => $(id).addEventListener('input', saver)); saver();

  /* ---------- quote request ---------- */
  let quoteEstimate = null, quoteConcept = null;
  function buildQuoteOptions() {
    const sel = $('q-type'), cur = sel.value;
    sel.innerHTML = (SETTINGS.pricing.types || []).map(t => `<option value="${esc(t.id)}">${esc(t.label)}</option>`).join('');
    if (cur) sel.value = cur;
    if (!$('q-feat').children.length) FEATURES.forEach(f => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = f; b.setAttribute('aria-pressed', 'false'); b.onclick = () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); $('q-feat').appendChild(b); });
  }
  function attachConcept(id, name) {
    quoteConcept = id; const box = $('q-attach');
    box.hidden = false;
    box.innerHTML = `<span class="ic">${W('check', 16)}</span><div><b>Your design is attached</b><small>${esc(name || 'Your design')}${id ? ` · <a href="/concept?c=${encodeURIComponent(id)}" target="_blank" rel="noopener">view</a>` : ''}</small></div><button type="button" class="copy" id="q-detach">Remove</button>`;
    $('q-detach').onclick = () => { quoteConcept = null; box.hidden = true; };
  }
  $('quote-form').addEventListener('submit', async e => {
    e.preventDefault();
    const st = $('q-status'), name = $('q-name').value.trim(), email = $('q-email').value.trim();
    st.className = 'status';
    if (!name) { st.textContent = 'Please add your name.'; st.classList.add('err'); $('q-name').focus(); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { st.textContent = 'Please add an email we can reply to.'; st.classList.add('err'); $('q-email').focus(); return; }
    const btn = $('q-send'); btn.disabled = true; btn.textContent = 'Sending…'; st.textContent = '';
    const typeLabel = ((SETTINGS.pricing.types || []).find(t => t.id === $('q-type').value) || {}).label || $('q-type').value;
    try {
      const r = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name, email, phone: $('q-phone').value, business: $('q-biz').value, project_type: typeLabel,
        features: [...document.querySelectorAll('#q-feat .chip[aria-pressed="true"]')].map(c => c.textContent),
        size: quoteEstimate ? quoteEstimate.size : '', timeline: $('q-when').value, budget: $('q-budget').value, details: $('q-details').value,
        concept_id: quoteConcept || '', estimate: quoteEstimate, website_url: $('q-hp').value
      }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw Object.assign(new Error('fail'), { code: j.error });
      const c = SETTINGS.contact;
      $('quote-form').innerHTML = `<div class="q-done"><span class="ic big">${W('check', 30)}</span><h3>Thanks, ${esc(name.split(' ')[0])}! Your request is in.</h3><p>We'll reply to <b>${esc(email)}</b> within one business day with next steps and an exact quote.</p><p class="fine">Reference: ${esc(String(j.id || '').slice(0, 8).toUpperCase())}. Questions in the meantime? Call ${esc(c.phone)} or email ${esc(c.display_email)}.</p></div>`;
    } catch (err) {
      btn.disabled = false; btn.textContent = 'Send my request →'; st.classList.add('err');
      st.textContent = err.code === 'rate_limited' ? 'We already received a few requests from you. We will be in touch soon!' : `Something went wrong sending your request. Please try again, or email ${SETTINGS.contact.display_email}.`;
    }
  });

  /* ---------- copy ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.copy[data-copy], .copy[data-copy-from]'); if (!b) return;
    const text = b.dataset.copy || ($(b.dataset.copyFrom) || {}).textContent || '';
    const done = t => { const o = b.textContent; b.textContent = t; setTimeout(() => (b.textContent = o), 1500); };
    navigator.clipboard.writeText(text).then(() => done('Copied')).catch(() => { const el = b.dataset.copyFrom ? $(b.dataset.copyFrom) : $('share-url'); const r = document.createRange(); r.selectNodeContents(el); const g = getSelection(); g.removeAllRanges(); g.addRange(r); done('Selected'); });
  });

  /* ---------- floating chat ---------- */
  const fab = $('chat-fab'), panel = $('chat-panel'), clog = $('c-log'); let turns = [], chatBusy = false;
  function bubble(where, cls, t) { const d = document.createElement('div'); d.className = 'msg ' + cls; d.textContent = t; where.appendChild(d); where.scrollTop = where.scrollHeight; return d; }
  function openChat() { panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); setTimeout(() => $('c-input').focus(), 50); }
  function closeChat() { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus(); }
  fab.onclick = () => (panel.hidden ? openChat() : closeChat());
  $('chat-x').onclick = closeChat;
  document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (!$('share-modal').hidden) closeShare(); else if (!panel.hidden) closeChat(); });
  const OFFLINE = 'Our live assistant is getting set up. For now, the quickest way to get answers is the quote form on this page. We reply within one business day.';
  async function askChat(q) {
    if (chatBusy || !q.trim()) return; chatBusy = true; $('c-sugg').hidden = true;
    bubble(clog, 'me', q); turns.push({ role: 'user', content: q }); turns = turns.slice(-10);
    const out = bubble(clog, 'bot thinking', 'Thinking…');
    try { const { text } = await ai('chat', { messages: turns }, 25000); out.classList.remove('thinking'); out.textContent = text; turns.push({ role: 'assistant', content: text }); }
    catch (e) { turns.pop(); out.classList.remove('thinking'); out.textContent = e.code === 'rate_limited' ? 'You have asked a lot of questions! Try again in a few minutes, or use the quote form.' : OFFLINE; }
    finally { chatBusy = false; clog.scrollTop = clog.scrollHeight; }
  }
  $('c-form').addEventListener('submit', e => { e.preventDefault(); const v = $('c-input').value; $('c-input').value = ''; askChat(v); });
  document.querySelectorAll('#c-sugg .chip').forEach(c => c.addEventListener('click', () => askChat(c.textContent)));

  /* ---------- startup ---------- */
  buildEstimator(); buildQuoteOptions(); renderEstimate();
  loadSettings();
  // open a shared design: /?c=ID
  const cid = new URLSearchParams(location.search).get('c');
  if (cid) rpc('get_concept', { p_id: cid }).then(c => {
    if (!c || !c.data) return;
    demo.kind = c.kind === 'app' ? 'app' : 'website';
    document.querySelectorAll('#demo-form .seg-b').forEach(x => x.setAttribute('aria-pressed', x.dataset.kind === demo.kind));
    demo.data = M.full(c.data); demo.conceptId = cid; demoRender(false);
    attachConcept(cid, demo.data.name); $('q-type').value = demo.kind === 'app' ? 'app' : 'website';
    if (!$('q-biz').value) $('q-biz').value = demo.data.name;
  }).catch(() => {});
})();
