/* ================= Daily Brain Warm-up, coverage map, report card =================
   - Every new session (first open of the day, or back after 45+ minutes) starts with a Brain Warm-up:
     at least 5 minutes and 10 answers of mixed questions. Untouched areas come first, then weak ones.
     Games, quizzes and lessons stay locked until it's done (the grown-up unlock skips it).
   - It counts like any quiz: subject levels, grade levels, topic badges, tickets, Mission Path credit.
   - Coverage map: every knowledge area, with untouched / started / strong. Report card with grade per subject. */
const KWARM_SEC=300,KWARM_N=10,KWARM_GAP=45*60000;
const KWARM_BLOCK=["ast","chess","chessbot","city","cityGo","col","drive","fly","land","learn","mc","mine","mj","music","poker","powers","show","term","club","genius"];
function kWarmAdult(){return (KS().adultUntil||0)>Date.now()}
function kWarmNeeded(){const k=KS();return !!(k.setup&&k.warm&&!k.warm.done&&!kWarmAdult())}
function kWarmCheck(){try{const k=KS();if(!k.setup)return;const now=Date.now(),gap=now-(k.lastSeen||0),day=kToday();
  if(!k.warm||gap>KWARM_GAP||k.warm.day!==day){if(!k.warm||k.warm.done||k.warm.day!==day||gap>KWARM_GAP)k.warmN=(k.warmN||0)+1;k.warm={day,start:now,sec:0,n:0,ok:0,done:0,last:[],p0:kPathDoneN(),kind:["les","gui","term"][k.warmN%3],c0:kCompSum()}}k.lastSeen=now;persist()}catch(_){}}
setTimeout(()=>{if(typeof KS==="function"&&document.querySelector(".kids")){kWarmCheck();if(kWarmNeeded()&&KV&&(KV.scr||"home")==="home")render()}},400);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&document.querySelector(".kids")){const was=kWarmNeeded();kWarmCheck();if(!was&&kWarmNeeded()){KV={scr:"home"};render()}}});
let kWarmTick=0;setInterval(()=>{try{if(typeof KS!=="function"||document.visibilityState!=="visible"||!document.querySelector(".kids"))return;const k=KS();kWarmTick++;if(kWarmTick%20===0){k.lastSeen=Date.now()}
  if(k.warm&&!k.warm.done&&((KV.scr==="show"&&KV.cat==="warm"&&KV.stage==="play")||(KV.scr==="learn"&&KV.les)||["gui","term","body","hosp","cyber","court","biz","circ"].includes(KV.scr))){k.warm.sec++;if(!k.warm.les&&kCompSum()>(k.warm.c0||0)){k.warm.les=1;kT("✅ Computer task done! Now: mixed warm-up questions.")}const b=document.querySelector(".kwarmbar");if(b)b.outerHTML=kWarmBar();if(k.warm.sec>=KWARM_SEC&&k.warm.n>=KWARM_N&&k.warm.les)kWarmDone()}}catch(_){}},1000);
function kWarmDone(){const k=KS();if(!k.warm||k.warm.done)return;k.warm.done=1;k.warmDays=k.warmDays||{};k.warmDays[kToday()]=1;kTix(2,"Brain Warm-up");try{kRotDone("q:warm")}catch(_){}
  let st=0;for(let i=0;i<400;i++){if(k.warmDays[kToday(-i)])st++;else if(i>0)break}kTrophy("warm1","🌅","Warm brain!","Finished a Brain Warm-up.");if(st>=7)kTrophy("warm7","🔥","7-day warm-up streak!","Warmed up 7 days in a row.");
  persist();kT(`🌅 Warm-up complete! +2 🎟️ · Everything is open. ${st>1?"🔥 "+st+"-day streak!":""}`);kLine("Warm up complete! Everything is open now. Great job!",4);kBeep("levelup")}
