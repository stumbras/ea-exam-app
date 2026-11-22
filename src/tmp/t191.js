// CAA section: start card, home, a 10-question mock, flashcards, no errors, phone width
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const W of [390,1280]){const p=await b.newPage({viewport:{width:W,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
await p.evaluate(()=>{view="start";render()});
const card=await p.$('[data-sec="caa"]');console.log(W,'card',!!card,card?(await card.innerText()).slice(0,160).replace(/\n/g,' | '):'');
await card.click();await p.waitForTimeout(400);
console.log(W,'title',await p.$eval('h1',e=>e.textContent).catch(()=>'?'),'part',await p.evaluate(()=>part));
const home=await p.$eval('#view',e=>e.innerText);console.log(W,'home has calc',/calculation trainer/.test(home),'len',home.length);
console.log(W,'counts',await p.evaluate(()=>{const q=BANK.filter(i=>i.p==7);return [q.filter(i=>i.t==="f").length,q.filter(i=>i.t==="q").length,Object.keys(PARTS[7].doms).map(d=>q.filter(i=>i.d==d).length).join('/')]}));
const m=await p.$('[data-mode="mock"]');if(m){await m.click();await p.waitForTimeout(200);const s10=await p.$('[data-mock="10"]');if(s10){await s10.click();await p.waitForTimeout(400);console.log(W,'mock view',await p.evaluate(()=>view),await p.$eval('#view',e=>e.innerText.slice(0,120).replace(/\n/g,' | ')))}}
const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);console.log(W,'overflow',ov,'errors',JSON.stringify(errs));await p.close()}
await b.close()})();
