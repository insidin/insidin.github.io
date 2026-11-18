// Single source of truth for the AI Creation & Review Scale.
// Used by the page (table, personalised view, generator) and by the badge renderer.

// The one reference page every badge, disclosure note and page section points to.
// It is deliberately not user-configurable: anyone applying the scale should
// send readers to the same definitions.
// When a short URL exists (for example a /cr path on your own domain), change this
// value only. The short URL must forward the query string (?c=3&r=4).
export const REFERENCE_URL = 'https://www.insidin.com/scale/ai-creation-review';

export const SCALE_NAME = 'AI Creation & Review Scale';

// Link for one specific badge. Only the two scale values travel in the URL,
// never names, dates or any other detail.
export function referenceFor(c, r) {
  return `${REFERENCE_URL}?c=${c}&r=${r}`;
}

export const CREATION = [
  { code: 'C0', name: 'Human-created', text: 'Made by a person without generative AI.' },
  { code: 'C1', name: 'AI-assisted', text: 'AI helped polish or transform what a person wrote. No AI-written content remains.' },
  { code: 'C2', name: 'Co-created', text: "Mostly a person's own work, with some AI-written passages or elements kept in." },
  { code: 'C3', name: 'Human-directed', text: 'A person supplied the ideas, knowledge and reasoning. AI wrote most of the text or produced most of the material.' },
  { code: 'C4', name: 'AI-originated', text: 'AI contributed most of the ideas as well as the wording, starting from a brief or limited input.' },
];

export const REVIEW = [
  {
    code: 'R0', name: 'Unreviewed',
    text: 'Nobody has looked at the final result.',
    reader: 'Treat it as an unread draft: no person has checked what it says.',
  },
  {
    code: 'R1', name: 'Partially reviewed',
    text: 'A person skimmed it or looked at selected parts.',
    reader: 'Some parts were seen by a person, others were not. Do not assume the rest is sound.',
  },
  {
    code: 'R2', name: 'Fully reviewed',
    text: 'A person went through all of it. Facts were not necessarily checked.',
    reader: 'A person read all of it, but verifying the facts was not part of the review.',
  },
  {
    code: 'R3', name: 'Reviewed & checked',
    text: 'Full read-through, plus checks of the claims that matter for the intended use.',
    reader: 'A person read all of it and checked the claims that matter for its intended use.',
  },
  {
    code: 'R4', name: 'Reviewed & approved',
    text: "Full read-through, relevant checks, and a person's explicit sign-off to share it.",
    reader: 'A person read all of it, checked what matters, and explicitly approved sharing it.',
  },
];
