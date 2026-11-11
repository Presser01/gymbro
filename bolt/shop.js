// A Raidmate bolt (Tamás kérése, 2026-10-14): katalógus fizetés nélkül.
// 2026-11-11: minták (Minimál, Kis logó, Felirat, Kabala, Strength Club,
// Tárcsa; a nyomatokon csak angol szöveg), hengeres sporttáska, hátizsák,
// telefontok; a táskák és a shaker körbeforgathatók (elhúzással), a felsők
// elöl/hátul fordulnak. A
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
    ground: [424, 120],
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
    mini: [236, 112, 11, 'start'],
    word: [200, 150, 40],
    big: [118, 86, 164, 172],
    arc: 'M120 284 Q200 318 280 284',
  },
  tank: {
    ground: [424, 110],
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
    mini: [226, 124, 10, 'start'],
    word: [200, 172, 36],
    big: [124, 96, 152, 160],
    arc: 'M124 286 Q200 318 276 286',
  },
  hoodie: {
    ground: [420, 130],
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
    mini: [234, 124, 11, 'start'],
    word: [200, 214, 38],
    big: [124, 152, 152, 160],
    arc: 'M124 334 Q200 364 276 334',
  },
  joggers: {
    ground: [426, 110],
    parts: { front: ['M120 40 C170 36 230 36 280 40 L286 72 C292 160 298 280 304 376 L306 410 C306 416 302 420 296 420 L228 420 C222 420 218 416 218 410 L214 376 C210 300 206 220 202 176 C201 170 199 170 198 176 C194 220 190 300 186 376 L182 410 C182 416 178 420 172 420 L104 420 C98 420 94 416 94 410 L96 376 C102 280 108 160 114 72 Z'] },
    ribs: { both: [['M118 56 C170 52 230 52 282 56', 28], ['M98 396 L184 396', 26], ['M216 396 L304 396', 26]] },
    seams: { both: ['M200 72 L200 176', 'M124 80 C142 112 142 140 128 168', 'M276 80 C258 112 258 140 272 168'] },
    stitches: { both: ['M200 72 C202 120 202 150 200 176'] },
    folds: ['M120 250 C140 268 150 290 146 316', 'M280 250 C260 268 250 290 254 316', 'M110 180 C126 200 132 222 128 244', 'M290 180 C274 200 268 222 272 244', 'M140 350 C150 362 164 370 176 372', 'M260 350 C250 362 236 370 224 372'],
    lights: ['M130 254 C148 272 156 292 152 312', 'M270 254 C252 272 244 292 248 312'],
    extra: { front: 'drawcord' },
    small: [234, 112, 40],
    mini: [234, 140, 10, 'start'],
  },
  shorts: {
    ground: [284, 110],
    parts: { front: ['M112 70 C170 66 230 66 288 70 L294 98 C300 150 306 210 314 262 C315 268 312 272 306 273 L218 280 C212 280 208 276 207 270 L201 182 C200 178 200 178 199 182 L193 270 C192 276 188 280 182 280 L94 273 C88 272 85 268 86 262 C94 210 100 150 106 98 Z'] },
    ribs: { both: [['M110 84 C170 80 230 80 290 84', 28]] },
    seams: { both: ['M200 98 L200 182', 'M114 106 C130 132 130 152 118 176', 'M286 106 C270 132 270 152 282 176'] },
    stitches: { both: ['M92 262 L186 270', 'M214 270 L308 262'] },
    folds: ['M118 200 C136 220 142 240 138 262', 'M282 200 C264 220 258 240 262 262', 'M186 200 C192 220 194 240 192 262'],
    lights: ['M128 206 C144 224 150 242 148 258'],
    extra: { front: 'shortcord' },
    small: [238, 146, 36],
    mini: [236, 172, 10, 'start'],
  },
  cap: {
    ground: [318, 115],
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
    word: [200, 196, 24, true],
  },
  // Hengeres sporttáska (2026-11-11; a régi laptoptáskára hasonlított).
  bag: {
    ground: { front: [362, 170], back: [362, 170], side: [362, 92] },
    parts: {
      front: ['M78 176 L322 176 C350 176 368 198 368 226 L368 312 C368 338 350 356 322 356 L78 356 C50 356 32 338 32 312 L32 226 C32 198 50 176 78 176 Z'],
      side: ['M110 266 A90 90 0 1 0 290 266 A90 90 0 1 0 110 266 Z'],
    },
    inner: {
      front: [
        'M78 176 C50 176 32 198 32 226 L32 312 C32 338 50 356 78 356 C66 338 60 300 60 266 C60 232 66 196 78 176 Z',
        'M322 176 C350 176 368 198 368 226 L368 312 C368 338 350 356 322 356 C334 338 340 300 340 266 C340 232 334 196 322 176 Z',
      ],
      back: [
        'M78 176 C50 176 32 198 32 226 L32 312 C32 338 50 356 78 356 C66 338 60 300 60 266 C60 232 66 196 78 176 Z',
        'M322 176 C350 176 368 198 368 226 L368 312 C368 338 350 356 322 356 C334 338 340 300 340 266 C340 232 334 196 322 176 Z',
      ],
    },
    ribs: { front: [['M86 192 L314 192', 6]], back: [['M86 192 L314 192', 6]], side: [['M110 266 A90 90 0 1 0 290 266 A90 90 0 1 0 110 266', 5]] },
    seams: { front: ['M40 330 L360 330'], back: ['M40 330 L360 330'] },
    stitches: {
      back: ['M112 226 L288 226 L288 312 L112 312 Z'],
      side: ['M126 266 A74 74 0 1 0 274 266 A74 74 0 1 0 126 266'],
    },
    folds: { front: ['M120 220 C150 260 150 300 132 340', 'M280 220 C250 260 250 300 268 340'], back: ['M120 220 C150 260 150 300 132 340'], side: ['M132 300 C150 330 190 344 232 338'] },
    lights: { front: ['M100 208 L300 208'], back: ['M100 208 L300 208'], side: ['M150 206 C170 194 200 190 228 194'] },
    extra: { front: 'duffel', back: 'duffel', side: 'duffelSide' },
    small: [172, 236, 56],
  },
  backpack: {
    ground: { front: [420, 96], back: [420, 96], side: [420, 60] },
    parts: {
      front: [
        'M128 108 C128 70 160 52 200 52 C240 52 272 70 272 108 L286 384 C287 402 274 414 256 414 L144 414 C126 414 113 402 114 384 Z',
        'M136 262 C136 250 146 244 158 244 L242 244 C254 244 264 250 264 262 L270 384 C270 396 262 402 250 402 L150 402 C138 402 130 396 130 384 Z',
      ],
      side: [
        'M176 96 C176 72 192 60 210 62 C238 66 250 96 252 132 L262 386 C263 404 250 414 232 414 L190 414 C172 414 162 404 162 388 Z',
        'M166 300 L256 300 L260 388 C260 402 252 410 236 410 L186 410 C172 410 166 402 166 390 Z',
      ],
      back: ['M128 108 C128 70 160 52 200 52 C240 52 272 70 272 108 L286 384 C287 402 274 414 256 414 L144 414 C126 414 113 402 114 384 Z'],
    },
    inner: { back: ['M146 122 C146 106 160 98 176 98 L224 98 C240 98 254 106 254 122 L262 360 C262 374 254 382 240 382 L160 382 C146 382 138 374 138 360 Z'] },
    ribs: { front: [['M140 118 C150 82 250 82 260 118', 5], ['M142 256 L258 256', 5]], side: [['M168 302 L256 302', 4]] },
    stitches: { front: ['M122 380 C160 386 240 386 278 380'], back: ['M150 130 L250 130', 'M150 350 L250 350'] },
    folds: { front: ['M150 160 C160 200 160 228 150 246', 'M250 160 C240 200 240 228 250 246'], side: ['M200 140 C210 190 212 240 206 290'], back: ['M150 160 C160 200 160 240 150 280'] },
    lights: { front: ['M162 88 C180 74 220 74 238 88'], side: ['M190 84 C200 76 214 74 226 80'], back: ['M162 88 C180 74 220 74 238 88'] },
    extra: { front: 'pack', side: 'packSide', back: 'packBack' },
    small: [176, 296, 48],
  },
  case: {
    ground: [442, 100],
    parts: { front: ['M128 30 L272 30 C292 30 306 44 306 64 L306 406 C306 426 292 438 272 438 L128 438 C108 438 94 426 94 406 L94 64 C94 44 108 30 128 30 Z'] },
    stitches: {},
    folds: [],
    lights: ['M104 70 L104 400', 'M296 70 L296 400'],
    extra: { front: 'camera' },
    tex: 'plastic',
    small: [164, 220, 72],
    mini: [200, 404, 11, 'middle'],
    word: [200, 270, 40],
    big: [110, 170, 180, 190],
    arc: 'M118 386 Q200 408 282 386',
  },
  towel: {
    ground: [372, 150],
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
    ground: [424, 62],
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
    extra: { side: 'scale' },
    tex: 'plastic',
    small: [160, 236, 80],
  },
};

