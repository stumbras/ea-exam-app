// Whole-app smoke test: every part, main modes, answer a mixed session, phone width, errors and overflow
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);const ov=new Set();const chk=async t=>{if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))ov.add(t)};
await p.evaluate(()=>{view="start";render()});await chk('start');
for(const pt of [1,2,3,4,5,6,7,8]){await p.evaluate(x=>{part=x;view="home";filt="all";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()},pt);await chk(pt+':home');
 const modes=await p.$$eval('#view [data-mode]',x=>[...new Set(x.map(b=>b.dataset.mode))]);
 for(const m of ['mix','cards','lessons','quiz','calc','w7']){if(!modes.includes(m))continue;await p.evaluate(x=>{part=x;view="home";filt="all";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()},pt);const t=await p.$(`#view [data-mode="${m}"]`);if(!t)continue;await t.click();await p.waitForTimeout(200);await chk(pt+':'+m);
  if(m==='mix'||m==='quiz'){let n=0;for(let k=0;k<12;k++){const o=await p.$('#view .opt:not([disabled]), #view [data-o]:not([disabled]), #view button.choice:not([disabled])');if(o){await o.click();n++;await p.waitForTimeout(60)}const nx=await p.$('#view #next, #view [data-act="next"], #view .btn.pri.next');if(nx){await nx.click();await p.waitForTimeout(60)}else{const f=await p.$('#view [data-r]');if(f){await f.click();await p.waitForTimeout(40)}}await chk(pt+':'+m+':q')}
   console.log(pt,m,'answered',n,'view',await p.evaluate(()=>view))}}
 console.log(pt,'modes',modes.join(','))}
console.log('overflow',JSON.stringify([...ov]),'errors',JSON.stringify(errs.slice(0,5)));await b.close()})();
