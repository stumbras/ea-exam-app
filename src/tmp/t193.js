const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
await p.evaluate(()=>{part=7;view="home";render()});
const modes=await p.$$eval('#view [data-mode]',a=>a.map(x=>x.dataset.mode));console.log('modes',modes.join(','));
for(const m of ['lessons','easy','flash','audio','medium','hard']){if(!modes.includes(m))continue;await p.evaluate(()=>{view="home";render()});await p.click(`#view [data-mode="${m}"]`);await p.waitForTimeout(500);console.log(m,'->',await p.evaluate(()=>view),(await p.$eval('#view',e=>e.innerText)).slice(0,90).replace(/\n/g,' | '));await p.evaluate(()=>{try{hush()}catch(e){}})}
console.log('errors',JSON.stringify(errs));await b.close()})();
