/* ================= Study page: quick drill, decision drills and practice cases, with progress ================= */
const OPEN={};let qdOver=0;
document.addEventListener("toggle",e=>{const t=e.target;if(t&&t.matches&&t.matches("details.more"))OPEN[t.id]=t.open},true);
function qdCommon(p){const ids=new Set();BANK.forEach(i=>{const r=S.it[i.id];if(i.p==p&&r&&r[5])ids.add(i.id)});hardest(p,60).forEach(i=>ids.add(i.id));return [...ids].map(id=>BYID[id]).filter(Boolean)}
function quickHtml(){const P=PARTS[part],n=S.set.qd||10,e=esc;touchDay();
  const miss=missedPool(part,"all").length,com=qdCommon(part).length,wd=weakestDomain(part),nw=newList(part,"all").length;
  const ps=partStats(part),day=S.day||{n:0};
  return `<section class="section"><div class="ledger qd">
    <div class="row" style="justify-content:space-between;align-items:center"><h3 style="margin:0">Quick drill</h3><div class="seg" id="qdsize">${[5,10,20].map(k=>`<button aria-pressed="${n===k}" data-qdn="${k}">${k}</button>`).join("")}</div></div>
    <div class="small muted">Built from your answers: misses, due reviews, your 3 weakest areas at a climbing level (hard-only once you hit 75%), 2–3 calculations, and no repeats of items you just got right.</div>
    <button class="btn pri qdgo" data-qd="smart">▶ Smart drill · ${n} questions</button>
    <div class="qdgrid">
      <button class="btn" data-qd="missed" ${miss?"":"disabled"}><span>Redo misses</span><b>${miss}</b></button>
      <button class="btn" data-qd="common" ${com?"":"disabled"}><span>Common mistakes</span><b>${com}</b></button>
      <button class="btn" data-qd="weak"><span>Weakest area</span><b>${e(String(wd))}. ${e(P.doms[wd][0].split(/[,:(·]/)[0].split(" ").slice(0,3).join(" ").replace(/[&,]$/,""))}</b></button>
      <button class="btn" data-qd="new" ${nw?"":"disabled"}><span>New material</span><b>${nw}</b></button>
      ${BANK.some(i=>i.p==part&&i.xs)?`<button class="btn" data-qd="exam" style="grid-column:1/-1"><span>Exam-style: forms, thresholds, deadlines, "which taxpayer"</span><b>${BP(part).filter(i=>i.xs&&!S.it[i.id]).length} new</b></button>`:""}
    </div>
    <div class="small muted">Today: ${day.n||0} answered${S.streak&&S.streak.n?" · "+S.streak.n+"-day streak":""} · ${ps.examAcc===null?"exam-style score after a few drills":"exam-style "+ps.examAcc+"%"}</div>
  </div></section>`}
/* long lists: the next 3 unfinished rows stay visible, the rest fold under "Show all" */
function foldRows(id,rows){if(rows.length<=4)return `<div class="dlist">${rows.map(r=>r.h).join("")}</div>`;const todo=rows.filter(r=>!r.done),top=(todo.length?todo:rows).slice(0,3),rest=rows.filter(r=>!top.includes(r));
  return `<div class="dlist">${top.map(r=>r.h).join("")}</div><details class="more inner" id="${id}" ${OPEN[id]?"open":""}><summary><b>Show all ${rows.length}</b><span>${rows.length-todo.length} perfect · ${todo.length} to go</span></summary><div class="dlist" style="padding:0 8px 8px">${rest.map(r=>r.h).join("")}</div></details>`}
function drillsHtml(){if(PARTS[part].x||typeof DRILL==="undefined")return "";const e=esc;
  const ks=Object.keys(DRILL).filter(k=>typeof DRILLP==="undefined"||!DRILLP[k]||DRILLP[k].includes(+part));if(!ks.length)return "";
  const B=(typeof TD==="function")?TD():{};const perfect=ks.filter(k=>B[k]===DRILL[k].q.length).length;
  return `<section class="section"><div class="ledger">
    <div class="row" style="justify-content:space-between;align-items:center"><h3 style="margin:0">Quick decisions</h3><span class="chip">${perfect}/${ks.length} perfect</span></div>
    <div class="small muted">One-tap rounds on the calls the exam tests constantly. Run each until every answer is automatic.</div>
    ${foldRows("dlall",ks.map(k=>{const t=DRILL[k].q.length,b=B[k];const pct=b==null?0:Math.round(b/t*100);
      return{done:b===t,h:`<button class="drow" data-tdrgo="${k}"><span class="dn">${e(DRILL[k].t)}</span><span class="db"><i style="width:${pct}%;background:${b===t?"var(--good)":"var(--accent)"}"></i></span><span class="ds">${b==null?"Start":b===t?"✓ "+b+"/"+t:b+"/"+t}</span></button>`}}))}
  </div></section>`}
