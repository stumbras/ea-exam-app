const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const errs=[];
for(const [q,f] of [['?drive&st=Texas','drive'],['?cit','cit'],['?cdl','cdl']]){const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:'block'})).newPage();p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/'+q,{waitUntil:'load'});await p.waitForTimeout(1800);
const n=await p.$$eval('.slpromo',x=>x.map(a=>a.href.slice(0,90)));console.log(f,n.length,JSON.stringify(n));
const el=await p.$('#slpromo');if(el){await el.scrollIntoViewIfNeeded();await p.waitForTimeout(300);await el.screenshot({path:'tmp/pr_'+f+'.png'})}}
console.log('errs',JSON.stringify(errs));await b.close()})()
