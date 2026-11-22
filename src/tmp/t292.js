const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name=k.name||"Tomas";k.guided=false;k.hero={law:{n:6,c:6},af:{n:3,c:2}};persist();KV={scr:"home"};render()});await p.waitForTimeout(400);
console.log('rotation genius entries',await p.evaluate(()=>KROT.filter(x=>x[0]==="q:genius").length),'hero entries left',await p.evaluate(()=>KROT.filter(x=>KHEROIDS.has(x[4])).length),'heroes',await p.evaluate(()=>KHERO.length));
const el=await p.$('.kgenius');await el.scrollIntoViewIfNeeded();await el.screenshot({path:'tmp/gen1.png'});
await p.click('.kgq');await p.waitForTimeout(400);
console.log('quiz view',await p.evaluate(()=>KV.scr+" "+KV.cat+" | "+(KV.Q&&KV.Q.q).slice(0,60)+" hero:"+(KV.Q&&KV.Q.hero)));
// answer 5 questions right
for(let i=0;i<5;i++){const a=await p.evaluate(()=>KV.Q&&KV.Q.a);if(a==null)break;const btns=await p.$$('[data-kans],[data-ka],.kopt');await p.evaluate(a=>{const b=[...document.querySelectorAll('button')].find(x=>x.dataset.kans==String(a)||x.dataset.a==String(a)||x.dataset.ka==String(a));if(b)b.click()},a);await p.waitForTimeout(250);const nx=await p.$('[data-k="next"],[data-k="shownext"],[data-knext]');if(nx){await nx.click();await p.waitForTimeout(200)}}
console.log('after: scr',await p.evaluate(()=>KV.scr+" stage:"+KV.stage),'tickets',await p.evaluate(()=>KS().tix||KS().tickets||KS().coins));
// Pilot School Air Force quiz still works
await p.evaluate(()=>{KV={scr:"pschool"};render()});await p.waitForTimeout(300);await p.click('[data-kcat="af"]');await p.waitForTimeout(300);console.log('af quiz',await p.evaluate(()=>KV.scr+" "+KV.cat));
await p.evaluate(()=>{KV={scr:"show"};render()});await p.waitForTimeout(200);
console.log('errors',JSON.stringify(errs));await b.close()})();
