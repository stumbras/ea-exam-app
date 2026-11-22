const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
p.on('pageerror',e=>console.log('PAGEERROR '+e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const ks=process.argv.slice(2);
for(const k of ks){const r=await p.evaluate(async k=>{const j=await (await fetch('forms/'+k+'.json')).json();const miss=[];let n=0;j.f.forEach(f=>{if(fxRule(k,f[6]))n++;else{const t=fvClean(f[6]).slice(-60);if(!miss.includes(t))miss.push(t)}});return{n,tot:j.f.length,miss}},k);
  console.log((r.miss.length?'FAIL ':'PASS ')+k+': '+r.n+' of '+r.tot+' boxes have a written explanation'+(r.miss.length?' | missing: '+r.miss.join(' | '):''))}
await b.close()})();
