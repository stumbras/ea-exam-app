const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['iPhone 13'],serviceWorkers:'block'});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(3000);
await p.evaluate(()=>{const k=KS();k.tix=9;k.setup=1;k.name="Tomas";k.bday={m:5,d:5,y:2016};view="kids";KV={scr:"pschool"};render()});await p.waitForTimeout(400);await p.screenshot({path:'/tmp/hv0.png'});
await p.evaluate(()=>{KV={scr:"hover"};render();kHvClick({khv:"go"})});await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/hv1.png'});
await p.evaluate(()=>{kHv.lift=true;kHv.boost=true});await p.waitForTimeout(900);await p.screenshot({path:'/tmp/hv2.png'});
// jump into a tunnel and flip
const r=await p.evaluate(()=>{const D=kHv;D.lift=false;D.boost=false;let t=D.tun[0];if(!t){D.tun.push([D.x+200,D.x+1600]);D.segs.push([D.x-100,D.x+1800]);t=D.tun[D.tun.length-1]}D.segs.push([t[0]-200,t[1]+200]);D.x=t[0]+30;D.y=0;D.vy=0;D.vx=520;D.traffic.push({x:D.x+220,v:150,col:"#1d4ed8",ty:1,seg:[t[0],t[1]],passed:0});kHvFlip();return {flip:D.flip,inv:D.inv,lives:D.lives}});
await p.waitForTimeout(500);await p.screenshot({path:'/tmp/hv3.png'});
console.log(JSON.stringify(r),errs);await b.close()})();
