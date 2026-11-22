const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;view="kids";KV={scr:"home"};render()});
console.log('heroQs',await p.evaluate(()=>KHERO.map(H=>{let ok=0;for(let i=0;i<40;i++){const Q=kHeroQ(H[0]);if(Q.o.length>=3&&Q.a>=0&&Q.o[Q.a])ok++}return H[0]+":"+ok}).join(' ')));
await p.evaluate(()=>{kShowStart("biz");render()});await p.waitForTimeout(200);const a=await p.evaluate(()=>KV.Q.a);await p.click(`[data-ka="${a}"]`);await p.waitForTimeout(2500);console.log('biz answered',await p.evaluate(()=>JSON.stringify(S.kids.hero)));
await p.evaluate(()=>{KV={scr:"learn",ltr:"logic"};render()});await p.click('[data-klesson="logic:0"]');await p.waitForTimeout(200);console.log('lesson',!!(await p.evaluate(()=>KV.les)));
await p.evaluate(()=>{KV={scr:"city",cpick:1};render()});await p.click('[data-k="cityGo"]');await p.waitForTimeout(500);
console.log('blds',await p.evaluate(()=>kCt.blds.map(b=>b.k).join(',')+' uniq '+new Set(kCt.blds.map(b=>b.b)).size));
await p.evaluate(()=>{kCtAct();const B=kCt.blds.find(b=>b.k==="inv");kCt.foot.x=B.x;kCt.foot.y=B.y+5;kCtAct()});await p.waitForTimeout(200);console.log('workshop',await p.evaluate(()=>kCt.inside?kCt.inside.qs.length:0));
await p.evaluate(()=>{kCt.inside=null;kCt.over=true;KV={scr:"home"};render()});
for(const s of ["music","powers","fly","term","chess","badges","trophies","brain","sounds","show","learn","drive","derby","land","col"]){await p.evaluate(s=>{KV={scr:s};if(s==="fly")kFly=null;try{render()}catch(e){console.error(s,e)}},s);await p.waitForTimeout(100)}
console.log('errors',JSON.stringify(errs));await b.close()})();
