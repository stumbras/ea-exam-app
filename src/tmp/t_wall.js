const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const apps of [[],["cdl"]]){const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:1.5,isMobile:true,serviceWorkers:'block'});
 const acc={access:"expired",usedMs:3600000,limitMs:3600000,email:"t@x.com",apps};
 await ctx.addInitScript(a=>{try{localStorage.setItem("slCloud",JSON.stringify({token:"x",email:"t@x.com",acc:a}))}catch(_){}},acc);
 await ctx.route('https://sync.solvinglifewith.com/**',r=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(acc)}));
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
 for(const k of ['cdl','sie']){await p.goto('https://study.solvinglifewith.com/?'+k,{waitUntil:'load'});await p.waitForTimeout(6500);
  const r=await p.evaluate(()=>{const w=document.getElementById('acwall');return w?[...w.querySelectorAll('a')].slice(0,2).map(a=>a.textContent.trim()+' -> '+(a.getAttribute('href')||'').replace('https://www.solvinglifellc.com/product-page/','')):'NO WALL'});
  console.log('grant',JSON.stringify(apps),k,JSON.stringify(r));if(k==='cdl'&&!apps.length)await p.screenshot({path:'tmp/s_wall.jpg',type:'jpeg',quality:60})}
 console.log('errs',JSON.stringify(errs));await ctx.close()}
await b.close()})()
