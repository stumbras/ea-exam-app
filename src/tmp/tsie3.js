const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({...devices['iPhone 13']})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.split('\n').slice(0,3).join(' / ')));
await p.goto('http://localhost:8765/ea-exam-app/?sie');await p.waitForTimeout(2500);
await p.click('text=Tap here');await p.waitForTimeout(800);
for(let i=0;i<25;i++){const c=await p.$$('button.opt,button[data-o],.opts button,[data-a]');const nx=await p.$('text=/^(Next|Continue|Got it|I know this|Show answer)/');
 if(c.length){await c[0].click().catch(()=>{});await p.waitForTimeout(250)}else if(nx){await nx.click().catch(()=>{});await p.waitForTimeout(250)}else{const bb=await p.$$('main button, #app button');if(bb.length)await bb[bb.length-1].click().catch(()=>{});await p.waitForTimeout(250)}}
await p.screenshot({path:'tmp/sie_q.png'});
// mock exam
await p.goto('http://localhost:8765/ea-exam-app/?sie');await p.waitForTimeout(1500);
console.log('stats',await p.evaluate(()=>Object.keys(S.it).filter(k=>BANK.find(i=>i.id==k&&i.p==10)).length),'errors',errs);await b.close()})();
