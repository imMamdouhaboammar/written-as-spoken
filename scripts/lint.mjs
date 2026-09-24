#!/usr/bin/env node
// Mechanical checks for Written as Spoken drafts.
// Usage: node lint.mjs <draft.txt> [--json]
// Exit 0 when there are no BLOCK findings, 1 otherwise, 2 on usage errors.

import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('usage: node lint.mjs <draft.txt> [--json]');
  process.exit(2);
}

const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const lines = text.split('\n');

const SERIES_TAG = '#بعد_الساعة_5';
const SEP = '[\\s،؛:؟?.!()\\[\\]"«»]';
const arWord = (w) => new RegExp(`(^|${SEP})${w}(?=$|${SEP})`);

const EN_BANNED = [
  'unleash', 'unlock', 'harness', 'leverage', 'optimize', 'revolutionize', 'game-changing',
  'cutting-edge', 'state-of-the-art', 'next-generation', 'elevate', 'innovative', 'groundbreaking',
  'seamless', 'effortless', 'the power of', 'empower', 'transform', 'disrupt', 'maximize',
  'streamline', 'synergy', 'paradigm shift', 'robust', 'scalable', 'best-in-class', 'world-class',
  'industry-leading', 'unparalleled', 'unprecedented',
];
const AR_BANNED = [
  'ثوري', 'نقلة نوعية', 'لا مثيل له', 'غير مسبوق', 'أطلق العنان', 'ارتقِ', 'حلول متكاملة',
  'الأفضل على الإطلاق', 'سحري',
];
const CLICKBAIT = [
  /top\s*1\s*%/i, /السر اللي/, /مخبين/, /اعمل\s*follow/i, /تخيل لو/, /أكبر غلطة بتعملها/,
  /النصيحة دي ليك/, /خليني أقولك سر/, /هل تعلم/, /في عالم اليوم/,
];
const FUSHA = ['سوف', 'الذي', 'التي', 'هذا', 'هذه', 'ليس', 'لكنه', 'لذلك', 'حيث', 'إنّ'];
const CLOSERS = [/في النهاية/, /في الختام/, /خلاصة القول/];
const EMOJI = /\p{Extended_Pictographic}/gu;

