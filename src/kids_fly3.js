/* ================= Sky Pilot 3: closer to a real cockpit =================
   Physics: a propeller's pull fades as speed builds, so a too-steep climb bleeds speed and stalls; banked turns need
   back pressure (some lift points sideways) and raise the stall speed; a G meter shows the load. Buildings are solid.
   World: a real airport (apron, taxiway, terminal, control tower, hangars), the town of Brick Bay with 3D buildings
   and roads, runway edge lights, green/red threshold lights and working PAPI lights. Sun in the sky, sunset flights,
   wingtip vapor trails in hard turns. Approach aid: PAPI + centerline needle, and radio-altimeter callouts
   (100, 50, 20, 10) like an airliner. */
const KF3={az:2.25,el:.52};
// ---------- physics ----------
const kFlyThr0=kFlyThr;kFlyThr=function(P){let t=kFlyThr0(P);if((P.ac||"c172")==="c172"&&!P.jet&&!P.heli&&!P.drone)t*=Math.max(.5,Math.min(1.05,1-P.v/75));return t};
const kFlyStall0=kFlyStall;kFlyStall=function(P){const s=kFlyStall0(P);if(P.heli||P.gnd||s<0)return s;const n=1/Math.max(.55,Math.cos(P.ph||0)),easy=typeof kFly!=="undefined"&&kFly&&kFly.easy;return s*(1+(Math.sqrt(n)-1)*(easy?.5:1))};
function kFly3Boxes(){return kFlyWorld().filter(o=>o.k==="box")}
const kFlyStep2=kFlyStep;
kFlyStep=function(F,dt){const y0=F.P.y;kFlyStep2(F,dt);const P=F.P;F.tr=F.tr||[];for(const t of F.tr)t.a+=dt;if(F.tr.length&&F.tr[0].a>1.5)F.tr=F.tr.filter(t=>t.a<=1.5);
  if(F.crashT>0||P.heli)return;const n=1/Math.max(.3,Math.cos(P.ph));F.gl=P.gnd?1:n;
  if(!P.gnd&&!P.drone){const stall=P.v<kFlyStall(P);
    if((P.ac||"c172")==="c172"&&!P.jet){const vs0=kFlyStall0(P),r=vs0/Math.max(P.v,vs0*.8);P.v=Math.max(0,P.v-.5*(F.easy?n:n*n)*r*r*dt)}   // induced drag: slow flight and steep turns cost speed
    if(!stall&&Math.abs(P.ph)>.3){P.th-=(n-1)*(F.easy?.1:.34)*dt;if(!F.turnSaid&&Math.abs(P.ph)>.5&&F.t>18&&!F.q){F.turnSaid=1;kFlySay("↪️ In a turn, some lift points sideways. Pull back a little to hold your altitude.",3.5)}}
    // wingtip vapor in hard turns, contrails for jets up high
    if((Math.abs(P.ph)>.48&&P.v>27)||(P.jet&&P.y>450)){F.trT=(F.trT||0)-dt;if(F.trT<=0){F.trT=.045;const hs=P.jet?4.2:5.4,cx=Math.cos(P.psi),sz=-Math.sin(P.psi);for(const s of[-1,1])F.tr.push({x:P.x+cx*hs*s*Math.cos(P.ph),y:P.y+1.5-Math.sin(P.ph)*hs*s,z:P.z+sz*hs*s*Math.cos(P.ph),s,a:0})}}
    for(const b of kFly3Boxes()){if(P.y<(b.y0||0)+b.h+1&&P.y>=(b.y0||0)-1&&Math.abs(P.x-b.x)<b.w/2+2&&Math.abs(P.z-b.z)<b.d/2+2){kFlyCrash(F,"🏢 BONK! You hit a building. Stay on the runway and climb before you turn.");return}}
    // radio-altimeter callouts on the way down, like an airliner
    const A=kFly3Appr(F);F.ap3=A;if(P.y>130)F.gp=999;if(A&&(F.vy||0)<-.5){for(const h of[100,50,20,10])if(y0>=h&&P.y<h&&(F.gp||999)>h){F.gp=h;F.call={t:h,a:0};try{kFxSpeak(String(h))}catch(_){}}
      if(!P.gear&&P.y<70&&!F.gearSaid){F.gearSaid=1;kFlySay("⚠️ TOO LOW, GEAR! Put the landing gear DOWN.",3);try{kFxSpeak("Too low. Gear.")}catch(_){}}
      if(!F.papiSaid&&A.dist<2600){F.papiSaid=1;kFlySay("🚦 PAPI lights by the runway: 2 white + 2 red = perfect glide path. All red = too low!",4.5)}}}
  else if(P.gnd){F.ap3=null;for(const b of kFly3Boxes()){if(Math.abs(P.x-b.x)<b.w/2+3&&Math.abs(P.z-b.z)<b.d/2+3&&!(b.y0>0)&&P.v>2){kFlyCrash(F,"🏢 BONK! You drove into a building. Taxi on the pavement.");return}}}
  if(F.call){F.call.a+=dt;if(F.call.a>1.1)F.call=null}};