function kWarmLeft(){const w=KS().warm||{sec:0,n:0};const s=Math.max(0,KWARM_SEC-w.sec);return{s,mm:Math.floor(s/60)+":"+String(s%60).padStart(2,"0"),n:Math.max(0,KWARM_N-w.n),p:Math.min(1,(w.sec/KWARM_SEC+Math.min(1,w.n/KWARM_N))/2)}}
function kWarmBar(){const L=kWarmLeft(),w=KS().warm||{};return `<div class="kwarmbar"><span>🌅 Warm-up</span><i><u style="width:${Math.round(L.p*100)}%"></u></i><b>${L.s?"⏱️ "+L.mm:"✅ time"} · ${L.n?L.n+" more":"✅ answers"}</b></div>`}
function kWarmOpts(){const k=KS(),o=[];try{const n=kWarmNextLes();if(n){const T=KLT.find(x=>x[0]===n[0]);o.push({a:`data-kwles="${n[0]}:${n[1]}"`,ic:"📖",t:"Genius Lesson",s:`${T[1]} ${T[2]}: ${KLESS[n[0]][n[1]][0]}`})}}catch(_){}
  try{const os=["win","mac","mint"].filter(x=>kGuiLv(x)<KGM.length).sort((a,b)=>kGuiLv(a)-kGuiLv(b))[0];if(os&&(k.warmN||0)%2===0)o.push({a:`data-kwgui="${os}"`,ic:"🖥️",t:"Desktop Lab task",s:`One real task on ${KGN[os].nm}`});else{const t=kWarmTermOs();o.push({a:`data-kwterm="${t}"`,ic:"💻",t:"Terminal mission",s:`${KOS[t][0]} ${KOS[t][1]}`})}}catch(_){}
  try{const J=kJobNext();if(J)o.push({a:`data-kj="${J[6]}"`,ic:J[1],t:J[2],s:`${J[3]}: one round of the real job`})}catch(_){}
  const r=(k.warmN||0)%Math.max(1,o.length);return o.slice(r).concat(o.slice(0,r))}
function kWarmOptBtns(){return kWarmOpts().map((x,i)=>`<button class="kwopt ${i===0?"rec":""}" ${x.a}><span>${x.ic}</span><div><b>${esc(x.t)}${i===0?" <u>recommended</u>":""}</b><em>${esc(x.s)}</em></div></button>`).join("")}
function kWarmCard(){const strip=kPlanStrip();if(!kWarmNeeded())return strip;const L=kWarmLeft(),ls=kWarmLesStep();
  const bar=`<span class="kwp"><i><u style="width:${Math.round(L.p*100)}%"></u></i><em>${L.s?"⏱️ "+L.mm+" left":"✅ time done"} · ${L.n?L.n+" answers to go":"✅ answers done"}</em></span>`;
  if(ls)return strip+`<div class="kwarmcard kwch"><span class="kwt"><b>🌅 Brain Warm-up · Step 1 of 2: you choose</b><span>Pick one. Then mixed questions, then everything opens. It all counts for levels and 🎟️.</span>${kWarmOptBtns()}${bar}</span></div>`;
  return strip+`<button class="kwarmcard" data-kcat="warm"><span class="kwi">🌅</span><span class="kwt"><b>Brain Warm-up · Step 2 of 2</b><span>🎲 Mixed questions from every subject. Then everything opens!</span>${bar}</span><span class="kwgo">▶</span></button>`}
function kWarmShow(){document.querySelectorAll(".kpassov").forEach(x=>x.remove());const L=kWarmLeft(),o=document.createElement("div");o.className="kpassov";
  o.innerHTML=`<div class="kpassc"><div style="font-size:46px">🌅</div><div class="kh" style="margin:4px 0">Brain Warm-up first!</div><div class="small" style="margin-bottom:12px">${L.mm} and ${L.n} more answers of mixed questions. Then everything opens, and it counts for your levels and 🎟️ tickets.</div>
   ${kWarmLesStep()?`<div class="ksmall" style="margin-bottom:6px">Step 1: pick one</div>${kWarmOptBtns()}`:`<button class="kbtn green" data-kcat="warm" style="width:100%">▶ ${KS().warm.n?"Continue":"Start"} warm-up questions</button>`}<button class="kbtn ghost" data-kpass="no" style="width:100%;margin-top:8px">OK</button></div>`;
  (document.getElementById("view")||document.body).appendChild(o)}
