const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);
console.log(await p.evaluate(()=>{const c={};BANK.forEach(i=>{c[i.p]=(c[i.p]||0)+1});const ids={};let dup=0;BANK.forEach(i=>{if(ids[i.id])dup++;ids[i.id]=1});return JSON.stringify(c)+' dup '+dup}));
console.log('errors',errs);await b.close()})();
