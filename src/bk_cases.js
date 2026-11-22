// Bookkeeping · QuickBooks · Taxes: practice cases. All people, employers and numbers are invented.
// LAB({t:title, d:module, kind:"tax"|"qbo"|"books"|"client", intro, docs:[drawings], panel:{live form or screen}, steps:[...], end})
// step: {q, type:"num", ans, key?, why}  or  {q, type:"pick", opts:[correct, wrong...], key?, disp?, why}
const MENU=["Invoice","Receive payment","Sales receipt","Bill","Pay bills","Expense","Transfer","Journal entry"];
const menu=c=>[c].concat(MENU.filter(x=>x!==c)).slice(0,5);
const F1040=[["status","Filing status"],["1a","1a  Wages (W-2 box 1)"],["2b","2b  Taxable interest"],["9","9  Total income"],["11a","11a  Adjusted gross income"],["12e","12e  Standard deduction"],["15","15  Taxable income"],["16","16  Tax"],["19","19  Child tax credit"],["24","24  Total tax"],["25a","25a  Federal tax withheld (W-2 box 2)"],["34","34  Refund"],["37","37  Amount you owe"]];
const f1040=keys=>({k:"form",n:"Form 1040 (2025)",s:"Fills in as you answer",r:F1040.filter(r=>keys.includes(r[0])).map(r=>[r[0],r[1].replace(/^\d\S*\s+/,"")])});

LAB({t:"Mock return 1: one job, one bank account",d:4,kind:"tax",
 intro:"Rowan Hale, age 32, single all year, U.S. citizen, no dependents, nobody can claim Rowan. Tax year 2025. No adjustments, no credits, no other income. Prepare the federal return from the two documents.",
 docs:[{k:"form",n:"Form W-2 (2025)",s:"Plain Works Inc · employee: Rowan Hale",r:[["1","Wages, tips, other compensation","45,500.00"],["2","Federal income tax withheld","4,000.00"],["3","Social security wages","45,500.00"],["4","Social security tax withheld","2,821.00"],["5","Medicare wages and tips","45,500.00"],["6","Medicare tax withheld","659.75"]]},
  {k:"form",n:"Form 1099-INT (2025)",s:"Plain Bank · recipient: Rowan Hale",r:[["1","Interest income","250.00"],["4","Federal income tax withheld","0.00"]]},
  {k:"doc",n:"2025 TAX TABLE (extract)",s:"If taxable income is at least / but less than → Single",r:[["29,950 – 30,000","3,359"],["30,000 – 30,050","3,365"],["30,050 – 30,100","3,371"],["30,250 – 30,300","3,395"]]}],
 panel:f1040(["status","1a","2b","9","11a","12e","15","16","24","25a","34"]),
 steps:[
  {q:"Which filing status applies?",type:"pick",key:"status",opts:["Single","Head of household","Married filing jointly","Qualifying surviving spouse"],why:"Unmarried on December 31 with no qualifying person in the home."},
  {q:"Line 1a, wages. Which amount do you enter?",type:"num",ans:45500,key:"1a",why:"W-2 box 1."},
  {q:"Line 2b, taxable interest.",type:"num",ans:250,key:"2b",why:"1099-INT box 1."},
  {q:"Line 9, total income.",type:"num",ans:45750,key:"9",why:"$45,500 + $250."},
  {q:"Line 11a, adjusted gross income.",type:"num",ans:45750,key:"11a",why:"There are no adjustments, so AGI equals total income."},
  {q:"Line 12e, the standard deduction for a single filer in 2025.",type:"num",ans:15750,key:"12e",why:"$15,750 for single in 2025 ($16,100 for 2026)."},
  {q:"Line 15, taxable income.",type:"num",ans:30000,key:"15",why:"$45,750 − $15,750."},
  {q:"Line 16, tax. Use the Tax Table extract.",type:"num",ans:3365,key:"16",why:"Row $30,000 to $30,050, Single column. With no credits or other taxes, line 24 is the same."},
  {q:"Line 25a, federal income tax withheld.",type:"num",ans:4000,key:"25a",why:"W-2 box 2 only. Boxes 4 and 6 are Social Security and Medicare, separate payroll taxes that are never added here."},
  {q:"Line 34, the refund.",type:"num",ans:635,key:"34",why:"Payments $4,000 − total tax $3,365."},
  {q:"Rowan asks why the $3,480.75 of Social Security and Medicare does not come back too. What is the right answer?",type:"pick",opts:["Those are separate payroll taxes for Social Security and Medicare, not income tax paid in advance","It will come back next year","The employer made a mistake","It is refunded by the state"],why:"Only federal income tax withholding is a payment toward the income tax."}],
 end:"Check a finished return the same way every time: income matches the documents, the deduction fits the status, the tax fits the table, payments are only income tax withheld."});

