const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:1.2,isMobile:true})).newPage();
await p.goto('file:///home/claude/ea-app/pwa/llc/pricing.html');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>JSON.stringify({w:document.documentElement.scrollWidth,vw:innerWidth,h:document.documentElement.scrollHeight})));
await p.screenshot({path:'tmp/s_price1.jpg',type:'jpeg',quality:55,clip:{x:0,y:0,width:400,height:1500}});
const y=await p.evaluate(()=>document.querySelector('h2').getBoundingClientRect().top+scrollY-20);
await p.screenshot({path:'tmp/s_price2.jpg',type:'jpeg',quality:55,clip:{x:0,y:Math.max(0,y),width:400,height:1300},fullPage:true});await b.close()})()
