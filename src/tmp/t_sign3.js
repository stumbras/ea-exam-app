const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block'})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?drive&st=Texas',{waitUntil:'load'});await p.waitForTimeout(1800);
console.log('pics',await p.evaluate(()=>BP(12).filter(i=>i.t!=="f"&&signPic(i.s)).length));
await p.evaluate(()=>{const qs=Object.keys(SIGNQ);document.body.innerHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:4px;background:#fff">'+qs.map(q=>'<div style="font:9px sans-serif;text-align:center">'+signPic(q).replace(/width="120" height="120"/,'width="88" height="88"')+SIGNQ[q]+'</div>').join('')+'</div>'});
await p.screenshot({path:'tmp/s_grid2.png',fullPage:true});console.log('errs',JSON.stringify(errs));await b.close()})()
