const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=2;k.play={"q:math":{last:"2026-11-01"}};view="kids";KV={scr:"home"};render()});await p.waitForTimeout(200);
console.log('flashing',await p.evaluate(()=>[...document.querySelectorAll('.kneg')].map(b=>b.dataset.k||b.dataset.kcat).join(',')));
await p.screenshot({path:'k38home.png'});
// chess: solve puzzles quickly via correct move
await p.evaluate(()=>{kChessStart();render()});await p.waitForTimeout(200);console.log('chess scr',await p.evaluate(()=>KV.scr));
const lv0=await p.evaluate(()=>S.kids.chess.lv);
for(let i=0;i<8;i++){const st=await p.evaluate(()=>{const g=KV;if(g.P&&g.P.state==="play"){const m=g.P.ok[0];kChessTap(m[0]);kChessTap(m[1]);render();return "pz"}if(g.Q&&g.ans==null){return "q"}return "other"});
 if(st==="q"){const a=await p.evaluate(()=>KV.Q.a);await p.click(`[data-ka="${a}"]`).catch(()=>{});await p.waitForTimeout(1800)}
 const nx=await p.$('[data-k="cnext"]');if(nx){await nx.click();await p.waitForTimeout(150)}else{await p.evaluate(()=>{if(KV.scr==="chess"){kChessAdvance();render()}})}}
console.log('chess lv',lv0,'->',await p.evaluate(()=>S.kids.chess.lv),'scr',await p.evaluate(()=>KV.scr));
await p.evaluate(()=>{const k=KS();k.fly={lv:5,done:{0:1,1:1,2:1,3:1,4:1},stars:{},flights:1,pts:0};KV={scr:"fly"};kFly=null;render()});console.log('fly red',await p.evaluate(()=>document.querySelectorAll('.kcard.kneg').length));
console.log('errors',JSON.stringify(errs));await b.close()})();
