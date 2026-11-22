/* ================= Sky Pilot realism: weather, turbulence, emergencies, ATC radio, crash physics, honest landings =================
   - Landing checks: stalled drops, nose-first and way-too-fast touchdowns crash; running off the runway end crashes.
   - Weather each flight: clear, clouds, rain with turbulence, or a thunderstorm (dark clouds, lightning, gusts, crosswind).
   - Emergencies (some flights): engine failure, rough engine, bird strike, stuck landing gear, fuel leak.
   - Air traffic control talks to the pilot; he picks the right radio reply (readbacks, MAYDAY vs PAN-PAN, traffic clock positions). */
function kFxR(a,b){return a+Math.random()*(b-a)}
function kFxSpecial(F){const st=(KFLYM[F.lv]||{}).start;return["form","boom","sar","drone","miss","nav"].includes(st)||F.lv===3}
function kFxWeather(F){const lv=F.lv,r=Math.random();let t=lv===0?(r<.6?"clear":"clouds"):r<.36?"clear":r<.66?"clouds":r<.86?"rain":"storm";
  const W={clear:{s0:"#2f7fd8",s1:"#bfe1f7",turb:.12,wind:kFxR(0,4),n:14,col:"rgba(255,255,255,.88)",rain:0,nm:"☀️ Clear"},clouds:{s0:"#4b7fb8",s1:"#cfdbe6",turb:.3,wind:kFxR(2,7),n:45,col:"rgba(245,247,250,.9)",rain:0,nm:"☁️ Cloudy"},
   rain:{s0:"#56677d",s1:"#9aa7b4",turb:.6,wind:kFxR(5,10),n:55,col:"rgba(196,202,212,.93)",rain:90,nm:"🌧️ Rain + bumps"},storm:{s0:"#2b3140",s1:"#5c6472",turb:1.15,wind:kFxR(9,16),n:65,col:"rgba(98,104,120,.95)",rain:170,nm:"⛈️ Thunderstorm"}}[t];
  const dir=Math.random()*6.283;return Object.assign({t,wx:Math.sin(dir)*W.wind,wz:Math.cos(dir)*W.wind,dir,cur:{p:0,r:0,v:0},tgt:{p:0,r:0,v:0},nT:0,flT:kFxR(5,12),fl:0},W)}
function kFxClouds(F){const w=kFlyWorld();for(let i=w.length-1;i>=0;i--)if(w[i].wx)w.splice(i,1);const W=F.wx;const base=W.t==="storm"?220:W.t==="rain"?280:380;
  for(let i=0;i<W.n;i++)w.push({k:"cloud",wx:1,x:kFxR(-5500,6500),z:kFxR(-2500,9500),y:base+kFxR(0,W.t==="clear"?250:420),s:kFxR(90,W.t==="storm"?260:190),col:W.col})}
function kFxEm(F){if(F.lv<1||kFxSpecial(F)||F.P.heli||F.P.drone||Math.random()>.45)return{on:false,type:null};const r=Math.random(),type=r<.3?"engine":r<.5?"rough":r<.7?"bird":r<.85?"gear":"fuel";return{on:false,type,at:kFxR(30,100),thrMul:null,tries:0}}
function kFlyReset(F){kFlyReset0(F);F.wx=kFxWeather(F);kFxClouds(F);F.em=kFxEm(F);F.atc={said:{},q:null,trafT:kFxR(45,110),pts:0};F.fx={deb:[],fire:null,shake:0,flash:0,crack:0,stallT:0,banner:null};F.airT=0;F.onRw=0;F.bounced=0;F.traffic=null;F.birds=null;
  F.balloons=[{x:-900,z:1600,y:260},{x:1200,z:4200,y:340}];kFlySay(`${F.wx.nm} today. Wind ${Math.round(Math.hypot(F.wx.wx,F.wx.wz))} m/s from the ${["north","north-east","east","south-east","south","south-west","west","north-west"][Math.round(((F.wx.dir+Math.PI)%6.283)/0.785)%8]}.`,4)}
