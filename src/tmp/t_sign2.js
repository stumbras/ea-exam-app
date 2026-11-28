const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:'block'})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?cdl',{waitUntil:'load'});await p.waitForTimeout(1800);await p.screenshot({path:'tmp/s_cdl.png',clip:{x:0,y:0,width:390,height:220}});
await p.goto('http://localhost:8765/ea-exam-app/?drive&st=Texas',{waitUntil:'load'});await p.waitForTimeout(1500);
const btn=await p.$('text=Tap here');if(btn){await btn.click();await p.waitForTimeout(1200)}
for(let i=0;i<8;i++){const has=await p.$('.signpic');if(has)break;const o=await p.$('#view .opt, #view button.opt');if(o){await o.click().catch(()=>{});await p.waitForTimeout(400)}const nx=await p.$('text=/Next|Continue|Got it/');if(nx){await nx.click().catch(()=>{});await p.waitForTimeout(500)}}
const qm=await p.$('#learned');if(qm){await qm.click();await p.waitForTimeout(900)}await p.screenshot({path:'tmp/s_q.png'});console.log('errs',JSON.stringify(errs));await b.close()})()
