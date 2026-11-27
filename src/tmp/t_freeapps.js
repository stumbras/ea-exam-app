const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const k of ['cit','drive','moto']){const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:2,isMobile:true,hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
 await p.goto('http://localhost:8765/ea-exam-app/?'+k,{waitUntil:'load'});await p.waitForTimeout(2500);
 const info=await p.evaluate(()=>({part,view,title:document.querySelector('h1')&&document.querySelector('h1').textContent,n:BANK.filter(i=>i.p==part).length,q:BANK.filter(i=>i.p==part&&i.t!=='f'&&i.c!==undefined).length,txt:document.body.innerText.slice(0,500).replace(/\n+/g,' | ')}));
 console.log(k,JSON.stringify(info).slice(0,900));await p.screenshot({path:'tmp/fa_'+k+'.jpg',type:'jpeg',quality:70});
 const btns=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>(e.dataset.mode||e.dataset.nav||e.dataset.go||'')+':'+e.innerText.slice(0,28).replace(/\n/g,' ')).slice(0,40).join(' | '));console.log('  buttons',btns.slice(0,900));console.log('  errs',errs.slice(0,4));await ctx.close()}
await b.close()})()
