const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{view="start";render()});await p.waitForTimeout(300);await p.screenshot({path:'tmp/v_start.png',fullPage:true});
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(300);await p.screenshot({path:'tmp/v_p1.png',fullPage:true});
console.log(await p.evaluate(()=>[...document.querySelector('#view').children].map(c=>{const r=c.getBoundingClientRect();return (c.tagName+'.'+(c.className||'')).slice(0,26)+' h='+Math.round(r.height)+' btn='+c.querySelectorAll('button').length+' | '+c.innerText.replace(/\s+/g,' ').slice(0,70)}).join('\n')));
await p.evaluate(()=>{part=5;view="home";render()});await p.waitForTimeout(300);await p.screenshot({path:'tmp/v_p5.png',fullPage:true});
await b.close()})();
