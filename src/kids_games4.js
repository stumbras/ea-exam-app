/* ================= Booster Landing 2 and Brick Bay traffic lights =================
   Booster Landing: a flight computer for the "hoverslam" (the real SpaceX landing burn). A marker under the rocket shows
   where it would stop if the engine fired now (v² / 2a); when the marker reaches the pad it says BURN NOW. Cold-gas
   thruster puffs, exhaust smoke, engine glow on the pad, and real scenery (launch site, ocean, Moon, Mars).
   Brick Bay: working traffic lights at all 16 intersections. Traffic stops on red. Stopping at a red light and
   going on green pays a Safe Driver bonus; running a red light costs a small ticket (never during a mission or chase). */
// ---------------- Booster Landing ----------------
function kLand2Back(c,D,W,H,gY,pads){const L=D.L,t=D.t||0;c.save();
  for(let i=0;i<9;i++){const x=(i*131+17)%W,y=(i*71+23)%(H*.5),a=.45+.45*Math.sin(t*2.2+i*1.7);c.fillStyle=`rgba(255,255,255,${L.mars?a*.25:a})`;c.beginPath();c.arc(x,y,1.6,0,7);c.fill()}
  if(L.moon){c.fillStyle="#4b5563";c.beginPath();c.moveTo(0,gY);for(let x=0;x<=W;x+=24)c.lineTo(x,gY-10-((x*7)%23)-(Math.sin(x*.03)*10+10));c.lineTo(W,gY);c.closePath();c.fill();c.strokeStyle="rgba(255,255,255,.12)";c.lineWidth=1;for(let i=0;i<5;i++){c.beginPath();c.ellipse((i*83+40)%W,gY-6,16+i*3,3,0,0,7);c.stroke()}}
  else if(L.mars){c.fillStyle="rgba(255,235,200,.9)";c.beginPath();c.arc(W*.78,H*.2,7,0,7);c.fill();c.fillStyle="#7c2d12";c.beginPath();c.moveTo(0,gY);c.lineTo(W*.1,gY-34);c.lineTo(W*.26,gY-40);c.lineTo(W*.34,gY-14);c.lineTo(W*.55,gY-10);c.lineTo(W*.7,gY-52);c.lineTo(W*.9,gY-56);c.lineTo(W,gY-22);c.lineTo(W,gY);c.closePath();c.fill()}
  else{const night=L.night;if(night){c.fillStyle="#f8fafc";c.beginPath();c.arc(W*.8,H*.16,13,0,7);c.fill();c.fillStyle="#0b1440";c.beginPath();c.arc(W*.8+6,H*.16-3,12,0,7);c.fill()}
    else{const g=c.createRadialGradient(W*.5,gY,4,W*.5,gY,W*.7);g.addColorStop(0,L.ship?"rgba(120,180,255,.35)":"rgba(255,200,90,.5)");g.addColorStop(1,"rgba(255,200,90,0)");c.fillStyle=g;c.fillRect(0,gY-W*.7,W,W*.7)}
    c.fillStyle=night?"rgba(160,170,210,.10)":"rgba(255,255,255,.16)";for(let i=0;i<5;i++){const x=((i*97+t*(4+i)+(D.wind||0)*t*.2)%(W+160))-80,y=H*.36+i*34;c.beginPath();c.ellipse(x,y,46+i*8,7+i,0,0,7);c.fill()}
    if(L.ship){c.fillStyle="rgba(10,25,70,.55)";c.fillRect(0,gY-3,W,3);c.fillStyle="rgba(10,20,50,.7)";c.fillRect(W*.08,gY-9,34,6);c.fillRect(W*.08+10,gY-15,10,6)}
    else{c.fillStyle=night?"#0b1020":"rgba(30,26,40,.78)";c.fillRect(W*.06,gY-52,34,52);c.fillRect(W*.06+34,gY-22,26,22);c.fillRect(W*.86,gY-92,5,92);c.fillRect(W*.86-9,gY-70,23,3);c.fillRect(W*.86-6,gY-46,17,3);c.beginPath();c.arc(W*.72,gY-30,9,0,7);c.fill();c.fillRect(W*.72-1.5,gY-22,3,22);
      if(night){c.fillStyle="#ffd97a";for(let i=0;i<6;i++)c.fillRect(W*.06+5+(i%3)*10,gY-44+Math.floor(i/3)*16,4,5);c.fillStyle=Math.floor(t*1.5)%2?"#ff3030":"#801010";c.beginPath();c.arc(W*.86+2.5,gY-94,2.5,0,7);c.fill()}}}
  c.restore()}
