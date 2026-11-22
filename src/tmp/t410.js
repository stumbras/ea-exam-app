const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?course');await p.waitForTimeout(1500);
const v=await p.evaluate(()=>{const bad=[],cnt={};
 Object.values(CAMPS).forEach(T=>{campT(T.id);let n=0,sl=0;CAMP.forEach(s=>{sl+=s.slides.length;if(s.slides.length<3)bad.push(T.id+"/"+s.id+" few slides");if(s.ex.length<7)bad.push(T.id+"/"+s.id+" only "+s.ex.length+" exercises");s.ex.forEach((x,k)=>{n++;const id=T.id+"/"+s.id+"-"+k;
   if(x[0]==="mc"){if(new Set(x[2]).size!==x[2].length)bad.push(id+" duplicate options");if(x[2].length<2||!x[3])bad.push(id+" shape");if(x[2].some(o=>typeof o!=="string"||!o))bad.push(id+" empty option")}
   else if(x[0]==="je"){let d=0,c=0;x[3].forEach(l=>{if(l[0]==="D")d+=campCents(l[2]);else c+=campCents(l[2]);if(!CAMPACC[l[1]])bad.push(id+" unknown account "+l[1])});if(d!==c)bad.push(id+" unbalanced");(x[4]||[]).forEach(a=>{if(!CAMPACC[a])bad.push(id+" unknown pool "+a);if(x[3].some(l=>l[1]===a))bad.push(id+" pool repeats")})}
   else if(!["eq","sort","dc","tap"].includes(x[0]))bad.push(id+" kind")});
   s.slides.forEach((q,k)=>{if(!q.h)bad.push(T.id+"/"+s.id+" slide "+k+" no heading");if(q.v&&!visHtml(q.v))bad.push(T.id+"/"+s.id+" slide "+k+" bad visual")})});cnt[T.id]={steps:CAMP.length,ex:n,slides:sl,N:campN()}});campT("bk");
 // arithmetic spot checks used in the tax tracks
 const chk=[[50000*0.9235,46175],[Math.round(46175*0.153),7065],[Math.round(7065/2),3533],[2000*0.7,1400],[60000-10000-20000,30000]];return{bad,cnt,chk}});
console.log(JSON.stringify(v.cnt),JSON.stringify(v.chk));ok('all four tracks have valid data'+(v.bad.length?': '+v.bad.join('; '):''),v.bad.length===0);
// next-step order: after module 1 and the bookkeeping track, module 3 starts with the QuickBooks track
const order=await p.evaluate(()=>{const out=[];(UNITS[BK]||[]).forEach((u,k)=>{if(u.d==1){S.set.les=S.set.les||{};S.set.les["u"+BK+"-"+k]=u.s.length-1}});BANK.filter(i=>i.p==BK).forEach(i=>{S.it[i.id]=[3,today()+5,1,1,1,0]});
 out.push(bkNext().t);campT("bk");const s=campS();CAMP.forEach(x=>s.st[x.id]={l:1,ok:1,best:1,n:1});s.cap={done:1,best:1};S.set.jel=S.set.jel||{};const n2=bkNext();out.push(n2.k+":"+(n2.tr||"")+":"+n2.t);return out});console.log(' order:',order.join('  ->  '));
ok('module 2 points to the Bookkeeping Bootcamp, then on',/Bootcamp step 1 of 13/.test(order[0]));
const play=async()=>{let g=0;while(g++<200){const st=await p.evaluate(()=>cv.scr);if(st!=="do")break;
  await p.evaluate(()=>{const x=cv.items[cv.i].x;if(x[0]==="mc")document.querySelector('[data-camp="pick"][data-v="0"]').click();else if(x[0]==="je")for(let k=0;k<x[3].length;k++){[...document.querySelectorAll('[data-camp="acc"]')].find(z=>z.dataset.v===x[3][k][1]).click()}});await p.waitForTimeout(25);await p.click('[data-camp="next"]');await p.waitForTimeout(25)}};
