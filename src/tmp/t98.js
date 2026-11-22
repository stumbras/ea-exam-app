const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const errs=[];const U='http://localhost:8765/ea-exam-app/';
 const mk=async()=>{const ctx=await b.newContext({viewport:{width:430,height:932},acceptDownloads:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(U);await p.waitForTimeout(1500);await p.click('[data-sec="ea"]').catch(()=>{});return p};
 const A=await mk(),B=await mk();
 // device A answers 12 items and sets an exam date; device B answers 8 others
 await A.evaluate(()=>{BANK.filter(i=>i.p==1).slice(0,12).forEach(i=>grade(i,2));S.set.exam[1]="2027-01-20";S.set.examT=Date.now();persist();render()});
 await B.evaluate(()=>{BANK.filter(i=>i.p==1).slice(40,48).forEach(i=>grade(i,0));persist();render()});
 const [dl]=await Promise.all([A.waitForEvent('download'),A.click('#syncsave')]);const path='/tmp/'+dl.suggestedFilename();await dl.saveAs(path);
 console.log('A saved:',dl.suggestedFilename(),fs.statSync(path).size,'bytes | note:',await A.evaluate(()=>document.querySelector('.dash').innerText.match(/Progress file[^\n]*/)[0]));
 await B.setInputFiles('input[data-bk]',path);await B.waitForTimeout(400);
 console.log('B after load:',await B.evaluate(()=>[Object.keys(S.it).length,S.set.exam[1],document.querySelector('.dash').innerText.match(/Progress merged[^\n]*/)[0]]));
 // and back: B -> A
 const [dl2]=await Promise.all([B.waitForEvent('download'),B.click('#syncsave')]);const p2='/tmp/b-'+dl2.suggestedFilename();await dl2.saveAs(p2);
 await A.setInputFiles('input[data-bk]',p2);await A.waitForTimeout(400);
 console.log('A after load:',await A.evaluate(()=>[Object.keys(S.it).length,S.set.exam[1]]));
 // wrong file
 fs.writeFileSync('/tmp/bad.json','{"hello":1}');await A.setInputFiles('input[data-bk]','/tmp/bad.json');await A.waitForTimeout(300);
 console.log('bad file:',await A.evaluate(()=>[Object.keys(S.it).length,bkNote]));
 await A.reload();await A.waitForTimeout(1200);await A.click('[data-sec="ea"]').catch(()=>{});console.log('A after reload:',await A.evaluate(()=>Object.keys(S.it).length));
 await A.screenshot({path:'sync-row.png'});
 // new questions present, ids unique
 console.log('bank:',await A.evaluate(()=>{const ids=BANK.map(i=>i.id);return [BANK.length,new Set(ids).size,BANK.filter(i=>/Schedule K-1 \(Form 1041\)/.test(i.s||"")).length]}));
 console.log('errors',errs);await b.close()})();
