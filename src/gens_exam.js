/* ================= Calculations as the exam asks them (Version 169) =================
   Checked against the IRS's own sample questions for the 2026-27 window (law through Dec. 31, 2025), Nov 22, 2026:
   of 60 samples, 3 need arithmetic (2 of 20 in Part 1, 1 of 20 in Part 2, none in Part 3 beyond counting a period).
   Each is one or two steps on round numbers: pick the items that count, then add or subtract. Stems are full sentences.
   The wrong choices are what you get from a specific slip (counting an item that does not count, skipping a limit).
   The older calculation set drilled long phase-out arithmetic with odd numbers and near-miss choices (for example
   $467 against $584). The exam does not ask that, so for EA Parts 1 to 3 it is retired from every session.
   Every question below: full sentences, round numbers, at most two steps, and three wrong choices that each name
   the slip behind them. Figures are the 2025 amounts already used in this app's fact cards. */
const GXN=["Maria","Elena","Priya","Grace","Nina","Rosa","Lena","Ivy","Anna","Dana","Julia","Carmen","Helen","Sofia","Mei","Laura"]; /* the stems say she and her */
function GEX(id,p,d,name,make){GENS.push({id:"ge"+p+"-"+id,p,d,t:"g",lv:3,s:name,name,exam:1,make(){for(let k=0;k<12;k++){const o=make(),f=v=>typeof v==="string"?v:(o.u===""?String(v):$$(v));
      const key=f(o.a),opts=[key],why=[""];o.x.forEach(e=>{const s=f(e[0]);if(!opts.includes(s)&&opts.length<4){opts.push(s);why.push(e[1])}});
      if(opts.length===4)return{stem:o.q,ans:typeof o.a==="number"?o.a:0,key,steps:o.w.join("\n")+(o.n?"\nWatch out: "+o.n:""),tol:1,opts,why,exam:1}}
    const o=make(),key=typeof o.a==="string"?o.a:$$(o.a);return{stem:o.q,ans:typeof o.a==="number"?o.a:0,key,steps:o.w.join("\n"),tol:1,exam:1}}})}
/* ---------------- Part 1: Individuals ---------------- */
GEX("gain",1,2,"Gain on a sale of stock",()=>{const n=PK(GXN),cost=R(8,20)*1000,gain=R(2,9)*1000,fee=PK([100,200,300,500]),price=cost+gain+fee;
  return{q:`${n} bought stock for ${$$(cost)}. This year she sold all of it for ${$$(price)} and paid a ${$$(fee)} commission on the sale. What is her gain?`,a:gain,
    w:[`Amount realized: ${$$(price)} − ${$$(fee)} commission = ${$$(price-fee)}`,`Gain: ${$$(price-fee)} − ${$$(cost)} basis = ${$$(gain)}`],
    x:[[gain+fee,"That ignores the commission. Selling costs reduce the amount realized."],[gain+2*fee,"The commission was added instead of subtracted."],[price,"That is the sale price, not the gain. Subtract the basis."]]}});
GEX("gift",1,2,"Sale of property received as a gift",()=>{const n=PK(GXN),gap=R(3,5)*1000,basis=R(12,20)*1000,fmv=basis-gap,c=PK([0,1,2]),sale=c===0?fmv-R(1,4)*1000:c===1?fmv+1000:basis+R(2,6)*1000;
  const a=c===0?fmv-sale:c===1?0:sale-basis;
  const x=c===0?[[basis-sale,"The donor's basis is used only to measure a gain. For a loss, use the value on the date of the gift."],[gap,"That is the drop in value before the gift, which nobody deducts."],[0,"It sold for less than its value at the gift, so there is a loss."]]
    :c===1?[[basis-sale,"No loss: it sold for more than its value at the gift, which is the basis for a loss."],[sale-fmv,"No gain: it sold for less than the donor's basis, which is the basis for a gain."],[gap,"That is the drop in value before the gift, which nobody deducts."]]
    :[[sale-fmv,"The value at the gift is the basis only for measuring a loss. For a gain, use the donor's basis."],[gap,"That is the drop in value before the gift, not the gain."],[0,"It sold for more than the donor's basis, so there is a gain."]];
  return{q:`${n} received stock as a gift. The donor's basis was ${$$(basis)} and the stock was worth ${$$(fmv)} on the date of the gift. ${n} later sold it for ${$$(sale)}. What ${c===0?"loss":c===2?"gain":"gain or loss"} does ${n} recognize?`,a,
    w:[`Value at the gift (${$$(fmv)}) was below the donor's basis (${$$(basis)}), so there are two bases: ${$$(basis)} for a gain, ${$$(fmv)} for a loss`,c===0?`Sold below the loss basis: ${$$(fmv)} − ${$$(sale)} = ${$$(a)} loss`:c===1?`${$$(sale)} is between the two bases: no gain and no loss`:`Sold above the gain basis: ${$$(sale)} − ${$$(basis)} = ${$$(a)} gain`],x}});
GEX("inherit",1,2,"Sale of inherited property",()=>{const n=PK(GXN),cost=R(2,6)*10000,fmv=cost+R(3,8)*10000,sale=fmv+R(1,4)*5000;
  return{q:`${n} inherited land from her father. He had paid ${$$(cost)} for it, and it was worth ${$$(fmv)} on the date of his death. ${n} sold it for ${$$(sale)}. What is her gain?`,a:sale-fmv,
    w:[`Basis of inherited property is its value at the date of death: ${$$(fmv)}`,`Gain: ${$$(sale)} − ${$$(fmv)} = ${$$(sale-fmv)}, treated as long-term`],
    x:[[sale-cost,"That uses the father's cost. Inherited property takes its value at death as basis."],[sale,"That is the sale price. Subtract the basis."],[fmv-cost,"That is the growth before death, which is never taxed to the heir."]]}});
