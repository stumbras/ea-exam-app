const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:860},isMobile:true,hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?study',{waitUntil:'load'});await p.waitForTimeout(2500);
console.log('start screen chip visible:',await p.locator('#podbtn').isVisible());
await p.evaluate(()=>{part=3;view="home";render()});await p.waitForTimeout(600);
console.log('home chip visible:',await p.locator('#podbtn').isVisible());await p.screenshot({path:'tmp/s_pod.jpg',type:'jpeg',quality:55,clip:{x:0,y:0,width:400,height:330}});
await p.locator('#podbtn').click();await p.waitForTimeout(1500);
console.log('after tap:',await p.evaluate(()=>JSON.stringify({view,pod:!!document.getElementById("podcard"),top:document.getElementById("podcard")&&Math.round(document.getElementById("podcard").getBoundingClientRect().top)})));
/* blocked-play path: simulate a rejected play, then the tap button must restart the recorded player */
await p.evaluate(()=>{aud.rec=true;});await p.locator('#audstart').click();await p.waitForTimeout(3000);
await p.evaluate(()=>{recEl.pause();aud.needTap=true;aud.paused=true;aud.pauseAt=Date.now();aud.diag="test";renderAudio()});await p.waitForTimeout(300);
const t0=await p.evaluate(()=>recEl.currentTime);await p.locator('#audtap').click();await p.waitForTimeout(2500);
console.log('tap restarts recorded voice:',await p.evaluate(t=>JSON.stringify({paused:recEl.paused,moved:recEl.currentTime>t,needTap:aud.needTap}),t0));
await p.evaluate(()=>{part=14;view="home";render()});await p.waitForTimeout(400);console.log('CDL chip visible (no podcast there):',await p.locator('#podbtn').isVisible());
console.log('errs',JSON.stringify(errs));await b.close()})()
