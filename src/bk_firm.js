/* ================= Run Solving Life LLC: one year of the business, December 2026 to November 2027 =================
   Each month brings real deadlines and real client situations. Every choice moves four meters (cash, clients,
   reputation, compliance) and is explained with the rule behind it. Clients and numbers are invented.
   Dates: Jan 31, 2027 is a Sunday (W-2 and 1099-NEC due Feb 1); Mar 15 Monday; Apr 15 Thursday; Jun 15 Tuesday;
   Jul 31 Saturday (Form 941 due Aug 2); Sep 15 Wednesday; Oct 15 Friday. */
const FIRM=[
 {m:"December 2026",cal:[["Dec 31","Your PTIN expires"],["Any day","Yearly review of the office security plan"]],ev:[
  {src:"📧 Email from the IRS",t:"Renew your PTIN",q:"Your Preparer Tax Identification Number expires December 31. Tax season starts in January.",o:[
   ["Renew it online now for 2027",{cash:-20},2,"Every paid preparer needs a valid PTIN for the year a return is prepared. Renewal opens in mid-October and a PTIN that isn't renewed lapses on December 31."],
   ["Wait until the first client shows up",{comp:-15},0,"Preparing returns for pay without a current PTIN breaks IRS rules, and the first busy week is the worst time to be blocked."],
   ["Use your partner's PTIN when needed",{comp:-30,rep:-10},0,"A PTIN is personal: each preparer signs with their own. Using someone else's is misconduct."]]},
  {src:"📋 To-do",t:"The office security plan",q:"Your written information security plan (WISP) is due for its yearly review. The office laptop holds client tax files.",o:[
   ["Review the plan, turn on multi-factor login everywhere, encrypt the laptop, train everyone",{cash:-100,comp:5},2,"Tax preparers must keep a WISP under the FTC Safeguards Rule, with safeguards such as multi-factor authentication and encryption, and review it regularly. IRS Publication 4557 walks through it."],
   ["Install antivirus and call it done",{comp:-8},1,"Antivirus helps, but the rule asks for a written plan, access controls, encryption and training."],
   ["Skip it: it's a small office",{comp:-20},0,"Size doesn't matter: the Safeguards Rule covers every paid preparer, even a one-person office."]]}]},
 {m:"January 2027",cal:[["Jan 15","Q4 2026 estimated tax"],["Feb 1","W-2s and 1099-NEC due (Jan 31 is a Sunday)"]],ev:[
  {src:"📧 Mike, Pine Ridge Landscaping (bookkeeping client)",t:"Who gets a 1099-NEC?",q:"\"In 2026 I paid Leo (lawn crew, sole proprietor) $2,400, Ana (helper, sole proprietor) $1,800, and Quick Print Inc., a corporation, $3,000 for flyers. Who gets a 1099-NEC?\"",o:[
   ["Only Leo",{rep:3},2,"For payments made in 2026 the 1099-NEC threshold is $2,000 (One Big Beautiful Bill Act), so Ana is under it. Payments to corporations generally don't get a 1099-NEC (legal fees are an exception). Leo's form goes to him and the IRS by February 1, 2027."],
   ["Leo and Ana",{rep:-2,comp:-3},0,"That's the old $600 rule. It still applies to 2025 payments, but 2026 payments use $2,000."],
   ["All three",{comp:-3},0,"Payments to a corporation for printing generally aren't reported on a 1099-NEC, and Ana is under the 2026 threshold of $2,000."]]},
  {src:"📋 To-do",t:"Your own estimated tax",q:"Solving Life LLC had a good fall. Your fourth-quarter estimated tax payment for 2026 is due January 15.",o:[
   ["Pay it by January 15 through IRS Direct Pay",{cash:-600},2,"Self-employed owners pay estimated tax in four installments when they expect to owe $1,000 or more. Paying on time avoids the underpayment penalty."],
   ["Skip it and pay everything in April",{cash:-60,comp:-6},0,"The full amount is still due, plus an underpayment penalty figured like interest for the late quarter."]]}]},
 {m:"February 2027",cal:[["Mid-Feb","First refunds with earned income credit arrive"],["Feb 1","Last day for W-2s and 1099s"]],ev:[
  {src:"📧 Rosa, new client",t:"A 1099-K for used furniture",q:"\"PayPal sent me a 1099-K for $3,200. I sold my old couch, a bike and baby things, all for less than I paid. Do I owe tax?\"",o:[
   ["Report it as personal items sold at a loss so it nets to zero, and note what she paid",{rep:3,cl:1},2,"Selling personal things at a loss isn't taxable, but the IRS has the form. IRS instructions show how to report it so it nets to zero (Schedule 1, lines 8z and 24z). The return then matches the 1099-K."],
   ["Leave it off: it isn't income",{comp:-5,rep:-3},0,"The IRS matching system sees a 1099-K with nothing on the return and sends a notice (CP2000). Report it and offset it."],
   ["Report the $3,200 as income",{rep:-6},0,"She'd pay tax on money that isn't profit. A personal item sold for less than it cost is a nondeductible loss, not income."]]},
  {src:"🧑 Walk-in",t:"Earned income credit",q:"Dana, single with two children, wants the earned income credit, the child tax credit and head of household status. She brought one W-2.",o:[
   ["Ask the due diligence questions, write down her answers, complete Form 8867, keep the records",{comp:3,cash:250,cl:1},2,"Paid preparers have special due diligence for the earned income credit, child tax credit, American opportunity credit and head of household: ask, document, file Form 8867, keep records 3 years. Each failure can bring a penalty."],
   ["She seems honest, just file it",{cash:250,comp:-15},0,"Trust isn't documentation. Without the questions and Form 8867, each missing step is a separate preparer penalty."],
   ["Turn away all credit clients",{rep:-5,cl:-2},1,"Legal, but you lose the families who need help most. Due diligence is what makes these returns safe to prepare."]]}]},
 {m:"March 2027",cal:[["Mar 15","S corporation and partnership returns due"],["Mar 15","Form 7004 extensions"]],ev:[
  {src:"📧 Mike, Pine Ridge Landscaping",t:"The S corporation books aren't ready",q:"It's March 10. Pine Ridge's S corporation books for 2026 still aren't finished.",o:[
   ["File Form 7004 by March 15 to extend to September 15",{comp:2},2,"Form 1120-S is due March 15, 2027. Form 7004 gives an automatic 6-month extension to file. A late S corporation return draws a penalty for each shareholder for each month."],
   ["File on time with guessed numbers",{comp:-10,rep:-4},0,"A return you know is wrong isn't a fix: it means an amended return later and possible preparer penalties."],
   ["Let it be a little late",{comp:-8,rep:-5},0,"The late-filing penalty starts the first month and is charged per shareholder. The extension was free."]]},
  {src:"📧 Ken, client",t:"\"Just send it, I'll sign later\"",q:"Ken is traveling and wants his return e-filed today. He says he'll sign Form 8879 next week.",o:[
   ["Send Form 8879 for e-signature and transmit only after he signs",{rep:1},2,"An electronic return originator may not transmit until the taxpayer signs Form 8879 (an electronic signature is fine). Keep it 3 years."],
   ["Transmit now, collect the signature later",{comp:-15},0,"Filing without the signed authorization breaks e-file rules and can cost you your EFIN."],
   ["Sign it for him",{comp:-30,rep:-10},0,"Signing for a client is forgery. It ends careers."]]}]},
 {m:"April 2027",cal:[["Apr 15","Individual returns and Form 4868"],["Apr 15","Q1 2027 estimated tax"]],ev:[
  {src:"🧑 Luis, client",t:"Balance due he can't pay",q:"Luis owes $4,800 for 2026 and has $1,000 today. It's April 12.",o:[
   ["File on time, pay what he can, set up an online payment plan",{rep:4},2,"Failure to file costs 5% of the unpaid tax per month (up to 25%); failure to pay costs 0.5% per month. Filing on time avoids the big one, and a payment plan lowers the failure-to-pay rate while it's in effect."],
   ["Wait to file until he has the money",{rep:-6,comp:-4},0,"Not filing adds the 5%-a-month penalty on top. Always file on time, even without payment."],
   ["File an extension so he has more time to pay",{rep:-2},1,"Form 4868 gives more time to file, not to pay. Interest and the failure-to-pay penalty still run from April 15."]]},
  {src:"🧑 Walk-in",t:"An offer you should refuse",q:"A man offers you $200 extra to list his nephew as a dependent. The nephew doesn't live with him.",o:[
   ["Refuse, explain the rule, offer to prepare the return correctly",{rep:2,cl:-1},2,"Knowingly claiming someone who doesn't qualify is a willful understatement: preparer penalties under section 6694(b) and Circular 230 sanctions. Your PTIN and EFIN are your career."],
   ["Do it this once",{cash:200,comp:-40,rep:-20},0,"Return preparer fraud. The IRS looks for patterns across a preparer's returns."],
   ["Add him, but don't sign as the preparer",{cash:200,comp:-40,rep:-15},0,"Preparing a return for pay without signing it is itself a violation (a \"ghost preparer\")."]]}]},
 {m:"May 2027",cal:[["May","Collect unpaid fees"],["Monthly","Reconcile your own bank account"]],ev:[
  {src:"📋 To-do",t:"Unpaid invoices",q:"Eight clients still owe $2,400 from tax season.",o:[
   ["Send friendly reminders with a pay-by-card link, then call; next year take payment before filing",{cash:1800},2,"Most unpaid fees are forgotten, not refused. A clear reminder and an easy way to pay collect most of it. Payment at pickup prevents it next year."],
   ["Keep their W-2s and documents until they pay",{cash:600,comp:-10,rep:-5},0,"Circular 230 §10.28 says you must return a client's records when asked, even in a fee dispute."],
   ["Write it off and say nothing",{},1,"Legal, but $2,400 is a month of rent. Ask first."]]},
  {src:"📋 To-do",t:"Your own books",q:"Solving Life LLC's bank account hasn't been reconciled since January, and a few personal purchases went on the business card.",o:[
   ["Reconcile every month, record personal charges as owner's draws, use a separate personal card",{comp:5},2,"A bookkeeper's own books should be the cleanest in town. Personal spending is a draw, never a business expense."],
   ["Fix it all in December",{comp:-5},1,"Possible, but harder to remember what each charge was, and you can't see cash clearly all year."],
   ["Deduct the personal charges as business expenses",{comp:-20},0,"Personal expenses aren't deductible. Doing it on your own return is the habit you're paid to catch in others."]]}]},
 {m:"June 2027",cal:[["Jun 15","Q2 2027 estimated tax"]],ev:[
  {src:"📧 Rosa, client",t:"A CP2000 notice",q:"Rosa got a CP2000: the IRS has a $900 1099-INT that wasn't on her return. She forgot to give it to you.",o:[
   ["Check it with her, help her answer by the response date and pay the small extra tax",{rep:4},2,"A CP2000 proposes a change based on forms the IRS received. If it's right, agree and pay; if not, explain with documents. Answer by the date on the notice. An enrolled agent can represent her with Form 2848."],
   ["Ignore it: notices go away",{rep:-6,comp:-4},0,"They don't. With no answer, the IRS assesses the tax and starts collection."],
   ["Tell her to call the IRS herself",{rep:-4},1,"Allowed, but helping clients with notices is how you keep them for years."]]},
  {src:"📋 To-do",t:"Hiring help",q:"You hire a part-time helper. She works set hours in your office on your computer, you train her, and you pay her by the hour.",o:[
   ["Employee: Form W-4, Form I-9, payroll and payroll taxes",{cash:-400,comp:3},2,"You control how, when and where she works and provide the tools: under the common-law rules that's an employee. Misclassifying means back payroll taxes and penalties."],
   ["Contractor: Form W-9 and a 1099-NEC in January",{comp:-12},0,"Behavioral and financial control point to an employee. Calling her a contractor doesn't change what she is."]]}]},
 {m:"July 2027",cal:[["Aug 2","Form 941 for April to June (Jul 31 is a Saturday)"]],ev:[
  {src:"📋 To-do",t:"Payroll's first quarter",q:"Your helper's first quarter on payroll ended June 30. Which return reports the withheld income tax and Social Security and Medicare?",o:[
   ["Form 941, due August 2, 2027",{comp:3},2,"Form 941 is quarterly: April to June is due July 31, moved to August 2 because July 31, 2027 is a Saturday. Deposits go through EFTPS on schedule."],
   ["Form 940",{comp:-6},0,"Form 940 is the yearly federal unemployment (FUTA) return, due January 31."],
   ["Form W-3",{comp:-6},0,"Form W-3 goes to the Social Security Administration once a year, with the W-2s."]]},
  {src:"📧 Bookkeeping client",t:"\"Should I be an S corporation?\"",q:"A client's sole proprietorship nets $95,000. A friend told him an S corporation saves tax.",o:[
   ["Run the numbers: a reasonable salary through payroll, the extra costs, then decide",{rep:4,cash:300},2,"An S corporation can save self-employment tax on profit above a reasonable salary, but adds payroll, a separate return and fees. Advice built on his numbers is worth paying for."],
   ["Elect now and pay himself a $10,000 salary",{comp:-10,rep:-3},0,"A salary that low for full-time work isn't reasonable. The IRS can recast distributions as wages."],
   ["Tell him S corporations are a scam",{rep:-3},1,"They're a real tool for the right business. Your job is to show when it pays."]]}]},
 {m:"August 2027",cal:[["Slow season","Study and plan"]],ev:[
  {src:"📧 Email: \"IRS e-Services\"",t:"Urgent: your EFIN",q:"\"Your EFIN will be suspended. Log in within 24 hours.\" The link goes to an odd web address.",o:[
   ["Don't click. Forward it to phishing@irs.gov and check e-Services by typing the address yourself",{comp:3},2,"Thieves target preparers for client data. The IRS doesn't threaten by email with a 24-hour deadline. Report it, and if data was ever exposed, contact your IRS Stakeholder Liaison."],
   ["Click and log in, just to be safe",{comp:-30,rep:-12},0,"That hands over your login and possibly every client's data. A breach means notifying clients and the IRS."],
   ["Delete it",{},1,"Safe for you, but reporting it helps the IRS shut the scam down."]]},
  {src:"📋 Your calendar",t:"Ten free hours a week",q:"Tax season is over. How do you use the slow months?",o:[
   ["Study for the EA exam and plan next season's marketing",{rep:4},2,"Becoming an enrolled agent lets you represent any taxpayer before the IRS, and planning now fills next season early."],
   ["Take on two new monthly bookkeeping clients",{cash:1200,cl:2},2,"Monthly bookkeeping evens out the year's cash flow and feeds tax season."],
   ["Rest and do nothing",{},1,"Rest matters, but some planning now pays off in January."]]}]},
 {m:"September 2027",cal:[["Sep 15","Extended S corporation and partnership returns"],["Sep 15","Q3 2027 estimated tax"]],ev:[
  {src:"📋 To-do",t:"The extended S corporation return",q:"Pine Ridge's books are finally done on September 3. The extended Form 1120-S is due September 15.",o:[
   ["File by September 15 and send the shareholders their K-1s right away",{comp:3,cash:900},2,"The owners need their K-1s to finish their own extended returns by October 15."],
   ["File it in October along with the owners' returns",{comp:-10,rep:-4},0,"The extension ran out September 15. Late means the per-shareholder penalty."]]},
  {src:"📧 Colorado Secretary of State",t:"Periodic report",q:"Solving Life LLC's yearly periodic report is due.",o:[
   ["File it online now and pay the fee",{cash:-10,comp:2},2,"Colorado LLCs file a periodic report every year around their anniversary month. Miss it and the LLC goes delinquent, which can block bank and contract changes until it's fixed."],
   ["Ignore it",{comp:-15},0,"A delinquent LLC isn't in good standing. It costs more to fix later."]]}]},
 {m:"October 2027",cal:[["Oct 15","Extended individual returns"],["Mid-Oct","PTIN renewal opens for 2028"]],ev:[
  {src:"📧 Three extension clients",t:"October 13",q:"Three clients on extension finally send documents two days before the deadline.",o:[
   ["Finish what's complete, get signed 8879s, file by October 15; tell anyone missing items in writing what's missing",{rep:3,comp:2,cash:900},2,"There's no further extension. Clear written notes protect you and the client."],
   ["File all three with estimates for the missing items",{comp:-10,rep:-3},0,"Guessed numbers mean amended returns and possible penalties. Real documents first."]]},
  {src:"📋 Next season's prices",t:"Are you charging enough?",q:"Simple returns that you price at $150 took three hours each this year.",o:[
   ["Price by form and complexity, publish a fee list, use engagement letters",{cash:1200,rep:1},2,"Clear prices set expectations and cover your time. An engagement letter states the work, the fee and what the client must provide."],
   ["Keep the prices and work longer hours",{},1,"It works until burnout. Your time is the product."],
   ["Charge a percentage of each client's refund",{comp:-15},0,"Circular 230 §10.27 bars contingent fees for preparing an original return."]]}]},
 {m:"November 2027",cal:[["Nov","Get bookkeeping clients ready for January"],["Nov","Plan the 2028 season"]],ev:[
  {src:"📋 Bookkeeping clients",t:"Ready for January",q:"Your bookkeeping clients want January to go smoothly.",o:[
   ["Collect Form W-9s from contractors now, check employee addresses, set up 1099 tracking in QuickBooks",{rep:3,comp:2},2,"With W-9s on file and payees tracked, 1099s and W-2s go out by the deadline without a scramble."],
   ["Wait for January",{comp:-3},1,"Chasing W-9s in late January makes deadlines tight."]]},
  {src:"📧 Former client",t:"\"Can I get a copy of my return?\"",q:"A client from the 2025 season asks for a copy of her return.",o:[
   ["Pull it from your secure records and send it securely",{rep:2},2,"Preparers must keep a copy of each return, or a list of returns prepared, for at least 3 years. Send it through a secure portal, not plain email."],
   ["You shredded it right after filing",{comp:-8,rep:-3},0,"Too early: the 3-year rule applies. Keep secure digital copies."]]}]}];
