const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:375,height:667},hasTouch:true,isMobile:true,deviceScaleFactor:2});const p=await ctx.newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(400);
await p.screenshot({path:'tmp/g_home_aud.png'});
await (await p.$('[data-xa="aud10"]')).tap();await p.waitForTimeout(900);
await p.screenshot({path:'tmp/g_aud_play.png'});
await b.close()})();
