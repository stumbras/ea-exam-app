/* ================= Foundation course workout: job math with fresh numbers (shown as 4 choices with teaching) =================
   2026 amounts: Social Security wage base $184,500 (SSA); standard deduction single $16,100 and brackets 10% to $12,400,
   12% to $50,400 (Rev. Proc. 2025-32); business mileage 72.5¢ to June 30 and 76¢ from July 1 (IRS Announcement 2026-11);
   Form 1099-NEC threshold $2,000 for payments made in 2026 (One Big Beautiful Bill Act). Names and numbers invented. */
const m2=x=>"$"+(Math.round(x*100)/100).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
/* ---- Module 1: paychecks and payroll ---- */
GX("pay-net",4,1,"Net pay on a paycheck",()=>{const g=R(600,1800,10),f=R(30,160,1),st=R(15,60,1),ss=g*0.062,md=g*0.0145,a=g-f-ss-md-st;
  return{q:`Weekly gross pay ${m2(g)}. Federal income tax withheld ${m2(f)}, state income tax withheld ${m2(st)}. No other deductions. What is the net pay?`,a,u:"$",
  w:[`Social Security: 6.2% × ${m2(g)} = ${m2(ss)}`,`Medicare: 1.45% × ${m2(g)} = ${m2(md)}`,`Net = gross − federal − Social Security − Medicare − state = ${m2(g)} − ${m2(f)} − ${m2(ss)} − ${m2(md)} − ${m2(st)} = ${m2(a)}`],
  n:"Employee FICA is 7.65% of gross pay (6.2% + 1.45%). Net pay is what lands in the bank."}});
G("pay-ss",4,1,"Social Security near the 2026 wage base",()=>{const w=R(150,240,1)*1000,b=184500,a=Math.min(w,b)*0.062;
  return{q:`An employee earns ${$$(w)} in wages in 2026. How much Social Security tax is withheld from her pay for the year?`,a,
  w:[`2026 wage base: ${$$(b)}. Wages taxed: the smaller of ${$$(w)} and ${$$(b)} = ${$$(Math.min(w,b))}`,`6.2% × ${$$(Math.min(w,b))} = ${$$(a)}`],
  n:w>b?"Social Security stops at the wage base; Medicare (1.45%) has no cap.":"Under the wage base, all wages are taxed at 6.2%."}});
G("pay-er",4,1,"What an employee really costs",()=>{const w=R(30,90,1)*1000,fica=w*0.0765,futa=42,a=w+fica+futa;
  return{q:`A business pays one employee ${$$(w)} in wages for 2026. Count the employer's Social Security and Medicare and federal unemployment tax (0.6% of the first $7,000). Ignore state unemployment tax and benefits. Total cost?`,a,
  w:[`Employer Social Security and Medicare: 7.65% × ${$$(w)} = ${$$(fica)}`,`Federal unemployment: 0.6% × $7,000 = $42`,`Total = ${$$(w)} + ${$$(fica)} + $42 = ${$$(a)}`],
  n:"The employer matches the employee's 7.65%. That's on top of the wage, not taken out of it."}});
GX("pay-ot",4,1,"Overtime pay",()=>{const r=R(32,60,1)/2,h=R(41,52,1),a=40*r+(h-40)*r*1.5;
  return{q:`An hourly employee earns ${m2(r)} an hour and works ${h} hours this week. Overtime is time and a half over 40 hours. Gross pay?`,a,u:"$",
  w:[`Regular: 40 × ${m2(r)} = ${m2(40*r)}`,`Overtime: ${h-40} × ${m2(r)} × 1.5 = ${m2((h-40)*r*1.5)}`,`Gross = ${m2(40*r)} + ${m2((h-40)*r*1.5)} = ${m2(a)}`],n:"Only the hours over 40 get the 1.5 rate."}});
