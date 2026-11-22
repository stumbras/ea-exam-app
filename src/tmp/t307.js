const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="T";k.warm={day:kToday(),sec:0,n:0,ok:0,done:0,les:1,last:[]};persist();kShowStart("warm");render()});await p.waitForTimeout(300);
console.log(await p.evaluate(()=>[...document.querySelectorAll('#view button')].map(b=>JSON.stringify(b.dataset)+" "+b.innerText.slice(0,20)).join("\n")));await b.close()})();
