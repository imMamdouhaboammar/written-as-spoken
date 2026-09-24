---
name: slop-quality-gate
description: Check an edited or newly written draft for factual drift, voice loss, over-editing, residual formulaic patterns, robotic rhythm, sayability failures, and output-contract failures. Use after a rewrite, a plain-spoken pass, or when the user wants a quality check.
---

# Slop Quality Gate

Evaluate the finished draft independently. Do not reward the edit merely for being shorter or more polished.

## Hard gates

Fail immediately if the edit:

- invents or changes a fact, number, date, quote, source, name, or claim
- asserts that AI wrote the text
- changes the user's intended position
- removes a meaningful constraint or qualification
- flattens a distinctive voice into generic professional prose
- turns requested spoken or dialect writing into formal article prose
- fabricates slang, personal stories, uncertainty, or other "human" details
- invents proof, scarcity, urgency, testimonials, rankings, capabilities, or unsupported precision
- violates an explicitly active house-style hard rule

## Scorecard

Score internally out of 100:

- factual and semantic fidelity: 25
- voice retention: 20
- specificity and concrete support: 15
- natural rhythm: 15
- directness: 10
- structural variety without theatrics: 10
- formatting restraint: 5

When `commercial-copy-director` was used, evidence integrity and truthful offer framing are hard requirements regardless of the numeric score. When `strict-human-output` house mode was active, active hard bans must pass.

When `plain-spoken-writing` was part of the route, treat sayability, natural thought order, dialect authenticity, and code-switching fidelity as part of voice retention and natural rhythm. Do not reward grammatical polish that makes the result less speakable.

Default pass threshold: 85, with no hard-gate failure.

Do not show the numeric score unless the user asks for scoring.

## Residual checks

Check for:

- repeated binary reframes
- repeated throat-clearing or faux-insight setups
- unsupported authority
- vague importance claims
- synonym cycling
- fake-profound ending
- repeated question-answer scaffolds
- stacked punchy fragments
- excessive short-line stacking or micro-paragraphing
- uniform paragraph geometry
- formatting used only for emphasis
- second-order anti-slop artifacts such as forced slang or over-compression

## Feedback routing

If the draft fails, return only the failing regions to the responsible pass:

- meaning, evidence, factual locks, or general existing-writer voice -> `voice-preserving-edit`
- sayability, spoken thought order, Egyptian dialect, natural code-switching, or controlled roughness -> `plain-spoken-writing`
- phrase, structure, rhythm, agency, or formatting -> `slop-pattern-repair`
- Arabic dialect, Arabic syntax, code-switch terminology, or house Arabic vocabulary -> `arabic-style-curator`
- active hard policy, evidence integrity, format compliance, or punctuation contract -> `strict-human-output`
- headline, CTA, offer framing, proof, or commercial-decision failure -> `commercial-copy-director`
- presentation/document hierarchy, fake visual content, RTL design, or asset-control failure -> `visual-content-anti-slop`

Recheck the revised regions and then the full piece once. Avoid endless polishing loops.

## Output behavior

When invoked as part of another workflow, keep the gate internal and return the finished draft. When the user explicitly asks for a quality review, return pass/fail by category with concise evidence.
