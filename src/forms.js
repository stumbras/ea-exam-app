/* ===== Real IRS forms, every field tappable (Version 172) =====
   Asked for: "every taxpayer should know every field of 1040 ... actual interactive 1040 ... as real as possible" and "every form
   mentioned in EA or bookkeeping should be clickable and real form with all fields explained would come up".
   What this is:
   - pwa/forms/ holds the actual pages of 227 IRS forms (downloaded from IRS.gov/pub/irs-pdf on Nov 22, 2026 by mk_forms.py), and for
     each form the list of its fillable boxes with the IRS's own description of each box (the accessibility text inside the PDF).
     Annual forms are the 2025 versions, to match the 2025 Form 1040 and the law the exam tests; Forms W-4, W-4P, W-4R and 1040-ES are
     the 2026 versions because they are filled in during 2026.
   - Any form name in a lesson, question, explanation or fact becomes a link that opens that form.
   - Form 1040 also has a plain explanation written for every box (F40X below), "Fill it in" practice on the real form with three
     taxpayers, and "Find the line".
   - For every other form a tapped box shows the IRS wording plus the course facts that match it; those matches are labelled as
     related, because they are found by word overlap, not written for the box. */
let fv=null;const FCACHE={},FREV={};
Object.keys(FORMNAME).forEach(n=>{const k=FORMNAME[n];if(!FREV[k]||n.length<FREV[k].length)FREV[k]=n});
Object.keys(FORMIDX).forEach(k=>{if(!FREV[k]){const m=/((?:Form|Schedule) [A-Za-z0-9-]+(?: \(Form [0-9A-Z-]+\))?)/.exec(FORMIDX[k][0]);FREV[k]=m?m[1]:k}});
function fvName(k){return FREV[k]||k}
function fvClean(t){return String(t||"").replace(/\b(?:[A-Z] ){1,6}[A-Z]\b/g,m=>m.replace(/ /g,"")).replace(/^Page \d+\.\s*/,"")}
function fvZoom0(){return Math.max(1,Math.min(2.6,860/Math.max(320,Math.min(window.innerWidth,900))))}
function formOpen(k,opt){if(!FORMIDX[k])return false;const st=view==="form"&&fv&&fv.k&&fv.k!==k?(fv.stack||[]).concat([{k:fv.k,pg:fv.pg,tab:fv.tab}]):(view==="form"&&fv&&fv.stack?fv.stack:[]);fv=Object.assign({stack:st,k,pg:0,sel:-1,z:fvZoom0(),tab:"form",back:view==="form"&&fv?fv.back:view,by:view==="form"&&fv?fv.by:window.scrollY},opt||{});view="form";render();window.scrollTo(0,0);formLoad(k);return true}
function formLib(){fv={lib:true,back:view==="form"&&fv?fv.back:view,by:window.scrollY};view="form";render();window.scrollTo(0,0)}
async function formLoad(k){if(FCACHE[k])return;try{const r=await fetch("forms/"+k+".json");if(!r.ok)throw 0;FCACHE[k]=await r.json()}catch(e){FCACHE[k]={err:1}}if(view==="form"&&fv&&fv.k===k)render()}
function formBack(){const b=fv||{};if(b.stack&&b.stack.length&&b.k){const p=b.stack.pop();Object.assign(fv,{k:p.k,pg:p.pg,tab:p.tab,sel:-1,res:null,rep:null});render();window.scrollTo(0,0);formLoad(p.k);return}view=b.back&&b.back!=="form"?b.back:"home";fv=null;render();window.scrollTo(0,b.by||0)}

/* ---------- course facts that mention a form, or match a box ---------- */
let FVTOK=null;
const FVSTOP=new Set("the a an of to and or in on for from if is are was were be you your this that with by as at not it its see here enter check line lines form forms schedule amount total add subtract instructions inst attach page part any all than more less also only do does have has".split(" "));
function fvWords(t){return (String(t).toLowerCase().match(/[a-z][a-z-]{2,}|\d{3,5}[a-z-]*/g)||[]).filter(w=>!FVSTOP.has(w))}
function fvIndex(){if(FVTOK)return FVTOK;const df={},L=[];BANK.forEach(i=>{if(i.t!=="f"||i.p>4)return;const w=new Set(fvWords(i.f+" "+i.b));L.push([i,w]);w.forEach(x=>{df[x]=(df[x]||0)+1})});return FVTOK={L,df,n:L.length}}
function fvRelated(label,k){try{const X=fvIndex(),tail=String(label).split(/\.\s+/).slice(-2).join(". "),q=[...new Set(fvWords(fvClean(tail)))];if(q.length<2)return[];
  const idf=w=>Math.log(1+X.n/(1+(X.df[w]||0))),tot=q.reduce((s,w)=>s+idf(w),0),out=[];
  for(const [i,w] of X.L){let s=0,m=0;for(const x of q)if(w.has(x)){s+=idf(x);m++}if(m>=2&&s/tot>=0.62)out.push([s/tot+(i.p==part?0.05:0),i])}
  return out.sort((a,b)=>b[0]-a[0]).slice(0,2).map(x=>x[1])}catch(e){return[]}}
function fvAbout(k){try{const n=fvName(k).replace(/ \(Form.*$/,""),q=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),re=new RegExp("(^|[^A-Za-z0-9-])"+(/^Form \d+$/.test(n)?q.replace(/^Form /,"Forms? "):/^Form /.test(n)?q.replace(/^Form /,"(?:Forms? )?"):q)+"(?![A-Za-z0-9]|-[A-Z0-9])");
  return BANK.filter(i=>i.t==="f"&&i.p<=4&&re.test(i.f+" "+i.b)).sort((a,b)=>(a.p==part?0:1)-(b.p==part?0:1)).slice(0,6)}catch(e){return[]}}