LAB({t:"Mock return 2: same client, now a balance due",d:4,kind:"tax",
 intro:"Rowan's facts change: interest is $500 and federal withholding is $3,300. Wages stay $45,500. Single, 2025, standard deduction.",
 docs:[{k:"form",n:"Form W-2 (2025)",s:"Plain Works Inc",r:[["1","Wages","45,500.00"],["2","Federal income tax withheld","3,300.00"],["4","Social security tax withheld","2,821.00"],["6","Medicare tax withheld","659.75"]]},
  {k:"form",n:"Form 1099-INT (2025)",s:"Plain Bank",r:[["1","Interest income","500.00"]]},
  {k:"doc",n:"2025 TAX TABLE (extract)",s:"Single",r:[["30,000 – 30,050","3,365"],["30,200 – 30,250","3,389"],["30,250 – 30,300","3,395"],["30,300 – 30,350","3,401"]]}],
 panel:f1040(["9","12e","15","16","25a","37"]),
 steps:[
  {q:"Line 9, total income.",type:"num",ans:46000,key:"9",why:"$45,500 + $500."},
  {q:"Line 12e, standard deduction.",type:"num",ans:15750,key:"12e",why:"Single, 2025."},
  {q:"Line 15, taxable income.",type:"num",ans:30250,key:"15",why:"$46,000 − $15,750."},
  {q:"Line 16, tax from the table.",type:"num",ans:3395,key:"16",why:"Row $30,250 to $30,300. An amount exactly on the lower edge belongs to that row."},
  {q:"Line 25a, federal income tax withheld.",type:"num",ans:3300,key:"25a",why:"W-2 box 2."},
  {q:"Line 37, the amount Rowan owes.",type:"num",ans:95,key:"37",why:"Tax $3,395 − payments $3,300."},
  {q:"A trainee added W-2 box 4 to the payments and showed a refund. What is wrong?",type:"pick",opts:["Box 4 is Social Security tax, not income tax withheld","Nothing; all withheld tax counts","Box 4 should be subtracted from wages","Only half of box 4 counts"],why:"Line 25a takes box 2 only."},
  {q:"What do you tell Rowan about paying?",type:"pick",opts:["$95 is due by April 15; it can be paid from a bank account when the return is e-filed","Nothing is due until the IRS sends a bill","It can wait until October with an extension","Pay the preparer, who forwards it"],why:"An extension never extends the time to pay."}]});

LAB({t:"Mock return 3: a parent and a child",d:4,kind:"tax",
 intro:"Maya Ortiz, 34, was never married. Her son Leo, age 8, lived with her all of 2025. She paid all the costs of the home. Leo has a Social Security number and no income. One W-2. Tax year 2025.",
 docs:[{k:"form",n:"Form W-2 (2025)",s:"Harbor Dental Group · employee: Maya Ortiz",r:[["1","Wages, tips, other compensation","52,000.00"],["2","Federal income tax withheld","3,400.00"],["4","Social security tax withheld","3,224.00"],["6","Medicare tax withheld","754.00"]]},
  {k:"doc",n:"2025 TAX TABLE (extract)",s:"Head of household",r:[["28,300 – 28,350","3,059"],["28,350 – 28,400","3,065"],["28,400 – 28,450","3,071"]]}],
 panel:f1040(["status","1a","11a","12e","15","16","19","24","25a","34"]),
 steps:[
  {q:"Is Leo a qualifying child of Maya?",type:"pick",opts:["Yes: her son, under 19, lived with her more than half the year, did not support himself","No: he has no income","No: he is over 6","Only if the father agrees"],why:"Relationship, age, residence and support tests are all met."},
  {q:"Which filing status applies?",type:"pick",key:"status",opts:["Head of household","Single","Married filing separately","Qualifying surviving spouse"],why:"Unmarried, paid more than half the cost of the home, and a qualifying child lived there more than half the year."},
  {q:"Line 1a, wages.",type:"num",ans:52000,key:"1a",why:"W-2 box 1."},
  {q:"Line 11a, AGI. There are no adjustments.",type:"num",ans:52000,key:"11a",why:"Same as total income."},
  {q:"Line 12e, standard deduction for head of household, 2025.",type:"num",ans:23625,key:"12e",why:"$23,625 for 2025 ($24,150 for 2026)."},
  {q:"Line 15, taxable income.",type:"num",ans:28375,key:"15",why:"$52,000 − $23,625."},
  {q:"Line 16, tax from the head of household table.",type:"num",ans:3065,key:"16",why:"Row $28,350 to $28,400."},
  {q:"Line 19, child tax credit for Leo.",type:"num",ans:2200,key:"19",why:"$2,200 for a qualifying child under 17 with a Social Security number. The tax is large enough to use all of it."},
  {q:"Line 24, total tax after the credit.",type:"num",ans:865,key:"24",why:"$3,065 − $2,200."},
  {q:"Line 25a, federal income tax withheld.",type:"num",ans:3400,key:"25a",why:"W-2 box 2."},
  {q:"Line 34, the refund.",type:"num",ans:2535,key:"34",why:"$3,400 − $865."},
  {q:"This return claims head of household and the child tax credit. What must the paid preparer also complete?",type:"pick",opts:["Form 8867, the due diligence checklist, with notes of the questions asked","Form 8962","Form 4868","Nothing extra"],why:"Record who lived in the home, for how long, and who paid the costs, and keep the notes 3 years."}],
 end:"Maya's wages are above the earned income credit limit for one child in 2025, so no EITC applies here. The software checks this, but you should know why a credit does or does not appear."});

