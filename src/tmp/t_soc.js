const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const errs=[];
for(const q of ['','?study','?s65','?cdl','?drive&st=Texas','?cit','?sie']){const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:'block'})).newPage();p.on('pageerror',e=>errs.push(e.message.slice(0,150)));
await p.goto('http://localhost:8765/ea-exam-app/'+q,{waitUntil:'load'});await p.waitForTimeout(1600);const n=await p.$$eval('#slsoc a',x=>x.length);console.log(q||'start',n);
if(q==='?s65'){const e=await p.$('#slsoc');if(e)await e.screenshot({path:'tmp/soc.png'})}}
console.log('errs',JSON.stringify(errs));await b.close()})()
