/* ================= 🪐 Orbit Lab: real orbital physics (Pilot School) =================
   A small solar system with real-style gravity: an Earth (radius 600 km, g = 9.81 m/s²) and a Moon (radius 200 km,
   g = 1.62 m/s²) that really orbits the Earth. Newton's gravity from both bodies, air drag below 70 km, re-entry heat,
   a parachute, time warp, and a predicted-path line computed ahead of time, the same idea real mission planners use.
   The HUD reads apoapsis and periapsis from the orbit itself (vis-viva). Seven missions lead from first liftoff to a Moon
   landing and home again. Each launch uses 1 🎟️ ticket, like the other Pilot School games. */
const KORB={R:600e3,GM:3.53e12,ATM:70e3,MR:200e3,MGM:6.5e10,MA:12e6,MSOI:2.0e6,TH:22,ROT:1.5,FUEL:9000};
const KORBM=[
 {ic:"🚀",n:"Reach space",g:"Climb above 100 km, the edge of space (the Kármán line).",tip:"Hold 🔥 THRUST. Go straight up!"},
 {ic:"🛰️",n:"Get into orbit",g:"Make your lowest point (periapsis) higher than 70 km, so you never fall back into the air.",tip:"Gravity turn: at about 10 km, tilt right toward the horizon. In space, burn sideways (➡️ Prograde) until PE goes above 70 km."},
 {ic:"⭕",n:"Perfect circle",g:"Make your orbit almost round: apoapsis and periapsis close together (eccentricity under 0.05).",tip:"Wait until you are at AP (the highest point), then burn ➡️ Prograde to lift PE."},
 {ic:"🌙",n:"Fly to the Moon",g:"Reach the Moon's sphere of influence (where the Moon's gravity wins).",tip:"From a round orbit, burn ➡️ Prograde until AP reaches 12,000 km. Zoom out (🔍 5): if the ghost Moon turns green, you have an encounter! If not, wait (⏩) and try at a different spot."},
 {ic:"🔄",n:"Orbit the Moon",g:"Get captured: make a closed orbit around the Moon with periapsis above 10 km.",tip:"Near the Moon, burn ⬅️ Retrograde at your lowest point to slow down and get captured."},
 {ic:"👨‍🚀",n:"Land on the Moon",g:"Touch down on the Moon slower than 10 m/s.",tip:"Burn ⬅️ Retrograde to drop, then use short burns near the ground. The Moon has no air, so no parachute!"},
 {ic:"🌊",n:"Come home",g:"After visiting the Moon, splash down on Earth slower than 15 m/s.",tip:"Burn toward Earth so your PE dips to about 30 km. The air slows you down (watch the heat!). Open 🪂 below 6 km."}];
let kOrb=null;
function kOrbState(){const k=KS();k.orb=k.orb||{done:{},stars:0,best:0,launches:0};return k.orb}
function kOrbNew(){const o=kOrbState();
  kOrb={x:0,y:KORB.R+4,vx:0,vy:0,ang:0,thr:false,l:false,r:false,fuel:KORB.FUEL,t:0,warp:1,landed:"earth",sas:"",zoom:-1,mAng:2.4,trail:[],fx:[],stars:[],last:0,
    pre:1,Q:(typeof kLandQ==="function"?kLandQ():null),shake:0,chute:false,heat:0,maxAlt:0,visMoon:false,said:{},over:false,res:"",goal:Math.min(Object.keys(o.done).length,KORBM.length-1),pred:null,predT:0,msg:"",msgT:0};
  for(let i=0;i<140;i++)kOrb.stars.push([Math.random(),Math.random(),Math.random()*1.4+.3,Math.random()*6.3]);
  o.launches++;persist()}
function kOrbMoon(D){const a=D.mAng;return{x:KORB.MA*Math.cos(a),y:KORB.MA*Math.sin(a)}}
function kOrbAcc(x,y,mx,my){const r2=x*x+y*y,r=Math.sqrt(r2),g=KORB.GM/(r2*r);let ax=-x*g,ay=-y*g;const dx=x-mx,dy=y-my,d2=dx*dx+dy*dy,d=Math.sqrt(d2),gm=KORB.MGM/(d2*d);ax-=dx*gm;ay-=dy*gm;return[ax,ay]}
// orbit numbers around the body whose gravity wins
function kOrbEl(D){const m=kOrbMoon(D),dmx=D.x-m.x,dmy=D.y-m.y,dm=Math.hypot(dmx,dmy),inMoon=dm<KORB.MSOI;
  const mw=Math.sqrt(KORB.GM/KORB.MA**3),mvx=-Math.sin(D.mAng)*mw*KORB.MA,mvy=Math.cos(D.mAng)*mw*KORB.MA;
  const rx=inMoon?dmx:D.x,ry=inMoon?dmy:D.y,vx=inMoon?D.vx-mvx:D.vx,vy=inMoon?D.vy-mvy:D.vy,mu=inMoon?KORB.MGM:KORB.GM,R=inMoon?KORB.MR:KORB.R;
  const r=Math.hypot(rx,ry),v=Math.hypot(vx,vy),E=v*v/2-mu/r,h=rx*vy-ry*vx,e=Math.sqrt(Math.max(0,1+2*E*h*h/(mu*mu)));
  let ap=Infinity,pe;if(E<0){const a=-mu/(2*E);ap=a*(1+e)-R;pe=a*(1-e)-R}else{pe=h*h/(mu*(1+e))-R}
  return{body:inMoon?"moon":"earth",alt:r-R,v,ap,pe,e,E,vx,vy,rx,ry,dm}}
