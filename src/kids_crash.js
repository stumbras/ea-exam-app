/* ---------- 🌴 Brick Bay crash physics: toy-brick buildings crack, chip and crumble; cartoon BOOMs; flying bricks and smoke ---------- */
/* Kid-friendly on purpose: no people get hurt, nothing burns. Buildings are toy bricks that pop apart and the builders fix them. */
const KCR={HIT:95,BIG:190,MAXD:4,FIX:22};
function kCrInit(D){if(!D.cr)D.cr={d:{},p:[],cd:0,tcd:0,me:0,crumbles:0}}
function kCrBits(D,x,y,n,col,spd,big){const P=D.cr.p;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=spd*(.35+Math.random()*.9);
  P.push({k:"brick",x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,z:0,vz:120+Math.random()*(big?260:160),rot:Math.random()*7,vr:(Math.random()-.5)*14,life:1.4+Math.random()*.8,t:0,col:Math.random()<.25?"#ffffff":col,w:big?10:7,h:big?6:5})}
  for(let i=0;i<Math.ceil(n/3);i++)P.push({k:"smoke",x:x+(Math.random()-.5)*30,y:y+(Math.random()-.5)*30,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30-10,r:10+Math.random()*12,life:1.6+Math.random(),t:0});
  if(P.length>420)P.splice(0,P.length-420)}
function kCrBoom(D,x,y,size){D.cr.p.push({k:"boom",x,y,r:4,max:size,life:.55,t:0});for(let i=0;i<Math.round(size/3);i++){const a=Math.random()*7,s=size*(1+Math.random()*2.5);D.cr.p.push({k:"ember",x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-20,life:.6+Math.random()*.6,t:0,r:2+Math.random()*3})}for(let i=0;i<8;i++){const a=i/8*Math.PI*2;D.cr.p.push({k:"star",x,y,vx:Math.cos(a)*size*2.4,vy:Math.sin(a)*size*2.4,life:.5,t:0})}}
function kCtCrashStep(D,dt,sp){kCrInit(D);const me=D.me,C=D.cr;C.cd=Math.max(0,C.cd-dt);C.tcd=Math.max(0,C.tcd-dt);if(D.air||me.jump>0||D.foot)return;
  // crumbled buildings get fixed by the builders after a while
  for(const i in C.d){const s=C.d[i];if(s.down){s.fix-=dt;if(s.fix<=0){const b=D.M.bld[i];delete C.d[i];kCtFx({k:"txt",x:b.x+b.w/2,y:b.y+b.h/2,txt:"🚧 Fixed by the builders!",small:1})}}}
  for(const i in C.d){const s=C.d[i],b=D.M.bld[i];if(!b||!(s.fire>0))continue;s.fire-=dt;if(Math.random()<dt*26)C.p.push({k:"flame",x:b.x+Math.random()*b.w,y:b.y+Math.random()*b.h,vx:(Math.random()-.5)*16,vy:-30-Math.random()*40,life:.8+Math.random()*.6,t:0,r:12+Math.random()*10});
    if(Math.random()<dt*8)C.p.push({k:"smoke",x:b.x+Math.random()*b.w,y:b.y+Math.random()*b.h,vx:(Math.random()-.5)*20,vy:-25,r:10,life:2,t:0,dark:1});
    if(s.fire<3&&!s.ff){s.ff=1;kCtFx({k:"txt",x:b.x+b.w/2,y:b.y-10,txt:"🚒 Firefighters to the rescue!",big:1});kBeep("alarm")}
    if(s.ff&&Math.random()<dt*40)C.p.push({k:"water",x:b.x+b.w/2+(Math.random()-.5)*b.w*.8,y:b.y+b.h+40,vx:(Math.random()-.5)*40,vy:-160-Math.random()*60,life:.6,t:0})
    if(s.fire<=0)kCtFx({k:"txt",x:b.x+b.w/2,y:b.y+b.h/2,txt:"💧 Fire's out! Nice job, firefighters!",small:1})}
  // hitting a building
  if(sp>KCR.HIT&&!C.cd)for(let i=0;i<D.M.bld.length;i++){const b=D.M.bld[i],cx=Math.max(b.x,Math.min(me.x,b.x+b.w)),cy=Math.max(b.y,Math.min(me.y,b.y+b.h)),d=Math.hypot(me.x-cx,me.y-cy);if(d>me.r+4)continue;
    const nx=d?(me.x-cx)/d:0,ny=d?(me.y-cy)/d:-1,into=-(me.vx*nx+me.vy*ny);if(into<KCR.HIT*.7)break;
    const s=C.d[i]=C.d[i]||{n:0,cracks:[]},big=into>KCR.BIG;if(s.down)break;s.n=Math.min(KCR.MAXD,s.n+(big?2:1));C.cd=.45;
    for(let k=0;k<(big?3:2);k++)s.cracks.push([cx-b.x,cy-b.y,(Math.random()-.5)*Math.PI+Math.atan2(-ny,-nx),18+Math.random()*30]);
    kCrBits(D,cx,cy,big?22:12,b.col||"#e3000b",into*.6,big);D.shake=big?.45:.25;kBeep(big?"boom":"crash");kVib(big?140:60);
    if(big)kCrBoom(D,cx,cy,42);me.vx*=.55;me.vy*=.55;C.me=Math.min(5,C.me+(big?2:1));
    if(s.n>=KCR.MAXD){s.down=1;s.fix=KCR.FIX;s.fire=6;C.crumbles++;kCrBoom(D,b.x+b.w/2,b.y+b.h/2,90);kCrBits(D,b.x+b.w/2,b.y+b.h/2,46,b.col||"#e3000b",260,1);D.shake=.7;kBeep("boom");kBeep("boom");
      kCtFx({k:"txt",x:b.x+b.w/2,y:b.y+b.h/2-40,txt:"🧱💥 KA-BOOM! It crumbled!",big:1});kCtSay("🚧 Oops! The toy bricks fell apart. The builders will fix it soon. Drive gently near buildings!",3.5);
      if(C.crumbles===3&&typeof kTrophy==="function")kTrophy("citycrash","🧱","Brick Bay Demolition Derby!","Knocked down 3 toy-brick buildings (the builders fixed them all).")}
    else kCtFx({k:"txt",x:cx,y:cy-24,txt:big?"💥 SMASH!":"💥 Crunch!",big:big?1:0});break}
  // hitting traffic: sparks, bricks fly off the toy cars, cars spin out
  if(sp>KCR.HIT&&!C.tcd)for(const o of D.tr.concat(D.cops||[],D.bandit?[D.bandit]:[])){const d=Math.hypot(me.x-o.x,me.y-o.y);if(d<me.r+o.r+3){C.tcd=.6;o.spin=1.2;kCrBits(D,(me.x+o.x)/2,(me.y+o.y)/2,10,o.col||"#ffcf00",sp*.5,0);if(sp>KCR.BIG){kCrBoom(D,(me.x+o.x)/2,(me.y+o.y)/2,36);D.shake=.35}kCtFx({k:"txt",x:o.x,y:o.y-30,txt:kPick(["💫 Bonk!","💥 Whoops!","🔧 Bump!"]),small:1});C.me=Math.min(5,C.me+1);break}}
  // the Spray Shop also fixes your car
  const sp2=D.M.marks.spray;if(C.me&&Math.hypot(me.x-sp2.x,me.y-sp2.y)<46){C.me=0;kCtFx({k:"txt",x:me.x,y:me.y-56,txt:"🔧 Car fixed like new!",small:1})}
  if(C.me>=3&&Math.random()<dt*14)C.p.push({k:"smoke",x:me.x-Math.sin(me.a)*20,y:me.y+Math.cos(me.a)*20,vx:(Math.random()-.5)*20,vy:(Math.random()-.5)*20,r:6+C.me*2,life:1,t:0,dark:1})}
