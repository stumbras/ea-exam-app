const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=5;view="kids";KV={scr:"home"};render()});
console.log('voice',await p.evaluate(()=>[S.kids.voice,kRecId("Awesome!","max"),kRecId("Level up! Math level 7!","max"),kRecId("Welcome back, Alex!","nova"),kVHash("Awesome!")]));
console.log('file',await p.evaluate(async()=>{const id=kRecId("Awesome!","max");const r=await fetch(`voice/max/${id}.mp3`);return [r.status,(await r.arrayBuffer()).byteLength]}));
await p.screenshot({path:'k10home.png',fullPage:true});
await p.click('[data-k="land"]');await p.screenshot({path:'k10landpick.png'});await p.click('[data-kland="0"]');await p.waitForTimeout(600);
// autopilot landing: fire thrust when falling fast, steer to pad
await p.evaluate(()=>{const iv=setInterval(()=>{const D=kLnd;if(!D||D.over){clearInterval(iv);return}const cv=document.getElementById('kland');const W=cv.width;D.thr=D.vy>25||(D.y>cv.height*0.6&&D.vy>12);D.left=D.x>W/2+8&&D.vx>-20;D.right=D.x<W/2-8&&D.vx<20},30)});
await p.waitForTimeout(1500);await p.screenshot({path:'k10land.png'});await p.waitForFunction(()=>kLnd&&kLnd.over,null,{timeout:30000});await p.waitForTimeout(1200);
console.log('land',await p.evaluate(()=>[kLnd.res,kLnd.why||"",Math.round(kLnd.fuel),S.kids.spx]));await p.screenshot({path:'k10landend.png'});
await p.evaluate(()=>{KV={scr:"show",stage:"pick"};render()});await p.click('[data-kcat="spacex"]');console.log('spx q',await p.evaluate(()=>[KV.Q.cat,KV.Q.q.slice(0,50),!!document.querySelector('[data-k="mic"]')]));await p.screenshot({path:'k10spx.png'});
console.log('spx bank',await p.evaluate(()=>{let bad=0;for(let T=1;T<=5;T++)for(let i=0;i<100;i++){const Q=kSpaceXQ(T);if(Q.o.length!==4||Q.a<0||new Set(Q.o).size!==4)bad++}return bad}));
await p.evaluate(()=>{KV={scr:"sounds"};render()});await p.click('[data-kth="neon"]');await p.evaluate(()=>{KV={scr:"home"};render()});await p.screenshot({path:'k10neon.png'});
console.log('theme',await p.evaluate(()=>document.querySelector('.kids').className));
console.log('errors',JSON.stringify(errs));await b.close()})();
