// Egyszerű SVG-grafikonok külső könyvtár nélkül. A színeket a CSS adja
// (currentColor és a téma változói), így sötét és világos módban is jó.

const W = 640;
const H = 220;
const PAD = { l: 44, r: 12, t: 12, b: 28 };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function niceMax(v) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (v <= m * p) return m * p;
  return 10 * p;
}

function grid(max, fmt) {
  const lines = [];
  for (let i = 0; i <= 4; i++) {
    const v = (max * i) / 4;
    const y = PAD.t + (H - PAD.t - PAD.b) * (1 - i / 4);
    lines.push(
      `<line class="grid" x1="${PAD.l}" x2="${W - PAD.r}" y1="${y}" y2="${y}"/>` +
        `<text class="axis" x="${PAD.l - 6}" y="${y + 4}" text-anchor="end">${esc(fmt(v))}</text>`,
    );
  }
  return lines.join('');
}

/// Oszlopdiagram: [{ label, value, title }], az utolsó oszlop kiemelve.
export function barChart(items, { fmt = (v) => Math.round(v), label = '' } = {}) {
  const max = niceMax(Math.max(...items.map((i) => i.value), 0));
  const cw = (W - PAD.l - PAD.r) / items.length;
  const bars = items
    .map((it, i) => {
      const h = ((H - PAD.t - PAD.b) * it.value) / max;
      const x = PAD.l + i * cw + cw * 0.18;
      const y = H - PAD.b - h;
      const cls = i === items.length - 1 ? 'bar now' : 'bar';
      return (
        `<rect class="${cls}" x="${x}" y="${y}" width="${cw * 0.64}" height="${Math.max(h, 0)}" rx="4">` +
        `<title>${esc(it.title ?? `${it.label}: ${fmt(it.value)}`)}</title></rect>` +
        (i % 2 === items.length % 2 ? '' : `<text class="axis" x="${x + cw * 0.32}" y="${H - 8}" text-anchor="middle">${esc(it.label)}</text>`)
      );
    })
    .join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${grid(max, fmt)}${bars}</svg>`;
}

/// Vonaldiagram: [{ date, value }] időrendben.
export function lineChart(points, { fmt = (v) => Math.round(v), dateFmt = (d) => d.toLocaleDateString(), label = '' } = {}) {
  if (points.length < 2) return '';
  const values = points.map((p) => p.value);
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  const pad = Math.max((hi - lo) * 0.15, 1);
  lo = Math.max(0, lo - pad);
  hi += pad;
  const t0 = points[0].date.getTime();
  const t1 = points.at(-1).date.getTime();
  const x = (d) => PAD.l + ((W - PAD.l - PAD.r) * (d.getTime() - t0)) / Math.max(t1 - t0, 1);
  const y = (v) => PAD.t + (H - PAD.t - PAD.b) * (1 - (v - lo) / (hi - lo));
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const v = lo + ((hi - lo) * i) / 4;
    const yy = y(v);
    gridLines.push(
      `<line class="grid" x1="${PAD.l}" x2="${W - PAD.r}" y1="${yy}" y2="${yy}"/>` +
        `<text class="axis" x="${PAD.l - 6}" y="${yy + 4}" text-anchor="end">${esc(fmt(v))}</text>`,
    );
  }
  const dots = points
    .map(
      (p) =>
        `<circle class="dot" cx="${x(p.date).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3.5">` +
        `<title>${esc(`${dateFmt(p.date)}: ${fmt(p.value)}`)}</title></circle>`,
    )
    .join('');
  const ends =
    `<text class="axis" x="${PAD.l}" y="${H - 8}">${esc(dateFmt(points[0].date))}</text>` +
    `<text class="axis" x="${W - PAD.r}" y="${H - 8}" text-anchor="end">${esc(dateFmt(points.at(-1).date))}</text>`;
  return (
    `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">` +
    `${gridLines.join('')}<path class="line" d="${path}"/>${dots}${ends}</svg>`
  );
}
