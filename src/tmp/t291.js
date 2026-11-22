const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1800);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name=k.name||"Tomas";k.guided=false;persist()});
await p.evaluate(()=>{const fb=document.createElement("button");fb.dataset.k="tworld";kidsClick(fb)});await p.waitForTimeout(400);
await p.screenshot({path:'tmp/tw1.png',fullPage:true});
await p.click('[data-ktw="boring"]');await p.waitForTimeout(300);await p.screenshot({path:'tmp/tw2.png',fullPage:true});
await p.evaluate(()=>{const fb=document.createElement("button");fb.dataset.ktw="mz";kidsClick(fb)});await p.waitForTimeout(300);
const a=await p.evaluate(()=>MZ.q.a);await p.click(`[data-kmz="ans"][data-i="${a}"]`);await p.waitForTimeout(1000);
console.log('phase',await p.evaluate(()=>MZ.phase));
// autopilot: steer and burn to catch
let res=null;for(let i=0;i<900;i++){const st=await p.evaluate(()=>{if(!MZ||MZ.phase!=="fly")return MZ&&MZ.phase;const cx=MZG.tx-28,dx=cx-MZ.x;MZ.R=dx>2&&MZ.vx<0.6?1:0;MZ.L=dx<-2&&MZ.vx>-0.6?1:0;const dist=MZG.armY-MZ.cy;MZ.burn=(MZ.vy>1.2&&dist<220)||MZ.vy>3.2?1:0;return "fly"});if(st!=="fly"){res=st;break}if(i===60)await p.screenshot({path:'tmp/tw3.png'});await p.waitForTimeout(16)}
console.log('result',res,await p.evaluate(()=>MZ.msg+" | "+MZ.tip));
await p.screenshot({path:'tmp/tw4.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
