// Offline test: first visit online (service worker caches the app), then cut the network and reload.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(3000);
console.log('sw ready:',await p.evaluate(async()=>{const r=await navigator.serviceWorker.ready;return !!r.active}),'build:',await p.evaluate(()=>BUILD));
await p.reload();await p.waitForTimeout(2000); // second load is served by the worker
await ctx.setOffline(true);
await p.reload();await p.waitForTimeout(2500);
console.log('offline reload build:',await p.evaluate(()=>typeof BUILD!=="undefined"?BUILD:"none"),'questions:',await p.evaluate(()=>BANK.length));
await p.evaluate(()=>{view="start";render()});
for(const sec of ['ea','bk','s65','edpna','caa']){await p.evaluate(()=>{view="start";render()});const c=await p.$(`[data-sec="${sec}"]`);if(!c){console.log(sec,'MISSING');continue}await c.click();await p.waitForTimeout(300);console.log('offline',sec,'->',await p.$eval('h1',e=>e.textContent))}
// a study session and the practice return work offline too
await p.evaluate(()=>{part=7;view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()});await p.click('#view [data-mode="medium"]');await p.waitForTimeout(300);console.log('offline session view:',await p.evaluate(()=>view));
await p.evaluate(()=>{part=4;view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()});const ts=await p.$('[data-mode="taxsim"]');if(ts){await ts.click();await p.waitForTimeout(300);console.log('offline taxsim view:',await p.evaluate(()=>view))}
// a fresh tab while offline
const p2=await ctx.newPage();await p2.goto('http://localhost:8765/ea-exam-app/').catch(e=>console.log('p2 nav err',e.message));await p2.waitForTimeout(2000);console.log('new offline tab build:',await p2.evaluate(()=>typeof BUILD!=="undefined"?BUILD:"none"));
console.log('errors',JSON.stringify(errs));await b.close()})();
