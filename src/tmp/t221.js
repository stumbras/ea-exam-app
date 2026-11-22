const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=4;view="kids";KV={scr:"home"};render()});
console.log('topupd',await p.evaluate(()=>!!document.querySelector('.ktop [data-k="kcheck"]')));
await p.click('[data-k="drive"]');await p.click('[data-kcol="#1d3f8f"]');await p.click('[data-kcar="ct"]');console.log('ct locked',await p.evaluate(()=>[KV.car,kCarOk("ct")]));
await p.click('[data-kcar="m3"]');await p.screenshot({path:'k8pick.png',fullPage:true});await p.click('[data-kride="m3"]');await p.waitForTimeout(800);
await p.evaluate(()=>{kDrv.obs.push({ln:kDrv.lane,y:-40,k:"ap"});kDrv.obs.push({ln:kDrv.lane,y:-200,k:"cone"})});await p.waitForTimeout(1600);console.log('ap',await p.evaluate(()=>[kDrv.ap>0,kDrv.crashes]));
await p.evaluate(()=>{kDrv.t=26;kDrv.obs.push({ln:kDrv.lane,y:-60,k:"sc"});kDrv.obs.push({ln:kDrv.lane,y:-300,k:"boost"})});await p.waitForTimeout(2200);await p.screenshot({path:'k8night.png'});console.log('sc',await p.evaluate(()=>[kDrv.sc,kDrv.plaid>0||kDrv.bat]));
await p.evaluate(()=>{kDrv.t=45});await p.waitForTimeout(1500);await p.screenshot({path:'k8snow.png'});
await p.evaluate(()=>{kDrv.t=59.95});await p.waitForTimeout(1200);await p.screenshot({path:'k8end.png'});console.log('end',await p.evaluate(()=>[kDrv.over,kDrv.misOk,S.kids.drive.best,S.kids.tix]));
// backup restore
console.log('backup',await p.evaluate(()=>{persist();const n=S.kids.name;delete S.kids;const k=KS();return [k.name===n,!!localStorage.getItem("kidsBackup")]}));
// desk PrtSc fix
console.log('prt',await p.evaluate(()=>{const k=KS();k.term.desk={mint:11};view="kids";KV={scr:"desk",dos:"mint",D:{sel:[],eff:"",tries:0,hint:false}};kDeskKey("prt");return kDeskLv("mint")}));
console.log('errors',JSON.stringify(errs));await b.close()})();
