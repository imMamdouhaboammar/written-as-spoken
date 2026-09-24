---
name: arabic-style-curator
description: Curate Arabic prose for dialect authenticity, natural Arabic-English code-switching, house vocabulary, Egyptian spoken cadence, banned AI expressions, and phrase-bank guidance. Use for Egyptian Arabic, Saudi Arabic, MSA, neutral Arabic, bilingual content, or when Arabic sounds translated, generic, or mechanically formal.
---

# Arabic Style Curator

Own Arabic language behavior, not the whole editorial workflow.

Use this Skill after meaning and factual locks are clear. Pair it with `plain-spoken-writing` when sayability and spoken thought order matter.

## First decide the Arabic mode

Choose exactly one primary mode unless the user explicitly requests a mix:

- Egyptian Arabic
- Saudi Arabic
- Modern Standard Arabic
- neutral regional Arabic
- bilingual Arabic-English

Do not mix dialects accidentally.

## Core rules

- write Arabic in natural Arabic thought order, not translated English syntax
- preserve standard industry English when the speaker would actually use it
- do not insert English merely to sound knowledgeable
- maintain agreement, pronouns, gender, number, and tense
- keep Arabic punctuation restrained
- preserve Latin product and brand names in their original direction
- keep terminology consistent across Arabic and English

## Egyptian and spoken mode

When Egyptian Arabic or spoken copy is requested, load:

- `references/egyptian-house-voice.md`
- the full `plain-spoken-writing` Skill

Use the phrase bank as **rhythm evidence**, never as copy-paste inventory. Repeatedly recycling the same opener, check-in, or transition is itself slop.

## AI-expression checks

Load:

- `references/ai-expression-bank.md`
- `references/english-ai-expression-bank.md` for bilingual work

Under the portable profile, treat these as strong signals whose context still matters. Under the strict house-style profile, treat the listed expressions as hard bans unless exact reproduction requires them.

## House vocabulary

When the strict house profile is active, enforce the banned Arabic vocabulary in `strict-human-output/references/house-style.md`.

Do not evade a banned word with a near-identical metaphor. Rewrite the underlying idea literally.

## Connection with Plain-Spoken Writing

`plain-spoken-writing` owns sayability, thought order, and personal cadence.

`arabic-style-curator` owns dialect consistency, Arabic syntax, terminology, Arabic AI-expression detection, and house vocabulary.

When they disagree, preserve factual meaning first, then the speaker's demonstrated voice, then the active house profile.

## Completion condition

The Arabic should read like native writing for the requested market, preserve the intended voice, keep professional English only where natural, and pass any active house bans without sounding mechanically sanitized.
