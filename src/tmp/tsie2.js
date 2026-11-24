const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({...devices['iPhone 13']})).newPage();p.on('pageerror',e=>console.log(e.stack.split('\n').slice(0,4).join(' / ')));
await p.goto('http://localhost:8765/ea-exam-app/?sie');await p.waitForTimeout(3000);await p.screenshot({path:'tmp/sie_home.png'});await b.close()})();