function kFlyCrash(F,msg){if(F.crashT>0)return;const P=F.P;F.fx=F.fx||{deb:[]};F.fx.deb=[];for(let i=0;i<18;i++)F.fx.deb.push({x:P.x,y:Math.max(.5,P.y),z:P.z,vx:kFxR(-14,14)+Math.sin(P.psi)*P.v*.4,vy:kFxR(4,16),vz:kFxR(-14,14)+Math.cos(P.psi)*P.v*.4,c:["#e5e7eb","#9ca3af","#ef4444","#111827","#f59e0b"][i%5],s:kFxR(.6,2.2),r:Math.random()*6});
  F.fx.fire={x:P.x,y:Math.max(0,P.y),z:P.z,t:0};F.fx.shake=1;F.fx.flash=1;kFlyCrash0(F,msg);F.crashT=3.6}
function kFlyTouch(F,sink){const P=F.P;if(P.heli||P.drone)return kFlyTouch0(F,sink);const vs=kFlyStall(P);
  if(P.gear&&!kFlyWater(P.x,P.z)){
    if(P.v<vs*.92&&sink>2.4)return kFlyCrash(F,`💥 STALL CRASH! You ran out of airspeed and dropped. Keep at least ${Math.round(vs*1.2)} m/s until just above the runway, then flare.`);
    if(P.th<-.1&&sink>1.8)return kFlyCrash(F,"💥 NOSE FIRST! Raise the nose a little (flare) right before the wheels touch.");
    if(P.v>vs*2.05)return kFlyCrash(F,`💥 WAY TOO FAST! Landing speed is about ${Math.round(vs*1.3)} m/s. Slow down on the approach.`);
    if(P.v>vs*1.6&&!F.bounced){F.bounced=1;P.y=1.6;P.th=.06;kBeep("click");kVib&&kVib(60);kFlySay(`🏀 BOUNCE! Too fast to stay on the ground (${Math.round(P.v)} m/s). Throttle back and let it settle.`,3.5);return}}
  kFlyTouch0(F,sink);if(F.crashT>0)return;F.onRw=kFlyRw(P.x,P.z)?1:0;
  if(P.v>vs*2)kFlySay("😬 Hot landing! Too fast: brake hard (throttle to 0).",3);
  if(F.em&&F.em.on&&(F.em.type==="engine"||F.em.type==="fuel")&&!F.em.saved){F.em.saved=1;F.pts+=100;kTrophy("deadstick","🪂","Dead-stick hero!","Landed safely with no engine power.");kFlySay("🪂 DEAD-STICK LANDING! You landed with no engine. Real pilots train for this! +100",5)}}
