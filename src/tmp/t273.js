const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=4;view="kids";KV={scr:"home"};render()});
await p.click('[data-k="pschool"]');await p.waitForTimeout(300);await p.screenshot({path:'k41hub.png',fullPage:true});
for(const sel of ['[data-k="fly"]','[data-k="land"]','[data-k="msnBuild"]']){await p.evaluate(()=>{KV={scr:"pschool"};render()});await p.click(sel);await p.waitForTimeout(300);console.log(sel,await p.evaluate(()=>KV.scr+' '+(document.querySelector('.ktop b')||{}).innerText));await p.click('.ktop button');await p.waitForTimeout(200);console.log(' back ->',await p.evaluate(()=>KV.scr||'home'))}
console.log('errors',JSON.stringify(errs));await b.close()})();
