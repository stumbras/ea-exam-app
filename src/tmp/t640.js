// Simulated learners follow the red button on EA Parts 1-3. Logs what is suggested and what each session contains.
const {chromium}=require('playwright');
const PROF={weak:{base:.52},mid:{base:.72},strong:{base:.9}};
(async()=>{const b=await chromium.launch();const which=process.argv[2]||"mid",PT=+(process.argv[3]||1),SESS=+(process.argv[4]||120);
const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const out=await p.evaluate(({base,PT,SESS})=>{
  let off=0;const t0=today();today=()=>t0+off;const D0=Date.now.bind(Date);Date.now=()=>D0()+off*864e5;let seed=7;Math.random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
  part=PT;view="home";render();const doms=Object.keys(PARTS[PT].doms);const skill={};doms.forEach((d,k)=>skill[d]=Math.max(.3,Math.min(.97,base+[.1,0,-.12,-.18,.05,-.05][k%6])));
  const pOK=it=>{const r=S.it[it.id];let pr=skill[it.d]+(it.t==="f"?.12:it.lv===1?.08:it.lv===3?-.12:0)+(it.t==="g"?-.1:0);if(r)pr+=Math.min(.2,.07*r[2]);return Math.max(.15,Math.min(.98,pr))};
  const log=[],flags=[];let lastT=null,rep=0;
  for(let n=0;n<SESS;n++){view="home";sess=null;render();const dn=document.querySelector('.donext');if(!dn){flags.push("no red button at "+n);break}
    const a=xpNext();const title=(a.first?"FIRST ":"")+a.t.replace(/\d+/g,"#");if(title===lastT)rep++;else{rep=0;lastT=title}
    if(rep===12)flags.push(`stuck: "${a.t}" suggested 13 times in a row (session ${n})`);
    const before=xpState().done;dn.click();
    let rec={n,day:off,t:a.t,view};
    if(view==="lessons"&&les&&les.unit!=null){let g=0;while(view==="lessons"&&les&&les.unit!=null&&g++<40)lesGo(1);rec.kind="lesson"}
    else if(view==="session"&&sess){const s=sess;rec.mode=s.mode;const comp={f:0,q:0,g:0,lv:{1:0,2:0,3:0},d:{},seenOK:0,miss:0,due:0,nw:0};const T=today();
      s.queue.forEach(e=>{if(e.learn)return;const it=BYID[e.id],r=S.it[it.id];comp[it.t]++;comp.lv[itemLv(it)]++;comp.d[it.d]=(comp.d[it.d]||0)+1;if(!r)comp.nw++;else if(r[4]===0)comp.miss++;else if(r[1]<=T)comp.due++;else comp.seenOK++});rec.comp=comp;rec.size=s.queue.filter(e=>!e.learn).length;
      if(s.mode==="mock"){s.queue.forEach((cur,k)=>{const it=BYID[cur.id],V=view4(cur,it);const ok=Math.random()<pOK(it);s.answers[k]=ok?V.ans:(V.order||[0,1,2,3]).find(x=>x!==V.ans)});finishMock()}
      else{let g=0;while(view==="session"&&sess===s&&g++<400){const cur=s.queue[s.pos];if(!cur){finish();break}if(s.cp){s.cp=false}if(cur.learn){advance();continue}const it=BYID[cur.id];record(Math.random()<pOK(it),true);advance()}}
      rec.done=s.done;rec.c=s.correct}
    else{rec.kind="other:"+view;flags.push(`red button led to view "${view}" with no session (session ${n}: ${a.t})`)}
    rec.steps=xpState().done+"/"+xpState().steps.length;log.push(rec);
    if(n%3===2)off++}
  const st=xpState();return{skill,log,flags,final:{done:st.done,steps:st.steps.length,ready:partStats(PT).ready,doms:st.D.map(x=>({d:x.d,acc:x.acc==null?null:Math.round(x.acc*100),learned:x.learned,practiced:x.practiced,strong:x.strong,fs:x.fs+"/"+x.f,qs:x.qs+"/"+x.q}))}}
},{base:PROF[which].base,PT,SESS});
console.log('PROFILE',which,'PART',PT,'skill',JSON.stringify(out.skill));
// compress the suggestion sequence
let prev=null,cnt=0,lines=[];const flush=()=>{if(prev)lines.push(`${String(cnt).padStart(3)}x ${prev}`)};
for(const r of out.log){const k=r.t.replace(/\d+ of \d+|\d+/g,"#")+(r.mode?` [${r.mode}]`:r.kind?` [${r.kind}]`:"");if(k===prev)cnt++;else{flush();prev=k;cnt=1}}flush();
console.log(lines.join('\n'));
const S2=out.log.filter(r=>r.comp);const agg={};S2.forEach(r=>{const m=r.mode;agg[m]=agg[m]||{n:0,size:0,c:0,done:0,seenOK:0,miss:0,due:0,nw:0,lv3:0,q:0};const a=agg[m];a.n++;a.size+=r.size;a.c+=r.c;a.done+=r.done;a.seenOK+=r.comp.seenOK;a.miss+=r.comp.miss;a.due+=r.comp.due;a.nw+=r.comp.nw;a.lv3+=r.comp.lv[3];a.q+=r.comp.q});
for(const m in agg){const a=agg[m];console.log(`mode ${m}: ${a.n} sessions, avg size ${(a.size/a.n).toFixed(1)}, right ${Math.round(a.c/a.done*100)}%, new ${Math.round(a.nw/a.size*100)}% miss ${Math.round(a.miss/a.size*100)}% due ${Math.round(a.due/a.size*100)}% already-right-not-due ${Math.round(a.seenOK/a.size*100)}% hard ${Math.round(a.lv3/a.size*100)}%`)}
console.log('FINAL',JSON.stringify(out.final));console.log('FLAGS',JSON.stringify(out.flags));console.log('ERRS',JSON.stringify(errs.slice(0,5)));
await b.close()})();
