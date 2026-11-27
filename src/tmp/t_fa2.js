const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const k of ['cit','drive']){const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:2,isMobile:true,hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
 await p.goto('http://localhost:8765/ea-exam-app/?'+k,{waitUntil:'load'});await p.waitForTimeout(2000);
 await p.getByText('Tap here').click();await p.waitForTimeout(800);await p.screenshot({path:'tmp/fb_'+k+'1.jpg',type:'jpeg',quality:70});
 console.log(k,'after tap:',await p.evaluate(()=>JSON.stringify({view,mode:typeof sess!=='undefined'&&sess&&sess.mode})+' '+document.body.innerText.slice(0,260).replace(/\n+/g,' | ')));
 // try a mock test of the smallest size
 await p.evaluate(()=>{view='home';render()});await p.waitForTimeout(300);
 const mock=p.locator('button',{hasText:'Mock exam'}).first();await mock.click();await p.waitForTimeout(600);
 console.log('  mock screen:',await p.evaluate(()=>document.body.innerText.slice(0,420).replace(/\n+/g,' | ')));await p.screenshot({path:'tmp/fb_'+k+'2.jpg',type:'jpeg',quality:70});
 console.log('  errs',errs.slice(0,4));await ctx.close()}
await b.close()})()
