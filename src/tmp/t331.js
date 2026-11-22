const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.sound=false;k.tix=30;k.adultUntil=Date.now()+9e5;k.guided=false;k.rocket.dest=3;k.spx={lv:9,land:9,tries:9,st:{}};k.warm={day:kToday(),start:Date.now(),sec:400,n:12,ok:10,done:1,les:1,last:[],p0:0};k.lastSeen=Date.now();persist();KV={scr:"home"};render()});
const K=async o=>{await p.evaluate(o=>{const b=document.createElement("button");Object.assign(b.dataset,o);kidsClick(b)},o);await p.waitForTimeout(450)};
// ---- chess: play e4, then a blunder, take back
await p.evaluate(()=>{kCbStart();render()});await p.waitForTimeout(300);
const mv=async(f,t)=>{const sq=s=>("abcdefgh".indexOf(s[0]))+(8-+s[1])*8;await K({kcb:"sq",i:String(sq(f))});await K({kcb:"sq",i:String(sq(t))});await p.waitForTimeout(700)};
await mv("e2","e4");console.log('1',await p.evaluate(()=>JSON.stringify({coach:KV.coach,open:KV.open,ply:KV.ply,hist:KV.hist.length})));
await mv("d1","h5");console.log('2',await p.evaluate(()=>JSON.stringify({coach:KV.coach,open:KV.open})));
await mv("h5","h7");console.log('3',await p.evaluate(()=>JSON.stringify({coach:KV.coach,ply:KV.ply,msg:KV.msg})));
await p.screenshot({path:'tmp/c_1.png',fullPage:true});
await K({kcb:"back"});console.log('back',await p.evaluate(()=>JSON.stringify({coach:KV.coach,ply:KV.ply,hist:KV.hist.length,tb:KV.tb,hints:KV.hints,turn:KV.turn})));await p.screenshot({path:'tmp/c_2.png',fullPage:true});
// auto-play engine vs robot to the end to test review
const res=await p.evaluate(async()=>{const g=KV;let n=0;while(!g.over&&n<120){if(g.turn==="w"&&!g.think){const A=cbAnalyze(g.b,true);const m=A[Math.min(A.length-1,n%7===3?3:0)][1];kCbClick({kcb:"sq",i:String(m[0])});kCbClick({kcb:"sq",i:String(m[1])});n++}await new Promise(r=>setTimeout(r,60))}render();return JSON.stringify({over:g.over,n,hist:g.hist.length,cls:g.hist.map(h=>h.cls[0]).join("")})});console.log('game',res);
await p.waitForTimeout(500);await p.screenshot({path:'tmp/c_3.png',fullPage:true});
const rv=await p.evaluate(()=>{const b=document.querySelector('[data-kcb="rev"]');if(b){b.click();return 1}return 0});await p.waitForTimeout(400);if(rv)await p.screenshot({path:'tmp/c_4.png',fullPage:true});
// ---- landing with hoverslam marker
for(const lv of[0,1,4,5]){await p.evaluate(lv=>{kLandStart(lv);KV={scr:"land"};kLnd.pre=0;render()},lv);await p.waitForTimeout(1900);await p.screenshot({path:`tmp/l_${lv}a.png`});}
// autoland using the marker: burn when stop point reaches pad
const land=await p.evaluate(async()=>{kLandStart(0);KV={scr:"land"};kLnd.pre=0;render();const D=kLnd;await new Promise(r=>setTimeout(r,300));const H=document.querySelector('#kland').height,tgtY=H-60-6;for(let i=0;i<900&&!D.over;i++){const r=D.rk[0],a=D.L.g*1.75,d=r.vy*r.vy/(2*a),gap=tgtY-(r.y+46+d);D.thr=gap<=4&&r.vy>14?1:0;const W=document.querySelector('#kland').width;D.left=r.x>W/2+12&&r.vx>-10;D.right=r.x<W/2-12&&r.vx<10;await new Promise(r=>setTimeout(r,16))}return JSON.stringify({res:D.res,why:D.why,fuel:Math.round(D.fuel),td:D.rk[0].td})});console.log('autoland',land);
await p.waitForTimeout(300);await p.screenshot({path:'tmp/l_end.png'});
// ---- city traffic lights
await p.evaluate(()=>{kCtStart();KV={scr:"city"};render()});await p.waitForTimeout(1200);
await p.evaluate(()=>{const D=kCt;D.me.x=kCtRc(1)+14;D.me.y=kCtRc(1)+70;D.me.a=0;D.me.vx=D.me.vy=0;D.camX=D.me.x-177;D.camY=D.me.y-300});await p.waitForTimeout(900);await p.screenshot({path:'tmp/ct_1.png'});
console.log('phase',await p.evaluate(()=>JSON.stringify(kCt4Phase(kCt,1,1))+' stopped cars '+kCt.tr.filter(o=>kCt4Stop(kCt,o,[[0,-1],[1,0],[0,1],[-1,0]][o.d])).length+'/'+kCt.tr.length));
// wait at red then go on green
const sd=await p.evaluate(async()=>{const D=kCt,me=D.me;const wait=ms=>new Promise(r=>setTimeout(r,ms));me.x=kCtRc(1)+14;me.y=kCtRc(1)+44;me.vx=me.vy=0;let i=0;while(kCt4Phase(D,1,1).ns!=="r"&&i++<400)await wait(50);await wait(400);const w=JSON.stringify(D.l4&&D.l4.wait);i=0;while(kCt4Phase(D,1,1).ns!=="g"&&i++<400){me.x=kCtRc(1)+14;me.y=kCtRc(1)+44;me.vx=me.vy=0;await wait(50)}const m0=D.money;D.kU=1;await wait(1500);D.kU=0;return JSON.stringify({wait:w,m0,m1:D.money,streak:D.l4.streak,y:Math.round(me.y-kCtRc(1))})});console.log('safe driver',sd);
await p.screenshot({path:'tmp/ct_2.png'});
console.log('errors',errs.slice(0,6));await b.close()})();