function kOrbFmt(m){if(!isFinite(m))return"escape";const a=Math.abs(m);return(m<0?"−":"")+(a>=1e6?(a/1e3).toLocaleString(undefined,{maximumFractionDigits:0})+" km":a>=1e4?(a/1e3).toFixed(0)+" km":a>=1e3?(a/1e3).toFixed(1)+" km":Math.round(a)+" m")}
function kOrbSay(D,key,txt){if(D.said[key])return;D.said[key]=1;D.msg=txt;D.msgT=4;kLine(txt,2)}
function kOrbStep(D,h){const m=kOrbMoon(D);let [ax,ay]=kOrbAcc(D.x,D.y,m.x,m.y);const r=Math.hypot(D.x,D.y),alt=r-KORB.R;
  if(D.thr&&D.fuel>0){const a=KORB.TH;ax+=Math.sin(D.ang)*a;ay+=Math.cos(D.ang)*a;D.fuel=Math.max(0,D.fuel-a*h)}
  if(alt<KORB.ATM){const rho=Math.exp(-alt/7000),v=Math.hypot(D.vx,D.vy),k=(D.chute?0.06:0.00008)*rho*v;ax-=D.vx*k;ay-=D.vy*k}
  D.vx+=ax*h;D.vy+=ay*h;D.x+=D.vx*h;D.y+=D.vy*h;D.mAng+=Math.sqrt(KORB.GM/KORB.MA**3)*h;D.t+=h}
function kOrbPredict(D){const P=[],S={x:D.x,y:D.y,vx:D.vx,vy:D.vy,mAng:D.mAng};const el=kOrbEl(D);
  let span;if(el.body==="earth"&&el.E<0){const a=-KORB.GM/(2*el.E);span=Math.min(2*Math.PI*Math.sqrt(a**3/KORB.GM)*1.02,6e5)}else span=el.body==="moon"?8e4:4e5;
  const n=520,h=span/n,sub=6,hh=h/sub;let hit="",minD=1e15,mp=null,pp=null;
  for(let i=0;i<n&&!hit;i++){for(let j=0;j<sub;j++){const mx=KORB.MA*Math.cos(S.mAng),my=KORB.MA*Math.sin(S.mAng);const [ax,ay]=kOrbAcc(S.x,S.y,mx,my);S.vx+=ax*hh;S.vy+=ay*hh;S.x+=S.vx*hh;S.y+=S.vy*hh;S.mAng+=Math.sqrt(KORB.GM/KORB.MA**3)*hh;
      if(Math.hypot(S.x,S.y)<KORB.R){hit="earth";break}if(Math.hypot(S.x-mx,S.y-my)<KORB.MR){hit="moon";break}}
    {const mx=KORB.MA*Math.cos(S.mAng),my=KORB.MA*Math.sin(S.mAng),d=Math.hypot(S.x-mx,S.y-my);if(d<minD){minD=d;mp=[mx,my];pp=[S.x,S.y]}}
    P.push([S.x,S.y])}
  D.pred={P,hit,minD,mp,pp}}
function kOrbSim(D,dt){if(D.over)return;
  const el0=kOrbEl(D);if((D.thr&&D.fuel>0)||(el0.body==="earth"&&el0.alt<KORB.ATM)||(el0.body==="moon"&&el0.alt<30e3))D.warp=1;
  // steering: hold buttons, or SAS points the nose
  if(D.l)D.ang-=KORB.ROT*dt;if(D.r)D.ang+=KORB.ROT*dt;if(D.tilt&&Math.abs(D.tg||0)>.08){D.ang+=KORB.ROT*dt*Math.max(-1,Math.min(1,D.tg));D.sas=""}
  if(D.sas&&!D.l&&!D.r&&!D.landed){const el=el0;let tx,ty;if(D.sas==="pro"){tx=el.vx;ty=el.vy}else if(D.sas==="retro"){tx=-el.vx;ty=-el.vy}else{tx=el.rx;ty=el.ry}
    const want=Math.atan2(tx,ty);let d=want-D.ang;d=Math.atan2(Math.sin(d),Math.cos(d));D.ang+=Math.max(-KORB.ROT*dt,Math.min(KORB.ROT*dt,d))}
  if(D.landed){const thrusting=D.thr&&D.fuel>0;if(!thrusting){if(D.landed==="moon"){const m=kOrbMoon(D);const mw=Math.sqrt(KORB.GM/KORB.MA**3);D.mAng+=mw*dt;const m2=kOrbMoon(D);D.x+=m2.x-m.x;D.y+=m2.y-m.y;D.vx=-Math.sin(D.mAng)*mw*KORB.MA;D.vy=Math.cos(D.mAng)*mw*KORB.MA}D.t+=dt;return}D.landed="";D.shake=1.2;kBeep("whoosh");kFxFlash(D,"255,237,213",.5);kFxBuzz([100,50,100,50,100]);kOrbSay(D,"lift","Liftoff! We have liftoff!")}
  let T=dt*D.warp;const maxH=(D.thr||el0.alt<200e3)?0.02:0.2,n=Math.min(600,Math.ceil(T/maxH)),h=T/n;
  for(let i=0;i<n;i++){kOrbStep(D,h);if(kOrbHit(D))return}
  if(D.trail.length===0||D.t-D.trail[D.trail.length-1][2]>Math.max(.5,D.warp*.4)){D.trail.push([D.x,D.y,D.t]);if(D.trail.length>500)D.trail.shift()}
  kOrbGoals(D)}
