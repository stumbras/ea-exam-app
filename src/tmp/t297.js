const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";persist();KV={scr:"home"};render()});await p.waitForTimeout(400);
await p.screenshot({path:'tmp/khome.png',fullPage:true});
console.log(await p.evaluate(()=>[...document.querySelectorAll('#view .kids > *')].map((x,i)=>i+": "+x.className+" | "+x.innerText.replace(/\s+/g," ").slice(0,110)).join("\n")));await b.close()})();
