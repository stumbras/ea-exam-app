const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const k=process.argv[2];const r=await p.evaluate(async k=>{const j=await (await fetch('forms/'+k+'.json')).json();const seen=new Set(),o=[];j.f.forEach(f=>{const t=fvClean(f[6]);if(seen.has(t))return;seen.add(t);o.push(t.slice(-34)+' => '+fxRule(k,f[6]).slice(0,38))});return o},k);
console.log(r.join('\n'));await b.close()})();
