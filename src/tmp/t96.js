const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const U='http://localhost:8765/ea-exam-app/';
 const ctx=await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:2});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto(U);await p.waitForTimeout(1800);await p.evaluate(()=>{if(typeof OPEN!=="undefined")OPEN.moremodes=true;if(typeof render==="function")render()});await p.click('[data-sec="ea"]').catch(()=>{});
 console.log('row:',await p.evaluate(()=>document.querySelector('#examedit').innerText.replace(/\n+/g,' | ')));
 await p.screenshot({path:'exam-row.png'});
 await p.click('#examedit');await p.waitForTimeout(150);
 await p.fill('[data-examin="1"]','2027-01-15');await p.fill('[data-examin="2"]','2027-04-10');await p.fill('[data-examin="3"]','2027-06-01');
 await p.screenshot({path:'exam-edit.png'});
 await p.click('#examsave');await p.waitForTimeout(200);
 console.log('after save:',await p.evaluate(()=>[document.querySelector('#examedit').innerText.replace(/\n+/g,' | '),JSON.stringify(S.set.exam),!!S.set.examT,newPerDay(1)]));
 await p.reload();await p.waitForTimeout(1200);await p.evaluate(()=>{if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()});await p.click('[data-sec="ea"]').catch(()=>{});
 console.log('after reload:',await p.evaluate(()=>JSON.stringify(S.set.exam)));
 await p.click('[data-part="2"]').catch(()=>{});await p.waitForTimeout(200);
 console.log('part2 row:',await p.evaluate(()=>document.querySelector('.dash').innerText.replace(/\n+/g,' | ').slice(0,260)));
 // clear part 2
 await p.click('#examedit');await p.click('[data-examclr="2"]');await p.click('#examsave');await p.waitForTimeout(150);
 console.log('part2 cleared:',await p.evaluate(()=>document.querySelector('#examedit').innerText.replace(/\n+/g,' | ')));
 // merge: older exam change must not be overwritten by a later answer on another device; newer exam change wins
 console.log('merge:',await p.evaluate(()=>{const A=JSON.parse(JSON.stringify(S));A.set.exam[1]="2027-02-01";A.set.examT=Date.now()+5;A.upd=Date.now()+5;const B=JSON.parse(JSON.stringify(S));B.upd=Date.now()+99999;const m1=mergeState(A,B),m2=mergeState(B,A);return [m1.set.exam[1],m2.set.exam[1],m1.set.size]}));
 await p.click('[data-part="1"]').catch(()=>{});await p.waitForTimeout(200);
 // random 10, five draws
 for(let k=0;k<3;k++){await p.click('[data-mode="mix"]');await p.waitForTimeout(250);
  console.log('mix:',await p.evaluate(()=>{const c={easy:0,medium:0,hard:0,calc:0};const seq=sess.queue.map(e=>{const i=BYID[e.id];const t=i.t==="g"||GENS.includes(i)?"calc":(i.t==="f"||i.lv===1)?"easy":i.lv===2?"medium":"hard";c[t]++;return t[0]});return JSON.stringify(c)+' '+seq.join('')+' n='+sess.queue.length+' title='+(document.querySelector('.sesshead h2')||{}).textContent}));
  if(k==0)await p.screenshot({path:'mix-card.png'});
  await p.evaluate(()=>{sess=null;view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()})}
 // domain filter
 await p.evaluate(()=>{filt="6";render()});await p.click('[data-mode="mix"]');await p.waitForTimeout(200);
 console.log('mix dom6:',await p.evaluate(()=>sess.queue.length+' all d6='+sess.queue.every(e=>String(BYID[e.id].d)==="6")));
 await p.evaluate(()=>{sess=null;view="home";filt="all";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()});
 // answer through a mix session quickly to be sure every card type renders
 await p.click('[data-mode="mix"]');await p.waitForTimeout(200);
 console.log('cards render:',await p.evaluate(()=>{let ok=0;for(let k=0;k<sess.queue.length;k++){sess.i=k;sess.answered=false;try{render();if(document.querySelector('#view .card'))ok++}catch(e){return 'ERR '+e.message}}return ok+'/'+sess.queue.length}));
 await p.evaluate(()=>{sess=null;view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()});
 // lessons list still fine
 await p.click('[data-mode="lessons"]');await p.waitForTimeout(200);console.log('lessons:',await p.evaluate(()=>document.querySelector('#view h2').textContent+' rows '+document.querySelectorAll('.topicrow').length));
 console.log('overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'errors',errs);await b.close()})();
