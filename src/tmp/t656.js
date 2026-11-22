const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>{const g=GENS_OLD[0];return{id:g.id,has:!!BYID[g.id],same:BYID[g.id]===g,n:GENS_OLD.filter(x=>BYID[x.id]===x).length,dupIds:GENS_OLD.length-new Set(GENS_OLD.map(x=>x.id)).size,newIds:GENS.filter(x=>x.exam).map(x=>x.id).slice(0,3)}})));
await b.close()})();
