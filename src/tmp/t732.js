const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>[1,2,3].map(pt=>{const Q=BANK.filter(i=>i.p==pt&&i.t==="q"&&i.opts&&i.opts.length===4),avg=o=>o.reduce((s,x)=>s+String(x).length,0)/o.length,named=i=>/^[A-Z][a-z]+(,| and [A-Z][a-z]+| is | was | has | had | owns | sold | lent | received | paid | made | uses | delivers )/.test(i.s)||/\b(Mr\.|Ms\.|Mrs\.)/.test(i.s);
  const vig=Q.filter(i=>i.s.length>=220&&named(i)),sent=Q.filter(i=>avg(i.opts)>=45),both=Q.filter(i=>i.s.length>=220&&named(i)&&avg(i.opts)>=45),not=Q.filter(i=>/\bNOT\b|EXCEPT/.test(i.s)),byD={};both.forEach(i=>{byD[i.d]=(byD[i.d]||0)+1});
  return{part:pt,total:Q.length,long_named_story:vig.length,sentence_choices:sent.length,story_and_sentence_choices:both.length,byTopic:byD,not_except:not.length,medianStem:Q.map(i=>i.s.length).sort((a,b)=>a-b)[Q.length>>1]}}))));
await b.close()})();
