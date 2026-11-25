const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['iPhone 13'],serviceWorkers:'block'});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(3000);
await p.evaluate(()=>{const k=KS();k.tix=9;k.setup=1;k.name="Tomas";k.bday={m:5,d:5,y:2016};view="kids";KV={scr:"drive"};render()});await p.waitForTimeout(800);await p.screenshot({path:'/tmp/dv0.png',fullPage:true});
const ids=await p.evaluate(()=>KCARS.map(c=>c[0]).join(","));
// draw each car for a visual check
await p.evaluate(()=>{const cv=document.createElement("canvas");cv.width=380;cv.height=170;cv.id="tst";document.body.prepend(cv);const c=cv.getContext("2d");c.fillStyle="#334155";c.fillRect(0,0,380,170);["sedan","suv","x","plaid","truck","cab","semi","roadster"].forEach((s,i)=>kTesla(c,24+i*46,60,s==="semi"?36:34,s==="semi"?90:64,["#e31937","#1d4ed8","#f8fafc","#111827","#b8bcc6","#c9b37e","#e5e7eb","#e31937"][i],s,{fly:s==="roadster",t:1}));kCar(c,60,140,30,56,"#1d4ed8","sedan");kCar(c,120,140,30,56,"#16a34a","suv");kCar(c,180,140,32,60,"#e31937","truck")});
await p.waitForTimeout(200);const el=await p.$('#tst');await el.screenshot({path:'/tmp/cars.png'});
console.log(ids,errs);await b.close()})();
