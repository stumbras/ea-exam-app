const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const errs=[];const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:'block'})).newPage();p.on('pageerror',e=>errs.push(e.message.slice(0,150)));
await p.goto('http://localhost:8765/ea-exam-app/?study',{waitUntil:'load'});await p.waitForTimeout(1500);
for(const pt of [3,2]){await p.evaluate(x=>{part=x;view="home";render()},pt);await p.waitForTimeout(600);const c=await p.$('#eachartcard');console.log('card',pt,!!c);
 if(c){await c.screenshot({path:'tmp/chc'+pt+'.png'});await p.click('#eachartcard button');await p.waitForTimeout(500);await p.screenshot({path:'tmp/ch'+pt+'a.png'});await p.evaluate(()=>document.getElementById('eachartov').scrollTo(0,900));await p.waitForTimeout(200);await p.screenshot({path:'tmp/ch'+pt+'b.png'});await p.click('#eachartov button')}}
console.log('errs',JSON.stringify(errs));await b.close()})()
