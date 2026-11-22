// How many facts are never tested by an exam-type question? (the app teaches facts; Quick 10 uses exam questions only)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>[1,2,3].map(pt=>{part=pt;const F=BANK.filter(i=>i.p==pt&&i.t==="f"),Q=BANK.filter(i=>i.p==pt&&xaExam(i)),cov=new Set();Q.forEach(q=>{try{xaFactsFor(q).forEach(f=>cov.add(f.id))}catch(e){}});
  const un=F.filter(f=>!cov.has(f.id)),byD={};F.forEach(f=>{const d=byD[f.d]=byD[f.d]||[0,0];d[1]++;if(!cov.has(f.id))d[0]++});
  return{part:pt,facts:F.length,examQs:Q.length,untested:un.length,byTopic:Object.keys(byD).map(d=>PARTS[pt].doms[d][0].slice(0,14)+" "+byD[d][0]+"/"+byD[d][1]).join(" | "),sample:pt===1?un.filter((x,i)=>i%23===0).slice(0,12).map(f=>f.f.slice(0,60)):undefined}}));
r.forEach(x=>console.log(JSON.stringify(x)));await b.close()})();
