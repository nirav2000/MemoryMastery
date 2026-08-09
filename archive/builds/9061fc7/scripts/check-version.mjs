import assert from 'node:assert/strict';
import fs from 'node:fs';

const version = fs.readFileSync('VERSION', 'utf8').trim();
const index = fs.readFileSync('index.html', 'utf8');

assert.match(version, /^\d+\.\d+\.\d+$/, 'VERSION must use semantic versioning, for example 1.0.1');
assert(
  index.includes(`<span class="app-version">Version ${version}</span>`),
  `index.html footer must display Version ${version}`
);

console.log(`version check ok: ${version}`);
