const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
await p.evaluate(()=>{part=3;view="home";render()});const el=await p.$('[data-mode="w7"]');await el.scrollIntoViewIfNeeded();await p.waitForTimeout(200);await p.screenshot({path:'home3.png'});await b.close()})();