function kOrbHit(D){const r=Math.hypot(D.x,D.y);if(r<KORB.R){const v=Math.hypot(D.vx,D.vy);if(D.t<3&&!D.visMoon){D.x=0;D.y=KORB.R+4;D.vx=D.vy=0;D.landed="earth";return true}
    if(v<15){D.x*=KORB.R/r;D.y*=KORB.R/r;D.vx=D.vy=0;D.landed="earth";if(D.visMoon){kOrbWin(D,6);D.over=true;D.res="home";kOrbSay(D,"home","Splashdown! Mission accomplished: Earth to the Moon and back!")}else{kOrbSay(D,"splash"+Math.round(D.t),"Splashdown! Welcome back to Earth.");D.over=true;D.res="home"}}else kOrbCrash(D,`Hit the ${D.chute?"water":"ground"} at ${Math.round(v)} m/s. Open the 🪂 parachute lower and slower!`);return true}
  const m=kOrbMoon(D),dx=D.x-m.x,dy=D.y-m.y,dm=Math.hypot(dx,dy);if(dm<KORB.MR){const mw=Math.sqrt(KORB.GM/KORB.MA**3),rvx=D.vx+Math.sin(D.mAng)*mw*KORB.MA,rvy=D.vy-Math.cos(D.mAng)*mw*KORB.MA,v=Math.hypot(rvx,rvy);
    if(v<10){D.x=m.x+dx*KORB.MR/dm;D.y=m.y+dy*KORB.MR/dm;D.landed="moon";D.visMoon=true;D.ang=Math.atan2(dx,dy);kOrbWin(D,5);kOrbSay(D,"moonland","The Eagle has landed! You're on the Moon!")}else kOrbCrash(D,`Hit the Moon at ${Math.round(v)} m/s. Slow down to under 10 m/s with short burns!`);return true}return false}
function kOrbCrash(D,why){D.over=true;D.res="crash";D.why=why;kBeep("bad");kFxFlash(D,"249,115,22",.9);D.shake=1.5;try{if(navigator.vibrate)navigator.vibrate([80,40,120])}catch(_){}for(let i=0;i<60;i++)D.fx.push({x:0,y:0,vx:(Math.random()-.5)*260,vy:(Math.random()-.5)*260,l:1.2,c:i%3?"#f97316":"#fde047",s:3+Math.random()*4});setTimeout(()=>{if(kOrb===D&&KV.scr==="orbit"){KV.end=1;render()}},1400)}
function kOrbWin(D,i){const o=kOrbState(),k=KS();if(!o.done[i]){o.done[i]=1;o.stars=Object.keys(o.done).length;k.fly=k.fly||{done:{},pts:0};k.fly.pts=(k.fly.pts||0)+100;kFxFlash(D,"255,255,255",.6);kFxBuzz([40,40,40,40,120]);kT(`${KORBM[i].ic} Mission complete: ${KORBM[i].n}! +100 pilot points`);kBeep("win");
    for(let j=0;j<70;j++)D.fx.push({x:0,y:0,vx:(Math.random()-.5)*300,vy:-Math.random()*300,l:1.6,c:["#22d3ee","#a78bfa","#fde047","#34d399"][j%4],s:3+Math.random()*3});persist()}
  D.goal=Math.min(Object.keys(o.done).length,KORBM.length-1);while(o.done[D.goal]&&D.goal<KORBM.length-1)D.goal++}
function kOrbGoals(D){const el=kOrbEl(D);D.maxAlt=Math.max(D.maxAlt,el.body==="earth"?el.alt:0);
  if(el.body==="earth"&&el.alt>100e3)kOrbWin(D,0);
  if(el.body==="earth"&&el.E<0&&el.pe>KORB.ATM){kOrbWin(D,1);kOrbSay(D,"orbit","You are in orbit! You are falling around the Earth so fast you keep missing it.");if(el.e<0.05)kOrbWin(D,2)}
  if(el.body==="moon"){D.visMoon=true;kOrbWin(D,3);kOrbSay(D,"soi","You entered the Moon's sphere of influence! The Moon's gravity is in charge now.");if(el.E<0&&el.pe>10e3)kOrbWin(D,4)}
  if(el.body==="earth"&&el.alt<KORB.ATM&&el.v>1800&&!D.landed)kOrbSay(D,"heat","Re-entry! The air squeezes and heats up in front of you. Hold steady!");
  if(el.body==="earth"&&el.alt>9e3&&el.alt<14e3&&!D.visMoon&&Math.abs(D.ang)<.15)kOrbSay(D,"turn","Gravity turn time! Tilt right toward the horizon. Orbits need sideways speed!");
  if(D.fuel<=0)kOrbSay(D,"fuel","Out of fuel! Gravity and your speed decide what happens now.")}
