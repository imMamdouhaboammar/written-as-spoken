#!/usr/bin/env node
// Classifies a request against references/routing-map.json and prints the route.
// Usage: node route.mjs "<request text>" [--json]
//        node route.mjs --file request.txt [--json]
//        echo "<request>" | node route.mjs [--json]
// The result is a hint for the agent, which still reads the request itself.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const MAP_PATH = join(here, '..', 'references', 'routing-map.json');
export const loadMap = () => JSON.parse(readFileSync(MAP_PATH, 'utf8'));

// Arabic normalisation so "أفكار" and "افكار", "السلسلة" and "السلسله" match the same signal.
export const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/الـ\s*/g, 'ال')
    .replace(/\s+/g, ' ')
    .trim();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PREFIX = '(?:و|ف|ب|ل|ال|وال|بال|فال|لل|ك)?';
const cache = new Map();

// A signal matches as a whole token: Arabic may take a short clitic prefix and up to
// three suffix letters, Latin may take a plural "s". This keeps "بيع" out of "طبيعي".
export function signalRegex(signal) {
  const key = normalize(signal);
  if (cache.has(key)) return cache.get(key);
  const arabic = /[؀-ۿ]/.test(key);
  const body = esc(key);
  const re = arabic
    ? new RegExp(`(?:^|[^\\u0600-\\u06FF])${PREFIX}${body}[\\u0600-\\u06FF]{0,3}(?=$|[^\\u0600-\\u06FF])`)
    : /^\W|\W$/.test(key)
      ? new RegExp(body)
      : new RegExp(`(?:^|[^a-z0-9])${body}s?(?=$|[^a-z0-9])`);
  cache.set(key, re);
  return re;
}

const weight = (signal) => normalize(signal).split(' ').length;

export function route(request, map = loadMap()) {
  const text = normalize(request);
  const lines = request.split('\n').filter((l) => l.trim()).length;
  const scores = {};
  const hits = {};

  const matchedBy = {};
  for (const [id, intent] of Object.entries(map.intents)) {
    matchedBy[id] = intent.signals.filter((s) => signalRegex(s).test(text));
  }
  // A short signal inside a longer one that also matched does not count twice:
  // "عرض تقديمي" is a presentation, the "عرض" inside it is no offer.
  const all = Object.values(matchedBy).flat().map(normalize);
  const swallowed = (s) => all.some((t) => t !== normalize(s) && weight(t) > weight(s) && signalRegex(s).test(t));
  for (const [id, matched] of Object.entries(matchedBy)) {
    hits[id] = matched.filter((s) => !swallowed(s));
    scores[id] = hits[id].reduce((n, s) => n + weight(s), 0);
  }
  // A pasted draft (many lines) is almost always a review unless the user says otherwise.
  if (lines >= 8) scores.review_draft = (scores.review_draft || 0) + 3;

  // "post" is the base intent: it wins only when nothing more specific fired.
  // Ties go to the intent with the higher priority (an output format beats a topic).
  const ranked = Object.entries(scores)
    .filter(([id, s]) => id !== 'post' && s > 0)
    .sort((a, b) => b[1] - a[1] || (map.intents[b[0]].priority || 1) - (map.intents[a[0]].priority || 1));
  const intentId = ranked.length ? ranked[0][0] : 'post';
  const intent = map.intents[intentId];

  const modifiers = Object.entries(map.modifiers)
    .filter(([, m]) => m.signals.some((s) => signalRegex(s).test(text)))
    .map(([id]) => id);

  const chain = [...intent.chain];
  for (const id of modifiers) {
    const m = map.modifiers[id];
    if (!m.node || chain.includes(m.node)) continue;
    if (m.insert_after === 'front') chain.splice(chain[0] === 'workspace-recall' ? 1 : 0, 0, m.node);
    else if (m.insert_before) {
      const at = chain.lastIndexOf(m.insert_before);
      at === -1 ? chain.push(m.node) : chain.splice(at, 0, m.node);
    }
  }

  return {
    intent: intentId,
    label: intent.label,
    architecture: intent.architecture || null,
    platform: modifiers.includes('facebook') ? 'facebook' : 'linkedin',
    chain,
    optional: intent.optional || [],
    modifiers,
    matched: hits[intentId],
    alternatives: ranked.slice(1, 3).map(([id, s]) => ({ intent: id, score: s })),
    paths: Object.fromEntries(chain.map((n) => [n, map.nodes[n]?.path])),
  };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const fileIdx = args.indexOf('--file');
  let request = '';
  if (fileIdx !== -1) request = readFileSync(args[fileIdx + 1], 'utf8');
  else request = args.filter((a) => !a.startsWith('--')).join(' ');
  if (!request.trim() && !process.stdin.isTTY) request = readFileSync(0, 'utf8');
  if (!request.trim()) {
    console.error('usage: node route.mjs "<request>" [--json] | --file request.txt');
    process.exit(2);
  }
  const r = route(request);
  if (asJson) console.log(JSON.stringify(r, null, 2));
  else {
    console.log(`intent   ${r.intent} (${r.label})${r.architecture ? `, architecture ${r.architecture}` : ''}`);
    console.log(`platform ${r.platform}`);
    console.log(`route    ${r.chain.join(' -> ')}`);
    if (r.optional.length) console.log(`optional ${r.optional.join(', ')}`);
    if (r.modifiers.length) console.log(`mods     ${r.modifiers.join(', ')}`);
    if (r.alternatives.length) console.log(`also     ${r.alternatives.map((a) => a.intent).join(', ')}`);
  }
}