/* ---- Module 2: bookkeeping ---- */
G("brec",4,2,"Bank reconciliation: adjusted bank balance",()=>{const b=R(4000,15000,10),d=R(300,2500,10),c1=R(80,900,5),c2=R(80,900,5),a=b+d-c1-c2;
  return{q:`Bank statement ending balance ${$$(b)}. A deposit of ${$$(d)} is in transit. Checks #1043 for ${$$(c1)} and #1046 for ${$$(c2)} haven't cleared. Adjusted bank balance?`,a,
  w:[`Start with the bank: ${$$(b)}`,`Add the deposit in transit: + ${$$(d)} = ${$$(b+d)}`,`Subtract outstanding checks: − ${$$(c1)} − ${$$(c2)} = ${$$(a)}`],n:"Deposits in transit and outstanding checks fix the BANK side. Bank fees and interest fix the BOOK side."}});
G("brec2",4,2,"Bank reconciliation: adjusted book balance",()=>{const b=R(4000,15000,10),f=PK([12,15,25,35]),i=R(2,18,1),n=R(60,450,5),a=b-f+i-n;
  return{q:`The books show ${$$(b)} in checking. The bank statement shows a ${$$(f)} service fee, ${$$(i)} of interest earned, and a customer's ${$$(n)} check that bounced (NSF). Adjusted book balance?`,a,
  w:[`Start with the books: ${$$(b)}`,`Subtract the fee: − ${$$(f)} = ${$$(b-f)}`,`Add interest: + ${$$(i)} = ${$$(b-f+i)}`,`Subtract the bounced check: − ${$$(n)} = ${$$(a)}`],n:"Each of these needs a journal entry, because the books didn't know about them yet."}});
G("dep",4,2,"Straight-line depreciation for a year",()=>{const c=R(8,60,1)*1000,s=R(0,8,1)*500,l=PK([3,5,7]),a=(c-s)/l;
  return{q:`Equipment cost ${$$(c)}, expected salvage value ${$$(s)}, useful life ${l} years. Yearly straight-line depreciation (book method)?`,a,
  w:[`Depreciable amount: ${$$(c)} − ${$$(s)} = ${$$(c-s)}`,`Per year: ${$$(c-s)} ÷ ${l} = ${$$(a)}`],n:"Subtract salvage first. (Tax depreciation uses MACRS, a different method.)"}});
G("prepaid",4,2,"Prepaid insurance left after some months",()=>{const m=R(80,300,10),p=m*12,k=R(2,10,1),a=p*(12-k)/12;
  return{q:`A business paid ${$$(p)} on January 1 for 12 months of insurance. After the adjusting entry at the end of month ${k}, what's left in Prepaid Insurance?`,a,
  w:[`One month: ${$$(p)} ÷ 12 = ${$$(m)}`,`Used: ${k} × ${$$(m)} = ${$$(m*k)}`,`Left: ${$$(p)} − ${$$(m*k)} = ${$$(a)}`],n:"Each month-end moves one month from the asset to Insurance Expense."}});
GX("gm",4,2,"Gross margin percent",()=>{const s=R(40,200,1)*1000,c=Math.round(s*R(35,70,1)/100),a=(s-c)/s*100;
  return{q:`Sales ${$$(s)}, cost of goods sold ${$$(c)}. Gross margin as a percent of sales?`,a,u:"%",dp:1,
  w:[`Gross profit: ${$$(s)} − ${$$(c)} = ${$$(s-c)}`,`Margin: ${$$(s-c)} ÷ ${$$(s)} = ${a.toFixed(1)}%`],n:"Margin divides by sales. Markup divides by cost: same dollars, different percent."}});
G("cogs",4,2,"Cost of goods sold",()=>{const b=R(5,30,1)*1000,p=R(20,90,1)*1000,e=R(4,30,1)*1000,a=b+p-e;
  return{q:`Beginning inventory ${$$(b)}, purchases during the year ${$$(p)}, ending inventory (counted) ${$$(e)}. Cost of goods sold?`,a,
  w:[`Goods available: ${$$(b)} + ${$$(p)} = ${$$(b+p)}`,`COGS = available − ending: ${$$(b+p)} − ${$$(e)} = ${$$(a)}`],n:"Ending inventory is still on the shelf, so it's not a cost yet."}});
