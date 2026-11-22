const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.guided=false;k.tix=9;k.fly={lv:5,done:{0:1,1:1,2:1,3:1,4:1},stars:{},flights:0,pts:0};persist();kFlyStart(2);render()});await p.waitForTimeout(2500);
console.log('weather',await p.evaluate(()=>kFly.wx.t),'atc q',await p.evaluate(()=>kFly.atc.q&&kFly.atc.q.text.slice(0,70)));
await p.screenshot({path:'tmp/fly1.png'});
const a=await p.evaluate(()=>kFly.atc.q&&kFly.atc.q.a);if(a!=null){await p.click(`[data-katc="${a}"]`);await p.waitForTimeout(500)}
console.log('after answer pts',await p.evaluate(()=>kFly.pts),'panel',await p.evaluate(()=>document.querySelector('.kfatc')?.innerText.slice(0,60)));
// cheat test: airborne over runway, throttle 0, slow
console.log("state",await p.evaluate(()=>JSON.stringify({chk:!!kFly.chk,q:!!kFly.q,over:kFly.over,crash:kFly.crashT,lv:kFly.lv,gnd:kFly.P.gnd})));const cheat=await p.evaluate(()=>new Promise(res=>{const F=kFly,P=F.P,rw=KFLYRW[0];F.chk=null;F.q=null;requestAnimationFrame(kFlyLoop);F.easy=1;Object.assign(P,{x:rw.cx,z:rw.cz-300,y:40,gnd:0,v:18,thr:0,th:0,ph:0,gear:1,flaps:1,psi:rw.hd});F.atc.q=null;F.atc.said={tko:1,climb:1,land:1,traffic:1,wx:1};F.em={on:false};let n=0;const iv=setInterval(()=>{n++;if(F.crashT>0||P.gnd||n>200){clearInterval(iv);res(F.crashT>0?"CRASH: "+F.crashMsg.slice(0,60):P.gnd?"landed sink "+(F.sink||0).toFixed(1):"still flying")}},50)}));
console.log('throttle-off cheat →',cheat);
await p.screenshot({path:'tmp/fly2.png'});
await p.waitForTimeout(3800);
// proper approach
const good=await p.evaluate(()=>new Promise(res=>{const F=kFly,P=F.P,rw=KFLYRW[0];F.wx.turb=0;F.wx.wx=0;F.wx.wz=0;const vs=kFlyStall(P);Object.assign(P,{x:rw.cx,z:rw.cz-500,y:30,gnd:0,v:vs*1.3,thr:.35,th:-.05,ph:0,gear:1,flaps:1,psi:rw.hd});F.crashT=0;let n=0;const iv=setInterval(()=>{n++;if(P.y<6)F.stick.y=.25;if(F.crashT>0||P.gnd||n>300){clearInterval(iv);F.stick.y=0;res(F.crashT>0?"CRASH: "+F.crashMsg.slice(0,70):P.gnd?"landed OK sink "+(F.sink||0).toFixed(1)+" v "+P.v.toFixed(1)+" vs "+vs:"still flying")}},50)}));
console.log('proper approach →',good);
// storm visuals
await p.evaluate(()=>{const F=kFly;F.wx=Object.assign(kFxWeather(F),{t:"storm",rain:170,s0:"#2b3140",s1:"#5c6472",turb:1.15,col:"rgba(98,104,120,.95)",n:65,nm:"⛈️ Thunderstorm"});kFxClouds(F);Object.assign(F.P,{y:200,gnd:0,v:40,thr:.7});F.fx.flash=.6;F.em={type:"engine",on:false,at:0,thrMul:null};F.airT=10});await p.waitForTimeout(1200);
await p.screenshot({path:'tmp/fly3.png'});
console.log('emergency',await p.evaluate(()=>kFly.em.on+" "+kFly.em.title+" | atc: "+(kFly.atc.q&&kFly.atc.q.key)));
console.log('errors',JSON.stringify(errs));await b.close()})();
