# Changelog

## 1.2.0

- Routing graph in `references/routing-map.json` with 34 nodes, 22 intents, 4 modifiers, lint and critic feedback edges, overrides and shadowed skills.
- `scripts/route.mjs` classifies a request and returns its chain of skills. Step 0 of the loop in `SKILL.md` uses it.
- `scripts/lint.mjs` tags every finding with the skill that owns its repair and prints a repair plan.
- `agents/voice-critic.md` tags fixes by type and ends with a route-back line.
- Every routed sub-skill carries a generated "Linked to Written as Spoken" block (`scripts/sync-links.mjs`).
- `scripts/check-links.mjs` validates the graph, anchors, back-links, critic types, routing doc and plugin manifest.
- Fixed `.claude-plugin/plugin.json`: it pointed at suite folders that hold no `SKILL.md`, so none of the linked sub-skills loaded. It now lists `skills/<suite>/skills`.
- Routing evals in `evals/routing-cases.json`, run by `npm test`.

## 1.1.0

- Linked suites added under `skills/`.

## 1.0.0

- Initial release.