/* ---------- Form 1040 (2025): a plain explanation for every box, keyed by the box's position in the IRS file ---------- */
const F40X={};
(function(){const X=(r,t)=>{String(r).split(",").forEach(p=>{const a=p.split("-").map(Number);for(let i=a[0];i<=(a[1]===undefined?a[0]:a[1]);i++)F40X[i]=t})};
X("0-2","Only for a fiscal-year taxpayer. Almost everyone files for the calendar year and leaves these blank.");
X(3,"Checked when an election is being made late under the automatic extension in Regulations section 301.9100-2. Rare.");
X("4-5","Service in a combat zone extends the deadlines to file and pay. Check it and name the zone.");
X("6-12","Checked when the taxpayer or spouse died; enter the date of death. A final return is still due, signed by the surviving spouse or the personal representative.");
X("13-16","Other special situations the instructions tell you to mark here.");
X("17-18","The name must match the Social Security card. A mismatch is one of the most common reasons an e-filed return is rejected.");
X(19,"The taxpayer's Social Security number. A person who cannot get an SSN uses an ITIN (applied for on Form W-7).");
X("20-22","Spouse's name and SSN on a joint return. A married-filing-separately filer also enters the spouse's SSN here.");
X("23-27","Where the IRS mails notices and paper refunds. Use a P.O. box only if mail is not delivered to the home. If the taxpayer moves later, Form 8822 updates it.");
X("28-30","Only for a foreign address. Enter the city above and the country, province and postal code here.");
X(31,"New on the 2025 form. Checked when the main home was in the United States for more than half the year; some refundable credits, such as the earned income credit, require it.");
X("32-33","$3 to the Presidential Election Campaign Fund. It does not change the tax or the refund.");
X(34,"Single: unmarried or legally separated on December 31 and no other status fits.");
X(35,"Married filing jointly: married on December 31 (or spouse died during the year). Both report all income and both are liable for the whole tax.");
X(36,"Married filing separately: each spouse reports only their own income. Many credits are lost or cut, and if one spouse itemizes the other must too.");
X(37,"A married-filing-separately filer writes the spouse's full name here.");
X(38,"Head of household: unmarried (or considered unmarried), paid more than half the cost of the home, and a qualifying person lived there more than half the year. A dependent parent need not live with the taxpayer.");
X(39,"Qualifying surviving spouse: for the two years after the year the spouse died, with a dependent child at home. It gives the joint-return rates and standard deduction.");
X(40,"Head of household or qualifying surviving spouse whose qualifying child is not a dependent (for example, the child's exemption was released to the other parent on Form 8332): name the child here.");
X("41-42","Election to treat a nonresident or dual-status spouse as a U.S. resident for the whole year so the couple can file jointly. Their worldwide income then becomes taxable.");
X("43-44","Everyone must answer Yes or No. Yes if digital assets (crypto, NFTs) were received as pay or a reward, or sold, exchanged or otherwise disposed of. Only buying and holding is No.");
X(45,"More than four dependents: check here and attach a statement with the same details.");
X("46-53","A dependent is a qualifying child or a qualifying relative. Use the name exactly as on the Social Security card.");
X("54-57","The dependent's SSN. The child tax credit requires an SSN valid for work issued before the due date of the return; an ITIN or ATIN can still support the $500 credit for other dependents.");
X("58-61","Relationship to the taxpayer: son, daughter, grandchild, parent, niece and so on.");
X("62-69","A qualifying child must have lived with the taxpayer more than half the year. Box (b) says that home was in the United States.");
X("70-77","A full-time student counts as a qualifying child until age 24. A permanently and totally disabled child qualifies at any age.");
X("78,80,82,84","Child tax credit: under 17 at the end of 2025, with a valid SSN. Up to $2,200 per child for 2025; the amount goes on line 19 through Schedule 8812.");
X("79,81,83,85","Credit for other dependents: $500, not refundable, for a dependent who does not qualify for the child tax credit (age 17 or older, or no SSN).");
X(86,"New on the 2025 form. A married person who lived apart from the spouse for the last 6 months (or is legally separated) is treated as unmarried for certain credits, such as the earned income credit when filing separately.");
X(87,"Wages from box 1 of every Form W-2, added together. Box 1 already leaves out pre-tax items such as 401(k) deferrals.");
X(88,"Wages a household worker (nanny, housekeeper) was paid when no W-2 was issued because the pay was under the reporting threshold. Still taxable.");
X(89,"Tips that were not reported to the employer and so are not in W-2 box 1. Social Security and Medicare tax on them is figured on Form 4137.");
X(90,"Medicaid waiver payments for caring for someone in your own home. They can be excluded from income, but may be counted as earned income for the earned income credit.");
X(91,"Employer dependent care benefits above what can be excluded, from Form 2441.");
X(92,"The taxable part of employer-provided adoption benefits, from Form 8839.");
X(93,"Wages of a worker treated as an independent contractor who was really an employee. Form 8919 also figures the worker's share of Social Security and Medicare tax.");
X("94-95","Earned income not on a W-2 and not on the lines above, for example a disability pension received before minimum retirement age. Name the type and enter the amount.");
X(96,"Combat pay is not taxed, but a taxpayer may elect to count it as earned income if that gives a larger earned income credit. The amount here is not added to income.");
X(97,"Total of lines 1a through 1h: all wage-type income.");
X(98,"Interest that is not taxed, mostly from state and local (municipal) bonds, Form 1099-INT box 8. It is not added to income, but it counts when figuring how much Social Security is taxable.");
X(99,"Taxable interest: Form 1099-INT box 1 and box 3. Schedule B is required when taxable interest is over $1,500.");
X(100,"Qualified dividends, Form 1099-DIV box 1b. They are already inside line 3b; they are shown separately because they are taxed at the lower capital gain rates (0%, 15%, 20%).");
X(101,"All ordinary dividends, Form 1099-DIV box 1a. Schedule B is required when they are over $1,500.");
X("102-103","Checked when a child's dividends are reported on the parent's return with Form 8814 instead of the child filing.");
X(104,"Total taken out of traditional, SEP, SIMPLE and Roth IRAs, Form 1099-R box 1.");
X(105,"The taxable part of line 4a. A rollover or a qualified charitable distribution is not taxable; a traditional IRA with nondeductible contributions is partly taxable (Form 8606).");
X("106-109","Says why line 4b is less than 4a: a rollover (moved to another plan within 60 days), a QCD (paid from the IRA straight to charity, age 70½ or older), or another reason.");
X(110,"Total pension and annuity payments, Form 1099-R box 1.");
X(111,"The taxable part, usually Form 1099-R box 2a. If the employee paid in after-tax money, part of each payment is a tax-free return of that cost.");
X("112-115","Says why 5b is less than 5a: a rollover, PSO (a retired public safety officer who paid insurance premiums from the pension, up to $3,000 excluded), or another reason.");
X(116,"Net Social Security benefits, Form SSA-1099 box 5.");
X(117,"The taxable part, from the worksheet: none, up to 50%, or up to 85%, depending on other income plus half the benefits. Never more than 85%.");
X(118,"A lump sum covering earlier years may be taxed as if received in those years, when that gives less tax.");
X(119,"A married-filing-separately filer who lived with the spouse at any time in the year has a base amount of zero, so up to 85% is taxable. Checked here means they lived apart all year and get the single base amount.");
X(120,"Net capital gain or loss from Schedule D. A net loss is limited to $3,000 a year ($1,500 married filing separately); the rest carries forward.");
X("121-123","Schedule D is not required when the only capital gains are capital gain distributions (Form 1099-DIV box 2a) and there are no sales to report. The second box is for a child's gain reported on Form 8814.");
X(124,"Everything from Schedule 1, Part I: business income (Schedule C), rental and K-1 income (Schedule E), unemployment, taxable state refunds, gambling winnings and other income.");
X(125,"Total income: every income line added together.");
X(126,"Adjustments from Schedule 1, Part II (above-the-line deductions): half of self-employment tax, self-employed health insurance, HSA, IRA, student loan interest, educator expenses and others.");
X(127,"Adjusted gross income (AGI). Many limits and phase-outs are measured against this number.");
X(128,"AGI again, carried from line 11a at the bottom of page 1.");
X("129-130","If someone else can claim the taxpayer (or spouse) as a dependent, the standard deduction is limited: for 2025 the greater of $1,350 or earned income plus $450, not more than the normal amount.");
X(131,"Married filing separately and the spouse itemizes: this taxpayer must itemize too. The standard deduction is zero.");
X(132,"A dual-status alien (resident for part of the year, nonresident for the rest) generally cannot take the standard deduction.");
X("133-136","Age 65 or older (born before January 2, 1961) or blind adds to the standard deduction for each box checked: $2,000 if single or head of household, $1,600 if married, for 2025.");
X(137,"The standard deduction (2025: $15,750 single or married filing separately, $31,500 joint or qualifying surviving spouse, $23,625 head of household) or itemized deductions from Schedule A, whichever is larger.");
X(138,"Qualified business income deduction: up to 20% of income from a sole proprietorship, partnership or S corporation, limited to 20% of taxable income before this deduction. Form 8995, or 8995-A at higher income.");
X(139,"New for 2025, from Schedule 1-A: the deductions for qualified tips, qualified overtime, car loan interest, and the extra $6,000 for each person 65 or older. Taken whether or not you itemize, and each phases out at higher income.");
X(140,"All deductions below AGI: line 12e plus 13a plus 13b.");
X(141,"Taxable income: AGI minus line 14, never below zero. This is the number the tax is figured on.");
X("142-145","Marks tax that came from a special form: Form 8814 (a child's interest and dividends on the parent's return), Form 4972 (lump-sum distributions), or another.");
X(146,"Income tax on line 15. Under $100,000 use the Tax Table; otherwise the Tax Computation Worksheet. With qualified dividends or capital gains, use the Qualified Dividends and Capital Gain Tax Worksheet.");
X(147,"From Schedule 2, Part I: alternative minimum tax (Form 6251) and repayment of excess advance premium tax credit (Form 8962).");
X(148,"Tax before credits.");
X(149,"Child tax credit (up to $2,200 per child for 2025) and the $500 credit for other dependents, from Schedule 8812. This part can only reduce tax to zero.");
X(150,"Other nonrefundable credits from Schedule 3, Part I: foreign tax credit, child and dependent care credit, education credits, retirement savings credit, energy credits.");
X(151,"All nonrefundable credits.");
X(152,"Tax after nonrefundable credits. It cannot go below zero; that is what nonrefundable means.");
X(153,"Other taxes from Schedule 2, Part II: self-employment tax, Additional Medicare Tax, net investment income tax, the 10% additional tax on early retirement distributions, household employment taxes.");
X(154,"Total tax for the year. Everything below this line is about how it was paid.");
X(155,"Federal income tax withheld, box 2 of each Form W-2. Not box 4 or box 6; those are Social Security and Medicare tax.");
X(156,"Federal income tax withheld shown in box 4 of Forms 1099 (backup withholding, or withholding on retirement payments on Form 1099-R).");
X(157,"Withholding from other forms, such as Form W-2G (gambling) or Additional Medicare Tax withholding from Form 8959.");
X(158,"All federal income tax withheld.");
X(159,"The four quarterly estimated payments (Form 1040-ES) plus any 2024 refund that was applied to 2025.");
X(160,"If estimated payments were made jointly with a former spouse, enter that person's SSN so the IRS can find the payments.");
X(161,"Earned income credit: refundable, for workers with low to moderate earned income. The amount depends on earned income, AGI and the number of qualifying children. A paid preparer must complete Form 8867.");
X(162,"New on the 2025 form: for clergy who file Schedule SE.");
X(163,"Check to opt out of the earned income credit.");
X("164-165","Additional child tax credit: the refundable part of the child tax credit, up to $1,700 per child for 2025, from Schedule 8812. The box opts out of it.");
X(166,"The refundable 40% of the American opportunity credit, up to $1,000 per student. The nonrefundable part goes through Schedule 3 to line 20.");
X(167,"New for 2025: part of the adoption credit (up to $5,000) is refundable.");
X(168,"From Schedule 3, Part II: net premium tax credit, the amount paid with an extension (Form 4868), and excess Social Security tax withheld by two or more employers.");
X(169,"All refundable credits and other payments.");
X(170,"Total payments: withholding, estimated payments and refundable credits.");
X(171,"Overpayment: payments are more than total tax.");
X(172,"Check when Form 8888 is attached to split the refund among up to three accounts.");
X(173,"The part of the overpayment to be refunded.");
X("174-177","Direct deposit: a 9-digit routing number, checking or savings, and the account number. A wrong digit can send the refund to someone else, so read it back to the client.");
X(178,"The part of the overpayment applied to next year's estimated tax. It counts as paid on the due date of the return.");
X(179,"Balance due: total tax is more than payments. Due by April 15, 2026 even if the return is on extension; an extension gives more time to file, not to pay.");
X(180,"Penalty for underpaying estimated tax during the year, figured on Form 2210. It is added to the amount owed or taken out of the refund.");
X("181-185","Lets the IRS talk to the named person about how this return was processed, until the due date of next year's return. It is not a power of attorney; representing the taxpayer takes Form 2848.");
X(186,"The return is signed under penalties of perjury. On a joint return both spouses must sign. A return that is not signed is not a valid return.");
X("187,189","A 6-digit Identity Protection PIN the IRS issues, new each year. If one was issued it must be entered, or the e-filed return is rejected.");
X(188,"Spouse's occupation.");
X("190-191","Optional contact details so the IRS can reach the taxpayer about the return.");
X("192-193","A paid preparer must sign the return and enter a PTIN. Not signing, or not giving the taxpayer a copy, each carries a penalty.");
X(194,"Checked when the paid preparer is self-employed, not an employee of a firm.");
X("195-198","The preparer's firm: name, address, phone and employer identification number.");
})();
const F40L={"1a":87,"1b":88,"1c":89,"1d":90,"1e":91,"1f":92,"1g":93,"1h":95,"1i":96,"1z":97,"2a":98,"2b":99,"3a":100,"3b":101,"4a":104,"4b":105,"5a":110,"5b":111,"6a":116,"6b":117,"7a":120,"8":124,"9":125,"10":126,"11a":127,"11b":128,"12e":137,"13a":138,"13b":139,"14":140,"15":141,"16":146,"17":147,"18":148,"19":149,"20":150,"21":151,"22":152,"23":153,"24":154,"25a":155,"25b":156,"25c":157,"25d":158,"26":159,"27a":161,"28":165,"29":166,"30":167,"31":168,"32":169,"33":170,"34":171,"35a":173,"36":178,"37":179,"38":180};
const F40REV={};Object.keys(F40L).forEach(l=>{F40REV[F40L[l]]=l});
const F40BOX={34:"Single",35:"Married filing jointly",36:"Married filing separately",38:"Head of household",39:"Qualifying surviving spouse",43:"Digital assets: Yes",44:"Digital assets: No",62:"Dependent 1 lived with you: Yes",63:"Dependent 1: and in the U.S.",78:"Dependent 1: child tax credit",79:"Dependent 1: credit for other dependents"};
/* Fill it in: three taxpayers. Tax is from the 2025 Tax Table method (the middle of the $50 row), as on the real table. */
const F40CASES=[
 {id:"c1",t:"Rowan Hale · one job, one bank account",who:"Rowan Hale, 32, single all year, no dependents, nobody can claim Rowan. No digital assets. Standard deduction.",
  docs:[["Form W-2, Plain Works Inc",["Box 1 wages: $45,500","Box 2 federal income tax withheld: $4,000","Box 4 Social Security tax: $2,821","Box 6 Medicare tax: $659.75"]],["Form 1099-INT, Plain Bank",["Box 1 interest income: $250"]],["2025 Tax Table, Single",["Taxable income $30,000 to $30,050: tax $3,365"]]],
  chk:[34,44],v:{"1a":45500,"1z":45500,"2b":250,"9":45750,"11a":45750,"11b":45750,"12e":15750,"14":15750,"15":30000,"16":3365,"18":3365,"22":3365,"24":3365,"25a":4000,"25d":4000,"33":4000,"34":635,"35a":635},
  why:{"1a":"W-2 box 1.","2b":"1099-INT box 1.","9":"$45,500 + $250.","11a":"No adjustments, so AGI equals total income.","12e":"Single, 2025: $15,750.","15":"$45,750 − $15,750.","16":"Tax Table row $30,000 to $30,050, Single.","25a":"W-2 box 2 only. Boxes 4 and 6 are Social Security and Medicare tax and never go here.","34":"$4,000 paid − $3,365 tax."}},
 {id:"c2",t:"Maya Ortiz · head of household, one child",who:"Maya Ortiz, 34, never married. Her son Leo, 8, lived with her in the U.S. all year; she paid all the costs of the home. Leo has a Social Security number. No digital assets. Her income is over the limit for the earned income credit.",
  docs:[["Form W-2, Harbor Dental",["Box 1 wages: $56,000","Box 2 federal income tax withheld: $3,900"]],["2025 Tax Table, Head of household",["Taxable income $32,350 to $32,400: tax $3,545"]],["Schedule 8812",["Child tax credit for Leo: $2,200, all of it used against tax"]]],
  chk:[38,44,62,63,78],v:{"1a":56000,"1z":56000,"9":56000,"11a":56000,"11b":56000,"12e":23625,"14":23625,"15":32375,"16":3545,"18":3545,"19":2200,"21":2200,"22":1345,"24":1345,"25a":3900,"25d":3900,"33":3900,"34":2555,"35a":2555},
  why:{"12e":"Head of household, 2025: $23,625.","15":"$56,000 − $23,625.","16":"Tax Table row $32,350 to $32,400, Head of household.","19":"One child under 17 with an SSN: $2,200 for 2025.","22":"$3,545 − $2,200.","34":"$3,900 paid − $1,345 tax.","28":"Nothing here: the whole $2,200 was used against tax, so no refundable part is left."}},
 {id:"c3",t:"Dana Reyes · self-employed",who:"Dana Reyes, 41, single, no dependents, runs a sole proprietorship. No W-2. No digital assets. Assume no underpayment penalty.",
  docs:[["Schedule C",["Line 31 net profit: $40,000 (goes to Schedule 1, line 3, and Schedule 1, line 10)"]],["Schedule SE",["Line 12 self-employment tax: $5,652 (goes to Schedule 2, line 4, and Schedule 2, line 21)","Line 13 deduction for one-half: $2,826 (goes to Schedule 1, line 15, and Schedule 1, line 26)"]],["Form 8995",["Line 15 qualified business income deduction: $4,285"]],["Form 1040-ES",["Four estimated payments of $1,500: $6,000"]],["2025 Tax Table, Single",["Taxable income $17,100 to $17,150: tax $1,817"]]],
  chk:[34,44],v:{"8":40000,"9":40000,"10":2826,"11a":37174,"11b":37174,"12e":15750,"13a":4285,"14":20035,"15":17139,"16":1817,"18":1817,"22":1817,"23":5652,"24":7469,"26":6000,"33":6000,"37":1469},
  why:{"8":"Schedule 1, line 10: the Schedule C profit.","10":"Schedule 1, line 26: half of the self-employment tax.","11a":"$40,000 − $2,826.","13a":"Form 8995: 20% of the smaller of the business income ($37,174) or taxable income before this deduction ($21,424).","14":"$15,750 + $4,285.","15":"$37,174 − $20,035.","23":"Schedule 2, line 21: self-employment tax. It is added after the credits; it is not income tax.","24":"$1,817 + $5,652.","37":"$7,469 tax − $6,000 paid.","1a":"Nothing here: Dana has no W-2. Business income arrives on line 8."}}];
