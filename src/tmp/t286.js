const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,400)));
await p.goto('http://localhost:8765/ea-exam-app/?course&name=Cristy');await p.waitForTimeout(1500);
await p.click('[data-bkl="tool"][data-k="firm"]');await p.waitForTimeout(200);
await p.click('[data-firm="start"]');await p.waitForTimeout(200);
await p.screenshot({path:'tmp/firm1.png',fullPage:true});
// play: pick option index 1 first event, else best
let i=0;while(i<40){const has=await p.$('[data-firm="pick"]');if(!has)break;const k=await p.evaluate(()=>{const g=S.set.firm.g,E=FIRM[g.mi].ev[g.ei];return i0=E.o.findIndex(o=>o[2]===2)});
 await p.click(`[data-firm="pick"][data-k="${i===0?1:k}"]`);await p.waitForTimeout(80);if(i===0)await p.screenshot({path:'tmp/firm2.png',fullPage:true});await p.click('[data-firm="next"]');await p.waitForTimeout(60);i++}
await p.screenshot({path:'tmp/firm3.png',fullPage:true});
console.log('decisions',i,'score',await p.evaluate(()=>S.set.firm.best));
await p.click('[data-firm="exit"]');await p.waitForTimeout(200);console.log('back to',await p.evaluate(()=>view));
console.log('errors',JSON.stringify(errs));await b.close()})();
