const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
for(const pt of [7,8]){await p.evaluate(x=>{part=x;view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()},pt);const l=await p.$('[data-mode="lessons"]');console.log(pt,'lessons btn',!!l);if(l){await l.click();await p.waitForTimeout(300);console.log(pt,(await p.$eval('#view',e=>e.innerText)).slice(0,500).replace(/\n+/g,' | '))}}
console.log('errors',JSON.stringify(errs));await b.close()})();
