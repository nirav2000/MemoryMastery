import assert from 'node:assert/strict';
import fs from 'node:fs';
import {scoreOrderedRecall, firstSuccessSession} from './js/learning.js';
import {mergeBackups} from './js/storage.js';

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
assert(storage.includes('mergeBackups'), 'storage must merge cloud and device progress instead of overwriting one source');

assert(app.includes('badge.hidden=count===0'), 'zero due badge should be hidden');
assert(app.includes('aria-label'), 'due badge needs an accessible label when visible');
const css = fs.readFileSync('css/styles.css','utf8');
assert(css.includes('#dueBadge') && /margin-left:\s*\.6rem/.test(css), 'due badge needs spacing from Progress text');
assert(/\.card\s*\{[^}]*padding:[^}]*margin-block:/s.test(css), 'cards need internal padding and vertical separation to prevent edge text and panel collision');
assert(!css.includes('.smart-hero') && !css.includes('Georgia'), 'legacy SmartPaper/dojo CSS should not remain before the clean design system');

const score = scoreOrderedRecall(['Mercury','Venus','Earth'], 'Mercury\nEarth\nVenus');
assert.equal(score.correct, 1);
assert.equal(score.orderErrors, 2);
assert.equal(score.accuracy, 33);
assert.equal(firstSuccessSession({title:'Planets', material:['A'], method:'link'}).title, 'First success: Planets');
const merged = mergeBackups({version:1,profile:{currentDay:3},firstSuccess:{completed:false},results:[{day:1,date:1,accuracy:50}],reviews:[],palaces:[],majorSystem:[],pao:[],symbols:[],nameImages:[],missions:[],achievements:[]},{version:1,profile:{currentDay:6},firstSuccess:{completed:true,challengeTitle:'Planets'},results:[{day:2,date:2,accuracy:80}],reviews:[],palaces:[],majorSystem:[],pao:[],symbols:[],nameImages:[],missions:[],achievements:[]});
assert.equal(merged.profile.currentDay, 6);
assert.equal(merged.results.length, 2);
assert.equal(merged.firstSuccess.completed, true);
console.log('static regression checks ok');
