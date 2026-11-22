const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(2000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;k.derby={lv:2,wins:1,ko:0,best:0,plays:0,rules:1};view="kids";KV={scr:"home"};render()});
await p.tap('[data-k="drive"]');await p.waitForTimeout(300);await p.tap('[data-kdm="derby"]');await p.waitForTimeout(300);await p.tap('[data-kderby="ct"]').catch(()=>{});await p.tap('[data-kderby]');await p.waitForTimeout(4000);
const cdp=await ctx.newCDPSession(p);const box=await p.locator('#kdby').boundingBox();const sc=box.width/await p.evaluate(()=>$('#kdby').width);const pt=(x,y)=>({x:box.x+x*sc,y:box.y+y*sc});
const J=await p.evaluate(()=>kDbJoyPos(kDby)),Z=await p.evaluate(()=>kDbZapBtn(kDby));
const st=()=>p.evaluate(()=>{const m=kDby.cars[0];return[m.x|0,m.y|0,(m.a*57)|0,kDby.joy?kDby.joy.fixed:0]});console.log('start',await st());
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...pt(J.x,J.y),id:1}]});for(let i=1;i<=6;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...pt(J.x+i*8,J.y),id:1}]});await p.waitForTimeout(30)}
await p.waitForTimeout(900);console.log('joy right',await st());
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...pt(J.x+48,J.y),id:1},{...pt(Z.x,Z.y),id:2}]});await p.waitForTimeout(80);await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...pt(J.x+48,J.y),id:1}]});
await p.waitForTimeout(100);console.log('shots while steering',await p.evaluate(()=>[kDby.shots.length,kDby.ammo.toFixed(1)]));await p.screenshot({path:'k20.png'});
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});console.log('errors',JSON.stringify(errs));await b.close()})();
