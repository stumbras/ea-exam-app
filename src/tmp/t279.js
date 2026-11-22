const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>[1,2,3].map(pp=>{const q=BANK.filter(i=>i.p==pp&&i.t==="q");return `P${pp}: q ${q.length} (lv1 ${q.filter(i=>i.lv===1).length}, lv2 ${q.filter(i=>i.lv===2).length}, lv3 ${q.filter(i=>i.lv===3).length}), facts ${BANK.filter(i=>i.p==pp&&i.t==="f").length}, gens ${GENS.filter(g=>g.p==pp).length}`}).join(' | ')));
await p.evaluate(()=>{startSession("qd",10)});await p.waitForTimeout(300);
console.log('session',await p.evaluate(()=>{const s=S.sess||window.sess||null;return JSON.stringify(Object.keys(window).filter(k=>/sess/i.test(k)).slice(0,5))}));
console.log('errors',JSON.stringify(errs));await b.close()})();
