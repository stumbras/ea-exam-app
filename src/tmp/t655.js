const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>GENS.filter(g=>g.exam).map(g=>{try{g.make();return null}catch(e){return g.id+": "+e.message}}).filter(Boolean))));
await b.close()})();
