const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,600)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(2000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;k.lv.math=8;k.drive.car="ct";view="kids";KV={scr:"home"};render()});
await p.screenshot({path:'k21home.png'});await p.tap('[data-k="city"]');await p.waitForTimeout(300);await p.screenshot({path:'k21intro.png',fullPage:true});
await p.tap('[data-k="cityGo"]');await p.waitForTimeout(1500);await p.screenshot({path:'k21city.png'});
const cdp=await ctx.newCDPSession(p);const box=await p.locator('#kcty').boundingBox();const sc=box.width/await p.evaluate(()=>$('#kcty').width);const H=await p.evaluate(()=>$('#kcty').height);
const pt=(x,y)=>({x:box.x+x*sc,y:box.y+y*sc});await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pt(70,H-82)]});for(let i=1;i<=6;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[pt(70,H-82-i*8)]});await p.waitForTimeout(30)}
await p.waitForTimeout(1200);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});console.log('drove',await p.evaluate(()=>[kCt.me.x|0,kCt.me.y|0,kCt.tr.map(o=>(o.x|0)+','+(o.y|0)).slice(0,3).join(' ')]));
// teleport to bakery to start cookie mission
await p.evaluate(()=>{const m=kCt.M.marks.bakery;kCt.misCd=0;Object.assign(kCt.me,{x:m.x,y:m.y,vx:0,vy:0})});await p.waitForTimeout(400);console.log('mission',await p.evaluate(()=>[kCt.mis&&kCt.mis.id,kCt.cops.length,kCt.tip.slice(0,80)]));
await p.waitForTimeout(1500);await p.screenshot({path:'k21cookie.png'});
await p.evaluate(()=>{const m=kCt.M.marks.hideout;kCt.misCd=0;Object.assign(kCt.me,{x:m.x,y:m.y,vx:0,vy:0})});await p.waitForTimeout(400);console.log('cookie done',await p.evaluate(()=>[kCt.mis,kCt.money,kCt.done.join()]));
await p.evaluate(()=>{const m=kCt.M.marks.taxi;kCt.misCd=0;Object.assign(kCt.me,{x:m.x,y:m.y,vx:0,vy:0})});await p.waitForTimeout(400);
await p.evaluate(()=>{const g=kCt.mis.tg;Object.assign(kCt.me,{x:g.x,y:g.y,vx:0,vy:0})});await p.waitForTimeout(500);await p.screenshot({path:'k21q.png'});
const q=await p.evaluate(()=>kCt.q&&{q:kCt.q.q,a:kCt.q.a,o:kCt.q.opts});console.log('q',JSON.stringify(q));if(q){await p.tap(`[data-kcq="${q.o.indexOf(q.a)}"]`);await p.waitForTimeout(400)}
console.log('taxi',await p.evaluate(()=>[kCt.money,kCt.done.join()]));
await p.evaluate(()=>{const m=kCt.M.marks.police;kCt.misCd=0;Object.assign(kCt.me,{x:m.x,y:m.y,vx:0,vy:0})});await p.waitForTimeout(400);await p.waitForTimeout(1500);console.log('bandit',await p.evaluate(()=>[kCt.mis&&kCt.mis.id,kCt.bandit&&[kCt.bandit.x|0,kCt.bandit.y|0]]));
await p.evaluate(()=>{const b=kCt.bandit;for(let i=0;i<3;i++)b.hits++});await p.waitForTimeout(300);console.log('caught',await p.evaluate(()=>[kCt.money,kCt.done.join()]));
await p.evaluate(()=>{const m=kCt.M.marks.balloon;kCt.misCd=0;Object.assign(kCt.me,{x:m.x,y:m.y,vx:0,vy:0})});await p.waitForTimeout(300);await p.screenshot({path:'k21balloon.png'});
await p.evaluate(()=>{const [gx,gy]=KCT.GEMS[0];Object.assign(kCt.me,{x:gx*64+32,y:gy*64+32,vx:0,vy:0})});await p.waitForTimeout(300);console.log('gems',await p.evaluate(()=>S.kids.city.gems.join()));
console.log('me',await p.evaluate(()=>JSON.stringify([kCt.me.x,kCt.me.y,kCt.me.a,kCt.camX,kCt.camY,kCt.mis&&kCt.mis.id])));await p.tap('[data-k="cityRadio"]');await p.waitForTimeout(300);await p.evaluate(()=>{kCt.t=299.9});await p.waitForTimeout(1600);await p.screenshot({path:'k21end.png'});console.log('end',await p.evaluate(()=>[kCt.over,S.kids.city.money,!!kRadio]));
console.log('errors',JSON.stringify(errs));await b.close()})();
