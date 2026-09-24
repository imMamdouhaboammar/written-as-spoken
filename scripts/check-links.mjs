#!/usr/bin/env node
// Verifies that the routing graph and the linked skills agree with what is on disk.
// Usage: node check-links.mjs [--json]
// Exit 0 when every link resolves, 1 when something is broken.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { START, applyBlock, linkedNodes, renderBlock } from './sync-links.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const at = (p) => join(root, p);
const map = JSON.parse(readFileSync(at('references/routing-map.json'), 'utf8'));

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);

const frontmatterName = (file) => readFileSync(file, 'utf8').match(/^---\n[\s\S]*?^name:\s*(.+)$/m)?.[1].trim();

// GitHub-style heading slugs, enough for the references in this repo.
const slug = (h) =>
  h
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');
const anchorsOf = (file) =>
  new Set(
    readFileSync(file, 'utf8')
      .split('\n')
      .filter((l) => /^#{1,6}\s/.test(l))
      .map((l) => slug(l.replace(/^#+\s*/, ''))),
  );

// 1. Every node resolves, and every skill node's frontmatter name matches its id.
for (const [id, node] of Object.entries(map.nodes)) {
  if (!existsSync(at(node.path))) {
    fail(`node ${id}: missing ${node.path}`);
    continue;
  }
  if (node.kind === 'skill') {
    const name = frontmatterName(at(node.path));
    if (name !== id) fail(`node ${id}: frontmatter name is "${name}"`);
  }
}

// 2. Every edge points at a known node.
const known = (id, where) => map.nodes[id] || fail(`${where}: unknown node "${id}"`);
const reachable = new Set([map.front_door]);
for (const [id, intent] of Object.entries(map.intents)) {
  for (const n of intent.chain) known(n, `intent ${id}`), reachable.add(n);
  for (const n of intent.optional || []) {
    if (!intent.chain.includes(n)) fail(`intent ${id}: optional node "${n}" is not in its chain`);
  }
  if (!intent.signals?.length) fail(`intent ${id}: no signals`);
}
for (const [id, m] of Object.entries(map.modifiers)) if (m.node) known(m.node, `modifier ${id}`), reachable.add(m.node);
for (const [group, edges] of Object.entries(map.feedback)) {
  for (const [rule, edge] of Object.entries(edges)) {
    known(edge.owner, `feedback ${group}.${rule}`);
    reachable.add(edge.owner);
    if (edge.ref) {
      const [file, anchor] = edge.ref.split('#');
      if (!existsSync(at(file))) fail(`feedback ${group}.${rule}: missing ${file}`);
      else if (anchor && !anchorsOf(at(file)).has(anchor)) fail(`feedback ${group}.${rule}: no heading #${anchor} in ${file}`);
    }
  }
}
for (const o of map.overrides) known(o.node, 'override');
for (const id of Object.keys(map.nodes)) if (!reachable.has(id)) fail(`node ${id}: not reachable from any intent, modifier or feedback edge`);

// 3. Shadowed skills exist, so the note about them stays true.
for (const id of Object.keys(map.shadowed)) {
  const p = `skills/creator-workbench/skills/${id}/SKILL.md`;
  if (!existsSync(at(p))) fail(`shadowed ${id}: missing ${p}`);
}

// 4. Every rule the linter can emit has a repair owner.
const lintSrc = readFileSync(at('scripts/lint.mjs'), 'utf8');
const lintRules = new Set([...lintSrc.matchAll(/add\('(?:BLOCK|WARN)',\s*[^,]+,\s*'([^']+)'/g)].map((m) => m[1]));
for (const r of lintRules) if (!map.feedback.lint[r]) fail(`lint rule "${r}" has no feedback owner`);
for (const r of Object.keys(map.feedback.lint)) if (!lintRules.has(r)) warnings.push(`feedback.lint.${r} is never emitted by lint.mjs`);

// 5. Every skill on disk is either routed or deliberately shadowed.
const skillDirs = ['skills/no-ai-slop/skills', 'skills/conversational-narrative/skills', 'skills/creator-workbench/skills'];
const onDisk = skillDirs.flatMap((d) => readdirSync(at(d)).filter((n) => existsSync(at(`${d}/${n}/SKILL.md`))));
const helpers = new Set(['host-workspace-operator', 'sandbox-python-executor', 'second-brain-setup', 'conversation-importer', 'living-wiki', 'brain-briefs', 'profile-optimizer', 'quote-post', 'youtube-thumbnail', 'show-me']);
for (const n of onDisk) {
  if (!map.nodes[n] && !map.shadowed[n] && !helpers.has(n)) warnings.push(`skill ${n} is on disk but not in the routing map`);
}

// 6. Every routed sub-skill carries an up-to-date back-link block to the front door.
for (const id of linkedNodes()) {
  const node = map.nodes[id];
  if (!existsSync(at(node.path))) continue;
  const body = readFileSync(at(node.path), 'utf8');
  if (!body.includes(START)) fail(`node ${id}: no back-link block in ${node.path} (run node scripts/sync-links.mjs)`);
  else if (applyBlock(body, renderBlock(id)) !== body) fail(`node ${id}: back-link block is stale (run node scripts/sync-links.mjs)`);
}

// 7. The critic agent and the routing doc name the same types and intents as the graph.
const critic = readFileSync(at('agents/voice-critic.md'), 'utf8');
for (const t of Object.keys(map.feedback.critic)) {
  if (t !== 'rewrite' && !critic.includes(`\`${t}\``)) fail(`agents/voice-critic.md does not list critic type "${t}"`);
}
const routingDoc = readFileSync(at('references/routing.md'), 'utf8');
for (const id of Object.keys(map.intents)) if (!routingDoc.includes(`\`${id}\``)) fail(`references/routing.md does not document intent "${id}"`);

// 8. Plugin manifest skill paths resolve to real skills.
const manifest = JSON.parse(readFileSync(at('.claude-plugin/plugin.json'), 'utf8'));
for (const p of [].concat(manifest.skills || [])) {
  const dir = at(p);
  const direct = existsSync(join(dir, 'SKILL.md'));
  const nested = existsSync(dir) && statSync(dir).isDirectory() && readdirSync(dir).some((n) => existsSync(join(dir, n, 'SKILL.md')));
  if (!direct && !nested) fail(`.claude-plugin/plugin.json: "${p}" holds no SKILL.md and no <name>/SKILL.md`);
}

const report = { nodes: Object.keys(map.nodes).length, intents: Object.keys(map.intents).length, lintRules: lintRules.size, errors, warnings };
if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
else {
  for (const e of errors) console.log(`ERROR ${e}`);
  for (const w of warnings) console.log(`WARN  ${w}`);
  console.log(`\n${report.nodes} nodes, ${report.intents} intents, ${report.lintRules} lint rules checked`);
  console.log(errors.length ? `BROKEN: ${errors.length} link(s)` : 'PASS: every link resolves');
}
process.exit(errors.length ? 1 : 0);
