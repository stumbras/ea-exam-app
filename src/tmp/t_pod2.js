const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:400,height:860},isMobile:true,hasTouch:true,serviceWorkers:'block'})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?study',{waitUntil:'load'});await p.waitForTimeout(2500);
for(const pt of [3,2,1]){await p.evaluate(x=>{part=x;view="home";render()},pt);await p.waitForTimeout(400);await p.locator('#podbtn').click();await p.waitForTimeout(2500);
console.log('part',pt,await p.evaluate(()=>JSON.stringify({heads:[...document.querySelectorAll('#podlist > div[style*="800"]')].map(d=>d.textContent),first:(document.querySelector('#podlist .small b')||{}).textContent,n:document.querySelectorAll('#podlist audio').length})))}
console.log('errs',JSON.stringify(errs));await b.close()})()
