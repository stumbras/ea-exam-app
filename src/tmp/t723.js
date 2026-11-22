const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
for(const k of process.argv.slice(2)){const r=await p.evaluate(async k=>{const j=await (await fetch('forms/'+k+'.json')).json();const seen=new Set(),o=[];j.f.forEach(f=>{const t=fvClean(f[6]);if(seen.has(t))return;seen.add(t);const m=t.match(/(?:^|[ .])(\d{1,2}[a-z]?|[A-Z])\. [^.]*\.?(?: [^.]*\.)?$/);o.push((m?m[1]:t.slice(-14))+'='+fxRule(k,f[6]).split(' ').slice(0,3).join(' '))});return [...new Set(o)]},k);
console.log(k+': '+r.join(' | '))}await b.close()})();
