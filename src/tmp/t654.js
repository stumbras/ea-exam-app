const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
// ---- 1. readiness: a wrong answer never raises it, a right answer never lowers it ----
let r=await p.evaluate(()=>{let off=0;const t0=today();today=()=>t0+off;let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
  S.set.pace="steady";S.set.xp={nodx1:1,nodx2:1,nodx3:1};let n=0,up=0,down=0,worstUp=0,worstDown=0,moved=0,first=null,last=null;const log=[];
  for(const pt of [1,3]){part=pt;const skill=0.35+rnd()*0.5;
    for(let k=0;k<150;k++){const m=k%5;sess=null;view="home";if(m===0)xaNew10();else if(m===1)startSession("qd",10);else if(m===2){filt="all";startSession("missed",10)}else if(m===3)startSession("quiz",10);else{filt="all";startSession("hard",10)}
      if(!sess||view!=="session"){continue}const s=sess;let g=0;
      while(view==="session"&&sess===s&&g++<60){const cur=s.queue[s.pos];if(!cur)break;s.cp=false;if(cur.learn){advance();continue}const it=BYID[cur.id];const p0=xaAll().p;const right=rnd()<skill+(S.it[it.id]?0.25:0);record(right,rnd()<0.8);const p1=xaAll().p;
        if(p0!=null&&p1!=null&&it.t==="q"){n++;if(first==null)first=p0;last=p1;if(Math.abs(p1-p0)>1e-12)moved++;if(!right&&p1>p0+1e-9){up++;worstUp=Math.max(worstUp,p1-p0)}if(right&&p1<p0-1e-9){down++;worstDown=Math.max(worstDown,p0-p1)}}
        advance()}
      if(view==="session"&&sess===s){clearInterval(timerId)}if(k%3===2)off++}
    log.push({pt,skill:Math.round(skill*100),est:Math.round(xaAll().p*100),n:xaAll().n})}
  sess=null;view="home";return{n,up,down,worstUp,worstDown,moved,log}});
console.log(' ',JSON.stringify(r));
ok(`${r.n} exam-question answers checked: a wrong answer never raised readiness`,r.n>2500&&r.up===0);
ok('a right answer never lowered it',r.down===0);
ok('and it does move with the answers',r.moved>r.n*0.15);
// ---- 2. the exact case reported: fixing misses with some mistakes ----
r=await p.evaluate(()=>{localStorage.clear();return 1});await p.reload();await p.waitForTimeout(1500);
r=await p.evaluate(()=>{S.set.pace="steady";S.set.xp={nodx1:1};part=1;const T=today();const Q=BANK.filter(i=>i.p==1&&i.t==="q");Q.slice(0,60).forEach((i,k)=>{const okk=k%2;S.it[i.id]=[okk?2:0,T,1,okk,okk,0,okk?0:1,Date.now()]});persist();
  const before=xaAll().p;filt="all";startSession("missed",10);const s=sess;let k=0,wrong=0;while(view==="session"&&sess===s&&k<40){const cur=s.queue[s.pos];if(!cur)break;s.cp=false;const right=k%3!==0;if(!right)wrong++;record(right,true);advance();k++}
  const after=xaAll().p;sess=null;view="home";return{before:Math.round(before*1000)/10,after:Math.round(after*1000)/10,wrong}});
