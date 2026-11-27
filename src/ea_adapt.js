/* ================= Adaptive study for EA Parts 1 to 3 (Version 167) =================
   Aim: the fewest study hours to a passing score. Everything here uses only the learner's own answers.
   1. Predicted score. Per topic: every exam question seen counts once, as the average of "share of times right" and
      "right the last time", harder questions weighing more; mock answers count twice; diagnostic and lesson-check misses
      that were not kept as misses are still counted here. Topics are combined by their exam weights, with a range.
      It is an estimate, and repeated questions flatter it a little: the page says so.
   2. The red button follows the live estimate: exam weight x what is missing, re-ranked as answers come in. A topic that
      has been started is finished (lessons, facts, practice) before the button moves to another, so it does not jump about.
   3. Ask first. In a lesson where the check showed some knowledge (half or more right), new facts are asked before they
      are taught. Right and sure: done in one answer. Wrong: it costs nothing (no miss is recorded), the fact is shown and
      asked again a few questions later and once more at the end. Four wrong in a row switches to teach-first; a 75% hit
      rate brings up to 12 more facts in the same sitting.
   4. High-yield first. Inside a lesson, facts that many bank questions lean on are taught before the rest.
   5. Diagnosis page: predicted score, topics by gain, weakest lessons, and why answers are missed (EXCEPT/NOT questions,
      numbers and limits, deadlines, forms, long scenarios, hard questions, calculations, sure-but-wrong), each with a drill.
   6. Fixing misses ends with look-alike questions from the same lessons, to test the idea and not the memory of an answer.
   Nothing here changes saved answers, boxes or review dates of existing items. */
const XAW={1:1,2:2,3:3};
/* ---------- 1. estimate ---------- */
/* Readiness, rebuilt in Version 169 after it rose on a session with mistakes. The old figure gave a missed question
   three-quarters credit the moment it was answered right once, so re-drilling misses pushed it up, and a topic with no
   answers yet was simply left out. Now:
   - Each exam question counts by your FIRST try. Right every time so far: full credit. Ever missed: no credit, until it
     has been answered right on later review days (box 3 or higher), then 30%. Harder questions weigh more.
   - A topic with few answers is pulled toward the average of your topics (worth about 4 medium questions), and a topic
     with none sits at that average, so starting a topic cannot move the figure by itself.
   A wrong answer can only lower the figure or leave it where it is. tmp/t654.js checks that on 6,000 random answers. */
/* Version 170, "count all, but think": every question still counts. Three cautions were added, each of which can only
   take credit away, so the rule that a wrong answer never raises the figure still holds (tmp/t654.js):
   - a right answer on a question whose right choice is the longest of the four carries 85% of the usual weight, because
     length alone helps there (Version 171: as weight, not as a lower mark, so a right answer can never pull a topic down);
   - a topic is pulled toward 85% of your average, not the full average, so thin or missing data counts a little against you;
   - the card and the Diagnosis page say what the figure rests on, and compare it with your mocks. */
const XACUE=0.85,XATHIN=0.85;
function xaCredit(r){return r[3]===r[2]?1:(r[4]&&r[0]>=3?0.3:0)}
function xaRaw(d){let w=0,g=0,n=0;for(const i of BANK){if(i.p!=part||i.t!=="q"||i.d!=d)continue;const r=S.it[i.id];if(!r||!r[2])continue;const k=XAW[i.lv||2],c=xaCredit(r),cue=c>0&&lenCue(i)?XACUE:1;g+=k*c*cue;w+=k*c*cue+k*(1-c);n++} /* the right part of a length-cued question carries 85% of the weight, so it still can only pull the figure up */
  const m=xpPeek(d);if(m.fn){w+=m.fw||0;n+=m.fn}return{g,wt:w,n,raw:w?g/w:null}}
const XAC={k:null,v:null};
const xaPersist0=persist;persist=function(){XAC.k=null;return xaPersist0.apply(this,arguments)};
function xaAll(){if(XAC.k===part&&XAC.v)return XAC.v;const v=xaAll1();XAC.k=part;XAC.v=v;return v}
function XCOV(d){let t=0,n=0;for(const i of BANK){if(i.p==part&&String(i.d)===String(d)&&xaExam(i)){t++;if(S.it[i.id]&&S.it[i.id][2])n++}}return t?n/t:0}
function xaAll1(){const D=Object.keys(PARTS[part].doms).map(d=>Object.assign({d,name:PARTS[part].doms[d][0],w:PARTS[part].doms[d][1]},xaRaw(d)));let W=0,G=0,n=0,T=0;
  D.forEach(x=>{T+=x.w;n+=x.n;if(x.n){W+=x.w;G+=x.w*x.raw}});const prior=W?G/W:null;let P=0,V=0;
  D.forEach(x=>{if(prior==null){x.p=null;x.se=null;x.gain=null;return}x.p=(x.g+8*XATHIN*prior)/(x.wt+8);
    /* Version 183, asked for: "readiness score must weight if some topics not touched, learned yet". The topic figure is now a forecast
       for the whole topic: the share of its exam questions already answered counts at the measured rate, the share never seen counts
       at 75% of it (seen questions come from the units already studied, so the rest is likely weaker). A topic not started counts at
       65% of the 85% already applied, about 55% of the average. Every new question answered raises cover. */
    x.cov=XCOV(x.d);x.p=x.p*(x.n?0.75+0.25*x.cov:0.65);x.se=Math.sqrt(Math.max(.02,x.p*(1-x.p))/(x.n+4));x.gain=x.w*(1-x.p);x.nodata=!x.n;P+=x.w*x.p;V+=x.w*x.w*x.se*x.se});
  /* Version 181, reported: "readiness at 60 percent but i fail all these" (long story questions on an outside set). A quarter of the
     figure now rests on the long story questions, first try. Unanswered ones are assumed at 60% of the rest (8 phantom answers), so
     the figure starts 10% lower and moves with real story results. A right answer can still only raise it and a wrong one lower it. */
  const p0=prior==null||n<10?null:P/T;let p=p0,story=null;
  try{const SQ=BP(part).filter(i=>i.story);if(SQ.length&&p0!=null){let ns=0,ks=0;SQ.forEach(i=>{const r=S.it[i.id];if(r&&r[2]){ns++;if(r[3]===r[2])ks++}});const rh=(ks+8*0.6*p0)/(ns+8);p=0.75*p0+0.25*rh;story={n:ns,k:ks,of:SQ.length,raw:p0}}}catch(e){}
  /* Version 182: results from practice outside this app, entered on the Diagnosis page, pull the figure toward what they show.
     Weight: 1% per outside question from the last 45 days, at most 50%, and only from 10 questions up. */
  let ext=null;try{const L=((S.set.ext||{})[part]||[]).filter(x=>Date.now()-x[0]<45*864e5);let en=0,ec=0;L.forEach(x=>{ec+=x[1];en+=x[2]});if(en>=10&&p!=null){const w=Math.min(0.5,en/100);ext={n:en,c:ec,w,before:p};p=(1-w)*p+w*(ec/en)}else if(en)ext={n:en,c:ec,w:0,before:p}}catch(e){}
  const se=p==null?null:Math.sqrt(V)/T,cover=T?W/T:0,full=cover>0.99&&n>=120;
  const verdict=p==null?"none":!full?"early":p>=0.78&&p-se>=0.72?"ready":p>=0.70?"close":"notyet";
  return{D,p,se,cover,n,verdict,story,ext,top:D.filter(x=>x.gain!=null).sort((a,b)=>b.gain-a.gain)[0]||null}}
