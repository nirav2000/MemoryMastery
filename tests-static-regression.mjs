import assert from 'node:assert/strict';
import fs from 'node:fs';
import {scoreOrderedRecall, firstSuccessSession} from './js/learning.js';
import {mergeBackups} from './js/storage.js';
import {uniqueReviews} from './js/reviews.js';

const index = fs.readFileSync('index.html','utf8');
const app = fs.readFileSync('js/app.js','utf8');
const storage = fs.readFileSync('js/storage.js','utf8');
const training = fs.readFileSync('js/training.js','utf8');
const archive = JSON.parse(fs.readFileSync('data/version-archive.json','utf8'));
const majorScenes = JSON.parse(fs.readFileSync('data/major-system-scenes.json','utf8'));

for (const label of ['Today','Learn','Library','Progress']) assert(index.includes(`>${label}`), `missing primary nav ${label}`);
assert(!index.includes('href="#palaces"'), 'advanced tools must not be primary navigation');
for (const link of ['#versions','#terms','#privacy','#cookies']) assert(index.includes(`href="${link}"`), `missing footer link ${link}`);
assert(app.includes('version-archive') && app.includes('major-system-scenes'), 'app should load archive and Major scene data');
assert(app.includes('function versions()'), 'settings should expose a version archive route outside primary navigation');
assert(app.includes('ARCHIVE_OWNER_EMAIL') && app.includes('myaeixa@gmail.com'), 'version archive should be gated to the owner email');
assert(app.includes('memoryMasteryArchiveOwner'), 'owner sign-in should mark the same-origin developer archive session');
assert(!index.includes('data-owner-only'), 'footer version switcher should stay visible so users can find the version archive');
assert(app.includes('Full archived build snapshots remain gated'), 'version page should explain that full archived builds are owner-gated');
assert(app.includes('linked-card') && app.includes('bindLinkedCards'), 'referenced archive cards should navigate when the whole card is clicked or focused');
assert(app.includes('function cardDestination') && app.includes('clickable-card'), 'cards with one referenced destination should be keyboard and pointer navigable');
assert(fs.existsSync('archive/archive-access-gate.js') && fs.readFileSync('archive/index.html','utf8').includes('archive-access-gate.js'), 'standalone archive should require the owner session gate');
assert(app.includes('archivePath') && app.includes('latestDataPath'), 'version archive should expose archived builds and latest-data options when available');
assert(app.includes('function legalPage'), 'footer legal links should resolve inside the app');
assert.equal(archive.schema, 1);
assert(archive.versions.filter(v => v.screenshot).length >= 19, 'archived builds should include first-load screenshots for significant commits');
for (const v of archive.versions) { assert(v.archivePath && fs.existsSync(v.archivePath), `missing full archive ${v.archivePath}`); assert(v.screenshot && fs.existsSync(v.screenshot), `missing archive screenshot ${v.screenshot}`); }
assert(archive.versions.length >= 19, 'version archive should include meaningful milestones from git history');
for (const id of ['shopping','metric','uk-capitals','planets','prime-ministers']) assert(app.includes(`id:'${id}'`), `missing beginner challenge ${id}`);
assert(app.includes('Source hidden.'), 'final first-success recall must hide source material');
assert(app.includes('schedule(firstSuccessSession(c),result)'), 'first-success completion must schedule a review');
assert(app.includes('data-recall-item'), 'first-success recall should use item-by-item inputs');
assert(training.includes('1. Retrieval warm-up · ${escapeHTML(previous.title)}'), 'training warm-up should reference the previous task when available');
assert(!training.includes('previous.material.slice'), 'warm-up must not reveal answers from the previous task');
assert(training.includes('data-warm') && training.includes('aria-pressed'), 'warm-up clear/vague/missing controls should be interactive');
assert(training.includes('Vague: add one concrete sensory detail') && training.includes('Missing: rebuild the first image'), 'warm-up clear/vague/missing should give distinct guidance');
assert(training.includes('Warm-up note') && training.includes('Recall issue note') && training.includes('data-note-key'), 'training should include editable notes beside warm-up and recall');
assert(training.includes('>4. Recall test</button>') && training.includes('<h2>5. Error review</h2>') && training.includes('7. Reflection'), 'training flow should show steps 4 and 5 before continuing to 6 and 7');
assert(training.includes('id="recallStep"') && training.includes('id="errorReview"'), 'recall and error review should be separate visible training cards');
assert(training.includes('id="openRecallStep"') && training.includes('aria-expanded="false"') && training.includes('id="recallStepBody" hidden'), 'step 4 should start collapsed to its heading and be expandable');
assert(training.includes('const openRecallStep') && training.includes("document.querySelector('#encodeStepBody').hidden = true"), 'opening step 4 should collapse step 3 to its heading');
assert(!training.includes('Never rely on memory alone'), 'training screen should avoid discouraging safety-warning copy in the casual learning flow');
assert(index.includes('© 2026 Memory Mastery.') && !index.includes('not a substitute for secure records'), 'footer should stay clean and non-distracting');
assert(storage.includes('firstSuccess:{completed:false}'), 'storage migration must include firstSuccess default');
assert(storage.includes('notes:[]') && storage.includes('notes:mergeByKey'), 'storage must preserve editable retrieval notes locally and across cloud merge');
assert(storage.includes('mergeBackups'), 'storage must merge cloud and device progress instead of overwriting one source');


