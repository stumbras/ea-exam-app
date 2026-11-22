/* ================= More Bootcamp tracks: QuickBooks, the individual return, business taxes =================
   Same engine and the same "short lesson, then do it" shape as the Bookkeeping Bootcamp, kept small on purpose:
   three or four slides and seven to ten questions a step. Dollar figures are the ones already used and checked elsewhere
   in this course (2025 standard deductions, $2,200 child tax credit, 70 cents a mile, 1099-NEC $600 for 2025 payments and
   $2,000 for 2026 payments). QuickBooks screens are described by what each form does, not by where a menu sits, because
   Intuit moves menus. People and companies are invented. */
const CAMP_QB=[
{id:"q1",ic:"🧭",ask:"Which QuickBooks form do you use?",t:"Pick the right form",goal:"Choose the QuickBooks form that fits what happened.",
 slides:[
  {h:"QuickBooks does the debits and credits",b:["In QuickBooks you rarely type a journal entry. You fill in a form, and the form posts the entry for you.","Your skill is choosing the right form for what really happened.","Choose the wrong one and the books still balance, but the reports are wrong."]},
  {h:"From the event to the form",v:{k:"tiers",r:[["Customer will pay later","Invoice",55],["Customer pays that invoice","Receive payment",55],["Customer pays on the spot","Sales receipt",55],["Supplier bill to pay later","Bill",75],["Paying that bill","Pay bills",75],["Paid on the spot by card or bank","Expense",75],["Money moved between the company's own accounts","Transfer",100]]},
   ex:"The most common beginner error is recording one event twice: an invoice, and then a new sale when the money arrives."},
  {h:"Forms that post nothing",b:["Estimate: a price quote for a customer.","Purchase order: an order sent to a supplier.","Neither changes the books. The books change when the estimate becomes an invoice, or when the supplier's bill arrives."]},
  {h:"When a journal entry is right",b:["Use a journal entry for adjustments that have no form: depreciation, moving prepaid insurance to expense, fixing an account.","Do not use it for daily sales and bills. Forms keep the customer and vendor records correct; a journal entry does not."]}],
 ex:[
  ["mc","Birch & Co. takes a workshop today and will pay in 15 days.",["Invoice","Sales receipt","Bank deposit","Bill"],"The customer owes money, so an invoice records the sale and the amount due."],
  ["mc","A walk-in customer buys two mugs and pays by card on the spot.",["Sales receipt","Invoice","Receive payment","Expense"],"Sale and payment happen together, so nothing is owed. That is a sales receipt."],
  ["mc","Birch & Co.'s check arrives for the invoice sent last week.",["Receive payment","Sales receipt","Invoice","Journal entry"],"The sale is already recorded. Receive payment applies the money to the open invoice."],
  ["mc","The clay supplier's bill arrives. It is due in 30 days.",["Bill","Expense","Pay bills","Purchase order"],"It will be paid later, so it is entered as a bill and sits in accounts payable."],
  ["mc","It is time to pay that supplier's bill.",["Pay bills","Expense","Bill","Journal entry"],"Pay bills clears the bill. A new expense would count the cost a second time."],
  ["mc","Glaze is bought at a shop with the business debit card.",["Expense","Bill","Pay bills","Sales receipt"],"Paid on the spot, with no bill entered first."],
  ["mc","$500 is moved from business checking to business savings.",["Transfer","Expense","Bank deposit","Journal entry"],"Money moved between the company's own accounts is a transfer. It is neither income nor expense."],
  ["mc","A customer asks what a private party for ten people would cost.",["Estimate","Invoice","Sales receipt","Purchase order"],"A quote posts nothing. It can be turned into an invoice if the customer says yes."],
  ["mc","It is month end and the kiln's depreciation must be recorded.",["Journal entry","Expense","Bill","Transfer"],"There is no form for depreciation, so this is one of the proper uses of a journal entry."],
  ["mc","A customer pays an invoice. The bookkeeper enters a new sales receipt for the money. What is wrong now?",["Income is counted twice and the invoice still shows as unpaid","Nothing: the money is in the bank either way","Income is too low","The customer was charged twice by the bank"],"The invoice already recorded the sale. The payment should have been applied to it."]]},

{id:"q2",ic:"🧾",t:"Money in: invoice, payment, deposit",goal:"Follow a sale from the invoice to the bank and see what each form posts.",
 slides:[
  {h:"Three forms, one sale",v:{k:"flow",r:["Invoice: records the sale and what the customer owes","Receive payment: applies the customer's money to that invoice","Payments to deposit: holds money that is not at the bank yet","Bank deposit: moves it into Checking in the same total the bank will show"]},
   ex:"Older company files call the holding account Undeposited Funds. It is the same thing."},
  {h:"What each one posts",v:{k:"je",r:[["Accounts receivable","400.00",""],["Class revenue","","400.00"],["Payments to deposit","400.00",""],["Accounts receivable","","400.00"],["Checking","400.00",""],["Payments to deposit","","400.00"]],n:"Invoice, then Receive payment, then Bank deposit. Income is recorded once, by the invoice."}},
  {h:"Make the deposit match the bank",b:["If three checks go to the bank in one trip, the bank statement shows one line for the total.","Record one bank deposit that contains all three payments.","Then the bank feed and the reconciliation match line for line."]},
  {h:"Items do the filing",b:["Each product or service item points to an income account.","Choosing the item on an invoice puts the sale in the right place automatically.","A sales receipt skips accounts receivable: it posts straight to the bank or to Payments to deposit, and to income."]}],
 ex:[
  ["je","You save a $400 invoice for a class. What does QuickBooks post?",null,[["D","Accounts receivable","400.00"],["C","Class revenue","400.00"]],["Checking","Payments to deposit","Unearned revenue"],"The customer owes $400 and the income is earned. No money has moved yet."],
  ["je","The customer pays the $400. You record Receive payment into Payments to deposit. What is posted?",null,[["D","Payments to deposit","400.00"],["C","Accounts receivable","400.00"]],["Class revenue","Checking","Product sales"],"The money is in hand, not yet at the bank, and the customer no longer owes it. Income does not change."],
  ["je","You take the money to the bank and record the Bank deposit. What is posted?",null,[["D","Checking","400.00"],["C","Payments to deposit","400.00"]],["Class revenue","Accounts receivable","Owner's capital"],"The holding account empties into Checking."],
  ["mc","Three customer checks ($400, $150 and $250) go to the bank in one trip. How do you record the deposit?",["One bank deposit of $800 containing all three payments","Three separate deposits","One journal entry to income for $800","Nothing: the bank feed will handle it"],"The bank shows one $800 line. One deposit of $800 matches it."],
  ["mc","The balance sheet shows $9,000 in Payments to deposit, but no money is waiting to go to the bank. What probably happened?",["Payments were received into it, but the bank deposits were added as new income instead","Customers have not paid their invoices","The bank lost the deposits","The account is working as intended"],"The holding account was never emptied, and the same money was counted as income a second time. This is the classic cleanup job."],
  ["mc","What does a sales receipt post?",["Money in (bank or Payments to deposit) and income, with no accounts receivable","Accounts receivable and income","Accounts payable and expense","Nothing until it is deposited"],"The customer paid at once, so nothing is owed."],
  ["mc","Why set up product and service items instead of typing a description each time?",["Each item points to an income account, so the sale is filed correctly every time","Items make invoices print faster","Items are required by the IRS","Items replace the chart of accounts"],"The item carries the account, the price and the tax setting."],
  ["mc","A customer was invoiced $400 but should have been charged $350. What reduces what the customer owes?",["A credit memo for $50","A new invoice for $350 as well","An expense for $50","A bank deposit of −$50"],"A credit memo lowers the customer's balance and the income by the same amount."]]},

{id:"q3",ic:"💳",t:"Money out: bills, expenses and cards",goal:"Record purchases once, in the right place.",
 slides:[
  {h:"Two roads for a purchase",v:{k:"cmp",a:["Pay later",["Enter a Bill when it arrives","It sits in accounts payable","Use Pay bills when you pay it"]],b:["Paid on the spot",["Enter an Expense","Pick the payment account: bank or credit card","Nothing goes to accounts payable"]]},
   ex:"Entering a bill and then, later, an expense for the same payment counts the cost twice and leaves the bill open."},
  {h:"Credit cards",b:["The card is its own account in QuickBooks, a liability.","Each charge is an Expense with the card as the payment account.","Paying the card statement from checking is a transfer from Checking to the card account. It is not a new expense."]},
  {h:"What is not an expense account",b:["Owner takes money or pays something personal: Owner's draw, an equity account.","Loan payment: split it. Principal to Loan payable, interest to Interest expense.","Equipment that lasts for years: an asset account.","Sales tax sent to the state: Sales tax payable."]},
  {h:"Vendors who are contractors",b:["Keep a Form W-9 for each contractor before the first payment.","Mark the vendor for 1099 tracking so the year-end forms are easy.","Put their payments in one account, such as Contract labor."]}],
 ex:[
  ["je","You enter a $260 bill for clay, due in 30 days. What does QuickBooks post?",null,[["D","Supplies expense","260.00"],["C","Accounts payable","260.00"]],["Checking","Credit card payable","Inventory"],"The cost is recorded now. Nothing has left the bank."],
  ["je","You use Pay bills to pay that $260 from Checking. What is posted?",null,[["D","Accounts payable","260.00"],["C","Checking","260.00"]],["Supplies expense","Credit card payable","Owner's draw"],"The bill is cleared. The expense was already recorded."],
  ["mc","A bill was entered last week. Today someone records a new Expense for the payment instead of using Pay bills. What happens?",["The cost is counted twice and the bill still shows as unpaid","Nothing: both ways are the same","The bill is deleted automatically","The bank balance doubles"],"Always pay an entered bill through Pay bills."],
  ["mc","A $120 ad is charged to the business credit card. How is it entered?",["An Expense, with the credit card as the payment account","A Bill","A Transfer","An Expense paid from Checking"],"The card balance goes up. Checking is not touched until the card is paid."],
  ["mc","The $420 credit card statement is paid from checking. How is that recorded?",["As a transfer from Checking to the credit card account","As an Expense to Supplies","As a Bill","As a journal entry to income"],"Every charge was already an expense. The payment only lowers the card balance."],
  ["mc","Mara pays her dentist with the business card. Which account?",["Owner's draw","Insurance expense","Supplies expense","Contract labor"],"A personal cost paid by the business is a draw."],
  ["mc","A $250 loan payment is $220 principal and $30 interest. How is it entered?",["Two lines: $220 to Loan payable and $30 to Interest expense","One line: $250 to Interest expense","One line: $250 to Loan payable","As a Transfer"],"Only the interest is an expense. The principal reduces the loan."],
  ["mc","A new contractor will photograph products. What should be on file before the first payment?",["A Form W-9, and the vendor marked for 1099 tracking","A Form W-4","A Form I-9","Nothing until year end"],"The W-9 gives the name and tax number needed for a Form 1099-NEC."]]},

{id:"q4",ic:"🏦",ask:"What do you do with this bank line?",t:"The bank feed: match, add, transfer, exclude",goal:"Clear downloaded bank lines without creating duplicates.",
 slides:[
  {h:"What the bank feed is",b:["QuickBooks downloads each line from the bank and card accounts and lists it for review.","A downloaded line is not in the books yet. You decide what it is.","Your goal: every line ends up in the books exactly once."]},
  {h:"Four choices for every line",v:{k:"tiers",r:[["Already entered in QuickBooks","Match",40],["Not entered yet","Add: choose the payee and the account",60],["Money moved between your own accounts","Record as transfer",80],["A duplicate or not this company's","Exclude",100]]},
   ex:"Adding a line that was already entered is how duplicates are made. Look for a match first."},
  {h:"Rules save time",b:["A bank rule tells QuickBooks how to file a line that keeps coming back, such as the monthly power bill.","Check rules now and then. A rule that is too broad files things in the wrong account, quietly."]},
  {h:"When you do not know",b:["Do not guess an account to make the list empty.","Ask the owner what it was and get the receipt.","An honest question today is cheaper than a cleanup at tax time."]}],
 ex:[
  ["mc","The feed shows a deposit of $800. You already recorded a bank deposit of $800 for three customer checks.",["Match","Add as new income","Record as transfer","Exclude"],"It is already in the books. Matching ties the bank line to your deposit."],
  ["mc","The feed shows $1,500 paid to Harbor Property. Nothing has been entered for it.",["Add, with payee Harbor Property and account Rent expense","Match","Record as transfer","Exclude"],"It is new to the books, so it is added with the right payee and account."],
  ["mc","The feed shows $420 from checking to the business credit card, which is also connected.",["Record as transfer to the credit card account","Add as Supplies expense","Exclude","Add as Owner's draw"],"Paying your own card is a movement between two of the company's accounts."],
  ["mc","The feed shows check 1006 for $260 to Kiln Supply. You used Pay bills for it last week.",["Match","Add as Supplies expense","Record as transfer","Exclude"],"The payment exists already. Adding it again would count the clay twice."],
  ["mc","Because of a bank glitch, the same $85 charge downloaded twice. Only one is real.",["Exclude the extra line","Add both","Match both to the same expense","Record one as a transfer"],"Excluding removes the duplicate line from review without touching the books."],
  ["mc","The feed shows a $1,000 deposit from a customer who has an open $1,000 invoice. The payment has not been recorded yet.",["Match it to the open invoice","Add it as new income","Exclude it","Record it as a transfer"],"Matching to the invoice records the payment and closes the invoice. Adding it as income would count the sale twice."],
  ["mc","City Power is paid every month and always goes to Utilities expense. What saves time?",["A bank rule for that payee","A journal entry each month","Excluding it each month","A new bank account"],"A rule fills in the payee and account for you. You still review it."],
  ["mc","You click Add on a customer's deposit and choose an income account, but the payment was already recorded against the invoice. What happens?",["The income is counted twice","Nothing: QuickBooks removes duplicates","The invoice reopens","The bank balance is corrected"],"Now the same money is in the books twice, and the reconciliation will not agree."],
  ["mc","One line has no clue what it was for. What do you do?",["Ask the owner and get the receipt before filing it","Add it to Supplies expense","Add it to Owner's draw","Exclude it"],"Guessing an account hides the problem."]]},

{id:"q5",ic:"🔒",t:"Reconcile and close the month",goal:"Prove the bank account and lock the finished month.",
 slides:[
  {h:"Reconciling in QuickBooks",v:{k:"flow",r:["Take the bank statement: ending balance and ending date","Tick each QuickBooks line that is on the statement","Anything on the statement that is missing in QuickBooks: enter it","The difference must reach $0.00","Finish, and keep the reconciliation report"]}},
  {h:"If the difference is not zero",b:["Look for a missing fee or interest line.","Look for a duplicate, or an amount typed with two digits swapped.","Do not press finish with a difference. QuickBooks would post the gap to an account called Reconciliation Discrepancies, and the real error would still be there."]},
  {h:"Closing the books",b:["After the month is reconciled and reviewed, set a closing date.","QuickBooks then warns, or asks for a password, before anyone changes a transaction dated in the closed period.","It protects reports and tax returns that were already given out."]},
  {h:"The audit log",b:["The audit log lists who added, changed or deleted each transaction, and when.","Use it when a number that was right last week is different today."]}],
 ex:[
  ["mc","What two things from the bank statement do you need to start a reconciliation?",["The ending balance and the ending date","The account number and the bank's phone number","The first and last check numbers","The interest rate and the fees"],"QuickBooks compares its own cleared total with the statement's ending balance on that date."],
  ["mc","Everything is ticked and the difference shows $0.00. What now?",["Finish, and keep the reconciliation report","Post an adjustment to be safe","Start again from the beginning","Delete the uncleared items"],"Zero means the books and the bank agree for that period."],
  ["mc","The difference is $15. The statement shows a $15 service fee that is not in QuickBooks. What do you do?",["Enter the fee as an expense, then finish","Finish anyway and let QuickBooks adjust","Change the statement balance you typed","Untick a $15 item"],"The bank already took the fee. Recording it brings the difference to zero."],
  ["mc","You press finish with a $40 difference. What does QuickBooks do?",["Posts $40 to an account called Reconciliation Discrepancies","Refuses to save","Emails the bank","Fixes the wrong transaction for you"],"The books now carry a made-up entry, and the real error is still hidden. Find the $40 instead."],
  ["mc","After a month is reconciled, someone changes the amount of one of its cleared transactions. What is the effect?",["Next month's beginning balance will not agree, and the change must be found","Nothing: reconciled items cannot change","The bank is notified","The closing date moves"],"That is why finished months get a closing date."],
  ["mc","What does setting a closing date do?",["Warns or blocks changes to transactions dated in the closed period","Deletes old transactions","Files the tax return","Stops the bank feed"],"It guards periods that are already reported."],
  ["mc","An invoice total is different from last week and nobody admits changing it. Where do you look?",["The audit log","The chart of accounts","The bank feed","The products and services list"],"The audit log shows who changed what, and when."],
  ["mc","Which month-end order is right?",["Enter everything, clear the bank feed, reconcile, review reports, set the closing date","Set the closing date, then enter everything","Review reports, then reconcile, then enter bills","Reconcile first, then clear the bank feed"],"Each step depends on the one before it."]]},

{id:"q6",ic:"📊",t:"Reports: read them and spot trouble",goal:"Pick the report that answers the question, and notice warning signs.",
 slides:[
  {h:"Four reports for four questions",v:{k:"tiers",r:[["Did we make money this month?","Profit and Loss",40],["What do we own and owe today?","Balance Sheet",60],["Which customers owe us, and how late?","Accounts receivable aging",80],["Which bills must we pay?","Accounts payable aging",100]]}},
  {h:"Cash or accrual",b:["Reports can be shown on the cash basis or the accrual basis.","Accrual counts invoices when sent and bills when received.","Cash counts money only when it moves, so unpaid invoices and unpaid bills drop out."]},
  {h:"Warning signs on a balance sheet",b:["A bank account with a negative balance while the real bank shows money: duplicates or missing deposits.","A large Payments to deposit balance that never goes down: deposits added as new income.","A customer with a negative balance in accounts receivable: a payment that was never applied to an invoice.","An account called Uncategorized or Ask My Accountant with a balance: unfinished work."]},
  {h:"Before giving reports to the owner",b:["The bank and cards are reconciled to the report date.","Nothing is left in the bank feed for that period.","The numbers make sense next to last month's."]}],
 ex:[
  ["mc","The owner asks: did we make money in January?",["Profit and Loss","Balance Sheet","Accounts receivable aging","Audit log"],"Profit and Loss shows income and expenses for a period."],
  ["mc","The owner asks: how much is in the bank and what do we owe right now?",["Balance Sheet","Profit and Loss","Accounts payable aging only","Sales by customer"],"The Balance Sheet is a snapshot of assets, liabilities and equity on one date."],
  ["mc","The owner asks: which customers are late paying?",["Accounts receivable aging","Accounts payable aging","Profit and Loss","Balance Sheet"],"It lists open invoices by how many days they are past due."],
  ["mc","The owner asks: which bills are coming due?",["Accounts payable aging","Accounts receivable aging","Profit and Loss","Audit log"],"It lists unpaid bills by due date."],
  ["mc","QuickBooks shows Checking at −$2,300. The real bank balance is $4,000. What does that tell you?",["The books are wrong: look for duplicate payments or deposits that were never recorded","The bank made an error","The company is overdrawn","Nothing: these two never agree"],"A reconciled account agrees with the bank. A large gap means entries are duplicated or missing."],
  ["mc","The Profit and Loss has a large line called Uncategorized Expense. What does that mean?",["Bank lines were added without choosing a real account, and need to be recategorized","The business has an unusual expense","QuickBooks found fraud","The line is a tax"],"It is unfinished bookkeeping, not a real category."],
  ["mc","You switch the Profit and Loss from accrual to cash basis. What happens to invoices that customers have not paid?",["They drop out of income","They are counted twice","They move to expenses","Nothing changes"],"Cash basis counts income only when money is received."],
  ["mc","Accounts receivable aging shows a customer with a negative balance. What is the usual cause?",["A payment was recorded but never applied to an invoice","The customer is owed a prize","The invoice was sent twice","The bank returned a check"],"An unapplied payment sits as a credit. Apply it to the right invoice."]]}
];

