/* ================= More real Teslas everywhere =================
   - Two new drivable cars: Cybercab (Tesla's two-seat robotaxi: no steering wheel or pedals, butterfly doors, gold-ish
     paint, light bars front and back) and Tesla Semi (electric big rig: center driver seat, aero cab, long trailer).
   - The new Model Y and Model 3 have a light bar across the front: drawn on every Model Y / Model 3.
   - Traffic in every driving game is now real Tesla models instead of plain boxes (Model 3, Model Y, Model S, Model X,
     Cybertruck), with the occasional Semi on trucks. Wrecked cars keep their grey look.
   - Orbit Lab: Starman's red Roadster floats in a high orbit (the real one was launched on a Falcon Heavy in
     February 2018 and orbits the Sun). */
KCARS.push(["cc","Cybercab","🚕","cab",1.0,1.05,.95,k=>true,"Tesla's robotaxi: no steering wheel, no pedals, butterfly doors!"],["se","Tesla Semi","🚛","semi",.8,1.2,.45,k=>true,"Electric big rig: the driver sits in the middle. Heavy, so it smashes cones!"]);
KCSZ.cab=[46,82];KCSZ.semi=[56,124];
const kTesla0=kTesla;
kTesla=function(c,x,y,w,h,col,sh,o={}){
  if(sh==="cab")return kCyberCab(c,x,y,w,h,col,o);
  if(sh==="semi")return kTeslaSemi(c,x,y,w,h,col,o);
  kTesla0(c,x,y,w,h,col,sh,o);
  if(sh==="roadster"&&o.fly){const hw=w/2,hh=h/2,tt=(o.t||0);c.save();c.translate(x,y);for(const [px,py] of[[-hw,-hh*.6],[hw,-hh*.6],[-hw,hh*.6],[hw,hh*.6]]){for(let i=0;i<3;i++){const k=((tt*3+i*.33)%1);c.fillStyle=`rgba(230,242,255,${.7*(1-k)})`;c.beginPath();c.arc(px+Math.sign(px)*k*16,py+k*6,3+k*7,0,7);c.fill()}}c.restore()}
  if(sh==="suv"||sh==="sedan"||!sh){const hw=w/2,hh=h/2;c.save();c.translate(x,y);c.fillStyle="rgba(235,245,255,.95)";c.shadowColor="rgba(190,225,255,.9)";c.shadowBlur=6;c.beginPath();c.roundRect(-hw*.62,-hh*.985,hw*1.24,2.2,1.1);c.fill();c.shadowBlur=0;c.restore()}};
function kCyberCab(c,x,y,w,h,col,o){const hw=w/2,hh=h/2,paint=col&&col!=="#c8102e"?col:"#c9b37e";c.save();c.translate(x,y);
  c.fillStyle="rgba(0,0,0,.3)";c.beginPath();c.ellipse(3,5,hw*1.05,hh*1.02,0,0,7);c.fill();
  c.fillStyle="#0c0d10";for(const yy of[-hh*.55,hh*.55])for(const s of[-1,1]){c.beginPath();c.roundRect(s>0?hw-5:-hw-2,yy-h*.09,7,h*.18,3);c.fill()}
  const g=c.createLinearGradient(-hw,0,hw,0);g.addColorStop(0,kShade(paint,-.4));g.addColorStop(.5,kShade(paint,.25));g.addColorStop(1,kShade(paint,-.4));c.fillStyle=g;
  c.beginPath();c.moveTo(0,-hh);c.bezierCurveTo(hw*1.05,-hh*.98,hw,-hh*.3,hw*.95,hh*.55);c.quadraticCurveTo(hw*.85,hh,0,hh);c.quadraticCurveTo(-hw*.85,hh,-hw*.95,hh*.55);c.bezierCurveTo(-hw,-hh*.3,-hw*1.05,-hh*.98,0,-hh);c.closePath();c.fill();c.strokeStyle="rgba(0,0,0,.35)";c.lineWidth=1;c.stroke();
  // one big glass canopy over the two seats
  const gg=c.createLinearGradient(0,-hh*.6,0,hh*.45);gg.addColorStop(0,"#3b4f6b");gg.addColorStop(1,"#0a1019");c.fillStyle=gg;c.beginPath();c.ellipse(0,-hh*.08,hw*.72,hh*.55,0,0,7);c.fill();
  c.fillStyle="rgba(255,255,255,.18)";c.beginPath();c.ellipse(-hw*.25,-hh*.3,hw*.16,hh*.28,-.3,0,7);c.fill();
  // butterfly door seams, two seats, no steering wheel
  c.strokeStyle="rgba(0,0,0,.35)";c.beginPath();c.moveTo(0,-hh*.62);c.lineTo(0,hh*.47);c.stroke();
  c.fillStyle="rgba(255,255,255,.22)";for(const s of[-1,1]){c.beginPath();c.roundRect(s*hw*.32-hw*.17,-hh*.1,hw*.34,hh*.32,4);c.fill()}
  // light bars front and back
  c.fillStyle="rgba(240,248,255,.98)";c.shadowColor="rgba(190,225,255,.9)";c.shadowBlur=6;c.beginPath();c.roundRect(-hw*.7,-hh*.97,hw*1.4,2.4,1.2);c.fill();
  c.fillStyle="#ff2a3a";c.shadowColor="rgba(255,60,60,.9)";c.beginPath();c.roundRect(-hw*.72,hh*.93,hw*1.44,2.4,1.2);c.fill();c.shadowBlur=0;
  if(o.boost){c.fillStyle="rgba(120,200,255,.6)";c.beginPath();c.ellipse(0,hh*1.12,hw*.5,5,0,0,7);c.fill()}
  c.restore()}
