// Magyar és angol szövegek. A HTML-ben a magyar áll (JavaScript nélkül is
// olvasható); ez a fájl a data-i18n kulcsok alapján cseréli. A {brand} helyére
// a márkanév kerül (brand.js).
const TEXTS = {
  hu: {
    navFeatures: 'Funkciók',
    navPrivacy: 'Adatvédelem',
    navWeb: 'Webes nézet',
    navDownload: 'Letöltés',
    heroEyebrow: 'Edzésnapló Androidra',
    heroTitleA: 'Edzés. Kardió.',
    heroTitleB: 'Étrend.',
    heroTitleC: 'Egy helyen.',
    heroLead: 'Offline edzésnapló, ami az adataidat a telefonodon tartja. Fiók nélkül is teljes – reklám és követés nélkül.',
    ctaDownload: 'Letöltés Androidra',
    ctaWeb: 'Naplóm a weben',
    badgeFree: 'Ingyenes',
    badgeLang: 'Magyarul és angolul',
    badgeNoAds: 'Nincs reklám',
    statExercises: 'gyakorlat izomtérképpel',
    statFoods: 'alapanyag tápértékkel',
    statMedals: 'érem-szint',
    statAds: 'reklám és követés',
    featEyebrow: 'Funkciók',
    featTitle: 'Minden, ami egy edzéshez kell',
    f1Title: 'Edzésnapló',
    f1Text: 'Tervek, sorozatok, rekordok. Az app súlyt javasol, figyeli az elakadást, és szól, ha deload kell.',
    f2Title: 'Kardió és HIIT',
    f2Text: 'Kezdő futóprogram, stopper szakaszokkal, HIIT-időzítő és becsült kalória – lezárt képernyőn is pontosan.',
    f3Title: 'Étrend',
    f3Text: 'Heti terv, receptek, bevásárlólista, vonalkód-olvasó és makrók egy pillantással.',
    f4Title: 'Érmek és kihívások',
    f4Text: 'Napi kihívás, bronz–gyémánt érmek és heti sorozat, hogy legyen kedved holnap is.',
    f5Title: 'Barátok',
    f5Text: 'Heti rangsor, gratulációk és közös kihívások – a részletes naplód soha nem látszik.',
    f6Title: 'Titkosított mentés',
    f6Text: 'Végponttól végpontig titkosítva: a kulcs csak nálad van, a szerver sem tudja elolvasni.',
    capHome: 'Főlap',
    capSession: 'Edzés közben',
    capStats: 'Statisztika',
    capDiet: 'Étrend',
    capRun: 'Futás',
    privEyebrow: 'Adatvédelem',
    privTitle: 'A te adatod a tiéd',
    priv1: 'Fiók nélkül az app semmit nem küld sehova – minden a telefonodon marad.',
    priv2: 'Nincs reklám, analitika vagy adateladás.',
    priv3: 'Az online fiók nem kötelező; a mentés végponttól végpontig titkosított.',
    priv4: 'A szerver az EU-ban van; az adataidat bármikor letöltheted vagy törölheted.',
    privMore: 'Adatvédelmi tájékoztató',
    webEyebrow: 'Webes nézet',
    webTitle: 'Nézd meg a naplód a böngészőben',
    webText: 'Lépj be az online fiókoddal: a titkosított mentésed a böngésződben nyílik ki, a kulcs nem hagyja el a gépedet. Napló, statisztika, barátok – nagy képernyőn.',
    webLogin: 'Belépés',
    dlEyebrow: 'Letöltés',
    dlTitle: 'Hamarosan a Google Playen',
    dlText: 'A {brand} jelenleg zárt tesztben van. Ha szeretnéd kipróbálni, írj nekünk.',
    dlContact: 'Jelentkezés a tesztre',
    footPrivacy: 'Adatvédelem',
    footDelete: 'Fióktörlés',
    footContact: 'Kapcsolat',
    themeLight: 'Világos téma',
    themeDark: 'Sötét téma',
    otherLang: 'English',
  },
  en: {
    navFeatures: 'Features',
    navPrivacy: 'Privacy',
    navWeb: 'Web view',
    navDownload: 'Download',
    heroEyebrow: 'Workout log for Android',
    heroTitleA: 'Training. Cardio.',
    heroTitleB: 'Diet.',
    heroTitleC: 'One place.',
    heroLead: 'An offline workout log that keeps your data on your phone. Complete without an account – no ads, no tracking.',
    ctaDownload: 'Download for Android',
    ctaWeb: 'My log on the web',
    badgeFree: 'Free',
    badgeLang: 'English and Hungarian',
    badgeNoAds: 'No ads',
    statExercises: 'exercises with muscle maps',
    statFoods: 'foods with nutrition data',
    statMedals: 'medal tiers',
    statAds: 'ads and tracking',
    featEyebrow: 'Features',
    featTitle: 'Everything a workout needs',
    f1Title: 'Workout log',
    f1Text: 'Plans, sets, records. The app suggests weights, spots plateaus and tells you when to deload.',
    f2Title: 'Cardio and HIIT',
    f2Text: 'Beginner running program, stopwatch with segments, HIIT timer and estimated calories – accurate even with the screen locked.',
    f3Title: 'Diet',
    f3Text: 'Weekly plan, recipes, shopping list, barcode scanner and macros at a glance.',
    f4Title: 'Medals and challenges',
    f4Text: 'Daily challenge, bronze to diamond medals and a weekly streak to keep you going.',
    f5Title: 'Friends',
    f5Text: 'Weekly ranking, cheers and team challenges – your detailed log is never shown.',
    f6Title: 'Encrypted backup',
    f6Text: 'End-to-end encrypted: only you hold the key, even the server cannot read it.',
    capHome: 'Home',
    capSession: 'During a workout',
    capStats: 'Statistics',
    capDiet: 'Diet',
    capRun: 'Running',
    privEyebrow: 'Privacy',
    privTitle: 'Your data is yours',
    priv1: 'Without an account the app sends nothing anywhere – everything stays on your phone.',
    priv2: 'No ads, no analytics, no selling of data.',
    priv3: 'The online account is optional; the backup is end-to-end encrypted.',
    priv4: 'The server is in the EU; download or delete your data any time.',
    privMore: 'Privacy policy',
    webEyebrow: 'Web view',
    webTitle: 'See your log in the browser',
    webText: 'Log in with your online account: your encrypted backup opens in your browser, and the key never leaves your computer. Log, statistics, friends – on a big screen.',
    webLogin: 'Log in',
    dlEyebrow: 'Download',
    dlTitle: 'Coming soon to Google Play',
    dlText: '{brand} is in a closed test right now. If you would like to try it, write to us.',
    dlContact: 'Join the test',
    footPrivacy: 'Privacy',
    footDelete: 'Account deletion',
    footContact: 'Contact',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    otherLang: 'Magyar',
  },
};

