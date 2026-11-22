const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
for(const pt of [1,2,3,5,6,7,8]){await p.evaluate(x=>{part=x;view="home";filt="all";render()},pt);const h=await p.evaluate(()=>document.documentElement.scrollHeight);
 console.log(pt,'height',h,'screens',(h/844).toFixed(1),'drills',await p.$$eval('[data-tdrgo]',x=>x.length),'cases',await p.$$eval('[data-w7start]',x=>x.length),'ov',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))}
await p.evaluate(()=>{part=1;view="home";render()});await p.screenshot({path:'home1a.png',fullPage:true});
// quick drill sizes
for(const n of [5,10,20]){await p.evaluate(()=>{part=1;view="home";render()});await p.click(`[data-qdn="${n}"]`);await p.click('[data-qd="smart"]');await p.waitForTimeout(200);console.log('smart',n,await p.evaluate(()=>[view,sess&&sess.q?sess.q.length:(typeof S!=="undefined"?"?":0)]))}
for(const m of ['missed','common','weak','new']){await p.evaluate(()=>{part=1;view="home";render()});const bt=await p.$(`[data-qd="${m}"]`);const dis=await bt.evaluate(x=>x.disabled);if(dis){console.log(m,'disabled');continue}await bt.click();await p.waitForTimeout(200);console.log(m,await p.evaluate(()=>view))}
await p.evaluate(()=>{part=1;view="home";render()});await p.click('[data-tdrgo="basis"]');await p.waitForTimeout(200);console.log('drill',await p.evaluate(()=>[view,document.querySelector('#view h2').textContent]));
await p.click('#view .sesshead [data-tdr=""]');await p.waitForTimeout(150);console.log('back',await p.evaluate(()=>view));
await p.evaluate(()=>{part=3;view="home";render()});await p.click('[data-w7start="0"]');await p.waitForTimeout(150);console.log('case',await p.evaluate(()=>[view,document.querySelector('#view h2').textContent]));
await p.evaluate(()=>{part=1;view="home";render()});await p.click('#moremodes summary');await p.waitForTimeout(100);await p.evaluate(()=>render());console.log('more open kept',await p.evaluate(()=>document.querySelector('#moremodes').open),'tiles',await p.$$eval('#moremodes .mode',x=>x.length));
console.log('errors',JSON.stringify(errs));await b.close()})();
