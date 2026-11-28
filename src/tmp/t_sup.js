const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const errs=[];
for(const [q,f] of [['?drive&st=Texas','drive'],['?cit','cit']]){const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:'block'})).newPage();p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/'+q,{waitUntil:'load'});await p.waitForTimeout(1800);
const el=await p.$('#slsupport');console.log(f,!!el);if(el){await el.screenshot({path:'tmp/sup_'+f+'.png'})}
await p.screenshot({path:'tmp/sup_full_'+f+'.png'});
const ch=await p.evaluate(()=>slCheer(85).length);console.log('cheer html',ch)}
console.log('errs',JSON.stringify(errs));await b.close()})()
