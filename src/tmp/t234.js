const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(2000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;k.derby={lv:2,wins:1,ko:0,best:0,plays:0,rules:1};view="kids";KV={scr:"home"};render()});
await p.tap('[data-k="drive"]');await p.waitForTimeout(300);await p.tap('[data-kdm="derby"]');await p.waitForTimeout(300);await p.tap('[data-kderby="m3"]');await p.waitForTimeout(4000);
const cdp=await ctx.newCDPSession(p);const box=await p.locator('#kdby').boundingBox();const sc=box.width/await p.evaluate(()=>$('#kdby').width);
const tap=async(cx,cy)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+cx*sc,y:box.y+cy*sc}]});await p.waitForTimeout(60);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})};
await p.evaluate(()=>{const me=kDby.cars[0],o=kDby.cars[1];o.x=me.x;o.y=me.y-170;o.ai.back=5});
const Z=await p.evaluate(()=>kDbZapBtn(kDby));for(let i=0;i<3;i++){await tap(Z.x,Z.y);await p.waitForTimeout(250)}
await p.screenshot({path:'k19zap.png'});await p.waitForTimeout(500);
console.log('zap',await p.evaluate(()=>[kDby.ammo.toFixed(1),kDby.score,kDby.cars[1].hp|0,kDby.coach]));
await p.evaluate(()=>{const me=kDby.cars[0];kDby.pw.push({k:"rocket",x:me.x,y:me.y,alive:1,t:0})});await p.waitForTimeout(300);
await tap(Z.x,Z.y);await p.waitForTimeout(150);await p.screenshot({path:'k19rocket.png'});await p.waitForTimeout(1500);
console.log('rocket',await p.evaluate(()=>[kDby.rockets,kDby.score]));
await p.waitForTimeout(6000);console.log('ai shots seen',await p.evaluate(()=>[kDby.cars[0].hp|0,kDby.shots.length]));
console.log('errors',JSON.stringify(errs));await b.close()})();
