const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:1.5,isMobile:true,hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
await p.goto('http://localhost:8765/ea-exam-app/?drive',{waitUntil:'load'});await p.waitForTimeout(2200);
const il=await p.evaluate(()=>[...document.querySelectorAll('#drvsel option')].find(o=>o.textContent==='Illinois').value);
await p.selectOption('#drvsel',il);await p.waitForTimeout(700);await p.check('#drvmoto');await p.waitForTimeout(700);
console.log('HOME',await p.evaluate(()=>document.getElementById('view').innerText.replace(/\n+/g,' | ').slice(0,900)));
await p.screenshot({path:'tmp/s_state.jpg',type:'jpeg',quality:65,fullPage:true});
console.log('doms',await p.evaluate(()=>JSON.stringify(Object.entries(PARTS[12].doms))+' bank '+BP(12).length));
// practice test 25
await p.locator('button',{hasText:/Practice test|Mock exam/}).first().click();await p.waitForTimeout(600);
console.log('MOCK',await p.evaluate(()=>document.getElementById('view').innerText.replace(/\n+/g,' | ').slice(0,500)));
const start=p.locator('button',{hasText:/^25|25 questions|Start/}).first();if(await start.count()){await start.click();await p.waitForTimeout(800);
 console.log('IN MOCK',await p.evaluate(()=>JSON.stringify({view,mode:sess&&sess.mode,n:sess&&sess.queue&&sess.queue.length,doms:sess&&sess.queue?[...new Set(sess.queue.map(x=>(x.it||x).d))]:0})));
 console.log(await p.evaluate(()=>document.getElementById('view').innerText.replace(/\n+/g,' | ').slice(0,400)));await p.screenshot({path:'tmp/s_mockq.jpg',type:'jpeg',quality:65})}
// reload: persists
await p.reload({waitUntil:'load'});await p.waitForTimeout(2000);console.log('after reload',await p.evaluate(()=>document.querySelector('#drvcard div').textContent+' / '+Object.keys(PARTS[12].doms)));
console.log('errs',JSON.stringify(errs));await b.close()})()