// ---------- drawing ----------
const KORBZ=[3e3,30e3,300e3,3e6,16e6];
function kOrbAutoZ(D){const el=kOrbEl(D);const a=el.alt;return a<4e3?0:a<45e3?1:a<600e3?2:el.body==="moon"?3:a<4e6?3:4}
function kOrbDraw(c,D,W,H){const zi=D.zoom<0?kOrbAutoZ(D):D.zoom,half=KORBZ[zi],s=(H/2)/half,el=kOrbEl(D),m=kOrbMoon(D);
  let cx=D.x,cy=D.y;if(zi===4){cx=D.visMoon||el.body==="moon"?m.x*.5:0;cy=D.visMoon||el.body==="moon"?m.y*.5:0}else if(zi===3&&el.body==="moon"){cx=m.x;cy=m.y}
  const sh=D.shake>0?(Math.random()-.5)*6*D.shake:0,sh2=D.shake>0?(Math.random()-.5)*6*D.shake:0;
  const P=(x,y)=>[W/2+(x-cx)*s+sh,H/2-(y-cy)*s+sh2];
  // sky: blue in the air, black in space
  const alt=Math.hypot(D.x,D.y)-KORB.R,air=Math.max(0,Math.min(1,1-alt/KORB.ATM));
  const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,`rgb(${Math.round(5+60*air)},${Math.round(8+120*air)},${Math.round(25+200*air)})`);sky.addColorStop(1,`rgb(${Math.round(5+130*air)},${Math.round(8+190*air)},${Math.round(30+225*air)})`);c.fillStyle=sky;c.fillRect(0,0,W,H);
  for(const st of D.stars){const a=(1-air)*(.45+.45*Math.sin(D.t*.7+st[3]+performance.now()/900));if(a<.03)continue;c.fillStyle=`rgba(255,255,255,${a})`;c.fillRect(st[0]*W,st[1]*H,st[2],st[2])}
  // Earth with atmosphere glow
  const [ex,ey]=P(0,0),eR=KORB.R*s;
  if(eR>2&&zi>=2){const g=c.createRadialGradient(ex,ey,eR*.98,ex,ey,(KORB.R+KORB.ATM)*s);g.addColorStop(0,"rgba(110,190,255,.55)");g.addColorStop(1,"rgba(110,190,255,0)");c.fillStyle=g;c.beginPath();c.arc(ex,ey,(KORB.R+KORB.ATM)*s,0,7);c.fill()}
  if(zi<=1){c.fillStyle="#3f8f3a";c.beginPath();c.arc(ex,ey,eR,0,7);c.fill();c.fillStyle="#2f6f2c";for(let i=-6;i<=6;i++){const [gx,gy]=P(i*900,KORB.R-60);c.beginPath();c.ellipse(gx,gy+18,60,14,0,0,7);c.fill()}}else{const eg=c.createRadialGradient(ex-eR*.35,ey-eR*.35,eR*.1,ex,ey,eR);eg.addColorStop(0,"#3b82f6");eg.addColorStop(.7,"#1d4ed8");eg.addColorStop(1,"#0b2a6b");c.fillStyle=eg;c.beginPath();c.arc(ex,ey,Math.max(eR,2),0,7);c.fill()}
  if(eR>12&&zi>=2){c.fillStyle="#16a34a";const L=[[.3,.2,.32],[-.4,.35,.25],[.1,-.45,.28],[-.2,-.1,.18],[.55,-.15,.16]];for(const [a,b,r] of L){c.beginPath();c.ellipse(ex+a*eR,ey+b*eR,r*eR,r*eR*.7,a*3,0,7);c.fill()}
    c.fillStyle="rgba(255,255,255,.85)";c.beginPath();c.ellipse(ex,ey-eR*.93,eR*.35,eR*.08,0,0,7);c.fill()}
  // launch pad
  if(zi<=1){const [px,py]=P(0,KORB.R);c.fillStyle="#475569";c.fillRect(px-40,py-2,80,4);c.fillStyle="#94a3b8";c.fillRect(px+16,py-46,6,46);for(let i=0;i<5;i++){c.fillRect(px+10,py-44+i*9,18,2)}}
  // Moon
  const [mx,my]=P(m.x,m.y),mR=Math.max(KORB.MR*s,zi>=3?4:0);if(mR>0){const mg=c.createRadialGradient(mx-mR*.3,my-mR*.3,mR*.1,mx,my,mR);mg.addColorStop(0,"#e5e7eb");mg.addColorStop(1,"#6b7280");c.fillStyle=mg;c.beginPath();c.arc(mx,my,mR,0,7);c.fill();
    if(mR>10){c.fillStyle="rgba(75,85,99,.55)";[[.3,.2,.18],[-.35,-.25,.14],[-.1,.45,.1],[.4,-.4,.09]].forEach(([a,b,r])=>{c.beginPath();c.arc(mx+a*mR,my+b*mR,r*mR,0,7);c.fill()})}
    if(zi>=3){c.strokeStyle="rgba(255,255,255,.12)";c.setLineDash([3,5]);c.beginPath();c.arc(mx,my,KORB.MSOI*s,0,7);c.stroke();c.setLineDash([])}}
  if(zi===4){c.strokeStyle="rgba(255,255,255,.08)";c.beginPath();c.arc(ex,ey,KORB.MA*s,0,7);c.stroke()}
  if(D.pred&&D.pred.mp&&zi>=3&&el.body==="earth"&&D.pred.minD<6e6){const [gx,gy]=P(D.pred.mp[0],D.pred.mp[1]),[qx,qy]=P(D.pred.pp[0],D.pred.pp[1]),ok=D.pred.minD<KORB.MSOI;c.fillStyle=ok?"rgba(74,222,128,.35)":"rgba(226,232,240,.25)";c.beginPath();c.arc(gx,gy,Math.max(4,KORB.MR*s),0,7);c.fill();c.strokeStyle=ok?"#4ade80":"rgba(226,232,240,.5)";c.setLineDash([2,3]);c.beginPath();c.moveTo(gx,gy);c.lineTo(qx,qy);c.stroke();c.setLineDash([])}
  // trail and predicted path
  if(D.trail.length>1){c.strokeStyle="rgba(253,224,71,.35)";c.lineWidth=1.5;c.beginPath();D.trail.forEach((p,i)=>{const [x,y]=P(p[0],p[1]);i?c.lineTo(x,y):c.moveTo(x,y)});const [x,y]=P(D.x,D.y);c.lineTo(x,y);c.stroke()}
  if(D.pred&&!D.landed&&zi>=2){c.strokeStyle=D.pred.hit?"rgba(248,113,113,.9)":"rgba(34,211,238,.9)";c.lineWidth=1.6;c.setLineDash([6,5]);c.beginPath();const [x0,y0]=P(D.x,D.y);c.moveTo(x0,y0);D.pred.P.forEach(p=>{const [x,y]=P(p[0],p[1]);c.lineTo(x,y)});c.stroke();c.setLineDash([]);
    if(el.body==="earth"&&el.E<0&&zi>=2&&zi<=3){const lab=(t,ang,rad)=>{const [x,y]=P(Math.cos(ang)*rad,Math.sin(ang)*rad);c.fillStyle="#0f172a";c.beginPath();c.arc(x,y,9,0,7);c.fill();c.fillStyle="#fde047";c.font="bold 9px system-ui";c.textAlign="center";c.fillText(t,x,y+3)};
      const ev=kOrbEvec(D);if(ev){const a=-KORB.GM/(2*el.E);lab("PE",ev.ang,a*(1-el.e));if(isFinite(el.ap))lab("AP",ev.ang+Math.PI,a*(1+el.e))}}}
  // particles (screen space, around the rocket)
  const [rx,ry]=P(D.x,D.y);
  for(const p of D.fx){c.globalAlpha=Math.max(0,Math.min(1,p.l));c.fillStyle=p.c;c.beginPath();c.arc(rx+p.x,ry+p.y,p.s,0,7);c.fill()}c.globalAlpha=1;
  // rocket
  if(!(D.over&&D.res==="crash")){c.save();c.translate(rx,ry);if(zi>=3)c.scale(.55,.55);c.rotate(D.ang);c.translate(0,-10);
    if(D.heat>0){const hg=c.createRadialGradient(0,-16,2,0,-16,30);hg.addColorStop(0,`rgba(255,180,60,${.8*D.heat})`);hg.addColorStop(1,"rgba(255,80,20,0)");c.fillStyle=hg;c.beginPath();c.arc(0,-16,30,0,7);c.fill()}
    if(D.thr&&D.fuel>0&&!(D.landed&&!D.thr)){const fl=14+Math.random()*12;const fg=c.createLinearGradient(0,10,0,10+fl);fg.addColorStop(0,"#fff7ed");fg.addColorStop(.35,"#fdba74");fg.addColorStop(1,"rgba(249,115,22,0)");c.fillStyle=fg;c.beginPath();c.moveTo(-5,10);c.quadraticCurveTo(0,10+fl*1.3,5,10);c.closePath();c.fill()}
    c.fillStyle="#e5e7eb";c.beginPath();c.moveTo(0,-18);c.quadraticCurveTo(6,-10,6,0);c.lineTo(6,10);c.lineTo(-6,10);c.lineTo(-6,0);c.quadraticCurveTo(-6,-10,0,-18);c.fill();
    c.fillStyle="#1e293b";c.beginPath();c.arc(0,-4,2.6,0,7);c.fill();c.fillStyle="#ef4444";c.beginPath();c.moveTo(-6,4);c.lineTo(-11,12);c.lineTo(-6,10);c.fill();c.beginPath();c.moveTo(6,4);c.lineTo(11,12);c.lineTo(6,10);c.fill();
    if(D.chute){c.strokeStyle="#cbd5e1";c.beginPath();c.moveTo(-5,-16);c.lineTo(-12,-38);c.moveTo(5,-16);c.lineTo(12,-38);c.stroke();c.fillStyle="#f97316";c.beginPath();c.arc(0,-38,14,Math.PI,0);c.fill()}
    c.restore();if(zi>=3){c.strokeStyle="#fde047";c.lineWidth=1.5;c.beginPath();c.arc(rx,ry,13,0,7);c.stroke()}}
  // HUD
  const enc=D.pred&&el.body==="earth"&&D.pred.minD<6e6?D.pred.minD:null;c.fillStyle="rgba(2,6,23,.62)";c.fillRect(6,6,150,enc!=null?108:92);c.fillStyle="#e2e8f0";c.font="bold 11px system-ui";c.textAlign="left";
  const lines=[["ALT",kOrbFmt(el.alt)+(el.body==="moon"?" 🌙":"")],["SPEED",Math.round(el.v).toLocaleString()+" m/s"],["AP",kOrbFmt(el.ap)],["PE",kOrbFmt(el.pe)],["⏩",D.warp+"×  ·  🔍"+(zi+1)+(D.zoom<0?" auto":"")]];
  if(enc!=null)lines.push(["🌙",enc<KORB.MSOI?"Moon encounter! ✅":"Moon miss: "+kOrbFmt(enc-KORB.MSOI)]);lines.forEach((l,i)=>{c.fillStyle="#94a3b8";c.fillText(l[0],12,22+i*16);c.fillStyle=l[0]==="PE"&&el.pe>KORB.ATM&&el.body==="earth"?"#4ade80":"#f8fafc";c.fillText(l[1],52,22+i*16)});
  const fp=Math.min(1,D.fuel/KORB.FUEL);c.fillStyle="rgba(2,6,23,.62)";c.fillRect(W-30,6,24,110);c.fillStyle=fp>.25?"#22c55e":"#ef4444";c.fillRect(W-25,11+100*(1-fp),14,100*fp);c.fillStyle="#e2e8f0";c.font="bold 9px system-ui";c.textAlign="center";c.fillText("⛽",W-18,128);c.fillText(Math.round(D.fuel)+"",W-18,140);
  const G=KORBM[D.goal];c.fillStyle="rgba(2,6,23,.62)";c.fillRect(6,H-44,W-12,38);c.fillStyle="#fde047";c.font="bold 11px system-ui";c.textAlign="left";c.fillText(`${G.ic} Goal ${D.goal+1}: ${G.n}`,12,H-28);c.fillStyle="#e2e8f0";c.font="10px system-ui";kOrbWrap(c,D.msgT>0?D.msg:G.tip,12,H-15,W-24)}
