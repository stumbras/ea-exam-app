const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);await p.evaluate(()=>{S.set.pace="steady"});
const dn=()=>p.evaluate(()=>{const d=document.querySelector('.donext');return d?d.innerText.replace(/\s+/g,' '):''});
for(const pt of [1,2,3,5,6,7,8]){await p.evaluate(pt=>{part=pt;sess=null;view="home";render();scrollTo(0,0)},pt);await p.waitForTimeout(200);
 const r=await p.evaluate(()=>({h:document.documentElement.scrollHeight,rows:document.querySelectorAll('.xp details.xprow').length,steps:xpState().steps.length,doms:Object.keys(PARTS[part].doms).length,tools:!!document.querySelector('#xptools'),y:Math.round(document.querySelector('.xp').getBoundingClientRect().top),sw:document.documentElement.scrollWidth}));
 console.log(` part ${pt}: height ${r.h}, ${r.rows} topics, ${r.steps} steps, path at y=${r.y} | ${(await dn()).slice(0,110)}`);
 ok(`part ${pt} shows the path with one row per topic, tools folded, no sideways scroll`,r.rows===r.doms&&r.tools&&r.sw<=392&&(pt===8||pt===7||(r.h<2800&&r.y<(pt<=3?960:570))))}
await p.evaluate(()=>{part=4;view="home";render()});await p.waitForTimeout(200);ok('course section is unchanged (no exam path)',await p.evaluate(()=>!document.querySelector('.xp')));
// ---- walk the path in Part 1 ----
await p.evaluate(()=>{part=1;Object.keys(PARTS[1].doms).forEach(d=>{xpMem(d,1).ld=1});S.set.xp.nodx1=1;S.set.xpv=2;/* a learner from before lessons joined the path: t641 covers the lesson steps */view="home";render()});await p.waitForTimeout(200);await p.screenshot({path:'tmp/x_home0.png',fullPage:true});
let t=await dn();ok('new learner starts with Step 1: Learn the first topic (not exam questions)',/Step \d+ of \d+ · Learn: Preliminary/.test(t));
await p.click('.donext');await p.waitForTimeout(300);
let s=await p.evaluate(()=>({view,mode:sess&&sess.mode,doms:[...new Set(sess.queue.map(q=>BYID[q.id].d))],learn:sess.queue.filter(q=>q.learn).length,n:sess.queue.length,filt}));console.log('  learn session',JSON.stringify(s));
ok('it opens a teaching session with facts from topic 1 only, and the domain filter is restored',s.view==="session"&&s.mode==="easy"&&s.doms.length===1&&s.doms[0]==1&&s.learn>=1&&s.filt==="all");
// mark topic 1 facts as met
await p.evaluate(()=>{sess=null;const t=today();BANK.filter(i=>i.p==1&&i.d==1&&i.t==="f").forEach(i=>{S.it[i.id]=[2,t+3,1,1,1,0,0]});view="home";render()});await p.waitForTimeout(200);
t=await dn();ok('after the facts: Step 2 Practice the same topic',/Step \d+ of \d+ · Practice: Preliminary/.test(t));
await p.click('.donext');await p.waitForTimeout(300);s=await p.evaluate(()=>({mode:sess&&sess.mode,kinds:[...new Set(sess.queue.map(q=>BYID[q.id].t+BYID[q.id].d))]}));ok('practice session is questions from topic 1: '+JSON.stringify(s),s.mode==="quiz"&&s.kinds.length===1&&s.kinds[0]==="q1");
await p.evaluate(()=>{sess=null;const t=today();BANK.filter(i=>i.p==1&&i.d==1&&i.t==="q").slice(0,32).forEach(i=>{S.it[i.id]=[2,t+3,1,1,1,0,0]});S.dom["1-1"]="1".repeat(20)+"B".repeat(14)+"b".repeat(4);view="home";render()});await p.waitForTimeout(200);
t=await dn();console.log('  ',t.slice(0,90));ok('topic 1 practiced: Step 3 Learn topic 2',/Step \d+ of \d+ · Learn: Income/.test(t));
ok('path row shows Learn and Practice ticked for topic 1',await p.evaluate(()=>document.querySelectorAll('#xp1 .xpc.on').length===3&&!!document.querySelector('#xp2.now')));
// daily jobs first
await p.evaluate(()=>{const t=today();BANK.filter(i=>i.p==1&&i.d==1&&i.t==="f").slice(0,30).forEach(i=>{S.it[i.id][1]=t-1});view="home";render()});await p.waitForTimeout(200);t=await dn();ok('30 reviews due: "do this first today"',/DO THIS FIRST TODAY Review 30 facts/.test(t));
await p.evaluate(()=>{const t=today();BANK.filter(i=>i.p==1&&i.d==1&&i.t==="f").forEach(i=>{S.it[i.id][1]=t+3});BANK.filter(i=>i.p==1&&i.d==2&&i.t==="q").slice(0,9).forEach(i=>{S.it[i.id]=[0,t,1,0,0,0,1]});view="home";render()});await p.waitForTimeout(200);t=await dn();ok('9 open misses: fix them first',/DO THIS FIRST TODAY Fix your 9 misses/.test(t));
// all topics learned and practiced -> exam pack -> mock -> strong
await p.evaluate(()=>{const t=today();BANK.filter(i=>i.p==1).forEach(i=>{if(i.t==="f"||!i.xs)S.it[i.id]=[2,t+3,1,1,1,0,0]});Object.keys(PARTS[1].doms).forEach(d=>S.dom["1-"+d]="1".repeat(20)+"B".repeat(15)+"b".repeat(4));view="home";render()});await p.waitForTimeout(200);
t=await dn();console.log('  ',t.slice(0,100));ok('all topics practiced: next is the exam-style pack',/Exam-style pack/.test(t));
await p.evaluate(()=>{const t=today();BANK.filter(i=>i.p==1&&i.xs).forEach(i=>{S.it[i.id]=[2,t+3,1,1,1,0,0]});view="home";render()});await p.waitForTimeout(200);t=await dn();ok('then the mock exam',/Take a mock exam · 25 questions/.test(t));
await p.click('.donext');await p.waitForTimeout(300);s=await p.evaluate(()=>({mode:sess&&sess.mode,n:sess&&sess.queue.length}));ok('the button starts a 25-question mock: '+JSON.stringify(s),s.mode==="mock"&&s.n===25);
await p.evaluate(()=>{sess=null;S.hist.push({t:Date.now(),p:1,m:"mock",n:25,c:19});view="home";render()});await p.waitForTimeout(200);t=await dn();console.log('  ',t.slice(0,110));ok('after the mock: make a topic strong',/Make it strong:/.test(t));
await p.evaluate(()=>{Object.keys(PARTS[1].doms).forEach(d=>S.dom["1-"+d]="B".repeat(40));view="home";render()});await p.waitForTimeout(200);t=await dn();ok('everything done: keep it sharp',/Keep it sharp/.test(t)&&await p.evaluate(()=>xpState().done===xpState().steps.length));
await p.screenshot({path:'tmp/x_done.png',fullPage:true});
// override: open a topic and start hard questions
await p.click('#xp3>summary');await p.waitForTimeout(150);await p.click('#xp3 [data-xp="hard"]');await p.waitForTimeout(300);s=await p.evaluate(()=>({mode:sess&&sess.mode,d:[...new Set(sess.queue.map(q=>BYID[q.id].d))]}));ok('any topic can be opened out of turn: '+JSON.stringify(s),s.mode==="hard"&&s.d.length===1&&s.d[0]==3);
await p.click('.bkback.go');await p.waitForTimeout(200);ok('the topic stays open after coming back',await p.evaluate(()=>document.querySelector('#xp3').open));
await p.click('#xptools>summary');await p.waitForTimeout(150);ok('practice tools open with quick drill and decisions inside',await p.evaluate(()=>!!document.querySelector('#xptools [data-qd]')&&!!document.querySelector('#xptools [data-tdrgo]')));
// ---- mock balance ----
const mb=await p.evaluate(()=>{const out={};for(const pt of [1,3,8]){part=pt;let cu=0,n=0,sc=0;for(let k=0;k<25;k++){startSession("mock",pt===8?25:50);sess.queue.forEach(e=>{const i=BYID[e.id];n++;if(lenCue(i))cu++;const l=i.opts.map(x=>String(x).length),m=Math.max(...l);if(l[i.ans]===m)sc+=1/l.filter(x=>x===m).length});clearInterval(timerId);sess=null}
  const all=BANK.filter(i=>i.p==pt&&i.t==="q");out[pt]={bankCued:Math.round(all.filter(lenCue).length/all.length*100),mockCued:Math.round(cu/n*100),pickLongestOnMock:Math.round(sc/n*100)}}view="home";return out});
console.log('  mock balance',JSON.stringify(mb));ok('mock exams: "pick the longest" now scores near chance',mb[1].pickLongestOnMock<=37&&mb[3].pickLongestOnMock<=37);
// course map from the study app has a way back
await p.evaluate(()=>{part=4;sess=null;view="bkland";render()});await p.waitForTimeout(300);ok('course map opened from the study app has a Back button',await p.evaluate(()=>!!document.querySelector('.bkback')));
console.log('errors',errs);await b.close()})();
