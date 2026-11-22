const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const errs=[];const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);await p.click('[data-sec="ea"]').catch(()=>{});
 // an old-style saved copy (no size in the address) must be ignored and cleaned up; full download then counts 757
 await p.evaluate(async()=>{const c=await caches.open("ea-audio-v1");await c.put("audio/p1f100snyl.mp3",new Response("old"))});
 await p.click('[data-mode="audio"]');await p.waitForTimeout(600);
 console.log('before:',await p.evaluate(()=>recSaved));
 await p.click('#recget');
 for(let k=0;k<40;k++){await p.waitForTimeout(1000);if(await p.evaluate(()=>recDl&&!recDl.on))break}
 console.log('after download:',await p.evaluate(async()=>{const c=await caches.open("ea-audio-v1");const ks=await c.keys();let bytes=0;for(const r of ks.slice(0,757)){bytes+=(await (await c.match(r)).arrayBuffer()).byteLength}return {saved:recSaved,entries:ks.length,fail:recDl.fail,mb:+(bytes/1048576).toFixed(1),old:ks.filter(r=>!/\?\d+$/.test(r.url)).length,text:document.querySelector('#view .notice').innerText.split('\n').pop()}}));
 // a 60-minute session offline: queue only has recorded facts, all three scopes
 await ctx.setOffline(true);await p.click('[data-amins="60"]');await p.click('#audstart');await p.waitForTimeout(2500);
 console.log('offline 60:',await p.evaluate(()=>({q:aud.queue.length,allRec:aud.queue.every(i=>REC[i.id]),pos:aud.pos,playing:!recEl.paused,t:+recEl.currentTime.toFixed(1)})));
 for(let k=0;k<6;k++){await p.evaluate(()=>{recEl.currentTime=Math.max(0,recEl.duration-0.3)});await p.waitForTimeout(900)}
 console.log('after 6 facts:',await p.evaluate(()=>({pos:aud.pos,heard:aud.heard,playing:!recEl.paused})));
 await p.click('#audmiss');await p.waitForTimeout(200);console.log('didnt know re-queued:',await p.evaluate(()=>aud.queue.filter(i=>i===aud.cur).length));
 await p.click('#audend');await ctx.setOffline(false);
 console.log('errors',errs);await b.close()})();