// Single-line denial-then-reveal shapes.
const DENIAL_LINE = [
  [/(^|\s)(مش|مو|ليس|ليست)\s+مجرد/, 'مش مجرد / ليس مجرد'],
  [/(^|\s)مش\s+بس\s.*(ده|دي|كمان|لكن|بل)(\s|$)/, 'مش بس ... ده كمان'],
  [/(^|\s)(ليس|ليست)\s.*\sبل\s/, 'ليس ... بل'],
  [/(^|\s)(ده|دي|هذا|هذه)\s+(مش|ليس|ليست)\s[^.،…]+[.،…]+\s*(ده|دي|هذا|هذه|هو|هي)\s/, 'ده مش X، ده Y'],
  [/(^|\s)(\S+)\s+(مش|ليس|ليست)\s[^.،…]+[.،…]+\s*\2\s/, 'X مش A.. X B'],
  [/المشكلة\s+(مش|ليست)\s.*المشكلة/, 'المشكلة مش X، المشكلة Y'],
  [/الإجابة\s+(مش|ليست)\s.*الإجابة/, 'الإجابة مش X، الإجابة Y'],
  [/لا\s+نتحدث\s+عن/, 'لا نتحدث عن ... نحن نتحدث عن'],
  [/\bnot\s+(just|only|merely)\b/i, 'not just'],
  [/\b(this|it|that)\s+(is|'s)\s+not\b/i, 'this is not'],
  [/\bnot\s+[^,.;]{1,40},\s*but\b/i, 'not X, but Y'],
];
// "مش" used as a qualifier, not a setup for a reveal.
const QUALIFIER = /(^|\s)مش\s+(معنى|شرط|لازم|عارف|قادر|فاهم|هنا|كل)(\s|$)/;

const findings = [];
const add = (level, line, rule, msg) => findings.push({ level, line, rule, msg });

const firstWord = (s) => s.trim().replace(/^[وف]?(ال)?/, '').split(/\s+/)[0] || '';
const hasNeg = (s) => /(^|\s)(مش|مو|ليس|ليست|مبي\S*|مابي\S*)(\s|$)/.test(s);

let emojiCount = 0;
let exclam = 0;
let words = 0;
let shortLines = 0;
let latinWords = 0;
let contentLines = 0;

const nonEmpty = lines.map((l, i) => ({ l, i })).filter((x) => x.l.trim() !== '');

nonEmpty.forEach(({ l, i }, k) => {
  const n = i + 1;
  const t = l.trim();
  const isSignoff = t.startsWith(SERIES_TAG) || t.startsWith('دي سلسلة بشارك فيها');

  const w = t.split(/\s+/).filter(Boolean);
  if (!isSignoff) {
    contentLines++;
    words += w.length;
    if (w.length <= 6) shortLines++;
    latinWords += w.filter((x) => /[A-Za-z]/.test(x)).length;
  }

  if (/[—–]/.test(t)) add('BLOCK', n, 'dash', 'Em or en dash. Use a new line, a comma or a colon.');
  if (/[^.]\.$/.test(t) && !/\d\.$/.test(t)) add('BLOCK', n, 'period', 'Line ends with a period.');
  if (/\.{3,}\s*$/.test(t) || /…/.test(t)) add('WARN', n, 'ellipsis', 'Trailing ellipsis reads as written suspense.');
  if (/^\.\s*$/.test(t)) add('BLOCK', n, 'dot-ladder', 'Lone dot line used as a separator.');

  if (w.length > 40) add('BLOCK', n, 'long-line', `Line has ${w.length} words. Split it into breaths.`);
  else if (w.length > 30) add('WARN', n, 'long-line', `Line has ${w.length} words.`);

  const lower = t.toLowerCase();
  for (const b of EN_BANNED) {
    if (new RegExp(`\\b${b.replace(/-/g, '[- ]?')}\\w*`, 'i').test(lower)) add('BLOCK', n, 'banned-word', `Banned word: ${b}`);
  }
  for (const b of AR_BANNED) if (t.includes(b)) add('BLOCK', n, 'banned-word', `Banned word: ${b}`);
  for (const r of CLICKBAIT) if (r.test(t)) add('BLOCK', n, 'clickbait', `Clickbait or guru phrase: ${r.source}`);

  for (const [r, name] of DENIAL_LINE) if (r.test(t)) add('BLOCK', n, 'denial-reveal', `Denial-then-reveal shape (${name}). Rewrite from scratch.`);

  // Two-line version: "X مش Y" followed by "X Z", or "مش A" followed by a plain positive line.
  const next = nonEmpty[k + 1]?.l.trim();
  if (next && hasNeg(t) && !QUALIFIER.test(t) && !hasNeg(next) && !next.endsWith('؟') && !t.endsWith('؟')) {
    const a = firstWord(t);
    const b = firstWord(next);
    const earlyNeg = /^(\S+\s+){0,3}(مش|مو|ليس|ليست|مبي\S*)(\s|$)/.test(t);
    if (a && a === b && w.length <= 14 && earlyNeg) {
      add('BLOCK', n, 'denial-reveal', `Two-line denial-then-reveal ("${a} ... مش" then "${b} ..."). Rewrite from scratch.`);
    } else if (/^(مش|مو)\s/.test(t) && w.length <= 10) {
      add('WARN', n, 'denial-reveal', 'Line opens with a denial and the next line answers it. Check for a hidden reveal.');
    }
  }
  // Reveal that repeats the words right after the denial: "... مش إنه يفشل" then "إنه ينجح".
  if (next && !QUALIFIER.test(t)) {
    const m = t.match(/(?:^|\s)(?:مش|مو|ليس|ليست)\s+(\S+)[^؟]*$/);
    if (m && m[1] === next.split(/\s+/)[0] && !hasNeg(next)) {
      add('BLOCK', n, 'denial-reveal', `Denial then reveal across lines ("مش ${m[1]}..." then "${m[1]}..."). Rewrite from scratch.`);
    }
  }
  // Slogan pair: two parallel "واللي ... / واللي ..." lines.
  if (next && /^و?اللي\s/.test(t) && /^و?اللي\s/.test(next) && k > nonEmpty.length - 8) {
    add('WARN', n, 'slogan-pair', 'Parallel "اللي ... / واللي ..." closing pair reads like a slogan.');
  }

  if (!/^[«"]/.test(t)) {
    for (const f of FUSHA) if (arWord(f).test(t)) add('WARN', n, 'fusha', `Formal Arabic marker "${f}" outside a quote.`);
  }
  for (const r of CLOSERS) if (r.test(t)) add('WARN', n, 'closer', `Stock closer: ${r.source}`);
  if (/(^|\s)\+\d/.test(t) || /\d+(\.\d+)?\s*%/.test(t) || /\d+\s*x(\s|$)/i.test(t)) {
    add('WARN', n, 'claim', 'Number or percentage. Confirm the source or cut it.');
  }
  if (/^#{1,6}\s/.test(t) || /\*\*/.test(t)) add('WARN', n, 'markup', 'Heading or bold markup inside a post.');
  const tags = (t.match(/#[^\s#]+/g) || []).filter((x) => x !== SERIES_TAG);
  if (tags.length) add('WARN', n, 'hashtag', `Extra hashtags: ${tags.join(' ')}`);
  if (/[“”]/.test(t) || /"[^"]*[؀-ۿ][^"]*"/.test(t)) add('WARN', n, 'quotes', 'Quotation marks around Arabic. Use a colon and a new line.');

  emojiCount += (t.match(EMOJI) || []).length;
  exclam += (t.match(/[!！]/g) || []).length;
});

if (exclam > 1) add('WARN', 0, 'exclamation', `${exclam} exclamation marks. Keep at most one, inside quoted speech.`);
if (contentLines && emojiCount / contentLines > 1 / 8) {
  add('WARN', 0, 'emoji', `${emojiCount} emoji in ${contentLines} lines. Aim for one per 10 to 20 lines.`);
}

const stats = {
  lines: contentLines,
  avgWords: contentLines ? +(words / contentLines).toFixed(1) : 0,
  shortLinePct: contentLines ? Math.round((shortLines / contentLines) * 100) : 0,
  latinPct: words ? Math.round((latinWords / words) * 100) : 0,
  emoji: emojiCount,
};
if (contentLines >= 15) {
  if (stats.avgWords > 13) add('WARN', 0, 'rhythm', `Average ${stats.avgWords} words per line. Target about 8.`);
  if (stats.shortLinePct < 25) add('WARN', 0, 'rhythm', `Only ${stats.shortLinePct}% short lines. Target about 40%.`);
}

// A line already blocked for a denial-reveal does not need the softer warning too.
const blockedDenial = new Set(findings.filter((f) => f.level === 'BLOCK' && f.rule === 'denial-reveal').map((f) => f.line));
for (let i = findings.length - 1; i >= 0; i--) {
  const f = findings[i];
  if (f.level === 'WARN' && f.rule === 'denial-reveal' && blockedDenial.has(f.line)) findings.splice(i, 1);
}

const blocks = findings.filter((f) => f.level === 'BLOCK').length;

if (asJson) {
  console.log(JSON.stringify({ file, stats, blocks, findings }, null, 2));
} else {
  for (const f of findings) console.log(`${f.level.padEnd(5)} ${f.line ? `L${f.line}` : '--'}  [${f.rule}] ${f.msg}`);
  console.log(
    `\n${stats.lines} lines, ${stats.avgWords} words/line, ${stats.shortLinePct}% short, ${stats.latinPct}% English, ${stats.emoji} emoji`,
  );
  console.log(blocks ? `BLOCKED: ${blocks} finding(s) must be fixed.` : 'PASS: no blocking findings.');
}
process.exit(blocks ? 1 : 0);
