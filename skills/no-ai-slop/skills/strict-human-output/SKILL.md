---
name: strict-human-output
description: Apply a structured human-writing policy to prose when the user wants strict anti-slop constraints, house-style compliance, factual discipline, punctuation controls, banned-language checks, or a final rule-based pass without changing approved meaning.
---

# Strict Human Output

Use this Skill as a **policy overlay**, not as a replacement writer. Its job is to enforce explicit output constraints after the content owner has established meaning, evidence, voice, and genre.

## Two profiles

### Portable baseline

Use by default when this Skill is selected. Enforce rules that generalize well across users:

- do not invent facts, numbers, proof, testimonials, sources, rankings, capabilities, scarcity, or urgency
- remove unsupported importance claims, generic hype, theatrical transitions, and empty adjectives
- prefer specific actions, concrete nouns, observable behavior, and supported consequences
- preserve approved names, dates, prices, figures, claims, quotations, terminology, and technical syntax
- do not restate the brief, add filler introductions, or append generic closing offers
- follow requested language, dialect, length, format, order, assets, and exact-content constraints
- when a style rule conflicts with factual or technical accuracy, accuracy wins

Read `references/portable-baseline.md` for the detailed baseline.

### House-style profile

Activate only when the user explicitly requests the strict house style, says to use their personal rules, provides an active style profile with these constraints, or the surrounding task context already establishes them.

This profile adds hard constraints such as:

- no terminal full stop in normal prose lines
- no em dash
- no negative-setup + positive-reveal formulas
- no "difference" formulas or banned house vocabulary
- no copied AI-sounding Arabic/English expressions
- reduced quotation marks and decorative punctuation
- exact response-start and response-end behavior

Read `references/house-style.md` before enforcing this profile.

Do **not** impose the house profile on an unrelated public user merely because the Plugin contains it.

## Conflict order

When rules collide, use this order:

1. exact reproduction explicitly requested by the user
2. factual, legal, technical, numeric, and source fidelity
3. current user instruction
4. active brand or house-style profile
5. genre and audience conventions
6. generic anti-slop preferences

A lower rule must never silently damage a higher one.

## Workflow

1. Identify which profile is active: `portable` or `house`
2. Lock facts, exact text, technical syntax, and mandatory content
3. Scan for hard violations only
4. Rewrite the smallest necessary region rather than normalizing the whole piece
5. Recheck natural reading after every hard-rule repair
6. Hand residual voice or rhythm problems back to the relevant writing Skill
7. Run `slop-quality-gate` after enforcement when this Skill is part of a routed workflow

## Do not overcorrect

A strict style policy can itself create mechanical prose. Do not:

- remove natural uncertainty merely because it looks less decisive
- flatten dialect or code-switching
- replace every adjective with a long explanation
- force active voice when passive voice is clearer or the actor is genuinely unknown
- remove punctuation required for code, URLs, email addresses, decimals, versions, file names, citations, or exact quotations
- manufacture slang to compensate for formal prose

## Deterministic lint

When the host can run Python and the strict house profile is active, `scripts/strict_human_lint.py` can mechanically check terminal periods, em dashes, selected banned vocabulary, selected AI-expression families, and negative-setup formulas. Treat its findings as candidate violations to repair in context. It does not judge voice, factual accuracy, persuasion quality, or whether a phrase is quoted/required.

## Completion condition

The output is complete when every active hard rule passes **and** the text still preserves the intended meaning, evidence, voice, genre, and technical correctness.
