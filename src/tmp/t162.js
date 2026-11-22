const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);
console.log(await p.evaluate(()=>{const ids={},out=[];BANK.forEach(i=>{if(ids[i.id])out.push(i.p+': '+(i.s||i.f).slice(0,90)+' || '+(ids[i.id].s||ids[i.id].f).slice(0,90));else ids[i.id]=i});return out.join('\n')}));await b.close()})();
