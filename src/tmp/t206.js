const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
for(const pt of [1,5,6,7,8]){await p.evaluate(x=>{part=x;view="home";filt="all";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()},pt);await p.click('#view [data-mode="mix"]');await p.waitForTimeout(250);let n=0,kinds=[];
 for(let k=0;k<10;k++){const o=await p.$('#view .opt:not([disabled])');const inp=await p.$('#view input[type="number"], #view input[inputmode]');
  if(o){await o.click();n++}else if(inp){await inp.fill('1');await p.keyboard.press('Enter');n++;kinds.push('num')}else{const r=await p.$('#view [data-r], #view [data-rate]');if(r){await r.click();n++;kinds.push('rate')}else{kinds.push('?');}}
  await p.waitForTimeout(80);const nx=await p.$('#view button.btn.pri');if(nx){const tx=await nx.textContent();if(/Next|Continue|See|Finish|Results/i.test(tx)){await nx.click();await p.waitForTimeout(80)}}
  if(await p.evaluate(()=>view)!=="session")break}
 console.log(pt,'answered',n,'now',await p.evaluate(()=>view),kinds.join(','))}
console.log('errors',JSON.stringify(errs));await b.close()})();
