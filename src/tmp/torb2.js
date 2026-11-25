const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(3000);
const r=await p.evaluate(()=>{const k=KS();k.tix=9;k.setup=1;k.name="T";k.bday={m:5,d:5,y:2016};view="kids";KV={scr:"orbit"};kOrbNew();const D=kOrb;
 // put in a circular 120 km orbit directly
 const r0=KORB.R+120e3,v0=Math.sqrt(KORB.GM/r0);D.landed="";D.x=r0;D.y=0;D.vx=0;D.vy=v0;D.t=100;
 const res=[];for(let ph=0;ph<12;ph++){const S=JSON.parse(JSON.stringify(D));S.mAng=ph*Math.PI/6;kOrb=S;
   S.sas="pro";for(let i=0;i<40000;i++){const el=kOrbEl(S);if(el.ap>11.95e6)break;S.ang=Math.atan2(el.vx,el.vy);S.thr=true;kOrbStep(S,0.05)}S.thr=false;
   let soi=0,minD=1e12;for(let i=0;i<4000;i++){for(let j=0;j<10;j++)kOrbStep(S,2);const m=kOrbMoon(S);const d=Math.hypot(S.x-m.x,S.y-m.y);minD=Math.min(minD,d);if(d<KORB.MSOI){soi=1;break}}
   res.push([ph,soi,Math.round(minD/1e3),Math.round(S.fuel)])}
 return res});
console.log(JSON.stringify(r),errs);await b.close()})();