function kOrbWrap(c,t,x,y,w){const words=String(t).split(" ");let line="",yy=y;for(const wd of words){const tst=line?line+" "+wd:wd;if(c.measureText(tst).width>w&&line){c.fillText(line,x,yy);line=wd;yy+=12;if(yy>y+12)break}else line=tst}if(yy<=y+12)c.fillText(line,x,yy)}
function kOrbEvec(D){const el=kOrbEl(D),mu=KORB.GM,rx=D.x,ry=D.y,vx=D.vx,vy=D.vy,r=Math.hypot(rx,ry),rv=rx*vx+ry*vy,v2=vx*vx+vy*vy;const ex=((v2-mu/r)*rx-rv*vx)/mu,ey=((v2-mu/r)*ry-rv*vy)/mu;if(Math.hypot(ex,ey)<1e-4)return null;return{ang:Math.atan2(ey,ex)}}
function kOrbLoop(ts){const D=kOrb,cv=document.getElementById("korb");if(!D||KV.scr!=="orbit"||!cv)return;const c=cv.getContext("2d"),W=cv.width,H=cv.height;const dt=D.last?Math.min(.05,(ts-D.last)/1000):0;D.last=ts;
  kOrbSim(D,dt);D.shake=Math.max(0,D.shake-dt*.8);if(D.thr&&D.fuel>0&&Math.hypot(D.x,D.y)-KORB.R<3000)D.shake=Math.max(D.shake,.5);
  const el=kOrbEl(D);D.heat=el.body==="earth"&&el.alt<KORB.ATM&&el.v>1500?Math.min(1,(el.v-1500)/2000*Math.exp(-el.alt/40000)*3):Math.max(0,D.heat-dt);
  if(D.thr&&D.fuel>0&&!D.landed){const air=el.body==="earth"&&el.alt<KORB.ATM;for(let i=0;i<3;i++){const sp=60+Math.random()*80,a=D.ang+Math.PI+(Math.random()-.5)*.5;D.fx.push({x:0,y:0,vx:Math.sin(a)*sp,vy:-Math.cos(a)*sp,l:air?1:.5,c:air&&Math.random()<.5?"rgba(203,213,225,.7)":"#fb923c",s:air?3+Math.random()*4:2})}}
  for(const p of D.fx){p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt*1.4;p.s*=1+dt*.6}D.fx=D.fx.filter(p=>p.l>0).slice(-220);
  if(D.msgT>0)D.msgT-=dt;D.predT-=dt;if(D.predT<=0&&!D.landed){kOrbPredict(D);D.predT=.5}
  kOrbDraw(c,D,W,H);kFxPaint(c,D,W,H,dt);if(D.thr&&D.fuel>0&&!D.landed&&Math.hypot(D.x,D.y)-KORB.R<20e3&&Math.random()<.25)kFxBuzz(18);kOrbHud(D);if(D.over&&D.res!=="crash"&&!D.shown){D.shown=1;setTimeout(()=>{if(kOrb===D&&KV.scr==="orbit"){KV.end=1;render()}},1600)}
  requestAnimationFrame(kOrbLoop)}