function kCtCrashDraw(c,D,dt){if(!D.cr)return;const C=D.cr;
  for(const i in C.d){const b=D.M.bld[i],s=C.d[i];if(!b)continue;c.save();
    if(s.down){c.fillStyle="#9a8f84";c.fillRect(b.x,b.y,b.w,b.h);const r=kCtRand(+i*977+7);for(let k=0;k<Math.min(60,b.w*b.h/250);k++){c.fillStyle=r()<.7?(b.col||"#e3000b"):"#5b5b5b";c.save();c.translate(b.x+r()*b.w,b.y+r()*b.h);c.rotate(r()*3);c.fillRect(-6,-3,12,6);c.restore()}
      c.strokeStyle="#ffb000";c.lineWidth=4;c.setLineDash([10,8]);c.strokeRect(b.x+3,b.y+3,b.w-6,b.h-6);c.setLineDash([]);c.font="26px serif";c.textAlign="center";c.textBaseline="middle";c.fillText(s.fix<8?"🏗️":"🚧",b.x+b.w/2,b.y+b.h/2)}
    else{c.beginPath();c.rect(b.x,b.y,b.w,b.h);c.clip();c.strokeStyle="rgba(30,20,10,.75)";c.lineWidth=2.5;for(const [x,y,a,l] of s.cracks){let px=b.x+x,py=b.y+y;c.beginPath();c.moveTo(px,py);for(let k=0;k<4;k++){const aa=a+(k%2?.6:-.6);px+=Math.cos(aa)*l/4;py+=Math.sin(aa)*l/4;c.lineTo(px,py)}c.stroke()}
      c.fillStyle=`rgba(0,0,0,${.07*s.n})`;c.fillRect(b.x,b.y,b.w,b.h)}
    c.restore()}
  const P=C.p;for(let i=P.length-1;i>=0;i--){const p=P[i];p.t+=dt;if(p.t>=p.life){P.splice(i,1);continue}const f=1-p.t/p.life;
    if(p.k==="brick"){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=1-dt*1.6;p.vy*=1-dt*1.6;p.z=Math.max(0,p.z+p.vz*dt);p.vz-=520*dt;if(p.z===0){p.vz=Math.abs(p.vz)>60?-p.vz*.35:0;p.vr*=.6}p.rot+=p.vr*dt;
      c.save();c.globalAlpha=Math.min(1,f*2);c.translate(p.x,p.y-p.z);c.rotate(p.rot);c.fillStyle=p.col;c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.fillStyle="rgba(255,255,255,.45)";c.fillRect(-p.w/2+1,-p.h/2-2,3,2);c.restore()}
    else if(p.k==="smoke"){p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=dt*14;c.globalAlpha=f*.45;c.fillStyle=p.dark?"#3a3a3a":"#d9d4cc";c.beginPath();c.arc(p.x,p.y,p.r,0,7);c.fill()}
    else if(p.k==="boom"){const r=p.max*(1-Math.pow(f,3))+4;c.globalAlpha=f;const g=c.createRadialGradient(p.x,p.y,1,p.x,p.y,r);g.addColorStop(0,"rgba(255,255,210,1)");g.addColorStop(.45,"rgba(255,190,40,.9)");g.addColorStop(1,"rgba(255,90,0,0)");c.fillStyle=g;c.beginPath();c.arc(p.x,p.y,r,0,7);c.fill();
      if(p.max>60){c.font="900 26px system-ui";c.textAlign="center";c.fillStyle="#fff";c.strokeStyle="#c2410c";c.lineWidth=4;c.strokeText("BOOM!",p.x,p.y-r*.2);c.fillText("BOOM!",p.x,p.y-r*.2)}}
    else if(p.k==="ember"){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=1-dt*2;p.vy=p.vy*(1-dt*2)-20*dt;c.globalAlpha=f;c.fillStyle=f>.5?"#ffe27a":"#ff7a1a";c.beginPath();c.arc(p.x,p.y,p.r*f+1,0,7);c.fill()}
    else if(p.k==="flame"){p.x+=p.vx*dt;p.y+=p.vy*dt;const r=p.r*(.4+f*.8);c.globalAlpha=Math.min(1,f*1.6);const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,"rgba(255,245,180,1)");g.addColorStop(.5,"rgba(255,150,20,.95)");g.addColorStop(1,"rgba(230,40,0,0)");c.fillStyle=g;c.beginPath();c.ellipse(p.x,p.y,r*.75,r*1.25,0,0,7);c.fill()}
    else if(p.k==="water"){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=380*dt;c.globalAlpha=f;c.fillStyle="#6ec8ff";c.beginPath();c.arc(p.x,p.y,3,0,7);c.fill()}
    else if(p.k==="star"){p.x+=p.vx*dt;p.y+=p.vy*dt;c.globalAlpha=f;c.font="16px serif";c.textAlign="center";c.fillText("✨",p.x,p.y)}
    c.globalAlpha=1}
  for(const o of D.tr)if(o.spin>0){o.spin-=dt;o.a+=o.spin*14*dt*6}}

