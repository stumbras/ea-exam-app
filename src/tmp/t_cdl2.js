const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:1.5,isMobile:true,hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
const U=(process.argv[2]||'http://localhost:8765/ea-exam-app/')+'?cdl';
await p.goto(U,{waitUntil:'load'});await p.waitForTimeout(2500);
const info=()=>p.evaluate(()=>JSON.stringify({bank:BP(14).length,doms:Object.keys(PARTS[14].doms).join(","),sum:Object.values(Object.assign({},PARTS[14].doms)).reduce((a,x)=>a+x[1],0),card:!!document.getElementById("cdlcard")}));
console.log('default',await info());
await p.locator('.cdlend[value="10"]').check();await p.waitForTimeout(500);await p.locator('.cdlend[value="7"]').check();await p.waitForTimeout(500);console.log('hazmat+school bus',await info());
await p.selectOption('#cdlsel','Texas');await p.waitForTimeout(600);console.log('texas',await info(),'|',await p.evaluate(()=>document.querySelector('#cdlcard .muted:last-child').innerText.slice(0,90)));
await p.screenshot({path:'tmp/s_cdl_card.jpg',type:'jpeg',quality:55});
await p.locator('#cdlcard summary').click();await p.waitForTimeout(300);await p.selectOption('#cdlsel','Ohio');await p.waitForTimeout(600);console.log('ohio',await info());
await p.reload({waitUntil:'load'});await p.waitForTimeout(2500);console.log('after reload',await info());
await p.evaluate(()=>{xpDxStart(true)});await p.waitForTimeout(600);console.log('diagnostic',await p.evaluate(()=>JSON.stringify({view,n:sess&&sess.queue.length,doms:[...new Set(sess.queue.map(e=>BYID[e.id].d))].sort((a,b)=>a-b).join(",")})));
await p.goto(U,{waitUntil:'load'});await p.waitForTimeout(2000);
await p.locator('button',{hasText:/Mock exam|Practice test/}).first().click();await p.waitForTimeout(600);
const st=p.locator('button',{hasText:/^25|25 questions|Start/}).first();if(await st.count()){await st.click();await p.waitForTimeout(800);console.log('MOCK',await p.evaluate(()=>JSON.stringify({view,n:sess&&sess.queue&&sess.queue.length,doms:sess&&sess.queue?[...new Set(sess.queue.map(e=>BYID[e.id].d))].sort((a,b)=>a-b).join(","):""})))}
console.log('errs',JSON.stringify(errs));await b.close()})()
