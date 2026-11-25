/* phone effects: rumble (Android vibrates; iPhone browsers do not allow vibration), screen flash, shake */
function kFxBuzz(p){try{if(KS().sound!==false&&navigator.vibrate)navigator.vibrate(p)}catch(_){}}
function kFxFlash(D,col,a){if(D)D.fl={c:col||"255,255,255",a:a||.6}}
function kFxPaint(c,D,W,H,dt){if(D&&D.fl&&D.fl.a>0){c.fillStyle=`rgba(${D.fl.c},${D.fl.a})`;c.fillRect(0,0,W,H);D.fl.a=Math.max(0,D.fl.a-dt*2.2)}}
/* ================= 🚀 Roadster Thrusters: the flying Tesla Roadster =================
   Side-view game for the new Roadster with the "SpaceX package": small cold-gas (compressed air) thrusters, the idea
   Elon Musk described for the Roadster, used here to jump canyons and fly. Cold gas means white puffs, not fire.
   Hold ⬆️ LIFT to fire the bottom thrusters, tap 🚀 BOOST for the rear thruster. The air tank refills while you drive
   on the road (a compressor). Fly over canyons, through rings, around drones. Real physics: gravity, thrust, drag. */
const KHV={g:900,lift:1650,boost:900,drag:.12,road:290,roof:170,flipV:420};
const KHVCOL=["#e31937","#f8fafc","#111827","#1d4ed8","#9ca3af","#b8bcc6"];
let kHv=null;
function kHvState(){const k=KS();k.hov=k.hov||{best:0,runs:0};return k.hov}
function kHvNew(){const s=kHvState();s.runs++;persist();
  kHv={x:0,y:0,vx:KHV.road,vy:0,air:100,lift:false,boost:false,t:0,last:0,dist:0,rings:0,lives:3,inv:0,over:false,shake:0,fx:[],segs:[],obs:[],ringsL:[],gen:0,wheel:0,ang:0,said:{},msg:"Hold ⬆️ LIFT to fly! Tap 🚀 BOOST for speed.",msgT:4,landed:true,pre:1,Q:(typeof kLandQ==="function"?kLandQ():null),airMax:100,traffic:[],tun:[],hops:0,upd:0,flip:false};
  kHvGen(kHv,2600)}
function kHvGen(D,upTo){while(D.gen<upTo){const x=D.gen;if(x<900){D.segs.push([x,x+900]);D.gen=x+900;continue}
    const gap=220+Math.random()*Math.min(480,160+x/18),len=380+Math.random()*700;D.segs.push([x+gap,x+gap+len]);
    if(Math.random()<.85)D.ringsL.push({x:x+gap*.5,y:120+Math.random()*120,got:0});
    {const a=x+gap,b=a+len;if(len>650&&x>2500&&Math.random()<.45)D.tun.push([a+80,b-80]);if(len>480&&Math.random()<.75){const n=len>800?2:1;for(let i=0;i<n;i++)D.traffic.push({x:a+len*(.3+.35*i),v:140+Math.random()*70,col:KHVCOL[Math.floor(Math.random()*KHVCOL.length)],ty:Math.floor(Math.random()*3),seg:[a,b],passed:0})}}
    if(x>2500&&Math.random()<.55)D.obs.push({x:x+gap+len*.5,y:150+Math.random()*120,ph:Math.random()*6,hit:0});
    if(Math.random()<.5)D.ringsL.push({x:x+gap+len*.6,y:180+Math.random()*120,got:0});
    D.gen=x+gap+len}}
