const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const U='http://localhost:8765/ea-exam-app/';const errs=[];
 const mk=async()=>{const c=await b.newContext();const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(U);await p.waitForTimeout(1500);return p};
 const p=await mk(),q=await mk();
 const st=x=>x.evaluate(()=>JSON.stringify({dom:S.dom,items:Object.keys(S.it).length,att0:(S.it[BANK[0].id]||[])[2],days:S.days}));
 const ans=(x,from,to,ok=2)=>x.evaluate(([f,t,ok])=>{for(let k=f;k<t;k++)grade(BANK[k],ok);persist()},[from,to,ok]);
 await ans(p,0,15);await ans(q,30,35,0);await ans(q,0,2);       // both devices study separately; q also answers items 0-1 once
 console.log('d1',await st(p));console.log('d2',await st(q));
 let code=await p.evaluate(()=>backupText());
 await q.evaluate(c=>restoreFrom(c),code);console.log('d2 +d1      ',await st(q));
 await q.evaluate(c=>restoreFrom(c),code);console.log('d2 +d1 again',await st(q));
 await ans(p,0,5);code=await p.evaluate(()=>backupText());       // d1 studies more (items 0-4 again), exports again without ever importing
 await q.evaluate(c=>restoreFrom(c),code);console.log('d2 +d1 newer',await st(q));
 const code2=await q.evaluate(()=>backupText());await p.evaluate(c=>restoreFrom(c),code2);console.log('d1 +d2      ',await st(p));
 // old-format backup (no dd, no timestamps) still merges
 const old=JSON.stringify({app:"ea-exam-drill",v:1,state:{upd:5,it:{[await p.evaluate(()=>BANK[50].id)]:[2,20773,4,3,1,0]},dom:{"1-2":"1101"},hist:[],set:{}}});
 await p.evaluate(c=>restoreFrom(c),old);console.log('d1 +old fmt ',await st(p));
 console.log('errors',errs);await b.close()})();
