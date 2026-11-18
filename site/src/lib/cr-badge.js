// Pure badge rendering for the AI Creation & Review Scale.
// No DOM, no network, no tracking. Safe to run in a browser or in Node.

import { CREATION, REVIEW, SCALE_NAME, referenceFor } from './cr-scale.js';

// Brand palette (matches the site): black, sky-blue accent, cool greys.
const INK = '#000000';
const MUTED = '#575F6A';
const MID = '#9CA3AF';
const BORDER = '#D4D8DE';
const SURFACE = '#F8F9FA';
const ACCENT = '#38BDF8';
const FONT = 'Arial, Helvetica, sans-serif';
const TINT = '#EAF8FE'; // accent at about 12% on white

// Three looks for the same label. All carry the AI c/r mark, the two values and a link cue.
export const STYLES = ['strip', 'scales', 'seal'];

const xml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

export function normalise(d) {
  const c = Number(d.c);
  const r = Number(d.r);
  if (!Number.isInteger(c) || !Number.isInteger(r) || !CREATION[c] || !REVIEW[r]) {
    throw new Error('Unknown scale value');
  }
  return {
    c,
    r,
    format: d.format === 'panel' ? 'panel' : 'compact',
    style: STYLES.includes(d.style) ? d.style : 'strip',
    creator: d.creator || '',
    // Without a review there is no reviewer and no review date.
    reviewer: r ? d.reviewer || '' : '',
    date: r ? d.date || '' : '',
    artifact: d.artifact || '',
    scope: d.scope || '',
    purpose: d.purpose || '',
    checks: d.checks || '',
  };
}

function detailRows(d) {
  return [
    ['Creator', d.creator],
    ['Human reviewer', d.reviewer],
    ['Artifact version', d.artifact],
    ['Review date', d.date],
    ['Scope', d.scope],
    ['Intended use', d.purpose],
    ['Checks and limitations', d.checks],
  ].filter(([, v]) => v);
}

// One searchable line to place next to the badge. Contains the scale name, so
// readers can find the explanation page even if the link is lost.
export function caption(input) {
  const d = normalise(input);
  return `${SCALE_NAME}: C${d.c} ${CREATION[d.c].name}, R${d.r} ${REVIEW[d.r].name}`;
}

// Full disclosure note: the caption plus every detail the user supplied.
export function disclosure(input) {
  const d = normalise(input);
  return [caption(d), ...detailRows(d).map(([k, v]) => `${k}: ${v}`)].join('\n');
}

// Text shown and copied in the generator for the chosen format.
export function noteFor(input) {
  const d = normalise(input);
  return d.format === 'panel' ? disclosure(d) : caption(d);
}

// Greedy wrap by approximate glyph width. Wide (non-Latin) characters count double.
function wrap(text, maxUnits) {
  const out = [];
  for (const paragraph of String(text).split(/\r?\n/)) {
    let line = '';
    let units = 0;
    for (const word of paragraph.split(/(\s+)/)) {
      const w = [...word].reduce((n, ch) => n + (ch.codePointAt(0) > 255 ? 2 : 1), 0);
      if (units + w > maxUnits && line.trim()) {
        out.push(line.trimEnd());
        line = '';
        units = 0;
        if (!word.trim()) continue;
      }
      // Break a single over-long word.
      if (w > maxUnits) {
        for (const ch of word) {
          const n = ch.codePointAt(0) > 255 ? 2 : 1;
          if (units + n > maxUnits) {
            out.push(line);
            line = '';
            units = 0;
          }
          line += ch;
          units += n;
        }
        continue;
      }
      line += word;
      units += w;
    }
    out.push(line.trimEnd());
  }
  return out;
}

