const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);await p.evaluate(()=>{S.set.pace="steady"});
// ---- ask first ----
let r=await p.evaluate(()=>{part=1;S.set.xp={nodx1:1};const m=xpMem(1);m.pc={0:3};S.set.les={"u1-0":UNITS[1][0].s.length-1};persist();view="home";render();const a=xpNext();return{t:a.t,ure:a.ure}});
ok('lesson read, check was 3 of 8 or 5 right: next is Learn for that lesson',/^Learn: Taxpayer data/.test(r.t));
r=await p.evaluate(()=>({knows:xaKnows(1,0),N:xpCheckN(0)}));console.log(' ',JSON.stringify(r));
await p.evaluate(()=>{const m=xpMem(1);m.pc[0]=xpCheckN(0)-2;persist();view="home";render()});await p.click('.donext');await p.waitForTimeout(250);
r=await p.evaluate(()=>({title:document.querySelector('.sesshead h2').innerText,note:(document.querySelector('.xanote')||{innerText:''}).innerText,pre:sess.queue.filter(e=>e.pre).length,learn:sess.queue.filter(e=>e.learn).length,n:sess.queue.length,y:sess.queue.map(e=>xaYield()[e.id]||0)}));console.log(' ',JSON.stringify(r));
ok('with half the check right, new facts are asked first: 12 questions, no teaching cards',r.title==="Learn · asked first"&&r.pre===12&&r.learn===0&&/asked before they are taught/.test(r.note));
ok('facts that more questions lean on come first',r.y[0]>=r.y[11]&&r.y[0]>=3);
// first fact: right and sure -> done in one answer
r=await p.evaluate(()=>{const id=sess.queue[0].id;record(true,true);const rec=S.it[id];const again=sess.queue.slice(1).filter(e=>e.id===id).length;advance();return{box:rec&&rec[0],again}});
ok('right and sure: the fact is recorded and not asked again this sitting',r.box>=1&&r.again===0);
// second fact: wrong -> no trace, comes back twice
r=await p.evaluate(()=>{const id=sess.queue[sess.pos].id,d=BYID[id].d,h0=S.dom["1-"+d]||"",nw0=S.day.nw;record(false,true);const out={rec:S.it[id]===undefined,hist:(S.dom["1-"+d]||"")===h0,nw:S.day.nw===nw0,again:sess.queue.slice(sess.pos+1).filter(e=>e.id===id).length,miss:missedPool(1,"all").length,shown:document.querySelector('.explain')?document.querySelector('.explain').innerText.slice(0,60):''};advance();return out});console.log(' ',JSON.stringify(r));
ok('wrong on a first sight: nothing is recorded against you, the fact is shown, and it comes back twice',r.rec&&r.hist&&r.nw&&r.again===2&&r.miss===0&&r.shown.length>10);
// keep answering right: after the batch, more facts are added
r=await p.evaluate(()=>{const s=sess;let g=0;const n0=s.newIds.length;while(view==="session"&&sess===s&&g++<200){const cur=s.queue[s.pos];if(!cur)break;s.cp=false;if(cur.learn){advance();continue}record(true,true);if(s.newIds.length>n0&&!s.seenAdd){s.seenAdd={note:s.note,added:s.newIds.length-n0}}advance()}return{view,add:s.seenAdd,done:s.done,total:s.newIds.length}});console.log(' ',JSON.stringify(r));
ok('a high hit rate brings 6 more facts into the same sitting, then 6 more (12 at most)',r.add&&r.add.added===6&&r.total===24&&r.view==="results");
// four wrong in a row -> switch to teach first
r=await p.evaluate(()=>{sess=null;view="home";render();document.querySelector('.donext').click();const s=sess;const t0=s.title;let k=0;while(k<4){const cur=s.queue[s.pos];if(cur.learn){advance();continue}record(false,true);advance();k++}return{t0,note:s.note,pre:s.queue.slice(s.pos).filter(e=>e.pre).length,learnAhead:s.queue.slice(s.pos).filter(e=>e.learn).length,rec:missedPool(1,"all").length}});console.log(' ',JSON.stringify(r));
ok('four first-sight misses in a row: the rest are shown first, then asked',/asked first/.test(r.t0)&&r.pre===0&&r.learnAhead>=2&&/shown first/.test(r.note)&&r.rec===0);
// ---- estimate, order, diagnosis page ----
r=await p.evaluate(()=>{sess=null;part=3;S.set.xp={nodx3:1};const T=today();const seed=(d,acc,n)=>{BANK.filter(i=>i.p==3&&i.d==d&&i.t==="q").slice(0,n).forEach((i,k)=>{const okk=(k%10)<Math.round(acc*10)?1:0;S.it[i.id]=[okk?2:0,T+2,1,okk,okk,okk?0:(k%3===0?1:0),okk?0:1,Date.now()]})};
  seed(1,0.9,40);seed(2,0.7,40);seed(3,0.4,40);seed(4,0.6,30);S.cal=[60,45,30,12];S.tm={"3-hard":[20,1900]};persist();view="home";render();const A=xaAll();
  return{p:A.p,se:A.se,verdict:A.verdict,top:A.top&&A.top.d,D:A.D.map(x=>[x.d,Math.round(x.p*100),x.n]),line:document.querySelector('.xaready').innerText.replace(/\s+/g,' '),order:xpState().steps.filter(s=>s.k==="prac").map(s=>s.x.d).join(""),cur:S.set.xp.cur3,note:document.querySelector('.xp .small.muted').innerText}});console.log(' ',JSON.stringify(r));
