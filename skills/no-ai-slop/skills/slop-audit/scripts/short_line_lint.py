#!/usr/bin/env python3
"""Heuristic detector for excessive short-line prose.

This script does not decide that short lines are wrong. It finds clusters that
may indicate manufactured staccato rhythm or micro-paragraphing. Semantic review
must suppress poetry, lyrics, scripts, dialogue, UI copy, lists, tables, code,
headlines, captions, and formats the user explicitly requested.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

LIST_OR_STRUCTURE = re.compile(
    r"^\s*(?:[-*+]\s+|\d+[.)]\s+|#{1,6}\s+|>|```|~~~|\|.*\||[-=_]{3,}\s*$)"
)
SPEAKER_LABEL = re.compile(r"^\s*[\w\u0600-\u06FF .'-]{1,28}:\s+")
URLISH = re.compile(r"https?://|www\.|\S+@\S+\.\S+")


def word_count(s: str) -> int:
    return len(re.findall(r"[\w\u0600-\u06FF]+(?:[-'][\w\u0600-\u06FF]+)?", s, flags=re.UNICODE))


def is_candidate(line: str, max_words: int, max_chars: int) -> bool:
    t = line.strip()
    if not t:
        return False
    if LIST_OR_STRUCTURE.match(t) or SPEAKER_LABEL.match(t) or URLISH.search(t):
        return False
    wc = word_count(t)
    return 1 <= wc <= max_words and len(t) <= max_chars


def analyze(text: str, min_run: int = 4, max_words: int = 12, max_chars: int = 100) -> dict:
    # Preserve physical line numbers, but allow blank lines inside a micro-paragraph
    # cluster because social posts often separate every short sentence with a blank.
    rows = text.splitlines()
    candidates = []
    for idx, line in enumerate(rows, 1):
        candidates.append((idx, line, is_candidate(line, max_words, max_chars)))

    findings = []
    run = []
    blank_budget = 1
    blanks = 0

    def flush():
        nonlocal run, blanks
        if len(run) >= min_run:
            avg_words = round(sum(word_count(line) for _, line in run) / len(run), 1)
            findings.append({
                "rule": "short_line_stacking",
                "confidence": "contextual",
                "start_line": run[0][0],
                "end_line": run[-1][0],
                "line_count": len(run),
                "average_words_per_line": avg_words,
                "evidence": [line.strip()[:120] for _, line in run[:6]],
                "note": "Review in context; suppress for poetry, lyrics, dialogue, UI copy, lists, code, or requested line-by-line formatting."
            })
        run = []
        blanks = 0

    for idx, line, candidate in candidates:
        if candidate:
            run.append((idx, line))
            blanks = 0
            continue
        if not line.strip() and run and blanks < blank_budget:
            blanks += 1
            continue
        flush()
    flush()

    return {
        "ok": not findings,
        "count": len(findings),
        "findings": findings,
        "thresholds": {
            "minimum_consecutive_short_lines": min_run,
            "maximum_words_per_short_line": max_words,
            "maximum_characters_per_short_line": max_chars,
        },
        "note": "Heuristic signal only. Short lines can be intentional and genre-appropriate."
    }


def main() -> None:
    ap = argparse.ArgumentParser(description="Flag clusters of excessive short standalone prose lines")
    ap.add_argument("file", nargs="?", help="UTF-8 text/Markdown file. Reads stdin when omitted.")
    ap.add_argument("--min-run", type=int, default=4)
    ap.add_argument("--max-words", type=int, default=12)
    ap.add_argument("--max-chars", type=int, default=100)
    args = ap.parse_args()

    if args.file:
        text = Path(args.file).read_text(encoding="utf-8")
    else:
        text = sys.stdin.read()

    report = analyze(text, args.min_run, args.max_words, args.max_chars)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    raise SystemExit(1 if report["findings"] else 0)


if __name__ == "__main__":
    main()