const F40FIND=[["W-2 box 1, wages",[87]],["W-2 box 2, federal income tax withheld",[155]],["Form 1099-INT box 1, taxable interest",[99]],["Interest from municipal bonds (not taxed)",[98]],["Form 1099-DIV box 1a, ordinary dividends",[101]],["Form 1099-DIV box 1b, qualified dividends",[100]],["Form 1099-R box 1 for an IRA withdrawal",[104]],["Form SSA-1099 box 5, Social Security benefits",[116]],["Schedule C profit reaches the 1040 on this line",[124]],["The deduction for half of self-employment tax reaches the 1040 on this line",[126]],["Self-employment tax reaches the 1040 on this line",[153]],["The standard deduction",[137]],["The qualified business income deduction",[138]],["The new deductions for tips, overtime and seniors (Schedule 1-A)",[139]],["Child tax credit",[149]],["Foreign tax credit and education credits (Schedule 3)",[150]],["Estimated tax payments",[159]],["Earned income credit",[161]],["The refundable part of the American opportunity credit",[166]],["Amount paid with an extension, Form 4868 (through Schedule 3)",[168]],["Taxable income",[141]],["Adjusted gross income",[127,128]],["Total tax",[154]],["The amount you owe",[179]],["Penalty for underpaying estimated tax",[180]],["The paid preparer's PTIN",[193]],["The Identity Protection PIN",[187,189]],["The digital assets question",[43,44]],["Head of household filing status",[38]],["Net capital gain or loss from Schedule D",[120]]];


