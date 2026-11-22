const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=7;view="home";render()});await p.waitForTimeout(300);
console.log(await p.evaluate(()=>({cjh:!!document.querySelector('.cjh'),yr:(document.querySelector('.cjyr')||{}).innerText,h3:(document.querySelector('.xp h3')||{}).innerText})));
await p.click('.donext');await p.waitForTimeout(300);console.log(await p.evaluate(()=>({n:sess.queue.length,kinds:sess.queue.map(q=>BYID[q.id].p+BYID[q.id].t).join(','),size:S.set.size})));await b.close()})();
