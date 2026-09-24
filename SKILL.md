---
name: written-as-spoken
description: Writes social media posts in Mamdouh Aboammar's "Written as Spoken" voice, Egyptian Arabic that reads like a senior marketer talking to a colleague on the way home, one breath per line, English work nouns kept as they are said in the office, a real story or case bridged to daily marketing work, and zero AI slop. Use for any LinkedIn or Facebook post, #بعد_الساعة_5 episode, build-log series, launch or offer post, carousel caption or short take in this voice, and whenever the user says "اكتبلي بوست", "بوست بستايلي", "written as spoken", "بعد الساعة 5", "حوّل الفكرة دي لبوست", "راجع البوست ده", or pastes a topic, link, story or draft to turn into a post. Runs an agentic loop: intake, angle mining, fact check, draft, lint script, critic pass, final copy.
metadata:
  version: "1.0"
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

## The loop

Run these steps in order. Keep the conversation short: ask only what blocks the draft.

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

Every year, number, name, quote and "research says" in the anchor gets verified. In Claude Code, delegate to `agents/story-researcher.md` when the story is not already sourced; elsewhere, check it yourself with search if available.

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

Fix every `BLOCK`. Look at every `WARN` and fix it unless it is clearly a false positive (explain which in one line to yourself, never to the user). Re-run until clean.

### 6. Critic pass

Read the draft as a tired Egyptian marketer scrolling at 11 pm. In Claude Code, delegate to `agents/voice-critic.md` for a cold read. Otherwise run the checklist at the end of `references/anti-slop.md` yourself. Rewrite any line that:

- sounds written rather than said,
- could appear on any brand's page,
- announces instead of showing,
- denies one thing to reveal another (rewrite from scratch, never rephrase inside the same pattern).

### 7. Deliver

Give the user:

1. The post, ready to paste, with the series sign-off when it is a #بعد_الساعة_5 episode.
2. One line naming the architecture and the anchor used.
3. Any fact you dropped or softened, in one line each.
4. Optional, only if useful: two alternative first lines.

Do not explain the rules or show the lint output unless asked.

## Reviewing an existing draft

When the user pastes a draft to review, run steps 5 and 6 on it, then return the corrected post plus a short list of the changes that matter (max five bullets, each quoting the old line and the new one).

## Series sign-off

For #بعد_الساعة_5 episodes end with exactly:

```
#بعد_الساعة_5 نحاول نتعلم حاجة جديدة
دي سلسلة بشارك فيها معاك أفكار بتيجي في بالي وأنا مروح البيت
```

Other series (build logs, market notes) close with a line pointing to the next episode, written plainly.

## Linked Skills & Ecosystem Routing

When a request extends beyond individual post generation into technical deep-dives, workspace memory, or multi-skill anti-slop curation, route to or combine with the linked skills available in `skills/`:

1. **Conversational Narrative** (`skills/conversational-narrative`):
   - Use when the post requires deep practitioner diagnostics, multi-part series continuity, or complex technical concept explanations.
   - Key skills: `conversational-narrative-router`, `diagnostic-deep-dive-writer`, `series-continuity-writer`, `technical-concept-storyteller`.
   - Upstream repo: [imMamdouhaboammar/conversational-narrative](https://github.com/imMamdouhaboammar/conversational-narrative).

2. **Creator Workbench** (`skills/creator-workbench`):
   - Use when retrieving background context from exports/research, building a second-brain wiki, or structuring content matrices and visual direction.
   - Key skills: `creator-router`, `second-brain-setup`, `living-wiki`, `workspace-recall`, `content-matrix`.
   - Upstream repo: [imMamdouhaboammar/creator-workbench](https://github.com/imMamdouhaboammar/creator-workbench).

3. **No AI Slop / Slop Curator** (`skills/no-ai-slop`):
   - Use for deep anti-slop audits, strict house-rule enforcement, commercial copywriting, and visual presentation/RTL audits.
   - Key skills: `slop-router`, `slop-audit`, `plain-spoken-writing`, `arabic-style-curator`, `strict-human-output`.
   - Upstream repo: [imMamdouhaboammar/no-ai-slop](https://github.com/imMamdouhaboammar/no-ai-slop).

