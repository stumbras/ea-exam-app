const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>({doms:PARTS[7].doms,P:{name:PARTS[7].name,short:PARTS[7].short,x:PARTS[7].x},units:(UNITS[7]||[]).map(u=>'## '+u.t+'\n'+u.s.map(s=>' # '+s.h+'\n   '+(s.b||[]).join('\n   ')+(s.v?'\n   V:'+JSON.stringify(s.v).slice(0,600):'')+(s.ex?'\n   EX:'+s.ex:'')).join('\n')),facts:BANK.filter(i=>i.p==7&&i.t==="f").sort((a,b)=>a.d-b.d).map(i=>'d'+i.d+' '+i.f+': '+i.b)}));
console.log(JSON.stringify(r.P),JSON.stringify(r.doms));console.log(r.units.join('\n'));console.log('\nFACTS\n'+r.facts.join('\n'));await b.close()})();