const kFlyReset3=kFlyReset;kFlyReset=function(F){kFlyReset3(F);F.tr=[];F.gp=999;F.call=null;F.gearSaid=0;F.ap3=null};
const kFxWeather0=kFxWeather;kFxWeather=function(F){const W=kFxWeather0(F);try{if((W.t==="clear"||W.t==="clouds")&&Math.random()<.22&&((KS().fly||{}).flights||0)>2&&F.lv!==0){W.dusk=1;W.s0="#27306b";W.s1="#ffb36b";W.col="rgba(255,205,175,.9)";W.nm="🌇 Sunset, "+(W.t==="clear"?"clear":"cloudy")}}catch(_){}return W};
// ---------- approach geometry ----------
function kFly3Appr(F){const P=F.P;if(P.gnd||P.y>520||P.heli)return null;let best=null;for(const r of KFLYRW)for(const e of[-1,1]){const s=Math.sin(r.hd),co=Math.cos(r.hd),L=r.len/2,d=-e,ax=r.cx+s*e*(L-150),az=r.cz+co*e*(L-150),dx=P.x-ax,dz=P.z-az,
    along=(dx*s+dz*co)*d,lat=(dx*co-dz*s)*d,hd=r.hd+(d<0?Math.PI:0),dh=Math.abs(Math.atan2(Math.sin(P.psi-hd),Math.cos(P.psi-hd)));
    if(along>-60||along<-4500||Math.abs(lat)>110+(-along)*.2||dh>.7)continue;const dist=-along,ang=Math.atan2(P.y,Math.hypot(dist,lat))*57.2958,nW=ang>4.6?4:ang>3.6?3:ang>2.3?2:ang>1.5?1:0;if(!best||dist<best.dist)best={r,e,dist,lat,ang,nW}}return best}
// ---------- world: airport and the town of Brick Bay ----------
function kFly3Build(){const r=kFlyRand(31),B=[],box=(x,z,w,d,h,col,roof,y0)=>B.push({k:"box",x,z,w,d,h,col,roof:roof||col.map(v=>v*.7),y0:y0||0});
  box(-150,420,56,120,13,[214,218,226],[120,128,142]);box(-150,420,30,50,7,[150,190,225],[90,110,140],13);                 // terminal + glass hall
  box(-128,585,11,11,30,[226,228,232]);box(-128,585,19,19,7,[70,110,150],[230,60,60],30);                                    // control tower + cab
  box(-152,690,56,60,15,[188,194,204],[96,104,118]);box(-152,770,56,60,15,[176,184,196],[96,104,118]);                        // hangars
  box(-120,300,12,12,10,[240,240,240]);box(-104,300,12,12,10,[240,240,240]);                                                  // fuel tanks
  const pal=[[196,96,74],[222,206,170],[150,168,190],[206,180,140],[176,84,66],[232,232,226],[134,150,128]];
  for(let i=0;i<6;i++)for(let j=0;j<5;j++){const cx=640+i*112,cz=-960+j*118;if(i===3||j===2){continue}const n=1+Math.floor(r()*2);for(let q=0;q<n;q++){const w=26+r()*34,d=26+r()*30,core=Math.abs(i-2.5)<1.6&&Math.abs(j-2)<1.6,h=core&&r()<.45?30+r()*34:7+r()*13;
      box(cx+(q?28:-18)+(r()-.5)*10,cz+(r()-.5)*22,w,d,h,pal[Math.floor(r()*pal.length)])}}
  box(KFLYISL.x-120,KFLYISL.z-78,34,26,7,[226,210,170],[150,90,60]);
  return B}
