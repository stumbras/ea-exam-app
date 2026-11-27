/* ================= Exam Path: a guided route through each exam section =================
   Review finding: a new learner's red "Do this next" button started with exam-style questions, before any topic had been
   learned, and the section main page showed drills but no map of the syllabus.
   The path walks the section's topics in blueprint order. For each topic: Learn (meet at least 80% of its facts), then
   Practice (at least 30 of its questions, or 30% of them if the topic is small, with 70% right). After every topic:
   the exam-style pack (where one exists), a mock exam, then a Strong pass per topic (80% right with 60% of its questions seen).
   Two daily jobs can come first: reviews that are due (25 or more) and open misses (8 or more).
   Every row can be opened to start any stage out of order. Nothing here changes how answers are scored or scheduled. */
/* Lessons in the path (Version 166): each slide lesson of EA Parts 1 to 3 belongs to one exam topic. A topic's lessons are read
   before its facts are learned. A topic whose facts are already learned never sends anyone back to its lessons. */
const XPU={1:[1,1,1,2,2,2,2,2,2,2,3,3,3,4,4,5,6,6],2:[1,1,1,1,2,2,3,1,2,1,1,1,1,2,2,3,3,3],3:[1,1,1,2,2,3,4,1,1,1,1,1,2,2,3,3,3,2,4]};
function xpLes(d){const m=XPU[part],U=UNITS[part]||[],pos=S.set.les||{},out=[];if(!m)return out;
  const to=((S.set.xp||{})[part+"-"+d]||{}).to||{};
  U.forEach((u,k)=>{if(m[k]==d)out.push({k,t:u.t,n:u.s.length,out:!!to[k],read:!!to[k]||(pos["u"+part+"-"+k]||0)>=u.s.length-1})});return out}
let xpFromPath=false;
function xpOpenLesson(k){part=+part||part;les={unit:null,topic:null,idx:0};view="lessons";xpFromPath=true;lesOpen("u",k)}
function xpDom(d){const its=BP(part).filter(i=>i.d==d),f=its.filter(i=>i.t==="f"),q=its.filter(i=>i.t==="q"),fs=f.filter(i=>S.it[i.id]).length,qs=q.filter(i=>S.it[i.id]).length,st=domStats(part,d);
  const need=Math.min(30,Math.max(8,Math.ceil(q.length*0.3))),acc=st.n>=8?st.acc:null,learned=!f.length||fs/f.length>=0.8,practiced=learned&&(!q.length||(qs>=Math.min(need,q.length)&&acc!=null&&acc>=0.7)),strong=practiced&&(!q.length||(qs/q.length>=0.6&&st.n>=20&&st.acc>=0.8));
  const L=xpLes(d),lr=L.filter(u=>u.read).length,ln=L.find(u=>!u.read);
  return{d,L,les:L.length,lesRead:lr,lesNext:ln||null,name:PARTS[part].doms[d][0],w:PARTS[part].doms[d][1],f:f.length,fs,q:q.length,qs,need:Math.min(need,q.length),acc,learned,practiced,strong}}
function xpState(){const D=Object.keys(PARTS[part].doms).map(xpDom),xs=BP(part).filter(i=>i.xs),xsNew=xs.filter(i=>!S.it[i.id]).length,mocks=S.hist.filter(h=>h.p==part&&h.m==="mock"),steps=[];
  D.forEach(x=>{if(x.les)steps.push({k:"les",x,done:x.learned||x.lesRead>=x.les});steps.push({k:"learn",x,done:x.learned});steps.push({k:"prac",x,done:x.practiced})});
  if(xs.length)steps.push({k:"exam",done:!xsNew,xsNew,xs:xs.length});
  steps.push({k:"mock",done:mocks.length>0,last:mocks.length?mocks[mocks.length-1]:null});
  D.forEach(x=>steps.push({k:"strong",x,done:x.strong}));
  return{D,steps,done:steps.filter(s=>s.done).length,xs:xs.length,xsNew,mocks}}
function xpLabel(s){const pc=v=>Math.round(v*100)+"%";
  if(s.k==="les"){const u=s.x.lesNext||s.x.L[0];return{t:`Read: ${u.t}`,d:`Lesson ${Math.min(s.x.lesRead+1,s.x.les)} of ${s.x.les} for ${s.x.name} · ${u.n} slides with diagrams, about ${Math.max(2,Math.round(u.n*1.2))} min`,les:u.k}}
  if(s.k==="learn")return{t:`Learn: ${s.x.name}`,d:`${s.x.fs} of ${s.x.f} facts met · new facts are taught in small groups, then asked`,mode:"easy",filt:s.x.d};
  if(s.k==="prac")return{t:`Practice: ${s.x.name}`,d:`${s.x.qs} of ${s.x.need} questions tried${s.x.acc!=null?" · "+pc(s.x.acc)+" right":""} · 70% moves you on`,mode:"quiz",filt:s.x.d};
  if(s.k==="exam")return{t:"Exam-style pack",d:`${s.xsNew} of ${s.xs} questions written like the real test are still new`,mode:"exam",filt:"all"};
  if(s.k==="mock")return{t:`Take a mock exam · ${xpMockN()} questions`,d:"Timed, mixed topics, scored like the real thing. It shows where to go back.",mock:1};
  return{t:`Make it strong: ${s.x.name}`,d:`${s.x.acc!=null?pc(s.x.acc)+" right":"not enough answers yet"} · ${s.x.qs} of ${s.x.q} questions seen · aim for 80%`,mode:"hard",filt:s.x.d}}
