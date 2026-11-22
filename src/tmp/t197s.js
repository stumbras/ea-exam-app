const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:1100}});
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
await p.evaluate(()=>{part=7;view="w7";w7Go(2);render()});await p.click('[data-w7a="0"]');await p.click('#w7next');await p.click('[data-w7a="2"]');
await p.screenshot({path:'w7shot.png',fullPage:false});await b.close()})();
