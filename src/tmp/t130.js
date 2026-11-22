const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);await p.evaluate(()=>{if(typeof OPEN!=="undefined")OPEN.moremodes=true;if(typeof render==="function")render()});await p.click('[data-sec="bk"]');
 console.log('engine:',await p.evaluate(()=>TC.map(c=>{const k=tcalc(c.key);return c.id+': agi '+k.agi+' ti '+k.ti+' tax '+k.tax+' ctc '+k.ctc+' se '+k.se+' qbi '+k.qbi+' total '+k.totalTax+' pay '+k.pay+' refund '+k.refund+' owe '+k.owe})));
 // QuickBooks: follow the guide start to finish with Show me + Save
 await p.click('[data-mode="qbo"]');await p.waitForTimeout(200);await p.screenshot({path:'qbo-home.png',fullPage:true});
 for(let i=0;i<9;i++){await p.click('[data-qgo]');await p.waitForTimeout(80);if(i===2)await p.screenshot({path:'qbo-form.png',fullPage:true});await p.click('[data-qsave]');await p.waitForTimeout(80)}
 await p.click('[data-qgo]');await p.waitForTimeout(100);await p.screenshot({path:'qbo-bank.png',fullPage:true});
 for(let i=0;i<6;i++){await p.click('[data-qmatch]');await p.waitForTimeout(60)}
 console.log('after match:',await p.evaluate(()=>[QS().feed.join(','),qtasks().filter(t=>t[1]).length]));
 await p.selectOption('#qfc6','Bank Charges');await p.click('[data-qadd="6"]');await p.waitForTimeout(80);
 await p.click('[data-qgo]');await p.waitForTimeout(100);
 console.log('reconcile start:',await p.evaluate(()=>document.querySelector('.vscr').innerText.replace(/\n+/g,' | ').slice(0,160)));
 const boxes=await p.$$('[data-qclr]');console.log('lines',boxes.length);
 // tick unticked ones except the 100 supplies
 await p.evaluate(()=>{QS().tx.forEach(t=>{if(t.L.some(l=>l[0]==="Checking"))t.c=!(t.k==="Expense"&&t.amt===100)});persist();render()});
 await p.screenshot({path:'qbo-rec.png',fullPage:true});
 await p.click('[data-qfinish]');await p.waitForTimeout(100);
 console.log('tasks:',await p.evaluate(()=>qtasks().map(t=>t[1]?1:0).join('')+' checking '+qbal("Checking")+' net '+qnet()));
 await p.click('[data-qtab="rep"]');await p.waitForTimeout(100);await p.screenshot({path:'qbo-rep.png',fullPage:true});
 await p.click('[data-qtab="close"]');await p.waitForTimeout(80);for(let i=0;i<5;i++){await p.click('[data-qcl]:not([disabled])');await p.waitForTimeout(40)}await p.screenshot({path:'qbo-close.png',fullPage:true});console.log('close',await p.evaluate(()=>JSON.stringify(QS().cl)));
 await p.click('[data-qtab="lists"]');console.log('wide?',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 // wrong path: add a matched line again -> double, then delete
 await p.click('[data-qexit]');
 // Tax: each client via Enter it for me, then send
 await p.click('[data-mode="taxsim"]');await p.waitForTimeout(150);await p.screenshot({path:'tax-clients.png',fullPage:true});
 for(const id of ['rowan','maya','reyes','nina','haddad']){await p.click('[data-tcl="'+id+'"]');await p.waitForTimeout(80);
  for(let k=0;k<20;k++){const f=await p.$('[data-tfill]');if(!f)break;const t=await p.evaluate(()=>{const c=TC.find(x=>x.id===tv.cur),s=tsteps(c),r=TR(c.id);return s[s.findIndex(x=>!x.ok(r))].tab});await f.click();await p.waitForTimeout(60);if(t==='efile'){if(id==='haddad')await p.screenshot({path:'tax-w7.png',fullPage:true});if(id==='rowan')await p.screenshot({path:'tax-8879.png',fullPage:true});await p.click('[data-tsave="send"]');await p.waitForTimeout(80)}}
  console.log(id,await p.evaluate(()=>{const r=TR(tv.cur),k=tcalc(r);return [r.ack,k.refund,k.owe,JSON.stringify(r.of),!!document.querySelector('[data-tfill]'),document.documentElement.scrollWidth>innerWidth]}));
  if(id==='reyes'){await p.click('[data-ttab="docs"]');await p.waitForTimeout(80);await p.screenshot({path:'tax-docs.png',fullPage:true})}
  if(id==='maya'){await p.click('[data-ttab="office"]');await p.waitForTimeout(80);await p.screenshot({path:'tax-office.png',fullPage:true})}
  await p.click('[data-tcl=""]')}
 // manual office clicks on a fresh file
 await p.click('[data-tcl="rowan"]');await p.click('[data-tsave="reset"]');await p.click('[data-ttab="office"]');for(let i=0;i<2;i++){await p.click('[data-tof]:not([disabled])');await p.waitForTimeout(50)}await p.evaluate(()=>{const r=TR("rowan");r.created=true;r.status="Single";persist();render()});for(let i=0;i<2;i++){await p.click('[data-tof]:not([disabled])');await p.waitForTimeout(50)}
 console.log('office manual',await p.evaluate(()=>[JSON.stringify(TR("rowan").of),document.querySelectorAll('[data-tof]:not([disabled])').length]));await p.click('[data-tcl=""]');
 // manual path with an error: Rowan re-do, typo in wages -> rejected with reason
 await p.click('[data-tcl="rowan"]');await p.click('[data-tsave="reset"]');await p.click('[data-ttab="personal"]');await p.selectOption('#tstatus','Single');await p.click('[data-tsave="personal"]');
 await p.click('[data-ttab="income"]');await p.click('[data-tadd="w2"]');await p.fill('#twe','Plain Works Inc');await p.fill('#tw1','54500');await p.fill('#tw2','4000');await p.click('[data-tsave="w2"]');
 await p.click('[data-ttab="review"]');await p.waitForTimeout(80);console.log('review:',await p.evaluate(()=>document.querySelector('#view').innerText.match(/EIN[^\n]*|Yours[^\n]*/g)));
 await p.screenshot({path:'tax-review.png',fullPage:true});
 console.log('bk pct',await p.evaluate(()=>{view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render();return [bkStats("all").labsDone,bkStats("all").labs]}));
 console.log('errors',errs);await b.close()})();