function xaTopic(d){const x=xaAll().D.find(x=>String(x.d)===String(d));return x?{p:x.p,n:x.n,se:x.se}:{p:null,n:0,se:null}}
const XAV={none:"No estimate yet. It appears after 10 exam questions; the 24-question diagnostic is the quickest way.",early:"Early estimate: it firms up after about 120 questions across all topics.",ready:"You look ready to sit this part. Keep warm: one drill a day and a weekly mock.",close:"Close. Work the top topic below and take a mock.",notyet:"Not yet. The gap is in the topics at the top of the list."};
/* diagnostic and check misses that are not kept as misses still count in the estimate */
const xaForget0=xpForgetNewMisses;xpForgetNewMisses=function(s){try{Object.keys((s.xp||{}).isNew||{}).forEach(id=>{const r=S.it[id],it=BYID[id];if(it&&r&&r[4]===0&&r[2]<=1){const m=xpMem(it.d);m.fw=(m.fw||0)+XAW[it.lv||2];m.fn=(m.fn||0)+1}})}catch(_){}return xaForget0(s)};
/* ---------- 2. order: live gain, but finish what was started ---------- */
const xaDom0=xpDom;xpDom=function(d){const x=xaDom0(d),e=xaTopic(d);x.est=e;if(e.p!=null)x.gain=x.w*(1-e.p);return x};
const xaState0=xpState;xpState=function(){const st=xaState0();try{if(!XPU[part]||!st.D.every(x=>x.gain!=null))return st;
    const open=x=>!((x.lesDone||!x.les)&&x.learned&&(x.practiced||x.parked));S.set.xp=S.set.xp||{};let cur=S.set.xp["cur"+part];const cx=st.D.find(x=>String(x.d)===String(cur));
    if(!cx||!open(cx)){const started=x=>{const m=xpPeek(x.d);return x.lesRead>0||x.fs>0||!!(m.pc||m.ul||m.uq||m.pr)},op=st.D.filter(open),nx=op.filter(started)[0]||op.slice().sort((a,b)=>b.gain-a.gain)[0];cur=nx?nx.d:null;S.set.xp["cur"+part]=cur} /* a topic already begun is finished first; otherwise the biggest gain */
    const rank={};st.D.slice().sort((a,b)=>(String(a.d)===String(cur)?-1:0)-(String(b.d)===String(cur)?-1:0)||b.gain-a.gain).forEach((x,k)=>rank[x.d]=k);
    const ord={les:0,learn:1,prac:2,exam:3,mock:4,strong:5},grp=s=>s.k==="exam"?1:s.k==="mock"?2:s.k==="strong"?3:0;
    st.steps=st.steps.map((s,k)=>({s,k})).sort((a,b)=>grp(a.s)-grp(b.s)||(a.s.x&&b.s.x?rank[a.s.x.d]-rank[b.s.x.d]:0)||ord[a.s.k]-ord[b.s.k]||a.k-b.k).map(o=>o.s);st.byGain=true}catch(_){}return st};
/* ---------- 4. yield: how many bank questions lean on each fact ---------- */
const XAY={};
function xaYield(){if(XAY[part])return XAY[part];const y={};try{const qt=BP(part).filter(i=>i.t==="q").map(i=>new Set(((i.s+" "+i.opts[i.ans]).toLowerCase().match(/[a-z0-9§]{3,}/g)||[])));
    BANK.forEach(i=>{if(i.p!=part||i.t!=="f")return;const w=[...fwords(i)];if(!w.length){y[i.id]=0;return}const need=Math.max(1,Math.ceil(w.length*0.6));let c=0;for(const s of qt){let h=0;for(const x of w){if(s.has(x)){h++;if(h>=need)break}}if(h>=need)c++}y[i.id]=c})}catch(_){}return XAY[part]=y}
/* ---------- 3. ask first ---------- */
function xaSpeed(){try{return XPU[part]?(S.set.pace||"fast"):"steady"}catch(_){return"steady"}}
function xaKnows(d,k){try{if(xaSpeed()!=="steady")return true;const m=xpPeek(d);if(k!=null&&m.pc&&m.pc[k]!==undefined)return m.pc[k]/xpCheckN(k)>=0.5;const e=xaTopic(d);return e.p!=null&&e.n>=5&&e.p>=0.55}catch(_){return false}}
function xaLearn(d,pool,k){try{const t=today(),Y=xaYield(),yb=i=>{const v=Y[i.id]||0;return v>=3?2:v>=1?1:0},topic=BP(part).filter(i=>i.d==d&&i.t==="f"),due=shuffle(topic.filter(i=>{const r=S.it[i.id];return r&&r[1]<=t})).slice(0,8);
    const all=pool.filter(i=>!S.it[i.id]).sort((a,b)=>(yb(b)-yb(a))||(ORDER[a.id]-ORDER[b.id]));if(!all.length)return false;touchDay();const nw=all.slice(0,xaSpeed()==="max"?16:12),entries=due.map(i=>mkEntry(i));
    if(xaKnows(d,k)){nw.forEach(i=>entries.push(Object.assign(mkEntry(i),{pre:1})));newSess("easy",null,0,entries,nw.map(i=>i.id));
      sess.pre={pool:all.slice(nw.length).map(i=>i.id),added:0,hits:0,n:0};sess.throttled=true;sess.thrShown=1;sess.title="Learn · asked first";sess.note="New facts are asked before they are taught. A wrong answer here costs nothing.";render();return true}
    for(let j=0;j<nw.length;j+=4){const ch=nw.slice(j,j+4);entries.push({learn:ch.map(i=>i.id),id:ch[0].id});shuffle(ch.slice()).forEach(i=>entries.push(mkEntry(i)))}
    if(nw.length>=2)shuffle(nw.slice()).forEach(i=>entries.push({id:i.id,lazy:2,final:true}));
    newSess("easy",null,0,entries,nw.map(i=>i.id));return true}catch(_){return false}}
xpLearnUnit=function(d,k){return xaLearn(d,xpUnitFacts(k),k)};
const xaLearnTopic0=xpLearn;xpLearn=function(d){if(!XPU[part])return xaLearnTopic0(d);return xaLearn(d,BP(part).filter(i=>i.d==d&&i.t==="f"),null)};
const xaRecord0=record;record=function(ok,conf){const s=sess,cur=s&&s.queue[s.pos],P=s&&s.pre;if(!(P&&cur&&cur.pre))return xaRecord0.apply(this,arguments);
  const it=BYID[cur.id],key=it.p+"-"+it.d,t=today();let snap=null;
  try{if(!ok)snap={r:S.it[it.id]?S.it[it.id].slice():null,dd:JSON.stringify((S.dd&&S.dd[key])||null),dom:S.dom[key],days:S.days&&S.days[t]?S.days[t].slice():null,nw:S.day?S.day.nw:0}}catch(_){}
  cur.pre=0;const r=xaRecord0.apply(this,arguments);
  try{P.n++;if(ok&&conf)P.hits++;
    if(snap){if(snap.r)S.it[it.id]=snap.r;else delete S.it[it.id];const dd=JSON.parse(snap.dd);S.dd=S.dd||{};if(dd)S.dd[key]=dd;else delete S.dd[key];if(snap.dom===undefined)delete S.dom[key];else S.dom[key]=snap.dom;
      if(S.days){if(snap.days)S.days[t]=snap.days;else delete S.days[t]}if(S.day)S.day.nw=snap.nw;persist()}
    if(!(ok&&conf)){s.queue.push({id:it.id,lazy:2,final:true});s.total++}
    const idx=[];s.queue.forEach((e,k)=>{if(k>s.pos&&e.pre)idx.push(k)});
    if(idx.length&&P.n>=4&&P.hits===0){const ids=idx.map(k=>s.queue[k].id);idx.forEach(k=>{s.queue[k].pre=0});
      for(let g=Math.floor((idx.length-1)/4)*4;g>=0;g-=4){const grp=idx.slice(g,g+4);s.queue.splice(grp[0],0,{learn:grp.map(k=>s.queue[k].id),id:s.queue[grp[0]].id})}
      ids.forEach(id=>{s.queue.push({id,lazy:2,final:true});s.total++});P.switched=1;s.note="These are new to you, so the rest are shown first, then asked."}
    else if(!idx.length&&!P.switched&&P.pool.length&&P.added<12&&P.n>=6&&P.hits/P.n>=0.75){const add=P.pool.splice(0,6).map(id=>BYID[id]).filter(i=>i&&!S.it[i.id]);
      add.forEach((i,j)=>{s.queue.splice(s.pos+1+j,0,Object.assign(mkEntry(i),{pre:1}));s.newIds.push(i.id)});s.total+=add.length;P.added+=add.length;if(add.length)s.note=`You know most of these, so ${add.length} more facts were added to this sitting.`}
    render()}catch(_){}return r};