G("ar",4,2,"Accounts receivable at month end",()=>{const b=R(3,20,1)*1000,s=R(5,40,1)*1000,c=R(3,Math.floor((b+s)/1000)-1,1)*1000,w=PK([0,0,250,400,600]),a=b+s-c-w;
  return{q:`Accounts receivable started the month at ${$$(b)}. Credit sales were ${$$(s)}, customer payments ${$$(c)}${w?`, and a ${$$(w)} invoice was written off`:""}. Ending balance?`,a,
  w:[`${$$(b)} + credit sales ${$$(s)} = ${$$(b+s)}`,`− payments ${$$(c)} = ${$$(b+s-c)}`,w?`− write-off ${$$(w)} = ${$$(a)}`:`No write-offs: ${$$(a)}`],n:"Cash sales never touch receivables."}});
/* ---- Module 3: QuickBooks money work ---- */
GX("stax",4,3,"Sales tax on a sale",()=>{const p=R(20,900,1)+PK([0,0.5,0.99,0.25]),r=PK([7.5,8,8.31,8.81,4.9]),a=p*r/100;
  return{q:`A customer buys ${m2(p)} of taxable products. The combined sales tax rate is ${r}%. How much sales tax does the business collect?`,a,u:"$",
  w:[`${m2(p)} × ${r}% = ${m2(a)}`,`The customer pays ${m2(p+a)}; the tax part goes to Sales Tax Payable, not revenue.`],n:"Sales tax isn't income. The business holds it for the state."}});
GX("disc",4,3,"Paying a bill early: 2/10, net 30",()=>{const b=R(500,9000,10),a=b*0.98;
  return{q:`A vendor bill for ${m2(b)} has terms 2/10, net 30. You pay on day 8. How much do you pay?`,a,u:"$",
  w:[`2/10 means 2% off if paid within 10 days`,`Discount: 2% × ${m2(b)} = ${m2(b*0.02)}`,`Pay: ${m2(b)} − ${m2(b*0.02)} = ${m2(a)}`],n:"After day 10 the full amount is due by day 30."}});
/* ---- Module 4: individual returns ---- */
G("ti",4,4,"Taxable income, single, 2026",()=>{const w=R(28,90,1)*1000,i=R(0,900,10),a=w+i-16100;
  return{q:`A single filer in 2026 has wages of ${$$(w)} and ${$$(i)} of bank interest. No adjustments, takes the standard deduction. Taxable income?`,a,
  w:[`Total income: ${$$(w)} + ${$$(i)} = ${$$(w+i)}`,`2026 standard deduction, single: $16,100`,`Taxable income: ${$$(w+i)} − $16,100 = ${$$(a)}`],n:"The standard deduction comes off after AGI."}});
G("tax2",4,4,"Tax on taxable income, single, 2026",()=>{const t=R(14,50,1)*1000,a=1240+0.12*(t-12400);
  return{q:`A single filer's 2026 taxable income is ${$$(t)}. Using the 2026 brackets (10% up to $12,400, 12% up to $50,400), what is the regular income tax?`,a,
  w:[`First $12,400 at 10% = $1,240`,`The rest: (${$$(t)} − $12,400) × 12% = ${$$(0.12*(t-12400))}`,`Tax = $1,240 + ${$$(0.12*(t-12400))} = ${$$(a)}`],n:"Brackets tax each slice at its own rate; the whole income isn't taxed at 12%."}});
G("mile",4,4,"2026 business mileage: two rates",()=>{const h1=R(800,6000,50),h2=R(800,6000,50),a=h1*0.725+h2*0.76;
  return{q:`A self-employed client logged ${h1.toLocaleString()} business miles from January to June 2026 and ${h2.toLocaleString()} from July to December. Standard mileage deduction?`,a,
  w:[`January to June: ${h1.toLocaleString()} × $0.725 = ${$$(h1*0.725)}`,`July to December: ${h2.toLocaleString()} × $0.76 = ${$$(h2*0.76)}`,`Total: ${$$(a)}`],n:"The IRS raised the 2026 rate to 76¢ from July 1, so each half of the year uses its own rate. A mileage log is required."}});
G("ctc",4,4,"Child tax credit, 2025",()=>{const k=R(1,4,1),a=k*2200;
  return{q:`A married couple's 2025 return has ${k} qualifying ${k>1?"children":"child"} under 17, and income well under the phase-out. How much is the child tax credit before any limit by tax owed?`,a,
  w:[`2025 child tax credit: $2,200 per qualifying child (One Big Beautiful Bill Act)`,`${k} × $2,200 = ${$$(a)}`],n:"The child must be under 17 at the end of the year and have a valid SSN."}});
