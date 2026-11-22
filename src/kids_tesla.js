/* ================= Tesla World: Elon Musk's companies in one hub =================
   Tesla, SpaceX (with xAI since February 2026), The Boring Company and Neuralink are separate companies with the
   same leader. Facts checked November 2026: Vegas Loop 14 stations open by September 2026, plan to double to 28 by the
   end of 2026, 123 stations approved; Prufrock-2 record 2.28-mile tunnel (March 2026); tunneling in Las Vegas, Nashville
   and Bastrop, Texas; airport rides from December 2025; UNLV station opening November 2026; SpaceX acquired xAI
   (February 2026); Starship Flight 15 (November 13, 2026) orbited Earth 14 times on a 22-hour flight; Starlink 11,000+
   satellites; first Cybercab built at Gigafactory Texas (2026); Optimus production starting slowly. */
const KTW=[
 {id:"tesla",ic:"⚡",n:"Tesla",c:"#cc0000",sub:"Electric cars, robotaxis, robots, batteries",f:[
  ["🚗","Electric cars","Model 3, Model Y, Model S, Model X and the stainless-steel Cybertruck run on batteries, not gas."],
  ["🚕","Cybercab","A robotaxi with no steering wheel and no pedals: the car drives itself. The first one was built at Gigafactory Texas in 2026."],
  ["🤖","Optimus","A humanoid robot that walks and uses its hands. Tesla started building the first ones slowly in 2026."],
  ["🔋","Megapack","Giant batteries that store electricity from the sun and wind for whole towns."],
  ["⚡","Superchargers","Fast chargers along highways that refill a Tesla in about the time of a snack stop."]]},
 {id:"spacex",ic:"🚀",n:"SpaceX",c:"#1d4ed8",sub:"Rockets, Starship, Starlink, robot arms, and xAI",f:[
  ["🚀","Falcon 9","A rocket that flies to space, then lands itself standing up, so it can fly again."],
  ["👩‍🚀","Dragon","The capsule that carries astronauts to the International Space Station."],
  ["🛸","Starship","The biggest rocket ever flown. On November 13, 2026, Flight 15 went around Earth 14 times on a 22-hour trip."],
  ["🦾","Mechazilla's chopsticks","Giant robot arms on the launch tower that catch the Super Heavy booster in the air when it comes back."],
  ["🛰️","Starlink","More than 11,000 satellites that send internet from space, even to boats and farms."],
  ["🧠","xAI joins SpaceX","In February 2026 SpaceX and xAI, the company that makes the Grok AI, became one company."]]},
 {id:"boring",ic:"🚇",n:"The Boring Company",c:"#7c4a1e",sub:"Tunnels where Tesla cars skip the traffic",f:[
  ["🚇","Vegas Loop","Tunnels under Las Vegas where Tesla cars drive people between hotels, the convention center and more."],
  ["📍","How many stations?","14 stations were open by September 2026, and the plan was to double to 28 by the end of the year. Las Vegas approved 123 in all."],
  ["🐌","Prufrock","The tunnel-digging machine, named after a snail. Prufrock-2 dug a record 2.28-mile tunnel in March 2026."],
  ["✈️","To the airport","Loop rides to Harry Reid Airport started in December 2025, and a station by UNLV opens in November 2026."],
  ["🗺️","Other cities","In 2026 the Boring Company was also digging in Nashville, Tennessee and Bastrop, Texas."]]},
 {id:"neura",ic:"🧠",n:"Neuralink",c:"#7c3aed",sub:"A tiny brain chip",f:[
  ["🧠","The chip","A coin-sized chip placed in the skull by a robot surgeon. It reads signals from the brain."],
  ["🖱️","Thinking = clicking","It helps people who can't move their arms or legs control a computer just by thinking."],
  ["🦾","The surgeon robot","A special robot sews the super-thin wires in place, more precisely than a human hand."]]}];