LAB({t:"Mock return 4: a freelancer's Schedule C",d:5,kind:"tax",
 intro:"Nina Park is a single freelance designer who keeps cash-basis records. In 2025 one corporate client paid her $8,500 and sent a Form 1099-NEC. Other customers paid $3,500 with no forms. Her bank account also shows a $1,000 deposit that was a loan from her bank. She paid advertising $800, office expense $500 and office rent $700, all with receipts. She took $2,000 out for personal use.",
 docs:[{k:"form",n:"Form 1099-NEC (2025)",s:"Brightline Corp · recipient: Nina Park",r:[["1","Nonemployee compensation","8,500.00"],["4","Federal income tax withheld","0.00"]]},
  {k:"doc",n:"BANK SUMMARY 2025",s:"Nina Park Design · business checking",r:[["Deposits from Brightline Corp","8,500.00"],["Deposits from other customers","3,500.00"],["Loan proceeds, First Bank","1,000.00"],["Advertising","−800.00"],["Office expense","−500.00"],["Office rent","−700.00"],["Transfers to personal account","−2,000.00"]]}],
 panel:{k:"form",n:"Schedule C (Form 1040)",s:"Profit or Loss From Business",r:[["1","Gross receipts"],["8","Advertising"],["18","Office expense"],["20b","Rent, other business property"],["28","Total expenses"],["31","Net profit"],["se","Schedule SE: net earnings"],["tax","Schedule SE: self-employment tax"],["half","Schedule 1: deduction for half"]]},
 steps:[
  {q:"Line 1, gross receipts.",type:"num",ans:12000,key:"1",why:"$8,500 + $3,500. The 1099-NEC is part of the total, not an extra. The loan is not income."},
  {q:"How is the $1,000 loan deposit treated?",type:"pick",opts:["Left out of income; a loan is not income","Added to gross receipts","Entered as other income","Subtracted as an expense"],why:"Borrowed money must be repaid, so it is not income."},
  {q:"Line 8, advertising.",type:"num",ans:800,key:"8",why:"From the records."},
  {q:"Line 18, office expense.",type:"num",ans:500,key:"18",why:"From the records."},
  {q:"Line 20b, rent of business property.",type:"num",ans:700,key:"20b",why:"From the records."},
  {q:"Where do the $2,000 transfers to her personal account go?",type:"pick",opts:["Nowhere on Schedule C; owner draws are not an expense","Line 26, wages","Line 27, other expenses","Line 1, as a reduction of receipts"],why:"A sole proprietor cannot pay herself wages. Draws are just profit taken out."},
  {q:"Line 28, total expenses.",type:"num",ans:2000,key:"28",why:"$800 + $500 + $700."},
  {q:"Line 31, net profit.",type:"num",ans:10000,key:"31",why:"$12,000 − $2,000."},
  {q:"Schedule SE: net earnings from self-employment (net profit × 92.35%).",type:"num",ans:9235,key:"se",why:"$10,000 × 0.9235."},
  {q:"Self-employment tax (15.3%), to the nearest dollar.",type:"num",ans:1413,key:"tax",tol:1,why:"$9,235 × 0.153 = $1,412.96."},
  {q:"Deduction for half of self-employment tax, to the nearest dollar.",type:"num",ans:706,key:"half",tol:1,why:"$1,412.96 ÷ 2 = $706.48. It goes on Schedule 1 as an adjustment."},
  {q:"Nina had no tax withheld all year. What should she start doing?",type:"pick",opts:["Make quarterly estimated tax payments","Nothing; freelancers pay only in April","Ask clients to stop sending 1099 forms","File Form W-4 with her clients"],why:"Estimated payments are due April 15, June 15, September 15 and January 15."}],
 end:"Net profit flows to Schedule 1 and into income. Self-employment tax flows to Schedule 2. Most freelancers also get the 20% qualified business income deduction."});

