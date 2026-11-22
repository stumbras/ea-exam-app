const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
for(const pt of [2,3]){const r=await p.evaluate(pt=>({units:(UNITS[pt]||[]).map(u=>u.t+' ['+u.s.length+'] :: '+u.s.map(s=>s.h).join(' / ')+' :: re='+String(u.re).slice(0,80)),doms:PARTS[pt].doms,facts:BANK.filter(i=>i.p==pt&&i.t==="f").sort((a,b)=>a.d-b.d||ORDER[a.id]-ORDER[b.id]).map(i=>'d'+i.d+' '+i.f+': '+i.b)}),pt);
 console.log('PART',pt,JSON.stringify(r.doms));console.log(r.units.join('\n'));fs.writeFileSync('/tmp/f'+pt+'.txt',r.facts.join('\n'));console.log('facts',r.facts.length,fs.statSync('/tmp/f'+pt+'.txt').size)}
await b.close()})();
