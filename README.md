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

## What It Does

1. **Intake**: Asks only what blocks the draft (idea, format, platform, proof).
2. **Mine the Angle**: Finds the work mechanism and dated anchor story.
3. **Verify Facts**: Checks dates, names, metrics, and corrects popular myths in public.
4. **Draft with 6 Architectures**: One idea per line, Egyptian spoken rhythm, office English work nouns preserved.
5. **Mechanical Linter (`scripts/lint.mjs`)**: Blocks em dashes, line-ending periods, banned buzzwords, clickbait, and denial-then-reveal contrasts (`ده مش X. ده Y`).
6. **Critic Pass**: Runs a cold-read review pass for authentic practitioner tone.

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
│   └── examples.md
├── scripts/                          # Mechanical checks and selftests
│   ├── lint.mjs                      # Deterministic linter (Node / Bun)
│   └── selftest.mjs                  # Linter test suite
├── evals/fixtures/                   # Test fixtures (clean vs sloppy)
└── skills/                           # Integrated linked skill suites
    ├── conversational-narrative/     # Deep-dives, diagnostic stories & continuity
    ├── creator-workbench/            # Second-brain memory & living wiki
    └── no-ai-slop/                   # Multi-skill anti-slop engine & Arabic curation
```

---

## Installation & Usage

### Claude Code

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
