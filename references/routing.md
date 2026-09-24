# Routing

How `written-as-spoken` decides which linked skills join a request, in what order, and where a draft goes when a check fails. The machine-readable version is `routing-map.json`; this file explains the thinking behind it. When the two disagree, fix the JSON and run `node scripts/check-links.mjs`.

## 1. Who owns what

`written-as-spoken` is the only front door. It owns the voice, the angle, the draft and the final delivery. Every other skill is a specialist it calls for one job and then takes the work back from.

| Suite | Brought in for | Never allowed to |
|---|---|---|
| `skills/no-ai-slop` | repair after a failed check: structure, punctuation, Arabic drift, offer logic, visuals | reflow the stacked lines into paragraphs |
| `skills/conversational-narrative` | reasoning for technical posts, deep dives and series episodes | change the line layout or the punctuation rules |
| `skills/creator-workbench` | memory, idea banks, hooks, formats (carousel, reel, pinned comment), analytics | draft the post itself (`post-writer`, `post-formatter` are shadowed) |
| `agents/` | fact checks (`story-researcher`) and the cold read (`voice-critic`) | invent a source |

## 2. Picking the route

Read the request, then run the router when the intent is not obvious:

```bash
node scripts/route.mjs "اكتبلي الجزء التاني من سلسلة PyMC"
```

It returns the intent, the chain, the architecture and any modifiers. Treat it as a strong hint. The request itself wins when they disagree, for example when the user pasted a draft but asked for a brand new post on the same topic.

Rules the router follows, and that you follow when routing by hand:

1. **Specific beats general.** `post` is the base intent. Any more specific signal (series, offer, reel, hooks) takes over.
2. **Multi-word signals weigh more, and swallow the short ones inside them.** "حوّل الـPlaybook لعرض تقديمي" is a presentation; the "عرض" inside "عرض تقديمي" does not count toward an offer post.
3. **Format beats topic on a tie.** "newsletter عن الـMMM" asks for a newsletter; MMM is only its subject.
4. **A pasted draft of 8 lines or more leans to `review_draft`.**
5. **Modifiers stack on top of any route.** A Saudi request adds `arabic-style-curator` before lint. A story, number or study adds `story-researcher` at the front. "قواعدي" adds `strict-human-output`. Facebook changes the platform cut.
6. **Optional nodes run only when needed.** `workspace-recall` in a series episode runs only when the previous episodes are not already in the conversation.
7. **`save-progress` runs only on an explicit request.** Finishing a post is never a reason to persist anything.

## 3. The routes

| Intent | Chain | Architecture |
|---|---|---|
| `post` | written-as-spoken, lint, voice-critic | A |
| `review_draft` | lint, voice-critic, voice-preserving-edit, slop-pattern-repair, slop-quality-gate, lint | same as draft |
| `audit_only` | lint, slop-audit | none |
| `series_episode` | workspace-recall?, series-continuity-writer, written-as-spoken, lint, voice-critic | C |
| `technical_explainer` | technical-concept-storyteller, written-as-spoken, lint, voice-critic | C |
| `diagnostic_deep_dive` | diagnostic-deep-dive-writer, written-as-spoken, lint, voice-critic | B |
| `offer_post` | commercial-copy-director, written-as-spoken, strict-human-output, lint, voice-critic | E |
| `from_memory` | workspace-recall, create-from-brain, written-as-spoken, lint, voice-critic | A |
| `ideas` | content-matrix, niche-research?, written-as-spoken | none |
| `trend_topic` | niche-research, story-researcher, written-as-spoken, lint, voice-critic | F |
| `hooks` | hook-generator, lint | none |
| `carousel` | carousel-generator, written-as-spoken, visual-content-anti-slop, lint | F |
| `reel_script` | reels-scripting, plain-spoken-writing, arabic-style-curator, lint | none |
| `transcript_to_post` | voiceprint, written-as-spoken, lint | fits the content |
| `pinned_comment` | pinned-comment, lint | none |
| `visual` | graphic-designer, infographic-generator?, visual-content-anti-slop | none |
| `presentation` | slop-router, visual-content-anti-slop, arabic-style-curator, strict-human-output, slop-quality-gate | none |
| `score_post` | lint, post-scorer | none |
| `analytics` | analytics-dashboard | none |
| `workspace_setup` | creator-router | none |
| `long_form_narrative` | conversational-narrative-router, voice-fidelity-reviewer | none |
| `save_learning` | save-progress | none |

A `?` marks an optional node.

## 4. What travels between nodes

Every handoff carries the same small packet, stated in plain lines, so the next skill does not have to guess:

- **Angle**: the one-sentence work mechanism from step 2 of `SKILL.md`
- **Anchor**: the story or case, with what `story-researcher` confirmed and what it dropped
- **Architecture and platform**
- **Proof on hand**: only numbers and names the user gave or a source confirmed
- **Protected lines**: phrases the user wrote that must survive every edit
- **Open findings**: lint findings and critic fixes not yet resolved

A sub-skill returns its output plus any finding it could not fix. It never returns a rewritten angle unless the route sent it there to find one.

## 5. The feedback loop

After every draft, `lint.mjs` tags each finding with the skill that owns its repair and prints a repair plan:

```
repair plan
  strict-human-output: dash, period, banned-word (L6, L7)
  slop-pattern-repair: denial-reveal (L1, L4)
  arabic-style-curator: fusha (L2)
```

Work the plan top to bottom: BLOCK owners first, one owner at a time, then lint again. The same happens with the critic's verdict: each fix row names an owner (`weak-hook` goes to `hook-generator`, `translated-arabic` to `arabic-style-curator`, `rewrite` goes back to angle mining).

Stop after three repair cycles. If a line still fails, rewrite it from scratch in this voice instead of patching it again, then lint once more. A line that keeps failing usually means the angle behind it is weak.

## 6. Conflicts between suites

The voice files win over any linked skill's own style defaults. The specific overrides:

- **Line layout.** `conversational-narrative` prefers mixed paragraph lengths. Here the post keeps one breath per line; take their reasoning order and drop their layout.
- **Short-line checks.** `slop-audit`'s `short_line_lint.py` and the short-line repair in `slop-pattern-repair` treat stacked short lines as slop. In this voice they are the rhythm, so those findings are ignored.
- **House profile.** `strict-human-output` normally needs an activation signal for the house rules. Coming through `written-as-spoken` counts as that signal.
- **Frameworks.** `post-formatter` (PAS, AIDA, BAB) and `post-writer` are shadowed. Named frameworks never appear inside a post.
- **Hooks.** The "contradiction" hook type from `hook-generator` must never turn into a denial-then-reveal line. Every hook passes lint before the user sees it.
- **Evidence.** Any linked skill that wants a number, a client or a result gets it from the user or from `story-researcher`, or goes without it.

## 7. Keeping the links healthy

```bash
node scripts/sync-links.mjs     # rewrite the back-link block in every routed sub-skill
node scripts/check-links.mjs    # fail on a missing file, unknown node, orphan, stale block or unowned lint rule
```

Add a skill to the graph in this order: node in `routing-map.json`, then at least one intent, modifier or feedback edge that reaches it, then `sync-links.mjs`, then a case in `evals/routing-cases.json`.
