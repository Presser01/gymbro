// A Raidmate bolt (Tamás kérése, 2026-10-14): katalógus fizetés nélkül. A
// termékek rajza SVG (a szín választásakor átszíneződik), elöl kicsi,
// egyszínű jelvény, a felsők hátán a teljes kabala a RAIDMATE felirattal.
// Az „Érdekel” gomb kitöltött levelet nyit a levelezőben; mi semmit nem
// tárolunk. A nyomatképeket a tools/make_branding.py készíti (img/).

const COLORS = {
  black: '#1c1d21',
  graphite: '#4a4c54',
  white: '#f2f2f0',
  coral: '#d9464b',
};
const APPAREL = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Ruhaformák a 400×440-es rajzlapon. front/back: a körvonal; extra: varrások,
// zsebek (tusvonallal); print: a nyomat helye.
const SHAPES = {
  tee: {
    front: 'M135 40 Q200 80 265 40 L306 52 L372 122 L337 170 L292 144 L294 410 Q200 420 106 410 L108 144 L63 170 L28 122 L94 52 Z',
    back: 'M135 40 Q200 54 265 40 L306 52 L372 122 L337 170 L292 144 L294 410 Q200 420 106 410 L108 144 L63 170 L28 122 L94 52 Z',
    seams: { front: ['M135 40 Q200 80 265 40'], back: ['M135 40 Q200 54 265 40'],
      both: ['M94 52 L108 144', 'M306 52 L292 144', 'M108 398 Q200 408 292 398'] },
    small: [232, 92, 46],
    big: [118, 86, 164, 172],
    arc: 'M120 284 Q200 318 280 284',
  },
  tank: {
    front: 'M152 40 Q200 84 248 40 L270 44 Q276 122 316 152 L312 410 Q200 420 88 410 L84 152 Q124 122 130 44 Z',
    back: 'M152 40 Q200 62 248 40 L270 44 Q276 122 316 152 L312 410 Q200 420 88 410 L84 152 Q124 122 130 44 Z',
    seams: { front: ['M152 40 Q200 84 248 40'], back: ['M152 40 Q200 62 248 40'],
      both: ['M130 44 Q124 122 84 152', 'M270 44 Q276 122 316 152', 'M90 398 Q200 408 310 398'] },
    small: [224, 104, 44],
    big: [124, 96, 152, 160],
    arc: 'M124 286 Q200 318 276 286',
  },
  hoodie: {
    front: 'M148 50 Q200 76 252 50 L302 60 L354 150 L374 352 L336 362 L306 196 L308 406 Q200 418 92 406 L94 196 L64 362 L26 352 L46 150 L98 60 Z',
    back: 'M148 50 Q200 76 252 50 L302 60 L354 150 L374 352 L336 362 L306 196 L308 406 Q200 418 92 406 L94 196 L64 362 L26 352 L46 150 L98 60 Z',
    under: { front: 'M140 56 Q132 8 200 4 Q268 8 260 56 Q200 84 140 56 Z' },
    over: { back: 'M138 56 Q130 6 200 4 Q270 6 262 56 Q262 128 200 138 Q138 128 138 56 Z' },
    inner: { front: 'M156 52 Q160 22 200 20 Q240 22 244 52 Q200 70 156 52 Z' },
    seams: { front: ['M138 300 L262 300 L282 372 L118 372 Z', 'M186 64 L182 138', 'M214 64 L218 138'],
      both: ['M94 390 L306 390', 'M64 346 L28 338', 'M336 346 L372 338'] },
    small: [232, 104, 44],
    big: [124, 152, 152, 160],
    arc: 'M124 334 Q200 364 276 334',
  },
  joggers: {
    front: 'M118 40 L282 40 L286 70 L302 384 L300 412 L222 412 L218 384 L204 170 L196 170 L182 384 L178 412 L100 412 L98 384 L114 70 Z',
    seams: { both: ['M116 64 L284 64', 'M195 66 Q190 100 186 116', 'M205 66 Q210 100 214 116',
      'M100 384 L182 384', 'M218 384 L300 384', 'M122 78 Q146 116 130 158', 'M278 78 Q254 116 270 158'] },
    small: [232, 112, 40],
  },
  shorts: {
    front: 'M114 70 L286 70 L292 96 L312 262 L214 272 L200 176 L186 272 L88 262 L108 96 Z',
    seams: { both: ['M110 94 L290 94', 'M196 96 Q192 120 188 134', 'M204 96 Q208 120 212 134',
      'M92 248 L188 258', 'M212 258 L308 248'] },
    small: [236, 146, 36],
  },
  cap: {
    front: 'M96 252 Q92 120 200 106 Q308 120 304 252 Z',
    over: { front: 'M70 252 Q200 222 330 252 Q330 292 200 302 Q70 292 70 252 Z' },
    seams: { both: ['M200 108 L200 250', 'M150 118 Q138 184 146 250', 'M250 118 Q262 184 254 250'] },
    dots: [[200, 106, 7]],
    small: [160, 140, 80],
  },
  bag: {
    front: 'M60 200 Q60 160 110 160 L290 160 Q340 160 340 200 L340 350 Q340 372 318 372 L82 372 Q60 372 60 350 Z',
    handle: 'M138 160 Q138 92 200 92 Q262 92 262 160',
    seams: { both: ['M86 184 L314 184', 'M60 216 L340 216'] },
    small: [148, 232, 104],
  },
  towel: {
    front: 'M70 150 L330 150 L330 360 L70 360 Z',
    over: { front: 'M70 150 L330 150 L330 206 L70 206 Z' },
    seams: { both: ['M70 330 L330 330', 'M70 342 L330 342'] },
    small: [262, 252, 58],
  },
  shaker: {
    front: 'M132 140 L268 140 L256 410 Q200 420 144 410 Z',
    over: { front: 'M138 92 L262 92 L270 140 L130 140 Z' },
    top: 'M172 70 L228 70 L234 92 L166 92 Z',
    seams: { both: ['M236 200 L252 200', 'M238 240 L250 240', 'M236 280 L252 280', 'M238 320 L250 320'] },
    small: [152, 250, 96],
  },
};

