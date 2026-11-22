const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>{const out=[];for(const p in PARTS){const P=PARTS[p];for(const d in P.doms){const q=BANK.filter(i=>i.p==p&&i.d==d&&i.t==="q"),h=q.filter(i=>i.lv>=2).length,f=BANK.filter(i=>i.p==p&&i.d==d&&i.t==="f").length;out.push(`${p}.${d} ${P.doms[d][0]} (${P.doms[d][1]}%): q ${q.length} (medium/hard ${h}), cards ${f}, per weight-point ${(q.length/P.doms[d][1]).toFixed(1)}`)}}return out.join('\n')}));await b.close()})();
