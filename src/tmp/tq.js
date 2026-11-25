const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(2000);
const r=await p.evaluate(()=>{const out=[];for(let k=0;k<3;k++){const q=audQueue("part","smart",10);out.push(q.slice(0,6).map(i=>i.d+":"+i.f.slice(0,25)).join(" | "))}return out});
console.log(r.join("\n"),errs);await b.close()})();
