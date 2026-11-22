const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,400)));
await p.goto('http://localhost:8765/ea-exam-app/?course&name=Cristy');await p.waitForTimeout(1800);
console.log('view',await p.evaluate(()=>view),'title',await p.title());
await p.screenshot({path:'tmp/land1.png'});await p.screenshot({path:'tmp/land_full.png',fullPage:true});
await p.click('[data-bkl="tool"][data-k="jelab"]');await p.waitForTimeout(300);
await p.screenshot({path:'tmp/jel1.png',fullPage:true});
// answer the entry correctly all the way
for(let k=0;k<4;k++){const right=await p.evaluate(()=>jel&&jel.phase==="q"?jel.ev.L[jel.li][0]:null);if(!right)break;await p.click(`[data-jel="pick"][data-a="${right.replace(/"/g,'\\"')}"]`);await p.waitForTimeout(150)}
await p.screenshot({path:'tmp/jel2.png',fullPage:true});
console.log('errors',JSON.stringify(errs));await b.close()})();
