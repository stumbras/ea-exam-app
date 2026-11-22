const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=0;view="kids";KV={scr:"home"};render()});
await p.click('[data-k="col"]');await p.screenshot({path:'k11col.png',fullPage:true});
await p.click('[data-k="mc"]');for(let i=0;i<5;i++){if(await p.$('[data-k="lessonOk"]'))await p.click('[data-k="lessonOk"]');const bee=await p.evaluate(()=>KV.Q.kind==="bee");if(bee){await p.fill('#kbeein',await p.evaluate(()=>KV.Q.word));await p.click('[data-k="beeGo"]')}else await p.click(`[data-ka="${await p.evaluate(()=>KV.Q.a)}"]`);await p.click('[data-k="mcnext"]')}
console.log('mc',await p.evaluate(()=>[KV.mode,KV.right,Math.floor(S.kids.col.cr)]));await p.click('[data-k="col"]');
for(const id of ["solar","hab","solar","green"]){const ok=await p.$(`[data-kcb="${id}"]:not([disabled])`);if(ok)await ok.click();if(await p.$('[data-k="factOk"]'))await p.click('[data-k="factOk"]')}
console.log('build',await p.evaluate(()=>[JSON.stringify(S.kids.col.b),kColLevel(S.kids.col),kColRate(S.kids.col),Math.floor(S.kids.col.cr)]));
// idle
console.log('idle',await p.evaluate(()=>{S.kids.col.last=Date.now()-60*60000;return kColIdle()}));
await p.click('[data-k="ast"]');await p.waitForTimeout(500);
for(let i=0;i<10;i++){const ok=await p.evaluate(()=>{const A=kAst;if(!A||A.over)return false;const r=A.rocks.find(x=>x.v===A.P.a);kAstHit(r.x,r.y);return true});if(!ok)break;await p.waitForTimeout(150)}
await p.waitForTimeout(1000);console.log('ast',await p.evaluate(()=>[kAst.over,kAst.right,kAst.tix,S.kids.tix]));await p.screenshot({path:'k11ast.png'});
await p.click('[data-k="col"]');await p.click('[data-k="emp"]');
for(let t=0;t<60;t++){const st=await p.evaluate(()=>KV.E.over?"over":KV.E.stage);if(st==="over")break;if(st==="roll")await p.click('[data-me="roll"]');else if(st==="buy")await p.click(await p.$('[data-me="buy"]:not([disabled])')?'[data-me="buy"]':'[data-me="skip"]');else if(st==="build")await p.click(await p.$('[data-me="build"]:not([disabled])')?'[data-me="build"]':'[data-me="skip"]');else if(st==="q"){const bee=await p.evaluate(()=>KV.E.Q.kind==="bee");if(bee){await p.fill('#kbeein',await p.evaluate(()=>KV.E.Q.word));await p.click('[data-k="beeGo"]')}else await p.click(`[data-ka="${await p.evaluate(()=>KV.E.Q.a)}"]`);await p.click('[data-k="meq"]')}if(t===6)await p.screenshot({path:'k11emp.png',fullPage:true})}
console.log('emp',await p.evaluate(()=>[KV.E.over,KV.E.win,KV.E.wa,KV.E.wb,KV.E.round,S.kids.tix]));await p.screenshot({path:'k11empend.png',fullPage:true});
console.log('overflow',await p.evaluate(()=>document.documentElement.scrollWidth),'errors',JSON.stringify(errs));await b.close()})();
