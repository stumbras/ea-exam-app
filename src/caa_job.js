/* ================= CAA on the job =================
   The owner has passed the CAA training, so this section is no longer exam preparation. It is now:
   1) a W-7 client checklist to work through with each client (ten steps, tick as you go, reset for the next client);
   2) a desk reference: what a CAA may certify, the package order, timelines, the IRS notices, yearly duties;
   3) a short refresher (ten mixed questions) every couple of weeks; the question bank stays available by topic.
   Rules come from the facts already in this course (Form W-7 instructions Rev. 12-2024, Pub 4520, Pub 1915 Rev. 12-2025,
   Form W-7(COA) Rev. 8-2025) and were re-checked against IRS.gov on Nov 22, 2026. The IRS pages are the final word.
   No client names or numbers are stored: the checklist only remembers which boxes are ticked. */
const CJL={w7:["Form W-7 and its instructions","https://www.irs.gov/FormW7"],iw7:["Instructions for Form W-7","https://www.irs.gov/instructions/iw7"],aa:["ITIN Acceptance Agent Program (IRS)","https://www.irs.gov/aapc"],p1915:["Publication 1915, Understanding Your ITIN","https://www.irs.gov/pub/irs-pdf/p1915.pdf"],p4520:["Publication 4520, Acceptance Agents' Guide","https://www.irs.gov/pub/irs-pdf/p4520.pdf"]};
const CJOB=[
 {t:"Screen the request",why:"Decide in five minutes whether an ITIN is the right thing, and for whom.",
  c:["Can this person get a Social Security number? If yes, SSA comes first. An ITIN is only possible with an SSA denial letter.",
     "What is the tax purpose? A federal return being filed now, or one of the five exceptions.",
     "List everyone who needs a number: the filer, the spouse, each dependent.",
     "For a spouse or dependent, name the allowable tax benefit on the return: joint filing, head of household, qualifying surviving spouse, the credit for other dependents, the child and dependent care credit, the American opportunity credit or the premium tax credit.",
     "New ITIN or renewal? An ITIN that was on no federal return for three tax years in a row has expired."],
  say:"An ITIN is only for federal tax filing. It does not give permission to work and does not change immigration status.",l:["p1915","iw7"]},
 {t:"Tell the client what to bring",why:"One complete appointment instead of three.",
  c:["Original passport for each applicant. It is the only document that proves identity and foreign status by itself.",
     "No passport: at least two current documents from the list of 13, one with a photo.",
     "Dependent whose passport has no U.S. entry date (and who is not from Canada or Mexico): proof of U.S. residency. Under 6: U.S. medical or school record. 6 to 17: U.S. school record. 18 and over: school record, lease, utility bill or bank statement. Dated within 12 months.",
     "Income papers for the return (W-2, 1099) in the client's own name.",
     "Full foreign address, visa papers if any, and proof of any name change.",
     "Every applicant must be seen: in person, or by video with the original documents in your hands."],
  say:"Bring originals, not photocopies. Notarized copies are not accepted. You take your passport home the same day.",l:["iw7","p1915"]},
 {t:"Agree the work",why:"Set expectations before any form is filled in.",
  c:["Engagement letter or written fee, signed.",
     "Say plainly that you are not the IRS and not an agent of the IRS.",
     "Timing: about 7 weeks; 9 to 11 weeks if mailed January 15 to April 30 or from abroad.",
     "This year's return goes on paper. A new ITIN cannot be used to e-file until the next calendar year.",
     "Privacy: how you store their papers, and their consent to keep copies."],
  say:"I check your documents here and send the IRS copies with my certificate, so your passport stays with you."},
 {t:"Interview and check the documents",why:"This is the part only a CAA can do. Your signature certifies it.",
  c:["Hold each original. Check the photo against the person, the dates, and the security features.",
     "Judge each document by its information, its source and how easily it could be faked.",
     "Documents are current, unaltered, and the name and birth date match what will go on the W-7.",
     "Primary and spouse: you may certify any of the 13 documents except a foreign military ID.",
     "Dependents: you may certify only the passport and the civil birth certificate. Any other dependent document goes to the IRS as the original or a copy certified by the issuing agency.",
     "Copy what you reviewed, then hand the originals back.",
     "Write interview notes for the file: who, when, what you saw."],
  say:"I am going to look closely at your passport for a minute. That is the part the IRS relies on me for.",l:["p4520","aa"]},
 {t:"Complete Form W-7",why:"Most rejects and delays come from this page.",
  c:["Application type: new or renewal. A renewal still needs a reason box, and lines 6e and 6f with the old ITIN.",
     "One reason box, a to h. Boxes d and e need the U.S. person's name and SSN or ITIN; box d also needs the relationship.",
     "Line 1a: the legal name exactly as on the passport, the same as on the return.",
     "Line 2: where the IRS should mail the ITIN letter. Line 3: the full foreign address (required in full for reason b).",
     "Line 4 and 6a: birth date and country; every country of citizenship written out.",
     "Line 6d: the document and the U.S. entry date, or 'Never entered the United States'.",
     "No blank lines: write N/A where a line does not apply.",
     "Signature: the applicant. Under 18: a parent or court-appointed guardian. Anyone else only with Form 2848.",
     "Acceptance Agent's Use ONLY: your signature, date, name and title, firm name, EIN, PTIN and the 8-digit office code."],
  l:["w7","iw7"]},
 {t:"Complete Form W-7(COA)",why:"One certificate for each W-7.",
  c:["Use the IRS form, never a letter on your own letterhead.",
     "Tick only the documents you actually reviewed for this applicant.",
     "Signed and dated by the approved responsible party, with name, title and PTIN.",
     "Check it against the copies going in the envelope: the same documents, the same applicant."],
  l:["aa","p4520"]},
 {t:"Prepare the paper return",why:"The W-7 travels with the return unless an exception applies.",
  c:["Prepare the federal return on paper. Leave the SSN space blank for each person applying for an ITIN.",
     "The names on the return match line 1a of each W-7 exactly.",
     "Each dependent or spouse applying is actually claimed for the benefit you identified in step 1.",
     "The client signs and dates the return.",
     "Exception case instead of a return: the papers that prove the exception are in the package."],
  l:["iw7"]},
 {t:"Assemble and mail",why:"The wrong address is the easiest mistake to avoid.",
  c:["Order: Form W-7 on the front of the return, then the W-7(COA) and document copies for that applicant. One package for the family.",
     "Include any SSA denial letter, residency proof and exception papers.",
     "U.S. mail: Internal Revenue Service, ITIN Operation, P.O. Box 149342, Austin, TX 78714-9342.",
     "Private delivery: ITIN Operation, Mail Stop 6090-AUSC, 3651 S. Interregional, Hwy 35, Austin, TX 78741-0000.",
     "Never the address in the tax return instructions.",
     "Send it by a method you can track, and keep the tracking number in the file.",
     "Keep a full copy of everything that went in the envelope."],
  l:["iw7"]},
 {t:"Track it and answer the IRS",why:"The job is not finished at the post office.",
  c:["Put a follow-up date in the calendar: 7 weeks after mailing, or 11 weeks in peak season or from abroad.",
     "Nothing by then: call 800-829-1040 (267-941-1000 from outside the U.S.). The client's W-7 signature lets you discuss this application only.",
     "CP565: the ITIN was assigned. Give the client the notice and keep a copy.",
     "CP566: the IRS needs more information. Answer the letter with exactly what it asks for.",
     "CP567: rejected. A new Form W-7 is needed, with the cause fixed.",
     "Found a mistake yourself after mailing? Do not send a second W-7. Wait for the IRS letter and send the fix with your reply."],
  say:"When the letter with your number arrives, send me a photo of it so I can update your file.",l:["iw7","p4520"]},
 {t:"Close the file",why:"Records and counts are what a compliance review looks at.",
  c:["Tell the client: use the ITIN on every future return; e-file starts next calendar year; renew if it goes unused on a return for three years; if an SSN is ever issued, stop using the ITIN and tell the IRS in writing.",
     "File holds: the return, W-7, W-7(COA), document copies, exception papers, intake and interview notes, tracking, and every IRS notice.",
     "Keep it 3 calendar years after the year you mailed it, locked or encrypted.",
     "Count this W-7 toward the year's minimum of five, and note whether it was accepted, suspended or rejected."],
  l:["p4520"]}
];
const CJREF=[
 {h:"What you may certify",v:{k:"cmp",a:["Filer and spouse",["Any of the 13 documents","Except a foreign military ID","Originals or copies certified by the issuing agency","Send copies with the W-7(COA)"]],b:["Dependents",["Only the passport and the civil birth certificate","Everything else goes to the IRS as an original or agency-certified copy","Passport with no U.S. entry date: add proof of U.S. residency (not for Canada or Mexico)"]]}},
 {h:"The IRS notices",b:["CP565: the ITIN is assigned. Give it to the client and keep a copy.","CP566: more information is needed. Answer the letter with what it asks for.","CP567: rejected. A new Form W-7 is needed, with the cause fixed."],ex:"Never send a second W-7 to fix your own error. Reply to the IRS letter."},
 {h:"Timelines to tell clients",b:["Normal processing: 7 weeks.","Mailed January 15 to April 30, or from abroad: 9 to 11 weeks.","Originals sent to the IRS come back within 60 days.","A new ITIN can be used to e-file from the next calendar year.","An ITIN that is on no federal return for 3 tax years in a row expires on December 31 of the third year."]},
 {h:"Your yearly duties as a CAA",b:["At least 5 Forms W-7 each calendar year. Fewer means suspension and a one-year wait to reapply.","Keep rejects and suspended cases under 10% of what you send. At 10% or more a compliance review can follow.","Records: 3 calendar years after the year mailed, plus your written procedures, staff training materials and forensic training certificates.","Tell the IRS within 30 days when a responsible party, address, email or phone changes.","The agreement runs through December 31 of the 4th year after approval. Start the renewal at least 6 months before, and retake both trainings.","Cooperate with any IRS, TIGTA or GAO review. Refusing records means immediate suspension."]},
 {h:"Running it as a business",b:["Quote one clear fee per applicant and a family price. Say what is included: interview, document check, W-7, certificate, mailing, and answering one IRS letter.","Book 30 to 45 minutes for the first applicant and 15 for each extra family member.","Busy season is January to April. Returns with W-7s take longer at the IRS then, so set expectations early.","Offer the tax return and the ITIN together. Most ITIN clients need both, and the names must match.","Good sources of clients: other preparers who are not CAAs, immigration attorneys, community groups, international student offices.","These are working suggestions, not IRS rules."]}
];
function cjS(){const s=S.set.cj=S.set.cj||{};s.t=s.t||{};s.y=s.y||{};return s}
function cjYear(){return new Date().getFullYear()}
function cjStepDone(i){const s=cjS();return CJOB[i].c.every((_,k)=>s.t[i+"-"+k])}
function cjHomeHtml(){try{if(PARTS[part].x!=="caa")return"";const s=cjS(),y=s.y[cjYear()]||0,done=CJOB.filter((_,i)=>cjStepDone(i)).length,any=Object.keys(s.t).length;
  return `<section class="section cjh"><h3 style="margin:0">CAA on the job</h3><div class="small muted">You passed the training. This is the working side: one checklist per client, and a desk reference.</div>
   <div class="cjgrid"><button class="cjb" data-cj="open"><b>📋 Client checklist</b><span>${any?`This client: step ${Math.min(done+1,CJOB.length)} of ${CJOB.length}`:"Ten steps from first call to closed file"}</span></button><button class="cjb" data-cj="ref"><b>📎 Desk reference</b><span>What you may certify, notices, timelines, yearly duties</span></button></div>
   <div class="cjyr${y>=5?" ok":""}"><span><b>${y}</b> of the 5 Forms W-7 required in ${cjYear()}</span><span><button class="btn small" data-cj="ym" aria-label="One fewer">−</button><button class="btn small" data-cj="yp" aria-label="One more">+</button></span></div></section>`}catch(_){return""}}
