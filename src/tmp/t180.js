const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const out={},bad=[],stems={};
 BANK.forEach(i=>{const P=out[i.p]=out[i.p]||{q:0,f:0,longest:0,noexp:0,pos:[0,0,0,0,0],short:0,allabove:0};
  if(i.t!=="q"){P.f++;return}
  P.q++;const o=i.opts;if(i.fixed===false||true){}
  if(!i.ex||!String(i.ex).trim())P.noexp++;
  const L=o.map(x=>String(x).length),ml=Math.max(...L);
  if(L[i.ans]===ml&&L.filter(x=>x===ml).length===1)P.longest++;
  if(L[i.ans]*1.6<Math.max(...L.filter((x,k)=>k!==i.ans)))P.short++;
  if(/all of the above|none of the above/i.test(o.join("|")))P.allabove++;
  if(new Set(o.map(String)).size!==o.length)bad.push('dup option '+i.p+': '+i.s.slice(0,70));
  const k=i.p+'|'+i.s.trim().toLowerCase();if(stems[k]&&stems[k]!==o[i.ans])bad.push('same stem, different answer '+i.p+': '+i.s.slice(0,70));stems[k]=o[i.ans];
 });
 return {out,bad}});
for(const [k,v] of Object.entries(r.out))console.log('part',k,'q',v.q,'cards',v.f,'correct is longest',Math.round(100*v.longest/v.q)+'%','noexp',v.noexp,'all/none of above',v.allabove);
console.log(r.bad.length,r.bad.slice(0,40));console.log('errors',errs);await b.close()})();
