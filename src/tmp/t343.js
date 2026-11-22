const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
for(const pt of process.argv.slice(2)){await p.evaluate(pt=>{part=isNaN(+pt)?pt:+pt;view="home";sess=null;render();scrollTo(0,0)},pt);await p.waitForTimeout(400);
 const secs=await p.evaluate(()=>[...document.querySelector('#view').children].map(c=>{const r=c.getBoundingClientRect();return (c.tagName+'.'+(c.className||'')).slice(0,30)+' h='+Math.round(r.height)+' | '+c.innerText.replace(/\s+/g,' ').slice(0,60)}));
 console.log('== part',pt);console.log(secs.join('\n'));await p.screenshot({path:`tmp/f_part${pt}.png`,fullPage:true})}
await b.close()})();
