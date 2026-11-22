/* ================= Study extras: glossary page, my terms, mistake notebook, Bootcamp certificate =================
   - Terms page (view "gloss"): every term the tap-to-explain glossary knows, searchable, plus the list of terms this learner
     has looked up, with a two-minute self-check that removes a term once it is known.
   - Mistake notebook (view "mistakes"): every question currently marked as missed in this section, grouped by topic, showing
     the right answer and the reason, with a button to drill just those.
   - Certificate: a picture made on the device when the Bookkeeping Bootcamp is passed. It is an internal training record
     of Solving Life LLC and says so; it is not a license or an accredited credential. */
let pv=null;
function plusOpen(k){pv={k,q:"",open:{}};view=k;render();window.scrollTo(0,0)}
function plusTerms(){const m=Object.assign({},GL);try{Object.assign(m,GLP[part]||{})}catch(_){}try{Object.keys(GLOFF[part]||{}).forEach(k=>delete m[k])}catch(_){}return m}
function plusMine(){const G=S.set.gls||{};return Object.keys(G).filter(k=>!G[k].k&&glGet(k)).sort((a,b)=>(G[b].t||0)-(G[a].t||0))}
function plusMiss(){const D=PARTS[part].doms,all=missedPool(part,"all"),g={};all.forEach(i=>{(g[i.d]=g[i.d]||[]).push(i)});return{all,groups:Object.keys(g).map(d=>({d,name:(D[d]||["Other"])[0],items:g[d]})).sort((a,b)=>b.items.length-a.items.length)}}
function plusStrip(){try{const nm=missedPool(part,"all").length,nt=plusMine().length;return `<div class="pstrip"><button class="btn small" data-plus="mistakes">📓 My mistakes${nm?` <b>${nm}</b>`:""}</button><button class="btn small" data-plus="gloss">📖 Terms${nt?` <b>${nt}</b>`:""}</button></div>`}catch(_){return ""}}
function plusItemText(i){return i.t==="q"?i.s:i.t==="f"?i.f:(i.name||i.s||"Calculation")}
function plusItemAns(i){return i.t==="q"?(i.opts?i.opts[i.ans]:""):i.t==="f"?i.b:""}
/* which glossary terms actually occur in this section's lessons, facts, questions and explanations (found once per section) */
const plusUsedCache={};
function plusUsed(){if(plusUsedCache[part])return plusUsedCache[part];const set={};try{if(!glRe)return set;const scan=t=>{if(!t)return;glRe.lastIndex=0;let m;while((m=glRe.exec(t))){const k=glKey(m[0]);if(k)set[k]=1}};
  BANK.forEach(i=>{if(i.p!=part)return;scan(i.s);scan(i.f);scan(i.b);scan(i.ex);if(i.opts)i.opts.forEach(o=>scan(String(o)))});(UNITS[part]||[]).forEach(u=>scan(JSON.stringify(u.s)))}catch(_){}return plusUsedCache[part]=set}
function plusListHtml(){const T=plusTerms(),q=(pv.q||"").trim().toLowerCase(),U=plusUsed(),all=Object.keys(T),some=all.filter(k=>U[k]).length>=3&&!pv.all&&!q;
  const keys=all.filter(k=>(!some||U[k])&&(!q||k.toLowerCase().includes(q)||T[k][0].toLowerCase().includes(q))).sort((a,b)=>a.toLowerCase()<b.toLowerCase()?-1:1);
  if(!keys.length)return `<div class="small muted" style="padding:12px">No term matches "${esc(pv.q)}".</div>`;
  return keys.map(k=>`<button class="prow" data-plus="term" data-k="${esc(k)}"><b>${esc(k)}</b><span>${esc(T[k][0])}</span></button>`).join("")+(some?`<button class="prow" data-plus="allterms" style="justify-items:start"><b>Show all ${all.length}</b><span>These ${keys.length} are the ones used in this section.</span></button>`:"")}
