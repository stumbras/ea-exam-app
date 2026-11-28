const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:400,height:860},isMobile:true,hasTouch:true,serviceWorkers:'block'})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?cdl',{waitUntil:'load'});await p.waitForTimeout(2500);
await p.locator('#cdlpre').click();await p.waitForTimeout(1500);
const f=p.frameLocator('#cdlpreov iframe');console.log('overlay',await p.locator('#cdlpreov').count(),'items',await f.locator('input[type=checkbox]').count(),'h1',await f.locator('h1').innerText(),'backlink inside',await f.locator('a[href="./?cdl"]').count());
await p.screenshot({path:'tmp/s_pre.jpg',type:'jpeg',quality:55});
await p.locator('#cdlpreov button').first().click();await p.waitForTimeout(300);console.log('closed',await p.locator('#cdlpreov').count()===0,'errs',JSON.stringify(errs));await b.close()})()
