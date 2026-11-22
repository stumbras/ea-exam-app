const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const pt=+process.argv[2];
const r=await p.evaluate(pt=>BANK.filter(i=>i.p==pt&&i.t==="q").map((i,n)=>{const l=i.opts.map(x=>String(x).length),m=Math.max(...l),cue=l[i.ans]===m&&l.filter(x=>x===m).length===1;return (cue?'*':' ')+i.id+' d'+i.d+(i.bal?' BAL':'')+' | '+i.s+' || EX: '+(i.ex||'')+'\n     ✓ '+i.opts[i.ans]+'\n     ✗ '+i.opts.filter((_,k)=>k!==i.ans).join('  ¦  ')}),pt);
console.log(r.join('\n'));await b.close()})();
