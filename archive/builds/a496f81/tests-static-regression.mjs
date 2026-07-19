import assert from 'node:assert/strict';
import fs from 'node:fs';
import {scoreOrderedRecall, firstSuccessSession} from './js/learning.js';

const index = fs.readFileSync('index.html','utf8');
const app = fs.readFileSync('js/app.js','utf8');
const storage = fs.readFileSync('js/storage.js','utf8');

for (const label of ['Today','Learn','Library','Progress']) assert(index.includes(`>${label}`), `missing primary nav ${label}`);
assert(!index.includes('href="#palaces"'), 'advanced tools must not be primary navigation');
for (const id of ['shopping','metric','uk-capitals','planets','prime-ministers']) assert(app.includes(`id:'${id}'`), `missing beginner challenge ${id}`);
assert(app.includes('Source hidden.'), 'final first-success recall must hide source material');
assert(app.includes('schedule(firstSuccessSession(c),result)'), 'first-success completion must schedule a review');
assert(app.includes('data-recall-item'), 'first-success recall should use item-by-item inputs');
assert(storage.includes('firstSuccess:{completed:false}'), 'storage migration must include firstSuccess default');

const score = scoreOrderedRecall(['Mercury','Venus','Earth'], 'Mercury\nEarth\nVenus');
assert.equal(score.correct, 1);
assert.equal(score.orderErrors, 2);
assert.equal(score.accuracy, 33);
assert.equal(firstSuccessSession({title:'Planets', material:['A'], method:'link'}).title, 'First success: Planets');
console.log('static regression checks ok');
