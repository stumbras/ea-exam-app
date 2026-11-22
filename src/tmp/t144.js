const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);
 for(const s of ['bk','ea','s65','edpna']){await p.click(`[data-sec="${s}"]`);await p.waitForTimeout(250);
  console.log(s,await p.evaluate(()=>{const d=document.querySelector('details.intro');return d?[d.open,d.querySelector('summary').innerText,d.querySelectorAll('.introrow').length,document.documentElement.scrollWidth>innerWidth+1]:'none'}));
  await p.screenshot({path:`intro-${s}.png`});await p.click('[data-sec="start"]');await p.waitForTimeout(150)}
 await p.click('[data-sec="s65"]');await p.click('details.intro summary');await p.waitForTimeout(100);await p.click('[data-sec="start"]');await p.click('[data-sec="s65"]');await p.waitForTimeout(150);
 console.log('remembers closed',await p.evaluate(()=>!document.querySelector('details.intro').open));
 console.log('errors',errs);await b.close()})();