// Minták: mi kerül elöl (front) és hátul (back). Nyomatfajták: mini (apró
// felirat), emblem (kis jelvény), word (RAID/MATE felirat), mascot (kabala),
// club (Strength Club pajzs), plate (súlytárcsa körirattal).
const DESIGNS = {
  minimal: { front: 'mini' },
  logo: { front: 'emblem' },
  word: { front: 'word' },
  mascot: { front: 'emblem', back: 'mascot' },
  club: { front: 'mini', back: 'club' },
  plate: { front: 'emblem', back: 'plate' },
};
// A telefontokon minden elöl (a tok hátlapja a „front”).
const CASE_DESIGNS = {
  minimal: { front: 'mini' },
  logo: { front: 'emblem' },
  plate: { front: 'plate' },
  club: { front: 'club' },
  mascot: { front: 'mascot' },
};
const TOPS = ['minimal', 'logo', 'word', 'mascot', 'club', 'plate'];
const FLIP = ['front', 'back'];
const ROUND = ['front', 'side', 'back', 'side2'];

const PRODUCTS = [
  { id: 'tee', cat: 'tops', name: 'pTee', desc: 'dTee', colors: ['black', 'graphite', 'white', 'coral'], sizes: APPAREL, designs: TOPS, design: 'mascot', views: FLIP },
  { id: 'tank', cat: 'tops', name: 'pTank', desc: 'dTank', colors: ['black', 'white', 'coral'], sizes: APPAREL, designs: TOPS, design: 'minimal', views: FLIP },
  { id: 'hoodie', cat: 'tops', name: 'pHoodie', desc: 'dHoodie', colors: ['black', 'graphite', 'coral'], sizes: APPAREL, designs: TOPS, design: 'club', views: FLIP },
  { id: 'joggers', cat: 'bottoms', name: 'pJoggers', desc: 'dJoggers', colors: ['black', 'graphite'], sizes: APPAREL, designs: ['minimal', 'logo'], design: 'logo' },
  { id: 'shorts', cat: 'bottoms', name: 'pShorts', desc: 'dShorts', colors: ['black', 'graphite'], sizes: APPAREL, designs: ['minimal', 'logo'], design: 'logo' },
  { id: 'cap', cat: 'extras', name: 'pCap', desc: 'dCap', colors: ['black', 'coral'], sizes: null, designs: ['logo', 'word'], design: 'logo' },
  { id: 'bag', cat: 'extras', name: 'pBag', desc: 'dBag', colors: ['black', 'graphite'], sizes: null, views: ROUND },
  { id: 'backpack', cat: 'extras', name: 'pBackpack', desc: 'dBackpack', colors: ['black', 'graphite', 'coral'], sizes: null, views: ROUND },
  { id: 'case', cat: 'extras', name: 'pCase', desc: 'dCase', colors: ['black', 'graphite', 'coral', 'white'], sizes: null, designs: Object.keys(CASE_DESIGNS), design: 'logo', designMap: CASE_DESIGNS },
  { id: 'towel', cat: 'extras', name: 'pTowel', desc: 'dTowel', colors: ['black', 'white'], sizes: null },
  { id: 'shaker', cat: 'extras', name: 'pShaker', desc: 'dShaker', colors: ['black', 'coral'], sizes: null, views: ROUND },
];

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function light(hex) {
  return luminance(hex) > 0.6;
}

