const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const errs=[];
const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:'block'})).newPage();p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?drive&st=Texas&ref=Abc123XYZ9',{waitUntil:'load'});await p.waitForTimeout(1800);
console.log('saved ref',await p.evaluate(()=>localStorage.getItem('slRef')));
const el=await p.$('#slrefer');console.log('card',!!el);if(el){await el.screenshot({path:'tmp/ref.png'})}
console.log('order',await p.$$eval('#view>section',x=>x.map(e=>e.id||e.className).slice(0,5).join(',')));
console.log('errs',JSON.stringify(errs));await b.close()})()
