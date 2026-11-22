const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
for(const pt of [1,3,5,6,8,4]){const r=await p.evaluate(pt=>{part=pt;const t0=performance.now();plusOpen("gloss");const ms=Math.round(performance.now()-t0);return{rows:document.querySelectorAll('.prow').length,h:document.documentElement.scrollHeight,ms,sample:[...document.querySelectorAll('.prow b')].slice(0,6).map(x=>x.textContent).join(', ')}},pt);console.log('part',pt,JSON.stringify(r))}
await p.evaluate(()=>{part=8;plusOpen("gloss")});await p.click('[data-plus="allterms"]');await p.waitForTimeout(150);console.log('show all ->',await p.evaluate(()=>document.querySelectorAll('.prow').length));
await p.fill('#plusq','magi');await p.waitForTimeout(150);console.log('search magi in notary ->',await p.evaluate(()=>document.querySelectorAll('.prow').length));
const q=await p.evaluate(()=>({n:BANK.filter(i=>i.p==2&&/Form 990 is due|Form 990 due date/.test(i.s||"")).length,trim:BANK.filter(i=>i.t==="q"&&/carryover\)|limited to DNI\)|with \$4,000 suspended/.test(String(i.opts[i.ans]))).length}));console.log('Form 990 questions left',q.n,'untrimmed left',q.trim);
console.log('errors',errs);await b.close()})();
