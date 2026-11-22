// Walk every unit slide for parts 7 and 8 at phone width: no errors, no overflow; screenshot the W-7 form slide
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);let ov=[],n=0;
for(const pt of [7,8]){await p.evaluate(x=>{part=x;view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()},pt);await p.click('[data-mode="lessons"]');await p.waitForTimeout(200);
 const units=await p.evaluate(()=>UNITS[part].length);
 for(let u=0;u<units;u++){await p.evaluate(()=>{les={unit:null,topic:null,idx:0};render()});await p.click(`[data-lesunit="${u}"]`);await p.waitForTimeout(150);
  const sl=await p.evaluate(()=>UNITS[part][les.unit].s.length);
  for(let i=0;i<sl;i++){n++;if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))ov.push(pt+'/'+u+'/'+i);
   if(pt===7&&u===2&&i===0)await p.screenshot({path:'unit_w7.png',fullPage:true});
   const nx=await p.$('#lesnext');if(nx&&i<sl-1){await nx.click();await p.waitForTimeout(80)}}}}
console.log('slides',n,'overflow',JSON.stringify(ov),'errors',JSON.stringify(errs));await b.close()})();
