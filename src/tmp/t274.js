const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";view="kids";KV={scr:"home"};render()});
console.log(await p.evaluate(()=>{const out={};for(const s of ["math","sci","eng","geo","code"]){const qs=new Set();let gen=0;for(let i=0;i<30;i++){const Q=kGen(s,KS().lv[s],1,"");if(Q&&Q.o)gen++;qs.add(Q&&Q.q)}out[s]=gen+"/30 gen, "+qs.size+" unique"}return JSON.stringify(out)}));
await p.click('[data-kgen="cur"]');console.log('genius ok',await p.evaluate(()=>JSON.stringify(S.kids.gen)));
console.log('errors',JSON.stringify(errs));await b.close()})();
