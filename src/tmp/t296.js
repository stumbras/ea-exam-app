const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.guided=false;k.tix=3;persist();KV={scr:"home"};render()});await p.waitForTimeout(400);
console.log('home height',await p.evaluate(()=>document.body.scrollHeight),'drive buttons on home',await p.evaluate(()=>document.querySelectorAll('#view [data-k="drive"]').length));
await p.click('.ktwban');await p.waitForTimeout(300);await p.screenshot({path:'tmp/twg.png'});
for(const sel of ['[data-ktw="hack"]','[data-k="drive"]']){await p.evaluate(()=>{KV={scr:"tworld",co:null};render()});await p.waitForTimeout(200);await p.click(sel);await p.waitForTimeout(400);console.log(sel,'→',await p.evaluate(()=>KV.scr+(typeof T!=="undefined"&&T&&T.os?" os:"+T.os:"")),await p.evaluate(()=>document.querySelector('#view').innerText.replace(/\s+/g," ").slice(0,90)))}
console.log('errors',JSON.stringify(errs));await b.close()})();