GEX("home",1,2,"Gain on the sale of a main home",()=>{const mfj=PK([0,1]),lim=mfj?500000:250000,gain=lim+R(2,12)*10000,who=mfj?"A married couple filing jointly":"A single taxpayer";
  return{q:`${who} sold a main home they had owned and lived in for 8 years. The gain on the sale was ${$$(gain)}. How much of the gain is taxable?`,a:gain-lim,
    w:[`Exclusion for ${mfj?"a joint return":"a single taxpayer"}: ${$$(lim)} (owned and used 2 of the last 5 years)`,`Taxable gain: ${$$(gain)} − ${$$(lim)} = ${$$(gain-lim)}`],
    x:[[gain,"The exclusion was not applied."],[0,"The gain is larger than the exclusion, so part of it is taxed."],[mfj?gain-250000:250000,mfj?"$250,000 is the single amount. A joint return excludes $500,000.":"That is the exclusion, the part that is NOT taxed."]]}});
GEX("caploss",1,2,"Capital loss limit and carryover",()=>{const n=PK(GXN),loss=R(9,15)*1000,gain=R(1,4)*1000,net=loss-gain;
  return{q:`In 2025 ${n} had a ${$$(loss)} capital loss and a ${$$(gain)} capital gain, and no other capital transactions. How much capital loss carries over to 2026?`,a:net-3000,
    w:[`Net capital loss: ${$$(loss)} − ${$$(gain)} = ${$$(net)}`,`Deduct $3,000 against other income this year; carry over ${$$(net)} − $3,000 = ${$$(net-3000)}`],
    x:[[net,"That is the whole net loss. $3,000 of it is used this year."],[loss-3000,"Net the gain against the loss first."],[3000,"$3,000 is the amount deducted this year, not the carryover."]]}});
GEX("wash",1,2,"Basis after a wash sale",()=>{const n=PK(GXN),loss=R(1,4)*500,cost=R(4,9)*1000;
  return{q:`${n} sold 100 shares of stock at a ${$$(loss)} loss. Ten days later she bought 100 shares of the same stock for ${$$(cost)}. What is her basis in the new shares?`,a:cost+loss,
    w:["Buying the same stock within 30 days makes it a wash sale: the loss is not deductible now",`The disallowed loss is added to the new shares: ${$$(cost)} + ${$$(loss)} = ${$$(cost+loss)}`],
    x:[[cost,"That ignores the wash sale. The disallowed loss is added to the basis of the new shares."],[cost-loss,"The disallowed loss is added to basis, not subtracted."],[loss,"That is the loss, not the basis."]]}});
GEX("rental",1,2,"Rental loss allowance",()=>{const n=PK(GXN),magi=100000+R(1,4)*10000,allow=25000-(magi-100000)/2,loss=allow+R(1,4)*1000;
  return{q:`${n} actively participates in a rental house that lost ${$$(loss)} this year. Her modified AGI is ${$$(magi)} and she has no passive income. How much of the loss can she deduct this year?`,a:allow,
    w:[`The $25,000 allowance shrinks by 50% of modified AGI over $100,000: 50% × ${$$(magi-100000)} = ${$$((magi-100000)/2)}`,`Allowance: $25,000 − ${$$((magi-100000)/2)} = ${$$(allow)}; the rest of the loss is suspended`],
    x:[[loss,"The loss is larger than the allowance left at this income."],[25000,"The $25,000 allowance is reduced once modified AGI passes $100,000."],[(magi-100000)/2,"That is the reduction, not the allowance that remains."]]}});
GEX("roth",1,2,"Roth IRA withdrawal before age 59½",()=>{const n=PK(GXN),contrib=R(10,25)*1000,take=contrib+R(2,8)*1000;
  return{q:`${n}, age 40, withdraws ${$$(take)} from a Roth IRA she opened 8 years ago. Her total contributions were ${$$(contrib)} and she has made no conversions. How much of the withdrawal is taxable?`,a:take-contrib,
    w:[`Contributions come out first, tax-free: ${$$(contrib)}`,`The rest is earnings, taxable because she is under 59½: ${$$(take)} − ${$$(contrib)} = ${$$(take-contrib)}`],
    x:[[take,"Contributions to a Roth IRA always come out tax-free first."],[0,"The account is over 5 years old, but she is under 59½, so the earnings are taxable."],[contrib,"That is the tax-free part."]]}});
GEX("early",1,2,"Additional 10% tax on an early IRA withdrawal",()=>{const n=PK(GXN),take=R(10,30)*1000,ex=R(3,8)*1000;
  return{q:`${n}, age 35, withdrew ${$$(take)} from a traditional IRA and used ${$$(ex)} of it for her own college tuition. What is the additional 10% tax?`,a:(take-ex)/10,
    w:[`Higher education expenses are an exception for IRAs: ${$$(ex)} escapes the 10%`,`10% × (${$$(take)} − ${$$(ex)}) = ${$$((take-ex)/10)}. The whole ${$$(take)} is still taxable income`],
    x:[[take/10,"The part used for higher education is not subject to the 10%."],[ex/10,"That applies the 10% to the part that is excepted."],[0,"Only the tuition part is excepted."]]}});
