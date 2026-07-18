const KEY='memoryDojo.v1';
export const defaults={version:1,profile:{name:'',onboarded:false,mode:'standard',currentDay:1,currentBelt:'white',theme:'light',colorTheme:'dojo',uiStyle:'classic'},contract:{},palaces:[],majorSystem:[],pao:[],symbols:[],nameImages:[],results:[],reviews:[],missions:[],achievements:[],settings:{intervals:[20,1440,4320,10080,43200]}};
let state;
export function load(){try{state={...structuredClone(defaults),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{state=structuredClone(defaults)}return state}
export function get(){return state||load()}
export function save(patch){state={...get(),...patch};localStorage.setItem(KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('dojo:data'));return state}
export function update(fn){const copy=structuredClone(get());fn(copy);return save(copy)}
export function replace(data){if(!data||data.version!==1||!data.profile||!Array.isArray(data.results))throw Error('This is not a valid Memory Dojo v1 backup.');state=data;localStorage.setItem(KEY,JSON.stringify(data));return data}
export function reset(){localStorage.removeItem(KEY);state=structuredClone(defaults);return state}
