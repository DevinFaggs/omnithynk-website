/* OmniThynk mockup engine: turns a small JSON description into a realistic website or phone-app mockup. */
(function () {
  const I = {
    cookie: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1"/><circle cx="14.5" cy="10" r="1"/><circle cx="10" cy="14.5" r="1"/><circle cx="15" cy="15" r="1"/>',
    cake: '<path d="M4 21h16v-8H4z"/><path d="M4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 0"/><path d="M12 13V9M9 13V10M15 13v-3"/><path d="M12 6.5a1 1 0 0 0 0-2"/>',
    coffee: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3v3M12 3v3"/>',
    bread: '<path d="M5 20V11a4 4 0 0 1-1-7.5C6 2 9 2.5 12 2.5s6-.5 8 1A4 4 0 0 1 19 11v9z"/>',
    pizza: '<path d="M12 21L3 6a14 14 0 0 1 18 0z"/><circle cx="10" cy="10" r="1"/><circle cx="14" cy="13" r="1"/>',
    burger: '<path d="M4 11a8 6 0 0 1 16 0z"/><path d="M3 14h18"/><path d="M4 17h16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>',
    taco: '<path d="M2 17a10 10 0 0 1 20 0z"/><path d="M6 14l1-2M10 12l1-2M14 12l1 2"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l8-8"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7z"/>',
    snowflake: '<path d="M12 2v20M4 7l16 10M20 7L4 17"/><path d="M9 4l3 2 3-2M9 20l3-2 3 2"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-2-2 6-6-1.3-1.3a4 4 0 0 1-5-5L13 5z"/><path d="M3 21l7-7"/>',
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    droplet: '<path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5L20 18M8.5 16.5L20 6"/>',
    sparkle: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    dumbbell: '<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
    run: '<circle cx="14" cy="4" r="2"/><path d="M8 21l3-6 3 3v4M6 12l3-4 4 1 3 4h3"/>',
    book: '<path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h14"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    camera: '<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="4"/>',
    gift: '<path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12"/><path d="M12 9S10 4 7.5 5.5 9 9 12 9zM12 9s2-5 4.5-3.5S15 9 12 9z"/>',
    gem: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 18 3-18"/>',
    shirt: '<path d="M8 3l4 3 4-3 5 4-3 4-2-1v11H8V10l-2 1-3-4z"/>',
    paw: '<circle cx="6" cy="10" r="2"/><circle cx="10" cy="5.5" r="2"/><circle cx="14" cy="5.5" r="2"/><circle cx="18" cy="10" r="2"/><path d="M12 12c-3 0-6 4-6 6.5S8 21 12 21s6-.5 6-2.5S15 12 12 12z"/>',
    car: '<path d="M3 16v-4l2-5h14l2 5v4z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M3 12h18"/>',
    tooth: '<path d="M7 3c-3 0-4 3-3 6s1 5 2 9 2 4 3 0 1-4 3-4 2 0 3 4 2 4 3 0 1-6 2-9-0-6-3-6-3 1-5 1S10 3 7 3z"/>',
    medical: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l3 12h11l2-8H6"/>',
    bag: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    tag: '<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    truck: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4a3 3 0 0 1 0 6M21 20c0-2.6-1.6-4.8-4-5.6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14a5 5 0 0 0 8 0M9 9.5h.01M15 9.5h.01"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    brush: '<path d="M18 3l3 3-9 9-3-3z"/><path d="M9 12c-3 0-5 2-5 5 0 1-1 2-2 2 2 2 7 2 8-2 .5-2 0-4-1-5z"/>',
    graduation: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    church: '<path d="M12 2v4M10 4h4M6 21V11l6-5 6 5v10"/><path d="M10 21v-4a2 2 0 0 1 4 0v4M3 21h18"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M5 12l5 5L20 7"/>'
  };
  const icon = (name, size, color, sw) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color || 'currentColor'}" stroke-width="${sw || 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name] || I.star}</svg>`;

  const FONTS = {
    warm: { h: "'Fraunces', Georgia, serif", w: 700, r: 1.1 },
    elegant: { h: "'Playfair Display', Georgia, serif", w: 700, r: .4 },
    bold: { h: "'Archivo Black', 'Arial Black', sans-serif", w: 400, r: .7 },
    playful: { h: "'Baloo 2', 'Trebuchet MS', sans-serif", w: 800, r: 1.6 },
    clean: { h: "'DM Sans', 'Helvetica Neue', sans-serif", w: 700, r: .8 }
  };
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hex = v => /^#[0-9a-fA-F]{6}$/.test(v || '');
  const lum = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }).reduce((a, v, i) => a + v * [.2126, .7152, .0722][i], 0); };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const on = h => (lum(h) > .42 ? '#14161C' : '#FFFFFF');
  const mix = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

  function normalize(d) {
    d = d || {};
    const p = d.palette || {};
    let bg = hex(p.bg) ? p.bg : '#FFF8F1', text = hex(p.text) ? p.text : '#2A1A12';
    if (contrast(bg, text) < 4.5) text = lum(bg) > .4 ? '#1B1B22' : '#F7F7FA';
    const accent = hex(p.accent) ? p.accent : '#C2410C';
    const accent2 = hex(p.accent2) ? p.accent2 : mix(accent, '#FFB347', .5);
    const surface = hex(p.surface) ? p.surface : mix(bg, '#FFFFFF', .6);
    const pick = (v, f) => (I[v] ? v : f);
    const arr = (a, n, f) => { a = Array.isArray(a) ? a.slice(0, n) : []; while (a.length < n) a.push(f(a.length)); return a; };
    const products = arr(d.products, 6, i => ({ name: 'Signature item ' + (i + 1), desc: 'A customer favorite', price: '', icon: 'star' }))
      .map(x => ({ name: String(x.name || ''), desc: String(x.desc || ''), price: String(x.price || ''), icon: pick(x.icon, 'star') }));
    const app = d.app || {};
    return {
      name: String(d.name || 'Your Business'),
      style: FONTS[d.style] ? d.style : 'clean',
      pal: { bg, text, accent, accent2, surface, muted: mix(text, bg, .38), line: mix(text, bg, .86) },
      logoIcon: pick(d.logoIcon, 'sparkle'),
      nav: arr(d.nav, 4, i => ['Home', 'Shop', 'About', 'Contact'][i]),
      hero: Object.assign({ title: 'Welcome', text: '', cta: 'Get started', badge: 'Now open' }, d.hero || {}),
      productsTitle: d.productsTitle || 'Our favorites',
      products,
      features: arr(d.features, 3, i => ({ title: ['Made with care', 'Fast & easy', 'Local & trusted'][i], text: '', icon: ['heart', 'clock', 'pin'][i] }))
        .map(x => ({ title: String(x.title || ''), text: String(x.text || ''), icon: pick(x.icon, 'star') })),
      about: d.about || '',
      ctaBand: Object.assign({ title: 'Ready when you are', button: 'Contact us' }, d.ctaBand || {}),
      app: {
        greeting: app.greeting || 'Welcome back',
        promo: Object.assign({ title: 'This week only', text: 'Something special for you.', button: 'See more' }, app.promo || {}),
        categories: arr(app.categories, 4, i => ['Popular', 'New', 'Deals', 'More'][i]),
        listTitle: app.listTitle || 'Popular now',
        actionTitle: app.actionTitle || 'Book a time',
        actionButton: app.actionButton || 'Confirm',
        tabs: arr(app.tabs, 4, i => [{ label: 'Home', icon: 'home' }, { label: 'Browse', icon: 'search' }, { label: 'Book', icon: 'calendar' }, { label: 'Me', icon: 'user' }][i])
          .map((t, i) => ({ label: String(t.label || ['Home', 'Browse', 'Book', 'Me'][i]), icon: pick(t.icon, ['home', 'search', 'calendar', 'user'][i]) })),
        rewardsTitle: app.rewardsTitle || 'Your rewards'
      }
    };
  }

  function tile(p, a, b, ic, size) {
    return `<div class="mk-tile" style="background:radial-gradient(120% 90% at 20% 15%, ${mix(a, '#FFFFFF', .35)}, ${a} 55%, ${b})">${icon(ic, size, on(a), 1.4)}<i style="background:${mix(b, '#FFFFFF', .25)}"></i></div>`;
  }

  function renderSite(raw) {
    const d = normalize(raw), P = d.pal, F = FONTS[d.style];
    const R = F.r, ink = on(P.accent);
    const h = `font-family:${F.h};font-weight:${F.w};`;
    return `<div class="mk-site" style="background:${P.bg};color:${P.text};--r:${R}em">
  <div class="mk-nav"><div class="mk-logo" style="${h}"><span style="background:${P.accent};color:${ink}">${icon(d.logoIcon, '1em', ink, 2)}</span>${esc(d.name)}</div>
    <div class="mk-links">${d.nav.map(n => `<span>${esc(n)}</span>`).join('')}</div>
    <span class="mk-btn" style="background:${P.accent};color:${ink}">${esc(d.hero.cta)}</span></div>
  <div class="mk-hero">
    <div class="mk-hero-copy">
      <span class="mk-badge" style="background:${mix(P.accent, P.bg, .85)};color:${contrast(P.accent, P.bg) > 3 ? P.accent : P.text}">${icon('sparkle', '.9em', 'currentColor', 2)} ${esc(d.hero.badge)}</span>
      <h3 style="${h}">${esc(d.hero.title)}</h3>
      <p style="color:${P.muted}">${esc(d.hero.text)}</p>
      <div class="mk-row"><span class="mk-btn lg" style="background:${P.accent};color:${ink}">${esc(d.hero.cta)} ${icon('arrow', '1em', ink, 2)}</span><span class="mk-btn lg ghost" style="border-color:${P.line};color:${P.text}">${esc(d.nav[1])}</span></div>
    </div>
    <div class="mk-hero-art">
      <div class="mk-blob" style="background:radial-gradient(110% 100% at 30% 20%, ${mix(P.accent2, '#FFFFFF', .3)}, ${P.accent} 60%, ${mix(P.accent, '#000000', .25)})">${icon(d.products[0].icon, '7em', on(P.accent), 1.1)}</div>
      <div class="mk-float a" style="background:${P.surface};color:${P.text}">${tile(P, P.accent2, P.accent, d.products[1].icon, '1.4em')}<div><b>${esc(d.products[1].name)}</b><small style="color:${P.muted}">${esc(d.products[1].price)}</small></div></div>
      <div class="mk-float b" style="background:${P.surface};color:${P.text}"><span style="color:${P.accent}">${icon('heart', '1.1em', P.accent, 2)}</span><small>${esc(d.features[0].title)}</small></div>
    </div>
  </div>
  <div class="mk-sec"><div class="mk-sec-h"><h4 style="${h}">${esc(d.productsTitle)}</h4><span style="color:${P.accent}">View all ${icon('arrow', '1em', P.accent, 2)}</span></div>
    <div class="mk-grid">${d.products.map((p, i) => `<div class="mk-card" style="background:${P.surface};border-color:${P.line}">
      ${tile(P, i % 2 ? P.accent2 : P.accent, i % 2 ? P.accent : P.accent2, p.icon, '4.4em')}
      <div class="mk-card-b"><b style="${h}">${esc(p.name)}</b><small style="color:${P.muted}">${esc(p.desc)}</small>
      <div class="mk-row sb"><span class="mk-price">${esc(p.price)}</span><span class="mk-add" style="background:${P.accent};color:${ink}">${icon('plus', '1em', ink, 2.4)}</span></div></div></div>`).join('')}</div></div>
  <div class="mk-feats" style="background:${mix(P.accent, P.bg, .9)}">${d.features.map(f => `<div><span class="mk-fi" style="background:${P.accent};color:${ink}">${icon(f.icon, '1.3em', ink, 2)}</span><b style="${h}">${esc(f.title)}</b><small style="color:${P.muted}">${esc(f.text)}</small></div>`).join('')}</div>
  <div class="mk-cta" style="background:linear-gradient(120deg, ${P.accent}, ${mix(P.accent2, P.accent, .3)});color:${ink}"><div><h4 style="${h}">${esc(d.ctaBand.title)}</h4><p>${esc(d.about)}</p></div><span class="mk-btn lg" style="background:${ink};color:${P.accent}">${esc(d.ctaBand.button)}</span></div>
  <div class="mk-foot" style="color:${P.muted}"><span style="${h}color:${P.text}">${esc(d.name)}</span><span>${d.nav.map(esc).join(' · ')}</span></div>
