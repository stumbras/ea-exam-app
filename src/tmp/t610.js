const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},permissions:['clipboard-read','clipboard-write']});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);await p.evaluate(()=>{S.set.pace="steady"});
await p.evaluate(()=>{part=7;view="home";render();scrollTo(0,0)});await p.waitForTimeout(300);
let t=await p.evaluate(()=>document.querySelector('.donext').innerText.replace(/\s+/g,' '));console.log(' ',t);ok('CAA main page leads with a refresher, not an exam path',/Refresher · 10 quick questions/.test(t));
ok('job card and yearly counter are on the main page',await p.evaluate(()=>!!document.querySelector('.cjh')&&/0 of the 5 Forms W-7 required/.test(document.querySelector('.cjyr').innerText)&&/Refresher by topic/i.test(document.querySelector('.xp h3').textContent)));
await p.screenshot({path:'tmp/c_home.png',fullPage:true});
await p.click('.donext');await p.waitForTimeout(300);ok('refresher is 10 CAA questions',await p.evaluate(()=>sess&&sess.queue.length===10&&sess.queue.every(q=>BYID[q.id].p==7&&BYID[q.id].t==="q")));
await p.click('.bkback.go');await p.waitForTimeout(250);t=await p.evaluate(()=>document.querySelector('.donext').innerText.replace(/\s+/g,' '));ok('after the refresher the red button opens the client checklist',/Open the W-7 client checklist/.test(t));
await p.click('.donext');await p.waitForTimeout(300);
let st=await p.evaluate(()=>({view,steps:document.querySelectorAll('.cjstep').length,open:[...document.querySelectorAll('.cjstep details')].map(d=>d.open?1:0).join(''),ticks:document.querySelectorAll('.cjtick').length,links:document.querySelectorAll('.cjstep a[href^="https://www.irs.gov"]').length,back:!!document.querySelector('.bkback.go'),sw:document.documentElement.scrollWidth}));console.log(' ',JSON.stringify(st));
ok('checklist: 10 steps, step 1 open, IRS links, Back bar, no sideways scroll',st.view==="caajob"&&st.steps===10&&st.open==="1000000000"&&st.links>=12&&st.back&&st.sw<=392);
await p.screenshot({path:'tmp/c_list.png',fullPage:true});
// tick all of step 1 -> step 2 opens
const n1=await p.evaluate(()=>CJOB[0].c.length);for(let k=0;k<n1;k++){await p.click(`.cjtick[data-i="0"][data-k="${k}"]`);await p.waitForTimeout(60)}
ok('ticking every box of step 1 completes it and opens step 2',await p.evaluate(()=>cjStepDone(0)&&document.querySelector('#cj1').open&&!document.querySelector('#cj0').open));
await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>{part=7;view="home";render()});await p.waitForTimeout(250);t=await p.evaluate(()=>document.querySelector('.donext').innerText.replace(/\s+/g,' ')+' | '+document.querySelector('.cjb').innerText.replace(/\s+/g,' '));console.log(' ',t);ok('ticks survive a reload and the main page says where you stopped',/pick up where you stopped/.test(t)&&/step 2 of 10/.test(t));
// copy link
await p.click('[data-cj="open"]');await p.waitForTimeout(250);await p.evaluate(()=>{document.querySelector('#cj0').open=true});await p.click('#cj0 [data-cp]');await p.waitForTimeout(250);const clip=await p.evaluate(()=>navigator.clipboard.readText().catch(()=>'ERR'));ok('Copy link puts the IRS address on the clipboard: '+clip,/^https:\/\/www\.irs\.gov\//.test(clip));
// finish a client
await p.evaluate(()=>{const s=cjS();CJOB.forEach((st,i)=>st.c.forEach((_,k)=>s.t[i+"-"+k]=1));persist();render()});await p.waitForTimeout(250);ok('all ticked: offers to count the W-7',await p.evaluate(()=>!!document.querySelector('[data-cj="finish"]')));
await p.click('[data-cj="finish"]');await p.waitForTimeout(250);ok('counted for the year and the checklist is cleared',await p.evaluate(()=>cjS().y[new Date().getFullYear()]===1&&Object.keys(cjS().t).length===0));
await p.click('[data-cj="ref"]');await p.waitForTimeout(250);const rf=await p.evaluate(()=>({cards:document.querySelectorAll('.card.slide').length,links:document.querySelectorAll('.nlink a').length,und:/undefined/.test(document.querySelector('#view').innerText)}));ok('desk reference: '+JSON.stringify(rf),rf.cards===5&&rf.links===5&&!rf.und);await p.screenshot({path:'tmp/c_ref.png',fullPage:true});
await p.evaluate(()=>{part=7;view="home";render()});await p.waitForTimeout(200);await p.click('[data-cj="yp"]');await p.click('[data-cj="yp"]');await p.waitForTimeout(150);ok('yearly counter can be corrected by hand',await p.evaluate(()=>/3 of the 5/.test(document.querySelector('.cjyr').innerText)));
// other sections untouched
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(200);ok('Part 1 still shows its study path and no CAA card',await p.evaluate(()=>!document.querySelector('.cjh')&&/Step \d+ of \d+/.test(document.querySelector('.donext').innerText)));
await p.evaluate(()=>{part=8;view="home";render()});await p.waitForTimeout(200);ok('notary page unchanged (commission path still there)',await p.evaluate(()=>!!document.querySelector('#npathd')&&!document.querySelector('.cjh')));
console.log('errors',errs);await b.close()})();