function kWarmGate(d){if(!d||!kWarmNeeded())return false;if(d.kcat==="warm"){const ls=kWarmLesStep();if(ls){setTimeout(()=>kWarmShow(),0);kBeep("no");return true}return false}const block=(d.k&&KWARM_BLOCK.includes(d.k))||(d.kcat&&d.kcat!=="warm")||(d.ktw&&["mz","hack"].includes(d.ktw))||d.kltr||d.ctgo||d.kfm!==undefined;
  if(!block)return false;kBeep("no");kLine("Brain warm up first! Then everything opens.",2);setTimeout(kWarmShow,0);return true}
/* ---------- coverage: every knowledge area ---------- */
function kCovAreas(){const A=[];
  for(const c of KCATS){if(["mix","brain","genius","warm"].includes(c[0])||(typeof KHEROIDS!=="undefined"&&KHEROIDS.has(c[0])))continue;A.push({id:"q:"+c[0],ic:c[1],n:c[2],kind:"quiz",cat:c[0],sub:c[4]})}
  for(const H of KHERO)A.push({id:"h:"+H[0],ic:H[1],n:H[2],kind:"hero",hero:H[0]});
  for(const T of KLT)A.push({id:"l:"+T[0],ic:T[1],n:T[2],kind:"les",tr:T[0]});
  for(const o in KOS)A.push({id:"t:"+o,ic:KOS[o][0],n:KOS[o][1]+" terminal",kind:"term",os:o});
  if(typeof KGN!=="undefined")for(const o in KGN)A.push({id:"g:"+o,ic:"🖥️",n:KGN[o].nm+" desktop tasks",kind:"gui",os:o});
  if(typeof KJOBS!=="undefined")for(const J of KJOBS)A.push({id:"j:"+J[0],ic:J[1],n:J[2],kind:"job",job:J[0]});
  for(const o of["win","mac","mint"])A.push({id:"k:"+o,ic:"⌨️",n:KDNAME[o]+" shortcuts",kind:"desk",os:o});
  return A}
function kCovStat(a){const k=KS(),r=(k.covr||{})[a.id]||{n:0,c:0};
  if(a.kind==="hero"){const h=(k.hero||{})[a.hero]||{};r.n=Math.max(r.n,h.n||0);r.c=Math.max(r.c,h.c||0)}
  if(a.kind==="les"){let d=0;try{const L=kLearnState();d=[0,1,2,3].filter(i=>L.done[a.tr+i]).length}catch(_){}return{n:d,st:d===0?0:d>=4?2:1,lab:`${d}/4 lessons`}}
  if(a.kind==="term"){const lv=(k.term&&k.term[tKeyOf(a.os)])||0;return{n:lv,st:lv===0?0:lv>=6?2:1,lab:lv?`level ${lv}`:"not started"}}
  if(a.kind==="job"){const n=((KS().jobs||{})[a.job]||{}).n||0;return{n,st:n===0?0:n>=6?2:1,lab:`${n} round${n===1?"":"s"}`}}
  if(a.kind==="gui"){const lv=kGuiLv(a.os);return{n:lv,st:lv===0?0:lv>=KGM.length?2:1,lab:`${lv}/${KGM.length} tasks`}}
  if(a.kind==="desk"){const lv=kDeskLv(a.os);return{n:lv,st:lv===0?0:lv>=KDESK[a.os].length?2:1,lab:`${lv}/${KDESK[a.os].length} shortcuts`}}
  const p=r.n?Math.round(r.c/r.n*100):null;return{n:r.n,p,st:r.n===0?0:(r.n>=8&&p>=70)?2:1,lab:r.n?`${r.n} answered · ${p}%`:"not tried"}}
function kCovMark(ok){try{const g=KV,Q=g.Q;if(!Q)return;const id=Q.area||(Q.hero?"h:"+Q.hero:"q:"+(g.cat||"mix"));const k=KS();k.covr=k.covr||{};const r=k.covr[id]=k.covr[id]||{n:0,c:0};r.n++;if(ok)r.c++;if(g.cat==="warm"&&k.warm&&!k.warm.done){k.warm.n++;if(ok)k.warm.ok++}}catch(_){}}
function kWarmPick(){const k=KS(),w=k.warm||{last:[]},A=kCovAreas().filter(a=>a.kind==="quiz"||a.kind==="hero");
  const sc=A.map(a=>{const s=kCovStat(a);let x=s.st===0?8:s.n<5?3:1;if(s.p!=null&&s.p<60)x*=2.5;if((w.last||[]).includes(a.id))x*=.05;return x});let t=sc.reduce((p,c)=>p+c,0)*Math.random(),i=0;for(;i<A.length;i++){t-=sc[i];if(t<=0)break}
  const a=A[Math.min(i,A.length-1)];w.last=(w.last||[]).concat(a.id).slice(-4);return a}
