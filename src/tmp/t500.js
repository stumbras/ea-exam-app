const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
const t0=Date.now();await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForFunction(()=>typeof BANK!=="undefined"&&document.querySelector('#view')&&document.querySelector('#view').children.length>0);const load=Date.now()-t0;
const perf=await p.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];return{dcl:Math.round(n.domContentLoadedEventEnd),load:Math.round(n.loadEventEnd),size:Math.round(n.decodedBodySize/1024)}});
console.log('load ms',load,JSON.stringify(perf));
const r=await p.evaluate(()=>{const out={};const parts=Object.keys(PARTS);
 for(const pt of parts){const P=PARTS[pt],its=BANK.filter(i=>i.p==pt),q=its.filter(i=>i.t==="q"),f=its.filter(i=>i.t==="f");
  const o={name:(P.short||P.name||"").slice(0,22),q:q.length,f:f.length,gens:GENS.filter(g=>g.p==pt).length,units:(UNITS[pt]||[]).length,slides:(UNITS[pt]||[]).reduce((n,u)=>n+u.s.length,0),drills:0};
  try{const sv=part;part=isNaN(+pt)?pt:+pt;o.drills=drillKeys().length;part=sv}catch(e){}
  // quality signals
  let noEx=0,shortEx=0,longest=0,dupStem=0,optDup=0,yr24=0,allAbove=0,veryLong=0,few=0;const stems={};
  q.forEach(i=>{if(!i.ex&&!EXPL[i.id])noEx++;else if((i.ex||"").length<25&&!EXPL[i.id])shortEx++;
   const L=i.opts.map(x=>String(x).length);if(L[i.ans]===Math.max(...L)&&L.filter(x=>x===L[i.ans]).length===1&&L[i.ans]>1.35*L.filter((_,k)=>k!==i.ans).reduce((a,b)=>a+b,0)/(L.length-1))longest++;
   const k=i.s.toLowerCase().replace(/[^a-z0-9]/g,"");if(stems[k])dupStem++;stems[k]=1;if(new Set(i.opts.map(x=>String(x).trim().toLowerCase())).size!==i.opts.length)optDup++;
   if(/\b2024\b/.test(i.s)&&!/2025|2026/.test(i.s))yr24++;if(i.opts.some(x=>/all of the above|none of the above/i.test(x)))allAbove++;if(i.s.length>420)veryLong++;if(i.opts.length<4)few++});
  const dom={};q.forEach(i=>dom[i.d]=(dom[i.d]||0)+1);const lv={};q.forEach(i=>lv[i.lv||"-"]=(lv[i.lv||"-"]||0)+1);
  Object.assign(o,{noEx,shortEx,longestIsRight:longest,dupStem,optDup,yr24,allAbove,veryLong,fewOpts:few,byDom:JSON.stringify(dom),byLv:JSON.stringify(lv),xs:q.filter(i=>i.xs).length});out[pt]=o}
 return out});
for(const k in r)console.log(k,JSON.stringify(r[k]));
console.log('errors',errs);await b.close()})();
