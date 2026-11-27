const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const k of ['citizenship/','driving/','motorcycle/','sie/']){const ctx=await b.newContext({viewport:{width:400,height:860},isMobile:true,hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
 await p.goto('https://study.solvinglifewith.com/'+k,{waitUntil:'load'});await p.waitForTimeout(6000);
 const r=await p.evaluate(()=>({h1:document.querySelector('h1').textContent,walltxt:(document.body.innerText.match(/[^|\n]{0,40}(free preview|Sign in to start|full access)[^|\n]{0,40}/i)||[''])[0]}));
 console.log(k,JSON.stringify(r),errs.slice(0,2));if(k==='citizenship/')await p.screenshot({path:'tmp/live_cit.jpg',type:'jpeg',quality:70});await ctx.close()}
await b.close()})()
