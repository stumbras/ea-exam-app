const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
console.log('eval',await p.evaluate(()=>{const C=(s)=>s.split(" ").map(x=>({r:{A:14,K:13,Q:12,J:11,T:10}[x[0]]||+x[0],s:"shdc".indexOf(x[1])}));
 const t=[["Ah Kh Qh Jh Th",9],["9s 8s 7s 6s 5s",8],["5d 4d 3d 2d Ad",8],["Kc Kd Kh Ks 2c",7],["Qc Qd Qh 3s 3c",6],["2h 7h 9h Jh Kh",5],["Ac 2d 3h 4s 5c",4],["Tc Jd Qh Ks Ac",4],["7c 7d 7h 2s 9c",3],["8c 8d 4h 4s Kc",2],["9c 9d 4h 5s Kc",1],["2c 5d 8h Js Kc",0]];
 const bad=t.filter(([h,c])=>pkEval5(C(h))[0]!==c).map(x=>x[0]);
 const w=pkCmp(pkBestAny(C("Ah Ad Kc Ks 2h 3d 9c")),pkBestAny(C("Qh Qd Kc Ks 2h 3d 9c")));
 const k1=pkCmp(pkEval5(C("Kc Kd Ah 7s 2c")),pkEval5(C("Kh Ks Qh 7d 2d")));
 let pz=0;for(let L=1;L<=16;L++)for(let i=0;i<40;i++){const Q=pkPuzzle(L);if(Q.o.length!==4||Q.a<0||new Set(Q.o).size!==4)pz++}
 const eq=pkEquity(C("Ah As"),[],300);return {bad,twoPairAAKKbeatsQQKK:w>0,kicker:k1>0,puzzleBad:pz,equityAA:eq.toFixed(2)}}));
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";view="kids";KV={scr:"home"};render()});
await p.click('[data-k="club"]');await p.screenshot({path:'k9club.png',fullPage:true});await p.click('[data-k="pkpz"]');
for(let i=0;i<5;i++){if(await p.$('[data-k="lessonOk"]'))await p.click('[data-k="lessonOk"]');await p.click(`[data-ka="${await p.evaluate(()=>KV.Q.a)}"]`);if(i===0)await p.screenshot({path:'k9pz.png'});await p.click('[data-k="pnext"]')}
console.log('pz',await p.evaluate(()=>[KV.mode,KV.right,S.kids.poker.lv,S.kids.tix]));
await p.click('[data-k="poker"]');await p.click('[data-k="pkplay"]');for(let n=0;n<12&&!(await p.evaluate(()=>KV.H.over));n++){await p.click('[data-pk="call"]')}await p.screenshot({path:'k9play.png',fullPage:true});
console.log('play',await p.evaluate(()=>[KV.H.over,KV.H.win,KV.H.board.length,S.kids.poker.chips,KV.H.log.slice(-2).join(" | ")]));
// terminal chips
await p.evaluate(()=>{KV={scr:"home"};render()});await p.click('[data-k="term"]');await p.click('[data-tch="pwd"]');await p.click('[data-k="trun"]');await p.waitForTimeout(200);
console.log('chips',await p.evaluate(()=>[S.kids.term.lv,!!document.querySelector('#tmstrip.flash'),document.querySelector('#tin')!=null]));await p.screenshot({path:'k9term.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
