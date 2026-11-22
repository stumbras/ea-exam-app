const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(200);
console.log(JSON.stringify(await p.evaluate(()=>{const hs=[...document.querySelectorAll('#view h3, #view summary b, #view .lvl')].map(e=>({t:e.innerText.trim().slice(0,60),vis:!!(e.offsetParent),y:Math.round(e.getBoundingClientRect().top+scrollY)}));return hs.filter(h=>h.t)}),null,0).slice(0,3500));
await p.screenshot({path:'tmp/x_full.png',fullPage:true});
await b.close()})();