const FSTART={cash:3000,cl:12,rep:60,comp:100};
function firmS(){S.set.firm=S.set.firm||{};return S.set.firm}
function firmNew(){const F=firmS();F.g={mi:0,ei:0,st:Object.assign({},FSTART),log:[],pick:null};persist()}
function firmScore(st){const c=Math.max(0,Math.min(100,st.cash/120)),k=Math.max(0,Math.min(100,st.cl*4)),r=Math.max(0,Math.min(100,st.rep)),p=Math.max(0,Math.min(100,st.comp));return Math.round(0.3*r+0.35*p+0.2*c+0.15*k)}
function firmMeters(st,fx){const e=esc,d=k=>fx&&fx[k]?`<em class="${fx[k]>0?"up":"dn"}">${fx[k]>0?"+":""}${k==="cash"?(fx[k]>0?"":"−")+$$(Math.abs(fx[k])).replace("-",""):fx[k]}</em>`:"";
  const rows=[["cash","💵","Cash",$$(st.cash),Math.max(0,Math.min(1,st.cash/12000))],["cl","👥","Clients",String(st.cl),Math.max(0,Math.min(1,st.cl/25))],["rep","⭐","Reputation",st.rep+"/100",st.rep/100],["comp","🛡️","Compliance",st.comp+"/100",st.comp/100]];
  return `<div class="fmet">${rows.map(([k,ic,n,v,p])=>`<div class="fm fm-${k}"><span>${ic} ${n}</span><b>${e(v)}${d(k)}</b><span class="bkl-bar"><i style="width:${Math.round(Math.max(0,p)*100)}%"></i></span></div>`).join("")}</div>`}
