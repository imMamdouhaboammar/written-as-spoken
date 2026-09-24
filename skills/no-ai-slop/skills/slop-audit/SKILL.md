---
name: slop-audit
description: Audit prose for named AI-slop patterns without rewriting or guessing authorship. Use when the user asks what sounds generic, formulaic, robotic, over-polished, or AI-like and wants evidence instead of an edit.
---

# Slop Audit

Inspect the draft as evidence. Do not rewrite it unless the user later asks for an edit.

## Method

1. Read the full passage before flagging anything.
2. Identify genre and likely voice conventions from the text itself.
3. Match only named patterns in `references/pattern-taxonomy.md`.
4. Classify each finding as `high`, `contextual`, or `uncertain` confidence.
5. Quote the smallest useful span, name the pattern, explain why it weakens this passage, and give a short repair direction.
6. Merge duplicate findings when one line triggers several labels for the same underlying problem.
7. Do not count a stylistic choice as slop merely because it contains an adverb, passive voice, a question, a fragment, a Wh-word opening, or an em dash.
8. Do not estimate the probability that AI wrote the passage.

## Output

Use this compact shape:

- **Pattern:** name
- **Evidence:** short quote
- **Confidence:** high / contextual / uncertain
- **Why it reads generic here:** one sentence
- **Fix direction:** a few words

Then add `Overall` with the 2 or 3 dominant tendencies. Do not produce a fake precision score unless the user asks for one.

## Optional static signal check

For long plain-text or Markdown drafts, `scripts/short_line_lint.py` can flag clusters of unusually short standalone prose lines. Treat its output as contextual evidence only. Ignore matches that are clearly poetry, lyrics, dialogue, UI copy, headings, lists, tables, code, or an explicitly requested line-by-line format.

## No-finding behavior

If the passage is already clean, say so. Do not manufacture findings to justify the Skill.
