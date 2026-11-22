const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=7;view="home";render();scrollTo(0,0)});await p.waitForTimeout(300);
console.log(JSON.stringify(await p.evaluate(()=>({rows:document.querySelectorAll('.xprow').length,doms:PARTS[7].doms.length,tools:!!document.querySelector('#xptools'),sw:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,y:(document.querySelector('.xpath,.xp')||{getBoundingClientRect:()=>({top:-1})}).getBoundingClientRect().top}))));
await p.screenshot({path:'tmp/c7.png',fullPage:true});await b.close()})();