assert.equal(majorScenes.entries.length, 100, 'Major scene data should represent 00-99');
assert.equal(majorScenes.entries.filter(e => e.generationReviewStatus === 'reference-approved').length, 10, 'Only 00-09 should be reference-approved in this phase');
assert.equal(majorScenes.entries.filter(e => e.generationReviewStatus === 'pending').length, 90, '10-99 should remain explicitly pending');
for (const n of ['00','01','02','03','04','05','06','07','08','09']) {
  const scene = majorScenes.entries.find(e => e.number === n);
  assert(scene.fullImageGenerationPrompt.includes(scene.pegWord), `${n} prompt should include peg word`);
  assert(scene.imaginedSound && scene.imaginedTouch && scene.imaginedSmell && scene.dominantColourPalette, `${n} should include multisensory cues`);
  assert(scene.imageAssetPath && fs.existsSync(scene.imageAssetPath), `${n} should have a prepared reference image asset`);
}
assert(app.includes('function majorScenesReview'), 'developer review page should display scene specifications');
assert(app.includes('sensory-cues') && app.includes('data-speak-peg') && app.includes('data-narrate'), 'Major cards should reveal sensory cues and separate audio controls');
assert(app.includes('majorReverseTest'), 'Major System should support reverse recall');
assert(fs.existsSync('scripts/validate-major-scenes.mjs'), 'Major scene validation script should exist');
assert(fs.existsSync('scripts/generate-major-scene-asset.mjs'), 'resumable asset-generation script should exist');
assert(fs.existsSync('docs/major-system-asset-audit.md'), 'Major asset audit report should exist');

assert(app.includes('uniqueReviews(get().reviews.filter') && app.includes('review-form') && app.includes('data-review-answer'), 'reviews should deduplicate active cards and require recall input before revealing answers');
assert(app.includes('Review note') && app.includes('function notesPage') && app.includes('href="#notes"'), 'review notes should be editable beside retrieval and collected on a Notes page');
assert(app.includes('Check recall') && app.includes('Source, now revealed'), 'reviews should reveal answers only after checking recall');
assert(app.includes('words from your first image story'), 'review labels should say what is being reviewed, not generic memory set jargon');
assert(!app.includes('Try to remember first. Looking again comes after the effort.'), 'today copy should avoid abstract retrieval jargon');
assert(app.includes('tool-illustration') && app.includes('assets/tool-palace.svg'), 'library should include useful tool illustrations');
assert(app.includes('memoryThumb') && app.includes('major-scene-figure') && app.includes('palace-thumb') && app.includes('handbook-thumb'), 'tool pages and handbook should include inline memory thumbnails');
assert(app.includes("sauce:'sauce'") && app.includes("seed:'seed'") && app.includes("'front gate':'gate'"), 'starter words should map to object illustrations, not initials');
assert(!app.includes('illustrationInitials'), 'memory thumbnails must be object illustrations rather than letter initials');
assert(index.includes('rel="preload" as="image" href="assets/tool-palace.svg"'), 'tool illustrations should be preloaded to avoid slow first display');
assert(app.includes('recentRecallList') && !app.includes('aria-label="Recent accuracy chart"'), 'progress should use a clearer recent-recall list instead of the old chart');
assert(app.includes('Open current lesson') && app.includes('Open progress details') && app.includes('href="#train"') && app.includes('href="#progress"'), 'Today support cards should be explicit navigable links');

