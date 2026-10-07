// Edzőkereső a weboldalon (E2b; Tamás döntései, 2026-10-07): fiók nélkül,
// a nyilvános névjegyzékből. A keresés és a szűrés a böngészőben történik (a
// szerver nem tudja, ki mit keresett), a szűrőket nem mentjük el. Egy edző
// oldala: …/edzok/#<slug> (megosztható). Jelentés: e-mailben.
//
// Biztonság: a szerverről jövő szöveget csak textContent-ként tesszük ki,
// linknek csak https-címet, e-mail-címet és telefonszámot.
import { SUPABASE_KEY, SUPABASE_URL } from '../app/js/config.js';

const T = {
  hu: {
    count: (n) => `${n} edző`,
    none: 'Még nincs edző a keresőben. Edző vagy? Jelentkezz az appban: Profil → Online fiók → Edzőprofilom.',
    empty: 'Nincs ilyen edző. Próbáld kevesebb szűrővel.',
    clear: 'Szűrők törlése',
    error: 'Az edzőlista most nem tölthető be. Próbáld újra később.',
    retry: 'Újra',
    search: 'Keresés',
    searchHint: 'Név, szakterület, edzőterem…',
    how: 'Hogyan',
    both: 'Mindegy',
    inPerson: 'Személyesen',
    online: 'Online',
    county: 'Megye',
    city: 'Település',
    specialty: 'Szakterület',
    language: 'Nyelv',
    maxPrice: 'Alkalom legfeljebb',
    gym: 'Edzőterem',
    order: 'Sorrend',
    any: 'Mindegy',
    sortMixed: 'Ajánlott (ellenőrzöttek elöl)',
    sortPrice: 'Ár szerint',
    sortNewest: 'Legújabbak elöl',
    priceUpTo: (p) => `${p} Ft-ig`,
    onlineNote: 'Az online edzők a helytől függetlenül látszanak.',
    moreFilters: 'További szűrők',
    sortRating: 'Értékelés szerint',
    minStars: 'Értékelés legalább',
    stars: (v) => `${v} ★`,
    ratingLine: (avg, n) => `${avg} ★ (${n} értékelés)`,
    ratingFew: 'Még kevés értékelés',
    rateInApp: 'Értékelni az appban lehet, online fiókkal. Másoknak csak az összesítés látszik, 3 értékelés után.',
    tags: {
      explains: 'Jól magyaráz', motivating: 'Motiváló', precise: 'Pontos', flexible: 'Rugalmas',
      technique: 'Jó technika', patient: 'Türelmes', effective: 'Eredményes', value: 'Jó ár-érték',
    },
    verified: 'Ellenőrzött végzettség',
    featured: 'Kiemelt',
    featuredInfo: 'Kiemelt: Prémium szintű edző. Az Ajánlott sorrendben kicsit előrébb kerül; az ellenőrzött végzettségűek így is elöl vannak.',
    selfDeclared: 'az edző saját nyilatkozata',
    session: 'Alkalom',
    month: 'Online havi',
    from: (p) => `${p} Ft-tól`,
    agreement: 'Megegyezés szerint',
    gyms: 'Edzőterem',
    languages: 'Nyelv',
    price: 'Irányár',
    qualification: 'Végzettség',
    since: 'A keresőben',
    contactNote: 'Az edzővel a fenti elérhetőségeken veheted fel a kapcsolatot. A GymBro nem közvetít üzenetet vagy fizetést, és nem fél a megállapodásotokban.',
    copy: 'Link másolása',
    copied: 'Link másolva',
    report: 'Jelentés e-mailben',
    reportSubject: (slug) => `GymBro edzőprofil jelentése: ${slug}`,
    reportBody: (url) => `Ezt az edzőprofilt jelentem:\n${url}\n\nAz ok (pl. hamis profil, megtévesztő állítás, sértő vagy jogsértő tartalom, spam):\n\n`,
    back: '← Vissza a listához',
    gone: 'Ez az edző már nem látszik a keresőben.',
    contacts: {
      instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube',
      website: 'Weboldal', email: 'E-mail', phone: 'Telefon',
    },
    specialties: {
      muscle: 'Izomépítés', fatloss: 'Fogyás', powerlifting: 'Erőemelés', beginners: 'Kezdők',
      women: 'Női edzés', seniors: 'Idősek', rehab: 'Sérülés utáni edzés', functional: 'Funkcionális edzés',
      running: 'Futás', nutrition: 'Táplálkozás',
    },
    countries: { HU: 'Magyarország', AT: 'Ausztria', SK: 'Szlovákia', RO: 'Románia', RS: 'Szerbia', DE: 'Németország' },
  },
  en: {
    count: (n) => (n === 1 ? '1 coach' : `${n} coaches`),
    none: 'No coaches in the finder yet. Are you a coach? Apply in the app: Profile → Online account → My coach profile.',
    empty: 'No coaches match. Try fewer filters.',
    clear: 'Clear filters',
    error: "The coach list can't be loaded right now. Try again later.",
    retry: 'Retry',
    search: 'Search',
    searchHint: 'Name, specialty, gym…',
    how: 'How',
    both: 'Either',
    inPerson: 'In person',
    online: 'Online',
    county: 'County',
    city: 'Town',
    specialty: 'Specialty',
    language: 'Language',
    maxPrice: 'Session up to',
    gym: 'Gym',
    order: 'Order',
    any: 'Any',
    sortMixed: 'Recommended (verified first)',
    sortPrice: 'By price',
    sortNewest: 'Newest first',
    priceUpTo: (p) => `up to ${p} HUF`,
    onlineNote: 'Online coaches show regardless of place.',
    moreFilters: 'More filters',
    sortRating: 'By rating',
    minStars: 'Rating at least',
    stars: (v) => `${v} ★`,
    ratingLine: (avg, n) => `${avg} ★ (${n === 1 ? '1 rating' : `${n} ratings`})`,
    ratingFew: 'Not enough ratings yet',
    rateInApp: 'You can rate in the app with an online account. Others only see the totals, after 3 ratings.',
    tags: {
      explains: 'Explains well', motivating: 'Motivating', precise: 'Precise', flexible: 'Flexible',
      technique: 'Good technique', patient: 'Patient', effective: 'Gets results', value: 'Good value',
    },
    verified: 'Verified qualification',
    featured: 'Featured',
    featuredInfo: 'Featured: a Premium-level coach. They appear a little higher in the Recommended order; coaches with a verified qualification still come first.',
    selfDeclared: "the coach's own statement",
    session: 'Session',
    month: 'Online monthly',
    from: (p) => `from ${p} HUF`,
    agreement: 'By agreement',
    gyms: 'Gym',
    languages: 'Languages',
    price: 'Guide price',
    qualification: 'Qualifications',
    since: 'In the finder since',
    contactNote: "Contact the coach directly through the details above. GymBro doesn't pass on messages or payments and isn't a party to your agreement.",
    copy: 'Copy link',
    copied: 'Link copied',
    report: 'Report by e-mail',
    reportSubject: (slug) => `GymBro coach profile report: ${slug}`,
    reportBody: (url) => `I'm reporting this coach profile:\n${url}\n\nThe reason (e.g. fake profile, misleading claim, offensive or illegal content, spam):\n\n`,
    back: '← Back to the list',
    gone: 'This coach is no longer in the finder.',
    contacts: {
      instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube',
      website: 'Website', email: 'E-mail', phone: 'Phone',
    },
    specialties: {
      muscle: 'Muscle building', fatloss: 'Fat loss', powerlifting: 'Powerlifting', beginners: 'Beginners',
      women: "Women's training", seniors: 'Seniors', rehab: 'Post-injury training', functional: 'Functional training',
      running: 'Running', nutrition: 'Nutrition',
    },
    countries: { HU: 'Hungary', AT: 'Austria', SK: 'Slovakia', RO: 'Romania', RS: 'Serbia', DE: 'Germany' },
  },
};

