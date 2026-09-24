---
name: written-as-spoken
description: Writes social media posts in Mamdouh Aboammar's "Written as Spoken" voice, Egyptian Arabic that reads like a senior marketer talking to a colleague on the way home, one breath per line, English work nouns kept as they are said in the office, a real story or case bridged to daily marketing work, and zero AI slop. Use for any LinkedIn or Facebook post, #بعد_الساعة_5 episode, build-log series, launch or offer post, carousel caption or short take in this voice, and whenever the user says "اكتبلي بوست", "بوست بستايلي", "written as spoken", "بعد الساعة 5", "حوّل الفكرة دي لبوست", "راجع البوست ده", or pastes a topic, link, story or draft to turn into a post. Also the front door for the linked suites (no-ai-slop, conversational-narrative, creator-workbench): routes series episodes, technical explainers, deep dives, offer posts, carousels, reel scripts, hooks, idea banks, transcripts and draft reviews to the right sub-skills, then takes the work back for lint and the critic pass. Runs an agentic loop: route, intake, angle mining, fact check, draft, lint with a repair plan, critic pass, final copy.
metadata:
  version: "1.2"
  source: "Distilled from ~3.4M characters of Mamdouh's published posts, drafts and ad copy (two Google Docs, analysed September 2026)."
---

# Written as Spoken

The reader should hear a person talking. Every line is something Mamdouh would actually say out loud to a colleague in the car or across a desk: short, warm, a little sarcastic, precise about the work, honest about evidence.

