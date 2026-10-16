(function () {
  const $ = id => document.getElementById(id);
  const M = window.OmniMockup;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const domain = n => (String(n).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '').slice(0, 22) || 'yourbusiness') + '.com';
  const W = (name, size) => M.icon(name, size || 20, '#fff', 1.9);

  async function ai(mode, payload) {
    const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ mode }, payload)) });
    let j = {}; try { j = await r.json(); } catch (_) {}
    if (!r.ok) throw Object.assign(new Error(j.error || 'ai_error'), { code: j.error || r.status });
    return j;
  }

  /* ---------- screen scaling: mockups are em-based; font-size = width / design width ---------- */
  const store = new WeakMap();
  const ro = new ResizeObserver(es => es.forEach(e => {
    const el = e.target, w = e.contentRect.width;
    if (w) el.style.fontSize = (w / (el.dataset.fit === 'app' ? 23.5 : 64)) + 'px';
  }));
  function fit(el, kind) { el.dataset.fit = kind; ro.observe(el); }
  function showSite(el, data) { store.set(el, { data, kind: 'site' }); el.innerHTML = M.renderSite(data); }
  function showApp(el, data, screen) { store.set(el, { data, kind: 'app' }); el.innerHTML = M.renderApp(data, screen || 0); }
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.mk-app [data-screen]'); if (!b) return;
    const scr = b.closest('.screen'), st = store.get(scr); if (!st) return;
    showApp(scr, st.data, +b.dataset.screen);
  });

  /* ---------- cursor glow + magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    const g = document.querySelector('.cursor-glow'); let gx = -999, gy = -999, raf = 0;
    window.addEventListener('pointermove', e => { gx = e.clientX; gy = e.clientY; if (!raf) raf = requestAnimationFrame(() => { g.style.transform = `translate(${gx}px,${gy}px)`; raf = 0; }); }, { passive: true });
    document.addEventListener('pointermove', e => {
      const m = e.target.closest && e.target.closest('.mag'); if (!m) return;
      const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px,${(e.clientY - r.top - r.height / 2) * .22}px)`;
    }, { passive: true });
    document.addEventListener('pointerout', e => { const m = e.target.closest && e.target.closest('.mag'); if (m && !m.contains(e.relatedTarget)) m.style.transform = ''; });
  }

  /* ---------- hero network ---------- */
  (function () {
    const cv = $('net'), ctx = cv.getContext('2d'), hero = document.querySelector('.hero');
    let W2 = 0, H = 0, nodes = [], pulses = [], mouse = { x: -9999, y: -9999, on: false }, run = true;
    function resize() {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      W2 = r.width; H = r.height; cv.width = W2 * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(90, Math.max(30, W2 * H / 16000)));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * W2, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: 1 + Math.random() * 1.8 }));
      if (reduce) draw();
    }
    const L = 130;
    function draw() {
      ctx.clearRect(0, 0, W2, H);
      for (const p of nodes) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W2) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
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

  /* ---------- hero devices: cycle real examples ---------- */
  const HERO_ORDER = ['cookie', 'salon', 'hvac', 'fitness', 'foodtruck', 'church'];
  const heroSite = $('hero-site'), heroApp = $('hero-app'); fit(heroSite, 'site'); fit(heroApp, 'app');
  let hi = 0, heroVisible = true;
  function heroShow() {
    const d = M.PRESETS[HERO_ORDER[hi]];
    showSite(heroSite, d); showApp(heroApp, d, 0);
    $('hero-url').textContent = domain(d.name); $('hero-caption').textContent = 'Example: ' + d.name;
  }
  heroShow();
  if (!reduce) {
    new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }).observe($('hero-stage'));
    setInterval(() => { if (heroVisible && !document.hidden) { hi = (hi + 1) % HERO_ORDER.length; heroShow(); } }, 6000);
    const stage = $('hero-stage'), hb = $('hero-browser'), hp = $('hero-phone');
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      hb.style.transform = `rotateY(${x * 8 - 6}deg) rotateX(${-y * 6 + 2}deg)`; hp.style.transform = `translateZ(60px) rotateY(${x * 12 - 8}deg) rotateX(${-y * 8}deg)`;
    });
    stage.addEventListener('pointerleave', () => { hb.style.transform = ''; hp.style.transform = ''; });
  }

  /* ---------- live demo ---------- */
  const demo = { kind: 'website', feel: 'Warm and friendly', data: M.PRESETS.cookie, screen: 0, busy: false };
  const demoSite = $('demo-site'), demoApp = $('demo-app'); fit(demoSite, 'site'); fit(demoApp, 'app');
  function demoRender() {
    const isApp = demo.kind === 'app';
    $('demo-browser').hidden = isApp; $('demo-phone').hidden = !isApp;
    $('demo-note').textContent = isApp ? 'Tap the icons at the bottom of the phone to switch screens.' : 'Scroll inside the screen to explore the whole page.';
    if (isApp) showApp(demoApp, demo.data, 0); else { showSite(demoSite, demo.data); demoSite.scrollTop = 0; }
    $('demo-url').textContent = domain(demo.data.name);
  }
  demoRender();
  document.querySelectorAll('#demo-form .seg-b').forEach(b => b.addEventListener('click', () => {
    demo.kind = b.dataset.kind;
    document.querySelectorAll('#demo-form .seg-b').forEach(x => x.setAttribute('aria-pressed', x === b));
    demoRender();
  }));
  document.querySelectorAll('#d-feel .chip').forEach(c => c.addEventListener('click', () => {
    demo.feel = c.dataset.v; document.querySelectorAll('#d-feel .chip').forEach(x => x.setAttribute('aria-pressed', x === c));
  }));
  const PRESET_LABELS = [['cookie', 'Cookie shop'], ['hvac', 'HVAC company'], ['salon', 'Hair salon'], ['fitness', 'Fitness coach'], ['church', 'Church'], ['foodtruck', 'Food truck']];
  PRESET_LABELS.forEach(([k, label]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = label;
    b.addEventListener('click', () => loadPreset(k, label)); $('d-presets').appendChild(b);
  });

  const STEPS = ['Reading your idea…', 'Picking your colors…', 'Writing your headlines…', 'Designing your products…', 'Building the layout…', 'Adding the finishing touches…'];
  let genTimer;
  function genOn() {
    const g = $('gen'); g.hidden = false; let i = 0; $('gen-step').textContent = STEPS[0];
    clearInterval(genTimer); genTimer = setInterval(() => { i = Math.min(i + 1, STEPS.length - 1); $('gen-step').textContent = STEPS[i]; }, 1400);
  }
  function genOff() { clearInterval(genTimer); $('gen').hidden = true; }
  const status = (t, err) => { const s = $('d-status'); s.textContent = t || ''; s.className = 'status' + (err ? ' err' : ''); };

  function loadPreset(k, label) {
    $('d-biz').value = label; $('d-goal').value = '';
    genOn(); status('');
    setTimeout(() => { demo.data = M.PRESETS[k]; genOff(); demoRender(); status('Here is an example we designed for a ' + label.toLowerCase() + '.'); }, reduce ? 0 : 1400);
  }
  function titleCase(s) { return s.replace(/\b\w/g, c => c.toUpperCase()); }
  async function generate() {
    const business = $('d-biz').value.trim();
    if (!business) { status('Tell us your business or idea first.', true); $('d-biz').focus(); return; }
    if (demo.busy) return; demo.busy = true; $('d-go').disabled = true; status(''); genOn();
    try {
      const { data } = await ai('site', { business, goal: $('d-goal').value.trim(), feel: demo.feel, kind: demo.kind });
      demo.data = data; demoRender();
      status('Designed by AI just now. Switch between Website and Mobile app to see both.');
    } catch (e) {
      const k = M.closest(business + ' ' + $('d-goal').value);
      const d = clone(M.PRESETS[k]);
      if (business.length <= 40) d.name = titleCase(business);
      demo.data = d; demoRender();
      status(e.code === 'rate_limited' ? 'You have tried a lot of designs. Here is a close example; try again in a few minutes.' : 'Our AI is busy right now, so here is a close example we designed earlier.', true);
    } finally { genOff(); demo.busy = false; $('d-go').disabled = false; }
  }
  $('demo-form').addEventListener('submit', e => { e.preventDefault(); generate(); });

  function sendToDemo(text, kind) {
    $('d-biz').value = text; $('d-goal').value = '';
    const k = kind || (/\b(app|mobile|phone|iphone|android)\b/i.test(text) ? 'app' : 'website');
    document.querySelector(`#demo-form .seg-b[data-kind="${k}"]`).click();
    $('demo').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  $('hero-form').addEventListener('submit', e => { e.preventDefault(); const v = $('hero-idea').value.trim(); if (!v) { $('hero-idea').focus(); return; } sendToDemo(v); setTimeout(generate, reduce ? 0 : 500); });
  $('ideas-form').addEventListener('submit', e => { e.preventDefault(); const v = $('ideas-input').value.trim(); if (!v) { $('ideas-input').focus(); return; } sendToDemo(v); setTimeout(generate, reduce ? 0 : 500); });

  // rotating placeholder in hero
  const PH = ['An online store for my cookie shop', 'A booking app for my hair salon', 'A website for my HVAC company', 'A workout app for my clients', 'An app for our church', 'A food truck ordering app'];
  if (!reduce) { let p = 0; setInterval(() => { const el = $('hero-idea'); if (document.activeElement !== el && !el.value) { p = (p + 1) % PH.length; el.placeholder = PH[p]; } }, 3200); }

  /* ---------- ideas marquee ---------- */
  const IDEAS = [
    ['calendar', 'A booking app for my salon', 'app', 'salon'], ['cookie', 'An online cookie shop', 'website', 'cookie'],
    ['snowflake', 'A website for my HVAC company', 'website', 'hvac'], ['dumbbell', 'A workout app for my clients', 'app', 'fitness'],
    ['church', 'An app for our church', 'app', 'church'], ['taco', 'A food truck ordering app', 'app', 'foodtruck'],
    ['chat', 'An AI helper that answers my customers', 'chat', null], ['graduation', 'A course website for my coaching', 'website', null],
    ['paw', 'A pet grooming booking site', 'website', null], ['home', 'A real estate listings site', 'website', null],
    ['book', 'A tutoring app for students', 'app', null], ['leaf', 'A landscaping company website', 'website', null],
    ['shirt', 'A boutique clothing store', 'website', null], ['scissors', 'A barbershop app with rewards', 'app', null],
    ['camera', 'A wedding photographer portfolio', 'website', null], ['coffee', 'A coffee shop loyalty app', 'app', null]
  ];
  function pill(it, hidden) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'pill-idea';
    if (hidden) b.tabIndex = -1;
    b.innerHTML = `<span class="ic">${W(it[0], 18)}</span>${esc(it[1])}<small>${it[2] === 'app' ? 'App' : it[2] === 'chat' ? 'AI helper' : 'Website'}</small>`;
    b.addEventListener('click', () => pickIdea(it)); return b;
  }
  function fillMarquee(id, items) {
    const m = $(id);
    [false, true].forEach(h => { const t = document.createElement('div'); t.className = 'track'; if (h) t.setAttribute('aria-hidden', 'true'); items.forEach(it => t.appendChild(pill(it, h))); m.appendChild(t); });
  }
  fillMarquee('marquee-1', IDEAS.slice(0, 8)); fillMarquee('marquee-2', IDEAS.slice(8));
  function pickIdea(it) {
    if (it[2] === 'chat') { openChat(); askChat('Can you build an AI helper that answers my customers? What would it do?'); return; }
    sendToDemo(it[1], it[2]);
    if (it[3]) { const label = it[1]; setTimeout(() => { genOn(); setTimeout(() => { demo.data = M.PRESETS[it[3]]; genOff(); demoRender(); status('Here is an example we designed for: ' + label + '. Edit the fields to make it yours.'); }, reduce ? 0 : 1400); }, reduce ? 0 : 400); }
    else setTimeout(generate, reduce ? 0 : 500);
  }

  /* ---------- what we build: showcase ---------- */
  const SHOW = [
    { t: 'Websites', d: 'A website that looks great, loads fast and brings you customers.', pw: 'OmniLaunch', kind: 'site', preset: 'hvac' },
    { t: 'Mobile apps', d: 'Your own app on iPhone and Android, with bookings, orders and rewards.', pw: 'OmniLaunch', kind: 'app', preset: 'fitness' },
    { t: 'Online stores', d: 'Sell your products online and get paid easily, any time of day.', pw: 'OmniLaunch', kind: 'site', preset: 'cookie' },
    { t: 'AI helpers', d: 'A smart assistant that answers customers and handles busywork for you.', pw: 'OmniAI', kind: 'chat' },
    { t: 'Business tools', d: 'Simple tools and dashboards that replace messy spreadsheets.', pw: 'ThinkLayer', kind: 'dash' },
    { t: 'Security & care', d: 'We keep everything safe, backed up, fast and running.', pw: 'OmniSec + Smart Infrastructure', kind: 'sec' }
  ];
  const list = $('show-list'), sstage = $('show-stage');
  SHOW.forEach((s, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button"><span class="t"><span>${esc(s.t)}</span><small>0${i + 1}</small></span><span class="d">${esc(s.d)}<span class="pw">Powered by ${esc(s.pw)}</span></span></button>`;
    li.firstElementChild.addEventListener('click', () => { showItem(i); restartShow(); });
    list.appendChild(li);
  });
  let si = 0, showTimer, showPaused = false, showVisible = false;
  function showItem(i) {
    si = i; [...list.children].forEach((li, j) => { li.firstElementChild.classList.toggle('on', j === i); li.firstElementChild.setAttribute('aria-pressed', j === i); });
    const s = SHOW[i];
    if (s.kind === 'site') {
      sstage.innerHTML = `<div class="dev-browser"><div class="bar"><i></i><i></i><i></i><span class="url">${esc(domain(M.PRESETS[s.preset].name))}</span></div><div class="screen"></div></div>`;
      const sc = sstage.querySelector('.screen'); fit(sc, 'site'); showSite(sc, M.PRESETS[s.preset]);
      if (s.t === 'Online stores') setTimeout(() => { sc.scrollTop = sc.querySelector('.mk-sec').offsetTop; }, 50);
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

  /* ---------- ROI ---------- */
  function roi() {
    const t = +$('s-team').value, h = +$('s-hrs').value, r = +$('s-rate').value, p = +$('s-pct').value / 100;
    $('o-team').textContent = t; $('o-hrs').textContent = h; $('o-rate').textContent = '$' + r; $('o-pct').textContent = Math.round(p * 100) + '%';
    const hours = t * h * 48 * p;
    $('r-dollars').textContent = '$' + Math.round(hours * r).toLocaleString(); $('r-hours').textContent = Math.round(hours).toLocaleString(); $('r-fte').textContent = (hours / 1920).toFixed(1);
  }
  ['s-team', 's-hrs', 's-rate', 's-pct'].forEach(id => $(id).addEventListener('input', roi)); roi();

  /* ---------- copy ---------- */
  document.querySelectorAll('.copy[data-copy]').forEach(b => b.addEventListener('click', () => {
    navigator.clipboard.writeText(b.dataset.copy).then(() => { b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy', 1500); })
      .catch(() => { const r = document.createRange(); r.selectNodeContents(b.previousElementSibling.querySelector('.v')); const g = getSelection(); g.removeAllRanges(); g.addRange(r); b.textContent = 'Selected'; });
  }));

  /* ---------- intake ---------- */
  const IQ = [
    { id: 'goal', q: 'What’s your idea? Pick one or type your own.', o: ['A website for my business', 'A mobile app', 'An online store', 'An AI helper for customers', 'A tool to save my team time', 'Something else'], other: true },
    { id: 'sys', q: 'What do you use today? Pick any that apply.', o: ['Email and spreadsheets', 'A website I already have', 'Social media pages', 'Square, Stripe or PayPal', 'QuickBooks', 'Nothing yet'], multi: true },
    { id: 'out', q: 'What matters most to you?', o: ['Getting more customers', 'Saving time', 'Looking professional', 'Making money online', 'Not sure yet'] },
    { id: 'who', q: 'Great. Where should we send your plan?', form: true }
  ];
  const ilog = $('in-log'), ictl = $('in-ctl'); let ins = { step: 0, ans: {} };
  function bubble(where, cls, t) { const d = document.createElement('div'); d.className = 'msg ' + cls; d.textContent = t; where.appendChild(d); where.scrollTop = where.scrollHeight; return d; }
  function iAsk() {
    const q = IQ[ins.step]; $('in-step').textContent = `${ins.step + 1} / ${IQ.length}`; bubble(ilog, 'bot', q.q);
    if (q.form) {
      ictl.innerHTML = `<form id="in-form" style="display:flex;flex-direction:column;gap:12px"><div class="row2"><div class="field"><label for="in-name">Name</label><input id="in-name" type="text" required placeholder="Jane Smith"></div><div class="field"><label for="in-email">Email</label><input id="in-email" type="email" required placeholder="jane@email.com"></div></div><button class="btn btn-primary" type="submit">Create my plan →</button></form>`;
      $('in-form').onsubmit = e => { e.preventDefault(); ins.ans.name = $('in-name').value.trim(); ins.ans.email = $('in-email').value.trim(); bubble(ilog, 'me', `${ins.ans.name}\n${ins.ans.email}`); iFinish(); };
      return;
    }
    const sel = new Set();
    ictl.innerHTML = `<div class="chips">${q.o.map(o => `<button type="button" class="chip" aria-pressed="false">${esc(o)}</button>`).join('')}</div>${q.other ? `<form id="in-other" style="display:flex;gap:8px"><label for="in-other-t" class="sr">Something else</label><input id="in-other-t" type="text" placeholder="Or describe it here" style="flex:1;min-width:0;min-height:46px;background:rgba(5,8,22,.6);border:1px solid var(--line-2);border-radius:999px;padding:0 16px"><button class="btn btn-ghost btn-sm" type="submit">Next</button></form>` : ''}${q.multi ? '<button type="button" class="btn btn-primary btn-sm" id="in-next" style="align-self:flex-start" disabled>Continue</button>' : ''}`;
    ictl.querySelectorAll('.chip').forEach(c => c.onclick = () => {
      if (q.multi) { const on = c.getAttribute('aria-pressed') !== 'true'; c.setAttribute('aria-pressed', on); on ? sel.add(c.textContent) : sel.delete(c.textContent); $('in-next').disabled = !sel.size; }
      else iAnswer(c.textContent);
    });
    if (q.multi) $('in-next').onclick = () => iAnswer([...sel].join(', '));
    if (q.other) $('in-other').onsubmit = e => { e.preventDefault(); const v = $('in-other-t').value.trim(); if (v) iAnswer(v); };
  }
  function iAnswer(v) { ins.ans[IQ[ins.step].id] = v; bubble(ilog, 'me', v); ins.step++; iAsk(); }
  async function iFinish() {
    $('in-step').textContent = 'Plan ready';
    const a = ins.ans;
    const brief = `Idea: ${a.goal}\nUsing today: ${a.sys}\nMost important: ${a.out}\nDemo design: ${demo.data.name}\nName: ${a.name}\nEmail: ${a.email}`;
    const card = document.createElement('div'); card.className = 'brief';
    card.innerHTML = `<span class="k">Your plan</span><div style="white-space:pre-wrap">${esc(brief)}</div><div id="in-ai" style="color:#D3DAFF" hidden></div>`;
    ilog.appendChild(card);
    ictl.innerHTML = `<p style="font-size:15px">To send it, copy your plan and email it to <b style="user-select:all">omnithynk@gmail.com</b>, or call <b style="user-select:all">+1 (513) 497-0420</b>. We reply within one business day.</p><div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><button type="button" class="btn btn-primary btn-sm" id="in-copy">Copy my plan</button><button type="button" class="copy" id="in-reset">Start over</button></div>`;
    $('in-copy').onclick = () => { const x = $('in-ai'); const t = brief + (x.hidden ? '' : '\n\nSummary: ' + x.textContent); navigator.clipboard.writeText(t).then(() => { $('in-copy').textContent = 'Copied'; }).catch(() => { const r = document.createRange(); r.selectNodeContents(card); const g = getSelection(); g.removeAllRanges(); g.addRange(r); $('in-copy').textContent = 'Selected. Press Ctrl+C'; }); };
    $('in-reset').onclick = () => { ins = { step: 0, ans: {} }; ilog.innerHTML = ''; iAsk(); };
    const x = $('in-ai'); x.hidden = false; x.textContent = 'Writing a quick summary…';
    try { const { text } = await ai('summary', { brief }); x.textContent = text; } catch (_) { x.hidden = true; }
  }
  iAsk();

  /* ---------- floating chat ---------- */
  const fab = $('chat-fab'), panel = $('chat-panel'), clog = $('c-log'); let turns = [], chatBusy = false;
  function openChat() { panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); setTimeout(() => $('c-input').focus(), 50); }
  function closeChat() { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus(); }
  fab.onclick = () => (panel.hidden ? openChat() : closeChat());
  $('chat-x').onclick = closeChat;
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) closeChat(); });
  async function askChat(q) {
    if (chatBusy || !q.trim()) return; chatBusy = true; $('c-sugg').hidden = true;
    bubble(clog, 'me', q); turns.push({ role: 'user', content: q }); turns = turns.slice(-10);
    const out = bubble(clog, 'bot thinking', 'Thinking…');
    try { const { text } = await ai('chat', { messages: turns }); out.classList.remove('thinking'); out.textContent = text; turns.push({ role: 'assistant', content: text }); }
    catch (e) { turns.pop(); out.classList.remove('thinking'); out.textContent = e.code === 'rate_limited' ? 'You have asked a lot of questions! Try again in a few minutes, or email omnithynk@gmail.com.' : 'Sorry, I could not answer just now. Try again, or email omnithynk@gmail.com and a person will reply.'; }
    finally { chatBusy = false; clog.scrollTop = clog.scrollHeight; }
  }
  $('c-form').addEventListener('submit', e => { e.preventDefault(); const v = $('c-input').value; $('c-input').value = ''; askChat(v); });
  document.querySelectorAll('#c-sugg .chip').forEach(c => c.addEventListener('click', () => askChat(c.textContent)));
})();