const CAMP_T1=[
{id:"t1",ic:"🧮",t:"The whole return in one line",goal:"Say the order of a Form 1040 from income to refund.",
 slides:[
  {h:"One road, top to bottom",v:{k:"flow",r:["Income: everything taxable that came in","Minus adjustments = adjusted gross income (AGI)","Minus the standard or itemized deduction = taxable income","Tax is figured on taxable income","Minus credits, plus any other taxes = total tax","Minus payments already made = refund or amount owed"]}},
  {h:"Five kinds of numbers",v:{k:"tiers",r:[["Income","Wages, interest, business profit",30],["Adjustment","Comes off income before AGI",45],["Deduction","Standard or itemized, after AGI",60],["Credit","Comes off the tax itself",80],["Payment","Withholding and estimated payments",100]]},
   ex:"Ask of every paper the client brings: which of these five is it?"},
  {h:"Why AGI matters",b:["AGI is the measuring stick for many limits and credits.","A higher AGI can shrink or remove a credit.","That is why adjustments are valuable: they lower AGI itself."]}],
 ex:[
  ["mc","Total income minus adjustments equals",["adjusted gross income (AGI)","taxable income","total tax","the refund"],"AGI is the first big subtotal on the return."],
  ["mc","AGI minus the standard or itemized deduction equals",["taxable income","total income","total tax","the refund"],"The tax is figured on taxable income."],
  ["mc","Credits are subtracted from",["the tax","total income","AGI","the standard deduction"],"That is why a credit is worth more than a deduction of the same size."],
  ["mc","Tax after credits is $3,000. Withholding was $3,600. What is the result?",["A refund of $600","A balance due of $600","A refund of $3,600","A balance due of $3,000"],"Payments of 3,600 minus tax of 3,000."],
  ["mc","Tax after credits is $5,200. Payments were $4,000. What is the result?",["A balance due of $1,200","A refund of $1,200","A refund of $4,000","A balance due of $5,200"],"Tax of 5,200 minus payments of 4,000."],
  ["mc","Wages on a Form W-2 are",["income","an adjustment","a credit","a payment"],"Box 1 wages start the return."],
  ["mc","The student loan interest deduction is",["an adjustment","a credit","a payment","income"],"It comes off income before AGI, on Schedule 1."],
  ["mc","The child tax credit is",["a credit","a deduction","an adjustment","a payment"],"It reduces the tax itself."],
  ["mc","Federal income tax withheld, shown in box 2 of the W-2, is",["a payment","a deduction","a credit","income"],"It is tax already paid during the year."]]},
{id:"t2",ic:"👪",t:"Filing status and dependents",goal:"Choose the filing status and know who counts as a dependent.",
 slides:[
  {h:"Five filing statuses",b:["Single.","Married filing jointly (MFJ).","Married filing separately (MFS).","Head of household (HOH).","Qualifying surviving spouse (QSS).","Marital status on December 31 counts for the whole year."]},
  {h:"2025 standard deduction",v:{k:"calc",r:[["Single or married filing separately","$15,750"],["Head of household","$23,625"],["Married filing jointly or qualifying surviving spouse","$31,500",1]]},
   ex:"People 65 or older, or blind, get more. The status sets the starting amount."},
  {h:"Head of household",b:["Unmarried, or treated as unmarried, on December 31.","Paid more than half the cost of keeping up the home.","A qualifying person lived there more than half the year.","A paid preparer must check and document this (Form 8867)."]},
  {h:"Who is a dependent",v:{k:"cmp",a:["Qualifying child",["Relationship: child, stepchild, sibling or their child","Age: under 19, or under 24 if a full-time student","Lived with the taxpayer more than half the year","Did not pay more than half of their own support"]],b:["Qualifying relative",["A relative, or anyone who lived in the home all year","Gross income under the yearly limit","Taxpayer paid more than half of their support","Not anyone's qualifying child"]]}}],
 ex:[
  ["mc","A couple marries on December 31. For that tax year they are treated as",["married for the whole year","single for the whole year","married for one day","able to choose either"],"Status on the last day of the year applies to the whole year."],
  ["mc","A single mother pays all the costs of her home. Her 8-year-old lives with her all year. Her best status is",["Head of household","Single","Married filing separately","Qualifying surviving spouse"],"Unmarried, pays more than half of the home, and a qualifying child lives there."],
  ["mc","What is the 2025 standard deduction for married filing jointly?",["$31,500","$15,750","$23,625","$30,000"],"Joint filers get twice the single amount."],
  ["mc","What is the 2025 standard deduction for a single filer?",["$15,750","$23,625","$31,500","$14,600"],"$15,750 for single and married filing separately."],
  ["mc","Which of these is NOT a test for a qualifying child?",["A gross income limit","Relationship","Age","Living with the taxpayer more than half the year"],"The gross income limit belongs to the qualifying relative rules."],
  ["mc","For the age test, a qualifying child must be",["under 19, or under 24 if a full-time student","under 21","under 18 only","under 26"],"There is no age limit if the child is permanently and totally disabled."],
  ["mc","A man's wife died last year. He has not remarried and keeps a home for their dependent son. This year his status is",["Qualifying surviving spouse","Single","Head of household","Married filing jointly"],"For two years after the year of death, with a dependent child, the joint rates still apply."],
  ["mc","A paid preparer claims head of household for a client. What must the preparer do?",["Ask the questions, document the answers and complete Form 8867","Nothing extra","Get a notarized letter","File on paper"],"Head of household is one of the items covered by the due diligence rules."]]},
{id:"t3",ic:"📄",t:"Income documents",goal:"Know what each form in the client's envelope is and where it goes.",
 slides:[
  {h:"The W-2",v:{k:"form",n:"Form W-2",s:"Wage and Tax Statement",r:[["1","Wages for income tax","",1],["2","Federal income tax withheld","",1],["3 and 4","Social Security wages and tax",""],["5 and 6","Medicare wages and tax",""],["12","Coded items such as retirement plan deferrals",""],["17","State income tax withheld",""]]}},
  {h:"The 1099 family",v:{k:"tiers",r:[["1099-NEC","Self-employment pay: Schedule C",30],["1099-INT and 1099-DIV","Interest and dividends",45],["1099-G","Unemployment pay, state refunds",60],["1099-R","Pensions and retirement accounts",75],["SSA-1099","Social Security benefits",90],["1099-K","Card and payment-app receipts",100]]}},
  {h:"Forms that support credits",b:["Form 1095-A: Marketplace health insurance. Needed for Form 8962.","Form 1098-T: tuition. Needed for education credits.","Form 1098: home mortgage interest, for people who itemize.","A missing form is the usual reason for an IRS letter later."]}],
 ex:[
  ["mc","Which W-2 box holds the wages that go on the income tax return?",["Box 1","Box 2","Box 3","Box 5"],"Box 1 is wages for income tax. Boxes 3 and 5 are the Social Security and Medicare wage bases."],
  ["mc","Which W-2 box shows federal income tax already paid?",["Box 2","Box 1","Box 4","Box 17"],"Box 2 is federal income tax withheld."],
  ["mc","A client has a Form 1099-NEC for $9,000 of freelance work. Where does it go?",["Schedule C, and self-employment tax applies","The wages line, like a W-2","Schedule B","It is not taxable"],"Non-employee pay is business income."],
  ["mc","Unemployment compensation on Form 1099-G is",["taxable income","never taxable","a credit","a deduction"],"It is reported on Schedule 1."],
  ["mc","A client had Marketplace health insurance. Which form must you have before filing?",["Form 1095-A","Form 1098-T","Form W-2G","Form 1099-K"],"Form 8962 cannot be completed without it, and the return will be held up."],
  ["mc","Form 1098-T is used for",["education credits","mortgage interest","health insurance","retirement income"],"It reports tuition billed or paid."],
  ["mc","Form SSA-1099 reports Social Security benefits. Are they taxable?",["Part may be, depending on the client's other income","Always fully taxable","Never taxable","Only if the client is under 65"],"A worksheet compares other income with the benefits."],
  ["mc","In January a client brings a last pay stub and wants to file today. What do you do?",["Wait for the actual Form W-2","File from the pay stub","Estimate the numbers","File now and amend later"],"A return is prepared from the W-2, not from a pay stub."]]},
{id:"t4",ic:"✂️",t:"Deductions and credits",goal:"Tell a deduction from a credit and know what each is worth.",
 slides:[
  {h:"A deduction and a credit are not the same",v:{k:"cmp",a:["Deduction",["Reduces income","Worth the amount times the tax rate","$1,000 in the 12% bracket saves $120"]],b:["Credit",["Reduces the tax itself","Worth its full amount","$1,000 saves $1,000"]]}},
  {h:"Standard or itemized",b:["Everyone may take the standard deduction.","Itemizing means adding up certain costs instead: state and local taxes, mortgage interest, gifts to charity, large medical bills.","Take whichever is bigger. Most people take the standard deduction."]},
  {h:"Refundable or not",b:["A nonrefundable credit can bring the tax down to zero and stops there.","A refundable credit can also be paid out as a refund.","The earned income credit and the additional child tax credit are refundable."]},
  {h:"Family credits for 2025",v:{k:"calc",r:[["Child tax credit, each qualifying child under 17","$2,200"],["Credit for other dependents, each","$500"],["Earned income credit","By income and number of children"]]},
   ex:"For these credits a paid preparer must complete Form 8867."}],
 ex:[
  ["mc","A $1,000 deduction for a client in the 12% bracket saves about",["$120","$1,000","$12","$880"],"1,000 × 12%."],
  ["mc","A $1,000 tax credit saves",["$1,000","$120","$220","Nothing unless the client itemizes"],"A credit comes straight off the tax."],
  ["mc","A single client's itemized deductions total $11,000 for 2025. What do you use?",["The $15,750 standard deduction","The $11,000 of itemized deductions","Both","Neither"],"Use whichever is larger."],
  ["mc","A nonrefundable credit can",["reduce the tax to zero, but not below","create a refund larger than the tax paid","be carried to the standard deduction","only be used by businesses"],"Any unused part is lost, unless a carryforward rule applies."],
  ["mc","Which of these is a refundable credit?",["The earned income credit","The credit for other dependents","The standard deduction","The lifetime learning credit"],"The earned income credit can be paid out even when no tax is owed."],
  ["mc","For 2025, the child tax credit for each qualifying child under 17 is up to",["$2,200","$500","$1,000","$3,600"],"The child must be under 17 at the end of the year."],
  ["mc","A client's dependent is a 19-year-old full-time student. Which credit applies?",["The $500 credit for other dependents","The $2,200 child tax credit","Both","Neither"],"The child tax credit stops at age 17. Older dependents get the smaller credit."],
  ["mc","Itemized deductions are claimed on",["Schedule A","Schedule C","Schedule 1","Form 8867"],"Schedule A lists them."]]},
{id:"t5",ic:"📬",t:"Payments, refund or balance due",goal:"Finish the return: what was paid, what is owed, and the deadlines.",
 slides:[
  {h:"Tax is paid during the year",b:["Employees pay through withholding. The amount comes from their Form W-4.","People without withholding, such as the self-employed, pay estimated tax four times a year.","Estimates are generally needed when a person expects to owe $1,000 or more."],
   v:{k:"time",r:[["Apr 15","1st estimate"],["Jun 15","2nd"],["Sep 15","3rd"],["Jan 15","4th"]]}},
  {h:"The deadline and the extension",b:["The individual return is due April 15.","Form 4868 gives six more months to file.","It gives no extra time to pay. Tax not paid by April 15 draws interest and a penalty."]},
  {h:"When the client cannot pay",b:["File on time anyway. The penalty for not filing is much larger than the penalty for not paying.","Pay what is possible now.","Ask for a monthly payment plan."]},
  {h:"Refunds",b:["E-file with direct deposit is the fastest way to a refund.","A large refund every year means too much was withheld. A new Form W-4 fixes that."]}],
 ex:[
  ["mc","What does an extension on Form 4868 give?",["More time to file, but not more time to pay","More time to file and to pay","A smaller tax bill","Nothing unless the IRS approves it by letter"],"The tax is still due April 15."],
  ["mc","A client files on time but pays the balance in July. What is charged?",["Interest and a late-payment penalty from April 15","Nothing, because the return was on time","Only a late-filing penalty","A flat $50 fee"],"Filing and paying are separate duties."],
  ["mc","Who generally must make estimated tax payments?",["A self-employed person who expects to owe $1,000 or more","Every employee","Only corporations","Anyone who got a refund last year"],"With no employer withholding, tax is paid in four estimates."],
  ["mc","When are the four estimated payments due?",["April 15, June 15, September 15 and January 15","The 15th of every month","March 31, June 30, September 30 and December 31","Once, on April 15"],"The periods are not equal quarters."],
  ["mc","What is the fastest way for a client to get a refund?",["E-file with direct deposit","Paper return and a mailed check","An extension","Filing in October"],"Electronic filing and deposit avoid mail and manual handling."],
  ["mc","A client gets a $5,000 refund every year and is short of money each month. What do you suggest?",["Give the employer a new Form W-4 so less is withheld","Stop filing returns","Claim more dependents than there are","Nothing can be changed"],"A refund is the client's own money coming back."],
  ["mc","A client owes $3,000 and cannot pay it now. What is the right advice?",["File on time, pay what is possible, and ask for a payment plan","Do not file until the money is there","File an extension to delay the payment","Leave the amount off the return"],"Not filing adds a much larger penalty."]]},
{id:"t6",ic:"🖊️",t:"The preparer's duties",goal:"Know what a paid preparer must do before, during and after filing.",
 slides:[
  {h:"Before you transmit",b:["The return shows your name and PTIN, and you sign it.","The client reviews the return and signs Form 8879, the e-file authorization. Then you transmit.","Give the client a complete copy."]},
  {h:"Due diligence",b:["For the earned income credit, child tax credits, the American opportunity credit and head of household, ask enough questions to be sure.","Write down what was asked and answered.","Complete Form 8867 and keep the records.","If an answer does not make sense, ask more. You may not ignore what you know."]},
  {h:"Protecting the client",b:["Tax return information is confidential. Using or disclosing it for anything else needs the client's written consent (Section 7216).","Every preparer needs a written information security plan.","Keep a copy of each return, or a list of the returns, for three years."]},
  {h:"What you will not do",b:["You will not put a number on a return that you know is false.","You will not file from a pay stub in place of a W-2.","You will not sign a blank return, or let a client sign one."]}],
 ex:[
  ["mc","What must you have before transmitting an e-filed return?",["The client's signed Form 8879","A Form 2848","A Form W-9","Nothing: e-file needs no signature"],"Form 8879 is the client's signature authorization."],
  ["mc","What must a paid preparer put on every return prepared?",["Name, PTIN and signature","Only the firm's logo","The preparer's Social Security number","Nothing if the client e-files"],"The PTIN identifies the preparer."],
  ["mc","A client wants to deduct a family vacation as a business trip. What do you do?",["Refuse to claim it and explain why","Claim it if the client signs a note","Claim half of it","Claim it and add a disclaimer"],"A preparer may not sign a return they know contains a false item."],
  ["mc","How long must a preparer keep a copy of each return, or a list of returns prepared?",["Three years","One year","Ten years","Until the client dies"],"Three years after the close of the return period."],
  ["mc","You want to use clients' tax information to offer them insurance. What is needed first?",["Each client's written consent","Nothing: they are your clients","A notice on the office wall","Approval from the state"],"Section 7216 bars using return information for other purposes without consent."],
  ["mc","A client claims two children but the answers about where they lived do not add up. What do you do?",["Ask more questions and document the answers before claiming anything","Claim the credits: it is the client's return","Drop the children without asking","File on paper so it is the client's problem"],"Due diligence means resolving what does not make sense."],
  ["mc","An e-filed return is rejected because a dependent's number does not match IRS records. What now?",["Tell the client, correct the number and transmit again","Ignore it: the IRS will fix it","Mail the same return without checking","Remove the dependent"],"A rejected return has not been filed. Fix the cause and resend."],
  ["mc","Which written document must every tax preparer have for client data?",["A written information security plan","A chart of accounts","A Form 2553","An audit log"],"It is required by the FTC Safeguards Rule."]]}
];