LAB({t:"Tax software: enter a W-2 and clear the diagnostics",d:5,kind:"tax",
 intro:"You are entering a return in professional tax software. The client, Devon Reyes, uploaded this W-2 through the portal. Type each amount into the input screen exactly as printed.",
 docs:[{k:"form",n:"Form W-2 (2025)",s:"Summit Freight LLC · EIN 84-0000000 · employee: Devon Reyes",r:[["1","Wages, tips, other compensation","41,000.00"],["2","Federal income tax withheld","3,600.00"],["3","Social security wages","44,000.00"],["4","Social security tax withheld","2,728.00"],["5","Medicare wages and tips","44,000.00"],["6","Medicare tax withheld","638.00"],["12","Code D (401(k) contributions)","3,000.00"],["16","State wages (CO)","41,000.00"],["17","State income tax (CO)","1,640.00"]]}],
 panel:{k:"scr",n:"Tax software ▸ Income ▸ Wages (W-2)",r:[["b1","Box 1  Wages"],["b2","Box 2  Federal tax withheld"],["b3","Box 3  Social security wages"],["b4","Box 4  Social security tax"],["b12","Box 12  Code and amount"],["b16","Box 16  State wages"],["b17","Box 17  State income tax"]]},
 steps:[
  {q:"Box 1, wages.",type:"num",ans:41000,key:"b1",why:"Type box 1 as printed, not box 3."},
  {q:"Box 2, federal income tax withheld.",type:"num",ans:3600,key:"b2",why:"As printed."},
  {q:"Box 3, Social Security wages.",type:"num",ans:44000,key:"b3",why:"As printed."},
  {q:"Why is box 1 lower than box 3?",type:"pick",opts:["The $3,000 put into the 401(k) is left out of box 1 but still counts for Social Security","The employer made an error","Box 3 includes state tax","Box 1 is after income tax"],why:"Box 12 code D explains the $3,000 difference. No correction is needed."},
  {q:"Box 4, Social Security tax withheld.",type:"num",ans:2728,key:"b4",why:"As printed. The software checks that it is 6.2% of box 3."},
  {q:"Box 12: which code and amount?",type:"pick",key:"b12",opts:["D  3,000.00","DD  3,000.00","W  3,000.00","Leave it blank"],why:"Code D is 401(k) deferrals. It can also matter for the saver's credit, so never skip box 12."},
  {q:"Box 16, state wages.",type:"num",ans:41000,key:"b16",why:"As printed."},
  {q:"Box 17, state income tax withheld.",type:"num",ans:1640,key:"b17",why:"This feeds the Colorado return, not the federal one."},
  {q:"Diagnostics shows: \"Employer EIN missing.\" What do you do?",type:"pick",opts:["Enter the EIN from the W-2; e-file will reject without it","Ignore it; the refund is unchanged","Type any nine digits","Delete the W-2"],why:"A missing or wrong EIN is a common cause of rejected returns."},
  {q:"Diagnostics is now clear. Before setting the status to ready for review, what do you compare?",type:"pick",opts:["Wages and withholding on the forms view against the paper W-2, and this year against last year","Only the refund amount against the client's hope","Nothing; clear diagnostics means correct","The software version"],why:"Diagnostics find missing entries. They cannot find a number typed wrong."}]});

LAB({t:"QuickBooks: a sale from invoice to bank",d:3,kind:"qbo",
 intro:"You keep the books for Oak Studio in QuickBooks Online. On December 5 the studio finished one hour of design for a customer, Pine Desk, for $100. Pine Desk will pay later. Before you start: Sales income $0, Accounts Receivable $0, Checking $5,000.",
 docs:[{k:"doc",n:"OAK STUDIO · WORK ORDER",s:"Customer: Pine Desk · Dec 5, 2025",r:[["Design, 1 hour @ $100","100.00"],["Sales tax","0.00"],["Total, due in 30 days","100.00",1]]}],
 panel:{k:"scr",n:"+ New ▸ Invoice",r:[["form","Form opened"],["cust","Customer"],["item","Product/Service"],["amt","Amount"],["dep","Later: payment deposited to"],["open","Open balance after the payment"]]},
 steps:[
  {q:"Click + New. Which form records this sale?",type:"pick",key:"form",opts:menu("Invoice"),why:"The customer will pay later, so the sale goes on an invoice."},
  {q:"Which name goes in the Customer field?",type:"pick",key:"cust",opts:["Pine Desk","Oak Studio","Checking","Design"],why:"The customer is the one who pays. Oak Studio is the company itself."},
  {q:"Which Product/Service do you choose?",type:"pick",key:"item",opts:["Design (income account: Services)","Advertising","Checking","Owner's Draw"],why:"The item decides the income account the sale posts to."},
  {q:"Amount of the invoice.",type:"num",ans:100,key:"amt",why:"1 hour × $100."},
  {q:"You save the invoice. What changed in the books?",type:"pick",opts:["Accounts Receivable +$100 and Services income +$100","Checking +$100 and income +$100","Nothing until the customer pays","Accounts Payable +$100"],why:"Debit Accounts Receivable, credit income. No money has arrived.",show:{k:"je",r:[["Accounts Receivable","100.00",""],["Services (income)","","100.00"]],n:"What QuickBooks posted for the invoice."}},
  {q:"December 12: Pine Desk pays $60. Which form do you open?",type:"pick",opts:menu("Receive payment"),why:"The money is for an existing invoice."},
  {q:"In the Deposit to field, which account do you choose? The money went straight into the bank.",type:"pick",key:"dep",opts:["Checking","Services","Accounts Receivable","Owner's Investment"],why:"Deposit to is where the money landed."},
  {q:"What is the invoice's open balance after applying the $60?",type:"num",ans:40,key:"open",why:"$100 − $60.",show:{k:"je",r:[["Checking","60.00",""],["Accounts Receivable","","60.00"]],n:"What QuickBooks posted for the payment."}},
  {q:"What is Services income on the Profit and Loss (accrual) now?",type:"num",ans:100,why:"The payment did not add income. The invoice already recorded the sale."},
  {q:"What is the Checking balance now?",type:"num",ans:5060,why:"$5,000 + $60."},
  {q:"Next morning the bank feed shows: DEPOSIT +$60.00. What do you click?",type:"pick",opts:["Match, to the payment already recorded","Add, as Services income","Add, as Owner's Investment","Exclude"],why:"Adding it would record a second $60 sale and overstate income."}],
 end:"Invoice, Receive payment, then Match. Three steps, one sale, recorded once."});

