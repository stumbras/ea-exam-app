/* ================= Tesla Drive 3: real car feel =================
   Physics: the car has sideways momentum (spring + damping), so it leans into lane changes and slides wider on wet
   and snowy roads; regen braking is weaker on low grip. Traffic thinks: cars signal with a blinker for a second, then
   change lanes only when there is room; a car you come up behind shows brake lights. Looking ahead is rewarded
   (Smooth Pass for moving over early). Visuals: worn asphalt, rumble strips, guard rails, ground detail, skid marks,
   tire spray, brake-light glow, speed streaks. Sound: wind noise that rises with speed. A trip computer at the end
   shows efficiency, regen recovered, top speed and a driver rating. */
function kDrvSurf(D){if(!D||D.mode==="roadster"&&D.t>=30)return"dry";if(D.t>=38&&D.t<46)return"dry";if(D.eg&&D.eg.santa||D.t>=46)return"snow";if(D.rain)return"wet";return"dry"}
function kDrvGrip(D){const s=kDrvSurf(D);let g=s==="snow"?.5:s==="wet"?.64:1;if(g<1&&D.car&&(D.car[0]==="tk"||D.car[0]==="ct"))g=Math.min(1,g+.14);return g}
function kDrvLat(D,tx,dt,carY){const g=kDrvGrip(D),s=kDrvSurf(D);
  if(D._ln===undefined)D._ln=D.lane;
  if(D.lane!==D._ln){D.prevLane=D._ln;D.lastLaneT=D.t;
    if(!D.ap){let near=null;for(const o of D.obs)if(!o.done&&o.ln===D._ln&&(o.k==="car"||o.k==="cone")&&o.y<carY&&carY-o.y<430&&(!near||o.y>near.y))near=o;
      if(near){const gap=carY-near.y;if(gap>185)near.safe=1;else if(gap<115&&!D.lateSaid&&D.t>6){D.lateSaid=1;D.tip="👀 Close one! Look far ahead and move over early.";D.tipT=3}}}
    D._ln=D.lane}
  if(g<1&&D.surfSaid!==s){D.surfSaid=s;D.tip=s==="snow"?"❄️ Snow: the car slides. Steer and brake early.":"🌧️ Wet road: less grip. Steer early, brake early.";D.tipT=3.5}
  const k=260*g,cd=2*Math.sqrt(k)*(g<1?.5:.9);D.vx=D.vx||0;D.vx+=((tx-D.x)*k-D.vx*cd)*dt;D.x+=D.vx*dt;
  const yt=Math.max(-.2,Math.min(.2,D.vx/Math.max(200,D.v)*.42))*(g<1?1.35:1);D.yaw=(D.yaw||0)+(yt-(D.yaw||0))*Math.min(1,dt*14);
  D.skid=D.skid||[];const slide=g<1&&Math.abs(D.vx)>95,hard=D.brake&&D.v>250;
  if((slide||hard)&&!(D.jump>0)){const a=slide?.5:.3;D.skid.push({x:D.x-13,y:carY+34,a},{x:D.x+13,y:carY+34,a});if(D.skid.length>160)D.skid.splice(0,D.skid.length-160);
    if(slide&&!(D.slideS>0)){D.slideS=.5;try{kBeep("whoosh")}catch(_){}}}
  D.slideS=Math.max(0,(D.slideS||0)-dt);
  // trip computer
  D.top=Math.max(D.top||0,D.v);D.used=(D.used||0)+dt*1.05*D.car[5]*(D.plaid?1.5:1);if(D.brake&&D.bat<100)D.regen=(D.regen||0)+dt*3}
