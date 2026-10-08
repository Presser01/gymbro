// A webes nézet (Tamás döntései, 2026-10-07): belépés után a telefon
// legutóbbi titkosított mentése a böngészőben nyílik ki, és megtekinthető a
// napló, a statisztika, az étrend, az érmek és a barátok. Csak megtekintés.
// A kulcs és a belépés csak a memóriában él (újratöltéskor újra belépés).

import { Api, ApiError } from './api.js';
import { barChart, lineChart } from './charts.js';
import { KDF_V1, deriveAccountKeys, openBackup, unwrapDataKey } from './crypto.js';
import {
  MEDAL_KINDS,
  buildModel,
  dietDays,
  liftHistory,
  medalTiers,
  myWeek,
  summary,
  timeline,
  volumeOf,
  weeklySeries,
} from './data.js';
import { TEXTS } from './texts.js';

const $ = (sel) => document.querySelector(sel);
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ------------------------------------------------- nyelv és téma

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

const params = new URLSearchParams(location.search);
let lang = (() => {
  const forced = params.get('lang');
  if (forced === 'hu' || forced === 'en') return forced;
  const saved = storedPref('lang');
  if (saved === 'hu' || saved === 'en') return saved;
  return (navigator.language || 'hu').toLowerCase().startsWith('hu') ? 'hu' : 'en';
})();

const brand = () => (typeof BRAND === 'object' ? BRAND.name : 'Raidmate');

function t(key, vars = {}) {
  let s = TEXTS[lang][key] ?? TEXTS.hu[key] ?? key;
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s.replaceAll('{brand}', brand());
}

const locale = () => (lang === 'hu' ? 'hu-HU' : 'en-GB');
const num = (v, digits = 0) =>
  new Intl.NumberFormat(locale(), { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(v);
const dayLong = (d) =>
  new Intl.DateTimeFormat(locale(), { weekday: 'long', month: 'long', day: 'numeric' }).format(d);
const dayShort = (d) => new Intl.DateTimeFormat(locale(), { month: 'short', day: 'numeric' }).format(d);
const monthTitle = (d) => new Intl.DateTimeFormat(locale(), { year: 'numeric', month: 'long' }).format(d);
const clock = (d) => new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit' }).format(d);

function applyStatic() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach((el) => {
    el.textContent = t(el.dataset.t);
  });
  document.querySelectorAll('[data-t-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.tPlaceholder);
  });
  document.title = `${t('title')} – ${brand()}`;
  $('#refresh').title = t('refresh');
  $('#refresh').setAttribute('aria-label', t('refresh'));
  const theme = document.documentElement.dataset.theme;
  const label = t(theme === 'dark' ? 'themeLight' : 'themeDark');
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
    b.title = label;
    b.setAttribute('aria-label', label);
  });
  const style = $('#styleToggle');
  style.title = t(isNotebook() ? 'stylePlain' : 'styleNotebook');
  style.setAttribute('aria-label', t('styleNotebook'));
  style.setAttribute('aria-pressed', String(isNotebook()));
}

// ------------------------------------------------- Füzet stílus
// Tamás döntése (2026-10-07): a webes nézet az app stílusát követi (a
// mentésben lévő beállításból), de a fejlécben átkapcsolható, és a böngésző
// ezt megjegyzi.

const isNotebook = () => document.documentElement.dataset.style === 'notebook';

function setNotebook(on, pen) {
  const root = document.documentElement;
  if (on) {
    root.dataset.style = 'notebook';
    root.dataset.pen = pen === 'graphite' ? 'graphite' : 'blue';
  } else {
    delete root.dataset.style;
  }
}

