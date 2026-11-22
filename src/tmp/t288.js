const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,colorScheme:'dark'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,400)));
await p.goto('http://localhost:8765/ea-exam-app/?course&name=Cristy');await p.waitForTimeout(1500);
const t=await p.$('button:has-text("Dark")');if(t)await t.click();await p.waitForTimeout(300);
await p.evaluate(()=>window.scrollTo(0,900));await p.waitForTimeout(100);await p.screenshot({path:'tmp/dark1.png'});
await p.click('[data-bkl="tool"][data-k="jelab"]');await p.waitForTimeout(300);await p.screenshot({path:'tmp/dark2.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