const KF3ROADS=[[-160,300,-262,300],[-262,300,-262,-246],[-262,-246,1260,-246],[976,-1020,976,-420],[600,-724,1260,-724]];
function kFly3InTown(x,z){return x>560&&x<1300&&z>-1040&&z<-200||x>-190&&x<-36&&z>230&&z<880||Math.abs(x+262)<14&&z>-260&&z<310||Math.abs(z+246)<14&&x>-270&&x<1270}
const kFlyWorld3=kFlyWorld;
kFlyWorld=function(){if(kFlyWorld.w3)return kFlyWorld.w3;const base=kFlyWorld3().filter(o=>!(o.k==="bld"&&(o.ic==="🏢"||o.ic==="🗼"&&o.x===-75))&&!(o.k==="tree"&&kFly3InTown(o.x,o.z))&&!(o.k==="bld"&&o.ic==="🚜"));
  return kFlyWorld.w3=base.concat(kFly3Build())};
function kFly3Shade(col,f){return[col[0]*f,col[1]*f,col[2]*f]}
function kFly3Box(c,o,C,Fo,z,RG){const hw=o.w/2,hd=o.d/2,x0=o.x-hw,x1=o.x+hw,z0=o.z-hd,z1=o.z+hd,y0=o.y0||0,y1=y0+o.h,fog=Math.min(.85,Math.pow(Math.min(1,z/RG),1.6)),P=(x,y,zz)=>kFlyTf(C,x,y,zz),
   face=(ax,az,bx,bz,sh)=>{kFlyPoly(c,[P(ax,y0,az),P(bx,y0,bz),P(bx,y1,bz),P(ax,y1,az)],Fo,kFlyMix(kFly3Shade(o.col,sh),KFLYHAZE,fog));
     if(z<650&&o.h>9){const fl=Math.min(8,Math.floor(o.h/5)),wc=kFlyMix([40,56,84],KFLYHAZE,fog);for(let i=0;i<fl;i++){const a=y0+o.h*(i+.35)/fl,b=y0+o.h*(i+.72)/fl;kFlyPoly(c,[P(ax+(bx-ax)*.08,a,az+(bz-az)*.08),P(ax+(bx-ax)*.92,a,az+(bz-az)*.92),P(ax+(bx-ax)*.92,b,az+(bz-az)*.92),P(ax+(bx-ax)*.08,b,az+(bz-az)*.08)],Fo,wc)}}};
  if(C.x<x0)face(x0,z0,x0,z1,.7);if(C.x>x1)face(x1,z0,x1,z1,.92);if(C.z<z0)face(x0,z0,x1,z0,.82);if(C.z>z1)face(x0,z1,x1,z1,.6);
  if(C.y>y1)kFlyPoly(c,[P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)],Fo,kFlyMix(o.roof,KFLYHAZE,fog))}
function kFly3Ground(c,F,C,Fo,RG){const q=(x0,z0,x1,z1,col)=>{const d=Math.hypot((x0+x1)/2-C.x,(z0+z1)/2-C.z);if(d>RG*1.1)return;const y=.04;kFlyPoly(c,[kFlyTf(C,x0,y,z0),kFlyTf(C,x1,y,z0),kFlyTf(C,x1,y,z1),kFlyTf(C,x0,y,z1)],Fo,kFlyMix(col,KFLYHAZE,Math.min(.85,Math.pow(d/RG,1.6))))};
  for(const [a,b,d,e] of KF3ROADS){const w=5,n=Math.max(1,Math.ceil(Math.hypot(d-a,e-b)/260));for(let i=0;i<n;i++){const xa=a+(d-a)*i/n,za=b+(e-b)*i/n,xb=a+(d-a)*(i+1)/n,zb=b+(e-b)*(i+1)/n;q(Math.min(xa,xb)-(za===zb?0:w),Math.min(za,zb)-(xa===xb?0:w),Math.max(xa,xb)+(za===zb?0:w),Math.max(za,zb)+(xa===xb?0:w),[84,88,98])}}
  q(590,-1030,1280,-410,[150,170,120]);                                                              // town lawn
  for(let i=0;i<6;i++)if(i!==3)q(640+i*112-52,-1010,640+i*112+52,-430,[128,132,140]);                // block pavement
  q(-185,236,-38,872,[92,97,108]);q(-36,20,-24,1180,[78,83,94]);for(const z of[40,600,1150])q(-24,z-7,-15,z+7,[78,83,94]);      // apron, taxiway, connectors
  for(let z=40;z<1170;z+=40)q(-30.4,z,-29.6,z+18,[240,200,60])}
