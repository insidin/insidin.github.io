# Annotation Convention for Collaborative Editing

A lightweight markup system for annotating files so that Claude (in Cowork or Claude Code) can read your feedback and apply changes. Works in markdown, HTML, Astro, and any file that tolerates HTML comments.

## Syntax

All annotations use HTML comments with a `rev:` prefix:

```
<!-- rev:ACTION optional note here -->
content being annotated
<!-- /rev -->
```

Self-closing form (no content block):
```
<!-- rev:ACTION optional note here -->
```

## Actions

### `ok` - Approve content as-is
Signals that this block is final. Claude will leave it untouched.

```html
<!-- rev:ok -->
Strategy that works in the real world.
<!-- /rev -->
```

### `rewrite` - Request a rewrite
Claude rewrites the wrapped content based on your note.

```html
<!-- rev:rewrite shorter, max 2 sentences, punchier tone -->
Insidin helps organisations cut through the theory and make data & AI
transformation actually land, with critical thinking, proven practice,
and an honest assessment of what is worth pursuing and what is not.
<!-- /rev -->
```

### `remove` - Delete this block
Claude removes the wrapped content entirely.

```html
<!-- rev:remove -->
This paragraph no longer applies.
<!-- /rev -->
```

### `replace` - Swap with provided text
You supply the replacement directly. Useful when you know exactly what you want.

```html
<!-- rev:replace -->
Old text goes here
<!-- rev:with -->
New text goes here
<!-- /rev -->
```

### `add` - Insert new content
Self-closing. Claude generates content based on your note and inserts it at this position.

```html
<!-- rev:add insert a testimonials section with 2-3 client quotes -->
```

### `move` - Relocate a block
Moves the wrapped content to a different position. Use `to=` to specify the target.

```html
<!-- rev:move to=after:services -->
This section should appear after services instead.
<!-- /rev -->
```

Target syntax: `before:SECTION` or `after:SECTION`, where SECTION is a section id, component name, or heading text.

### `note` - Comment for discussion
Does not trigger any change. A note for Claude to consider, or a question to discuss.

```html
<!-- rev:note I'm not sure about this tone, feels too salesy? -->
```

Can also wrap content:
```html
<!-- rev:note should we keep this section at all? -->
The venture advisory description...
<!-- /rev -->
```

## Multiple annotations in sequence

You can annotate an entire file. Unannotated content is left as-is (treated as implicitly ok):

```html
<!-- rev:ok -->
# Strategy that works in the real world.
<!-- /rev -->

<!-- rev:rewrite more specific to data architecture, less generic consulting -->
Insidin helps organisations cut through the theory...
<!-- /rev -->

<!-- rev:add short stat about years of experience here -->

<!-- rev:remove -->
This paragraph was placeholder text.
<!-- /rev -->
```

## In Astro components

Annotations go directly in the template or around frontmatter data:

```astro
---
const services = [
  {
    // rev:rewrite make the description focus on outcomes not capabilities
    title: 'Data & AI Architecture',
    description: 'Deep technical expertise combined with real business understanding...',
    // /rev
  },
];
---

<!-- rev:ok -->
<section id="services" class="bg-surface py-24">
<!-- /rev -->
```

For frontmatter (JS) blocks, use `//` comment style:
```js
// rev:rewrite shorter
description: 'Current text here...',
// /rev
```

## Processing rules for Claude

When Claude encounters an annotated file:

1. Scan for all `rev:` annotations
2. Process each one according to its action
3. Remove all annotation markers from the output
4. Present a summary of changes made
5. For `note` annotations: acknowledge and respond, but don't modify content unless asked

If a file has zero annotations, Claude treats it as "review needed" and can suggest annotations for the human to confirm.

## Quick reference

| Action    | Wraps content? | What Claude does                        |
|-----------|---------------|-----------------------------------------|
| `ok`      | yes           | Leave unchanged                         |
| `rewrite` | yes           | Rewrite based on your note              |
| `remove`  | yes           | Delete the block                        |
| `replace` | yes           | Swap old text with your provided text   |
| `add`     | no            | Generate and insert new content         |
| `move`    | yes           | Relocate to the specified position      |
| `note`    | optional      | Read and consider, no automatic change  |