function xpNext(){const st=xpState(),due=dueList(part,"all").length,miss=missedPool(part,"all").length,i=st.steps.findIndex(s=>!s.done),tot=st.steps.length;
  if(due>=25)return{first:1,t:`Review ${due} facts that are due`,d:"Do these before new material, so what you learned stays learned.",mode:"easy",filt:"all",st,i,tot};
  if(miss>=8)return{first:1,t:`Fix your ${miss} misses`,d:"Questions you got wrong and have not yet answered right.",mode:"missed",filt:"all",st,i,tot};
  if(i<0){const w=st.D.slice().sort((a,b)=>(a.acc??0)-(b.acc??0))[0];return{t:"Keep it sharp: smart drill",d:`Every step of the path is done. Weakest topic right now: ${w?w.name:""}.`,qd:"smart",st,i:tot,tot}}
  return Object.assign({st,i,tot,step:st.steps[i]},xpLabel(st.steps[i]))}
function xpRun(a){if(a.les!==undefined){xpOpenLesson(a.les);window.scrollTo(0,0);return}
  if(a.qd){const b=document.createElement("button");b.dataset.qd=a.qd;if(typeof quickClick==="function"&&quickClick(b))return;startSession("qd",S.set.qd||10);return}
  if(a.mock){startSession("mock",xpMockN());return}
  if(a.mode==="easy"&&a.filt!=="all"&&xpLearn(a.filt))return;
  const f0=filt;filt=a.filt;try{startSession(a.mode,a.mode==="exam"?(S.set.qd||10):undefined)}finally{filt=f0}}
/* a Learn step teaches facts: up to 8 due reviews of the topic, then up to 12 new facts in groups of four (shown first, then asked, then asked again in a harder form) */
function xpLearn(d){try{const t=today(),pool=BP(part).filter(i=>i.d==d&&i.t==="f"),due=shuffle(pool.filter(i=>{const r=S.it[i.id];return r&&r[1]<=t})).slice(0,8),nw=pool.filter(i=>!S.it[i.id]).sort((a,b)=>ORDER[a.id]-ORDER[b.id]).slice(0,12);
  if(!nw.length)return false;touchDay();const entries=due.map(i=>mkEntry(i));
  for(let k=0;k<nw.length;k+=4){const ch=nw.slice(k,k+4);entries.push({learn:ch.map(i=>i.id),id:ch[0].id});shuffle(ch.slice()).forEach(i=>entries.push(mkEntry(i)))}
  if(nw.length>=2)shuffle(nw.slice()).forEach(i=>entries.push({id:i.id,lazy:2,final:true}));
  newSess("easy",null,0,entries,nw.map(i=>i.id));return true}catch(_){return false}}
