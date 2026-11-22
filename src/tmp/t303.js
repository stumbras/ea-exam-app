const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.guided=false;k.tix=9;k.fly={lv:5,done:{0:1,1:1,2:1,3:1,4:1},stars:{},flights:0,pts:0};persist();kFlyStart(2);render()});await p.waitForTimeout(1500);
const log=await p.evaluate(()=>new Promise(res=>{const F=kFly,P=F.P,rw=KFLYRW[0];F.chk=null;F.q=null;F.atc.q=null;F.atc.said={tko:1,climb:1,land:1,traffic:1,wx:1};F.em={on:false};F.easy=1;Object.assign(P,{x:rw.cx,z:rw.cz-300,y:40,gnd:0,v:18,thr:0,th:0,ph:0,gear:1,flaps:1,psi:rw.hd});const out=[];let n=0;const iv=setInterval(()=>{n++;out.push(`t${(n*.2).toFixed(1)} y${P.y.toFixed(1)} v${P.v.toFixed(1)} th${P.th.toFixed(2)} gnd${P.gnd} crash${F.crashT>0?1:0} scr${KV.scr} raf${kFlyRAF}`);if(n>=20){clearInterval(iv);res(out.join("\n"))}},200)}));
console.log(log);console.log('errors',JSON.stringify(errs));await b.close()})();
