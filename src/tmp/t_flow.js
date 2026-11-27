const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:400,height:860},isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,100)));
const see=async(u,w=5000)=>{await p.goto(u,{waitUntil:'load'});await p.waitForTimeout(w);const r=await p.evaluate(()=>({url:location.href.replace('https://study.solvinglifewith.com',''),title:document.title,h1:(document.querySelector('h1')||{}).textContent,app:localStorage.getItem('slApp')}));console.log(u.replace('https://',''),'=>',JSON.stringify(r))};
await see('https://study.solvinglifewith.com/?study',7000);
await see('https://study.solvinglifewith.com/?drive');
await see('https://study.solvinglifewith.com/driving/');
await see('https://study.solvinglifewith.com/citizenship/');
await see('https://study.solvinglifewith.com/?moto');
await see('https://study.solvinglifewith.com/');
await see('https://study.solvinglifewith.com/?study');
// from the public pages: click the app button
await p.goto('https://solvinglifewith.com/drivers-license-practice-test',{waitUntil:'load'});
const hrefs=await p.evaluate(()=>[...document.querySelectorAll('a[href*="study.solvinglifewith.com"]')].map(a=>a.getAttribute('href')).filter((v,i,a)=>a.indexOf(v)==i));console.log('driver page app links',JSON.stringify(hrefs));
await p.goto('https://solvinglifewith.com/free-practice-questions',{waitUntil:'load'});
console.log('hub app links',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('a[href*="study.solvinglifewith.com"]')].map(a=>a.getAttribute('href')).filter((v,i,a)=>a.indexOf(v)==i))));
console.log('errs',JSON.stringify(errs.slice(0,3)));await b.close()})()
