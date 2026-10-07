// A kibontott mentés (az app adatbázisának táblái) → a webes nézet adatai:
// napló, statisztika, étrend, érmek. Tiszta logika, böngésző nélkül is
// tesztelhető (tools/web/verify_web_data.mjs).
//
// A mentés formája: { schema, createdAt, tables: { név: { columns, rows } } };
// az időpontok szövegként („2026-08-10T18:05:00.000 +02:00”, a régebbi
// mentésekben Unix-másodpercként), a logikai értékek 0/1.

const date = (v) => {
  if (v == null) return null;
  if (typeof v === 'number') return new Date(v * 1000);
  // A Drift szóközt tesz az időzóna elé; a böngésző anélkül érti.
  return new Date(String(v).replace(/ ([+-]\d{2}:\d{2})$/, '$1'));
};

export function tableRows(json, name) {
  const t = json.tables?.[name];
  if (!t) return [];
  const cols = t.columns;
  return t.rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
}

function groupBy(items, key) {
  const m = new Map();
  for (const it of items) {
    const k = key(it);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(it);
  }
  return m;
}

export const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/// A hét első napja (1 = hétfő … 7 = vasárnap), mint az appban.
export function startOfWeek(d, firstWeekday = 1) {
  const day = startOfDay(d);
  const weekday = ((day.getDay() + 6) % 7) + 1; // hétfő = 1
  const back = (weekday - firstWeekday + 7) % 7;
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() - back);
}

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/// Becsült 1RM (Epley): súly × (1 + ismétlés / 30), mint az appban.
export const e1rm = (kg, reps) => (kg > 0 && reps > 0 ? kg * (1 + reps / 30) : 0);

/// „2400-2600” vagy „2500” → { min, max }.
export function parseRange(text, fallback) {
  const m = /^\s*(\d+)(?:\s*-\s*(\d+))?\s*$/.exec(text ?? '');
  if (!m) return fallback;
  return { min: +m[1], max: +(m[2] ?? m[1]) };
}

/// A mentés teljes beolvasása.
export function buildModel(json) {
  const settings = Object.fromEntries(tableRows(json, 'settings').map((r) => [r.key, r.value]));
  const exercises = new Map(tableRows(json, 'exercises').map((e) => [e.id, e]));
  const setsBy = groupBy(tableRows(json, 'workout_sets'), (s) => s.workout_exercise_id);
  const wexBy = groupBy(tableRows(json, 'workout_exercises'), (w) => w.workout_id);

  const workouts = tableRows(json, 'workouts')
    .filter((w) => w.finished_at != null)
    .map((w) => ({
      id: w.id,
      start: date(w.started_at),
      end: date(w.finished_at),
      nameHu: w.day_name_hu,
      nameEn: w.day_name_en,
      color: w.color,
      note: w.note,
      deload: !!w.is_deload,
      exercises: (wexBy.get(w.id) ?? [])
        .sort((a, b) => a.position - b.position)
        .map((x) => ({
          exercise: exercises.get(x.exercise_id),
          sets: (setsBy.get(x.id) ?? [])
            .sort((a, b) => a.position - b.position)
            .filter((s) => s.done)
            .map((s) => ({ kg: s.weight_kg, reps: s.reps, sec: s.duration_sec, kind: s.kind })),
        }))
        .filter((x) => x.exercise && x.sets.length),
    }))
    .sort((a, b) => b.start - a.start);

  const runs = tableRows(json, 'runs')
    .map((r) => ({
      start: date(r.started_at),
      sec: r.duration_sec,
      km: r.distance_km,
      activity: r.activity ?? 'run',
      name: r.activity_name ?? r.custom_name,
      kcal: r.kcal,
    }))
    .sort((a, b) => b.start - a.start);

  const weights = tableRows(json, 'body_weights')
    .map((w) => ({ date: date(w.date), kg: w.kg }))
    .sort((a, b) => a.date - b.date);

  const recipes = new Map(tableRows(json, 'recipes').map((r) => [r.id, r]));
  const foods = new Map(tableRows(json, 'ingredients').map((i) => [i.id, i]));
  const foodLogs = tableRows(json, 'food_logs').map((f) => ({
    id: f.id,
    date: date(f.date),
    slot: f.slot,
    recipe: recipes.get(f.recipe_id),
    food: foods.get(f.ingredient_id),
    amount: f.amount,
    unit: f.unit,
    name: f.name,
    kcal: f.kcal,
    protein: f.protein,
    eaten: !!f.eaten,
    eatenAt: date(f.eaten_at),
  }));

  return {
    schema: json.schema,
    createdAt: new Date(json.createdAt),
    settings,
    firstWeekday: +(settings.first_weekday ?? 1),
    weeklyGoal: +(settings.weekly_workout_goal ?? 4),
    pounds: settings.unit === 'lb',
    workouts,
    runs,
    weights,
    foodLogs,
    exercises,
  };
}

// --------------------------------------------------------------- napló

/// A megmozgatott súly (a bemelegítő sorozatok nélkül).
export const volumeOf = (w) =>
  w.exercises.reduce(
    (sum, x) =>
      sum + x.sets.reduce((s, set) => s + (set.kind === 'warmup' ? 0 : (set.kg ?? 0) * (set.reps ?? 0)), 0),
    0,
  );

/// Az edzések és a kardió időrendben (legújabb elöl), egy közös listában.
export function timeline(model) {
  return [
    ...model.workouts.map((w) => ({ type: 'workout', at: w.start, item: w })),
    ...model.runs.map((r) => ({ type: 'cardio', at: r.start, item: r })),
  ].sort((a, b) => b.at - a.at);
}

// ---------------------------------------------------------- statisztika

