const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
console.log('xs by part',await p.evaluate(()=>JSON.stringify([1,2,3].map(k=>BANK.filter(i=>i.xs&&i.p==k).length))),'dup ids',await p.evaluate(()=>{const s=new Set(),d=[];for(const i of BANK){if(s.has(i.id))d.push(i.id);s.add(i.id)}return d.length}));
console.log('bad opts',await p.evaluate(()=>BANK.filter(i=>i.xs&&(i.opts.length!==4||new Set(i.opts).size!==4)).map(i=>i.s.slice(0,40)).join(' | ')));
for(const pt of[2,3]){await p.evaluate(pt=>{part=pt;view="home";sess=null;render()},pt);await p.waitForTimeout(300);console.log(pt,await p.evaluate(()=>{const b=document.querySelector('.donext');return b?b.innerText.replace(/\n/g,' | ').slice(0,110):null}));await p.click('.donext');await p.waitForTimeout(400);if(pt===2)await p.screenshot({path:'tmp/e_p2.png'});
 console.log('  q:',await p.evaluate(()=>{const e=document.querySelector('#view .card, #view .q, #view');return (e.innerText.match(/[^\n]{20,}\?|[^\n]{30,}…/)||[''])[0].slice(0,100)}))}
console.log('errors',errs.slice(0,5));await b.close()})();
