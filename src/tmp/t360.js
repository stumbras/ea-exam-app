const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,150)));
await p.goto('http://localhost:8765/ea-exam-app/?course');await p.waitForTimeout(1500);
const info=await p.evaluate(()=>{const P=PARTS[BK],U=UNITS[BK]||[];const o={BK,name:P.n,doms:P.doms,view,units:U.map(u=>({d:u.d,t:u.t,slides:u.s.length,vis:u.s.filter(s=>s.v).map(s=>s.v.k),words:u.s.reduce((n,s)=>n+JSON.stringify(s).split(/\s+/).length,0)})),
 bank:{f:BANK.filter(i=>i.p==BK&&i.t==="f").length,q:BANK.filter(i=>i.p==BK&&i.t==="q").length,byDom:{}},gens:GENS.filter(g=>g.p==BK).map(g=>g.id+':'+g.d)};
 BANK.filter(i=>i.p==BK).forEach(i=>{const k=i.d+i.t+(i.lv||'');o.bank.byDom[k]=(o.bank.byDom[k]||0)+1});
 o.labs=typeof LABS!=="undefined"?LABS.map(l=>l.t):null;o.tc=typeof TC!=="undefined"?TC.length:null;o.qt=typeof qtasks==="function"?qtasks().length:null;o.skills=typeof BKSKILLS!=="undefined"?BKSKILLS.map(s=>s[0]+'|'+s[1]):null;
 o.globals=Object.keys(window).filter(k=>/^(bk|BK|firm|FIRM|jel|JEL|lab|LAB|qb|QB|tc|TC)/.test(k)).slice(0,120);return o});
console.log(JSON.stringify(info,null,1).slice(0,9000));
await p.screenshot({path:'tmp/c_land.png',fullPage:true});console.log('h',await p.evaluate(()=>document.documentElement.scrollHeight),errs);await b.close()})();
