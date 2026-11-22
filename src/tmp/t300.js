const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{if(!kCtStart.map)kCtStart.map=kCtBuild();const M=kCtStart.map;return "cands "+M.bld.filter(b=>!b.ic&&b.w>90&&b.h>90).length+" of "+M.bld.length}));await b.close()})();
