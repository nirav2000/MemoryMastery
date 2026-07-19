const KEY='memoryDojo.v1';
export const defaults={version:1,profile:{name:'',onboarded:false,mode:'standard',currentDay:1,currentBelt:'white',theme:'light',colorTheme:'pastelPaper',uiStyle:'smartpaper'},firstSuccess:{completed:false},contract:{},palaces:[],majorSystem:[],pao:[],symbols:[],nameImages:[],results:[],reviews:[],missions:[],achievements:[],settings:{intervals:[20,1440,4320,10080,43200]}};
let state;
export function load(){try{state={...structuredClone(defaults),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{state=structuredClone(defaults)}return state}
export function get(){return state||load()}
export function save(patch){state={...get(),...patch};localStorage.setItem(KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('dojo:data'));return state}
export function update(fn){const copy=structuredClone(get());fn(copy);return save(copy)}
export function replace(data){if(!data||data.version!==1||!data.profile||!Array.isArray(data.results))throw Error('This is not a valid Memory Dojo v1 backup.');state=data;localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new CustomEvent('dojo:data'));return data}
function mergeByKey(a=[],b=[],keyFn=x=>x.id||`${x.day||''}:${x.date||''}:${x.title||x.text||x.name||x.concept||''}`){const map=new Map();[...a,...b].filter(Boolean).forEach(item=>map.set(keyFn(item),{...map.get(keyFn(item)),...item}));return [...map.values()]}
export function mergeBackups(localData, cloudData){
  const local=localData&&localData.version===1?localData:structuredClone(defaults), cloud=cloudData&&cloudData.version===1?cloudData:structuredClone(defaults);
  return {...structuredClone(defaults),...cloud,...local,profile:{...cloud.profile,...local.profile,currentDay:Math.max(cloud.profile?.currentDay||1,local.profile?.currentDay||1)},firstSuccess:(local.firstSuccess?.completed?local.firstSuccess:cloud.firstSuccess)||{completed:false},palaces:mergeByKey(cloud.palaces,local.palaces,x=>x.id||x.name),majorSystem:local.majorSystem?.length?local.majorSystem:cloud.majorSystem||[],pao:mergeByKey(cloud.pao,local.pao),symbols:mergeByKey(cloud.symbols,local.symbols,x=>x.id||x.concept||x.image),nameImages:mergeByKey(cloud.nameImages,local.nameImages,x=>x.id||x.Name||x.name),results:mergeByKey(cloud.results,local.results),reviews:mergeByKey(cloud.reviews,local.reviews),missions:mergeByKey(cloud.missions,local.missions),achievements:mergeByKey(cloud.achievements,local.achievements)}
}
export function reset(){localStorage.removeItem(KEY);state=structuredClone(defaults);return state}