function kFly3Sky(c,F,C,Fo,W,H,hy){const wx=F.wx||{},dusk=wx.dusk,hz=dusk?[226,160,122]:wx.t==="storm"?[110,118,132]:wx.t==="rain"?[160,172,184]:[178,206,226];KFLYHAZE[0]=hz[0];KFLYHAZE[1]=hz[1];KFLYHAZE[2]=hz[2];
  if(wx.t==="rain"||wx.t==="storm")return;const az=dusk?-1.35:KF3.az,el=dusk?.07:KF3.el,t=kFlyTf(C,C.x+Math.sin(az)*Math.cos(el)*1e5,C.y+Math.sin(el)*1e5,C.z+Math.cos(az)*Math.cos(el)*1e5);if(t[2]<1e3)return;
  const sx=t[0]/t[2]*Fo,sy=-t[1]/t[2]*Fo,R=dusk?150:110,g=c.createRadialGradient(sx,sy,2,sx,sy,R);g.addColorStop(0,dusk?"rgba(255,220,150,.95)":"rgba(255,255,235,.95)");g.addColorStop(.12,dusk?"rgba(255,170,90,.55)":"rgba(255,250,210,.5)");g.addColorStop(1,"rgba(255,220,160,0)");
  c.fillStyle=g;c.fillRect(sx-R,Math.min(sy-R,hy),R*2,Math.max(0,Math.min(sy+R,hy)-Math.min(sy-R,hy)));c.fillStyle=dusk?"#ffd9a0":"#fffbe6";if(sy<hy+10){c.beginPath();c.arc(sx,sy,dusk?15:11,0,7);c.fill()}
  F.sunS=[sx,sy]}
function kFly3Trails(c,F,C,Fo){const T=F.tr;if(!T||T.length<3)return;c.lineCap="round";for(const s of[-1,1]){let prev=null;for(const t of T){if(t.s!==s)continue;const p=kFlyTf(C,t.x,t.y,t.z);if(p[2]<1.5){prev=null;continue}const X=p[0]/p[2]*Fo,Y=-p[1]/p[2]*Fo;
      if(prev&&t.a<1.5){c.strokeStyle=`rgba(255,255,255,${.5*(1-t.a/1.5)})`;c.lineWidth=Math.max(1,Math.min(5,.7*Fo/p[2]));c.beginPath();c.moveTo(prev[0],prev[1]);c.lineTo(X,Y);c.stroke()}prev=[X,Y]}}c.lineCap="butt"}