function kHvInTun(D,x){return D.tun.some(t=>x>=t[0]&&x<=t[1])}
function kHvOnRoad(D,x){return D.segs.some(s=>x>=s[0]&&x<=s[1])}
function kHvStep(D,dt){if(D.over)return;D.t+=dt;if(D.inv>0)D.inv-=dt;if(D.msgT>0)D.msgT-=dt;
  const ground=kHvOnRoad(D,D.x)||kHvOnRoad(D,D.x+30)||kHvOnRoad(D,D.x-30);
  const tun=kHvInTun(D,D.x);
  if(D.flip){D.air=Math.min(100,D.air+10*dt);D.upd+=D.vx*dt;if(D.boost&&D.air>0){D.vx=Math.min(820,D.vx+KHV.boost*dt);D.air=Math.max(0,D.air-22*dt);kHvPuff(D,"back")}D.vx=Math.max(KHV.road,D.vx-30*dt);D.x+=D.vx*dt;D.dist=Math.max(D.dist,D.x);D.wheel+=D.vx*dt/14;D.y=KHV.roof;D.vy=0;
    if(!tun||D.vx<KHV.flipV-40){D.flip=false;D.y=KHV.roof-12;D.landed=false;kHvSay(D,"unflip"+Math.round(D.x/500),tun?"Too slow! Downforce needs speed, so you dropped off the ceiling.":"Tunnel exit: flip back down!")}
    kHvTraffic(D,dt);kHvObjects(D);return}
  let ay=-KHV.g;const la=Math.max(D.lift?1:0,D.tilt?(D.tLift||0):0);if(la>0&&D.air>0){ay+=KHV.lift*la;D.air=Math.max(0,D.air-28*dt);kHvPuff(D,"down")}
  let ax=0;if((D.boost||(D.tilt&&D.tBoost))&&D.air>0){ax+=KHV.boost;D.air=Math.max(0,D.air-22*dt);kHvPuff(D,"back")}
  if(D.landed){ax+=(KHV.road-D.vx)*1.2;D.air=Math.min(D.airMax,D.air+16*dt)}else ax-=D.vx*KHV.drag*.3;
  D.vx=Math.max(160,Math.min(820,D.vx+ax*dt));D.vy+=ay*dt;D.vy*=1-.15*dt;D.x+=D.vx*dt;D.y+=D.vy*dt;D.dist=Math.max(D.dist,D.x);D.wheel+=D.vx*dt/14;
  if(D.y<=0){if(ground){if(!D.landed&&D.vy<-650){D.shake=.6;kBeep("thud");kFxBuzz(70);kHvSay(D,"hard","Hard landing! Use a little LIFT just before you touch down.")}
      if(!D.landed&&D.vy<-200)for(let i=0;i<10;i++)D.fx.push({x:0,y:0,vx:(Math.random()-.5)*160,vy:-Math.random()*60,l:.6,s:3,c:"rgba(214,200,170,.8)"});
      D.y=0;D.vy=Math.max(0,D.vy);D.landed=true}
    else if(D.y<-220){kHvCrash(D,"Fell into the canyon!")}else D.landed=false}else D.landed=false;
  if(tun&&D.y>KHV.roof-45){D.y=KHV.roof-45;D.vy=Math.min(0,D.vy)}
  kHvTraffic(D,dt);
  if(D.y>520){D.y=520;D.vy=Math.min(0,D.vy);kHvSay(D,"top","That's the top of the sky lane!")}
  D.ang=D.landed?0:Math.max(-.5,Math.min(.5,Math.atan2(D.vy,D.vx)*.7));
  kHvObjects(D);
  if(D.air<=0)kHvSay(D,"air","Air tank empty! Land on the road to refill it.");
  if(D.x>D.gen-1600)kHvGen(D,D.gen+2400);
  D.segs=D.segs.filter(s=>s[1]>D.x-800);D.ringsL=D.ringsL.filter(r=>r.x>D.x-800);D.obs=D.obs.filter(o=>o.x>D.x-800);D.traffic=D.traffic.filter(t=>t.x>D.x-900);D.tun=D.tun.filter(t=>t[1]>D.x-900)}