LAB({t:"QuickBooks: a week of money going out",d:3,kind:"qbo",
 intro:"Same company, Oak Studio. Handle each document that arrived this week. Choose the form from what really happened.",
 docs:[{k:"doc",n:"PRACTICE PRINTER CO. · INVOICE 2207",s:"Bill to: Oak Studio · Dec 8, 2025",r:[["Flyers for holiday promotion","75.00"],["Terms","Net 30"],["Amount due","75.00",1]]},
  {k:"doc",n:"SHELL · RECEIPT",s:"Dec 9, 2025 · Debit card ending 4410",r:[["Fuel, delivery van","41.20"],["Paid","41.20",1]]},
  {k:"doc",n:"GREEN GROCER · RECEIPT",s:"Dec 10, 2025 · Business debit card ending 4410",r:[["Groceries (owner's household)","63.00"],["Paid","63.00",1]]}],
 panel:{k:"scr",n:"Your work this week",r:[["a","Printer invoice, due in 30 days"],["a2","Category for the flyers"],["b","Fuel receipt, already paid"],["c","Owner's groceries on the business card"],["d","Dec 22: paying the printer"],["e","$300 from checking to savings"]]},
 steps:[
  {q:"The printer's invoice is due in 30 days. Which form?",type:"pick",key:"a",opts:menu("Bill"),why:"A bill records the cost now and tracks what is owed."},
  {q:"Which category (account) for the flyers?",type:"pick",key:"a2",opts:["Advertising","Office Supplies","Cost of Goods Sold","Owner's Draw"],why:"Promotional printing is advertising."},
  {q:"The fuel was paid by debit card on the spot. Which form?",type:"pick",key:"b",opts:menu("Expense"),why:"Paid immediately, no bill: Expense, with Checking as the payment account."},
  {q:"The owner bought household groceries with the business card. How do you categorize it?",type:"pick",key:"c",disp:"Expense → Owner's Draw",opts:["Owner's Draw (equity)","Meals expense","Office Supplies","Leave it out of the books"],why:"The money left the business bank, so it must be recorded, but personal spending is a draw, not an expense."},
  {q:"December 22: you pay the printer's $75 invoice from Checking. Which form?",type:"pick",key:"d",opts:menu("Pay bills"),why:"Pay bills closes the open bill. A new Expense would count the $75 twice and leave the bill unpaid in the books."},
  {q:"After paying, what does the vendor's open balance show?",type:"num",ans:0,why:"The bill is closed."},
  {q:"The owner moves $300 from business checking to business savings. Which form?",type:"pick",key:"e",opts:menu("Transfer"),why:"Money between the company's own accounts is a transfer. It is not income or expense."},
  {q:"How much do this week's documents add to expenses on the Profit and Loss?",type:"num",ans:116.2,tol:0.01,why:"Advertising $75.00 + fuel $41.20. The groceries are a draw and the transfer is not an expense."},
  {q:"What do you attach to the fuel expense?",type:"pick",opts:["A photo of the receipt","Nothing","The bank statement for the year","The owner's ID"],why:"The receipt is the evidence for the entry."}]});

LAB({t:"QuickBooks: the morning bank feed",d:3,kind:"qbo",
 intro:"Five lines are waiting For review in Oak Studio's bank feed. For each one decide: Match, Add, Transfer or Exclude. Already recorded in QuickBooks: a $240 payment received from customer Practice Oak, and a $75 bill payment to Practice Printer.",
 docs:[{k:"doc",n:"FIRST BANK · CHECKING · DOWNLOADED",s:"For review (5)",r:[["12/15 DEPOSIT","+240.00"],["12/16 CHECK 1042 PRACTICE PRINTER","−75.00"],["12/16 CITY POWER & LIGHT","−88.40"],["12/17 TRANSFER TO SAVINGS 7731","−300.00"],["12/17 CITY POWER & LIGHT","−88.40"]]}],
 panel:{k:"scr",n:"Bank transactions ▸ For review",r:[["l1","12/15 DEPOSIT +240.00"],["l2","12/16 CHECK 1042 −75.00"],["l3","12/16 CITY POWER −88.40"],["l4","12/17 TRANSFER −300.00"],["l5","12/17 CITY POWER −88.40 (again)"]]},
 steps:[
  {q:"12/15 DEPOSIT +$240.00",type:"pick",key:"l1",opts:["Match to the payment from Practice Oak","Add as Services income","Add as Owner's Investment","Exclude"],why:"The payment is already in the books. Matching links the two."},
  {q:"12/16 CHECK 1042 PRACTICE PRINTER −$75.00",type:"pick",key:"l2",opts:["Match to the bill payment","Add as Advertising","Add as Owner's Draw","Transfer"],why:"The bill payment was recorded with Pay bills."},
  {q:"12/16 CITY POWER & LIGHT −$88.40. Nothing is recorded yet; the client confirms it is the studio's electric bill.",type:"pick",key:"l3",opts:["Add, category Utilities","Match","Transfer","Add, category Owner's Draw"],why:"Not yet in the books, and a business cost: Add with the right category."},
  {q:"12/17 TRANSFER TO SAVINGS −$300.00",type:"pick",key:"l4",opts:["Transfer, to the Savings account","Add as an expense","Add as Owner's Draw","Exclude"],why:"The money moved between the company's own accounts."},
  {q:"12/17 CITY POWER & LIGHT −$88.40 appears a second time. The bank statement shows only one such payment.",type:"pick",key:"l5",opts:["Exclude; it is a duplicate download","Add as Utilities again","Match to the first one and add both","Transfer"],why:"A duplicate line would double the expense. Excluding removes it without touching the books."},
  {q:"After this work, how much did Utilities expense increase?",type:"num",ans:88.4,tol:0.01,why:"One electric bill."},
  {q:"The client asks why you did not just click Add on everything. What is the short answer?",type:"pick",opts:["Adding lines that are already recorded would count the same money twice","Add is slower","Match is required by the bank","There is no difference"],why:"Look for an existing transaction first, every time."}]});

