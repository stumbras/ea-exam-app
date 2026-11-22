// Fails (exit 1) if, in any section, the right answer is clearly the longest choice in more than 5% of questions.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const o={};BANK.filter(i=>i.t==="q").forEach(i=>{const L=i.opts.map(x=>String(x).length),W=L.filter((x,k)=>k!==i.ans),R=o[i.p]=o[i.p]||{n:0,g:0,bad:[]};R.n++;if(L[i.ans]>=1.25*Math.max(...W)){R.g++;R.bad.push(i.id)}});return o});
let fail=0;for(const [k,v] of Object.entries(r)){const pc=100*v.g/v.n;console.log(`part ${k}: ${v.n} questions, clearly longest ${pc.toFixed(1)}%`);if(pc>5){fail=1;console.log('  TOO HIGH, e.g.',v.bad.slice(0,10).join(' '))}}
await b.close();process.exit(fail)})();
