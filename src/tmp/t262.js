const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=2;view="kids";KV={scr:"fly"};kFly=null;render()});await p.waitForTimeout(300);
const box=await p.evaluate(()=>{const r=[...document.querySelectorAll('.ktop .kpb')].map(e=>{const b=e.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height),getComputedStyle(e).position]});const back=document.querySelector('.ktop button');const bb=back.getBoundingClientRect();return {pb:r,back:[Math.round(bb.x),Math.round(bb.width),back.dataset.k]}});console.log(JSON.stringify(box));
await p.screenshot({path:'k33top.png',clip:{x:0,y:0,width:390,height:120}});
await p.click('.ktop button');await p.waitForTimeout(300);console.log('after back',await p.evaluate(()=>KV.scr||'home'));
await p.evaluate(()=>{KV={scr:"music",mm:"piano"};render()});await p.waitForTimeout(300);console.log('piano black keys',await p.evaluate(()=>{const k=document.querySelector('.kpk');return k?[getComputedStyle(k).position,getComputedStyle(k).height]:null}));await p.screenshot({path:'k33piano.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
