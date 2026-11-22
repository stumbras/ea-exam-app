// W-7 practice: open from the CAA home, play every case (alternating right and wrong picks), check form panel, scores, no errors, no overflow
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const W of [390,1280]){const p=await b.newPage({viewport:{width:W,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
await p.evaluate(()=>{view="start";render()});await (await p.$('[data-sec="s65"]')).click();await p.waitForTimeout(300);
const btn=await p.$('[data-mode="w7"]');console.log(W,'w7 button',!!btn,btn?(await btn.innerText()).replace(/\n/g,' | ').slice(0,90):'');
await btn.click();await p.waitForTimeout(200);console.log(W,'view',await p.evaluate(()=>view),'cases',await p.$$eval('[data-w7]',x=>x.length));
const n=await p.evaluate(()=>w7Cases().length);let ov=false;
for(let c=0;c<n;c++){await p.evaluate(k=>{w7Go(k);render()},c);const steps=await p.evaluate(k=>w7Cases()[k].s.length,c);
  for(let i=0;i<steps;i++){const pick=(i%3===1)?1:0;await p.click(`[data-w7a="${pick}"]`);if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))ov=true;await p.click('#w7next')}
  const t=await p.$eval('#view h2',e=>e.textContent);if(c<2||W===1280&&c===n-1)console.log(W,'done',t)}
console.log(W,'best',JSON.stringify(await p.evaluate(()=>S.w7b)));
await p.click('#w7list');await p.click('#w7home');console.log(W,'back home',await p.evaluate(()=>view+' '+part));
console.log(W,'overflow',ov,'errors',JSON.stringify(errs));await p.close()}
await b.close()})();