/* Car damage you can see: dents, a cracked windshield, a loose bumper, smoke and (at the worst) little cartoon flames. The Spray Shop fixes it all. */
function kCtCrashTop(c,D,dt){const C=D.cr,me=D.me;if(!C||!C.me||D.foot||D.air)return;const n=C.me;c.save();c.translate(me.x,me.y);c.rotate(me.a);
  c.fillStyle="rgba(20,20,20,.35)";const dents=[[-8,-14,6],[7,6,5],[-6,14,5],[9,-6,4],[0,0,6]];for(let i=0;i<Math.min(n,5);i++){const [x,y,r]=dents[i];c.beginPath();c.ellipse(x,y,r,r*.7,i,0,7);c.fill()}
  if(n>=2){c.strokeStyle="rgba(255,255,255,.85)";c.lineWidth=1.2;c.beginPath();c.moveTo(-6,-13);c.lineTo(0,-9);c.lineTo(5,-14);c.moveTo(0,-9);c.lineTo(2,-4);c.stroke()}
  if(n>=3){c.fillStyle="#555";c.save();c.translate(-9,24);c.rotate(Math.sin(D.t*18)*.18+.25);c.fillRect(0,-2,18,4);c.restore()}
  c.restore();if(n>=5&&Math.random()<dt*20)C.p.push({k:"flame",x:me.x+Math.sin(me.a)*16,y:me.y-Math.cos(me.a)*16,vx:-me.vx*.2,vy:-me.vy*.2-20,life:.5,t:0,r:6});
  if(n>=4&&!C.warned){C.warned=1;kCtSay("🔥 Your car is smoking! Drive to the 🎨 Spray Shop to fix it.",3)}if(n<4)C.warned=0}
