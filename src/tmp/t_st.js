const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:1.5,isMobile:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
await p.goto('http://localhost:8765/ea-exam-app/?drive&st=New%20Jersey',{waitUntil:'load'});await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>document.querySelector('#drvcard div').textContent+' | '+Object.values(PARTS[12].doms).map(d=>d[0]).join(', ')),'errs',JSON.stringify(errs));
const q=await ctx.newPage();await q.setViewportSize({width:400,height:860});await q.goto('file:///home/claude/ea-app/pwa/company/free-practice-questions.html');await q.waitForTimeout(800);await q.screenshot({path:'tmp/s_hub.jpg',type:'jpeg',quality:60,clip:{x:0,y:0,width:400,height:1500},fullPage:true});
await b.close()})()