try{document.addEventListener("toggle",e=>{const t=e.target;if(t&&t.classList&&t.classList.contains("xprow")&&t.id)OPEN[t.id]=t.open},true)}catch(_){}
function xpMockN(){return Math.min(25,BP(part).filter(i=>i.t==="q").length)}
doNextHtml=function(){try{if(PARTS[part].bk)return"";const a=xpNext();return `<button class="donext" data-xp="go"><span class="dn1">👉 ${a.first?"DO THIS FIRST TODAY":"DO THIS NEXT"}</span><b>${a.first||a.i>=a.tot?"":`Step ${a.i+1} of ${a.tot} · `}${esc(a.t)}</b><span class="dn2">${esc(a.d)}</span><span class="dn3">Tap here ▶</span></button>`+(PARTS[part].x==="notary"&&typeof notaryPathHtml==="function"?notaryPathHtml():"")}catch(_){return""}};
function xpHtml(){try{if(PARTS[part].bk)return"";const st=xpState(),cur=st.steps.findIndex(s=>!s.done),cs=cur>=0?st.steps[cur]:null,e=esc,chip=(on,now,t)=>`<i class="xpc${on?" on":""}${now?" now":""}">${on?"✓ ":""}${t}</i>`;
  const row=x=>{const now=cs&&cs.x&&cs.x.d===x.d,op=OPEN["xp"+x.d]!==undefined?OPEN["xp"+x.d]:false;return `<details class="xprow${x.strong?" ok":""}${now?" now":""}" id="xp${x.d}" ${op?"open":""}><summary><b>${e(x.name)}</b><span class="xpw">${PARTS[part].x==="caa"?x.q+" questions":x.w+"% of the exam"+(x.dx!=null?" · diagnostic "+Math.round(x.dx*100)+"%":"")}</span><span class="xpcs">${x.les?chip(x.lesDone,now&&cs.k==="les","Lessons"):""}${chip(x.learned,now&&cs.k==="learn","Learn")}${chip(x.practiced,now&&cs.k==="prac",x.parked?"Practice · later":"Practice")}${chip(x.strong,now&&cs.k==="strong","Strong")}</span></summary>
    <div class="xpb"><div class="small muted">${x.fs} of ${x.f} facts met · ${x.qs} of ${x.q} questions tried${x.acc!=null?" · "+Math.round(x.acc*100)+"% right"+(x.qacc!=null?" on questions":""):""}</div><div class="row">${x.les?`<button class="btn small" data-xp="les" data-d="${x.d}">Lessons · ${x.lesRead} of ${x.les} read</button>`:""}<button class="btn small" data-xp="learn" data-d="${x.d}">Learn facts</button><button class="btn small" data-xp="prac" data-d="${x.d}">Practice questions</button><button class="btn small" data-xp="hard" data-d="${x.d}">Hard questions</button></div></div></details>`};
  const ex=st.steps.find(s=>s.k==="exam"),mk=st.steps.find(s=>s.k==="mock");
  return `<section class="section xp"><h3 style="margin:0">${PARTS[part].x==="caa"?"Refresher by topic":"Your study path · "+e(PARTS[part].name||pl(part))}</h3><div class="small muted">${PARTS[part].x==="caa"?"The question bank, topic by topic, for when you want to brush up on one area.":`${st.done} of ${st.steps.length} steps done. ${st.byGain?"The red button goes where you gain most right now.":"Topics are in the exam's own order."} Tap a topic to study it out of turn.`}</div>${xpDxLine()}<div class="cbar"><i style="width:${Math.round(st.done/st.steps.length*100)}%"></i></div>
   ${st.D.map(row).join("")}
   ${ex?`<button class="xprow xpx${ex.done?" ok":""}${cs===ex?" now":""}" data-xp="exam"><b>${ex.done?"✓ ":""}Exam-style pack</b><span class="xpw">${ex.xs-ex.xsNew} of ${ex.xs} done</span></button>`:""}
   <button class="xprow xpx${mk.done?" ok":""}${cs===mk?" now":""}" data-xp="mock"><b>${mk.done?"✓ ":""}Mock exam</b><span class="xpw">${mk.last?`last: ${mk.last.c} of ${mk.last.n} right`:"not taken yet"}</span></button></section>`}catch(_){return""}}
function xpTools(inner){if(!inner)return"";try{if(PARTS[part].bk)return inner}catch(_){}return `<details class="more" id="xptools" ${OPEN.xptools?"open":""}><summary><b>More ways to practice</b><span>${PARTS[part].free?"Quick drill, missed questions, flashcards":"Quick drill, one-tap decision rounds, step-by-step returns"}</span></summary><div class="xptl">${inner}</div></details>`}
const xpExtraClick0=extraClick;extraClick=function(b){const d=b.dataset;if(d.xp===undefined)return xpExtraClick0(b);const a=d.xp;
  if(a==="go"){xpRun(xpNext());return true}
  if(a==="les"){const x=xpDom(isNaN(+d.d)?d.d:+d.d);if(x.les)xpRun({les:(x.lesNext||x.L[0]).k});return true}
  if(a==="dx"){xpDxStart();return true}
  if(a==="nodx"){S.set.xp=S.set.xp||{};S.set.xp["nodx"+part]=1;persist();render();return true}
  if(a==="exam"){xpRun({mode:"exam",filt:"all"});return true}
  if(a==="mock"){xpRun({mock:1});return true}
  if(a==="learn"||a==="prac"||a==="hard"){xpRun({mode:a==="learn"?"easy":a==="prac"?"quiz":"hard",filt:isNaN(+d.d)?d.d:+d.d});return true}
  return true};

/* a lesson opened from the path goes back to the section's main page when it is finished, so the red button shows the next step */
const xpLesGo0=lesGo;lesGo=function(dx){try{if(xpFromPath&&les&&les.unit!=null&&dx>0&&les.idx>=lesLen()-1){hush();lesSave();xpFromPath=false;les=null;view="home";render();window.scrollTo(0,0);return}}catch(_){}return xpLesGo0(dx)};
const xpLesClick0=lessonClick;lessonClick=function(b){if(b&&(b.id==="lestopics"||b.id==="lesback"||(b.dataset&&(b.dataset.lesunit!==undefined||b.dataset.lestopic!==undefined))))xpFromPath=false;return xpLesClick0(b)};