</div>`;
  }

  function renderApp(raw, screen) {
    const d = normalize(raw), P = d.pal, F = FONTS[d.style], A = d.app, ink = on(P.accent);
    const h = `font-family:${F.h};font-weight:${F.w};`;
    screen = screen || 0;
    let body = '';
    if (screen === 0) {
      body = `<div class="ap-top"><div><small style="color:${P.muted}">${esc(d.name)}</small><h5 style="${h}">${esc(A.greeting)}</h5></div><span class="ap-av" style="background:${P.accent};color:${ink}">${icon(d.logoIcon, '1.2em', ink, 2)}</span></div>
      <div class="ap-search" style="background:${P.surface};color:${P.muted};border-color:${P.line}">${icon('search', '1.1em', P.muted, 2)} Search</div>
      <div class="ap-promo" style="background:linear-gradient(130deg, ${P.accent}, ${P.accent2});color:${ink}"><div><b style="${h}">${esc(A.promo.title)}</b><small>${esc(A.promo.text)}</small><span class="ap-pill" style="background:${ink};color:${P.accent}">${esc(A.promo.button)}</span></div>${icon(d.products[0].icon, '4.2em', ink, 1.2)}</div>
      <div class="ap-cats">${A.categories.map((c, i) => `<span style="${i === 0 ? `background:${P.text};color:${P.bg}` : `background:${P.surface};color:${P.text};border-color:${P.line}`}">${esc(c)}</span>`).join('')}</div>
      <div class="ap-h"><b style="${h}">${esc(A.listTitle)}</b><small style="color:${P.accent}">See all</small></div>
      <div class="ap-hscroll">${d.products.slice(0, 4).map((p, i) => `<div class="ap-pc" style="background:${P.surface};border-color:${P.line}">${tile(P, i % 2 ? P.accent2 : P.accent, i % 2 ? P.accent : P.accent2, p.icon, '3em')}<b>${esc(p.name)}</b><div class="mk-row sb"><small>${esc(p.price)}</small><span class="mk-add" style="background:${P.accent};color:${ink}">${icon('plus', '.9em', ink, 2.4)}</span></div></div>`).join('')}</div>`;
    } else if (screen === 1) {
      body = `<div class="ap-top"><h5 style="${h}">${esc(d.productsTitle)}</h5></div>
      <div class="ap-list">${d.products.map((p, i) => `<div class="ap-li" style="background:${P.surface};border-color:${P.line}">${tile(P, i % 2 ? P.accent2 : P.accent, i % 2 ? P.accent : P.accent2, p.icon, '1.6em')}<div><b>${esc(p.name)}</b><small style="color:${P.muted}">${esc(p.desc)}</small></div><span class="ap-pr">${esc(p.price)}</span></div>`).join('')}</div>`;
    } else if (screen === 2) {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], times = ['9:00', '10:30', '12:00', '1:30', '3:00', '4:30'];
      body = `<div class="ap-top"><h5 style="${h}">${esc(A.actionTitle)}</h5></div>
      <div class="ap-sel" style="background:${P.surface};border-color:${P.line}">${tile(P, P.accent, P.accent2, d.products[0].icon, '1.6em')}<div><b>${esc(d.products[0].name)}</b><small style="color:${P.muted}">${esc(d.products[0].price)}</small></div></div>
      <small class="ap-lab" style="color:${P.muted}">Pick a day</small>
      <div class="ap-days">${days.map((x, i) => `<span style="${i === 2 ? `background:${P.accent};color:${ink}` : `background:${P.surface};border-color:${P.line}`}"><small>${x}</small><b>${14 + i}</b></span>`).join('')}</div>
      <small class="ap-lab" style="color:${P.muted}">Pick a time</small>
      <div class="ap-times">${times.map((x, i) => `<span style="${i === 1 ? `border-color:${P.accent};color:${P.accent}` : `border-color:${P.line}`}">${x}</span>`).join('')}</div>
      <span class="ap-cta" style="background:${P.accent};color:${ink}">${esc(A.actionButton)}</span>`;
    } else {
      body = `<div class="ap-top"><h5 style="${h}">${esc(A.rewardsTitle)}</h5><span class="ap-av" style="background:${P.surface};color:${P.text}">${icon('user', '1.2em', P.text, 2)}</span></div>
      <div class="ap-reward" style="background:linear-gradient(130deg, ${P.text}, ${mix(P.text, P.accent, .45)});color:${on(P.text)}"><small>${esc(d.name)} rewards</small><b style="${h}">7 of 10</b><div class="ap-bar"><i style="width:70%;background:${P.accent2}"></i></div><small>3 more visits for a free ${esc(d.products[0].name)}</small></div>
      ${['Order history', 'Saved favorites', 'Notifications', 'Payment methods'].map(x => `<div class="ap-row" style="border-color:${P.line}"><span>${x}</span>${icon('arrow', '1em', P.muted, 2)}</div>`).join('')}`;
    }
    return `<div class="mk-app" style="background:${P.bg};color:${P.text}"><div class="ap-body">${body}</div>
      <nav class="ap-tabs" style="background:${P.surface};border-color:${P.line}">${A.tabs.map((t, i) => `<button type="button" data-screen="${i}" aria-label="${esc(t.label)}" style="color:${i === screen ? P.accent : P.muted}">${icon(t.icon, '1.35em', i === screen ? P.accent : P.muted, 2)}<span>${esc(t.label)}</span></button>`).join('')}</nav></div>`;
  }

  /* ---------- Hand-made examples (work instantly, no AI needed) ---------- */
  const PRESETS = {
    cookie: { name: 'Sweet Crumb Cookie Co.', style: 'warm', palette: { bg: '#FFF7EE', surface: '#FFFFFF', text: '#3B2416', accent: '#C2552A', accent2: '#F2A541' }, logoIcon: 'cookie',
      nav: ['Shop', 'Gift boxes', 'Our story', 'Visit'], hero: { title: 'Warm cookies, baked fresh every morning', text: 'Small-batch cookies made with real butter and a lot of love, ready for pickup or delivered to your door.', cta: 'Order now', badge: 'Baked today' },
      productsTitle: 'Fresh from the oven', products: [
        { name: 'Classic Chocolate Chip', desc: 'Brown butter, sea salt, gooey center', price: '$3.50', icon: 'cookie' },
        { name: 'Snickerdoodle Cloud', desc: 'Soft, cinnamon sugar, melt-in-your-mouth', price: '$3.25', icon: 'cookie' },
        { name: 'Triple Fudge Brownie', desc: 'Dark chocolate with a crackly top', price: '$4.00', icon: 'cake' },
        { name: 'Birthday Sprinkle', desc: 'Vanilla, rainbow sprinkles, pure joy', price: '$3.50', icon: 'gift' },
        { name: 'Dozen Gift Box', desc: 'Twelve favorites, hand-tied with ribbon', price: '$36.00', icon: 'gift' },
        { name: 'Cold Brew Coffee', desc: 'The perfect cookie companion', price: '$4.50', icon: 'coffee' }],
      features: [{ title: 'Baked every morning', text: 'Nothing sits overnight. Ever.', icon: 'sun' }, { title: 'Local delivery', text: 'Warm cookies at your door within the hour.', icon: 'truck' }, { title: 'Made for gifting', text: 'Boxes for birthdays, thank-yous and just because.', icon: 'heart' }],
      about: 'A family bakery turning grandma’s recipes into the best cookies in town, one tray at a time.', ctaBand: { title: 'Treat someone today', button: 'Send a box' },
      app: { greeting: 'Craving something sweet?', promo: { title: 'Free cookie Friday', text: 'Buy a box of six, get one free.', button: 'Claim' }, categories: ['Classics', 'Boxes', 'Seasonal', 'Drinks'], listTitle: 'Most loved', actionTitle: 'Schedule pickup', actionButton: 'Reserve', tabs: [{ label: 'Home', icon: 'home' }, { label: 'Menu', icon: 'cookie' }, { label: 'Pickup', icon: 'clock' }, { label: 'Rewards', icon: 'gift' }], rewardsTitle: 'Cookie club' } },
    hvac: { name: 'Summit Air Heating & Cooling', style: 'bold', palette: { bg: '#F4F8FC', surface: '#FFFFFF', text: '#0E1E33', accent: '#0B5FD7', accent2: '#FF7A1A' }, logoIcon: 'snowflake',
      nav: ['Services', 'Maintenance plans', 'Financing', 'Contact'], hero: { title: 'Comfortable home. Fair price. Same day.', text: 'Licensed technicians fix your AC or furnace fast, with upfront pricing and no surprise fees.', cta: 'Book service', badge: '24/7 emergency help' },
      productsTitle: 'How we can help', products: [
        { name: 'AC Repair', desc: 'Back to cool, usually the same day', price: 'From $89', icon: 'snowflake' },
        { name: 'Furnace Repair', desc: 'Heat restored fast, all major brands', price: 'From $89', icon: 'flame' },
        { name: 'New System Install', desc: 'Energy-efficient units, financing available', price: 'Free quote', icon: 'home' },
        { name: 'Comfort Club Plan', desc: 'Two tune-ups a year plus priority service', price: '$15/mo', icon: 'shield' },
        { name: 'Indoor Air Quality', desc: 'Purifiers and filters for cleaner air', price: 'From $149', icon: 'leaf' },
        { name: 'Water Heaters', desc: 'Repairs and tankless upgrades', price: 'From $99', icon: 'droplet' }],
      features: [{ title: 'Upfront pricing', text: 'You approve the price before we start.', icon: 'tag' }, { title: 'On-time promise', text: 'Text alerts when your tech is on the way.', icon: 'clock' }, { title: 'Licensed & insured', text: 'Background-checked, trained professionals.', icon: 'shield' }],
      about: 'Family-owned and serving our neighbors for over 20 years. We treat your home like our own.', ctaBand: { title: 'No heat? No AC? We are on the way.', button: 'Call now' },
      app: { greeting: 'Stay comfortable', promo: { title: 'Fall tune-up special', text: 'Furnace check before the cold hits.', button: 'Book' }, categories: ['Cooling', 'Heating', 'Plans', 'Air'], listTitle: 'Popular services', actionTitle: 'Book a visit', actionButton: 'Confirm', tabs: [{ label: 'Home', icon: 'home' }, { label: 'Services', icon: 'wrench' }, { label: 'Book', icon: 'calendar' }, { label: 'Account', icon: 'user' }], rewardsTitle: 'My home' } },
    salon: { name: 'Glow Studio', style: 'elegant', palette: { bg: '#FBF6F4', surface: '#FFFFFF', text: '#2B1E22', accent: '#B24C6A', accent2: '#E7B7A3' }, logoIcon: 'scissors',
      nav: ['Services', 'Stylists', 'Gallery', 'Book'], hero: { title: 'Look good. Feel even better.', text: 'Cuts, color and care from stylists who listen. Book in seconds, any time of day.', cta: 'Book now', badge: 'New clients 15% off' },
      productsTitle: 'Our services', products: [
        { name: 'Signature Cut & Style', desc: 'Consultation, wash, cut and blowout', price: '$65', icon: 'scissors' },
        { name: 'Balayage Color', desc: 'Soft, natural, sun-kissed dimension', price: 'From $180', icon: 'brush' },
        { name: 'Silk Press', desc: 'Smooth, shiny, healthy movement', price: '$85', icon: 'sparkle' },
        { name: 'Bridal Styling', desc: 'Trial plus your big-day look', price: 'From $150', icon: 'gem' },
        { name: 'Deep Repair Treatment', desc: 'Restore strength and shine', price: '$40', icon: 'droplet' },
        { name: 'Brow & Lash Bar', desc: 'Shape, tint and lift', price: 'From $30', icon: 'star' }],
      features: [{ title: 'Book in seconds', text: 'Pick your stylist and time online.', icon: 'calendar' }, { title: 'Reminders by text', text: 'Never miss an appointment again.', icon: 'chat' }, { title: 'Clean, calm space', text: 'Relax with a drink while we work.', icon: 'heart' }],
      about: 'A welcoming studio where every appointment starts with a real conversation about you.', ctaBand: { title: 'Your chair is waiting', button: 'Book a time' },
      app: { greeting: 'Ready for a refresh?', promo: { title: 'Bring a friend', text: 'You both get 20% off.', button: 'Invite' }, categories: ['Cuts', 'Color', 'Styling', 'Brows'], listTitle: 'Popular now', actionTitle: 'Book appointment', actionButton: 'Book', tabs: [{ label: 'Home', icon: 'home' }, { label: 'Services', icon: 'scissors' }, { label: 'Book', icon: 'calendar' }, { label: 'Me', icon: 'user' }], rewardsTitle: 'Glow points' } },
    fitness: { name: 'Forge Fitness Coaching', style: 'bold', palette: { bg: '#0F1115', surface: '#1A1D24', text: '#F3F4F6', accent: '#C6F432', accent2: '#3DD6D0' }, logoIcon: 'dumbbell',
      nav: ['Programs', 'Coaching', 'Results', 'Join'], hero: { title: 'Get stronger in 30 minutes a day', text: 'Personal training plans, video workouts and a coach in your pocket. Built around your schedule.', cta: 'Start free week', badge: 'New: 6-week challenge' },
      productsTitle: 'Programs', products: [
        { name: '1-on-1 Coaching', desc: 'Weekly check-ins and a custom plan', price: '$129/mo', icon: 'users' },
        { name: 'Strength Builder', desc: '12 weeks, gym or home', price: '$49', icon: 'dumbbell' },
        { name: 'Run Your First 5K', desc: 'Couch to finish line in 8 weeks', price: '$29', icon: 'run' },
        { name: 'Meal Plans', desc: 'Simple recipes, grocery lists included', price: '$19/mo', icon: 'leaf' },
        { name: 'Mobility & Stretch', desc: '15-minute routines for every day', price: '$15', icon: 'heart' },
        { name: 'Group Bootcamp', desc: 'Saturday mornings in the park', price: '$20/class', icon: 'sun' }],
      features: [{ title: 'Plans that adapt', text: 'Workouts adjust as you get stronger.', icon: 'chart' }, { title: 'Coach on call', text: 'Message your coach any time.', icon: 'chat' }, { title: 'Track everything', text: 'Progress photos, lifts and streaks.', icon: 'star' }],
      about: 'Real coaching for busy people. No gimmicks, just steady progress you can feel.', ctaBand: { title: 'Your first week is on us', button: 'Join now' },
      app: { greeting: 'Ready to train?', promo: { title: 'Day 12 of 30', text: 'Upper body strength, 28 minutes.', button: 'Start' }, categories: ['Strength', 'Cardio', 'Mobility', 'Meals'], listTitle: 'Today’s plan', actionTitle: 'Book a session', actionButton: 'Book', tabs: [{ label: 'Home', icon: 'home' }, { label: 'Workouts', icon: 'dumbbell' }, { label: 'Coach', icon: 'calendar' }, { label: 'Progress', icon: 'chart' }], rewardsTitle: 'Your progress' } },
    church: { name: 'Riverside Community Church', style: 'warm', palette: { bg: '#F7F5F0', surface: '#FFFFFF', text: '#1F2A37', accent: '#2F6B5E', accent2: '#E0A84E' }, logoIcon: 'church',
      nav: ['Sundays', 'Events', 'Give', 'Connect'], hero: { title: 'A place to belong', text: 'Join us Sundays at 9 and 11, or watch online. Everyone is welcome, just as you are.', cta: 'Plan a visit', badge: 'Sundays 9 & 11 AM' },
      productsTitle: 'Get involved', products: [
        { name: 'Sunday Services', desc: 'In person and streamed live', price: 'Sundays', icon: 'church' },
        { name: 'Youth Night', desc: 'Games, food and real talk', price: 'Wednesdays', icon: 'users' },
        { name: 'Small Groups', desc: 'Find your people midweek', price: 'All week', icon: 'heart' },
        { name: 'Food Pantry', desc: 'Serving neighbors every Saturday', price: 'Saturdays', icon: 'gift' },
        { name: 'Kids Ministry', desc: 'Safe, fun and faith-filled', price: 'Sundays', icon: 'smile' },
        { name: 'Online Giving', desc: 'Give securely in seconds', price: 'Anytime', icon: 'shield' }],
      features: [{ title: 'Watch live', text: 'Stream every service from anywhere.', icon: 'globe' }, { title: 'Stay in the loop', text: 'Event reminders right to your phone.', icon: 'calendar' }, { title: 'Give easily', text: 'One-tap, secure, recurring gifts.', icon: 'heart' }],
      about: 'A neighborhood church loving our city through worship, service and real community.', ctaBand: { title: 'We saved you a seat', button: 'Plan a visit' },
      app: { greeting: 'Good morning, friend', promo: { title: 'Fall Family Picnic', text: 'Saturday at noon, all are welcome.', button: 'RSVP' }, categories: ['Watch', 'Events', 'Groups', 'Give'], listTitle: 'This week', actionTitle: 'Sign up to serve', actionButton: 'Sign up', tabs: [{ label: 'Home', icon: 'home' }, { label: 'Events', icon: 'calendar' }, { label: 'Serve', icon: 'heart' }, { label: 'Me', icon: 'user' }], rewardsTitle: 'My church' } },
    foodtruck: { name: 'Fuego Street Tacos', style: 'playful', palette: { bg: '#FFF9EC', surface: '#FFFFFF', text: '#2A1608', accent: '#E8432A', accent2: '#2BB673' }, logoIcon: 'taco',
      nav: ['Menu', 'Find the truck', 'Catering', 'Order'], hero: { title: 'Tacos worth chasing down', text: 'See where the truck is today, order ahead and skip the line. Hot, fresh and fast.', cta: 'Order ahead', badge: 'Open today 11-8' },
      productsTitle: 'The menu', products: [
        { name: 'Birria Tacos', desc: 'Slow-braised beef with dipping consomé', price: '$12', icon: 'taco' },
        { name: 'Al Pastor', desc: 'Pork, pineapple, cilantro, onion', price: '$10', icon: 'flame' },
        { name: 'Veggie Fuego Bowl', desc: 'Rice, beans, roasted peppers, salsa', price: '$11', icon: 'leaf' },
        { name: 'Street Corn', desc: 'Cotija, lime, chili, crema', price: '$5', icon: 'sun' },
        { name: 'Churro Bites', desc: 'Cinnamon sugar with chocolate dip', price: '$6', icon: 'star' },
        { name: 'Horchata', desc: 'Cold, creamy, house-made', price: '$4', icon: 'droplet' }],
      features: [{ title: 'Live truck tracker', text: 'Always know where we are parked.', icon: 'pin' }, { title: 'Order ahead', text: 'Pay in the app, grab and go.', icon: 'clock' }, { title: 'Catering', text: 'Bring the truck to your party.', icon: 'truck' }],
      about: 'Three friends, one truck and a family recipe for birria that people line up for.', ctaBand: { title: 'Hungry? We are nearby.', button: 'Find us' },
      app: { greeting: 'What are you craving?', promo: { title: 'Taco Tuesday', text: '3 tacos and a drink for $12.', button: 'Order' }, categories: ['Tacos', 'Bowls', 'Sides', 'Drinks'], listTitle: 'Fan favorites', actionTitle: 'Order for pickup', actionButton: 'Pay now', tabs: [{ label: 'Home', icon: 'home' }, { label: 'Menu', icon: 'taco' }, { label: 'Pickup', icon: 'pin' }, { label: 'Rewards', icon: 'gift' }], rewardsTitle: 'Fuego rewards' } }
  };

  const KEYWORDS = [
    ['cookie', /cookie|bake|bakery|baking|dessert|cake|cupcake|pastr|donut|sweet|candy|chocolate/i],
    ['hvac', /hvac|heat|cool|air ?cond|furnace|plumb|electric|roof|contractor|repair|handyman|landscap|lawn|clean/i],
    ['salon', /salon|hair|barber|nail|spa|beauty|lash|brow|makeup|stylist|groom/i],
    ['fitness', /fitness|gym|coach|train|yoga|pilates|workout|health|wellness|nutrition/i],
    ['church', /church|ministry|faith|community|nonprofit|non-profit|club|school|group/i],
    ['foodtruck', /food|truck|taco|restaurant|cafe|coffee|bbq|pizza|burger|kitchen|catering|grill|bar/i]
  ];
  function closest(text) { for (const [k, re] of KEYWORDS) if (re.test(text || '')) return k; return 'cookie'; }

  window.OmniMockup = { renderSite, renderApp, normalize, PRESETS, closest, icon };
})();
