const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:375,height:667},hasTouch:true,isMobile:true});const p=await ctx.newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=1;view="home";render();document.querySelector('.xaquick').click()});await p.waitForTimeout(300);
console.log(await p.evaluate(()=>document.querySelector('.sesshead').outerHTML.slice(0,700)));
console.log(await p.evaluate(()=>{const c=document.querySelector('#view .card');return c.innerHTML.slice(0,900)}));
await b.close()})();
