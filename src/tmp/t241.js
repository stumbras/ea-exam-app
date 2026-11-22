const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=20;k.spx={lv:9,land:0,tries:0};view="kids";KV={scr:"land",pick:1};render()});await p.screenshot({path:'k22levels.png',fullPage:true});
// autopilot lander: simple controller
const auto=async lv=>{await p.evaluate(l=>{KV={scr:"home"};kLandStart(l);render()},lv);await p.waitForTimeout(300);
 const q=await p.evaluate(()=>kLnd.Q&&[kLnd.Q.q,kLnd.Q.a]);await p.click(`[data-klq="${q[1]}"]`);await p.waitForTimeout(200);
 for(let i=0;i<1500;i++){const s=await p.evaluate(()=>{const D=kLnd;if(D.over)return null;const H=$('#kland').height,gY=H-60,L=D.L,tg=L.catch?gY-120:L.ship?gY-14:gY-6;const pads=kLandPads(D,$('#kland').width,H);
   const live=D.rk.filter(r=>!r.ok&&!r.dead);if(!live.length)return null;const r=live[0],alt=(tg-r.y-46);
   if(L.flip&&!D.flipped&&!(D.flipT>0)&&alt<900)kLandFlip();if(L.legs&&!D.legs&&alt<400)kLandLegs();
   const p0=pads[L.heavy?D.rk.indexOf(r):0],cx=p0.x+p0.w/2,want=Math.max(18,Math.min(48,alt*.12));D.thr=r.vy>want;D.left=r.x>cx+4&&r.vx>-15;D.right=r.x<cx-4&&r.vx<15;return [alt|0,r.vy|0]});if(!s)break;await p.waitForTimeout(25)}
 await p.waitForTimeout(400);const res=await p.evaluate(()=>[JSON.stringify(kLnd.rk.map(r=>[r.x|0,r.vx|0,r.ok,r.dead])),JSON.stringify(kLandPads(kLnd,$('#kland').width,$('#kland').height).map(p=>[p.x|0,p.w])),kLnd.L.n,kLnd.res,kLnd.stars||0,kLnd.why||"",Math.round(kLnd.fuel)]);if(lv===7||lv===4)await p.screenshot({path:`k22l${lv}.png`});return res};
for(const lv of [9])console.log(JSON.stringify(await auto(lv)));
console.log('errors',JSON.stringify(errs));await b.close()})();