function kHvObjects(D){
  for(const r of D.ringsL)if(!r.got&&Math.abs(r.x-D.x)<34&&Math.abs(r.y-(D.y+14))<44){r.got=1;D.rings++;D.air=Math.min(D.airMax,D.air+25);kBeep("coin");kFxFlash(D,"253,224,71",.35);kFxBuzz(20);for(let i=0;i<16;i++)D.fx.push({x:0,y:-10,vx:Math.cos(i)*140,vy:Math.sin(i)*140,l:.7,s:3,c:"#fde047"})}
  for(const o of D.obs){const oy=o.y+Math.sin(D.t*2+o.ph)*30;if(!o.hit&&D.inv<=0&&Math.abs(o.x-D.x)<40&&Math.abs(oy-(D.y+12))<30){o.hit=1;D.inv=1.5;D.lives--;D.shake=.8;kBeep("bad");kFxFlash(D,"239,68,68",.5);kFxBuzz([60,40,60]);kHvSay(D,"drone"+D.lives,D.lives>0?`Bonk! Drone hit. ${D.lives} ❤️ left.`:"");if(D.lives<=0)kHvCrash(D,"Too many drone hits!")}}
}
function kHvTraffic(D,dt){for(const t of D.traffic){t.x+=t.v*dt;if(t.x>t.seg[1]-60)t.x=t.seg[1]-60;const dx=t.x-D.x;
    if(!D.flip&&Math.abs(dx)<62){if(D.y<30&&D.inv<=0){D.inv=1.5;D.lives--;D.shake=.8;kFxFlash(D,"239,68,68",.5);kFxBuzz([60,40,60]);D.vx=Math.max(160,t.v);kBeep("bad");kHvSay(D,"car"+D.lives,D.lives>0?`Bumped a car! Use ⬆️ LIFT to hop over traffic. ${D.lives} ❤️ left.`:"");if(D.lives<=0)kHvCrash(D,"Too many bumps!")}
      else if(D.y>=30&&D.y<52&&D.vy<0){D.vy=520;D.y=52;kBeep("coin");D.hops++;kFxBuzz(25);kFxFlash(D,"255,255,255",.25);kHvSay(D,"bounce","Roof bounce! Boing!")}}
    if(!t.passed&&dx<-62&&(D.y>36||D.flip)){t.passed=1;D.hops++;kBeep("coin");kHvSay(D,"hop"+D.hops%3,D.flip?"Upside down over traffic! Legendary!":"Traffic hop! +30")}}}
function kHvPuff(D,dir){if(Math.random()<.55)return;if(dir==="down"){for(const ox of[-26,22])D.fx.push({x:ox,y:2,vx:(Math.random()-.5)*50-D.vx*.15,vy:160+Math.random()*120,l:.55,s:3+Math.random()*2,c:"rgba(226,240,255,.9)",grow:1})}
  else D.fx.push({x:-44,y:-10,vx:-(240+Math.random()*120),vy:(Math.random()-.5)*40,l:.5,s:3+Math.random()*2,c:"rgba(226,240,255,.9)",grow:1});
  if(!D.hiss||D.t-D.hiss>.35){D.hiss=D.t;kBeep("whoosh")}}
function kHvSay(D,key,txt){if(!txt||D.said[key])return;D.said[key]=1;D.msg=txt;D.msgT=3.5;kLine(txt,2)}
function kHvCrash(D,why){D.lives=0;D.over=true;D.why=why;D.shake=1;kBeep("bad");kFxFlash(D,"239,68,68",.8);kFxBuzz([120,60,200]);const s=kHvState(),k=KS();const score=Math.round(D.dist/10)+D.rings*25+D.hops*30+Math.round(D.upd/5);D.score=score;
  if(score>s.best){s.best=score;D.newBest=1}k.fly=k.fly||{done:{},pts:0};const pts=Math.min(150,Math.round(score/20));k.fly.pts=(k.fly.pts||0)+pts;D.pts=pts;persist();
  setTimeout(()=>{if(kHv===D&&KV.scr==="hover")render()},1300)}