const LANGUAGES = {
  hu: 'Magyar', en: 'English', de: 'Deutsch', ro: 'Română', sk: 'Slovenčina', hr: 'Hrvatski',
  sr: 'Srpski', uk: 'Українська', cs: 'Čeština', pl: 'Polski', fr: 'Français', es: 'Español', it: 'Italiano',
};
const SPECIALTIES = Object.keys(T.hu.specialties);
const PRICES = [5000, 8000, 10000, 15000, 20000];
const STARS = [3, 3.5, 4, 4.5];
// A súlyozott értékelés, mint az appban (lib/domain/coach_finder.dart):
// ennyi „képzeletbeli” közepes értékeléssel kezdünk.
const RATING_PRIOR = 3.5;
const RATING_PRIOR_WEIGHT = 5;

const view = document.getElementById('view');
const intro = document.getElementById('intro');
let coaches = null;
let loadError = false;
// A szűrők csak erre a látogatásra (a weboldal csak a nyelvet, a témát és a
// stílust jegyzi meg; adatvédelmi tájékoztató).
const filter = { q: '', mode: 'any', county: '', city: '', specialty: '', language: '', maxPrice: '', gym: '', minStars: '', sort: 'mixed' };
// A „További szűrők” nyitva van-e (újrarajzoláskor is maradjon).
let moreOpen = false;

