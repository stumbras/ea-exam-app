const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.guided=false;k.tix=5;persist();KV={scr:"city",cpick:1};render()});await p.waitForTimeout(300);
await p.screenshot({path:'tmp/city0.png',fullPage:true});
await p.click('[data-k="cityGo"]');await p.waitForTimeout(800);
console.log('buildings',await p.evaluate(()=>kCt.blds.map(b=>b.ic+b.nm).join(", ")));
await p.evaluate(()=>{const B=kCt.blds.find(b=>b.k==="chessclub");kCtEnter(B)});await p.waitForTimeout(300);await p.screenshot({path:'tmp/city1.png'});
await p.click('[data-ctgo="1"][data-k="chessbot"]');await p.waitForTimeout(400);
console.log('now',await p.evaluate(()=>KV.scr),'back chip',!!await p.$('.kctback'));
await p.click('.kctback');await p.waitForTimeout(600);console.log('back to',await p.evaluate(()=>KV.scr+" kCt alive "+!!kCt+" inside "+!!kCt.inside));
// vault
await p.evaluate(()=>{const B=kCt.blds.find(b=>b.k==="vault");kCtEnter(B)});await p.waitForTimeout(200);
for(let i=0;i<3;i++){const a=await p.evaluate(()=>kCt.inside.qs[kCt.inside.i].a);await p.click(`[data-kin="${a}"]`);await p.waitForTimeout(150);await p.click('[data-k="kinnext"]');await p.waitForTimeout(150)}
console.log('vault: money',await p.evaluate(()=>kCt.money),'hacks',await p.evaluate(()=>JSON.stringify(KS().city.hacks)));
// escape
await p.evaluate(()=>{kCtCops(2,"test");const B=kCt.blds.find(b=>b.k==="airport");kCtEnter(B)});await p.waitForTimeout(200);await p.screenshot({path:'tmp/city2.png'});
await p.click('[data-ctesc="1"]');await p.waitForTimeout(400);console.log('escape →',await p.evaluate(()=>KV.scr+" escapes "+KS().city.escapes+" cops "+kCt.cops.length));
console.log('errors',JSON.stringify(errs));await b.close()})();