LAB({t:"QuickBooks: reconcile December",d:3,kind:"qbo",
 intro:"Reconcile Oak Studio's checking account for December. The books show a Checking balance of $5,950. One check, number 1043 for $100 of supplies written December 29, has not reached the bank.",
 docs:[{k:"doc",n:"FIRST BANK · STATEMENT",s:"Oak Studio · Checking · Dec 1 – Dec 31, 2025",r:[["Beginning balance","0.00"],["Deposits and credits (4)","6,400.00"],["Checks and debits (2)","−350.00"],["Service charge","−15.00"],["Ending balance, Dec 31","6,035.00",1]]}],
 panel:{k:"scr",n:"Transactions ▸ Reconcile",r:[["acct","Account"],["bal","Ending balance"],["date","Ending date"],["fee","Service charge"],["chk","Check 1043, $100"],["diff","Difference"]]},
 steps:[
  {q:"Which account do you choose?",type:"pick",key:"acct",opts:["Checking","Accounts Receivable","Services","Owner's Draw"],why:"You reconcile the account the statement belongs to."},
  {q:"Ending balance to enter.",type:"num",ans:6035,key:"bal",why:"The statement's ending balance, not the balance in the books."},
  {q:"Ending date to enter.",type:"pick",key:"date",opts:["12/31/2025","12/29/2025","01/01/2026","Today's date"],why:"The statement's ending date."},
  {q:"The $15 service charge is on the statement but not in the books. What do you do?",type:"pick",key:"fee",disp:"Added: Bank Charges 15.00",opts:["Record it as a Bank Charges expense, then tick it","Leave it unticked","Tick the supplies check instead","Change the ending balance to $6,050"],why:"The bank already took the money. The books must show it."},
  {q:"What is the Checking balance in the books after recording the fee?",type:"num",ans:5935,why:"$5,950 − $15."},
  {q:"Check 1043 for $100 is not on the statement. What do you do with it?",type:"pick",key:"chk",disp:"Left unticked (outstanding)",opts:["Leave it unticked; it is an outstanding check","Tick it anyway","Delete it","Change its date to January"],why:"It is correct in the books and will clear next month."},
  {q:"With everything on the statement ticked, what should Difference show?",type:"num",ans:0,key:"diff",why:"Statement $6,035 − outstanding check $100 = $5,935, the same as the books."},
  {q:"Difference shows $0.00. What next?",type:"pick",opts:["Finish now and save the reconciliation report","Force an adjustment","Start over","Change the closing date"],why:"Keep the report as proof the bank and books agree."},
  {q:"Next month the difference will not go to zero and you find that someone changed a December transaction. What prevents this?",type:"pick",opts:["Setting a closing date after each month is finished","Deleting the bank feed","Sharing one login","Reconciling less often"],why:"A closing date protects finished periods, and the audit log shows who changed what."}]});

