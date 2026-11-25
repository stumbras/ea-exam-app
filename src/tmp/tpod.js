const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['iPhone 13'],serviceWorkers:'block'});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(2500);
const r=await p.evaluate(async()=>{part=1;openAudio();await new Promise(r=>setTimeout(r,300));const has=!!document.getElementById('podcard');await slPod('podcast.xml');await new Promise(r=>setTimeout(r,800));return {has,n:document.querySelectorAll('#podlist audio').length,first:(document.querySelector('#podlist b')||{}).textContent}});
console.log(JSON.stringify(r),errs);await b.close()})();
