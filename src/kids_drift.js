/* ---------- 🏁 Brick Bay drifting: skid marks on sharp fast turns, tire smoke, drift combos pay city cash, "Drift King" trophy ---------- */
function kDrInit(D){if(!D.dr)D.dr={m:[],cur:0,best:0,tot:0,last:null,cool:0}}
function kDrStep(D,dt,sp){kDrInit(D);const R=D.dr,me=D.me;R.cool=Math.max(0,R.cool-dt);
  for(const m of R.m)m.t+=dt;if(R.m.length&&R.m[0].t>9)R.m=R.m.filter(m=>m.t<9);
  if(D.air||D.foot||(me.jump>0)){R.cur=0;R.last=null;return}
  const lat=Math.abs(me.vx*Math.cos(me.a)+me.vy*Math.sin(me.a)),drifting=sp>110&&lat>70;
  if(drifting){R.cur+=dt;const px=Math.cos(me.a)*9,py=Math.sin(me.a)*9,bx=me.x-Math.sin(me.a)*12,by=me.y+Math.cos(me.a)*12,pt=[bx-px,by-py,bx+px,by+py];
    if(R.last)R.m.push({a:R.last,b:pt,t:0});R.last=pt;if(R.m.length>500)R.m.splice(0,R.m.length-500);
    if(Math.random()<dt*18&&D.cr)D.cr.p.push({k:"smoke",x:bx,y:by,vx:(Math.random()-.5)*20,vy:(Math.random()-.5)*20,r:6+Math.random()*6,life:.9,t:0});
    if(R.cur>.25&&Math.floor((R.cur-dt)*4)!==Math.floor(R.cur*4)&&Math.random()<.5)kBeep&&kBeep("tick")}
  else{if(R.cur>.9&&!R.cool){const s=Math.round(R.cur*10)/10,pay=Math.min(60,Math.round(R.cur*8));D.money=(D.money||0)+pay;R.tot+=R.cur;R.best=Math.max(R.best,R.cur);R.cool=.6;
      kCtFx({k:"txt",x:me.x,y:me.y-44,txt:`🏁 DRIFT ${s}s! +$${pay}${R.cur>=R.best&&R.cur>2?" · best!":""}`,big:R.cur>2?1:0,small:R.cur>2?0:1});
      if(R.cur>2.5&&typeof kTrophy==="function")kTrophy("citydrift","🏁","Drift King!","Held a 2.5-second drift in Brick Bay City.");
      if(R.tot>20&&typeof kTrophy==="function")kTrophy("citydrift20","🛞","Tire Smoke Legend","Drifted 20 seconds in total around Brick Bay.")}
    R.cur=0;R.last=null}}
function kDrDraw(c,D){const R=D.dr;if(!R||!R.m.length)return;c.save();c.lineCap="round";c.lineWidth=3.5;
  for(const m of R.m){const al=Math.max(0,.55*(1-m.t/9));if(al<=0)continue;c.strokeStyle=`rgba(20,20,24,${al})`;c.beginPath();c.moveTo(m.a[0],m.a[1]);c.lineTo(m.b[0],m.b[1]);c.moveTo(m.a[2],m.a[3]);c.lineTo(m.b[2],m.b[3]);c.stroke()}
  c.restore()}
if(typeof kCtCrashStep==="function"){const _s=kCtCrashStep;kCtCrashStep=function(D,dt,sp){_s(D,dt,sp);try{kDrStep(D,dt,sp)}catch(_){}}}
if(typeof kCtCrashDraw==="function"){const _d=kCtCrashDraw;kCtCrashDraw=function(c,D,dt){try{kDrDraw(c,D)}catch(_){}_d(c,D,dt)}}
