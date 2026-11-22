const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;k.fly={lv:4,done:{0:1,1:1,2:0,3:1},stars:{},flights:0,pts:0};view="kids";KV={scr:"home"};render()});
await p.click('[data-k="fly"]');await p.waitForTimeout(300);await p.click('[data-kflym="2"]');await p.waitForTimeout(500);
// rocket mission
await p.evaluate(()=>{kFly.q=null;kFly.lv=3;kFlyReset(kFly);render()});await p.waitForTimeout(300);
await p.evaluate(()=>{window.__ap=setInterval(()=>{const F=kFly;if(!F||F.q)return;const P=F.P;const br=Math.atan2(KFLYPAD.x-P.x,KFLYPAD.z-P.z)-P.psi,rel=Math.atan2(Math.sin(br),Math.cos(br));F.stick.x=Math.max(-1,Math.min(1,rel*2-P.ph));F.stick.y=Math.max(-1,Math.min(1,(200-P.y)/40-P.th*3))},50)});
for(let i=0;i<30&&!(await p.evaluate(()=>kFly.rocket.t>2));i++)await p.waitForTimeout(3000);
await p.waitForTimeout(1500);await p.screenshot({path:'k28rocket.png'});
for(let i=0;i<6&&!(await p.evaluate(()=>!!kFly.q));i++)await p.waitForTimeout(2000);
console.log('rocket',await p.evaluate(()=>[kFly.rocket.t.toFixed(1),!!kFly.q]));
// island quick check: teleport near island approach
await p.evaluate(()=>{clearInterval(window.__ap);kFly.q=null;kFly.lv=4;kFlyReset(kFly);Object.assign(kFly.P,{x:3200,z:2550,y:75,psi:Math.PI/2,v:30,thr:.3,gear:1,flaps:1,gnd:0,th:-.065});kFly.stick={x:0,y:0};render()});
for(let i=0;i<20;i++){await p.waitForTimeout(2000);const st=await p.evaluate(()=>[Math.round(kFly.P.x),Math.round(kFly.P.y),kFly.P.gnd,!!kFly.q,kFly.crashT>0]);if(st[2])await p.evaluate(()=>{kFly.P.thr=0});if(st[3]){console.log('island ok',st);break}}
await p.screenshot({path:'k28isl.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
