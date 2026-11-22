const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},acceptDownloads:true});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1400);
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(300);
ok('home has the My mistakes and Terms buttons under the red button',await p.evaluate(()=>{const s=document.querySelector('.pstrip'),d=document.querySelector('.donext');return !!s&&!!d&&s.getBoundingClientRect().top>d.getBoundingClientRect().top&&s.getBoundingClientRect().top<1000}));
// ---- terms page ----
await p.click('[data-plus="gloss"]');await p.waitForTimeout(300);
let n=await p.evaluate(()=>document.querySelectorAll('.prow').length);ok('terms page lists the terms used in this section ('+n+' rows)',n>100&&n<200);
await p.fill('#plusq','magi');await p.waitForTimeout(150);n=await p.evaluate(()=>[...document.querySelectorAll('.prow')].map(x=>x.innerText.replace(/\s+/g,' ')).join(' | '));console.log('  search magi ->',n);
ok('search filters and keeps the keyboard focus',/MAGI/.test(n)&&await p.evaluate(()=>document.activeElement&&document.activeElement.id==="plusq"));
await p.click('.prow');await p.waitForTimeout(200);ok('tapping a row opens its meaning',await p.evaluate(()=>/Modified adjusted gross income/.test((document.querySelector('.glsheet')||{}).innerText||'')));
await p.click('#glok');await p.waitForTimeout(150);
// look up terms in a real question, then find them on the list
await p.evaluate(()=>{glOpen("AGI","AGI");glClose();glOpen("HOH","HOH");glClose();glOpen("AGI","AGI");glClose();render()});await p.waitForTimeout(250);
const mine=await p.evaluate(()=>({list:plusMine(),n:(S.set.gls.AGI||{}).n,chips:document.querySelectorAll('.pchips .btn').length}));console.log('  my terms',JSON.stringify(mine));
ok('looked-up terms are collected with counts',mine.list.includes("AGI")&&mine.list.includes("HOH")&&mine.list.includes("MAGI")&&mine.n===2&&mine.chips===3);
await p.click('[data-plus="rev"]');await p.waitForTimeout(150);await p.click('[data-plus="revshow"]');await p.waitForTimeout(100);await p.screenshot({path:'tmp/p_rev.png'});await p.click('[data-plus="revk"]');await p.waitForTimeout(100);
await p.click('[data-plus="revshow"]');await p.click('[data-plus="revn"]');await p.waitForTimeout(100);await p.click('[data-plus="revshow"]');await p.click('[data-plus="revk"]');await p.waitForTimeout(200);
ok('self-check removes known terms and keeps the other',await p.evaluate(()=>plusMine().length===1&&!pv.rev));
await p.evaluate(()=>{pv.q="";render()});await p.waitForTimeout(150);await p.screenshot({path:'tmp/p_gloss.png'});
// popup link from a study screen
await p.evaluate(()=>{view="home";render();glOpen("EITC","EITC")});await p.waitForTimeout(150);await p.click('[data-glgo]');await p.waitForTimeout(250);ok('"All terms" link in the popup opens the terms page',await p.evaluate(()=>view==="gloss"&&!document.getElementById('glpop')));
ok('Back bar on the terms page',await p.evaluate(()=>!!document.querySelector('.bkback.go')));
// ---- mistakes ----
await p.evaluate(()=>{const qs=BANK.filter(i=>i.p==1&&i.t==="q");[0,1,2,3,40,41,90].forEach((k,j)=>{const i=qs[k*3];S.it[i.id]=[0,today(),2,0,0,0,j===0?3:1]});const f=BANK.find(i=>i.p==1&&i.t==="f");S.it[f.id]=[0,today(),1,0,0,0,1];persist();view="home";render()});await p.waitForTimeout(250);
ok('home button shows the count of open mistakes',await p.evaluate(()=>/8/.test(document.querySelector('[data-plus="mistakes"]').innerText)));
await p.click('[data-plus="mistakes"]');await p.waitForTimeout(250);
const m=await p.evaluate(()=>({groups:document.querySelectorAll('.pmg').length,items:document.querySelectorAll('.pmi').length,ans:document.querySelectorAll('.pma').length,txt:document.querySelector('.pmi').innerText.replace(/\s+/g,' ').slice(0,200),und:/undefined/.test(document.querySelector('#view').innerText)}));console.log('  notebook',JSON.stringify(m));
ok('notebook groups misses by topic with the answer and the reason',m.groups>=2&&m.items>=4&&m.ans===m.items&&!m.und);await p.screenshot({path:'tmp/p_mist.png',fullPage:true});
await p.click('.donext[data-plus="fix"]');await p.waitForTimeout(300);const ss=await p.evaluate(()=>({view,mode:sess&&sess.mode,n:sess&&sess.queue.length,allMissed:sess&&sess.queue.every(q=>(S.it[q.id]||[])[4]===0)}));console.log('  fix session',JSON.stringify(ss));
ok('"Fix these" starts a session made of the missed questions',ss.view==="session"&&ss.n>=5&&ss.allMissed);
// ---- course mode: strip + certificate ----
const p2=await ctx.newPage();p2.on('pageerror',e=>errs.push('P2 '+e.message.slice(0,200)));await p2.goto('http://localhost:8765/ea-exam-app/?course');await p2.waitForTimeout(1400);
ok('course home has the strip too',await p2.evaluate(()=>!!document.querySelector('#view .pstrip')));
await p2.evaluate(()=>{const s=campS();CAMP.forEach(x=>s.st[x.id]={l:1,ok:1,best:.9,n:1});s.cap={done:1,best:.94,n:1};persist();campOpen()});await p2.waitForTimeout(300);
ok('finished Bootcamp shows the certificate button',await p2.evaluate(()=>!!document.querySelector('[data-plus="cert"]')));
await p2.click('[data-plus="cert"]');await p2.waitForTimeout(300);await p2.fill('#certname','Cristy Sample');await p2.waitForTimeout(200);
const cz=await p2.evaluate(()=>{const c=document.getElementById('certcv'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let dark=0;for(let i=0;i<d.length;i+=400)if(d[i]<120)dark++;return{w:c.width,h:c.height,dark}});console.log('  certificate canvas',JSON.stringify(cz));ok('certificate is drawn',cz.dark>200);
await p2.screenshot({path:'tmp/p_cert.png'});
const [dl]=await Promise.all([p2.waitForEvent('download',{timeout:8000}).catch(()=>null),p2.click('[data-plus="certsave"]')]);ok('Save picture downloads a PNG: '+(dl?dl.suggestedFilename():'none'),!!dl&&/\.png$/.test(dl.suggestedFilename()));
if(dl)await dl.saveAs('tmp/p_cert_file.png');
await p2.click('[data-plus="certclose"]');await p2.waitForTimeout(100);ok('certificate closes',await p2.evaluate(()=>!document.getElementById('certpop')));
console.log('errors',errs);await b.close()})();
