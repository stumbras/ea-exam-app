const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const q=BANK.filter(i=>i.t==="q"&&i.opts.length===4);const cued=q.filter(i=>{const l=i.opts.map(x=>String(x).length),m=Math.max(...l);return l[i.ans]===m&&l.filter(x=>x===m).length===1});
 const ratio=i=>{const l=i.opts.map(x=>String(x).length);return l[i.ans]/(l.filter((_,k)=>k!==i.ans).reduce((a,b)=>a+b,0)/3)};
 const strong=cued.filter(i=>ratio(i)>=1.5);const byPart={};strong.forEach(i=>byPart[i.p]=(byPart[i.p]||0)+1);
 const pick=(pt,n)=>strong.filter(i=>i.p==pt).sort(()=>Math.random()-.5).slice(0,n).map(i=>'P'+i.p+' '+i.s.slice(0,110)+'\n      ✓ '+i.opts[i.ans]+'\n      ✗ '+i.opts.filter((_,k)=>k!==i.ans).join('  |  '));
 // "pick the longest" strategy score
 const strat={};Object.keys(PARTS).forEach(pt=>{const qq=q.filter(i=>i.p==pt);let s=0;qq.forEach(i=>{const l=i.opts.map(x=>String(x).length),m=Math.max(...l),c=l.filter(x=>x===m).length;if(l[i.ans]===m)s+=1/c});strat[pt]=Math.round(s/qq.length*100)});
 return{cued:cued.length,strong:strong.length,byPart,strat,samples:[...pick(3,7),...pick(1,5),...pick(8,5),...pick(5,4)]}});
console.log(JSON.stringify({cued:r.cued,strong:r.strong,byPart:r.byPart,pickLongestScore:r.strat}));console.log(r.samples.join('\n'));await b.close()})();
