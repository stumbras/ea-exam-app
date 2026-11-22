const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,400)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,300))});
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;view="kids";KV={scr:"home"};render()});
await p.click('[data-k="fly"]');await p.waitForTimeout(400);
await p.click('[data-kflym="0"]');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>[KV.scr,!!document.querySelector('#kfly'),kFly&&kFly.t,kFly&&kFly.last]));
console.log('errors',JSON.stringify(errs));await b.close()})();
