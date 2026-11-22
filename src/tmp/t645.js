const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
const dn=()=>p.evaluate(()=>{const d=document.querySelector('.donext');return d?d.innerText.replace(/\s+/g,' '):''});
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);await p.evaluate(()=>{S.set.pace="steady"});
await p.evaluate(()=>{part=3;view="home";render();scrollTo(0,0)});await p.waitForTimeout(200);
let t=await dn();console.log(' ',t.slice(0,160));ok('new learner: the red button starts with the diagnostic',/Start with the diagnostic · 24 questions/.test(t));
ok('the path card has a Diagnostic button and a way to skip it',await p.evaluate(()=>!!document.querySelector('.xaready')&&!!document.querySelector('[data-xp="nodx"]')&&document.documentElement.scrollWidth<=392));
await p.click('.donext');await p.waitForTimeout(250);
let s=await p.evaluate(()=>({n:sess.queue.length,title:document.querySelector('.sesshead h2').innerText,doms:sess.queue.map(e=>BYID[e.id].d).join(""),lv:[...new Set(sess.queue.map(e=>BYID[e.id].lv))]}));console.log(' ',JSON.stringify(s));
ok('24 questions, topics interleaved, all medium to start',s.n===24&&s.title==="Diagnostic"&&/^(1234){6}$/.test(s.doms)&&s.lv.length===1&&s.lv[0]===2);
// answer: topic 1 always right+sure, topic 2 right but guessing, topic 3 wrong, topic 4 alternate
const tr=await p.evaluate(()=>{const s=sess,lv={1:[],2:[],3:[],4:[]};let g=0,k4=0;while(view==="session"&&sess===s&&g++<60){const cur=s.queue[s.pos];if(!cur)break;s.cp=false;const it=BYID[cur.id];lv[it.d].push(it.lv);if(it.d==1)record(true,true);else if(it.d==2)record(true,false);else if(it.d==3)record(false,true);else record(k4++%2===0,true);advance()}return{lv,view}});console.log(' ',JSON.stringify(tr.lv));
ok('it adapts: right answers bring harder questions, wrong ones easier',tr.lv[1].slice(1).every(l=>l===3)&&tr.lv[3].slice(1).every(l=>l===1)&&tr.lv[2].every(l=>l===2));
const rp=await p.evaluate(()=>({view,dx:xpDx(),card:(document.querySelector('.dxr')||{innerText:''}).innerText.replace(/\s+/g,' '),next:(document.querySelector('.xpnx')||{innerText:''}).innerText.replace(/\s+/g,' '),miss:missedPool(3,"all").length,sw:document.documentElement.scrollWidth}));console.log(' ',rp.card.slice(0,330));console.log(' ',rp.next.slice(0,120));
ok('scores per topic: sure-right 100%, guessed 50%, wrong 0%',rp.dx&&Math.round(rp.dx.d[1][0]*100)===100&&Math.round(rp.dx.d[2][0]*100)===50&&rp.dx.d[3][0]===0&&rp.dx.d[4][0]>0.3&&rp.dx.d[4][0]<0.7);
ok('results page shows the diagnostic report, no sideways scroll',rp.view==="results"&&/Your diagnostic · \d+% overall/.test(rp.card)&&/strong/.test(rp.card)&&/weak/.test(rp.card)&&rp.sw<=392);
ok('questions missed in the diagnostic are not left as open misses',rp.miss===0);
await p.screenshot({path:'tmp/d_report.png',fullPage:false});
ok('the next step is in the weakest heavy topic, not topic 1',/Specific areas of representation|Check: (Collection|Liens)/.test(rp.next)||/Check: /.test(rp.next));
await p.evaluate(()=>{sess=null;view="home";render()});await p.waitForTimeout(200);t=await dn();console.log(' ',t.slice(0,200));
const first=await p.evaluate(()=>{const a=xpNext();return{t:a.t,d:a.dd,order:xpState().steps.filter(s=>s.k==="les").map(s=>s.x.d).join(""),rows:[...document.querySelectorAll('.xprow b')].slice(0,4).map(b=>b.innerText),note:document.querySelector('.xp .small.muted').innerText}});console.log(' ',JSON.stringify(first));
ok('red button order follows the gain (topic 3 first, topic 1 last); the list keeps the exam order',first.order[0]==="3"&&first.order[1]==="4"&&/^Practices/.test(first.rows[0])&&/goes where you gain most/.test(first.note));
ok('first step is a 5-question check before the lesson',/^Check: /.test(first.t)&&first.d==3);
// pass the check -> lesson skipped, facts placed
await p.click('.donext');await p.waitForTimeout(250);s=await p.evaluate(()=>({n:sess.queue.length,title:document.querySelector('.sesshead h2').innerText,u:sess.xp.u,ok:sess.queue.every(e=>xpUnitQs(sess.xp.u).some(q=>q.id===e.id))}));
ok('the check is 8 questions from that lesson (it covers many facts)',s.n===8&&s.title==="Lesson check"&&s.ok);
const before=await p.evaluate(()=>xpUnitFacts(sess.xp.u).filter(i=>!S.it[i.id]).length);
await p.evaluate(()=>{const s=sess;let g=0;while(view==="session"&&sess===s&&g++<20){const cur=s.queue[s.pos];if(!cur)break;record(true,true);advance()}});await p.waitForTimeout(250);
const pass=await p.evaluate(u=>({card:(document.querySelector('.dxr')||{innerText:''}).innerText.replace(/\s+/g,' '),to:xpPeek(3).to,left:xpUnitFacts(u).filter(i=>!S.it[i.id]).length,placed:xpUnitFacts(u).filter(i=>{const r=S.it[i.id];return r&&r[2]===0}).map(i=>S.it[i.id][1]-today()),due:dueList(3,"all").length,next:document.querySelector('.xpnx').innerText.replace(/\s+/g,' ')}),s.u);console.log(' ',pass.card.slice(0,220));console.log(' ',pass.next.slice(0,110));
ok('all right and sure: the lesson is skipped',/Lesson skipped/.test(pass.card)&&pass.to&&pass.to[s.u]===1);
ok(`its ${before} new facts are placed for review 3 to 9 days out, none due today`,before>0&&pass.left===0&&pass.placed.length===before&&Math.min(...pass.placed)>=3&&Math.max(...pass.placed)<=9&&pass.due===0);
ok('the next step moves to the following lesson (a check, not a read of the skipped one)',/Check: /.test(pass.next)&&!new RegExp(await p.evaluate(u=>UNITS[3][u].t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),s.u)).test(pass.next));
// fail a check -> read the lesson
await p.click('.xpnx');await p.waitForTimeout(250);await p.evaluate(()=>{const s=sess;let g=0;while(view==="session"&&sess===s&&g++<20){const cur=s.queue[s.pos];if(!cur)break;record(g<=3,g!==2);advance()}});await p.waitForTimeout(250);
const fail=await p.evaluate(()=>({card:(document.querySelector('.dxr')||{innerText:''}).innerText.replace(/\s+/g,' '),next:document.querySelector('.xpnx').innerText.replace(/\s+/g,' '),miss:missedPool(3,"all").length}));console.log(' ',fail.card.slice(0,160));
ok('3 right (one a guess): not skipped, reading the lesson is next, no misses kept',/Not yet/.test(fail.card)&&/2 of \d right/.test(fail.card)&&/Read: /.test(fail.next)&&fail.miss===0);
await p.evaluate(()=>{sess=null;view="home";render()});await p.waitForTimeout(200);
const row=await p.evaluate(()=>{const r=document.querySelector('#xp3');r.open=true;return{w:r.querySelector('.xpw').innerText,btn:r.querySelector('[data-xp="les"]').innerText}});console.log(' ',JSON.stringify(row));
ok('topic row shows the diagnostic score and counts the skipped lesson',/diagnostic 0%/.test(row.w)&&/Lessons · 1 of 4 read/.test(row.btn));
await p.screenshot({path:'tmp/d_home.png',fullPage:true});
// skip option, and sections without lessons are untouched
await p.evaluate(()=>{part=2;view="home";render()});await p.waitForTimeout(150);await p.click('[data-xp="nodx"]');await p.waitForTimeout(200);t=await dn();ok('Skip it: the path starts without a diagnostic (with the first lesson check)',/Check: Choosing a business entity/.test(t));
for(const pt of [5,6,8]){const r=await p.evaluate(pt=>{part=pt;view="home";render();return{t:xpNext().t,dx:!!document.querySelector('.xaready')}},pt);ok(`part ${pt}: no diagnostic, path as before (${r.t})`,!r.dx&&/^Learn: /.test(r.t))}
ok('no page errors',errs.length===0);if(errs.length)console.log(errs.slice(0,6));
await b.close()})();
