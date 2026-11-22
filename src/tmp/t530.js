const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?course');await p.waitForTimeout(1600);await p.screenshot({path:'tmp/y_course.png',fullPage:true});
console.log(await p.evaluate(()=>[...document.querySelector('#view').children].map(c=>{const r=c.getBoundingClientRect();return (c.tagName+'.'+(c.className||'')).slice(0,26)+' h='+Math.round(r.height)+' | '+c.innerText.replace(/\s+/g,' ').slice(0,60)}).join('\n')));
await b.close()})();