function kHvTraffCar(c,x,gY,t){c.save();c.translate(x,gY-10);const col=t.col,g=c.createLinearGradient(0,-36,0,0);g.addColorStop(0,kShade(col,.25));g.addColorStop(1,kShade(col,-.35));c.fillStyle=g;c.beginPath();
  if(t.ty===2){c.moveTo(-48,-6);c.lineTo(-46,-24);c.lineTo(4,-38);c.lineTo(48,-24);c.lineTo(50,-6);c.closePath()}
  else if(t.ty===1){c.moveTo(-46,-6);c.quadraticCurveTo(-48,-28,-30,-32);c.quadraticCurveTo(0,-44,24,-34);c.quadraticCurveTo(44,-28,48,-12);c.lineTo(48,-6);c.closePath()}
  else{c.moveTo(-46,-6);c.quadraticCurveTo(-48,-22,-34,-26);c.quadraticCurveTo(-6,-40,18,-32);c.quadraticCurveTo(42,-26,48,-12);c.lineTo(48,-6);c.closePath()}
  c.fill();c.strokeStyle="rgba(0,0,0,.3)";c.stroke();c.fillStyle="#0f172a";c.beginPath();if(t.ty===2){c.moveTo(-20,-28);c.lineTo(4,-35);c.lineTo(28,-28);c.closePath()}else{c.moveTo(-26,-27);c.quadraticCurveTo(-2,-38,20,-30);c.lineTo(20,-26);c.lineTo(-26,-25);c.closePath()}c.fill();
  c.fillStyle="#f8fafc";c.fillRect(44,-14,6,2);c.fillStyle="#ef4444";c.fillRect(-48,-14,4,3);for(const wx of[-28,28]){c.fillStyle="#0b0c10";c.beginPath();c.arc(wx,-2,9,0,7);c.fill();c.fillStyle="#9ca3af";c.beginPath();c.arc(wx,-2,5,0,7);c.fill()}c.restore()}
function kHvRoadster(c,D){const t=D.wheel;c.save();
  // body: long low wedge, red paint, glass roof
  const g=c.createLinearGradient(0,-34,0,0);g.addColorStop(0,"#ff5a6a");g.addColorStop(.55,"#e31937");g.addColorStop(1,"#8f0f22");c.fillStyle=g;
  c.beginPath();c.moveTo(-50,-8);c.quadraticCurveTo(-52,-20,-40,-22);c.lineTo(-18,-26);c.quadraticCurveTo(-4,-38,16,-34);c.quadraticCurveTo(34,-28,46,-16);c.quadraticCurveTo(54,-12,52,-6);c.lineTo(50,-2);c.lineTo(-48,-2);c.closePath();c.fill();
  c.fillStyle="#0f172a";c.beginPath();c.moveTo(-14,-26);c.quadraticCurveTo(-2,-36,14,-33);c.quadraticCurveTo(26,-30,32,-24);c.lineTo(-14,-24);c.closePath();c.fill();
  c.fillStyle="rgba(255,255,255,.28)";c.beginPath();c.moveTo(-6,-29);c.quadraticCurveTo(2,-34,10,-32);c.lineTo(4,-27);c.closePath();c.fill();
  c.strokeStyle="rgba(0,0,0,.25)";c.lineWidth=1;c.beginPath();c.moveTo(4,-24);c.lineTo(6,-4);c.stroke();
  c.fillStyle="#f8fafc";c.fillRect(44,-14,8,2.5);c.fillStyle="#ff2a3a";c.fillRect(-51,-15,5,3);
  // thruster nozzles (SpaceX package)
  c.fillStyle="#334155";c.fillRect(-29,-3,9,4);c.fillRect(19,-3,9,4);c.fillRect(-53,-10,4,6);
  // wheels with turning rims
  for(const wx of[-30,30]){c.fillStyle="#0b0c10";c.beginPath();c.arc(wx,0,10,0,7);c.fill();c.fillStyle="#9ca3af";c.beginPath();c.arc(wx,0,6,0,7);c.fill();c.strokeStyle="#4b5563";c.lineWidth=1.5;for(let i=0;i<5;i++){const a=t+i*1.2566;c.beginPath();c.moveTo(wx,0);c.lineTo(wx+Math.cos(a)*6,Math.sin(a)*6);c.stroke()}}
  c.fillStyle="#fff";c.font="900 9px system-ui";c.textAlign="center";c.fillText("T",36,-18);c.restore()}
