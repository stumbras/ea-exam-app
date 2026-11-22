const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);
 console.log(await p.evaluate(()=>[document.querySelector('h1').textContent,UNITS[4].length,UNITS[4][UNITS[4].length-1].t,BANK.filter(i=>i.p==4&&/Solving Life LLC/.test(i.f||i.q||"")).length]));
 await p.click('[data-sec="bk"]');await p.click('[data-mode="lessons"]');await p.waitForTimeout(150);
 const rows=await p.$$('#view button');let hit=null;for(const r of rows){if(/five tools/.test(await r.textContent())){hit=r;break}}
 await hit.click();await p.waitForTimeout(200);let wide=[];
 for(let i=0;i<6;i++){if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))wide.push(i);if(i===3)await p.screenshot({path:'tools-slide.png',fullPage:true});const n=await p.$('#lnext, [data-lnext], #next');if(n)await n.click();await p.waitForTimeout(80)}
 console.log('wide',wide,'errors',errs);await b.close()})();
