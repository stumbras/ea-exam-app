const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>GENS.filter(g=>g.p<=3).map(g=>{let c=null,m=null;try{c=g.make();m=typeof calcMC==="function"?calcMC(g.make()):null}catch(e){c={stem:"ERR "+e.message}}
  const nums=(c.stem.match(/\$[\d,]+|\d+(\.\d+)?%/g)||[]).length,sent=(c.stem.match(/[.?!](\s|$)/g)||[]).length;
  return{id:g.id,p:g.p,d:g.d,lv:g.lv,name:g.n||g.name||g.t2||"",keys:Object.keys(g).join(","),stem:c.stem,ans:c.ans!==undefined?c.ans:c.a,steps:c.steps,opts:m?m.opts:null,mans:m?m.ans:null,nums,sent,len:c.stem.length,seen:S.it[g.id]?1:0}}));
fs.writeFileSync('/tmp/gens.json',JSON.stringify(r));
const by={};r.forEach(x=>{by[x.p]=by[x.p]||{n:0,len:0,nums:0,sent:0};const o=by[x.p];o.n++;o.len+=x.len;o.nums+=x.nums;o.sent+=x.sent});
for(const k in by){const o=by[k];console.log('part',k,'gens',o.n,'avg stem chars',Math.round(o.len/o.n),'avg figures',(o.nums/o.n).toFixed(1),'avg sentences',(o.sent/o.n).toFixed(1))}
console.log(r[0].keys);await b.close()})();
