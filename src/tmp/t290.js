const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1800);
const info=await p.evaluate(()=>{const m=kMust();const other=["chess","poker","mj","music","city","drive"].find(x=>x!==m&&kPlayKey({k:x}));return {m,other}});console.log(info);
// tap a non-step-1 activity via a fake button
await p.evaluate(o=>{const fb=document.createElement("button");fb.dataset.k=o.other;kidsClick(fb)},info);await p.waitForTimeout(300);
console.log('overlay shown',!!await p.$('.kpassov'),await p.evaluate(()=>document.querySelector('.kpassov')?.innerText.replace(/\n+/g," | ")));
await p.click('[data-kpass="use"]');await p.waitForTimeout(400);
console.log('after pass: view',await p.evaluate(()=>KV.v||KV.view||JSON.stringify(Object.keys(KV)).slice(0,80)),'passes',await p.evaluate(()=>KS().pass),'mins',await p.evaluate(()=>Math.round(kPassLeft()/60000)));
console.log('gate during pass blocks?',await p.evaluate(o=>kGate({k:o.other}),info));
await p.evaluate(()=>{KS().passUntil=0});console.log('gate after expiry blocks?',await p.evaluate(o=>{const r=kGate({k:o.other});document.querySelectorAll('.kpassov').forEach(x=>x.remove());return r},info));
console.log('errors',JSON.stringify(errs));await b.close()})();