/* ================= Path v2 (Version 166): the path adapts =================
   Checked with simulated learners (weak, average, strong) who only ever tap the red button. Three faults were found:
   (1) a topic's accuracy mixed flash-card reviews with exam questions, so a learner scoring 64% on questions "passed" Practice,
       and the status flipped back and forth as reviews pushed question answers out of the short history;
   (2) a weak learner was sent round a Practice / Fix-misses loop on one topic with no way out;
   (3) once every step was done, the button offered the smart drill forever and never another mock exam.
   What changed:
   - Practice is judged on questions only (70% of the recent ones, at least 8), and once passed it stays passed.
   - Inside a topic the order is now lesson by lesson: read a lesson, learn the facts it covers, take a 10-question quiz on it.
     A lesson with many facts gets a quiz after every two fact sessions, so questions start early and keep coming.
     A quiz under 60% sends you to read that lesson again once, then asks again.
   - After two Practice rounds under the bar, the lesson that holds most of your open misses is offered again. After four,
     the topic is set aside ("Practice · later") so the path keeps moving; it returns in the Make-it-strong stage.
   - After the last step the button rotates: a drill on the weakest topic of your last mock, a longer mock (50, then 100
     questions) about once a week, questions you have never seen, the smart drill, and a final-week review
     when the exam date is within 7 days.
   - The results page shows the next step, so the path can be followed without going back to the main page.
   Saved answers, boxes and schedules are untouched. Path memory lives in S.set.xp. */
/* pace (EA Parts 1 to 3): how soon daily jobs interrupt new material, and how often a lesson is quizzed */
function xpGate(k){const T={due:{steady:25,fast:40,max:60},miss:{steady:8,fast:12,max:16},ul:{steady:2,fast:1,max:1}}[k];let p="steady";try{if(XPU[part])p=S.set.pace||"fast"}catch(_){}return T[p]||T.steady}
function xpMem(d,p){S.set.xp=S.set.xp||{};const k=(p||part)+"-"+d;return S.set.xp[k]||(S.set.xp[k]={})}
function xpPeek(d){return (S.set.xp||{})[part+"-"+d]||{}}
function xpQAcc(st){const b=st.byLv,n=b[2][1]+b[3][1];return n>=8?(b[2][0]+b[3][0])/n:null}
const xpDom1=xpDom;
/* anything already earned under the old rule is kept */
function xpMigrate(){try{if(S.set.xpv===2)return;const p0=part;for(const p in PARTS){if(PARTS[p].bk)continue;part=isNaN(+p)?p:+p;for(const d in PARTS[p].doms){try{const o=xpDom1(d);if(o.practiced)xpMem(d).pd=1;if(o.learned&&o.fs>0)xpMem(d).ld=1}catch(_){}}}part=p0;S.set.xpv=2}catch(_){}}
xpDom=function(d){xpMigrate();const x=xpDom1(d),m=xpPeek(d),st=domStats(part,d),qa=xpQAcc(st);x.qacc=qa;if(qa!=null)x.acc=qa;
  const pass=x.learned&&(!x.q||(x.qs>=x.need&&qa!=null&&qa>=0.7));if(pass&&!m.pd)xpMem(d).pd=1;
  x.practiced=!!(m.pd||pass);x.parked=!x.practiced&&!!m.pk;x.pr=m.pr||0;x.pl=m.pl;
  x.strong=x.practiced&&(!x.q||(x.qs/x.q>=0.6&&st.n>=20&&(qa!=null?qa:st.acc)>=0.8));
  x.lesDone=!x.les||!!m.ld||xpUnitStep(x)===null;return x};
const xpState1=xpState;xpState=function(){const st=xpState1();st.steps.forEach(s=>{if(s.k==="prac")s.done=s.x.practiced||s.x.parked;if(s.k==="les")s.done=s.x.lesDone});st.done=st.steps.filter(s=>s.done).length;return st};
/* lesson by lesson inside a topic */
const XPUC={};/* which facts and questions each lesson covers: worked out once, they never change */
function xpUnitPool(k){const key=part+"-"+k;if(!XPUC[key]){const re=UNITS[part][k].re;XPUC[key]={f:BP(part).filter(i=>i.t==="f"&&re.test(i.f+" "+i.b)),q:BP(part).filter(i=>i.t==="q"&&re.test(i.s+" "+(i.b||"")))}}return XPUC[key]}
function xpUnitFacts(k){return xpUnitPool(k).f}
function xpUnitQs(k){return xpUnitPool(k).q}
function xpUnitStep(x){const m=xpPeek(x.d),uq=m.uq||{},ua=m.ua||{},rr=m.rr||{},ul=m.ul||{};
  for(const u of x.L){const pos=`Lesson ${x.L.indexOf(u)+1} of ${x.les} · ${x.name}`;
    if(u.out)continue;
    if(!u.read&&(m.pc||{})[u.k]===undefined&&xpUnitQs(u.k).length>=8){const N=xpCheckN(u.k);return{t:`Check: ${u.t}`,d:`${N} questions before the lesson. Get ${N-1} right${xpGate("ul")===2?", sure of each,":""} and you skip this lesson and its fact sessions. ${pos}`,pre:u.k,dd:x.d}}
    if(!u.read)return{t:`Read: ${u.t}`,d:`${pos} · ${u.n} slides with diagrams, about ${Math.max(2,Math.round(u.n*1.2))} min`,les:u.k};
    const nf=xpUnitFacts(u.k).filter(i=>!S.it[i.id]).length;
    const hasQ=xpUnitQs(u.k).length>=5;
    if(nf>0&&hasQ&&(ul[u.k]||0)>=xpGate("ul"))return{t:`Quiz: ${u.t}`,d:`10 questions on what you have learned so far · ${nf} facts of this lesson still to come`,unit:u.k,dd:x.d};
    if(nf>0)return{t:`Learn: ${u.t}`,d:`${nf} facts from this lesson are still new · taught in small groups, then asked`,mode:"easy",filt:x.d,ure:u.k};
    if(!uq[u.k]&&hasQ){
      if(ua[u.k]>=1&&!rr[u.k])return{t:`Read again: ${u.t}`,d:"The quiz on this lesson was under 60%. Read it once more, then try the quiz again.",les:u.k,rr:1,dd:x.d};
      return{t:`Quiz: ${u.t}`,d:`10 questions on the lesson you just studied · ${pos}`,unit:u.k,dd:x.d,fin:1}}}
  return null}
