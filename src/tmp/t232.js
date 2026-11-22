const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text())});
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(2000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;view="kids";KV={scr:"home"};render()});
await p.tap('[data-k="drive"]');await p.waitForTimeout(400);await p.tap('[data-kdm="derby"]');await p.waitForTimeout(300);await p.tap('[data-kderby="m3"]');await p.waitForTimeout(800);
console.log('rules shown',await p.evaluate(()=>!!document.querySelector('.kdbrq')));
await p.tap('[data-k="dbgo"]');await p.waitForTimeout(500);console.log('after go',await p.evaluate(()=>[kDby.rules,kDby.cd.toFixed(2),KV.scr]));
await p.waitForTimeout(3800);console.log('cd',await p.evaluate(()=>[kDby.cd.toFixed(2),kDby.t.toFixed(2)]));
const cdp=await ctx.newCDPSession(p);const box=await p.locator('#kdby').boundingBox();const x=box.x+box.width*.4,y=box.y+box.height*.75;
const before=await p.evaluate(()=>{const m=kDby.cars[0];return[m.x|0,m.y|0]});
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-i*8}]});await p.waitForTimeout(30)}
await p.waitForTimeout(1500);const mid=await p.evaluate(()=>{const m=kDby.cars[0];return[m.x|0,m.y|0,!!kDby.joy,Math.hypot(m.vx,m.vy)|0]});
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});console.log('move',before,mid,'scrollY',await p.evaluate(()=>scrollY));
const bb=await p.evaluate(()=>{const B=kDbBtn(kDby);return B});await p.tap('#kdby',{position:{x:bb.x*box.width/(await 1||1)/ (box.width/box.width),y:bb.y}}).catch(e=>console.log('tap err',e.message));
await p.waitForTimeout(200);console.log('boost',await p.evaluate(()=>[kDby.boostCd>0,kDby.cars[0].boost>0]));
await p.screenshot({path:'k17.png'});console.log('errors',JSON.stringify(errs));await b.close()})();
