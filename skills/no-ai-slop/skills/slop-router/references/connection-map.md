# Slop Curator connection map

The Plugin is a routed set of full Skills. `slop-router` is the only implicit entry point.

## Nodes
- `slop-router`: intent, profile and pass selection
- `slop-audit`: evidence-only pattern diagnosis
- `voice-preserving-edit`: meaning and existing-writer voice owner
- `plain-spoken-writing`: spoken-thought reconstruction, sayability and Egyptian spoken cadence
- `arabic-style-curator`: Arabic dialect, syntax, terminology, code-switching and Arabic style-policy owner
- `commercial-copy-director`: commercial message, audience, proof, headline, CTA and playbook owner
- `visual-content-anti-slop`: presentation, document, visual brief, RTL design and asset-control owner
- `slop-pattern-repair`: targeted phrase, structure, rhythm, agency and formatting repair
- `strict-human-output`: portable and house-style policy enforcement, evidence and format guard
- `slop-quality-gate`: fidelity, voice, evidence, policy and over-editing verification

## Canonical routes
- `audit_only`: `slop-router` -> `slop-audit`
- `standard_edit`: `slop-router` -> `voice-preserving-edit` -> `slop-pattern-repair` -> `slop-quality-gate`
- `strict_edit`: `slop-router` -> `voice-preserving-edit` -> `slop-pattern-repair` -> `strict-human-output` -> `slop-quality-gate`
- `plain_spoken_rewrite`: `slop-router` -> `plain-spoken-writing` -> `slop-pattern-repair` -> `slop-quality-gate`
- `egyptian_arabic_or_code_switching`: `slop-router` -> `plain-spoken-writing` -> `arabic-style-curator` -> `slop-quality-gate`
- `voice_anchored_spoken_edit`: `slop-router` -> `voice-preserving-edit` -> `plain-spoken-writing` -> `arabic-style-curator` -> `slop-pattern-repair` -> `slop-quality-gate`
- `house_style_arabic`: `slop-router` -> `voice-preserving-edit` -> `arabic-style-curator` -> `strict-human-output` -> `slop-quality-gate`
- `commercial_copy`: `slop-router` -> `commercial-copy-director` -> `strict-human-output` -> `slop-quality-gate`
- `commercial_copy_arabic`: `slop-router` -> `commercial-copy-director` -> `arabic-style-curator` -> `strict-human-output` -> `slop-quality-gate`
- `practical_playbook`: `slop-router` -> `commercial-copy-director` -> `plain-spoken-writing` -> `arabic-style-curator` -> `strict-human-output` -> `slop-quality-gate`
- `visual_or_presentation`: `slop-router` -> `visual-content-anti-slop` -> `strict-human-output` -> `slop-quality-gate`
- `arabic_visual_or_presentation`: `slop-router` -> `visual-content-anti-slop` -> `arabic-style-curator` -> `strict-human-output` -> `slop-quality-gate`
- `quality_review`: `slop-router` -> `slop-quality-gate`

## Feedback edges
- `slop-pattern-repair` -> `voice-preserving-edit` when repair flattens voice or changes a protected voice anchor
- `slop-pattern-repair` -> `plain-spoken-writing` when repair sanitizes spoken syntax, dialect, useful repetition or controlled roughness
- `plain-spoken-writing` -> `arabic-style-curator` when spoken Arabic has dialect drift, translated syntax, terminology inconsistency or unnatural code-switching
- `arabic-style-curator` -> `plain-spoken-writing` when Arabic correction makes a spoken draft less sayable or removes demonstrated personal cadence
- `commercial-copy-director` -> `strict-human-output` when claims, proof, urgency, specificity or output constraints require policy enforcement
- `commercial-copy-director` -> `arabic-style-curator` when commercial copy is Arabic or bilingual and needs market/dialect language control
- `visual-content-anti-slop` -> `arabic-style-curator` when visual deliverable contains Arabic or mixed-direction copy
- `visual-content-anti-slop` -> `strict-human-output` when visual copy has exact-format, asset, evidence or house-style constraints
- `strict-human-output` -> `voice-preserving-edit` when hard-rule repair preserves policy but damages an existing writer voice
- `strict-human-output` -> `plain-spoken-writing` when hard-rule repair makes requested spoken prose mechanical or unsayable
- `slop-quality-gate` -> `voice-preserving-edit` when fidelity, factual lock or existing-writer voice failure
- `slop-quality-gate` -> `plain-spoken-writing` when sayability, spoken thought order or controlled roughness failure
- `slop-quality-gate` -> `arabic-style-curator` when Arabic dialect, syntax, terminology, code-switching or house Arabic failure
- `slop-quality-gate` -> `slop-pattern-repair` when residual phrase, structure, rhythm, agency or formatting failure
- `slop-quality-gate` -> `strict-human-output` when active policy, evidence, punctuation or exact-format failure
- `slop-quality-gate` -> `commercial-copy-director` when headline, CTA, offer, proof or commercial decision framing failure
- `slop-quality-gate` -> `visual-content-anti-slop` when visual hierarchy, fake content, RTL design logic or asset-control failure
