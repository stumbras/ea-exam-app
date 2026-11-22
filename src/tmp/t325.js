const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.sound=false;k.tix=20;k.adultUntil=Date.now()+9e5;k.guided=false;k.warm={day:kToday(),start:Date.now(),sec:400,n:12,ok:10,done:1,les:1,last:[],p0:0};k.lastSeen=Date.now();persist();
  // make every frame slow
  const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=f=>raf(ts=>{const t0=performance.now();while(performance.now()-t0<32){}f(ts)});
  kDriveStart("m3");render()});
await p.waitForTimeout(16000);await p.evaluate(()=>{if(kDrv&&kDrv.over){kDriveStart("m3");render()}});await p.waitForTimeout(1500);
console.log('after slow',await p.evaluate(()=>{const c=document.querySelector('#kdrv');const real=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,"width").get.call(c);return JSON.stringify({hd:c._hd,logical:c.width,real,low:localStorage.getItem("kHdLow"),max:KHD_MAX,t:kDrv&&Math.round(kDrv.t)})}));
await p.screenshot({path:'tmp/o_low.png'});console.log('errors',errs.slice(0,4));await b.close()})();
