const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/sie/');await p.waitForTimeout(2500);
console.log('title',await p.title(),'h1',await p.evaluate(()=>(document.querySelector('h1')||{}).textContent),'sw',await p.evaluate(()=>document.documentElement.scrollWidth));
await p.screenshot({path:'tmp/sie_home.png'});
const btns=await p.$$eval('button',bs=>bs.filter(b=>b.offsetParent).map(b=>(b.dataset.go||b.dataset.mode||b.dataset.nav||'')+':'+b.textContent.trim().slice(0,30)).slice(0,30));console.log(btns.join(' | '));
const n=await p.evaluate(()=>({q:BANK.filter(i=>i.p==10).length,f:(typeof FACTS!=='undefined'?FACTS:[]).filter(i=>i.p==10).length}));console.log(n);
// start page tile
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(2000);await p.evaluate(()=>{localStorage.removeItem('slApp')});
console.log('tile',await p.$$eval('.startcard',e=>e.map(x=>x.textContent.trim().slice(0,30))));
console.log('errors',errs);await b.close()})();
