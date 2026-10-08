// Magyar és angol szövegek. A HTML-ben a magyar áll (JavaScript nélkül is
// olvasható); ez a fájl a data-i18n kulcsok alapján cseréli. A {brand} helyére
// a márkanév kerül (brand.js).
const TEXTS = {
  hu: {
    navFeatures: 'Funkciók',
    navPrivacy: 'Adatvédelem',
    navWeb: 'Webes nézet',
    navCoaches: 'Edzők',
    navHome: 'Főoldal',
    coachesEyebrow: 'Edzőkereső',
    coachesTitle: 'Találd meg az edződ',
    coachesLead: 'Személyi edzők és online coachok, akik a {brand}-ben jelentkeztek, és akiket jóváhagytunk. A keresés a böngésződben történik: nem küldjük el, mit kerestél.',
    coachesLoading: 'Betöltés…',
    coachesPlansLink: 'Edző vagy? Csomagok edzőknek →',
    plansEyebrow: 'Edzőknek',
    plansTitle: 'Csomagok edzőknek',
    plansLead: 'Az edzőkereső és a gyakorlatvideók alapból ingyenesek. A Pro és a Prémium több videót ad, a Prémium „Kiemelt” jelölést is.',
    plansSoon: 'Hamarosan',
    plansFree: 'Ingyenes',
    planBasic: 'Alap',
    planPro: 'Pro',
    planPremium: 'Prémium',
    planBasicPrice: '0 Ft',
    planProPrice: '1 990 Ft / hó',
    planProYear: 'vagy 18 990 Ft / év (5 € / hó, 49 € / év)',
    planPremiumPrice: '4 490 Ft / hó',
    planPremiumYear: 'vagy 44 990 Ft / év (12 € / hó, 119 € / év)',
    planListing: 'Profil az edzőkeresőben (appban és itt)',
    planVideos10: '10 gyakorlatvideó, gyakorlatonként 1',
    planVideos30: '30 gyakorlatvideó, gyakorlatonként 2',
    planVideos100: '100 gyakorlatvideó, gyakorlatonként 3',
    planRatings: 'Értékelések és „Ellenőrzött végzettség” jelvény',
    planFeatured: '„Kiemelt” jelölés: a videóid nagyobb eséllyel kerülnek előre, és a keresőben kicsit előrébb vagy',
    plansFairTitle: 'Tisztességes kiemelés',
    plansFairText: 'A kiemelés mindig jelölve van. A kiemelt helyek legalább 30%-a a többi edzőé, és az ellenőrzött végzettségű edzők, valamint a felhasználók kedvencei így is elöl maradnak.',
    plansHowTitle: 'Hogyan kapom meg?',
    plansHowText: 'A fizetés még nem indult el. Addig a szintet az appban kérheted (Profil → Online fiók → Edzőprofilom → Szint kérése), és ha a jóváhagyó megadja, ingyen kapod meg egy időre. Az első edzők alapítóként 12 hónap Pro szintet kapnak.',
    plansBack: '← Vissza az edzőkhöz',
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
    navCoaches: 'Coaches',
    navHome: 'Home',
    coachesEyebrow: 'Coach finder',
    coachesTitle: 'Find your coach',
    coachesLead: "Personal trainers and online coaches who applied in {brand} and whom we approved. The search runs in your browser: we don't send what you searched for.",
    coachesLoading: 'Loading…',
    coachesPlansLink: 'Are you a coach? Plans for coaches →',
    plansEyebrow: 'For coaches',
    plansTitle: 'Plans for coaches',
    plansLead: 'The coach finder and exercise videos are free to start with. Pro and Premium give you more videos, and Premium adds the "Featured" label.',
    plansSoon: 'Coming soon',
    plansFree: 'Free',
    planBasic: 'Basic',
    planPro: 'Pro',
    planPremium: 'Premium',
    planBasicPrice: '€0',
    planProPrice: '€5 / month',
    planProYear: 'or €49 / year (1,990 HUF / month, 18,990 HUF / year)',
    planPremiumPrice: '€12 / month',
    planPremiumYear: 'or €119 / year (4,490 HUF / month, 44,990 HUF / year)',
    planListing: 'Profile in the coach finder (in the app and here)',
    planVideos10: '10 exercise videos, 1 per exercise',
    planVideos30: '30 exercise videos, 2 per exercise',
    planVideos100: '100 exercise videos, 3 per exercise',
    planRatings: 'Ratings and the "Verified qualification" badge',
    planFeatured: '"Featured" label: your videos are more likely to come first, and you appear a little higher in the finder',
    plansFairTitle: 'Fair promotion',
    plansFairText: 'Promotion is always labelled. At least 30% of the top spots go to other coaches, and coaches with a verified qualification and users\' favourites still come first.',
    plansHowTitle: 'How do I get it?',
    plansHowText: 'Payments haven\'t started yet. Until then, you can request a level in the app (Profile → Online account → My coach profile → Request a level), and if the reviewer grants it, you get it free of charge for a while. The first coaches get Pro for 12 months as founding coaches.',
    plansBack: '← Back to coaches',
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
  const brand = typeof BRAND === 'object' ? BRAND.name : 'Raidmate';
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
