---
name: plain-spoken-writing
description: Use when drafting or rewriting prose that should sound like the speaker actually talks, especially Egyptian Arabic, Arabic-English code-switching, social posts, emails, business writing, personal voice, conversational copy, or when output feels polished, generic, formal, or AI-written.
---

# Plain-Spoken Writing

## Core principle

**Write like the speaker speaks, not like a writer pretending to sound conversational**

Start from spoken thought. Edit only enough to make it easy to read

Target **clean speech**, not polished prose and not a raw transcript

Priority when rules compete:
1. meaning and factual accuracy
2. the speaker's real voice
3. natural thought order
4. readability
5. polish

Polish is last on purpose

## Input mode

**If a speech sample, transcript, rough note, or prior writing exists:** treat it as the strongest style evidence. Preserve vocabulary, sentence movement, code-switching, useful repetition, direct address, rhetorical questions, side comments, and formality

**If no voice sample exists:** explain the idea as if speaking to one real person, then clean lightly. Never invent slang, quirks, opinions, stories, clients, meetings, or experiences to simulate humanity

## Workflow

### 1. Hear the sentence first

Silently ask: **How would this person actually say this out loud?**

Do not optimize for the most elegant written sentence

### 2. Keep useful roughness

Keep roughness when it carries identity or timing: a sentence that circles the point, a quick correction, deliberate repetition, a short aside, a question answered immediately, uneven paragraph lengths, or natural professional English terms inside Arabic

### 3. Remove noise, not personality

Clean accidental duplicated meaning, useless filler, broken transcription, ASR artifacts, and false starts that block understanding

Do not mechanically delete repetition or dialect

### 4. Make speech readable

Add only what reading needs: paragraph breaks, enough punctuation, corrected distracting errors, and minor clarification

Do not turn the piece into an essay

### 5. Run the voice test

Read the draft mentally aloud. If the tongue naturally wants to replace a sentence, use the spoken version

**If you wouldn't say it, don't write it**

### 6. Humanity pass

Before delivering:
- cut repeated ideas, not repeated emphasis
- replace generic professional wording with the speaker's normal vocabulary
- remove perfect transitions, quote-card wisdom, and artificial engagement bait
- break suspiciously uniform paragraph rhythm
- verify no personal detail was invented
- keep any promotion in the same speaking voice

For scoring and hard-fail checks, read [references/evaluator.md](references/evaluator.md)

## Arabic-English code-switching

Do not translate normal professional terms merely because the surrounding text is Arabic

If the speaker naturally says `CRO`, `prompt`, `workflow`, `skill`, `plugin`, `marketplace`, `output`, or `customer research`, keep them when appropriate

Do not add English just to sound modern

For Egyptian-Arabic handling, read [references/egyptian-arabic.md](references/egyptian-arabic.md)

## Structure

Follow the thought's movement, not a default content framework

Do not automatically impose Hook → Problem → Lesson → CTA, introduction → three points → conclusion, repeated `مش X، لكن Y`, or perfectly symmetric paragraphs

A post can still have a hook or CTA when the task needs one. They should emerge naturally rather than expose the template

## Explain instead of defining

Prefer spoken explanation over dictionary-style definition

Too written:
> A marketplace is a repository containing multiple reusable capabilities

Plain-spoken:
> طب الـ marketplace ده إيه أصلًا؟ أنت داخل مكان واحد، جواه شوية Skills وAgents وحاجات متجمعة حوالين نوع شغل معين

## Repetition

**Keep** repetition carrying emotion, emphasis, timing, or personality

**Cut** repetition that only restates the same information

## Never fake humanity

Human does not mean random slang, intentional typos, fake uncertainty, or invented anecdotes

If the user supplied an experience or claim, it may be used. Otherwise do not manufacture it

## Promotion

When mentioning a product or project, connect it to the thought already being discussed. Do not switch into announcement or launch-copy voice

For posts, emails, explainers, and business writing, read [references/writing-modes.md](references/writing-modes.md)

## When the draft still feels AI-written

Read [references/anti-ai-patterns.md](references/anti-ai-patterns.md)

Typical symptoms: perfect transitions, generic insight sentences, repeated contrast formulas, fake slang, unnecessary summaries, motivational conclusions, and generic CTAs

## Source voice outranks examples

If the user provides samples, derive the local voice from them rather than copying phrases from this skill

For a reusable profile across multiple samples, use [assets/voice-profile-template.md](assets/voice-profile-template.md)

## Output contract

Unless critique or alternatives are requested, deliver the writing directly. Do not explain the technique, label hook/tension/CTA, or append a quality report

When rewriting, preserve meaning and claims unless explicitly asked to change them

## Final five checks

1. **Sayability:** could this speaker actually say it aloud?
2. **Identity:** does the vocabulary belong to this speaker?
3. **Movement:** does the thought move naturally rather than expose a template?
4. **Cleanliness:** is it readable without becoming article prose?
5. **Truthfulness:** was no fake human detail added?

If one fails, revise

<!-- written-as-spoken:links start (generated by scripts/sync-links.mjs, do not edit by hand) -->

## Linked to Written as Spoken

This skill is a node in the Written as Spoken suite. The front door is `written-as-spoken` (`../../../../SKILL.md`), and the graph lives in `../../../../references/routing-map.json`.

When a request reaches this skill through `written-as-spoken`, Mamdouh's voice rules in `../../../../references/voice-dna.md` and `../../../../references/anti-slop.md` outrank this skill's own style defaults, the house profile is active, and facts come only from the user or from `story-researcher`.

Routes that pass through here:

- `reel_script` (short video script said out loud): after `reels-scripting`, hands off to `arabic-style-curator`

Sent here by the feedback loop:

- lint `long-line`: split into breaths
- lint `rhythm`: add short reaction lines, split long ones
- critic `written-not-said`: rebuild the line in speaking order

Hand your output to the next node in the route. When this skill is the last node, return the result to `written-as-spoken` so the draft goes through `../../../../scripts/lint.mjs` before the user sees it. When this skill is called directly, outside the suite, ignore this block.

<!-- written-as-spoken:links end -->
