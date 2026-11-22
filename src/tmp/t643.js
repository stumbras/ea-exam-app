const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>{const o={};[1,2,3].forEach(pt=>{const q=BANK.filter(i=>i.p==pt&&i.t==="q");const c={};q.forEach(i=>{const k=i.d+":"+i.lv;c[k]=(c[k]||0)+1});o[pt]=c;o["g"+pt]=GENS.filter(g=>g.p==pt).length;o["gd"+pt]=[...new Set(GENS.filter(g=>g.p==pt).map(g=>g.d))].join(",")});return o})));
await b.close()})();