LAB({t:"Bookkeeping: journal Oak Studio's first month",d:2,kind:"books",
 intro:"Oak Studio is a one-owner design business that starts with nothing. Use accrual accounting. For each event choose the correct entry, then finish the statements.",
 docs:[{k:"doc",n:"OAK STUDIO · DECEMBER EVENTS",r:[["Dec 01  Owner puts in","4,000"],["Dec 02  Bank loan received","1,000"],["Dec 05  Invoice to client Mira","1,200"],["Dec 08  Advertising bill received","300"],["Dec 12  Mira pays part","900"],["Dec 16  Paid on the advertising bill","200"],["Dec 18  Cash job, deposited","500"],["Dec 22  Owner takes out","150"],["Dec 29  Supplies paid by check","100"],["Dec 31  Bank service charge","15"]]}],
 steps:[
  {q:"Dec 01: the owner puts $4,000 into the business.",type:"pick",opts:["Debit Cash, credit Owner's Capital","Debit Cash, credit Revenue","Debit Owner's Capital, credit Cash","Debit Cash, credit Loan Payable"],why:"Owner money is equity, not income."},
  {q:"Dec 02: the bank lends $1,000.",type:"pick",opts:["Debit Cash, credit Loan Payable","Debit Cash, credit Revenue","Debit Loan Payable, credit Cash","Debit Interest Expense, credit Cash"],why:"A liability, not income."},
  {q:"Dec 05: a $1,200 invoice for finished work.",type:"pick",opts:["Debit Accounts Receivable, credit Service Revenue","Debit Cash, credit Service Revenue","Debit Service Revenue, credit Accounts Receivable","No entry until paid"],why:"On accrual books the sale is recorded when earned."},
  {q:"Dec 08: a $300 advertising bill arrives, to be paid later.",type:"pick",opts:["Debit Advertising Expense, credit Accounts Payable","Debit Advertising Expense, credit Cash","Debit Accounts Payable, credit Cash","No entry until paid"],why:"The expense is recorded when incurred."},
  {q:"Dec 12: Mira pays $900 toward her invoice.",type:"pick",opts:["Debit Cash, credit Accounts Receivable","Debit Cash, credit Service Revenue","Debit Accounts Receivable, credit Cash","Debit Cash, credit Unearned Revenue"],why:"Revenue was recorded on Dec 05."},
  {q:"Dec 22: the owner takes $150 for personal use.",type:"pick",opts:["Debit Owner's Draw, credit Cash","Debit Wages Expense, credit Cash","Debit Cash, credit Owner's Draw","Debit Miscellaneous Expense, credit Cash"],why:"A draw reduces equity. It is not an expense."},
  {q:"Total service revenue for December.",type:"num",ans:1700,why:"$1,200 invoice + $500 cash job."},
  {q:"Total expenses for December.",type:"num",ans:415,why:"Advertising $300 + supplies $100 + bank fee $15."},
  {q:"Net income.",type:"num",ans:1285,why:"$1,700 − $415."},
  {q:"Ending cash in the books.",type:"num",ans:5935,why:"In: 4,000 + 1,000 + 900 + 500 = 6,400. Out: 200 + 150 + 100 + 15 = 465."},
  {q:"Ending accounts receivable.",type:"num",ans:300,why:"$1,200 − $900."},
  {q:"Total liabilities at month end.",type:"num",ans:1100,why:"Loan $1,000 + accounts payable $100."},
  {q:"Ending owner's equity.",type:"num",ans:5135,why:"$4,000 + $1,285 − $150. Check: assets $6,235 = liabilities $1,100 + equity $5,135."},
  {q:"The owner says: \"I have almost $6,000 in the bank, so I made $6,000.\" What is the right reply?",type:"pick",opts:["Profit was $1,285; most of the cash came from your own $4,000 and the $1,000 loan","Yes, cash equals profit","Profit was $5,935","Profit cannot be known until tax time"],why:"Cash is not profit. This is the most useful sentence a bookkeeper can explain."}]});

LAB({t:"Bookkeeping: record a payday",d:2,kind:"books",
 intro:"One employee earned $1,000 gross this pay period. Withheld from the employee: federal income tax $90, Social Security $62, Medicare $14.50. The employer owes its own matching Social Security and Medicare. Ignore unemployment taxes.",
 docs:[{k:"doc",n:"PAY STUB",s:"Pay period Dec 1 – Dec 15, 2025",r:[["Gross pay","1,000.00"],["Federal income tax","−90.00"],["Social Security 6.2%","−62.00"],["Medicare 1.45%","−14.50"],["Net pay","?",1]]}],
 steps:[
  {q:"Net pay to the employee.",type:"num",ans:833.5,tol:0.01,why:"$1,000 − $90 − $62 − $14.50."},
  {q:"The employer's own share of Social Security and Medicare.",type:"num",ans:76.5,tol:0.01,why:"A match of $62 + $14.50."},
  {q:"Which amount is Wages Expense?",type:"num",ans:1000,why:"The gross pay, not the net check."},
  {q:"Total cost of this payday to the employer.",type:"num",ans:1076.5,tol:0.01,why:"Gross wages $1,000 + employer payroll tax $76.50."},
  {q:"Payroll taxes payable after the paycheck is issued and before anything is sent to the IRS.",type:"num",ans:243,tol:0.01,why:"Withheld $166.50 + employer share $76.50.",show:{k:"je",r:[["Wages expense","1,000.00",""],["Payroll tax expense","76.50",""],["Cash","","833.50"],["Payroll taxes payable","","243.00"]],n:"The payday entry."}},
  {q:"What kind of account is Payroll Taxes Payable?",type:"pick",opts:["A liability","An expense","An asset","Equity"],why:"It is money held for the government."},
  {q:"The owner wants to use the withheld tax to pay rent this month and catch up later. What do you say?",type:"pick",opts:["That money belongs to the government; late deposits bring heavy penalties and personal liability","That is fine if repaid within the year","It is the business's money until April","Only the employer share must be deposited on time"],why:"Withheld payroll taxes are trust funds."},
  {q:"Which form reports these wages and taxes each quarter?",type:"pick",opts:["Form 941","Form 940","Form 1099-NEC","Form W-4"],why:"Form 940 is the yearly unemployment tax return."}]});