function kLand2Front(c,D,W,H,pads,tgtY,dt){const L=D.L;D.sm=D.sm||[];const fire=D.thr&&D.fuel>0&&!D.over&&D.flipped&&!D.pre;c.save();c.textAlign="center";c.textBaseline="middle";
  for(const r of D.rk){if(r.ok||r.dead)continue;const alt=tgtY-r.y-46;
    if(fire){if(Math.random()<.7)D.sm.push({x:r.x+(Math.random()-.5)*8,y:r.y+78,vx:(Math.random()-.5)*26+(D.wind||0)*.4,vy:60+Math.random()*50,t:0});
      if(alt<110){const a=Math.max(0,1-alt/110),g=c.createRadialGradient(r.x,tgtY,2,r.x,tgtY,70);g.addColorStop(0,`rgba(255,200,120,${.55*a})`);g.addColorStop(1,"rgba(255,160,60,0)");c.fillStyle=g;c.fillRect(r.x-70,tgtY-40,140,60)}}
    if(D.flipped&&D.fuel>0&&(D.left||D.right)&&!D.over){const s=D.left?1:-1;c.fillStyle="rgba(255,255,255,.75)";c.beginPath();c.moveTo(r.x+s*10,r.y-40);c.lineTo(r.x+s*(26+Math.random()*10),r.y-46);c.lineTo(r.x+s*(26+Math.random()*10),r.y-34);c.closePath();c.fill()}
    // hoverslam computer
    if(D.flipped&&!D.over&&!D.pre&&r.vy>10&&D.guide!==0){const a=L.g*1.75,d=r.vy*r.vy/(2*a),stopY=r.y+46+d,gap=tgtY-stopY,now=gap<=4,soon=!now&&gap<Math.max(26,d*.45);
      const y=Math.min(tgtY+10,stopY),col=now?"#ff4d6d":soon?"#ffd23f":"#2ec27e";c.strokeStyle=col;c.lineWidth=2;c.setLineDash([5,4]);c.beginPath();c.moveTo(r.x-30,y);c.lineTo(r.x+30,y);c.stroke();c.setLineDash([]);
      c.fillStyle=col;c.beginPath();c.moveTo(r.x-36,y-4);c.lineTo(r.x-30,y);c.lineTo(r.x-36,y+4);c.closePath();c.fill();c.beginPath();c.moveTo(r.x+36,y-4);c.lineTo(r.x+30,y);c.lineTo(r.x+36,y+4);c.closePath();c.fill();
      if(!now){c.font="bold 9px system-ui";c.fillText("stops here",r.x,y+10)}
      if(D.rk.length===1||r===D.rk.find(q=>!q.ok&&!q.dead)){const tx=now?(D.thr?"🔥 BURNING":"🔥 BURN NOW!"):soon?"⏳ Get ready…":"🛰️ Falling: wait for the marker to reach the pad";if(!(now&&D.thr&&r.vy<30)){c.font="bold 11px system-ui";const tw=Math.min(W-16,c.measureText(tx).width+22);c.fillStyle=now?(Math.floor(D.t*6)%2?"rgba(255,77,109,.96)":"rgba(180,30,60,.96)"):"rgba(5,8,24,.72)";c.beginPath();c.roundRect(W/2-tw/2,92,tw,22,10);c.fill();c.fillStyle="#fff";c.fillText(tx,W/2,103.5)}
        if(now&&!D.thr&&!D.burnSaid){D.burnSaid=1;try{kLine("Burn now!",2)}catch(_){}}}}}
  for(const s of D.sm){s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.y>tgtY+6){s.y=tgtY+6;s.vy=0;s.vx*=1.6}const a=Math.max(0,.38-s.t*.34);c.fillStyle=L.moon?`rgba(200,200,210,${a})`:L.mars?`rgba(225,170,130,${a})`:`rgba(230,230,235,${a})`;c.beginPath();c.arc(s.x,s.y,5+s.t*22,0,7);c.fill()}
  D.sm=D.sm.filter(s=>s.t<1.1);if(D.sm.length>90)D.sm.splice(0,D.sm.length-90);c.restore()}
