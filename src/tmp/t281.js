const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=4;view="home";render()});await p.waitForTimeout(400);
const t=await p.evaluate(()=>document.querySelector('#app,main,body').innerText.slice(0,3500));console.log(t);
await p.screenshot({path:'tmp/bk1.png',fullPage:true});
console.log('errors',JSON.stringify(errs));await b.close()})();
