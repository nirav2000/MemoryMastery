export function normalAnswer(value){
  return String(value||'').trim().toLowerCase().replace(/[^a-z0-9à-ÿ♠♥♣♦— -]/g,'').replace(/\s+/g,' ');
}

export function scoreOrderedRecall(expected, recalledText){
  const normalExpected=expected.map(normalAnswer);
  const entered=String(recalledText||'').split('\n').map(normalAnswer).slice(0,normalExpected.length);
  while(entered.length<normalExpected.length) entered.push('');
  let correct=0, orderErrors=0, omitted=0, incorrect=0;
  entered.forEach((value,index)=>{
    if(!value){omitted++;return}
    if(value===normalExpected[index]) correct++;
    else if(normalExpected.includes(value)) orderErrors++;
    else incorrect++;
  });
  return {answers:entered, correct, incorrect, omitted, orderErrors, accuracy:Math.round(correct/normalExpected.length*100)};
}

export function firstSuccessSession(challenge){
  return {
    day:0,
    title:`First success: ${challenge.title}`,
    material:challenge.material,
    materialType:'beginner challenge',
    technique:challenge.method,
    mission:'Use the same method on one small useful list today.'
  };
}
