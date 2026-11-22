const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>BANK.filter(i=>i.t==="q").filter(i=>{const o=i.opts.map(String),L=o.map(x=>x.length),others=L.filter((x,k)=>k!==i.ans);return L[i.ans]>=1.5*Math.max(...others)}).map(i=>({id:i.id,p:i.p,s:i.s,c:i.opts[i.ans],w:i.opts.filter((x,k)=>k!==i.ans),e:i.ex})));
for(const part of [1,2,3,4,5,6]){const L=r.filter(x=>x.p===part);fs.writeFileSync('bal_'+part+'.txt',L.map(x=>`${x.id}\tQ: ${x.s}\n  C: ${x.c}\n  W: ${x.w.join(' | ')}`).join('\n'));console.log(part,L.length)}
await b.close()})();
