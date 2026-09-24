# Slop Curator

A routed ChatGPT/Codex Plugin made of multiple full Skills for writing and content work that should feel specific, natural, factual, and appropriate to the requested voice or market.

## Full Skills

- `slop-router` chooses the smallest useful route and policy profile
- `slop-audit` diagnoses named patterns without rewriting or guessing authorship
- `voice-preserving-edit` protects meaning, facts, and an existing writer's voice
- `plain-spoken-writing` reconstructs natural spoken prose and Egyptian Arabic cadence
- `arabic-style-curator` handles Arabic dialect, syntax, terminology, code-switching, and Arabic slop banks
- `commercial-copy-director` owns audience, awareness, proof, offer, headline, CTA, and playbook decisions
- `visual-content-anti-slop` reviews presentation/document structure, design clichés, RTL logic, and asset integrity
- `slop-pattern-repair` fixes specific phrase, structure, rhythm, agency, and formatting problems
- `strict-human-output` enforces either a portable factuality baseline or an explicitly activated house-style profile
- `slop-quality-gate` checks fidelity, voice, evidence, policy compliance, and over-editing

## Why the Router matters

The rules are intentionally separated. A terminal-period ban or a personal Arabic banned-word list should not become a universal writing law. The Router distinguishes universal integrity rules from house style, Arabic language rules, commercial-copy logic, and visual-content constraints, then loads only what the task needs.

The machine-readable graph lives in `skills/slop-router/references/connection-map.json`.

## Source lineage

This curated Plugin incorporates and adapts ideas from the MIT-licensed `no-ai-slop` and `stop-slop` projects, the separately supplied `plain-spoken-writing` Skill, and a user-supplied strict human-output and Arabic style rule bank. See `THIRD_PARTY_NOTICES.md` and the source references inside the Skills.


## Short-line slop

The audit and repair passes detect excessive short-line stacking in ordinary prose while preserving poetry, dialogue, UI copy, lists, scripts, and deliberate pacing.
