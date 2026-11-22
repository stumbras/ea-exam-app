const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
for(const pt of [1,5,6]){await p.evaluate(x=>{part=x;view="home";filt="all";render()},pt);await p.click('#view [data-mode="mix"]');await p.waitForTimeout(250);
 const info=await p.evaluate(()=>({t:document.querySelector('#view').innerText.replace(/\n+/g,' | ').slice(0,260),btns:[...document.querySelectorAll('#view button')].map(b=>(b.className+'|'+Object.keys(b.dataset).join('.')+'|'+b.textContent.slice(0,20))).slice(0,12),inp:!!document.querySelector('#view input')}));console.log(pt,JSON.stringify(info))}
console.log('errors',JSON.stringify(errs));await b.close()})();
