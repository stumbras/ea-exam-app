const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>[1,2,3].map(pt=>UNITS[pt].map((u,k)=>k+":"+(u.d===undefined?"-":u.d)+" "+u.t.slice(0,38))))),null,0);
await b.close()})();
