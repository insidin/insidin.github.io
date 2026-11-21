// Pure badge rendering for the AI Made/Checked Scale.
// No DOM, no network, no tracking. Safe to run in a browser or in Node.
// The badge itself uses outlined letters, so it looks the same everywhere.

import {
  MADE, CHECKED, SCALE_NAME, referenceFor, referenceDisplayFor,
  DEFAULT_INK, DEFAULT_PAPER, isHex,
} from './mc-scale.js';
import { outlined } from './mc-glyphs.js';

const MUTED = '#575F6A';
const RULE = '#D4D8DE';
const FONT = 'Arial, Helvetica, sans-serif';

const xml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

export function normalise(d) {
  const m = Number(d.m);
  const c = Number(d.c);
  if (!Number.isInteger(m) || !Number.isInteger(c) || !MADE[m] || !CHECKED[c]) {
    throw new Error('Unknown scale value');
  }
  return {
    m,
    c,
    format: d.format === 'panel' ? 'panel' : 'badge',
    ink: isHex(d.ink) ? d.ink : DEFAULT_INK,
    paper: isHex(d.paper) ? d.paper : DEFAULT_PAPER,
    madeBy: d.madeBy || '',
    // With nothing checked there is no checker and no check date.
    checkedBy: c ? d.checkedBy || '' : '',
    date: c ? d.date || '' : '',
    artifact: d.artifact || '',
    scope: d.scope || '',
    purpose: d.purpose || '',
    checks: d.checks || '',
  };
}

function detailRows(d) {
  return [
    ['Made by', d.madeBy],
    ['Checked by', d.checkedBy],
    ['Version', d.artifact],
    ['Check date', d.date],
    ['Scope', d.scope],
    ['Intended use', d.purpose],
    ['Checks and limitations', d.checks],
  ].filter(([, v]) => v);
}