function xpStuck(x){const m=xpPeek(x.d);if(!x.les||(m.pr||0)<2||(m.rp||0)>=m.pr)return null;
  const miss=new Set(missedPool(part,"all").filter(i=>i.t==="q").map(i=>i.id));let best=null;x.L.forEach(u=>{const n=xpUnitQs(u.k).filter(i=>miss.has(i.id)).length;if(n&&(!best||n>best.n))best={u,n}});
  if(!best)return null;return{t:`Read again: ${best.u.t}`,d:`Last practice round: ${m.pl}% right. ${best.n} of your open misses come from this lesson.`,les:best.u.k,rp:1,dd:x.d}}
function xpAfter(st,tot){const now=Date.now(),H=S.hist.filter(h=>h.p==part),mocks=H.filter(h=>h.m==="mock"),lm=mocks[mocks.length-1],since=lm?H.slice(H.lastIndexOf(lm)+1).length:H.length,last=H[H.length-1];
  const base={st,i:tot,tot},dl=typeof daysTo==="function"?daysTo(examDate(part)):null,qn=BP(part).filter(i=>i.t==="q").length;
  if(dl!=null&&dl>=0&&dl<=7&&!H.some(h=>h.m==="final"&&now-h.t<2*864e5))return Object.assign({t:"Final-week review",d:`Your exam is ${dl===0?"today":dl===1?"tomorrow":"in "+dl+" days"}. Your misses, your hardest facts, then exam-style questions from your two weakest topics.`,mode:"final",filt:"all"},base);
  if(lm&&last===lm&&typeof mockWeak==="function"){const w=mockWeak(part);if(w&&w.a<0.75)return Object.assign({t:`From your mock: ${PARTS[part].doms[w.d][0]}`,d:`You got ${w.c} of ${w.n} right there in your recent mocks, your lowest topic. Hard questions on it now.`,mode:"hard",filt:isNaN(+w.d)?w.d:+w.d},base)}
  if(!lm||now-lm.t>7*864e5||(since>=15&&now-lm.t>3*864e5)){const n=Math.min(mocks.length<2?50:100,qn);return Object.assign({t:`Mock exam · ${n} questions`,d:`Timed and scored like the real thing, about ${Math.round(n*mpq(part))} min. ${lm?`Last mock: ${lm.c} of ${lm.n} right.`:""}`,mock:n},base)}
  const un=BP(part).filter(i=>i.t==="q"&&!S.it[i.id]);
  if(un.length>=10&&last&&last.m==="qd")return Object.assign({t:`New questions · ${un.length} you have not seen`,d:"Ten questions you have never answered, so nothing on exam day is a first sight.",unseen:1},base);
  const w=st.D.slice().sort((a,b)=>(a.acc??0)-(b.acc??0))[0];return Object.assign({t:"Keep it sharp: smart drill",d:`Every step of the path is done. Weakest topic right now: ${w?w.name:""}.`,qd:"smart"},base)}
const xpNext1=xpNext;xpNext=function(){const st=xpState(),due=dueList(part,"all").length,miss=missedPool(part,"all").length,i=st.steps.findIndex(s=>!s.done),tot=st.steps.length;
  const s=i>=0?st.steps[i]:null,base={st,i,tot,step:s};
  /* going back to a lesson comes before re-drilling the misses it would explain */
  if(s&&s.k==="les"){const a=xpUnitStep(s.x);if(a&&a.rr)return Object.assign(a,base)}
  if(s&&s.k==="prac"){const a=xpStuck(s.x);if(a)return Object.assign(a,base)}
  if(due>=xpGate("due")||miss>=xpGate("miss"))return xpNext1();
  if(i<0)return xpAfter(st,tot);
  if(s.k==="les"){const a=xpUnitStep(s.x);if(a)return Object.assign(a,base)}
  if(s.k==="prac"){
    if(s.x.pr>=1&&s.x.pl!=null){const l=xpLabel(s);l.d=`Round ${s.x.pr+1} · last round ${s.x.pl}% right · 70% on questions moves you on`;return Object.assign(base,l)}}
  return Object.assign(base,xpLabel(s))};
