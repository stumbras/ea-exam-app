const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>['ea','s65','edpna'].map(k=>k+':'+INTRO[k].rows.length+' '+INTRO[k].rows[INTRO[k].rows.length-1][0]).join(' | ')));
await p.click('[data-sec="s65"]');await p.waitForTimeout(300);console.log((await p.evaluate(()=>document.body.innerText)).includes('What people who passed say'));
console.log('errors',errs);await b.close()})();