function kWarmQ(){const g=KV,a=kWarmPick();let Q;if(a.kind==="hero"){Q=kHeroQ(a.hero);if(Q.lv==null)Q.lv=Math.floor((((KS().hero||{})[a.hero]||{}).c||0)/5)+1}else{const sc=["flags","maps","space","bee","tesla","spacex"].includes(a.cat)?a.cat:"";Q=kQ(a.sub,sc)}Q.area=a.id;Q.areaN=a.ic+" "+a.n;g.Q=Q;g.ans=null;KV.lock=null;g.Q.t0=0}
function kWarmHook(v){try{if(["learn","gui","term","body","hosp","cyber","court","biz","circ"].includes(KV.scr)&&kWarmNeeded()){const host=v.querySelector(".kids");if(host&&!host.querySelector(".kwarmtop")){const w=KS().warm,d=document.createElement("div");d.className="kwarmtop";d.innerHTML=kWarmBar()+(w.les?`<button class="kbtn green" data-kcat="warm" style="width:100%;margin:6px 0">✅ Lesson done! ▶ Step 2: mixed warm-up questions</button>`:`<div class="kwarea">${KV.scr==="learn"?"📖 Warm-up step 1: pass this lesson (3 cards + 2 questions)":KV.scr==="gui"?"🖥️ Warm-up step 1: finish one real task below":KV.scr==="term"?"💻 Warm-up step 1: finish one terminal mission":"🧑‍🚀 Warm-up step 1: finish one round of this job"}</div>`);const t=host.querySelector(".ktop");t?t.after(d):host.prepend(d)}}
  if(KV.scr==="show"&&KV.cat==="warm"){const host=v.querySelector(".kids");if(host&&!host.querySelector(".kwarmtop")){const d=document.createElement("div");d.className="kwarmtop";d.innerHTML=(kWarmNeeded()?kWarmBar():`<div class="kwarmbar done"><span>🌅 Warm-up done!</span><b>Extra rounds still count 🎟️</b></div>`)+(KV.Q&&KV.Q.areaN&&KV.stage==="play"?`<div class="kwarea">🧭 ${esc(KV.Q.areaN)}</div>`:"");const t=host.querySelector(".ktop");t?t.after(d):host.prepend(d)}}}catch(_){}}
/* ---------- report card (home) and coverage map (Learning Center) ---------- */
function kReportCard(){const b=kBrain(),k=KS(),A=kCovAreas(),S=A.map(kCovStat),tch=S.filter(s=>s.st>0).length;
  return `<button class="krepcard" data-k="learnhub"><span class="krg"><b>${b.known?kOrd(b.g):"?"}</b><span>grade</span></span><span class="krt"><b>🎓 Overall: ${b.known?kOrd(b.g)+"-grade level":"brain scan needed"}</b>
   <span class="krsubs">${b.rows.map(r=>`<i class="${r.known?"":"unk"}">${r.ic} ${r.known?"Gr "+kGrade(r.lv):"?"}</i>`).join("")}</span><span class="krcov">🧭 ${tch} of ${A.length} areas explored · ${k.qn||0} answers</span></span><span class="kwgo">▶</span></button>`}
