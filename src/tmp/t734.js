// Parts 2 and 3 gap questions: valid, flagged, and usable in Quick 10 and readiness
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);await p.evaluate(()=>{localStorage.clear()});await p.reload();await p.waitForTimeout(1500);
for(const pt of [2,3]){const r=await p.evaluate(pt=>{part=pt;const X=BANK.filter(i=>i.p===pt&&i.gp),S1=X.filter(i=>i.story),ids=BANK.map(i=>i.id);
  const strict=X.filter(i=>i.opts[0].length>Math.max(...i.opts.slice(1).map(o=>o.length))).length;
  const good=X.every(i=>i.t==="q"&&i.opts.length===4&&new Set(i.opts).size===4&&i.ex&&i.ex.length>60&&xaExam(i)&&PARTS[pt].doms[i.d]);
  view="home";render();clearInterval(timerId);sess=null;startSession("qd",10);const q=sess.queue.map(e=>BYID[e.id]);const A=xaAll();
  const res={n:X.length,stories:S1.length,good,dup:ids.length-new Set(ids).size,strict,maxGap:X.length?Math.max(...X.map(i=>i.opts[0].length-Math.max(...i.opts.slice(1).map(o=>o.length)))):0,q:q.length,qExam:q.every(i=>i.t==="g"||xaExam(i)),ready:typeof A.p,note:sess.note};clearInterval(timerId);sess=null;view="home";render();return res},pt);
  console.log(' ',JSON.stringify(r));
  if(!r.n){console.log('  part',pt,'has no gap questions yet');continue}
  ok(`Part ${pt}: ${r.n} gap questions (${r.stories} long stories), four different choices, explanation, valid topic, no id clashes`,r.good&&r.dup===0);
  ok(`Part ${pt}: the right answer is strictly the longest in ${r.strict} of ${r.n}, largest gap ${r.maxGap}`,r.strict<=0.3*r.n&&r.maxGap<=14);
  ok(`Part ${pt}: Quick 10 still builds ten exam-type questions and readiness computes (${r.note})`,r.q===10&&r.qExam)}
ok('no page errors',errs.length===0);if(errs.length)console.log(errs);await b.close()})();
