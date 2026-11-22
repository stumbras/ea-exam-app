const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;k.lv.math=5;view="kids";KV={scr:"home"};render()});
await p.click('[data-k="drive"]');await p.click('[data-kride="m3"]');await p.waitForTimeout(500);
await p.evaluate(()=>{kDrv.gT=0.1;kDrv.obs.push({ln:kDrv.lane,y:-40,k:"ap"})});await p.waitForTimeout(900);
const gate=await p.evaluate(()=>kDrv.gate&&{q:kDrv.gate.q,a:kDrv.gate.a,opts:kDrv.gate.opts});console.log('gate',JSON.stringify(gate));
if(gate){const want=gate.opts.indexOf(gate.a);await p.evaluate(w=>{kDrv.ap=0;kDrv.lane=w},want)}
await p.evaluate(()=>{for(let i=0;i<4;i++)kDrv.obs.push({ln:(kDrv.lane+1)%3,y:-100-i*120,k:"car",col:"#4b5563",sh:"sedan"})});
await p.waitForTimeout(700);await p.screenshot({path:'k12gate.png'});await p.waitForTimeout(1600);
console.log('after',await p.evaluate(()=>[kDrv.gates||0,kDrv.bolts,!!kDrv.gate]));
await p.evaluate(()=>{kDrv.ap=6;for(let i=0;i<3;i++)kDrv.obs.push({ln:i,y:100+i*60,k:"car",col:"#1d3f8f",sh:"suv"})});await p.waitForTimeout(400);await p.screenshot({path:'k12fsd.png'});
await p.evaluate(()=>{kDrv.t=59.9});await p.waitForTimeout(1200);console.log('end',await p.evaluate(()=>[kDrv.over,kDrv.gates||0]));
await p.evaluate(()=>{KV={scr:"col",mode:"home"};render()});console.log('wind',await p.evaluate(()=>!!kWind||S.kids.sound===false));
await p.evaluate(()=>{KV={scr:"home"};render()});console.log('wind off',await p.evaluate(()=>kWind===null));
console.log('errors',JSON.stringify(errs));await b.close()})();
