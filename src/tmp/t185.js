const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>{const o={};BANK.filter(i=>i.t==="q").forEach(i=>{const L=i.opts.map(x=>String(x).length),m=Math.max(...L.filter((x,k)=>k!==i.ans)),c=L[i.ans];const R=o[i.p]=o[i.p]||{n:0,l:0,g:0,s:0};R.n++;if(c>m)R.l++;if(c>=1.25*m)R.g++;if(c*1.25<=Math.min(...L.filter((x,k)=>k!==i.ans)))R.s++});
 return Object.entries(o).map(([k,v])=>`part ${k}: longest ${Math.round(100*v.l/v.n)}% · clearly longest (25%+) ${Math.round(100*v.g/v.n)}% · clearly shortest ${Math.round(100*v.s/v.n)}%`).join('\n')}));await b.close()})();