function kOrbHud(D){const b=document.getElementById("korbwarp");if(b)b.textContent="⏩ "+D.warp+"×";const z=document.getElementById("korbzoom");if(z)z.textContent="🔍 "+(D.zoom<0?"Auto":D.zoom+1);
  ["pro","retro","up"].forEach(k=>{const e=document.getElementById("korb_"+k);if(e)e.classList.toggle("on",D.sas===k)});const ch=document.getElementById("korbchute");if(ch){const el=kOrbEl(D);ch.disabled=!(el.body==="earth"&&el.alt<6000&&el.v<250&&!D.landed)||D.chute;}}
function kOrbView(v){const o=kOrbState(),k=KS(),D=kOrb;
  if(!D||D.over&&KV.end){const won=D&&D.res==="crash"?0:1;
    v.innerHTML=`<div class="kids">${kToastHtml()}${kTop("🪐 Orbit Lab","pschool")}<div class="kcard kcityhero" style="background:radial-gradient(circle at 75% 25%,#4c1d95,#0b1029 60%,#020617)"><div class="kcityt">🪐 ORBIT LAB</div><div class="ksmall" style="color:#e2e8f0">Real rocket science: fly to space, get into orbit, travel to the Moon, land, and come home. The dashed line shows where gravity will take you.</div></div>
    ${D&&D.over?`<div class="kcard kend"><div class="kbig2">${D.res==="crash"?"💥":"🌍"}</div><h2>${D.res==="crash"?"Crash!":"Welcome home!"}</h2><p>${esc(D.res==="crash"?D.why:"Your capsule splashed down safely.")}</p></div>`:""}
    <div class="kcard"><div class="kh">🏆 Missions ${Object.keys(o.done).length}/${KORBM.length}</div>${KORBM.map((M,i)=>`<div class="ksmall" style="margin:6px 0">${o.done[i]?"✅":"⬜"} <b>${M.ic} ${i+1}. ${esc(M.n)}</b> — ${esc(M.g)}</div>`).join("")}</div>
    <div class="kpad">${(k.tix||0)>0?`<button class="kbtn big green" data-korb="launch">🚀 Launch (1 🎟️ · you have ${k.tix||0})</button>`:`<div class="ksmall">Out of tickets: earn more by learning (Quiz Show, chess, daily chest).</div>`}</div>
    <div class="kcard"><div class="ksmall">🧪 <b>How orbits work:</b> going up is the easy part. To stay in space you must go sideways about 2,300 m/s here (7,800 m/s on the real Earth!) so you keep falling around the planet instead of into it. Burn forward (prograde) to raise the far side of your orbit, backward (retrograde) to lower it.</div></div></div>`;KV.end=0;return}
  if(D.pre&&D.Q){const Q=D.Q;v.innerHTML=`<div class="kids">${kToastHtml()}${kTop("🪐 Orbit Lab","pschool")}<div class="kcard"><div class="kh">📡 Mission Control check</div><div class="kdbqt" style="font-size:17px;margin:8px 0">${esc(Q.q)}</div><div class="kdbqo">${Q.o.map((x,i)=>`<button class="kbtn" data-korb="q${i}">${esc(x)}</button>`).join("")}</div><div class="kpad"><button class="kbtn ghost small" data-korb="qskip">Skip ▶</button></div><div class="ksmall">Right answer = +15% fuel for the whole flight!</div></div></div>`;return}
  const W=Math.min(400,v.clientWidth||360)-4,H=Math.round(W*1.35);
  v.innerHTML=`<div class="kids">${kToastHtml()}${kTop("🪐 Orbit Lab","pschool")}<div class="kdrvbox"><canvas id="korb" width="${W}" height="${H}" style="border-radius:14px;display:block;margin:auto;touch-action:none"></canvas></div>
   <div class="kpad kdrvbtns"><button class="kbtn big ohold" id="korb_l">⟲</button><button class="kbtn big ohold lthr" id="korb_t">🔥 THRUST</button><button class="kbtn big ohold" id="korb_r">⟳</button></div>
   <div class="kpad kdrvbtns" style="gap:6px"><button class="kbtn small korbsas" id="korb_pro" data-korb="sas:pro">➡️ Prograde</button><button class="kbtn small korbsas" id="korb_retro" data-korb="sas:retro">⬅️ Retro</button><button class="kbtn small korbsas" id="korb_up" data-korb="sas:up">⬆️ Up</button></div>
   <div class="kpad kdrvbtns" style="gap:6px"><button class="kbtn small ghost" data-korb="warp-">⏪</button><button class="kbtn small" id="korbwarp" data-korb="warp+">⏩ 1×</button><button class="kbtn small ghost" id="korbzoom" data-korb="zoom">🔍 Auto</button><button class="kbtn small ghost" id="korbchute" data-korb="chute" disabled>🪂</button><button class="kbtn small ghost" id="korbtilt" data-korb="tilt">📱</button><button class="kbtn small ghost" data-korb="quit">⏹</button></div>
   <div class="ksmall">Keys: ← → turn · Space/↑ thrust · , . warp · Z zoom · P prograde · R retro.</div></div>`;
  const cv=document.getElementById("korb");try{kHdSetup(cv)}catch(_){}D.last=0;requestAnimationFrame(kOrbLoop)}