GEX("rmd",1,5,"Required minimum distribution",()=>{const n=PK(GXN),t=PK([[73,26.5],[74,25.5],[75,24.6],[80,20.2]]),a=R(6,14)*1000,prior=Math.round(a*t[1]),cur=Math.round((a+2000)*t[1]);
  return{q:`${n} turned ${t[0]} in 2025. Her traditional IRA held ${$$(prior)} on December 31, 2024 and ${$$(cur)} on December 31, 2025. The factor for age ${t[0]} is ${t[1]}. What is her required minimum distribution for 2025?`,a,
    w:[`Use the balance at the end of the PRIOR year: ${$$(prior)}`,`${$$(prior)} ÷ ${t[1]} = ${$$(a)}`],
    x:[[a+2000,"That uses the balance at the end of 2025. The rule uses the prior December 31."],[Math.round(prior*0.04/100)*100,"There is no flat 4% rule. Divide the prior year-end balance by the factor."],[a/2,"Do not halve it. The whole amount must come out."]]}});
GEX("ira",1,5,"IRA contribution limit",()=>{const n=PK(GXN),old=PK([0,1]),lim=old?8000:7000,comp=R(3,6)*1000;
  return{q:`${n}, age ${old?55:30}, is single. Her only income in 2025 is ${$$(comp)} of wages and $20,000 of interest. What is the most she can contribute to a traditional IRA for 2025?`,a:comp,
    w:[`2025 limit: $7,000${old?" + $1,000 catch-up at 50 or older = $8,000":""}`,`But never more than compensation: wages are ${$$(comp)}; interest is not compensation`],
    x:[[lim,"The limit is the smaller of the dollar limit or compensation."],[old?7000:8000,old?"She is over 50, but compensation is the cap here.":"The catch-up is only at 50 or older, and compensation is the cap here."],[comp+20000,"Interest does not count as compensation, and the dollar limit would cap it anyway."]]}});
GEX("depsd",1,1,"Standard deduction of a dependent",()=>{const n=PK(GXN),hi=PK([0,1,1]),w=hi?R(4,18)*500:R(2,8)*100;const a=hi?w+450:1350;
  return{q:`${n}, age 17, is claimed as a dependent by her parents. In 2025 she earned ${$$(w)} in wages and had $300 of interest. What is her standard deduction?`,a,
    w:[`Earned income + $450: ${$$(w)} + $450 = ${$$(w+450)}`,`Take the larger of that or $1,350: ${$$(a)} (never more than $15,750)`],
    x:[[hi?1350:w+450,hi?"$1,350 is only the minimum. Earned income plus $450 is larger here.":"Earned income plus $450 is below the $1,350 minimum."],[15750,"A dependent does not get the full standard deduction unless earned income is that high."],[w+300,"Use earned income plus $450, not total income."]]}});
GEX("kiddie",1,4,"Kiddie tax",()=>{const n=PK(GXN),u=R(40,90)*100;
  return{q:`${n}, age 12, has ${$$(u)} of dividend income in 2025 and no earned income. How much of it is taxed at her parents' rate?`,a:u-2700,
    w:["First $1,350: covered by her standard deduction. Next $1,350: taxed at her own rate",`Over $2,700 is taxed at the parents' rate: ${$$(u)} − $2,700 = ${$$(u-2700)}`],
    x:[[u-1350,"Two $1,350 layers come off first, $2,700 in all."],[u,"The first $2,700 is not taxed at the parents' rate."],[2700,"That is the amount NOT taxed at the parents' rate."]]}});
GEX("medical",1,3,"Medical expense deduction",()=>{const n=PK(GXN),agi=R(4,10)*10000,floor=agi*0.075,over=R(1,6)*1000,exp=floor+over;
  return{q:`${n} itemizes deductions. Her AGI is ${$$(agi)} and she paid ${$$(exp)} of unreimbursed medical expenses. How much can she deduct?`,a:over,
    w:[`Floor: 7.5% × ${$$(agi)} = ${$$(floor)}`,`Deductible: ${$$(exp)} − ${$$(floor)} = ${$$(over)}`],
    x:[[exp,"Only the part above 7.5% of AGI is deductible."],[floor,"That is the floor, the part that is NOT deductible."],[Math.max(500,exp-agi/10),"The floor is 7.5% of AGI, not 10%."]]}});
GEX("aotc",1,3,"American Opportunity Credit",()=>{const n=PK(GXN),x=PK([2400,2800,3200,3600]),a=2000+(x-2000)/4;
  return{q:`${n} paid ${$$(x)} of tuition and required books for her son's first year of college. Her income is below the phase-out. What is her American Opportunity Credit?`,a,
    w:["100% of the first $2,000 = $2,000",`25% of the next ${$$(x-2000)} = ${$$((x-2000)/4)}; total ${$$(a)} (the most is $2,500)`],
    x:[[x,"The credit is not the full expense: 100% of the first $2,000, then 25% of the next $2,000."],[2000,"Add 25% of the expenses between $2,000 and $4,000."],[2500,"$2,500 is the maximum, reached at $4,000 of expenses."]]}});
GEX("ctc",1,3,"Child tax credit and credit for other dependents",()=>{const k=PK([1,2,3]),o=PK([1,2]),a=k*2200+o*500;
  return{q:`A couple filing jointly, with income below the phase-out, has ${k} qualifying ${k>1?"children":"child"} under age 17 and ${o} dependent ${o>1?"children":"child"} age 17 or older. What is the total of their child tax credit and credit for other dependents for 2025?`,a,
    w:[`Child tax credit: ${k} × $2,200 = ${$$(k*2200)}`,`Credit for other dependents: ${o} × $500 = ${$$(o*500)}; total ${$$(a)}`],
    x:[[(k+o)*2200,"A child who is 17 or older gets the $500 credit, not $2,200."],[k*2200,"Add $500 for each other dependent."],[k*2000+o*500,"The child tax credit is $2,200 per child for 2025."]]}});
