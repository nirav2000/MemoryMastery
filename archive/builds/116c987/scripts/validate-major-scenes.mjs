import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const file = 'data/major-system-scenes.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const entries = data.entries || [];
const digitSounds = {
  '0': ['s', 'z'],
  '1': ['t', 'd'],
  '2': ['n'],
  '3': ['m'],
  '4': ['r'],
  '5': ['l'],
  '6': ['j', 'sh', 'ch'],
  '7': ['k', 'g', 'c'],
  '8': ['f', 'v'],
  '9': ['p', 'b']
};
const letterValues = {s:'0',z:'0',t:'1',d:'1',n:'2',m:'3',r:'4',l:'5',j:'6',k:'7',g:'7',f:'8',v:'8',p:'9',b:'9'};
const digraphValues = {sh:'6',ch:'6'};
const required = ['subject','dramaticAction','unusualLocation','exaggeratedVisualFeature','emotion','imaginedSound','imaginedTouch','imaginedSmell','dominantColourPalette','fullImageGenerationPrompt','shortSpokenMnemonic','shortNarration','imageAssetPath'];
const approved = entries.filter(e => e.generationReviewStatus !== 'pending');

function encodePeg(word) {
  const lower = word.toLowerCase().replace(/[^a-z]/g, '');
  let out = '';
  for (let i = 0; i < lower.length; i++) {
    if (lower[i] === 'k' && lower[i + 1] === 'n') continue;
    if (lower[i] === 'g' && lower[i + 1] === 'n') continue;
    if (lower[i] === 'l' && lower[i + 1] === 'k' && lower[i - 1] === 'a') continue;
    const triple = lower.slice(i, i + 3);
    if (triple === 'tch') { out += '6'; i += 2; continue; }
    if (triple === 'dge') { out += '6'; i += 2; continue; }
    const pair = lower.slice(i, i + 2);
    if (pair === 'ph') { out += '8'; i++; continue; }
    if (digraphValues[pair]) { out += digraphValues[pair]; i++; continue; }
    if (lower[i] === 'c') out += /[eiy]/.test(lower[i + 1] || '') ? '0' : '7';
    else if (lower[i] === 'g') out += /[eiy]/.test(lower[i + 1] || '') ? '6' : '7';
    else if (letterValues[lower[i]]) out += letterValues[lower[i]];
  }
  return out.slice(0, 2);
}
function words(s) { return new Set(String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)); }
function jaccard(a, b) { const A = words(a), B = words(b); const inter = [...A].filter(x => B.has(x)).length; const union = new Set([...A, ...B]).size || 1; return inter / union; }
function hasCue(prompt, value) { const P = words(prompt); return [...words(value)].filter(w => w.length > 3).some(w => P.has(w) || [...P].some(p => p.startsWith(w.slice(0, 5)) || w.startsWith(p.slice(0, 5)))); }
function hash(path) { return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'); }

assert.equal(entries.length, 100, 'major-system-scenes must represent 00-99');
const seenNumbers = new Set(entries.map(e => e.number));
for (let i = 0; i < 100; i++) assert(seenNumbers.has(String(i).padStart(2, '0')), `missing entry ${String(i).padStart(2, '0')}`);

for (const entry of entries) {
  assert.match(entry.number, /^\d\d$/, `bad number ${entry.number}`);
  for (const d of entry.number) assert(digitSounds[d].some(s => entry.sounds.includes(s)), `${entry.number} missing sound mapping for digit ${d}`);
  assert.equal(encodePeg(entry.pegWord), entry.number, `${entry.number} peg ${entry.pegWord} does not encode ${entry.number}`);
  if (entry.generationReviewStatus === 'pending') continue;
  for (const field of required) assert(String(entry[field] || '').trim(), `${entry.number} missing ${field}`);
  assert(entry.fullImageGenerationPrompt.toLowerCase().includes(entry.pegWord.toLowerCase()), `${entry.number} prompt missing peg word`);
  assert(hasCue(entry.fullImageGenerationPrompt, entry.dramaticAction), `${entry.number} prompt missing action cue`);
  assert(hasCue(entry.fullImageGenerationPrompt, entry.unusualLocation), `${entry.number} prompt missing location cue`);
  assert(hasCue(entry.fullImageGenerationPrompt, entry.emotion), `${entry.number} prompt missing emotion cue`);
  assert(entry.fullImageGenerationPrompt.length > 600, `${entry.number} prompt lacks detail/exaggeration`);
  assert(fs.existsSync(entry.imageAssetPath), `${entry.number} missing image asset ${entry.imageAssetPath}`);
}

for (const field of ['dramaticAction','unusualLocation','dominantColourPalette']) {
  const seen = new Map();
  for (const entry of approved) {
    const value = entry[field].toLowerCase();
    assert(!seen.has(value), `duplicate ${field}: ${value}`);
    seen.set(value, entry.number);
  }
}
const paths = approved.map(e => e.imageAssetPath).filter(Boolean);
assert.equal(paths.length, new Set(paths).size, 'two entries share an image path');
const prompts = approved.map(e => e.fullImageGenerationPrompt);
assert.equal(prompts.length, new Set(prompts).size, 'duplicate final prompt');
for (let i = 0; i < prompts.length; i++) for (let j = i + 1; j < prompts.length; j++) assert(jaccard(prompts[i], prompts[j]) < 0.74, `prompts are substantially copied: ${approved[i].number}/${approved[j].number}`);
const hashes = new Map();
for (const p of paths) {
  const h = hash(p);
  assert(!hashes.has(h), `generated image files are byte-identical: ${p} and ${hashes.get(h)}`);
  hashes.set(h, p);
}
const threshold = Number(process.env.MAJOR_SCENE_SIMILARITY_THRESHOLD || 0.92);
for (let i = 0; i < paths.length; i++) for (let j = i + 1; j < paths.length; j++) {
  const a = fs.readFileSync(paths[i], 'utf8'), b = fs.readFileSync(paths[j], 'utf8');
  assert(jaccard(a, b) < threshold, `perceptual/textual SVG similarity exceeds threshold: ${paths[i]} / ${paths[j]}`);
}
console.log(`major scene validation ok: ${entries.length} represented, ${approved.length} approved, ${entries.length - approved.length} pending`);
