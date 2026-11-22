const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=9;k.fly={lv:5,done:{0:1,1:1,2:1,3:1,4:1,6:1,7:1,8:1,9:1},stars:{},flights:1,pts:0};view="kids";KV={scr:"fly"};kFly=null;render()});
for(const lv of [8,9,10]){await p.evaluate(lv=>{if(!kFly){kFlyStart(lv);render()}else{kFly.q=null;kFly.lv=lv;kFlyReset(kFly);render()}},lv);await p.waitForTimeout(1500);
 if(lv===9){await p.evaluate(()=>{const t=KFLYREC[0];Object.assign(kFly.P,{x:t[0]-50,z:t[1],y:300})});await p.waitForTimeout(100);await p.click('[data-kfly="snap"]')}
 if(lv===10){await p.evaluate(()=>{const g=kFly.tg[0];Object.assign(kFly.P,{x:g.x,z:g.z-1500,y:g.y,psi:0,th:0})});await p.waitForTimeout(1500);await p.click('[data-kfly="fire"]');await p.waitForTimeout(2500)}
 console.log(lv,await p.evaluate(()=>[KFLYM[kFly.lv].n,kFly.P.heli|0,kFly.P.drone|0,kFly.P.jet|0,JSON.stringify(kFly.photo||null),kFly.hits||0]));await p.screenshot({path:`k37_${lv}.png`})}
console.log('hist',await p.evaluate(()=>["us","eu","as","wh"].map(id=>{let ok=0;for(let i=0;i<20;i++){const Q=kHeroQ(id);if(Q.o[Q.a])ok++}return id+":"+ok}).join(' ')));
console.log('tired',await p.evaluate(()=>{for(let i=0;i<3;i++)kRotDone("q:math");return [kRotTired("q:math"),kRotPicks(3).map(x=>x[0]).join(',')]}));
await p.evaluate(()=>{KV={scr:"home"};render()});await p.evaluate(()=>{KV={scr:"show"};render()});
console.log('errors',JSON.stringify(errs));await b.close()})();