ok('predicted score per topic follows the answers (about 90 / 70 / 40 / 60)',r.D[0][1]>=76&&r.D[0][1]<=92&&r.D[1][1]>=58&&r.D[1][1]<=72&&r.D[2][1]>=30&&r.D[2][1]<=44&&r.D[3][1]>=48&&r.D[3][1]<=64&&r.D[0][1]>r.D[1][1]&&r.D[1][1]>r.D[3][1]&&r.D[3][1]>r.D[2][1]);
ok('overall estimate is weighted by exam share, with a verdict',r.p>0.52&&r.p<0.72&&r.se<0.06&&(r.verdict==="notyet"||r.verdict==="close"));
ok('main page shows one line: predicted score and the biggest gain',/\d+% predicted score ± \d+ aim for 75% or more .* biggest gain: Specific areas of representation/.test(r.line));
ok('without a diagnostic the red button still goes by live gain, topic 3 first, topic 1 last',r.order[0]==="3"&&r.order[3]==="1"&&r.cur==3&&/gain most/.test(r.note));
// hysteresis: topic 2 becomes worse on paper, but topic 3 is still open -> stays
r=await p.evaluate(()=>{const T=today();BANK.filter(i=>i.p==3&&i.d==2&&i.t==="q").slice(0,40).forEach(i=>{S.it[i.id]=[0,T,2,0,0,0,2,Date.now()]});persist();const st=xpState();return{first:st.steps.filter(s=>s.k==="prac")[0].x.d,gain:xaAll().top.d}});
ok('a topic that has been started is finished before the button moves on, even if another now ranks higher',r.first==3&&r.gain==2);
await p.evaluate(()=>{view="home";render()});await p.click('.xaready');await p.waitForTimeout(250);
r=await p.evaluate(()=>({view,txt:document.querySelector('#view').innerText.replace(/\s+/g,' '),cards:document.querySelectorAll('.xad').length,btn:[...document.querySelectorAll('[data-xa]')].map(b=>b.dataset.xa+(b.dataset.c?":"+b.dataset.c:"")),sw:document.documentElement.scrollWidth,back:!!document.querySelector('.bkback'),h:document.documentElement.scrollHeight}));console.log(' ',r.txt.slice(0,700));console.log(' ',JSON.stringify(r.btn),r.h);
ok('Diagnosis page: predicted score, topics by gain, weak lessons, why you miss, confidence and pace',r.view==="xadiag"&&/Predicted score/.test(r.txt)&&/Topics, biggest gain first/.test(r.txt)&&/Why you miss/.test(r.txt)&&/When you say Sure you are right 75%/.test(r.txt)&&/about 95 seconds each/.test(r.txt)&&r.sw<=392&&r.back);
ok('it lists sure-but-wrong items and offers drills',/Sure but wrong/.test(r.txt)&&r.btn.includes("conf")&&r.btn.includes("dx"));
await p.screenshot({path:'tmp/a_diag.png',fullPage:true});
if(r.btn.some(x=>x.startsWith("cat:"))){await p.click('[data-xa="cat"]');await p.waitForTimeout(250);r=await p.evaluate(()=>({n:sess&&sess.queue.length,title:document.querySelector('.sesshead h2').innerText}));ok('a type drill starts 10 questions of that type: '+r.title,r.n===10&&/^Drill: /.test(r.title));await p.evaluate(()=>{clearInterval(timerId);sess=null;view="xadiag";render()})}
{await p.click('[data-xa="quiz"]');await p.waitForTimeout(250);ok('weak lesson quiz starts',await p.evaluate(()=>sess&&sess.mode==="unit"&&sess.queue.length===10));await p.evaluate(()=>{sess=null;view="home";render()})}
// ---- look-alikes after fixing misses ----
r=await p.evaluate(()=>{sess=null;view="home";render();const a=xpNext();xpRun(a);return{t:a.t,mode:sess&&sess.mode,note:sess&&sess.note,n:sess&&sess.queue.length,newq:sess?sess.queue.filter(e=>!S.it[e.id]).length:0}});console.log(' ',JSON.stringify(r));
ok('fixing misses ends with up to 4 new look-alike questions',/Fix your \d+ misses/.test(r.t)&&r.mode==="missed"&&r.newq>=1&&r.newq<=4&&/look-alike/.test(r.note));
// ---- other sections untouched ----
for(const pt of [5,6,8,7]){const q=await p.evaluate(pt=>{sess=null;part=pt;view="home";render();return{dx:!!document.querySelector('.xaready'),dn:!!document.querySelector('.donext')}},pt);ok(`part ${pt}: no diagnosis line, page builds`,!q.dx&&q.dn)}
ok('no page errors',errs.length===0);if(errs.length)console.log(errs.slice(0,6));
await b.close()})();