const text = (x, y, s, size, fill, extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${xml(s)}</text>`;

// Scale mark. The "AI" makes clear at a glance that this label is about AI content.
function markShapes(x, y, w, h) {
  const big = h > 40;
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${INK}"/>` +
    `<text x="${x + w / 2}" y="${y + h * (big ? 0.42 : 0.4)}" font-size="${big ? 10 : 8.5}" font-weight="700" text-anchor="middle" fill="#FFFFFF" letter-spacing="1.8">AI</text>` +
    `<text x="${x + w / 2}" y="${y + h * (big ? 0.8 : 0.79)}" font-size="${big ? 15 : 13}" font-weight="700" text-anchor="middle" fill="${ACCENT}" letter-spacing="-.5">c/r</text>`
  );
}

// "i" cue: tells the reader the badge is a link to the explanation.
function infoShapes(cx, cy, r = 8.5, onDark = false) {
  const stroke = onDark ? '#FFFFFF' : INK;
  const fill = onDark ? ACCENT : 'none';
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.3"/>` +
    `<text x="${cx}" y="${cy + r * 0.47}" font-size="${r * 1.4}" font-weight="700" font-style="italic" text-anchor="middle" fill="${INK}" font-family="Georgia, serif">i</text>`
  );
}

// Style "strip": [ AI c/r | C3 | R4 | (i) ]
function strip(d, x, y) {
  const h = 32;
  const my = y + 21;
  return {
    w: 160,
    h,
    round: 4,
    svg: [
      markShapes(x, y, 44, h),
      `<rect x="${x + 44}" y="${y}" width="42" height="${h}" fill="${SURFACE}"/>`,
      `<text x="${x + 65}" y="${my}" font-size="15" font-weight="700" text-anchor="middle" fill="${INK}">C${d.c}</text>`,
      `<rect x="${x + 86}" y="${y}" width="42" height="${h}" fill="${ACCENT}"/>`,
      `<text x="${x + 107}" y="${my}" font-size="15" font-weight="700" text-anchor="middle" fill="${INK}">R${d.r}</text>`,
      `<rect x="${x + 128}" y="${y}" width="32" height="${h}" fill="#FFFFFF"/>`,
      infoShapes(x + 144, y + 16),
    ].join(''),
  };
}

// Style "scales": shows where the value sits on each of the two five-step scales.
// A position marker, not a fill, because a higher C is not "better" than a lower one.
function scales(d, x, y) {
  const h = 44;
  const dots = (cy, level, active, activeStroke) => {
    const x0 = x + 98;
    const gap = 17;
    let out = `<line x1="${x0}" y1="${cy}" x2="${x0 + gap * 4}" y2="${cy}" stroke="${BORDER}" stroke-width="1.5"/>`;
    for (let i = 0; i < 5; i++) {
      const cx = x0 + gap * i;
      out += i === level
        ? `<circle cx="${cx}" cy="${cy}" r="5.8" fill="${active}" stroke="${activeStroke}" stroke-width="1.5"/>`
        : `<circle cx="${cx}" cy="${cy}" r="3.2" fill="#FFFFFF" stroke="${MID}" stroke-width="1"/>`;
    }
    return out;
  };
  return {
    w: 214,
    h,
    round: 4,
    svg: [
      markShapes(x, y, 46, h),
      `<rect x="${x + 46}" y="${y}" width="138" height="22" fill="${SURFACE}"/>`,
      `<rect x="${x + 46}" y="${y + 22}" width="138" height="22" fill="${TINT}"/>`,
      `<text x="${x + 58}" y="${y + 15}" font-size="12.5" font-weight="700" fill="${INK}">C${d.c}</text>`,
      dots(y + 11, d.c, INK, INK),
      `<text x="${x + 58}" y="${y + 37}" font-size="12.5" font-weight="700" fill="${INK}">R${d.r}</text>`,
      dots(y + 33, d.r, ACCENT, INK),
      `<rect x="${x + 184}" y="${y}" width="30" height="${h}" fill="#FFFFFF"/>`,
      infoShapes(x + 199, y + 22),
    ].join(''),
  };
}

