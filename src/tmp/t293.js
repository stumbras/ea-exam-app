const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";persist();KV={scr:"home"};render()});await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const b=document.querySelector('[data-k="tworld"]');if(!b)return "NO BUTTON";const y=b.getBoundingClientRect().top+scrollY;return "button at y="+Math.round(y)+" of page height "+document.body.scrollHeight+" | blocks before it: "+[...document.querySelectorAll('#view .kids > *')].findIndex(x=>x.contains(b))+" of "+document.querySelectorAll('#view .kids > *').length});
console.log(r);
console.log('version label',await p.evaluate(()=>(document.body.innerText.match(/Version \d+[^\n]*/)||[""])[0]));
console.log('errors',JSON.stringify(errs));await b.close()})();
