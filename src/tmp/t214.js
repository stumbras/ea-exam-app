// regression: desktop header, study homes, a session, no errors
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];for(const w of [390,1280]){const p=await b.newPage({viewport:{width:w,height:900}});p.on('pageerror',e=>errs.push(w+':'+e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);await p.evaluate(()=>{view="start";render()});
const r=await p.evaluate(()=>{const k=document.querySelector('#kidsbtn').getBoundingClientRect(),h=document.querySelector('.top h1').getBoundingClientRect(),t=document.querySelector('#themebtn').getBoundingClientRect();const ov=(a,b)=>!(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top);return {kids:[Math.round(k.width),Math.round(k.height)],hitsTitle:ov(k,h),hitsTheme:ov(k,t)}});
await p.screenshot({path:'kstart'+w+'.png'});
for(const part of [1,2,3,4,5,6,7,8]){await p.evaluate(x=>{part=x;view="home";render()},part);}
await p.evaluate(()=>{part=1;view="home";render();startSession("qd",5)});await p.waitForTimeout(200);
console.log(w,JSON.stringify(r),'session',await p.evaluate(()=>view),'kidsBtnInSession',await p.evaluate(()=>getComputedStyle(document.querySelector('#kidsbtn')).display));
await p.evaluate(()=>{view="kids";KV={scr:"home"};render()});await p.screenshot({path:'khome'+w+'.png',fullPage:true});await p.close()}
console.log('errors',JSON.stringify(errs));await b.close()})();
