const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({...devices['iPhone 13']})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.split('\n').slice(0,3).join(' / ')));
await p.goto('http://localhost:8765/ea-exam-app/?sie');await p.waitForTimeout(2500);
const modes=await p.$$eval('[data-mode]',e=>[...new Set(e.filter(x=>x.offsetParent).map(x=>x.dataset.mode))]);console.log('modes',modes.join(','));
for(const m of modes){await p.goto('http://localhost:8765/ea-exam-app/?sie');await p.waitForTimeout(1200);const n=errs.length;const el=await p.$(`[data-mode="${m}"]`);await el.scrollIntoViewIfNeeded().catch(()=>{});await el.click({timeout:3000}).catch(()=>{});await p.waitForTimeout(900);
 // answer 3 times: click first visible option-ish button inside #view
 for(let k=0;k<4;k++){const bs=await p.$$('#view button');const vis=[];for(const x of bs){if(await x.isVisible())vis.push(x)}if(!vis.length)break;await vis[Math.min(1,vis.length-1)].click({timeout:1500}).catch(()=>{});await p.waitForTimeout(300)}
 const sw=await p.evaluate(()=>document.documentElement.scrollWidth);console.log(m,'sw',sw,errs.length>n?errs.slice(n):'ok')}
await b.close()})();
