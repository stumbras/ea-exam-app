const pw=require('playwright');(async()=>{const eng=process.argv[2]||'chromium';const b=await pw[eng].launch(eng==='chromium'?{args:['--autoplay-policy=no-user-gesture-required']}:{});const ctx=await b.newContext({viewport:{width:400,height:860},isMobile:eng!=='firefox',hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push('C:'+m.text().slice(0,160))});
const U=(process.argv[3]||'http://localhost:8765/ea-exam-app/')+'?study';
await p.goto(U,{waitUntil:'load'});await p.waitForTimeout(2500);
console.log('recOn',await p.evaluate(()=>JSON.stringify({hosted:HOSTED,rec:Object.keys(REC).length,p3:recHas(3),view,part})));
await p.evaluate(()=>{part=3;openAudio()});await p.waitForTimeout(800);
console.log('screen',await p.evaluate(()=>JSON.stringify({view,hasStart:!!document.getElementById("audstart"),rec:aud&&aud.rec,txt:document.getElementById("view").innerText.slice(0,120).replace(/\n/g," | ")})));
await p.locator('#audstart').click();await p.waitForTimeout(6000);
console.log('after 6s',await p.evaluate(()=>JSON.stringify({state:aud&&aud.state,pos:aud&&aud.pos,began:aud&&aud.began,miss:aud&&aud.miss,needTap:aud&&aud.needTap,paused:aud&&aud.paused,t:recEl&&recEl.currentTime,src:recEl&&String(recEl.src).slice(0,30),err:recEl&&recEl.error&&recEl.error.code,urls:aud&&Object.values(aud.urls).map(u=>u===null?"null":u===""?"EMPTY":"ok").join(","),txt:document.getElementById("view").innerText.slice(0,160).replace(/\n/g," | ")})));
console.log('errs',JSON.stringify(errs.slice(0,6)));await b.close()})()
