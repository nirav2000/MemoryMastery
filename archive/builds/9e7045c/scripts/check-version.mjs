import assert from 'node:assert/strict';
import fs from 'node:fs';

const version = fs.readFileSync('VERSION', 'utf8').trim();
const index = fs.readFileSync('index.html', 'utf8');
const loader = fs.readFileSync('js/version.js', 'utf8');
const archive = JSON.parse(fs.readFileSync('data/version-archive.json', 'utf8'));

assert.match(version, /^\d+\.\d+\.\d+$/, 'VERSION must use semantic versioning, for example 1.0.1');
assert(
  index.includes('<span class="app-version" data-app-version aria-live="polite">Version loading…</span>'),
  'index.html footer must provide the live version target'
);
assert(index.includes('src="js/version.js"'), 'index.html must load the version footer module');
assert(loader.includes("fetch('VERSION', { cache: 'no-store' })"), 'footer version must be fetched dynamically without a stale cache');
assert.equal(archive.currentVersion, version, 'version archive currentVersion must match VERSION');

console.log(`version check ok: ${version}`);
