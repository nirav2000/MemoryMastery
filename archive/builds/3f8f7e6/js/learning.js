export function normalAnswer(value){
  return String(value||'').trim().toLowerCase().replace(/[^a-z0-9à-ÿ♠♥♣♦— -]/g,'').replace(/\s+/g,' ');
}

export function scoreOrderedRecall(expected, recalledText){
  const entered=String(recalledText||'').split('\n').map(normalAnswer).filter(Boolean);
  const normalExpected=expected.map(normalAnswer);
  let correct=0, orderErrors=0;
  entered.forEach((value,index)=>{
    if(value===normalExpected[index]) correct++;
    else if(normalExpected.includes(value)) orderErrors++;
  });
  const incorrect=entered.filter(value=>!normalExpected.includes(value)).length;
  const omitted=Math.max(0,normalExpected.length-entered.length);
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
