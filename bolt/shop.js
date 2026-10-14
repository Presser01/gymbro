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

// Ruhaformák a 400×440-es rajzlapon (kiterített termékfotó-nézet).
//   parts:   a darab részei (a körvonal, a vágómaszk és az alapszín)
//   inner:   a darab belseje, ahol belelátni (sötétebb)
//   ribs:    bordázott pántok (gallér, mandzsetta, derék): [út, szélesség]
//   seams:   varrásvonalak; stitches: látható tűzés (szaggatott)
//   folds:   gyűrődések árnyéka; lights: a gyűrődések fénye
//   extra:   kiegészítő rajz (zsinór, cipzár, gomb, skála)
//   small:   a kis nyomat helye [x, y, méret]; big + arc: a hátminta
const SHAPES = {
  tee: {
    parts: {
      front: ['M140 42 C160 64 240 64 260 42 L300 52 C318 58 330 66 342 80 L382 134 C386 140 384 146 378 150 L338 176 C332 180 326 178 322 172 L298 140 C296 200 298 300 302 404 C302 412 296 416 288 417 C230 422 170 422 112 417 C104 416 98 412 98 404 C102 300 104 200 102 140 L78 172 C74 178 68 180 62 176 L22 150 C16 146 14 140 18 134 L58 80 C70 66 82 58 100 52 Z'],
      back: ['M140 42 C165 52 235 52 260 42 L300 52 C318 58 330 66 342 80 L382 134 C386 140 384 146 378 150 L338 176 C332 180 326 178 322 172 L298 140 C296 200 298 300 302 404 C302 412 296 416 288 417 C230 422 170 422 112 417 C104 416 98 412 98 404 C102 300 104 200 102 140 L78 172 C74 178 68 180 62 176 L22 150 C16 146 14 140 18 134 L58 80 C70 66 82 58 100 52 Z'],
    },
    inner: { front: ['M140 42 C165 52 235 52 260 42 C240 64 160 64 140 42 Z'] },
    ribs: { front: [['M141 45 C162 66 238 66 259 45', 9]], back: [['M141 45 C166 54 234 54 259 45', 9]] },
    seams: { both: ['M100 52 C104 82 104 112 102 140', 'M300 52 C296 82 296 112 298 140'] },
    stitches: { both: ['M104 404 C170 410 230 410 296 404', 'M64 168 L28 144', 'M336 168 L372 144'] },
    folds: ['M118 168 C140 210 142 250 132 300', 'M282 168 C262 214 262 256 270 306', 'M170 352 C200 360 222 358 244 350', 'M62 120 C80 134 92 146 100 160'],
    lights: ['M128 176 C150 214 152 252 144 296', 'M160 352 C196 362 226 360 252 350'],
    small: [234, 92, 46],
    big: [118, 86, 164, 172],
    arc: 'M120 284 Q200 318 280 284',
  },
  tank: {
    parts: {
      front: ['M150 42 C168 72 232 72 250 42 L272 46 C276 92 290 128 318 146 C322 150 322 156 322 162 C318 250 318 330 322 404 C322 412 316 416 308 417 C236 422 164 422 92 417 C84 416 78 412 78 404 C82 330 82 250 78 162 C78 156 78 150 82 146 C110 128 124 92 128 46 Z'],
      back: ['M150 42 C168 56 232 56 250 42 L272 46 C276 92 290 128 318 146 C322 150 322 156 322 162 C318 250 318 330 322 404 C322 412 316 416 308 417 C236 422 164 422 92 417 C84 416 78 412 78 404 C82 330 82 250 78 162 C78 156 78 150 82 146 C110 128 124 92 128 46 Z'],
    },
    inner: { front: ['M150 42 C168 56 232 56 250 42 C232 72 168 72 150 42 Z'] },
    ribs: {
      front: [['M151 45 C169 74 231 74 249 45', 8]],
      back: [['M151 45 C169 58 231 58 249 45', 8]],
      both: [['M129 48 C125 94 111 128 84 146', 8], ['M271 48 C275 94 289 128 316 146', 8]],
    },
    stitches: { both: ['M84 404 C160 410 240 410 316 404'] },
    folds: ['M100 190 C118 240 116 290 104 340', 'M300 190 C282 240 284 290 296 340', 'M170 362 C196 370 214 370 236 362'],
    lights: ['M112 200 C128 244 126 290 116 334'],
    small: [226, 104, 44],
    big: [124, 96, 152, 160],
    arc: 'M124 286 Q200 318 276 286',
  },
  hoodie: {
    parts: {
      front: [
        'M138 60 C126 34 140 6 200 4 C260 6 274 34 262 60 C240 78 160 78 138 60 Z',
        'M148 54 C170 70 230 70 252 54 L300 62 C318 66 330 76 340 92 L372 196 C380 236 386 300 388 344 C388 352 382 356 374 357 L344 360 C336 360 332 356 330 348 L312 236 C312 296 312 352 314 400 C314 410 308 414 300 415 C234 420 166 420 100 415 C92 414 86 410 86 400 C88 352 88 296 88 236 L70 348 C68 356 64 360 56 360 L26 357 C18 356 12 352 12 344 C14 300 20 236 28 196 L60 92 C70 76 82 66 100 62 Z',
      ],
      back: [
        'M148 54 C170 64 230 64 252 54 L300 62 C318 66 330 76 340 92 L372 196 C380 236 386 300 388 344 C388 352 382 356 374 357 L344 360 C336 360 332 356 330 348 L312 236 C312 296 312 352 314 400 C314 410 308 414 300 415 C234 420 166 420 100 415 C92 414 86 410 86 400 C88 352 88 296 88 236 L70 348 C68 356 64 360 56 360 L26 357 C18 356 12 352 12 344 C14 300 20 236 28 196 L60 92 C70 76 82 66 100 62 Z',
        'M136 62 C124 30 140 6 200 4 C260 6 276 30 264 62 C266 112 246 140 200 146 C154 140 134 112 136 62 Z',
      ],
    },
    inner: { front: ['M154 56 C150 32 168 18 200 18 C232 18 250 32 246 56 C226 70 174 70 154 56 Z'] },
    ribs: { both: [['M90 398 C160 406 240 406 310 398', 20], ['M18 342 L66 346', 18], ['M334 346 L382 342', 18]] },
    seams: { front: ['M200 6 L200 18'], back: ['M200 6 C202 60 202 110 200 146'] },
    stitches: {
      front: ['M134 296 C162 290 238 290 266 296 L286 370 C230 376 170 376 114 370 Z', 'M150 296 L130 368', 'M250 296 L270 368'],
      both: ['M60 92 C64 160 72 220 88 236', 'M340 92 C336 160 328 220 312 236'],
    },
    folds: ['M96 240 C120 270 124 310 112 350', 'M304 240 C280 270 276 310 288 350', 'M40 220 C52 260 60 300 64 336', 'M360 220 C348 260 340 300 336 336', 'M170 150 C190 170 210 170 230 150'],
    lights: ['M108 250 C128 280 130 312 122 344', 'M50 228 C60 262 66 296 70 330'],
    extra: { front: 'cords' },
    small: [234, 104, 44],
    big: [124, 152, 152, 160],
    arc: 'M124 334 Q200 364 276 334',
  },
  joggers: {
    parts: { front: ['M120 40 C170 36 230 36 280 40 L286 72 C292 160 298 280 304 376 L306 410 C306 416 302 420 296 420 L228 420 C222 420 218 416 218 410 L214 376 C210 300 206 220 202 176 C201 170 199 170 198 176 C194 220 190 300 186 376 L182 410 C182 416 178 420 172 420 L104 420 C98 420 94 416 94 410 L96 376 C102 280 108 160 114 72 Z'] },
    ribs: { both: [['M118 56 C170 52 230 52 282 56', 28], ['M98 396 L184 396', 26], ['M216 396 L304 396', 26]] },
    seams: { both: ['M200 72 L200 176', 'M124 80 C142 112 142 140 128 168', 'M276 80 C258 112 258 140 272 168'] },
    stitches: { both: ['M200 72 C202 120 202 150 200 176'] },
    folds: ['M120 250 C140 268 150 290 146 316', 'M280 250 C260 268 250 290 254 316', 'M110 180 C126 200 132 222 128 244', 'M290 180 C274 200 268 222 272 244', 'M140 350 C150 362 164 370 176 372', 'M260 350 C250 362 236 370 224 372'],
    lights: ['M130 254 C148 272 156 292 152 312', 'M270 254 C252 272 244 292 248 312'],
    extra: { front: 'drawcord' },
    small: [234, 112, 40],
  },
  shorts: {
    parts: { front: ['M112 70 C170 66 230 66 288 70 L294 98 C300 150 306 210 314 262 C315 268 312 272 306 273 L218 280 C212 280 208 276 207 270 L201 182 C200 178 200 178 199 182 L193 270 C192 276 188 280 182 280 L94 273 C88 272 85 268 86 262 C94 210 100 150 106 98 Z'] },
    ribs: { both: [['M110 84 C170 80 230 80 290 84', 28]] },
    seams: { both: ['M200 98 L200 182', 'M114 106 C130 132 130 152 118 176', 'M286 106 C270 132 270 152 282 176'] },
    stitches: { both: ['M92 262 L186 270', 'M214 270 L308 262'] },
    folds: ['M118 200 C136 220 142 240 138 262', 'M282 200 C264 220 258 240 262 262', 'M186 200 C192 220 194 240 192 262'],
    lights: ['M128 206 C144 224 150 242 148 258'],
    extra: { front: 'shortcord' },
    small: [238, 146, 36],
  },
  cap: {
    parts: {
      front: [
        'M92 252 C88 150 130 100 200 96 C270 100 312 150 308 252 Z',
        'M98 246 C140 234 260 234 302 246 C324 262 318 300 200 312 C82 300 76 262 98 246 Z',
      ],
    },
    inner: { front: ['M98 246 C140 234 260 234 302 246 C292 256 260 262 200 262 C140 262 108 256 98 246 Z'] },
    seams: { both: ['M200 98 L200 244', 'M196 98 C150 120 128 180 132 244', 'M204 98 C250 120 272 180 268 244'] },
    stitches: { both: ['M108 266 C150 256 250 256 292 266', 'M104 278 C150 268 250 268 296 278', 'M110 238 C150 226 250 226 290 238'] },
    folds: ['M110 160 C120 200 124 230 122 248', 'M290 160 C280 200 276 230 278 248'],
    lights: ['M150 120 C170 140 176 170 172 210'],
    extra: { front: 'button' },
    small: [164, 140, 72],
  },
  bag: {
    parts: {
      front: ['M52 214 C52 176 84 160 120 160 L280 160 C316 160 348 176 348 214 L348 352 C348 368 336 376 320 376 L80 376 C64 376 52 368 52 352 Z'],
    },
    inner: { front: ['M52 340 L348 340 L348 352 C348 368 336 376 320 376 L80 376 C64 376 52 368 52 352 Z'] },
    ribs: { front: [['M86 172 C150 162 250 162 314 172', 7]] },
    stitches: { both: ['M62 214 C62 184 88 172 120 172 L280 172 C312 172 338 184 338 214 L338 350', 'M62 214 L62 350', 'M52 340 L348 340'] },
    folds: ['M90 240 C120 260 130 300 120 330', 'M310 240 C280 260 270 300 280 330'],
    lights: ['M100 200 C150 190 250 190 300 200'],
    extra: { front: 'handles' },
    small: [148, 226, 104],
  },
  towel: {
    parts: {
      front: [
        'M74 150 L326 150 C334 150 338 156 338 164 L338 352 C338 360 332 366 324 366 L76 366 C68 366 62 360 62 352 L62 164 C62 156 66 150 74 150 Z',
        'M62 164 C62 156 66 150 74 150 L326 150 C334 150 338 156 338 164 L338 214 C250 226 150 226 62 214 Z',
      ],
    },
    ribs: { both: [['M62 322 L338 322', 10], ['M62 340 L338 340', 6]] },
    seams: { both: ['M62 214 C150 226 250 226 338 214'] },
    folds: ['M62 228 C150 240 250 240 338 228', 'M120 260 C160 300 170 330 160 360'],
    lights: ['M70 170 L330 170'],
    tex: 'terry',
    small: [262, 244, 58],
  },
  shaker: {
    parts: {
      front: [
        'M134 140 L266 140 C262 240 258 330 256 400 C256 410 248 416 238 417 C214 420 186 420 162 417 C152 416 144 410 144 400 C142 330 138 240 134 140 Z',
        'M132 98 L268 98 C272 98 274 102 274 106 L272 140 L128 140 L126 106 C126 102 128 98 132 98 Z',
        'M170 70 L230 70 C234 70 236 74 236 78 L238 98 L162 98 L164 78 C164 74 166 70 170 70 Z',
      ],
    },
    ribs: { both: [['M128 120 L272 120', 30]] },
    seams: { both: ['M134 140 L266 140', 'M128 98 L272 98'] },
    folds: [],
    lights: ['M152 160 C150 240 152 330 158 400', 'M244 170 C246 240 246 320 242 390'],
    extra: { front: 'scale' },
    tex: 'plastic',
    small: [152, 236, 96],
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

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function light(hex) {
  return luminance(hex) > 0.6;
}

function svg(p, view, colorKey, label) {
  const s = SHAPES[p.id];
  const c = COLORS[colorKey];
  const isLight = light(c);
  const id = `${p.id}-${view}`;
  const parts = s.parts[view] || s.parts.front;
  const pick = (k) => [...((s[k] && s[k][view]) || []), ...((s[k] && s[k].both) || [])];
  // Sötét anyagon a gyűrődés feketébb, a fény halványabb; világoson fordítva.
  // (a fekete mély árnyékot kap, a grafit és a korall halványabbat)
  const shadow = isLight ? 'rgba(40,30,20,.16)' : `rgba(0,0,0,${luminance(c) < 0.15 ? 0.5 : 0.24})`;
  const shine = isLight ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.08)';
  const rib = isLight ? 'rgba(0,0,0,.10)' : 'rgba(255,255,255,.07)';
  const ribBase = isLight ? 'rgba(0,0,0,.05)' : 'rgba(0,0,0,.25)';
  const seam = isLight ? 'rgba(0,0,0,.14)' : 'rgba(0,0,0,.45)';
  const stitch = isLight ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.20)';
  const edge = isLight ? 'rgba(0,0,0,.22)' : 'rgba(0,0,0,.6)';
  const deep = isLight ? 'rgba(0,0,0,.10)' : 'rgba(0,0,0,.38)';
  const print = isLight ? 'img/emblem-dark.png' : 'img/emblem-light.png';
  const text = colorKey === 'coral' ? '#16171b' : '#e5484d';
  const freq = s.tex === 'terry' ? 1.6 : s.tex === 'plastic' ? 0.25 : 0.95;
  const grain = s.tex === 'plastic' ? 0.02 : s.tex === 'terry' ? 0.12 : isLight ? 0.07 : 0.06;

  let o = `<svg viewBox="0 0 400 440" role="img" aria-label="${label}"><defs>
<clipPath id="c-${id}">${parts.map((d) => `<path d="${d}"/>`).join('')}</clipPath>
<linearGradient id="h-${id}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/>
<stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/>
<stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
<linearGradient id="v-${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${isLight ? 0.25 : 0.06}"/>
<stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
<filter id="b-${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="t-${id}" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="11"/>
<feColorMatrix values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 ${grain}"/></filter>
</defs>`;
  // 1) alapszín
  for (const d of parts) o += `<path d="${d}" fill="${c}"/>`;
  o += `<g clip-path="url(#c-${id})">`;
  // 2) a nyomat (az árnyékok és a textúra ráterül, mintha bele lenne nyomva)
  if (view === 'back' && s.big) {
    const [x, y, w, h] = s.big;
    o += `<image href="img/mascot.webp" x="${x}" y="${y}" width="${w}" height="${h}" opacity=".96"/>`;
    o += `<path id="a-${id}" d="${s.arc}" fill="none"/>`;
    o += `<text font-family="Barlow Condensed, Barlow, sans-serif" font-weight="700" font-size="34" letter-spacing="3" fill="${text}" opacity=".95"><textPath href="#a-${id}" startOffset="50%" text-anchor="middle">RAIDMATE</textPath></text>`;
  } else {
    const [x, y, size] = s.small;
    o += `<image href="${print}" x="${x}" y="${y}" width="${size}" height="${size}" opacity=".94"/>`;
  }
  // 3) fény-árnyék: oldalt sötétebb, felül fényesebb, lent árnyék
  o += `<rect width="400" height="440" fill="url(#h-${id})"/><rect width="400" height="440" fill="url(#v-${id})"/>`;
  o += `<ellipse cx="185" cy="150" rx="120" ry="90" fill="#fff" opacity="${isLight ? 0.35 : 0.05}" filter="url(#b-${id})"/>`;
  // 4) gyűrődések
  for (const d of s.folds) o += `<path d="${d}" fill="none" stroke="${shadow}" stroke-width="14" stroke-linecap="round" filter="url(#b-${id})"/>`;
  for (const d of s.lights) o += `<path d="${d}" fill="none" stroke="${shine}" stroke-width="10" stroke-linecap="round" filter="url(#b-${id})"/>`;
  // 5) a belső rész, bordázott pántok, varrások, tűzések
  for (const d of pick('inner')) o += `<path d="${d}" fill="${deep}"/>`;
  for (const [d, w] of pick('ribs')) {
    o += `<path d="${d}" fill="none" stroke="${ribBase}" stroke-width="${w}" stroke-linecap="round"/>`;
    o += `<path d="${d}" fill="none" stroke="${rib}" stroke-width="${w - 2}" stroke-dasharray="1.6 2.6"/>`;
  }
  for (const d of pick('seams')) o += `<path d="${d}" fill="none" stroke="${seam}" stroke-width="2" stroke-linecap="round"/>`;
  for (const d of pick('stitches')) o += `<path d="${d}" fill="none" stroke="${stitch}" stroke-width="1.3" stroke-dasharray="4 3"/>`;
  // 6) anyagtextúra
  o += `<rect width="400" height="440" fill="#888" filter="url(#t-${id})"/>`;
  o += '</g>';
  // 7) kiegészítők a darabon kívül is
  o += extra(s.extra && s.extra[view], c, isLight, id);
  // 8) körvonal
  for (const d of parts) o += `<path d="${d}" fill="none" stroke="${edge}" stroke-width="1.6" stroke-linejoin="round"/>`;
  return o + '</svg>';
}

