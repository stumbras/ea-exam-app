const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>`gens p4: ${GENS.filter(g=>g.p==4).length} | bank p4 q: ${BANK.filter(i=>i.p==4&&i.t==="q").length} lv: ${[1,2,3].map(l=>BANK.filter(i=>i.p==4&&i.t==="q"&&i.lv===l).length)} | labs: ${typeof LABS!=="undefined"?LABS.map(l=>l.kind+":"+l.t).join(" ; "):"?"}`));
await b.close()})();
