const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;k.fly={lv:5,done:{0:1,1:1,2:1,3:1,4:1,6:1,7:1,8:1,9:1,10:1},stars:{},flights:1,pts:0};view="kids";KV={scr:"fly"};kFly=null;render()});
await p.click('[data-kflym="11"]');await p.waitForTimeout(1200);await p.screenshot({path:'k39nav.png'});
for(const [g,alt] of [["F3",400],["F5",600],["D5",300]]){await p.evaluate(([g,alt])=>{const c=kGridC(g);Object.assign(kFly.P,{x:c.x,z:c.z,y:alt})},[g,alt]);await p.waitForTimeout(3200)}
console.log('nav',await p.evaluate(()=>[kFly.navI,!!kFly.q,kFly.q&&kFly.q.msg]));
console.log('errors',JSON.stringify(errs));await b.close()})();
