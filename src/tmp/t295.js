const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";persist();KV={scr:"home"};render()});await p.waitForTimeout(400);
console.log(await p.evaluate(()=>{const b=document.querySelectorAll('[data-k="tworld"]');return b.length+" button(s), first at y="+Math.round(b[0].getBoundingClientRect().top+scrollY)}));
await p.evaluate(()=>window.scrollTo(0,250));await p.waitForTimeout(200);await p.screenshot({path:'tmp/twb.png'});
await p.click('.ktwban');await p.waitForTimeout(300);console.log('opens',await p.evaluate(()=>KV.scr));
console.log('errors',JSON.stringify(errs));await b.close()})();