function kOrbClick(d){const D=kOrb,a=String(d.korb),k=KS();
  if(a==="launch"){if((k.tix||0)<1){kT("You need a 🎟️ ticket. Learn to earn one!");render();return}k.tix--;kOrbNew();kBeep("click");kLine("Orbit Lab. Hold thrust to launch. Ten, nine, eight... just kidding. Go!",2);render();return}
  if(D&&D.pre&&/^q\d$/.test(a)){const i=+a.slice(1),Q=D.Q,ok=i===Q.a;try{kAnswer(Q.s||"sci",ok,Q)}catch(_){}if(ok){D.fuel=Math.round(KORB.FUEL*1.15);kT("📡 Mission Control approved +15% fuel!")}else kT(`Answer: ${Q.o[Q.a]}. No bonus fuel this time.`);D.pre=0;render();return}
  if(D&&D.pre&&a==="qskip"){D.pre=0;render();return}
  if(!D)return;if(a==="quit"){D.over=true;D.res=D.res||"quit";KV.end=1;render();return}
  if(a.startsWith("sas:")){const s=a.slice(4);D.sas=D.sas===s?"":s;kBeep("click");return}
  if(a==="warp+"){const W=[1,5,25,100,500,2000];const el=kOrbEl(D);if((D.thr&&D.fuel>0)||(el.body==="earth"&&el.alt<KORB.ATM)){kOrbSay(D,"nowarp"+Math.round(D.t/30),"Time warp works above the air and with the engine off.");return}D.warp=W[Math.min(W.length-1,W.indexOf(D.warp)+1)];return}
  if(a==="warp-"){const W=[1,5,25,100,500,2000];D.warp=W[Math.max(0,W.indexOf(D.warp)-1)];return}
  if(a==="zoom"){D.zoom=D.zoom>=4?-1:D.zoom+1;return}
  if(a==="tilt"){if(D.tilt){D.tilt=false;D.tg=0;kT("📱 Tilt off");return}const on=()=>{D.tilt=true;D.g0=null;kT("📱 Tilt steering on: tip the phone left or right to turn the rocket")};try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==="function"){DeviceOrientationEvent.requestPermission().then(r=>{if(r==="granted")on()}).catch(()=>{})}else on()}catch(_){on()}return}
  if(a==="chute"){D.chute=true;kBeep("click");kFxBuzz(80);kOrbSay(D,"chute","Parachute open!");return}}
