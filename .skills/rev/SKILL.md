---
name: rev
description: "Process annotated files that contain `rev:` markup (approve, rewrite, remove, replace, add, move, note). Use this skill whenever the user asks to 'process annotations', 'apply revisions', 'process rev tags', or when you detect `<!-- rev:` markers in a file the user asks you to edit. Also trigger when the user says 'annotate this file', 'review this content', or asks to 'apply my feedback'. Works with markdown, HTML, Astro, and any file containing rev: annotations."
---

# Rev - Annotation-Based Editing

Process files that contain `rev:` annotations and apply the requested changes. This skill handles the "human annotates, Claude executes" workflow.

## When this skill triggers

- User asks to "process annotations" or "apply revisions" on a file
- User opens/shares a file containing `<!-- rev:` markers
- User asks to "annotate" a file (generate rev markers for them to review)
- User references the annotation convention in any way

## The annotation format

Annotations use HTML comments with a `rev:` prefix. Read the full convention from the project's `ANNOTATION_CONVENTION.md` if available, but here's the core:

```
<!-- rev:ACTION optional instructions -->
content
<!-- /rev -->
```

### Actions

| Action    | What to do                                      |
|-----------|------------------------------------------------|
| `ok`      | Leave content unchanged, remove markers         |
| `rewrite` | Rewrite content per the instruction note        |
| `remove`  | Delete the wrapped content                      |
| `replace` | Swap old content with text after `<!-- rev:with -->` |
| `add`     | Generate and insert new content at this position |
| `move`    | Relocate block to position given in `to=`       |
| `note`    | Read and consider; respond but don't auto-edit  |

### In JS/frontmatter blocks

Annotations use `//` comment style:
```js
// rev:rewrite shorter description
description: 'Current text',
// /rev
```

## Processing workflow

### Step 1: Scan and inventory

Read the file and list all annotations found. Present a summary to the user:

```
Found 7 annotations:
- 2x ok (will preserve)
- 3x rewrite
- 1x remove
- 1x add
```

### Step 2: Process each annotation

Work through annotations top-to-bottom:

**For `ok`:** Simply remove the rev markers. Content stays.

**For `rewrite`:**
- Read the instruction note carefully
- Consider the surrounding context (what section is this in, what's the tone of nearby approved content)
- Rewrite the content accordingly
- Show the before/after to the user

**For `remove`:** Delete the content block and markers.

**For `replace`:** Swap the content before `<!-- rev:with -->` with the content after it. Remove all markers.

**For `add`:**
- Read the instruction
- Look at surrounding content for tone and style cues
- Generate the new content
- Insert it at the annotation position

**For `move`:**
- Parse the `to=` target (e.g., `after:services`, `before:contact`)
- Find the target location by matching section IDs, component names, or heading text
- Relocate the content block
- Remove markers from both old and new positions

**For `note`:**
- Read the note
- Respond in your output summary
- Do NOT modify content unless the note explicitly asks for a change

### Step 3: Clean output

Remove all `<!-- rev:` and `<!-- /rev -->` markers from the final file. The output should be a clean file with no annotation artifacts.

### Step 4: Summary

After processing, provide a concise change summary:

```
Applied 7 annotations:
- Preserved 2 blocks (ok)
- Rewrote hero subtitle (shorter, punchier)
- Rewrote service description (outcome-focused)
- Rewrote about paragraph 2 (more personal)
- Removed placeholder stats section
- Added testimonials section with 3 quotes
Responded to 0 notes.
```

## Generating annotations (reverse mode)

When the user asks you to "annotate this file" or "mark up for review":

1. Read the file
2. Wrap each distinct content block with the appropriate `rev:` tag
3. Use `ok` for content that seems solid
4. Use `rewrite` with a specific suggestion for content that could improve
5. Use `note` for anything you want to flag for discussion
6. Use `add` where you see gaps
7. Never use `remove` when generating annotations (that's a destructive suggestion, flag as a `note` instead)

This gives the human a pre-annotated file they can quickly review and adjust before asking you to process it.

## Style matching

When rewriting or adding content, match:
- The tone of nearby `ok`-marked content (that's what the human has approved)
- The voice established in the file overall
- The technical level of the surrounding text
- If it's an Astro component, maintain the same HTML/CSS patterns

## File type handling

- **Markdown (.md):** HTML comments work natively
- **Astro (.astro):** HTML comments in template, `//` comments in frontmatter
- **HTML (.html):** HTML comments work natively
- **Other:** Adapt the comment style to the file's language (`//` for JS/TS, `#` for Python, etc.)
