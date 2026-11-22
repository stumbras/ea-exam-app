const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
for(const q of ['?course','?study']){const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,150)));
 await p.goto('http://localhost:8765/ea-exam-app/'+q);await p.waitForTimeout(1400);
 await p.evaluate(()=>{part=BK;view="taxsim";render()});await p.waitForTimeout(300);await p.evaluate(()=>scrollTo(0,3000));await p.waitForTimeout(300);
 const r=await p.evaluate(()=>{const g=document.querySelector('.bkback.go');const r=g.getBoundingClientRect();return{top:Math.round(r.top),h:Math.round(r.height),txt:g.innerText}});
 ok(q+' back bar stays on screen after scrolling 3000px: "'+r.txt+'" at y='+r.top+' h='+r.h,r.top>=0&&r.top<60&&r.h<50);
 await p.screenshot({path:'tmp/k_sticky'+(q==='?course'?'c':'s')+'.png'});
 await p.click('.bkback.go');await p.waitForTimeout(300);ok(q+' back goes to the main page: '+await p.evaluate(()=>view),await p.evaluate(()=>view)===(q==='?course'?'bkland':'home'));
 await p.evaluate(()=>{part=BK;filt=1;startSession("quiz",10)});await p.waitForTimeout(300);await p.click('.bkback.go');await p.waitForTimeout(300);ok(q+' back out of a quiz: '+await p.evaluate(()=>view+' sess='+(sess===null)),await p.evaluate(()=>sess===null&&view!=="session"));
 if(q==='?study'){await p.evaluate(()=>{part=1;view="home";render();document.querySelector('[data-tdrgo]:not([disabled])').click()});await p.waitForTimeout(300);const v0=await p.evaluate(()=>view);await p.click('.bkback.go');await p.waitForTimeout(300);ok('back out of a Quick decisions round ('+v0+' -> '+await p.evaluate(()=>view)+')',await p.evaluate(()=>view==="home"&&!tv.dr));
  await p.evaluate(()=>{view="lessons";render()});await p.waitForTimeout(200);await p.click('[data-sec="start"]');await p.waitForTimeout(300);ok('All sections works',await p.evaluate(()=>view==="start"))}
 console.log(errs);await p.close()}
await b.close()})();