const kOHold={};document.addEventListener("pointerdown",e=>{try{if(view!=="kids"||KV.scr!=="orbit"||!kOrb)return;const b=e.target.closest&&e.target.closest(".ohold");if(!b)return;e.preventDefault();const m={korb_t:"thr",korb_l:"l",korb_r:"r"}[b.id];if(!m)return;kOrb[m]=true;kOHold[e.pointerId]=m;if(m!=="thr")kOrb.sas=""}catch(_){}});
["pointerup","pointercancel"].forEach(ev=>document.addEventListener(ev,e=>{if(!kOrb)return;const m=kOHold[e.pointerId];if(m){kOrb[m]=false;delete kOHold[e.pointerId]}},true));
document.addEventListener("keydown",e=>{if(typeof view==="undefined"||view!=="kids"||KV.scr!=="orbit"||!kOrb)return;const D=kOrb;if(e.key===" "||e.key==="ArrowUp"){e.preventDefault();D.thr=true}if(e.key==="ArrowLeft"){D.l=true;D.sas=""}if(e.key==="ArrowRight"){D.r=true;D.sas=""}
  if(e.key===".")kOrbClick({korb:"warp+"});if(e.key===",")kOrbClick({korb:"warp-"});if(e.key==="z"||e.key==="Z")kOrbClick({korb:"zoom"});if(e.key==="p"||e.key==="P")kOrbClick({korb:"sas:pro"});if(e.key==="r"||e.key==="R")kOrbClick({korb:"sas:retro"})});
document.addEventListener("keyup",e=>{if(!kOrb)return;if(e.key===" "||e.key==="ArrowUp")kOrb.thr=false;if(e.key==="ArrowLeft")kOrb.l=false;if(e.key==="ArrowRight")kOrb.r=false});

window.addEventListener("deviceorientation",e=>{const D=kOrb;if(!D||!D.tilt||e.gamma==null)return;const ang=(screen.orientation&&screen.orientation.angle)||window.orientation||0;const g=ang===90?e.beta:(ang===-90||ang===270)?-e.beta:e.gamma;if(D.g0==null)D.g0=g;D.tg=(D.tg||0)*.7+((g-D.g0)/25)*.3});
