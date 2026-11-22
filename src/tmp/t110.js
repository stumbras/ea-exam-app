const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const errs=[];const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,150))});
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);await p.click('[data-sec="ea"]').catch(()=>{});
 console.log('recOn',await p.evaluate(()=>[recOn(),Object.keys(REC).length,REC_MB,new Audio().canPlayType('audio/mpeg')]));
 await p.click('[data-mode="audio"]');await p.waitForTimeout(500);
 console.log('setup:',await p.evaluate(()=>document.querySelector('#view .notice').innerText.replace(/\n+/g,' | ').slice(0,300)));
 await p.screenshot({path:'rec-setup.png',fullPage:true});
 await p.evaluate(()=>{aud.rate=1.2});
 await p.click('#audstart');
 const snap=async(l)=>console.log(l,await p.evaluate(()=>({state:aud.state,pos:aud.pos,phase:aud.phase,heard:aud.heard,t:recEl&&+recEl.currentTime.toFixed(1),paused:recEl&&recEl.paused,rate:recEl&&recEl.playbackRate,cur:aud.cur&&aud.cur.f.slice(0,40),src:recEl&&recEl.src.slice(0,5)})));
 await p.waitForTimeout(2500);await snap('after 2.5s');
 // speed things up for the test: jump near the end of each file and let 'ended' chain to the next
 for(let k=0;k<3;k++){await p.evaluate(()=>{recEl.currentTime=Math.max(0,recEl.duration-0.4)});await p.waitForTimeout(1500);await snap('chain '+k)}
 // answer reveal
 await p.evaluate(()=>{recEl.currentTime=REC[aud.cur.id][0]+0.2});await p.waitForTimeout(700);await snap('answer phase');
 console.log('answer shown:',await p.evaluate(()=>!!document.querySelector('#view .back')));
 await p.screenshot({path:'rec-play.png'});
 await p.click('#audpause');await p.waitForTimeout(300);await snap('paused');
 await p.click('#audpause');await p.waitForTimeout(600);await snap('resumed');
 await p.click('#audskip');await p.waitForTimeout(900);await snap('skipped');
 await p.click('#audknew');await p.waitForTimeout(200);
 console.log('media session:',await p.evaluate(()=>navigator.mediaSession&&navigator.mediaSession.metadata?navigator.mediaSession.metadata.title+' | '+navigator.mediaSession.metadata.artist:'none'));
 await p.click('#audend');await p.waitForTimeout(400);
 console.log('done:',await p.evaluate(()=>[aud.state,aud.heard,document.querySelector('#view h2').textContent,Object.keys(S.au||{}).length,recEl.paused]));
 // offline: save all, then go offline and play
 await p.click('#audagain');await p.waitForTimeout(400);await p.click('#recget');await p.waitForTimeout(2500);
 console.log('saved:',await p.evaluate(()=>[recSaved,document.querySelector('#view .notice').innerText.replace(/\n+/g,' | ').slice(-80)]));
 await ctx.setOffline(true);await p.click('#audstart');await p.waitForTimeout(2500);await snap('offline play');
 await p.evaluate(()=>{recEl.currentTime=Math.max(0,recEl.duration-0.3)});await p.waitForTimeout(1500);await snap('offline chain');
 await p.click('#audend');await ctx.setOffline(false);
 // phone voice still selectable
 await p.click('#audagain');await p.waitForTimeout(300);await p.click('[data-arec="0"]');await p.waitForTimeout(200);
 console.log('phone voice setup:',await p.evaluate(()=>[aud.rec,!!document.querySelector('[data-agap]'),[...document.querySelectorAll('[data-amins]')].map(x=>x.textContent).join(',')]));
 await p.click('[data-arec="1"]');
 console.log('errors',errs);await b.close()})();