function casesHtml(){if(typeof PDRL==="undefined"||!PDRL[part])return "";const D=PDRL[part],CS=D.cases(),e=esc;if(!CS.length)return "";
  const B=S.w7b||{},key=c=>+part===7?c.id:+part===8?"n-"+c.id:part+"-"+c.id;const perfect=CS.filter(c=>B[key(c)]===c.s.length).length;
  return `<section class="section"><div class="ledger">
    <div class="row" style="justify-content:space-between;align-items:center"><h3 style="margin:0">${e(D.t)}</h3><span class="chip">${perfect}/${CS.length} perfect</span></div>
    ${foldRows("csall",CS.map((c,k)=>{const t=c.s.length,b=B[key(c)];const pct=b==null?0:Math.round(b/t*100);
      return{done:b===t,h:`<button class="drow" data-w7start="${k}"><span class="dn">${e(c.t)}</span><span class="db"><i style="width:${pct}%;background:${b===t?"var(--good)":"var(--accent)"}"></i></span><span class="ds">${b==null?"Start":b===t?"✓ "+b+"/"+t:b+"/"+t}</span></button>`}}))}
  </div></section>`}
function quickClick(b){const d=b.dataset;
  if(d.qdn){S.set.qd=+d.qdn;persist();render();return true}
  if(d.w7start!==undefined){view="w7";w7Go(+d.w7start);render();window.scrollTo(0,0);return true}
  if(d.qd){const n=S.set.qd||10;filt="all";
    if(d.qd==="smart"){startSession("qd",n);return true}
    qdOver=n;startSession(d.qd==="new"?"easy":d.qd);qdOver=0;return true}
  return false}

/* ---------- one clear next step for the exam parts ---------- */
function doNextPick(){const xs=BP(part).filter(i=>i.xs),xsNew=xs.filter(i=>!S.it[i.id]).length,miss=missedPool(part,"all").length,n=S.set.qd||10;
  if(miss>=5)return{qd:"missed",t:`Fix your ${miss} misses`,d:"The fastest points: questions you already got wrong, until they stick."};
  if(xsNew)return{qd:"exam",t:`Exam-style drill · ${n} questions`,d:`${xsNew} new questions written like the real test: which form, exact 2025 amounts, deadlines.`};
  if(miss)return{qd:"missed",t:`Fix your ${miss} miss${miss>1?"es":""}`,d:"Clear these before adding new material."};
  return{qd:"smart",t:`Smart drill · ${n} questions`,d:"Built from your weak areas, due reviews and a few calculations."}}
function doNextHtml(){try{if(PARTS[part].bk)return"";const x=doNextPick();return `<button class="donext" data-qd="${x.qd}"><span class="dn1">👉 DO THIS NEXT</span><b>${esc(x.t)}</b><span class="dn2">${esc(x.d)}</span><span class="dn3">Tap here ▶</span></button>`}catch(_){return""}}

