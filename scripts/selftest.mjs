#!/usr/bin/env node
// Confirms the linter passes the clean fixture and blocks the sloppy one.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const lint = join(here, 'lint.mjs');
const fx = (n) => join(here, '..', 'evals', 'fixtures', n);
const run = (f) => spawnSync(process.execPath, [lint, f, '--json'], { encoding: 'utf8' });

let failed = 0;
const clean = run(fx('clean.txt'));
if (clean.status !== 0) {
  failed++;
  console.error('FAIL clean.txt was blocked:\n' + clean.stdout);
} else console.log('ok   clean.txt passes');

const sloppy = run(fx('sloppy.txt'));
const report = JSON.parse(sloppy.stdout);
const rules = new Set(report.findings.filter((f) => f.level === 'BLOCK').map((f) => f.rule));
for (const r of ['denial-reveal', 'banned-word', 'clickbait', 'dash', 'period']) {
  if (!rules.has(r)) {
    failed++;
    console.error(`FAIL sloppy.txt did not trigger ${r}`);
  } else console.log(`ok   sloppy.txt triggers ${r}`);
}
const pair = report.findings.some((f) => f.rule === 'denial-reveal' && f.line === 4);
if (!pair) {
  failed++;
  console.error('FAIL two-line denial-reveal on line 4 was missed');
} else console.log('ok   two-line denial-reveal caught');

process.exit(failed ? 1 : 0);
