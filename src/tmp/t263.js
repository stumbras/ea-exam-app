const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
const t0=Date.now();await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForLoadState('load');console.log('load ms',Date.now()-t0);await p.waitForTimeout(1200);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;view="kids";KV={scr:"home"};render()});await p.waitForTimeout(300);
const rt=await p.evaluate(()=>{const t=performance.now();for(let i=0;i<20;i++)render();return ((performance.now()-t)/20).toFixed(1)});console.log('home render ms',rt);
await p.screenshot({path:'k34home.png',fullPage:true});
// daily genius
await p.click('[data-kgen="cur"]');await p.click('[data-kgen="tea"]');await p.click('[data-kgen="tea"]');await p.click('[data-kgen="cre"]');await p.waitForTimeout(200);
console.log('genius',await p.evaluate(()=>[JSON.stringify(S.kids.gen),S.kids.tix,S.kids.coins]));
// each hero quiz: play 5 questions
for(const id of ["law","biz","sci2","eng2","doc","inv"]){await p.waitForTimeout(3500);await p.evaluate(()=>{KV={scr:"home"};render()});await p.click(`.kgsk[data-kcat="${id}"]`);await p.waitForTimeout(150);
 for(let i=0;i<5;i++){const a=await p.evaluate(()=>KV.Q&&KV.Q.a);if(a==null)break;await p.click(`[data-ka="${a}"]`);const nx=await p.waitForSelector('[data-k="next"],[data-k="showNext"],.kend',{timeout:5000}).catch(()=>null);if(nx&&await nx.getAttribute('data-k')){await nx.click();await p.waitForTimeout(100)}else break}
 console.log(id,await p.evaluate(()=>[KV.stage,KV.right,JSON.stringify((S.kids.hero||{})[Object.keys(S.kids.hero||{}).pop()]||{})]));}
await p.screenshot({path:'k34end.png'});
// mix quiz injects hero
await p.evaluate(()=>{kShowStart("mix");KV.i=2;kShowQ();render()});console.log('mix hero q',await p.evaluate(()=>KV.Q.hero||null));
// lessons new tracks
await p.evaluate(()=>{KV={scr:"learn"};render()});console.log('tracks',await p.evaluate(()=>KLT.length),await p.evaluate(()=>['Think Like a Lawyer','Entrepreneur Skills',"Inventor's Workshop"].map(t=>document.body.innerText.includes(t))));
await p.evaluate(()=>{KV={scr:"learn",ltr:"inv"};render()});await p.click('[data-klesson="inv:0"]');await p.waitForTimeout(200);console.log('lesson open',await p.evaluate(()=>!!KV.les));
// brick bay workshop
await p.evaluate(()=>{KV={scr:"city",cpick:1};render()});await p.click('[data-k="cityGo"]');await p.waitForTimeout(600);
console.log('blds',await p.evaluate(()=>kCt.blds.map(b=>b.k+"@"+Math.round(b.x)+","+Math.round(b.y)).join(' ')));
await p.evaluate(()=>{kCtAct();const B=kCt.blds.find(b=>b.k==="inv");kCt.foot.x=B.x;kCt.foot.y=B.y+5});await p.waitForTimeout(150);await p.evaluate(()=>kCtAct());await p.waitForTimeout(200);
console.log('workshop',await p.evaluate(()=>kCt.inside&&kCt.inside.qs.map(q=>q.q.slice(0,40)).join(' | ')));
await p.evaluate(()=>{kCt.inside=null;kCt.t=kCt.dur});await p.waitForTimeout(1200);
// other screens smoke
for(const s of ["music","powers","fly","term","chess","badges","trophies","brain","sounds"]){await p.evaluate(s=>{KV={scr:s};if(s==="fly")kFly=null;render()},s);await p.waitForTimeout(120)}
console.log('errors',JSON.stringify(errs));await b.close()})();