/* ---------- Colorado notary: the real steps to the commission, with the official links ---------- */
const NP_SOS="https://www.sos.state.co.us/pubs/notary/";
const NP_REG="https://soclearns.csod.com/selfreg/register.aspx?c=%255e%255e%255eQh1ClXZUXSNwVN6BmYFa%252fxmq7lp9hTaa6cgVGlaV5Gw%253d",NP_LOGIN="https://soclearns.csod.com/Default.aspx",NP_APPLY="https://www.coloradosos.gov/notary/pages/common/intro.xhtml";
const NPATH=[
 ["Check that you qualify","18 or older, Colorado resident or working in Colorado, lawfully in the U.S., able to read and write English, never had a commission revoked.",[["How to become a notary (SOS)",NP_SOS+"newNotary.html"]]],
 ["Create your free eLearning account","The training and exam are on \"State of Colorado Learns (SOC Learns)\". The plain login page has no sign-up button: first time, use the registration link below. After that, use the login link.",[["FIRST TIME: create the account",NP_REG],["Already registered: log in",NP_LOGIN]]],
 ["Take the free training","On the portal home page, under \"NEW AND RENEWING NOTARY TRAINING\", tap \"Colorado Notary Public Training - RULONA\". Finish it and save the training certificate. (A state-approved paid vendor also counts.)",[["Log in to SOC Learns",NP_LOGIN],["Notary training page and vendor list",NP_SOS+"notaryTraining.html"]]],
 ["Pass the exam","Same list on the portal: tap \"Colorado Notary Public Exam - RULONA\" → Open Curriculum → Launch. Open book, about 30 minutes. Then: close the test window → Options → View Completion Page → View My Certificate → download it. Both certificates must be less than 90 days old when you apply.",[["Log in to SOC Learns",NP_LOGIN],["Exam instructions (SOS)",NP_SOS+"notaryTesting.html"]]],
 ["Read the law and the handbook","Use them during the open-book exam and keep them for your work.",[["Notary Handbook (PDF)",NP_SOS+"files/notaryHandbook.pdf"],["Notary rules 8 CCR 1505-11 (PDF)","https://www.coloradosos.gov/pubs/rule_making/CurrentRules/8CCR1505-11Notary.pdf"]]],
 ["Sign the affirmation in front of a notary","Print the affirmation form, fill in every blank, and sign it in front of a current notary.",[["Checklist and affirmation form (PDF)","https://www.coloradosos.gov/pubs/notary/files/PrintableAttachmentInfoApply.pdf"]]],
 ["Scan your documents","Notarized affirmation, both sides of your ID, training certificate, exam certificate. Not a U.S. citizen: both sides of the permanent resident card or visa. Never upload a Social Security card.",[["What to attach (SOS FAQ)",NP_SOS+"FAQ/apply.html"]]],
 ["Apply online and pay $10","Tap \"Become a Notary\", type your name exactly as on your ID, upload the scans, pay by card. Do not mail anything. Usually processed in 3 to 5 business days; the answer comes by email.",[["Become a Notary: start the application",NP_APPLY],["Notary log in (after you have an account)","https://www.coloradosos.gov/notary/login.xhtml"]]],
 ["Print the commission, get a stamp and a journal","After the approval email: print your commission certificate, order an official stamp that matches it exactly, and start a journal before your first notarization.",[["Notary log in","https://www.coloradosos.gov/notary/login.xhtml"],["Stamp and journal rules (Handbook)",NP_SOS+"files/notaryHandbook.pdf"]]],
 ["Optional: add remote notary","Needs an active commission first. Then on the portal, under \"ADDITIONAL NOTARY TRAINING\", take \"Colorado Remote Notary Training and Exam\", and register for $10.",[["Log in to SOC Learns",NP_LOGIN],["SOS tutorials and training list","https://www.sos.state.co.us/pubs/info_center/training.html"]]],
 ["Keep it current","Report a name, address or employer change within 30 days. Renew every 4 years: renewal training and exam within 90 days before you renew.",[["Renew or update (log in)","https://www.coloradosos.gov/notary/pages/secure/secureHome.xhtml"]]]];
function notaryPathHtml(){const done=(S.set.np=S.set.np||{}),now=NPATH.findIndex((_,i)=>!done[i]),n=NPATH.filter((_,i)=>done[i]).length;
  return `<section class="section"><details class="more" id="npathd" ${OPEN.npathd===false?"":"open"}><summary><b>Your path to the commission</b><span>${n} of ${NPATH.length} steps done${now>=0?` · next: ${esc(NPATH[now][0])}`:" · all done"}</span></summary><div class="npath" style="padding:0 12px 12px">
   <div class="pbar"><i style="width:${Math.round(n/NPATH.length*100)}%"></i></div>
   ${NPATH.map((st,i)=>{const op=OPEN["nps"+i]!==undefined?OPEN["nps"+i]:i===now;return `<div class="nstep ${done[i]?"done":""} ${i===now?"now":""}"><button class="btn small ncheck" data-np="${i}" aria-pressed="${!!done[i]}" aria-label="Mark step ${i+1} ${done[i]?"not done":"done"}">${done[i]?"✅":"⬜"}</button>
     <details class="more nsd" id="nps${i}" ${op?"open":""}><summary><b>${i+1}. ${esc(st[0])}</b>${i===now?`<span class="nnow">do this now</span>`:""}</summary><div class="small">${esc(st[1])}</div>
     <div class="nlinks">${st[2].map(l=>`<div class="nlink"><a href="${l[1]}" target="_blank" rel="noopener">🔗 ${esc(l[0])}</a><button class="btn small" data-cp="${l[1]}">Copy link</button></div>`).join("")}</div></details></div>`}).join("")}
   <div class="small muted">Tick a step when it is done and the next one opens. Tap any step to see its links. Links go to the Colorado Secretary of State. Fees and steps checked against the SOS site on Nov 21, 2026; the SOS site is the final word.</div></div></details></section>`}
const doNextHtml0=doNextHtml;doNextHtml=function(){let h=doNextHtml0();try{if(PARTS[part].x==="notary")h+=notaryPathHtml()}catch(_){}return h};
const quickClick0=quickClick;quickClick=function(b){const d=b.dataset;
  if(d.np!==undefined){S.set.np=S.set.np||{};S.set.np[d.np]=S.set.np[d.np]?0:1;Object.keys(OPEN).forEach(k=>{if(/^nps\d/.test(k))delete OPEN[k]});persist();render();return true}
  if(d.cp){const done=()=>{b.textContent="Copied ✓";setTimeout(()=>{b.textContent="Copy link"},1500)};try{navigator.clipboard.writeText(d.cp).then(done,()=>{window.prompt("Copy this link:",d.cp)})}catch(_){window.prompt("Copy this link:",d.cp)}return true}
  return quickClick0(b)};
