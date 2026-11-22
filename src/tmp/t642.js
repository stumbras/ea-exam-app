const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);await p.evaluate(()=>{S.set.pace="steady"});
const r=await p.evaluate(()=>{part=1;const T=today();
  // a learner: strong on topic 1 questions, weak on topic 3 questions, lots of flash-card reviews everywhere (which used to hide the weakness)
  const H={1:"1".repeat(30)+"C".repeat(14)+"B".repeat(14)+"c".repeat(2),2:"1".repeat(40)+"B".repeat(14)+"b".repeat(6),3:"1".repeat(44)+"b".repeat(10)+"B".repeat(4)+"c".repeat(2),4:"1".repeat(40)+"B".repeat(12)+"b".repeat(8),5:"1".repeat(40)+"B".repeat(15)+"b".repeat(5),6:"1".repeat(40)+"B".repeat(15)+"b".repeat(5)};
  domNorm(S);for(const d in H){S.dd["1-"+d]={acct:[60,H[d],Date.now()]};domJoin(S,"1-"+d)}
  const F=BANK.filter(i=>i.p==1&&i.t==="f"),Q=BANK.filter(i=>i.p==1&&i.t==="q");
  F.slice(0,300).forEach((i,k)=>{S.it[i.id]=[3,k<20?T:T+4,3,3,1,0]});            // 300 facts known, 20 due today
  Q.filter(i=>i.d==1).slice(0,40).forEach(i=>{S.it[i.id]=[3,T+5,1,1,1,0]});        // answered right recently, not due
  const missIds=Q.filter(i=>i.d==3).slice(0,6).map(i=>{S.it[i.id]=[0,T,1,0,0,0,1];return i.id});persist();
  const st=d=>{const s=domStats(1,d);return{mixed:Math.round(s.acc*100),q:Math.round(qAcc(s)*100)}};
  const out={stats:{1:st(1),3:st(3)},runs:[]};
  for(let k=0;k<25;k++){startSession("qd",10);const q=sess.queue.map(e=>BYID[e.id]);out.runs.push({n:q.length,miss:q.filter(i=>missIds.includes(i.id)).length,due:q.filter(i=>{const r=S.it[i.id];return i.t==="f"&&r&&r[1]<=T}).length,fresh:q.filter(i=>{const r=S.it[i.id];return i.t==="q"&&r&&r[4]===1&&r[1]>T}).length,
    d3:q.filter(i=>i.t==="q"&&i.d==3&&!missIds.includes(i.id)).length,d3hard:q.filter(i=>i.t==="q"&&i.d==3&&i.lv===3&&!missIds.includes(i.id)).length,d1:q.filter(i=>i.t==="q"&&i.d==1).length,calc:q.filter(i=>i.t==="g").length,newF:q.filter(i=>i.t==="f"&&!S.it[i.id]).length,ids:q.map(i=>i.id)});sess=null}
  // two drills in a row, everything answered right: no item repeats
  startSession("qd",10);const a=sess.queue.map(e=>e.id);{const s=sess;let g=0;while(view==="session"&&sess===s&&g++<60){const cur=s.queue[s.pos];if(!cur)break;s.cp=false;record(true,true);advance()}}
  startSession("qd",10);const b2=sess.queue.map(e=>e.id);out.overlap=a.filter(id=>b2.includes(id)&&BYID[id].t!=="g").length;sess=null;view="home";
  // smart session by minutes
  startSession("smart",20);out.smart={n:sess.queue.length,est:sess.queue.reduce((t,e)=>{const i=BYID[e.id];return t+(i.t==="g"?100:i.t==="f"?30:70)},0)/60};sess=null;view="home";render();return out});
console.log(' topic 1',JSON.stringify(r.stats[1]),'topic 3',JSON.stringify(r.stats[3]));
const avg=k=>r.runs.reduce((a,x)=>a+x[k],0)/r.runs.length;console.log(' per drill of 10: misses',avg('miss'),'due facts',avg('due'),'weak-topic qs',avg('d3'),'(hard',avg('d3hard')+')','strong-topic qs',avg('d1'),'calcs',avg('calc'),'new facts',avg('newF'),'already-right-not-due',avg('fresh'));
ok('flash-card reviews no longer hide a weak topic (mixed says fine, questions say weak)',r.stats[3].mixed>=65&&r.stats[3].q<50);
ok('every drill has 10 items',r.runs.every(x=>x.n===10));
ok('open exam-question misses are in every drill',avg('miss')<=3.5);
ok('no flash-card reviews in the quick drill (exam questions only)',avg('due')===0);
ok('the weak topic gets more questions than the strong one',avg('d3')>avg('d1')+1);
ok('questions from the weak topic stay at basic and medium level',avg('d3hard')<0.3);
ok('questions answered right and not yet due are left out',avg('fresh')===0);
ok('at least one calculation per drill',avg('calc')>=1&&avg('calc')<=3);
ok('two drills in a row, all answered right, share no question',r.overlap===0);
console.log(' smart 20 min:',JSON.stringify(r.smart));ok('a 20-minute smart session fills about 20 minutes',r.smart.est>=14&&r.smart.est<=24);
ok('no page errors',errs.length===0);if(errs.length)console.log(errs);
await b.close()})();
