const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:860},isMobile:true});const p=await ctx.newPage();
await p.goto('https://study.solvinglifewith.com/?drive',{waitUntil:'load'});await p.waitForTimeout(6000);
await p.goto('https://study.solvinglifewith.com/',{waitUntil:'load',referer:'https://www.solvinglifellc.com/apps'});await p.waitForTimeout(4000);
console.log('from company site:',await p.evaluate(()=>document.title+' | slApp='+localStorage.getItem('slApp')+' | '+document.body.innerText.slice(0,90).replace(/\n+/g,' / ')));
await p.goto('https://study.solvinglifewith.com/?drive',{waitUntil:'load'});await p.waitForTimeout(3000);
await p.goto('https://study.solvinglifewith.com/',{waitUntil:'load'});await p.waitForTimeout(3000);
console.log('typed address after driving:',await p.evaluate(()=>document.title));await b.close()})()