function svg(p, shownView, colorKey, label, design) {
  const s = SHAPES[p.id];
  const c = COLORS[colorKey];
  const isLight = light(c);
  // A „side2” a másik oldal: az oldalnézet tükörképe.
  const mirror = shownView === 'side2';
  const view = mirror ? 'side' : shownView;
  const id = `${p.id}-${shownView}`;
  const parts = s.parts[view] || s.parts.front;
  const pick = (k) => [...((s[k] && s[k][view]) || []), ...((s[k] && s[k].both) || [])];
  // Gyűrődés és fény: tömb (minden nézet) vagy nézetenkénti objektum.
  const per = (k) => (Array.isArray(s[k]) ? s[k] : pick(k));
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
<filter id="d-${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.016 0.028" numOctaves="2" seed="7" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="${s.tex === 'plastic' ? 0 : 6}" xChannelSelector="R" yChannelSelector="G"/></filter>
<radialGradient id="l-${id}" cx="36%" cy="20%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity="${isLight ? 0.4 : 0.12}"/>
<stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${isLight ? 0.16 : 0.32}"/></radialGradient>
<filter id="e-${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="g-${id}" x="-30%" y="-300%" width="160%" height="700%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="k-${id}" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="2.4 0.55" numOctaves="1" seed="3"/>
<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 1.1"/></filter>
</defs>`;
  const ground = Array.isArray(s.ground) ? s.ground : s.ground && s.ground[view];
  if (ground) o += `<ellipse cx="200" cy="${ground[0]}" rx="${ground[1]}" ry="9" fill="#000" opacity="${isLight ? 0.22 : 0.45}" filter="url(#g-${id})"/>`;
  if (mirror) o += '<g transform="matrix(-1 0 0 1 400 0)">';
  // 1) alapszín
  for (const d of parts) o += `<path d="${d}" fill="${c}"/>`;
  o += `<g clip-path="url(#c-${id})">`;
  // 2) a nyomat (az árnyékok és a textúra ráterül, mintha bele lenne nyomva)
  const map = p.designMap || DESIGNS;
  const kinds = design ? map[design] : { front: 'emblem' };
  const kind = kinds && kinds[view];
  // A nagy nyomat a ráncokat követi; az apró (felirat, kis logó) nem, mert
  // azt a torzítás olvashatatlanná tenné.
  if (kind) {
    const art = printArt(kind, s, { id, c, isLight, colorKey, print, text });
    o += kind === 'mini' || kind === 'emblem' ? art : `<g filter="url(#d-${id})">${art}</g>`;
  }
  // 3) fény-árnyék: oldalt sötétebb, felül fényesebb, lent árnyék
  o += `<rect width="400" height="440" fill="url(#h-${id})"/><rect width="400" height="440" fill="url(#v-${id})"/>`;
  o += `<rect width="400" height="440" fill="url(#l-${id})"/>`;
  o += `<ellipse cx="185" cy="150" rx="120" ry="90" fill="#fff" opacity="${isLight ? 0.35 : 0.05}" filter="url(#b-${id})"/>`;
  // 4) gyűrődések
  for (const d of per('folds')) o += `<path d="${d}" fill="none" stroke="${shadow}" stroke-width="14" stroke-linecap="round" filter="url(#b-${id})"/>`;
  for (const d of per('lights')) o += `<path d="${d}" fill="none" stroke="${shine}" stroke-width="10" stroke-linecap="round" filter="url(#b-${id})"/>`;
  for (const d of parts) o += `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${isLight ? 0.16 : 0.42}" stroke-width="24" filter="url(#e-${id})"/>`;
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
  if (s.tex !== 'plastic') o += `<rect width="400" height="440" fill="${isLight ? '#000' : '#fff'}" opacity="${isLight ? 0.05 : 0.035}" filter="url(#k-${id})"/>`;
  o += '</g>';
  // 7) kiegészítők a darabon kívül is
  o += extra(s.extra && s.extra[view], c, isLight, id);
  // 8) körvonal
  for (const d of parts) o += `<path d="${d}" fill="none" stroke="${edge}" stroke-width="1.6" stroke-linejoin="round"/>`;
  if (mirror) o += '</g>';
  return o + '</svg>';
}

// A nyomatok rajza. Csak angol szöveg; minden saját grafika (nincs márkához
// hasonló jel, valódi rúna sem).
const HEAD_FONT = 'Barlow Condensed, Barlow, sans-serif';
const RED = '#e5484d';

function printArt(kind, s, { id, c, isLight, colorKey, print, text }) {
  const ink = isLight ? '#16171b' : '#f2f2f0';
  const accent = colorKey === 'coral' ? '#16171b' : RED;
  const n = (v) => Math.round(v * 10) / 10;
  switch (kind) {
    case 'emblem': {
      const [x, y, size] = s.small;
      return `<image href="${print}" x="${x}" y="${y}" width="${size}" height="${size}" opacity=".94"/>`;
    }
    case 'mini': {
      // Minimál: apró, ritkított felirat és egy piros pont.
      const [x, y, size, anchor] = s.mini || [s.small[0], s.small[1] + s.small[2] / 2, 11, 'start'];
      const dot = anchor === 'middle' ? '' : `<circle cx="${x - size * 0.7}" cy="${y - size * 0.35}" r="${n(size * 0.22)}" fill="${accent}"/>`;
      return dot + `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${HEAD_FONT}" font-weight="700" font-size="${size}" letter-spacing="${n(size * 0.28)}" fill="${ink}" opacity=".9">RAIDMATE</text>`;
    }
    case 'word': {
      const [cx, cy, size, one] = s.word;
      const common = `text-anchor="middle" font-family="${HEAD_FONT}" font-weight="700" font-size="${size}" letter-spacing="${n(size * 0.06)}"`;
      if (one) return `<text x="${cx}" y="${cy}" ${common} fill="${ink}" opacity=".92">RAID<tspan fill="${accent}">MATE</tspan></text>`;
      return `<text x="${cx}" y="${cy}" ${common} fill="${accent}">RAID</text>` +
        `<text x="${cx}" y="${n(cy + size * 0.92)}" ${common} fill="${ink}" opacity=".92">MATE</text>`;
    }
    case 'mascot': {
      const [x, y, w, h] = s.big;
      return `<image href="img/mascot.webp" x="${x}" y="${y}" width="${w}" height="${h}" opacity=".96"/>` +
        `<path id="a-${id}" d="${s.arc}" fill="none"/>` +
        `<text font-family="${HEAD_FONT}" font-weight="700" font-size="34" letter-spacing="3" fill="${text}" opacity=".95"><textPath href="#a-${id}" startOffset="50%" text-anchor="middle">RAIDMATE</textPath></text>`;
    }
    case 'club': {
      // Pajzs, benne súlyzórúd; fölötte STRENGTH, alatta CLUB.
      const [x, y, w, h] = s.big;
      const X = (u) => n(x + u * w);
      const Y = (v) => n(y + v * h);
      const shield = `M${X(0.5)} ${Y(0.02)} L${X(0.96)} ${Y(0.14)} L${X(0.96)} ${Y(0.5)} C${X(0.96)} ${Y(0.76)} ${X(0.76)} ${Y(0.92)} ${X(0.5)} ${Y(0.99)} C${X(0.24)} ${Y(0.92)} ${X(0.04)} ${Y(0.76)} ${X(0.04)} ${Y(0.5)} L${X(0.04)} ${Y(0.14)} Z`;
      const bar = (u0, u1) => `<rect x="${X(u0)}" y="${Y(0.505)}" width="${n((u1 - u0) * w)}" height="${n(h * 0.03)}" rx="1.5" fill="${ink}"/>`;
      const plate = (u, hh, ww) => `<rect x="${X(u)}" y="${n(y + (0.52 - hh / 2) * h)}" width="${n(ww * w)}" height="${n(hh * h)}" rx="2" fill="${accent}"/>`;
      const big = n(h * 0.15);
      return `<path d="${shield}" fill="none" stroke="${ink}" stroke-width="3" opacity=".9"/>` +
        `<path d="${shield}" fill="none" stroke="${accent}" stroke-width="1.2" transform="translate(${X(0.5)} ${Y(0.5)}) scale(.9) translate(${-X(0.5)} ${-Y(0.5)})"/>` +
        `<text x="${X(0.5)}" y="${Y(0.34)}" text-anchor="middle" font-family="${HEAD_FONT}" font-weight="700" font-size="${n(big * 0.82)}" letter-spacing="${n(big * 0.08)}" fill="${ink}">STRENGTH</text>` +
        bar(0.14, 0.86) + plate(0.2, 0.2, 0.05) + plate(0.26, 0.15, 0.04) + plate(0.71, 0.15, 0.04) + plate(0.75, 0.2, 0.05) +
        `<text x="${X(0.5)}" y="${Y(0.78)}" text-anchor="middle" font-family="${HEAD_FONT}" font-weight="700" font-size="${big}" letter-spacing="${n(big * 0.12)}" fill="${ink}">CLUB</text>` +
        `<text x="${X(0.5)}" y="${Y(0.88)}" text-anchor="middle" font-family="${HEAD_FONT}" font-weight="600" font-size="${n(big * 0.34)}" letter-spacing="${n(big * 0.12)}" fill="${accent}">RAIDMATE · EST. 2026</text>`;
    }
    case 'plate': {
      // Súlytárcsa: körirat (LIFT · RAID · REPEAT), belül piros gyűrű, agy.
      const [x, y, w, h] = s.big;
      const cx = n(x + w / 2);
      const cy = n(y + h / 2);
      const r = Math.min(w, h) / 2 * 0.96;
      const tr = n(r * 0.8);
      const ring = `M${n(cx - tr)} ${cy} A${tr} ${tr} 0 1 1 ${n(cx + tr)} ${cy} A${tr} ${tr} 0 1 1 ${n(cx - tr)} ${cy}`;
      const len = n(2 * Math.PI * tr * 0.97);
      return `<circle cx="${cx}" cy="${cy}" r="${n(r)}" fill="none" stroke="${ink}" stroke-width="${n(r * 0.06)}" opacity=".92"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${n(r * 0.64)}" fill="none" stroke="${accent}" stroke-width="${n(r * 0.035)}"/>` +
        `<path id="p-${id}" d="${ring}" fill="none"/>` +
        `<text font-family="${HEAD_FONT}" font-weight="700" font-size="${n(r * 0.17)}" fill="${ink}" opacity=".92"><textPath href="#p-${id}" textLength="${len}" lengthAdjust="spacing">LIFT · RAID · REPEAT · LIFT · RAID · REPEAT ·</textPath></text>` +
        `<circle cx="${cx}" cy="${cy}" r="${n(r * 0.24)}" fill="${ink}" opacity=".92"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${n(r * 0.09)}" fill="${c}"/>` +
        `<text x="${cx}" y="${n(cy + r * 0.47)}" text-anchor="middle" font-family="${HEAD_FONT}" font-weight="700" font-size="${n(r * 0.13)}" letter-spacing="${n(r * 0.03)}" fill="${ink}" opacity=".85">RAIDMATE</text>`;
    }
    default:
      return '';
  }
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
    case 'duffel': {
      // Két fogantyú, vállpánt, cipzárhúzó.
      const strap = (d, w) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
        `<path d="${d}" fill="none" stroke="${line}" stroke-width="${w}" stroke-linecap="round" opacity=".35"/>` +
        `<path d="${d}" fill="none" stroke="${isLight ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.25)'}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
      return strap('M46 214 C74 66 326 66 354 214', 7) + strap('M150 178 C150 122 250 122 250 178', 14) +
        `<rect x="296" y="186" width="20" height="12" rx="3" fill="${tip}" stroke="${line}"/>`;
    }
    case 'duffelSide':
      return `<path d="M178 182 C178 150 222 150 222 182" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round"/>` +
        `<path d="M178 182 C178 150 222 150 222 182" fill="none" stroke="${line}" stroke-width="14" stroke-linecap="round" opacity=".35"/>` +
        `<rect x="190" y="168" width="20" height="14" rx="4" fill="${tip}" stroke="${line}"/>`;
    case 'pack':
      return `<path d="M184 66 C184 42 216 42 216 66" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>` +
        `<path d="M184 66 C184 42 216 42 216 66" fill="none" stroke="${line}" stroke-width="9" stroke-linecap="round" opacity=".35"/>` +
        `<rect x="140" y="248" width="8" height="18" rx="2" fill="${tip}" stroke="${line}"/><rect x="252" y="248" width="8" height="18" rx="2" fill="${tip}" stroke="${line}"/>` +
        `<rect x="246" y="88" width="8" height="18" rx="2" fill="${tip}" stroke="${line}"/>`;
    case 'packSide':
      return `<path d="M188 96 C150 160 148 300 172 396" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/>` +
        `<path d="M188 96 C150 160 148 300 172 396" fill="none" stroke="${line}" stroke-width="16" stroke-linecap="round" opacity=".45"/>`;
    case 'packBack': {
      const strap = (d) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="26" stroke-linecap="round"/>` +
        `<path d="${d}" fill="none" stroke="${line}" stroke-width="26" stroke-linecap="round" opacity=".4"/>` +
        `<path d="${d}" fill="none" stroke="${isLight ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.22)'}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
      return strap('M168 104 C140 190 146 300 172 382') + strap('M232 104 C260 190 254 300 228 382') +
        `<path d="M184 66 C184 42 216 42 216 66" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`;
    }
    case 'camera': {
      // Kameramodul: sötét lap, három lencse, vaku.
      const lens = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="#0b0b0d" stroke="#3a3c44" stroke-width="3"/><circle cx="${x - 4}" cy="${y - 4}" r="3" fill="#fff" opacity=".18"/>`;
      return `<rect x="108" y="44" width="92" height="92" rx="20" fill="#15161a" stroke="${line}"/>` +
        lens(134, 70) + lens(174, 70) + lens(134, 110) +
        `<circle cx="174" cy="110" r="6" fill="#f2efe6" opacity=".85"/>`;
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
  const lang = TEXTS[document.documentElement.lang] ? document.documentElement.lang : 'hu';
  return (TEXTS[lang][key] || key).replaceAll('{brand}', BRAND.name);
}

const state = {};
let filter = 'all';

function mailto(p) {
  const st = state[p.id];
  const product = st.design ? `${t(p.name)} – ${t(`dz_${st.design}`)}` : t(p.name);
  const fill = (s) => s
    .replaceAll('{product}', product)
    .replaceAll('{color}', t(`c_${st.color}`))
    .replaceAll('{size}', p.sizes ? st.size : t('shopOneSize'));
  const subject = fill(t('mailSubject'));
  const body = fill(t('mailBody'));
  return `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const VIEW_LABEL = { front: 'shopFront', back: 'shopBack', side: 'shopSide', side2: 'shopSide' };

function card(p) {
  const st = (state[p.id] ||= { view: 'front', color: p.colors[0], size: 'M', design: p.design || null, turn: '' });
  const views = p.views || ['front'];
  const round = views.length > 2;
  const el = document.createElement('article');
  el.className = 'item';
  el.hidden = filter !== 'all' && filter !== p.cat;
  const viewLabel = t(VIEW_LABEL[st.view]);
  const label = `${t(p.name)}${st.design ? `, ${t(`dz_${st.design}`)}` : ''}, ${t(`c_${st.color}`)}, ${viewLabel}`;
  const pic = svg(p, st.view, st.color, label, st.design).replace('<svg ', `<svg class="${st.turn ? `turn-${st.turn}` : ''}" `);
  let controls = '';
  if (round) {
    controls = `<div class="views rot" role="group" aria-label="${t('shopRotate')}">
        <button type="button" data-turn="-1" aria-label="${t('shopRotate')} ←">‹</button>
        <span aria-live="polite">${viewLabel}</span>
        <button type="button" data-turn="1" aria-label="${t('shopRotate')} →">›</button></div>`;
  } else if (views.length === 2) {
    controls = `<div class="views" role="group" aria-label="${t('shopFront')} / ${t('shopBack')}">
        <button type="button" data-view="front" aria-pressed="${st.view === 'front'}">${t('shopFront')}</button>
        <button type="button" data-view="back" aria-pressed="${st.view === 'back'}">${t('shopBack')}</button></div>`;
  }
  const designRow = p.designs && p.designs.length > 1
    ? `<div class="row"><label class="lbl" for="dz-${p.id}">${t('shopDesign')}</label>
        <select id="dz-${p.id}" class="design">${p.designs.map((d) => `<option value="${d}"${d === st.design ? ' selected' : ''}>${t(`dz_${d}`)}</option>`).join('')}</select></div>`
    : '';
  el.innerHTML = `
    <div class="pic${round ? ' spin' : ''}">${pic}${controls}${round ? `<span class="hint">${t('shopDrag')}</span>` : ''}</div>
    <div class="info">
      <div class="head"><h3>${t(p.name)}</h3><span class="soon">${t('shopSoon')}</span></div>
      <p>${t(p.desc)}</p>
      ${designRow}
      <div class="row"><span class="lbl">${t('shopColor')}</span>
        <div class="swatches" role="group" aria-label="${t('shopColor')}">${p.colors.map((k) => `<button type="button" class="sw" data-color="${k}" style="--c:${COLORS[k]}" title="${t(`c_${k}`)}" aria-label="${t(`c_${k}`)}" aria-pressed="${st.color === k}"></button>`).join('')}</div>
      </div>
      <div class="row">
        ${p.sizes
          ? `<label class="lbl" for="sz-${p.id}">${t('shopSize')}</label>
             <select id="sz-${p.id}">${p.sizes.map((s) => `<option${s === st.size ? ' selected' : ''}>${s}</option>`).join('')}</select>`
          : `<span class="lbl">${t('shopSize')}</span><span class="one">${t('shopOneSize')}</span>`}
        <a class="btn primary ask" href="${mailto(p)}"><span class="mi i-mail-outline"></span>${t('shopAsk')}</a>
      </div>
    </div>`;
  st.turn = '';
  const swap = (selector) => {
    const next = card(p);
    el.replaceWith(next);
    if (selector) next.querySelector(selector)?.focus();
  };
  // Forgatás: gombbal vagy elhúzással (egér, ujj); a felsők elöl/hátul fordulnak.
  const turn = (dir, selector) => {
    const i = views.indexOf(st.view);
    st.view = views[(i + dir + views.length) % views.length];
    st.turn = dir > 0 ? 'r' : 'l';
    swap(selector);
  };
  el.querySelectorAll('[data-turn]').forEach((b) => b.addEventListener('click', () => turn(Number(b.dataset.turn), `[data-turn="${b.dataset.turn}"]`)));
  el.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.view === st.view) return;
    turn(1, `[data-view="${b.dataset.view}"]`);
  }));
  if (views.length > 1) {
    const area = el.querySelector('.pic');
    let x0 = null;
    area.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      x0 = e.clientX;
    });
    area.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 30) turn(dx < 0 ? 1 : -1);
    });
    area.addEventListener('pointercancel', () => { x0 = null; });
  }
  el.querySelectorAll('[data-color]').forEach((b) => b.addEventListener('click', () => {
    st.color = b.dataset.color;
    swap(`[data-color="${st.color}"]`);
  }));
  const dz = el.querySelector('select.design');
  if (dz) dz.addEventListener('change', () => {
    st.design = dz.value;
    // A hátmintás mintánál hátulról mutatjuk, a csak elöl nyomottnál elölről.
    const map = p.designMap || DESIGNS;
    if (views.length === 2) st.view = map[st.design].back ? 'back' : 'front';
    swap('select.design');
  });
  const sel = el.querySelector('select:not(.design)');
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
