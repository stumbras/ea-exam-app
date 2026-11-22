// Forms and acronyms drill with a gauge (Version 199)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);await p.evaluate(()=>{localStorage.clear()});await p.reload();await p.waitForTimeout(1500);
const cnt=await p.evaluate(()=>{const o={};for(const pt of Object.keys(PARTS)){const L=faItems(pt);o[pt]=[L.filter(x=>x.kind==="form").length,L.filter(x=>x.kind==="acr").length]}return o});
console.log('  items per section [forms, abbreviations]:',JSON.stringify(cnt));
ok(`EA parts have forms and abbreviations to drill (Part 1: ${cnt[1]}, Part 2: ${cnt[2]}, Part 3: ${cnt[3]})`,[1,2,3].every(k=>cnt[k][0]>=20&&cnt[k][1]>=20));
ok(`Series 65 and EDPNA already get abbreviations from the glossary (${cnt[5]}, ${cnt[6]})`,cnt[5][1]>=4&&cnt[6][1]>=4);
const q=await p.evaluate(()=>{part=1;const pool=faItems(1);let bad=0,n=0,both={0:0,1:0};for(const it of pool){for(let k=0;k<3;k++){const m=faMake(pool,it);if(!m){bad++;continue}n++;if(m.opts.length!==4||new Set(m.opts.map(x=>x.toLowerCase())).size!==4||m.a<0||m.opts[m.a]!==(/^What /.test(m.q)?it.mean:it.name))bad++;both[/^What /.test(m.q)?0:1]++}}return{n,bad,both}});
ok(`every generated question has four different choices and the right one among them (${q.n} made, both directions ${JSON.stringify(q.both)})`,q.bad===0&&q.both[0]>50&&q.both[1]>50);
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(400);
const home=await p.evaluate(()=>{const b=document.querySelector('.fventry [data-fa="open"]'),d=document.querySelector('.donext');return{btn:b?b.textContent:null,red:d?Math.round(d.getBoundingClientRect().bottom):9999,sw:document.documentElement.scrollWidth}});
ok(`home has the drill button with the gauge under the main button, which stays on the first screen (${home.btn}; main button bottom ${home.red})`,/drill 0%/.test(home.btn||"")&&home.red<=844&&home.sw<=392);
await (await p.$('.fventry [data-fa="open"]')).tap();await p.waitForTimeout(400);
ok('the overview shows the gauge, both kinds and the Drill 10 button',await p.evaluate(()=>view==="fa"&&!!document.querySelector('.fag .fabar')&&document.querySelectorAll('.fakinds .card').length===2&&!!document.querySelector('[data-fa="start"][data-kind="all"]')));
await (await p.$('[data-fa="start"][data-kind="all"]')).tap();await p.waitForTimeout(300);
const first=await p.evaluate(()=>({n:fa.Q.length,h1:document.querySelector('.faq').tagName,gl:document.querySelectorAll('.faq .gl,.faq .frm').length,opts:document.querySelectorAll('.opt').length}));
ok('a round has 10 questions; the question itself has no tappable hints',first.n===10&&first.h1==='H1'&&first.gl===0&&first.opts===4);
// answer: 7 right (auto-advance after 2 s is too slow for the test, so tap Next), 3 wrong
let sawFormLink=false,autoOk=false;
for(let i=0;i<10;i++){const a=await p.evaluate(()=>fa.Q[fa.i].a);const pick=i<7?a:(a+1)%4;await (await p.$(`.opt[data-i="${pick}"]`)).tap();await p.waitForTimeout(250);
  const st=await p.evaluate(()=>({right:document.querySelectorAll('.opt.right').length,wrong:document.querySelectorAll('.opt.wrong').length,fb:!!document.querySelector('.fafb'),link:document.querySelectorAll('.fafb .frm').length,kind:fa.Q[fa.i].it.kind}));
  if(st.kind==='form'&&st.link>0)sawFormLink=true;
  if(i===0){await p.waitForTimeout(2300);autoOk=await p.evaluate(()=>fa.i===1&&fa.pick===-1)}
  else if(i===8){await p.waitForTimeout(2300);ok('a wrong answer waits for Next',await p.evaluate(()=>fa.i===8&&fa.pick>=0));await (await p.$('[data-fa="next"]')).tap();await p.waitForTimeout(200)}
  else{await (await p.$('[data-fa="next"]')).tap();await p.waitForTimeout(200)}}
ok('a right answer moves on by itself after about 2 seconds',autoOk);
const end=await p.evaluate(()=>({scr:fa.scr,ok:fa.ok,st:faStat(1).all,saved:Object.keys(JSON.parse(localStorage.getItem(LKEY)).set.fa||{}).length,rows:document.querySelectorAll('.farow').length}));
ok(`the result shows 7 of 10, lists the 3 missed, and the gauge counts 7 known of ${end.st.n}`,end.scr==='end'&&end.ok===7&&end.st.known===7&&end.st.seen===10&&end.saved===10&&end.rows===3);
console.log('  a form answer linked to the real form:',sawFormLink);
await p.reload();await p.waitForTimeout(1500);
const after=await p.evaluate(()=>{part=1;view="home";render();const b=document.querySelector('.fventry [data-fa="open"]');const r=xaAll();return{st:faStat(1).all,btn:b?b.textContent:"",n:r.n}});
ok(`progress survives a reload and the home button shows it (${after.btn})`,after.st.known===7&&after.st.seen===10&&/drill [1-9]\d?%/.test(after.btn));
ok('the drill does not touch the question bank or the readiness figure (no answered exam questions)',await p.evaluate(()=>Object.keys(S.it).length===0));
await p.evaluate(()=>{faOpen()});await p.waitForTimeout(200);
ok('"Missed only" appears after misses and builds a round from them',await p.evaluate(()=>{const b=document.querySelector('[data-fa="start"][data-kind="miss"]');if(!b)return false;faStart("miss");return fa.Q.length===3&&fa.Q.every(q=>{const r=faRec(q.it.k);return r&&!r[2]})}));
await p.evaluate(()=>{fa.scr="hub";render()});await (await p.$('[data-fa="back"]')).tap();await p.waitForTimeout(300);
ok('Back returns to the home page',await p.evaluate(()=>view==="home"&&!!document.querySelector('.donext')));
for(const pt of [2,3]){ok(`Part ${pt}: the drill opens and builds a round`,await p.evaluate(pt=>{part=pt;view="home";render();faOpen();const okk=faStart("all")&&fa.Q.length===10;fa=null;view="home";render();return okk},pt))}
ok('no page errors',errs.length===0);if(errs.length)console.log(errs);await b.close()})();