function kFxSpeak(t){try{if(KS().sound===false||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(t.replace(/[^\w\s,.!'-]/g," "));u.rate=1.08;u.pitch=.8;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(_){}}
function kAtcAsk(F,key,who,text,opts,why){if(F.atc.said[key]||F.atc.q&&F.atc.q.ans==null)return;F.atc.said[key]=1;const ord=kShuf(opts.map((x,i)=>i));F.atc.q={key,who,text,o:ord.map(i=>opts[i]),a:ord.indexOf(0),why,ans:null,t:0};kBeep("chime");kFxSpeak(text)}
function kAtcAns(i){const F=kFly;if(!F||!F.atc||!F.atc.q||F.atc.q.ans!=null)return;const q=F.atc.q;q.ans=i;q.t=0;if(i===q.a){F.pts+=15;F.atc.pts+=15;kBeep("coin");kFxSpeak(q.key==="mayday"?"Roger, emergency services standing by. Runway is yours.":"Readback correct.")}else{kBeep("no");kFxSpeak("Say again.")}}
const KCS="Two-Three Alpha Bravo";
function kFxAtc(F,dt){const P=F.P,A=F.atc,rw0=KFLYRW[F.lv===4?1:0]||KFLYRW[0],rw={cx:rw0.cx,cz:rw0.cz,nm:rw0.nm||"Island Airport",num:rw0.num||["09","27"]};if(A.q){A.q.t+=dt;if(A.q.ans!=null&&A.q.t>4)A.q=null;else if(A.q&&A.q.ans==null&&A.q.t>25){A.q=null;kFlySay("📻 No reply… Tower will call again later. Answer faster next time!",3)}}
  if(kFxSpecial(F))return;
  if(P.gnd&&F.t<6&&F.t>.8&&P.v<2)kAtcAsk(F,"tko","🗼 Tower",`${rw.nm.split(" ")[0]} Tower: ${KCS}, runway ${rw.num[0]}, wind ${String(Math.round(((F.wx.dir*57.3)+180)%360)).padStart(3,"0")} at ${Math.round(Math.hypot(F.wx.wx,F.wx.wz))}, cleared for takeoff.`,
   [`Cleared for takeoff runway ${rw.num[0]}, ${KCS}.`,`Roger, landing runway ${rw.num[1]}.`,"Hello tower, what's up?"],"A readback repeats the important parts: the runway and 'cleared for takeoff', then your call sign.");
  if(!P.gnd&&P.y>110)kAtcAsk(F,"climb","📡 Departure",`${KCS}, radar contact. Climb and maintain 300 meters, turn left heading 270.`,[`Climb 300 meters, left heading 270, ${KCS}.`,"Descending to the ground.","Right turn heading 090."],"Heading 270 means WEST on the compass. Repeat altitude and heading back.");
  if(!P.gnd&&P.y>150&&F.t>A.trafT&&!F.traffic){const a=P.psi+Math.PI/3;F.traffic={x:P.x+Math.sin(a)*2600,z:P.z+Math.cos(a)*2600,y:P.y,psi:P.psi+Math.PI,t:0};
   kAtcAsk(F,"traffic","📡 Departure",`${KCS}, traffic, two o'clock, two kilometers, opposite direction, same altitude.`,[`Looking for traffic, ${KCS}.`,"Unable, landing now.","What's a traffic?"],"Clock positions: 12 o'clock is straight ahead, 3 o'clock is to your right. 2 o'clock is ahead and a bit right.")}
  if(F.wx.t==="storm"&&!P.gnd&&F.t>18)kAtcAsk(F,"wx","📡 Departure",`${KCS}, caution: thunderstorm ahead, severe turbulence and wind gusts reported.`,[`Roger, thunderstorm, ${KCS}.`,"Flying into it for fun!","I'm turning off my radio."],"Pilots avoid thunderstorms: they have hail, lightning and strong up and down winds.");
  const d=Math.hypot(P.x-rw.cx,P.z-rw.cz);if(!P.gnd&&d<2600&&P.y<520&&F.airT>25&&(F.lv===2||F.lv===4||F.lv>=5))kAtcAsk(F,"land","🗼 Tower",`${KCS}, runway ${rw.num[0]}, wind ${String(Math.round(((F.wx.dir*57.3)+180)%360)).padStart(3,"0")} at ${Math.round(Math.hypot(F.wx.wx,F.wx.wz))}, cleared to land.`,[`Cleared to land runway ${rw.num[0]}, ${KCS}.`,`Cleared for takeoff, ${KCS}.`,"Can I park anywhere?"],"Before landing: gear down, flaps down, slow to landing speed, and read back 'cleared to land'.")}
function kFxEmStep(F,dt){const E=F.em,P=F.P;if(!E||!E.type)return;
  if(!E.on){if(!P.gnd&&F.airT>E.at&&P.y>70){E.on=true;F.fx.banner={t:0};kVib&&kVib(200);
    const M={engine:["🔥 ENGINE FAILURE!","Your engine stopped. Lower the nose to keep about "+Math.round(kFlyStall(P)*1.3)+" m/s (best glide), pick a runway or flat field, gear down late.","mayday"],
     rough:["⚠️ ROUGH ENGINE","The engine is coughing: only half power. Head back to land.","pan"],bird:["🐦 BIRD STRIKE!","A bird hit the windshield! Power dropped for a bit. Stay calm, fly the plane.","pan"],
     gear:["🛞 GEAR PROBLEM","The landing gear motor failed. Tap the GEAR button 3 times to crank it down by hand.","pan"],fuel:["⛽ FUEL LEAK!","Fuel is leaking: about 75 seconds left. Land as soon as you can!","mayday"]}[E.type];
    E.title=M[0];kFlySay(M[0]+" "+M[1],7);kBeep("no");
    if(E.type==="engine")E.thrMul=0;if(E.type==="rough")E.thrMul=.5;if(E.type==="bird"){E.thrMul=.6;E.bt=18;F.fx.crack=1}if(E.type==="fuel")E.fuel=75;if(E.type==="gear"){E.need=3}
    const mayday=M[2]==="mayday";kAtcAsk(F,"mayday","📻 You call",`${M[0]} What do you say on the radio?`,mayday?[`MAYDAY MAYDAY MAYDAY, ${KCS}, ${E.type==="fuel"?"fuel leak":"engine failure"}, landing now.`,`PAN-PAN, ${KCS}, small problem.`,"Hi, nice day today!"]:[`PAN-PAN PAN-PAN PAN-PAN, ${KCS}, ${E.type==="bird"?"bird strike":E.type==="gear"?"gear problem":"rough engine"}, returning to land.`,`MAYDAY, ${KCS}, everything is fine.`,"Hi, nice day today!"],
     mayday?"MAYDAY means life in danger (like no engine). Say it 3 times, then call sign, problem, intentions.":"PAN-PAN means urgent but not life-threatening. MAYDAY is for real danger.")}return}
  if(E.type==="bird"&&E.bt>0){E.bt-=dt;if(E.bt<=0){E.thrMul=null;kFlySay("✅ Engine power is back to normal.",3)}}
  if(E.type==="fuel"&&E.fuel>0){E.fuel-=dt;if(E.fuel<=0){E.thrMul=0;kFlySay("⛽ OUT OF FUEL! Glide to the nearest runway or field.",5);kBeep("no")}}
  if(E.type==="gear"&&E.need>0){if(P.gear){P.gear=0;E.tries++;E.need--;kBeep("click");if(E.need>0)kFlySay(`🛞 Cranking… ${E.need} more tap${E.need>1?"s":""}!`,2);else{P.gear=1;kFlySay("✅ Manual gear extension worked! Three green lights.",3);kBeep("ok")}}}
  if(E.type==="rough"&&Math.random()<dt*.6)kFxSputter()}
function kFxSputter(){try{if(kAudio()&&KS().sound!==false)kTone(70+Math.random()*40,kAC.currentTime,.12,"square",.05)}catch(_){}}
function kFlyStep(F,dt){const P=F.P;if(!F.wx){F.wx=kFxWeather(F);kFxClouds(F);F.em=F.em||{on:false};F.atc=F.atc||{said:{},q:null,trafT:80,pts:0};F.fx=F.fx||{deb:[],shake:0,flash:0};F.balloons=F.balloons||[]}
  const wasGnd=P.gnd;kFlyStep0(F,dt);const fx=F.fx;
  if(fx.deb&&fx.deb.length){for(const d of fx.deb){d.vy-=9.8*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.z+=d.vz*dt;d.r+=dt*6;if(d.y<0){d.y=0;d.vy*=-.3;d.vx*=.6;d.vz*=.6}}}
  if(fx.fire)fx.fire.t+=dt;fx.shake=Math.max(0,fx.shake-dt*.8);fx.flash=Math.max(0,fx.flash-dt*1.6);fx.crack=Math.max(0,(fx.crack||0)-dt*.03);
  if(F.crashT>0)return;
  if(!P.gnd)F.airT+=dt;
  const W=F.wx;W.nT-=dt;if(W.nT<=0){W.nT=kFxR(.5,1.4);W.tgt={p:kFxR(-1,1),r:kFxR(-1,1),v:kFxR(-1,1)*(W.t==="storm"&&Math.random()<.2?2.4:1)}}
  for(const k of["p","r","v"])W.cur[k]+=(W.tgt[k]-W.cur[k])*Math.min(1,dt*2.2);
  if(!P.gnd&&!P.heli){const tb=W.turb*(P.y<40?.5:1);P.th+=W.cur.p*tb*.1*dt;P.ph+=W.cur.r*tb*.34*dt;P.y+=W.cur.v*tb*2.3*dt;P.x+=W.wx*dt;P.z+=W.wz*dt;
    if(W.t==="storm"){W.flT-=dt;if(W.flT<=0){W.flT=kFxR(5,13);fx.flash=.9;setTimeout(()=>{try{if(kAudio()&&KS().sound!==false)kTone(48,kAC.currentTime,1.1,"sawtooth",.07)}catch(_){}},600)}}}
  else if(P.gnd&&P.v>3){P.x+=W.wx*.08*dt;P.z+=W.wz*.08*dt}
  if(P.gnd&&F.onRw&&!kFlyRw(P.x,P.z)&&P.v>12)return kFlyCrash(F,"💥 OVERRUN! You ran off the end of the runway. Touch down near the start and brake (throttle 0).");
  if(P.gnd&&kFlyRw(P.x,P.z))F.onRw=1;
  const vs=kFlyStall(P);if(!P.gnd&&!P.heli&&!P.drone&&P.v<vs*1.06){fx.stallT+=dt;if(fx.stallT>.35){fx.stallT=0;try{if(kAudio()&&KS().sound!==false)kTone(440,kAC.currentTime,.25,"square",.04)}catch(_){}}}
  F.inCloud=0;for(const o of kFlyWorld())if(o.k==="cloud"&&Math.abs(P.y-o.y)<o.s*.45&&Math.hypot(P.x-o.x,P.z-o.z)<o.s*.8){F.inCloud=1;break}
  if(F.traffic){const T=F.traffic;T.t+=dt;T.x+=Math.sin(T.psi)*55*dt;T.z+=Math.cos(T.psi)*55*dt;if(T.t>60)F.traffic=null}
  if(!F.birds&&!P.gnd&&P.y<220&&Math.random()<dt*.012)F.birds={x:P.x+Math.sin(P.psi)*500,z:P.z+Math.cos(P.psi)*500,y:P.y+kFxR(-20,30),t:0};if(F.birds){F.birds.t+=dt;F.birds.x+=4*dt;if(F.birds.t>20)F.birds=null}
  kFxEmStep(F,dt);kFxAtc(F,dt)}
function kFxProj(F,W,H,x,y,z){const C=F.cam,Fo=W*.85,t=kFlyTf(C,x,y,z);if(t[2]<2)return null;return[t[0]/t[2]*Fo,-t[1]/t[2]*Fo,Fo/t[2]]}
function kFlyDraw(cv,F){const c=cv.getContext("2d"),W=cv.width,H=cv.height,fx=F.fx||{};const sh=fx.shake||0;
  c.save();if(sh>0)c.translate(kFxR(-1,1)*sh*14,kFxR(-1,1)*sh*14);kFlyDraw0(cv,F);c.restore();
  const C=F.cam,cy0=H*.42;c.save();c.translate(W/2,cy0);c.rotate(-C.ro);
  const emo=(e,x,y,z,sz)=>{const p=kFxProj(F,W,H,x,y,z);if(!p)return;c.font=`${Math.max(8,Math.min(160,sz*p[2]))}px serif`;c.textAlign="center";c.textBaseline="middle";c.fillText(e,p[0],p[1])};
  for(const b of F.balloons||[])emo("🎈",b.x,b.y,b.z,40);
  if(F.traffic)emo("✈️",F.traffic.x,F.traffic.y,F.traffic.z,30);
  if(F.birds)for(let i=0;i<5;i++)emo("🐦",F.birds.x+i*6,F.birds.y+(i%2)*4,F.birds.z+i*4,4);
  if(fx.fire&&F.crashT>0){const f=fx.fire,p=kFxProj(F,W,H,f.x,f.y+1,f.z);if(p){const s=p[2];for(let i=0;i<10;i++){const a=Math.random();c.fillStyle=`rgba(${255},${Math.round(80+a*140)},0,${.55+a*.4})`;c.beginPath();c.arc(p[0]+kFxR(-3,3)*s,p[1]-kFxR(0,6)*s,kFxR(1.5,4)*s,0,7);c.fill()}
    for(let i=0;i<8;i++){const up=((f.t*6+i*3)%24);c.fillStyle=`rgba(40,40,45,${.45-up/60})`;c.beginPath();c.arc(p[0]+Math.sin(i+f.t)*3*s,p[1]-(6+up)*s,(2.5+up*.25)*s,0,7);c.fill()}}}
  if(fx.deb)for(const d of fx.deb){const p=kFxProj(F,W,H,d.x,d.y,d.z);if(!p)continue;c.save();c.translate(p[0],p[1]);c.rotate(d.r);c.fillStyle=d.c;const s=Math.max(2,d.s*p[2]);c.fillRect(-s,-s/2.5,s*2,s/1.25);c.restore()}
  c.restore();
  const Wx=F.wx||{};
  if(Wx.rain){c.strokeStyle=Wx.t==="storm"?"rgba(200,210,230,.55)":"rgba(210,220,235,.5)";c.lineWidth=1.2;c.beginPath();const sl=(Wx.wx||0)*.8;for(let i=0;i<Wx.rain;i++){const x=Math.random()*W,y=54+Math.random()*(H-54);c.moveTo(x,y);c.lineTo(x+sl-2,y+16)}c.stroke();c.fillStyle=Wx.t==="storm"?"rgba(30,35,50,.22)":"rgba(80,90,105,.12)";c.fillRect(0,52,W,H-52)}
  if(F.inCloud){c.fillStyle="rgba(235,238,242,.78)";c.fillRect(0,0,W,H);c.fillStyle="#334155";c.font="bold 15px system-ui";c.textAlign="center";c.fillText("☁️ IN THE CLOUD: trust your instruments!",W/2,H*.5)}
  if(fx.flash>0){c.fillStyle=`rgba(255,255,255,${fx.flash*.85})`;c.fillRect(0,0,W,H)}
  if(fx.crack>0){c.strokeStyle=`rgba(255,255,255,${Math.min(.8,fx.crack)})`;c.lineWidth=2;c.beginPath();const cx=W*.62,cy=H*.38;for(let i=0;i<9;i++){const a=i*.7;c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*kFxR(40,120),cy+Math.sin(a)*kFxR(40,120))}c.stroke()}
  const P=F.P;if(F.crashT<=0&&!P.gnd&&!P.heli&&!P.drone&&P.v<kFlyStall(P)*1.06&&Math.floor(F.t*4)%2){c.fillStyle="rgba(220,38,38,.92)";c.fillRect(W/2-70,H*.2,140,30);c.fillStyle="#fff";c.font="bold 17px system-ui";c.textAlign="center";c.textBaseline="middle";c.fillText("⚠️ STALL",W/2,H*.2+15)}
  const E=F.em;if(E&&E.on&&F.crashT<=0){c.fillStyle="rgba(127,29,29,.88)";c.fillRect(8,H-92,W-16,26);c.fillStyle="#fff";c.font="bold 13px system-ui";c.textAlign="left";c.textBaseline="middle";c.fillText(`${E.title}${E.type==="fuel"&&E.fuel>0?` ⛽ ${Math.ceil(E.fuel)} s`:""}${E.type==="gear"&&E.need>0?" · tap GEAR ×"+E.need:""}`,16,H-79)}
  if(Wx.nm&&F.t<8){c.fillStyle="rgba(5,8,24,.7)";c.font="bold 11px system-ui";const tw=Math.min(W-12,c.measureText(Wx.nm).width+18);c.beginPath();c.roundRect(6,94,tw,20,9);c.fill();c.fillStyle="#fff";c.textAlign="left";c.textBaseline="middle";c.fillText(Wx.nm,15,104.5)}
  kFxAtcDom(cv,F)}
function kFxAtcDom(cv,F){const host=cv.parentElement;if(!host)return;let el=host.querySelector(".kfatc");const q=F.atc&&F.atc.q;
  if(!q){if(el)el.remove();return}if(!el){el=document.createElement("div");el.className="kfatc";if(getComputedStyle(host).position==="static")host.style.position="relative";host.appendChild(el)}
  const key=q.key+":"+q.ans;if(el.dataset.k===key)return;el.dataset.k=key;
  el.innerHTML=`<div class="kfatch">📻 ${esc(q.who)}</div><div class="kfatct">${esc(q.text)}</div>${q.ans==null?`<div class="kfatco">${q.o.map((o,i)=>`<button data-katc="${i}">${esc(o)}</button>`).join("")}</div>`:`<div class="kfatcr ${q.ans===q.a?"ok":"no"}">${q.ans===q.a?"✅ Correct! +15":"❌ The right reply: "+esc(q.o[q.a])}<br><span>${esc(q.why)}</span></div>`}`}