GEX("schaint",1,3,"Interest deductible on Schedule A",()=>{const n=PK(GXN),inv=R(4,9)*1000,mg=inv+R(1,4)*1000,mort=R(5,12)*1000,sec=R(2,5)*1000,cc=R(1,3)*1000,home=PK(["houseboat","mobile home","cabin"]),ok=Math.min(mg,inv),ans=ok+mort+sec;
  return{q:`${n} itemizes for 2025. Her only investment income is ${$$(inv)} of interest and ordinary dividends. She paid ${$$(mg)} of margin interest on a loan used to buy stock, ${$$(mort)} of mortgage interest on her main home, ${$$(sec)} of interest on the loan for a ${home} she uses as a second home, and ${$$(cc)} of credit card interest on personal purchases. How much interest can she deduct on Schedule A?`,a:ans,
    w:[`Investment interest: ${$$(mg)} of margin interest, limited to net investment income of ${$$(inv)} = ${$$(ok)} (Form 4952). The other ${$$(mg-inv)} carries forward to next year.`,`Add the mortgage interest on both homes (${$$(mort)} + ${$$(sec)}); credit card interest is personal and adds nothing: ${$$(ok)} + ${$$(mort+sec)} = ${$$(ans)}`],
    n:`a ${home} counts as a second home when it has sleeping, cooking and toilet facilities.`,
    x:[[mg+mort+sec,"That deducts all of the margin interest. Investment interest is limited to net investment income; the excess carries forward."],[ok+mort,"That leaves out the second home. Mortgage interest on one second home is deductible too."],[ans+cc,"That includes the credit card interest. Personal interest is never deductible."]]}});
GEX("charity",1,3,"Cash gifts to charity",()=>{const n=PK(GXN),agi=R(5,12)*10000,lim=agi*0.6,gift=lim+R(1,5)*5000;
  return{q:`${n} itemizes. Her AGI is ${$$(agi)} and in 2025 she gave ${$$(gift)} in cash to her church. How much can she deduct this year?`,a:lim,
    w:[`Cash to a public charity is limited to 60% of AGI: 60% × ${$$(agi)} = ${$$(lim)}`,`The other ${$$(gift-lim)} carries forward for up to 5 years`],
    x:[[gift,"Cash gifts are limited to 60% of AGI. The excess carries forward."],[agi/2,"The limit for cash to a public charity is 60% of AGI."],[agi*0.3,"30% is the limit for gifts of appreciated property, not cash."]]}});
GEX("gross",1,2,"What counts as gross income",()=>{const n=PK(GXN),w=R(30,60)*1000,i=R(2,9)*100,u=R(2,6)*1000,cs=R(3,8)*1000,gf=R(5,15)*1000;
  return{q:`In 2025 ${n} received ${$$(w)} of wages, ${$$(i)} of bank interest, ${$$(u)} of unemployment compensation, ${$$(cs)} of child support and a ${$$(gf)} cash gift from her aunt. What is her gross income?`,a:w+i+u,
    w:[`Count wages, interest and unemployment: ${$$(w)} + ${$$(i)} + ${$$(u)} = ${$$(w+i+u)}`,"Child support and gifts received are not income"],
    x:[[w+i+u+cs,"Child support received is not income."],[w+i,"Unemployment compensation is taxable."],[w+i+u+cs+gf,"Child support and gifts received are not income."]]}});
GEX("safe",1,4,"Estimated tax safe harbor",()=>{const n=PK(GXN),cur=R(2,6)*10000,hiPrior=PK([0,1]),prior=hiPrior?cur*1.2:cur*0.8,a=Math.min(cur*0.9,prior);
  return{q:`${n}'s 2024 tax was ${$$(prior)} and her 2024 AGI was $90,000. She expects her 2025 tax to be ${$$(cur)}. What is the smallest total of 2025 payments that avoids the underpayment penalty?`,a,
    w:[`90% of this year's tax: ${$$(cur*0.9)}. 100% of last year's tax: ${$$(prior)} (100% because last year's AGI was $150,000 or less)`,`Pay the smaller: ${$$(a)}`],
    x:[[hiPrior?prior:cur*0.9,"She needs only the smaller of the two tests."],[cur,"She does not have to pay 100% of this year's tax."],[prior*1.1,"110% of last year's tax applies only when last year's AGI was over $150,000."]]}});
GEX("ftf",1,4,"Late filing penalty",()=>{const n=PK(GXN),tax=R(2,10)*1000,m=PK([2,3,4]);
  return{q:`${n} filed her return ${m} months late with no extension. It showed ${$$(tax)} of unpaid tax, which she paid with the return. Ignoring the minimum penalty, what is the combined failure-to-file and failure-to-pay penalty?`,a:tax*m*0.05,
    w:["Late filing is 5% a month and late payment 0.5% a month, but when both apply the filing penalty drops by the payment penalty: 5% a month combined",`5% × ${m} months × ${$$(tax)} = ${$$(tax*m*0.05)}`],
    x:[[tax*m*0.055,"The two are not stacked. Together they are 5% a month."],[tax*m*0.005,"That is the late payment penalty alone."],[tax*0.25,"25% is the maximum, reached after 5 months."]]}});
GEX("addmed",1,4,"Additional Medicare Tax",()=>{const n=PK(GXN),w=200000+R(2,10)*10000;
  return{q:`${n} is single and her only income in 2025 is ${$$(w)} of wages. What is her Additional Medicare Tax?`,a:(w-200000)*0.009,
    w:[`Wages over the $200,000 threshold for a single taxpayer: ${$$(w-200000)}`,`0.9% × ${$$(w-200000)} = ${$$((w-200000)*0.009)}`],
    x:[[w*0.009,"The 0.9% applies only to wages above $200,000."],[(w-200000)*0.038,"3.8% is the net investment income tax, a different tax."],[(w-200000)*0.0145,"1.45% is the regular Medicare rate. The additional tax is 0.9%."]]}});