// One searchable line to place next to the badge. Contains the scale name, so
// readers can find the explanation page even if the link is lost.
export function caption(input) {
  const d = normalise(input);
  return `${SCALE_NAME}: M${d.m} ${MADE[d.m].name}, C${d.c} ${CHECKED[d.c].name}`;
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

// The badge: [ AI | M ----o---- | C -------o | (i) ]. 196 x 34, in two colours only.
// Both lines fill from the left up to the value. Dots before the value are solid,
// dots after it are hollow, and the value is the larger marker.
export const BADGE_W = 196;
export const BADGE_H = 34;
function badgeShapes(d, x, y, idPrefix) {
  const { ink, paper } = d;
  const gap = 19;
  const x0 = x + 64;
  const o = [
    `<clipPath id="${idPrefix}-clip"><rect x="${x}" y="${y}" width="${BADGE_W}" height="${BADGE_H}" rx="5"/></clipPath>`,
    `<rect x="${x}" y="${y}" width="${BADGE_W}" height="${BADGE_H}" rx="5" fill="${paper}"/>`,
    `<g clip-path="url(#${idPrefix}-clip)"><rect x="${x}" y="${y}" width="38" height="${BADGE_H}" fill="${ink}"/></g>`,
    outlined('AI', x + 19, y + 22, 14.5, paper, { anchor: 'middle' }),
  ];
  for (const [label, val, ry] of [['M', d.m, y + 11.5], ['C', d.c, y + 22.5]]) {
    o.push(outlined(label, x + 50, ry + 3.6, 10, ink, { anchor: 'middle' }));
    o.push(`<line x1="${x0}" y1="${ry}" x2="${x0 + gap * 4}" y2="${ry}" stroke="${ink}" stroke-opacity=".25" stroke-width="1.6" stroke-linecap="round"/>`);
    if (val) o.push(`<line x1="${x0}" y1="${ry}" x2="${x0 + gap * val}" y2="${ry}" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>`);
    for (let i = 0; i < 5; i++) {
      const cx = x0 + gap * i;
      if (i === val) o.push(`<circle cx="${cx}" cy="${ry}" r="4.6" fill="${ink}" stroke="${paper}" stroke-width="1.4"/>`);
      else if (i < val) o.push(`<circle cx="${cx}" cy="${ry}" r="2.4" fill="${ink}"/>`);
      else o.push(`<circle cx="${cx}" cy="${ry}" r="2.3" fill="${paper}" stroke="${ink}" stroke-width="1"/>`);
    }
  }
  o.push(
    `<circle cx="${x + 174}" cy="${y + 17}" r="8.5" fill="none" stroke="${ink}" stroke-width="1.3"/>`,
    outlined('i', x + 174, y + 21.2, 12, ink, { anchor: 'middle', italic: true }),
    `<rect x="${x + 0.75}" y="${y + 0.75}" width="${BADGE_W - 1.5}" height="${BADGE_H - 1.5}" rx="4.5" fill="none" stroke="${ink}" stroke-width="1.5"/>`,
  );
  return o.join('');
}

function frame(d, width, height, body) {
  const title = `${SCALE_NAME}: M${d.m} ${MADE[d.m].name}, C${d.c} ${CHECKED[d.c].name}. Select for the explanation.`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="mcb-title mcb-desc" font-family="${FONT}">` +
    `<title id="mcb-title">${xml(title)}</title>` +
    `<desc id="mcb-desc">${xml(disclosure(d))}</desc>` +
    `<a href="${xml(referenceFor(d.m, d.c))}">${body}</a></svg>`
  );
}

function badgeSVG(d) {
  return frame(d, BADGE_W, BADGE_H, badgeShapes(d, 0, 0, 'mcb'));
}

// Disclosure panel: the badge, the two value names, what they mean, every supplied
// detail, and the explanation link. Panel text stays live text (Arial or Helvetica).
function panelSVG(d) {
  const W = 700;
  const pad = 28;
  const labelX = pad;
  const valueX = 160;
  const scale = 1.35;
  const t = [];

  t.push(`<g transform="translate(${pad} 24) scale(${scale})">${badgeShapes(d, 0, 0, 'mcb')}</g>`);
  const tx = pad + BADGE_W * scale + 22;
  t.push(text(tx, 46, SCALE_NAME, 17, '#111111', 'font-weight="700"'));
  t.push(text(tx, 68, `${MADE[d.m].name}  ·  ${CHECKED[d.c].name}`, 13, MUTED));
  t.push(`<line x1="${pad}" y1="84.5" x2="${W - pad}" y2="84.5" stroke="${RULE}"/>`);

  let y = 108;
  const cap = (s, yy) => text(labelX, yy, s.toUpperCase(), 9, MUTED, 'font-weight="700" letter-spacing="1.2"');
  for (const [label, item] of [['Made', MADE[d.m]], ['Checked', CHECKED[d.c]]]) {
    t.push(cap(label, y));
    t.push(text(valueX, y, `${item.code}  ${item.name}`, 13, '#111111', 'font-weight="700"'));
    y += 18;
    for (const line of wrap(item.text, 70)) {
      t.push(text(valueX, y, line, 12, MUTED));
      y += 16;
    }
    y += 10;
  }

  const rows = detailRows(d);
  if (rows.length) {
    t.push(`<line x1="${pad}" y1="${y - 4.5}" x2="${W - pad}" y2="${y - 4.5}" stroke="${RULE}"/>`);
    y += 18;
    for (const [k, v] of rows) {
      t.push(cap(k.length > 14 ? 'Checks' : k, y));
      for (const line of wrap(v, 62)) {
        t.push(text(valueX, y, line, 12, '#111111'));
        y += 16;
      }
      y += 6;
    }
  }

  y += 6;
  t.push(`<rect x="0" y="${y}" width="${W}" height="40" fill="#F8F9FA"/>`);
  t.push(text(pad, y + 24, 'What these values mean:', 11, MUTED));
  t.push(text(170, y + 24, referenceDisplayFor(d.m, d.c), 11, '#111111', 'font-weight="700" text-decoration="underline"'));
  const H = y + 40;

  const inner =
    `<defs><clipPath id="mcp-clip"><rect width="${W}" height="${H}" rx="6"/></clipPath></defs>` +
    `<rect width="${W}" height="${H}" rx="6" fill="#FFFFFF"/>` +
    `<g clip-path="url(#mcp-clip)">${t.join('')}</g>` +
    `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="6" fill="none" stroke="${RULE}"/>`;
  return frame(d, W, H, inner);
}

export function makeSVG(input) {
  const d = normalise(input);
  return d.format === 'panel' ? panelSVG(d) : badgeSVG(d);
}
