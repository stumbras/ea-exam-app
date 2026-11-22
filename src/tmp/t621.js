const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const want=[[2,15,0],[3,9,4],[2,13,2],[3,13,0],[3,18,0]];let k=0;
for(const [pt,u,i] of want){await p.evaluate(([pt,u,i])=>{part=pt;les={unit:null,topic:null,idx:0};view="lessons";render();lesOpen("u",u);les.idx=i;render();scrollTo(0,0)},[pt,u,i]);await p.waitForTimeout(80);
  const el=await p.$('#slide');await el.screenshot({path:`tmp/M_${k++}.png`})}
await b.close()})();
