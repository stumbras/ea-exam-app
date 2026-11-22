const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);await p.click('[data-sec="bk"]');await p.click('[data-mode="taxsim"]');
 for(const k of ['fs','ab','sd','en']){await p.click(`[data-tdr="${k}"]`);const n=await p.evaluate(k=>DRILL[k].q.length,k);
  for(let i=0;i<n;i++){const right=await p.evaluate(()=>DRILL[tv.dr].q[tv.dri][2]);await p.click(`[data-tdra="${right}"]`);if(i===2&&k==='ab')await p.screenshot({path:'drill.png',fullPage:true});await p.click('[data-tdrn]')}
  console.log(k,await p.evaluate(()=>document.querySelector('h2').innerText),await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await p.click('[data-tdr=""]')}
 console.log(await p.evaluate(()=>JSON.stringify(TD())));console.log('errors',errs);await b.close()})();