const xpLearn1=xpLearn;
function xpLearnUnit(d,k){try{const t=today(),pool=xpUnitFacts(k),topic=BP(part).filter(i=>i.d==d&&i.t==="f"),due=shuffle(topic.filter(i=>{const r=S.it[i.id];return r&&r[1]<=t})).slice(0,8),nw=pool.filter(i=>!S.it[i.id]).sort((a,b)=>ORDER[a.id]-ORDER[b.id]).slice(0,12);
  if(!nw.length)return false;touchDay();const entries=due.map(i=>mkEntry(i));
  for(let j=0;j<nw.length;j+=4){const ch=nw.slice(j,j+4);entries.push({learn:ch.map(i=>i.id),id:ch[0].id});shuffle(ch.slice()).forEach(i=>entries.push(mkEntry(i)))}
  if(nw.length>=2)shuffle(nw.slice()).forEach(i=>entries.push({id:i.id,lazy:2,final:true}));
  newSess("easy",null,0,entries,nw.map(i=>i.id));return true}catch(_){return false}}
const xpRun1=xpRun;xpRun=function(a){const tag=c=>{try{if(sess&&view==="session")sess.xp=c}catch(_){}};
  if(a.les!==undefined&&(a.rr||a.rp)){const m=xpMem(a.dd);if(a.rr){m.rr=m.rr||{};m.rr[a.les]=1}if(a.rp)m.rp=m.pr||0;persist()}
  if(a.unit!==undefined){unitRe=UNITS[part][a.unit].re;const qs=xpUnitQs(a.unit),ez=weightPick(qs.filter(i=>(i.lv||2)<=2),7);let q=ez.concat(weightPick(qs.filter(i=>!ez.includes(i)),10-ez.length));
    if(q.length<10)q=q.concat(weightPick(xpUnitFacts(a.unit),10-q.length));newSess("unit",shuffle(q));tag({k:"uq",d:a.dd,u:a.unit,fin:a.fin});return}
  if(a.ure!==undefined){if(xpLearnUnit(a.filt,a.ure)){tag({k:"ul",d:a.filt,u:a.ure});return}}
  if(a.mock&&a.mock>1){startSession("mock",a.mock);return}
  if(a.unseen){const un=shuffle(BP(part).filter(i=>i.t==="q"&&!S.it[i.id])).slice(0,10);if(un.length){newSess("quiz",un);return}}
  xpRun1(a);if(a.step&&a.step.k==="prac"&&a.mode==="quiz")tag({k:"prac",d:a.step.x.d})};
const xpFinish0=finish;finish=function(){try{const s=sess,c=s&&s.xp;if(c&&s.done>=5){const m=xpMem(c.d),pct=s.correct/s.done;
    if(c.k==="ul"){m.ul=m.ul||{};m.ul[c.u]=(m.ul[c.u]||0)+1}
    if(c.k==="uq"){m.ul=m.ul||{};m.ul[c.u]=0;if(c.fin){m.ua=m.ua||{};m.uq=m.uq||{};m.ua[c.u]=(m.ua[c.u]||0)+1;if(pct>=0.6||m.ua[c.u]>=2)m.uq[c.u]=1}}
    if(c.k==="prac"){m.pr=(m.pr||0)+1;m.pl=Math.round(pct*100);const x=xpDom(c.d);if(!x.practiced&&m.pr>=4)m.pk=1}
    s.xp=null}}catch(_){}return xpFinish0.apply(this,arguments)};
/* the results page carries the next step */
const xpResults0=renderResults;renderResults=function(){xpResults0.apply(this,arguments);try{if(PARTS[part].bk||PARTS[part].x==="caa")return;const h=document.querySelector("#view #home");if(!h)return;const a=xpNext();
  h.closest(".row").insertAdjacentHTML("beforebegin",`<button class="donext xpnx" data-xp="go"><span class="dn1">👉 ${a.first?"DO THIS FIRST":"NEXT STEP"}</span><b>${esc(a.t)}</b><span class="dn2">${esc(a.d)}</span><span class="dn3">Tap here ▶</span></button>`);h.classList.remove("pri")}catch(_){}};

/* ================= Diagnostics (Version 166): skip what is already known, start where the gain is biggest =================
   1. Diagnostic test for EA Parts 1 to 3: 24 questions spread over the topics. It adapts as you go: a right answer brings a
      harder question on that topic, a wrong one an easier one. The result is a score per topic (harder questions weigh more,
      a right answer marked "Guessing" counts half). From then on the red button works through the topics in order of
      exam weight x what is missing, instead of the exam's own order. The topic list stays in the exam's order.
   2. A check before every lesson: 5 questions, or 8 when the lesson covers 40 or more facts. All but one right, each
      marked "Sure", and the lesson is skipped with its fact sessions and quiz. The facts it covers are not thrown away: they are placed on the review schedule 3 to 9 days out,
      so each one is still confirmed once, and a miss at that point sends it back to be learned properly.
   3. Questions met for the first time in a diagnostic or a check and answered wrong are not kept as "misses": they were
      never taught. They come back later as new questions. The answers still count toward the topic's accuracy. */
