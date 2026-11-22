/* ================= Practice company: a working bookkeeping simulator in the style of QuickBooks Online =================
   Real double entry: every form posts debits and credits, and the lists and reports are computed from the ledger.
   A transaction is {id,k,d,who,amt,L:[[account,amount]],open,ref,m,c} with debits positive and credits negative. */
const QA=[["Checking","Bank"],["Savings","Bank"],["Accounts Receivable","A/R"],["Accounts Payable","A/P"],["Loan Payable","Liability"],["Owner's Investment","Equity"],["Owner's Draw","Equity"],["Services","Income"],["Advertising","Expense"],["Bank Charges","Expense"],["Fuel","Expense"],["Office Supplies","Expense"],["Rent","Expense"],["Utilities","Expense"],["Interest Expense","Expense"]];
const QTYPE=Object.fromEntries(QA),QEXP=QA.filter(a=>a[1]==="Expense").map(a=>a[0]);
const QDOCS=[
 ["Dec 01","Owner deposits $4,000 of personal money into business checking to start the studio.",{k:"doc",n:"FIRST BANK · DEPOSIT SLIP",s:"Dec 1, 2025",r:[["From: owner, personal funds","4,000.00"]]}],
 ["Dec 02","The bank lends the studio $1,000 and puts it in checking.",{k:"doc",n:"FIRST BANK · LOAN ADVICE",s:"Dec 2, 2025",r:[["Loan proceeds credited to checking","1,000.00"]]}],
 ["Dec 05","Design work for client Mira is finished. She will pay within 30 days.",{k:"doc",n:"OAK STUDIO · WORK ORDER",s:"Customer: Mira · Dec 5, 2025",r:[["Design services","1,200.00"],["Due in 30 days","1,200.00",1]]}],
 ["Dec 08","A bill arrives from AdWorks for advertising already run. Due in 30 days.",{k:"doc",n:"ADWORKS · INVOICE 771",s:"Bill to: Oak Studio · Dec 8, 2025",r:[["Online ads, December","300.00"],["Terms: Net 30","300.00",1]]}],
 ["Dec 12","Mira pays $900 toward her invoice. It goes into checking.",{k:"doc",n:"PAYMENT RECEIVED",s:"From: Mira · Dec 12, 2025",r:[["Toward the Dec 5 invoice","900.00"]]}],
 ["Dec 16","You pay $200 toward the AdWorks bill from checking.",{k:"doc",n:"CHECK 1041",s:"Pay to: AdWorks · Dec 16, 2025",r:[["Part payment, invoice 771","200.00"]]}],
 ["Dec 18","A walk-in customer, Jon, pays $500 on the spot for a finished job. Deposited to checking.",{k:"doc",n:"OAK STUDIO · RECEIPT",s:"Customer: Jon · Dec 18, 2025",r:[["Design services, paid in full","500.00"]]}],
 ["Dec 22","The owner takes $150 from checking for personal use.",{k:"doc",n:"FIRST BANK · WITHDRAWAL",s:"Dec 22, 2025",r:[["Owner, personal","150.00"]]}],
 ["Dec 29","You write check 1043 for $100 of office supplies from Paper Hub. It will not reach the bank this month.",{k:"doc",n:"PAPER HUB · RECEIPT",s:"Dec 29, 2025 · paid by check 1043",r:[["Office supplies","100.00"]]}],
 ["Dec 31","The bank statement arrives.",{k:"doc",n:"FIRST BANK · STATEMENT",s:"Oak Studio · Checking · Dec 1 – 31, 2025",r:[["Deposits and credits","6,400.00"],["Checks and withdrawals","−350.00"],["Service charge","−15.00"],["Ending balance","6,035.00",1]]}]];
