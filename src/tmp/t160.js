const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];for(const W of [390,1280]){const ctx=await b.newContext({viewport:{width:W,height:844},deviceScaleFactor:W<500?2:1});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);await p.click('[data-sec="bk"]');
 await p.click('[data-mode="taxsim"]');await p.waitForTimeout(150);await p.screenshot({path:'olt-cm-'+W+'.png',fullPage:true});
 await p.click('[data-tcl="rowan"]');await p.waitForTimeout(80);
 const msg=async()=>p.evaluate(()=>tv.msg);
 // manual new return: wrong SSN, mismatch, correct
 await p.click('[data-ttab="newret"]');await p.fill('#tss1','400001101');await p.fill('#tss2','400001102');await p.click('[data-tsave="newret"]');console.log('mismatch:',await msg());
 await p.fill('#tss1','400-00-1101');await p.fill('#tss2','400001101');await p.click('[data-tsave="newret"]');console.log('ok:',await msg());
 // guided fill until the efile step
 for(let k=0;k<25;k++){const t=await p.evaluate(()=>{const c=TC.find(x=>x.id===tv.cur),s=tsteps(c),r=TR(c.id),i=s.findIndex(x=>!x.ok(r));return i<0?null:s[i].tab});if(!t||t==='efile')break;if(t==='payments'&&W===390){await p.click('[data-ttab="payments"]');await p.screenshot({path:'olt-refund.png',fullPage:true})}if(t==='state'){await p.click('[data-ttab="state"]');await p.screenshot({path:'olt-state-'+W+'.png',fullPage:true})}await p.click('[data-tfill]');await p.waitForTimeout(50)}
 await p.click('[data-ttab="efile"]');await p.waitForTimeout(60);
 await p.check('#tsign');await p.click('[data-tsave="send"]');console.log('no ero:',await msg());
 for(const x of await p.$$('.tero'))await x.check();await p.check('#tsign');await p.click('[data-tsave="send"]');console.log('no pay:',await msg());
 for(const x of await p.$$('.tero'))await x.check();await p.check('#tsign');await p.selectOption('#tpm',{index:1});await p.screenshot({path:'olt-ero-'+W+'.png',fullPage:true});await p.click('[data-tsave="send"]');console.log('queued:',await msg(),await p.evaluate(()=>TR('rowan').ack));
 await p.click('[data-tolt="ef"]');await p.waitForTimeout(60);await p.click('[data-tefx="tx"]');console.log(await msg());await p.click('[data-tefx="st"]');console.log(await msg(),await p.evaluate(()=>TR('rowan').ack));
 await p.screenshot({path:'olt-ef-'+W+'.png',fullPage:true});
 for(const m of ['su','to','le','re','cm']){await p.click('[data-tolt="'+m+'"]');await p.waitForTimeout(40)}
 console.log(W,'wide?',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 // credits 8867 on maya (HOH)
 await p.click('[data-tcl="maya"]');await p.click('[data-ttab="credits"]');await p.click('[data-tsave="dd"]');console.log('8867 partial:',await msg());for(const x of await p.$$('.t8867'))await x.check();await p.click('[data-tsave="dd"]');console.log(await msg());if(W===390)await p.screenshot({path:'olt-8867.png',fullPage:true});
 await ctx.close()}
 console.log('errors',errs);await b.close()})();