/* a one-line note under the session title */
const xaSession0=renderSession;renderSession=function(){xaSession0.apply(this,arguments);try{const s=sess;if(s&&s.note&&view==="session"){const h=document.querySelector("#view .sesshead h2");if(h&&!document.querySelector("#view .xanote"))h.insertAdjacentHTML("afterend",`<div class="small xanote" style="color:var(--accent)">${esc(s.note)}</div>`)}}catch(_){}};
/* ---------- 6. look-alike questions after fixing misses ---------- */
function xaUnitOf(it){const m=XPU[part];if(!m)return -1;for(let k=0;k<m.length;k++){if(m[k]==it.d&&xpUnitQs(k).some(q=>q.id===it.id))return k}for(let k=0;k<m.length;k++){if(xpUnitQs(k).some(q=>q.id===it.id))return k}return -1}
const xaRun0=xpRun;xpRun=function(a){const r=xaRun0(a);try{if(XPU[part]&&a.mode==="missed"&&sess&&view==="session"&&sess.mode==="missed"){const have=new Set(sess.queue.map(e=>e.id)),add=[];
    for(const e of sess.queue){if(add.length>=4)break;const it=BYID[e.id];if(!it||it.t!=="q")continue;const k=xaUnitOf(it);if(k<0)continue;const sib=shuffle(xpUnitQs(k).filter(q=>!have.has(q.id)&&!S.it[q.id]&&q.d==it.d&&Math.abs((q.lv||2)-(it.lv||2))<=1))[0];if(sib){have.add(sib.id);add.push(sib)}}
    if(add.length){add.forEach(q=>sess.queue.push(mkEntry(q)));sess.total+=add.length;sess.note=`The last ${add.length} are new look-alike questions from the same lessons: they test the idea, not your memory of the answer.`;render()}}}catch(_){}return r};
/* ---------- 5. diagnosis page ---------- */
const XACAT=[["exc","EXCEPT and NOT questions",i=>/\bEXCEPT\b|\bNOT\b|not true|false statement|is incorrect/.test(i.s)],
 ["num","Amounts, rates and limits",i=>/[$%]/.test(String(i.opts[i.ans]))],
 ["time","Deadlines and time limits",i=>/deadline|due date|how long|by when|within \d|\bdays\b|\bmonths\b|statute/i.test(i.s+" "+i.opts[i.ans])],
 ["form","Which form or schedule",i=>/\bForm\b|\bSchedule\b/.test(String(i.opts[i.ans]))],
 ["long","Long scenarios",i=>i.s.length>=220],
 ["hard","Hard questions",i=>i.lv===3]];
function xaVal(i){const r=S.it[i.id];return r&&r[2]?(r[3]/r[2]+(r[4]?1:0))/2:null}
function xaCats(){const Q=BP(part).filter(i=>i.t==="q"&&i.opts),seen=Q.filter(i=>xaVal(i)!=null),all=seen.length?seen.reduce((a,i)=>a+xaVal(i),0)/seen.length:null;
  const rows=XACAT.map(([k,name,f])=>{const pool=Q.filter(f),s=pool.filter(i=>xaVal(i)!=null);return{k,name,total:pool.length,n:s.length,acc:s.length?s.reduce((a,i)=>a+xaVal(i),0)/s.length:null}});
  const G=GENS.filter(g=>g.p==part),gs=G.filter(g=>S.it[g.id]&&S.it[g.id][2]);if(G.length)rows.push({k:"calc",name:"Calculations",total:G.length,n:gs.reduce((a,g)=>a+S.it[g.id][2],0),acc:gs.length?gs.reduce((a,g)=>a+S.it[g.id][3],0)/gs.reduce((a,g)=>a+S.it[g.id][2],0):null});
  rows.forEach(r=>{r.weak=r.acc!=null&&all!=null&&r.n>=6&&r.acc<=all-0.08});return{all,seen:seen.length,rows}}
function xaBasis(){const A=xaAll(),Q=BP(part).filter(i=>i.t==="q"),seen=Q.filter(i=>S.it[i.id]&&S.it[i.id][2]),first=l=>{const s=seen.filter(l);return{n:s.length,ok:s.length?s.filter(i=>S.it[i.id][3]===S.it[i.id][2]).length/s.length:null}};
  const lm=typeof lastMock==="function"?lastMock(part):null,mock=lm&&lm.n>=20?{p:lm.c/lm.n,n:lm.n,days:Math.floor((Date.now()-lm.t)/864e5)}:null,un=A.D.filter(x=>!x.n);
  return{A,total:Q.length,seen:seen.length,basic:first(i=>(i.lv||2)===1),med:first(i=>(i.lv||2)===2),hard:first(i=>i.lv===3),cued:first(i=>lenCue(i)),plain:first(i=>!lenCue(i)),mock,un}}
