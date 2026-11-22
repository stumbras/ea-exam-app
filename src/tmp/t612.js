const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=7;view="home";render()});await p.waitForTimeout(300);
console.log(await p.evaluate(()=>({h:document.documentElement.scrollHeight,dash:/ready · goal/.test(document.querySelector('#view').innerText),mock:!!document.querySelector('.xp [data-xp="mock"]'),sp:!!document.getElementById('spbox')})));
await p.screenshot({path:'tmp/c_home2.png'});await p.evaluate(()=>{cjClick({cj:"ref"})});await p.waitForTimeout(200);await p.screenshot({path:'tmp/c_ref2.png',fullPage:true});
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(200);console.log('part1 dash kept',await p.evaluate(()=>/ready · goal/.test(document.querySelector('#view').innerText)));await b.close()})();
