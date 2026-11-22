const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
const parts=process.argv.slice(2).map(Number);
for(const part of parts){const t=await p.evaluate(part=>BANK.filter(i=>i.t==="q"&&i.p===part).filter(i=>{const L=i.opts.map(x=>String(x).length),m=Math.max(...L.filter((x,k)=>k!==i.ans));return L[i.ans]>=1.25*m}).map(i=>`${i.id} [${String(i.opts[i.ans]).length}]\tQ: ${i.s}\n  C: ${i.opts[i.ans]}\n  W: ${i.opts.filter((x,k)=>k!==i.ans).join(' | ')}`).join('\n'),part);
 fs.writeFileSync('cl_'+part+'.txt',t);console.log(part,t.split('\n').filter(l=>/^p/.test(l)).length)}
await b.close()})();
