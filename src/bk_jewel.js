/* ================= Foundation course: welcome screen, job-ready skills map, Journal Entry Lab =================
   Open with ?course (and &name=Cristy) to install it as its own app, "Foundation Course".
   All companies, people and numbers in the lab are invented. */
function CLOCK(){try{return localStorage.getItem("courseLock")==="1"}catch(_){return false}}
function CNAME(){try{return localStorage.getItem("courseName")||""}catch(_){return ""}}
function courseUI(){try{document.title="Foundation Course";const m=document.querySelector('link[rel="manifest"]');if(m)m.setAttribute("href","manifest-course.webmanifest");
  const at=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(at)at.setAttribute("content","Foundation");
  const ic=document.querySelector('link[rel="apple-touch-icon"]');if(ic)ic.setAttribute("href","apple-touch-icon-course.png");
  const tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute("content","#0f7a3d")}catch(_){}}
(function(){try{const q=new URLSearchParams(location.search);
  if(q.has("study"))localStorage.removeItem("courseLock");
  else if(q.has("course")){localStorage.setItem("courseLock","1");localStorage.removeItem("kidsLock");const n=(q.get("name")||"").replace(/[^A-Za-zÀ-ž' -]/g,"").slice(0,30);if(n)localStorage.setItem("courseName",n)}
  if(CLOCK()){courseUI();setTimeout(()=>{if(typeof KLOCK==="function"&&KLOCK())return;part=BK;view="bkland";render()},0)}}catch(_){}})();

/* ---------- views and clicks added to the app ---------- */
function extraView(){try{document.body.classList.toggle("course",CLOCK());}catch(_){}
  if(view==="bkland"){renderBkLand();return true}
  if(view==="jelab"){renderJel();return true}
  if(view==="firm"&&typeof renderFirm==="function"){renderFirm();return true}
  return false}
function extraClick(b){const d=b.dataset;
  if(d.sec==="start"&&CLOCK()&&view!=="bkland"){hush();view="bkland";render();window.scrollTo(0,0);return true}
  if(d.mode==="bkland"){part=BK;view="bkland";render();window.scrollTo(0,0);return true}
  if(d.mode==="jelab"){jel=null;view="jelab";render();window.scrollTo(0,0);return true}
  if(d.mode==="firm"&&typeof renderFirm==="function"){view="firm";render();window.scrollTo(0,0);return true}
  if(d.mode==="workout"){part=BK;filt="all";startSession("calc",10);return true}
  if(d.bkl!==undefined)return bklClick(d);
  if(d.jel!==undefined)return jelClick(d);
  if(d.firm!==undefined&&typeof firmClick==="function")return firmClick(d);
  return false}

/* ---------- progress helpers ---------- */
function bkRatio(a,b){return b?Math.max(0,Math.min(1,a/b)):0}
function bkJel(){S.set.jel=S.set.jel||{ok:0,n:0,adj:0,pay:0,rounds:0,miss:{}};return S.set.jel}
function bkLabRatio(re){const L=LABS.filter(o=>re.test(o.t));if(!L.length)return 0;return L.filter(o=>{const r=labDone(o);return r&&r[0]/r[1]>=0.7}).length/L.length}
function bkQt(re){try{const t=qtasks().filter(x=>re.test(x[0]));return t.length?t.filter(x=>x[1]).length/t.length:0}catch(_){return 0}}
function bkTax(){try{return bkRatio(TC.filter(c=>(TS().r[c.id]||{}).ack==="Accepted").length,TC.length)}catch(_){return 0}}
function bkP10(){try{const pt=TS().p10||{};return bkRatio(P10.filter((c,i)=>pt[i]).length,5)}catch(_){return 0}}
function bkMod(m){const s=bkStats(m);return s}
function bkQuiz(m){const s=bkStats(m);return bkRatio(s.right,Math.ceil(s.qs*0.7))}
function bkFirm(){const f=S.set.firm||{};return f.best?bkRatio(f.best,80):f.m?bkRatio(f.m,12)*0.5:0}
function bkGen(re){let ok=0,n=0;for(const g of GENS){if(g.p!=BK||!re.test(g.id))continue;n++;const r=S.it[g.id];if(r&&r[4])ok++}return n?bkRatio(ok,Math.min(n,3)):0}
const BKSKILLS=[
 ["🧾","Read a paycheck and the U.S. tax system","Gross to net, FICA, W-4, who collects what.",()=>bkQuiz(1)],
 ["⚖️","Debits and credits","Record any business event as a balanced journal entry.",()=>bkRatio(bkJel().ok,12)],
 ["📆","Month-end adjusting entries","Prepaids, accruals, depreciation, unearned revenue.",()=>bkRatio(bkJel().adj,5)],
 ["🏦","Bank reconciliation","Match the books to the bank statement, find the difference.",()=>Math.max(bkLabRatio(/reconcile/i),bkQt(/reconcil/i))],
 ["💻","QuickBooks Online daily work","Invoices, bills, payments, bank feed, rules, deposits.",()=>bkQt(/./)],
 ["💵","Payroll","Gross pay, withholding, employer taxes, deposits.",()=>Math.max(bkRatio(bkJel().pay,3),bkLabRatio(/payday/i),bkGen(/^g4-pay/))],
 ["📊","Financial statements","Profit and loss, balance sheet, what they tell an owner.",()=>bkQuiz(2)],
 ["🧮","Individual returns (Form 1040)","Wages, credits, deductions, refund or balance due.",()=>Math.max(bkTax(),bkLabRatio(/Mock return [123]/i))],
 ["🛠️","Self-employed clients (Schedule C)","Business income, expenses, SE tax, estimates.",()=>Math.max(bkP10(),bkLabRatio(/freelancer/i),bkGen(/^g4-se/))],
 ["🗣️","Client interviews and documents","Ask the right questions, spot what's missing.",()=>bkLabRatio(/Client/i)],
 ["🔒","Ethics, privacy and security","Circular 230, consent to disclose, the office security plan.",()=>bkQuiz(5)],
 ["🏢","Run Solving Life LLC","Deadlines, pricing, compliance and cash for a year.",()=>bkFirm()]];
function bkSkillVals(){return BKSKILLS.map(s=>{let v=0;try{v=s[3]()}catch(_){}return Math.max(0,Math.min(1,v||0))})}
function bkRing(p,sz,col){const r=sz/2-7,c=2*Math.PI*r;return `<svg class="bklring" viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" aria-hidden="true"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="10"/><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${col||"#fff"}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(c*p).toFixed(1)} ${c.toFixed(1)}" ${p<0.005?'opacity="0"':""} transform="rotate(-90 ${sz/2} ${sz/2})"/></svg>`}

/* ---------- what to do next: one button that always knows ---------- */
function bkNextLesson(m){const U=UNITS[BK]||[];for(let k=0;k<U.length;k++){const u=U[k];if(u.d!=m)continue;const pos=(S.set.les||{})["u"+BK+"-"+k];if(pos===undefined||pos<u.s.length-1)return k}return -1}
function bkNext(){const J=bkJel();
  for(let m=1;m<=5;m++){const s=bkStats(m),u=bkNextLesson(m),U=UNITS[BK]||[];
    if(u>=0){const pos=(S.set.les||{})["u"+BK+"-"+u];return{k:"les",u,m,t:`Lesson: ${U[u].t}`,d:`Module ${m} · ${U[u].s.length} slides · about ${Math.max(5,Math.round(U[u].s.length*1.2))} min${pos!==undefined?" · pick up where you stopped":""}`}}
    if(s.known<s.cards*0.5)return{k:"cards",m,t:`Flashcards: ${PARTS[BK].doms[m][0]}`,d:`Module ${m} · ${s.known} of ${s.cards} known · 10 min`};
    if(s.right<s.qs*0.7)return{k:"quiz",m,t:`Quiz: ${PARTS[BK].doms[m][0]}`,d:`Module ${m} · ${s.right} of ${s.qs} right · aim for 70% · 8 min`};
    if(m===2&&J.ok<12)return{k:"jel",t:"Journal Entry Lab",d:`Record real business events · ${J.ok} of 12 right · 10 min`};
    if(m===3&&bkQt(/./)<1)return{k:"qbo",t:"QuickBooks practice company",d:"Keep a month of books for a real-looking company · 20 min"};
    if(m===4&&bkTax()<1)return{k:"tax",t:"Practice tax software",d:"Run a client file from intake to e-file · 25 min"}}
  if(bkFirm()<1)return{k:"firm",t:"Run Solving Life LLC for a year",d:"Deadlines, clients, pricing and compliance · 20 min"};
  return{k:"workout",t:"Daily workout",d:"Fresh numbers every time: payroll, reconciliations, Schedule C · 10 min"}}
function bkGo(n){if(n.k==="les"){part=BK;les={unit:null,topic:null,idx:0};view="lessons";lesOpen("u",n.u);return}
  if(n.k==="cards"||n.k==="quiz"){part=BK;filt=n.m;startSession(n.k,10);return}
  if(n.k==="jel"){jel=null;view="jelab";render();window.scrollTo(0,0);return}
  if(n.k==="qbo"){qv={tab:"home",form:null,msg:"",doc:-1};view="qbo";render();window.scrollTo(0,0);return}
  if(n.k==="tax"){view="taxsim";render();window.scrollTo(0,0);return}
  if(n.k==="firm"){view="firm";render();window.scrollTo(0,0);return}
  if(n.k==="review"){part=BK;filt="all";startSession("cards",15);return}
  part=BK;filt="all";startSession("calc",10)}

/* ---------- the welcome screen ---------- */
const BKSTAGES=[[1,"💵","Money, paychecks and the tax system","How money moves, gross to net pay, who collects which tax."],[2,"📒","Bookkeeping","Debits and credits, the five account types, month-end, statements."],[3,"💻","QuickBooks Online","The screens a bookkeeper uses every day, start to finish."],[4,"🧾","Individual tax returns","Form 1040: income, deductions, credits, refund or balance due."],[5,"🏢","Business taxes and the tax office","Schedule C, payroll forms, ethics, privacy and security."],[6,"🚀","Real work","Simulators, practice returns, and running Solving Life LLC."]];
/* second item of today's plan: fits where the learner is. Before journal entries have been taught (Bootcamp step 4),
   it is the current module's flashcards, not the Journal Entry Lab or the calculation workout. */
function bkPlan2(n){let je=true;try{je=typeof campIn==="function"?!!campIn("bk",()=>(campS().st.je1||{}).ok):true}catch(_){}
  if(!je){const m=n.m||1;return n.k==="cards"?null:["🃏",`10 flashcards · ${PARTS[BK].doms[m][0]}`,"cards"+m]}
  return bkJel().ok<12&&n.k!=="jel"?["⚖️","Record 5 entries in the Journal Entry Lab","jel"]:["🏋️","One workout round","workout"]}
function renderBkLand(){if(typeof touchDay==="function")touchDay();const t=$("#tabs");if(t&&CLOCK())t.innerHTML="";const e=esc,a=bkStats("all"),nm=CNAME(),sk=bkSkillVals(),earned=sk.filter(v=>v>=1).length;
  const n=bkNext(),due=dueList(BK,"all").length,started=a.read+a.known+a.right>0;
  const stagePct=m=>m<6?bkStats(m).pct/100:(bkTax()+bkQt(/./)+bkFirm()+bkP10())/4;
  const cur=n.m||6;
  const road=BKSTAGES.map(([m,ic,t,d])=>{const p=stagePct(m),done=p>=0.85,here=!done&&m===cur;
    return `<button class="bkl-st${done?" done":""}${here?" here":""}" data-bkl="mod" data-m="${m}"><span class="bkl-node">${done?"✓":ic}</span><span class="bkl-stb"><b>${m<6?"Module "+m+" · ":""}${e(t)}</b><span class="small">${e(d)}</span><span class="bkl-bar"><i style="width:${Math.round(p*100)}%"></i></span></span>${here?`<span class="bkl-chip">You are here</span>`:done?`<span class="bkl-chip ok">Done</span>`:""}</button>`}).join("");
  const skills=BKSKILLS.map((s,k)=>{const v=sk[k];return `<div class="bkl-sk${v>=1?" got":""}"><span class="bkl-ski">${s[0]}</span><span><b>${e(s[1])}</b><span class="small">${e(s[2])}</span><span class="bkl-bar"><i style="width:${Math.round(v*100)}%"></i></span></span><span class="bkl-skv">${v>=1?"✓":Math.round(v*100)+"%"}</span></div>`}).join("");
  const tools=[["jelab","⚖️","Journal Entry Lab","Real receipts and bills → a balanced entry. Watch the T-accounts and the accounting equation move.",`${bkJel().ok} entries right`],
    ["qbo","💻","QuickBooks practice company","A working copy of the daily screens: invoices, bills, bank feed, reconcile, reports.",`${(()=>{try{const q=qtasks();return q.filter(x=>x[1]).length+" of "+q.length}catch(_){return "13"}})()} jobs`],
    ["taxsim","🧾","Practice tax software","Client files from intake to e-file, with real-looking W-2s and diagnostics.","5 files + 20 returns"],
    ["firm","🏢","Run Solving Life LLC","A year of the business: deadlines, clients, pricing, compliance. Can you finish with happy clients and cash?",S.set.firm&&S.set.firm.best?`best score ${S.set.firm.best}`:"12 months"],
    ["workout","🏋️","Daily workout","Payroll, reconciliations, sales tax, Schedule C. New numbers each time, 4 choices, taught step by step.","10 min"],
    ["cards","🧠","Flashcards",due?`${due} cards are due today. Two minutes keeps them in memory.`:"Recall, flip, rate. Missed cards come back sooner.",`${a.known} of ${a.cards} known`]]
   .map(([k,ic,t,d,c])=>`<button class="bkl-tool" data-bkl="tool" data-k="${k}"><span class="bkl-ti">${ic}</span><b>${e(t)}</b><span class="small">${e(d)}</span><span class="bkl-tc">${e(c)}</span></button>`).join("");
  const plan=[due?["🧠",`Review ${Math.min(due,15)} due flashcards`,"review"]:null,["▶",n.t,"next"],bkPlan2(n)].filter(Boolean);
  $("#view").innerHTML=`<section class="bkl">
   <div class="bkl-hero">
    <div class="bkl-hi">${nm?`${started?"Welcome back":"Welcome"}, ${e(nm)} 👋`:started?"Welcome back 👋":"Welcome 👋"}</div>
    <h1>Bookkeeping, QuickBooks and taxes, from zero to job-ready</h1>
    <p>Real skills, step by step: keep a company's books, run payroll, prepare tax returns, and help run Solving Life LLC.</p>
    <div class="bkl-ringrow"><div class="bkl-ringw">${bkRing(a.pct/100,112)}<div class="bkl-ringt"><b>${Math.round(a.pct)}%</b><span>course</span></div></div>
     <div class="bkl-stats"><div><b>${earned}</b><span>of ${BKSKILLS.length} job skills</span></div><div><b>${a.read}</b><span>of ${a.slides} slides</span></div><div><b>${a.labsDone}</b><span>of ${a.labs} real tasks</span></div></div></div>
    <button class="bkl-go" data-bkl="go"><span class="bkl-play">▶</span><span><span class="small">${started?"Continue":"Start here"}</span><b>${e(n.t)}</b><span class="small">${e(n.d)}</span></span></button>
   </div>
   <h3 class="bkl-h">Today · about 20 minutes</h3>
   <div class="bkl-plan">${plan.map(([ic,t,k],i)=>`<button class="bkl-pl" data-bkl="plan" data-k="${k}"><span class="bkl-pn">${i+1}</span><span>${ic} ${e(t)}</span><span class="bkl-arrow">›</span></button>`).join("")}</div>
   <h3 class="bkl-h">Your path</h3>
   <div class="bkl-road">${road}</div>
   <h3 class="bkl-h">Skills you can show an employer</h3>
   <div class="small muted" style="margin:-4px 0 8px">Each skill fills up as you prove it in the quizzes, labs and simulators. ${earned} earned so far.</div>
   <div class="bkl-skills">${skills}</div>
   <h3 class="bkl-h">Practice like it's a real job</h3>
   <div class="bkl-tools">${tools}</div>
   <div class="bkl-foot"><button class="btn" data-bkl="menu">All course tools and modules</button><button class="btn ghost small" data-bkl="sections">Other sections (EA exam and more)</button></div>
   <div class="small muted" style="text-align:center;margin:10px 0 24px">Works offline · saved on this device · amounts for 2025 and 2026</div>
  </section>`}
function bklClick(d){
  if(d.bkl==="go"||d.k==="next"){bkGo(bkNext());return true}
  if(d.bkl==="plan"){if(d.k==="review")bkGo({k:"review"});else if(d.k==="jel")bkGo({k:"jel"});else if(/^cards\d$/.test(d.k))bkGo({k:"cards",m:+d.k.slice(5)});else bkGo({k:d.k});return true}
  if(d.bkl==="mod"){const m=+d.m;if(m<6){part=BK;filt=m;view="home"}else{part=BK;filt="all";view="home"}render();window.scrollTo(0,0);return true}
  if(d.bkl==="tool"){const k=d.k;if(k==="cards"){part=BK;filt="all";startSession("cards",15);return true}
    if(k==="jelab")return bkGo({k:"jel"}),true;if(k==="qbo")return bkGo({k:"qbo"}),true;if(k==="taxsim")return bkGo({k:"tax"}),true;if(k==="firm")return bkGo({k:"firm"}),true;bkGo({k:"workout"});return true}
  if(d.bkl==="menu"){part=BK;filt="all";view="home";render();window.scrollTo(0,0);return true}
  if(d.bkl==="sections"){view="start";render();window.scrollTo(0,0);return true}
  return false}

/* ================= Journal Entry Lab ================= */
// type: A asset, CA contra asset, L liability, E owner's capital, D owner's draws, R revenue, X expense
const JACC={"Checking":"A","Accounts Receivable":"A","Supplies":"A","Prepaid Insurance":"A","Inventory":"A","Equipment":"A","Accumulated Depreciation":"CA",
 "Accounts Payable":"L","Credit Card Payable":"L","Wages Payable":"L","Payroll Liabilities":"L","Sales Tax Payable":"L","Unearned Revenue":"L","Loan Payable":"L",
 "Owner's Capital":"E","Owner's Draws":"D","Service Revenue":"R","Sales":"R",
 "Rent Expense":"X","Wages Expense":"X","Payroll Tax Expense":"X","Utilities Expense":"X","Insurance Expense":"X","Supplies Expense":"X","Depreciation Expense":"X","Software Subscriptions":"X","Bank Fees":"X","Interest Expense":"X","Cost of Goods Sold":"X","Bad Debt Expense":"X","Advertising":"X"};
const JTYPE={A:"an asset",CA:"a contra asset (it reduces an asset)",L:"a liability",E:"owner's equity",D:"owner's draws (reduces equity)",R:"revenue",X:"an expense"};
const JUP={A:"debit",CA:"credit",L:"credit",E:"credit",D:"debit",R:"credit",X:"debit"};
const JCO="Bright Path Cleaning LLC";
const jr=(a,b,s)=>R(a,b,s||10);
const JEV=[
 {c:"owner",f:()=>{const a=jr(2000,10000,500);return{doc:["memo","Owner contribution",[["From","Ana Reyes, owner"],["Deposited to","Business checking"],["Amount",$$(a)]]],t:`The owner moves ${$$(a)} of her own money into the business checking account.`,L:[["Checking",a],["Owner's Capital",-a]],w:"Cash (an asset) goes up: debit Checking. The owner's stake goes up: credit Owner's Capital. It is not revenue, because the business didn't earn it."}}},
 {c:"cash",f:()=>{const a=jr(800,4000,50);return{doc:["rcpt","Receipt · Metro Equipment Supply",[["Commercial floor scrubber",$$(a)],["Paid","Debit card, business checking"]]],t:`Buys a floor scrubber for ${$$(a)}, paid from checking. It will last several years.`,L:[["Equipment",a],["Checking",-a]],w:"A long-lasting item is an asset, not an expense: debit Equipment. Cash went down: credit Checking. Its cost becomes an expense over time through depreciation."}}},
 {c:"credit",f:()=>{const a=jr(60,400,5);return{doc:["rcpt","Receipt · CleanCo Supplies",[["Mops, sprays, cloths",$$(a)],["Paid","Business credit card"]]],t:`Buys cleaning supplies for ${$$(a)} on the business credit card.`,L:[["Supplies",a],["Credit Card Payable",-a]],w:"Supplies on the shelf are an asset until used: debit Supplies. Nothing left the bank yet; the business owes the card company: credit Credit Card Payable."}}},
 {c:"cash",f:()=>{const a=jr(900,2400,50);return{doc:["bank","Bank statement line",[["ACH · Oakridge Properties · rent","−"+$$(a)]]],t:`Pays this month's office rent, ${$$(a)}, from checking.`,L:[["Rent Expense",a],["Checking",-a]],w:"Rent for this month is used up this month: debit Rent Expense. Cash goes down: credit Checking."}}},
 {c:"sale",f:()=>{const a=jr(300,2500,25);return{doc:["inv","Invoice #"+R(1040,1099,1),[["Customer","Lakeside Dental"],["Office cleaning, 4 visits",$$(a)],["Terms","Net 30"]]],t:`Sends Lakeside Dental an invoice for ${$$(a)} of cleaning already done, due in 30 days.`,L:[["Accounts Receivable",a],["Service Revenue",-a]],w:"The work is done, so the revenue is earned now (accrual basis): credit Service Revenue. The customer owes the money: debit Accounts Receivable, an asset."}}},
 {c:"sale",f:()=>{const a=jr(300,2500,25);return{doc:["bank","Bank deposit",[["Check from Lakeside Dental · invoice paid","+"+$$(a)]]],t:`Lakeside Dental pays its ${$$(a)} invoice by check. The revenue was recorded when the invoice was sent.`,L:[["Checking",a],["Accounts Receivable",-a]],w:"Cash goes up: debit Checking. The customer no longer owes it: credit Accounts Receivable. Don't credit revenue again; it was recorded with the invoice."}}},
 {c:"sale",f:()=>{const a=jr(120,600,10);return{doc:["rcpt","Sales receipt",[["Move-out deep clean",$$(a)],["Paid","On the spot, card"]]],t:`A homeowner pays ${$$(a)} on the spot for a move-out clean.`,L:[["Checking",a],["Service Revenue",-a]],w:"Paid when the work is done, so no receivable: debit Checking, credit Service Revenue. In QuickBooks this is a sales receipt, not an invoice."}}},
 {c:"credit",f:()=>{const a=jr(90,380,5);return{doc:["bill","Bill · Xcel Energy",[["Electricity, office",$$(a)],["Due","in 21 days"]]],t:`The electric bill arrives: ${$$(a)}, due in three weeks. Recorded now, paid later.`,L:[["Utilities Expense",a],["Accounts Payable",-a]],w:"This month's power is a cost of this month: debit Utilities Expense. The business owes it: credit Accounts Payable."}}},
 {c:"cash",f:()=>{const a=jr(90,380,5);return{doc:["bank","Bank statement line",[["Online bill pay · Xcel Energy","−"+$$(a)]]],t:`Pays the ${$$(a)} electric bill that was already entered as a bill.`,L:[["Accounts Payable",a],["Checking",-a]],w:"The debt is gone: debit Accounts Payable. Cash goes down: credit Checking. No new expense; it was recorded with the bill."}}},
 {c:"cash",f:()=>{const m=R(80,250,10),a=m*12;return{doc:["rcpt","Policy invoice · Front Range Insurance",[["General liability, 12 months",$$(a)],["Paid","From checking"]]],t:`Pays ${$$(a)} for a 12-month liability policy that starts today.`,L:[["Prepaid Insurance",a],["Checking",-a]],w:"Coverage for future months is an asset now: debit Prepaid Insurance. Each month-end, one month moves to Insurance Expense."}}},
 {c:"adj",f:()=>{const m=R(80,250,10);return{doc:["memo","Month-end adjustment",[["Prepaid policy",$$(m*12)+" for 12 months"],["Used this month","1 month"]]],t:`Month-end: one month of the ${$$(m*12)} insurance policy has been used.`,L:[["Insurance Expense",m],["Prepaid Insurance",-m]],w:`${$$(m*12)} ÷ 12 = ${$$(m)} used up: debit Insurance Expense, credit Prepaid Insurance. The asset shrinks as time passes.`}}},
 {c:"credit",f:()=>{const a=jr(500,3000,100);return{doc:["bank","Bank deposit",[["Deposit from Summit Offices · for next quarter's cleaning","+"+$$(a)]]],t:`Summit Offices pays ${$$(a)} in advance for cleaning that will be done over the next three months.`,L:[["Checking",a],["Unearned Revenue",-a]],w:"Cash is in, but the work isn't done, so it isn't revenue yet. The business owes the service: credit Unearned Revenue, a liability."}}},
 {c:"adj",f:()=>{const a=R(2,10,1)*300,p=a/3;return{doc:["memo","Month-end adjustment",[["Prepaid by Summit Offices",$$(a)+" for 3 months"],["Cleaning done this month","1 month"]]],t:`Month-end: one of the three prepaid months for Summit Offices is done (${$$(a)} ÷ 3).`,L:[["Unearned Revenue",p],["Service Revenue",-p]],w:"The liability shrinks as the work is done: debit Unearned Revenue. Now it is earned: credit Service Revenue."}}},
 {c:"adj",f:()=>{const c=R(30,90,6)*100,y=PK([3,5]),m=c/y/12;return{doc:["memo","Month-end adjustment",[["Equipment cost",$$(c)],["Useful life",y+" years, straight line"],["Period","1 month"]]],t:`Month-end depreciation on ${$$(c)} of equipment with a ${y}-year life (straight line).`,L:[["Depreciation Expense",Math.round(m)],["Accumulated Depreciation",-Math.round(m)]],w:`${$$(c)} ÷ ${y} years ÷ 12 = ${$$(m)} a month. Debit Depreciation Expense. Credit Accumulated Depreciation, the contra asset that holds the total so far. The Equipment account itself stays at cost.`}}},
 {c:"adj",f:()=>{const b=jr(300,900,10),l=jr(60,b-150,10);return{doc:["memo","Month-end supply count",[["Supplies on the books",$$(b)],["Counted on the shelf",$$(l)]]],t:`The books show ${$$(b)} of supplies, but only ${$$(l)} are left on the shelf.`,L:[["Supplies Expense",b-l],["Supplies",-(b-l)]],w:`Used up: ${$$(b)} − ${$$(l)} = ${$$(b-l)}. Debit Supplies Expense, credit Supplies so the asset matches the count.`}}},
 {c:"adj",f:()=>{const a=jr(600,2400,20);return{doc:["memo","Month-end adjustment",[["Wages earned Dec 29–31",$$(a)],["Payday","January 5"]]],t:`The crew earned ${$$(a)} in the last days of the month, but payday is next month.`,L:[["Wages Expense",a],["Wages Payable",-a]],w:"The work happened this month, so the cost belongs to this month: debit Wages Expense. Not paid yet: credit Wages Payable."}}},
 {c:"owner",f:()=>{const a=jr(300,2000,50);return{doc:["bank","Bank statement line",[["Transfer to Ana Reyes personal account","−"+$$(a)]]],t:`The owner transfers ${$$(a)} from the business account to her personal account.`,L:[["Owner's Draws",a],["Checking",-a]],w:"Money taken out by the owner of an LLC taxed as a sole proprietorship is a draw, not a wage or an expense: debit Owner's Draws, credit Checking."}}},
 {c:"cash",f:()=>{const a=PK([12,15,18,25,30]);return{doc:["bank","Bank statement line",[["Monthly service fee","−"+$$(a)]]],t:`The bank statement shows a ${$$(a)} monthly service fee that isn't in the books yet.`,L:[["Bank Fees",a],["Checking",-a]],w:"Found while reconciling: debit Bank Fees, credit Checking. Then the books match the bank."}}},
 {c:"loan",f:()=>{const a=R(5,30,1)*1000;return{doc:["bank","Bank deposit",[["Loan proceeds · First Peak Bank","+"+$$(a)]]],t:`The business borrows ${$$(a)} from the bank; the money lands in checking.`,L:[["Checking",a],["Loan Payable",-a]],w:"Cash up: debit Checking. The business owes it back: credit Loan Payable. A loan is not income."}}},
 {c:"loan",f:()=>{const p=jr(250,800,10),i=jr(30,150,1);return{doc:["bank","Loan statement",[["Payment",$$(p+i)],["Principal",$$(p)],["Interest",$$(i)]]],t:`Makes a ${$$(p+i)} loan payment: ${$$(p)} principal and ${$$(i)} interest.`,L:[["Loan Payable",p],["Interest Expense",i],["Checking",-(p+i)]],w:"Only the principal reduces the loan (debit Loan Payable). Interest is the cost of borrowing (debit Interest Expense). Cash goes down by the full payment (credit Checking)."}}},
 {c:"tax",f:()=>{const a=jr(200,900,10),r=8,t=Math.round(a*r/100);return{doc:["rcpt","Sales receipt",[["Cleaning products sold",$$(a)],["Sales tax 8%",$$(t)],["Total paid",$$(a+t)]]],t:`Sells cleaning products for ${$$(a)} plus 8% sales tax (${$$(t)}); the customer pays ${$$(a+t)}.`,L:[["Checking",a+t],["Sales",-a],["Sales Tax Payable",-t]],w:"Only the price is revenue (credit Sales). The tax belongs to the state; the business just collects it (credit Sales Tax Payable). Cash is the full amount (debit Checking)."}}},
 {c:"tax",f:()=>{const t=jr(150,700,1);return{doc:["bank","Bank statement line",[["Colorado Dept. of Revenue · sales tax","−"+$$(t)]]],t:`Pays the ${$$(t)} of sales tax collected last month to the state.`,L:[["Sales Tax Payable",t],["Checking",-t]],w:"Paying collected sales tax clears the liability: debit Sales Tax Payable, credit Checking. It was never the business's expense."}}},
 {c:"pay",f:()=>{const g=jr(1500,4000,10),w=Math.round(g*PK([0.18,0.2,0.22]));return{doc:["pay","Payroll summary · payday",[["Gross wages",$$(g)],["Withheld (income tax and employee FICA)",$$(w)],["Net pay by direct deposit",$$(g-w)]]],t:`Payday: gross wages ${$$(g)}, withholding ${$$(w)}, net pay ${$$(g-w)} sent to the crew.`,L:[["Wages Expense",g],["Checking",-(g-w)],["Payroll Liabilities",-w]],w:"The full gross wage is the expense (debit Wages Expense). Only net pay leaves the bank today (credit Checking). Withholding is held for the IRS and state until deposited (credit Payroll Liabilities)."}}},
 {c:"pay",f:()=>{const g=jr(1500,4000,10),t=Math.round(g*0.0765);return{doc:["pay","Payroll summary · employer taxes",[["Gross wages",$$(g)],["Employer Social Security and Medicare 7.65%",$$(t)]]],t:`Records the employer's own share of Social Security and Medicare on ${$$(g)} of wages: ${$$(t)}.`,L:[["Payroll Tax Expense",t],["Payroll Liabilities",-t]],w:"The employer's matching FICA (6.2% + 1.45%) is a business expense (debit Payroll Tax Expense) owed to the IRS until deposited (credit Payroll Liabilities)."}}},
 {c:"pay",f:()=>{const a=jr(500,1600,1);return{doc:["bank","Bank statement line",[["EFTPS · IRS federal tax deposit","−"+$$(a)]]],t:`Deposits ${$$(a)} of payroll taxes with the IRS through EFTPS.`,L:[["Payroll Liabilities",a],["Checking",-a]],w:"The deposit clears the liability that built up on payday: debit Payroll Liabilities, credit Checking. No new expense."}}},
 {c:"cash",f:()=>{const a=jr(200,1200,10);return{doc:["bank","Bank statement line",[["Payment to business credit card","−"+$$(a)]]],t:`Pays ${$$(a)} on the business credit card balance.`,L:[["Credit Card Payable",a],["Checking",-a]],w:"The purchases were already recorded when charged. Paying the card only moves money: debit Credit Card Payable, credit Checking."}}},
 {c:"credit",f:()=>{const a=PK([30,45,60,75,99]);return{doc:["rcpt","Card charge · QuickBooks Online",[["Monthly subscription",$$(a)],["Paid","Business credit card"]]],t:`The monthly ${$$(a)} bookkeeping-software subscription is charged to the credit card.`,L:[["Software Subscriptions",a],["Credit Card Payable",-a]],w:"A monthly service used up this month is an expense: debit Software Subscriptions. Charged, not yet paid: credit Credit Card Payable."}}},
 {c:"inv",f:()=>{const a=jr(400,2000,25);return{doc:["bill","Bill · Prairie Wholesale",[["Cleaning products for resale",$$(a)],["Terms","Net 15"]]],t:`Buys ${$$(a)} of cleaning products to resell to customers, on account (pay in 15 days).`,L:[["Inventory",a],["Accounts Payable",-a]],w:"Goods held for sale are an asset: debit Inventory. Owed to the vendor: credit Accounts Payable. They become Cost of Goods Sold when sold."}}},
 {c:"inv",f:()=>{const a=jr(100,600,5);return{doc:["memo","Sale recorded · cost side",[["Cost of products just sold",$$(a)]]],t:`Products that cost ${$$(a)} were just sold. Record the cost side of the sale.`,L:[["Cost of Goods Sold",a],["Inventory",-a]],w:"The goods left the shelf: credit Inventory. Their cost is now an expense matched to the sale: debit Cost of Goods Sold."}}},
 {c:"adj",f:()=>{const a=jr(150,900,10);return{doc:["memo","Collections note",[["Customer","Grandview Fitness (closed)"],["Unpaid invoice",$$(a)],["Decision","Write off, can't be collected"]]],t:`A former customer went out of business; its ${$$(a)} invoice will never be paid. Write it off (direct method).`,L:[["Bad Debt Expense",a],["Accounts Receivable",-a]],w:"The receivable is worthless: credit Accounts Receivable. The loss is an expense: debit Bad Debt Expense."}}},
 {c:"cash",f:()=>{const a=jr(100,600,10);return{doc:["rcpt","Card charge · Meta Ads",[["Local ad campaign",$$(a)],["Paid","Debit card, business checking"]]],t:`Pays ${$$(a)} for a local online ad campaign from checking.`,L:[["Advertising",a],["Checking",-a]],w:"Advertising is a cost of running the business: debit Advertising, credit Checking."}}}];
const JCAT={owner:"Owner money",cash:"Paying cash",credit:"Buying on credit",sale:"Sales and customers",adj:"Month-end adjustments",loan:"Loans",tax:"Sales tax",pay:"Payroll",inv:"Inventory"};
let jel=null;
function jelStart(){const J=bkJel(),w=JEV.map((v,k)=>1+(J.miss[k]||0)*2);const pick=[];const pool=JEV.map((v,k)=>k);
  while(pick.length<8&&pool.length){let s=0;pool.forEach(k=>s+=w[k]);let r=Math.random()*s,i=0;for(;i<pool.length;i++){r-=w[pool[i]];if(r<=0)break}pick.push(pool.splice(Math.min(i,pool.length-1),1)[0])}
  const bal={"Checking":15000,"Equipment":6000,"Owner's Capital":-21000};
  jel={list:pick,i:0,ev:null,li:0,ok:0,first:true,miss:0,bal,pick:null,phase:"q",opts:null,done:[]};jelLoad()}
function jelLoad(){const k=jel.list[jel.i];jel.k=k;jel.ev=JEV[k].f();jel.li=0;jel.pick=null;jel.phase="q";jel.first=true;jel.opts=jelOpts();jel.before=Object.assign({},jel.bal)}
function jelOpts(){const ln=jel.ev.L[jel.li],acc=ln[0],ty=JACC[acc],used=jel.ev.L.map(x=>x[0]);
  const same=shuffle(Object.keys(JACC).filter(a=>a!==acc&&JACC[a]===ty&&!used.includes(a))),other=shuffle(Object.keys(JACC).filter(a=>a!==acc&&JACC[a]!==ty&&!used.includes(a)));
  const opp=jel.ev.L.find(x=>(x[1]>0)!==(ln[1]>0));const o=[acc];if(opp&&!o.includes(opp[0])&&jel.li===0)o.push(opp[0]);
  for(const a of same){if(o.length>=3)break;o.push(a)}for(const a of other){if(o.length>=4)break;if(!o.includes(a))o.push(a)}return shuffle(o)}
function jm(x){x=Math.round(x)||0;return x<0?"−"+$$(-x):$$(x)}
function jelSide(v){return v>0?"Debit":"Credit"}
function jelDoc(d){const e=esc,[k,t,rows]=d;const ic={memo:"📝",rcpt:"🧾",bank:"🏦",inv:"📄",bill:"📨",pay:"💵"}[k]||"📄";
  return `<div class="jdoc jdoc-${k}"><div class="jdh"><span>${ic} ${e(t)}</span><span class="small">${e(JCO)}</span></div>${rows.map(r=>`<div class="jdr"><span>${e(r[0])}</span><b>${e(r[1])}</b></div>`).join("")}</div>`}
function jelEq(bal){let A=0,L=0,E=0,NI=0;for(const a in bal){const t=JACC[a],v=bal[a];if(t==="A"||t==="CA")A+=v;else if(t==="L")L+=-v;else if(t==="E"||t==="D")E+=-v;else if(t==="R"||t==="X"){E+=-v;NI+=-v}}
  const mx=Math.max(A,L+E,1),h=x=>Math.max(4,Math.round(Math.abs(x)/mx*100));
  return `<div class="jeq"><div class="jeqc"><div class="jeqb a" style="height:${h(A)}px"></div><b>${jm(A)}</b><span>Assets</span></div><div class="jeqs">=</div><div class="jeqc"><div class="jeqb l" style="height:${h(L)}px"></div><b>${jm(L)}</b><span>Liabilities</span></div><div class="jeqs">+</div><div class="jeqc"><div class="jeqb e" style="height:${h(E)}px"></div><b>${jm(E)}</b><span>Equity</span></div></div><div class="small muted" style="text-align:center">${Math.abs(A-L-E)<1?"✓ Balanced, as it always must be.":"Not balanced"} Profit so far this round: ${jm(NI)}.</div>`}
function jelTs(ev,before,after){const e=esc;return `<div class="jts">${ev.L.map(([a,v])=>{const t=JACC[a],nb=JUP[t]==="debit"?1:-1,b0=(before[a]||0)*nb,b1=(after[a]||0)*nb;
   return `<div class="jt"><div class="jth">${e(a)}<span class="small">${e(JTYPE[t].split(" (")[0])} · grows with a ${JUP[t]}</span></div><div class="jtb"><div><em>Debit</em>${v>0?`<span class="new">${$$(v)}</span>`:""}</div><div><em>Credit</em>${v<0?`<span class="new">${$$(-v)}</span>`:""}</div></div><div class="jtf">${jm(b0)} → <b>${jm(b1)}</b> ${b1>b0?"▲":b1<b0?"▼":""}</div></div>`}).join("")}</div>`}
function renderJel(){if(!jel)jelStart();const e=esc,J=bkJel(),ev=jel.ev,n=jel.list.length;
  if(jel.i>=n){J.rounds++;persist();const cats={};jel.done.forEach(x=>{const c=JEV[x[0]].c;cats[c]=cats[c]||[0,0];cats[c][1]++;if(x[1])cats[c][0]++});
    $("#view").innerHTML=`<section class="section"><div class="card jelend"><div class="jbig">${jel.ok===n?"🏆":jel.ok>=n*0.75?"🎉":"💪"}</div><h2>${jel.ok} of ${n} entries right on the first try</h2>
      <div class="small muted">All-time: ${J.ok} entries right${J.adj?` · ${J.adj} month-end adjustments`:""}${J.pay?` · ${J.pay} payroll entries`:""}</div>
      <div class="jcats">${Object.keys(cats).map(c=>`<div><span>${e(JCAT[c])}</span><b class="${cats[c][0]===cats[c][1]?"ok":""}">${cats[c][0]}/${cats[c][1]}</b></div>`).join("")}</div>
      ${jelEq(jel.bal)}
      <div class="small" style="margin:8px 0">Events you miss come back more often in the next rounds.</div>
      <div class="row"><button class="btn pri" data-jel="again">Another 8 entries</button><button class="btn ghost" data-jel="home">Back</button></div></div></section>`;return}
  const head=`<div class="sesshead"><div><h2>⚖️ Journal Entry Lab</h2><div class="small muted">${e(JCO)}, a Solving Life LLC bookkeeping client · entry ${jel.i+1} of ${n} · ${jel.ok} right</div></div><button class="btn ghost small" data-jel="home">Exit</button></div><div class="progress"><i style="width:${Math.round(jel.i/n*100)}%"></i></div>`;
  const doneLines=ev.L.slice(0,jel.li).map(([a,v])=>[a,v>0?$$(v):"",v<0?$$(-v):""]);
  if(jel.phase==="done"){const ok1=jel.first;
    $("#view").innerHTML=`<section class="section">${head}<div class="card"><div class="small muted">${e(JCAT[JEV[jel.k].c])}</div>${jelDoc(ev.doc)}<div class="stem" style="margin:8px 0">${e(ev.t)}</div>
      <div class="explain"><b style="color:var(--${ok1?"good":"warn"})">${ok1?"Perfect entry.":"Entry complete, with help."}</b> ${e(ev.w)}</div>
      ${visHtml({k:"je",r:ev.L.map(([a,v])=>[a,v>0?$$(v):"",v<0?$$(-v):""]),n:"Debits equal credits: "+$$(ev.L.filter(x=>x[1]>0).reduce((s,x)=>s+x[1],0))})}
      <div class="small muted" style="margin:10px 0 4px">What it did to each account</div>${jelTs(ev,jel.before,jel.bal)}
      <div class="small muted" style="margin:10px 0 4px">The accounting equation after this entry</div>${jelEq(jel.bal)}
      <div class="row" style="margin-top:10px"><button class="btn pri" data-jel="next">${jel.i+1<n?"Next entry":"See my results"}</button></div></div></section>`;return}
  const ln=ev.L[jel.li],sideCount=ev.L.filter(x=>(x[1]>0)===(ln[1]>0)).length,sideIdx=ev.L.filter((x,k)=>k<jel.li&&(x[1]>0)===(ln[1]>0)).length+1;
  const rule=`<details class="jrule"><summary>💡 The rule</summary><div class="small">Debits increase assets, expenses and draws. Credits increase liabilities, owner's equity and revenue. Every entry has equal debits and credits.</div></details>`;
  $("#view").innerHTML=`<section class="section">${head}<div class="card"><div class="small muted">${e(JCAT[JEV[jel.k].c])}</div>${jelDoc(ev.doc)}<div class="stem" style="margin:8px 0">${e(ev.t)}</div>
    ${doneLines.length?visHtml({k:"je",r:doneLines}):""}
    <div class="jq"><span class="jside ${ln[1]>0?"dr":"cr"}">${jelSide(ln[1])}${sideCount>1?` ${sideIdx} of ${sideCount}`:""} · ${$$(Math.abs(ln[1]))}</span> Which account?</div>
    <div class="opts">${jel.opts.map(a=>{let c="";if(jel.pick){if(a===ln[0])c="right";else if(a===jel.pick)c="wrong"}return `<button class="opt jopt ${c}" data-jel="pick" data-a="${e(a)}" ${jel.pick?"disabled":""}><span>${e(a)}</span><span class="small muted" style="margin-left:auto">${e(JTYPE[JACC[a]].split(" (")[0])}</span></button>`}).join("")}</div>
    ${jel.pick&&jel.pick!==ln[0]?`<div class="explain"><b style="color:var(--bad)">Not ${e(jel.pick)}.</b> ${e(jel.pick)} is ${e(JTYPE[JACC[jel.pick]])}; it grows with a ${JUP[JACC[jel.pick]]}. Here the ${jelSide(ln[1]).toLowerCase()} goes to <b>${e(ln[0])}</b>, ${e(JTYPE[JACC[ln[0]]])}.<div class="row" style="margin-top:8px"><button class="btn pri" data-jel="cont">Got it</button></div></div>`:rule}
  </div></section>`}
function jelClick(d){const J=bkJel();
  if(d.jel==="home"){jel=null;view=CLOCK()?"bkland":"home";render();window.scrollTo(0,0);return true}
  if(d.jel==="again"){jel=null;render();window.scrollTo(0,0);return true}
  if(!jel)return false;const ev=jel.ev,ln=ev.L[jel.li];
  if(d.jel==="pick"&&!jel.pick){const a=d.a;if(a===ln[0]){jelAdv()}else{jel.pick=a;jel.first=false;render()}return true}
  if(d.jel==="cont"){jelAdv();return true}
  if(d.jel==="next"){jel.i++;if(jel.i<jel.list.length)jelLoad();render();window.scrollTo(0,0);return true}
  return false}
function jelAdv(){const ev=jel.ev;jel.pick=null;jel.li++;
  if(jel.li>=ev.L.length){const J=bkJel(),c=JEV[jel.k].c;ev.L.forEach(([a,v])=>{jel.bal[a]=(jel.bal[a]||0)+v});
    jel.done.push([jel.k,jel.first]);J.n++;if(jel.first){jel.ok++;J.ok++;if(c==="adj")J.adj++;if(c==="pay")J.pay++;J.miss[jel.k]=Math.max(0,(J.miss[jel.k]||0)-1)}else J.miss[jel.k]=(J.miss[jel.k]||0)+1;
    persist();jel.phase="done"}else jel.opts=jelOpts();
  render()}