function xaSolidHtml(){try{const B=xaBasis(),A=B.A,pc=v=>v==null?"–":Math.round(v*100)+"%",row=(ok,t)=>`<div class="xachk ${ok?"y":"n"}"><i>${ok?"✓":"✗"}</i><span>${t}</span></div>`;
  const gap=B.mock&&A.p!=null?A.p-B.mock.p:null;
  return `<div class="card xad"><b>How solid is this number?</b><div class="small muted">Every question you have answered counts. These are the checks to read it by.</div>
    ${row(B.seen>=120,`${B.seen} of ${B.total} exam questions answered (120 or more makes it firm)`)}
    ${row(!B.un.length,B.un.length?`Not started: ${B.un.map(x=>esc(x.name)).join(", ")}. They are counted at 85% of your average until you start them`:"Every topic has answers")}
    ${row(B.hard.n>=20&&B.hard.ok>=0.65,`Hard questions, first try: ${pc(B.hard.ok)} of ${B.hard.n}. Medium: ${pc(B.med.ok)} of ${B.med.n}. Basic: ${pc(B.basic.ok)} of ${B.basic.n}`)}
    ${A.story?row(A.story.n>=15&&A.story.k/A.story.n>=0.7,`Long story questions, the exam's harder style: ${A.story.k} right on the first try of ${A.story.n} answered (${A.story.of} in all). A quarter of the figure rests on these, and unanswered ones count as weak`):""}
    ${row(B.cued.n<10||B.plain.n<10||B.cued.ok-B.plain.ok<0.08,B.cued.n>=10&&B.plain.n>=10?`Where the right choice is the longest you score ${pc(B.cued.ok)}; elsewhere ${pc(B.plain.ok)}. Those right answers are counted at 85%`:"Right answers where the right choice is the longest are counted at 85%")}
    ${row(!!B.mock&&B.mock.n>=50&&B.mock.days<=14&&B.mock.p>=0.75,B.mock?`Recent mocks: ${pc(B.mock.p)} over ${B.mock.n} questions, ${B.mock.days===0?"today":B.mock.days+" days ago"}${gap!=null&&Math.abs(gap)>=0.08?`. That is ${Math.round(Math.abs(gap)*100)} points ${gap>0?"below":"above"} this figure: trust the mock`:""}`:"No mock exam of 20 or more questions yet. A 50-question mock is the best check")}
    <div class="small">${[B.seen>=120,!B.un.length,B.hard.n>=20&&B.hard.ok>=0.65,!!B.mock&&B.mock.n>=50&&B.mock.days<=14&&B.mock.p>=0.75].filter(Boolean).length===4?"All four main checks pass: the figure can be trusted.":"Until the crosses are gone, read the figure as a rough guide."}</div></div>`}catch(_){return""}}
function xaLessons(){const m=XPU[part]||[],out=[];m.forEach((d,k)=>{const qs=xpUnitQs(k),s=qs.filter(i=>xaVal(i)!=null);if(s.length<4)return;const acc=s.reduce((a,i)=>a+xaVal(i),0)/s.length,miss=s.filter(i=>S.it[i.id][4]===0).length;out.push({k,d,t:UNITS[part][k].t,acc,n:s.length,miss})});
  return out.filter(x=>x.acc<0.72||x.miss>=3).sort((a,b)=>a.acc-b.acc).slice(0,3)}
/* rough workload left on the path, in answers, against the learner's own daily average and the exam date */
function xaPace(){try{const st=xpState(),t=today();let left=0;st.D.forEach(x=>{if(!x.learned)left+=Math.max(0,Math.ceil(x.f*0.8)-x.fs)*2;if(!x.practiced&&!x.parked)left+=Math.max(10,x.need-x.qs)});
    st.steps.forEach(s=>{if(!s.done&&s.k==="exam")left+=30;if(!s.done&&s.k==="mock")left+=25;if(!s.done&&s.k==="strong")left+=30});
    let sum=0,days=0;for(let k=1;k<=7;k++){const v=(S.days||{})[t-k];if(v&&v[0]){sum+=v[0];days++}}const tv=(S.days||{})[t];if(tv&&tv[0]){sum+=tv[0];days++}
    if(!left)return"Every step of the path is done.";if(days<2)return`About ${left} answers are left on the path. A daily pace appears after two study days.`;
    const per=Math.round(sum/days),need=Math.ceil(left/Math.max(1,per)),dl=daysTo(examDate(part));
    return`About ${left} answers left on the path. At your pace (${per} a day on the days you studied) that is about ${need} study days.${dl!=null&&dl>=0?(need>dl?` Your exam is in ${dl} days: raise the pace to about ${Math.ceil(left/Math.max(1,dl))} a day, or move the date.`:` Your exam is in ${dl} days: you are on pace.`):""}`}catch(_){return""}}
function xaLine(){try{if(!XPU[part])return"";const A=xaAll(),pending=!xpDx()&&xpAnswered()<40&&!(S.set.xp||{})["nodx"+part];
  const txt=A.p==null?"No estimate yet. The diagnostic takes about 15 minutes.":`Predicted ${Math.round(A.p*100)}% · aim for 75%+${A.top?" · biggest gain: "+esc(A.top.name):""}`;
  return txt}catch(_){return""}}
xpDxLine=function(){return""};
/* ---------- readiness on top, then the red button, then two more suggestions ---------- */
function xaMockNote(A){try{const lm=lastMock(part);if(!lm||lm.n<20||A.p==null)return"";const m=lm.c/lm.n;return Math.abs(A.p-m)>=0.08?` · mocks say ${Math.round(m*100)}%: trust the mock`:""}catch(_){return""}}
function xaReadyHtml(){try{const A=xaAll(),e=esc,pending=!xpDx()&&xpAnswered()<40&&!(S.set.xp||{})["nodx"+part],c=A.p==null?"":A.p>=0.75?"ok":A.p>=0.6?"mid":"bad";
  const short={none:"Take the 24-question diagnostic to get your number",early:"Early estimate",ready:"Ready to sit this part",close:"Close",notyet:"Not yet"}[A.verdict];
  return `<button class="xaready" data-xa="open"><span class="xr1">READINESS · ${e(pl(part)).toUpperCase()}<em>Diagnosis ›</em></span>
    <span class="xr2"><b class="${c}">${A.p==null?"–":Math.round(A.p*100)+"%"}</b><span>${A.p==null?"no estimate yet":`predicted score ± ${Math.max(2,Math.round(A.se*100))}<br>aim for 75% or more`}</span></span>
    <span class="xrbar"><i class="${c}" style="width:${A.p==null?0:Math.round(A.p*100)}%"></i><u></u></span>
    <span class="xr3"><b>${e(short)}</b>${A.p!=null?` · from ${A.n} question${A.n===1?"":"s"}${A.D.some(x=>!x.n)?`, ${A.D.filter(x=>!x.n).length} topic${A.D.filter(x=>!x.n).length>1?"s":""} not started`:""}`:""}${A.top&&A.p!=null?` · biggest gain: ${e(A.top.name)}`:""}${xaMockNote(A)}</span></button>${pending?`<div class="row" style="justify-content:flex-end"><button class="btn ghost small" data-xp="nodx">Skip the diagnostic</button></div>`:""}`}catch(_){return""}}
function xaSuggest(){const out=[];try{const main=xpNext(),t=main.t||"",miss=missedPool(part,"all").length,due=dueList(part,"all").length,pc=v=>Math.round(v*100)+"%";
    if(miss>=3&&!/misses/.test(t))out.push({t:`Fix ${miss} misses`,run:{mode:"missed",filt:"all"}});
    const L=xaLessons()[0];if(L&&!t.includes(L.t))out.push({t:`Weak lesson (${pc(L.acc)}): ${L.t}`,run:{unit:L.k,dd:L.d}});
    const C=xaCats().rows.filter(r=>r.weak&&r.k!=="calc").sort((a,b)=>a.acc-b.acc)[0];if(C)out.push({t:`Weak type (${pc(C.acc)}): ${C.name}`,cat:C.k});
    const nc=BANK.filter(i=>{const r=S.it[i.id];return i.p==part&&r&&r[5]}).length;if(nc>=3)out.push({t:`${nc} sure-but-wrong answers`,conf:1});
    if(due>=5&&!/Review/.test(t))out.push({t:`Review ${due} facts that are due`,run:{mode:"easy",filt:"all"}})}catch(_){}return out.slice(0,2)}
function xaSuggestHtml(){try{const l=xaSuggest();if(!l.length)return"";return `<div class="xasg"><span class="small muted">Also worth doing</span>${l.map((x,i)=>`<button class="btn small" data-xa="sg" data-i="${i}">${esc(x.t)} ›</button>`).join("")}</div>`}catch(_){return""}}
/* ---------- Quick 10: always on top, built by the same engine ----------
   Exam-type questions only (four choices, medium or hard): no flash cards. The mix follows the pace: Steady 3 misses and
   2 new, Fast 2 misses and 5 new, Max 1 miss and 8 new; then 1 of the weakest question type, 1 calculation in four-choice
   form, and the rest from the topic with the biggest gain. Level follows the topic's estimate (under 55%: medium; 55 to
   75%: medium and hard; above: hard). Questions answered right and not yet due are left out. It adapts while you answer:
   a miss swaps a later, less important item for a look-alike from the same lesson (twice at most), and a sure right
   answer on the focus topic raises the next one from that topic a level. Every answer feeds the readiness figure, the
   path and the review dates. */
function xaLevelOK(p,lv){return p==null?lv>=2:p<0.55?lv===2:p<0.75?lv>=2:lv===3}
const XAMIX={steady:{miss:3,nw:2},fast:{miss:2,nw:5},max:{miss:1,nw:8}};
function xaExam(i){return i.p==part&&i.t==="q"&&i.opts&&i.opts.length===4&&(i.lv||2)>=2} /* exam-type: four-choice questions at medium or hard level */
function xaQuick(N){N=N||10;const t=today(),A=xaAll(),M=XAMIX[xaSpeed()]||XAMIX.fast,q=[],has=new Set(),tag={},add=(l,k,why)=>{let c=0;for(const i of l){if(q.length>=N||c>=k)break;if(i&&!has.has(i.id)){has.add(i.id);q.push(i);tag[i.id]=why;c++}}return c};
  const fresh=i=>{const r=S.it[i.id];return !(r&&r[4]!==0&&r[1]>t)},E=BANK.filter(xaExam),Q=E.filter(fresh),un=E.filter(i=>!S.it[i.id]);
  const order=A.D.filter(x=>x.gain!=null).sort((a,b)=>b.gain-a.gain),g1=order[0],g2=order[1],lvl=(x,l)=>l.filter(i=>i.d==x.d&&xaLevelOK(x.p,i.lv||2));
  add(missedPool(part,"all").filter(xaExam),M.miss,"miss");
  if(g1){add(shuffle(lvl(g1,un)),Math.ceil(M.nw*.6),"new");if(g2)add(shuffle(lvl(g2,un)),M.nw-q.filter(i=>tag[i.id]==="new").length,"new")}
  add(shuffle(un.slice()).sort((a,b)=>(a.lv||2)-(b.lv||2)),M.nw-q.filter(i=>tag[i.id]==="new").length,"new");
  const C=xaCats().rows.filter(r=>r.weak&&r.k!=="calc").sort((a,b)=>a.acc-b.acc)[0];if(C){const f=(XACAT.find(c=>c[0]===C.k)||[])[2];if(f)add(weightPick(Q.filter(f),6),1,"type")}
  if(typeof calcMC==="function")add(weightPick(GENS.filter(g=>g.p==part),2),1,"calc");
  if(g1){const L=xaLessons().filter(x=>x.d==g1.d)[0],inL=L?new Set(xpUnitQs(L.k).map(i=>i.id)):null,pool=lvl(g1,Q);if(inL)add(weightPick(pool.filter(i=>inL.has(i.id)),6),2,"focus");add(weightPick(pool,10),N,"focus");add(weightPick(Q.filter(i=>i.d==g1.d),10),Math.max(0,N-q.length-1),"focus")}
  if(g2)add(weightPick(lvl(g2,Q),6),N,"next");
  add(weightPick(Q,N),N,"fill");add(weightPick(E,N),N,"fill");
  if(!q.length)return false;newSess("qd",shuffle(q));sess.quick={tag,swaps:0,focus:g1?String(g1.d):null,fp:g1?g1.p:null};sess.title="Quick 10 · exam questions";
  const n=k=>q.filter(i=>tag[i.id]===k).length;sess.note=`Built for you now: ${[n("new")?n("new")+" new":"",n("miss")?n("miss")+" misses":"",g1&&n("focus")?n("focus")+" on "+g1.name:"",n("type")?"1 weak type":"",n("calc")?"1 calculation":""].filter(Boolean).join(" · ")}`;render();return true}
/* New 10: only questions never seen, shared out by where the gain is */
function xaUnseen(){return BANK.filter(i=>xaExam(i)&&!S.it[i.id])}
function xaNew10(){const un=xaUnseen();if(!un.length)return xaQuick(10);const A=xaAll(),D=A.D.map(x=>({d:x.d,g:x.gain!=null?x.gain+1:x.w/4,pool:shuffle(un.filter(i=>i.d==x.d)).sort((a,b)=>(a.lv||2)-(b.lv||2)),k:0})).filter(x=>x.pool.length),q=[];
  while(q.length<10&&D.some(x=>x.pool.length)){const x=D.filter(x=>x.pool.length).sort((a,b)=>b.g/(b.k+1)-a.g/(a.k+1))[0];q.push(x.pool.shift());x.k++}
  newSess("quiz",shuffle(q));sess.title="New 10 · not seen before";sess.note=`${un.length} exam questions in this part are still new to you. These 10 lean toward your biggest gains.`;render();return true}
/* count of exam questions met for the first time today */
function xaNewToday(){const r=(S.set.xp||{})["nq"+part];return r&&r.day===today()?r.n:0}
const XATARGET={steady:20,fast:40,max:80};
const xaStart0=startSession;startSession=function(mode,n){try{if(mode==="qd"&&XPU[part]&&(n||10)<=10&&xaQuick(n||10))return}catch(_){}return xaStart0.apply(this,arguments)};
const xaRecord1=record;record=function(ok,conf){const s=sess,K=s&&s.quick,cur=s&&s.queue[s.pos],it=cur&&BYID[cur.id],firstSight=!!(it&&it.t==="q"&&XPU[part]&&!S.it[it.id]);const r=xaRecord1.apply(this,arguments);
  try{if(firstSight){S.set.xp=S.set.xp||{};const k="nq"+part,t=today(),c=S.set.xp[k];S.set.xp[k]=c&&c.day===t?{day:t,n:c.n+1}:{day:t,n:1};
    const m=xpMem(it.d),l=it.lv||2;m.fl=((m.fl||"")+(ok?"ABC":"abc")[l-1]).slice(-30)}}catch(_){}
  try{if(K&&it&&it.t==="q"){const ahead=k=>k>s.pos,used=new Set(s.queue.map(e=>e.id));
    if(!ok&&K.swaps<2){let j=-1;for(const w of ["fill","next","focus","type"]){j=s.queue.findIndex((e,k)=>ahead(k)&&K.tag[e.id]===w);if(j>0)break}const u=xaUnitOf(it);
      if(j>0&&u>=0){const sib=shuffle(xpUnitQs(u).filter(x=>xaExam(x)&&!used.has(x.id)&&!S.it[x.id]&&(x.lv||2)<=(it.lv||2)))[0];if(sib){s.queue[j]=mkEntry(sib);K.tag[sib.id]="sib";K.swaps++;s.note="A miss: a look-alike question from the same lesson was added further on."}}}
    else if(ok&&conf&&String(it.d)===K.focus&&(it.lv||2)<3){const j=s.queue.findIndex((e,k)=>ahead(k)&&K.tag[e.id]==="focus"&&(BYID[e.id].lv||2)<=(it.lv||2));
      if(j>0){const up=shuffle(BANK.filter(x=>x.p==part&&x.t==="q"&&String(x.d)===K.focus&&(x.lv||2)===(it.lv||2)+1&&!used.has(x.id)&&!(S.it[x.id]&&S.it[x.id][4]!==0&&S.it[x.id][1]>today())))[0];if(up){s.queue[j]=mkEntry(up);K.tag[up.id]="focus";s.note="Sure and right: the next one on this topic is a level harder."}}}}}catch(_){}return r};
function xaQuickHtml(){try{const sp=xaSpeed(),un=xaUnseen().length,all=BANK.filter(xaExam).length,nt=xaNewToday(),tg=XATARGET[sp];
  return `<div class="xaqrow three"><button class="xaquick" data-xa="quick"><b>⚡ Quick 10</b><span>exam, adaptive</span></button><button class="xaquick alt" data-xa="new10"><b>🆕 New 10</b><span>${un?un+" not seen":"all seen"}</span></button><button class="xaquick aud" data-xa="aud10"><b>🎧 Audio 10</b><span>${xaAudSub()}</span></button></div>
   <div class="xapace"><span class="small muted">New today <b>${nt}</b> of ${tg} · seen ${all-un} of ${all}</span><span class="xaseg">${[["steady","Steady"],["fast","Fast"],["max","Max"]].map(([v,l])=>`<button data-xa="pace" data-v="${v}" class="${sp===v?"on":""}">${l}</button>`).join("")}</span></div>`}catch(_){return""}}
/* Fast and Max: one tap answers (counted as sure) and a right answer moves on by itself; a wrong one stops to show why */
function xaFastTap(b){try{const s=sess;if(!s||view!=="session"||!XPU[part]||xaSpeed()==="steady"||s.mode==="mock"||s.phase!=="ask"||b.dataset.opt===undefined)return false;/* Version 171: the diagnostic and lesson checks answer with one tap too on Fast and Max. Before, they alone still waited for a
     Sure/Guessing tap that could sit below the screen, which looked like a frozen question. */
  if(Date.now()<xaGuard)return true; /* a stray tap just after the screen changed is ignored, so it cannot answer the new question */
  const pos=s.pos,cur=s.queue[pos],V=view4(cur,BYID[cur.id]),right=+b.dataset.opt===V.ans;s.sel=+b.dataset.opt;
  if(!right)s.eb={pos,id:cur.id,o:[],pick:-1}; /* Fast and Max: a miss shows its explanation at once, without the "which reason fits" step */
  submitAnswer(right); /* Version 171: a one-tap answer counts as "sure" only when it is right. Before, every miss on Fast or Max was filed as a confident mistake. */
  if(s.lastOk)setTimeout(()=>{try{if(sess===s&&s.pos===pos&&s.phase==="shown"&&view==="session"){const n=document.querySelector("#view #next");if(n){xaGuard=Date.now()+450;n.click()}}}catch(_){}},xaSpeed()==="max"?1000:2000 /* Version 171: was 450/800 ms, reported as "pushes to next too quickly"; long enough now to read the right answer. Next still moves on at once. */);return true}catch(_){return false}}
let xaGuard=0;
const xaDoNext0=doNextHtml;doNextHtml=function(){const h=xaDoNext0();try{if(!XPU[part]||PARTS[part].bk||!h)return h;return xaReadyHtml()+xaQuickHtml()+h+xaSuggestHtml()}catch(_){return h}};
function renderXaDiag(){const e=esc,A=xaAll(),C=xaCats(),L=xaLessons(),pc=v=>Math.round(v*100)+"%",cal=S.cal||[0,0,0,0],tm=(S.tm||{})[part+"-hard"]||[0,0],lm=typeof lastMock==="function"?lastMock(part):null,nconf=BANK.filter(i=>{const r=S.it[i.id];return i.p==part&&r&&r[5]}).length;
  const cls=v=>v>=0.75?"ok":v>=0.6?"mid":"bad",bar=(v,c)=>`<i><em class="${c||cls(v)}" style="width:${Math.max(4,Math.round(v*100))}%"></em></i>`;
  const top=A.p==null?`<div class="xabig">–</div>`:`<div class="xabig ${cls(A.p)}">${pc(A.p)}<small> ± ${Math.max(2,Math.round(A.se*100))}</small></div>`;
  const order=A.D.slice().sort((a,b)=>(b.gain==null?-1:b.gain)-(a.gain==null?-1:a.gain));
  $("#view").innerHTML=`<section class="section"><div class="sesshead"><div><h2>Diagnosis · ${e(pl(part))}</h2><div class="small muted">Worked out from your own answers. It updates after every session.</div></div></div>
   <div class="card xad"><div class="small muted">Predicted score on exam questions</div>${top}<div><b>${XAV[A.verdict]}</b></div><div class="small muted">${A.n} questions counted. It counts your first try at every question, because exam questions are new to you: a question you ever missed stays missed until you have answered it right on later review days. A wrong answer can never raise it. Aim for 75% or more; the real exam is scaled (500 on a 200 to 800 scale passes).</div>
     <div class="row"><button class="btn pri small" data-xa="dx">${xpDx()?"Run the 24-question diagnostic again":"Take the 24-question diagnostic"}</button></div></div>
   ${xaSolidHtml()}
   <div class="card xad"><b>Topics, biggest gain first</b><div class="small muted">Gain = share of the exam x what you still miss. The red button works in this order.</div>
     ${order.map((x,k)=>`<div class="dxrow"><span>${k===0&&x.gain!=null?"▶ ":""}${e(x.name)} <span class="muted">· ${x.w}% of exam</span></span><b class="${x.p==null?"":cls(x.p)}">${x.p==null?"no data":pc(x.p)}</b>${x.p==null?"":bar(x.p)}</div>`).join("")}</div>
   ${L.length?`<div class="card xad"><b>Lessons that cost you most</b>${L.map(x=>`<div class="dxrow"><span>${e(x.t)}</span><b class="${cls(x.acc)}">${pc(x.acc)}${x.miss?" · "+x.miss+" open":""}</b>${bar(x.acc)}<div class="row" style="grid-column:1/-1"><button class="btn small" data-xa="les" data-k="${x.k}">Read the lesson</button><button class="btn small" data-xa="quiz" data-k="${x.k}" data-d="${x.d}">Quiz on it</button></div></div>`).join("")}</div>`:""}
   <div class="card xad"><b>Why you miss</b><div class="small muted">${C.all==null?"Answer some questions first.":`All questions: ${pc(C.all)} over ${C.seen} seen. A type marked ⚠ runs 8 points or more below that.`}</div>
     ${C.rows.filter(r=>r.total>=8).map(r=>`<div class="dxrow"><span>${r.weak?"⚠ ":""}${e(r.name)}</span><b class="${r.acc==null?"":cls(r.acc)}">${r.acc==null||r.n<3?"not enough yet":pc(r.acc)+" · "+r.n+" seen"}</b>${r.acc==null||r.n<3?"":bar(r.acc)}${r.weak||r.k==="calc"&&r.acc!=null&&r.acc<0.7?`<div class="row" style="grid-column:1/-1"><button class="btn small" data-xa="cat" data-c="${r.k}">Drill 10 of these</button></div>`:""}</div>`).join("")}
     ${nconf?`<div class="dxrow"><span>⚠ Sure but wrong</span><b class="bad">${nconf} items</b><div class="small muted" style="grid-column:1/-1">The costliest kind: you would not have checked these on exam day.</div><div class="row" style="grid-column:1/-1"><button class="btn small" data-xa="conf">Drill them</button></div></div>`:""}</div>
   <div class="card xad"><b>Confidence and pace</b>
     <div class="small">${cal[0]>=10?`When you say Sure you are right ${pc(cal[1]/cal[0])} of the time${cal[2]>=10?`; when Guessing, ${pc(cal[3]/cal[2])}`:""}.${cal[1]/cal[0]<0.8?" Slow down on the ones you feel sure of.":""}`:"Confidence figures appear after 10 answers marked Sure."}</div>
     <div class="small">${xaPace()}</div>
     <div class="small">${tm[0]>=5?`Hard questions take you about ${Math.round(tm[1]/tm[0])} seconds each. The exam allows about ${Math.round(mpq(part)*60)}.`:"Pace appears after 5 hard questions."}${lm&&lm.sec?` Last mocks: ${Math.round(lm.sec/lm.n)} seconds a question.`:""}</div></div></section>`}
const xaExtraView0=extraView;extraView=function(){if(view==="xadiag"){renderXaDiag();return true}return xaExtraView0()};
const xaExtraClick0=extraClick;extraClick=function(b){const d=b.dataset;if(d.xa===undefined){if(b.id==="next"&&XPU[part]&&xaSpeed()!=="steady")xaGuard=Math.max(xaGuard,Date.now()+300);if(d.opt!==undefined&&xaFastTap(b))return true;return xaExtraClick0(b)}const a=d.xa;
  if(a==="new10"){xaNew10();return true}
  if(a==="aud10"){xaAudio10();return true}
  if(a==="audset"){openAudio();aud.src="adapt";aud.cont=true;render();return true}
  if(a==="pace"){S.set.pace=d.v;persist();render();return true}
  if(a==="open"){view="xadiag";render();window.scrollTo(0,0);return true}
  if(a==="dx"){xpDxStart();return true}
  if(a==="quick"){startSession("qd",10);return true}
  if(a==="sg"){const x=xaSuggest()[+d.i];if(!x)return true;if(x.run){xpRun(x.run);return true}if(x.conf){startSession("common",10);return true}if(x.cat){d.c=x.cat}else return true}
  if(a==="les"){xpOpenLesson(+d.k);xpFromPath=false;window.scrollTo(0,0);return true}
  if(a==="quiz"){xpRun({unit:+d.k,dd:isNaN(+d.d)?d.d:+d.d});return true}
  if(a==="conf"){startSession("common",10);return true}
  if(a==="cat"||a==="sg"){let pool;if(d.c==="calc"){pool=GENS.filter(g=>g.p==part)}else{const f=(XACAT.find(c=>c[0]===d.c)||[])[2];pool=f?BP(part).filter(i=>i.t==="q"&&i.opts&&f(i)):[]}
    const rk=i=>{const r=S.it[i.id];return !r?1:r[4]===0?0:2};const q=shuffle(pool.slice()).sort((x,y)=>rk(x)-rk(y)).slice(0,10);if(q.length){newSess("quiz",shuffle(q));sess.title="Drill: "+(d.c==="calc"?"Calculations":(XACAT.find(c=>c[0]===d.c)||[])[1]);render()}return true}
  return true};
/* when the path is finished and the estimate says ready, the button says so */
const xaNext0=xpNext;xpNext=function(){const a=xaNext0();try{if(XPU[part]&&a.qd==="smart"){const A=xaAll();if(A.verdict==="ready")a.d=`Predicted ${Math.round(A.p*100)}%: you look ready to sit this part. One drill a day keeps it warm.`}}catch(_){}return a};

/* exam-style calculations are shown plainly, as on the exam: no worked example or step buttons above the choices.
   After the answer: the working, and the reason behind the choice that was picked. The retired set stays resolvable. */
setTimeout(()=>{try{GENS_OLD.forEach(g=>{if(!BYID[g.id])BYID[g.id]=g})}catch(_){}},0); /* this file runs before the item index is built */
const xaCalcHook0=calcTeachHook;calcTeachHook=function(){try{const s=sess,cur=s&&s.queue[s.pos],it=cur&&BYID[cur.id];if(it&&it.exam){if(s.phase==="ask")return;cur.likeQueued=1}}catch(_){}return xaCalcHook0.apply(this,arguments)};

/* ---------- after a miss: "Explain it · how to" ----------
   One button under a missed exam question. It opens, in place: the explanation, the rule behind it (the one or two fact
   cards the question leans on), how to attack this kind of question, and the lesson it belongs to with a
   "read it after this session" switch that puts the lesson among the suggestions on the main page. */
const XAHOW={exc:"EXCEPT and NOT questions: treat the four choices as four true-or-false statements. Mark each one, and the odd one out is the answer. Do not hunt for the 'right-sounding' choice.",
 num:"Amounts and limits: the wrong choices are usually the right figure for another year, filing status or rule. Say the figure to yourself before you look at the choices.",
 time:"Deadlines: name the starting event first (due date, filing date, date of the notice), then count from it. Most wrong choices count from the wrong event.",
 form:"Which form: tie each form to its one job and to who files it. If two choices look close, ask who signs it and what it asks the IRS to do.",
 long:"Long scenarios: read the last sentence first, because it says what is being asked. Then go back and pick out only the facts that bear on that.",
 hard:"Hard questions: cover the choices, answer in your own words, then find the choice that matches. Cross out the two that cannot be right before choosing.",
 calc:"Calculations: underline what is asked, list only the items that count, then do one step at a time. The wrong choices are what you get by counting an item that does not belong or skipping a limit.",
 base:"Cover the choices, answer in your own words, then find the choice that matches. If none does, reread the last sentence of the question."};
const XAFQ={},XAIDF={};
/* fact cards a question leans on: words of the card's title found in the question, rare words counting more than common ones */
const xaStem=w=>w.length>6?w.slice(0,6):w;
function xaIdf(p){if(XAIDF[p])return XAIDF[p];const df={},F=BANK.filter(f=>f.p==p&&f.t==="f");F.forEach(f=>new Set([...fwords(f)].map(xaStem)).forEach(w=>df[w]=(df[w]||0)+1));const o={n:F.length,df};return XAIDF[p]=o}
function xaFactsFor(it){if(XAFQ[it.id])return XAFQ[it.id];let out=[];try{const I=xaIdf(it.p),idf=w=>Math.log((I.n+1)/((I.df[w]||0)+1)),toks=t=>new Set((t.toLowerCase().match(/[a-z0-9§]{3,}/g)||[]).map(xaStem)),key=toks(String(it.opts[it.ans])+" "+(it.ex||"")),txt=toks(it.s);
    out=BANK.filter(f=>f.p==it.p&&f.t==="f").map(f=>{const w=[...new Set([...fwords(f)].map(xaStem))];if(w.length<2)return null;let all=0,hit=0,n=0,inKey=0;for(const x of w){const v=idf(x);all+=v;if(key.has(x)){hit+=v;n++;inKey+=v}else if(txt.has(x)){hit+=v;n++}}
      return all>0&&n>=2&&hit/all>=0.6&&inKey>0?{f,sc:hit+inKey+(f.d==it.d?0.5:0)}:null}).filter(Boolean).sort((a,b)=>b.sc-a.sc).slice(0,2).map(x=>x.f)}catch(_){}return XAFQ[it.id]=out}
function xaHowHtml(cur,it){const e=esc,calc=it.t==="g",k=calc?"calc":((XACAT.find(c=>c[2](it))||[])[0]||"base"),facts=calc?[]:xaFactsFor(it),u=calc?-1:xaUnitOf(it),later=(S.set.xp||{})["rl"+part];
  return `<div class="xahow"><b>Explain it</b>
    ${calc?`<div class="small">The working is shown above, one step per line. Follow it with the numbers from the question, then try one like it.</div>`:`<div>${it.ex&&it.ex.length>=25?stepsHtml(it.ex):`The right answer is <b>${e(String(it.opts[it.ans]))}</b>.${it.ex?" "+e(it.ex):""}`}</div>`}
    ${facts.length?`<b>The rule behind it</b>${facts.map(f=>`<div class="xafact"><span>${e(f.f)}</span>${e(f.b)}</div>`).join("")}`:""}
    <b>How to attack this kind of question</b><div class="small">${e(XAHOW[k]||XAHOW.base)}</div>
    ${u>=0?`<b>Where it is taught</b><div class="small">Lesson: ${e(UNITS[part][u].t)}</div><div class="row"><button class="btn small" data-xa="rl" data-k="${u}">${later===u?"✓ On your list for after this session":"Read this lesson after the session"}</button></div>`:""}</div>`}
const xaSession1=renderSession;renderSession=function(){xaSession1.apply(this,arguments);try{const s=sess;if(!s||view!=="session"||!XPU[part]||s.mode==="mock"||s.phase!=="shown"||s.lastOk)return;const cur=s.queue[s.pos],it=cur&&BYID[cur.id];if(!it||it.t==="f")return;
    const nx=document.querySelector("#view #next"),ex=document.querySelector("#view .explain");if(!nx||!ex||document.querySelector("#view [data-xa='how']"))return;
    nx.insertAdjacentHTML("afterend",`<button class="btn small" data-xa="how">${cur.howOpen?"Hide the explanation":"📖 Explain it · how to"}</button>`);if(cur.howOpen)ex.insertAdjacentHTML("afterend",xaHowHtml(cur,it))}catch(_){}};
const xaExtraClick1=extraClick;extraClick=function(b){const d=b.dataset;
  if(d.xa==="how"){const cur=sess&&sess.queue[sess.pos];if(cur){cur.howOpen=!cur.howOpen;render()}return true}
  if(d.xa==="rl"){S.set.xp=S.set.xp||{};S.set.xp["rl"+part]=S.set.xp["rl"+part]===+d.k?null:+d.k;persist();render();return true}
  if(d.xa==="rlgo"){const k=(S.set.xp||{})["rl"+part];if(k!=null){S.set.xp["rl"+part]=null;persist();xpOpenLesson(k);xpFromPath=false;window.scrollTo(0,0)}return true}
  return xaExtraClick1(b)};
const xaSuggestHtml0=xaSuggestHtml;xaSuggestHtml=function(){let h=xaSuggestHtml0();try{const k=(S.set.xp||{})["rl"+part];if(k!=null&&UNITS[part]&&UNITS[part][k]){const b=`<button class="btn small" data-xa="rlgo">📖 Lesson you marked: ${esc(UNITS[part][k].t)} ›</button>`;h=h?h.replace('</span>','</span>'+b):`<div class="xasg"><span class="small muted">Also worth doing</span>${b}</div>`}}catch(_){}return h};

/* the line under the session title: one readiness figure, the same one as the top card */
const xaLive0=liveLine;liveLine=function(){try{if(!XPU[part])return xaLive0();const A=xaAll();touchDay();return `Readiness ${A.p==null?"–":Math.round(A.p*100)+"%"} · ${S.day.n} answers today · ${xaNewToday()} new`}catch(_){return xaLive0()}};

/* ---------- Version 171: one calculation of the path per redraw ----------
   The main page asked for the path state and the next step several times while drawing, and each one walked the whole
   question bank. On a phone that made the page slow to appear after every session. Now each redraw works them out once.
   The saved copy is dropped at the start of every redraw and whenever progress is saved, so it can never be stale. */
const XSC={st:null,nx:null,k:null};
function xaDrop(){XSC.st=null;XSC.nx=null;XAC.k=null}
const xaStateTop=xpState;xpState=function(){if(XSC.st&&XSC.k===part)return XSC.st;const st=xaStateTop();XSC.st=st;XSC.k=part;return st};
const xaNextTop=xpNext;xpNext=function(){if(XSC.nx&&XSC.k===part)return XSC.nx;const a=xaNextTop();if(XSC.k===part)XSC.nx=a;return a};
const xaPersist1=persist;persist=function(){xaDrop();return xaPersist1.apply(this,arguments)};
/* During a session in EA Parts 1 to 3 the big app header is hidden and the session header is one compact block, so the
   question and its four choices fit on a phone screen without scrolling. Before, the question began two-thirds of the way down. */
const xaRender0=render;render=function(){xaDrop();const r=xaRender0.apply(this,arguments);try{const on=view==="session"&&!!sess&&!!XPU[part];document.body.classList.toggle("xafocus",on);document.body.classList.toggle("xafast",on&&xaSpeed()!=="steady"&&sess.mode!=="mock")}catch(_){}return r};

/* Version 171: on Fast and Max, and in every diagnostic or lesson check, the 10-answer checkpoint screen is skipped.
   It stopped a 24-question diagnostic twice and worked against "push me faster". Steady keeps it. */
const xaAdvance0=advance;advance=function(){try{const s=sess;if(s&&XPU[part]&&(xaSpeed()!=="steady"||(s.xp&&(s.xp.k==="dx"||s.xp.k==="pc"))||s.dxRun))s.cpAt=s.done}catch(_){}return xaAdvance0.apply(this,arguments)};

/* ===== Audio 10 on top (Version 171) =====
   One tap starts hands-free listening. It works in 10-minute blocks: at each mark it offers "Stop here" (and plays a chime, or
   says one line with the phone voice) and carries on by itself if nothing is tapped, so it suits driving. "Change" opens the
   options (block length, what to hear, voice, speed, stop instead of keep going).
   Built so that listening through to the end covers every fact of the part once:
   (1) the facts behind the exam questions missed last (the matching "Explain it" uses), at most 8;
   (2) facts marked missed or hard, at most 8;
   (3) every fact never heard, highest-gain topic first, in teaching order inside a topic;
   (4) then the facts already heard, least-heard first.
   What was heard is saved per fact, so the next listen starts with what has not been heard yet. Concentrated: question, a short
   pause, answer; the phone voice no longer says each answer a second time in this mode. */
function xaAudOrder(scope){const rec=!!(aud&&aud.rec),ok=f=>!rec||REC[f.id]!==undefined,t=today();S.au=S.au||{};
  const pool=BANK.filter(i=>i.t==="f"&&(scope==="all"||i.p==part)&&ok(i)),hc=f=>(S.au[f.id]||[0,0])[0],ht=f=>(S.au[f.id]||[0,0])[1]===t?1:0;let link=[];
  try{const miss=BP(part).filter(i=>i.t!=="f"&&i.opts&&S.it[i.id]&&S.it[i.id][4]===0).sort((a,b)=>(S.it[b.id][7]||0)-(S.it[a.id][7]||0)).slice(0,12);
    for(const m of miss)for(const f of xaFactsFor(m))if(ok(f)&&!link.includes(f))link.push(f)}catch(_){}
  link=link.slice(0,8);const gain={};try{xaAll().D.forEach(x=>{gain[x.d]=x.gain==null?x.w/100:x.gain})}catch(_){}
  const g=f=>f.p==part?(gain[f.d]||0):-1,used=new Set(link);
  const hard=pool.filter(f=>{const r=S.it[f.id];return !used.has(f)&&r&&(r[4]===0||((r[6]||0)>=2&&r[0]<MASTER_BOX))}).sort((a,b)=>ht(a)-ht(b)||hc(a)-hc(b)).slice(0,8);hard.forEach(f=>used.add(f));
  const rest=pool.filter(f=>!used.has(f)),ord=(a,b)=>g(b)-g(a)||a.p-b.p||a.d-b.d||ORDER[a.id]-ORDER[b.id];
  return link.concat(hard,rest.filter(f=>!hc(f)).sort(ord),rest.filter(f=>hc(f)).sort((a,b)=>ht(a)-ht(b)||hc(a)-hc(b)||ord(a,b)))}
function xaAudQueue(scope,n){const rec=!!(aud&&aud.rec),ok=f=>!rec||REC[f.id]!==undefined;let link=[];
  try{const miss=BP(part).filter(i=>i.t!=="f"&&i.opts&&S.it[i.id]&&S.it[i.id][4]===0).sort((a,b)=>(S.it[b.id][7]||0)-(S.it[a.id][7]||0)).slice(0,12);
    for(const m of miss)for(const f of xaFactsFor(m))if(ok(f)&&!link.includes(f))link.push(f)}catch(_){}
  link=link.slice(0,8);const weak={};try{xaAll().D.filter(x=>x.gain!=null).sort((a,b)=>b.gain-a.gain).slice(0,2).forEach(x=>{weak[x.d]=1})}catch(_){}
  const rest=audQueue0(scope,"smart",n).filter(f=>!link.includes(f)),isW=f=>f.p==part&&weak[f.d],W=rest.filter(isW),R=rest.filter(f=>!isW(f)),out=link.slice();
  while(W.length||R.length){if(W.length)out.push(W.shift());if(W.length)out.push(W.shift());if(R.length)out.push(R.shift())}
  return out.slice(0,n)}
const audQueue0=audQueue;audQueue=function(scope,src,n){const all=!!(aud&&aud.cont);if(all)n=99999;
  if(src==="adapt")return XPU[part]?(all?xaAudOrder(scope):xaAudQueue(scope,n)):audQueue0(scope,"smart",n);return audQueue0(scope,src,n)};
function xaAudio10(){aud={state:"setup",mins:10,src:"adapt",scope:"part",gap:1,rate:1,cont:true,rec:recOn()&&recHas(part)&&S.set.recv!==false};view="audio";window.scrollTo(0,0);
  if(aud.rec){startRec();return}if(!canSpeak()){render();return}unlockSpeech();startAudio()}
function xaAudSub(){try{const c=audCover(part);return c.h?`heard ${c.h} of ${c.n}`:`all ${c.n} facts`}catch(_){return"hands-free"}}
