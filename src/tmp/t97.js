const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);await p.evaluate(()=>window.scrollTo(0,520));await p.screenshot({path:'home-mid.png'});
 await p.click('[data-mode="mix"]');await p.waitForTimeout(250);await p.screenshot({path:'mix-card.png'});console.log(errs);await b.close()})();