function kCovHtml(){const A=kCovAreas(),S=A.map(kCovStat),tch=S.filter(s=>s.st>0).length,strong=S.filter(s=>s.st===2).length;
  const groups=[["quiz","🎤 Quiz subjects"],["hero","🦸 Professions, military & history"],["les","🎓 Genius Lessons"],["term","💻 Computer Academy: terminals"],["job","🧑‍🚀 Career Labs: real jobs"],["gui","🖥️ Desktop Lab: real tasks"],["desk","⌨️ Keyboard shortcuts"]];
  return `<div class="kcard"><div class="kh">🧭 Explorer map</div><div class="ksmall" style="margin-bottom:8px">${tch} of ${A.length} areas explored · ${strong} strong. Gray ones are new: the Brain Warm-up brings them to you first.</div>
   <div class="kcovbar"><u style="width:${Math.round(strong/A.length*100)}%" class="s"></u><u style="width:${Math.round((tch-strong)/A.length*100)}%" class="m"></u></div>
   ${groups.map(([g,t])=>`<div class="kcovh">${t}</div><div class="kcovg">${A.map((a,i)=>[a,S[i]]).filter(([a])=>a.kind===g).map(([a,s])=>`<span class="kcov st${s.st}"><b>${a.ic}</b><span>${esc(a.n)}</span><em>${esc(s.lab)}</em></span>`).join("")}</div>`).join("")}</div>`}
/* ---------- warm-up step 1: one Genius Lesson from the least-touched track ---------- */
KCATS.push(["warm","🌅","Brain Warm-up","Mixed: every subject","mix"]);if(typeof KHEROIDS!=="undefined")KHEROIDS.add("warm");
function kWarmNextLes(){try{const L=kLearnState(),c=KLT.map(T=>[T[0],[0,1,2,3].filter(i=>L.done[T[0]+i]).length]).filter(x=>x[1]<4&&KLESS[x[0]]);if(!c.length)return null;const m=Math.min(...c.map(x=>x[1])),pool=c.filter(x=>x[1]===m),t=pool[Math.floor(Math.random()*pool.length)];return[t[0],t[1]]}catch(_){return null}}
function kCompSum(){const T=KS().term||{},d=T.desk||{},g=T.gui||{};return["lv","lvw","lvt","lvx","lvm"].reduce((a,x)=>a+(T[x]||0),0)+(d.win||0)+(d.mac||0)+(d.mint||0)+(g.win||0)+(g.mac||0)+(g.mint||0)}
function kWarmLesStep(){const w=KS().warm;if(!w||w.les)return null;if(w.lp)return w.lp;let kind=w.kind||"les";
  if(kind==="gui"){const os=["win","mac","mint"].filter(o=>kGuiLv(o)<KGM.length).sort((a,b)=>kGuiLv(a)-kGuiLv(b))[0];if(os){w.lp={kind:"gui",os};persist();return w.lp}kind="term"}
  if(kind==="term"){w.lp={kind:"term",os:kWarmTermOs()};persist();return w.lp}
  const n=kWarmNextLes();if(n){w.lp=n;persist();return n}w.les=1;return null}
function kWarmOpenLes(s){const [tr,i]=String(s).split(":"),ix=+i;if(!KLESS[tr]||!KLESS[tr][ix])return;KV={scr:"learn",ltr:tr,les:[tr,ix],lst:{c:0,q:-1,right:0,ans:null}};kBeep("click");try{kSay(KLESS[tr][ix][1][0])}catch(_){}}

/* ---------- session plan: 1) warm-up 2) one Mission Path step 3) free choice ---------- */
function kPathDoneN(){try{const r=kRot(),P=kPath();return P.filter(id=>r.done[id]).length}catch(_){return 0}}
function kMust(){const k=KS();if(k.guided===false)return null;const r=kRot(),P=kPath(),nx=P.find(id=>!r.done[id]);if(!nx)return null;const w=k.warm;if(w&&w.day===kToday()&&kPathDoneN()>(w.p0||0))return null;return nx}
function kPlanStrip(){const k=KS();if(!k.setup)return "";const w=k.warm||{},wd=!kWarmNeeded(),m=kMust(),r=kRot(),P=kPath(),nx=P.find(id=>!r.done[id]),I=nx&&kPathInfo(nx),md=!m;
  const step=(n,ic,t,st)=>`<div class="kplan ${st}"><b>${st==="done"?"✓":n}</b><span>${ic} ${t}</span></div>`;
  return `<div class="kplanrow">${step(1,"🌅","Warm-up",wd?"done":"now")}${step(2,"🧭",md?"Mission step":(I?esc(I.x[2]):"Mission step"),md?"done":wd?"now":"lock")}${step(3,"🎮","Your pick!",wd&&md?"now":"lock")}</div>`}

