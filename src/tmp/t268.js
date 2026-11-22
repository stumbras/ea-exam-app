const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=5;k.fly={lv:5,done:{0:1,1:1,2:1,3:1,4:1,6:1,7:1,8:1,9:1},stars:{},flights:1,pts:0};view="kids";KV={scr:"fly"};kFly=null;render()});
// heli
await p.click('[data-kflym="8"]');await p.waitForTimeout(400);console.log('heli',await p.evaluate(()=>[kFly.P.heli,kFly.P.jet]));
await p.evaluate(()=>{window.__ap=setInterval(()=>{const F=kFly;if(!F||F.q)return;const P=F.P,d=Math.hypot(KFLYSAR.x-P.x,KFLYSAR.z-P.z);const br=Math.atan2(KFLYSAR.x-P.x,KFLYSAR.z-P.z)-P.psi,rel=Math.atan2(Math.sin(br),Math.cos(br));F.stick.x=Math.max(-1,Math.min(1,rel*2));F.stick.y=d>300?1:d>60?d/400:0;P.thr=d<150?(P.y>30?.35:.5):(P.y<200?.65:.5)},50)});
await p.waitForTimeout(6000);await p.screenshot({path:'k36heli.png'});
for(let i=0;i<30&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(2000);
console.log('heli sar',await p.evaluate(()=>[!!kFly.q,Math.round(Math.hypot(KFLYSAR.x-kFly.P.x,KFLYSAR.z-kFly.P.z)),Math.round(kFly.P.y),kFly.crashT>0]));
await p.evaluate(()=>clearInterval(window.__ap));
// drone
await p.evaluate(()=>{kFly.q=null;kFly.lv=9;kFlyReset(kFly);render()});await p.waitForTimeout(300);console.log('drone',await p.evaluate(()=>[kFly.P.drone,KFLYM[9].n]));
for(let i=0;i<3;i++){await p.evaluate(i=>{const t=KFLYREC[i];Object.assign(kFly.P,{x:t[0]-50,z:t[1],y:300,v:30})},i);await p.waitForTimeout(200);if(i==0)await p.screenshot({path:'k36drone.png'});await p.click('[data-kfly="snap"]').catch(()=>{});await p.waitForTimeout(400)}
console.log('recon',await p.evaluate(()=>[JSON.stringify(kFly.photo),!!kFly.q]));
// missile
await p.evaluate(()=>{kFly.q=null;kFly.lv=10;kFlyReset(kFly);render()});await p.waitForTimeout(300);
await p.evaluate(()=>{window.__ap=setInterval(()=>{const F=kFly;if(!F||F.q)return;const P=F.P,g=F.tg.find(t=>!t.dead);if(!g)return;const br=Math.atan2(g.x-P.x,g.z-P.z)-P.psi,rel=Math.atan2(Math.sin(br),Math.cos(br));F.stick.x=Math.max(-1,Math.min(1,rel*3-P.ph));F.stick.y=Math.max(-1,Math.min(1,(g.y-P.y)/60-P.th*3));if(F.lock>=0&&F.ms.length===0)kFlyFire(F)},60)});
await p.waitForTimeout(8000);await p.screenshot({path:'k36miss.png'});
for(let i=0;i<20&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(2000);
console.log('missile',await p.evaluate(()=>[kFly.hits,kFly.ammo,!!kFly.q,kFly.crashT>0]));await p.evaluate(()=>clearInterval(window.__ap));
// tired rule
console.log('tired',await p.evaluate(()=>{for(let i=0;i<3;i++)kRotDone("q:math");return [kRotTired("q:math"),kRotPicks(3).map(x=>x[0]).join(',')]}));
console.log('errors',JSON.stringify(errs));await b.close()})();