// Style "seal": round, for slide corners and covers.
function seal(d, x, y) {
  const s = 76;
  const cx = x + s / 2;
  const cy = y + s / 2;
  return {
    w: s,
    h: s,
    round: 0,
    noFrame: true,
    svg: [
      `<circle cx="${cx}" cy="${cy}" r="${s / 2 - 0.5}" fill="${INK}"/>`,
      `<circle cx="${cx}" cy="${cy}" r="${s / 2 - 5}" fill="none" stroke="${ACCENT}" stroke-width="1" stroke-opacity=".7"/>`,
      `<text x="${cx}" y="${y + 29}" font-size="12.5" font-weight="700" text-anchor="middle" letter-spacing="-.3"><tspan fill="#FFFFFF">AI</tspan><tspan dx="4" fill="${ACCENT}">c/r</tspan></text>`,
      `<text x="${cx - 13}" y="${y + 53}" font-size="16" font-weight="700" text-anchor="middle" fill="#FFFFFF">C${d.c}</text>`,
      `<text x="${cx + 14}" y="${y + 53}" font-size="16" font-weight="700" text-anchor="middle" fill="${ACCENT}">R${d.r}</text>`,
      infoShapes(x + s - 9, y + s - 9, 8.5, true),
    ].join(''),
  };
}

const BADGES = { strip, scales, seal };
const badgeFor = (d, x, y) => BADGES[d.style](d, x, y);

function wrapSVG(d, width, height, body, opts = {}) {
  const { round = 4, noFrame = false } = opts;
  const title = `${SCALE_NAME}: C${d.c} ${CREATION[d.c].name}, R${d.r} ${REVIEW[d.r].name}. Select for the explanation.`;
  const head =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="crb-title crb-desc" font-family="${FONT}">` +
    `<title id="crb-title">${xml(title)}</title>` +
    `<desc id="crb-desc">${xml(disclosure(d))}</desc>` +
    `<a href="${xml(referenceFor(d.c, d.r))}">`;
  if (noFrame) return head + body + `</a></svg>`;
  return (
    head +
    `<defs><clipPath id="crb-clip"><rect width="${width}" height="${height}" rx="${round}"/></clipPath></defs>` +
    `<rect width="${width}" height="${height}" rx="${round}" fill="#FFFFFF"/>` +
    `<g clip-path="url(#crb-clip)">${body}</g>` +
    `<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="${round}" fill="none" stroke="${BORDER}"/>` +
    `</a></svg>`
  );
}

function compactSVG(d) {
  const b = badgeFor(d, 0, 0);
  return wrapSVG(d, b.w, b.h, b.svg, { round: b.round, noFrame: b.noFrame });
}

// Disclosure panel: the chosen badge, the two value names, and every supplied detail.
function panelSVG(d) {
  const W = 560;
  const pad = 20;
  const t = [];
  const b = badgeFor(d, pad, 18);
  t.push(b.svg);
  const tx = pad + b.w + 16;
  const base = 18 + b.h / 2;
  t.push(text(tx, base - 3, SCALE_NAME, 14, INK, 'font-weight="700"'));
  t.push(text(tx, base + 13, `${CREATION[d.c].name} · ${REVIEW[d.r].name}`, 12, MUTED));
  let y = 18 + b.h + 18;
  const rows = detailRows(d);
  if (rows.length) {
    t.push(`<line x1="${pad}" y1="${y + 0.5}" x2="${W - pad}" y2="${y + 0.5}" stroke="${BORDER}"/>`);
    y += 26;
    for (const [k, v] of rows) {
      t.push(text(pad, y, k.toUpperCase(), 8.5, MUTED, 'letter-spacing="1" font-weight="700"'));
      for (const line of wrap(v, 52)) {
        t.push(text(170, y, line, 12.5, INK));
        y += 17;
      }
      y += 8;
    }
    y -= 4;
  }
  return wrapSVG(d, W, y + 14, t.join(''));
}

export function makeSVG(input) {
  const d = normalise(input);
  return d.format === 'panel' ? panelSVG(d) : compactSVG(d);
}
