const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.addInitScript(()=>{try{if(sessionStorage.getItem('wipeNext')){sessionStorage.removeItem('wipeNext');localStorage.removeItem('ea-drill-v1')}}catch(e){}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1600);
ok('no restore sheet on a fresh device',await p.evaluate(()=>!document.getElementById('sppop')));
await p.evaluate(()=>{const t=today();BANK.filter(i=>i.p==1).slice(0,120).forEach(i=>{S.it[i.id]=[2,t+3,1,1,1,0,0]});S.hist.push({t:Date.now(),p:1,m:"quiz",n:10,c:8});S.kids=S.kids||{};persist();spSnap(true)});await p.waitForTimeout(500);
let l=await p.evaluate(()=>new Promise(r=>spList(r)));console.log('  copies',JSON.stringify(l));ok('a copy is written to the second store',l.length===1&&l[0].sc>=120);
// 7-day retention
await p.evaluate(()=>new Promise(r=>spDb(db=>{const tx=db.transaction("s","readwrite"),os=tx.objectStore("s");for(let k=1;k<=9;k++)os.put({t:Date.now()-k*864e5,sc:50+k,s:"{}"},"d"+(today()-k));tx.oncomplete=r})));
await p.evaluate(()=>{S.upd=Date.now()+5;spSnap(true)});await p.waitForTimeout(500);l=await p.evaluate(()=>new Promise(r=>spList(r)));ok('only the last 7 days are kept ('+l.length+')',l.length===7);
// storage loss
await p.evaluate(()=>{sessionStorage.setItem('wipeNext','1')});await p.reload();await p.waitForTimeout(2000);
const sheet=await p.evaluate(()=>{const o=document.getElementById('sppop');return o?o.innerText.replace(/\s+/g,' '):null});console.log('  sheet:',sheet);ok('after the main save is lost, a restore sheet appears',!!sheet&&/Restore the saved copy/.test(sheet));
await p.screenshot({path:'tmp/s_restore.png'});
await p.click('[data-sp="restore"]');await p.waitForTimeout(600);ok('one tap restores the answers',await p.evaluate(()=>Object.keys(S.it).length===120&&!document.getElementById('sppop')&&!!localStorage.getItem(LKEY)));
await p.reload();await p.waitForTimeout(1800);ok('restored progress survives a reload and the sheet does not come back',await p.evaluate(()=>Object.keys(S.it).length===120&&!document.getElementById('sppop')));
// keep-current choice
await p.evaluate(()=>{sessionStorage.setItem('wipeNext','1')});await p.reload();await p.waitForTimeout(2000);await p.click('[data-sp="keep"]');await p.waitForTimeout(300);await p.reload();await p.waitForTimeout(1800);ok('"Keep what is on this device" is remembered',await p.evaluate(()=>!document.getElementById('sppop')&&Object.keys(S.it).length===0));
// settings list
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(600);const rows=await p.evaluate(()=>document.querySelectorAll('#spbox .sprow').length);ok('Settings and history lists the copies ('+rows+')',rows>=5);
await p.evaluate(()=>{const d=document.getElementById('spbox').closest('details');d.open=true;d.scrollIntoView()});await p.waitForTimeout(200);await p.screenshot({path:'tmp/s_box.png'});
const first=await p.$('#spbox [data-sp="ask"]');await first.click();await p.waitForTimeout(150);ok('restore from the list asks for a second tap',await p.evaluate(()=>/Tap again/.test(document.querySelector('#spbox [data-sp="ask"]').textContent)&&Object.keys(S.it).length===0));
await p.click('#spbox [data-sp="ask"]');await p.waitForTimeout(700);ok('second tap restores',await p.evaluate(()=>Object.keys(S.it).length===120));
// kids progress is not rolled back
const kd=await p.evaluate(()=>new Promise(res=>{S.kids={setup:1,name:"T",xp:5000,badges:{}};persist();const key="d"+today();spDb(db=>{const g=db.transaction("s").objectStore("s").get(key);g.onsuccess=()=>{const o=JSON.parse(g.result.s);o.kids={setup:1,name:"T",xp:10,badges:{}};const tx=db.transaction("s","readwrite");tx.objectStore("s").put({t:Date.now(),sc:999,s:JSON.stringify(o)},key);tx.oncomplete=()=>spRestore(key,()=>res(S.kids.xp))}})}));ok('a restore never rolls the kids app back (xp '+kd+')',kd===5000);
console.log('errors',errs);await b.close()})();
