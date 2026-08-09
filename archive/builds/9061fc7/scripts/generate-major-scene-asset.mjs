import fs from 'node:fs';
import path from 'node:path';

const number = process.argv[2];
const force = process.argv.includes('--force');
const candidates = Number(process.env.MAJOR_SCENE_CANDIDATES || 2);
if (!/^\d\d$/.test(number || '')) throw new Error('Usage: node scripts/generate-major-scene-asset.mjs 00 [--force]');
const data = JSON.parse(fs.readFileSync('data/major-system-scenes.json', 'utf8'));
const entry = data.entries.find(e => e.number === number);
if (!entry) throw new Error(`No scene ${number}`);
if (!entry.fullImageGenerationPrompt) throw new Error(`Scene ${number} is pending and has no prompt yet.`);
if (entry.generationReviewStatus === 'reference-approved' && !force) {
  console.log(`${number} is already approved; use --force to generate candidates.`);
  process.exit(0);
}
const key = process.env.OPENAI_API_KEY || process.env.IMAGE_API_KEY;
const outDir = path.join('assets', 'major-scenes', 'candidates', number);
fs.mkdirSync(outDir, {recursive: true});
const manifestPath = path.join(outDir, 'manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {number, prompt: entry.fullImageGenerationPrompt, completed: [], failed: [], pending: candidates};
if (!key) {
  manifest.failed.push({at: new Date().toISOString(), reason: 'No OPENAI_API_KEY or IMAGE_API_KEY in environment; browser code must never contain API keys.'});
  manifest.pending = candidates;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`No API key available. Wrote resumable manifest to ${manifestPath}.`);
  process.exit(0);
}
// Provider-specific generation is intentionally isolated here. Add the approved image API call here,
// one scene at a time, saving each candidate as `${number}-${entry.pegWord}-candidate-N.png`.
manifest.failed.push({at: new Date().toISOString(), reason: 'Generation provider hook not configured in this repository.'});
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Generation hook pending. Manifest updated at ${manifestPath}.`);
