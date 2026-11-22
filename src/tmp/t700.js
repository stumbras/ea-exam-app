// Upgrade test: build a realistic saved state on the Version 164 app, then open the current build on the same data and use it by real taps.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGEERROR '+e.message.slice(0,220)));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text().slice(0,200))});
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
// ---- 1. old version: study for a while ----
await p.goto('http://localhost:8765/old164.html?study');await p.waitForTimeout(1500);
const old=await p.evaluate(()=>{let seed=5;Math.random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};const ver=(document.body.innerText.match(/Version \d+/)||[""])[0];
  const run=(mode,n)=>{try{startSession(mode,n)}catch(e){return}const s=sess;if(!s||view!=="session")return;if(s.mode==="mock"){s.queue.forEach((cur,k)=>{const it=BYID[cur.id],V=view4(cur,it);s.answers[k]=Math.random()<0.6?V.ans:(V.order||[0,1,2,3]).find(x=>x!==V.ans)});finishMock();return}
    let g=0;while(view==="session"&&sess===s&&g++<300){const cur=s.queue[s.pos];if(!cur){finish();break}s.cp=false;if(cur.learn){advance();continue}record(Math.random()<0.65,Math.random()<0.7);advance()}if(view==="session"&&sess===s)finish()};
  for(const pt of [1,2,3]){part=pt;filt="all";for(const m of ["easy","easy","quiz","qd","calc","mix","hard","easy","quiz","calc","missed","medium","qd","exam"])run(m);run("mock",25);
    try{const ks=Object.keys(S.it).filter(id=>BYID[id]&&BYID[id].p==pt).slice(0,3);S.flag=S.flag||{};ks.forEach(id=>S.flag[id]=1)}catch(_){}
    try{S.set.les=S.set.les||{};S.set.les["u"+pt+"-0"]=1;S.set.les["u"+pt+"-1"]=2}catch(_){}}
  sess=null;view="home";persist();return{ver,items:Object.keys(S.it).length,calcs:Object.keys(S.it).filter(id=>BYID[id]&&BYID[id].t==="g").length,hist:S.hist.length,miss:missedPool(1,"all").length}});