const XPW={1:1,2:2,3:3};
function xpDx(){return XPU[part]?((S.set.xp||{})["dx"+part]||null):null}
function xpDxLine(){try{if(!XPU[part])return"";const r=xpDx();return `<div class="row xpdx"><button class="btn small" data-xp="dx">${r?"Run the diagnostic again":"🩺 Diagnostic · 24 questions"}</button><span class="small muted">${r?`Last result: ${Math.round(r.s*100)}% · sets the order of the red button`:"Finds what you already know, so you skip it."}</span>${!r&&xpAnswered()<40&&!(S.set.xp||{})["nodx"+part]?`<button class="btn ghost small" data-xp="nodx">Skip it</button>`:""}</div>`}catch(_){return""}}
function xpDxPick(d,lv,used){const ok=i=>i.p==part&&i.d==d&&i.t==="q"&&i.opts&&i.opts.length===4&&!used.includes(i.id);let pool=BANK.filter(i=>ok(i)&&(i.lv||2)===lv);if(!pool.length)pool=BANK.filter(ok);const un=pool.filter(i=>!S.it[i.id]);return shuffle(un.length?un:pool)[0]}
function xpDxStart(){const doms=Object.keys(PARTS[part].doms),per=Math.max(4,Math.round(24/doms.length)),used=[],by={},q=[];
  doms.forEach(d=>{by[d]=[];for(let k=0;k<per;k++){const i=xpDxPick(d,2,used);if(i){used.push(i.id);by[d].push(i)}}});
  for(let k=0;k<per;k++)doms.forEach(d=>{if(by[d][k])q.push(by[d][k])});if(!q.length)return;
  newSess("quiz",q);const lv={},res={};doms.forEach(d=>{lv[d]=2;res[d]=[]});sess.xp={k:"dx",lv,res,used,isNew:{}};sess.title="Diagnostic";q.forEach(i=>{if(!S.it[i.id])sess.xp.isNew[i.id]=1});render()}
function xpCheckN(k){return xpUnitFacts(k).length>=40&&xpUnitQs(k).length>=12?8:5} /* a lesson that covers many facts needs a longer check */
function xpCheckStart(a){const N=xpCheckN(a.pre),qs=xpUnitQs(a.pre),un=qs.filter(i=>!S.it[i.id]),src=un.length>=N?un:qs,take=(lv,n,got)=>shuffle(src.filter(i=>(i.lv||2)===lv&&!got.includes(i))).slice(0,n);
  let q=take(2,Math.ceil(N*.6),[]);q=q.concat(take(3,N-q.length,q));if(q.length<N)q=q.concat(shuffle(src.filter(i=>!q.includes(i))).slice(0,N-q.length));
  newSess("quiz",shuffle(q));sess.xp={k:"pc",d:a.dd,u:a.pre,sure:0,need:q.length-1,n:q.length,isNew:{}};sess.title="Lesson check";q.forEach(i=>{if(!S.it[i.id])sess.xp.isNew[i.id]=1});render()}
/* each answer in the diagnostic moves that topic's next question up or down a level */
const xpRecord0=record;record=function(ok,conf){const s=sess,c=s&&s.xp,cur=s&&s.queue[s.pos],it=cur&&BYID[cur.id];const r=xpRecord0.apply(this,arguments);
  try{if(c&&it){if(c.k==="pc"&&ok&&conf)c.sure++;
    if(c.k==="dx"){const d=String(it.d),l=it.lv||2;c.res[d].push([l,ok?(conf?1:0.5):0]);c.lv[d]=Math.max(1,Math.min(3,l+(ok&&conf?1:ok?0:-1)));
      const j=s.queue.findIndex((e,k)=>k>s.pos&&String(BYID[e.id].d)===d);if(j>0){const n=xpDxPick(d,c.lv[d],c.used);if(n){c.used.push(n.id);if(!S.it[n.id])c.isNew[n.id]=1;s.queue[j]=mkEntry(n)}}}}}catch(_){}return r};
