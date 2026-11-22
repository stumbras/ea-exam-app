const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1800);await p.evaluate(()=>{OPEN.moremodes=true;render()});await p.click('[data-sec="ea"]').catch(()=>{});await p.click('[data-part="1"]').catch(()=>{});await p.waitForTimeout(200);
console.log(await p.evaluate(()=>[view,part,OPEN.moremodes,!!document.querySelector('#moremodes'),document.querySelector('#moremodes')&&document.querySelector('#moremodes').open,[...document.querySelectorAll('[data-mode="mix"]')].map(b=>b.offsetParent!==null)]));await b.close()})();