for (const file of ['assets/tool-palace.svg','assets/tool-major.svg','assets/tool-pao.svg','assets/tool-symbols.svg','assets/tool-names.svg','assets/tool-contract.svg']) assert(fs.existsSync(file), `missing tool illustration ${file}`);

assert(app.includes('badge.hidden=count===0'), 'zero due badge should be hidden');
assert(app.includes('aria-label'), 'due badge needs an accessible label when visible');
const css = fs.readFileSync('css/styles.css','utf8');
assert(css.includes('#dueBadge') && /margin-left:\s*\.6rem/.test(css), 'due badge needs spacing from Progress text');
assert(css.includes('.profile-link, #authButton { padding-inline: 1.15rem;'), 'header text buttons need internal padding');
assert(css.includes('.recall-list') && css.includes('.review-form'), 'progress and review layouts need dedicated spacing');
assert(css.includes('.training-card > p') && css.includes('max-width: none'), 'training cards should not force awkward short-line wrapping');
assert(css.includes('.step-toggle') && css.includes('min-height: 44px'), 'step heading toggle should be visible and have a touch-sized target');
assert(css.includes('.site-footer { display: flex') && css.includes('.site-footer small'), 'footer links and copyright should align on one row when space allows');
assert(css.includes('.memory-thumb .thumb-line') && css.includes('grid-template-columns: auto auto minmax(0, 1fr) auto'), 'inline illustrations should have responsive layout support');
assert(/\.card\s*\{[^}]*padding:[^}]*margin-block:/s.test(css), 'cards need internal padding and vertical separation to prevent edge text and panel collision');
assert(/pre\s*\{[^}]*overflow-x:\s*auto[^}]*white-space:\s*pre-wrap/s.test(css), 'archive rebuild commands should wrap or scroll without page overflow');
assert(css.includes('body { margin: 0; min-width: 0; color: var(--ink);'), 'body text colour must follow theme tokens, especially in dark mode');
assert(css.includes('body.dark nav'), 'dark mode must not leave the navigation on a light background');
assert(css.includes('.page-hero > *') && css.includes('body.dark .page-hero::after'), 'decorative hero art should sit behind content and be subdued in dark mode');
assert(!css.includes('.smart-hero') && !css.includes('Georgia'), 'legacy SmartPaper/dojo CSS should not remain before the clean design system');

const score = scoreOrderedRecall(['Mercury','Venus','Earth'], 'Mercury\nEarth\nVenus');
assert.equal(score.correct, 1);
assert.equal(score.orderErrors, 2);
assert.equal(score.accuracy, 33);
const shifted = scoreOrderedRecall(['Apple','Lantern','Tiger','Piano'], '?\nLantern\nTiger\nPiano');
assert.equal(shifted.correct, 3);
assert.equal(shifted.omitted, 1);
assert.equal(shifted.accuracy, 75);
assert.equal(firstSuccessSession({title:'Planets', material:['A'], method:'link'}).title, 'First success: Planets');
const merged = mergeBackups({version:1,profile:{currentDay:3},firstSuccess:{completed:false},results:[{day:1,date:1,accuracy:50}],reviews:[],palaces:[],majorSystem:[],pao:[],symbols:[],nameImages:[],missions:[],achievements:[]},{version:1,profile:{currentDay:6},firstSuccess:{completed:true,challengeTitle:'Planets'},results:[{day:2,date:2,accuracy:80}],reviews:[],palaces:[],majorSystem:[],pao:[],symbols:[],nameImages:[],missions:[],achievements:[]});
assert.equal(merged.profile.currentDay, 6);
assert.equal(merged.results.length, 2);
assert.equal(merged.firstSuccess.completed, true);

const duplicateReviewBase = {sessionDay:0,title:'First success: Planets',material:['A','B'],status:'active',nextReviewAt:0,createdAt:1,intervalIndex:0,strength:'weak'};
assert.equal(uniqueReviews([{...duplicateReviewBase,id:'a'},{...duplicateReviewBase,id:'b',createdAt:2,intervalIndex:1,strength:'growing'}]).length, 1, 'duplicate review cards should collapse to one logical review');

console.log('static regression checks ok');