// Zsinórok, fogantyúk, gomb, skála: ezek a darab szélén túl is lóghatnak.
function extra(kind, c, isLight, id) {
  const cord = isLight ? '#d9d6cf' : '#e9e6df';
  const tip = '#8f939c';
  const line = 'rgba(0,0,0,.35)';
  const lace = (x0, y0, x1, y1, x2, y2) =>
    `<path d="M${x0} ${y0} C${x1} ${y1} ${x1} ${y1} ${x2} ${y2}" fill="none" stroke="${cord}" stroke-width="4" stroke-linecap="round"/>` +
    `<rect x="${x2 - 3}" y="${y2}" width="6" height="14" rx="2" fill="${tip}" stroke="${line}"/>`;
  switch (kind) {
    case 'cords':
      return lace(184, 70, 180, 110, 176, 146) + lace(216, 70, 220, 110, 224, 146);
    case 'drawcord':
      return lace(194, 64, 188, 96, 184, 124) + lace(206, 64, 212, 96, 216, 124);
    case 'shortcord':
      return lace(194, 92, 190, 118, 186, 140) + lace(206, 92, 210, 118, 214, 140);
    case 'button':
      return `<circle cx="200" cy="97" r="8" fill="${c}" stroke="${line}" stroke-width="1.5"/><circle cx="200" cy="95" r="3" fill="#fff" opacity=".12"/>`;
    case 'handles': {
      const strap = (d) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="18" stroke-linecap="round"/>` +
        `<path d="${d}" fill="none" stroke="${line}" stroke-width="18" stroke-linecap="round" opacity=".35"/>` +
        `<path d="${d}" fill="none" stroke="${isLight ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.25)'}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
      return strap('M146 166 C146 96 254 96 254 166') +
        `<rect x="132" y="156" width="28" height="30" rx="5" fill="${c}" stroke="${line}"/><rect x="240" y="156" width="28" height="30" rx="5" fill="${c}" stroke="${line}"/>` +
        `<rect x="296" y="162" width="20" height="12" rx="3" fill="${tip}" stroke="${line}"/><path d="M306 174 L306 196" stroke="${tip}" stroke-width="3"/>`;
    }
    case 'scale': {
      let s = '';
      for (let i = 0; i < 6; i++) {
        const y = 190 + i * 34;
        s += `<path d="M238 ${y} L${i % 2 ? 248 : 254} ${y}" stroke="${isLight ? 'rgba(0,0,0,.35)' : 'rgba(255,255,255,.4)'}" stroke-width="2"/>`;
        if (i % 2 === 0) s += `<text x="232" y="${y + 4}" font-family="Barlow, sans-serif" font-size="10" text-anchor="end" fill="${isLight ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.45)'}">${700 - i * 100}</text>`;
      }
      return s;
    }
    default:
      return '';
  }
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