function kHvDraw(c,D,W,H){const camY=Math.max(0,(D.flip?KHV.roof:D.y)-(H-200)),gY=H-80+camY,cx=W*.3,sx=x=>cx+(x-D.x),sy=y=>gY-y,sh=D.shake>0?(Math.random()-.5)*10*D.shake:0;c.save();c.translate(sh,sh*.5);
  const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#1e1b4b");sky.addColorStop(.45,"#7c3aed");sky.addColorStop(.75,"#f97316");sky.addColorStop(1,"#fde68a");c.fillStyle=sky;c.fillRect(-10,-10,W+20,H+20);
  c.fillStyle="rgba(255,240,200,.9)";c.beginPath();c.arc(W*.78,H*.42,26,0,7);c.fill();
  for(let i=0;i<30;i++){c.fillStyle=`rgba(255,255,255,${.3+.3*Math.sin(D.t+i)})`;c.fillRect((i*97)%W,(i*53)%(H*.3),1.5,1.5)}
  // parallax: far mountains, city skyline, near hills
  const par=(f,col,hgt,step,seed)=>{c.fillStyle=col;c.beginPath();c.moveTo(-10,gY);const off=(D.x*f)%step;for(let x=-step;x<=W+step;x+=step){const k=Math.floor((D.x*f+x)/step)+seed;const hh=hgt*(.5+.5*Math.abs(Math.sin(k*1.7)));c.lineTo(x-off,gY-hh);c.lineTo(x-off+step*.5,gY-hh*.7)}c.lineTo(W+10,gY);c.closePath();c.fill()};
  par(.08,"rgba(76,29,149,.75)",160,90,3);
  {const f=.22,step=34,off=(D.x*f)%step;for(let x=-step;x<=W+step;x+=step){const k=Math.floor((D.x*f+x)/step);const bh=50+Math.abs(Math.sin(k*2.3))*110;c.fillStyle="rgba(30,27,75,.92)";c.fillRect(x-off,gY-bh,step-4,bh);c.fillStyle="rgba(253,224,71,.75)";for(let wy=gY-bh+8;wy<gY-8;wy+=12)for(let wx=4;wx<step-10;wx+=9)if(((k*7+wy+wx)|0)%5===0)c.fillRect(x-off+wx,wy,4,5)}}
  par(.5,"rgba(20,20,40,.9)",40,60,9);
  // road segments and canyons
  c.fillStyle="#1c1917";c.fillRect(-10,gY,W+20,H-gY+10);
  for(const s of D.segs){const a=sx(s[0]),b=sx(s[1]);if(b<-20||a>W+20)continue;c.fillStyle="#374151";c.fillRect(a,gY,b-a,16);c.fillStyle="#57534e";c.fillRect(a,gY+16,b-a,H-gY);
    c.fillStyle="#fde047";for(let x=Math.ceil(s[0]/60)*60;x<s[1]-20;x+=60)c.fillRect(sx(x),gY+7,26,3);c.fillStyle="#9ca3af";c.fillRect(a,gY-8,b-a,3);for(let x=Math.ceil(s[0]/80)*80;x<s[1];x+=80)c.fillRect(sx(x),gY-8,3,8);
    c.fillStyle="#78716c";c.beginPath();c.moveTo(b,gY);c.lineTo(b+18,H);c.lineTo(b,H);c.fill();c.beginPath();c.moveTo(a,gY);c.lineTo(a-18,H);c.lineTo(a,H);c.fill()}
  // tunnels: dark inside, concrete roof, lights
  for(const t of D.tun){const a=sx(t[0]),b=sx(t[1]);if(b<-30||a>W+30)continue;const rt=sy(KHV.roof);c.fillStyle="rgba(15,23,42,.82)";c.fillRect(a,rt,b-a,gY-rt);
    c.fillStyle="#57534e";c.fillRect(a-6,rt-26,b-a+12,26);c.fillStyle="#44403c";c.fillRect(a-6,rt-4,b-a+12,4);c.fillStyle="#78716c";c.fillRect(a-10,rt-26,10,gY-rt+26);
    for(let x=Math.ceil(t[0]/90)*90;x<t[1];x+=90){const lx=sx(x);c.fillStyle="rgba(253,230,138,.95)";c.fillRect(lx,rt+1,16,3);const lg=c.createLinearGradient(0,rt,0,rt+60);lg.addColorStop(0,"rgba(253,230,138,.25)");lg.addColorStop(1,"rgba(253,230,138,0)");c.fillStyle=lg;c.fillRect(lx-10,rt,36,60)}
    c.fillStyle="#fde047";c.font="bold 10px system-ui";c.textAlign="center";if(a>0&&a<W)c.fillText("🔄 FLIP ZONE",a+44,rt-10)}
  // traffic: side-view Teslas
  for(const t of D.traffic){const x=sx(t.x);if(x<-80||x>W+80)continue;kHvTraffCar(c,x,gY,t)}
  // rings and drones
  for(const r of D.ringsL){if(r.got)continue;const x=sx(r.x),y=sy(r.y);if(x<-40||x>W+40)continue;c.strokeStyle="#fde047";c.lineWidth=5;c.shadowColor="#fde047";c.shadowBlur=12;c.beginPath();c.ellipse(x,y,12,34,0,0,7);c.stroke();c.shadowBlur=0}
  for(const o of D.obs){const x=sx(o.x),y=sy(o.y+Math.sin(D.t*2+o.ph)*30);if(x<-40||x>W+40||o.hit)continue;c.fillStyle="#111827";c.fillRect(x-16,y-5,32,10);c.fillStyle="#ef4444";c.beginPath();c.arc(x,y,3+Math.sin(D.t*8)*1,0,7);c.fill();c.strokeStyle="#9ca3af";c.lineWidth=2;for(const s of[-1,1]){c.beginPath();c.moveTo(x+s*16,y-5);c.lineTo(x+s*16,y-10);c.stroke();c.beginPath();c.ellipse(x+s*16,y-11,10,2,D.t*30%1,0,7);c.stroke()}}
  // speed lines when boosting
  if(D.boost&&D.air>0){c.strokeStyle="rgba(255,255,255,.35)";c.lineWidth=1.5;for(let i=0;i<10;i++){const y=(i*67+D.t*900)%H;c.beginPath();c.moveTo(W,y);c.lineTo(W-120,y);c.stroke()}}
  // car
  const carY=sy(D.y);if(!(D.inv>0&&Math.floor(D.t*12)%2)&&!(D.over&&D.lives<=0)){
    if(!D.flip&&D.y<120){c.fillStyle=`rgba(0,0,0,${.35*(1-D.y/120)})`;c.beginPath();c.ellipse(cx,gY+2,50*(1-D.y/300),5,0,0,7);c.fill()}
    c.save();if(D.flip){c.translate(cx,sy(KHV.roof)+10);c.scale(1,-1)}else{c.translate(cx,carY-10);c.rotate(-D.ang)}kHvRoadster(c,D);c.restore()}
  for(const p of D.fx){c.globalAlpha=Math.max(0,Math.min(1,p.l*1.6));c.fillStyle=p.c;c.beginPath();c.arc(cx+p.x,carY-10+p.y,p.s,0,7);c.fill()}c.globalAlpha=1;
  c.restore();
  // HUD
  c.fillStyle="rgba(2,6,23,.6)";c.fillRect(6,6,W-12,30);c.fillStyle="#f8fafc";c.font="bold 12px system-ui";c.textAlign="left";c.fillText(`📏 ${Math.round(D.dist/10)} m   ⭕ ${D.rings}   ${"❤️".repeat(Math.max(0,D.lives))}`,12,26);
  c.textAlign="right";c.fillText(`${Math.round(D.vx*.36)} km/h`,W-12,26);
  c.fillStyle="rgba(2,6,23,.6)";c.fillRect(6,40,110,16);c.fillStyle=D.air>25?"#7dd3fc":"#f87171";c.fillRect(8,42,106*Math.min(1,D.air/100),12);c.fillStyle="#0f172a";c.font="bold 10px system-ui";c.textAlign="left";c.fillText("💨 AIR",12,52);
  if(D.msgT>0){c.fillStyle="rgba(2,6,23,.6)";c.fillRect(6,H-34,W-12,28);c.fillStyle="#fde047";c.font="bold 11px system-ui";c.textAlign="center";c.fillText(D.msg,W/2,H-16)}}