for(const tr of ["qb","t1","t2"]){await p.evaluate(tr=>campOpen(tr),tr);await p.waitForTimeout(200);
 const hub=await p.evaluate(()=>({title:document.querySelector('.chero h2').innerText,rows:document.querySelectorAll('.cstep').length,dn:document.querySelector('.donext').innerText.replace(/\s+/g,' ').slice(0,90),cap:!!document.querySelector('[data-camp="cap"]')}));console.log(' '+tr+' hub:',JSON.stringify(hub));
 if(tr==="qb")await p.screenshot({path:'tmp/q_hub.png',fullPage:true});
 const N=await p.evaluate(()=>CAMP.length);let shots=0;
 for(let s=0;s<N;s++){await p.click('.donext');await p.waitForTimeout(120);const w=await p.evaluate(()=>cv.scr+':'+cv.step+':'+cv.tr);if(w!=='learn:'+s+':'+tr){ok(tr+' step '+(s+1)+' opens (got '+w+')',false);break}
  // page through the slides, checking nothing is broken
  const sl=await p.evaluate(()=>CAMP[cv.step].slides.length);for(let k=0;k<sl;k++){const bad=await p.evaluate(()=>/undefined|NaN|\[object/.test(document.querySelector('#view').innerText));if(bad)ok(tr+' slide text clean at step '+(s+1),false);if(tr==="t1"&&s===2&&k===0)await p.screenshot({path:'tmp/q_slide.png',fullPage:true});if(k<sl-1){await p.click('[data-camp="fwd"]');await p.waitForTimeout(40)}}
  await p.click('.cnav [data-camp="do"]');await p.waitForTimeout(100);if(tr==="qb"&&s===3)await p.screenshot({path:'tmp/q_ex.png',fullPage:true});await play();
  const r=await p.evaluate(()=>({scr:cv.scr,pct:cv.pct}));if(r.scr!=="res"||r.pct!==1){ok(tr+' step '+(s+1)+' passes (got '+JSON.stringify(r)+')',false);break}
  if(s===N-1){const after=await p.evaluate(()=>{const b=document.querySelector('[data-camp="after"]');return b?b.innerText:null});console.log('   last step result offers:',after);ok(tr+' ends by pointing to the real tool',!!after);if(tr==="qb")await p.screenshot({path:'tmp/q_res.png',fullPage:true})}}
 const done=await p.evaluate(()=>({done:campDone(),passed:campPassed(),N:campN(),bkStill:campIn("bk",()=>campPassed())}));ok(tr+' track complete '+JSON.stringify(done),done.done&&done.passed===done.N&&done.bkStill===13)}
// after button goes to the simulator
await p.evaluate(()=>campOpen("qb"));await p.waitForTimeout(150);await p.click('[data-camp="after"]');await p.waitForTimeout(400);ok('QuickBooks "do it for real" opens the practice company: '+await p.evaluate(()=>view),await p.evaluate(()=>view==="qbo"));
const st=await p.evaluate(()=>({m3:bkStats(3).labsDone+'/'+bkStats(3).labs,m4:bkStats(4).labsDone+'/'+bkStats(4).labs,all:Math.round(bkStats("all").pct),next:bkNext().t}));console.log(' stats',JSON.stringify(st));
await p.evaluate(()=>{view="bkland";render()});await p.waitForTimeout(300);ok('course home shows four track tiles',await p.evaluate(()=>document.querySelectorAll('.bkl-tool[data-camp="track"]').length===4));
// certificate still only for bookkeeping
await p.evaluate(()=>campOpen("qb"));await p.waitForTimeout(150);ok('no certificate button on the QuickBooks track',await p.evaluate(()=>!document.querySelector('[data-plus="cert"]')));
await p.evaluate(()=>campOpen("bk"));await p.waitForTimeout(150);ok('certificate button on the finished bookkeeping track',await p.evaluate(()=>!!document.querySelector('[data-plus="cert"]')));
// ---------- explain it back ----------
const p2=await (await b.newContext({viewport:{width:390,height:844}})).newPage();p2.on('pageerror',e=>errs.push('P2 '+e.message.slice(0,200)));await p2.goto('http://localhost:8765/ea-exam-app/?study');await p2.waitForTimeout(1400);
await p2.evaluate(()=>{part=1;filt="all";view="home";startSession("medium")});await p2.waitForTimeout(300);
let seen=false;for(let k=0;k<25&&!seen;k++){const info=await p2.evaluate(()=>{const cur=sess.queue[sess.pos],it=BYID[cur.id];return{t:it.t,ex:(it.ex||"").length}});
 await p2.evaluate(()=>{sess.qstart=Date.now()-9000;record(false,true)});await p2.waitForTimeout(150);seen=await p2.evaluate(()=>!!document.querySelector('.ebq'));
 if(!seen){if(info.t==="q"&&info.ex>=25&&info.ex<=220)console.log('  expected a check here but none shown');await p2.evaluate(()=>advance());await p2.waitForTimeout(120)}}
ok('after a wrong answer the reason check appears and the explanation is hidden',seen&&await p2.evaluate(()=>getComputedStyle(document.querySelector('#view .explain')).display==="none"));
await p2.screenshot({path:'tmp/q_eb.png',fullPage:true});
const before=await p2.evaluate(()=>JSON.stringify([sess.pos,sess.done,sess.correct]));
const right=await p2.evaluate(()=>sess.eb.o.findIndex(x=>x[1]));await p2.click(`[data-plus="eb"][data-v="${right}"]`);await p2.waitForTimeout(200);
ok('picking the reason reveals the explanation and the Next button, score unchanged',await p2.evaluate(()=>getComputedStyle(document.querySelector('#view .explain')).display!=="none"&&!!document.querySelector('#next')&&/That is the reason/.test(document.querySelector('#view').innerText))&&before===await p2.evaluate(()=>JSON.stringify([sess.pos,sess.done,sess.correct])));
await p2.click('#next');await p2.waitForTimeout(200);ok('Next moves on normally',await p2.evaluate(()=>sess&&sess.phase==="ask"||view!=="session"));
// correct answers and mock exams are left alone
await p2.evaluate(()=>{sess.qstart=Date.now()-9000;record(true,true)});await p2.waitForTimeout(150);ok('no check after a right answer',await p2.evaluate(()=>!document.querySelector('.ebq')));
console.log('errors',errs);await b.close()})();
