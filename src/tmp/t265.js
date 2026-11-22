const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=5;k.fly={lv:5,done:{0:1,1:1,2:1,3:1,4:1},stars:{},flights:1,pts:0};view="kids";KV={scr:"home"};render()});
console.log('heroes',await p.evaluate(()=>["af","sf","cyb"].map(id=>{let ok=0;for(let i=0;i<30;i++){const Q=kHeroQ(id);if(Q.o[Q.a])ok++}return id+":"+ok}).join(' ')),await p.evaluate(()=>KCATS.length+" cats, "+KROT.length+" rot"));
await p.evaluate(()=>{KV={scr:"fly"};kFly=null;render()});await p.screenshot({path:'k35menu.png',fullPage:true});
// formation
await p.click('[data-kflym="6"]');await p.waitForTimeout(400);
await p.evaluate(()=>{window.__ap=setInterval(()=>{const F=kFly;if(!F||F.q)return;const L=kFlyLead(F),P=F.P;const tx=L.x-Math.sin(L.psi)*90,tz=L.z-Math.cos(L.psi)*90;const br=Math.atan2(tx-P.x,tz-P.z)-P.psi,rel=Math.atan2(Math.sin(br),Math.cos(br));F.stick.x=Math.max(-1,Math.min(1,rel*2.5-P.ph*1.2+(-.33-P.ph)*.5));F.stick.y=Math.max(-1,Math.min(1,(L.y-P.y)/30-P.th*3));const d=Math.hypot(tx-P.x,tz-P.z);P.thr=Math.max(.2,Math.min(1,.5+(d-40)/300))},50)});
await p.waitForTimeout(5000);await p.screenshot({path:'k35form.png'});
for(let i=0;i<16&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(2500);
console.log('formation',await p.evaluate(()=>[kFly.formT.toFixed(1),Math.round(kFly.leadD),!!kFly.q,kFly.q&&kFly.q.q]));
await p.evaluate(()=>clearInterval(window.__ap));
// sound barrier
await p.evaluate(()=>{kFly.q=null;kFly.lv=7;kFlyReset(kFly);render()});await p.waitForTimeout(300);await p.click('[data-kfly="burn"]');await p.evaluate(()=>{kFly.P.thr=1;kFly.stick={x:0,y:0}});
await p.evaluate(()=>{window.__ap=setInterval(()=>{const F=kFly;if(!F||F.q)return;F.stick.y=Math.max(-1,Math.min(1,(700-F.P.y)/200-F.P.th*4))},50)});
for(let i=0;i<20&&!(await p.evaluate(()=>!!kFly.boom));i++)await p.waitForTimeout(1000);await p.waitForTimeout(300);await p.screenshot({path:'k35boom.png'});
for(let i=0;i<5&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(800);
console.log('boom',await p.evaluate(()=>[Math.round(kFly.P.v),Math.round(kFly.P.y),kFly.boom,!!kFly.q]));await p.evaluate(()=>clearInterval(window.__ap));
// SAR
await p.evaluate(()=>{kFly.q=null;kFly.lv=8;kFlyReset(kFly);render();Object.assign(kFly.P,{x:KFLYSAR.x,z:KFLYSAR.z-600,y:120,psi:0,v:45,thr:.45})});
for(let i=0;i<10&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(1000);await p.screenshot({path:'k35sar.png'});
console.log('sar',await p.evaluate(()=>[!!kFly.q,kFly.q&&kFly.q.msg]));
// rocket watch booster
await p.evaluate(()=>{kFly.q=null;kFly.lv=3;kFlyReset(kFly);render();Object.assign(kFly.P,{x:KFLYPAD.x+200,z:KFLYPAD.z-1400,y:300,psi:0,v:45,thr:.5})});
await p.waitForTimeout(9000);await p.screenshot({path:'k35booster.png'});for(let i=0;i<8&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(1000);
console.log('rocket',await p.evaluate(()=>[kFly.rocket.t.toFixed(1),!!kFly.bland,!!kFly.q]));
console.log('errors',JSON.stringify(errs));await b.close()})();
