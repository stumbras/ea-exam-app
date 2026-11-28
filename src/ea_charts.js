/* EA Part 2 and Part 3 "Key charts": one-screen visual summaries of the facts the exam asks most. Tax law as of 2025 (the 2026-2027 exam window). */
(function(){
const css=`<style>.ec{font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#13202e;padding:14px;max-width:760px;margin:0 auto}.ec h2{font-size:1.15rem;margin:22px 0 8px}.ec h2:first-child{margin-top:4px}
.ec .ectl{position:relative;margin:6px 0 6px 10px;padding-left:22px;border-left:4px solid #c9d6e3}.ec .ecst{position:relative;margin:0 0 14px;display:block;width:auto}.ec .ecst:before{content:"";position:absolute;left:-33px;top:2px;width:18px;height:18px;border-radius:50%;background:var(--c,#1d4e89);border:3px solid #fff;box-shadow:0 0 0 2px var(--c,#1d4e89)}
.ec .ecst b{display:block}.ec .ecdd{display:inline-block;margin-top:3px;padding:2px 9px;border-radius:999px;background:var(--c,#1d4e89);color:#fff;font-weight:800;font-size:.82rem}
.ec table{width:100%;border-collapse:collapse;font-size:.88rem;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)}.ec th{background:#132c48;color:#fff;text-align:left;padding:8px}.ec td{padding:8px;border-top:1px solid #e3e9f0;vertical-align:top}.ec tr:nth-child(even) td{background:#f6f9fc}
.ec .tw{overflow-x:auto}.ec .eccards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.ec .eccd{background:#fff;border-radius:12px;padding:10px 12px;box-shadow:0 1px 4px rgba(0,0,0,.08);border-top:5px solid var(--c,#1d4e89)}.ec .eccd .n{font-size:1.35rem;font-weight:900;color:var(--c,#1d4e89)}.ec .ecents{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}.ec .ecent{background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden}.ec .ecet{background:#132c48;color:#fff;font-weight:800;padding:8px 12px}.ec .ecer{display:flex;gap:10px;padding:6px 12px;border-top:1px solid #e3e9f0;font-size:.88rem}.ec .ecer span{flex:none;width:80px;color:#55657a}.ec .ecnote{font-size:.8rem;color:#55657a;margin-top:6px}</style>`;
const st=(c,t,d,dd)=>`<div class="ecst" style="--c:${c}"><b>${t}</b>${d}${dd?`<br><span class="ecdd">${dd}</span>`:""}</div>`;
const cd=(c,n,t)=>`<div class="eccd" style="--c:${c}"><div class="n">${n}</div>${t}</div>`;
const P3=`<div class="ec">
<h2>From audit to levy: the clock at each step</h2><div class="ectl">
${st("#1d4e89","Examination (audit)","Correspondence, office or field exam. The examiner proposes changes.","")}
${st("#1d4e89","30-day letter","Agree and pay, or file a protest and ask for Appeals.","30 days to respond")}
${st("#7a2e4a","90-day letter (Statutory Notice of Deficiency)","The taxpayer's ticket to Tax Court without paying first.","90 days to petition Tax Court · 150 if addressed outside the U.S.")}
${st("#a0521a","Assessment","The tax is recorded on the account. The collection clock starts.","10 years to collect (CSED)")}
${st("#a0521a","Notice and demand for payment","The first bill after assessment.","")}
${st("#b3202a","Final notice of intent to levy + right to a CDP hearing","Request the Collection Due Process hearing on Form 12153.","30 days to request CDP · equivalent hearing up to 1 year")}
${st("#b3202a","After the CDP determination","Disagree with Appeals' CDP decision: petition Tax Court.","30 days to petition")}
${st("#444","Levy","Wages, bank accounts and other property can be seized.","")}</div>
<h2>Statutes of limitation</h2><div class="eccards">
${cd("#1d4e89","3 yrs","to assess: from the later of the due date or the filing date (ASED)")}
${cd("#1d4e89","6 yrs","to assess when more than 25% of gross income was left off")}
${cd("#b3202a","No limit","to assess for fraud or when no return was filed")}
${cd("#a0521a","10 yrs","to collect, from the date of assessment (CSED)")}
${cd("#127A68","3 or 2 yrs","to claim a refund: 3 years from filing or 2 years from payment, whichever is later")}</div>
<h2>Forms you must know</h2><div class="tw"><table><tr><th>Form</th><th>What it does</th></tr>
<tr><td><b>2848</b></td><td>Power of attorney: lets an EA, CPA or attorney represent the taxpayer</td></tr>
<tr><td><b>8821</b></td><td>Tax information authorization: lets someone see records, but not represent</td></tr>
<tr><td><b>56</b></td><td>Notice of a fiduciary relationship (executor, trustee, guardian)</td></tr>
<tr><td><b>12153</b></td><td>Request a Collection Due Process or equivalent hearing</td></tr>
<tr><td><b>9423</b></td><td>Collection Appeal Request (Collection Appeals Program, CAP)</td></tr>
<tr><td><b>9465</b></td><td>Installment agreement request</td></tr>
<tr><td><b>656</b></td><td>Offer in compromise</td></tr>
<tr><td><b>433-A / 433-B / 433-F</b></td><td>Collection information statements (individual, business, short form)</td></tr>
<tr><td><b>843</b></td><td>Claim for refund and request for abatement (for example, of penalties)</td></tr>
<tr><td><b>8857</b></td><td>Request for innocent spouse relief</td></tr>
<tr><td><b>911</b></td><td>Request for Taxpayer Advocate Service help</td></tr>
<tr><td><b>8554</b></td><td>Renewal of enrollment for enrolled agents</td></tr></table></div>
<h2>Keeping your EA card</h2><div class="eccards">
${cd("#5b3fb0","72 hrs","of continuing education every 3-year enrollment cycle")}
${cd("#5b3fb0","16 hrs","minimum each year, including 2 hours of ethics")}
${cd("#5b3fb0","Every year","renew your PTIN")}</div>
<div class="ecnote">Practice summaries by Solving Life LLC. Check details in Circular 230, the Internal Revenue Code and IRS publications.</div></div>`;
const P2=`<div class="ec">
<h2>Business returns: forms and due dates (calendar year)</h2><div class="ecents"><div class="ecent"><div class="ecet">Sole proprietor</div><div class="ecer"><span>Return</span><b>Schedule C (with 1040)</b></div><div class="ecer"><span>Due</span><b>April 15</b></div><div class="ecer"><span>Extension</span><b>4868 → Oct 15</b></div><div class="ecer"><span>Tax paid by</span><b>Owner: income tax plus self-employment tax</b></div></div><div class="ecent"><div class="ecet">Partnership / multi-member LLC</div><div class="ecer"><span>Return</span><b>1065 + K-1s</b></div><div class="ecer"><span>Due</span><b>March 15</b></div><div class="ecer"><span>Extension</span><b>7004 → Sept 15</b></div><div class="ecer"><span>Tax paid by</span><b>Partners, on their own returns</b></div></div><div class="ecent"><div class="ecet">S corporation</div><div class="ecer"><span>Return</span><b>1120-S + K-1s</b></div><div class="ecer"><span>Due</span><b>March 15</b></div><div class="ecer"><span>Extension</span><b>7004 → Sept 15</b></div><div class="ecer"><span>Tax paid by</span><b>Shareholders (election on Form 2553)</b></div></div><div class="ecent"><div class="ecet">C corporation</div><div class="ecer"><span>Return</span><b>1120</b></div><div class="ecer"><span>Due</span><b>April 15</b></div><div class="ecer"><span>Extension</span><b>7004 → Oct 15</b></div><div class="ecer"><span>Tax paid by</span><b>The corporation, flat 21%</b></div></div><div class="ecent"><div class="ecet">Trust or estate</div><div class="ecer"><span>Return</span><b>1041 + K-1s</b></div><div class="ecer"><span>Due</span><b>April 15</b></div><div class="ecer"><span>Extension</span><b>7004 → Sept 30 (5½ months)</b></div><div class="ecer"><span>Tax paid by</span><b>Entity on income kept; beneficiaries on income distributed</b></div></div><div class="ecent"><div class="ecet">Exempt organization</div><div class="ecer"><span>Return</span><b>990 family</b></div><div class="ecer"><span>Due</span><b>May 15 (15th day of 5th month)</b></div><div class="ecer"><span>Extension</span><b>8868 → Nov 15</b></div><div class="ecer"><span>Tax paid by</span><b>Generally none (tax on unrelated business income: 990-T)</b></div></div><div class="ecent"><div class="ecet">Estate tax</div><div class="ecer"><span>Return</span><b>706</b></div><div class="ecer"><span>Due</span><b>9 months after death</b></div><div class="ecer"><span>Extension</span><b>4768 → 6 more months</b></div><div class="ecer"><span>Tax paid by</span><b>The estate</b></div></div></div>
<h2>S corporation rules at a glance</h2><div class="eccards">
${cd("#2a7d4f","100","shareholders at most (family members can count as one)")}
${cd("#2a7d4f","1 class","of stock (differences in voting rights alone are allowed)")}
${cd("#2a7d4f","Who","U.S. citizens or residents, estates and certain trusts. No partnerships, corporations or nonresident aliens")}
${cd("#2a7d4f","Pay","shareholder-employees must take reasonable wages before distributions")}</div>
<h2>Depreciation for property placed in service in 2025</h2><div class="eccards">
${cd("#a0521a","$2,500,000","Section 179 limit, phased out dollar for dollar above $4,000,000 of property (OBBBA)")}
${cd("#a0521a","100%","bonus depreciation for property acquired after January 19, 2025 (40% if acquired before that date)")}
${cd("#a0521a","$31,300","Section 179 cap for heavy SUVs (2025)")}
${cd("#1d4e89","Taxable income","limit: Section 179 can't exceed active business income; the excess carries forward")}</div>
<h2>MACRS recovery periods and conventions</h2><div class="tw"><table><tr><th>Property</th><th>Recovery period</th><th>Method</th></tr>
<tr><td>Cars, light trucks, computers</td><td>5 years</td><td>200% declining balance</td></tr>
<tr><td>Office furniture and equipment</td><td>7 years</td><td>200% declining balance</td></tr>
<tr><td>Residential rental buildings</td><td>27.5 years</td><td>Straight line, mid-month</td></tr>
<tr><td>Nonresidential real property</td><td>39 years</td><td>Straight line, mid-month</td></tr>
<tr><td>Land</td><td>Never depreciated</td><td>None</td></tr></table></div>
<div class="ecnote">Half-year convention unless more than 40% of the year's personal property (not counting real property) is placed in service in the last quarter: then mid-quarter. Practice summaries by Solving Life LLC; check IRS Publication 946 and the instructions for each form.</div></div>`;
window.eaCharts=function(pt){const o=document.createElement("div");o.id="eachartov";o.style.cssText="position:fixed;inset:0;z-index:99990;background:#eef3f8;overflow:auto;-webkit-overflow-scrolling:touch";
  o.innerHTML=`<div style="position:sticky;top:0;padding:10px 12px;background:#132c48;z-index:1"><button type="button" style="font:700 15px system-ui;padding:10px 16px;border-radius:999px;border:0;background:#fff;color:#132c48;cursor:pointer">‹ Back to Part ${pt}</button></div>`+css+(pt==3?P3:P2);
  o.querySelector("button").addEventListener("click",()=>o.remove());document.body.appendChild(o)};
window.eaChartCard=function(){try{if(typeof part==="undefined"||![2,3].includes(+part)||view!=="home")return;const v=document.getElementById("view");if(!v||document.getElementById("eachartcard"))return;
  const el=document.createElement("section");el.id="eachartcard";el.className="section";
  el.innerHTML=`<button type="button" style="display:flex;gap:12px;align-items:center;width:100%;text-align:left;border:0;border-radius:16px;padding:14px 16px;background:linear-gradient(135deg,#132c48,#1d4e89);color:#fff;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.15)"><span style="font-size:28px">📊</span><span><b style="font-size:1.02rem">Key charts for Part ${part}</b><br><span style="font-size:.86rem;opacity:.9">${part==3?"Audit-to-levy timeline, statutes of limitation, forms, EA renewal":"Business return due dates, S corp rules, 2025 depreciation, MACRS"} on one screen</span></span></button>`;
  el.querySelector("button").addEventListener("click",()=>eaCharts(+part));const f=v.querySelector(".section:not(#slsupport)");v.insertBefore(el,f?f.nextSibling:v.firstChild)}catch(_){}};
})();
