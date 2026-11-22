const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
const n=await p.evaluate(()=>KFLYM.length);
for(let lv=0;lv<n;lv++){await p.evaluate(lv=>{const k=KS();k.setup=1;k.name="Tomas";k.guided=false;k.tix=99;k.fly={lv:12,done:{0:1,1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1},stars:{},flights:0,pts:0};kFly=null;kFlyStart(lv);if(kFly){kFly.chk=null;Object.assign(kFly.P,{thr:.6})}render()},lv);await p.waitForTimeout(1600);
 console.log(lv,await p.evaluate(()=>kFly?`${KFLYM[kFly.lv].n} · ${kFly.wx?kFly.wx.t:"-"} · em ${kFly.em&&kFly.em.type} · crash ${kFly.crashT>0}`:"no fly"))}
console.log('errors',JSON.stringify(errs.slice(0,3)));await b.close()})();