const PRODUCTS = [
  { id: 'tee', cat: 'tops', name: 'pTee', desc: 'dTee', colors: ['black', 'graphite', 'white', 'coral'], sizes: APPAREL },
  { id: 'tank', cat: 'tops', name: 'pTank', desc: 'dTank', colors: ['black', 'white', 'coral'], sizes: APPAREL },
  { id: 'hoodie', cat: 'tops', name: 'pHoodie', desc: 'dHoodie', colors: ['black', 'graphite', 'coral'], sizes: APPAREL },
  { id: 'joggers', cat: 'bottoms', name: 'pJoggers', desc: 'dJoggers', colors: ['black', 'graphite'], sizes: APPAREL },
  { id: 'shorts', cat: 'bottoms', name: 'pShorts', desc: 'dShorts', colors: ['black', 'graphite'], sizes: APPAREL },
  { id: 'cap', cat: 'extras', name: 'pCap', desc: 'dCap', colors: ['black', 'coral'], sizes: null },
  { id: 'bag', cat: 'extras', name: 'pBag', desc: 'dBag', colors: ['black', 'graphite'], sizes: null },
  { id: 'towel', cat: 'extras', name: 'pTowel', desc: 'dTowel', colors: ['black', 'white'], sizes: null },
  { id: 'shaker', cat: 'extras', name: 'pShaker', desc: 'dShaker', colors: ['black', 'coral'], sizes: null },
];

function light(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6;
}

function svg(p, view, colorKey, label) {
  const s = SHAPES[p.id];
  const c = COLORS[colorKey];
  const isLight = light(c);
  const line = isLight ? 'rgba(0,0,0,.30)' : 'rgba(0,0,0,.55)';
  const seam = isLight ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.10)';
  const deep = isLight ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.28)';
  const gid = `g-${p.id}-${view}`;
  const body = s[view] || s.front;
  const extra = (k) => (s[k] && s[k][view]) || null;
  const lines = [...((s.seams && s.seams[view]) || []), ...((s.seams && s.seams.both) || [])];
  const print = isLight ? 'img/emblem-dark.png' : 'img/emblem-light.png';
  const text = colorKey === 'coral' ? '#16171b' : '#e5484d';
  let out = `<svg viewBox="0 0 400 440" role="img" aria-label="${label}">
<defs><linearGradient id="${gid}" x1="0" x2="1" y1="0" y2="0.3">
<stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/>
<stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>`;
  const shape = (d, fill) =>
    `<path d="${d}" fill="${fill}" stroke="${line}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="url(#${gid})"/>`;
  if (s.handle) out += `<path d="${s.handle}" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/><path d="${s.handle}" fill="none" stroke="${line}" stroke-width="2"/>`;
  if (s.top) out += shape(s.top, c);
  if (extra('under')) out += shape(extra('under'), c);
  out += shape(body, c);
  if (extra('inner')) out += `<path d="${extra('inner')}" fill="${deep}"/>`;
  for (const d of lines) out += `<path d="${d}" fill="none" stroke="${seam}" stroke-width="3" stroke-linecap="round"/>`;
  if (extra('over')) out += shape(extra('over'), c) + `<path d="${extra('over')}" fill="${deep}"/>`;
  for (const [x, y, r] of s.dots || []) out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${line}" stroke-width="2"/>`;
  if (view === 'back' && s.big) {
    const [x, y, w, h] = s.big;
    out += `<image href="img/mascot.webp" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    out += `<path id="a-${p.id}" d="${s.arc}" fill="none"/>`;
    out += `<text font-family="Barlow Condensed, Barlow, sans-serif" font-weight="700" font-size="34" letter-spacing="3" fill="${text}"><textPath href="#a-${p.id}" startOffset="50%" text-anchor="middle">RAIDMATE</textPath></text>`;
  } else {
    const [x, y, size] = s.small;
    out += `<image href="${print}" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
  }
  return out + '</svg>';
}

