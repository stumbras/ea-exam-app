const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
// smart drill end to end: answer every question with option A, confirm calc items are MC and no errors
await p.evaluate(()=>{part=2;startSession("qd",10)});await p.waitForTimeout(200);
let calcs=0;for(let k=0;k<14;k++){const st=await p.evaluate(()=>view==="session"?{calc:!!sess.queue[sess.pos].calc,ph:sess.phase,cp:!!sess.cp}:null);if(!st)break;
 if(st.cp){await p.click('#cpgo');continue}
 if(st.calc)calcs++;
 if(st.ph==="ask"){const o=await p.$('.opt');if(o){await o.click();await p.waitForTimeout(60);const c=await p.$('[data-conf="1"]');if(c)await c.click()}else{const r=await p.$('#reveal');if(r)await r.click()}}
 await p.waitForTimeout(80);const n=await p.$('#next');if(n)await n.click();await p.waitForTimeout(80)}
console.log('calc items seen',calcs,'view',await p.evaluate(()=>view));
// mock exam includes calcs as MC?
await p.evaluate(()=>{part=1;startSession("mock",20)});await p.waitForTimeout(200);
console.log('mock calc entries',await p.evaluate(()=>sess.queue.filter(e=>e.calc).map(e=>e.calc.opts.length).join(",")));
console.log('errors',JSON.stringify(errs));await b.close()})();
