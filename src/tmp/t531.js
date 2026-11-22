const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?course');await p.waitForTimeout(1600);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.bkl-plan button,.bkl-plan [data-bkl]')].map(x=>x.innerText.replace(/\s+/g,' ')+' ['+x.dataset.k+']').join(' | ')));
await p.evaluate(()=>{const x=[...document.querySelectorAll('[data-bkl="plan"]')].find(z=>/^cards/.test(z.dataset.k));x.click()});await p.waitForTimeout(400);
console.log('tap flashcards ->',await p.evaluate(()=>view+' '+(sess&&sess.mode)+' '+(sess&&[...new Set(sess.queue.map(q=>BYID[q.id].d))])));console.log(errs);await b.close()})();
