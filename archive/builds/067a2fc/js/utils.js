export const $=(s,p=document)=>p.querySelector(s); export const $$=(s,p=document)=>[...p.querySelectorAll(s)];
export const escapeHTML=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export const uid=()=>crypto.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
export const mean=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):0;
export function download(name,text,type='application/json'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
export function toast(message){const t=$('#toast');t.textContent=message;t.style.display='block';setTimeout(()=>t.style.display='none',2800)}
export const formatDate=v=>new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(v));