const kLandDraw0=kLandDraw;
kLandDraw=function(c,D,W,H,pads,bob,tgtY,dt){kLandDraw0(c,D,W,H,pads,bob,tgtY,dt);try{kLand2Front(c,D,W,H,pads,tgtY,dt||0)}catch(_){}};
// ---------------- Brick Bay traffic lights ----------------
function kCt4Phase(D,a,b){const t=((D.t||0)+((a*3+b*5)%5)*3)%15;return t<6?{ns:"g",ew:"r"}:t<7.5?{ns:"y",ew:"r"}:t<13.5?{ns:"r",ew:"g"}:{ns:"r",ew:"y"}}
function kCt4Stop(D,o,v){try{const ax=v[0]?"x":"y",pos=o[ax],dir=v[0]||v[1],oth=ax==="x"?o.y:o.x;for(let i=0;i<4;i++){const c=kCtRc(i),dist=(c-pos)*dir;if(dist<34||dist>50)continue;let oi=-1;for(let j=0;j<4;j++)if(Math.abs(kCtRc(j)-oth)<30)oi=j;if(oi<0)return false;
      const P=ax==="x"?kCt4Phase(D,i,oi):kCt4Phase(D,oi,i);return(ax==="x"?P.ew:P.ns)!=="g"}}catch(_){}return false}
function kCt4Draw(c,D){const col={g:"#22e06b",y:"#ffd23f",r:"#ff3b3b"},vx0=D.camX-60,vy0=D.camY-60,vx1=D.camX+460,vy1=D.camY+620,head=(x,y,k)=>{c.fillStyle="#111827";c.beginPath();c.roundRect(x-6,y-6,12,12,3);c.fill();c.fillStyle=col[k];c.beginPath();c.arc(x,y,3.8,0,7);c.fill();c.globalAlpha=.3;c.beginPath();c.arc(x,y,8,0,7);c.fill();c.globalAlpha=1};
  for(let a=0;a<4;a++)for(let b=0;b<4;b++){const cx=kCtRc(a),cy=kCtRc(b);if(cx<vx0||cx>vx1||cy<vy0||cy>vy1)continue;const P=kCt4Phase(D,a,b);
    head(cx+25,cy+38,P.ns);head(cx-25,cy-38,P.ns);head(cx-38,cy+25,P.ew);head(cx+38,cy-25,P.ew);
    c.fillStyle="rgba(255,255,255,.75)";c.fillRect(cx+2,cy+33,28,2.5);c.fillRect(cx-30,cy-35.5,28,2.5);c.fillRect(cx-35.5,cy+2,2.5,28);c.fillRect(cx+33,cy-30,2.5,28)}}
function kCt4Step(D,dt){const me=D.me;if(!me||D.foot||D.air||D.over||D.q||D.inside)return;const S=D.l4=D.l4||{in:null,wait:null,cd:0,streak:0};S.cd=Math.max(0,S.cd-dt);const sp=Math.hypot(me.vx||0,me.vy||0),busy=!!D.mis||(D.cops&&D.cops.length>0)||(D.wanted>0);
  let near=null;for(let a=0;a<4;a++)for(let b=0;b<4;b++){const dx=me.x-kCtRc(a),dy=me.y-kCtRc(b);if(Math.abs(dx)<62&&Math.abs(dy)<62)near={a,b,dx,dy}}
  if(!near){S.in=null;S.wait=null;return}
  const ax=Math.abs(me.vx||0)>Math.abs(me.vy||0)?"ew":"ns",P=kCt4Phase(D,near.a,near.b),inside=Math.abs(near.dx)<26&&Math.abs(near.dy)<26,key=near.a+","+near.b;
  if(!inside){if(sp<10){let wax=null;if(Math.abs(near.dx)<26&&Math.abs(near.dy)>=30)wax="ns";else if(Math.abs(near.dy)<26&&Math.abs(near.dx)>=30)wax="ew";if(wax&&P[wax]==="r")S.wait={key,ax:wax}}S.in=null;return}
  if(S.in===key)return;if(sp<6)return;S.in=key;
  if(S.wait&&S.wait.key===key&&P[S.wait.ax]!=="r"){S.wait=null;S.streak++;const pay=Math.min(15,5+S.streak);D.money=(D.money||0)+pay;D.score=(D.score||0)+10;try{kCtFx({k:"txt",x:me.x,y:me.y-34,txt:`🚦 Safe driver +$${pay}`});kBeep("coin")}catch(_){}
    if(S.streak===5)try{kTrophy("safedrv","🚦","Safe driver!","Stopped at 5 red lights in a row in Brick Bay.")}catch(_){}return}
  if(P[ax]==="r"&&sp>=28&&!busy&&S.cd<=0){S.cd=7;S.streak=0;S.wait=null;const fine=Math.min(5,D.money||0);D.money=(D.money||0)-fine;try{kCtFx({k:"txt",x:me.x,y:me.y-34,txt:fine?`🚨 Red light! Ticket −$${fine}`:"🚨 Red light! Stop on red."});kBeep("no")}catch(_){}
    if(!S.said){S.said=1;D.tip="🚦 Traffic lights work now. Stop at the white line on red, go on green for a Safe Driver bonus.";D.tipT=5}}}
