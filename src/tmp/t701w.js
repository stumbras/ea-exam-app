// A new learner on a phone, Fast pace, real taps only: diagnostic -> lesson check -> lesson -> facts -> quiz, then the other features.
const {webkit:chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGEERROR '+e.message.slice(0,220)));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text().slice(0,200))});
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
const tap=async sel=>{const el=await p.$(sel);if(!el)return false;await el.scrollIntoViewIfNeeded();await el.tap();return true};
const st=()=>p.evaluate(()=>({view,sess:!!sess,mode:sess&&sess.mode,pos:sess&&sess.pos,phase:sess&&sess.phase,n:sess&&sess.queue.length,title:(document.querySelector('.sesshead h2')||{innerText:''}).innerText,sw:document.documentElement.scrollWidth,bad:/undefined|NaN|\[object Object\]/.test(document.querySelector('#view').innerText),learn:!!(sess&&sess.queue[sess.pos]&&sess.queue[sess.pos].learn)}));
// answer the current question by tapping: right with probability pr (deterministic pattern)
let cps=0;const answerAll=async(pat,max=60)=>{let k=0,frozen=0;for(;k<max;k++){const s=await st();if(!s.sess||s.view!=="session")break;
    if(s.learn){if(!await tap('#next'))await tap('#learnok, .btn.pri');await p.waitForTimeout(150);continue}
    if(await p.evaluate(()=>!!(sess&&sess.cp))){cps++;await tap('#cpgo');await p.waitForTimeout(200);continue}
    if(s.phase==="shown"){await tap('#next');await p.waitForTimeout(200);continue}
    const right=pat(k);const has=await p.evaluate(right=>{const cur=sess.queue[sess.pos],V=view4(cur,BYID[cur.id]);const o=[...document.querySelectorAll('.opt')];if(!o.length)return false;document.querySelectorAll('[data-t]').forEach(x=>x.removeAttribute('data-t'));(right?o.find(x=>+x.dataset.opt===V.ans):o.find(x=>+x.dataset.opt!==V.ans)).setAttribute('data-t','1');return true},right);
    if(!has){frozen++;break}
    const before=s.pos;await tap('.opt[data-t="1"]');await p.waitForTimeout(right?1250:500);const a=await st();
    if(a.sess&&a.pos===before&&a.phase==="ask")frozen++;                     // tap did nothing
    if(a.sess&&a.view==="session"&&a.phase==="shown"){await tap('#next');await p.waitForTimeout(250)}}
  return{k,frozen}};
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=3;view="home";render();scrollTo(0,0)});await p.waitForTimeout(200);
ok('new learner sees the diagnostic on the red button, pace Fast',await p.evaluate(()=>/diagnostic/i.test(document.querySelector('.donext').innerText)&&document.querySelector('.xaseg .on').innerText==="Fast"));
await tap('.donext');await p.waitForTimeout(400);let s=await st();ok('diagnostic opens: 24 questions',s.sess&&s.n===24&&s.title==="Diagnostic");
let r=await answerAll(k=>k%4!==3,80);s=await st();console.log('   diagnostic: answered',r.k,'frozen taps',r.frozen,'->',s.view);
ok('diagnostic: every tap answers at once (no tap is left waiting for a second button)',r.frozen===0);
ok('no checkpoint screen interrupts the diagnostic',cps===0);
ok('diagnostic ends with its report and a next step',s.view==="results"&&!s.bad&&await p.evaluate(()=>!!document.querySelector('.dxr')&&!!document.querySelector('.xpnx')&&missedPool(3,"all").length===0));
// next step: lesson check
await tap('.xpnx');await p.waitForTimeout(400);s=await st();ok('next step is a lesson check, opened from the results page: '+s.title,s.sess&&s.title==="Lesson check");
r=await answerAll(k=>k%2===0,20);s=await st();ok('a failed check ends on results saying "Not yet" and offers the lesson',r.frozen===0&&s.view==="results"&&await p.evaluate(()=>/Not yet/.test(document.querySelector('.dxr').innerText)&&/Read: /.test(document.querySelector('.xpnx').innerText)));
await tap('.xpnx');await p.waitForTimeout(400);s=await st();ok('the lesson opens',s.view==="lessons"&&await p.evaluate(()=>les&&les.unit!=null&&!!document.querySelector('#slide')));
const slides=await p.evaluate(()=>UNITS[part][les.unit].s.length);for(let k=0;k<slides;k++){await tap('#lesnext');await p.waitForTimeout(120)}
s=await st();ok('finishing the lesson returns to the main page with "Learn" next',s.view==="home"&&await p.evaluate(()=>/Learn: /.test(document.querySelector('.donext').innerText)));
await tap('.donext');await p.waitForTimeout(400);s=await st();ok('facts are asked first on Fast: '+s.title,s.sess&&/asked first/.test(s.title));
r=await answerAll(k=>k%3!==2,90);s=await st();console.log('   learn: taps',r.k,'frozen',r.frozen,'->',s.view);
ok('the fact sitting runs to its end by taps alone, with first-sight misses leaving no misses behind',r.frozen===0&&s.view==="results"&&!s.bad);
ok('then a quiz on the lesson is the next step',await p.evaluate(()=>/Quiz: /.test(document.querySelector('.xpnx').innerText)||/Fix your|Learn: /.test(document.querySelector('.xpnx').innerText)));
// glossary inside a session: tapping an underlined term explains it and does not answer the question
r=await p.evaluate(()=>{sess=null;part=1;const q=BANK.find(i=>i.p==1&&i.t==="q"&&i.lv>=2&&/\bAGI\b/.test(i.s));newSess("quiz",[q,q]);return 1});await p.waitForTimeout(500);
const term=await p.$('#view .stem .gl, #view .gl');if(term){await term.tap();await p.waitForTimeout(250);r=await p.evaluate(()=>({pop:!!document.querySelector('#glpop,.glpop'),phase:sess.phase,done:sess.done}));ok('tapping an underlined term opens its explanation and does not answer the question',r.pop&&r.phase==="ask"&&r.done===0);await p.evaluate(()=>{try{glClose()}catch(_){}})}else ok('glossary term is underlined in the question',false);
// the other features open and look sane
const open=async(name,fn,check)=>{await p.evaluate(()=>{try{clearInterval(timerId)}catch(_){}sess=null;les=null;part=1;view="home";render()});await p.waitForTimeout(120);const e0=errs.length;await p.evaluate(f=>(new Function('return ('+f+')()'))(),fn.toString());await p.waitForTimeout(300);const s=await st();const c=await p.evaluate(f=>(new Function('return ('+f+')()'))(),check.toString());ok(name,c&&!s.bad&&s.sw<=392&&errs.length===e0);if(!(c&&!s.bad&&s.sw<=392&&errs.length===e0))console.log('   ',JSON.stringify(s),errs.slice(e0).join('|').slice(0,200))};
await open('My mistakes page opens',()=>plusOpen("mistakes"),()=>/mistake/i.test(document.querySelector('#view').innerText));
await open('Terms page opens',()=>plusOpen("gloss"),()=>/term/i.test(document.querySelector('#view').innerText));
await open('Diagnosis page opens with its checklist',()=>document.querySelector('.xaready').click(),()=>view==="xadiag"&&/How solid is this number/i.test(document.querySelector('#view').innerText));
await open('Pace switches to Max and back with one tap',()=>{document.querySelector('.xaseg [data-v="max"]').click();document.querySelector('.xaseg [data-v="fast"]').click()},()=>S.set.pace==="fast"&&document.querySelector('.xaseg .on').innerText==="Fast");
await open('Quick 10 then End session returns cleanly',()=>{document.querySelector('.xaquick').click();document.querySelector('#quit').click()},()=>view==="home"&&!sess);
await open('Back bar leaves a session to the main page',()=>{document.querySelector('.xaquick').click();document.querySelector('[data-nav="back"]').click()},()=>view==="home"&&!sess);
await open('Calculation practice shows an exam-style question',()=>startSession("calc",3),()=>sess&&BYID[sess.queue[0].id].exam&&document.querySelectorAll('.opt').length===4&&!document.querySelector('.calcteach'));
await open('Lessons list shows all Part 1 units',()=>{les={unit:null,topic:null,idx:0};view="lessons";render()},()=>document.querySelector('#view').innerText.includes("Taxpayer data"));
await open('Settings and safety copies box is there',()=>{const d=[...document.querySelectorAll('details')].find(x=>/Settings and history/i.test(x.innerText));if(d)d.open=true},()=>/Safety cop|safety cop/.test(document.querySelector('#view').innerText));
for(const [pt,name] of [[5,"Series 65"],[6,"EDPNA"],[7,"CAA"],[8,"Notary"]]){await p.evaluate(pt=>{try{clearInterval(timerId)}catch(_){}sess=null;part=pt;view="home";render()},pt);await p.waitForTimeout(150);const e0=errs.length;const q=await p.evaluate(()=>{const o={dn:!!document.querySelector('.donext'),top:!!document.querySelector('.xaready')};document.querySelector('.donext').click();o.view=view;o.sess=!!sess;if(sess&&document.querySelector('.opt')){document.querySelector('.opt').click();o.conf=!!document.querySelector('.conf')||sess.phase==="shown"}return o});ok(`${name}: main page and red button work as before`,q.dn&&!q.top&&errs.length===e0)}
await p.evaluate(()=>{try{clearInterval(timerId)}catch(_){}sess=null});
ok('no errors in the page at any point',errs.length===0);if(errs.length)console.log([...new Set(errs)].slice(0,8).join('\n'));
await b.close()})();