function kDrvTraffic(D,o,dt,carY,SP){
  if(o.k==="car"&&!SP&&!o.done){
    if(o.ai===undefined){o.ai=Math.random()<.36?1:0;o.sigY=30+Math.random()*90;o.dxf=0;o._ln=o.ln}
    if(o._ln!==o.ln){if(!o.dxf)o.dxf=o._ln-o.ln;o._ln=o.ln}                      // honked over: slide instead of jumping
    if(o.dxf){o.dxf+=(0-o.dxf)*Math.min(1,dt*4.5);if(Math.abs(o.dxf)<.02)o.dxf=0}
    const free=l=>l>=0&&l<=2&&!D.obs.some(q=>q!==o&&q.ln===l&&!q.done&&q.k!=="bolt"&&Math.abs(q.y-o.y)<150),gate=D.gate&&!D.gate.done;
    if(o.ai===1&&o.y>o.sigY&&o.y<carY-270&&!gate){const opts=[o.ln-1,o.ln+1].filter(free);if(opts.length){o.tg=kPick(opts);o.sig=o.tg>o.ln?1:-1;o.sigT=1;o.ai=2}else o.ai=0}
    else if(o.ai===2){o.sigT-=dt;if(o.sigT<=0){if(o.y<carY-180&&free(o.tg)&&!gate){o.dxf=o.ln-o.tg;o.ln=o.tg;o._ln=o.ln;o.ai=3;o.sigT=.6}else{o.ai=0;o.sig=0}}}
    else if(o.ai===3){o.sigT-=dt;if(o.sigT<=0){o.sig=0;o.ai=0}}
    o.brk=o.ln===D.lane&&o.y<carY&&carY-o.y<190?1:0}
  if((o.k==="car"||o.k==="cone")&&!o.done&&!o.cc&&o.y>carY+(o.k==="car"?74:46)){o.cc=1;
    if(o.safe&&!SP&&o.ln!==D.lane){D.smooth=(D.smooth||0)+1;D.bolts+=1;D.fx=(D.fx||[]).concat([{x:D.x,y:carY-56,t:0,k:"spark",txt:"👍 SMOOTH PASS +1"}]);try{kBeep("coin")}catch(_){}}}}
function kCar3(c,x,y,o,D,LW,night){const dx=(o.dxf||0)*LW,X=x+dx,rot=-(o.dxf||0)*.28,blink=Math.floor(D.t*5.5)%2===0;
  if(night>.3){const g=c.createLinearGradient(0,y-40,0,y-150);g.addColorStop(0,`rgba(255,250,210,${.22*night})`);g.addColorStop(1,"rgba(255,250,210,0)");c.fillStyle=g;c.beginPath();c.moveTo(X-14,y-36);c.lineTo(X-34,y-150);c.lineTo(X+34,y-150);c.lineTo(X+14,y-36);c.closePath();c.fill()}
  c.save();c.translate(X,y);if(rot)c.rotate(rot);kCar(c,0,0,40,74,o.col,o.sh);
  if(o.brk||night>.3){c.fillStyle=o.brk?"rgba(255,40,40,.95)":"rgba(255,60,60,.7)";c.fillRect(-17,33,10,4);c.fillRect(7,33,10,4);
    if(o.brk){const g=c.createRadialGradient(0,40,2,0,40,30);g.addColorStop(0,"rgba(255,40,40,.5)");g.addColorStop(1,"rgba(255,40,40,0)");c.fillStyle=g;c.fillRect(-32,22,64,40)}}
  if(o.sig&&blink){const sx=o.sig*19;c.fillStyle="#ffb703";c.beginPath();c.arc(sx,-33,4,0,7);c.arc(sx,33,4,0,7);c.fill();const g=c.createRadialGradient(sx,0,2,sx,0,26);g.addColorStop(0,"rgba(255,183,3,.45)");g.addColorStop(1,"rgba(255,183,3,0)");c.fillStyle=g;c.fillRect(sx-26,-44,52,88)}
  c.restore();
  if(o.sig&&o.ai===2){c.fillStyle="rgba(255,183,3,.95)";c.font="900 15px system-ui";c.textAlign="center";c.textBaseline="middle";c.fillText(o.sig>0?"▶":"◀",X+o.sig*34,y)}}