/// Az utolsó [weeks] hét edzésszáma, volumene és kardió-távja (régi elöl).
export function weeklySeries(model, now, weeks = 12) {
  const first = startOfWeek(now, model.firstWeekday);
  const out = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const from = addDays(first, -7 * i);
    const to = addDays(from, 7);
    const inWeek = (d) => d >= from && d < to;
    const ws = model.workouts.filter((w) => inWeek(w.start));
    out.push({
      weekStart: from,
      workouts: ws.length,
      volume: ws.reduce((s, w) => s + volumeOf(w), 0),
      cardioKm: model.runs.filter((r) => inWeek(r.start)).reduce((s, r) => s + (r.km ?? 0), 0),
      cardio: model.runs.filter((r) => inWeek(r.start)).length,
    });
  }
  return out;
}

/// Gyakorlatonként a legjobb becsült 1RM edzésenként (a grafikonhoz), és
/// a csúcs. Csak súllyal végzett, legalább [minSessions] edzésen szereplő.
export function liftHistory(model, minSessions = 2) {
  const by = new Map();
  for (const w of [...model.workouts].reverse()) {
    for (const x of w.exercises) {
      let best = 0;
      let top = null;
      for (const s of x.sets) {
        if (s.kind === 'warmup') continue;
        const v = e1rm(s.kg ?? 0, s.reps ?? 0);
        if (v > best) {
          best = v;
          top = s;
        }
      }
      if (best <= 0) continue;
      const id = x.exercise.id;
      if (!by.has(id)) by.set(id, { exercise: x.exercise, points: [], best: 0, bestSet: null, bestAt: null });
      const h = by.get(id);
      h.points.push({ date: w.start, value: best });
      if (best > h.best) {
        h.best = best;
        h.bestSet = top;
        h.bestAt = w.start;
      }
    }
  }
  // A fő emelések elöl (mint az erő-érmeknél), utána a gyakoribbak.
  const main = ['bench_press', 'back_squat', 'deadlift', 'overhead_press'];
  const rank = (h) => {
    const i = main.indexOf(h.exercise.slug);
    return i < 0 ? main.length : i;
  };
  return [...by.values()]
    .filter((h) => h.points.length >= minSessions)
    .sort((a, b) => rank(a) - rank(b) || b.points.length - a.points.length);
}

/// Összesítők a csempékhez.
export function summary(model, now) {
  const week = startOfWeek(now, model.firstWeekday);
  const since30 = addDays(startOfDay(now), -29);
  const last30 = model.workouts.filter((w) => w.start >= since30);
  return {
    thisWeek: model.workouts.filter((w) => w.start >= week).length,
    goal: model.weeklyGoal,
    total: model.workouts.length,
    volume30: last30.reduce((s, w) => s + volumeOf(w), 0),
    cardioKm30: model.runs.filter((r) => r.start >= since30).reduce((s, r) => s + (r.km ?? 0), 0),
    lastWeight: model.weights.at(-1) ?? null,
  };
}

// --------------------------------------------------------------- étrend

export const SLOTS = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'snack'];

/// Az étkezésnapló napjai (legújabb elöl): étkezésenként a tételek, a
/// megevett kalória és fehérje, és a célok.
export function dietDays(model) {
  const kcal = parseRange(model.settings.target_kcal, { min: 2400, max: 2600 });
  const protein = parseRange(model.settings.target_protein, { min: 160, max: 180 });
  const byDay = groupBy(model.foodLogs, (f) => dayKey(f.date));
  return [...byDay.entries()]
    .map(([key, logs]) => {
      const eaten = logs.filter((l) => l.eaten);
      return {
        key,
        date: logs[0].date,
        slots: SLOTS.map((slot) => ({
          slot,
          items: logs
            .filter((l) => l.slot === slot)
            .sort((a, b) => (a.eatenAt ?? a.date) - (b.eatenAt ?? b.date)),
        })).filter((s) => s.items.length),
        kcal: eaten.reduce((s, l) => s + (l.kcal ?? 0), 0),
        protein: eaten.reduce((s, l) => s + (l.protein ?? 0), 0),
        plannedKcal: logs.filter((l) => !l.eaten).reduce((s, l) => s + (l.kcal ?? 0), 0),
        mainMeals: new Set(eaten.map((l) => l.slot).filter((s) => ['breakfast', 'lunch', 'dinner'].includes(s))).size,
        targets: { kcal, protein },
      };
    })
    .sort((a, b) => b.date - a.date);
}

// ---------------------------------------------------------------- érmek

export const MEDAL_KINDS = [
  'workouts',
  'weeklyStreak',
  'volume',
  'records',
  'bench',
  'squat',
  'deadlift',
  'overheadPress',
  'runs',
  'mealDays',
  'weighIns',
  'challenges',
  'challengeStreak',
  'teamChallenges',
];

/// Az elért szintek kategóriánként (0–4) a beállításokból („workouts:2,…”):
/// az app ide jegyzi fel, amit már megünnepelt.
export function medalTiers(model) {
  const tiers = Object.fromEntries(MEDAL_KINDS.map((k) => [k, 0]));
  for (const part of (model.settings.achievements_seen ?? '').split(',')) {
    const [k, n] = part.split(':');
    if (k in tiers) tiers[k] = Math.max(0, Math.min(4, +n || 0));
  }
  return tiers;
}

/// A saját heti számaim a barátok rangsorához.
export function myWeek(model, now) {
  const week = startOfWeek(now, 1); // a közös hét hétfőtől indul
  return {
    workouts: model.workouts.filter((w) => w.start >= week).length,
    goal: model.weeklyGoal,
    cardio: model.runs.filter((r) => r.start >= week).length,
  };
}