console.log(' ',JSON.stringify(r));ok('re-drilling misses (with some answered wrong again) no longer pushes readiness up',r.wrong>=3&&r.after<=r.before+0.01);
// ---- 3. exam-style calculations ----
r=await p.evaluate(()=>{const out={old:GENS.filter(g=>g.p<=3&&!g.exam).length,n:{1:0,2:0,3:0},bad:[],keptOld:GENS_OLD.length,byid:GENS_OLD.every(g=>BYID[g.id]===g),other:GENS.filter(g=>g.p>3).length,samples:[]};
  GENS.filter(g=>g.exam).forEach(g=>{out.n[g.p]++;for(let k=0;k<150;k++){const c=g.make();const why=[];
      if(!c.opts||c.opts.length!==4||new Set(c.opts).size!==4)why.push("choices");else{if(c.opts[0]!==c.key)why.push("key");if(c.opts.some(o=>/\.\d/.test(o)||/-/.test(o)||/NaN|undefined/.test(o)))why.push("ugly:"+c.opts.join("|"));if(!c.why||c.why.slice(1).some(w=>!w||w.length<20))why.push("why")}
      if(!/\?$/.test(c.stem)||/undefined|NaN|\(Type|nearest dollar/.test(c.stem))why.push("stem");if((c.stem.match(/[.?](\s|$)/g)||[]).length<1||c.stem.length>420)why.push("len");
      const lines=c.steps.split("\n").filter(x=>x&&!x.startsWith("Watch out"));if(lines.length>2)why.push("steps"+lines.length);if(/undefined|NaN/.test(c.steps))why.push("stepsNaN");
      if(why.length){out.bad.push(g.id+":"+why.join(","));break}}
    if(out.samples.length<3&&g.p===1&&Math.random()<0.2){const c=g.make();out.samples.push(c.stem+" => "+c.opts.join(" | ")+" || "+c.steps.replace(/\n/g," / "))}});return out});
console.log(' ',JSON.stringify(r.n),'old kept aside:',r.keptOld,'old in sessions',r.old,'byid',r.byid,'other',r.other,'bad:',JSON.stringify(r.bad));r.samples.forEach(s=>console.log('   ·',s.slice(0,420)));
ok('new calculation questions: 28 for Part 1, 14 for Part 2, 7 for Part 3',r.n[1]===28&&r.n[2]===14&&r.n[3]===7);
ok('150 draws of each: 4 different whole-dollar choices, a full-sentence question, at most 2 steps, a reason on every wrong choice',r.bad.length===0);
ok('the old long calculations are out of every EA session, their saved history still resolves, other sections keep theirs',r.old===0&&r.keptOld>70&&r.byid&&r.other>0);
// how it looks in a session
r=await p.evaluate(()=>{part=1;const g=GENS.find(x=>x.id==="ge1-medical");newSess("qd",[g]);const o={teach:!!document.querySelector('.calcteach'),opts:document.querySelectorAll('.opt').length,stem:document.querySelector('.stem')?document.querySelector('.stem').innerText:''};
  const s=sess,cur=s.queue[0],V=view4(cur,g);S.set.pace="fast";const wrong=[...document.querySelectorAll('.opt')].find(x=>+x.dataset.opt!==V.ans);wrong.click();
  o.after=document.querySelector('.explain').innerText.replace(/\s+/g,' ');o.q=s.queue.length;o.how=!!document.querySelector('[data-xa="how"]');return o});
console.log('  ',r.stem.slice(0,150));console.log('  ',r.after.slice(0,330));
ok('a calculation is shown like the exam: the question and 4 choices, nothing else',!r.teach&&r.opts===4&&/\?$/.test(r.stem));
ok('after a miss: the answer, what was picked, why that choice is wrong, and the two-step working; no extra question is forced in',/The answer: \$/.test(r.after)&&/you picked \$/.test(r.after)&&/How to work it/.test(r.after)&&/7\.5%/.test(r.after)&&r.q===1);
// ---- 4. Explain it · how to ----
r=await p.evaluate(()=>{clearInterval(timerId);sess=null;part=3;const q=BANK.find(i=>i.p==3&&i.t==="q"&&/EXCEPT/.test(i.s)&&i.lv>=2);newSess("quiz",[q]);const V=view4(sess.queue[0],q);const wrong=[...document.querySelectorAll('.opt')].find(x=>+x.dataset.opt!==V.ans);wrong.click();
  const o={btn:!!document.querySelector('[data-xa="how"]'),open0:!!document.querySelector('.xahow')};document.querySelector('[data-xa="how"]').click();const h=document.querySelector('.xahow');o.txt=h?h.innerText.replace(/\s+/g,' '):'';o.sw=document.documentElement.scrollWidth;o.rl=!!document.querySelector('[data-xa="rl"]');
  if(o.rl){document.querySelector('[data-xa="rl"]').click();o.marked=/On your list/.test(document.querySelector('[data-xa="rl"]').innerText)}return o});
console.log('  ',r.txt.slice(0,520));
ok('after a missed question there is an "Explain it · how to" button; it opens in place',r.btn&&!r.open0&&/Explain it/i.test(r.txt)&&r.sw<=392);
ok('it gives the explanation, the rule behind it, how to attack this kind of question and where it is taught',/How to attack this kind of question/i.test(r.txt)&&/true-or-false/.test(r.txt)&&/The rule behind it|Where it is taught/i.test(r.txt));
await p.screenshot({path:'tmp/h_how.png',fullPage:true});
r=await p.evaluate(()=>{const had=(S.set.xp||{}).rl3;clearInterval(timerId);sess=null;view="home";render();const b=document.querySelector('[data-xa="rlgo"]');const o={had:had!=null,btn:!!b,txt:b?b.innerText:''};if(b){b.click();o.view=view;o.unit=les&&les.unit}return o});console.log('  ',JSON.stringify(r));
ok('a lesson marked "read after the session" appears among the suggestions and opens with one tap',!r.had||(r.btn&&r.view==="lessons"&&r.unit!=null));
r=await p.evaluate(()=>{les=null;part=1;view="home";render();const g=GENS.find(x=>x.exam&&x.p===1);S.set.pace="steady";newSess("quiz",[BANK.find(i=>i.p==1&&i.t==="q"&&i.lv>=2)]);document.querySelector('.opt').click();const c=!!document.querySelector('.conf');clearInterval(timerId);sess=null;view="home";return{c}});
ok('no page errors',errs.length===0);if(errs.length)console.log(errs.slice(0,5));await b.close()})();