console.log('  old build:',JSON.stringify(old));
// ---- 2. current version on the same saved data ----
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1800);
const cdp=await ctx.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
const tap=async sel=>{const el=await p.$(sel);if(!el)return false;await el.scrollIntoViewIfNeeded();await el.tap();return true};
const st=async()=>p.evaluate(()=>({view,part,sess:!!sess,mode:sess&&sess.mode,pos:sess&&sess.pos,phase:sess&&sess.phase,n:sess&&sess.queue.length,sw:document.documentElement.scrollWidth,txt:document.querySelector('#view').innerText.length,bad:/undefined|NaN|\[object Object\]/.test(document.querySelector('#view').innerText)}));
const kept=await p.evaluate(()=>({items:Object.keys(S.it).length,hist:S.hist.length}));ok('saved answers and history are all still there after the update',kept.items===old.items&&kept.hist===old.hist);
const times={};
for(const pt of [1,2,3]){
  const t0=await p.evaluate(pt=>{part=pt;sess=null;view="home";const a=performance.now();render();return performance.now()-a},pt);times['home'+pt]=Math.round(t0);await p.waitForTimeout(150);
  let s=await st();ok(`part ${pt}: main page builds, no stray text, no sideways scroll`,s.view==="home"&&!s.bad&&s.sw<=392&&s.txt>300);if(s.bad)console.log('   ',await p.evaluate(()=>(document.querySelector('#view').innerText.match(/.{40}(undefined|NaN|\[object Object\]).{40}/)||[""])[0]));
  const top=await p.evaluate(()=>({ready:(document.querySelector('.xaready')||{innerText:''}).innerText.replace(/\s+/g,' '),dn:(document.querySelector('.donext')||{innerText:''}).innerText.replace(/\s+/g,' ').slice(0,90),sg:[...document.querySelectorAll('.xasg .btn')].map(b=>b.innerText)}));console.log(`   part ${pt}:`,top.ready.slice(0,150),'|',top.dn,'|',JSON.stringify(top.sg));
  // Quick 10 by real taps, in Fast pace
  await tap('.xaquick');await p.waitForTimeout(400);s=await st();ok(`part ${pt}: Quick 10 opens with 10 questions`,s.sess&&s.n===10&&!s.bad);
  let auto=0,stuck=0,dbl=0,wrongShown=0;
  for(let k=0;k<14;k++){s=await st();if(!s.sess||s.view!=="session")break;const before=s.pos;
    if(s.phase==="ask"){const info=await p.evaluate(()=>{const cur=sess.queue[sess.pos],it=BYID[cur.id],V=view4(cur,it);return{ans:V.ans,typed:!document.querySelector('.opt')}});
      if(info.typed){await p.evaluate(()=>{record(true,true)});}
      else{const pickRight=k%3!==1;const sel=await p.evaluate(({ans,pickRight})=>{const o=[...document.querySelectorAll('.opt')];const el=pickRight?o.find(x=>+x.dataset.opt===ans):o.find(x=>+x.dataset.opt!==ans);el.setAttribute('data-t','1');return true},{ans:info.ans,pickRight});await tap('.opt[data-t="1"]');
        if(pickRight){await p.waitForTimeout(250);/* an impatient second tap where Next would be, during the auto-advance */const nx=await p.$('#next');if(nx){const bx=await nx.boundingBox();await p.waitForTimeout(1850);if(bx)await p.touchscreen.tap(bx.x+bx.width/2,bx.y+bx.height/2)}await p.waitForTimeout(700);const a=await st();if(a.sess&&a.pos===before+1&&a.phase==="ask")auto++;else if(a.sess&&a.pos>before+1)dbl++;else if(a.sess&&a.pos===before+1&&a.phase==="shown")dbl++;else if(a.sess&&a.pos===before)stuck++}
        else{await p.waitForTimeout(1300);const a=await st();if(a.pos===before&&a.phase==="shown")wrongShown++;const how=await p.$('[data-xa="how"]');if(how&&k===1){await how.tap();await p.waitForTimeout(250);const h=await p.evaluate(()=>!!document.querySelector('.xahow')&&document.documentElement.scrollWidth<=392);ok(`part ${pt}: "Explain it · how to" opens after a miss`,h)}
          const sk=await p.$('[data-plus="eb"]');await tap('#next');await p.waitForTimeout(350)}}}
    else if(s.phase==="shown"){await tap('#next');await p.waitForTimeout(350)}else{await p.waitForTimeout(300)}}
  s=await st();console.log(`   part ${pt}: auto-advanced ${auto}, wrong held ${wrongShown}, double-fired ${dbl}, stuck ${stuck}, now ${s.view}/${s.phase} pos ${s.pos}`);
  ok(`part ${pt}: a right answer moves on by itself and an extra tap never answers the next question by accident`,auto>=3&&dbl===0&&stuck===0);
  ok(`part ${pt}: a wrong answer waits for Next`,wrongShown>=2);
  { const cm=await p.evaluate(()=>{const ids=sess?sess.missed:[];return{missed:ids.length,flagged:ids.filter(id=>S.it[id]&&S.it[id][5]).length}});ok(`part ${pt}: one-tap misses are not filed as "sure but wrong" (${cm.flagged} of ${cm.missed})`,cm.missed>=2&&cm.flagged===0)}
  await p.evaluate(()=>{const s=sess;let g=0;while(view==="session"&&sess===s&&g++<40){const cur=s.queue[s.pos];if(!cur)break;s.cp=false;if(s.phase==="shown"){advance();continue}record(true,true);advance()}});await p.waitForTimeout(300);
  s=await st();ok(`part ${pt}: the drill ends on a results page with a next step`,s.view==="results"&&!s.bad&&await p.evaluate(()=>!!document.querySelector('.xpnx')));
  // every other way in
  for(const [name,fn] of [["New 10",()=>document.querySelector('[data-xa="new10"]').click()],["red button",()=>document.querySelector('.donext').click()],["first suggestion",()=>{const b=document.querySelector('.xasg .btn');if(b)b.click()}],["readiness card",()=>document.querySelector('.xaready').click()],["a mock exam",()=>startSession("mock",25)],["fix misses",()=>{filt="all";startSession("missed",10)}],["calculation practice",()=>startSession("calc",5)],["hard mode",()=>startSession("hard",10)],["lessons",()=>{les={unit:null,topic:null,idx:0};view="lessons";render()}],["a topic's practice button",()=>{const r=document.querySelector('.xprow');r.open=true;r.querySelector('[data-xp="prac"]').click()}],["a topic's lessons button",()=>{const r=document.querySelector('.xprow');r.open=true;const b=r.querySelector('[data-xp="les"]');if(b)b.click()}]]){
    await p.evaluate(pt=>{try{clearInterval(timerId)}catch(_){}sess=null;les=null;part=pt;view="home";render()},pt);await p.waitForTimeout(120);const e0=errs.length;
    const t=await p.evaluate(f=>{const a=performance.now();(new Function('return ('+f+')()'))();return performance.now()-a},fn.toString());await p.waitForTimeout(250);s=await st();times[name+pt]=Math.round(t);
    const fine=!s.bad&&s.sw<=392&&s.txt>120&&errs.length===e0;if(!fine)console.log('   ',name,JSON.stringify(s),errs.slice(e0).join(' | ').slice(0,300));ok(`part ${pt}: ${name} opens cleanly (${s.view}${s.mode?"/"+s.mode:""})`,fine);
    if(s.sess&&s.mode!=="mock"){await p.evaluate(()=>{const s=sess;let g=0;while(view==="session"&&sess===s&&g++<80){const cur=s.queue[s.pos];if(!cur)break;s.cp=false;if(cur.learn){advance();continue}if(s.phase==="shown"){advance();continue}record(g%4!==0,true);advance()}});await p.waitForTimeout(200);const e=await st();if(e.bad||errs.length>e0)console.log('    after',name,JSON.stringify(e),errs.slice(e0).join(' | ').slice(0,300));ok(`part ${pt}: ${name} runs to the end (${e.view})`,!e.bad&&errs.length===e0)}
    if(s.mode==="mock"){await p.evaluate(()=>{const s=sess;s.queue.forEach((cur,k)=>{const V=view4(cur,BYID[cur.id]);s.answers[k]=k%3?V.ans:(V.order||[0,1,2,3]).find(x=>x!==V.ans)});finishMock()});await p.waitForTimeout(250);const e=await st();ok(`part ${pt}: the mock scores and shows results`,e.view==="results"&&!e.bad&&errs.length===e0)}}
}
console.log('  time to draw, phone-speed (ms):',JSON.stringify(times));
const slow=Object.entries(times).filter(([k,v])=>v>(k==='home1'?800:250));ok('first draw under 0.8 s, everything after under a quarter of a second, at phone speed',slow.length===0);if(slow.length)console.log('   slow:',JSON.stringify(slow));
{const real=errs.filter(e=>!/404/.test(e));/* the old build now sits at the server root, where its own sw.js and manifest do not exist */errs.length=0;errs.push(...real)}ok('no errors in the page at any point',errs.length===0);if(errs.length)console.log([...new Set(errs)].slice(0,8).join('\n'));
await b.close()})();
