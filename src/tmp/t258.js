const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);await p.screenshot({path:'k29ea.png'});
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=true;k.name="Alex";view="kids";KV={scr:"home"};render()});await p.waitForTimeout(400);
console.log(await p.evaluate(()=>[!!document.querySelector('[data-k="fly"]'),!!document.querySelector('[data-k="city"]'),!!document.querySelector('[data-kcat="bee"]'),document.title]));
console.log('errors',JSON.stringify(errs));await b.close()})();
