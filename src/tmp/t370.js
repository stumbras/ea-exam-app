const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,160)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
console.log('terms',await p.evaluate(()=>Object.keys(GL).length+Object.values(GLP).reduce((n,o)=>n+Object.keys(o).length,0)),'regex ok',await p.evaluate(()=>!!glRe));
const cnt=()=>p.evaluate(()=>{const g=[...document.querySelectorAll('#view .gl')];return{n:g.length,inBtn:g.filter(x=>x.closest('button,a,summary,label')).length,terms:[...new Set(g.map(x=>x.dataset.gl))].slice(0,14)}});
// lesson in part 1
await p.evaluate(()=>{part=1;view="lessons";render()});await p.waitForTimeout(400);
await p.evaluate(()=>{const u=document.querySelector('[data-lu],[data-les],[data-unit]');});
for(const pt of [1,2,3,4,5,6,7,8]){await p.evaluate(pt=>{part=pt;filt="all";sess=null;view="home";startSession(BANK.some(i=>i.p==pt&&i.t==="q")?"medium":"cards")},pt);await p.waitForTimeout(350);
 // answer to reveal explanation
 await p.evaluate(()=>{try{const cur=sess.queue[sess.pos];sess.qstart=Date.now()-9000;record(true,true)}catch(e){}});await p.waitForTimeout(250);
 const c=await cnt();console.log(' part',pt,'session terms',c.n,'inside buttons',c.inBtn,c.terms.join(', '));
 await p.evaluate(()=>{sess=null;view="lessons";les={unit:null,topic:null,idx:0};render();try{lesOpen("u",0);render()}catch(e){}});await p.waitForTimeout(300);const c2=await cnt();console.log('        lesson terms',c2.n,c2.terms.join(', '))}
// tap a term
await p.evaluate(()=>{part=1;sess=null;view="home";startSession("medium")});await p.waitForTimeout(300);
let found=false;for(let k=0;k<25&&!found;k++){found=await p.evaluate(()=>!!document.querySelector('#view .gl'));if(!found){await p.evaluate(()=>{sess.qstart=Date.now()-9000;record(true,true)});await p.waitForTimeout(120);found=await p.evaluate(()=>!!document.querySelector('#view .gl'));if(!found){await p.evaluate(()=>advance());await p.waitForTimeout(120)}}}
ok('a term is underlined in a Part 1 question',found);
const before=await p.evaluate(()=>JSON.stringify([view,sess&&sess.pos,sess&&sess.phase]));
await p.click('#view .gl');await p.waitForTimeout(250);
const pop=await p.evaluate(()=>{const s=document.querySelector('.glsheet');return s?s.innerText.replace(/\n+/g,' | '):null});console.log('  popup:',pop);ok('popup opens',!!pop);
await p.screenshot({path:'tmp/g_pop.png'});
ok('tapping the term did not answer or move the question',before===await p.evaluate(()=>JSON.stringify([view,sess&&sess.pos,sess&&sess.phase])));
await p.click('#glok');await p.waitForTimeout(200);ok('Got it closes',await p.evaluate(()=>!document.getElementById('glpop')));
await p.click('#view .gl');await p.waitForTimeout(200);await p.mouse.click(195,60);await p.waitForTimeout(200);ok('tap outside closes',await p.evaluate(()=>!document.getElementById('glpop')));
ok('state unchanged after closing',before===await p.evaluate(()=>JSON.stringify([view,sess&&sess.pos,sess&&sess.phase])));
// mock exam: off
await p.evaluate(()=>{sess=null;view="home";part=1;render();const m=document.querySelector('[data-mock]');});
const mk=await p.evaluate(()=>{try{startSession("mock",10)}catch(e){return 'err '+e.message}return sess&&sess.mode});await p.waitForTimeout(400);
console.log('  mock mode:',mk,'terms on screen',await p.evaluate(()=>document.querySelectorAll('#view .gl').length));
// per-section meaning
console.log('  IA in part 3:',await p.evaluate(()=>{part=3;return glGet("IA")[0]}),'| part 5:',await p.evaluate(()=>{part=5;return glGet("IA")[0]}),'| part 1:',await p.evaluate(()=>{part=1;return glGet("IA")}),'| COA part 4:',await p.evaluate(()=>{part=4;return glGet("COA")[0]}),'| part 7:',await p.evaluate(()=>{part=7;return glGet("COA")[0]}));
// performance on the longest page
const t=await p.evaluate(()=>{part=4;sess=null;view="taxsim";render();const t0=performance.now();glWrap();return Math.round(performance.now()-t0)});await p.waitForTimeout(300);
console.log('  taxsim: wrap pass',t,'ms, terms',await p.evaluate(()=>document.querySelectorAll('#view .gl').length),'height',await p.evaluate(()=>document.documentElement.scrollHeight));
// kids app untouched
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);ok('kids app has no glossary marks',await p.evaluate(()=>document.querySelectorAll('.gl').length===0));
console.log('errors',errs);await b.close()})();