/* ---------- written explanations for other forms: matched on the IRS wording of the box, first match wins ---------- */
const FXR={
 fw2:[[/VOID/,"Checked by the employer on a form that has an error and must not be processed."],
  [/^a\. Employee's social/,"Must match the Social Security card. If it is wrong the employee asks the employer for a corrected Form W-2c."],
  [/^b\. Employer identification/,"The employer's 9-digit EIN. Tax software asks for it; the IRS uses it to match this W-2 to the return."],
  [/^c\. Employer's name/,"The employer's legal name and address."],[/^d\. Control/,"An internal number the employer's payroll system may add. It is not needed for the tax return."],
  [/^e\. |^f\. /,"The employee's name and address. The name must match the Social Security card; a wrong address does not stop the return from being filed."],
  [/^1\. Wages/,"Taxable wages for income tax. This goes to Form 1040, line 1a. It is often lower than boxes 3 and 5 because pre-tax 401(k) deferrals are left out here."],
  [/^2\. Federal income tax/,"Federal income tax the employer took out of pay. This goes to Form 1040, line 25a."],
  [/^3\. Social security wages/,"Wages subject to Social Security tax, capped at $176,100 for 2025. Never entered on Form 1040."],
  [/^4\. Social security tax/,"6.2% of box 3; at most $10,918.20 for 2025. With two or more employers the total can go over the maximum, and the excess is claimed back on Schedule 3."],
  [/^5\. Medicare wages/,"Wages subject to Medicare tax. There is no cap."],[/^6\. Medicare tax/,"1.45% of box 5, plus 0.9% Additional Medicare Tax on wages over $200,000 from this employer."],
  [/^7\. Social security tips/,"Tips the employee reported to the employer. They are already included in box 1."],
  [/^8\. Allocated tips/,"Tips the employer assigned to the employee at a large restaurant. They are NOT in box 1: the employee adds them to income and figures Social Security and Medicare tax on Form 4137."],
  [/^9\./,"Not used."],[/^10\. Dependent care/,"Employer dependent care benefits. Up to $5,000 can be excluded; the employee completes Form 2441 to show it."],
  [/^11\. Nonqualified/,"Payments from a nonqualified deferred compensation plan. They are already included in box 1."],
  [/^12[a-d]\./,"A letter code and an amount. Common codes: D = 401(k) deferrals, E = 403(b), AA = Roth 401(k), W = employer contributions to an HSA, DD = cost of employer health coverage (information only, not taxable), C = taxable group-term life insurance over $50,000."],
  [/^13\. Statutory/,"A statutory employee reports these wages on Schedule C and can deduct expenses there, but Social Security and Medicare tax were already withheld, so no self-employment tax."],
  [/^13\. Retirement/,"Checked when the employee was covered by a retirement plan at work. That can limit the deduction for a traditional IRA contribution."],[/^13\. Third-party/,"Sick pay paid by an insurer or other third party."],
  [/^14\. Other/,"Anything else the employer wants to report, such as state disability insurance or union dues."],
  [/^15\./,"The state and the employer's state ID number."],[/^16\./,"Wages taxable by the state."],[/^17\./,"State income tax withheld. It goes on the state return, and counts as state tax paid on Schedule A for someone who itemizes."],
  [/^18\./,"Wages taxable by the city or county."],[/^19\./,"Local income tax withheld."],[/^20\./,"The name of the city or county."]],
 f1099nec:[[/VOID/,"Checked on a form that has an error and must not be processed."],[/PAYER.S ?TIN/,"The payer's taxpayer identification number."],
  [/RECIPIENT.S ?TIN/,"The recipient's SSN, ITIN or EIN, collected on Form W-9. If it is missing or wrong the payer must take 24% backup withholding."],[/RECIPIENT.S name|Street address|City or town|Apt|State or province|Country|ZIP|Room or suite|Telephone|PAYER.S name/,"Name and address details."],
  [/Account number/,"Used when the payer has more than one account for the same recipient."],[/2nd TIN/,"Checked when the IRS has told the payer twice in three years that this recipient's TIN is wrong."],
  [/Nonemployee compensation/,"Pay for services by someone who is not an employee: $600 or more for payments made in 2025, $2,000 or more for payments made in 2026 and later. The recipient reports it on Schedule C and it is subject to self-employment tax."],
  [/Cash tips/,"New box: qualified cash tips paid to the recipient, reported so the recipient can figure the tips deduction on Schedule 1-A."],[/TTOC/,"New box: the Treasury code for the recipient's tipped occupation."],[/Overtime/,"New box, added with the reporting for the tips and overtime deductions on Schedule 1-A."],
  [/consumer products/,"Checked when the payer sold $5,000 or more of consumer products to the recipient for resale (direct sales)."],[/golden parachute/,"Excess golden parachute payments. The recipient owes a 20% excise tax on them."],
  [/^4\. Federal income tax/,"Backup withholding. The recipient claims it on Form 1040, line 25b."],[/^5\./,"State income tax withheld."],[/^6\./,"The state and the payer's state number."],[/^7\./,"Income reported to the state."],[/calendar year/,"The year the payments were made."]],
 f1099int:[[/VOID/,"Checked on a form that has an error and must not be processed."],[/PAYER.S ?TIN/,"The payer's taxpayer identification number."],[/RECIPIENT.S ?TIN/,"The recipient's SSN, ITIN or EIN, collected on Form W-9."],
  [/FATCA/,"Checked when the payer reports this account under the foreign account rules."],[/Account number/,"The account the interest was paid on."],[/2nd TIN/,"Checked when the IRS has told the payer twice in three years that this recipient's TIN is wrong."],[/RTN/,"The payer's bank routing number. Optional."],
  [/^1\. Interest income/,"Taxable interest. It goes to Form 1040, line 2b. Schedule B is required when total taxable interest is over $1,500."],
  [/^2\. Early withdrawal/,"A penalty for cashing in a certificate of deposit early. It is deducted as an adjustment on Schedule 1, with or without itemizing; do not net it against box 1."],
  [/^3\. Interest on U\.S\./,"Interest on U.S. savings bonds and Treasury bills, notes and bonds. Taxable on the federal return, exempt from state income tax."],
  [/^4\. Federal income tax/,"Backup withholding. Claimed on Form 1040, line 25b."],[/^5\. Investment/,"Shown for information. Individuals cannot deduct investment expenses."],
  [/^6\. Foreign tax/,"Foreign tax paid on the interest. Taken as a foreign tax credit (Schedule 3) or as an itemized deduction."],[/^7\. Foreign country/,"The country the foreign tax was paid to."],
  [/^8\. Tax-exempt/,"Interest from state and local bonds. Not taxed, but it is reported on Form 1040, line 2a, and it counts when figuring how much Social Security is taxable."],
  [/^9\. Specified private/,"The part of box 8 from private activity bonds. It is a preference item for the alternative minimum tax."],
  [/^10\. Market discount/,"Market discount that accrued during the year, when the holder elected to include it currently."],[/^1[123]\. Bond premium/,"Premium paid above face value, spread over the life of the bond. It reduces the interest that is taxable."],
  [/^14\./,"The CUSIP number that identifies the tax-exempt bond."],[/^15\.|^16\./,"The state and the payer's state number."],[/^17\./,"State income tax withheld."],[/calendar year/,"The year the interest was paid."],
  [/Street address|City or town|PAYER|telephone|RECIPIENT/,"Name and address details."]]};
FXR.f1040s1=[[/Name\(s\) shown/,"The name exactly as on Form 1040."],[/Your social security number/,"The taxpayer's SSN, so the schedule stays matched to the return."],
 [/1099k/i,"For a Form 1099-K that included an amount in error, or a personal item sold at a loss: entering it here keeps it from being taxed."],
 [/offsets of state and local/,"A state tax refund is taxable only if the state tax was deducted as an itemized deduction in the earlier year and that deduction lowered the tax. Someone who took the standard deduction reports nothing."],
 [/Alimony received/,"Taxable only under a divorce or separation agreement signed before 2019. Under later agreements alimony is not income."],[/original divorce or separation agreement/,"The date of the agreement. It decides the rule: before 2019, alimony is deducted by the payer and taxed to the recipient; 2019 and later, neither."],
 [/Business income or \(loss\)/,"Net profit or loss of a sole proprietorship, from Schedule C, line 31."],[/4797|4684|\b4\. Amount/,"Gains and losses from selling business property (Form 4797) or from casualties and thefts (Form 4684)."],
 [/S corporations, trusts/,"Rental and royalty income and the taxpayer's share from partnerships, S corporations, estates and trusts, from Schedule E."],[/Farm income/,"Net farm profit or loss, from Schedule F."],
 [/repaid a 2025 overpayment|\b7\. /,"Unemployment compensation (Form 1099-G) is fully taxable. If part was repaid in the same year, report the net amount."],
 [/Net operating loss/,"A net operating loss carried in from another year, entered as a negative amount."],[/8b\. Gambling/,"All gambling winnings, with or without a Form W-2G. Losses are not netted here; they are an itemized deduction, limited to winnings."],
 [/8c\. Cancellation/,"Debt that was forgiven (Form 1099-C) is income, unless an exclusion such as bankruptcy or insolvency applies (Form 982)."],[/exclusion from Form 2555/,"The foreign earned income exclusion, entered as a negative amount."],
 [/8e\. /,"Taxable amounts from Archer MSAs and long-term care contracts."],[/8f\. /,"Taxable HSA amounts, such as a distribution not used for medical expenses."],[/8g\. /,"Alaska Permanent Fund dividends."],[/8h\. Jury/,"Jury duty pay is taxable."],
 [/8i\. /,"Prizes and awards are taxable at their fair market value."],[/8j\. /,"Income from a hobby. It is taxable, and the expenses are not deductible."],[/8k\. /,"Income from exercising or selling stock options that is not already on a W-2."],
 [/not in the business of renting/,"Income from renting personal property, such as equipment, when it is not a business."],[/reported on line 8m/,"The offsetting deduction for Olympic and Paralympic medals and prize money, for athletes under the income limit."],[/Paralympic medals/,"Olympic and Paralympic medals and prize money."],
 [/8n\. |8o\. /,"Income inclusions from controlled foreign corporations."],[/8p\. /,"Adds back a business loss above the yearly limit for noncorporate taxpayers; the excess becomes a net operating loss carryover."],[/ABLE account/,"Taxable distributions from an ABLE account."],
 [/Scholarship and fellowship|cholarship and fellowship/,"Scholarship money is tax-free only when used for tuition, fees, books and required supplies by a degree student. The part used for room and board is taxable and goes here."],
 [/line 1a or 1d/,"Removes Medicaid waiver payments that were included in wages but are excluded from income. Entered as a negative amount."],[/nongovernmental section 457/,"Payments from a nonqualified deferred compensation plan."],[/8u\. /,"Wages earned while incarcerated. Taxable, but not earned income for the earned income credit."],
 [/ordinary income not reported elsewhere/,"Digital assets received as ordinary income, such as rewards, that are not reported anywhere else."],[/8z\. /,"Any other taxable income. Name the type."],[/\b9\. Total other income/,"Total of lines 8a through 8z."],
 [/line 8\.$/,"Total additional income. It goes to Form 1040, line 8."],[/Educator expenses/,"Up to $300 of unreimbursed classroom costs for a K-12 teacher, counselor, principal or aide who works at least 900 hours in the school year."],
 [/fee-basis/,"Job expenses that are still deductible for these three groups only, from Form 2106."],[/Health savings account deduction/,"HSA contributions the taxpayer made outside payroll. For 2025: $4,300 self-only, $8,550 family, plus $1,000 at age 55 or older. Form 8889."],
 [/storage fees|\b14\. Amount/,"Moving expenses are deductible only for active-duty members of the Armed Forces moving under orders. Form 3903."],[/self-employment tax\. Attach Schedule SE/,"One-half of self-employment tax, from Schedule SE."],
 [/16\. Self-employed SEP/,"Contributions a self-employed person makes to their own SEP, SIMPLE or qualified plan."],[/17\. Self-employed health/,"Health insurance premiums of a self-employed person, limited to the net profit, and not for any month they could join an employer plan (their own or a spouse's)."],
 [/18\. Penalty on early/,"The early withdrawal penalty from Form 1099-INT, box 2."],[/19a\. /,"Deductible only under a divorce or separation agreement signed before 2019."],[/19b\. /,"The recipient's SSN is required; without it the deduction can be disallowed."],
 [/spouse for the entire year|\b20\. Amount/,"Traditional IRA contributions: up to $7,000 for 2025, $8,000 at age 50 or older. The deduction phases out when the taxpayer or spouse is covered by a retirement plan at work."],
 [/21\. Student loan/,"Up to $2,500 of interest paid on a qualified student loan. It phases out at higher income and is not allowed when married filing separately."],[/22\. Reserved/,"Not used."],[/23\. Archer/,"Contributions to an Archer MSA."],
 [/a\. Jury duty pay/,"Jury pay that the employee turned over to the employer because the employer kept paying salary."],[/rental of personal property engaged in for profit/,"Expenses of renting personal property, against the income on line 8l."],[/24d\. /,"Reforestation costs."],
 [/Trade Act/,"Repayment of supplemental unemployment benefits."],[/24f\. |chaplains/,"Contributions to certain pension plans."],[/unlawful discrimination/,"Attorney fees and court costs for unlawful discrimination claims, limited to the taxable award."],[/detect tax law violations/,"Attorney fees paid in connection with an IRS whistleblower award."],
 [/24j\. /,"The foreign housing deduction, from Form 2555."],[/67\(e\)/,"Excess deductions passed out by an estate or trust in its final year, from Schedule K-1 (Form 1041)."],[/24z\. /,"Any other adjustment. Name the type."],[/25\. Total other adjustments/,"Total of lines 24a through 24z."],
 [/line 10\.$/,"Total adjustments to income. It goes to Form 1040, line 10."]];
FXR.f1040sc=[[/Business [Ee]xpense|^\d\. Amount/,"Part V lists business expenses that have no line of their own, such as software subscriptions or bank fees. Name each one and enter the amount."],[/Enter here and on line 27b/,"Total of the other expenses listed in Part V. It carries to line 27b."],
 [/Name of proprietor/,"The owner's name. A sole proprietorship is not separate from its owner."],[/Social security number/,"The owner's SSN."],[/product or service/,"What the business does, in a few words."],[/B\. Enter code/,"The six-digit business code from the list in the Schedule C instructions."],
 [/separate business name/,"The business name, if it has one."],[/D\. Employer ID/,"An EIN is needed only if the business has employees or a retirement plan. Otherwise leave it blank; the owner's SSN is used."],[/usiness address|ity, town or post office/,"The business address. Leave it blank if it is the same as the home address on Form 1040."],
 [/^F\. |Accounting method/,"Cash method: income when received, expenses when paid; most small businesses use it. Accrual: income when earned, expenses when incurred."],
 [/operation of this business during 2025/,"Material participation. If the owner did not materially participate, a loss is a passive loss and may not be deductible this year."],[/cquired this business during 2025/,"Checked in the first year of the business."],
 [/to file Form\(s\) 1099\?/,"Yes if the business paid anyone in a way that requires a Form 1099, for example $600 or more to a contractor in 2025."],[/will you file required/,"Whether those Forms 1099 were or will be filed."],[/tatutory employee/,"Checked when the income was reported on a Form W-2 with the statutory employee box ticked."],
 [/1\. Gross receipts/,"All income from sales or services before any expenses, including amounts on Forms 1099-NEC and 1099-K and cash that no form reported."],[/2\. Returns and allowances/,"Refunds given to customers and price reductions."],[/3\. Subtract line 2/,"Net sales."],
 [/4\. Cost of goods sold/,"For a business that sells products: figured in Part III and carried here from line 42."],[/5\. Gross profit/,"Sales minus cost of goods sold."],[/fuel tax credit/,"Other business income, such as interest on business accounts or a fuel tax credit."],[/7\. Gross income/,"Gross profit plus other income, before expenses."],
 [/8\. Advertising/,"Advertising and promotion."],[/9\. Car and truck/,"Business use of a vehicle: either actual expenses or the standard mileage rate, 70 cents a mile for 2025. Commuting from home to a regular workplace never counts."],[/10\. Commissions/,"Commissions and fees paid to others."],
 [/11\. Contract labor/,"Payments to independent contractors. $600 or more to one contractor in 2025 requires a Form 1099-NEC."],[/12\. Depletion/,"For businesses that own natural resources such as timber or minerals."],
 [/not included in Part III\) \(see instructions\)/,"Depreciation and the section 179 deduction for equipment, vehicles and other property used more than a year, from Form 4562."],[/oyee benefit programs/,"Benefits for employees, such as health insurance. Not the owner's own."],
 [/15\. Insurance/,"Business insurance such as liability and property. The owner's own health insurance is not deducted here; it is an adjustment on Schedule 1."],[/Mortgage \(paid to banks/,"Mortgage interest on business property."],[/16b\. /,"Other business interest, such as on a business loan or credit card."],
 [/17\. Legal/,"Fees for lawyers, accountants and tax preparation for the business."],[/18\. Office expense/,"Office supplies and postage."],[/19\. Pension/,"Contributions to retirement plans for employees. The owner's own contributions go on Schedule 1."],
 [/Vehicles, machinery/,"Rent or lease payments for vehicles, machinery and equipment."],[/20b\. /,"Rent for an office, shop or other business property."],[/21\. Repairs/,"Repairs that keep property working. An improvement that adds value or extends its life is depreciated instead."],
 [/22\. Supplies/,"Supplies used up in the business that are not part of inventory."],[/23\. Taxes and licenses/,"Business licenses, the employer's share of payroll taxes, and state and local business taxes. Not federal income tax and not self-employment tax."],
 [/a\. Travel\./,"Travel away from home overnight on business: transportation and lodging."],[/24b\. /,"Business meals, generally 50% deductible. Entertainment is not deductible."],[/25\. Utilities/,"Utilities for the business location."],
 [/26\. Wages/,"Wages paid to employees. Never the owner's own draws; an owner is not an employee of a sole proprietorship."],[/Form 7205/,"A deduction for energy-efficient commercial building property."],[/27b\. /,"Carried from Part V on page 2."],
 [/Add lines 8 through 27b/,"Total expenses before the home office."],[/Subtract line 28 from line 7/,"Profit before the home office deduction."],
 [/square footage|part of your home used for business|amount to enter on line 30/,"Business use of the home: the space must be used regularly and only for business. Use Form 8829, or the simplified method of $5 per square foot up to 300 square feet. It cannot create a loss."],
 [/If a loss, you must go to line 32/,"Net profit or loss. It goes to Schedule 1, line 3, and a profit also goes to Schedule SE for self-employment tax."],[/investment is at risk/,"For a loss only: whether all the money the owner put in is at risk. If some is not, the at-risk rules (Form 6198) limit the loss."],
 [/value closing inventory|33b\. |33c\. /,"How ending inventory is valued: at cost, or at the lower of cost or market."],[/attach explanation\. Yes/,"Whether the way inventory is counted or valued changed since last year."],[/year's closing inventory/,"Inventory at the start of the year. It should equal last year's ending inventory."],
 [/withdrawn for personal use/,"Goods bought for resale, minus anything the owner took for personal use."],[/amounts paid to yourself/,"Labor that goes into making the product. Not the owner's own pay."],[/38\. Materials/,"Materials and supplies used to make the product."],[/39\. Other costs/,"Other production costs, such as freight in."],
 [/40\. Add lines 35/,"Goods available for sale."],[/41\. Inventory at end/,"What is still unsold at year end."],[/Enter the result here and on line 4/,"Cost of goods sold: goods available minus ending inventory."],
 [/2-digit month|^43\. /,"The date the vehicle was first used for business."],[/a Business\.|44b\. |44c\. /,"Miles driven for business, for commuting and for everything else. Only business miles are deductible, so a mileage log is needed."],
 [/off-duty hours|other vehicle available/,"Questions the IRS uses to judge whether the business-use claim is reasonable."],[/evidence to support|47b\. /,"Vehicle deductions need records made at the time, in writing: date, miles, place and business purpose."]];
const FXNM=[[/Name\(s\) shown|Name of person with self-employment income/,"The name exactly as on Form 1040."],[/^(?:Your )?[Ss]ocial security number/,"The SSN of the person this schedule is for."]];
FXR.f1040s2=FXNM.concat([[/(?:^|[.:] )1a\. |Excess advance premium/,"Advance premium tax credit that was more than the taxpayer turned out to be entitled to, from Form 8962. It must be paid back here."],[/(?:^|[.:] )1[bc]\. |clean vehicle credit/,"Repayment of a clean vehicle credit that was transferred to the dealer but that the buyer did not qualify for."],
 [/(?:^|[.:] )1[d-y]\. |Form 4255|\(i+\)|\(iv\)/,"Recapture and repayment items for certain energy credits. Uncommon on an individual return."],[/(?:^|[.:] )1z\. /,"Total of the additions on line 1."],[/Alternative minimum tax/,"Alternative minimum tax from Form 6251: a second tax calculation that adds back certain deductions; the taxpayer pays the difference if it is higher."],
 [/line 17\.?$|Add lines 1z and 2/,"Total of Part I. It goes to Form 1040, line 17."],[/4361|4029|Self-employment tax|^4\. /,"Self-employment tax from Schedule SE: 15.3% on net earnings (12.4% Social Security up to the wage base plus 2.9% Medicare). The boxes are for approved religious exemptions."],
 [/unreported tip income/,"Social Security and Medicare tax on tips the employee did not report to the employer, from Form 4137."],[/Uncollected social security and Medicare tax on wages/,"The employee share of Social Security and Medicare tax for a worker who was wrongly treated as an independent contractor, from Form 8919."],[/Add lines 5 and 6/,"Total of lines 5 and 6."],
 [/tax-favored accounts|Form 5329|^8\. Amount/,"Additional taxes on retirement accounts from Form 5329: 10% on early distributions before age 59½, and the excise taxes on excess contributions and missed required distributions."],[/Household employment/,"Social Security, Medicare and federal unemployment tax an employer owes on a household worker's wages, from Schedule H (the 'nanny tax')."],
 [/Reserved/,"Not used."],[/Additional Medicare Tax/,"0.9% on wages and self-employment income above $200,000 single, $250,000 joint, $125,000 married filing separately. Form 8959."],[/Net investment income tax/,"3.8% on the smaller of net investment income or the amount by which modified AGI is over $200,000 single, $250,000 joint. Form 8960."],
 [/group-term life insurance/,"Social Security and Medicare tax the employer could not collect on tips or on group-term life insurance; shown in Form W-2, box 12."],[/residential lots and timeshares|\$150,000/,"Interest owed on tax that was deferred by reporting certain sales on the installment method."],[/low-income housing/,"Recapture of the low-income housing credit, from Form 8611."],
 [/(?:^|[.:] )17[a-z]\. |Other additional taxes/,"One of the uncommon additional taxes on line 17, such as recapture of a credit, the 20% additional tax on HSA or Archer MSA distributions not used for medical costs, or penalty taxes on certain deferred compensation. Enter only the one that applies."],
 [/(?:^|[.:] )18\. /,"Total of lines 17a through 17z."],[/(?:^|[.:] )19\. |(?:^|[.:] )20\. |Section 965/,"Uncommon items: recapture of certain energy credits and an installment of the section 965 tax on foreign earnings."],[/line 23|total other taxes/,"Total of Part II. It goes to Form 1040, line 23."]]);
FXR.f1040s3=FXNM.concat([[/line 20\.?$/,"Total nonrefundable credits. It goes to Form 1040, line 20."],[/line 31\.?$/,"Total other payments and refundable credits. It goes to Form 1040, line 31."],[/Foreign tax credit/,"A credit for income tax paid to a foreign country. Form 1116 is not needed when the foreign tax is $300 or less ($600 joint), all from passive income reported on a Form 1099."],
 [/child and dependent care/,"A credit of 20% to 35% of care expenses that let the taxpayer work: up to $3,000 of expenses for one qualifying person, $6,000 for two or more. Form 2441."],
 [/Education credits/,"The nonrefundable part of the American opportunity credit plus the lifetime learning credit (20% of up to $10,000 of expenses). Form 8863."],[/Retirement savings contributions/,"The saver's credit: 10%, 20% or 50% of up to $2,000 contributed to an IRA or workplace plan, for lower-income taxpayers. Form 8880."],
 [/Residential clean energy/,"30% of the cost of solar, wind, geothermal and battery storage property for a home. Form 5695."],[/Energy efficient home improvement/,"A credit for insulation, windows, doors, heat pumps and similar improvements, with yearly limits. Form 5695."],
 [/(?:^|[.:] )6[a-z]\. |Other nonrefundable credits:/,"One of the other nonrefundable credits on line 6, such as the general business credit (Form 3800), the nonrefundable adoption credit (Form 8839), the credit for the elderly or the disabled (Schedule R), or the clean vehicle credit (Form 8936). Enter only the one that applies."],
 [/(?:^|[.:] )7\. /,"Total of lines 6a through 6z."],[/Net premium tax credit/,"Premium tax credit for Marketplace health insurance that is more than the advance payments already made, from Form 8962."],
 [/request for extension/,"A payment sent with Form 4868. An extension gives more time to file, not to pay."],[/Excess social security/,"When two or more employers together withheld more than the yearly maximum Social Security tax ($10,918.20 for 2025), the excess is claimed here."],
 [/fuels/,"A credit for federal tax on fuel used off-highway, such as on a farm. Form 4136."],[/(?:^|[.:] )13[a-z]\. |Other payments or refundable/,"Other payments and refundable credits, such as tax paid by a mutual fund on undistributed capital gains (Form 2439)."],[/(?:^|[.:] )14\. /,"Total of lines 13a through 13z."],[/zzzz/,""]]);
FXR.f1040sse=[[/^Name of person/,"The name of the person who has the self-employment income. On a joint return each spouse with self-employment income files a separate Schedule SE."],[/^Social security number/,"That person's SSN, so the earnings are credited to the right Social Security record."],
 [/^Part I\. Self-Employment Tax/,"For a minister or member of a religious order with an approved exemption (Form 4361) who has other self-employment income."],[/^Skip lines 1a and 1b/,"Line 1a: net farm profit from Schedule F and farm partnerships."],
 [/^1b\. /,"Line 1b: Conservation Reserve Program payments received by someone getting Social Security retirement or disability benefits are subtracted here."],[/^Skip line 2/,"Line 2: net profit from Schedule C, line 31, plus self-employment income from a partnership (Schedule K-1, box 14, code A)."],
 [/^3\. /,"Total net earnings before the adjustment."],[/^4a\. /,"Multiply by 92.35%. This takes off the half of the tax an employer would have paid, so a self-employed person is taxed on the same base as an employee."],[/^4b\. /,"Used only with the optional methods in Part II."],
 [/^4c\. /,"If this is less than $400 there is no self-employment tax and the schedule is not filed."],[/^5a\. |^5b\. /,"Wages of $108.28 or more from a church that elected out of Social Security and Medicare are taxed here."],[/^6\. /,"Total net earnings from self-employment."],
 [/^7\. /,"The Social Security wage base: $176,100 for 2025. The 12.4% part stops here; the 2.9% Medicare part has no limit."],[/^8[a-d]\. /,"Wages already taxed for Social Security as an employee (Form W-2, boxes 3 and 7) use up the wage base first, so less self-employment income is subject to the 12.4%."],
 [/^9\. /,"The room left under the wage base."],[/^10\. /,"The Social Security part: 12.4% of the smaller of line 6 or line 9."],[/^11\. /,"The Medicare part: 2.9% of line 6."],[/^12\. /,"Self-employment tax. It goes to Schedule 2, line 4, and from there to Form 1040, line 23."],
 [/^13\. /,"One-half of the tax. It is deducted on Schedule 1, line 15; it reduces income tax, not the self-employment tax itself."],[/^Part II|^15\. |^Nonfarm Optional|^17\. /,"Optional methods let someone with low or no profit report enough earnings to earn Social Security credits or to qualify for credits. Rarely used."]];
FXR.f1040sa=FXNM.concat([[/Medical and dental expenses/,"Unreimbursed medical and dental costs for the taxpayer, spouse and dependents, including insurance premiums paid with after-tax money."],[/(?:^|[.:] )2\. /,"AGI from Form 1040, line 11."],[/7\.5 ?%/,"Only the part of medical expenses above 7.5% of AGI is deductible."],[/(?:^|[.:] )4\. /,"The deductible medical amount."],
 [/(?:^|[.:] )5a\. |general sales taxes/,"State and local income tax, or general sales tax if the box is checked. One or the other, not both."],[/(?:^|[.:] )5b\. /,"Real estate tax on property the taxpayer owns."],[/(?:^|[.:] )5c\. /,"Personal property tax based on value, such as the value part of a car registration fee."],[/(?:^|[.:] )5d\. /,"Total state and local taxes before the limit."],
 [/(?:^|[.:] )5e\. /,"The SALT limit. For 2025 the deduction for state and local taxes is capped at $40,000 ($20,000 married filing separately), reduced at modified AGI above $500,000 but not below $10,000."],[/(?:^|[.:] )6\. /,"Other deductible taxes, such as foreign income tax when no credit is taken."],[/(?:^|[.:] )7\. /,"Total taxes."],
 [/not used all of your home mortgage|improve your home/,"Checked when some of the loan was not used to buy, build or improve the home. Interest on that part is not deductible."],[/(?:^|[.:] )8a\. /,"Home mortgage interest and points from Form 1098. Deductible on up to $750,000 of acquisition debt ($1 million for loans before December 16, 2017)."],
 [/(?:^|[.:] )8b\. /,"Mortgage interest not on a Form 1098, such as on a seller-financed loan. The seller's name, address and SSN are required."],[/(?:^|[.:] )8c\. /,"Points not reported on Form 1098."],[/(?:^|[.:] )8d\. /,"Reserved on the 2025 form."],[/(?:^|[.:] )8e\. /,"Total home mortgage interest."],
 [/(?:^|[.:] )9\. |Investment interest/,"Interest on money borrowed to buy investments, limited to net investment income. Form 4952."],[/(?:^|[.:] )10\. /,"Total interest."],[/(?:^|[.:] )11\. /,"Cash gifts to qualified charities, generally up to 60% of AGI. A gift of $250 or more needs a written acknowledgment from the charity."],
 [/(?:^|[.:] )12\. |Other than by cash/,"Gifts of property. Form 8283 is required when noncash gifts total more than $500, and a qualified appraisal generally when an item is over $5,000."],[/(?:^|[.:] )13\. /,"Charitable gifts carried over from an earlier year because of the AGI limits (up to 5 years)."],[/(?:^|[.:] )14\. /,"Total gifts to charity."],
 [/(?:^|[.:] )15\. |Casualty and theft/,"Personal casualty losses are deductible only when caused by a federally declared disaster. Form 4684."],[/(?:^|[.:] )16\. /,"Other itemized deductions, such as gambling losses up to the amount of winnings."],[/(?:^|[.:] )17\. /,"Total itemized deductions. It goes to Form 1040, line 12e, if larger than the standard deduction."],
 [/(?:^|[.:] )18\. |less than your standard deduction/,"Checked when the taxpayer chooses to itemize even though the standard deduction is larger, for example when a spouse filing separately itemizes."]]);
FXR.f1040sb=FXNM.concat([[/^Part III|(?:^|[.:] )7a\. |(?:^|[.:] )7b\. |(?:^|[.:] )8\. /,"Part III must be answered by anyone with a foreign account or foreign trust. An account over $10,000 in total at any time in the year also requires the FBAR (FinCEN Form 114), filed separately from the return."],[/Line \d+ of \d+/,"List each payer and the amount: taxable interest in Part I (Form 1099-INT, box 1), ordinary dividends in Part II (Form 1099-DIV, box 1a). Schedule B is required when either total is over $1,500."],
 [/Excludable interest|Form 8815/,"Interest on Series EE or I savings bonds that is excluded because it paid for higher education. Form 8815."],[/(?:^|[.:] )2\. /,"Total interest listed."],[/line 2b/,"Taxable interest. It goes to Form 1040, line 2b."],[/line 3b/,"Total ordinary dividends. It goes to Form 1040, line 3b."],
 [/Part II|Ordinary Dividends|(?:^|[.:] )5\. /,"List each payer of ordinary dividends (Form 1099-DIV, box 1a) and the amount."],[/Part I|Interest|(?:^|[.:] )1\. |Amount/,"List each payer of taxable interest (Form 1099-INT, box 1) and the amount. Schedule B is required when taxable interest or ordinary dividends are over $1,500."]]);
FXR.fw7=[[/Acceptance Agent|^Fax|^Name and title|^Name of company|^EIN|^PTIN|^Office code/,"Completed only by an Acceptance Agent or Certifying Acceptance Agent: name, title, company, EIN, PTIN, office code and contact numbers. A CAA also attaches Form W-7 (COA), the certificate of accuracy."],
 [/Apply for a new ITIN/,"Check new for a first application, or renew for an ITIN that has expired. An ITIN expires when it is not used on a federal return for three years in a row. Unless an exception applies, Form W-7 is filed together with the federal tax return it is needed for."],
 [/^Reason you're submitting|treaty country|treaty article/,"Reason a: a nonresident alien who needs an ITIN to claim a tax treaty benefit. When a or f is checked and a treaty applies, enter the treaty country and the article number."],
 [/(?:^|[.:] )b\. Nonresident alien filing/,"Reason b: a nonresident alien who must file a U.S. return, or files one to claim a refund (for example Form 1040-NR)."],
 [/(?:^|[.:] )c\. U\.S\. resident alien/,"Reason c: a resident alien under the substantial presence test who must file a return and is not eligible for a Social Security number."],
 [/(?:^|[.:] )d\. Dependent|If d, enter relationship/,"Reason d: a dependent of a U.S. citizen or resident. An ITIN is issued to a dependent only when it is needed for an allowable tax benefit, such as the credit for other dependents or head of household status, shown on the attached return."],
 [/(?:^|[.:] )e\. Spouse/,"Reason e: the spouse of a U.S. citizen or resident, for example to file a joint return."],[/If d or e, enter name|^Line 2 of 2/,"The name and the SSN or ITIN of the U.S. citizen or resident the applicant is the dependent or spouse of."],
 [/(?:^|[.:] )f\. Nonresident alien s/,"Reason f: a nonresident alien student, professor or researcher who files a U.S. return or claims an exception. Line 6g must be completed."],[/(?:^|[.:] )g\. Dependent\/spouse/,"Reason g: the dependent or spouse of a nonresident alien who holds a U.S. visa."],
 [/(?:^|[.:] )h\. Other/,"Reason h: one of the exceptions to attaching a return, such as third-party withholding on passive income, wages or scholarships under a treaty, mortgage interest reporting, or a sale of U.S. real property. Describe it and attach the supporting documents the exception requires."],
 [/1a\. /,"The legal name exactly as it appears on the identification documents."],[/1b\. /,"The name at birth, if different from line 1a."],[/Mailing Ad|(?:^|[.:] )2\. /,"Where the IRS mails the notice that assigns the ITIN."],
 [/Foreign \(non-U\.S\.\) Add|(?:^|[.:] )3\. /,"The applicant's permanent address outside the United States. No P.O. box. Someone who has moved to the U.S. for good enters only the country they last lived in."],
 [/(?:^|[.:] )4\. /,"Date of birth as month, day, year, and the country of birth. The date must match the identification documents."],[/(?:^|[.:] )5\. /,"Check the box that matches the documents."],
 [/6a\. /,"Every country the applicant is a citizen of."],[/6b\. /,"The tax identification number from the applicant's home country, if it issues one."],[/6c\. /,"The type, number and expiration date of the U.S. visa, if any."],
 [/Estados Unidos|Date of entry/,"The date of entry into the United States. For a dependent, a passport with no U.S. date of entry is not enough by itself to prove U.S. residency; more documents are then required."],
 [/6d\. /,"The documents sent with the application. A passport is the only document that proves both identity and foreign status by itself; without one, at least two of the other acceptable documents are needed. A CAA may authenticate a dependent's passport and birth certificate; a dependent's other documents must go to the IRS as originals or certified copies."],
 [/6e\. |6f\. /,"Whether the applicant ever had an ITIN or an IRS number (IRSN) before. If yes, enter it and the name it was issued under. A renewal always has one."],[/6g\. /,"For reason f only: the school or company, its city and state, and the length of stay."],
 [/Sign Here|Phone number/,"The applicant signs. A phone number lets the IRS call about the application."],[/delegate/i,"For a child, a parent or court-appointed guardian may sign and marks the relationship here. An agent with a power of attorney attaches Form 2848."]];
FXR.f4868=[[/tax year beginning|and ending|2 digit year/,"Only for a fiscal-year taxpayer."],[/Your name|Address|City, town|State\.|ZIP/,"Name and address as they will appear on the return."],[/Your social security number|Spouse's social security/,"The SSN, and the spouse's SSN for a joint return."],
 [/total tax liability/,"An honest estimate of the total tax for the year. If the estimate is not reasonable the IRS can treat the extension as invalid."],[/(?:^|[.:] )5\. /,"Withholding and estimated payments already made."],[/(?:^|[.:] )6\. /,"What is still owed."],
 [/(?:^|[.:] )7\. /,"Pay as much as possible with the extension. Form 4868 gives six more months to file (to October 15), not to pay; interest and the late-payment penalty run on any unpaid tax from April 15."],
 [/(?:^|[.:] )8\. /,"For a U.S. citizen or resident who is out of the country on the due date. They already have two extra months, to June 15; this form adds four more."],[/(?:^|[.:] )9\. /,"For a Form 1040-NR filer with no wages subject to U.S. withholding, whose return is due June 15."],
 [/confirmation number/,"Someone who pays electronically and marks the payment as an extension does not need to file this form; the confirmation number is the record."]];
FXR.f2848=[[/^$/,"For IRS use only."],[/Insert above letter|Column: Designation/,"The representative's designation letter from the list on the form: a = attorney, b = certified public accountant, c = enrolled agent, d = officer, e = full-time employee, f = family member, h = unenrolled return preparer (limited practice), r = enrolled retirement plan agent."],
 [/Column: Li/,"The state that licensed an attorney or CPA. An enrolled agent writes IRS."],[/Column: Ba/,"The bar, license, certification or enrollment number. For an enrolled agent, the enrollment card number."],
 [/Column: Signature|Column: Date/,"Each representative must sign and date the declaration under penalties of perjury. If it is not signed and dated the IRS returns the power of attorney."],
 [/Taxpayer name|Taxpayer address/,"The taxpayer giving the power of attorney. Spouses who filed jointly each need their own Form 2848."],[/1\. SSN|1\. ITIN|1\. EIN/,"The taxpayer's identification number: SSN or ITIN for an individual, EIN for a business."],[/1\. Daytime/,"A daytime phone number for the taxpayer."],[/1\. Plan number/,"Only for an employee benefit plan matter."],
 [/Check if to be sent/,"Check to have the IRS send this representative copies of notices. The IRS sends copies to no more than two representatives."],[/CAF No/,"The Centralized Authorization File number the IRS assigns to a representative. Write None on a first Form 2848 and the IRS issues one."],
 [/Check if new/,"Checked when the representative's address, phone or fax has changed since the last authorization."],[/PTIN|Telephone No|Fax No/,"The representative's PTIN and contact numbers."],[/[1-4]\. Name|[1-4]\. Address|hereby appoints/,"A representative: an individual eligible to practice before the IRS, such as an attorney, CPA or enrolled agent. Up to four can be named. A firm cannot be a representative; only individuals can."],
 [/Acts authorized|Row: \d\. Column: (?:Ta|Ye|Description)/,"What the representative may handle: the type of tax, the form number and the years or periods. They must be specific; 'all years' is not accepted. Future periods can be listed only up to three years after the year the IRS receives the form."],
 [/Specific use not/,"Checked for a one-time or specific matter that is not recorded on the CAF, such as a private letter ruling request."],[/5a\. Sign a return/,"A representative may sign the taxpayer's return only in limited cases: disease or injury, continuous absence from the United States for at least 60 days before the due date, or specific IRS permission."],
 [/5a\. /,"Extra authority the taxpayer may grant: access to IRS records through an Intermediate Service Provider, disclosure of tax information to third parties, substituting or adding representatives, or other acts written in."],
 [/5b\. /,"Acts the representative may NOT perform. A representative can never endorse or cash the taxpayer's refund check or have a refund deposited to the representative's own account."],
 [/Retention\/revocation/,"A new Form 2848 automatically revokes earlier powers of attorney for the same matters and periods. Check this box, and attach a copy of the earlier one, to keep it in effect."],
 [/(?:^|[.:] )7\. /,"The taxpayer signs and dates. A corporate officer, partner, executor or trustee also gives a title. Without the taxpayer's signature the IRS returns the form."]];
FXR.f8821=[[/^Received by|^Name\s*$|^Telephone\s*$|^Function|^Date\s*$/,"For IRS use only."],[/Tax information|Column: \([a-d]\)/,"What may be released: the type of tax, the form number, the years or periods, and any specific matters. Be specific; a general 'all years' is not accepted."],[/^1\. /,"The taxpayer whose information may be released: name, address, identification number and phone. Form 8821 only lets the designee inspect and receive confidential tax information; it does not allow anyone to represent the taxpayer. That takes Form 2848."],
 [/Designee|Name and address/,"The person or firm that may receive the information. Unlike Form 2848, a designee can be a business and does not have to be eligible to practice before the IRS."],[/Check if to be sent/,"Check to have the IRS send the designee copies of notices."],[/CAF No/,"The designee's Centralized Authorization File number. Write None if none has been assigned."],
 [/PTIN|Telephone No|Fax No|Check if new/,"The designee's PTIN and contact details."],
 [/Specific use not/,"Checked for a specific use that is not recorded on the CAF, such as income verification for a lender. Used this way, the form must reach the IRS within 120 days of the taxpayer's signature."],
 [/Retention\/revocation/,"A new Form 8821 automatically revokes earlier tax information authorizations for the same matters unless this box is checked and a copy of the earlier one is attached."],[/(?:^|[.:] )6\. /,"The taxpayer signs and dates, and gives a title if signing for a business, estate or trust."]];
function fxRule(k,label){const R=FXR[k];if(!R)return"";const t=fvClean(label).replace(/^Page \d+\.\s*/,"").replace(/^(?:Read only(?: copy)?\.\s*)?Copy [A-Z0-9]+[^.]*\.\s*/,"");for(const r of R)if(r[0].test(t))return r[1];return""}

/* ---------- the viewer ---------- */
function fvFieldHtml(d,i){const f=d.f[i],k=fv.k,lab=fvClean(f[6]),own=k==="f1040"?F40X[i]:fxRule(k,f[6]),rel=own?[]:fvRelated(f[6],k),ln=k==="f1040"&&F40REV[i]?"Line "+F40REV[i]:(k==="f1040"&&F40BOX[i]?F40BOX[i]:"");
  return `<div class="fvsh"><div class="fvshh"><b>${ln?esc(ln):(f[5]?"Checkbox":"Box")}</b><span><button class="btn ghost small" data-fv="prev" aria-label="Previous box">‹</button><button class="btn ghost small" data-fv="next" aria-label="Next box">›</button><button class="btn ghost small" data-fv="close">Close</button></span></div>
   <div class="fvirs"><i class="fvh">On the form</i>${lab?esc(lab):(/^(?:ssa|ss5|ha)/.test(k)?"The SSA file":"The IRS file")+" has no description for this box."}</div>
   ${own?`<div class="fvown"><i class="fvh">What it means</i>${esc(own)}</div>`:""}
   ${rel.length?`<div class="fvrel"><i class="fvh">Related in the course</i>${rel.map(r=>`<div><b>${esc(r.f)}</b> ${esc(r.b)}</div>`).join("")}</div>`:""}
   ${fv.tab==="fill"&&k==="f1040"?fvFillInput(d,i):""}</div>`}
function fvPageHtml(d){const k=fv.k,pg=fv.pg,P=d.p[pg],fl=fv.tab==="fill"?(fv.fill||{}):null,res=fv.res||null;
  return `<div class="fvscroll" id="fvscroll"><div class="fvpage" id="fvpage" style="width:${Math.round(fv.z*100)}%;aspect-ratio:${P[0]}/${P[1]}"><img src="forms/${k}-${pg}.webp" alt="${esc(fvName(k))}, page ${pg+1}" width="${P[0]}" height="${P[1]}">
   ${d.f.map((f,i)=>f[0]!==pg?"":`<button class="fvf${f[5]?" c":""}${fv.sel===i?" on":""}${res&&res[i]?" "+res[i]:""}" data-fv="f" data-i="${i}" style="left:${f[1]/10}%;top:${f[2]/10}%;width:${f[3]/10}%;height:${f[4]/10}%" aria-label="${esc(fvClean(f[6]).slice(-90))}">${fl&&fl[i]!==undefined&&fl[i]!==""?(f[5]?"✕":esc(String(fl[i]))):""}</button>`).join("")}</div></div>`}
function renderForm(){const V=document.getElementById("view");if(!fv){view="home";return render()}
  if(fv.lib)return renderFormLib(V);
  const k=fv.k,ix=FORMIDX[k],d=FCACHE[k],is40=k==="f1040";
  let h=`<section class="section fvw"><div class="fvtop nolink"><button class="btn ghost small" data-fv="back">← Back</button><div class="fvt"><b>${esc(fvName(k))}</b><span>${esc(ix[0]||"")} · the real ${/^(?:ssa|ss5|ha)/.test(k)?"SSA":"IRS"} form</span></div></div>`;
  if(!d)h+=`<div class="card">Loading the form…</div>`;
  else if(d.err)h+=`<div class="card"><b>The form could not be loaded.</b><div class="small muted">Forms are downloaded the first time they are opened. Check the internet and try again.</div><button class="btn" data-fv="retry">Try again</button></div>`;
  else{const ab=fvAbout(k);
    if(is40)h+=`<div class="seg fvtabs">${[["form","Explore"],["fill","Fill it in"],["find","Find the line"]].map(t=>`<button class="chip" aria-pressed="${fv.tab===t[0]}" data-fv="tab" data-t="${t[0]}">${t[1]}</button>`).join("")}</div>`;
    if(fv.tab==="fill"&&is40)h+=fvFillTop();
    if(fv.tab==="find"&&is40)h+=fvFindTop();
    if(fv.tab==="form")h+=`<div class="small muted fvhint">Tap any ${d.f.length?"blue box":"part"} to see what goes there. ${d.f.length} boxes on ${d.p.length} page${d.p.length>1?"s":""}.</div>`;
    h+=`<div class="fvbar"><span class="fvpg">${d.p.length>1?d.p.map((_,n)=>`<button class="chip" aria-pressed="${fv.pg===n}" data-fv="pg" data-n="${n}">Page ${n+1}</button>`).join(""):""}</span><span><button class="btn ghost small" data-fv="zo" aria-label="Zoom out">−</button><button class="btn ghost small" data-fv="zi" aria-label="Zoom in">+</button></span></div>`;
    h+=fvPageHtml(d)+`<div id="fvsheet" class="fvsheet">${fv.sel>=0?fvFieldHtml(d,fv.sel):""}</div>`;
    if(fv.tab==="fill"&&is40)h+=fvFillBottom(d);
    if(fv.tab==="form"){if(ab.length)h+=`<details class="card fvab"><summary><b>What the course teaches about ${esc(fvName(k))}</b> (${ab.length})</summary>${ab.map(r=>`<div class="fvfact"><b>${esc(r.f)}</b> ${esc(r.b)}</div>`).join("")}</details>`;
      h+=`<div class="row"><button class="btn" data-fv="lib">All ${Object.keys(FORMIDX).length} forms</button>${is40?"":`<button class="btn" data-fv="open" data-k="f1040">Form 1040</button>`}</div><div class="small muted">Source: IRS.gov, downloaded November 22, 2026. For study; file on the current official form.</div>`}}
  V.innerHTML=h+`</section>`}
function renderFormLib(V){const ex=k=>k==="f1040"||!!FXR[k],ks=Object.keys(FORMIDX).sort((a,b)=>(ex(b)-ex(a))||(b==="f1040")-(a==="f1040")||fvName(a).localeCompare(fvName(b),undefined,{numeric:true}));
  V.innerHTML=`<section class="section fvw nolink"><div class="fvtop"><button class="btn ghost small" data-fv="back">← Back</button><div class="fvt"><b>IRS forms</b><span>${ks.length} real forms, every box tappable</span></div></div>
   <input class="fvq" id="fvq" type="search" placeholder="Search: 1040, W-2, Schedule C, 941…" autocomplete="off">
   <div class="fvlist" id="fvlist">${ks.map(k=>`<button class="fvrow" data-fv="open" data-k="${k}" data-s="${esc((fvName(k)+" "+FORMIDX[k][0]).toLowerCase())}"><b>${esc(fvName(k))}</b><span>${esc(FORMIDX[k][0]||"")} · ${FORMIDX[k][2]} boxes${ex(k)?" · ✓ every box explained":""}</span></button>`).join("")}</div></section>`;
  const q=document.getElementById("fvq");if(q)q.oninput=()=>{const s=q.value.toLowerCase().trim();document.querySelectorAll("#fvlist .fvrow").forEach(b=>{b.style.display=!s||b.dataset.s.includes(s)?"":"none"})}}
function fvSelect(i,keep){const d=FCACHE[fv.k];if(!d||!d.f)return;fv.sel=i;if(i>=0&&d.f[i][0]!==fv.pg){fv.pg=d.f[i][0];render()}
  document.querySelectorAll(".fvf.on").forEach(b=>b.classList.remove("on"));const el=i>=0?document.querySelector('.fvf[data-i="'+i+'"]'):null,sh=document.getElementById("fvsheet");
  if(sh)sh.innerHTML=i>=0?fvFieldHtml(d,i):"";if(el){el.classList.add("on");const r=el.getBoundingClientRect(),sc=document.getElementById("fvscroll");if(sc&&(!keep||r.left<0||r.right>window.innerWidth))sc.scrollLeft+=r.left+r.width/2-window.innerWidth/2;if(!keep||r.top>window.innerHeight*0.42||r.top<60)window.scrollBy(0,r.top-window.innerHeight*0.22)}
  const inp=document.getElementById("fvin");if(inp)setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},30)}
/* Fill it in */
function fvFillTop(){const c=F40CASES.find(x=>x.id===fv.cs)||F40CASES[0];fv.cs=c.id;S.set.f40=S.set.f40||{};
  return `<div class="card fvcase"><div class="seg">${F40CASES.map((x,n)=>`<button class="chip" aria-pressed="${x.id===c.id}" data-fv="case" data-c="${x.id}">${n+1}${S.set.f40[x.id]==="ok"?" ✓":""}</button>`).join("")}</div><b>${esc(c.t)}</b><div class="small">${esc(c.who)}</div>
   <details open><summary class="small"><b>The documents</b></summary>${c.docs.map(d=>`<div class="fvdoc"><b>${esc(d[0])}</b>${d[1].map(r=>`<div>${esc(r)}</div>`).join("")}</div>`).join("")}</details>
   <div class="small muted">Tap a box on the form and type the amount, whole dollars. Tick the filing status and answer the digital assets question. Leave a line blank when nothing goes there.</div></div>`}
function fvFillInput(d,i){const f=d.f[i],v=(fv.fill||{})[i];if(f[5])return `<div class="row"><button class="btn pri" data-fv="tick">${v?"Clear this box":"Tick this box"}</button></div>`;
  if(F40REV[i]===undefined)return `<div class="small muted">Not needed for this practice.</div>`;
  return `<div class="row fvinrow"><input id="fvin" class="fvin" inputmode="numeric" autocomplete="off" placeholder="Amount for line ${F40REV[i]}" value="${v===undefined?"":esc(String(v))}"><button class="btn pri" data-fv="set">Enter</button></div>`}
function fvFillBottom(d){const r=fv.rep;return `<div class="row"><button class="btn pri" data-fv="check">Check my return</button><button class="btn" data-fv="clear">Start over</button></div>${r?`<div class="card fvrep"><b>${r.bad?`${r.ok} of ${r.n} right`:"✓ Every line is right."}</b>${r.rows.map(x=>`<div class="fvrr ${x[3]}"><b>${esc(x[0])}</b><span>${esc(x[1])}</span>${x[2]?`<div class="small">${esc(x[2])}</div>`:""}</div>`).join("")}</div>`:""}`}
function fvNum(s){const t=String(s==null?"":s).replace(/[$,\s]/g,"");return t===""?null:(isFinite(+t)?Math.round(+t):NaN)}
function fvCheck(){const c=F40CASES.find(x=>x.id===fv.cs),fl=fv.fill||{},res={},rows=[];let ok=0,n=0;const $=v=>"$"+Number(v).toLocaleString("en-US");
  c.chk.forEach(i=>{n++;const good=!!fl[i];if(good)ok++;res[i]=good?"ok":"bad";if(!good)rows.push([F40BOX[i]||"Checkbox","Should be ticked","","bad"])});
  Object.keys(F40BOX).forEach(i=>{if(fl[i]&&!c.chk.includes(+i)){n++;res[i]="bad";rows.push([F40BOX[i],"Should not be ticked","","bad"])}});
  Object.keys(F40L).forEach(l=>{const i=F40L[l],want=c.v[l],got=fvNum(fl[i]);if(want===undefined){if(got){n++;res[i]="bad";rows.push(["Line "+l,"You entered "+$(got)+"; nothing goes here",c.why[l]||"","bad"])}return}
    n++;if(got===want){ok++;res[i]="ok"}else{res[i]="bad";rows.push(["Line "+l,(got===null?"Blank":"You entered "+(isNaN(got)?String(fl[i]):$(got)))+"; it should be "+$(want),c.why[l]||"","bad"])}});
  fv.res=res;fv.rep={ok,n,bad:n-ok,rows};S.set.f40=S.set.f40||{};if(n===ok)S.set.f40[c.id]="ok";persist();render();setTimeout(()=>{const e=document.querySelector(".fvrep");if(e)e.scrollIntoView({block:"start"})},40)}
/* Find the line */
function fvFindTop(){if(!fv.fq){const L=F40FIND.slice();for(let i=L.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[L[i],L[j]]=[L[j],L[i]]}fv.fq={L:L.slice(0,10),i:0,ok:0,st:""}}
  const q=fv.fq;if(q.i>=q.L.length)return `<div class="card fvcase"><b>${q.ok} of ${q.L.length} found on the first tap.</b><div class="row"><button class="btn pri" data-fv="again">Ten more</button></div></div>`;
  return `<div class="card fvcase"><div class="small muted">Find the line · ${q.i+1} of ${q.L.length}</div><b>${esc(q.L[q.i][0])}</b><div class="small ${q.st==="bad"?"badt":q.st==="ok"?"okt":"muted"}">${q.st==="bad"?"Not that one. The right box is now marked; tap Next.":q.st==="ok"?"✓ Right.":"Tap the box on the form where this goes. It may be on page 2."}</div>${q.st?`<div class="row"><button class="btn pri" data-fv="fnext">Next</button></div>`:""}</div>`}
function fvFindTap(i){const q=fv.fq;if(!q||q.st||q.i>=q.L.length)return fvSelect(i);const want=q.L[q.i][1],good=want.includes(i);q.st=good?"ok":"bad";if(good)q.ok++;fv.res={};want.forEach(w=>{fv.res[w]="ok"});if(!good)fv.res[i]="bad";
  const d=FCACHE[fv.k];fv.sel=want[0];fv.pg=d.f[want[0]][0];render();const el=document.querySelector('.fvf[data-i="'+want[0]+'"]');if(el){const r=el.getBoundingClientRect(),sc=document.getElementById("fvscroll");if(sc)sc.scrollLeft+=r.left+r.width/2-window.innerWidth/2}}
function formClick(b){const a=b.dataset.fv,d=fv&&fv.k?FCACHE[fv.k]:null;
  if(a==="open"){formOpen(b.dataset.k);return true}
  if(a==="lib"){formLib();return true}
  if(!fv)return true;
  if(a==="back"){formBack();return true}
  if(a==="retry"){delete FCACHE[fv.k];formLoad(fv.k);render();return true}
  if(a==="pg"){fv.pg=+b.dataset.n;fv.sel=-1;render();return true}
  if(a==="zi"||a==="zo"){const sc=document.getElementById("fvscroll"),r=sc&&sc.scrollWidth?(sc.scrollLeft+sc.clientWidth/2)/sc.scrollWidth:0.5;fv.z=Math.max(1,Math.min(4,fv.z*(a==="zi"?1.3:1/1.3)));render();const s2=document.getElementById("fvscroll");if(s2)s2.scrollLeft=r*s2.scrollWidth-s2.clientWidth/2;return true}
  if(a==="tab"){fv.tab=b.dataset.t;fv.sel=-1;fv.res=null;fv.rep=null;if(fv.tab==="find")fv.fq=null;if(fv.tab==="fill"){fv.fill=fv.fill||{};fv.pg=0}render();return true}
  if(a==="f"){const i=+b.dataset.i;if(fv.tab==="find"){fvFindTap(i);return true}fvSelect(i,true);return true}
  if(a==="close"){fvSelect(-1);return true}
  if(a==="prev"||a==="next"){if(d&&d.f.length){const n=d.f.length;fvSelect(((fv.sel<0?0:fv.sel)+(a==="next"?1:n-1))%n)}return true}
  if(a==="case"){fv.cs=b.dataset.c;fv.fill={};fv.res=null;fv.rep=null;fv.sel=-1;fv.pg=0;render();return true}
  if(a==="tick"){fv.fill=fv.fill||{};const i=fv.sel;if(fv.fill[i])delete fv.fill[i];else fv.fill[i]=1;fv.res=null;fvRedraw();return true}
  if(a==="set"){const inp=document.getElementById("fvin"),i=fv.sel;fv.fill=fv.fill||{};if(inp){const v=inp.value.trim();if(v==="")delete fv.fill[i];else fv.fill[i]=v.replace(/[$\s]/g,"")}fv.res=null;fvRedraw();return true}
  if(a==="check"){fvCheck();return true}
  if(a==="clear"){fv.fill={};fv.res=null;fv.rep=null;fv.sel=-1;render();return true}
  if(a==="again"){fv.fq=null;fv.res=null;fv.sel=-1;render();return true}
  if(a==="fnext"){fv.fq.i++;fv.fq.st="";fv.res=null;fv.sel=-1;render();window.scrollTo(0,0);return true}
  return true}
function fvRedraw(){const sc=document.getElementById("fvscroll"),x=sc?sc.scrollLeft:0,y=window.scrollY;render();const s2=document.getElementById("fvscroll");if(s2)s2.scrollLeft=x;window.scrollTo(0,y)}
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target&&e.target.id==="fvin"){const b=document.querySelector('[data-fv="set"]');if(b)b.click()}});
const fvExtraView0=extraView;extraView=function(){if(view==="form"){renderForm();return true}return fvExtraView0()};
const fvExtraClick0=extraClick;extraClick=function(b){if(b.dataset.fv!==undefined)return formClick(b);return fvExtraClick0(b)};