function xpForgetNewMisses(s){try{Object.keys(s.xp.isNew||{}).forEach(id=>{const r=S.it[id];if(r&&r[4]===0&&r[2]<=1)delete S.it[id]})}catch(_){}}
const xpFinish1=finish;finish=function(){try{const s=sess,c=s&&s.xp;
  if(c&&c.k==="dx"&&s.done>=Math.min(12,s.queue.length)){const D={};let W=0,G=0;for(const d in c.res){let w=0,g=0;c.res[d].forEach(([l,v])=>{w+=XPW[l];g+=XPW[l]*v});if(w){D[d]=[g/w,c.res[d].length];const wt=PARTS[part].doms[d][1];W+=wt;G+=wt*g/w}}
    S.set.xp=S.set.xp||{};S.set.xp["dx"+part]={t:Date.now(),d:D,s:W?G/W:0,n:s.done};s.dxDone=1;xpForgetNewMisses(s);s.xp=null}
  if(c&&c.k==="pc"&&s.done>=c.n){const m=xpMem(c.d);m.pc=m.pc||{};m.pc[c.u]=c.sure;
    if(c.sure>=c.need){m.to=m.to||{};m.to[c.u]=1;const t=today();let k=0;xpUnitFacts(c.u).forEach(i=>{if(!S.it[i.id]){S.it[i.id]=[2,t+3+(k++%7),0,0,1,0]}});s.pcDone={pass:1,facts:k,u:c.u,n:c.n,need:c.need}}else s.pcDone={pass:0,sure:c.sure,u:c.u,n:c.n,need:c.need};
    xpForgetNewMisses(s);s.xp=null}}catch(_){}return xpFinish1.apply(this,arguments)};
/* the red button: diagnostic first for a new learner; after it, topics in order of weight x gap */
function xpAnswered(){let n=0;for(const i of BANK)if(i.p==part&&i.t==="q"&&S.it[i.id])n++;return n}
const xpDom2=xpDom;xpDom=function(d){const x=xpDom2(d),r=xpDx();x.dx=r&&r.d[d]?r.d[d][0]:null;x.gain=x.dx==null?null:x.w*(1-x.dx);return x};
const xpState2=xpState;xpState=function(){const st=xpState2();if(xpDx()&&st.D.every(x=>x.gain!=null)){const rank={};st.D.slice().sort((a,b)=>b.gain-a.gain).forEach((x,k)=>rank[x.d]=k);const ord={les:0,learn:1,prac:2,exam:3,mock:4,strong:5},grp=s=>s.k==="exam"?1:s.k==="mock"?2:s.k==="strong"?3:0;
    st.steps=st.steps.map((s,k)=>({s,k})).sort((a,b)=>grp(a.s)-grp(b.s)||(a.s.x&&b.s.x?rank[a.s.x.d]-rank[b.s.x.d]:0)||ord[a.s.k]-ord[b.s.k]||a.k-b.k).map(o=>o.s)}return st};
const xpNext2=xpNext;xpNext=function(){const a=xpNext2();try{if(XPU[part]&&!xpDx()&&!a.first&&xpAnswered()<40&&!(S.set.xp||{})["nodx"+part]){const st=a.st||xpState();
    return{st,i:a.i,tot:a.tot,t:"Start with the diagnostic · 24 questions",d:"About 15 minutes. It finds what you already know, so the path skips it and begins where you gain the most.",dxgo:1}}}catch(_){}return a};
const xpRun2=xpRun;xpRun=function(a){if(a.dxgo){xpDxStart();return}if(a.pre!==undefined){xpCheckStart(a);return}return xpRun2(a)};
/* results page: what the diagnostic or the check found */
const xpResults1=renderResults;renderResults=function(){xpResults1.apply(this,arguments);try{const s=sess,h=document.querySelector("#view .xpnx")||document.querySelector("#view #home");if(!s||!h)return;let html="";
  if(s.dxDone){const r=xpDx(),st=xpState(),order=st.D.slice().sort((a,b)=>(b.gain||0)-(a.gain||0));
    html=`<div class="dxr"><b>Your diagnostic · ${Math.round(r.s*100)}% overall</b><div class="small muted">Weighted by the exam's topic sizes. Harder questions count more. About 70% is the passing range.</div>${st.D.map(x=>{const v=x.dx==null?0:x.dx,cls=v>=0.75?"ok":v>=0.5?"mid":"bad";return `<div class="dxrow"><span>${esc(x.name)}</span><b class="${cls}">${Math.round(v*100)}% · ${v>=0.75?"strong":v>=0.5?"building":"weak"}</b><i><em class="${cls}" style="width:${Math.max(4,Math.round(v*100))}%"></em></i></div>`}).join("")}<div class="small">The red button now starts with <b>${esc(order[0].name)}</b>, then ${esc(order.slice(1,3).map(x=>x.name).join(", then "))}. Before each lesson a 5-question check lets you skip it. Questions you missed here are not counted as misses.</div></div>`}
  if(s.pcDone){const u=UNITS[part][s.pcDone.u];html=`<div class="dxr"><b>${s.pcDone.pass?"Lesson skipped: "+esc(u.t):"Not yet: "+esc(u.t)}</b><div class="small">${s.pcDone.pass?`You got at least ${s.pcDone.need} of ${s.pcDone.n} right. ${s.pcDone.facts} facts from this lesson are placed on your review schedule over the next 9 days, so each is still confirmed once.`:`${s.pcDone.sure} of ${s.pcDone.n} right (${s.pcDone.need} skips the lesson). Reading the lesson is the next step.`}</div></div>`}
  if(html)h.insertAdjacentHTML("beforebegin",html)}catch(_){}};
