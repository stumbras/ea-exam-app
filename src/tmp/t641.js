const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
const dn=()=>p.evaluate(()=>{const d=document.querySelector('.donext');return d?d.innerText.replace(/\s+/g,' '):''});
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);await p.evaluate(()=>{S.set.pace="steady"});
await p.evaluate(()=>{part=1;S.set.xp={nodx1:1,nodx2:1,nodx3:1};[1,2,3].forEach(pt=>Object.keys(PARTS[pt].doms).forEach(d=>{const m=xpMem(d,pt);m.pc={};(UNITS[pt]||[]).forEach((u,k)=>m.pc[k]=0)}));/* diagnostic skipped and every lesson check already failed: t645 covers those */view="home";render();scrollTo(0,0)});await p.waitForTimeout(200);
let t=await dn();console.log(' ',t.slice(0,150));ok('new learner, Part 1: the red button starts with the first lesson',/Step 1 of \d+ · Read: Taxpayer data, deadlines and penalties/.test(t));
await p.screenshot({path:'tmp/x_home.png',fullPage:true});
await p.click('.donext');await p.waitForTimeout(250);ok('it opens that lesson on slide 1',await p.evaluate(()=>view==="lessons"&&les&&les.unit===0&&les.idx===0));
const n=await p.evaluate(()=>UNITS[1][0].s.length);for(let k=0;k<n;k++){await p.click('#lesnext');await p.waitForTimeout(60)}
ok('finishing the lesson returns to the Part 1 main page',await p.evaluate(()=>view==="home"&&part===1));
t=await dn();console.log(' ',t.slice(0,170));ok('next step is to learn the facts of that lesson',/Learn: Taxpayer data, deadlines and penalties/.test(t)&&/facts from this lesson are still new/.test(t));
await p.click('.donext');await p.waitForTimeout(250);
ok('the learn session teaches facts in groups before asking',await p.evaluate(()=>view==="session"&&sess.mode==="easy"&&sess.queue.some(e=>e.learn)&&sess.xp&&sess.xp.k==="ul"));
ok('its facts all belong to the lesson',await p.evaluate(()=>{const re=UNITS[1][0].re;return sess.newIds.length>0&&sess.newIds.every(id=>re.test(BYID[id].f+" "+BYID[id].b))}));
// answer everything right, quickly
await p.evaluate(()=>{const s=sess;let g=0;while(view==="session"&&sess===s&&g++<300){const cur=s.queue[s.pos];if(!cur){finish();break}s.cp=false;if(cur.learn){advance();continue}record(true,true);advance()}});await p.waitForTimeout(250);
const res=await p.evaluate(()=>({view,nx:!!document.querySelector('.xpnx'),txt:(document.querySelector('.xpnx')||{innerText:''}).innerText.replace(/\s+/g,' '),sw:document.documentElement.scrollWidth}));console.log(' ',res.txt.slice(0,140));
ok('results page shows the next step as a button',res.view==="results"&&res.nx&&/NEXT STEP/.test(res.txt)&&/Learn: Taxpayer data|Quiz: Taxpayer data/.test(res.txt)&&res.sw<=392);
await p.screenshot({path:'tmp/x_results.png',fullPage:false});
await p.click('.xpnx');await p.waitForTimeout(250);ok('tapping it starts that step straight away',await p.evaluate(()=>view==="session"&&!!sess));
await p.evaluate(()=>{const s=sess;let g=0;while(view==="session"&&sess===s&&g++<300){const cur=s.queue[s.pos];if(!cur){finish();break}s.cp=false;if(cur.learn){advance();continue}record(true,true);advance()}view="home";sess=null;render()});await p.waitForTimeout(200);
t=await dn();console.log(' ',t.slice(0,150));ok('after two fact sessions a quiz on the lesson comes up',/Quiz: Taxpayer data, deadlines and penalties/.test(t));
await p.click('.donext');await p.waitForTimeout(250);
ok('the quiz is 10 items, questions first, from that lesson',await p.evaluate(()=>{const re=UNITS[1][0].re;const q=sess.queue.map(e=>BYID[e.id]);return sess.mode==="unit"&&q.length===10&&q.filter(i=>i.t==="q").length>=8&&q.every(i=>re.test((i.f||i.s)+" "+(i.b||"")))}));
// fail the final quiz of a small lesson -> read again
await p.evaluate(()=>{sess=null;const k=2;/* Dependents */S.set.les=S.set.les||{};[0,1].forEach(u=>{S.set.les["u1-"+u]=UNITS[1][u].s.length-1;xpUnitFacts(u).forEach(i=>{if(!S.it[i.id])S.it[i.id]=[2,today()+3,1,1,1,0]});const m=xpMem(1);m.uq=m.uq||{};m.uq[u]=1});S.set.les["u1-"+k]=UNITS[1][k].s.length-1;xpUnitFacts(k).forEach(i=>{if(!S.it[i.id])S.it[i.id]=[2,today()+3,1,1,1,0]});persist();view="home";render()});await p.waitForTimeout(200);
t=await dn();ok('with a lesson read and its facts met, the final quiz is next',/Quiz: Dependents/.test(t)&&/lesson you just studied/.test(t));
await p.click('.donext');await p.waitForTimeout(200);await p.evaluate(()=>{const s=sess;let g=0;while(view==="session"&&sess===s&&g++<60){const cur=s.queue[s.pos];if(!cur){finish();break}s.cp=false;record(g%4===0,true);advance()}if(view==="session")finish();view="home";sess=null;render()});await p.waitForTimeout(200);
t=await dn();console.log(' ',t.slice(0,150));ok('a quiz under 60% sends you to read the lesson again',/Read again: Dependents/.test(t));
await p.click('.donext');await p.waitForTimeout(200);ok('re-reading starts at slide 1',await p.evaluate(()=>view==="lessons"&&les.unit===2&&les.idx===0));
await p.evaluate(()=>{les=null;BANK.forEach(i=>{const r=S.it[i.id];if(r&&i.p==1&&r[4]===0)r[4]=1});persist();view="home";render()});await p.waitForTimeout(150);t=await dn();ok('then the quiz is offered once more',/Quiz: Dependents/.test(t));
// topic rows
const row=await p.evaluate(()=>{const r=document.querySelector('#xp1');r.open=true;return{chips:[...r.querySelectorAll('.xpc')].map(c=>c.innerText.trim()),btn:[...r.querySelectorAll('button')].map(b=>b.innerText.trim()),sw:document.documentElement.scrollWidth}});console.log(' ',JSON.stringify(row));
ok('topic row shows a Lessons chip and a lessons button with a count',row.chips[0].includes("Lessons")&&/Lessons · 3 of 3 read/.test(row.btn[0])&&row.sw<=392);
await p.screenshot({path:'tmp/x_row.png',fullPage:true});
// existing progress is kept
await p.evaluate(()=>{const d=2;BANK.filter(i=>i.p==1&&i.d==d&&i.t==="f").forEach(i=>{S.it[i.id]=[3,today()+5,2,2,1,0]});BANK.filter(i=>i.p==1&&i.d==d&&i.t==="q").slice(0,40).forEach(i=>{S.it[i.id]=[2,today()+2,1,1,1,0]});
  domNorm(S);S.dd["1-2"]={acct:[60,"1".repeat(45)+"B".repeat(9)+"b".repeat(6),Date.now()]};domJoin(S,"1-2");delete S.set.xpv;if(S.set.xp)delete S.set.xp["1-2"];persist();view="home";render()});await p.waitForTimeout(200);
