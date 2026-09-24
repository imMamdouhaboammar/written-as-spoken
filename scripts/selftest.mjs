#!/usr/bin/env node
// Confirms the linter passes the clean fixture and blocks the sloppy one,
// the router sends every eval request to the expected route, and the link graph is whole.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { route } from './route.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const lint = join(here, 'lint.mjs');
const fx = (n) => join(here, '..', 'evals', 'fixtures', n);
const run = (f) => spawnSync(process.execPath, [lint, f, '--json'], { encoding: 'utf8' });

let failed = 0;
const check = (ok, pass, fail) => {
  if (ok) console.log(`ok   ${pass}`);
  else {
    failed++;
    console.error(`FAIL ${fail}`);
  }
};

const clean = run(fx('clean.txt'));
check(clean.status === 0, 'clean.txt passes', 'clean.txt was blocked:\n' + clean.stdout);

const sloppy = run(fx('sloppy.txt'));
const report = JSON.parse(sloppy.stdout);
const rules = new Set(report.findings.filter((f) => f.level === 'BLOCK').map((f) => f.rule));
for (const r of ['denial-reveal', 'banned-word', 'clickbait', 'dash', 'period']) {
  check(rules.has(r), `sloppy.txt triggers ${r}`, `sloppy.txt did not trigger ${r}`);
}
const pair = report.findings.some((f) => f.rule === 'denial-reveal' && f.line === 4);
check(pair, 'two-line denial-reveal caught', 'two-line denial-reveal on line 4 was missed');

// Every finding knows who repairs it, and the plan puts BLOCK owners first.
check(report.findings.every((f) => f.owner), 'every lint finding has a repair owner', 'a lint finding has no owner');
check(report.plan?.[0]?.blocks > 0, 'repair plan starts with a blocking owner', 'repair plan is missing or unordered');

// Routing evals.
const cases = JSON.parse(readFileSync(join(here, '..', 'evals', 'routing-cases.json'), 'utf8'));
for (const c of cases) {
  const r = route(c.request);
  const ok =
    r.intent === c.intent &&
    (c.modifiers || []).every((m) => r.modifiers.includes(m)) &&
    (c.chain_includes || []).every((n) => r.chain.includes(n));
  check(ok, `route ${c.intent}: ${c.request.slice(0, 40)}`, `route "${c.request}" gave ${r.intent} [${r.modifiers}] ${r.chain.join(' -> ')}`);
}

// Link graph and generated back-link blocks.
for (const [script, args] of [['check-links.mjs', []], ['sync-links.mjs', ['--check']]]) {
  const res = spawnSync(process.execPath, [join(here, script), ...args], { encoding: 'utf8' });
  check(res.status === 0, `${script} ${args.join(' ')}`.trim() + ' passes', `${script} failed:\n${res.stdout}`);
}

process.exit(failed ? 1 : 0);