function kHvLoop(ts){const D=kHv,cv=document.getElementById("khov");if(!D||KV.scr!=="hover"||!cv)return;const c=cv.getContext("2d");const dt=D.last?Math.min(.04,(ts-D.last)/1000):0;D.last=ts;
  kHvStep(D,dt);D.shake=Math.max(0,D.shake-dt*1.5);for(const p of D.fx){p.x+=p.vx*dt-D.vx*dt*.0;p.y+=p.vy*dt;p.l-=dt;if(p.grow)p.s*=1+dt*2.2}D.fx=D.fx.filter(p=>p.l>0).slice(-260);
  kHvDraw(c,D,cv.width,cv.height);kFxPaint(c,D,cv.width,cv.height,dt);if(D.lift&&D.air>0&&Math.random()<.08)kFxBuzz(12);if(!D.over||D.lives>0)requestAnimationFrame(kHvLoop);else{kHvDraw(c,D,cv.width,cv.height)}}
function kHvView(v){const s=kHvState(),k=KS(),D=kHv;
  if(!D||D.over){v.innerHTML=`<div class="kids">${kToastHtml()}${kTop("🚀 Roadster Thrusters","pschool")}
    <div class="kcard kcityhero" style="background:linear-gradient(135deg,#1e1b4b,#7c3aed 55%,#f97316)"><div class="kcityt">🚀 ROADSTER THRUSTERS</div><div class="ksmall" style="color:#fff">The new Tesla Roadster with the SpaceX package: little cold-air thrusters that make it jump and fly! Fly over canyons, through gold rings, and dodge the drones.</div></div>
    ${D&&D.over?`<div class="kcard kend"><div class="kbig2">${D.newBest?"🏆":"💨"}</div><h2>${D.newBest?"New record!":esc(D.why||"Run over")}</h2><p>📏 ${Math.round(D.dist/10)} m · ⭕ ${D.rings} rings · score ${D.score} · +${D.pts} pilot points</p></div>`:""}
    <div class="kcard"><div class="ksmall">🏆 Best score: <b>${s.best}</b> · runs: ${s.runs}</div><div class="ksmall">⬆️ <b>LIFT</b> fires the bottom thrusters · 🚀 <b>BOOST</b> fires the back thruster · 💨 the air tank refills when you drive on the road · ⭕ rings give air back</div></div>
    <div class="kpad">${(k.tix||0)>0?`<button class="kbtn big green" data-khv="go">🚀 Drive! (1 🎟️ · you have ${k.tix||0})</button>`:`<div class="ksmall">Out of tickets: earn more by learning.</div>`}</div>
    <div class="kcard"><div class="ksmall">🧪 <b>Real science:</b> a cold-gas thruster lets out compressed air very fast. Newton's third law: air pushed down pushes the car up! Real spacecraft (and SpaceX's Falcon 9 grid-fin steering) use cold-gas thrusters too.</div></div></div>`;return}
  if(D.pre&&D.Q){const Q=D.Q;v.innerHTML=`<div class="kids">${kToastHtml()}${kTop("🚀 Roadster Thrusters","pschool")}<div class="kcard"><div class="kh">🧠 Engineer's check</div><div class="kdbqt" style="font-size:17px;margin:8px 0">${esc(Q.q)}</div><div class="kdbqo">${Q.o.map((x,i)=>`<button class="kbtn" data-khv="q${i}">${esc(x)}</button>`).join("")}</div><div class="kpad"><button class="kbtn ghost small" data-khv="qskip">Skip ▶</button></div><div class="ksmall">Right answer = a bigger air tank (+25%) and a 4th ❤️!</div></div></div>`;return}
  const W=Math.min(400,v.clientWidth||360)-4,H=Math.round(W*1.15);
  v.innerHTML=`<div class="kids">${kToastHtml()}${kTop("🚀 Roadster Thrusters","pschool")}<div class="kdrvbox"><canvas id="khov" width="${W}" height="${H}" style="border-radius:14px;display:block;margin:auto;touch-action:none"></canvas></div>
   <div class="kpad kdrvbtns"><button class="kbtn big hvhold" id="khv_l" style="flex:2;background:#38bdf8;color:#04243a">⬆️ LIFT</button><button class="kbtn big hvhold lthr" id="khv_b">🚀 BOOST</button></div>
   <div class="kpad kdrvbtns" style="gap:6px"><button class="kbtn" data-khv="flip">🔄 FLIP</button><button class="kbtn ghost" id="khvtilt" data-khv="tilt">📱 Tilt ${D.tilt?"ON":"off"}</button></div>
   <div class="ksmall">Keys: Space or ↑ lift · → boost · F flip. 📱 Tilt: tip the phone back to lift, to the right to boost.</div></div>`;
  const cv=document.getElementById("khov");try{kHdSetup(cv)}catch(_){}D.last=0;requestAnimationFrame(kHvLoop)}
