const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=1;const g=GENS.find(x=>x.id==="ge1-rental");newSess("qd",[g]);sess.title="Quick 10 · exam questions"});await p.waitForTimeout(150);await p.screenshot({path:'tmp/v_calc1.png'});
await p.evaluate(()=>{const s=sess,cur=s.queue[0],V=view4(cur,BYID[cur.id]);[...document.querySelectorAll('.opt')].find(x=>+x.dataset.opt!==V.ans).click()});await p.waitForTimeout(150);await p.evaluate(()=>document.querySelector('[data-xa="how"]').click());await p.waitForTimeout(150);await p.screenshot({path:'tmp/v_calc2.png',fullPage:true});
await p.evaluate(()=>{clearInterval(timerId);sess=null;part=3;const q=BYID["p3qh2m4hf"];newSess("quiz",[q]);const V=view4(sess.queue[0],q);[...document.querySelectorAll('.opt')].find(x=>+x.dataset.opt!==V.ans).click();document.querySelector('[data-xa="how"]').click()});await p.waitForTimeout(150);await p.screenshot({path:'tmp/v_how.png',fullPage:true});
await b.close()})();
