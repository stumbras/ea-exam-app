const {chromium,webkit}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:430,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const U='http://localhost:8765/ea-exam-app/';
 await p.goto(U);await p.waitForTimeout(3500);
 const box=()=>p.evaluate(()=>document.querySelector('#view .ledger').innerText.replace(/\n+/g,' / ').slice(0,330));
 console.log('1 first load |',await box());
 await p.evaluate(()=>{for(let k=0;k<15;k++){const it=BANK[k];grade(it,2);logDomain(it,true)}persist();render()});
 await ctx.setOffline(true);await p.reload();await p.waitForTimeout(2500);
 console.log('2 OFFLINE reload |',await box(),'| items',await p.evaluate(()=>Object.keys(S.it).length));
 // run a real session offline: start easy mode and answer one
 await p.evaluate(()=>{startSession("easy")});await p.waitForTimeout(300);console.log('3 offline session view:',await p.evaluate(()=>view+' q='+(sess&&sess.queue.length)));
 await p.evaluate(()=>{sess=null;view="home";render()});
 const code=await p.evaluate(()=>backupText());console.log('4 code length',code.length);
 await p.screenshot({path:'pwa-offline.png'});
 // second device: blank, has 5 other answers, then paste the code
 const ctx2=await b.newContext({viewport:{width:430,height:900}});const q=await ctx2.newPage();q.on('pageerror',e=>errs.push('d2 '+e.message));
 await ctx.setOffline(false);await q.goto(U);await q.waitForTimeout(2500);
 await q.evaluate(()=>{for(let k=30;k<35;k++){const it=BANK[k];grade(it,2);logDomain(it,true)}persist();render()});
 await q.click('#pasteopen');await q.fill('#pastecode',code);await q.click('#pastego');await q.waitForTimeout(400);
 console.log('5 device 2 after paste | items',await q.evaluate(()=>Object.keys(S.it).length),'|',await q.evaluate(()=>bkNote));
 await q.click('#pasteopen');await q.fill('#pastecode',code);await q.click('#pastego');await q.waitForTimeout(300);
 console.log('6 paste same code again | items',await q.evaluate(()=>Object.keys(S.it).length),'| dom',await q.evaluate(()=>JSON.stringify(S.dom)).then(x=>x.slice(0,120)));
 await q.click('#pasteopen');await q.fill('#pastecode','garbage');await q.click('#pastego');await q.waitForTimeout(200);console.log('7 bad code |',await q.evaluate(()=>bkNote));
 console.log('manifest',await (await ctx2.request.get(U+'manifest.webmanifest')).status(),'errors',errs);
 await b.close()})();
