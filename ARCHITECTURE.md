# Insidin.com - Content Architecture

## Content model

The site has two layers: **site chrome** (homepage sections, nav, footer) and **topic pages** (the actual content offering).

### Topics

A topic is the central content unit. It works like a microsite on a subject you have authority on. Each topic has a stable, shareable URL designed for external linking.

**Lifecycle of a topic:**

```
1. Create topic with metadata + PDFs       → page exists at /topics/slug
                                              (not yet linked from site)
2. Add first article                       → can now appear in site nav
3. Optionally spotlight on homepage         → featured card in spotlight section
4. Add follow-up articles or more PDFs     → topic page grows over time
```

**What a topic page looks like:**

```
/topics/data-governance-maturity/
├── Topic title + description (the "landing" intro)
├── Spotlight article (if marked)
├── Article timeline (all articles, newest first)
│   ├── Article 1: "Measuring maturity by outcomes"
│   ├── Article 2: "Follow-up: what we learned"
│   └── ...
├── Documents section
│   ├── DG2DMM Whitepaper (PDF download)
│   ├── Maturity Assessment Template (PDF download)
│   └── ...
└── Related topics (optional cross-links)
```

**Individual articles** also get their own URL for direct linking:
```
/topics/data-governance-maturity/measuring-maturity-by-outcomes
```

### Spotlight

The homepage has a "spotlight" section that replaces the current static Writing cards. It pulls from topics that have `spotlight: true` in their frontmatter, ordered by `spotlightDate`. This is how content gets promoted to the homepage without hardcoding anything.

### Navigation / discoverability

Topics that have at least one published article appear in:
- A `/topics` browse page (filterable by tag)
- The site nav under "Thinking" or "Insights" (replaces "Writing")

Topics without articles (just documents) exist at their URL but aren't listed in nav. They're reachable via direct link only, which is the intended "stealth publish" behaviour.


## File structure

```
/content/                          # All text content (markdown)
  site/                            # Site chrome copy
    hero.md                        # Hero section
    about.md                       # About section
    services/                      # One file per service card
      data-ai-architecture.md
      data-management-maturity.md
      venture-advisory.md
    contact.md                     # Contact section
  topics/                          # Topic definitions
    data-governance-maturity.md    # Topic metadata + intro text
    streaming-platforms.md
    ai-adoption-strategy.md
  articles/                        # All articles (grouped by topic slug)
    data-governance-maturity/
      measuring-maturity-by-outcomes.md
      what-we-learned.md
    streaming-platforms/
      why-platforms-fail-before-they-scale.md

/documents/                        # Downloadable assets (PDFs, etc.)
  data-governance-maturity/
    dg2dmm-whitepaper.pdf
    maturity-assessment-template.pdf
  streaming-platforms/
    platform-architecture-guide.pdf

/demo/                             # Astro project (code only, no content)
  src/
    components/                    # UI components (design system)
    layouts/                       # Page layouts
    pages/
      index.astro                  # Homepage (reads from /content/site/*)
      topics/
        index.astro                # Browse all topics
        [topic].astro              # Dynamic: topic page
        [topic]/[article].astro    # Dynamic: individual article
```

### Content file formats

**Topic file** (`/content/topics/data-governance-maturity.md`):
```yaml
---
title: "Data Governance & Maturity"
description: "Outcome-driven data governance through the DG2DMM framework."
tags: [data-governance, maturity, dg2dmm]
spotlight: true
spotlightDate: 2026-03-15
# Optional: custom card text for homepage spotlight
spotlightTitle: "Measuring maturity by outcomes, not activities"
spotlightSummary: "Why compliance checklists miss the point."
# Documents associated with this topic
documents:
  - file: dg2dmm-whitepaper.pdf
    title: "DG2DMM Whitepaper"
    description: "The full framework explained."
  - file: maturity-assessment-template.pdf
    title: "Maturity Assessment Template"
    description: "Self-assessment worksheet."
---

Introduction text for the topic page. This is the "landing" content
that visitors see before the articles and documents.
```

**Article file** (`/content/articles/data-governance-maturity/measuring-maturity.md`):
```yaml
---
title: "Measuring maturity by outcomes, not activities"
date: 2026-03-10
topic: data-governance-maturity    # links to the parent topic
tags: [dg2dmm, kpi, maturity]
readTime: "7 min"
draft: false
---

Full article body in markdown.
```

**Site copy file** (`/content/site/hero.md`):
```yaml
---
eyebrow: "Inside information"
headline: "Strategy that works"
headlineAccent: "in the real world."
---

Insidin helps organisations cut through the theory and make data & AI
transformation actually land, with critical thinking, proven practice,
and an honest assessment of what is worth pursuing and what is not.
```

**Service file** (`/content/site/services/data-ai-architecture.md`):
```yaml
---
title: "Data & AI Architecture"
order: 1
tags: [Streaming, Lakehouse, AI/ML, Change & Adoption]
featured: false
cta: null
---

Deep technical expertise combined with real business understanding,
and the change management thinking that most architecture engagements
skip entirely. Not what the textbook says, but what actually works.
```


## Git workflow

```
main (published / live)
  └── content/hero-copy-update        ← branch for content changes
       ├── annotated commit(s)         ← you + Claude iterate with rev: tags
       ├── clean commit                ← Claude removes all annotations
       └── PR → main                   ← review the clean diff, merge
```

### Rules

1. `main` is always clean: no `rev:` annotations, no drafts, deployable
2. All content changes happen on branches named `content/description`
3. Annotations live only in commits on these branches
4. Before PR: Claude strips all annotations and makes a clean commit
5. PR shows only the final diff (clean content vs current main)
6. After merge, branch is deleted

### Finding what changed

Since all text lives in `/content/` and `/documents/`, a `git diff` on a
content branch shows exactly what changed, in readable markdown. No need
to hunt through Astro components.

```bash
git diff main..content/my-branch -- content/
```


## Design system

Final C: Space Grotesk + Polar

- Display: Space Grotesk (headings, logo, buttons, stat values)
- Body: Inter (running text, nav, descriptions)
- Mono: JetBrains Mono (eyebrows, tags, metadata)
- Palette: black (#000) / white / sky blue (#38BDF8)
- Radius: 2px
- Cards: 1.5px black border, no shadow