function renderPlus(){const e=esc;let h="";if(!pv)pv={k:view,q:"",open:{}};
  if(view==="gloss"){const mine=plusMine(),G=S.set.gls||{};
    if(pv.rev){const k=pv.rev.list[pv.rev.i],g=glGet(k);
      h=`<section class="section"><div class="sesshead"><div><h2>My terms · self-check</h2><div class="small muted">Term ${pv.rev.i+1} of ${pv.rev.list.length}</div></div></div>
       <div class="card" style="text-align:center"><div style="font-size:30px;font-weight:900">${e(k)}</div>${pv.rev.show?`<div style="font-weight:800;color:var(--accent)">${e(g[0])}</div><p style="margin:0;text-align:left">${e(g[1])}</p>
        <div class="row"><button class="btn pri" data-plus="revk" style="flex:1">I knew it · remove from my list</button><button class="btn" data-plus="revn" style="flex:1">Keep it on my list</button></div>`
        :`<div class="small muted">Say what it means, then check.</div><button class="btn pri" data-plus="revshow" style="width:100%;min-height:50px">Show the meaning</button>`}</div>
       <button class="btn ghost small" data-plus="revend" style="margin-top:10px">Stop</button></section>`}
    else h=`<section class="section"><div class="sesshead"><div><h2>Terms and abbreviations</h2><div class="small muted">The terms used in this section. Tap one for its meaning. In lessons and questions they have a dotted underline.</div></div></div>
      ${mine.length?`<div class="card" style="gap:8px"><b>Looked up by you · ${mine.length}</b><div class="pchips">${mine.slice(0,40).map(k=>`<button class="btn small" data-plus="term" data-k="${e(k)}">${e(k)}${G[k].n>1?` <i>${G[k].n}×</i>`:""}</button>`).join("")}</div><button class="btn pri" data-plus="rev">Check myself on these · about ${Math.max(1,Math.round(mine.length*0.2))} min</button></div>`:`<div class="notice" style="margin-top:10px">Terms you tap while studying are collected here, so you can check yourself on them later.</div>`}
      <input id="plusq" class="pq" type="search" placeholder="Search: MAGI, basis, 8867…" value="${e(pv.q||"")}" autocomplete="off">
      <div class="plist" id="pluslist">${plusListHtml()}</div></section>`}
  else if(view==="mistakes"){const M=plusMiss();
    h=`<section class="section"><div class="sesshead"><div><h2>My mistakes · ${e(pl(part))}</h2><div class="small muted">${M.all.length?`${M.all.length} question${M.all.length===1?"":"s"} you missed and have not yet answered right. Each one leaves this list when you get it right.`:"Nothing open. A question you miss lands here until you answer it right."}</div></div></div>
     ${M.all.length?`<button class="donext" data-plus="fix" data-d="all"><span class="dn1">👉 FIX THESE</span><b>Redo your misses · ${Math.min(10,M.all.length)} question${Math.min(10,M.all.length)===1?"":"s"}</b><span class="dn2">Most-missed first. Then the list below gets shorter.</span><span class="dn3">Tap here ▶</span></button>`:""}
     ${M.groups.map(g=>{const op=pv.open[g.d],show=op?g.items:g.items.slice(0,3);return `<div class="card pmg"><div class="pmh"><b>${e(g.name)}</b><span class="small muted">${g.items.length} open</span><button class="btn small" data-plus="fix" data-d="${g.d}">Drill these</button></div>
       ${show.map(i=>{const how=i.ex||EXPL[i.id]||(S.ex&&S.ex[i.id])||"",n=(S.it[i.id]||[])[6]||1,a=plusItemAns(i);return `<div class="pmi"><div class="pmq">${e(plusItemText(i))}${n>1?` <i>missed ${n}×</i>`:""}</div>${a?`<div class="pma">✓ ${e(a)}</div>`:`<div class="pma">A calculation: the numbers change each time, the method is the same.</div>`}${how?`<div class="small">${e(how)}</div>`:""}</div>`}).join("")}
       ${g.items.length>3?`<button class="btn ghost small" data-plus="more" data-d="${g.d}">${op?"Show fewer":"Show all "+g.items.length}</button>`:""}</div>`}).join("")}</section>`}
  $("#view").innerHTML=h}
function plusClick(d){const a=d.plus;
  if(a==="mistakes"||a==="gloss"){plusOpen(a);return true}
  if(a==="term"){glQuiet=view==="gloss"&&!!(pv&&pv.rev);glOpen(d.k,d.k);glQuiet=false;return true}
  if(a==="more"){pv.open[d.d]=!pv.open[d.d];render();return true}
  if(a==="allterms"){pv.all=true;const l=document.getElementById("pluslist");if(l)l.innerHTML=plusListHtml();return true}
  if(a==="fix"){filt=d.d==="all"?"all":(isNaN(+d.d)?d.d:+d.d);startSession("missed",10);return true}
  if(a==="rev"){pv.rev={list:plusMine().slice(0,25),i:0,show:false};render();window.scrollTo(0,0);return true}
  if(a==="revshow"){pv.rev.show=true;render();return true}
  if(a==="revk"||a==="revn"){if(a==="revk"){const G=S.set.gls||{},k=pv.rev.list[pv.rev.i];if(G[k]){G[k].k=1;persist()}}pv.rev.i++;pv.rev.show=false;if(pv.rev.i>=pv.rev.list.length)pv.rev=null;render();window.scrollTo(0,0);return true}
  if(a==="revend"){pv.rev=null;render();return true}
  if(a==="cert"){plusCert();return true}
  if(a==="certsave"){plusCertSave(false);return true}
  if(a==="certshare"){plusCertSave(true);return true}
  if(a==="certclose"){const o=document.getElementById("certpop");if(o)o.remove();return true}
  return false}
