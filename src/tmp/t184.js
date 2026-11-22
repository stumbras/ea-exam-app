const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
const part=+process.argv[2]||6;
const r=await p.evaluate(part=>{const Q=BANK.filter(i=>i.t==="q"&&i.p===part),lg=i=>{const L=i.opts.map(x=>String(x).length);return L[i.ans]>Math.max(...L.filter((x,k)=>k!==i.ans))};
 const bal=Q.filter(i=>i.bal),rest=Q.filter(i=>!i.bal&&lg(i));
 return {n:Q.length,bal:bal.length,balLong:bal.filter(lg).length,restLong:rest.length,list:rest.map(i=>`${i.id}\tQ: ${i.s}\n  C: ${i.opts[i.ans]}\n  W: ${i.opts.filter((x,k)=>k!==i.ans).join(' | ')}`).join('\n')}},part);
console.log(r.n,'balanced',r.bal,'still longest',r.balLong,'other longest',r.restLong);fs.writeFileSync('rest_'+part+'.txt',r.list);await b.close()})();
