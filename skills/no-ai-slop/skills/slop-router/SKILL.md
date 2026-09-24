---
name: slop-router
description: Route a writing or content request through the minimum connected Slop Curator Skills needed. Use for anti-slop editing, voice preservation, spoken or Egyptian Arabic writing, strict house-style rules, commercial copy, playbooks, presentations, visual-content review, or combined audit-and-edit workflows.
---

# Slop Router

Act as the front door for Slop Curator. The Plugin contains multiple full Skills. Route deliberately rather than loading every rule pack into every request.

## Global priority order

1. exact approved text when exact reproduction is requested
2. factual, legal, numeric, source, and technical fidelity
3. current user intent and explicit constraints
4. demonstrated writer/brand voice
5. active language, dialect, house-style, and format profile
6. genre and audience conventions
7. anti-slop cleanup and stylistic improvement

A lower priority never silently overrides a higher one.

## Classify the job first

### Evidence-only audit

Route: `slop-audit`

Do not rewrite or guess authorship.

### Standard anti-slop edit

Route: `voice-preserving-edit -> slop-pattern-repair -> slop-quality-gate`

Add `strict-human-output` portable baseline when factual claims, format constraints, or explicit strictness matter.

### Spoken or conversational writing

Route: `plain-spoken-writing -> optional slop-pattern-repair -> slop-quality-gate`

For Egyptian Arabic or bilingual Arabic-English work, insert `arabic-style-curator` before the gate.

### Preserve my voice + make it spoken

Route: `voice-preserving-edit -> plain-spoken-writing -> language specialist if needed -> optional repair -> slop-quality-gate`

### Strict house-style / my writing rules

Route: `content owner -> strict-human-output(house) -> slop-quality-gate`

If Arabic is involved, insert `arabic-style-curator`. The house profile includes hard punctuation, banned-vocabulary, and formula constraints. Do not apply it to unrelated public users without an activation signal.

### Advertising / campaign / landing page / marketing copy

Route: `commercial-copy-director -> language/voice specialist as needed -> strict-human-output(portable or house) -> slop-quality-gate`

Commercial copy owns the audience, awareness, objection, proof, offer, headline, and CTA decisions.

### Practical marketing playbook

Route: `commercial-copy-director -> arabic-style-curator or plain-spoken-writing as requested -> strict-human-output(house when active) -> slop-quality-gate`

### Presentation / report / brochure / visual brief / RTL content

Route: `visual-content-anti-slop -> arabic-style-curator if Arabic -> strict-human-output if active -> slop-quality-gate`

This route governs content and art-direction constraints. Use actual visual/file tools only when the current host provides them.

### Audit then edit

Run `slop-audit` first. Convert its evidence into the smallest repair plan, then use the appropriate content owner and final gate.

## Rule-pack selection

Do not confuse universal rules with personal preferences.

- `portable baseline`: evidence integrity, specificity, no fabricated proof, useful structure, user constraints
- `house profile`: terminal-period ban, em-dash ban, hard phrase/vocabulary bans, response behavior, personal punctuation conventions
- `Arabic profile`: dialect, Arabic syntax, code-switching, Arabic AI-expression bank, house phrase bank
- `commercial profile`: audience, awareness, offer, proof, headline, CTA, playbook behavior
- `visual profile`: document hierarchy, real assets, verified charts, RTL design, anti-decoration rules

Load only the profiles needed for the request.

## Neural connection rules

The graph in `references/connection-map.json` is the machine-readable source of truth.

Important feedback behavior:

- voice flattening -> `voice-preserving-edit`
- spoken/dialect sanitization -> `plain-spoken-writing`
- Arabic syntax, code-switching, or house Arabic failure -> `arabic-style-curator`
- phrase/structure/rhythm residue -> `slop-pattern-repair`
- hard policy, evidence, punctuation, or exact-format failure -> `strict-human-output`
- weak commercial decision logic, headline, CTA, proof, or offer framing -> `commercial-copy-director`
- visual hierarchy, fake content, RTL rendering logic, or asset misuse -> `visual-content-anti-slop`
- all routes converge on `slop-quality-gate` when a final review is appropriate

## Signal weighting

Use three levels:

- **hard:** fabricated evidence, broken user constraint, active house ban, formulaic claim with no useful context
- **contextual:** adverbs, passive voice, rhetorical questions, fragments, Wh-openers, em dashes outside house mode, list length, paragraph length
- **voice:** dialect markers, code-switching, useful repetition, asides, corrections, direct address, controlled roughness

Do not turn contextual signals into universal bans.

## Finish

Return the requested deliverable in the requested format. Keep internal routing and quality checks invisible unless the user asks for them.

<!-- written-as-spoken:links start (generated by scripts/sync-links.mjs, do not edit by hand) -->

## Linked to Written as Spoken

This skill is a node in the Written as Spoken suite. The front door is `written-as-spoken` (`../../../../SKILL.md`), and the graph lives in `../../../../references/routing-map.json`.

When a request reaches this skill through `written-as-spoken`, Mamdouh's voice rules in `../../../../references/voice-dna.md` and `../../../../references/anti-slop.md` outrank this skill's own style defaults, the house profile is active, and facts come only from the user or from `story-researcher`.

Routes that pass through here:

- `presentation` (deck, report or company profile copy outside a post): first step, hands off to `visual-content-anti-slop`

Hand your output to the next node in the route. When this skill is the last node, return the result to `written-as-spoken` so the draft goes through `../../../../scripts/lint.mjs` before the user sees it. When this skill is called directly, outside the suite, ignore this block.

<!-- written-as-spoken:links end -->
