/* ================= Bookkeeping Bootcamp: engine =================
   Module 2 rebuilt around doing: each step is a short lesson, then hands-on practice with instant feedback, passed at 80%.
   Practice kinds: equation effect (eq), sort the account (sort), debit or credit (dc), build the journal entry line by line (je),
   tap the wrong line (tap), and multiple choice with a document or worksheet (mc).
   The capstone keeps Cedar & Clay's books for December: 16 documents, trial balance, bank reconciliation, adjusting entries,
   then a profit and loss and a balance sheet that are computed from the entries, so every number ties out.
   Progress: S.set.camp = {st:{stepId:{l,ok,best,n}}, miss:{exerciseId:count}, seen:{exerciseId:1}, cap:{i,ok,n,best,done}}. */
let cv=null;
function campS(){const s=S.set[CT.key]=S.set[CT.key]||{};s.st=s.st||{};s.miss=s.miss||{};s.seen=s.seen||{};s.cap=s.cap||{};return s}
function campCents(a){return Math.round(parseFloat(String(a).replace(/,/g,"").replace("−","-"))*100)}
function campFm(c,plain){const neg=c<0;const t=(Math.abs(c)/100).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});return (neg?"−":"")+(plain?"":"$")+t}
function campShuf(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* tracks: the same engine runs every Bootcamp. CAMP always points at the current track's steps. */
const CAMPS={bk:{id:"bk",key:"camp",mod:2,name:"Bookkeeping Bootcamp",short:"Bootcamp",tag:"Module 2 · rebuilt",co:"Cedar & Clay Studio",steps:CAMP_BK,cap:true,
  blurb:"Keep the books of one small studio, Cedar & Clay Studio, from its first deposit to its first month-end close. Short lesson, then you do it."}};
let CT=CAMPS.bk;
function campT(id){CT=CAMPS[id]||CAMPS.bk;CAMP=CT.steps;CAMPCO=CT.co||CAMPCO;return CT}
function campIn(id,fn){const prev=CT.id;campT(id);try{return fn()}finally{campT(prev)}}
function campN(){return CAMP.length+(CT.cap?1:0)}
function campSlidesN(){return CAMP.reduce((n,s)=>n+s.slides.length,0)}
function campPassed(){const st=campS().st;return CAMP.filter(s=>(st[s.id]||{}).ok).length+(CT.cap&&campS().cap.done?1:0)}
function campDone(){return campPassed()>=campN()}
function campNextInfo(){const st=campS().st;
  for(let i=0;i<CAMP.length;i++){const s=CAMP[i],r=st[s.id]||{};if(!r.ok)return{i,tr:CT.id,phase:r.l?"do":"learn",t:`${CT.short} step ${i+1} of ${campN()}: ${s.t}`,d:r.l?`Practice · ${r.n?"best so far "+Math.round((r.best||0)*100)+"% · ":""}80% passes the step`:`${s.slides.length} short slides, then hands-on practice · about ${Math.round(s.slides.length*1.2+6)} min`}}
  if(CT.cap&&!campS().cap.done){const c=campS().cap;return{cap:1,tr:CT.id,t:`${CT.short} step ${campN()} of ${campN()}: Close December for ${CAMPCO}`,d:c.i?`Pick up at item ${c.i+1} · your own entries become the statements`:"16 documents, a bank reconciliation, adjusting entries and the statements · about 25 min"}}
  return null}
function campOpen(tr){campT(tr||"bk");part=BK;cv={scr:"hub",tr:CT.id};view="camp";render();window.scrollTo(0,0)}
function campGoNext(tr){campT(tr||(cv&&cv.tr)||"bk");const n=campNextInfo();if(!n){campOpen(CT.id);return}part=BK;view="camp";if(n.cap)campCapStart();else if(n.phase==="learn")cv={scr:"learn",tr:CT.id,step:n.i,idx:0};else campStartDo(n.i);render();window.scrollTo(0,0)}

/* ---------- ledger and statements (used by the capstone) ---------- */
function campLedger(entries){const L={};entries.forEach(lines=>lines.forEach(([side,acc,amt])=>{L[acc]=(L[acc]||0)+(side==="D"?1:-1)*campCents(amt)}));return L}
function campTB(L){const rows=[];let d=0,c=0;Object.keys(CAMPACC).forEach(a=>{const b=L[a];if(!b)return;if(b>0){rows.push([a,campFm(b,1),""]);d+=b}else{rows.push([a,"",campFm(-b,1)]);c-=b}});return{rows,d,c}}
function campFin(L){const g=t=>Object.keys(CAMPACC).filter(a=>CAMPACC[a]===t&&L[a]).map(a=>[a,L[a]]);
  const rev=g("R").map(([a,b])=>[a,-b]),cogs=g("G"),exp=g("X"),sum=x=>x.reduce((n,r)=>n+r[1],0);
  const R=sum(rev),G=sum(cogs),X=sum(exp),net=R-G-X;
  const as=g("A").concat(g("CA")),li=g("L").map(([a,b])=>[a,-b]),cap=-(L["Owner's capital"]||0),dr=L["Owner's draw"]||0;
  const A=sum(as),Lt=sum(li),E=cap-dr+net;return{rev,cogs,exp,R,G,X,net,as,li,A,Lt,cap,dr,E}}
function campPLVis(F){return{k:"calc",r:[...F.rev.map(([a,b])=>[a,campFm(b)]),["Total revenue",campFm(F.R),1],...F.cogs.map(([a,b])=>[a,"− "+campFm(b)]),["Gross profit",campFm(F.R-F.G),1],...F.exp.map(([a,b])=>[a,"− "+campFm(b)]),[F.net<0?"Net loss":"Net income",campFm(F.net),1]]}}
function campBSVis(F){return{k:"calc",r:[...F.as.map(([a,b])=>[a,campFm(b)]),["Total assets",campFm(F.A),1],...F.li.map(([a,b])=>[a,campFm(b)]),["Total liabilities",campFm(F.Lt),1],["Owner's capital",campFm(F.cap)],["Less owner's draw",campFm(-F.dr)],[F.net<0?"Less net loss":"Plus net income",campFm(F.net)],["Total equity",campFm(F.E),1],["Liabilities + equity",campFm(F.Lt+F.E),1]]}}

/* ---------- practice rounds ---------- */
function campExId(si,k){return CAMP[si].id+"-"+k}
function campPick(si){const s=CAMP[si],S0=campS(),ids=s.ex.map((x,k)=>k),N=Math.min(ids.length,s.id==="acct"||s.id==="dc"?12:10),first=!(S0.st[s.id]||{}).n;
  if(first){if(ids.length<=N)return ids;const out=[];for(let j=0;j<N;j++)out.push(ids[Math.round(j*(ids.length-1)/(N-1))]);return[...new Set(out)]}
  const miss=campShuf(ids.filter(k=>S0.miss[campExId(si,k)]>0)),fresh=campShuf(ids.filter(k=>!S0.seen[campExId(si,k)]&&!miss.includes(k))),rest=campShuf(ids.filter(k=>!miss.includes(k)&&!fresh.includes(k)));
  return campShuf(miss.concat(fresh,rest).slice(0,N))}
function campStartDo(si){const ks=campPick(si);cv={scr:"do",tr:CT.id,step:si,items:ks.map(k=>({x:CAMP[si].ex[k],id:campExId(si,k)})),i:0,ok:0,total:ks.length,redo:{},cur:null};campCur()}
function campCur(){const it=cv.items[cv.i];if(!it){cv.cur=null;return}const x=it.x,c={done:false,ok:true};
  if(x[0]==="mc")c.ord=x[2].length===2&&/^(Income statement|Balance sheet)$/.test(x[2][0])?(x[2][0]==="Income statement"?[0,1]:[1,0]):campShuf(x[2].map((_,k)=>k));
  if(x[0]==="eq")c.pick=[null,null,null];
  if(x[0]==="je"){c.line=0;c.res=[];c.opts=campShuf([...new Set(x[3].map(l=>l[1]).concat(x[4]||[]))])}
  cv.cur=c}
function campAnswer(ok){const c=cv.cur,it=cv.items[cv.i],S0=campS();c.done=true;c.ok=ok;
  if(!it.redo){if(ok)cv.ok++;if(it.id){S0.seen[it.id]=1;if(ok){if(S0.miss[it.id])S0.miss[it.id]=0}else S0.miss[it.id]=(S0.miss[it.id]||0)+1}}
  if(!ok&&!it.redo&&cv.scr==="do"&&!cv.redo[cv.i]){cv.redo[cv.i]=1;cv.items.push({x:it.x,id:it.id,redo:1})}
  if(cv.scr==="cap"){const cp=S0.cap;cp.i=cv.i+1;cp.ok=cv.ok}
  persist()}
function campFinish(){const s=CAMP[cv.step],S0=campS(),r=S0.st[s.id]=S0.st[s.id]||{},pct=cv.ok/cv.total;r.n=(r.n||0)+1;r.best=Math.max(r.best||0,pct);r.l=1;const was=r.ok;if(pct>=0.8)r.ok=1;persist();cv={scr:"res",tr:CT.id,step:cv.step,ok:cv.ok,total:cv.total,pct,first:!was&&!!r.ok}}

/* ---------- capstone ---------- */
function campCapItems(){const C=CAMPCAP,items=[],ent=[];const lab=[];
  C.docs.forEach(d=>{items.push({x:["je",d[0],d[1],d[2],d[3],d[4]],ent:d[2]});lab.push("Record the month")});
  const L=campLedger(C.docs.map(d=>d[2])),tb=campTB(L),tbV={k:"je",r:tb.rows,n:`Trial balance before adjustments. Debits ${campFm(tb.d)} · credits ${campFm(tb.c)}.`},bk=L["Checking"];
  items.push({x:["mc","Here is the trial balance from your sixteen entries. What does the Checking account show?",[campFm(bk),campFm(bk+80000),campFm(bk-84350),campFm(1600000)],"Add the debits to Checking and subtract the credits. This is the book balance you will now tie to the bank.",tbV]});
  items.push({x:["mc","How much does Birch & Co. still owe the studio?",[campFm(L["Accounts receivable"]),"$2,400.00","$1,800.00","$0.00"],"Invoice $2,400 minus the $1,800 payment. It is the Accounts receivable balance.",tbV]});
  items.push({x:["mc",`Debits total ${campFm(tb.d)} and credits total ${campFm(tb.c)}. What does that prove?`,["Every entry had equal debits and credits. It does not prove each one is in the right account.","The books contain no errors of any kind.","The bank account is reconciled.","The studio made a profit."],"A balanced trial balance is necessary but not sufficient. The bank reconciliation is the next test.",tbV]});
  lab.push("Trial balance","Trial balance","Trial balance");
  const fee=C.rec.fee*100,out=C.rec.out.reduce((n,o)=>n+o[1]*100,0),stmt=bk-fee+out,recV={k:"calc",r:[["Bank statement ending balance, Dec 31",campFm(stmt)],["Book balance, Checking",campFm(bk)],...C.rec.out.map(o=>[o[0]+": not on the statement",campFm(o[1]*100)]),["Service fee on the statement, not in the books",campFm(fee)]]};
  items.push({x:["mc","The December bank statement has arrived. Check 1006 to Mara for $800 is not on it. What is that?",["An outstanding check: subtract it from the bank side","A deposit in transit: add it to the bank side","An error: delete the check from the books","A bank fee: record it in the books"],"The books already took the $800 out. The bank will show it when Mara deposits the check.",recV]});
  items.push({x:["mc","What is the adjusted bank balance?",[campFm(stmt-out),campFm(stmt+out),campFm(stmt),campFm(bk)],"Statement balance minus the outstanding check.",recV]});
  items.push({x:["mc","The books show "+campFm(bk)+". Which adjustment makes the books agree with the adjusted bank balance?",["Record the "+campFm(fee)+" bank fee in the books","Add the outstanding check back to the books","Nothing: timing differences fix themselves","Change the bank statement"],campFm(bk)+" − "+campFm(fee)+" = "+campFm(bk-fee)+", the same as the adjusted bank balance. You will post the fee next.",recV]});
  lab.push("Bank reconciliation","Bank reconciliation","Bank reconciliation");
  C.adj.forEach(d=>{items.push({x:["je",d[0],d[1],d[2],d[3],d[4]],ent:d[2]});lab.push("Adjusting entries")});
  const L2=campLedger(C.docs.map(d=>d[2]).concat(C.adj.map(d=>d[2]))),tb2=campTB(L2),F=campFin(L2),tb2V={k:"je",r:tb2.rows,n:`Adjusted trial balance, Dec 31. Debits ${campFm(tb2.d)} · credits ${campFm(tb2.c)}.`};
  items.push({x:["mc","From the adjusted trial balance: what is total revenue for December?",[campFm(F.R),campFm(F.R+(-(L2["Unearned revenue"]||0))),campFm(F.R+8000),campFm(240000)],"Class revenue plus product sales. The gift certificates are not revenue yet, and sales tax never is.",tb2V]});
  items.push({x:["mc","What is gross profit (total revenue minus cost of goods sold)?",[campFm(F.R-F.G),campFm(F.R),campFm(F.R-F.G-(L2["Supplies expense"]||0)),campFm(100000-F.G)],"Only cost of goods sold comes off at this line. Supplies, rent and wages come after it.",tb2V]});
  items.push({x:["mc","What is the net result for December?",[(F.net<0?"A loss of ":"A profit of ")+campFm(Math.abs(F.net)),(F.net-F.dr<0?"A loss of ":"A profit of ")+campFm(Math.abs(F.net-F.dr)),(F.net+90000<0?"A loss of ":"A profit of ")+campFm(Math.abs(F.net+90000)),"A profit of "+campFm(L2["Checking"])],"Gross profit minus all operating expenses. The owner's draw is not an expense, the gift certificates are not income, and the bank balance is not profit.",tb2V]});
  items.push({x:["mc","What are total assets on Dec 31?",[campFm(F.A),campFm(F.A-2*(L2["Accumulated depreciation"]||0)),campFm(F.A-(L2["Prepaid insurance"]||0)),campFm(F.A+F.dr)],"Add the asset accounts and subtract accumulated depreciation.",tb2V]});
  items.push({x:["mc","December shows a loss, yet the bank balance went from zero to over $7,000. What do you tell Mara?",["Cash came from her own money, the loan and classes paid ahead. None of that is income.","The loss must be a bookkeeping error.","Depreciation added cash to the account.","The sales tax collected is extra profit."],"Profit and cash are different questions. The balance sheet shows where the cash came from and what is still owed.",tb2V]});
  lab.push("Statements","Statements","Statements","Statements","Statements");
  return{items,lab,F,L2}}
function campCapStart(){const B=campCapItems(),cp=campS().cap,at=cp.i&&cp.i<B.items.length?cp.i:0;if(!at){cp.i=0;cp.ok=0}
  cv={scr:"cap",tr:CT.id,items:B.items,lab:B.lab,i:at,ok:at?cp.ok||0:0,total:B.items.length,redo:{},cur:null,F:B.F};campCur()}
function campCapFinish(){const cp=campS().cap,pct=cv.ok/cv.total;cp.n=(cp.n||0)+1;cp.best=Math.max(cp.best||0,pct);cp.i=0;cp.ok=0;const was=cp.done;if(pct>=0.8)cp.done=1;persist();cv={scr:"capres",tr:CT.id,ok:cv.ok,total:cv.total,pct,F:cv.F,first:!was&&!!cp.done}}

/* ---------- drawing ---------- */
function campSlide(sl){const e=esc;return `<h3 style="margin:0">${e(sl.h)}</h3>${sl.b?`<ul class="clist">${sl.b.map(x=>`<li>${e(x)}</li>`).join("")}</ul>`:""}${sl.v?visHtml(sl.v):""}${sl.ex?`<div class="cex">${e(sl.ex)}</div>`:""}`}
function campJeTable(x,c,final){const rows=x[3].map((l,k)=>{const shown=final||k<c.line,r=c.res[k];return `<div class="jr${l[0]==="C"?" cr":""}${shown&&r===false?" wrong":""}"><span>${shown?esc(l[1])+(r===false?" <em>(you chose "+esc(c.pk[k])+")</em>":""):k===c.line?"<b class='cq'>?</b>":"…"}</span><span>${l[0]==="D"?esc(l[2]):""}</span><span>${l[0]==="C"?esc(l[2]):""}</span></div>`}).join("");
  return `<div class="vis vje cje"><div class="jh"><span>Account</span><span>Debit</span><span>Credit</span></div>${rows}</div>`}
function campExHtml(){const e=esc,it=cv.items[cv.i],x=it.x,c=cv.cur,k=x[0];let h="";
  const fb=(why,extra)=>c.done?`<div class="cfb ${c.ok?"ok":"bad"}"><b>${c.ok?"✓ Right.":"✗ Not quite."}</b> ${extra||""}${e(why)}${!c.ok&&cv.scr==="do"&&!it.redo?`<div class="small" style="margin-top:4px;opacity:.85">This one comes back once at the end of the round.</div>`:""}</div><button class="btn pri cnext" data-camp="next">${cv.i+1>=cv.items.length?"See the result":"Next"} ▶</button>`:"";
  if(k==="eq"){const names=["Assets","Liabilities","Equity"],sy={"+":"▲ up","-":"▼ down","0":"＝ same"};
    h=`<p class="cq1">${e(x[1])}</p><div class="small muted">What happens to each part of the equation?</div>
     ${names.map((n,j)=>`<div class="ceq"><b>${n}</b><div>${["+","-","0"].map(v=>{const on=c.pick[j]===v,right=c.done&&x[2][j]===v,wrong=c.done&&on&&x[2][j]!==v;return `<button class="btn cchip${on?" on":""}${right?" good":""}${wrong?" bad":""}" data-camp="eq" data-j="${j}" data-v="${v}" ${c.done?"disabled":""}>${sy[v]}</button>`}).join("")}</div></div>`).join("")}
     ${c.done?"":`<button class="btn pri cnext" data-camp="eqgo" ${c.pick.includes(null)?"disabled":""}>Check</button>`}${fb(x[3])}`}
  else if(k==="sort"){const T=[["A","Asset"],["L","Liability"],["E","Equity"],["R","Revenue"],["X","Expense"]];
    h=`<div class="small muted">Which kind of account is this?</div><p class="cbig">${e(x[1])}</p><div class="copts c5">${T.map(([v,n])=>`<button class="btn cchip${c.done&&x[2]===v?" good":""}${c.done&&c.pk===v&&x[2]!==v?" bad":""}" data-camp="pick" data-v="${v}" ${c.done?"disabled":""}>${n}</button>`).join("")}</div>${fb(x[3],c.done?`<b>${T.find(t=>t[0]===x[2])[1]}.</b> `:"")}`}
  else if(k==="dc"){h=`<div class="small muted">Which side does it?</div><p class="cbig">${e(x[1])} <span>${e(x[2])}</span></p><div class="copts c2">${[["D","Debit","left side"],["C","Credit","right side"]].map(([v,n,s])=>`<button class="btn cchip big${c.done&&x[3]===v?" good":""}${c.done&&c.pk===v&&x[3]!==v?" bad":""}" data-camp="pick" data-v="${v}" ${c.done?"disabled":""}><b>${n}</b><small>${s}</small></button>`).join("")}</div>${fb(x[4])}`}
  else if(k==="mc"){const tall=x[4]&&x[4].r&&x[4].r.length>8;h=`${tall?`<p class="cq1">${e(x[1])}</p>`:""}${x[4]?visHtml(x[4]):""}${tall?`<div class="small muted">${e(x[1])}</div>`:`<p class="cq1">${e(x[1])}</p>`}${cv.scr==="do"&&CAMP[cv.step].ask&&!/\?$/.test(x[1])?`<div class="small muted">${e(CAMP[cv.step].ask)}</div>`:""}<div class="copts c1">${c.ord.map(o=>`<button class="btn cchip left${c.done&&o===0?" good":""}${c.done&&c.pk===o&&o!==0?" bad":""}" data-camp="pick" data-v="${o}" ${c.done?"disabled":""}>${e(x[2][o])}</button>`).join("")}</div>${fb(x[3])}`}
  else if(k==="tap"){h=`<p class="cq1">${e(x[1])}</p><div class="vis vje cje ctap"><div class="jh"><span>Account</span><span>Debit</span><span>Credit</span></div>${x[2].map((r,j)=>`<button class="jr${r[2]?" cr":""}${c.done&&j===x[3]?" good":""}${c.done&&c.pk===j&&j!==x[3]?" bad":""}" data-camp="pick" data-v="${j}" ${c.done?"disabled":""}><span>${e(r[0])}</span><span>${e(r[1]||"")}</span><span>${e(r[2]||"")}</span></button>`).join("")}</div>${fb(x[4])}`}
  else if(k==="je"){const l=x[3][c.line];
    h=`${x[2]?visHtml(x[2]):""}<p class="cq1">${e(x[1])}</p>${campJeTable(x,c,c.done)}
     ${c.done?"":`<div class="cask">${l[0]==="D"?"<b>Debit</b>":"<b>Credit</b>"} ${e(l[2])}: which account?</div><div class="copts cacc">${c.opts.map(a=>`<button class="btn cchip left" data-camp="acc" data-v="${e(a)}">${e(a)}</button>`).join("")}</div>`}${fb(x[5])}`}
  return h}
function campHead(title,sub,pct){return `<div class="chead"><div><h2>${esc(title)}</h2><div class="small muted">${sub}</div></div>${CT.cheat===false?"":`<button class="btn small ghost" data-camp="cheat">📎 Cheat sheet</button>`}</div>${pct!=null?`<div class="cbar"><i style="width:${Math.round(pct*100)}%"></i></div>`:""}`}
function renderCamp(){if(!cv)cv={scr:"hub",tr:"bk"};campT(cv.tr||"bk");const e=esc,S0=campS();let h="";
  if(cv.scr==="hub"){const n=campNextInfo(),done=campPassed();
    h=`<section class="section"><div class="chero"><div class="small">${e(CT.tag)}</div><h2>${e(CT.name)}</h2><p>${e(CT.blurb)}</p><div class="cbar"><i style="width:${Math.round(done/campN()*100)}%"></i></div><div class="small">${done} of ${campN()} steps passed</div></div>
     ${n?`<button class="donext" data-camp="go"><span class="dn1">👉 DO THIS NEXT</span><b>${e(n.t.replace(/^.*? step /,"Step "))}</b><span class="dn2">${e(n.d)}</span><span class="dn3">Tap here ▶</span></button>`:`<div class="cfb ok" style="margin-top:10px"><b>✓ ${e(CT.name)} complete.</b> Every step is passed. Redo any step below to keep it sharp.</div>${CT.after?`<button class="btn pri pcert" data-camp="after">${e(CT.after.t)} ▶</button>`:""}`}
     <div class="cpath">${CAMP.map((s,i)=>{const r=S0.st[s.id]||{},cur=n&&!n.cap&&n.i===i;
      if(!cur)return `<button class="cstep mini${r.ok?" ok":""}" data-camp="open" data-i="${i}"><span class="cic">${r.ok?"✓":s.ic}</span><span class="cst"><b>${i+1}. ${e(s.t)}</b><span class="cstat">${r.ok?Math.round((r.best||0)*100)+"%":r.n?"best "+Math.round((r.best||0)*100)+"%":r.l?"lesson read":""} ›</span></span></button>`;
      return `<div class="cstep cur"><span class="cic">${s.ic}</span><div class="cst"><b>${i+1}. ${e(s.t)}</b><span class="small">${e(s.goal)}</span><div class="cbtns"><button class="btn small" data-camp="learn" data-i="${i}">📖 Lesson${r.l?" ✓":""}</button><button class="btn small${r.l?" pri":""}" data-camp="do" data-i="${i}">✍️ Practice${r.n?" · best "+Math.round((r.best||0)*100)+"%":""}</button></div></div></div>`}).join("")}
${CT.cap?`      <div class="cstep${S0.cap.done?" ok":""}${n&&n.cap?" cur":" mini"}"><span class="cic">${S0.cap.done?"✓":"🏁"}</span><div class="cst"><b>${campN()}. Close December for ${e(CAMPCO)}</b>${n&&n.cap?`<span class="small">Sixteen documents, the bank reconciliation, four adjusting entries, then the statements built from your own entries.</span>`:""}<div class="cbtns"><button class="btn small${n&&n.cap?" pri":""}" data-camp="cap">🏁 ${S0.cap.i?"Continue":"Start"} the close${S0.cap.best?" · best "+Math.round(S0.cap.best*100)+"%":""}</button></div></div></div>`:""}</div>
     <div class="small muted" style="margin:10px 2px">Tap any step to open it. The red button always shows the recommended next one. People, companies and numbers in the examples are invented for practice.</div></section>`}
  else if(cv.scr==="learn"){const s=CAMP[cv.step],sl=s.slides[cv.idx],last=cv.idx>=s.slides.length-1;
    h=`<section class="section">${campHead(`Step ${cv.step+1} · ${s.t}`,`Lesson · slide ${cv.idx+1} of ${s.slides.length}`,(cv.idx+1)/s.slides.length)}
     <div class="card slide cslide">${campSlide(sl)}</div>
     <div class="row cnav"><button class="btn" data-camp="prev" ${cv.idx?"":"disabled"}>‹ Previous</button>${last?`<button class="btn pri" data-camp="do" data-i="${cv.step}">Start the practice ▶</button>`:`<button class="btn pri" data-camp="fwd">Next ›</button>`}</div>
     <button class="btn ghost small" data-camp="hub" style="margin-top:10px">All steps</button></section>`}
  else if(cv.scr==="do"||cv.scr==="cap"){const cap=cv.scr==="cap",it=cv.items[cv.i],firstPass=Math.min(cv.i,cv.total);
    h=`<section class="section">${campHead(cap?`Close December · ${cv.lab[cv.i]}`:`Step ${cv.step+1} · ${CAMP[cv.step].t}`,cap?`Item ${cv.i+1} of ${cv.total} · ${cv.ok} right first try`:it.redo?`One more look · ${cv.ok} of ${cv.total} right first try`:`Question ${cv.i+1} of ${cv.total} · ${cv.ok} right`,(firstPass+(cv.cur&&cv.cur.done&&!it.redo?1:0))/cv.total)}
     <div class="card cex1">${campExHtml()}</div><button class="btn ghost small" data-camp="hub" style="margin-top:10px">${cap?"Save and leave (you can continue later)":"Leave practice"}</button></section>`}
  else if(cv.scr==="res"){const s=CAMP[cv.step],pass=cv.pct>=0.8,n=campNextInfo();
    h=`<section class="section"><div class="cres ${pass?"ok":"no"}"><div class="cbig2">${Math.round(cv.pct*100)}%</div><h2>${pass?"Step passed":"Not yet: 80% passes"}</h2><p>${cv.ok} of ${cv.total} right on the first try · ${e(s.t)}</p>${pass?`<p class="small">You can now: ${e(s.goal.charAt(0).toLowerCase()+s.goal.slice(1))}</p>`:`<p class="small">The ones you missed come first next time, mixed with new ones.</p>`}</div>
     ${pass&&n?`<button class="donext" data-camp="go"><span class="dn1">👉 DO THIS NEXT</span><b>${e(n.t.replace(/^.*? step /,"Step "))}</b><span class="dn2">${e(n.d)}</span><span class="dn3">Tap here ▶</span></button>`:""}
     ${pass&&!n&&CT.after?`<button class="btn pri pcert" data-camp="after">${e(CT.after.t)} ▶</button>`:""}
     <div class="row cnav">${pass?"":`<button class="btn pri" data-camp="do" data-i="${cv.step}">Try again ▶</button>`}<button class="btn" data-camp="learn" data-i="${cv.step}">📖 Reread the lesson</button>${pass?`<button class="btn" data-camp="do" data-i="${cv.step}">Practice again</button>`:""}<button class="btn" data-camp="hub">All steps</button></div></section>`}
  else if(cv.scr==="capres"){const pass=cv.pct>=0.8,F=cv.F;
    h=`<section class="section"><div class="cres ${pass?"ok":"no"}"><div class="cbig2">${Math.round(cv.pct*100)}%</div><h2>${pass?"December is closed":"Close again: 80% passes"}</h2><p>${cv.ok} of ${cv.total} right on the first try</p><p class="small">${pass?"You recorded a month of documents, tied the books to the bank, adjusted, and produced the statements. That is the monthly job of a bookkeeper.":"The entries are the same next time, so use the feedback you just saw."}</p></div>
     <h3 style="margin:16px 0 6px">${e(CAMPCO)} · Profit and loss · December</h3>${visHtml(campPLVis(F))}
     <h3 style="margin:16px 0 6px">${e(CAMPCO)} · Balance sheet · December 31</h3>${visHtml(campBSVis(F))}
     <div class="cex" style="margin-top:10px">Both statements are computed from the entries you just recorded. Total assets equal liabilities plus equity, which is the check that the month is complete.</div>
     <div class="row cnav">${pass?"":`<button class="btn pri" data-camp="cap">Close it again ▶</button>`}<button class="btn${pass?" pri":""}" data-camp="hub">Back to all steps</button></div></section>`}
  $("#view").innerHTML=h}
function campCheat(){if(typeof glClose==="function")glClose();const o=document.createElement("div");o.id="glpop";
  o.innerHTML=`<div class="glsheet"><div class="glgrab"></div><div class="glt" style="font-size:20px">Bookkeeping cheat sheet</div>
   ${visHtml({k:"cmp",a:["Grow with a DEBIT",["Assets","Expenses","Owner's draw"]],b:["Grow with a CREDIT",["Liabilities","Equity","Revenue"]]})}
   <p style="margin-top:10px"><b>Three questions:</b> Which accounts are touched? What type is each, and did it go up or down? Is that a debit or a credit?</p>
   <p><b>Not income:</b> owner money in, loans, customer prepayments, sales tax collected.<br><b>Not an expense:</b> equipment, loan principal, owner draws, paying a card or a bill already recorded.</p>
   <button class="btn pri" id="glok" style="width:100%">Got it</button></div>`;document.body.appendChild(o);document.body.classList.add("glopen")}
function campClick(d){campT((cv&&cv.tr)||"bk");const a=d.camp,c=cv&&cv.cur;
  if(a==="track"){campOpen(d.tr);return true}
  if(a==="after"){const g=CT.after&&CT.after.go;if(g)bkGo({k:g});return true}
  if(a==="hub"){cv={scr:"hub",tr:CT.id};window.scrollTo(0,0);return true}
  if(a==="go"){campGoNext();return true}
  if(a==="cheat"){campCheat();return true}
  if(a==="open"){const r=campS().st[CAMP[+d.i].id]||{};if(r.l||r.ok){campStartDo(+d.i)}else cv={scr:"learn",tr:CT.id,step:+d.i,idx:0};window.scrollTo(0,0);return true}
  if(a==="learn"){cv={scr:"learn",tr:CT.id,step:+d.i,idx:0};window.scrollTo(0,0);return true}
  if(a==="prev"){cv.idx=Math.max(0,cv.idx-1);window.scrollTo(0,0);return true}
  if(a==="fwd"){cv.idx++;if(cv.idx>=CAMP[cv.step].slides.length-1){const r=campS().st[CAMP[cv.step].id]=campS().st[CAMP[cv.step].id]||{};r.l=1;persist()}window.scrollTo(0,0);return true}
  if(a==="do"){const i=+d.i,r=campS().st[CAMP[i].id]=campS().st[CAMP[i].id]||{};r.l=1;persist();campStartDo(i);window.scrollTo(0,0);return true}
  if(a==="cap"){campCapStart();window.scrollTo(0,0);return true}
  if(!c)return true;const x=cv.items[cv.i].x;
  if(a==="eq"&&!c.done){c.pick[+d.j]=d.v;return true}
  if(a==="eqgo"&&!c.done){campAnswer(c.pick.every((v,j)=>v===x[2][j]));return true}
  if(a==="pick"&&!c.done){const k=x[0];if(k==="sort"){c.pk=d.v;campAnswer(d.v===x[2])}else if(k==="dc"){c.pk=d.v;campAnswer(d.v===x[3])}else if(k==="mc"){c.pk=+d.v;campAnswer(+d.v===0)}else if(k==="tap"){c.pk=+d.v;campAnswer(+d.v===x[3])}return true}
  if(a==="acc"&&!c.done&&x[0]==="je"){const l=x[3][c.line],ok=d.v===l[1];c.pk=c.pk||[];c.pk[c.line]=d.v;c.res[c.line]=ok;if(!ok)c.ok=false;c.line++;if(c.line>=x[3].length)campAnswer(c.ok);return true}
  if(a==="next"){cv.i++;if(cv.i>=cv.items.length){if(cv.scr==="cap")campCapFinish();else campFinish()}else campCur();window.scrollTo(0,0);return true}
  return true}

/* ---------- wiring into the course ---------- */
function campTrackOf(m){return Object.values(CAMPS).find(t=>t.mod===m)||null}
const campExtraView0=extraView;extraView=function(){if(view==="camp"){try{document.body.classList.toggle("course",CLOCK())}catch(_){}renderCamp();return true}return campExtraView0()};
const campExtraClick0=extraClick;extraClick=function(b){const d=b.dataset;if(d.camp!==undefined){const r=campClick(d);if(view==="camp")render();return r}return campExtraClick0(b)};
const campBklClick0=bklClick;bklClick=function(d){if(d.bkl==="mod"){const t=campTrackOf(+d.m);if(t&&(t.id==="bk"||!campIn(t.id,campDone))){campOpen(t.id);return true}}if(d.bkl==="tool"&&d.k==="camp"){campOpen("bk");return true}return campBklClick0(d)};
/* next step: each module starts with its Bootcamp track (learn a step, then do it). The older reading units stay as reference:
   module 2's three units are replaced by its track; modules 3 to 5 keep their units after the track. */
bkNext=function(){const J=bkJel();
  for(let m=1;m<=5;m++){const s=bkStats(m),U=UNITS[BK]||[],T=campTrackOf(m);
    if(T){const n=campIn(T.id,()=>campDone()?null:campNextInfo());if(n)return{k:"camp",tr:T.id,m,t:n.t,d:n.d}}
    const u=m===2?-1:bkNextLesson(m);
    if(u>=0){const pos=(S.set.les||{})["u"+BK+"-"+u];return{k:"les",u,m,t:`Lesson: ${U[u].t}`,d:`Module ${m} · ${U[u].s.length} slides · about ${Math.max(5,Math.round(U[u].s.length*1.2))} min${pos!==undefined?" · pick up where you stopped":""}`}}
    if(s.known<s.cards*0.5)return{k:"cards",m,t:`Flashcards: ${PARTS[BK].doms[m][0]}`,d:`Module ${m} · ${s.known} of ${s.cards} known · 10 min`};
    if(s.right<s.qs*0.7)return{k:"quiz",m,t:`Quiz: ${PARTS[BK].doms[m][0]}`,d:`Module ${m} · ${s.right} of ${s.qs} right · aim for 70% · 8 min`};
    if(m===2&&J.ok<12)return{k:"jel",t:"Journal Entry Lab",d:`Record real business events · ${J.ok} of 12 right · 10 min`};
    if(m===3&&bkQt(/./)<1)return{k:"qbo",t:"QuickBooks practice company",d:"Keep a month of books for a real-looking company · 20 min"};
    if(m===4&&bkTax()<1)return{k:"tax",t:"Practice tax software",d:"Run a client file from intake to e-file · 25 min"}}
  if(bkFirm()<1)return{k:"firm",t:"Run Solving Life LLC for a year",d:"Deadlines, clients, pricing and compliance · 20 min"};
  return{k:"workout",t:"Daily workout",d:"Fresh numbers every time: payroll, reconciliations, Schedule C · 10 min"}};
const campBkGo0=bkGo;bkGo=function(n){if(n&&n.k==="camp"){campGoNext(n.tr||"bk");return}return campBkGo0(n)};
/* progress: module 2 counts the Bookkeeping Bootcamp's slides in place of its three older units; every track's steps count as real tasks */
const campBkStats0=bkStats;bkStats=function(d){const r=campBkStats0(d);try{const pc=(a,b)=>b?a/b:0;let slides=r.slides,read=r.read,labs=r.labs,labsDone=r.labsDone,touched=false;
    Object.values(CAMPS).forEach(T=>{if(d!=="all"&&d!=T.mod)return;touched=true;campIn(T.id,()=>{labs+=campN();labsDone+=campPassed();
      if(T.id==="bk"){const o=campBkStats0(2),st=campS().st;slides+=campSlidesN()-o.slides;read+=CAMP.reduce((n,s)=>n+((st[s.id]||{}).l||(st[s.id]||{}).ok?s.slides.length:0),0)-o.read}})});
    if(!touched)return r;return Object.assign({},r,{slides,read,labs,labsDone,pct:(0.2*pc(read,slides)+0.35*pc(r.known,r.cards)+0.25*pc(r.right,r.qs)+0.2*pc(labsDone,labs))*100})}catch(_){return r}};
/* skills map: passing Bootcamp steps proves the same skills. Entries are [track, step id] or [track, "cap"]. */
(function(){const ok=(tr,id)=>CAMPS[tr]?campIn(tr,()=>id==="cap"?(campS().cap.done?1:0):id==="all"?campPassed()/campN():((campS().st[id]||{}).ok?1:0)):0,avg=ids=>ids.reduce((n,x)=>n+ok(x[0],x[1]),0)/ids.length,add=(k,ids)=>{const f=BKSKILLS[k][3];BKSKILLS[k][3]=()=>{let a=0,b=0;try{a=f()||0}catch(_){}try{b=avg(ids)}catch(_){}return Math.max(a,b)}};
  try{const B=x=>["bk",x];add(1,["eq","acct","dc","je1","sales","buy"].map(B));add(2,["adj","cap"].map(B));add(3,[B("rec")]);add(5,[B("pay")]);add(6,["stmt","cap"].map(B));BKSTAGES[1]=[2,"📒","Bookkeeping Bootcamp","12 hands-on steps with one studio's books, then you close its first month."]}catch(_){}})();
/* course home: a Bootcamp tile first in the practice grid, and the long skills list folds away */
const campRenderBkLand0=renderBkLand;renderBkLand=function(){campRenderBkLand0();try{const v=document.getElementById("view"),g=v.querySelector(".bkl-tools");
    if(g&&!g.querySelector('[data-camp="track"]')){Object.values(CAMPS).slice().reverse().forEach(T=>{const b=document.createElement("button");b.className="bkl-tool";b.dataset.camp="track";b.dataset.tr=T.id;const st=campIn(T.id,()=>campPassed()+" of "+campN()+" steps");b.innerHTML=`<span class="bkl-ti">${T.ic||"📒"}</span><b>${esc(T.name)}</b><span class="small">${esc(T.tile||T.blurb)}</span><span class="bkl-tc">${st}</span>`;g.insertBefore(b,g.firstChild)})}
    const sk=v.querySelector(".bkl-skills");if(sk&&!sk.closest("details")){const hd=sk.previousElementSibling,h3=hd&&hd.previousElementSibling,got=sk.querySelectorAll(".bkl-sk.got").length,d=document.createElement("details");d.className="more";d.id="bkskills";if(OPEN.bkskills)d.open=true;
      d.innerHTML=`<summary><b>Skills you can show an employer</b><span>${got} of ${BKSKILLS.length} earned · tap to see each one</span></summary>`;sk.parentNode.insertBefore(d,sk);const box=document.createElement("div");box.style.padding="0 12px 12px";d.appendChild(box);if(hd&&hd.classList.contains("small"))box.appendChild(hd);box.appendChild(sk);if(h3&&h3.tagName==="H3")h3.remove()}}catch(_){}};