function storedPref(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storePref(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Privát ablakban nincs tárolás: csak erre a látogatásra érvényes.
  }
}

// Linkben is megadható (pl. ?lang=en&theme=light); ez nem mentődik.
const params = new URLSearchParams(location.search);

function currentLang() {
  const forced = params.get('lang');
  if (forced === 'hu' || forced === 'en') return forced;
  const saved = storedPref('lang');
  if (saved === 'hu' || saved === 'en') return saved;
  return (navigator.language || 'hu').toLowerCase().startsWith('hu') ? 'hu' : 'en';
}

function applyLang(lang) {
  const t = TEXTS[lang];
  const brand = typeof BRAND === 'object' ? BRAND.name : 'GymBro';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = t[el.dataset.i18n];
    if (v !== undefined) el.textContent = v.replaceAll('{brand}', brand);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const v = t[el.dataset.i18nTitle];
    if (v !== undefined) {
      el.title = v;
      el.setAttribute('aria-label', v);
    }
  });
  document.querySelectorAll('img[data-screen]').forEach((img) => {
    img.src = `assets/screens/${lang}_${img.dataset.screen}.webp`;
  });
  document.querySelectorAll('[data-href-lang]').forEach((a) => {
    a.href = a.dataset.hrefLang.replace('{lang}', lang);
  });
}

function currentTheme() {
  const forced = params.get('theme');
  if (forced === 'light' || forced === 'dark') return forced;
  const saved = storedPref('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  // A gomb felirata azt mondja, amire vált.
  const label = TEXTS[lang][theme === 'dark' ? 'themeLight' : 'themeDark'];
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
    b.title = label;
    b.setAttribute('aria-label', label);
  });
}

let lang = currentLang();
applyLang(lang);
applyTheme(currentTheme());

document.querySelectorAll('[data-lang-toggle]').forEach((b) =>
  b.addEventListener('click', (e) => {
    e.preventDefault();
    lang = lang === 'hu' ? 'en' : 'hu';
    storePref('lang', lang);
    applyLang(lang);
    applyTheme(document.documentElement.dataset.theme);
  }),
);
document.querySelectorAll('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    storePref('theme', next);
    applyTheme(next);
  }),
);
