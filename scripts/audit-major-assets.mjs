import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const roots = ['assets', 'data'];
const files = [];
function walk(dir) { for (const name of fs.readdirSync(dir)) { const p = path.join(dir, name); const st = fs.statSync(p); if (st.isDirectory()) walk(p); else if (/\.(svg|png|jpg|jpeg|webp|json)$/i.test(p)) files.push(p); } }
for (const root of roots) if (fs.existsSync(root)) walk(root);
const hashes = new Map();
for (const file of files) {
  const h = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const arr = hashes.get(h) || [];
  arr.push(file); hashes.set(h, arr);
}
const dupes = [...hashes.values()].filter(v => v.length > 1);
console.log(`Audited ${files.length} asset/data files.`);
if (!dupes.length) console.log('No byte-identical asset files found.');
else dupes.forEach(group => console.log(`Duplicate hash: ${group.join(', ')}`));