try{document.addEventListener("input",e=>{const t=e.target;if(t&&t.id==="plusq"&&pv){pv.q=t.value;const l=document.getElementById("pluslist");if(l)l.innerHTML=plusListHtml()}if(t&&t.id==="certname"){try{localStorage.setItem("certName",t.value)}catch(_){}plusCertDraw()}})}catch(_){}

/* ---------- certificate ---------- */
function plusCertName(){let n="";try{n=localStorage.getItem("certName")||""}catch(_){}return n||CNAME()||""}
function plusCertDraw(){campIn("bk",plusCertDraw1)}
function plusCertDraw1(){const c=document.getElementById("certcv");if(!c)return;const x=c.getContext("2d"),W=c.width,H=c.height,cp=campS().cap,nm=plusCertName()||"Your name";
  x.fillStyle="#fbf8f1";x.fillRect(0,0,W,H);x.strokeStyle="#0f5c3a";x.lineWidth=14;x.strokeRect(28,28,W-56,H-56);x.lineWidth=2;x.strokeStyle="#c9a227";x.strokeRect(50,50,W-100,H-100);
  x.textAlign="center";x.fillStyle="#0f5c3a";x.font="700 26px Georgia,serif";x.fillText("SOLVING LIFE LLC · FOUNDATION COURSE",W/2,128);
  x.fillStyle="#1b1b1b";x.font="700 64px Georgia,serif";x.fillText("Certificate of Completion",W/2,220);
  x.font="italic 28px Georgia,serif";x.fillStyle="#444";x.fillText("This certifies that",W/2,290);
  let fs=74;x.font=`700 ${fs}px Georgia,serif`;while(x.measureText(nm).width>W-260&&fs>36){fs-=4;x.font=`700 ${fs}px Georgia,serif`}x.fillStyle="#0f5c3a";x.fillText(nm,W/2,380);
  x.strokeStyle="#c9a227";x.lineWidth=2;x.beginPath();x.moveTo(W/2-330,404);x.lineTo(W/2+330,404);x.stroke();
  x.fillStyle="#1b1b1b";x.font="28px Georgia,serif";x.fillText("completed the Bookkeeping Bootcamp",W/2,456);
  x.font="22px Georgia,serif";x.fillStyle="#444";x.fillText(`${campN()} steps · ${CAMP.reduce((n,s)=>n+s.ex.length,0)} hands-on exercises · a full month-end close for a practice company`,W/2,496);
  const sk=["The accounting equation · Chart of accounts · Debits and credits · Journal entries","Receivables and payables · Inventory and cost of goods sold · Payroll entries","Depreciation and loans · Bank reconciliation · Adjusting entries · Financial statements"];x.font="21px Georgia,serif";x.fillStyle="#1b1b1b";sk.forEach((t,i)=>x.fillText(t,W/2,556+i*34));
  x.font="700 24px Georgia,serif";x.fillStyle="#0f5c3a";x.textAlign="left";x.fillText(`Month-end close score: ${Math.round((cp.best||0)*100)}%`,120,H-128);x.textAlign="right";x.fillText(`Completed: ${new Date(cp.when||Date.now()).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}`,W-120,H-128);
  x.textAlign="center";x.font="18px Georgia,serif";x.fillStyle="#666";x.fillText("Internal training record of Solving Life LLC. Not a license, degree or accredited credential.",W/2,H-84)}
function plusCert(){campIn("bk",plusCert1)}
function plusCert1(){const cp=campS().cap;if(!cp.done)return;if(!cp.when){cp.when=Date.now();persist()}const old=document.getElementById("certpop");if(old)old.remove();
  const o=document.createElement("div");o.id="certpop";o.innerHTML=`<div class="certsheet"><b style="font-size:18px">Your certificate</b><label class="small" style="display:grid;gap:4px">Name on the certificate<input id="certname" class="pq" style="margin:0" value="${esc(plusCertName())}" placeholder="First and last name" autocomplete="name"></label>
    <canvas id="certcv" width="1400" height="990"></canvas><div class="row"><button class="btn pri" data-plus="certsave" style="flex:1">⬇ Save picture</button>${navigator.canShare?`<button class="btn" data-plus="certshare" style="flex:1">Share</button>`:""}</div><button class="btn ghost small" data-plus="certclose">Close</button></div>`;
  document.body.appendChild(o);plusCertDraw1()}
function plusCertSave(share){const c=document.getElementById("certcv");if(!c)return;c.toBlob(async b=>{if(!b)return;const f=new File([b],"bookkeeping-bootcamp-certificate.png",{type:"image/png"});
  if(share){try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:"Bookkeeping Bootcamp certificate"});return}}catch(_){return}}
  const u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=f.name;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},500)},"image/png")}

