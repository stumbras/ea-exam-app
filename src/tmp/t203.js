const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
for(const pt of [2,3]){await p.evaluate(x=>{part=x;view="home";filt="all";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()},pt);const btn=await p.$('[data-mode="calc"]');console.log(pt,'calc',btn?(await btn.innerText()).replace(/\n/g,' | ').slice(-30):'none');
 await btn.click();await p.waitForTimeout(300);console.log(pt,'view',await p.evaluate(()=>view),(await p.$eval('#view',e=>e.innerText)).slice(0,160).replace(/\n+/g,' | '))}
console.log('errors',JSON.stringify(errs));await b.close()})();
