const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/company/texas-permit-practice-test.html',{waitUntil:'load'});await p.waitForTimeout(800);
console.log('cards',await p.$$eval('#signgal details',x=>x.length));await p.click('#signgal details summary');
const g=await p.$('#signgal');await g.scrollIntoViewIfNeeded();await p.screenshot({path:'tmp/gal.png'});
const t=await p.$('.sltop');await t.screenshot({path:'tmp/top.png'});console.log('errs',JSON.stringify(errs));await b.close()})()
