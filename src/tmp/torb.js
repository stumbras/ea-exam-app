const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['iPhone 13'],serviceWorkers:'block'});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(3000);
await p.evaluate(()=>{const k=KS();k.tix=9;k.setup=1;k.name="Tomas";k.bday={m:5,d:5,y:2016};view="kids";KV={scr:"pschool"};render()});await p.waitForTimeout(500);await p.screenshot({path:'/tmp/orb0.png'});
await p.evaluate(()=>{KV={scr:"orbit"};render()});await p.waitForTimeout(500);await p.screenshot({path:'/tmp/orb1.png'});
await p.evaluate(()=>{kOrbClick({korb:"launch"})});await p.waitForTimeout(300);
await p.evaluate(()=>{kOrb.thr=true});await p.waitForTimeout(2500);await p.screenshot({path:'/tmp/orb2.png'});
// autopilot: simulate quickly in JS (not real time) to check orbit is reachable
const r=await p.evaluate(()=>{const D=kOrb;let log=[];for(let i=0;i<20000;i++){const el=kOrbEl(D);
   if(el.alt<9000)D.ang=0;else if(el.ap<110e3)D.ang=Math.min(1.35,0.0+(el.alt-9000)/40000*1.4);
   D.thr=el.ap<110e3; if(!D.thr&&el.alt>100e3&&el.pe<75e3&&Math.abs(el.rx*el.vx+el.ry*el.vy)/el.v/Math.hypot(el.rx,el.ry)<0.05){D.sas="pro";D.thr=true}
   if(el.pe>80e3){D.thr=false}
   kOrbSim(D,0.05);if(D.over)break;if(i%2000==0)log.push([Math.round(el.alt/1e3),Math.round(el.v),Math.round(el.ap/1e3),Math.round(el.pe/1e3),Math.round(D.fuel)])}
  const el=kOrbEl(D);return {log,alt:el.alt,ap:el.ap,pe:el.pe,fuel:D.fuel,done:KS().orb.done,over:D.over}});
console.log(JSON.stringify(r));await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/orb3.png'});
await p.evaluate(()=>{const D=kOrb;D.mAng=Math.PI*3/6+Math.atan2(D.y,D.x);D.sas='pro';for(let i=0;i<40000;i++){const el=kOrbEl(D);if(el.ap>11.95e6)break;D.ang=Math.atan2(el.vx,el.vy);D.thr=true;kOrbStep(D,0.05)}D.thr=false;D.zoom=4;D.predT=0});await p.waitForTimeout(800);await p.screenshot({path:'/tmp/orb4.png'});
console.log(errs);await b.close()})();
