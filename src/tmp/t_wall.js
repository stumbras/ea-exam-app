const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:1.5,isMobile:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
for(const k of ['cdl','sie']){await p.goto('http://localhost:8765/ea-exam-app/?'+k,{waitUntil:'load'});await p.waitForTimeout(2200);
 const r=await p.evaluate(()=>{cs={email:"t@x.com",acc:{access:"expired",usedMs:3600000,limitMs:3600000,apps:[]}};const s1=acState();acWall("expired");const links=[...document.querySelectorAll('#acwall a')].map(a=>a.textContent.trim()+' -> '+a.getAttribute('href').replace('https://www.solvinglifellc.com','')).slice(0,3);
   cs.acc.apps=["cdl"];const s2=acState();cs.acc.access="trial";const s3=acState();return {app:acApp(),expiredState:s1,withCdlGrant:s2,trialWithGrant:s3,links}});
 console.log(k,JSON.stringify(r));if(k==='cdl')await p.screenshot({path:'tmp/s_wall.jpg',type:'jpeg',quality:60})}
console.log('errs',JSON.stringify(errs));await b.close()})()