GEX("niit",1,4,"Net investment income tax",()=>{const n=PK(GXN),ex=R(2,6)*10000,nii=ex+R(1,4)*10000,wages=200000+ex-nii;
  return{q:`${n} is single. In 2025 she has ${$$(wages)} of wages and ${$$(nii)} of net investment income, so her modified AGI is ${$$(wages+nii)}. What is her net investment income tax?`,a:ex*0.038,
    w:[`Modified AGI over the $200,000 threshold: ${$$(ex)}`,`3.8% × the smaller of net investment income (${$$(nii)}) or that excess (${$$(ex)}) = ${$$(ex*0.038)}`],
    x:[[nii*0.038,"The tax is on the smaller of net investment income or the excess over the threshold."],[(wages+nii)*0.038,"The 3.8% is not applied to all of modified AGI."],[ex*0.009,"0.9% is the Additional Medicare Tax. This tax is 3.8%."]]}});
GEX("gifttax",1,6,"Taxable gift",()=>{const n=PK(GXN),g=R(3,9)*10000,t=R(2,5)*10000;
  return{q:`In 2025 ${n}, who is single, gave her nephew ${$$(g)} in cash and paid ${$$(t)} of his tuition directly to his university. What is the amount of her taxable gifts?`,a:g-19000,
    w:[`Tuition paid directly to the school is not a gift: ignore the ${$$(t)}`,`Cash gift less the annual exclusion: ${$$(g)} − $19,000 = ${$$(g-19000)}`],
    x:[[g,"Subtract the $19,000 annual exclusion."],[g+t-19000,"Tuition paid directly to the school is not a gift at all."],[g+t,"Tuition paid directly is not a gift, and the annual exclusion applies to the cash."]]}});
GEX("split",1,6,"Gift splitting",()=>{const g=R(5,12)*10000;
  return{q:`In 2025 a wife gave her son ${$$(g)} from her own account. She and her husband elect to split gifts. What is each spouse's taxable gift?`,a:g/2-19000,
    w:[`Each spouse is treated as giving half: ${$$(g/2)}`,`Each uses a $19,000 annual exclusion: ${$$(g/2)} − $19,000 = ${$$(g/2-19000)}`],
    x:[[g-19000,"With gift splitting each spouse is treated as giving half."],[g/2,"Each spouse still subtracts the $19,000 annual exclusion."],[g-38000,"That is the total for both spouses together, not each."]]}});
GEX("spt",1,6,"Substantial presence test",()=>{const c=R(8,15)*10,p1=R(2,10)*15,p2=R(2,10)*30,a=c+p1/3+p2/6;
  return{u:"",q:`A foreign citizen was present in the United States for ${c} days in 2025, ${p1} days in 2024 and ${p2} days in 2023. How many days count toward the substantial presence test for 2025?`,a,
    w:[`2025 counts in full: ${c}. 2024 counts one-third: ${p1/3}. 2023 counts one-sixth: ${p2/6}`,`Total ${a} days. The test is met at 183 (with at least 31 days in the current year)`],
    x:[[c+p1+p2,"Prior years do not count in full: one-third of last year, one-sixth of the year before."],[c,"Add one-third of last year's days and one-sixth of the year before."],[c+p1/3,"Add one-sixth of the days from two years back."]]}});
GEX("install",1,2,"Installment sale",()=>{const n=PK(GXN),basis=PK([40,50,60,75])*1000,rec=PK([20,40])*1000,gp=(100000-basis)/100000;
  return{q:`${n} sold land with a basis of ${$$(basis)} for $100,000. She received ${$$(rec)} this year and will receive the rest in later years. How much gain does she report this year under the installment method?`,a:rec*gp,
    w:[`Gross profit: $100,000 − ${$$(basis)} = ${$$(100000-basis)}, which is ${Math.round(gp*100)}% of the price`,`${Math.round(gp*100)}% × ${$$(rec)} received = ${$$(rec*gp)}`],
    x:[[100000-basis,"That is the whole gain. Only the share received this year is reported."],[rec,"Part of each payment is a return of basis."],[rec*(1-gp),"That is the basis part of the payment, not the gain part."]]}});
GEX("boot",1,2,"Like-kind exchange with cash received",()=>{const n=PK(GXN),basis=R(10,20)*10000,gain=R(4,9)*10000,boot=R(1,3)*10000,fmvNew=basis+gain-boot;
  return{q:`${n} exchanged rental land with a basis of ${$$(basis)} for other rental land worth ${$$(fmvNew)} plus ${$$(boot)} in cash. How much gain does she recognize?`,a:boot,
    w:[`Gain realized: ${$$(fmvNew)} + ${$$(boot)} − ${$$(basis)} = ${$$(gain)}`,`Gain is recognized only up to the cash received: ${$$(boot)}`],
    x:[[gain,"In a like-kind exchange the gain is taxed only up to the cash or other property received."],[0,"Cash received is taxed, up to the gain."],[gain-boot,"That is the gain that is postponed, not the gain recognized."]]}});
/* ---------------- Part 2: Businesses ---------------- */
GEX("pbasis",2,1,"Partner's basis at year end",()=>{const n=PK(GXN),b=R(2,6)*10000,inc=R(1,4)*10000,dist=R(1,3)*5000;
  return{q:`${n}'s basis in her partnership interest was ${$$(b)} at the start of the year. Her share of partnership income was ${$$(inc)} and she received a ${$$(dist)} cash distribution. What is her basis at year end?`,a:b+inc-dist,
    w:[`Add her share of income: ${$$(b)} + ${$$(inc)} = ${$$(b+inc)}`,`Subtract the distribution: ${$$(b+inc)} − ${$$(dist)} = ${$$(b+inc-dist)}`],
    x:[[b+inc,"Distributions reduce basis."],[b-dist,"Her share of income increases basis, whether or not it is distributed."],[b+inc+dist,"A distribution is subtracted, not added."]]}});