const QFEED=[["12/01","DEPOSIT",4000],["12/02","LOAN PROCEEDS",1000],["12/12","DEPOSIT",900],["12/16","CHECK 1041",-200],["12/18","DEPOSIT",500],["12/22","WITHDRAWAL",-150],["12/31","SERVICE CHARGE",-15]];
let qv={tab:"home",form:null,msg:"",doc:-1};
// the walkthrough: for each job, where to click, what to enter and what it posts. "Show me" opens the form already filled in.
const QGUIDE=[
 ["+ New ▸ Bank deposit. Received from Owner, account Owner's Investment, $4,000.","Owner money is equity, not income. Posts: debit Checking, credit Owner's Investment.",{form:"Bank deposit",pre:{qwho:"Owner",qcat:"Owner's Investment",qamt:"4000",qd:"12/01/2025"}}],
 ["+ New ▸ Bank deposit. Received from First Bank, account Loan Payable, $1,000.","A loan is a liability, not income. Posts: debit Checking, credit Loan Payable.",{form:"Bank deposit",pre:{qwho:"First Bank",qcat:"Loan Payable",qamt:"1000",qd:"12/02/2025"}}],
 ["+ New ▸ Invoice. Customer Mira, Design services, $1,200.","She pays later, so it is an invoice. Posts: debit Accounts Receivable, credit Services income.",{form:"Invoice",pre:{qwho:"Mira",qamt:"1200",qd:"12/05/2025"}}],
 ["+ New ▸ Bill. Vendor AdWorks, category Advertising, $300.","To be paid later, so it is a bill. Posts: debit Advertising, credit Accounts Payable.",{form:"Bill",pre:{qwho:"AdWorks",qcat:"Advertising",qamt:"300",qd:"12/08/2025"}}],
 ["+ New ▸ Receive payment. Choose Mira's invoice, $900, deposit to Checking.","The sale is already recorded. Posts: debit Checking, credit Accounts Receivable. Income does not change.",{form:"Receive payment",pre:{qamt:"900",qd:"12/12/2025",qacct:"Checking"}}],
 ["+ New ▸ Pay bills. Choose the AdWorks bill, $200, from Checking.","Paying an existing bill. Posts: debit Accounts Payable, credit Checking. The expense does not change.",{form:"Pay bills",pre:{qamt:"200",qd:"12/16/2025",qacct:"Checking"}}],
 ["+ New ▸ Sales receipt. Customer Jon, $500, deposit to Checking.","Paid on the spot, so no invoice. Posts: debit Checking, credit Services income.",{form:"Sales receipt",pre:{qwho:"Jon",qamt:"500",qd:"12/18/2025",qacct:"Checking"}}],
 ["+ New ▸ Expense. Payee Owner, category Owner's Draw, $150.","Personal money taken out is a draw, not an expense. Posts: debit Owner's Draw, credit Checking.",{form:"Expense",pre:{qwho:"Owner",qcat:"Owner's Draw",qamt:"150",qd:"12/22/2025"}}],
 ["+ New ▸ Expense. Payee Paper Hub, category Office Supplies, $100.","Paid by check with no bill. Posts: debit Office Supplies, credit Checking.",{form:"Expense",pre:{qwho:"Paper Hub",qcat:"Office Supplies",qamt:"100",qd:"12/29/2025"}}],
 ["Bank feed. Click Match on every line that shows a possible match.","Those lines are already in your books. Matching links them; adding would count them twice.",{tab:"bank"}],
 ["Bank feed ▸ SERVICE CHARGE. Choose Bank Charges, then Add.","The bank took $15 that is not in the books yet. Posts: debit Bank Charges, credit Checking.",{tab:"bank"}],
 ["Reconcile. Tick every line except the $100 Paper Hub check, then Finish now.","The check has not reached the bank: it is outstanding. Statement $6,035 − $100 = books $5,935.",{tab:"rec"}],
 ["Reports. Read the Profit and Loss and the Balance Sheet.","Net income $1,285. Cash $5,935 is much higher because $5,000 came from the owner and the loan.",{tab:"rep"}]];
