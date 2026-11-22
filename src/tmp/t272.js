const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=4;view="kids";KV={scr:"fly"};kFly=null;render()});await p.screenshot({path:'k40menu.png',fullPage:true});
await p.click('[data-kflym="0"]');await p.waitForTimeout(500);console.log('chk',await p.evaluate(()=>[!!kFly.chk,kFly.P.ac,kFly.chk&&kFly.chk.items.length]));await p.screenshot({path:'k40chk.png'});
for(let i=0;i<6;i++){await p.click(`[data-kfchk="${i}"]`);await p.waitForTimeout(80)}console.log('chk done',await p.evaluate(()=>!kFly.chk));
await p.evaluate(()=>{kFly.P.thr=1});await p.waitForTimeout(4500);await p.evaluate(()=>{kFly.stick.y=1});await p.waitForTimeout(2500);await p.click('[data-kfly="cock"]');await p.waitForTimeout(600);await p.screenshot({path:'k40cock.png'});
for(let i=0;i<8&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(1500);console.log('c172 m0',await p.evaluate(()=>[Math.round(kFly.P.y),!!kFly.q,S.kids.tix]));
// 737 island hop quick takeoff
await p.evaluate(()=>{kFly.q=null;kFly.cock=false;kFly.lv=4;kFlyReset(kFly);kFly.chk=null;render()});await p.evaluate(()=>{kFly.P.thr=1});await p.waitForTimeout(11000);console.log('737 roll',await p.evaluate(()=>[kFly.P.ac,Math.round(kFly.P.v),kFly.P.gnd]));await p.evaluate(()=>{kFly.stick.y=1});await p.waitForTimeout(2500);await p.screenshot({path:'k40b737.png'});console.log('737 air',await p.evaluate(()=>[Math.round(kFly.P.y),kFly.P.gnd]));
await p.evaluate(()=>{KV={scr:"learn",ltr:"pilot"};render()});console.log('pilot track',await p.evaluate(()=>document.body.innerText.includes('The controls')));
console.log('errors',JSON.stringify(errs));await b.close()})();