// quiz questions for the Tesla & EVs category: [tier, question, right, wrong, wrong, wrong, fact]
KEV.push(
 [1,"Which company makes the Cybertruck?","Tesla","SpaceX","The Boring Company","Neuralink","The Cybertruck is Tesla's stainless-steel electric pickup."],
 [1,"What does the Boring Company dig?","Tunnels","Rockets","Batteries","Satellites","It digs tunnels so cars can skip traffic."],
 [1,"Which company launches rockets?","SpaceX","Tesla","Neuralink","The Boring Company","SpaceX builds Falcon 9 and Starship."],
 [1,"Optimus is a…","Humanoid robot","Rocket","Tunnel","Battery","Optimus is Tesla's walking robot with hands."],
 [2,"Which city has the Vegas Loop tunnels?","Las Vegas","New York","Denver","Miami","The Vegas Loop runs under Las Vegas."],
 [2,"What drives people through the Vegas Loop?","Tesla cars","Subway trains","Gas buses","Bicycles","Tesla cars carry riders through the tunnels."],
 [2,"What is Starlink?","Internet from satellites","A Tesla car","A tunnel machine","A brain chip","Starlink beams internet from thousands of satellites."],
 [2,"What are the 'chopsticks' on SpaceX's tower?","Robot arms that catch the booster","Food sticks for astronauts","Antennas","Fuel pipes","Mechazilla's chopsticks catch the giant booster when it returns."],
 [2,"What is special about the Cybercab?","No steering wheel or pedals","It can fly","It digs tunnels","It's a boat","The Cybercab drives itself, so it has no wheel or pedals."],
 [3,"Which is the biggest rocket ever flown?","Starship","Falcon 9","Space Shuttle","A firework","Starship with its Super Heavy booster is the biggest rocket ever flown."],
 [3,"What does Neuralink make?","A brain chip for controlling computers by thinking","Electric scooters","Rocket fuel","Tunnels","Neuralink's chip reads brain signals."],
 [3,"What can a Falcon 9 booster do after launch?","Land and fly again","Only fly once","Dig a tunnel","Turn into a car","Landing and reusing rockets makes space trips cheaper."],
 [3,"What's the name of the Boring Company's tunnel machine?","Prufrock","Mechazilla","Optimus","Dragon","Prufrock is named after a snail, a joke because tunneling is slow."],
 [3,"Which capsule carries astronauts to the space station?","Dragon","Cybertruck","Prufrock","Megapack","Dragon flies astronauts to the International Space Station."],
 [4,"In 2026, SpaceX joined with which AI company?","xAI","Neuralink","Tesla","The Boring Company","xAI, which makes Grok, became part of SpaceX in February 2026."],
 [4,"What does a Tesla Megapack do?","Stores lots of electricity","Launches satellites","Digs tunnels","Drives itself","Megapacks store energy for the power grid."],
 [4,"About how many Starlink satellites were in orbit in late 2026?","More than 11,000","About 50","About 500","Just 1","Starlink passed 11,000 satellites in 2026."],
 [4,"Starship Flight 15 (November 2026) went around Earth how many times?","14","1","100","3","It orbited 14 times on a 22-hour flight."],
 [5,"The record Vegas Loop tunnel dug in March 2026 was about how long?","2.28 miles","228 miles","0.2 miles","22 miles","Prufrock-2 dug 2.28 miles in one go."],
 [5,"How many Vegas Loop stations were open by September 2026?","14","2","140","1","14 stations, with a plan to double to 28 by the end of 2026."],
 [5,"Besides Las Vegas, where was the Boring Company digging in 2026?","Nashville and Bastrop, Texas","Paris and Tokyo","Only Denver","Under the ocean","It was tunneling in three places at once."]);
