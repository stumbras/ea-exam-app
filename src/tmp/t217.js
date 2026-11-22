const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{const k=KS();k.setup=true;k.name="Alex";view="kids";KV={scr:"show",stage:"play",cat:"maps",i:0,n:5,right:0,score:0,res:[]};k.lv.geo=8;let Q;do{Q=kMapQ(2)}while(!/state/.test(Q.q));KV.Q=Q;KV.Q.lv=8;KV.Q.s="geo";KV.ans=null;render()});await p.waitForTimeout(900);await p.screenshot({path:'k4us.png'});
await p.evaluate(()=>{let Q;do{Q=kMapQ(3)}while(!/country/.test(Q.q));Q.lv=8;Q.s="geo";KV.Q=Q;render()});await p.waitForTimeout(900);await p.screenshot({path:'k4world.png'});
await p.evaluate(()=>{const Q=kPlanetQ(1);Q.lv=4;Q.s="sci";KV.Q=Q;render()});await p.waitForTimeout(900);await p.screenshot({path:'k4planet.png'});
await p.evaluate(()=>{const Q=kMathVis(5);Q.lv=5;Q.s="math";KV.Q=Q;render()});await p.waitForTimeout(900);await p.screenshot({path:'k4mathvis.png'});
await p.evaluate(()=>{const Q=kTeslaQ(3);Q.lv=10;Q.s="sci";KV.Q=Q;render()});await p.waitForTimeout(900);await p.screenshot({path:'k4tesla.png'});
console.log(JSON.stringify(errs));await b.close()})();
