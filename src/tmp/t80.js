const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const errs=[];
 for(const scheme of ['light','dark']){const ctx=await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:2,colorScheme:scheme});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1800);
  await p.evaluate(()=>{for(let k=0;k<40;k++)grade(BANK[k*7],k%3?2:0);persist();render()});await p.waitForTimeout(200);
  await p.screenshot({path:`look-home-${scheme}.png`});
  await p.evaluate(()=>{startSession("medium");const it=BYID["p1qf17kp5"];sess.queue[sess.pos]=mkEntry(it,true);render()});await p.waitForTimeout(200);
  await p.evaluate(()=>{const V=view4(sess.queue[sess.pos],BYID["p1qf17kp5"]);const w=V.order.findIndex(i=>i!==V.ans);document.querySelectorAll('[data-opt]')[w].click()});await p.waitForTimeout(150);
  await p.evaluate(()=>document.querySelector('[data-conf="1"]')?.click());await p.waitForTimeout(300);
  await p.screenshot({path:`look-q-${scheme}.png`,fullPage:true});
  console.log(scheme,'overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await ctx.close()}
 // update flow: site gets a newer version.json + index; app shows banner; tap updates
 const ctx=await b.newContext({viewport:{width:430,height:932}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);
 const dir='/home/claude/ea-app/tmp/site/ea-exam-app/';fs.writeFileSync(dir+'version.json',JSON.stringify({v:'Version 99 · test'}));fs.writeFileSync(dir+'index.html',fs.readFileSync(dir+'index.html','utf8').replace('const BUILD="Version 41 · Nov 17"','const BUILD="Version 99 · test"'));
 await p.evaluate(()=>checkUpdate());await p.waitForTimeout(800);console.log('update banner:',await p.evaluate(()=>document.querySelector('#updnow')?document.querySelector('#view .ledger').innerText.replace(/\n+/g,' / '):'none'));
 await p.click('#updnow');await p.waitForTimeout(3500);console.log('after update: running',await p.evaluate(()=>BUILD),'| banner gone',await p.evaluate(()=>!document.querySelector('#updnow')));
 console.log('errors',errs);await b.close()})();
