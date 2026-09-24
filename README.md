# Written as Spoken

An AI agent skill and writing ecosystem that crafts LinkedIn and Facebook posts in Mamdouh Aboammar's voice: authentic Egyptian Arabic that reads like a senior marketer talking to a colleague on the way home, with a real story bridged to daily marketing work and zero AI slop.

The voice was measured from about 3.4M characters of published posts, drafts, and ad copy. The `#بعد_الساعة_5` series is the primary reference.

---

## Linked Skills Suite (المهارات المرتبطة المدمجة)

This repository serves as the central hub integrating three specialized writing and content skills:

| Linked Skill / Suite | Description | Dedicated Repo |
| :--- | :--- | :--- |
| **[Conversational Narrative](skills/conversational-narrative)** | Practitioner deep-dives, storytelling concepts, and multi-part series continuity. | [imMamdouhaboammar/conversational-narrative](https://github.com/imMamdouhaboammar/conversational-narrative) |
| **[Creator Workbench](skills/creator-workbench)** | Second-brain creator memory, living wiki, content matrix, and social analytics. | [imMamdouhaboammar/creator-workbench](https://github.com/imMamdouhaboammar/creator-workbench) |
| **[No AI Slop](skills/no-ai-slop)** | Multi-skill anti-slop editing, short-line cleanup, strict house rules, and visual-content review. | [imMamdouhaboammar/no-ai-slop](https://github.com/imMamdouhaboammar/no-ai-slop) |

---

## How the suite is wired

`written-as-spoken` is the single front door. Every request gets a route, the linked skills each do one job, and the work always comes back for lint and the critic pass.

```text
request
   |
   v
route.mjs  ---->  intent + chain + modifiers   (references/routing-map.json)
   |
   v
specialist skills (series, deep dive, offer, carousel, reel, recall ...)
   |
   v
written-as-spoken writes the lines
   |
   v
lint.mjs  ---->  repair plan: each finding names the skill that fixes it
   |                 |
   |   <-------------+   (max 3 cycles)
   v
voice-critic  ---->  fixes tagged by type, routed the same way
   |
   v
final post
```

```bash
node scripts/route.mjs "اكتبلي الجزء التاني من سلسلة PyMC"
# intent   series_episode (next episode of a series or build log), architecture C
# route    workspace-recall -> series-continuity-writer -> written-as-spoken -> lint -> voice-critic
```

- **Dynamic routing**: `scripts/route.mjs` scores the request against the signals in `references/routing-map.json` (Arabic normalised, whole-word matching, format beats topic on a tie) and adds modifiers for Saudi dialect, fact checks, strict rules and Facebook.
- **Feedback edges**: `scripts/lint.mjs` tags every finding with its repair owner (`denial-reveal -> slop-pattern-repair`, `fusha -> arabic-style-curator`, `claim -> story-researcher`) and prints a repair plan.
- **Back-links**: every routed sub-skill ends with a generated "Linked to Written as Spoken" block listing the routes through it, the failures sent to it and the defaults this voice overrides. `scripts/sync-links.mjs` writes those blocks from the graph.
- **Link health**: `scripts/check-links.mjs` fails on a missing file, an unknown or orphan node, a stale block, a lint rule with no owner, or a manifest path with no skill in it.

The full route table and conflict rules are in [`references/routing.md`](references/routing.md).

## What It Does

1. **Intake**: Asks only what blocks the draft (idea, format, platform, proof).
2. **Mine the Angle**: Finds the work mechanism and dated anchor story.
3. **Verify Facts**: Checks dates, names, metrics, and corrects popular myths in public.
4. **Draft with 6 Architectures**: One idea per line, Egyptian spoken rhythm, office English work nouns preserved.
5. **Mechanical Linter (`scripts/lint.mjs`)**: Blocks em dashes, line-ending periods, banned buzzwords, clickbait, and denial-then-reveal contrasts, and hands each finding to the skill that repairs it.
6. **Critic Pass**: Runs a cold-read review pass for authentic practitioner tone, with every fix routed to an owner.

---

## Repository Structure

```text
written-as-spoken/
├── SKILL.md                          # Main Written as Spoken skill definition
├── README.md                         # Project documentation and ecosystem overview
├── package.json                      # Bun/Node test and lint scripts
├── LICENSE                           # MIT License
├── .claude-plugin/                   # Claude Code plugin manifest
│   └── plugin.json
├── .codex-plugin/                    # OpenAI Codex plugin manifest
│   └── plugin.json
├── agents/                           # Subagents for verification and critique
│   ├── story-researcher.md           # Checks dates, cases, and claims
│   └── voice-critic.md               # Evaluates cold draft against the voice DNA
├── references/                       # Voice DNA, lexicons, and skeletons
│   ├── voice-dna.md
│   ├── anti-slop.md
│   ├── architectures.md
│   ├── lexicon.md
│   ├── examples.md
│   ├── routing.md                    # Route table, handoff packet, conflict rules
│   └── routing-map.json              # Routing graph: nodes, intents, feedback edges
├── scripts/                          # Mechanical checks and selftests
│   ├── lint.mjs                      # Deterministic linter with repair plan
│   ├── route.mjs                     # Request classifier
│   ├── check-links.mjs               # Graph and back-link validator
│   ├── sync-links.mjs                # Writes back-link blocks into sub-skills
│   └── selftest.mjs                  # Linter, routing and link tests
├── evals/                            # Fixtures and routing cases
└── skills/                           # Integrated linked skill suites
    ├── conversational-narrative/     # Deep-dives, diagnostic stories & continuity
    ├── creator-workbench/            # Second-brain memory & living wiki
    └── no-ai-slop/                   # Multi-skill anti-slop engine & Arabic curation
```

---

## Installation & Usage

### Claude Code

The plugin manifest loads the main skill from the repo root and every sub-skill from `skills/<suite>/skills/`.

```bash
# Clone or add as skill
/plugin install written-as-spoken@mamdouh-skills
```

Or copy into your project's `.claude/skills/written-as-spoken`.

### OpenAI Codex & Antigravity

Add `written-as-spoken` to your plugins directory or use directly via `.codex-plugin/plugin.json`.

### Run Linter & Tests (with Bun or Node)

```bash
# Run test suite
bun test
# or: node scripts/selftest.mjs

# Lint a draft
bun run lint path/to/draft.txt
# or: node scripts/lint.mjs path/to/draft.txt

# See where a request would go
node scripts/route.mjs "حوّل البوست ده لكاروسيل"

# After editing routing-map.json
node scripts/sync-links.mjs && node scripts/check-links.mjs
```

---

## Examples

```text
اكتبلي بوست بعد الساعة 5 عن إن الـDashboards الكتير بتأخر القرار
```

```text
راجع البوست ده بستايل written as spoken
```

---

## License

MIT © [Mamdouh Aboammar](https://github.com/imMamdouhaboammar)