function Q0(){return {tx:[],n:1,feed:QFEED.map(()=>0),rec:false,cust:["Mira","Jon"],vend:["AdWorks","Paper Hub"]}}
function QS(){S.set.qbo=S.set.qbo||Q0();return S.set.qbo}
const qm=v=>(v<0?"−":"")+"$"+Math.abs(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
function qbal(a){return QS().tx.reduce((s,t)=>s+t.L.reduce((x,l)=>x+(l[0]===a?l[1]:0),0),0)}
function qpost(t){const q=QS();t.id=q.n++;if(Math.abs(t.L.reduce((s,l)=>s+l[1],0))>0.005){qv.msg="That entry does not balance.";return null}q.tx.push(t);persist();return t}
function qnet(){return -QA.filter(a=>a[1]==="Income"||a[1]==="Expense").reduce((s,a)=>s+qbal(a[0]),0)}
// the month's work, checked from the ledger itself
function qtasks(){const q=QS(),T=q.tx,has=f=>T.some(f),near=(a,b)=>Math.abs(a-b)<0.005;
  const inv=T.find(t=>t.k==="Invoice"&&t.who==="Mira"&&near(t.amt,1200)),bill=T.find(t=>t.k==="Bill"&&t.who==="AdWorks"&&near(t.amt,300));
  return [
   ["Owner's $4,000 recorded as Owner's Investment",near(qbal("Owner's Investment"),-4000)],
   ["$1,000 loan recorded as Loan Payable",near(qbal("Loan Payable"),-1000)],
   ["Invoice to Mira for $1,200",!!inv],
   ["Bill from AdWorks for $300 (Advertising)",!!bill&&near(qbal("Advertising"),300)],
   ["Mira's $900 applied to her invoice; $300 still open",!!inv&&near(inv.open,300)&&has(t=>t.k==="Payment"&&t.ref===inv.id)],
   ["$200 paid on the AdWorks bill; $100 still open",!!bill&&near(bill.open,100)&&has(t=>t.k==="Bill payment"&&t.ref===bill.id)],
   ["$500 cash sale to Jon on a sales receipt",has(t=>t.k==="Sales receipt"&&near(t.amt,500))],
   ["$150 owner withdrawal recorded as Owner's Draw",near(qbal("Owner's Draw"),150)],
   ["$100 of office supplies recorded",near(qbal("Office Supplies"),100)],
   ["Bank feed finished: every line matched or added",q.feed.every(x=>x)],
   ["$15 bank charge recorded",near(qbal("Bank Charges"),15)],
   ["Checking reconciled to the $6,035.00 statement",!!q.rec],
   ["Books are right: checking $5,935, income $1,700, net income $1,285",near(qbal("Checking"),5935)&&near(-qbal("Services"),1700)&&near(qnet(),1285)]]}
function qSel(id,opts,val){if(qv.pre&&qv.pre[id]!==undefined)val=qv.pre[id];return `<select id="${id}" class="qin">${opts.map(o=>`<option${o===val?" selected":""}>${esc(o)}</option>`).join("")}</select>`}
function qIn(id,ph,val,type){if(qv.pre&&qv.pre[id]!==undefined)val=qv.pre[id];return `<input id="${id}" class="qin" ${type==="num"?'inputmode="decimal"':""} placeholder="${esc(ph)}" value="${esc(val||"")}">`}
function qRow(l,h){return `<label class="qrow"><span>${l}</span>${h}</label>`}
const QFORMS={
 "Invoice":()=>qRow("Customer",qSel("qwho",QS().cust))+qRow("Invoice date",qIn("qd","12/05/2025","12/05/2025"))+qRow("Product/Service",qSel("qitem",["Design services"]))+qRow("Amount",qIn("qamt","0.00","","num")),
 "Receive payment":()=>{const o=QS().tx.filter(t=>t.k==="Invoice"&&t.open>0.005);return o.length?qRow("Open invoice",`<select id="qref" class="qin">${o.map(t=>`<option value="${t.id}">${esc(t.who)} · invoice ${t.id} · open ${qm(t.open)}</option>`).join("")}</select>`)+qRow("Payment date",qIn("qd","12/12/2025","12/12/2025"))+qRow("Amount received",qIn("qamt","0.00","","num"))+qRow("Deposit to",qSel("qacct",["Checking","Savings"])):`<div class="notice">There is no open invoice. Create the invoice first.</div>`},
 "Sales receipt":()=>qRow("Customer",qSel("qwho",QS().cust,"Jon"))+qRow("Date",qIn("qd","12/18/2025","12/18/2025"))+qRow("Product/Service",qSel("qitem",["Design services"]))+qRow("Amount",qIn("qamt","0.00","","num"))+qRow("Deposit to",qSel("qacct",["Checking","Savings"])),
 "Bill":()=>qRow("Vendor",qSel("qwho",QS().vend))+qRow("Bill date",qIn("qd","12/08/2025","12/08/2025"))+qRow("Category",qSel("qcat",QEXP))+qRow("Amount",qIn("qamt","0.00","","num")),
 "Pay bills":()=>{const o=QS().tx.filter(t=>t.k==="Bill"&&t.open>0.005);return o.length?qRow("Open bill",`<select id="qref" class="qin">${o.map(t=>`<option value="${t.id}">${esc(t.who)} · bill ${t.id} · open ${qm(t.open)}</option>`).join("")}</select>`)+qRow("Payment date",qIn("qd","12/16/2025","12/16/2025"))+qRow("Amount to pay",qIn("qamt","0.00","","num"))+qRow("Payment account",qSel("qacct",["Checking","Savings"])):`<div class="notice">There is no open bill. Enter the bill first.</div>`},
 "Expense":()=>qRow("Payee",qSel("qwho",QS().vend.concat(["Owner","First Bank"]),"Paper Hub"))+qRow("Payment date",qIn("qd","12/29/2025","12/29/2025"))+qRow("Payment account",qSel("qacct",["Checking","Savings"]))+qRow("Category",qSel("qcat",QEXP.concat(["Owner's Draw"])))+qRow("Amount",qIn("qamt","0.00","","num")),
 "Bank deposit":()=>qRow("Deposit to",qSel("qacct",["Checking","Savings"]))+qRow("Date",qIn("qd","12/01/2025","12/01/2025"))+qRow("Received from",qSel("qwho",["Owner","First Bank"]))+qRow("Account",qSel("qcat",["Owner's Investment","Loan Payable","Services"]))+qRow("Amount",qIn("qamt","0.00","","num")),
 "Transfer":()=>qRow("Transfer from",qSel("qacct",["Checking","Savings"]))+qRow("Transfer to",qSel("qcat",["Savings","Checking"]))+qRow("Date",qIn("qd","12/20/2025","12/20/2025"))+qRow("Amount",qIn("qamt","0.00","","num"))};
function qSave(k){const g=id=>{const e=document.getElementById(id);return e?e.value:""},amt=Math.round(parseFloat(String(g("qamt")).replace(/[$,\s]/g,""))*100)/100,q=QS(),d=g("qd");
  if(!(amt>0)){qv.msg="Enter an amount greater than zero.";return}
  let t=null;const who=g("qwho"),acct=g("qacct"),cat=g("qcat");
  if(k==="Invoice")t={k,d,who,amt,open:amt,L:[["Accounts Receivable",amt],["Services",-amt]]};
  else if(k==="Sales receipt")t={k,d,who,amt,L:[[acct,amt],["Services",-amt]]};
  else if(k==="Bill")t={k,d,who,amt,open:amt,L:[[cat,amt],["Accounts Payable",-amt]]};
  else if(k==="Expense")t={k,d,who,amt,L:[[cat,amt],[acct,-amt]]};
  else if(k==="Bank deposit")t={k:"Deposit",d,who,amt,L:[[acct,amt],[cat,-amt]]};
  else if(k==="Transfer"){if(acct===cat){qv.msg="Choose two different accounts.";return}t={k,d,who:"",amt,L:[[cat,amt],[acct,-amt]]}}
  else if(k==="Receive payment"||k==="Pay bills"){const o=q.tx.find(x=>x.id==g("qref"));if(!o)return;if(amt>o.open+0.005){qv.msg="That is more than the open balance of "+qm(o.open)+".";return}
    o.open=Math.round((o.open-amt)*100)/100;t=k==="Receive payment"?{k:"Payment",d,who:o.who,amt,ref:o.id,L:[[acct,amt],["Accounts Receivable",-amt]]}:{k:"Bill payment",d,who:o.who,amt,ref:o.id,L:[["Accounts Payable",amt],[acct,-amt]]}}
  if(t&&qpost(t)){qv.pre=null;qv.msg="Saved: "+t.k+" "+qm(amt)+". Posted "+t.L.map(l=>(l[1]>0?"debit ":"credit ")+l[0]).join(", ")+".";qv.form=null}}
function qDelete(id){const q=QS(),t=q.tx.find(x=>x.id==id);if(!t)return;if(q.tx.some(x=>x.ref===t.id)){qv.msg="Delete the payment applied to it first.";return}
  if(t.ref){const o=q.tx.find(x=>x.id===t.ref);if(o)o.open=Math.round((o.open+t.amt)*100)/100}
  q.feed=q.feed.map(f=>f===t.id?0:f);q.tx=q.tx.filter(x=>x!==t);q.rec=false;persist();qv.msg="Deleted "+t.k+" "+qm(t.amt)+"."}
function qBankTx(){return QS().tx.filter(t=>t.L.some(l=>l[0]==="Checking"))}
function qBankAmt(t){return t.L.reduce((s,l)=>s+(l[0]==="Checking"?l[1]:0),0)}
// month-end close, the way a bookkeeper finishes a month, and the hand-off to the tax preparer
const QCLOSE=[["Review open invoices (A/R aging)","Mira owes $300 on the Dec 5 invoice, due Jan 4. Send a reminder from the invoice.","Send reminder"],
 ["Review unpaid bills (A/P aging)","AdWorks is owed $100, due Jan 7. Schedule the payment.","Schedule payment"],
 ["Attach the paper to each entry","Attach the Paper Hub receipt and the AdWorks invoice to their transactions. An expense with no document is a question waiting to happen.","Attach documents"],
 ["Check vendors for Form 1099-NEC","Keep a Form W-9 for AdWorks. Paid $200 this year, below the reporting threshold ($600 for 2025 payments, $2,000 from 2026).","Save the W-9"],
 ["Close the books","Set the closing date to 12/31/2025 with a password so December cannot be changed by accident.","Set closing date"]];
function qClose(q,T){const e=esc,cl=q.cl||{},auto=[["Every document entered",T.slice(0,9).every(t=>t[1])],["Bank feed empty",T[9][1]&&T[10][1]],["Checking reconciled",T[11][1]]],ready=auto.every(a=>a[1]);
  return `<div class="vis vscr"><div class="sh"><i></i><i></i><i></i><b>Month-end close ▸ December 2025</b></div>${auto.map(a=>`<div class="sr${a[1]?" hl":""}"><span>${a[1]?"✓":"○"}</span><span>${a[0]}</span></div>`).join("")}
    ${QCLOSE.map((o,i)=>`<div class="qfeed"><div><b>${e(o[0])}</b><span>${cl[i]?"✓ Done":""}</span></div><div class="small">${e(o[1])}</div>${cl[i]?"":`<div><button class="btn small ${ready?"pri":""}" data-qcl="${i}" ${ready?"":"disabled"}>${e(o[2])}</button></div>`}</div>`).join("")}
    <div class="vnote">${ready?"Finish each job, then read the hand-off below.":"Finish the documents, the bank feed and the reconciliation first."}</div></div>`
   +visHtml({k:"cmp",a:["Accrual basis (these books)",["Income $1,700: all work billed","Advertising $300: the whole bill","Supplies $100, bank charges $15","Net income $1,285"]],b:["Cash basis (most small tax clients)",["Income $1,400: money actually received","Advertising $200: the part paid","Supplies $100, bank charges $15","Net income $1,085"]]})
   +`<p class="notice">Same books, two reports. Switch the Profit and Loss to Cash basis before giving numbers to the tax preparer of a cash-basis client.</p>`
   +visHtml({k:"form",n:"Schedule C (2025)",s:"What the tax preparer takes from these books · cash basis",r:[["1","Gross receipts","1,400"],["8","Advertising","200"],["18","Office expense","100"],["27b","Other expenses: bank charges","15"],["31","Net profit","1,085",1],["","Not on the return: owner's $4,000, the $1,000 loan, the $150 draw","—"]]})}
function qEq(){const f=v=>"$"+(Math.round(v)||0).toLocaleString(),A=qbal("Checking")+qbal("Savings")+qbal("Accounts Receivable"),L=-(qbal("Accounts Payable")+qbal("Loan Payable")),E=-(qbal("Owner's Investment")+qbal("Owner's Draw"))+qnet();
  return `<div class="stats3 qeq"><div class="stat"><b>${f(A)}</b><span>Assets</span></div><div class="stat"><b>${f(L)}</b><span>= Liabilities</span></div><div class="stat"><b>${f(E)}</b><span>+ Equity</span></div></div>`}
function renderQbo(){const q=QS(),T=qtasks(),done=T.filter(t=>t[1]).length,e=esc,tab=qv.tab;
  const nav=[["home","To do"],["new","+ New"],["bank","Bank feed"],["rec","Reconcile"],["lists","Lists"],["rep","Reports"],["close","Month-end"],["jobs","Client jobs"]].map(([k,l])=>`<button aria-pressed="${tab===k}" data-qtab="${k}">${l}${k==="bank"&&q.feed.some(x=>!x)?" ("+q.feed.filter(x=>!x).length+")":""}</button>`).join("");
  let body="";
  if(tab==="home")body=`<div class="card"><b>Oak Studio · December 2025</b><div class="small muted">You are the bookkeeper. Work through the documents in date order with + New, then do the Bank feed and Reconcile. Each line below turns green when the books show it was done correctly.</div>
     <div class="progress" style="margin:8px 0"><i style="width:${Math.round(done/T.length*100)}%"></i></div><div class="qtasks">${T.map(t=>`<div class="${t[1]?"ok":""}">${t[1]?"✓":"○"} ${e(t[0])}</div>`).join("")}</div>
     ${done===T.length?`<div class="notice" style="border-color:var(--good)"><b>Month closed correctly.</b> Open Reports and read the Profit and Loss and the Balance Sheet the way you would explain them to the owner.</div>`:""}</div>
     <h3 style="margin-top:12px">Documents inbox</h3><div class="list">${QDOCS.map((d,i)=>`<button class="topicrow" data-qdoc="${i}"><span>${d[0]} · ${e(d[1])}</span></button>${qv.doc===i?visHtml(d[2]):""}`).join("")}</div>`;
  else if(tab==="new")body=qv.form?`<div class="vis vscr"><div class="sh"><i></i><i></i><i></i><b>+ New ▸ ${e(qv.form)}</b></div><div style="padding:10px 12px;display:grid;gap:8px">${QFORMS[qv.form]()}<div class="row"><button class="btn pri" data-qsave="${e(qv.form)}">Save and close</button><button class="btn ghost" data-qform="">Cancel</button></div></div></div>`
     :`<div class="card"><b>+ New</b><div class="small muted">Choose the form that fits what really happened.</div><div class="qmenu">${["Customers","Invoice","Receive payment","Sales receipt","Vendors","Bill","Pay bills","Expense","Other","Bank deposit","Transfer"].map(x=>QFORMS[x]?`<button class="btn" data-qform="${x}">${x}</button>`:`<em>${x}</em>`).join("")}</div></div>`;
  else if(tab==="bank")body=`<div class="vis vscr"><div class="sh"><i></i><i></i><i></i><b>Bank transactions ▸ Checking ▸ For review</b></div>${QFEED.map((f,i)=>{if(q.feed[i])return `<div class="sr"><span>${f[0]} ${e(f[1])}</span><span>${qm(f[2])} · ${q.feed[i]===-1?"excluded":"done ✓"}</span></div>`;
       const c=qBankTx().filter(t=>Math.abs(qBankAmt(t)-f[2])<0.005&&!q.feed.includes(t.id));
       return `<div class="qfeed"><div><b>${f[0]} ${e(f[1])}</b><span>${qm(f[2])}</span></div><div class="small muted">${c.length?"1 possible match in your books: "+e(c[0].k)+" "+e(c[0].who||"")+" "+qm(c[0].amt):"No matching transaction in your books yet."}</div>
        <div class="row">${c.length?`<button class="btn pri small" data-qmatch="${i}">Match</button>`:""}${qSel("qfc"+i,f[2]>0?["Services","Owner's Investment","Loan Payable"]:QEXP.concat(["Owner's Draw"]),f[2]>0?"Services":"Bank Charges")}<button class="btn small" data-qadd="${i}">Add</button><button class="btn ghost small" data-qexc="${i}">Exclude</button></div></div>`}).join("")}<div class="vnote">Match links a bank line to something already recorded. Add creates a new transaction. Adding a line that is already recorded counts the money twice.</div></div>`;
  else if(tab==="rec"){const bt=qBankTx(),cl=bt.filter(t=>t.c).reduce((s,t)=>s+qBankAmt(t),0),diff=Math.round((6035-cl)*100)/100;
    body=`<div class="vis vscr"><div class="sh"><i></i><i></i><i></i><b>Reconcile ▸ Checking</b></div><div class="sr"><span>Statement ending balance</span><span>$6,035.00 · 12/31/2025</span></div><div class="sr"><span>Cleared balance</span><span>${qm(cl)}</span></div><div class="sr ${Math.abs(diff)<0.005?"hl":""}"><span>Difference</span><span>${qm(diff)}</span></div>
      <div style="padding:8px 12px"><div class="small muted">Tick every line that appears on the bank statement (the statement lines are in the Bank feed tab).</div>${bt.length?bt.map(t=>`<label class="qtick"><input type="checkbox" data-qclr="${t.id}" ${t.c?"checked":""} ${q.rec?"disabled":""}><span>${e(t.d||"")} ${e(t.k)} ${e(t.who||"")}</span><b>${qm(qBankAmt(t))}</b></label>`).join(""):`<div class="notice">Nothing is recorded in Checking yet.</div>`}
      ${q.rec?`<div class="notice" style="border-color:var(--good)"><b>Reconciled.</b> Unticked lines are outstanding and will clear next month.</div>`:`<button class="btn pri" data-qfinish="1" ${Math.abs(diff)<0.005&&bt.length?"":"disabled"}>Finish now</button>${Math.abs(diff)>=0.005?`<div class="small muted">Finish is available when the difference is $0.00. If it will not reach zero, look for a missing, duplicated or mistyped transaction.</div>`:""}`}</div></div>`}
  else if(tab==="lists")body=`<div class="vis vscr"><div class="sh"><i></i><i></i><i></i><b>Chart of accounts</b></div>${QA.map(a=>{const b=qbal(a[0]),nat=["Bank","A/R","Expense"].includes(a[1])||a[0]==="Owner's Draw"?b:-b;return `<div class="sr"><span>${e(a[0])}<br><small>${a[1]}</small></span><span>${qm(nat)}</span></div>`}).join("")}</div>
     <h3 style="margin-top:12px">All transactions</h3>${q.tx.length?q.tx.map(t=>`<div class="vis vje" style="margin-bottom:8px"><div class="jh"><span>${e(t.d||"")} · ${e(t.k)} ${e(t.who||"")}</span><span>Debit</span><span>Credit</span></div>${t.L.map(l=>`<div class="jr${l[1]<0?" cr":""}"><span>${e(l[0])}</span><span>${l[1]>0?qm(l[1]).slice(1):""}</span><span>${l[1]<0?qm(-l[1]).slice(1):""}</span></div>`).join("")}<div class="vnote"><button class="linkbtn" data-qdel="${t.id}">Delete this transaction</button></div></div>`).join(""):`<div class="notice">No transactions yet.</div>`}`;
  else{const inc=-qbal("Services"),ex=QEXP.map(a=>[a,qbal(a)]).filter(x=>Math.abs(x[1])>0.005),net=qnet(),assets=[["Checking",qbal("Checking")],["Savings",qbal("Savings")],["Accounts Receivable",qbal("Accounts Receivable")]],li=[["Accounts Payable",-qbal("Accounts Payable")],["Loan Payable",-qbal("Loan Payable")]],eq=-qbal("Owner's Investment")-qbal("Owner's Draw")+net,ta=assets.reduce((s,a)=>s+a[1],0),tl=li.reduce((s,a)=>s+a[1],0);
    const R=(t,rows)=>visHtml({k:"calc",r:rows})&&`<h3 style="margin-top:12px">${t}</h3>`+visHtml({k:"calc",r:rows});
    body=R("Profit and Loss · December 2025 · accrual",[["Services income",qm(inc)]].concat(ex.map(x=>[x[0],qm(-x[1])]),[["Net income",qm(net),1]]))
     +R("Balance Sheet · December 31, 2025",assets.filter(a=>Math.abs(a[1])>0.005||a[0]==="Checking").map(a=>[a[0],qm(a[1])]).concat([["Total assets",qm(ta),1]],li.map(a=>[a[0],qm(a[1])]),[["Owner's equity (investment − draws + net income)",qm(eq)],["Total liabilities and equity",qm(tl+eq),1]]))
     +R("A/R Aging · who owes the studio",q.tx.filter(t=>t.k==="Invoice"&&t.open>0.005).map(t=>[t.who+" · invoice "+t.id,qm(t.open)]).concat([["Total",qm(qbal("Accounts Receivable")),1]]))
     +R("A/P Aging · whom the studio owes",q.tx.filter(t=>t.k==="Bill"&&t.open>0.005).map(t=>[t.who+" · bill "+t.id,qm(t.open)]).concat([["Total",qm(-qbal("Accounts Payable")),1]]))}
  if(tab==="close")body=qClose(q,T);
  if(tab==="jobs")body=qJobs();
  $("#view").innerHTML=`<section class="section"><div class="sesshead"><div><h2>Practice company</h2><div class="small muted">Bookkeeping simulator · ${done} of ${T.length} done${done?" · "+T.filter((t,i)=>t[1]&&!(q.help||{})[i]).length+" without Show me":""}</div></div><button class="btn ghost small" data-qexit="1">Back</button></div>
    ${(()=>{const i=T.findIndex(t=>!t[1]);if(i<0||tab==="jobs")return "";const g=QGUIDE[i];return `<div class="card coach"><div class="small muted">Step ${i+1} of ${T.length} · ${e(T[i][0])}</div><b>${e(g[0])}</b><div class="small">${e(g[1])}</div><div class="row"><button class="btn pri small" data-qtry="${i}">Let me try</button><button class="btn small" data-qgo="${i}">Show me</button></div></div>`})()}
    ${tab==="jobs"?"":qEq()}${qv.last&&tab!=="jobs"?visHtml({k:"je",r:qv.last.L.map(l=>[l[0],l[1]>0?qm(l[1]):"",l[1]<0?qm(-l[1]):""]),n:"What the program posted behind the form you just saved. Debits on the left, credits on the right; they always match."}):""}
    ${qv.try!=null&&QDOCS[qv.try]&&qv.tab==="new"?`<div class="small muted" style="margin-top:8px">The paper on your desk: ${e(QDOCS[qv.try][1])}</div>`+visHtml(QDOCS[qv.try][2]):""}
    <div class="filters scroll qnav">${nav}</div>${qv.msg?`<div class="notice" style="margin:8px 0"><b>${e(qv.msg)}</b></div>`:""}${body}
    <div style="margin-top:16px">${qv.reset?`<span class="small">Erase the practice company and start again?</span> <button class="btn small" data-qreset="2" style="border-color:var(--bad);color:var(--bad)">Erase</button> <button class="btn ghost small" data-qreset="0">Keep</button>`:`<button class="btn ghost small" data-qreset="1">Start the company over</button>`}</div></section>`}
function qboClick(b){const d=b.dataset;
  if(d.mode==="qbo"){qv={tab:"home",form:null,msg:"",doc:-1};view="qbo";render();window.scrollTo(0,0);return true}
  if(view!=="qbo")return false;const q=QS();let hit=true;const msg0=qv.msg;qv.msg="";
  if(view==="qbo"&&qjClick(d)){render();return true}
  if(!d.qsave)qv.pre=null;
  if(d.qexit){view="home"}
  else if(d.qtry!==undefined){const g=QGUIDE[+d.qtry][2];qv.try=+d.qtry;qv.last=null;qv.form=null;qv.tab=g.form?"new":g.tab;qv.msg=g.form?"Read the paper below, pick the right form and fill it in yourself. The program checks it when you save.":"Your turn. Tap Show me if you get stuck."}
  else if(d.qgo!==undefined){const g=QGUIDE[+d.qgo][2];{const h=QS();h.help=h.help||{};h.help[d.qgo]=1;persist()}qv.try=null;qv.last=null;if(g.form){qv.tab="new";qv.form=g.form;qv.pre=g.pre;qv.msg="The form is filled in for you. Read each field, then click Save and close."}else{qv.tab=g.tab;qv.form=null}}
  else if(d.qtab){qv.tab=d.qtab;qv.form=null;qv.last=null;if(d.qtab!=="new")qv.try=null}
  else if(d.qdoc!==undefined){qv.doc=qv.doc===+d.qdoc?-1:+d.qdoc}
  else if(d.qform!==undefined){qv.form=d.qform||null}
  else if(d.qsave){const T0=qtasks(),i0=T0.findIndex(t=>!t[1]),n0=QS().tx.length,d0=T0.filter(t=>t[1]).length;qSave(d.qsave);
    if(QS().tx.length>n0){qv.last=QS().tx[QS().tx.length-1];const T1=qtasks(),d1=T1.filter(t=>t[1]).length;
      if(d1>d0){const k=T1.findIndex((t,j)=>t[1]&&!T0[j][1]);qv.msg="✓ Right. "+QGUIDE[k][1];qv.try=null}
      else if(i0>=0&&i0<9)qv.msg="Saved, but it did not complete any open job. The next one needs: "+QGUIDE[i0][0]+" Check the form type, the name, the account and the amount. Delete the wrong entry under Lists, then try again or tap Show me."}}
  else if(d.qdel){qDelete(d.qdel)}
  else if(d.qmatch!==undefined){const i=+d.qmatch,f=QFEED[i],c=qBankTx().find(t=>Math.abs(qBankAmt(t)-f[2])<0.005&&!q.feed.includes(t.id));if(c){q.feed[i]=c.id;c.c=true;persist();qv.msg="Matched to "+c.k+" "+qm(c.amt)+"."}}
  else if(d.qadd!==undefined){const i=+d.qadd,f=QFEED[i],cat=document.getElementById("qfc"+i).value,a=Math.abs(f[2]);const t=qpost({k:f[2]>0?"Deposit":"Expense",d:f[0]+"/2025",who:f[1],amt:a,c:true,L:f[2]>0?[["Checking",a],[cat,-a]]:[[cat,a],["Checking",-a]]});if(t){q.feed[i]=t.id;persist();qv.msg="Added as "+cat+". If this was already in your books, it is now counted twice: delete one in Lists."}}
  else if(d.qexc!==undefined){q.feed[+d.qexc]=-1;persist();qv.msg="Excluded. Use this only for a duplicate or a line that does not belong to this company."}
  else if(d.qcl!==undefined){q.cl=q.cl||{};q.cl[d.qcl]=true;persist()}
  else if(d.qfinish){q.rec=true;persist();qv.msg="Reconciliation finished."}
  else if(d.qreset){if(d.qreset==="1")qv.reset=true;else{if(d.qreset==="2"){S.set.qbo=Q0();persist();qv.tab="home"}qv.reset=false}}
  else{hit=false;qv.msg=msg0}
  if(hit){render();if(d.qtab||d.qexit||d.qsave)window.scrollTo(0,0)}return hit}
document.addEventListener("change",e=>{const id=e.target&&e.target.dataset&&e.target.dataset.qclr;if(!id||view!=="qbo")return;const t=QS().tx.find(x=>x.id==id);if(t){t.c=e.target.checked;persist();render()}});