GEX("sloss",2,1,"S corporation loss limited by basis",()=>{const n=PK(GXN),sb=R(1,4)*10000,loan=PK([0,5000,10000]),loss=sb+loan+R(1,4)*5000;
  return{q:`${n} has a stock basis of ${$$(sb)} in her S corporation${loan?` and has lent it ${$$(loan)} directly`:""}. She also guaranteed a $50,000 bank loan to the corporation. Her share of this year's loss is ${$$(loss)}. How much of the loss can she deduct?`,a:sb+loan,
    w:[`Losses are limited to stock basis${loan?" plus debt basis":""}: ${$$(sb)}${loan?" + "+$$(loan)+" = "+$$(sb+loan):""}`,`The other ${$$(loss-sb-loan)} is suspended. A guarantee creates no basis`],
    x:[[loss,"The loss is limited to her basis. Guaranteeing a bank loan does not create basis."],[loss-sb-loan,"That is the suspended part, not the part she can deduct."],[loan?sb:0,loan?"Her direct loan to the corporation counts as debt basis.":"She has stock basis, so part of the loss is allowed."]]}});
GEX("ctax",2,1,"C corporation income tax",()=>{const ti=R(10,90)*10000;
  return{q:`A C corporation has taxable income of ${$$(ti)} for 2025. What is its federal income tax?`,a:ti*0.21,
    w:["C corporations pay a flat 21%",`21% × ${$$(ti)} = ${$$(ti*0.21)}`],
    x:[[ti*0.35,"35% was the top rate before 2018. The rate is a flat 21%."],[ti*0.15,"There are no graduated corporate rates now. The rate is a flat 21%."],[ti*0.2,"20% is the accumulated earnings tax rate. The income tax rate is 21%."]]}});
GEX("drd",2,1,"Dividends-received deduction",()=>{const own=PK([10,30]),pct=own<20?0.5:0.65,d=R(2,10)*10000;
  return{q:`A C corporation owns ${own}% of another domestic corporation and received ${$$(d)} of dividends from it. Its taxable income is far above that amount. What is the dividends-received deduction?`,a:d*pct,
    w:[`Ownership of ${own<20?"less than 20%":"20% or more but less than 80%"}: the deduction is ${pct*100}%`,`${pct*100}% × ${$$(d)} = ${$$(d*pct)}`],
    x:[[d*(pct===0.5?0.65:0.5),`${pct===0.5?"65% needs ownership of at least 20%.":"50% is for ownership under 20%."}`],[d,"100% needs ownership of 80% or more."],[d*0.8,"80% is an old rate. The rates are 50%, 65% and 100%."]]}});
GEX("ccharity",2,1,"Corporate charitable deduction",()=>{const ti=R(2,9)*100000,gift=ti*0.1+R(1,5)*10000;
  return{q:`A C corporation has taxable income of ${$$(ti)} before its charitable deduction and gave ${$$(gift)} to qualified charities in 2025. How much can it deduct this year?`,a:ti*0.1,
    w:[`Limit: 10% × ${$$(ti)} = ${$$(ti*0.1)}`,`The other ${$$(gift-ti*0.1)} carries forward for 5 years`],
    x:[[gift,"A corporation's charitable deduction is limited to 10% of taxable income."],[ti*0.6,"60% is the limit for an individual's cash gifts."],[ti*0.25,"25% was a temporary limit. For 2025 it is 10%."]]}});
GEX("gp",2,1,"Guaranteed payment and distributive share",()=>{const n=PK(GXN),gp=R(2,5)*10000,after=R(4,12)*10000,sh=PK([25,50]);
  return{q:`A partnership has ordinary income of ${$$(after+gp)} before deducting a ${$$(gp)} guaranteed payment to ${n} for services. ${n} has a ${sh}% share of profits. How much ordinary income does ${n} report from the partnership?`,a:gp+after*sh/100,
    w:[`Partnership income after the guaranteed payment: ${$$(after+gp)} − ${$$(gp)} = ${$$(after)}`,`${n}: ${$$(gp)} guaranteed payment + ${sh}% × ${$$(after)} = ${$$(gp+after*sh/100)}`],
    x:[[after*sh/100,"Add the guaranteed payment, which is ordinary income to the partner."],[(after+gp)*sh/100,"The guaranteed payment goes to her in full, then she shares what is left."],[gp+(after+gp)*sh/100,"Deduct the guaranteed payment before splitting the remaining income."]]}});
GEX("s179",2,2,"Section 179 and the business income limit",()=>{const cost=R(6,12)*10000,inc=cost-R(1,4)*10000;
  return{q:`A sole proprietor bought ${$$(cost)} of equipment in 2025 and elects Section 179 for all of it. Her taxable income from the business before the deduction is ${$$(inc)}, and she has no other business income. How much Section 179 expense can she deduct this year?`,a:inc,
    w:[`The cost is well under the $2,500,000 limit, but the deduction cannot exceed business taxable income: ${$$(inc)}`,`The other ${$$(cost-inc)} carries forward`],
    x:[[cost,"Section 179 is limited to taxable income from the business. The excess carries forward."],[cost-inc,"That is the carryforward, not this year's deduction."],[0,"She can deduct up to her business taxable income."]]}});
