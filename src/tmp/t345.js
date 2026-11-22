const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message.slice(0,160)));
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.sound=false;k.tix=40;k.xp=900;k.adultUntil=Date.now()+9e6;k.passUntil=Date.now()+9e6;k.guided=false;persist();KV={scr:"home"};render()});
const go=async k=>{await p.evaluate(k=>{KV={scr:"home"};try{kDrv=null;kFly=null;kLnd=null}catch(_){ }render();const b=document.createElement("button");b.dataset.k=k;kidsClick(b)},k);await p.waitForTimeout(500)};
// city
await go('city');let y=await p.evaluate(()=>document.querySelector('[data-k="cityGo"]').getBoundingClientRect().top);ok('city Drive button on first screen (y='+Math.round(y)+')',y<500);
await p.click('.kfold[data-fid="city"]>summary');ok('city how-to opens',await p.evaluate(()=>document.querySelector('.kfold[data-fid="city"]').open&&!!document.querySelector('.kfold[data-fid="city"] .kdbr')));
await p.click('[data-k="cityGo"]');await p.waitForTimeout(700);ok('city starts',await p.evaluate(()=>!!document.querySelector('#kcty')));
// drive
await go('drive');const st=await p.evaluate(()=>{const b=document.querySelector('.kstick');const r=b.getBoundingClientRect();return{y:r.bottom,earn:/Earn your next ticket/.test(document.querySelector('#view').innerText)}});ok('drive button pinned in view (bottom='+Math.round(st.y)+')',st.y<=844);ok('earn card hidden with 40 tickets',!st.earn);
await p.click('.kfold[data-fid="garage"]>summary');await p.waitForTimeout(200);
const sw=await p.$$('.kfold[data-fid="garage"] [data-kcol]');ok('garage has paint swatches ('+sw.length+')',sw.length>=5);if(sw[2]){await sw[2].click();await p.waitForTimeout(300)}
ok('garage stays open after picking paint',await p.evaluate(()=>{const d=document.querySelector('.kfold[data-fid="garage"]');return !!d&&d.open}));
await p.evaluate(()=>{KS().tix=1;persist();render()});await p.waitForTimeout(300);ok('earn card shows when tickets are low',await p.evaluate(()=>/Earn your next ticket/.test(document.querySelector('#view').innerText)));
await p.evaluate(()=>{KS().tix=40;persist();render()});await p.waitForTimeout(200);
await p.click('.kstick');await p.waitForTimeout(900);ok('drive starts',await p.evaluate(()=>!!document.querySelector('#kdrv')||!!document.querySelector('canvas')));
// fly
await go('fly');const f=await p.evaluate(()=>{const ms=[...document.querySelectorAll('.kcard')].filter(c=>c.querySelector('[data-kflym]'));return{n:ms.length,next:document.querySelectorAll('.kfmn').length,firstY:ms[0].getBoundingClientRect().top,man:!!document.querySelector('.kfold[data-fid="flyman"]'),set:!!document.querySelector('.kfold[data-fid="flyset"]'),h:document.documentElement.scrollHeight}});
ok('fly: '+f.n+' missions, first at y='+Math.round(f.firstY)+', page '+f.h+'px',f.n>=10&&f.firstY<400&&f.h<2600);ok('fly: one highlighted next mission',f.next===1);ok('fly: manual + settings folded',f.man&&f.set);
await p.click('.kfold[data-fid="flyman"]>summary');ok('flight manual opens with content',await p.evaluate(()=>document.querySelector('.kfold[data-fid="flyman"]').innerText.length>400));
await p.click('.kfmn [data-kflym]');await p.waitForTimeout(900);ok('flight starts from the next mission',await p.evaluate(()=>!!document.querySelector('#kfly')));
// learn / genius
await go('learnhub');ok('explorer map folded at the bottom',await p.evaluate(()=>{const d=document.querySelector('.kfold[data-fid="cov"]');return !!d&&!d.open&&!d.nextElementSibling}));
await p.click('.kfold[data-fid="cov"]>summary');ok('explorer map opens',await p.evaluate(()=>document.querySelectorAll('.kfold[data-fid="cov"] .kcard *').length>60));
await go('genius');ok('genius topics folded',await p.evaluate(()=>{const d=document.querySelector('.kfold[data-fid="gperf"]');return !!d&&d.querySelectorAll('.kgrow').length>20}));
// study app
await p.close();p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();p.on('pageerror',e=>errs.push('PE '+e.message.slice(0,160)));await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1200);
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(300);
ok('P1 Do-next button on first screen',await p.evaluate(()=>document.querySelector('.donext').getBoundingClientRect().bottom<=844));
await p.evaluate(()=>{document.querySelector('#xptools').open=true});await p.waitForTimeout(250);await p.click('#dlall>summary');ok('P1 show-all opens',await p.evaluate(()=>document.querySelector('#dlall').open&&document.querySelectorAll('#dlall .drow').length>5));
await p.waitForTimeout(300);await p.evaluate(()=>render());await p.waitForTimeout(300);ok('P1 show-all stays open after re-render',await p.evaluate(()=>document.querySelector('#dlall').open));
await p.click('#dlall .drow');await p.waitForTimeout(400);ok('P1 folded drill starts',await p.evaluate(()=>view!=="home"));
await p.evaluate(()=>{part=8;view="home";sess=null;S.set.np={};render()});await p.waitForTimeout(300);
ok('notary no sideways scroll',await p.evaluate(()=>document.documentElement.scrollWidth<=392));
ok('notary step 1 open, others closed',await p.evaluate(()=>document.querySelector('#nps0').open&&!document.querySelector('#nps1').open));
await p.click('[data-np="0"]');await p.waitForTimeout(300);ok('tick step 1 -> step 2 opens',await p.evaluate(()=>!document.querySelector('#nps0').open&&document.querySelector('#nps1').open&&S.set.np[0]===1));
await p.click('#nps5>summary');ok('any step opens on tap with links',await p.evaluate(()=>document.querySelector('#nps5').open&&document.querySelectorAll('#nps5 a[href^="https://"]').length>=1));
ok('all 11 steps keep their links',await p.evaluate(()=>document.querySelectorAll('.npath a[href^="https://"]').length>=15));
await p.evaluate(()=>{S.set.np={};persist()});
console.log('errors',errs);await b.close()})();