function kDrvHash(n){n=(n^61)^(n>>>16);n=n+(n<<3);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);n=n^(n>>>15);return(n>>>0)/4294967296}
function kDrvGround(c,D,W,H,RX,RW,biome){const snow=D.eg&&D.eg.santa||biome===2,px=D.dist*1500,off=px%120,n0=Math.floor(px/120);
  const dk=snow?"rgba(120,150,190,.16)":biome===1?"rgba(150,105,40,.16)":"rgba(0,60,0,.16)",lt=snow?"rgba(255,255,255,.55)":biome===1?"rgba(255,235,180,.22)":"rgba(170,230,120,.16)";
  for(let r=-1;r<Math.ceil(H/120)+1;r++){const n=n0-r,y=r*120+off;for(const side of[0,1]){const h1=kDrvHash(n*7+side*3+1),h2=kDrvHash(n*13+side*5+2),bx=side?RX+RW+6:0,bw=side?W-RX-RW-6:RX-6;
      c.fillStyle=h1<.5?dk:lt;c.beginPath();c.ellipse(bx+bw*(.25+h2*.5),y+h1*80,bw*(.25+h1*.3),14+h2*22,0,0,7);c.fill();
      if(biome===1&&!snow&&h2>.7){c.strokeStyle="rgba(140,95,40,.25)";c.lineWidth=1.5;for(let i=0;i<3;i++){c.beginPath();c.moveTo(bx+4,y+20+i*9);c.quadraticCurveTo(bx+bw/2,y+12+i*9,bx+bw-4,y+22+i*9);c.stroke()}}}}
  // shoulders and guard rails
  c.fillStyle=snow?"#d5dde8":biome===1?"#bf9a55":"#6f7a5c";c.fillRect(RX-12,0,8,H);c.fillRect(RX+RW+4,0,8,H);
  c.fillStyle="rgba(0,0,0,.18)";c.fillRect(RX-15,0,3,H);c.fillRect(RX+RW+12,0,3,H);
  c.fillStyle="#c9ced8";c.fillRect(RX-11,0,2,H);c.fillRect(RX+RW+9,0,2,H);c.fillStyle="#8b93a3";const po=px%40;for(let y=-40+po;y<H;y+=40){c.fillRect(RX-12,y,4,6);c.fillRect(RX+RW+8,y,4,6)}
  // speed streaks outside the road
  const sp=Math.max(0,Math.min(1,(D.v-235)/260));if(sp>0){c.strokeStyle=`rgba(255,255,255,${.1+sp*.22})`;c.lineWidth=1.5;c.beginPath();for(let i=0;i<10;i++){const side=i%2,x=(side?RX+RW+16:4)+kDrvHash(i*31+7)*(RX-22),y=((kDrvHash(i*17+3)*H)+px*1.6)%(H+80)-40,L=18+sp*46;c.moveTo(x,y);c.lineTo(x,y+L)}c.stroke()}
  const vg=c.createLinearGradient(0,0,W,0);vg.addColorStop(0,"rgba(0,0,0,.22)");vg.addColorStop(.12,"rgba(0,0,0,0)");vg.addColorStop(.88,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.22)");c.fillStyle=vg;c.fillRect(0,0,W,H)}
const kRoadFill0=kRoadFill;
kRoadFill=function(c,D,RX,RW,H){if(D.eg&&D.eg.rainbow)return kRoadFill0(c,D,RX,RW,H);const LW=RW/3,px=D.dist*1500,s=kDrvSurf(D);
  const g=c.createLinearGradient(RX,0,RX+RW,0);g.addColorStop(0,"#262a34");g.addColorStop(.5,"#30343f");g.addColorStop(1,"#262a34");c.fillStyle=g;c.fillRect(RX,0,RW,H);
  c.fillStyle="rgba(0,0,0,.13)";for(let i=0;i<3;i++){const cx=RX+LW*i+LW/2;c.fillRect(cx-16,0,9,H);c.fillRect(cx+7,0,9,H)}
  // seams and patched asphalt that scroll with the road
  const off=px%170,n0=Math.floor(px/170);for(let r=-1;r<Math.ceil(H/170)+1;r++){const y=r*170+off,n=n0-r,h=kDrvHash(n*11+5);c.fillStyle="rgba(255,255,255,.045)";c.fillRect(RX,y,RW,1.5);
    if(h>.55){c.fillStyle="rgba(0,0,0,.16)";c.fillRect(RX+10+h*(RW-70),y+30+h*60,34+h*30,22+h*26)}}
  if(s==="wet"){const w=c.createLinearGradient(0,0,0,H);w.addColorStop(0,"rgba(150,185,255,.05)");w.addColorStop(.5,"rgba(170,200,255,.16)");w.addColorStop(1,"rgba(150,185,255,.05)");c.fillStyle=w;c.fillRect(RX,0,RW,H);
    c.fillStyle="rgba(200,220,255,.10)";for(let i=0;i<5;i++){const x=RX+12+kDrvHash(i*5+1)*(RW-24),y=((kDrvHash(i*9+2)*H)+px)%(H+60)-30;c.beginPath();c.ellipse(x,y,16+kDrvHash(i)*14,7,0,0,7);c.fill()}}
  if(s==="snow"){c.fillStyle="rgba(255,255,255,.2)";for(let i=0;i<=3;i++)c.fillRect(RX+LW*i-9,0,18,H);c.fillStyle="rgba(255,255,255,.1)";for(let i=0;i<3;i++)c.fillRect(RX+LW*i+LW/2-5,0,10,H)}
  // rumble strips
  c.fillStyle="rgba(255,255,255,.07)";const ro=px%10;for(let y=-10+ro;y<H;y+=10){c.fillRect(RX+2,y,5,4);c.fillRect(RX+RW-7,y,5,4)}
  // skid marks
  const dy=(D.dist-(D._sd===undefined?D.dist:D._sd))*1500;D._sd=D.dist;if(D.skid&&D.skid.length){for(const m of D.skid){m.y+=dy;c.fillStyle=s==="snow"?`rgba(60,70,90,${m.a*.5})`:`rgba(8,8,10,${m.a})`;c.fillRect(m.x-3,m.y-4,6,dy+9)}D.skid=D.skid.filter(m=>m.y<H+20)}};
const kDriveCar0=kDriveCar;
kDriveCar=function(c,D,carY,SP,night){const sz=KCSZ[D.car[3]]||[48,92],s=kDrvSurf(D),yaw=SP?0:(D.yaw||0),air=D.jump>0||SP;
  // tire spray and snow dust
  if(!air&&(s==="wet"||s==="snow")&&D.v>120){const n=s==="wet"?9:6;for(let i=0;i<n;i++){const side=i%2?1:-1,t=Math.random(),x=D.x+side*(sz[0]/2-6)+side*t*16+(D.vx||0)*-.03*t*10,y=carY+sz[1]/2-8+t*46;c.fillStyle=s==="wet"?`rgba(205,225,255,${.32*(1-t)})`:`rgba(255,255,255,${.5*(1-t)})`;c.beginPath();c.arc(x,y,2+t*6,0,7);c.fill()}}
  c.save();c.translate(D.x,carY);c.rotate(yaw);c.translate(-D.x,-carY);
  if(D.brake&&!SP){const g=c.createRadialGradient(D.x,carY+sz[1]/2+6,3,D.x,carY+sz[1]/2+6,46);g.addColorStop(0,"rgba(255,30,30,.6)");g.addColorStop(1,"rgba(255,30,30,0)");c.fillStyle=g;c.fillRect(D.x-48,carY+sz[1]/2-30,96,84)}
  kDriveCar0(c,D,carY,SP,night);
  if(D.brake&&!SP){c.fillStyle="#ff2020";c.fillRect(D.x-sz[0]/2+4,carY+sz[1]/2-5,sz[0]-8,3.5);
    c.strokeStyle="rgba(46,194,126,.9)";c.lineWidth=2.5;c.lineCap="round";for(let i=0;i<3;i++){const p=((D.t*2.4+i/3)%1),y=carY+sz[1]/2+34-p*40;c.globalAlpha=1-p;c.beginPath();c.moveTo(D.x-7,y+5);c.lineTo(D.x,y-2);c.lineTo(D.x+7,y+5);c.stroke()}c.globalAlpha=1;c.lineCap="butt"}
  c.restore()};
function kDrvHud(c,D,W,H){if(D.mode==="roadster"&&D.t>=30)return;c.save();c.textBaseline="middle";
  c.textAlign="right";c.font="10px system-ui";c.fillStyle="#c7cbe6";c.fillText(`≈ ${Math.round(D.bat*3.1)} mi range`,W-10,38);
  const bx=46,bw=58,by=37,mid=bx+bw*.3;c.fillStyle="rgba(255,255,255,.16)";c.fillRect(bx,by,bw,6);
  if(D.brake){const f=Math.min(1,D.v/300);c.fillStyle="#2ec27e";c.fillRect(mid-(mid-bx)*f,by,(mid-bx)*f,6)}else{const f=Math.max(0,Math.min(1,(D.v-120)/430));c.fillStyle=D.plaid?"#ff9f1c":"#e5e7eb";c.fillRect(mid,by,(bx+bw-mid)*f,6)}
  c.fillStyle="#fff";c.fillRect(mid-.75,by-2,1.5,10);
  const g=kDrvGrip(D);if(g<1){const s=kDrvSurf(D),t=`${s==="snow"?"❄️":"🌧️"} GRIP ${Math.round(g*100)}%`;c.font="bold 10px system-ui";c.textAlign="left";c.fillStyle="rgba(5,8,24,.78)";c.beginPath();c.roundRect(6,58,78,18,8);c.fill();c.fillStyle=s==="snow"?"#bfe1ff":"#9fc5ff";c.fillText(t,12,67.5)}
  c.restore()}
// wind noise that rises with speed (shared by every vehicle that hums)
let kWnd=null;const kDriveHum0=kDriveHum;
kDriveHum=function(v){kDriveHum0(v);try{const k=S.kids;if(!v||!k||k.sound===false){if(kWnd)kWnd.g.gain.setTargetAtTime(0,kAC.currentTime,.08);return}if(!kAudio())return;
  if(!kWnd){const n=kAC.sampleRate*2,b=kAC.createBuffer(1,n,kAC.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){l=l*.985+(Math.random()*2-1)*.12;d[i]=l}
    const s=kAC.createBufferSource();s.buffer=b;s.loop=true;const f=kAC.createBiquadFilter();f.type="lowpass";f.frequency.value=400;const g=kAC.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(kMaster);s.start();kWnd={s,f,g}}
  const a=Math.max(0,Math.min(1,(v-150)/300));kWnd.g.gain.setTargetAtTime(a*.07,kAC.currentTime,.15);kWnd.f.frequency.setTargetAtTime(280+a*1100,kAC.currentTime,.15)}catch(_){}};
// trip computer on the end screen
function kDrvRate(D){let s=3;if(D.t>=60)s++;if(!D.crashes)s++;else if(D.crashes>=3)s--;if((D.smooth||0)>=3)s++;if((D.regen||0)>=6)s++;if(D.crashes>=5)s--;return Math.max(1,Math.min(5,s-1))}
const kDriveView0=kDriveView;
kDriveView=function(v){kDriveView0(v);try{const D=kDrv;if(!D||!D.over||KV.pick||KV.cartoon)return;const end=v.querySelector(".kend"),pad=end&&end.querySelector(".kpad");if(!pad||end.querySelector(".ktrip"))return;
  const net=Math.max(1,(D.used||0)-(D.regen||0)),wh=Math.round(net/Math.max(.3,D.dist)*11),st=kDrvRate(D),k=KS();if(!D.rated){D.rated=1;k.drive.rate=Math.max(k.drive.rate||0,st);persist()}
  pad.insertAdjacentHTML("beforebegin",`<div class="ktrip"><div class="ktriph">🖥️ TRIP COMPUTER</div><div class="ktripg">
    <div><b>${Math.round((D.top||0)/4.5)}</b><span>top mph</span></div><div><b>${wh}</b><span>Wh per mile</span></div><div><b>+${Math.round(D.regen||0)}%</b><span>regen recovered</span></div><div><b>${D.smooth||0}</b><span>smooth passes</span></div></div>
    <div class="ktripr">Driver rating ${"⭐".repeat(st)}${"☆".repeat(5-st)}</div><div class="ksmall">${D.crashes?`Tip: ${D.crashes} crash${D.crashes>1?"es":""}. Look far ahead and move over early for 👍 Smooth Passes.`:(D.regen||0)<6?"Tip: hold 🛑 Regen before a slow car. Braking puts energy back in the battery.":"Smooth, efficient driving. That is how real EV drivers get the most range."}</div></div>`)}catch(_){}};