function kFly3Post(c,F,C,Fo,W,H){const wx=F.wx||{},dusk=!!wx.dusk,P=F.P,dim=dusk||wx.t==="storm"||wx.t==="rain";c.save();c.translate(W/2,H*.42);c.rotate(-C.ro);
  if(dusk){c.fillStyle="rgba(22,22,70,.26)";c.fillRect(-W*1.6,-H*1.6,W*3.2,H*3.2)}
  const L=(x,y,z,col,r)=>{const t=kFlyTf(C,x,y,z);if(t[2]<3||t[2]>3400)return;const X=t[0]/t[2]*Fo,Y=-t[1]/t[2]*Fo,s=Math.max(dim?1.1:.9,Math.min(6,r*Fo/t[2]));if(dim&&r*Fo/t[2]>1.1){c.globalAlpha=.25;c.fillStyle=col;c.beginPath();c.arc(X,Y,s*2.4,0,7);c.fill();c.globalAlpha=1}c.fillStyle=col;c.beginPath();c.arc(X,Y,s,0,7);c.fill()};
  for(const r of KFLYRW){if(Math.hypot(r.cx-C.x,r.cz-C.z)>3600)continue;const s=Math.sin(r.hd),co=Math.cos(r.hd),Lh=r.len/2,Wd=r.w/2,pt=(al,sd)=>[r.cx+s*al+co*sd,r.cz+co*al-s*sd],ca=(C.x-r.cx)*s+(C.z-r.cz)*co;
    if(dim||Math.hypot(r.cx-C.x,r.cz-C.z)<1900)for(let al=-Lh;al<=Lh;al+=60)for(const sd of[-Wd-2,Wd+2]){const p=pt(al,sd);L(p[0],.5,p[1],dim?"#fff6d0":"rgba(255,255,255,.8)",.5)}
    for(const e of[-1,1]){const out=e*ca>Lh;for(let sd=-Wd;sd<=Wd;sd+=5){const p=pt(e*Lh,sd);L(p[0],.5,p[1],out?"#3dff8a":"#ff4040",.55)}
      if(out){const dx=P.x-(r.cx+s*e*(Lh-150)),dz=P.z-(r.cz+co*e*(Lh-150)),ang=Math.atan2(P.y,Math.hypot(dx,dz))*57.2958,nW=P.gnd?2:ang>4.6?4:ang>3.6?3:ang>2.3?2:ang>1.5?1:0;for(let i=0;i<4;i++){const p=pt(e*(Lh-150),e*(Wd+10+i*6));L(p[0],1,p[1],i>=4-nW?"#ffffff":"#ff2a2a",1.5)}}}}
  if(dim)for(const b of kFly3Boxes()){if(b.h>25&&!b.y0)L(b.x,b.h+2,b.z,Math.floor(F.t*1.2)%2?"#ff3030":"#801010",.9)}
  c.restore();
  // approach aid: PAPI + centerline needle
  const A=F.ap3;if(A&&!F.q&&!F.chk&&!(F.crashT>0)){const pw=152,ph=46,px=F.cock?12:W/2-pw/2+16,py=F.cock?H-98:H-148;c.fillStyle="rgba(5,8,24,.8)";c.beginPath();c.roundRect(px,py,pw,ph,10);c.fill();
    c.textBaseline="middle";c.textAlign="left";c.font="bold 9px system-ui";c.fillStyle="#9fb4d8";c.fillText("PAPI",px+8,py+12);for(let i=0;i<4;i++){c.fillStyle=i<A.nW?"#ffffff":"#ff3030";c.beginPath();c.arc(px+40+i*12,py+12,4.2,0,7);c.fill()}
    const msg=["TOO LOW!","LOW","ON PATH ✓","HIGH","TOO HIGH"][A.nW];c.textAlign="right";c.font="900 9.5px system-ui";c.fillStyle=A.nW===2?"#2ec27e":A.nW===0?"#ff4d6d":"#ffd23f";c.fillText(msg,px+pw-7,py+12);
    const bx=px+10,bw=pw-20,by=py+31;c.fillStyle="rgba(255,255,255,.25)";c.fillRect(bx,by,bw,2);c.fillStyle="#fff";c.fillRect(bx+bw/2-.75,by-5,1.5,12);const off=Math.max(-1,Math.min(1,-A.lat/160));c.fillStyle=Math.abs(A.lat)<22?"#2ec27e":"#ffd23f";c.beginPath();const dxp=bx+bw/2+off*bw/2;c.moveTo(dxp,by-6);c.lineTo(dxp+5,by+1);c.lineTo(dxp,by+8);c.lineTo(dxp-5,by+1);c.closePath();c.fill();
    c.font="8.5px system-ui";c.textAlign="center";c.fillStyle="#c7cbe6";c.fillText(Math.abs(A.lat)<22?`centerline ✓ · ${(A.dist/1000).toFixed(1)} km`:A.lat>0?"◀ runway is to your left":"runway is to your right ▶",px+pw/2,py+41.5)}
  if(F.call){c.textAlign="center";c.textBaseline="middle";c.font="900 44px system-ui";c.fillStyle=`rgba(255,210,63,${1-F.call.a/1.1})`;c.fillText(String(F.call.t),W/2,H*.3)}
  const g=F.gl||1;if(!P.gnd&&g>1.08){c.textAlign="left";c.textBaseline="middle";c.fillStyle="rgba(5,8,24,.78)";c.beginPath();c.roundRect(6,70,56,18,8);c.fill();c.font="bold 10px system-ui";c.fillStyle=g>1.35?"#ffd23f":"#c7cbe6";c.fillText(`G ${g.toFixed(1)}`,13,79.5)}}
// the radio panel never sits on top of the mission quiz or the checklist
const kFxAtcDom0=kFxAtcDom;kFxAtcDom=function(cv,F){if(F.q||F.chk||F.over){try{const el=cv.parentElement&&cv.parentElement.querySelector(".kfatc");if(el)el.remove();if(F.q&&F.atc&&F.atc.q&&F.atc.q.ans==null)F.atc.q=null}catch(_){}return}kFxAtcDom0(cv,F)};
