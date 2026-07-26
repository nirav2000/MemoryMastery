import {get,update} from './storage.js?v=20260721-note-drawer'; import {uid} from './utils.js?v=20260721-note-drawer';
export const intervals=[20,1440,4320,10080,43200];
function normalisePart(value){return String(value||'').trim().replace(/\s+/g,' ').toLowerCase()}
export function reviewKey(r){const material=(r.material||[]).map(normalisePart).filter(Boolean).join('¦');return material||normalisePart(r.title)||String(r.id||'')}
function strongerReview(a,b){
  if(!a)return b;
  if((b.intervalIndex||0)!==(a.intervalIndex||0))return (b.intervalIndex||0)>(a.intervalIndex||0)?b:a;
  return (b.lastReviewAt||b.createdAt||0)>(a.lastReviewAt||a.createdAt||0)?b:a;
}
export function reviewFamilyKey(r){
  const title=normalisePart(r.title);
  if((r.sessionDay||0)===0 || title.startsWith('first success:')) return 'first-success';
  return reviewKey(r);
}
export function uniqueReviews(reviews){const byKey=new Map();reviews.forEach(r=>{const key=reviewFamilyKey(r);byKey.set(key,strongerReview(byKey.get(key),r))});return [...byKey.values()]}
export function cleanupReviews(){update(s=>{const active=(s.reviews||[]).filter(r=>r.status==='active');const keepers=new Set(uniqueReviews(active).map(r=>r.id));const now=Date.now();active.forEach(r=>{if(!keepers.has(r.id)){r.status='retired';r.duplicateRetiredAt=now;r.duplicateOf=reviewFamilyKey(r)}})})}
export function schedule(session,result){const now=Date.now();update(s=>{const incoming={id:uid(),sessionDay:session.day,title:session.title,material:session.material,answers:result.answers,createdAt:now,immediateScore:result.accuracy,intervalIndex:0,nextReviewAt:now+20*60000,lastReviewAt:null,reviewScore:null,strength:result.accuracy>=80?'growing':'weak',status:'active'};const key=reviewFamilyKey(incoming), existing=s.reviews.find(r=>r.status==='active'&&reviewFamilyKey(r)===key);if(existing){Object.assign(existing,{title:incoming.title,material:incoming.material,answers:incoming.answers,immediateScore:incoming.immediateScore,nextReviewAt:Math.min(existing.nextReviewAt||incoming.nextReviewAt,incoming.nextReviewAt),strength:strongerReview(existing,incoming).strength,status:'active'});return}s.reviews.push(incoming)})}
export const due=()=>uniqueReviews(get().reviews.filter(r=>r.status==='active'&&r.nextReviewAt<=Date.now()));
export function scoreReview(id,score){update(s=>{const r=s.reviews.find(x=>x.id===id);if(!r)return;r.reviewScore=score;r.lastReviewAt=Date.now();r.intervalIndex=score<60?Math.max(0,r.intervalIndex-1):Math.min(intervals.length-1,r.intervalIndex+1);r.nextReviewAt=Date.now()+intervals[r.intervalIndex]*60000;r.strength=score>=80?'strong':score>=60?'growing':'weak'})}
export function action(id,type){update(s=>{const r=s.reviews.find(x=>x.id===id);if(!r)return;if(type==='snooze')r.nextReviewAt=Date.now()+86400000;if(type==='retire')r.status='retired';if(type==='restart'){r.status='active';r.intervalIndex=0;r.nextReviewAt=Date.now()}})}
