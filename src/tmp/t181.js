const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const res={};const ex=[];
 BANK.filter(i=>i.t==="q").forEach(i=>{const o=i.opts,L=o.map(x=>String(x).length),ml=Math.max(...L);if(!(L[i.ans]===ml&&L.filter(x=>x===ml).length===1))return;
  const a=String(o[i.ans]);const m=a.match(/(, because |, since |; |: | \(| — |, so |, which |, unless |, as long as |, but )/);const key=i.p+(m?' tail:'+m[1].trim():' none');res[key]=(res[key]||0)+1;
  const others=Math.max(...L.filter((x,k)=>k!==i.ans));if(!m&&ex.length<25&&i.p>=3)ex.push(i.p+' | '+a+' || '+o.filter((x,k)=>k!==i.ans).join(' / '));});
 return {res,ex}});
console.log(r.res);console.log(r.ex.join('\n'));await b.close()})();