LAB({t:"Client interview: who is in the tax household?",d:4,kind:"client",
 intro:"A new client messages through the portal: \"I'm a single dad, my daughter lives with me, I want the biggest refund.\" You are doing the intake interview before any numbers are entered.",
 steps:[
  {q:"What do you ask first?",type:"pick",opts:["Were you married or unmarried on December 31, and who lived in your home during the year?","How big a refund do you want?","Which bank should the refund go to?","Did you bring last year's refund amount?"],why:"Status and household come before everything else."},
  {q:"He says his daughter \"stays with me a lot.\" What do you ask?",type:"pick",opts:["How many nights did she sleep at your home during the year, and where else did she live?","Does she like living with you?","Nothing more; that is enough","What is her favourite school subject?"],why:"A qualifying child must live with the taxpayer more than half the year. \"A lot\" is not a fact."},
  {q:"She spent 200 nights with him and 165 with her mother. She is 10. Whose qualifying child is she by residence?",type:"pick",opts:["The father's; she lived with him more than half the year","The mother's","Both parents can claim her","Neither"],why:"More than half of 365 nights."},
  {q:"What else must you ask before choosing head of household?",type:"pick",opts:["Who paid more than half the cost of keeping up the home","His credit score","Whether he owns a car","His employer's address"],why:"Paying more than half the home's cost is a separate test."},
  {q:"He mentions the mother \"usually claims her.\" What do you do?",type:"pick",opts:["Ask whether the mother will claim her this year and whether any custody papers or a signed release exist; note the answers","Claim the child anyway and say nothing","Refuse the client","Tell him to file first so he wins"],why:"Two returns claiming the same child means a reject or an IRS letter. Record the facts."},
  {q:"Where do the answers go?",type:"pick",opts:["In the preparer notes for the return, and in the due diligence questions","Nowhere; they are remembered","In a text message to a friend","Only on paper that is thrown away"],why:"Due diligence means asking, recording and keeping."},
  {q:"He asks you to \"just put head of household, everyone does.\" The facts so far support it. What is your answer?",type:"pick",opts:["The facts you gave support it, so I will use it and note your answers; if anything was different, tell me now","I will put whatever gives the largest refund","I cannot use it without a court order","Head of household is only for mothers"],why:"Claim what the facts support, no more and no less."},
  {q:"What do you send him at the end of the interview?",type:"pick",opts:["One clear list of the documents still needed, with a date","Nothing; wait for him to guess","A promise of the refund amount","The finished return"],why:"A single list avoids weeks of back and forth."}]});

LAB({t:"Client messages: what do you reply?",d:5,kind:"client",
 intro:"Six real-life messages from tax and bookkeeping clients. Choose the reply a professional would send.",
 steps:[
  {q:"\"Before I send my papers, how much will my refund be?\"",type:"pick",opts:["I can't know until the return is prepared; once it is done I'll show you the result and how it was reached","Probably about $3,000","More than last year, for sure","Send $50 and I'll estimate"],why:"Never promise an amount before the work is done."},
  {q:"A client emails a photo of their Social Security card to your personal email.",type:"pick",opts:["Ask them to use the secure portal from now on, and move the image there and delete the email","Reply to all with a thank-you","Forward it to a colleague's personal email","Print it and leave it on the desk"],why:"Client data travels and rests only in the firm's secure systems."},
  {q:"\"My return was sent yesterday. It's filed, right?\"",type:"pick",opts:["It was transmitted; I'll confirm when the IRS acknowledgment shows accepted","Yes, completely done","Only the state knows","Call the IRS to check"],why:"Filed means accepted. A reject must be fixed and resent."},
  {q:"\"Why is my refund smaller than last year? I earned the same.\"",type:"pick",opts:["Let's compare the two years line by line: income, withholding and credits. Your withholding was $900 lower this year","The IRS changes it randomly","The software decides","You should have used another preparer"],why:"Explain with the numbers: most changes come from withholding, a credit that ended, or a dependent who aged out."},
  {q:"A bookkeeping client: \"My Profit and Loss says I made $40,000, but there's only $6,000 in the bank. Is the report wrong?\"",type:"pick",opts:["Not necessarily. Profit is not cash: customers still owe you money, and you paid down the loan and took draws. Here is where the cash went","Yes, the software is broken","Profit and bank balance always match","Ignore the report"],why:"Unpaid invoices, loan principal, owner draws and equipment purchases all separate profit from cash."},
  {q:"\"Can you just leave out the cash jobs? Nobody sent a 1099.\"",type:"pick",opts:["No. All income is reported whether or not a form was issued, and I can't sign a return I know is incomplete","Sure, cash doesn't count","Only if it is under $600","Yes, if you pay extra"],why:"A preparer may not sign a return known to be wrong."},
  {q:"A client's question involves income from another country, which you have not been trained on.",type:"pick",opts:["Tell the client it needs a reviewer, and pass the file with your notes","Guess and file","Leave the foreign income out","Tell the client it is not taxable"],why:"Competence includes knowing when to hand over."}]});