/* ---------- every form name in the text becomes a link ---------- */
let FVRE=null;
function fvRegex(){if(FVRE)return FVRE;const bare=[],pre=[],sch=[];Object.keys(FORMNAME).forEach(n=>{const m=/^(Form|Schedule) (.+)$/.exec(n);if(!m)return;if(m[1]==="Schedule")sch.push(m[2]);else{pre.push(m[2]);if(/[A-Z]-?\d|\d-[A-Z]/.test(m[2])&&!/^\d+$/.test(m[2]))bare.push(m[2])}});
  const alt=a=>a.sort((x,y)=>y.length-x.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|");
  return FVRE=new RegExp("\\b(?:Forms?\\s+("+alt(pre)+")|Schedule\\s+("+alt(sch)+")|("+alt(bare)+"))(?![A-Za-z0-9]|-[A-Z0-9])","g")}
function fvKeyOf(m){return m[1]?FORMNAME["Form "+m[1]]:m[2]?FORMNAME["Schedule "+m[2]]:FORMNAME["Form "+m[3]]}
let fvBusy=false;
function fvLinkify(root){if(fvBusy||!root)return;if(view==="kids"||view==="start")return;if(view==="session"&&sess&&sess.mode==="mock")return;
  fvBusy=true;try{root.querySelectorAll("span.gl").forEach(sp=>{const t=sp.textContent,k=FORMNAME[t]||FORMNAME["Form "+t];if(!k||!FORMIDX[k]||sp.closest("button,a,.nolink"))return;const b=document.createElement("button");b.type="button";b.className="frm";b.dataset.fv="open";b.dataset.k=k;b.textContent=t;sp.parentNode.replaceChild(b,sp)});
    const re=fvRegex(),tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{if(!n.nodeValue||n.nodeValue.length<3)return NodeFilter.FILTER_REJECT;const p=n.parentElement;if(!p||p.closest("button,a,input,textarea,select,option,label,script,style,svg,.nolink,[contenteditable]"))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}}),L=[];
    while(tw.nextNode())L.push(tw.currentNode);
    for(const n of L){const t=n.nodeValue;re.lastIndex=0;let m,last=0,fr=null;while((m=re.exec(t))){const k=fvKeyOf(m);if(!k||!FORMIDX[k])continue;fr=fr||document.createDocumentFragment();if(m.index>last)fr.appendChild(document.createTextNode(t.slice(last,m.index)));
        const b=document.createElement("button");b.type="button";b.className="frm";b.dataset.fv="open";b.dataset.k=k;b.textContent=m[0];fr.appendChild(b);last=m.index+m[0].length}
      if(fr){if(last<t.length)fr.appendChild(document.createTextNode(t.slice(last)));n.parentNode.replaceChild(fr,n)}}}catch(e){}fvBusy=false}
