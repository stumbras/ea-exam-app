const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const errs=[];const p=await (await b.newContext({serviceWorkers:'block'})).newPage();p.on('pageerror',e=>errs.push(e.message.slice(0,150)));
await p.goto('http://localhost:8765/ea-exam-app/?study',{waitUntil:'load'});await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>[1,2,3].map(pt=>{const f=BANK.filter(i=>i.t==="f"&&i.p==pt);return pt+': facts '+f.length+' recorded '+f.filter(i=>REC[i.id]).length}).join(' | ')));
console.log('errs',JSON.stringify(errs));await b.close()})()
