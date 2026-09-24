# Plain-Spoken evaluator

Use this for a final review or when the user asks for a Spoken Score

Score each dimension 0-20

## 1. Sayability

20: nearly every sentence can be spoken naturally as written
10: mixed spoken/written voice
0: article prose pretending to be conversation

## 2. Voice identity

20: vocabulary, code-switching, emphasis, and formality feel specific to the speaker
10: pleasant but generic
0: interchangeable AI voice

## 3. Thought movement

20: ideas move like speech while remaining understandable
10: partly templated
0: obvious essay/content framework

## 4. Controlled roughness

20: useful imperfections survive, noise is cleaned
10: either too polished or too messy
0: raw transcript or fully sanitized prose

## 5. Truthfulness

20: no invented anecdotes, personal claims, statistics, experiences, or false intimacy
10: questionable framing
0: fabricated humanity

## Interpretation

- 90-100: strongly plain-spoken
- 80-89: convincing, minor polish remains
- 65-79: readable but model/writer still visible
- 50-64: mostly constructed conversational copy
- below 50: rewrite from spoken thought

## Hard-fail checks

Regardless of score, revise if:
- a personal story was invented
- meaning changed during humanization
- normal user terminology was translated into unnatural wording
- a product promotion becomes a separate ad voice
- the piece depends on generic slogans or fake statistics

## Optional static lint

Run:

```bash
python scripts/plain_spoken_lint.py draft.txt
```

The linter only flags configured patterns. It cannot decide whether the voice is authentic. Read-aloud review remains authoritative