GEX("mileage",2,2,"Standard mileage rate",()=>{const n=PK(GXN),mi=R(5,20)*1000,pk=R(2,9)*100;
  return{q:`${n}, a self-employed consultant, drove ${mi.toLocaleString("en-US")} business miles in 2025 and paid ${$$(pk)} for business parking and tolls. Using the standard mileage rate, what is her vehicle deduction?`,a:mi*0.7+pk,
    w:[`${mi.toLocaleString("en-US")} miles × 70 cents = ${$$(mi*0.7)}`,`Parking and tolls are added: ${$$(mi*0.7)} + ${$$(pk)} = ${$$(mi*0.7+pk)}`],
    x:[[mi*0.7,"Business parking and tolls are deductible on top of the mileage rate."],[mi*0.67+pk,"67 cents was the 2024 rate. For 2025 it is 70 cents."],[mi*0.7-pk,"Parking and tolls are added, not subtracted."]]}});
GEX("meals",2,2,"Business meals and entertainment",()=>{const m=R(2,9)*1000,e=R(1,5)*1000;
  return{q:`A business paid ${$$(m)} for meals with clients, where business was discussed, and ${$$(e)} for tickets to take clients to ball games. How much can it deduct?`,a:m/2,
    w:[`Business meals: 50% × ${$$(m)} = ${$$(m/2)}`,"Entertainment is not deductible at all"],
    x:[[m,"Business meals are only 50% deductible."],[(m+e)/2,"Entertainment is not deductible, not even at 50%."],[m+e,"Meals are 50% deductible and entertainment is not deductible."]]}});
GEX("startup",2,2,"Startup costs in the first year",()=>{const s=PK([51000,52000,53000,54000]),a=5000-(s-50000);
  return{q:`A new business paid ${$$(s)} of startup costs before it opened in 2025. Not counting amortization of the remainder, how much can it deduct immediately in its first year?`,a,
    w:[`The $5,000 first-year amount shrinks dollar for dollar once costs pass $50,000: ${$$(s)} − $50,000 = ${$$(s-50000)}`,`$5,000 − ${$$(s-50000)} = ${$$(a)}; the rest is amortized over 180 months`],
    x:[[5000,"The $5,000 is reduced when startup costs exceed $50,000."],[s,"Startup costs are not all deductible at once."],[s-50000,"That is the reduction, not what is left of the $5,000."]]}});
GEX("cogs",2,2,"Cost of goods sold",()=>{const b=R(2,6)*10000,p=R(10,30)*10000,e=R(2,6)*10000;
  return{q:`A retailer began the year with ${$$(b)} of inventory, purchased ${$$(p)} of merchandise, and ended the year with ${$$(e)} of inventory. What is its cost of goods sold?`,a:b+p-e,
    w:[`Goods available: ${$$(b)} + ${$$(p)} = ${$$(b+p)}`,`Less ending inventory: ${$$(b+p)} − ${$$(e)} = ${$$(b+p-e)}`],
    x:[[p,"Adjust purchases for the change in inventory."],[b+p,"Subtract the ending inventory."],[p+e-b===b+p-e?p+e:p+e-b,"Beginning inventory is added and ending inventory subtracted."]]}});
GEX("recap",2,2,"Depreciation recapture on equipment",()=>{const cost=R(4,9)*10000,dep=R(1,3)*10000,over=PK([0,1]),sale=over?cost+R(1,3)*5000:cost-dep+R(1,2)*5000,gain=sale-(cost-dep),a=Math.min(gain,dep);
  return{q:`A business sold equipment for ${$$(sale)}. It had cost ${$$(cost)} and ${$$(dep)} of depreciation had been taken. How much of the gain is ordinary income?`,a,
    w:[`Adjusted basis: ${$$(cost)} − ${$$(dep)} = ${$$(cost-dep)}; gain: ${$$(sale)} − ${$$(cost-dep)} = ${$$(gain)}`,`Gain is ordinary up to the depreciation taken (${$$(dep)}): ${$$(a)}${gain>dep?`; the other ${$$(gain-dep)} is Section 1231 gain`:""}`],
    x:[[over?gain:dep,over?"Only the gain up to the depreciation taken is ordinary. The rest is Section 1231 gain.":"Recapture cannot be more than the gain itself."],[0,"Gain on depreciable equipment is ordinary up to the depreciation taken."],[over?gain-dep:sale,over?"That is the Section 1231 part, not the ordinary part.":"That is the sale price, not the gain."]]}});
GEX("homeoff",2,2,"Home office, simplified method",()=>{const big=PK([0,1]),sq=big?R(35,50)*10:R(10,28)*10,a=Math.min(sq,300)*5;
  return{q:`A self-employed designer uses ${sq} square feet of her home regularly and exclusively as her principal place of business. Using the simplified method, what is her home office deduction?`,a,
    w:[`$5 a square foot, up to 300 square feet`,`${Math.min(sq,300)} × $5 = ${$$(a)}`],
    x:[[big?sq*5:1500,big?"The simplified method stops at 300 square feet.":"$1,500 is the maximum, at 300 square feet."],[sq*10===a?sq*4:sq*10,"The rate is $5 a square foot."],[Math.min(sq,300)*5+500,"There is no extra amount on top of $5 a square foot."]]}});
GEX("futa",2,2,"Federal unemployment tax",()=>{const n=R(3,12);
  return{q:`An employer has ${n} employees who each earned $40,000 in 2025. It paid its state unemployment tax in full and on time and gets the full credit. What is its federal unemployment (FUTA) tax for the year?`,a:n*42,
    w:["FUTA applies to the first $7,000 of each employee's wages. With the full state credit the rate is 0.6%: $42 per employee",`${n} × $42 = ${$$(n*42)}`],
    x:[[n*420,"That is 6.0% of $7,000. The state credit brings the rate down to 0.6%."],[n*240,"FUTA applies only to the first $7,000 of each employee's wages."],[n*2400,"Only the first $7,000 of wages is taxed, and the rate after the credit is 0.6%."]]}});
