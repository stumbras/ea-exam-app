const {chromium}=require('playwright');const P=+process.argv[2]||7;
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
console.log(await p.evaluate(P=>BANK.filter(i=>i.p==P&&i.t==="q").filter(i=>{const L=i.opts.map(x=>String(x).length),W=L.filter((x,k)=>k!==i.ans);return L[i.ans]>=1.25*Math.max(...W)}).map(i=>i.s.slice(0,70)+'\n  C['+i.opts[i.ans].length+'] '+i.opts[i.ans]+'\n  W '+i.opts.filter((x,k)=>k!==i.ans).map(x=>'['+x.length+'] '+x).join(' | ')).join('\n'),P));await b.close()})();
