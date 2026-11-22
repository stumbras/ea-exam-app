const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await (await b.newContext()).newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>["Form 1040 and Form 1040-NR","Forms 1099-INT, 1099-DIV and W-2G","Form 8606; Schedule 8812; Form 4868","Forms 706 and 709, due in 2026","401(k) and 529 plan","§1231 and section 121","In 2025 the limit is $1,040 for 183 days","Form 2106 and Form 2441","1040/1041","Rev. Proc. 2019-38","Form 5500 and K-1","330 full days, 750 hours, 100 miles"].map(t=>t+"  =>  "+sayable(t)));
 console.log(r.join('\n'));
 console.log('audio question:',await p.evaluate(()=>audQ(BANK.find(i=>i.t==="f"&&/^Form 1040-NR$/.test(i.f)))));
 console.log('errors',errs);await b.close()})();