/* ---------------- Part 3: Representation ---------------- */
GEX("p3ftf",3,2,"Late filing penalty",()=>{const tax=R(2,10)*1000,m=PK([2,3,4]);
  return{q:`A taxpayer filed ${m} months late with no extension. The return showed ${$$(tax)} of unpaid tax, paid with the return. Ignoring the minimum penalty, what is the combined failure-to-file and failure-to-pay penalty?`,a:tax*m*0.05,
    w:["When both penalties apply in a month the filing penalty drops by the payment penalty: 5% a month combined",`5% × ${m} months × ${$$(tax)} = ${$$(tax*m*0.05)}`],
    x:[[tax*m*0.055,"The two are not stacked. Together they are 5% a month."],[tax*m*0.005,"That is the late payment penalty alone."],[tax*0.25,"25% is the maximum, reached after 5 months."]]}});
GEX("p3acc",3,1,"Accuracy-related penalty",()=>{const u=R(3,12)*1000;
  return{q:`An examination finds a ${$$(u)} underpayment of tax caused by negligence. No fraud is involved. What is the accuracy-related penalty?`,a:u*0.2,
    w:["Negligence: 20% of the underpayment",`20% × ${$$(u)} = ${$$(u*0.2)}`],
    x:[[u*0.75,"75% is the civil fraud penalty."],[u*0.4,"40% applies to gross valuation misstatements."],[u*0.05,"5% a month is the late filing penalty."]]}});
GEX("p3prep",3,1,"Preparer penalty for an unreasonable position",()=>{const hi=PK([0,1]),fee=hi?R(3,8)*1000:R(4,16)*100,a=Math.max(1000,fee/2);
  return{q:`A preparer charged ${$$(fee)} for a return that understated tax because of an unreasonable position. What is the Section 6694(a) penalty?`,a,
    w:[`The greater of $1,000 or 50% of the fee: 50% × ${$$(fee)} = ${$$(fee/2)}`,`Penalty: ${$$(a)}`],
    x:[[hi?1000:fee/2,hi?"$1,000 is only the minimum. 50% of the fee is larger here.":"The penalty is never less than $1,000."],[Math.max(5000,fee*0.75),"The greater of $5,000 or 75% of the fee is for willful or reckless conduct."],[fee,"The penalty is 50% of the fee, not all of it."]]}});
GEX("p3sub",3,1,"Substantial understatement threshold",()=>{const hi=PK([0,1]),tax=hi?R(6,20)*10000:R(1,4)*10000,a=Math.max(5000,tax/10);
  return{q:`An individual's correct tax for the year is ${$$(tax)}. Above what amount is an understatement "substantial" for the accuracy-related penalty?`,a,
    w:[`The greater of 10% of the correct tax or $5,000: 10% × ${$$(tax)} = ${$$(tax/10)}`,`Threshold: ${$$(a)}`],
    x:[[hi?5000:tax/10,hi?"$5,000 is only the floor. 10% of the correct tax is larger here.":"The threshold is never less than $5,000."],[tax/4,"25% is the omission of gross income that opens the 6-year assessment period."],[10000,"$10,000 belongs to the corporate test."]]}});
GEX("p3oic",3,3,"Payment with a lump sum offer",()=>{const o=R(2,10)*5000;
  return{q:`A taxpayer who is not low-income submits a lump sum offer in compromise of ${$$(o)} based on doubt as to collectibility. Besides the application fee, how much must be paid with the offer?`,a:o*0.2,
    w:["A lump sum offer needs 20% with the application, and it is not refundable",`20% × ${$$(o)} = ${$$(o*0.2)}`],
    x:[[o,"Only 20% is paid with a lump sum offer."],[o*0.1,"The payment with a lump sum offer is 20%."],[205,"$205 is the application fee, which is paid in addition."]]}});
GEX("p3tfrp",3,3,"Trust fund recovery penalty",()=>{const w=R(10,30)*1000,e=R(4,9)*1000;
  return{q:`A company failed to pay over one quarter's payroll taxes: ${$$(w)} of income tax withheld from employees, ${$$(e)} of the employees' share of Social Security and Medicare, and ${$$(e)} of the employer's share. What amount can be assessed against a responsible officer as the trust fund recovery penalty?`,a:w+e,
    w:[`Trust fund taxes are the withheld income tax and the employees' share: ${$$(w)} + ${$$(e)} = ${$$(w+e)}`,"The employer's own share is not a trust fund tax"],
    x:[[w+2*e,"The employer's share is not a trust fund tax."],[w,"The employees' share of Social Security and Medicare is also a trust fund tax."],[2*e,"The withheld income tax is the largest trust fund tax."]]}});
GEX("p3info",3,2,"Late information returns",()=>{const n=R(2,9)*10;
  return{q:`A business filed ${n} Forms 1099 late for returns due in 2026, but corrected the failure within 30 days of the due date. There was no intentional disregard. What is the penalty?`,a:n*60,
    w:["Corrected within 30 days: $60 per return",`${n} × $60 = ${$$(n*60)}`],
    x:[[n*130,"$130 applies when the failure is corrected after 30 days but by August 1."],[n*340,"$340 applies after August 1 or when never filed."],[n*680,"$680 is the minimum for intentional disregard."]]}});
/* the older calculation set is retired from EA Parts 1 to 3 (its saved history is left alone) */
const GENS_OLD=[];for(let k=GENS.length-1;k>=0;k--){const g=GENS[k];if(g.p<=3&&!g.exam){GENS_OLD.unshift(g);GENS.splice(k,1)}}