function kTeslaSemi(c,x,y,w,h,col,o){const hw=w/2,hh=h/2,paint=col||"#e5e7eb",cabH=h*.3;c.save();c.translate(x,y);
  c.fillStyle="rgba(0,0,0,.3)";c.beginPath();c.roundRect(-hw+3,-hh+5,w,h,8);c.fill();
  c.fillStyle="#0c0d10";const wy=[-hh+cabH*.35,-hh+cabH*.85,hh*.55,hh*.75];for(const yy of wy)for(const s of[-1,1]){c.beginPath();c.roundRect(s>0?hw-5:-hw-2,yy-5,7,10,2);c.fill()}
  // trailer
  const tg=c.createLinearGradient(-hw,0,hw,0);tg.addColorStop(0,"#9ca3af");tg.addColorStop(.5,"#f3f4f6");tg.addColorStop(1,"#9ca3af");c.fillStyle=tg;c.beginPath();c.roundRect(-hw*.95,-hh+cabH+3,hw*1.9,h-cabH-3,4);c.fill();c.strokeStyle="rgba(0,0,0,.3)";c.stroke();
  c.fillStyle="#e31937";c.font=`900 ${Math.max(8,w*.26)}px system-ui`;c.textAlign="center";c.textBaseline="middle";c.fillText("T",0,hh*.2);
  // aero cab with wraparound windshield and center driver seat
  const g=c.createLinearGradient(-hw,0,hw,0);g.addColorStop(0,kShade(paint,-.35));g.addColorStop(.5,kShade(paint,.2));g.addColorStop(1,kShade(paint,-.35));c.fillStyle=g;c.beginPath();c.moveTo(-hw*.7,-hh);c.quadraticCurveTo(0,-hh-6,hw*.7,-hh);c.quadraticCurveTo(hw,-hh+4,hw,-hh+cabH*.4);c.lineTo(hw,-hh+cabH);c.lineTo(-hw,-hh+cabH);c.lineTo(-hw,-hh+cabH*.4);c.quadraticCurveTo(-hw,-hh+4,-hw*.7,-hh);c.closePath();c.fill();c.strokeStyle="rgba(0,0,0,.35)";c.stroke();
  c.fillStyle="#1b2a40";c.beginPath();c.moveTo(-hw*.8,-hh+cabH*.18);c.quadraticCurveTo(0,-hh+cabH*.05,hw*.8,-hh+cabH*.18);c.lineTo(hw*.7,-hh+cabH*.45);c.lineTo(-hw*.7,-hh+cabH*.45);c.closePath();c.fill();
  c.fillStyle="rgba(255,255,255,.3)";c.beginPath();c.arc(0,-hh+cabH*.62,3.2,0,7);c.fill();
  c.fillStyle="rgba(240,248,255,.95)";c.fillRect(-hw*.7,-hh+1,hw*1.4,2);
  c.restore()}
// traffic: real Tesla models instead of plain boxes
const kCar0=kCar;
kCar=function(c,x,y,w,h,col,shape){if(col==="#3a3a3a"||!["sedan","suv","truck"].includes(shape))return kCar0(c,x,y,w,h,col,shape);
  const n=parseInt(String(col).replace("#","").slice(0,4),16)||0,pick=shape==="sedan"?["sedan","plaid","sedan"][n%3]:shape==="suv"?["suv","x","suv"][n%3]:(n%4===0?"semi":"truck");
  kTesla(c,x,y,w,h,pick==="truck"&&n%2?"#b8bcc6":col,pick==="sedan"?"":pick,{})};
// Orbit Lab: Starman's Roadster in a high orbit
const kOrbDraw0=kOrbDraw;
kOrbDraw=function(c,D,W,H){kOrbDraw0(c,D,W,H);try{const zi=D.zoom<0?kOrbAutoZ(D):D.zoom;if(zi<3)return;const half=KORBZ[zi],s=(H/2)/half,el=kOrbEl(D),m=kOrbMoon(D);
  let cx=D.x,cy=D.y;if(zi===4){cx=D.visMoon||el.body==="moon"?m.x*.5:0;cy=D.visMoon||el.body==="moon"?m.y*.5:0}else if(el.body==="moon"){cx=m.x;cy=m.y}
  const ra=-D.t*Math.sqrt(KORB.GM/(7e6)**3),rx=7e6*Math.cos(ra),ry=7e6*Math.sin(ra),px=W/2+(rx-cx)*s,py=H/2-(ry-cy)*s;
  if(px<-20||px>W+20||py<-20||py>H+20)return;c.save();c.translate(px,py);c.rotate(ra+Math.PI);c.scale(.42,.42);kRoadster(c,0,0,false,D.t);c.restore();
  c.fillStyle="rgba(248,250,252,.8)";c.font="9px system-ui";c.textAlign="center";c.fillText("Starman 🚗",px,py-16)}catch(_){}};