function renderCaaJob(){const e=esc,s=cjS();let h="";
  if(cjv==="ref"){h=`<section class="section"><div class="sesshead"><div><h2>CAA desk reference</h2><div class="small muted">Checked against IRS.gov on Nov 22, 2026. The IRS pages below are the final word.</div></div></div>
    ${CJREF.map(c=>`<div class="card slide"><h3 style="margin:0">${e(c.h)}</h3>${c.b?`<ul class="clist">${c.b.map(x=>`<li>${e(x)}</li>`).join("")}</ul>`:""}${c.v?visHtml(c.v):""}${c.ex?`<div class="cex">${e(c.ex)}</div>`:""}</div>`).join("")}
    <div class="card"><b>Official pages</b><div class="nlinks">${Object.values(CJL).map(l=>`<div class="nlink"><a href="${l[1]}" target="_blank" rel="noopener">🔗 ${e(l[0])}</a><button class="btn small" data-cp="${l[1]}">Copy link</button></div>`).join("")}</div></div>
    <button class="btn" data-cj="open" style="margin-top:10px;width:100%">📋 Open the client checklist</button></section>`}
  else{const now=CJOB.findIndex((_,i)=>!cjStepDone(i)),done=CJOB.filter((_,i)=>cjStepDone(i)).length,all=now<0;
    h=`<section class="section"><div class="sesshead"><div><h2>W-7 client checklist</h2><div class="small muted">${done} of ${CJOB.length} steps done for this client. Nothing about the client is stored, only the ticks.</div></div></div><div class="cbar"><i style="width:${Math.round(done/CJOB.length*100)}%"></i></div>
    ${all?`<div class="cfb ok"><b>✓ This client is complete.</b> Count it toward the year and start the next one.</div><button class="btn pri pcert" data-cj="finish">Count this W-7 and start a new client</button>`:""}
    <div class="npath">${CJOB.map((st,i)=>{const ok=cjStepDone(i),op=OPEN["cj"+i]!==undefined?OPEN["cj"+i]:i===now;return `<div class="cjstep${ok?" done":""}${i===now?" now":""}"><details class="more nsd" id="cj${i}" ${op?"open":""}><summary><b>${ok?"✅ ":""}${i+1}. ${e(st.t)}</b>${i===now?`<span class="nnow">do this now</span>`:""}</summary>
       <div class="small muted">${e(st.why)}</div>
       ${st.c.map((c,k)=>`<button class="cjtick${s.t[i+"-"+k]?" on":""}" data-cj="tick" data-i="${i}" data-k="${k}" aria-pressed="${!!s.t[i+"-"+k]}"><span>${s.t[i+"-"+k]?"☑":"☐"}</span><span>${e(c)}</span></button>`).join("")}
       ${st.say?`<div class="cex"><b>Say to the client:</b> ${e(st.say)}</div>`:""}
       ${st.l?`<div class="nlinks">${st.l.map(k=>`<div class="nlink"><a href="${CJL[k][1]}" target="_blank" rel="noopener">🔗 ${e(CJL[k][0])}</a><button class="btn small" data-cp="${CJL[k][1]}">Copy link</button></div>`).join("")}</div>`:""}</details></div>`}).join("")}</div>
    <div class="row cnav"><button class="btn" data-cj="ref">📎 Desk reference</button><button class="btn" data-cj="new">Start a new client (clear the ticks)</button></div></section>`}
  $("#view").innerHTML=h}
