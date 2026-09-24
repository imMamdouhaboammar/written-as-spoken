#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

AI_PATTERNS = [
    "في عصر الذكاء الاصطناعي",
    "وهنا تكمن النقطة الأهم",
    "وهنا تأتي النقطة الأهم",
    "ومن هذا المنطلق",
    "وبناءً على ما سبق",
    "والأهم من ذلك",
    "والإجابة ببساطة",
    "دعونا نلقي نظرة",
    "دعونا نتعمق",
    "غيّر قواعد اللعبة",
    "نقلة نوعية",
    "إحداث ثورة",
    "تعزيز الإنتاجية",
    "تحقيق نتائج أفضل",
    "في عالم سريع التطور",
    "هل أنت مستعد",
    "شاركنا رأيك",
]

QUOTE_CARD_PATTERNS = [
    r"المشكلة ليست في .{1,80} بل في",
    r"الأداة لا .{1,80} وإنما",
    r"المستقبل (?:ليس|مش) .{1,80} بل",
]

CONTRAST_PATTERNS = [
    r"مش\s+[^\n،,.!?]{1,70}[،,]\s*(?:لكن|بس)",
    r"ليس\s+[^\n،,.!?]{1,70}[،,]\s*بل",
]


def analyze(text: str) -> dict:
    flags = []
    score = 0

    for phrase in AI_PATTERNS:
        if phrase in text:
            flags.append(f"AI transition/cliche: {phrase}")
            score += 8

    for pattern in QUOTE_CARD_PATTERNS:
        matches = re.findall(pattern, text, flags=re.IGNORECASE)
        if matches:
            flags.append(f"Quote-card wisdom pattern: {pattern}")
            score += 10 * len(matches)

    contrast_count = sum(len(re.findall(p, text, flags=re.IGNORECASE)) for p in CONTRAST_PATTERNS)
    if contrast_count >= 3:
        flags.append(f"Repeated contrast formula: {contrast_count} occurrences")
        score += min(20, 4 * contrast_count)

    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    if len(paragraphs) >= 4:
        lengths = [len(p.split()) for p in paragraphs]
        if max(lengths) - min(lengths) <= 5:
            flags.append("Paragraph rhythm is unusually uniform")
            score += 8

    # Heuristic: too many explicit numbered transitions in prose
    numbered = len(re.findall(r"(?:^|\n)\s*(?:أولًا|ثانيًا|ثالثًا|رابعًا|1[.)]|2[.)]|3[.)])", text))
    if numbered >= 3:
        flags.append("Essay-like numbered progression")
        score += 8

    # Do not penalize English code-switching. It is often desired in Egyptian professional speech.
    score = max(0, min(100, score))
    return {
        "aiish_score": score,
        "flags": flags,
        "note": "Heuristic only. Human read-aloud review remains authoritative."
    }


def main():
    parser = argparse.ArgumentParser(description="Flag common AI-ish writing patterns in Arabic/plain-spoken drafts")
    parser.add_argument("file", nargs="?", help="Text file to inspect. Reads stdin when omitted.")
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    args = parser.parse_args()

    if args.file:
        text = Path(args.file).read_text(encoding="utf-8")
    else:
        import sys
        text = sys.stdin.read()

    report = analyze(text)
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return

    print(f"AI-ish heuristic score: {report['aiish_score']}/100")
    if report["flags"]:
        for flag in report["flags"]:
            print(f"- {flag}")
    else:
        print("- No configured red flags found")
    print(report["note"])


if __name__ == "__main__":
    main()
