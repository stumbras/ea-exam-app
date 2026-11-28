const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:'block'})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?drive&st=Texas',{waitUntil:'load'});await p.waitForTimeout(1800);
await p.screenshot({path:'tmp/s_home.png'});
const n=await p.evaluate(()=>BP(12).filter(i=>signPic(i.s)).length);console.log('questions with pictures',n,'of',await p.evaluate(()=>BP(12).filter(i=>i.d<3).length));
// render a sample grid of all pictures
await p.evaluate(()=>{const qs=BP(12).filter(i=>signPic(i.s));document.body.innerHTML='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:6px">'+qs.map(q=>'<div style="font:10px sans-serif;text-align:center">'+signPic(q.s)+q.s.slice(0,40)+'</div>').join('')+'</div>'});
await p.screenshot({path:'tmp/s_grid.png',fullPage:true});
console.log('errs',JSON.stringify(errs));await b.close()})()
