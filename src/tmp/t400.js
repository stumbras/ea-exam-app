const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1400);
console.log((await p.evaluate(()=>{const q=BANK.find(i=>i.p==1&&i.t==="q"),f=BANK.find(i=>i.p==1&&i.t==="f"),g=GENS.find(i=>i.p==1);return JSON.stringify({q,f,g:{id:g.id,keys:Object.keys(g)},it:"[box,due,seen,right,lastOk,?,missCount]",doms:PARTS[1].doms,cname:typeof CNAME})})).slice(0,1500));
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(300);
console.log(await p.evaluate(()=>[...document.querySelectorAll('#view [data-qd],#view [data-mode]')].map(x=>(x.dataset.qd||x.dataset.mode)+':'+x.innerText.replace(/\s+/g,' ').slice(0,40)).join(' | ')));
await b.close()})();
