#!/usr/bin/env python3
"""Deterministic lint for Slop Curator's explicit strict house-style rules.

This is a mechanical signal checker, not a prose quality judge. It only checks
rules that can be detected safely enough with text matching and regexes.
"""
from __future__ import annotations
import argparse, json, re
from pathlib import Path

BANNED_WORDS = [
    "نظام","أنظمة","سيستم","سيستمات","منظومة","منظومات","طبقة","طبقات",
    "ماكينة","ماكنة","مكنة","ماكينات","ترس","تروس","احتلال","احتل","يحتل",
    "هيمنة","يهيمن","سيطرة","يسيطر","الفرق"
]
ARABIC_PHRASES = [
    "في عالم يتغير بسرعة","في عالم اليوم","في العصر الرقمي","في ظل التطور المتسارع",
    "في المشهد الحالي","في نهاية المطاف","اليوم أكثر من أي وقت مضى","أصبح من الضروري",
    "نقلة نوعية","تجربة استثنائية","آفاق جديدة","نتائج غير مسبوقة","حلول متكاملة",
    "من الألف إلى الياء","كل ما تحتاجه في مكان واحد","تخيل لو","السر يكمن",
    "هنا يأتي دور","وهنا تكمن أهمية","وهنا تظهر القيمة","الحقيقة الصادمة",
    "يغير قواعد اللعبة","يعيد تعريف","يحدث ثورة","يقلب الموازين","مستقبل أفضل"
]
ENGLISH_PHRASES = [
    "unlock","unleash","harness","leverage","revolutionize","supercharge","game changer",
    "game changing","cutting edge","state of the art","next generation","best in class",
    "world class","industry leading","unparalleled","unprecedented","one stop shop",
    "in today's fast paced world","in the digital age","now more than ever","imagine a world where",
    "the secret to","at the heart of","at its core","look no further","take it to the next level",
    "stay ahead of the curve","stand out from the crowd","turn your vision into reality",
    "the possibilities are endless"
]
NEGATIVE_PATTERNS = [
    re.compile(r"\bمش\s+.+?\s+(?:ده|دا|لكن|إنما|بل)\s+", re.I),
    re.compile(r"\bهذا\s+ليس\s+.+?\s+بل\s+", re.I),
    re.compile(r"\bليست?\s+.+?\s+(?:بل|لكن|إنما)\s+", re.I),
    re.compile(r"\bnot\s+(?:just\s+)?[^\n.!?]{1,100}?\s+but\s+", re.I),
    re.compile(r"\bthis\s+is\s+not\s+[^\n.!?]{1,100}?\s+this\s+is\s+", re.I),
]
TECHNICAL_PERIOD = re.compile(r"(?:https?://\S+|\b\S+@\S+\.\S+|\b\d+\.\d+\b|\b\w+\.\w{1,6}\b)$")

def lint(text: str):
    findings=[]
    for i,line in enumerate(text.splitlines(),1):
        stripped=line.rstrip()
        if not stripped: continue
        if "—" in line:
            findings.append({"line":i,"rule":"em_dash","evidence":"—"})
        if stripped.endswith('.') and not TECHNICAL_PERIOD.search(stripped):
            findings.append({"line":i,"rule":"terminal_period","evidence":stripped[-80:]})
        low=line.lower()
        for phrase in ARABIC_PHRASES:
            if phrase in line:
                findings.append({"line":i,"rule":"arabic_ai_expression","evidence":phrase})
        for phrase in ENGLISH_PHRASES:
            if phrase in low:
                findings.append({"line":i,"rule":"english_ai_expression","evidence":phrase})
        for word in BANNED_WORDS:
            if re.search(rf"(?<![\w\u0600-\u06FF]){re.escape(word)}(?![\w\u0600-\u06FF])", line):
                findings.append({"line":i,"rule":"house_banned_word","evidence":word})
        for pat in NEGATIVE_PATTERNS:
            m=pat.search(line)
            if m:
                findings.append({"line":i,"rule":"negative_setup_positive_reveal","evidence":m.group(0)[:120]})
                break
    return findings

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('file', nargs='?')
    ap.add_argument('--text')
    args=ap.parse_args()
    if args.text is not None: text=args.text
    elif args.file: text=Path(args.file).read_text(encoding='utf-8')
    else: raise SystemExit('provide a file or --text')
    f=lint(text)
    print(json.dumps({"ok":not f,"count":len(f),"findings":f},ensure_ascii=False,indent=2))
    raise SystemExit(1 if f else 0)
if __name__=='__main__': main()
