import assert from 'node:assert/strict';
import {errorProfile,nextProgressAction,progressTrend,reviewHealth,techniquePerformance} from './js/analytics.js';

assert.deepEqual(progressTrend([]), {direction:'starting',change:0,label:'Building your baseline'});
assert.equal(progressTrend([{accuracy:40},{accuracy:45},{accuracy:50},{accuracy:75},{accuracy:80},{accuracy:85}]).direction, 'up');
assert.equal(progressTrend([{accuracy:80},{accuracy:82},{accuracy:78},{accuracy:79},{accuracy:80},{accuracy:81}]).direction, 'steady');
assert.equal(progressTrend([{accuracy:null},{accuracy:'bad'}]).label, 'Building your baseline', 'legacy scores should not produce NaN');

assert.deepEqual(techniquePerformance([
  {technique:'Link method',accuracy:70}, {technique:'Link method',accuracy:90},
  {technique:'Palace',accuracy:75}, {accuracy:50}
]), [
  {technique:'Link method',sessions:2,accuracy:80},
  {technique:'Palace',sessions:1,accuracy:75},
  {technique:'General practice',sessions:1,accuracy:50}
]);

const errors=errorProfile([{omitted:3,orderErrors:1,incorrect:2},{omitted:'2'}]);
assert.equal(errors.total, 8);
assert.equal(errors.leading.key, 'omitted');

const now=1_000;
const reviews=[
  {status:'active',nextReviewAt:500},
  {status:'active',nextReviewAt:1_500,reviewScore:80},
  {status:'retired',nextReviewAt:0,reviewScore:100}
];
assert.deepEqual(reviewHealth(reviews,now), {active:2,due:1,completed:2,delayedAccuracy:90});
assert.equal(nextProgressAction([],[],now).href, '#learn');
assert.equal(nextProgressAction([{accuracy:80}],reviews,now).href, '#reviews');
assert.equal(nextProgressAction([{accuracy:80,orderErrors:2}],[],now).href, '#train');

console.log('analytics checks ok');