function t(key) {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'hu';
  return (TEXTS[lang][key] || key).replaceAll('{brand}', BRAND.name);
}

const state = {};
let filter = 'all';

function mailto(p) {
  const st = state[p.id];
  const fill = (s) => s
    .replaceAll('{product}', t(p.name))
    .replaceAll('{color}', t(`c_${st.color}`))
    .replaceAll('{size}', p.sizes ? st.size : t('shopOneSize'));
  const subject = fill(t('mailSubject'));
  const body = fill(t('mailBody'));
  return `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function card(p) {
  const st = (state[p.id] ||= { view: 'front', color: p.colors[0], size: 'M' });
  const hasBack = Boolean(SHAPES[p.id].big);
  const el = document.createElement('article');
  el.className = 'item';
  el.hidden = filter !== 'all' && filter !== p.cat;
  const viewLabel = st.view === 'back' ? t('shopBack') : t('shopFront');
  el.innerHTML = `
    <div class="pic">${svg(p, st.view, st.color, `${t(p.name)}, ${t(`c_${st.color}`)}, ${viewLabel}`)}
      ${hasBack ? `<div class="views" role="group">
        <button type="button" data-view="front" aria-pressed="${st.view === 'front'}">${t('shopFront')}</button>
        <button type="button" data-view="back" aria-pressed="${st.view === 'back'}">${t('shopBack')}</button></div>` : ''}
    </div>
    <div class="info">
      <div class="head"><h3>${t(p.name)}</h3><span class="soon">${t('shopSoon')}</span></div>
      <p>${t(p.desc)}</p>
      <div class="row"><span class="lbl">${t('shopColor')}</span>
        <div class="swatches">${p.colors.map((k) => `<button type="button" class="sw" data-color="${k}" style="--c:${COLORS[k]}" title="${t(`c_${k}`)}" aria-label="${t(`c_${k}`)}" aria-pressed="${st.color === k}"></button>`).join('')}</div>
      </div>
      <div class="row">
        ${p.sizes
          ? `<label class="lbl" for="sz-${p.id}">${t('shopSize')}</label>
             <select id="sz-${p.id}">${p.sizes.map((s) => `<option${s === st.size ? ' selected' : ''}>${s}</option>`).join('')}</select>`
          : `<span class="lbl">${t('shopSize')}</span><span class="one">${t('shopOneSize')}</span>`}
        <a class="btn primary ask" href="${mailto(p)}"><span class="mi i-mail-outline"></span>${t('shopAsk')}</a>
      </div>
    </div>`;
  el.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => {
    st.view = b.dataset.view;
    el.replaceWith(card(p));
  }));
  el.querySelectorAll('[data-color]').forEach((b) => b.addEventListener('click', () => {
    st.color = b.dataset.color;
    el.replaceWith(card(p));
  }));
  const sel = el.querySelector('select');
  if (sel) sel.addEventListener('change', () => {
    st.size = sel.value;
    el.querySelector('.ask').href = mailto(p);
  });
  return el;
}

function render() {
  const grid = document.getElementById('grid');
  grid.replaceChildren(...PRODUCTS.map(card));
  document.querySelectorAll('[data-filter]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
  });
}

document.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
  filter = b.dataset.filter;
  render();
}));
// Nyelvváltáskor (i18n.js) újra.
new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
render();
