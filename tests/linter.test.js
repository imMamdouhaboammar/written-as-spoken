import { test, expect } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { route, normalize } from "../scripts/route.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const script = (n) => join(here, "..", "scripts", n);
const fx = (n) => join(here, "..", "evals", "fixtures", n);
const run = (f) => spawnSync(process.execPath, [script("lint.mjs"), f, "--json"], { encoding: "utf8" });

test("clean.txt passes linter without block findings", () => {
  const res = run(fx("clean.txt"));
  expect(res.status).toBe(0);
});

test("sloppy.txt triggers block rules", () => {
  const res = run(fx("sloppy.txt"));
  expect(res.status).toBe(1);
  const report = JSON.parse(res.stdout);
  const rules = new Set(report.findings.filter((f) => f.level === "BLOCK").map((f) => f.rule));

  expect(rules.has("denial-reveal")).toBe(true);
  expect(rules.has("banned-word")).toBe(true);
  expect(rules.has("clickbait")).toBe(true);
  expect(rules.has("dash")).toBe(true);
  expect(rules.has("period")).toBe(true);
});

test("lint findings carry repair owners and a plan", () => {
  const report = JSON.parse(run(fx("sloppy.txt")).stdout);
  const owners = new Set(report.findings.map((f) => f.owner));
  expect(owners.has("slop-pattern-repair")).toBe(true);
  expect(owners.has("strict-human-output")).toBe(true);
  expect(report.plan[0].blocks).toBeGreaterThan(0);
});

test("routing evals land on the expected intent", () => {
  const cases = JSON.parse(readFileSync(join(here, "..", "evals", "routing-cases.json"), "utf8"));
  for (const c of cases) {
    const r = route(c.request);
    expect(`${c.request} -> ${r.intent}`).toBe(`${c.request} -> ${c.intent}`);
    for (const m of c.modifiers || []) expect(r.modifiers).toContain(m);
    for (const n of c.chain_includes || []) expect(r.chain).toContain(n);
  }
});

test("signals match whole words only", () => {
  expect(route("بوست طبيعي عن الـBrief").intent).toBe("post");
  expect(normalize("السلسلة أفكار")).toBe("السلسله افكار");
});

test("link graph and back-link blocks are whole", () => {
  expect(spawnSync(process.execPath, [script("check-links.mjs")]).status).toBe(0);
  expect(spawnSync(process.execPath, [script("sync-links.mjs"), "--check"]).status).toBe(0);
});
