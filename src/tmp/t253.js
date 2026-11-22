const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;view="kids";KV={scr:"city",cpick:1};render()});
await p.click('[data-k="cityGo"]');await p.waitForTimeout(1200);
await p.screenshot({path:'k27city.png'});
// hop out
await p.evaluate(()=>kCtAct());await p.waitForTimeout(400);
console.log('foot',await p.evaluate(()=>!!kCt.foot), 'label',await p.evaluate(()=>kCtActLabel(kCt).join(' ')));
// walk to the nearest parked car
await p.evaluate(()=>{const c=kCt.parked.filter(c=>c.id!=="mine")[0];kCt.foot.x=c.x+20;kCt.foot.y=c.y});await p.waitForTimeout(200);
console.log('label near car',await p.evaluate(()=>kCtActLabel(kCt).join(' ')));
await p.screenshot({path:'k27foot.png'});
await p.evaluate(()=>kCtAct());await p.waitForTimeout(300);
console.log('driving',await p.evaluate(()=>[!kCt.foot,kCt.me.sh]));
// building
await p.evaluate(()=>kCtAct());await p.evaluate(()=>{const B=kCt.blds[0];kCt.foot.x=B.x;kCt.foot.y=B.y+5});await p.waitForTimeout(200);
console.log('label door',await p.evaluate(()=>kCtActLabel(kCt).join(' ')));
await p.evaluate(()=>kCtAct());await p.waitForTimeout(400);await p.screenshot({path:'k27bank.png'});
for(let i=0;i<3;i++){const a=await p.evaluate(()=>kCt.inside.qs[kCt.inside.i].a);await p.click(`[data-kin="${a}"]`);await p.waitForTimeout(150);await p.click('[data-k="kinnext"]');await p.waitForTimeout(200)}
console.log('after bank',await p.evaluate(()=>[kCt.inside,kCt.money,kCt.score,kCt.combo,S.kids.tix,JSON.stringify(S.kids.city.jobs)]));
// quick decision
await p.evaluate(()=>{kCt.qdT=0});await p.waitForTimeout(500);
const qd=await p.evaluate(()=>kCt.qd&&kCt.qd.a);console.log('qd',qd,await p.evaluate(()=>kCt.qd&&kCt.qd.q));
await p.screenshot({path:'k27qd.png'});
await p.click(`[data-kqd="${qd}"]`);await p.waitForTimeout(200);console.log('combo',await p.evaluate(()=>[kCt.combo,kCt.score,kCt.qd]));
// bots
await p.evaluate(()=>{kCt.botT=0});await p.waitForTimeout(400);console.log('bots',await p.evaluate(()=>kCt.bots.length));
await p.evaluate(()=>{for(const b of kCt.bots)kCtBotHit(kCt,b,3)});await p.waitForTimeout(500);console.log('q',await p.evaluate(()=>kCt.q&&kCt.q.q));
await p.screenshot({path:'k27bots.png'});
const a=await p.evaluate(()=>kCt.q.opts.indexOf(kCt.q.a));await p.click(`[data-kcq="${a}"]`);await p.waitForTimeout(300);console.log('money',await p.evaluate(()=>[kCt.money,kCt.score]));
await p.evaluate(()=>{kCt.t=kCt.dur});await p.waitForTimeout(1500);await p.screenshot({path:'k27end.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
