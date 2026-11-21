// Single source of truth for the AI Made/Checked Scale.
// Used by the page (table, personalised view, generator) and by the badge renderer.

// The one reference page every badge, disclosure note and page section points to.
// It is deliberately not user-configurable: anyone applying the scale should
// send readers to the same definitions.
// When a short URL exists (for example a /mc path on your own domain), change this
// value only. The short URL must forward the query string (?m=3&c=4).
export const REFERENCE_URL = 'https://www.insidin.com/scale/ai-made-checked';

export const SCALE_NAME = 'AI Made/Checked Scale';
export const SCALE_SHORT = 'AI MC';

// Link for one specific badge. Only the two scale values travel in the URL,
// never names, dates or any other detail.
export function referenceFor(m, c) {
  return `${REFERENCE_URL}?m=${m}&c=${c}`;
}

// Same as referenceFor, without protocol and "www.", for text that is read by people.
export function referenceDisplayFor(m, c) {
  return referenceFor(m, c).replace(/^https?:\/\//, '').replace(/^www\./, '');
}

// M: how AI contributed to making the content.
export const MADE = [
  { code: 'M0', name: 'Human-made', text: 'Made by a person without generative AI.' },
  { code: 'M1', name: 'AI-assisted', text: 'AI helped polish or transform what a person wrote. No AI-written content remains.' },
  { code: 'M2', name: 'Co-created', text: "Mostly a person's own work, with some AI-written passages or elements kept in." },
  { code: 'M3', name: 'Human-directed', text: 'A person supplied the ideas, knowledge and reasoning. AI wrote most of the text or produced most of the material.' },
  { code: 'M4', name: 'AI-originated', text: 'AI contributed most of the ideas as well as the wording, starting from a brief or limited input.' },
];

// C: how far a human checked the final result.
export const CHECKED = [
  {
    code: 'C0', name: 'Unchecked',
    text: 'Nobody has looked at the final result.',
    reader: 'Treat it as an unread draft: no person has checked what it says.',
  },
  {
    code: 'C1', name: 'Partly read',
    text: 'A person skimmed it or looked at selected parts.',
    reader: 'Some parts were seen by a person, others were not. Do not assume the rest is sound.',
  },
  {
    code: 'C2', name: 'Read in full',
    text: 'A person went through all of it. Facts were not necessarily checked.',
    reader: 'A person read all of it, but verifying the facts was not part of the check.',
  },
  {
    code: 'C3', name: 'Verified',
    text: 'Full read-through, plus checks of the claims that matter for the intended use.',
    reader: 'A person read all of it and checked the claims that matter for its intended use.',
  },
  {
    code: 'C4', name: 'Approved',
    text: "Full read-through, relevant checks, and a person's explicit sign-off to share it.",
    reader: 'A person read all of it, checked what matters, and explicitly approved sharing it.',
  },
];

// Default and validation for the badge colours. The badge uses one ink and one paper colour.
export const DEFAULT_INK = '#111111';
export const DEFAULT_PAPER = '#FFFFFF';
export const isHex = (v) => /^#[0-9a-fA-F]{6}$/.test(String(v));

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

// WCAG contrast ratio between two #RRGGBB colours.
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
