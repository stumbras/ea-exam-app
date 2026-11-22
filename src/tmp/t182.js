const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const res={};const samples=[];
 const tail=/(, because |, since |; | \(| — |, which |, unless |, as long as )/;
 BANK.filter(i=>i.t==="q").forEach(i=>{const o=i.opts.map(String),L=o.map(x=>x.length),others=L.filter((x,k)=>k!==i.ans);
  const R=res[i.p]=res[i.p]||{n:0,long:0,after:0,fixed:0,big:0};R.n++;
  const isLong=a=>a.length>Math.max(...others);
  let a=o[i.ans];if(isLong(a))R.long++;if(a.length>1.5*Math.max(...others))R.big++;
  if(isLong(a)){const m=a.match(tail);if(m){const head=a.slice(0,m.index).trim();if(head.length>=6&&head.length>=0.7*Math.min(...others)&&!o.includes(head)){R.fixed++;if(samples.length<15)samples.push(a+'  ==>  '+head);a=head}}}
  if(a.length>Math.max(...others))R.after++});
 return {res,samples}});
for(const [k,v] of Object.entries(r.res))console.log(k,'n',v.n,'longest',Math.round(100*v.long/v.n)+'%','≥1.5x',v.big,'trim',v.fixed,'after',Math.round(100*v.after/v.n)+'%');
console.log(r.samples.join('\n'));await b.close()})();
