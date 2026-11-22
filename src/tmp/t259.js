const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=4;view="kids";KV={scr:"city",cpick:1};render()});
await p.click('[data-k="cityGo"]');await p.waitForTimeout(800);
await p.evaluate(()=>{kCtAct();const j=kCt.parked.find(c=>c.sh==="jet");kCt.foot.x=j.x-20;kCt.foot.y=j.y});await p.waitForTimeout(300);
console.log('label',await p.evaluate(()=>kCtActLabel(kCt).join(' ')));
await p.screenshot({path:'k30jetpark.png'});
await p.evaluate(()=>kCtAct());await p.waitForTimeout(300);console.log('in jet',await p.evaluate(()=>[kCt.air&&kCt.air.ph,kCtActLabel(kCt).join(' ')]));
await p.evaluate(()=>kCtAct());await p.waitForTimeout(2500);console.log('air',await p.evaluate(()=>[kCt.air.ph,kCt.air.alt.toFixed(2),kCt.air.rings.length]));
// autopilot through rings
await p.evaluate(()=>{window.__ap=setInterval(()=>{const D=kCt;if(!D||!D.air||D.q)return;const r=D.air.rings[D.air.ri];if(!r)return;D.gx=r.x;D.gy=r.y;D.goT=1},60)});
await p.waitForTimeout(3000);await p.screenshot({path:'k30jetfly.png'});
for(let i=0;i<20&&!(await p.evaluate(()=>!!kCt.q));i++)await p.waitForTimeout(1500);
console.log('rings',await p.evaluate(()=>[kCt.air.ri,kCt.q&&kCt.q.q,kCt.score,kCt.money]));
await p.screenshot({path:'k30jetq.png'});
const a=await p.evaluate(()=>kCt.q.opts.indexOf(kCt.q.a));await p.click(`[data-kcq="${a}"]`);await p.waitForTimeout(400);
await p.evaluate(()=>clearInterval(window.__ap));
// fly to a road and land
await p.evaluate(()=>{const D=kCt;D.gx=kCtRc(1);D.gy=kCtRc(2);D.goT=3});await p.waitForTimeout(2000);
for(let i=0;i<10;i++){const ok=await p.evaluate(()=>{const D=kCt,me=D.me;if(D.air.ph!=="fly")return D.air.ph;if(kCtJetLandOk(D,me.x+me.vx*.6,me.y+me.vy*.6)&&kCtJetLandOk(D,me.x,me.y)){kCtAct();return "landing"}return "no"});if(ok==="landing")break;await p.waitForTimeout(200)}
await p.waitForTimeout(2500);console.log('landed',await p.evaluate(()=>[kCt.air&&kCt.air.ph,kCt.tip]));
await p.screenshot({path:'k30jetland.png'});
await p.evaluate(()=>kCtJetOut());console.log('out',await p.evaluate(()=>[!!kCt.foot,!kCt.air,kCt.parked.filter(c=>c.sh==="jet").length]));
await p.evaluate(()=>{kCt.t=kCt.dur});await p.waitForTimeout(1500);console.log('endcard',await p.evaluate(()=>!!document.querySelector('.krotnext')));await p.screenshot({path:'k30end.png',fullPage:true});
// law track
await p.evaluate(()=>{KV={scr:"learn"};render()});await p.waitForTimeout(300);console.log('law',await p.evaluate(()=>document.body.innerText.includes('Law & Courts')));
console.log('errors',JSON.stringify(errs));await b.close()})();
