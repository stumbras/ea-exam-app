/* ---------- 🧭 Sky Pilot navigation: GPS grid, map, Navigator mission, instruments ---------- */
const KGRIDC="ABCDEFGH";
function kGrid(x,z){const c=Math.max(0,Math.min(7,Math.floor((x+8000)/2000))),r=Math.max(1,Math.min(8,Math.floor((z+4000)/2000)+1));return KGRIDC[c]+r}
function kGridC(g){return{x:KGRIDC.indexOf(g[0])*2000-8000+1000,z:(+g.slice(1)-1)*2000-4000+1000}}
const KNAVLEG=[["F3",400],["F5",600],["D5",300]];
KFLYM.push({ic:"🧭",n:"Navigator",goal:"Fly 3 legs with compass, map, GPS and altimeter",lesson:"No arrow this time! Air traffic control (ATC) gives you a HEADING (compass direction), a GPS GRID square (like F3 on the map: letter = column, number = row) and an ALTITUDE to hold. Use the 🧭 compass, the 🗺️ map and the ⛰️ altimeter. Arrive in the right square within 80 m of the altitude.",start:"nav"});
KFLYQ.push(["What does an altimeter show?",["How high you are flying","How fast you are going","Which way is north","How much fuel is left"],"Pilots fly at assigned altitudes so planes stay apart."],
 ["Runway 09 points which way?",["East (090°)","North (000°)","South (180°)","West (270°)"],"Runway numbers are the compass heading divided by 10: 09 = 090° = east."],
 ["The 'artificial horizon' (attitude indicator) shows…",["If the wings are level and the nose is up or down","The weather","The time","The radio channel"],"In clouds you can't see the real horizon, so pilots trust this instrument."],
 ["Heading 180° means flying…",["South","North","East","West"],"0° north, 90° east, 180° south, 270° west."],
 ["On a map grid, 'D5' means…",["Column D, row 5","5 dinosaurs","Delta 5 km up","Day 5"],"Find the letter along the bottom, then the number up the side."],
 ["The vertical speed indicator shows…",["How fast you're climbing or sinking","Your top speed","Engine heat","Wind direction"],"A big minus number near the ground means slow down your descent!"],
 ["A windsock at the airport shows…",["Which way the wind is blowing","The pilot's sock size","The runway length","Fuel prices"],"Planes take off and land INTO the wind."],
 ["GPS finds your position using signals from…",["Satellites","Cell phones only","The Moon","Radio DJs"],"At least 4 GPS satellites are needed for an exact fix."]);
function kFlyNavReset(F){const P=F.P;Object.assign(P,{x:0,z:1500,y:300,psi:Math.PI/2,v:45,thr:.55,gear:0,gnd:0,th:0});F.navI=0;F.map=1;F.navSay=0;kFlyNavCall(F)}
function kFlyNavCall(F){const L=KNAVLEG[F.navI];if(!L)return;const c=kGridC(L[0]),P=F.P,hd=((Math.atan2(c.x-P.x,c.z-P.z)*180/Math.PI)+360)%360,h=String(Math.round(hd/10)*10%360).padStart(3,"0");F.navHd=h;kFlySay(`📻 ATC: "Becoming Genius, fly heading ${h}, proceed to grid ${L[0]}, ${P.y<L[1]?"climb":"descend"} and maintain ${L[1]} meters."`,6);kLine(`Fly heading ${h.split("").join(" ")}, grid ${L[0]}, maintain ${L[1]} meters.`,2)}
function kFlyNavGoal(F){if(KFLYM[F.lv].start!=="nav"||F.won||F.crashT>0)return;const P=F.P,L=KNAVLEG[F.navI];if(!L)return;const g=kGrid(P.x,P.z);
  if(g===L[0]){if(Math.abs(P.y-L[1])<=80){F.navI++;F.pts+=30;kBeep("coin");if(F.navI>=KNAVLEG.length)return kFlyWin(F,F.t<240?3:2,"🧭 Navigation complete! You flew by compass, map, GPS and altimeter like a real pilot.");kFlySay(`✅ Reached ${L[0]} at ${Math.round(P.y)} m! Stand by for the next instruction…`,2.5);setTimeout(()=>{if(kFly===F)kFlyNavCall(F)},2600)}
   else if(!(F.navSay>0)){F.navSay=4;kFlySay(`📻 ATC: "You're in ${L[0]}, but check your altimeter! ${P.y<L[1]?"Climb":"Descend"} to ${L[1]} meters."`,3.5)}}F.navSay=Math.max(0,(F.navSay||0)-1/60)}