function kHvFlip(){const D=kHv;if(!D||D.over)return;if(D.flip)return;if(!kHvInTun(D,D.x)){kHvSay(D,"needtun"+Math.round(D.x/300),"Flip only works inside a 🔄 FLIP ZONE tunnel!");return}if(D.vx<KHV.flipV){kHvSay(D,"slow"+Math.round(D.x/300),"Too slow to flip! BOOST first: downforce needs speed.");return}
  D.flip=true;D.y=KHV.roof;D.vy=0;kBeep("whoosh");kFxFlash(D,"125,211,252",.55);kFxBuzz([30,30,30]);try{navigator.vibrate&&navigator.vibrate(40)}catch(_){}kHvSay(D,"flip"+Math.round(D.x/500),"Upside down! Speed + downforce = ceiling driving!")}
function kHvTiltOn(){const D=kHv;if(!D)return;const on=()=>{D.tilt=true;D.t0=null;kT("📱 Tilt on: tip back to lift, right to boost");const b=document.getElementById("khvtilt");if(b)b.textContent="📱 Tilt ON"};
  try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==="function"){DeviceOrientationEvent.requestPermission().then(r=>{if(r==="granted")on();else kT("Tilt was not allowed.")}).catch(()=>kT("Tilt needs permission."))}else on()}catch(_){on()}}
