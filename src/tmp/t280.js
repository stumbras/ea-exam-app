const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
for(const pp of [1,2,3]){
 const r=await p.evaluate(pp=>{part=pp;const out=[];const seen={};for(let k=0;k<3;k++){startSession("qd",10);const q=sess.queue.map(e=>BANK.find(i=>i.id===e.id)||{gen:1,id:e.id});
  const ids=q.map(i=>i&&i.id);ids.forEach(id=>seen[id]=(seen[id]||0)+1);
  // simulate answering all correct
  q.forEach(i=>{if(i&&i.id&&typeof grade==="function"){}});
  out.push(q.map(i=>i?(i.t==="f"?"F":i.gen||i.g||!i.id?"G":"L"+(i.lv||1)):"?").join(""))}
  return out.join(" / ")+"  keys:"+Object.keys(sess.queue[0]).join(",")},pp);
 console.log("P"+pp,r)}
console.log('errors',JSON.stringify(errs));await b.close()})();