const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'hu');
const t = () => T[lang()];

// --------------------------------------------------------------- segédek

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    e.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return e;
}

/** Kereséshez: kisbetű, ékezetek nélkül (mint az appban). */
function fold(s) {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** FNV-1a (32 bit), mint az appban: a napi keverés ugyanaz, mint a telefonon. */
function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const money = (n) => new Intl.NumberFormat(lang() === 'hu' ? 'hu-HU' : 'en-GB').format(n);

/** Biztonságos link egy elérhetőséghez, vagy null. */
function contactHref(kind, value) {
  const v = String(value ?? '').trim();
  if (kind === 'email') return /^[^@\s<>"]+@[^@\s<>"]+\.[^@\s<>"]+$/.test(v) ? `mailto:${v}` : null;
  if (kind === 'phone') return /^\+?[0-9]{6,20}$/.test(v) ? `tel:${v}` : null;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
}

function photoUrl(path) {
  return /^[0-9a-f-]{36}\/[0-9a-f]{16}\.jpg$/.test(path ?? '')
    ? `${SUPABASE_URL}/storage/v1/object/public/coach-photos/${path}`
    : null;
}

function avatar(c) {
  const src = photoUrl(c.photo_path);
  const initial = (String(c.display_name ?? '?').trim()[0] ?? '?').toUpperCase();
  const box = el('div', { class: 'avatar', 'aria-hidden': 'true' }, initial);
  if (src) {
    const img = el('img', { src, alt: '', loading: 'lazy' });
    img.addEventListener('load', () => box.replaceChildren(img));
  }
  return box;
}

function placeLine(c) {
  const tt = t();
  const place = [];
  if (c.city) {
    place.push(c.county === 'Budapest' ? `Budapest, ${c.city}`.replace('Budapest, Budapest', 'Budapest')
      : c.county && c.county !== c.city ? `${c.city} (${c.county})` : c.city);
  }
  if (c.country && c.country !== 'HU') place.push(tt.countries[c.country] ?? c.country);
  const mode = [c.in_person ? tt.inPerson : null, c.online ? tt.online : null].filter(Boolean).join(' · ');
  return [place.join(', '), mode].filter(Boolean).join(' · ');
}

function specialtyNames(c) {
  return [
    ...SPECIALTIES.filter((s) => (c.specialties ?? []).includes(s)).map((s) => t().specialties[s]),
    ...(c.custom_specialties ?? []),
  ];
}

const rated = (c) => c.rating_count != null && c.rating_avg != null;

// A „Kiemelt” (Prémium szintű) edző előnye az Ajánlott sorrendben (mint az
// appban: lib/domain/coach_finder.dart kFeaturedBoost).
const FEATURED_BOOST = 0.4;

function score(c) {
  return rated(c)
    ? (RATING_PRIOR_WEIGHT * RATING_PRIOR + c.rating_count * c.rating_avg) / (RATING_PRIOR_WEIGHT + c.rating_count)
    : RATING_PRIOR;
}

function ratingLine(c) {
  if (!rated(c)) return null;
  const avg = new Intl.NumberFormat(lang() === 'hu' ? 'hu-HU' : 'en-GB', {
    minimumFractionDigits: 1, maximumFractionDigits: 1,
  }).format(c.rating_avg);
  return t().ratingLine(avg, c.rating_count);
}

function topTags(c) {
  return Object.entries(c.rating_tags ?? {})
    .filter(([k]) => k in T.hu.tags)
    .sort((a, b) => b[1] - a[1] || Object.keys(T.hu.tags).indexOf(a[0]) - Object.keys(T.hu.tags).indexOf(b[0]));
}

function priceLine(c) {
  const tt = t();
  return [
    c.price_session ? `${tt.session}: ${tt.from(money(c.price_session))}` : null,
    c.price_month ? `${tt.month}: ${tt.from(money(c.price_month))}` : null,
    c.price_by_agreement ? tt.agreement : null,
  ].filter(Boolean).join(' · ');
}

// --------------------------------------------------------------- szűrés

function placeMatches(c) {
  return c.country === 'HU'
    && (!filter.county || c.county === filter.county)
    && (!filter.city || c.city === filter.city);
}

function matches(c) {
  const placeOk = filter.mode === 'inPerson' ? c.in_person && placeMatches(c)
    : filter.mode === 'online' ? c.online
      : (c.in_person && placeMatches(c)) || c.online;
  if (!placeOk) return false;
  if (filter.specialty && !(c.specialties ?? []).includes(filter.specialty)) return false;
  if (filter.language && !(c.languages ?? []).includes(filter.language)) return false;
  if (filter.maxPrice && c.price_session && c.price_session > Number(filter.maxPrice)) return false;
  if (filter.minStars && (!rated(c) || c.rating_avg < Number(filter.minStars))) return false;
  if (filter.gym && !(c.gyms ?? []).some((g) => fold(g) === fold(filter.gym))) return false;
  const q = fold(filter.q.trim());
  if (q) {
    const text = fold([c.display_name, c.bio, ...(c.custom_specialties ?? []), ...(c.gyms ?? []),
      c.city ?? '', c.qualification ?? ''].join(' '));
    if (!q.split(/\s+/).every((w) => text.includes(w))) return false;
  }
  return true;
}

function sorted(list) {
  const day = today();
  const key = new Map(list.map((c) => [c.slug, hash(`${day}|${c.slug}`)]));
  const priceKnown = (c) => (filter.maxPrice && !c.price_session ? 1 : 0);
  // Ajánlott (mint az appban): súlyozott értékelés + „Kiemelt” (+0,4) + az
  // újak lendülete (2 hónapig) + napi kis keverés (±0,25).
  const d = new Date();
  const freshFrom = d.getFullYear() * 12 + d.getMonth() - 2;
  const monthIndex = (s) => {
    const m = /^(\d{4})-(\d{2})/.exec(s ?? '');
    return m ? Number(m[1]) * 12 + Number(m[2]) - 1 : -Infinity;
  };
  const mixed = (c) => score(c) + (c.featured ? FEATURED_BOOST : 0)
    + (monthIndex(c.since) >= freshFrom ? 0.3 : 0)
    + (key.get(c.slug) % 1000) / 1000 * 0.5 - 0.25;
  return [...list].sort((a, b) => {
    const k = priceKnown(a) - priceKnown(b);
    if (k) return k;
    if (filter.sort === 'mixed') {
      const v = (b.verified_label ? 1 : 0) - (a.verified_label ? 1 : 0);
      if (v) return v;
      const m = mixed(b) - mixed(a);
      if (m) return m;
    } else if (filter.sort === 'rating') {
      const r = (rated(b) ? 1 : 0) - (rated(a) ? 1 : 0);
      if (r) return r;
      const sc = score(b) - score(a);
      if (sc) return sc;
    } else if (filter.sort === 'price') {
      const pa = a.price_session ?? Infinity;
      const pb = b.price_session ?? Infinity;
      if (pa !== pb) return pa - pb;
    } else if (filter.sort === 'newest') {
      const s = String(b.since ?? '').localeCompare(String(a.since ?? ''));
      if (s) return s;
    }
    return key.get(a.slug) - key.get(b.slug);
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => fold(a).localeCompare(fold(b)));
}

// --------------------------------------------------------------- nézetek

function select(label, name, options, value, onChange) {
  return el('label', {}, label,
    el('select', { name, onchange: (e) => onChange(e.target.value) },
      options.map(([v, text]) => {
        const o = el('option', { value: v }, text);
        if (v === value) o.selected = true;
        return o;
      })));
}

function renderList() {
  const tt = t();
  intro.hidden = false;
  if (loadError) {
    view.replaceChildren(el('div', { class: 'state' }, el('p', {}, tt.error),
      el('button', { class: 'btn', type: 'button', onclick: load }, tt.retry)));
    return;
  }
  if (coaches === null) return;
  if (coaches.length === 0) {
    view.replaceChildren(el('p', { class: 'state' }, tt.none));
    return;
  }
  const inPerson = coaches.filter((c) => c.in_person && c.country === 'HU');
  const counties = unique(inPerson.map((c) => c.county));
  const cities = unique(inPerson.filter((c) => !filter.county || c.county === filter.county).map((c) => c.city));
  const gyms = unique(coaches.flatMap((c) => c.gyms ?? []));
  const languages = unique(coaches.flatMap((c) => c.languages ?? []));
  const any = ['', tt.any];
  const set = (k) => (v) => {
    filter[k] = v;
    if (k === 'county') filter.city = '';
    renderList();
  };
  const search = el('input', {
    type: 'search', value: filter.q, placeholder: tt.searchHint, 'aria-label': tt.search,
  });
  search.addEventListener('input', () => {
    filter.q = search.value;
    renderResults();
  });
  const filters = el('div', { class: 'filters' },
    el('label', { class: 'search' }, tt.search, search),
    select(tt.how, 'mode', [['any', tt.both], ['inPerson', tt.inPerson], ['online', tt.online]], filter.mode, set('mode')),
    select(tt.specialty, 'specialty', [any, ...SPECIALTIES.map((s) => [s, tt.specialties[s]])], filter.specialty, set('specialty')),
    select(tt.order, 'sort', [['mixed', tt.sortMixed], ['rating', tt.sortRating], ['price', tt.sortPrice], ['newest', tt.sortNewest]], filter.sort, set('sort')),
  );
  const moreSet = ['county', 'city', 'language', 'maxPrice', 'gym', 'minStars'].filter((k) => filter[k]).length;
  const more = el('details', { class: 'more', open: moreOpen || moreSet ? '' : null },
    el('summary', {}, moreSet ? `${tt.moreFilters} (${moreSet})` : tt.moreFilters),
    el('div', { class: 'more-filters' },
      filter.mode === 'online' ? null : select(tt.county, 'county', [any, ...counties.map((c) => [c, c])], filter.county, set('county')),
      filter.mode === 'online' ? null : select(tt.city, 'city', [any, ...cities.map((c) => [c, c])], filter.city, set('city')),
      select(tt.language, 'language', [any, ...languages.map((c) => [c, LANGUAGES[c] ?? c])], filter.language, set('language')),
      select(tt.maxPrice, 'maxPrice', [any, ...PRICES.map((p) => [String(p), tt.priceUpTo(money(p))])], filter.maxPrice, set('maxPrice')),
      select(tt.minStars, 'minStars', [any, ...STARS.map((v) => [String(v), tt.stars(new Intl.NumberFormat(lang() === 'hu' ? 'hu-HU' : 'en-GB', { minimumFractionDigits: 1 }).format(v))])], filter.minStars, set('minStars')),
      gyms.length ? select(tt.gym, 'gym', [any, ...gyms.map((g) => [g, g])], filter.gym, set('gym')) : null));
  more.addEventListener('toggle', () => {
    moreOpen = more.open;
  });
  const results = el('div', { id: 'results' });
  view.replaceChildren(filters, more, el('p', { class: 'muted' }, tt.onlineNote), results);
  renderResults();
}

function renderResults() {
  const tt = t();
  const results = document.getElementById('results');
  if (!results) return;
  const found = sorted(coaches.filter(matches));
  const clear = el('button', {
    type: 'button',
    onclick: () => {
      Object.assign(filter, { q: '', mode: 'any', county: '', city: '', specialty: '', language: '', maxPrice: '', gym: '', minStars: '' });
      renderList();
    },
  }, tt.clear);
  if (found.length === 0) {
    results.replaceChildren(el('div', { class: 'state' }, el('p', {}, tt.empty), clear));
    return;
  }
  results.replaceChildren(
    el('div', { class: 'count' }, `${tt.count(found.length)} · ${{ mixed: tt.sortMixed, rating: tt.sortRating, price: tt.sortPrice, newest: tt.sortNewest }[filter.sort]}`, clear),
    el('div', { class: 'list' }, found.map((c) => {
      const price = priceLine(c);
      const rating = ratingLine(c);
      return el('a', { class: 'coach', href: `#${encodeURIComponent(c.slug)}` },
        avatar(c),
        el('div', {},
          el('h3', {}, c.display_name, c.verified_label
            ? el('span', { class: 'mi i-check-circle verified', title: tt.verified, 'aria-label': tt.verified }) : null,
          c.featured ? el('span', { class: 'featured', title: tt.featuredInfo }, tt.featured) : null),
          el('div', { class: 'muted' }, placeLine(c)),
          rating ? el('div', { class: 'rating' }, rating) : null,
          el('div', {}, specialtyNames(c).join(' · ')),
          price ? el('div', { class: 'muted' }, price) : null));
    })),
  );
}

function renderDetail(slug) {
  const tt = t();
  const c = (coaches ?? []).find((x) => x.slug === slug);
  intro.hidden = true;
  window.scrollTo(0, 0);
  const back = el('a', { class: 'back', href: '#' }, tt.back);
  if (!c) {
    view.replaceChildren(el('div', { class: 'detail' }, el('p', {}, tt.gone), back));
    return;
  }
  const url = `${location.origin}${location.pathname}#${encodeURIComponent(c.slug)}`;
  const rows = [];
  const row = (k, v) => v && rows.push(el('dt', {}, k), el('dd', {}, v));
  row(tt.languages, (c.languages ?? []).map((x) => LANGUAGES[x] ?? x).join(', '));
  row(tt.gyms, (c.gyms ?? []).join(', '));
  row(tt.price, priceLine(c));
  if (c.verified_label) row(tt.verified, `${c.verified_label}${c.verified_month ? ` (${c.verified_month})` : ''}`);
  if (c.qualification) row(tt.qualification, `${c.qualification} (${tt.selfDeclared})`);
  row(tt.since, c.since);
  const contacts = Object.entries(c.contacts ?? {})
    .map(([kind, value]) => [kind, contactHref(kind, value)])
    .filter(([, href]) => href)
    .map(([kind, href]) => el('a', {
      class: 'btn', href, target: kind === 'email' || kind === 'phone' ? null : '_blank', rel: 'noopener noreferrer',
    }, tt.contacts[kind] ?? kind));
  const copy = el('button', { class: 'btn', type: 'button' }, tt.copy);
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url);
      copy.textContent = tt.copied;
    } catch {
      prompt(tt.copy, url);
    }
  });
  const contactEmail = document.querySelector('[data-contact]')?.getAttribute('href')?.replace(/^mailto:/, '') ?? '';
  const report = el('a', {
    class: 'btn',
    href: `mailto:${contactEmail}?subject=${encodeURIComponent(tt.reportSubject(c.slug))}&body=${encodeURIComponent(tt.reportBody(url))}`,
  }, tt.report);
  view.replaceChildren(el('div', { class: 'detail' },
    el('div', { class: 'head' }, avatar(c), el('div', {},
      el('h2', {}, c.display_name),
      el('div', { class: 'muted' }, placeLine(c)),
      c.featured ? el('p', { class: 'muted' }, el('span', { class: 'featured' }, tt.featured), ' ', tt.featuredInfo) : null)),
    el('p', { class: 'bio' }, c.bio),
    el('div', { class: 'chips' }, specialtyNames(c).map((s) => el('span', {}, s))),
    el('div', { class: 'rating-box' },
      el('div', { class: 'rating' }, ratingLine(c) ?? tt.ratingFew),
      topTags(c).length
        ? el('div', { class: 'chips' }, topTags(c).map(([k, n]) => el('span', {}, `${tt.tags[k]} · ${n}`)))
        : null,
      el('p', { class: 'muted' }, tt.rateInApp)),
    el('dl', {}, rows),
    el('div', { class: 'contacts' }, contacts),
    el('p', { class: 'note' }, tt.contactNote),
    el('div', { class: 'actions' }, copy, report),
    back));
}

function render() {
  const slug = decodeURIComponent(location.hash.slice(1));
  if (slug && coaches !== null) renderDetail(slug);
  else renderList();
}

async function load() {
  loadError = false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/coaches_directory`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    coaches = Array.isArray(data) ? data : [];
  } catch {
    loadError = true;
  }
  render();
}

window.addEventListener('hashchange', render);
// Nyelvváltáskor (i18n.js a <html lang>-ot állítja) újra kirajzoljuk.
new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
load();