const mig=await p.evaluate(()=>{const x=xpDom(2);return{pd:xpPeek(2).pd,ld:xpPeek(2).ld,practiced:x.practiced,lesDone:x.lesDone,qacc:x.qacc}});console.log(' ',JSON.stringify(mig));
ok('a topic already learned and practiced before this version keeps both, and is not sent back to lessons',mig.pd===1&&mig.ld===1&&mig.practiced&&mig.lesDone&&mig.qacc<0.7);
// stuck practice -> read again -> parked
await p.evaluate(()=>{const d=1;BANK.filter(i=>i.p==1&&i.d==d&&i.t==="f").forEach(i=>{if(!S.it[i.id])S.it[i.id]=[3,today()+5,2,2,1,0]});const m=xpMem(d);m.uq={0:1,1:1,2:1};delete m.pd;m.pr=2;m.pl=47;m.rp=0;
  xpUnitQs(1).slice(0,7).forEach(i=>{S.it[i.id]=[0,today()+9,1,0,0,0,1]});domNorm(S);S.dd["1-1"]={acct:[60,"1".repeat(30)+"b".repeat(12)+"B".repeat(8),Date.now()]};domJoin(S,"1-1");persist();view="home";render()});await p.waitForTimeout(200);
t=await dn();console.log(' ',t.slice(0,190));ok('two practice rounds under the bar: the lesson holding most misses is offered again',/Read again: /.test(t)&&/47% right/.test(t)&&/of your open misses come from this lesson/.test(t));
await p.click('.donext');await p.waitForTimeout(150);await p.evaluate(()=>{les=null;view="home";render()});await p.waitForTimeout(150);
await p.evaluate(()=>{BANK.forEach(i=>{const r=S.it[i.id];if(r&&i.p==1&&r[4]===0)r[4]=1});persist();view="home";render()});await p.waitForTimeout(150);t=await dn();console.log(' ',t.slice(0,170));ok('then practice again, showing the round and last score',/Practice: Preliminary work/.test(t)&&/Round 3 · last round 47%/.test(t));
await p.evaluate(()=>{const m=xpMem(1);m.pr=4;m.pk=1;persist();view="home";render()});await p.waitForTimeout(150);
const pk=await p.evaluate(()=>({chips:[...document.querySelectorAll('#xp1 .xpc')].map(c=>c.innerText.trim()),next:xpNext().t}));console.log(' ',JSON.stringify(pk));
ok('after four rounds the topic is set aside and the path moves on',pk.chips.some(c=>/Practice · later/.test(c))&&!/Preliminary work/.test(pk.next));
// other sections still work
for(const pt of [2,3,5,6,8]){const r=await p.evaluate(pt=>{part=pt;sess=null;view="home";render();const a=xpNext();return{t:a.t,dn:!!document.querySelector('.donext'),rows:document.querySelectorAll('.xprow').length,sw:document.documentElement.scrollWidth}},pt);console.log(`  part ${pt}: ${r.t}`);ok(`part ${pt} main page builds with a next step`,r.dn&&r.rows>0&&r.sw<=392&&!!r.t)}
const caa=await p.evaluate(()=>{part=7;view="home";render();return{dn:document.querySelector('.donext').innerText.replace(/\s+/g,' '),nx:!!document.querySelector('.xpnx')}});ok('CAA page is unchanged (refresher or checklist first)',/Refresher|client/i.test(caa.dn));
ok('no page errors',errs.length===0);if(errs.length)console.log(errs.slice(0,6));
await b.close()})();
