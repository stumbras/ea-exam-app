const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
 for(const [w,h] of [[390,844],[1280,900]]){const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);await p.click('[data-sec="bk"]');await p.click('[data-mode="qbo"]');await p.click('[data-qtab="jobs"]');await p.waitForTimeout(150);
 if(w===390)await p.screenshot({path:'jobs-list.png',fullPage:true});
 const ids=await p.evaluate(()=>QJOBS.map(j=>j.id));let wide=[];
 for(const id of ids){await p.click(`[data-qj="${id}"]`);await p.waitForTimeout(40);
  for(let k=0;k<8;k++){const qa=await p.$('[data-qja]:not([disabled])');if(qa){await p.click('[data-qja="0"]');await p.waitForTimeout(30)}
   if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))wide.push(id+k);
   if(w===390&&((id==='dep'&&k===2)||(id==='split'&&k===1)||(id==='ccrec'&&k===1)||(id==='fuel'&&k===0)))await p.screenshot({path:`job-${id}-${k}.png`,fullPage:true});
   const nx=await p.$('[data-qjs]:not([disabled]).pri');if(!nx)break;await nx.click();await p.waitForTimeout(30)}
  if(w===390&&id==='payroll')await p.screenshot({path:'job-end.png',fullPage:true});
  await p.click('[data-qjdone]');await p.waitForTimeout(30)}
 console.log(w,'wide',wide,'done',await p.evaluate(()=>Object.keys(QS().jobs).length));await p.close()}
 console.log('errors',errs);await b.close()})();
