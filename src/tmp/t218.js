const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";view="kids";KV={scr:"home"};render()});await p.screenshot({path:'k5home.png'});
console.log('tix',await p.evaluate(()=>S.kids.tix));
await p.click('[data-k="drive"]');await p.waitForTimeout(1500);await p.click('[data-k="dl"]');await p.waitForTimeout(800);await p.click('#kdrv',{position:{x:300,y:200}});await p.waitForTimeout(1500);await p.screenshot({path:'k5drive.png'});
console.log('drive',await p.evaluate(()=>[kDrv.lane,Math.round(kDrv.t),kDrv.dist.toFixed(2),Math.round(kDrv.bat),kDrv.bolts]));
await p.evaluate(()=>{kDrv.t=59.9});await p.waitForTimeout(1200);await p.screenshot({path:'k5driveend.png'});console.log('end',await p.evaluate(()=>[kDrv.over,S.kids.drive.best,S.kids.tix]));
// tesla round to launch
await p.evaluate(()=>{KV={scr:"show",stage:"pick"};render()});await p.click('[data-kcat="tesla"]');
for(let i=0;i<5;i++){if(await p.$('[data-k="lessonOk"]'))await p.click('[data-k="lessonOk"]');const a=await p.evaluate(()=>KV.Q.a);if(i===2)await p.screenshot({path:'k5tq.png'});await p.click(`[data-ka="${a}"]`);await p.waitForTimeout(720);await p.click('[data-k="next"]')}
await p.waitForTimeout(1500);await p.screenshot({path:'k5launch1.png'});await p.waitForTimeout(2200);await p.screenshot({path:'k5launch2.png'});await p.waitForTimeout(2000);
console.log('launch',await p.evaluate(()=>[KV.stage,S.kids.tix,S.kids.tesLv,S.kids.rocket.dest]));
console.log('teslaQ',await p.evaluate(()=>{let bad=0;for(let T=1;T<=5;T++)for(let i=0;i<200;i++){const Q=kTeslaQ(T);if(Q.o.length!==4||Q.a<0||new Set(Q.o).size!==4)bad++}return bad}));
console.log('errors',JSON.stringify(errs));await b.close()})();
