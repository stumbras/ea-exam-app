// Dumps the facts with no exam-type question to /tmp/un_p{part}.json (used to write gap questions)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
for(const pt of [1,2,3]){const r=await p.evaluate(pt=>{part=pt;const F=BANK.filter(i=>i.p==pt&&i.t==="f"),Q=BANK.filter(i=>i.p==pt&&xaExam(i)),cov=new Set();Q.forEach(q=>{try{xaFactsFor(q).forEach(f=>cov.add(f.id))}catch(e){}});return F.filter(f=>!cov.has(f.id)).map(f=>({d:f.d,f:f.f,b:f.b}))},pt);fs.writeFileSync('/tmp/un_p'+pt+'.json',JSON.stringify(r));console.log('part',pt,'untested',r.length)}
await b.close()})();
