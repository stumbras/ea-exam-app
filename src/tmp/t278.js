const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
console.log('part',await p.evaluate(()=>part),await p.evaluate(()=>drillKeys().length),await p.evaluate(()=>drillKeys().filter(k=>/^v\d/.test(k)).join(',')));
await p.evaluate(()=>{view="home";render()});await p.waitForTimeout(300);console.log('has smart btn',await p.evaluate(()=>!!document.querySelector('[data-tdrgo="_rev"]')),'video header',await p.evaluate(()=>document.body.innerText.includes('By course video')));
// run v14 drill answering first wrong then right
await p.evaluate(()=>{const b=document.querySelector('[data-tdrgo="v14"]');b.click()});await p.waitForTimeout(300);
let n=0;for(let i=0;i<20;i++){const st=await p.evaluate(()=>{if(!tv.dord)return'none';if(tv.dri>=tv.dord.length)return'end';const [dk,qi]=tv.dord[tv.dri],q=DRILL[dk].q[qi];const wrong=tv.dri===0?(q[2]+1)%q[1].length:q[2];document.querySelector(`[data-tdra="${wrong}"]`).click();return tv.dord.length});if(st==='end'||st==='none')break;await p.waitForTimeout(60);await p.evaluate(()=>{const b=document.querySelector('[data-tdrn]');if(b)b.click()});await p.waitForTimeout(60);n++}
console.log('answered',n,'end text',await p.evaluate(()=>document.querySelector('h2').innerText),await p.evaluate(()=>JSON.stringify(Object.keys(DQ()).length)),'due',await p.evaluate(()=>drDueCount()));
await p.evaluate(()=>{const b=document.querySelector('[data-tdr="_rev"]');if(b)b.click()});await p.waitForTimeout(200);console.log('review',await p.evaluate(()=>[tv.dr,tv.dord&&tv.dord.length]));
await p.screenshot({path:'k45ea.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