/* ---- Module 5: self-employed clients and the office ---- */
G("se-tax",4,5,"Self-employment tax",()=>{const p=R(20,120,1)*1000,b=p*0.9235,a=b*0.153;
  return{q:`A sole proprietor's 2026 Schedule C net profit is ${$$(p)}. No wages from a job. Self-employment tax?`,a,
  w:[`Net earnings: ${$$(p)} × 92.35% = ${$$(b)}`,`SE tax: ${$$(b)} × 15.3% = ${$$(a)}`,`Half of it (${$$(a/2)}) is an adjustment to income on Schedule 1.`],n:"Multiply by 92.35% first. 15.3% is both halves of Social Security and Medicare."}});
G("se-schc",4,5,"Schedule C net profit",()=>{const g=R(40,140,1)*1000,s=R(2,9,1)*1000,m=R(4,20,1)*100,ad=R(5,30,1)*100,a=g-s-m*0.5-ad;
  return{q:`A consultant's 2026 gross receipts are ${$$(g)}. Expenses: software and supplies ${$$(s)}, business meals ${$$(m)}, advertising ${$$(ad)}. Net profit?`,a,
  w:[`Meals are 50% deductible: ${$$(m)} × 50% = ${$$(m*0.5)}`,`Expenses: ${$$(s)} + ${$$(m*0.5)} + ${$$(ad)} = ${$$(s+m*0.5+ad)}`,`Net profit: ${$$(g)} − ${$$(s+m*0.5+ad)} = ${$$(a)}`],n:"Business meals are only half deductible. Entertainment isn't deductible at all."}});
G("se-est",4,5,"Quarterly estimated tax, safe harbor",()=>{const t=R(4,24,1)*1000,a=t/4;
  return{q:`A self-employed client's total 2026 tax was ${$$(t)}; her AGI was under $150,000. To be safe from the underpayment penalty for 2027 using the prior-year rule, how much is each quarterly payment?`,a,
  w:[`Prior-year safe harbor: pay 100% of last year's tax (110% if AGI was over $150,000)`,`${$$(t)} ÷ 4 = ${$$(a)} each, due April 15, June 15, September 15 and January 15`],n:"Paying 100% of last year's tax in four equal installments avoids the penalty even if this year's tax is higher."}});
G("ftp",4,5,"Failure-to-pay penalty",()=>{const u=R(2,20,1)*500,m=R(1,8,1),a=u*0.005*m;
  return{q:`A client filed on time but paid ${$$(u)} of tax ${m} month${m>1?"s":""} late. Failure-to-pay penalty (0.5% per month)? Ignore interest.`,a,
  w:[`0.5% × ${m} month${m>1?"s":""} = ${(0.5*m).toFixed(1)}%`,`${$$(u)} × ${(0.5*m).toFixed(1)}% = ${$$(a)}`],n:"Failure to FILE is 5% a month: ten times worse. Always file on time."}});
G("n1099",4,5,"How many 1099-NEC forms? (2026 payments)",()=>{const ppl=[["Leo, sole proprietor",R(21,40,1)*100,0],["Ana, sole proprietor",R(5,19,1)*100,0],["Kim, sole proprietor",R(20,60,1)*100,0],["Quick Print Inc.",R(20,50,1)*100,1],["Dan, sole proprietor",R(10,30,1)*100,0]];
  const need=ppl.filter(p=>!p[2]&&p[1]>=2000),a=need.length;
  return{q:`In 2026 a client paid these contractors for services: ${ppl.map(p=>`${p[0]} ${$$(p[1])}`).join("; ")}. How many need a Form 1099-NEC?`,a,u:"",
  w:[`2026 threshold: $2,000 or more to one payee`,`Corporations generally don't get one: Quick Print Inc. is out`,`Sole proprietors at $2,000 or more: ${need.map(p=>p[0].split(",")[0]).join(", ")||"none"}`,`Count: ${a}`],n:"The old $600 rule applies only to payments made in 2025 and earlier."}});
