const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;k.fly={lv:1,done:{0:1},stars:{0:3},flights:1,pts:150};view="kids";KV={scr:"fly"};kFly=null;render()});
await p.click('[data-kfly="plane"]');await p.waitForTimeout(200);console.log('plane',await p.evaluate(()=>S.kids.fly.plane));
await p.click('[data-kflym="0"]');await p.waitForTimeout(500);
await p.evaluate(()=>{kFly.P.thr=1});await p.waitForTimeout(4500);console.log('roll',await p.evaluate(()=>[Math.round(kFly.P.v),kFly.P.jet,kFly.tip]));
await p.evaluate(()=>{kFly.stick.y=1});await p.waitForTimeout(2500);await p.evaluate(()=>{kFly.stick.y=0});await p.screenshot({path:'k31jet.png'});
for(let i=0;i<8&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(1500);
console.log('m0 jet',await p.evaluate(()=>[Math.round(kFly.P.y),Math.round(kFly.P.v),!!kFly.q]));
// jet landing
await p.evaluate(()=>{kFly.q=null;kFly.lv=2;kFlyReset(kFly);render()});await p.waitForTimeout(300);
await p.click('[data-kfly="gear"]');await p.click('[data-kfly="flaps"]');await p.evaluate(()=>{kFly.P.thr=.3});
for(let i=0;i<30;i++){await p.waitForTimeout(2000);const st=await p.evaluate(()=>[Math.round(kFly.P.y),Math.round(kFly.P.z),Math.round(kFly.P.v),kFly.P.gnd,!!kFly.q,kFly.crashT>0]);if(st[3]&&!st[4])await p.evaluate(()=>{kFly.P.thr=0});if(i%4==0||st[4]||st[5])console.log('app',st);if(st[4]||st[5])break}
console.log('errors',JSON.stringify(errs));await b.close()})();