let cjv="list";
function cjClick(d){const s=cjS(),a=d.cj;
  if(a==="open"){cjv="list";view="caajob";render();window.scrollTo(0,0);return true}
  if(a==="ref"){cjv="ref";view="caajob";render();window.scrollTo(0,0);return true}
  if(a==="tick"){const k=d.i+"-"+d.k,was=cjStepDone(+d.i);if(s.t[k])delete s.t[k];else s.t[k]=1;if(!was&&cjStepDone(+d.i)){Object.keys(OPEN).forEach(x=>{if(/^cj\d/.test(x))delete OPEN[x]})}persist();render();return true}
  if(a==="new"){if(d.sure||!Object.keys(s.t).length){s.t={};Object.keys(OPEN).forEach(x=>{if(/^cj\d/.test(x))delete OPEN[x]});persist();render();window.scrollTo(0,0)}else{const b=document.querySelector('[data-cj="new"]');if(b){b.dataset.sure="1";b.textContent="Tap again to clear the ticks";b.classList.add("pri")}}return true}
  if(a==="finish"){s.y[cjYear()]=(s.y[cjYear()]||0)+1;s.t={};Object.keys(OPEN).forEach(x=>{if(/^cj\d/.test(x))delete OPEN[x]});persist();render();window.scrollTo(0,0);return true}
  if(a==="yp"||a==="ym"){const y=cjYear();s.y[y]=Math.max(0,(s.y[y]||0)+(a==="yp"?1:-1));persist();render();return true}
  if(a==="refresh"){s.ref=Date.now();persist();const f0=filt,q0=qdOver;filt="all";qdOver=10;try{startSession("quiz",10)}finally{filt=f0;qdOver=q0}return true}
  return true}