function kFlyNavHud(c,F,W,H){const P=F.P;c.textBaseline="middle";c.textAlign="center";c.font="900 12px system-ui";c.fillStyle="#7cf2c8";c.fillText(`📍 ${kGrid(P.x,P.z)}`,(116+W-112)/2+32,15);c.font="9px system-ui";c.fillStyle="#c7cbe6";c.fillText("GPS",(116+W-112)/2+32,33);
  if(KFLYM[F.lv].start==="nav"&&KNAVLEG[F.navI]){const L=KNAVLEG[F.navI];c.fillStyle="rgba(5,8,24,.8)";c.beginPath();c.roundRect(8,H-58,W-16,22,8);c.fill();c.fillStyle="#ffd23f";c.font="bold 11px system-ui";c.fillText(`📻 Heading ${F.navHd} → grid ${L[0]} · hold ${L[1]} m (now ${Math.round(P.y)} m) · leg ${F.navI+1}/3`,W/2,H-47)}
  if(!F.map)return;const ms=Math.min(130,W*.35),mx=W-ms-6,my=160,cs=ms/8,toM=(x,z)=>[mx+(x+8000)/16000*ms,my+ms-(z+4000)/16000*ms];
  c.fillStyle="rgba(10,40,20,.82)";c.fillRect(mx,my,ms,ms);c.fillStyle="rgba(38,124,190,.75)";const[o1]=toM(3300,0);c.fillRect(o1,my,mx+ms-o1,ms);c.fillStyle="rgba(230,210,150,.9)";const[ix,iy]=toM(KFLYISL.x,KFLYISL.z);c.beginPath();c.arc(ix,iy,KFLYISL.r/16000*ms,0,7);c.fill();
  c.strokeStyle="rgba(255,255,255,.25)";c.lineWidth=1;for(let i=1;i<8;i++){c.beginPath();c.moveTo(mx+i*cs,my);c.lineTo(mx+i*cs,my+ms);c.stroke();c.beginPath();c.moveTo(mx,my+i*cs);c.lineTo(mx+ms,my+i*cs);c.stroke()}
  c.fillStyle="#9aa";for(const[x,z,r]of KFLYMT){const[a,b]=toM(x,z);c.beginPath();c.moveTo(a,b-4);c.lineTo(a+4,b+3);c.lineTo(a-4,b+3);c.closePath();c.fill()}
  c.strokeStyle="#ddd";c.lineWidth=2;for(const r of KFLYRW){const s=Math.sin(r.hd),co=Math.cos(r.hd),[a,b]=toM(r.cx-s*r.len/2,r.cz-co*r.len/2),[a2,b2]=toM(r.cx+s*r.len/2,r.cz+co*r.len/2);c.beginPath();c.moveTo(a,b);c.lineTo(a2,b2);c.stroke()}
  const[px2,pz2]=toM(KFLYPAD.x,KFLYPAD.z);c.font="9px serif";c.fillText("🚀",px2,pz2);
  if(KFLYM[F.lv].start==="nav"){KNAVLEG.forEach((L,i)=>{const g=kGridC(L[0]),[a,b]=toM(g.x,g.z);c.strokeStyle=i<F.navI?"#2ec27e":i===F.navI?"#ffd23f":"rgba(255,210,63,.4)";c.lineWidth=2;c.strokeRect(a-cs/2,b-cs/2,cs,cs)})}
  c.font="bold 8px system-ui";c.fillStyle="#fff";for(let i=0;i<8;i++){c.fillText(KGRIDC[i],mx+i*cs+cs/2,my+ms+7);c.fillText(String(i+1),mx-5,my+ms-i*cs-cs/2)}
  const[ax,az]=toM(P.x,P.z);c.save();c.translate(ax,az);c.rotate(P.psi);c.fillStyle="#ff4d6d";c.beginPath();c.moveTo(0,-6);c.lineTo(4,5);c.lineTo(-4,5);c.closePath();c.fill();c.restore();c.fillStyle="#fff";c.font="bold 9px system-ui";c.fillText("N↑",mx+ms-9,my+8)}
