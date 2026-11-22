const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(2000);
const r=await p.evaluate(()=>{const out=[];for(const pt of [1,2,3]){part=pt;const h=drillsHtml();out.push(pt+':'+['earn','sch','txb','loss','wealth','work','acct','pen','rep'].filter(k=>h.includes(k+'"')).join(','))}return out});console.log(r.join(' | '));
console.log('errors',JSON.stringify(errs));await b.close()})();
