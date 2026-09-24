import { test, expect } from "bun:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const lint = join(here, "..", "scripts", "lint.mjs");
const fx = (n) => join(here, "..", "evals", "fixtures", n);
const run = (f) => spawnSync(process.execPath, [lint, f, "--json"], { encoding: "utf8" });

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
