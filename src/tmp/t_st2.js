const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:400,height:860},isMobile:true,serviceWorkers:'block'})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
for(const st of ["Arkansas","New Mexico","Nebraska","North Dakota","Rhode Island","Vermont","West Virginia","Wyoming"]){await p.goto('http://localhost:8765/ea-exam-app/?drive&st='+encodeURIComponent(st),{waitUntil:'load'});await p.waitForTimeout(1600);
 console.log(st,await p.evaluate(()=>JSON.stringify({cur:drvState(),doms:Object.keys(PARTS[12].doms).join(","),bank:BP(12).length,stateQ:BP(12).filter(i=>i.d>2&&i.d!==20).length})))}
console.log('errs',JSON.stringify(errs));await b.close()})()
