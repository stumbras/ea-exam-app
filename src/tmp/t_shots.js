const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const k of ['drive','cit','moto']){const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:1.5,isMobile:true,hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();
 await p.goto('http://localhost:8765/ea-exam-app/?'+k,{waitUntil:'load'});await p.waitForTimeout(2500);
 await p.screenshot({path:'tmp/s_'+k+'_home.jpg',type:'jpeg',quality:65,fullPage:true});
 console.log(k,'HOME TEXT:',await p.evaluate(()=>document.body.innerText.replace(/\n+/g,' | ').slice(0,1500)));
 await p.getByText('Tap here').click();await p.waitForTimeout(900);await p.screenshot({path:'tmp/s_'+k+'_q.jpg',type:'jpeg',quality:65});
 await ctx.close()}
await b.close()})()