/// A mentés beállításai szerint (ha a böngészőben nem választottak mást).
function followApp(model) {
  const appNotebook = model.settings.style === 'notebook';
  const pen = model.settings.notebook_pen === 'graphite' ? 'graphite' : 'blue';
  storePref('appStyle', appNotebook ? 'notebook' : 'plain');
  storePref('pen', pen);
  // ?style=notebook|plain és ?pen=blue|graphite: kényszerítve (nem tároljuk),
  // pl. képernyőképekhez.
  const forced = ['notebook', 'plain'].includes(params.get('style')) ? params.get('style') : null;
  const chosen = forced ?? storedPref('style');
  const forcedPen = ['blue', 'graphite'].includes(params.get('pen')) ? params.get('pen') : null;
  setNotebook(chosen ? chosen === 'notebook' : appNotebook, forcedPen ?? pen);
  applyStatic();
}

/// Belépéskor (és átkapcsoláskor) a „Raidmate” felíródik a lapra.
function playIntro() {
  if (!isNotebook() || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelector('.nb-intro')?.remove();
  const el = document.createElement('div');
  el.className = 'nb-intro';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<b>${esc(brand())}</b>`;
  document.body.append(el);
  setTimeout(() => el.remove(), 1100);
}

$('#styleToggle').addEventListener('click', () => {
  const on = !isNotebook();
  storePref('style', on ? 'notebook' : 'plain');
  setNotebook(on, storedPref('pen'));
  applyStatic();
  render();
  playIntro();
});

document.querySelectorAll('[data-lang-toggle]').forEach((b) =>
  b.addEventListener('click', () => {
    lang = lang === 'hu' ? 'en' : 'hu';
    storePref('lang', lang);
    applyStatic();
    render();
  }),
);
document.querySelectorAll('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    storePref('theme', next);
    applyStatic();
  }),
);

// ------------------------------------------------------- állapot

const api = new Api();
const state = {
  model: null,
  backupAt: null,
  // A frissítéshez: az adatkulcs és a betöltött mentés neve (csak a
  // memóriában; kilépéskor vagy újratöltéskor elvész).
  dataKey: null,
  backupName: null,
  friends: null,
  friendsError: false,
  logLimit: 40,
  liftId: null,
};

// ------------------------------------------------------- belépés

function setStep(text, error = false) {
  const el = $('#loginStatus');
  el.textContent = text;
  el.classList.toggle('error', error);
}

function errorText(e) {
  if (e instanceof ApiError) {
    if (e.code === 'invalid_credentials' || e.code === 'invalid_grant') return t('errCredentials');
    if (e.code === 'email_not_confirmed') return t('errNotConfirmed');
    if (e.code === 'network') return t('errNetwork');
    if (e.code === 'no_backup') return t('errNoBackup');
    if (e.code === 'http_401' || e.code === 'bad_jwt') return t('errExpired');
  }
  if (e?.message === 'invalid backup' || /invalid tag|tag/i.test(e?.message ?? '')) return t('errOpen');
  return t('errUnknown');
}

$('#loginForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const form = ev.currentTarget;
  const email = form.email.value;
  const password = form.password.value;
  const button = form.querySelector('button[type=submit]');
  button.disabled = true;
  try {
    setStep(t('stepKeys'));
    let keys = await deriveAccountKeys(email, password, KDF_V1);
    setStep(t('stepLogin'));
    await api.signIn(email.trim().toLowerCase(), keys.authPassword);
    const profile = await api.profile();
    const bundle = profile.key_bundle;
    const kdf = bundle.kdf ?? KDF_V1;
    if (kdf.m !== KDF_V1.m || kdf.t !== KDF_V1.t || (kdf.p ?? 1) !== KDF_V1.p) {
      // Későbbi, szigorúbb paraméterek: a csomagoló kulcs azokkal készült.
      setStep(t('stepKeys'));
      keys = await deriveAccountKeys(email, password, kdf);
    }
    let dataKey;
    try {
      dataKey = unwrapDataKey(bundle, keys.encKey);
    } catch {
      throw new Error('invalid backup');
    }
    setStep(t('stepDownload'));
    const list = await api.backups();
    if (!list.length) throw new ApiError('no_backup');
    const bytes = await api.download(list[0].name);
    setStep(t('stepOpen'));
    const json = await openBackup(bytes, dataKey, api.userId);
    keys.encKey.fill(0);
    state.dataKey = dataKey;
    state.model = buildModel(json);
    state.backupAt = list[0].at;
    state.backupName = list[0].name;
    form.password.value = '';
    showApp();
    loadFriends();
  } catch (e) {
    await api.signOut();
    setStep(errorText(e), true);
  } finally {
    button.disabled = false;
  }
});

async function loadFriends() {
  try {
    state.friends = await api.friends();
    state.friendsError = false;
  } catch {
    state.friends = null;
    state.friendsError = true;
  }
  if (currentView() === 'medals') render();
}

function showApp() {
  $('#login').hidden = true;
  $('#app').hidden = false;
  $('#tabs').hidden = false;
  $('#logout').hidden = false;
  $('#refresh').hidden = !state.dataKey;
  if (!location.hash) location.hash = '#log';
  followApp(state.model);
  render();
  playIntro();
}

let toastTimer;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
  }, 3500);
}

/// A legújabb mentés újratöltése belépés nélkül (pl. a telefonos „Mentés
/// most” után).
$('#refresh').addEventListener('click', async () => {
  const button = $('#refresh');
  button.disabled = true;
  try {
    const list = await api.backups();
    if (!list.length) throw new ApiError('no_backup');
    if (list[0].name === state.backupName) {
      toast(t('refreshNone'));
    } else {
      const bytes = await api.download(list[0].name);
      const json = await openBackup(bytes, state.dataKey, api.userId);
      state.model = buildModel(json);
      state.backupAt = list[0].at;
      state.backupName = list[0].name;
      followApp(state.model);
      render();
      toast(t('refreshDone'));
    }
    loadFriends();
  } catch (e) {
    toast(errorText(e));
  } finally {
    button.disabled = false;
  }
});

$('#logout').addEventListener('click', async () => {
  await api.signOut();
  // A memóriában lévő adatok eldobása: a legegyszerűbb az újratöltés.
  location.replace(location.pathname + location.search);
});

// ------------------------------------------------------- nézetek

const VIEWS = ['log', 'stats', 'diet', 'medals'];
const currentView = () => {
  const v = location.hash.slice(1);
  return VIEWS.includes(v) ? v : 'log';
};
addEventListener('hashchange', () => render());

function render() {
  if (!state.model) return;
  const view = currentView();
  document.querySelectorAll('[data-view]').forEach((a) => {
    a.classList.toggle('active', a.dataset.view === view);
    a.querySelector('span:last-child').textContent = t(a.dataset.label);
  });
  $('#backupAt').hidden = false;
  $('#backupAt').textContent = t('backupAt', {
    when: `${dayShort(state.backupAt)} ${clock(state.backupAt)}`,
  });
  $('#content').innerHTML =
    {
      log: renderLog,
      stats: renderStats,
      diet: renderDiet,
      medals: renderMedals,
    }[view]() + `<p class="muted small readonly">${esc(t('readOnly'))}</p>`;
}

$('#content').addEventListener('click', (ev) => {
  const more = ev.target.closest('[data-more]');
  if (more) {
    state.logLimit += 40;
    render();
  }
});
$('#content').addEventListener('change', (ev) => {
  if (ev.target.id === 'liftSelect') {
    state.liftId = +ev.target.value;
    render();
  }
});

const kgText = (kg) => {
  const m = state.model;
  return m.pounds ? `${num(kg * 2.20462, 1)} lb` : `${num(kg, 1)} kg`;
};

function setText(s) {
  if (s.kg != null && s.reps != null) return `${kgText(s.kg)} × ${s.reps}`;
  if (s.reps != null) return `${s.reps}`;
  if (s.sec != null) return `${s.sec} s`;
  return '–';
}

function renderLog() {
  const items = timeline(state.model);
  if (!items.length) return `<h1>${esc(t('navLog'))}</h1><p class="muted">${esc(t('logEmpty'))}</p>`;
  const shown = items.slice(0, state.logLimit);
  let html = `<h1>${esc(t('navLog'))}</h1>`;
  let month = '';
  for (const { type, at, item } of shown) {
    const m = monthTitle(at);
    if (m !== month) {
      month = m;
      html += `<h2 class="month">${esc(m)}</h2>`;
    }
    html += type === 'workout' ? workoutCard(item) : cardioCard(item);
  }
  if (items.length > shown.length) {
    html += `<button class="btn outline more" data-more>${esc(t('more'))}</button>`;
  }
  return html;
}

function workoutCard(w) {
  const name = lang === 'hu' ? w.nameHu : w.nameEn;
  const minutes = Math.round((w.end - w.start) / 60000);
  const setCount = w.exercises.reduce((s, x) => s + x.sets.length, 0);
  const meta = [
    dayLong(w.start),
    clock(w.start),
    t('minutes', { n: minutes }),
    t('sets', { n: setCount }),
    volumeOf(w) > 0 ? t('volume', { kg: num(Math.round(volumeOf(w))) }) : null,
    w.deload ? t('deload') : null,
  ].filter(Boolean);
  const rows = w.exercises
    .map((x) => {
      const ex = lang === 'hu' ? x.exercise.name_hu : x.exercise.name_en;
      return `<li><b>${esc(ex)}</b><span>${esc(x.sets.map(setText).join(', '))}</span></li>`;
    })
    .join('');
  return (
    `<article class="card entry"><div class="entry-head">` +
    `<span class="mi i-fitness-center plate plate-${esc(w.color)}"></span>` +
    `<div><h3>${esc(name)}</h3><p class="muted small">${esc(meta.join(' · '))}</p></div></div>` +
    `<ul class="sets">${rows}</ul>` +
    (w.note ? `<p class="note">${esc(w.note)}</p>` : '') +
    `</article>`
  );
}

function cardioCard(r) {
  const name = r.name || t(`act_${r.activity}`);
  const minutes = Math.round(r.sec / 60);
  const pace =
    r.km && ['run', 'walk'].includes(r.activity)
      ? t('pace', {
          pace: `${Math.floor(r.sec / 60 / r.km)}:${String(Math.round(((r.sec / r.km) % 60))).padStart(2, '0')}`,
        })
      : null;
  const meta = [
    dayLong(r.start),
    clock(r.start),
    t('minutes', { n: minutes }),
    r.km ? `${num(r.km, 2)} km` : null,
    pace,
    r.kcal ? t('kcalApprox', { n: num(Math.round(r.kcal)) }) : null,
  ].filter(Boolean);
  return (
    `<article class="card entry"><div class="entry-head">` +
    `<span class="mi i-directions-run plate"></span>` +
    `<div><h3>${esc(name)}</h3><p class="muted small">${esc(meta.join(' · '))}</p></div></div></article>`
  );
}

function renderStats() {
  const m = state.model;
  const now = new Date();
  const s = summary(m, now);
  const weeks = weeklySeries(m, now, 12);
  const tiles = [
    [t('statThisWeek'), `${s.thisWeek}/${s.goal}`],
    [t('statTotal'), num(s.total)],
    [t('statVolume30'), `${num(Math.round(s.volume30))} kg`],
    [t('statCardio30'), `${num(s.cardioKm30, 1)} km`],
    [t('statWeight'), s.lastWeight ? kgText(s.lastWeight.kg) : '–'],
  ]
    .map(([label, value]) => `<div class="tile"><b>${esc(value)}</b><span>${esc(label)}</span></div>`)
    .join('');
  const weekLabel = (w) => dayShort(w.weekStart);
  const lifts = liftHistory(m);
  const lift = lifts.find((h) => h.exercise.id === state.liftId) ?? lifts[0];
  const exName = (e) => (lang === 'hu' ? e.name_hu : e.name_en);
  const weights = m.weights.filter((w) => w.date >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 120));

  return (
    `<h1>${esc(t('navStats'))}</h1><div class="tiles">${tiles}</div>` +
    `<section class="card"><h3>${esc(t('chartWorkouts'))}</h3>` +
    barChart(
      weeks.map((w) => ({ label: weekLabel(w), value: w.workouts })),
      { label: t('chartWorkouts') },
    ) +
    `</section><section class="card"><h3>${esc(t('chartVolume'))}</h3>` +
    barChart(
      weeks.map((w) => ({ label: weekLabel(w), value: w.volume })),
      { fmt: (v) => num(Math.round(v)), label: t('chartVolume') },
    ) +
    `</section><section class="card"><div class="row"><h3>${esc(t('chartLift'))}</h3>` +
    (lifts.length
      ? `<select id="liftSelect">${lifts
          .map(
            (h) =>
              `<option value="${h.exercise.id}"${h === lift ? ' selected' : ''}>${esc(exName(h.exercise))}</option>`,
          )
          .join('')}</select></div>` +
        lineChart(lift.points, { fmt: (v) => num(v, 1), dateFmt: dayShort, label: t('chartLift') }) +
        `<p class="muted small">${esc(
          t('liftBest', {
            value: kgText(lift.best),
            set: setText(lift.bestSet),
            date: dayShort(lift.bestAt),
          }),
        )}</p>`
      : `</div><p class="muted">${esc(t('noData'))}</p>`) +
    `</section><section class="card"><h3>${esc(t('chartWeight'))}</h3>` +
    (weights.length >= 2
      ? lineChart(
          weights.map((w) => ({ date: w.date, value: w.kg })),
          { fmt: (v) => num(v, 1), dateFmt: dayShort, label: t('chartWeight') },
        )
      : `<p class="muted">${esc(t('noData'))}</p>`) +
    `</section>`
  );
}

function bar(value, target, label) {
  const scale = Math.max(target.max * 1.15, value);
  const pct = Math.min(100, (value / scale) * 100);
  const marks = [target.min, target.max]
    .map((v) => `<i style="left:${Math.min(100, (v / scale) * 100)}%"></i>`)
    .join('');
  const inRange = value >= target.min * 0.97 && value <= target.max * 1.03;
  const over = value > target.max * 1.03;
  const targetText = target.min === target.max ? num(target.min) : `${num(target.min)}–${num(target.max)}`;
  return (
    `<div class="macro"><div class="row"><span>${esc(label)}</span>` +
    `<b>${num(Math.round(value))} / ${esc(targetText)}</b></div>` +
    `<div class="track"><div class="fill${inRange ? ' ok' : over ? ' over' : ''}" style="width:${pct}%"></div>${marks}</div></div>`
  );
}

function renderDiet() {
  const days = dietDays(state.model);
  if (!days.length) return `<h1>${esc(t('navDiet'))}</h1><p class="muted">${esc(t('dietEmpty'))}</p>`;
  const itemName = (l) => {
    if (l.recipe) return lang === 'hu' ? l.recipe.name_hu : l.recipe.name_en;
    if (l.food) return lang === 'hu' ? l.food.name_hu : l.food.name_en;
    return l.name;
  };
  const amount = (l) => (l.unit == null ? t('servings', { n: num(l.amount, 2) }) : `${num(l.amount, 1)} ${l.unit === 'pcs' ? (lang === 'hu' ? 'db' : 'pcs') : l.unit === 'clove' ? (lang === 'hu' ? 'gerezd' : 'clove') : l.unit}`);
  return (
    `<h1>${esc(t('navDiet'))}</h1>` +
    days
      .slice(0, 30)
      .map(
        (d) =>
          `<article class="card day"><div class="row"><h3>${esc(dayLong(d.date))}</h3>` +
          `<span class="muted small">${esc(t('dietMeals', { n: d.mainMeals }))}</span></div>` +
          `<div class="macros">${bar(d.kcal, d.targets.kcal, t('dietKcal'))}${bar(d.protein, d.targets.protein, t('dietProtein'))}</div>` +
          (d.plannedKcal > 0 ? `<p class="muted small">${esc(t('dietPlanned', { n: num(Math.round(d.plannedKcal)) }))}</p>` : '') +
          d.slots
            .map(
              (s) =>
                `<h4>${esc(t(`slot_${s.slot}`))}</h4><ul class="foods">` +
                s.items
                  .map(
                    (l) =>
                      `<li class="${l.eaten ? '' : 'planned'}"><span>${esc(itemName(l))}</span>` +
                      `<span class="muted small">${esc(
                        [amount(l), `${num(Math.round(l.kcal ?? 0))} kcal`, l.eaten && l.eatenAt ? clock(l.eatenAt) : t('planned')].join(' · '),
                      )}</span></li>`,
                  )
                  .join('') +
                `</ul>`,
            )
            .join('') +
          `</article>`,
      )
      .join('')
  );
}

function renderMedals() {
  const tiers = medalTiers(state.model);
  const got = Object.values(tiers).reduce((a, b) => a + b, 0);
  const medals = MEDAL_KINDS.map(
    (k) =>
      `<div class="medal tier${tiers[k]}"><span class="mi i-emoji-events"></span>` +
      `<b>${esc(t(`ach_${k}`))}</b><span class="small">${esc(t(`tier${tiers[k]}`))}</span></div>`,
  ).join('');

  let friends;
  if (state.friendsError) {
    friends = `<p class="muted">${esc(t('friendsOffline'))}</p>`;
  } else if (state.friends == null) {
    friends = `<p class="muted">…</p>`;
  } else {
    const mine = myWeek(state.model, new Date());
    const monday = (() => {
      const d = new Date();
      const back = (d.getDay() + 6) % 7;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() - back);
    })();
    const rows = [
      { name: t('you'), me: true, workouts: mine.workouts, goal: mine.goal, cardio: mine.cardio },
      ...state.friends
        .filter((f) => f.relation === 'friend')
        .map((f) => {
          const w = f.week;
          const current = w && new Date(`${w.week_start}T00:00:00`) >= monday;
          return {
            name: f.display_name || f.username,
            workouts: current ? w.workouts ?? 0 : 0,
            goal: w?.goal ?? null,
            cardio: current ? w.cardio ?? 0 : 0,
            medals: (f.medals ?? []).length,
          };
        }),
    ].sort((a, b) => b.workouts - a.workouts || a.name.localeCompare(b.name));
    friends =
      rows.length === 1
        ? `<p class="muted">${esc(t('friendsNone'))}</p>`
        : `<ol class="rank">${rows
            .map(
              (r, i) =>
                `<li class="${r.me ? 'me' : ''}"><span class="pos">${i + 1}.</span><b>${esc(r.name)}</b>` +
                `<span>${esc(r.goal ? t('workoutsOfGoal', { n: r.workouts, goal: r.goal }) : `${r.workouts}`)}</span>` +
                `<span class="muted">${esc(t('cardioCount', { n: r.cardio }))}</span></li>`,
            )
            .join('')}</ol>`;
  }

  return (
    `<h1>${esc(t('navMedals'))}</h1>` +
    `<section class="card"><div class="row"><h3>${esc(t('medalsTitle'))}</h3>` +
    `<span class="muted small">${esc(t('medalsCount', { got, total: MEDAL_KINDS.length * 4 }))}</span></div>` +
    `<div class="medals">${medals}</div></section>` +
    `<section class="card"><h3>${esc(t('friendsTitle'))}</h3>` +
    `<p class="muted small">${esc(t('friendsRankHint'))}</p>${friends}</section>`
  );
}

applyStatic();

// Fejlesztéshez: csak a saját gépen (127.0.0.1) futva, ?demo=<útvonal>
// paraméterrel a demó-mentés belépés nélkül (tools/demo). Éles címen nem
// működik.
if (['127.0.0.1', 'localhost'].includes(location.hostname) && params.get('demo')) {
  fetch(params.get('demo'))
    .then((r) => r.json())
    .then((json) => {
      state.model = buildModel(json);
      state.backupAt = new Date(json.createdAt);
      state.friends = [];
      showApp();
    });
}