function renderFirm(){const e=esc,F=firmS(),g=F.g;
  const head=(sub)=>`<div class="sesshead"><div><h2>🏢 Run Solving Life LLC</h2><div class="small muted">${sub}</div></div><button class="btn ghost small" data-firm="exit">Exit</button></div>`;
  if(!g){$("#view").innerHTML=`<section class="section">${head("One year of the business, December 2026 to November 2027")}<div class="card firmintro">
     <div class="fhero">🏢</div><h2 style="margin:4px 0">You're running the office this year</h2>
     <p>Twelve months, 24 decisions: deadlines, client emails, walk-ins, security, pricing and your own books. Each choice moves four meters and comes with the rule behind it.</p>
     ${firmMeters(FSTART)}
     <div class="small muted" style="margin:8px 0">Finish with good compliance, a strong reputation, happy clients and cash in the bank. 80 or more is an excellent year.${F.best?` Your best so far: <b>${F.best}</b>.`:""}</div>
     <button class="btn pri" data-firm="start" style="width:100%">Start in December 2026</button></div></section>`;return}
  if(g.mi>=FIRM.length){const sc=firmScore(g.st),best=g.log.filter(x=>x[2]===2).length;if(!F.best||sc>F.best)F.best=sc;F.m=12;persist();
    const grade=sc>=85?["🏆","An excellent year: ready to run Solving Life LLC"]:sc>=70?["🎉","A solid year, with a few lessons"]:sc>=55?["💪","You got through it. Replay to sharpen your choices"]:["📚","A rough year. Read the explanations and try again"];
    $("#view").innerHTML=`<section class="section">${head("Year-end report, November 2027")}<div class="card" style="text-align:center"><div class="jbig">${grade[0]}</div><h2>Score ${sc} of 100</h2><div>${grade[1]}</div>
      ${firmMeters(g.st)}<div class="small muted" style="margin:6px 0">${best} of ${g.log.length} decisions were the best move.</div>
      <div class="flog">${g.log.map(x=>`<div class="${x[2]===2?"ok":x[2]===1?"mid":"bad"}"><span>${e(x[0])}</span><b>${x[2]===2?"✓ best":x[2]===1?"okay":"✗"}</b></div>`).join("")}</div>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn pri" data-firm="again">Play the year again</button><button class="btn ghost" data-firm="exit">Back</button></div></div></section>`;return}
  const M=FIRM[g.mi],E=M.ev[g.ei],n=FIRM.reduce((s,x)=>s+x.ev.length,0),done=FIRM.slice(0,g.mi).reduce((s,x)=>s+x.ev.length,0)+g.ei;
  const strip=`<div class="fcal"><div class="fcm">📅 ${e(M.m)}</div>${M.cal.map(c=>`<div class="fcd"><b>${e(c[0])}</b><span>${e(c[1])}</span></div>`).join("")}</div>`;
  const months=`<div class="fmonths">${FIRM.map((x,k)=>`<span class="${k<g.mi?"done":k===g.mi?"cur":""}">${x.m.slice(0,3)}</span>`).join("")}</div>`;
  let body;
  if(g.pick==null){body=`<div class="fsrc">${e(E.src)}</div><div class="ftitle">${e(E.t)}</div><div class="stem">${e(E.q)}</div><div class="opts" style="margin-top:10px">${E.o.map((o,k)=>`<button class="opt jopt" data-firm="pick" data-k="${k}"><span>${e(o[0])}</span><span></span></button>`).join("")}</div>`}
  else{const o=E.o[g.pick],v=o[2],bi=E.o.findIndex(x=>x[2]===2);
    body=`<div class="fsrc">${e(E.src)}</div><div class="ftitle">${e(E.t)}</div><div class="fpick"><span class="small muted">You chose</span><b>${e(o[0])}</b></div>
      <div class="explain"><b style="color:var(--${v===2?"good":v===1?"warn":"bad"})">${v===2?"✓ Best move.":v===1?"Okay, but there's a better move.":"✗ That causes problems."}</b> ${e(o[3])}${v<2&&bi>=0?`<div style="margin-top:6px"><b>Best move:</b> ${e(E.o[bi][0])}. ${e(E.o[bi][3])}</div>`:""}</div>
      <button class="btn pri" data-firm="next" style="margin-top:10px">${g.ei+1<M.ev.length?"Next":"On to "+(FIRM[g.mi+1]?FIRM[g.mi+1].m:"the year-end report")}</button>`}
  $("#view").innerHTML=`<section class="section">${head(`Decision ${done+1} of ${n} · score so far ${firmScore(g.st)}`)}${months}${firmMeters(g.st,g.pick!=null?E.o[g.pick][1]:null)}${strip}<div class="card">${body}</div></section>`}
function firmClick(d){const F=firmS();
  if(d.firm==="exit"){view=CLOCK()?"bkland":"home";part=BK;render();window.scrollTo(0,0);return true}
  if(d.firm==="start"||d.firm==="again"){firmNew();render();window.scrollTo(0,0);return true}
  const g=F.g;if(!g)return false;
  if(d.firm==="pick"&&g.pick==null){const k=+d.k,M=FIRM[g.mi],E=M.ev[g.ei],o=E.o[k];g.pick=k;for(const key in o[1])g.st[key]=(g.st[key]||0)+o[1][key];g.st.rep=Math.max(0,Math.min(100,g.st.rep));g.st.comp=Math.max(0,Math.min(100,g.st.comp));g.st.cl=Math.max(0,g.st.cl);g.log.push([E.t,k,o[2]]);persist();render();return true}
  if(d.firm==="next"){const M=FIRM[g.mi];g.pick=null;g.ei++;if(g.ei>=M.ev.length){g.ei=0;g.mi++;g.st.cash+=Math.round(g.st.cl*(g.mi<=5?160:60)-450)}persist();render();window.scrollTo(0,0);return true}
  return false}
