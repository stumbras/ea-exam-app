const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,150)));
await p.goto('http://localhost:8765/ea-exam-app/?gap='+(process.argv[4]||0));await p.waitForTimeout(1200);
const PT=+(process.argv[2]||1),ACC=+(process.argv[3]||0.7);
console.log('GENS by part',await p.evaluate(()=>{const o={};GENS.forEach(g=>o[g.p]=(o[g.p]||0)+1);return JSON.stringify(o)}));
// ---- Smart drill x8
const r=await p.evaluate(({PT,ACC})=>{part=PT;view="home";const out=[];const seen={};let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 for(let d=0;d<8;d++){startSession("qd",10);const ids=[];let guard=0;while(sess&&guard++<60){const cur=sess.queue[sess.pos];if(!cur)break;const it=BYID[cur.id];ids.push(cur.id);sess.qstart=Date.now()-12000;record(rnd()<ACC,true);sess.pos++;sess.phase="ask";if(sess.pos>=sess.queue.length){finish();break}}
  const uniq=[...new Set(ids)];const rep=uniq.filter(i=>seen[i]);uniq.forEach(i=>seen[i]=(seen[i]||0)+1);out.push({n:ids.length,uniq:uniq.length,seenBefore:rep.length,gens:uniq.filter(i=>BYID[i].t==="g").length,repGens:rep.filter(i=>BYID[i].t==="g").length,repWrongLast:rep.filter(i=>0).length});sess=null;view="home"}
 const top=Object.entries(seen).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([i,n])=>n+"x "+BYID[i].t+" "+(BYID[i].q||BYID[i].f||BYID[i].n||i).toString().slice(0,50));
 return{out,top,total:Object.keys(seen).length}},{PT,ACC});
console.log('SMART DRILL part',PT,'acc',ACC);r.out.forEach((o,i)=>console.log(' drill',i+1,JSON.stringify(o)));console.log(' distinct',r.total,'\n '+r.top.join('\n '));
// ---- Smart review (quick decisions)
const r2=await p.evaluate(({PT,ACC})=>{part=PT;let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};const ks=drillKeys().slice(0,3);const out=[];
 // first run 3 drills once
 ks.forEach(k=>{const ord=drSmartOrder(k);ord.forEach(([dk,qi])=>dqMark(dk,qi,rnd()<ACC))});
 const cnt={};const GAP=+(new URLSearchParams(location.search).get("gap")||0);for(let round=0;round<8;round++){if(round&&GAP){const Q=DQ();for(const id in Q)Q[id].t-=GAP*6e4}const set=drReviewSet(12);const due=drDueCount();const ord=set.slice();const redo={};let asked=0;for(let i=0;i<ord.length;i++){const [dk,qi]=ord[i],id=dk+"#"+qi;cnt[id]=(cnt[id]||0)+1;asked++;const ok=rnd()<ACC;dqMark(dk,qi,ok);if(!ok&&!redo[id]){redo[id]=1;ord.push([dk,qi])}}
  out.push({due,set:set.length,asked,dueAfter:drDueCount(),cool:JSON.stringify(drCool())})}
 const pool=ks.reduce((n,k)=>n+DRILL[k].q.length,0);const dist=Object.values(cnt).sort((a,b)=>b-a);return{pool,out,max:dist[0],over3:dist.filter(x=>x>=4).length,asked:dist.reduce((a,b)=>a+b,0),distinct:dist.length}},{PT,ACC});
console.log('SMART REVIEW pool',r2.pool,'8 rounds back to back');r2.out.forEach((o,i)=>console.log(' round',i+1,JSON.stringify(o)));console.log(' asked',r2.asked,'distinct',r2.distinct,'max repeats of one question',r2.max,'questions asked 4+ times',r2.over3);
console.log('errors',errs);await b.close()})();