const cjExtraView0=extraView;extraView=function(){if(view==="caajob"){renderCaaJob();return true}return cjExtraView0()};
const cjExtraClick0=extraClick;extraClick=function(b){if(b.dataset.cj!==undefined)return cjClick(b.dataset);return cjExtraClick0(b)};
/* the CAA main page: the job comes first; the red button is a short refresher every 14 days, otherwise the client checklist */
const cjDoNext0=doNextHtml;doNextHtml=function(){try{if(PARTS[part].x!=="caa")return cjDoNext0();const s=cjS(),stale=!s.ref||Date.now()-s.ref>14*864e5,any=Object.keys(s.t).length;
  const btn=stale?`<button class="donext" data-cj="refresh"><span class="dn1">👉 DO THIS NEXT</span><b>Refresher · 10 quick questions</b><span class="dn2">${s.ref?"Two weeks since the last one.":"Keep the rules fresh."} Mixed topics, about 4 minutes.</span><span class="dn3">Tap here ▶</span></button>`
    :`<button class="donext" data-cj="open"><span class="dn1">👉 ${any?"CONTINUE":"READY FOR A CLIENT"}</span><b>${any?"Client checklist · pick up where you stopped":"Open the W-7 client checklist"}</b><span class="dn2">Ten steps from the first call to the closed file, with the IRS links.</span><span class="dn3">Tap here ▶</span></button>`;
  return btn+cjHomeHtml()}catch(_){return cjDoNext0()}};

/* the CAA main page has no exam: drop the exam-date and readiness card and the mock exam row */
const cjRenderHome0=renderHome;renderHome=function(){cjRenderHome0();try{if(PARTS[part].x!=="caa")return;const v=document.getElementById("view");[...v.querySelectorAll(":scope > section.section")].forEach(x=>{if(/ready\s*·\s*goal/.test(x.textContent)&&!x.classList.contains("xp")&&!x.classList.contains("cjh"))x.remove()});const m=v.querySelector('.xp [data-xp="mock"]');if(m)m.remove()}catch(_){}};
