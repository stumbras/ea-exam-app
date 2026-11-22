const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const info=await p.evaluate(()=>({n2:UNITS[2].length,n3:UNITS[3].length,s2:UNITS[2].reduce((a,u)=>a+u.s.length,0),s3:UNITS[3].reduce((a,u)=>a+u.s.length,0),first2:UNITS[2].slice(0,7).map(u=>u.t),first3:UNITS[3].slice(0,7).map(u=>u.t)}));
console.log(JSON.stringify(info));
ok('old units keep their positions',info.first2[0]==="Choosing a business entity"&&info.first3[0]==="Who may practice before the IRS"&&info.first2.length===7);
let bad=[],shots=0;
for(const part of [2,3]){const n=await p.evaluate(pt=>{part=pt;les={unit:null,topic:null,idx:0};view="lessons";render();return UNITS[pt].length},part);
  for(let u=7;u<n;u++){const ns=await p.evaluate(u=>{lesOpen("u",u);return UNITS[part][u].s.length},u);
    for(let i=0;i<ns;i++){await p.evaluate(i=>{les.idx=i;render();scrollTo(0,0)},i);await p.waitForTimeout(40);
      const r=await p.evaluate(()=>{const s=document.querySelector('#slide');const t=s.innerText;const over=[...s.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.right>391||b.left<-1)}).length;
        const clip=[...s.querySelectorAll('.vis *')].filter(e=>e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow!=="visible").length;
        const tr=[...s.querySelectorAll('.vtier .tr')].map(e=>e.getBoundingClientRect().height);
        return {bad:/undefined|NaN|\[object/.test(t),over,clip,sw:document.documentElement.scrollWidth,h:s.getBoundingClientRect().height,tr:Math.max(0,...tr),len:t.length,head:document.querySelector('h2').innerText}});
      if(r.bad||r.over||r.clip||r.sw>392)bad.push([part,u,i,r]);
      if(r.tr>0&&shots<40){await p.screenshot({path:`tmp/L_${part}_${u}_${i}.png`,fullPage:true});shots++}
      if(r.h>1500)console.log('  long slide',part,u,i,Math.round(r.h),r.len)}}}
ok('no undefined text, no sideways overflow on any new slide',bad.length===0);if(bad.length)console.log(JSON.stringify(bad.slice(0,8)));
// quiz matcher returns questions for each new unit
const qz=await p.evaluate(()=>[2,3].map(pt=>UNITS[pt].slice(7).map(u=>BANK.filter(x=>x.p==pt&&u.re.test(x.f+" "+x.b)).length)));
console.log('quiz pool per new unit',JSON.stringify(qz));ok('every new unit has questions to quiz on',qz.flat().every(n=>n>=5));
// lessons list
await p.evaluate(()=>{part=2;les={unit:null,topic:null,idx:0};view="lessons";render()});await p.waitForTimeout(100);await p.screenshot({path:'tmp/L_list2.png',fullPage:true});
ok('no page errors',errs.length===0);if(errs.length)console.log(errs.slice(0,5));
await b.close()})();
