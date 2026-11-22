const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const W of [390,1280]){const p=await b.newPage({viewport:{width:W,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);let ov=false;
for(const pt of [1,2,3]){await p.evaluate(x=>{part=x;view="home";filt="all";render()},pt);const btn=await p.$('[data-mode="w7"]');console.log(W,pt,'button',btn?(await btn.innerText()).replace(/\n/g,' | ').slice(0,70):'none');if(!btn)continue;
 await btn.click();await p.waitForTimeout(150);const n=await p.evaluate(()=>w7Cases().length);
 for(let c=0;c<n;c++){await p.evaluate(k=>{w7Go(k);render()},c);const steps=await p.evaluate(k=>w7Cases()[k].s.length,c);for(let i=0;i<steps;i++){await p.click(`[data-w7a="${i%2}"]`);if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))ov=true;await p.click('#w7next')}}
 console.log(W,pt,'best',JSON.stringify(await p.evaluate(x=>Object.fromEntries(Object.entries(S.w7b||{}).filter(([k])=>k.startsWith(x+"-"))),pt)))}
console.log(W,'overflow',ov,'errors',JSON.stringify(errs));await p.close()}await b.close()})();