function kTwMap(){const S=[["Resorts World",92,64,"end",0],["Fontainebleau",150,48,"start",0],["Encore",150,104,"start",0],["LVCC West",222,130,"end",0],["Riviera",226,70,"start",0],["Westgate",292,96,"middle",20],["LVCC Central",270,150,"end",0],["LVCC South",236,190,"end",0],["UNLV",270,282,"end",0],["Airport",214,362,"end",0]];
  const path="M"+S.map(a=>a[1]+" "+a[2]).join(" L");
  return `<svg viewBox="0 0 340 400" width="100%" style="max-width:420px;display:block;margin:0 auto;background:linear-gradient(#fdf6ec,#f3e3cc);border-radius:16px">
   <text x="12" y="22" font-size="12" font-weight="800" fill="#7c4a1e">🚇 Vegas Loop · simplified map</text>
   <line x1="120" y1="30" x2="120" y2="390" stroke="#e7c9a0" stroke-width="16" stroke-linecap="round"/><text x="104" y="250" font-size="10" fill="#9a7650" transform="rotate(-90 104 250)">THE STRIP</text>
   <path d="${path}" fill="none" stroke="#5b3a1a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/><path d="${path}" fill="none" stroke="#f5d9b0" stroke-width="2" stroke-dasharray="4 6"/>
   ${S.map(([n,x,y,an,dy])=>`<g><circle cx="${x}" cy="${y}" r="8" fill="${n==="UNLV"?"#16a34a":"#cc0000"}" stroke="#fff" stroke-width="2.5"/><text x="${an==="end"?x-12:an==="start"?x+12:x}" y="${y+4+dy}" font-size="10.5" font-weight="700" fill="#3b2410" text-anchor="${an}">${n}</text></g>`).join("")}
   <g><text font-size="18" dy="6" text-anchor="middle">🚗<animateMotion dur="9s" repeatCount="indefinite" path="${path}"/></text></g>
   <text x="12" y="392" font-size="9.5" fill="#7c4a1e">14 stations open by Sept 2026 · plan: 28 by year-end · 123 approved</text></svg>`}
function kTworldView(v){const k=KS(),seen=k.tw||{};if(KV.co==="mz")return kMzView(v);const co=KV.co?KTW.find(c=>c.id===KV.co):null;
  if(co){const fs=co.f.map(([ic,t,x])=>`<div class="ktwf"><span class="ktwi">${ic}</span><div><b>${esc(t)}</b><div class="ksmall">${esc(x)}</div></div></div>`).join("");
    if(!seen[co.id]){seen[co.id]=1;k.tw=seen;persist()}
    v.innerHTML=`<div class="kids">${kToastHtml()}${kTop(co.ic+" "+co.n,"tworld")}<div class="kcard" style="background:linear-gradient(135deg,${co.c},#111827);color:#fff"><div class="kcityt">${co.ic} ${esc(co.n.toUpperCase())}</div><div class="ksmall" style="color:#fff">${esc(co.sub)}</div></div>
     ${co.id==="boring"?`<div class="kcard">${kTwMap()}</div>`:""}<div class="kcard">${fs}</div>
     <div class="kcard"><div class="kh">🎟️ Earn tickets</div><div class="ksmall" style="margin-bottom:8px">Read the facts, then win a Tesla World quiz round. Tickets come from learning!</div><button class="kbtn green" data-kcat="tesla" style="width:100%">⚡ Tesla World quiz</button></div>
     <button class="kbtn ghost" data-k="tworld" style="width:100%">⬅ All companies</button></div>`;return}
  const n=KTW.filter(c=>seen[c.id]).length;
  v.innerHTML=`<div class="kids">${kToastHtml()}${kTop("⚡ Tesla World","home")}<div class="kcard" style="background:linear-gradient(135deg,#111827,#cc0000 70%,#ff6b6b);color:#fff"><div class="kcityt">⚡ TESLA WORLD</div><div class="ksmall" style="color:#fff">Elon Musk's companies: cars, robots, rockets, tunnels and brain chips. They're separate companies with the same leader, and xAI is now part of SpaceX.</div><div class="ksmall" style="color:#fff;margin-top:6px">🔎 Explored ${n} of ${KTW.length}</div></div>
   <div class="kh" style="margin:12px 4px 8px">🎮 Tesla games</div><div class="ktwgames">
    <button class="ktwg" data-k="drive" style="--g:linear-gradient(135deg,#cc0000,#7f1d1d)"><span>🚗</span><b>Tesla Drive & Derby</b><em>${(k.tix||0)>0?`🎟️ ${k.tix}: tap to drive!`:"Costs 🎟️: earn them in quizzes"}${k.drive&&k.drive.best?` · best ${k.drive.best} mi`:""}</em></button>
    <button class="ktwg" data-ktw="mz" style="--g:linear-gradient(135deg,#0b1d3a,#1d4ed8 60%,#f6a04d)"><span>🦾</span><b>Mechazilla Catch</b><em>${(k.mz||{}).best?`🏆 level ${k.mz.best}`:"Catch the booster!"}</em></button>
    <button class="ktwg" data-kcat="tesla" style="--g:linear-gradient(135deg,#16a34a,#065f46)"><span>⚡</span><b>Tesla World Quiz</b><em>Earns 🎟️ tickets</em></button>
    <button class="ktwg" data-ktw="hack" style="--g:linear-gradient(135deg,#111827,#374151)"><span>💻</span><b>Tesla Hacker</b><em>Code the car's lights and horn</em></button>
   </div>
   <div class="kh" style="margin:14px 4px 0">🏢 The companies</div>
   <div class="ktwtree"><div class="ktwroot">👤 Elon Musk</div><div class="ktwbr">${KTW.map(c=>`<button class="ktwco${seen[c.id]?" seen":""}" data-ktw="${c.id}" style="--c:${c.c}"><span class="ktwic">${c.ic}</span><b>${esc(c.n)}</b><span class="ksmall">${esc(c.sub)}</span>${seen[c.id]?`<span class="ktwok">✓</span>`:""}</button>`).join("")}</div></div>
   <div class="kcard"><div class="kh">🚇 Where are the Boring tunnels?</div><div class="ksmall" style="margin-bottom:8px">Under Las Vegas! Tesla cars drive people through them. Watch the car ride the Loop.</div>${kTwMap()}<button class="kbtn" data-ktw="boring" style="width:100%;margin-top:8px">🚇 More about the tunnels</button></div>
   <div class="kcard"><div class="kh">🚀 More SpaceX</div><button class="kbtn" data-k="pschool" style="width:100%">🚀 Rockets and Starship in Pilot School</button></div></div>`}

/* ---------- Mechazilla Catch: land the booster in the tower's chopsticks ---------- */
let MZ=null;
function kMzQ(lv){const pool=KEV.slice(-21).filter(x=>x[0]<=Math.min(5,lv+1));const it=pool[Math.floor(Math.random()*pool.length)];const o=kShuf([it[2],it[3],it[4],it[5]]);return{q:it[1],o,a:o.indexOf(it[2]),f:it[6]}}
function kShuf(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function kMzNew(keepLv){const k=KS();const lv=keepLv||1;MZ={lv,phase:"q",q:kMzQ(lv),msg:"",streak:MZ&&keepLv?MZ.streak:0}}
function kMzLaunch(){const lv=MZ.lv,W=340;MZ.phase="fly";MZ.x=W/2-90+Math.random()*120;MZ.cy=-170;MZ.vy=2.6+lv*0.35;MZ.vx=(Math.random()-.5)*(0.4+lv*0.12);MZ.wind=(Math.random()-.5)*0.006*lv;MZ.fuel=100;MZ.burn=0;MZ.L=0;MZ.R=0;MZ.t=0;MZ.arm=0}
function kMzView(v){const k=KS();if(!MZ)kMzNew();const e=esc,best=(k.mz||{}).best||0;
  let top=`<div class="kids">${kToastHtml()}${kTop("🦾 Mechazilla Catch","tworld")}`;
  if(MZ.phase==="q"){const Q=MZ.q;v.innerHTML=top+`<div class="kcard" style="background:linear-gradient(135deg,#0b1d3a,#1d4ed8);color:#fff"><div class="kcityt">⛽ FUEL CHECK · LEVEL ${MZ.lv}</div><div class="ksmall" style="color:#fff">Answer right to fuel the booster for launch. ${best?`Best: level ${best}.`:""}</div></div>
     <div class="kcard"><div class="kh" style="margin-bottom:10px">${e(Q.q)}</div>${Q.o.map((o,i)=>`<button class="kbtn ${MZ.pick===i?(i===Q.a?"green":"red"):""}" data-kmz="ans" data-i="${i}" style="width:100%;margin-top:6px;text-align:left">${e(o)}</button>`).join("")}
     ${MZ.pick!=null&&MZ.pick!==Q.a?`<div class="ksmall" style="margin-top:8px">💡 ${e(Q.f)}</div><button class="kbtn" data-kmz="newq" style="width:100%;margin-top:8px">Try another question</button>`:""}</div>
     <div class="kcard"><div class="kh">🎮 How to catch</div><div class="ksmall">Hold 🔥 to fire the engines and slow down. Use ◀ ▶ to line up with the tower. The top of the booster must reach the arms <b>slowly</b> and <b>lined up</b>. Each level falls faster, with more wind.</div></div></div>`;return}
  const end=MZ.phase!=="fly";
  v.innerHTML=top+`<div class="kcard" style="padding:8px"><canvas id="mzc" width="340" height="440" style="width:100%;max-width:420px;display:block;margin:0 auto;border-radius:14px;touch-action:none"></canvas>
    ${end?`<div style="text-align:center;margin-top:8px"><div class="kh">${e(MZ.msg)}</div><div class="ksmall" style="margin:4px 0 8px">${e(MZ.tip||"")}</div><button class="kbtn green" data-kmz="next" style="width:100%">${MZ.phase==="caught"?"⛽ Next level":"⛽ Try again"}</button></div>`
     :`<div class="kmzpad"><button id="mzL" class="kbtn">◀</button><button id="mzB" class="kbtn red">🔥 BURN</button><button id="mzR" class="kbtn">▶</button></div>`}</div></div>`;
  const c=document.getElementById("mzc");if(!c)return;kMzDraw(c);if(end)return;
  const hold=(id,key)=>{const b=document.getElementById(id);if(!b)return;const on=ev=>{ev.preventDefault();MZ[key]=1},off=ev=>{ev.preventDefault();MZ[key]=0};b.addEventListener("pointerdown",on);b.addEventListener("pointerup",off);b.addEventListener("pointerleave",off);b.addEventListener("pointercancel",off)};
  hold("mzL","L");hold("mzR","R");hold("mzB","burn");
  document.onkeydown=ev=>{if(!MZ||MZ.phase!=="fly")return;if(ev.key==="ArrowLeft")MZ.L=1;if(ev.key==="ArrowRight")MZ.R=1;if(ev.key===" "||ev.key==="ArrowUp"){MZ.burn=1;ev.preventDefault()}};
  document.onkeyup=ev=>{if(!MZ)return;if(ev.key==="ArrowLeft")MZ.L=0;if(ev.key==="ArrowRight")MZ.R=0;if(ev.key===" "||ev.key==="ArrowUp")MZ.burn=0};
  const id=++kMzLoopId;const loop=()=>{if(id!==kMzLoopId||!MZ||MZ.phase!=="fly"||KV.scr!=="tworld"||KV.co!=="mz"){document.onkeydown=null;document.onkeyup=null;return}const cv=document.getElementById("mzc");if(!cv)return;kMzStep();kMzDraw(cv);if(MZ.phase!=="fly"){kMzEnd();return}requestAnimationFrame(loop)};requestAnimationFrame(loop)}
let kMzLoopId=0;
const MZG={W:340,H:440,ground:420,armY:150,tx:250};
function kMzStep(){const g=0.055;MZ.t++;let ay=g,ax=MZ.wind;
  if(MZ.burn&&MZ.fuel>0){ay-=0.15;MZ.fuel=Math.max(0,MZ.fuel-0.34)}
  if((MZ.L||MZ.R)&&MZ.fuel>0){ax+=(MZ.R-MZ.L)*0.03;MZ.fuel=Math.max(0,MZ.fuel-0.08)}
  MZ.vy+=ay;MZ.vx+=ax;MZ.vx*=0.995;const prev=MZ.cy;MZ.cy+=MZ.vy;MZ.x+=MZ.vx;
  const cx=MZG.tx-28;
  if(prev<MZG.armY&&MZ.cy>=MZG.armY){const dx=Math.abs(MZ.x-cx),spd=MZ.vy;
    if(dx<=11&&spd<=1.7&&Math.abs(MZ.vx)<=0.7){MZ.cy=MZG.armY;MZ.phase="caught";MZ.res={dx,spd}}
    else{MZ.missWhy=dx>11?"side":spd>1.7?"fast":"drift"}}
  if(MZ.cy<-600){MZ.phase="lost"}
  if(MZ.cy+130>=MZG.ground){MZ.phase="crash"}}
function kMzEnd(){const k=KS();k.mz=k.mz||{best:0,catches:0};
  if(MZ.phase==="caught"){k.mz.catches++;MZ.streak=(MZ.streak||0)+1;if(MZ.lv>k.mz.best)k.mz.best=MZ.lv;MZ.msg=`🦾 CAUGHT! Level ${MZ.lv} complete!`;MZ.tip=`Speed at the arms: ${Math.round(MZ.res.spd*6)} m/s, off-center ${Math.round(MZ.res.dx/1.85)} m. SpaceX did its first real booster catch in October 2024.`;kBeep("yes");kLine("Caught it with the chopsticks!",3);
    if(k.mz.catches>=1)kTrophy("mz1","🦾","Chopstick catcher!","Caught a Super Heavy booster with Mechazilla.");if(MZ.lv>=5)kTrophy("mz5","🚀","Mechazilla master!","Caught the booster at level 5.")}
  else{MZ.streak=0;MZ.msg=MZ.phase==="lost"?"🚀 It flew away!":"💥 Splash! Missed the arms.";MZ.tip=MZ.phase==="lost"?"Too much burn: let gravity pull it down, then brake near the arms.":MZ.missWhy==="fast"?"Too fast at the arms. Burn earlier and longer to slow down.":MZ.missWhy==="side"?"Not lined up. Use ◀ ▶ early, then hold steady under the arms.":MZ.missWhy==="drift"?"Still sliding sideways. Tap the opposite arrow to stop the drift.":"Line up under the arms and slow down before you reach them.";kBeep("no")}
  persist();render()}
function kMzDraw(c){const x=c.getContext("2d"),{W,H,ground,armY,tx}=MZG;
  const sky=x.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#0b1d3a");sky.addColorStop(.6,"#3b5b9a");sky.addColorStop(1,"#f6a04d");x.fillStyle=sky;x.fillRect(0,0,W,H);
  x.fillStyle="#fff";for(let i=0;i<30;i++){x.globalAlpha=.5;x.fillRect((i*73)%W,(i*41)%180,1.5,1.5)}x.globalAlpha=1;
  x.fillStyle="#2563c9";x.fillRect(0,ground-6,120,H);x.fillStyle="#e9d5a6";x.fillRect(120,ground-6,W,H);
  // tower
  x.fillStyle="#6b7280";x.fillRect(tx,90,22,ground-90);x.strokeStyle="#9ca3af";x.lineWidth=1;for(let y=95;y<ground;y+=14){x.beginPath();x.moveTo(tx,y);x.lineTo(tx+22,y+14);x.moveTo(tx+22,y);x.lineTo(tx,y+14);x.stroke()}
  const caught=MZ&&MZ.phase==="caught";x.fillStyle=caught?"#22c55e":"#f59e0b";const arm=caught?8:12;
  x.fillRect(tx-46,armY-arm/2-6,46,6);x.fillRect(tx-46,armY+arm/2,46,6);
  x.fillStyle="#fde68a";x.font="bold 10px sans-serif";x.fillText("CHOPSTICKS",tx-60,armY-14);
  // target ghost
  if(MZ&&MZ.phase==="fly"){x.strokeStyle="rgba(255,255,255,.35)";x.setLineDash([4,4]);x.strokeRect(tx-28-11,armY,22,130);x.setLineDash([])}
  if(!MZ||MZ.cy===undefined)return;
  const bx=MZ.x,by=MZ.cy;
  if(MZ.phase==="crash"){x.font="44px sans-serif";x.fillText("💥",bx-22,ground-10)}
  else{ // booster
   const gr=x.createLinearGradient(bx-9,0,bx+9,0);gr.addColorStop(0,"#9ca3af");gr.addColorStop(.5,"#f3f4f6");gr.addColorStop(1,"#9ca3af");x.fillStyle=gr;x.fillRect(bx-9,by,18,130);
   x.fillStyle="#374151";x.fillRect(bx-15,by+6,6,10);x.fillRect(bx+9,by+6,6,10);x.fillRect(bx-9,by+124,18,6);
   if(MZ.burn&&MZ.fuel>0&&MZ.phase==="fly"){const fl=18+Math.random()*16;const f=x.createLinearGradient(0,by+130,0,by+130+fl);f.addColorStop(0,"#fff7ae");f.addColorStop(.5,"#f97316");f.addColorStop(1,"rgba(239,68,68,0)");x.fillStyle=f;x.beginPath();x.moveTo(bx-8,by+130);x.lineTo(bx+8,by+130);x.lineTo(bx,by+130+fl);x.closePath();x.fill()}}
  // HUD
  const h=Math.max(0,Math.round((armY-by)*0.54)),spd=Math.round(MZ.vy*6);
  x.fillStyle="rgba(0,0,0,.45)";x.fillRect(8,8,150,62);x.fillStyle="#fff";x.font="bold 12px sans-serif";
  x.fillText(`LEVEL ${MZ.lv}  ⛽ ${Math.round(MZ.fuel)}%`,16,26);x.fillStyle=spd>10?"#fca5a5":"#86efac";x.fillText(`SPEED ${spd} m/s ${spd>10?"(too fast)":"(ok)"}`,16,44);x.fillStyle="#fff";x.fillText(`TO ARMS ${h} m`,16,62);
  if(MZ.wind){x.fillText(`WIND ${MZ.wind>0?"→":"←"}`,W-70,26)}}
function kMzClick(d){if(!MZ)kMzNew();
  if(d.kmz==="ans"&&MZ.phase==="q"){const i=+d.i;if(MZ.pick!=null)return;MZ.pick=i;if(i===MZ.q.a){kBeep("yes");kT("⛽ Fueled! Launching…");setTimeout(()=>{if(MZ&&MZ.phase==="q"){MZ.pick=null;kMzLaunch();render()}},700)}else kBeep("no");return}
  if(d.kmz==="newq"){MZ.q=kMzQ(MZ.lv);MZ.pick=null;return}
  if(d.kmz==="next"){const lv=MZ.phase==="caught"?Math.min(9,MZ.lv+1):MZ.lv;kMzNew(lv);return}}

/* Runs after every topic file has loaded: one Genius Quiz replaces the separate topic quizzes in the rotation. */
(function(){const ids=new Set(KHERO.map(H=>H[0]));ids.forEach(x=>KHEROIDS.add(x));for(let i=KROT.length-1;i>=0;i--){if(KROT[i][3]==="kcat"&&ids.has(KROT[i][4]))KROT.splice(i,1)}
  KCATS.splice(Math.max(1,KCATS.length-1),0,["genius","🧠","Genius Quiz","Lawyer, doctor, inventor, pilot, history and more, mixed","sci"]);
  KROT.push(["q:genius","🧠","Genius Quiz","kcat","genius"])})();

function kTwBanner(){const k=KS(),n=KTW.filter(c=>(k.tw||{})[c.id]).length,mz=(k.mz||{}).best||0;
  return `<button class="ktwban" data-k="tworld"><span class="ktwbi">⚡🚀🚇🤖</span><span class="ktwbt"><b>TESLA WORLD</b><span>Tesla Drive · Mechazilla Catch · Tesla Hacker · SpaceX · Boring tunnels · robots</span><span class="ktwbs">${n<KTW.length?`🔎 ${n}/${KTW.length} explored`:"✅ all explored"}${mz?` · 🦾 level ${mz}`:" · NEW game!"}</span></span><span class="ktwbgo">▶</span></button>`}