(function(){let q=false;const run=()=>{q=false;fvLinkify(document.getElementById("view"))};
  const start=()=>{const V=document.getElementById("view");if(!V||typeof MutationObserver==="undefined")return;new MutationObserver(()=>{if(fvBusy||q)return;q=true;setTimeout(run,12)}).observe(V,{childList:true,subtree:true});run()};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else setTimeout(start,0)})();

/* ---------- entry points: EA Parts 1 to 3 and the bookkeeping course ---------- */
function fvEntryHtml(){return `<div class="fventry"><button class="btn" data-fv="open" data-k="f1040">📄 Form 1040, every box</button><button class="btn" data-fv="lib">All IRS forms</button></div>`}
const fvDoNext0=doNextHtml;doNextHtml=function(){const h=fvDoNext0();try{if(typeof XPU!=="undefined"&&XPU[part]&&h)return h+fvEntryHtml()}catch(e){}return h};
const fvRenderCamp0=renderCamp;renderCamp=function(){fvRenderCamp0();try{if(cv&&cv.scr==="hub"){const s=document.querySelector("#view .section");if(s&&!s.querySelector(".fventry")){const d=document.querySelector("#view .donext")||s.firstElementChild;d.insertAdjacentHTML("afterend",fvEntryHtml())}}}catch(e){}};
const fvRenderBk0=typeof renderBk==="function"?renderBk:null;if(fvRenderBk0)renderBk=function(){fvRenderBk0();try{const V=document.getElementById("view"),d=V.querySelector(".donext");if(d&&!V.querySelector(".fventry"))d.insertAdjacentHTML("afterend",fvEntryHtml())}catch(e){}};