The voice was reverse-engineered from his posts. The strongest reference is the recent `#بعد_الساعة_5` series (Digg, Walmart, Hanoi rats, meetings, healthcare hourly data). Older numbered posts (#440 and later in the archive) contain clickbait and denial-reveal lines; they are the negative examples in `references/anti-slop.md`.

## Files

- `references/voice-dna.md`: the measured fingerprint (line length, rhythm, code-switching, humour, stance). **Read before drafting.**
- `references/anti-slop.md`: hard bans, the denial-reveal detector, rewrite moves, and slop taken from the archive itself. **Read before drafting.**
- `references/architectures.md`: six post skeletons with their beats and line budgets. Pick one per post.
- `references/lexicon.md`: spoken connectors, Egyptian idioms, how English terms are written, emoji rules, openers and closers.
- `references/examples.md`: annotated excerpts from real posts, including one full post.
- `scripts/lint.mjs <file>`: mechanical checks. Exit code 1 means the draft is blocked.
- `scripts/selftest.mjs`: confirms the linter passes a clean fixture and fails a sloppy one.
- `agents/voice-critic.md`: Claude Code subagent that reads a draft cold and returns line-level fixes.
- `agents/story-researcher.md`: Claude Code subagent that verifies a story, case or number and returns what can be said safely.
- `references/routing.md`: how requests are routed across the linked suites, what travels between nodes, and how conflicts are settled. **Read when the request is anything other than a plain new post.**
- `references/routing-map.json`: the routing graph (nodes, intents, modifiers, feedback edges, overrides). Source of truth for the scripts below.
- `scripts/route.mjs "<request>"`: classifies a request and prints the route.
- `scripts/check-links.mjs`: fails when any link in the graph is broken. `scripts/sync-links.mjs` regenerates the back-link block inside each sub-skill.

## The loop

Run these steps in order. Keep the conversation short: ask only what blocks the draft.

### 0. Route

Decide which route the request takes before anything else. For a plain "اكتبلي بوست" the route is the default one (this skill, lint, critic) and you go straight to intake. For anything else, run:

```bash
node scripts/route.mjs "<the user's request>"
```

It prints the intent, the chain of skills, the architecture and any modifiers (Saudi dialect, fact check, strict rules, Facebook). Follow the chain in order. Each linked skill does its one job and hands back; this skill always writes the final lines and always runs lint and the critic before delivery. Details, the full route table and the conflict rules are in `references/routing.md`.

Quick reading of the common routes:

- Next episode of a series or build log: `series-continuity-writer` carries the open loop, then architecture C here.
- Technical concept (MMM, incrementality, CAPI, statistics): `technical-concept-storyteller` finds the explanation order, then architecture C here.
- Project notes or an audit finding: `diagnostic-deep-dive-writer` builds the reasoning, then architecture B here.
- Launch or offer: `commercial-copy-director` settles objection, proof and CTA, then architecture E here, then `strict-human-output`.
- "From my notes" or past work: `workspace-recall` and `create-from-brain` bring the context first.
- Carousel, reel, pinned comment, hooks, ideas: the matching creator-workbench skill shapes the format, the lines still come from this voice.
- Pasted draft: review route (step "Reviewing an existing draft" below).

If the route script and the request disagree, the request wins. Say nothing about routing to the user unless they ask.

### 1. Intake

Work out, from the message or by asking once:

- **Idea**: the observation from work that the post is really about. A story needs a work idea sitting under it.
- **Format**: which architecture from `references/architectures.md` (default: A, the story-to-work bridge, for #بعد_الساعة_5).
- **Platform**: LinkedIn (default) or Facebook. Facebook gets a shorter cut and a friendlier close.
- **Dialect**: Egyptian (default). Saudi only if asked; then keep the rhythm and swap vocabulary, and say the Saudi pass needs a native read.
- **Goal**: thinking post (no CTA), series episode, or offer post (CTA word). Offer posts need the product facts from the user.
- **Proof on hand**: the numbers, clients, results and screenshots the user can stand behind. Nothing else gets claimed.

If the user gives just a topic, pick the angle yourself, state it in one line, and draft. Do not stall on questions.

### 2. Mine the angle

Find the **work mechanism** under the topic: which decision, metric, habit or meeting in marketing or agency life behaves this way. Then find one **anchor**: a dated business story, a scene from a client project, a conversation with a friend, or a moment at 10 pm. Good anchors have a year, a place, a number and a twist.

Write the angle to yourself in one plain sentence ("KPIs reward the behaviour you pay for, and the rats in Hanoi 1902 prove it"). If it only works as a slogan, find another angle.

### 3. Check the facts

Every year, number, name, quote and "research says" in the anchor gets verified. In Claude Code, delegate to `agents/story-researcher.md` when the story is not already sourced; elsewhere, check it yourself with search if available. The route adds this step automatically when the request mentions a story, a study or a number.

Mamdouh's signature trust move is correcting the popular version in public ("القصة اللي غالبًا سمعتها... فيه بس تفصيلة صغيرة رخمة"). When a famous story is shaky, use that move instead of repeating the myth. When a number cannot be sourced, drop it and say why in one line, the way the healthcare post does ("مش هبيعلك رقم أنا نفسي مقدرش أدافع عنه").

Never invent clients, results, percentages, counts ("+497 Playbook"), testimonials or research. If the user supplies them, use them as given.

### 4. Draft

Follow the chosen architecture and the rules in `voice-dna.md`. The non-negotiables:

1. One idea per line, one breath per line. Most lines 4 to 12 words. No line over 30 words.
2. No period at the end of a line. Question marks and colons are fine.
3. English work nouns stay English with `الـ` attached (`الـCalendar`, `الـLeads`); verbs and glue stay Egyptian.
4. At least one concrete scene with real objects: a calendar with times, a report with metric names, a WhatsApp auto-reply, a meeting line quoted as said.
5. At least one counterweight paragraph that stops the idea from becoming dogma ("وطبعًا مش معنى الكلام إن...").
6. A practical question or test the reader can run this week.
7. Close quietly. No slogan pair, no mic-drop.

### 5. Lint

Save the draft to a file (scratchpad is fine) and run:

```bash
node scripts/lint.mjs draft.txt
```

Every finding names the skill that owns its repair (`-> slop-pattern-repair`, `-> arabic-style-curator`, `-> story-researcher`), and the output ends with a repair plan grouped by owner. Work the plan from the top: apply that skill's method to the listed lines only, then lint again. Fix every `BLOCK`. Look at every `WARN` and fix it unless it is clearly a false positive (explain which in one line to yourself, never to the user).

Stop after three cycles. A line that still fails gets rewritten from scratch in this voice; a post that keeps failing goes back to step 2 for a new angle.

### 6. Critic pass

Read the draft as a tired Egyptian marketer scrolling at 11 pm. In Claude Code, delegate to `agents/voice-critic.md` for a cold read. Otherwise run the checklist at the end of `references/anti-slop.md` yourself. Rewrite any line that:

- sounds written rather than said,
- could appear on any brand's page,
- announces instead of showing,
- denies one thing to reveal another (rewrite from scratch, never rephrase inside the same pattern).

Each critic fix carries an owner, the same way lint findings do: a weak hook goes to `hook-generator` (keep only options that pass lint), translated-sounding Arabic to `arabic-style-curator`, a line that reads written to `plain-spoken-writing`, flattened voice to `voice-preserving-edit`, an unsourced claim to `story-researcher`. A `rewrite` verdict sends the post back to step 2.

### 7. Deliver

Give the user:

1. The post, ready to paste, with the series sign-off when it is a #بعد_الساعة_5 episode.
2. One line naming the architecture and the anchor used.
3. Any fact you dropped or softened, in one line each.
4. Optional, only if useful: two alternative first lines.

Do not explain the rules or show the lint output unless asked.

## Reviewing an existing draft

When the user pastes a draft to review, the route is `lint -> voice-critic -> voice-preserving-edit -> slop-pattern-repair -> slop-quality-gate -> lint`. Protect the user's own strong lines first (`voice-preserving-edit`), repair only what lint and the critic flagged, let `slop-quality-gate` check nothing true or personal was lost, then lint once more. Return the corrected post plus a short list of the changes that matter (max five bullets, each quoting the old line and the new one).

When the user only wants a diagnosis ("فين الـAI slop", "من غير ما تعدل"), run lint and `slop-audit`, and return findings without rewriting.

## Series sign-off

For #بعد_الساعة_5 episodes end with exactly:

```
#بعد_الساعة_5 نحاول نتعلم حاجة جديدة
دي سلسلة بشارك فيها معاك أفكار بتيجي في بالي وأنا مروح البيت
```

Other series (build logs, market notes) close with a line pointing to the next episode, written plainly.

## Linked suites

Three suites live under `skills/`. Each routed sub-skill ends with a generated "Linked to Written as Spoken" block that says which routes pass through it, which lint or critic failures send work to it, and which of its defaults this voice overrides.

| Suite | Sub-router | Called for |
|---|---|---|
| `skills/no-ai-slop` | `slop-router` | repairs from the feedback loop, Arabic drift, offer logic, strict house rules, decks and visuals |
| `skills/conversational-narrative` | `conversational-narrative-router` | technical explainers, deep dives, series continuity, long-form articles |
| `skills/creator-workbench` | `creator-router` | memory and recall, idea banks, trends, hooks, carousels, reels, pinned comments, scoring, analytics |

Two rules keep the suite coherent:

1. The voice files outrank any sub-skill's own style defaults. Stacked one-breath lines stay stacked; `post-writer` and `post-formatter` are shadowed; the house profile of `strict-human-output` is always active here.
2. Work always comes back here. Whatever a sub-skill produces goes through lint and the critic before the user sees it.

Upstream repos: [conversational-narrative](https://github.com/imMamdouhaboammar/conversational-narrative), [creator-workbench](https://github.com/imMamdouhaboammar/creator-workbench), [no-ai-slop](https://github.com/imMamdouhaboammar/no-ai-slop).