window.addEventListener("deviceorientation",e=>{const D=kHv;if(!D||!D.tilt||e.beta==null)return;const ang=(screen.orientation&&screen.orientation.angle)||window.orientation||0;const b=ang===90?-e.gamma:(ang===-90||ang===270)?e.gamma:e.beta,g=ang===90?e.beta:(ang===-90||ang===270)?-e.beta:e.gamma;
  if(D.t0==null)D.t0=b;D.tb=(D.tb==null?b:D.tb*.7+b*.3);D.tLift=Math.max(0,Math.min(1,(D.t0-D.tb-4)/18));D.tBoost=g>14});
function kHvClick(d){const k=KS();if(kHv&&kHv.pre&&/^q\d$/.test(d.khv)){const D=kHv,i=+d.khv.slice(1),Q=D.Q,ok=i===Q.a;try{kAnswer(Q.s||"sci",ok,Q)}catch(_){}if(ok){D.airMax=125;D.air=125;D.lives=4;kT("🧠 Correct! Bigger air tank and a 4th ❤️!")}else kT(`Answer: ${Q.o[Q.a]}. No bonus this time.`);D.pre=0;render();return}if(kHv&&kHv.pre&&d.khv==="qskip"){kHv.pre=0;render();return}if(d.khv==="flip")return kHvFlip();if(d.khv==="tilt"){if(kHv&&kHv.tilt){kHv.tilt=false;const b=document.getElementById("khvtilt");if(b)b.textContent="📱 Tilt off";return}return kHvTiltOn()}if(d.khv==="go"){if((k.tix||0)<1){kT("You need a 🎟️ ticket. Learn to earn one!");render();return}k.tix--;kHvNew();kBeep("click");kLine("Roadster with SpaceX package. Thrusters armed. Go!",2);render()}}
const kHvH={};document.addEventListener("pointerdown",e=>{try{if(view!=="kids"||KV.scr!=="hover"||!kHv)return;const b=e.target.closest&&e.target.closest(".hvhold");if(!b)return;e.preventDefault();const m={khv_l:"lift",khv_b:"boost"}[b.id];if(!m)return;kHv[m]=true;kHvH[e.pointerId]=m}catch(_){}});
["pointerup","pointercancel"].forEach(ev=>document.addEventListener(ev,e=>{if(!kHv)return;const m=kHvH[e.pointerId];if(m){kHv[m]=false;delete kHvH[e.pointerId]}},true));
document.addEventListener("keydown",e=>{if(typeof view==="undefined"||view!=="kids"||KV.scr!=="hover"||!kHv)return;if(e.key===" "||e.key==="ArrowUp"){e.preventDefault();kHv.lift=true}if(e.key==="ArrowRight")kHv.boost=true;if(e.key==="f"||e.key==="F")kHvFlip()});
document.addEventListener("keyup",e=>{if(!kHv)return;if(e.key===" "||e.key==="ArrowUp")kHv.lift=false;if(e.key==="ArrowRight")kHv.boost=false});