const CAMP_T2=[
{id:"b1",ic:"🏢",t:"Which return does the business file?",goal:"Match each kind of business to its tax return and due date.",
 slides:[
  {h:"The form follows the entity",v:{k:"tiers",r:[["Sole proprietor, or one-owner LLC","Schedule C with the owner's Form 1040",40],["Partnership, or LLC with two or more owners","Form 1065, a K-1 to each partner",60],["S corporation","Form 1120-S, a K-1 to each shareholder",80],["C corporation","Form 1120: the corporation pays its own tax",100]]},
   ex:"An LLC is a state-law label. For tax it is treated as one of these, by its number of owners or by an election."},
  {h:"Pass-through",b:["A partnership and an S corporation usually pay no income tax themselves.","The profit passes through to the owners, who pay tax on their own returns.","Schedule K-1 tells each owner their share."]},
  {h:"Due dates for calendar-year businesses",v:{k:"time",r:[["Mar 15","Form 1065 and Form 1120-S"],["Apr 15","Form 1120 and Form 1040 with Schedule C"]]},
   ex:"Pass-through returns come first so the owners have their K-1 in time for their own returns."}],
 ex:[
  ["mc","A sole proprietor reports the business on",["Schedule C, with Form 1040","Form 1065","Form 1120-S","Form 1120"],"The business and the owner are one taxpayer."],
  ["mc","A one-owner LLC that made no election reports on",["Schedule C, with the owner's Form 1040","Form 1065","Form 1120","Form 1120-S"],"It is disregarded for income tax and treated like a sole proprietorship."],
  ["mc","An LLC with two owners that made no election files",["Form 1065, and each owner gets a Schedule K-1","Schedule C","Form 1120","Two Schedule Cs"],"Two or more owners make it a partnership by default."],
  ["mc","A calendar-year S corporation files Form 1120-S by",["March 15","April 15","January 31","October 15"],"The 15th day of the third month."],
  ["mc","Which business pays income tax on its own profit?",["A C corporation","A partnership","An S corporation","A sole proprietorship"],"It files Form 1120 and pays the corporate tax."],
  ["mc","Does a partnership pay income tax on its profit?",["No: the profit passes through to the partners","Yes, at the corporate rate","Yes, at the partners' average rate","Only if it has more than ten partners"],"Form 1065 is an information return."],
  ["mc","Which form elects S corporation status?",["Form 2553","Form 8832","Form SS-4","Form 1065"],"Form 2553 is the S election."],
  ["mc","What is a Schedule K-1?",["An owner's share of the business's income, deductions and credits","The business's bank statement","A payroll form","A sales tax return"],"The owner copies the K-1 amounts to their own return."]]},
{id:"b2",ic:"📒",t:"Schedule C: finding the profit",goal:"Get from receipts to net profit and know what counts as an expense.",
 slides:[
  {h:"The shape of Schedule C",v:{k:"calc",r:[["Gross receipts","$60,000"],["Cost of goods sold","− $10,000"],["Gross profit","$50,000",1],["Business expenses","− $20,000"],["Net profit","$30,000",1]]},
   ex:"Net profit is what the owner is taxed on, whether or not the money was taken out."},
  {h:"What is deductible",b:["An expense must be ordinary (common in that line of work) and necessary (helpful to the business).","It must be for business, not personal.","There must be records: receipts, invoices, a mileage log."]},
  {h:"Three with special rules",b:["Business meals: 50% is deductible.","Car: either actual costs, or the standard mileage rate, 70 cents a mile for 2025. Commuting does not count.","Home office: the space must be used regularly and only for business."]},
  {h:"Never deductible",b:["Personal and family costs.","Owner draws.","Fines and penalties paid to a government.","All income counts, including cash and amounts with no Form 1099."]}],
 ex:[
  ["mc","Gross receipts $60,000, cost of goods sold $10,000, expenses $20,000. What is the net profit?",["$30,000","$50,000","$40,000","$60,000"],"60,000 − 10,000 − 20,000."],
  ["mc","A client drove 2,000 business miles in 2025. At 70 cents a mile, the deduction is",["$1,400","$140","$2,000","$700"],"2,000 × 0.70."],
  ["mc","A business meal with a client cost $80. How much is deductible?",["$40","$80","$0","$20"],"Business meals are 50% deductible."],
  ["mc","The owner took $25,000 out of the business for herself. On Schedule C that is",["not deductible","a wage expense","a contract labor expense","a cost of goods sold"],"Owner draws are not expenses."],
  ["mc","To deduct a home office, the space must be used",["regularly and only for business","at least once a week","by the whole family","for storage of personal items too"],"Mixed use of the room fails the test."],
  ["mc","Driving from home to the regular place of business each morning is",["commuting, and not deductible","deductible at the mileage rate","deductible at half the rate","deductible only in winter"],"Commuting is personal."],
  ["mc","A delivery driver pays a $150 speeding ticket while working. It is",["not deductible","fully deductible","50% deductible","deductible if paid by card"],"Fines paid to a government are not deductible."],
  ["mc","A client has a Form 1099-NEC for $9,000 and also took $3,000 in cash jobs. How much income is reported?",["$12,000","$9,000","$3,000","$6,000"],"All income is reported, with or without a form."]]},
{id:"b3",ic:"🧾",t:"Self-employment tax and estimates",goal:"Figure self-employment tax and know when estimates are due.",
 slides:[
  {h:"Why there is a second tax",b:["An employee pays 7.65% for Social Security and Medicare, and the employer pays another 7.65%.","A self-employed person is both, so pays 15.3%.","It is figured on Schedule SE, on top of income tax."]},
  {h:"The calculation",v:{k:"calc",r:[["Net profit from Schedule C","$50,000"],["× 92.35%","$46,175"],["× 15.3% = self-employment tax","$7,065",1],["Half is an adjustment to income","$3,532"]]},
   ex:"Always multiply by 92.35% first. No self-employment tax is due if net earnings are under $400."},
  {h:"Estimated payments",b:["With no employer withholding, tax is paid in four estimates: April 15, June 15, September 15 and January 15.","To avoid a penalty, pay at least 90% of this year's tax, or 100% of last year's tax.","If last year's AGI was over $150,000, the second test is 110% of last year's tax."]}],
 ex:[
  ["mc","Net profit is $50,000. What are net earnings for self-employment tax (× 92.35%)?",["$46,175","$50,000","$42,350","$7,650"],"50,000 × 0.9235."],
  ["mc","Self-employment tax on $46,175 at 15.3% is about",["$7,065","$3,532","$4,618","$707"],"46,175 × 0.153 = 7,064.78."],
  ["mc","How much of a $7,065 self-employment tax is deductible, and where?",["Half, about $3,532, as an adjustment to income","All of it, on Schedule C","None of it","Half, as an itemized deduction"],"The employer-equivalent half is an adjustment on Schedule 1."],
  ["mc","Why does a self-employed person pay 15.3% when an employee pays 7.65%?",["They pay both the employee's and the employer's share","Their rate is a penalty","They earn more","It includes income tax"],"There is no employer to pay the other half."],
  ["mc","Net earnings from self-employment are $350 for the year. Is self-employment tax due?",["No: it starts at $400 of net earnings","Yes, on all $350","Yes, at half the rate","Only if the person is over 65"],"Under $400 of net earnings there is no self-employment tax. The income is still taxable for income tax."],
  ["mc","Last year's tax was $8,000 and last year's AGI was $90,000. What total of estimates this year is safe from a penalty under the prior-year test?",["$8,000","$7,200","$8,800","$4,000"],"100% of last year's tax. The 110% test applies only when last year's AGI was over $150,000."],
  ["mc","When is the fourth estimated payment for a year due?",["January 15 of the next year","December 31","April 15 of the next year","December 15"],"The four dates are April 15, June 15, September 15 and January 15."]]},
{id:"b4",ic:"👷",t:"Workers: payroll forms and 1099s",goal:"Know the forms for employees and for contractors, and when they are due.",
 slides:[
  {h:"When someone is hired as an employee",b:["Form W-4: the employee sets income tax withholding.","Form I-9: the employer checks identity and permission to work.","Each payday: withhold income tax, Social Security and Medicare, and pay the employer's share."]},
  {h:"The employer's returns",v:{k:"tiers",r:[["Form 941","Every quarter: income tax withheld, Social Security and Medicare",40],["Form 940","Once a year: federal unemployment tax",60],["Forms W-2 and W-3","By January 31: to each employee and to the Social Security Administration",100]]},
   ex:"Form 941 is due the last day of the month after the quarter ends. The first quarter is due April 30."},
  {h:"Contractors",b:["Get a Form W-9 before the first payment.","Nothing is withheld from their pay.","A Form 1099-NEC is due by January 31 for each contractor paid $600 or more for services in 2025. For payments made in 2026 the line is $2,000.","Payments to corporations generally need no Form 1099."]}],
 ex:[
  ["mc","Which two forms does a new employee's file need on the first day?",["Form W-4 and Form I-9","Form W-9 and Form 1099-NEC","Form 941 and Form 940","Form W-2 and Form W-3"],"W-4 for withholding, I-9 for identity and permission to work."],
  ["mc","Which form reports withheld income tax, Social Security and Medicare every quarter?",["Form 941","Form 940","Form W-3","Form 1099-NEC"],"Form 941 is the employer's quarterly return."],
  ["mc","Which form reports federal unemployment tax once a year?",["Form 940","Form 941","Form W-4","Form 1065"],"Form 940 is the yearly FUTA return."],
  ["mc","By what date must employees receive their Form W-2?",["January 31","April 15","February 28","March 15"],"The same date applies to filing with the Social Security Administration."],
  ["mc","Form 941 for January through March is due",["April 30","April 15","March 31","May 15"],"The last day of the month after the quarter ends."],
  ["mc","A contractor was paid $1,500 for services during 2025. Is a Form 1099-NEC required?",["Yes: the 2025 line is $600","No: the line is $2,000","Only if they ask","Only if paid by check"],"The $2,000 line applies to payments made in 2026 and later."],
  ["mc","What should be collected from a contractor before the first payment?",["A Form W-9","A Form W-4","A Form I-9","A Form 940"],"It gives the name and tax number for the 1099."],
  ["mc","The business paid $3,000 to an incorporated plumbing company (a corporation). Is a Form 1099-NEC generally required?",["No: payments to corporations are generally exempt","Yes, always","Only if over $5,000","Only in the first year"],"The main exceptions are payments to attorneys and for medical care."]]},
{id:"b5",ic:"💼",t:"How owners get paid",goal:"Know how each kind of owner takes money out and how it is taxed.",
 slides:[
  {h:"Owner pay depends on the entity",v:{k:"tiers",r:[["Sole proprietor","Draws. Taxed on the profit, with self-employment tax",40],["Partner","Draws and guaranteed payments, reported on the K-1",60],["S corporation owner who works there","A reasonable salary through payroll, then distributions",80],["C corporation owner","Salary through payroll; dividends are taxed again",100]]}},
  {h:"Profit, not draws",b:["A sole proprietor or partner is taxed on their share of the profit.","It does not matter how much they took out.","Taking nothing does not lower the tax. Taking everything does not raise it."]},
  {h:"The S corporation salary rule",b:["Wages carry Social Security and Medicare tax. Distributions do not.","So an owner who works in the business must first be paid a reasonable salary through payroll.","Paying only distributions to avoid payroll tax is a well-known audit issue."]}],
 ex:[
  ["mc","How does a sole proprietor pay herself?",["With owner draws: no paycheck and no Form W-2","With a salary through payroll","With dividends","With a Form 1099-NEC to herself"],"She is taxed on the profit and pays self-employment tax."],
  ["mc","A sole proprietor's profit is $40,000. She took $25,000 in draws. On how much is she taxed?",["$40,000","$25,000","$15,000","$65,000"],"Tax follows the profit, not the draws."],
  ["mc","An S corporation owner works full time in the business. Before taking distributions, the owner must",["be paid a reasonable salary through payroll","file Form 1065","take a loan from the company","pay a dividend"],"Wages carry payroll taxes. Distributions do not."],
  ["mc","A partner's guaranteed payment is reported on",["Schedule K-1, and it is subject to self-employment tax","Form W-2","Form 1099-NEC","Nothing: it is not taxable"],"Partners are not employees of their partnership."],
  ["mc","Why are C corporation dividends said to be taxed twice?",["The corporation pays tax on the profit, then the shareholder pays tax on the dividend","They are taxed by two states","They are taxed in two years","The IRS bills them twice by mistake"],"That is the main tax cost of a C corporation."],
  ["mc","Where does a partner report the income from a Schedule K-1?",["On the partner's own Form 1040","On Form 1065 again","On a Form W-2","Nowhere: the partnership already paid"],"The partnership reports; the partners pay."],
  ["mc","Why does the IRS care about an S corporation owner's salary?",["Distributions avoid Social Security and Medicare tax, so the salary must be reasonable","Salaries are not deductible","Distributions are illegal","Salaries reduce the corporation's stock"],"Too little salary shifts income away from payroll taxes."]]}
];
Object.assign(CAMPACC,{"Payments to deposit":"A"});
Object.assign(CAMPS,{
 qb:{id:"qb",key:"campqb",mod:3,ic:"💻",name:"QuickBooks Bootcamp",short:"QuickBooks Bootcamp",tag:"Module 3 · learn it, then do it",co:"Cedar & Clay Studio",steps:CAMP_QB,cap:false,
  blurb:"The same studio, now in QuickBooks. Six short steps: pick the right form, money in, money out, the bank feed, reconciling and reports.",tile:"Which form to use and what it posts, in six short steps.",after:{t:"Now do it for real in the QuickBooks practice company",go:"qbo"}},
 t1:{id:"t1",key:"campt1",mod:4,ic:"🧾",cheat:false,name:"Tax Return Bootcamp",short:"Tax Return Bootcamp",tag:"Module 4 · learn it, then do it",co:"",steps:CAMP_T1,cap:false,
  blurb:"The individual return from the first document to the signature, in six short steps.",tile:"Form 1040 from income to refund, in six short steps.",after:{t:"Now do it for real in the practice tax software",go:"tax"}},
 t2:{id:"t2",key:"campt2",mod:5,ic:"🏢",cheat:false,name:"Business Tax Bootcamp",short:"Business Tax Bootcamp",tag:"Module 5 · learn it, then do it",co:"",steps:CAMP_T2,cap:false,
  blurb:"Which return a business files, Schedule C, self-employment tax, payroll forms and how owners are paid, in five short steps.",tile:"Entities, Schedule C, self-employment tax, payroll forms, owner pay.",after:{t:"Now do it for real in the practice tax software",go:"tax"}}});
