const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,250)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=1;view="kids";KV={scr:"home"};render()});await p.screenshot({path:'k25home.png'});
console.log('title',await p.evaluate(()=>document.title));
await p.click('[data-k="learn"]');await p.click('[data-kltr="crypto"]');await p.click('[data-klesson="crypto:0"]');for(let i=0;i<3;i++)await p.click('[data-k="lnext"]');
for(let q=0;q<2;q++){const a=await p.evaluate(()=>{const [tr,i]=KV.les;return KLESS[tr][i][2][KV.lst.q][2]});await p.click(`[data-klans="${a}"]`);await p.click('[data-k="lqnext"]')}
console.log('lesson',await p.evaluate(()=>[S.kids.learn.done,S.kids.tix,S.kids.rot.done]));
await p.evaluate(()=>{KV={scr:"music"};render()});await p.click('[data-kmm="read"]');for(let i=0;i<10;i++){const n=await p.evaluate(()=>KV.rd.n[0]);await p.click(`[data-kml="${n}"]`);await p.click('[data-k="mrnext"]')}
console.log('music',await p.evaluate(()=>[S.kids.music.lv,S.kids.tix]));await p.screenshot({path:'k25music.png'});
await p.evaluate(()=>{KV={scr:"music",mm:"song"};render()});await p.click('[data-kms="0"]');for(const n of ["B4","A4","G4"])await p.click(`[data-kpk="${n}"]`);await p.screenshot({path:'k25song.png'});console.log('song pos',await p.evaluate(()=>KV.sp));
await p.evaluate(()=>{KV={scr:"music",mm:"comp"};render()});await p.click('[data-kcomp="0:C4"]');await p.click('[data-kcomp="1:E4"]');await p.screenshot({path:'k25comp.png'});
await p.evaluate(()=>{KV={scr:"powers"};render()});await p.click('[data-k="ptilt"]');await p.waitForTimeout(300);
console.log('errors',JSON.stringify(errs));await b.close()})();
