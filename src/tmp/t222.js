const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";view="kids";KV={scr:"home"};render()});await p.click('[data-k="term"]');
for(const c of ["pwd","ls","cd station","cat log.txt","cd ..","mkdir rockets","touch rockets/plan.txt","echo launch at noon > rockets/plan.txt","ls -a station","cat station/.secret","grep diamond cave/map.txt","wc -l station/crew.txt","sort station/crew.txt","cp station/crew.txt station/crew_backup.txt","mv notes.txt ideas.txt","rm junk.txt","cat station/crew.txt | sort","find . -name *.key","head -n 3 cave/map.txt","whoami","mkdir base","echo hello > base/hello.txt"]){await p.fill('#tin',c);await p.press('#tin','Enter');await p.waitForTimeout(30)}
console.log('linux',await p.evaluate(()=>[S.kids.term.lv,KTERM.length]));
await p.evaluate(()=>{KV={scr:"show",stage:"pick"};render()});await p.click('[data-kcat="mix"]');for(let i=0;i<5;i++){if(await p.$('[data-k="lessonOk"]'))await p.click('[data-k="lessonOk"]');const bee=await p.evaluate(()=>KV.Q.kind==="bee");if(bee){await p.fill('#kbeein',await p.evaluate(()=>KV.Q.word));await p.click('[data-k="beeGo"]')}else{await p.click(`[data-ka="${await p.evaluate(()=>KV.Q.a)}"]`);await p.waitForTimeout(720)}await p.click('[data-k="next"]')}
console.log('show',await p.evaluate(()=>[KV.stage,KV.right]));await p.evaluate(()=>{KV={scr:"home"};render()});console.log('home ok',await p.evaluate(()=>!!document.querySelector('.kgames')));
console.log('errors',JSON.stringify(errs));await b.close()})();
