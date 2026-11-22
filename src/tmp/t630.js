const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const out={};
 for(const pt of [1,2,3]){const q=BANK.filter(i=>i.p==pt&&i.t==="q"),f=BANK.filter(i=>i.p==pt&&i.t==="f");
  const q4=q.filter(i=>i.opts&&i.opts.length===4);let L=0,gap=[],shortEx=[],noEx=0;
  q4.forEach(i=>{const l=i.opts.map(x=>String(x).length),m=Math.max(...l);const others=l.filter((x,k)=>k!==i.ans);const mo=Math.max(...others);
   if(l[i.ans]===m&&l.filter(x=>x===m).length===1){L++;gap.push({id:i.id,d:i.d,s:i.s,opts:i.opts,ans:i.ans,ratio:l[i.ans]/Math.max(1,mo),ex:i.ex||EXPL[i.id]||""})}});
  q.forEach(i=>{const ex=i.ex||EXPL[i.id]||"";if(!ex)noEx++;else if(ex.length<25)shortEx.push({id:i.id,s:i.s,a:i.opts?i.opts[i.ans]:"",ex})});
  const byDom={};q.forEach(i=>{byDom[i.d]=(byDom[i.d]||0)+1});
  out[pt]={q:q.length,q4:q4.length,f:f.length,longestPct:Math.round(L/q4.length*100),big:gap.filter(g=>g.ratio>=1.5).length,noEx,shortEx:shortEx.length,byDom,doms:Object.keys(PARTS[pt].doms).map(k=>k+":"+PARTS[pt].doms[k][0]+" "+(PARTS[pt].doms[k][1]||"")),gap,shortExList:shortEx}}
 return out});
for(const pt of [1,2,3]){const o=r[pt];console.log(pt,JSON.stringify({q:o.q,q4:o.q4,f:o.f,longestPct:o.longestPct,bigGap:o.big,noEx:o.noEx,shortEx:o.shortEx,byDom:o.byDom}));console.log('  doms',o.doms.join(' | '))}
fs.writeFileSync('/tmp/audit_ea.json',JSON.stringify(r));await b.close()})();
