const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;view="kids";KV={scr:"home"};render()});
await p.click('[data-k="fly"]');await p.waitForTimeout(400);await p.screenshot({path:'k28menu.png',fullPage:true});
await p.click('[data-kflym="0"]');await p.waitForTimeout(800);await p.screenshot({path:'k28rw.png'});
// takeoff: full throttle, then pull up
await p.evaluate(()=>{kFly.P.thr=1});await p.waitForTimeout(6000);
await p.evaluate(()=>{kFly.stick.y=1});await p.waitForTimeout(2500);await p.screenshot({path:'k28climb.png'});
await p.waitForTimeout(9000);
console.log('m0',await p.evaluate(()=>[Math.round(kFly.P.y),Math.round(kFly.P.v),!!kFly.q,kFly.won]));
if(await p.evaluate(()=>!!kFly.q)){const a=await p.evaluate(()=>kFly.q.a);await p.click(`[data-kfq="${a}"]`);await p.waitForTimeout(200);await p.screenshot({path:'k28quiz.png'});await p.click('[data-kfly="next"]');await p.waitForTimeout(800)}
// ring run: autopilot toward rings
await p.evaluate(()=>{kFly.stick={x:0,y:0};window.__ap=setInterval(()=>{const F=kFly;if(!F||F.q)return;const P=F.P,g=F.rings[F.ringI];if(!g)return;const br=Math.atan2(g.x-P.x,g.z-P.z)-P.psi,rel=Math.atan2(Math.sin(br),Math.cos(br));F.stick.x=Math.max(-1,Math.min(1,rel*3-P.ph*1.5));const dy=g.y-P.y;F.stick.y=Math.max(-1,Math.min(1,dy/30-P.th*3))},50)});
await p.waitForTimeout(4000);await p.screenshot({path:'k28ring.png'});for(let i=0;i<12&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(5000);
console.log('m1',await p.evaluate(()=>[kFly.ringI,!!kFly.q,kFly.lv,kFly.tip]));
await p.evaluate(()=>clearInterval(window.__ap));
if(await p.evaluate(()=>!!kFly.q)){const a=await p.evaluate(()=>kFly.q.a);await p.click(`[data-kfq="${a}"]`);await p.waitForTimeout(200);await p.click('[data-kfly="next"]');await p.waitForTimeout(500)}
// landing: gear, flaps, throttle .3, no stick
await p.click('[data-kfly="gear"]');await p.click('[data-kfly="flaps"]');await p.evaluate(()=>{kFly.P.thr=.3;kFly.stick={x:0,y:0}});await p.waitForTimeout(3000);await p.screenshot({path:'k28app.png'});
for(let i=0;i<14;i++){await p.waitForTimeout(5000);const st=await p.evaluate(()=>[Math.round(kFly.P.y),Math.round(kFly.P.z),Math.round(kFly.P.v),kFly.P.gnd,!!kFly.q,kFly.crashT>0]);if(st[3]&&!st[4])await p.evaluate(()=>{kFly.P.thr=0});if(st[4]||i%4==0)console.log('app',st);if(st[4])break}
await p.screenshot({path:'k28land.png'});console.log('stars',await p.evaluate(()=>[kFly.q&&kFly.q.stars,kFly.sink,JSON.stringify(S.kids.fly.done)]));
console.log('errors',JSON.stringify(errs));await b.close()})();