/* ---------- computer login: the first time a game opens each session, answer one computer question ---------- */
const KLOGK={city:"city",fly:"fly",drive:"drive",col:"col",chessbot:"chessbot"};
function kLogKey(d){if(d.ktw==="mz")return "mz";return d.k&&KLOGK[d.k]||null}
const KLOGT={city:["cyb","cli","web","biz"],fly:["af","osm","osw"],drive:["osl","cli","inv"],col:["sf","osl","osa"],chessbot:["osw","web","cyb"],mz:["sf","cli","osp"]};
function kLogTopic(key){const ids=(KLOGT[key]||["cli","osw","osm","osl"]).filter(id=>KHERO.some(h=>h[0]===id));const k=KS(),hs=k.hero||{};
  ids.sort((a,b)=>((hs[a]||{}).n||0)-((hs[b]||{}).n||0));return Math.random()<.6?ids[0]:kPick(ids)}
function kLogGate(d){const key=kLogKey(d);if(!key)return false;const k=KS();if((k.adultUntil||0)>Date.now()||(k.passUntil||0)>Date.now())return false;const sid=(k.warm&&k.warm.start)||kToday();k.logged=k.logged||{};if(k.logged[key]===sid)return false;
  const id=kLogTopic(key),Q=kHeroQ(id);KV.logQ={key,sid,d:Object.assign({},d),Q,ans:null};setTimeout(kLogShow,0);kBeep("click");return true}
function kLogShow(){const L=KV.logQ;if(!L)return;document.querySelectorAll(".kpassov").forEach(x=>x.remove());const Q=L.Q,o=document.createElement("div");o.className="kpassov";
  o.innerHTML=`<div class="kpassc klogc"><div class="klogh">🔐 ACCESS CHECK · ${esc((KHERO.find(h=>h[0]===Q.hero)||["","",""])[1]+" "+(KHERO.find(h=>h[0]===Q.hero)||["","",""])[2])}</div><div class="small" style="margin:2px 0 8px">Answer to unlock ${esc(KGNAME[L.key]||"the game")}</div><div class="kh" style="margin-bottom:10px">${esc(Q.q)}</div>
   ${Q.o.map((x,i)=>`<button class="kbtn ${L.ans==null?"":i===Q.a?"green":i===L.ans?"red":"ghost"}" data-klog="${i}" style="width:100%;margin-top:6px;text-align:left">${esc(x)}</button>`).join("")}
   ${L.ans!=null&&L.ans!==Q.a?`<div class="small" style="margin-top:8px">💡 ${esc(Q.f||"")}</div><button class="kbtn" data-klog="-1" style="width:100%;margin-top:8px">🔄 Try another question</button>`:""}
   <button class="kbtn ghost" data-kpass="no" style="width:100%;margin-top:8px">Not now</button></div>`;(document.getElementById("view")||document.body).appendChild(o)}
function kLogAns(i){const L=KV.logQ;if(!L)return;if(i===-1){L.Q=kHeroQ(kLogTopic(L.key));L.ans=null;setTimeout(kLogShow,0);return}if(L.ans!=null)return;L.ans=i;const ok=i===L.Q.a;
  try{if(L.Q.hero)kHeroTrack(L.Q.hero,ok)}catch(_){}try{const k=KS();k.covr=k.covr||{};const id="h:"+L.Q.hero,r=k.covr[id]=k.covr[id]||{n:0,c:0};r.n++;if(ok)r.c++}catch(_){}
  if(ok){const k=KS();k.logged=k.logged||{};k.logged[L.key]=L.sid;k.coins+=3;k.logOk=(k.logOk||0)+1;if(k.logOk%5===0)kTix(1,"5 access checks passed");persist();kBeep("ok");kT(`🔓 Access granted! +3 ⚡${k.logOk%5===0?" +1 🎫":` · ${5-k.logOk%5} more for a 🎫`}`);const sv=L.d;KV.logQ=null;setTimeout(()=>{document.querySelectorAll(".kpassov").forEach(x=>x.remove());const fb=document.createElement("button");Object.assign(fb.dataset,sv);kidsClick(fb)},350)}
  else{kBeep("no");setTimeout(kLogShow,0)}}
