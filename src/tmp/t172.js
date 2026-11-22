const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);await p.click('[data-sec="ea"]');await p.waitForTimeout(200);
 const n=await p.$$('[data-tdrgo]');console.log('buttons',n.length);await p.click('[data-tdrgo="ab"]');await p.waitForTimeout(100);console.log(await p.evaluate(()=>document.querySelector('h2').innerText));
 await p.click('[data-tdr=""]');console.log(await p.evaluate(()=>view));console.log('errors',errs);await b.close()})();