/* Form 8867, Paid Preparer's Due Diligence Checklist, explained box by box (Version 218). Penalty figure: $650 per failure for
   returns filed in 2026 (irs.gov, section 6695(g)); records kept 3 years (Reg. 1.6695-2(b)(4)). Anchored on the line numbers. */
FXR.f8867=[[/^For tax year/,"The tax year of the return this checklist goes with. A new Form 8867 is completed for every return or refund claim that claims one of the four benefits."],
 [/^Taxpayer name/,"The name of the client, exactly as on the return."],
 [/^Taxpayer identification number/,"The client's SSN or ITIN, so the checklist stays matched to the return."],
 [/^Preparer's name/,"The paid preparer who did the due diligence. A nonsigning preparer completes the form and gives it to the signing preparer."],
 [/^Preparer tax identification/,"The preparer's PTIN. The penalty for a due diligence failure falls on the preparer, and the firm can also be penalized."],
 [/^Part I\b/,"Part I is answered for every return. First tick each benefit claimed: the earned income credit, the child credits (CTC, ACTC, ODC), the American opportunity credit, and head of household status. Each one is a separate due diligence duty, and a separate $650 penalty (returns filed in 2026) if it is not met."],
 [/^E ?I ?C\.?$/,"Tick this when the return claims the earned income credit. Then Part II must be answered."],
 [/^C ?T ?C/,"Tick this when the return claims the child tax credit, the additional child tax credit or the credit for other dependents. Then Part III must be answered."],
 [/^A ?O ?T ?C\.?$/,"Tick this when the return claims the American opportunity tax credit. Then Part IV must be answered."],
 [/^H ?O ?H\.?$/,"Tick this when the return uses head of household filing status. Then Part V must be answered."],
 [/(?:^|[.:] )1\. Did you complete/,"Requirement 1: the return is based on what the client told you, or what you reasonably found out, for THIS tax year. Last year's answers cannot simply be copied."],
 [/(?:^|[.:] )2\. If credits/,"Requirement 2, compute the credits: complete the worksheets for each credit (or your own with the same information) and keep them. This is how the amount claimed is shown to be figured correctly."],
 [/(?:^|[.:] )3\. Did you satisfy the knowledge/,"Requirement 3, knowledge: interview the client, ask enough questions, and write down the answers at the time. You must not know, or have reason to know, that any information used is wrong. The test is what a reasonable, well-informed preparer would conclude."],
 [/(?:^|[.:] )4\. Did any information/,"Did anything the client said look incorrect, incomplete or inconsistent? If yes, you must ask more questions (4a) and record them (4b) before you can prepare the return."],
 [/(?:^|[.:] )4a\. /,"When something does not add up, ask reasonable follow-up questions until the facts are correct, complete and consistent. If the client will not answer, the credit cannot be claimed by you."],
 [/(?:^|[.:] )4b\. /,"Write the follow-up questions and answers down at the time you ask them (contemporaneously): what you asked, whom, when, what they said, and how it changed the return."],
 [/(?:^|[.:] )5\. Did you satisfy the record retention/,"Requirement 4, keep records for 3 years: this Form 8867, the worksheets, the documents the client gave you that you relied on, and your notes of how, when and from whom you got the information. Paper or electronic."],
 [/(?:^|[.:] )5\. List those documents/,"Name the client's documents you relied on, if any, for example school or medical records showing where a child lived, or Form 1098-T."],
 [/(?:^|[.:] )6\. Did you ask the taxpayer whether/,"Tell the client that the IRS may ask for proof, and ask whether they could show documents that support the credit or the filing status. You do not have to collect the documents; you have to ask."],
 [/(?:^|[.:] )7\. Did you ask the taxpayer if any of these credits/,"Ask whether the IRS denied or reduced one of these credits in an earlier year. If so, the client may need Form 8862 to claim it again, and a ban of 2 years (reckless disregard) or 10 years (fraud) may apply."],
 [/(?:^|[.:] )7a\. /,"Form 8862 is attached when a credit was denied or reduced for a reason other than a math or clerical error. Tick N/A when it is not required."],
 [/(?:^|[.:] )8\. If the taxpayer is reporting self-employment/,"With self-employment income, ask about the business, its records, all income and all expenses, so that Schedule C is complete and correct. Income that looks made up to reach the largest earned income credit is a warning sign."],
 [/(?:^|[.:] )9a\. /,"Part II, earned income credit. 9a: the client is eligible, and each child claimed meets the relationship, age, residency and joint return tests of a qualifying child. With no child, the client meets the rules for the credit without one."],
 [/(?:^|[.:] )9b\. /,"The child must have lived with the client in the United States for more than half the year. Paying the child's support is not enough for the earned income credit; ask where the child actually lived."],
 [/(?:^|[.:] )9c\. /,"When a child could be the qualifying child of more than one person, explain the tiebreaker rules: a parent comes first; between parents, the one the child lived with longer, then the higher AGI; otherwise the person with the highest AGI."],
 [/(?:^|[.:] )10\. /,"Part III, child credits. Each person claimed must be the client's dependent and a U.S. citizen, national or resident. For the child tax credit the child must also be under 17 and have an SSN valid for work."],
 [/(?:^|[.:] )11\. /,"Explain that the child tax credit needs the child to have lived with the client for more than half the year, unless the custodial parent released the claim to the child."],
 [/(?:^|[.:] )12\. /,"For divorced or separated parents: the noncustodial parent can claim the child tax credit only with Form 8332 (or a similar statement) from the custodial parent attached to the return."],
 [/(?:^|[.:] )13\. /,"Part IV, American opportunity credit. The client should show Form 1098-T and receipts for the tuition and related costs. Check that the student and the costs qualify and that the credit has not been claimed for 4 years already."],
 [/(?:^|[.:] )14\. /,"Part V, head of household. The client must be unmarried or considered unmarried on the last day of the year AND have paid more than half the cost of keeping up a home for a qualifying person. Ask who lived in the home and who paid for it."],
 [/(?:^|[.:] )15\. /,"Part VI: the preparer certifies that every answer is true, correct and complete. The finished form is sent with an e-filed return, or given to the client to attach to a paper return."]];