/* ---------- wiring ---------- */
const plusExtraView0=extraView;extraView=function(){if(view==="gloss"||view==="mistakes"){try{document.body.classList.toggle("course",CLOCK())}catch(_){}renderPlus();return true}return plusExtraView0()};
const plusExtraClick0=extraClick;extraClick=function(b){const d=b.dataset;if(d.plus!==undefined&&plusClick(d))return true;return plusExtraClick0(b)};
const plusDoNext0=doNextHtml;doNextHtml=function(){return plusDoNext0()+plusStrip()};
const plusRenderBk0=renderBk;renderBk=function(){plusRenderBk0();try{const dn=document.querySelector("#view .donext");if(dn&&!document.querySelector("#view .pstrip"))dn.insertAdjacentHTML("afterend",plusStrip())}catch(_){}};
const plusRenderBkLand0=renderBkLand;renderBkLand=function(){plusRenderBkLand0();try{const pl0=document.querySelector("#view .bkl-plan");if(pl0&&!document.querySelector("#view .pstrip"))pl0.insertAdjacentHTML("afterend",plusStrip())}catch(_){}};
/* certificate buttons on the Bootcamp screens */
const plusRenderCamp0=renderCamp;renderCamp=function(){plusRenderCamp0();try{if(cv.tr&&cv.tr!=="bk")return;if(!campS().cap.done)return;const v=document.getElementById("view"),btn=`<button class="btn pri pcert" data-plus="cert">🎓 Get your certificate</button>`;
  if(cv.scr==="capres"){const n=v.querySelector(".cres");if(n)n.insertAdjacentHTML("afterend",btn)}else if(cv.scr==="hub"&&campDone()){const n=v.querySelector(".chero");if(n)n.insertAdjacentHTML("afterend",btn)}}catch(_){}};

/* ---------- Explain it back: after a wrong answer, one tap to pick the reason that fits ----------
   The reason is hidden until she chooses between it and two reasons that belong to other questions in the same topic.
   One tap, can be skipped, never changes the score. Not shown in mock exams or when the question has no short reason. */
function ebPool(it){const out=[],seen={};seen[it.ex]=1;const c=BANK.filter(x=>x.t==="q"&&x.p==it.p&&x.d==it.d&&x.id!==it.id&&x.ex&&x.ex.length>=25&&x.ex.length<=220);
  for(let k=0;k<60&&out.length<2&&c.length;k++){const x=c[Math.floor(Math.random()*c.length)];if(!seen[x.ex]){seen[x.ex]=1;out.push(x.ex)}}return out}
function ebHook(){try{const s=sess;if(view!=="session"||!s||s.mode==="mock"||s.phase==="ask"||s.lastOk)return;const cur=s.queue[s.pos];if(!cur)return;const it=BYID[cur.id];
  if(!it||it.t!=="q"||!it.ex||it.ex.length<25||it.ex.length>220)return;const box=document.querySelector("#view .explain");if(!box||box.dataset.eb)return;
  if(!s.eb||s.eb.pos!==s.pos||s.eb.id!==it.id){const w=ebPool(it);if(w.length<2)return;const o=[it.ex].concat(w).map((t,k)=>[t,k===0]);for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]]}s.eb={pos:s.pos,id:it.id,o,pick:null}}
  box.dataset.eb="1";const e=s.eb;
  if(e.pick===null){box.classList.add("ebhide");const d=document.createElement("div");d.className="ebq";d.innerHTML=`<b>One tap before you move on: which reason fits this question?</b>${e.o.map((x,k)=>`<button class="btn cchip left" data-plus="eb" data-v="${k}">${esc(x[0])}</button>`).join("")}<button class="btn ghost small" data-plus="eb" data-v="-1">Skip, just show me</button>`;box.parentNode.insertBefore(d,box)}
  else if(e.pick>=0){const d=document.createElement("div");d.className="cfb "+(e.o[e.pick][1]?"ok":"bad");d.style.marginBottom="8px";d.innerHTML=e.o[e.pick][1]?"<b>✓ That is the reason.</b> Here it is again with the answer:":"<b>✗ That reason belongs to a different question.</b> Read the right one:";box.parentNode.insertBefore(d,box)}}catch(_){}}
const plusRenderSession0=renderSession;renderSession=function(){plusRenderSession0();ebHook()};
const plusClick0=plusClick;plusClick=function(d){if(d.plus==="eb"){try{if(sess&&sess.eb){sess.eb.pick=+d.v;const E=S.set.ebs=S.set.ebs||{n:0,ok:0};if(+d.v>=0){E.n++;if(sess.eb.o[+d.v][1])E.ok++;persist()}}}catch(_){}render();return true}return plusClick0(d)};
