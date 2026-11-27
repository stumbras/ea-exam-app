const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:1.5,isMobile:true,hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
const U=process.argv[2]||'http://localhost:8765/ea-exam-app/';
await p.goto(U+'?cdl',{waitUntil:'load'});await p.waitForTimeout(2500);
console.log('title',await p.title(),'| bank',await p.evaluate(()=>BP(14).length+' doms '+Object.keys(PARTS[14].doms).length+' app '+SLAPP()+' free '+!!PARTS[14].free+' acKids '+(typeof acKids==='function'?acKids():'na')));
await p.screenshot({path:'tmp/s_cdl_home.jpg',type:'jpeg',quality:60});
await p.getByText('Tap here').click();await p.waitForTimeout(900);console.log('STEP',await p.evaluate(()=>document.getElementById('view').innerText.replace(/\n+/g,' | ').slice(0,260)));
await p.goto(U+'?cdl',{waitUntil:'load'});await p.waitForTimeout(2000);
await p.locator('button',{hasText:/Mock exam|Practice test/}).first().click();await p.waitForTimeout(600);
const st=p.locator('button',{hasText:/^25|25 questions|Start/}).first();if(await st.count()){await st.click();await p.waitForTimeout(800);console.log('MOCK',await p.evaluate(()=>JSON.stringify({view,n:sess&&sess.queue&&sess.queue.length,doms:sess&&sess.queue?[...new Set(sess.queue.map(x=>(x.it||x).d))].sort():0})));await p.screenshot({path:'tmp/s_cdl_q.jpg',type:'jpeg',quality:60})}
console.log('errs',JSON.stringify(errs));await b.close()})()
