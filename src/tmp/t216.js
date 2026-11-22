const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const U='http://localhost:8765/ea-exam-app/';await p.goto(U);await p.waitForTimeout(2000);await p.evaluate(()=>{delete S.kids;view="start";render()});
await p.click('#kidsbtn');await p.fill('#kname','Alex');await p.selectOption('#kbm','3');await p.selectOption('#kbdd','14');await p.selectOption('#kby',String(new Date().getFullYear()-8));await p.click('[data-k="saveSetup"]');
console.log('setup',await p.evaluate(()=>[S.kids.lv.math,kAge(S.kids)]));await p.screenshot({path:'k3home.png',fullPage:true});
console.log('sweep',await p.evaluate(()=>{const k=KS(),bad=[];for(const s in KSUB)for(let L=1;L<=(KMAXLV[s]||20);L++){k.lv[s]=L;for(let i=0;i<25;i++){const Q=kQ(s);if(Q.kind==="bee"){if(!Q.word)bad.push(s+L+"bee")}else if(Q.o.length!==4||Q.a<0||new Set(Q.o).size!==4||Q.o.some(o=>o==="NaN"||o==="undefined"||o===""))bad.push(s+L+":"+Q.q.slice(0,50)+"|"+Q.o.join("/"))}}
 for(const c of ["flags","maps","space","bee","tesla"])for(let T=1;T<=5;T++){const sub=c==="bee"?"eng":c==="flags"||c==="maps"?"geo":"sci";k.lv[sub]=T*4;for(let i=0;i<30;i++){const Q=kQ(sub,c);if(Q.kind!=="bee"&&(Q.o.length!==4||Q.a<0||new Set(Q.o).size!==4))bad.push(c+T+":"+Q.q.slice(0,40)+"|"+Q.o.join("/"))}}
 for(const s in KSUB)k.lv[s]=4;return bad.slice(0,10).concat(["bad="+bad.length])}));
// quiz show rounds
await p.click('[data-k="show"]');await p.screenshot({path:'k3cats.png',fullPage:true});
for(const cat of ["flags","maps","tesla","bee","brain"]){await p.click(`[data-kcat="${cat}"]`);for(let i=0;i<5;i++){if(await p.$('[data-k="lessonOk"]'))await p.click('[data-k="lessonOk"]');
  const isBee=await p.evaluate(()=>KV.Q.kind==="bee");if(i===1&&cat==="flags"){await p.click('[data-k="hint"]');await p.screenshot({path:'k3hint.png'})}
  if(isBee){const w=await p.evaluate(()=>KV.Q.word);await p.fill('#kbeein',i===2?"wrong":w);if(i===0)await p.screenshot({path:'k3bee.png'});await p.click('[data-k="beeGo"]')}else{const a=await p.evaluate(()=>KV.Q.a);if(i===0)await p.screenshot({path:`k3q_${cat}.png`});await p.click(`[data-ka="${a}"]`);await p.waitForTimeout(750)}
  await p.click('[data-k="next"]')}
 console.log('round',cat,await p.evaluate(()=>[KV.stage,KV.right,KV.score,S.kids.rocket.dest]));if(cat==="brain")await p.screenshot({path:'k3scan.png',fullPage:true});
 if(await p.$('[data-k="certOk"]'))await p.click('[data-k="certOk"]');if(await p.$('[data-k="certOk"]'))await p.click('[data-k="certOk"]');await p.click('[data-k="show"]').catch(()=>{})}
console.log('hintnopts',await p.evaluate(()=>S.kids.hints));
// lesson on level up
await p.evaluate(()=>{const k=KS();k.lv.math=8;k.st.math.run=2;k.st.math.h=[1,1,1,1,1,1,1,1];kAnswer("math",true,{s:"math",q:"x"});});console.log('lesson',await p.evaluate(()=>[S.kids.lv.math,S.kids.lessonQ]));
await p.evaluate(()=>{KV={scr:"show",stage:"pick"};render()});await p.click('[data-kcat="math"]');await p.screenshot({path:'k3lesson.png'});await p.click('[data-k="lessonOk"]');console.log('lessonDone',await p.evaluate(()=>[S.kids.lessonQ,!!S.kids.seen["math:9"]]));
// review queue
console.log('review',await p.evaluate(()=>{const k=KS();const Q=kQ("geo");kAnswer("geo",false,Q);const n0=k.rev.length;k.qn+=10;const R=kRevDue(Q.s);return [n0,!!R,R&&R.rv]}));
// chess quest
await p.evaluate(()=>{KV={scr:"home"};render()});await p.click('[data-k="chess"]');let n=0;
while(await p.evaluate(()=>KV.scr==="chess")&&n<25){n++;if(await p.$('[data-k="lessonOk"]')){await p.click('[data-k="lessonOk"]');continue}const isP=await p.evaluate(()=>!!KV.P);
 if(isP){const [f,t]=await p.evaluate(()=>KV.P.ok[0]);await p.click(`[data-ksq="${f}"]`);await p.click(`[data-ksq="${t}"]`)}else{const bee=await p.evaluate(()=>KV.Q.kind==="bee");if(bee){await p.fill('#kbeein',await p.evaluate(()=>KV.Q.word));await p.click('[data-k="beeGo"]')}else{const r=await p.evaluate(()=>KV.Q.a);await p.click(`[data-ka="${r}"]`)}}await p.click('[data-k="cnext"]')}
console.log('chess',await p.evaluate(()=>[KV.scr,KV.title,S.kids.chess.solved,S.kids.chess.promos]));await p.click('[data-k="home"]');if(await p.$('[data-k="certOk"]'))await p.click('[data-k="certOk"]');
// mine with hint
await p.click('[data-k="mine"]');await p.click('[data-k="mhint"]');await p.screenshot({path:'k3mine.png'});await p.evaluate(()=>{const s=kRoverSolve(KV.P);KV.P.prog=s.prog;render()});await p.click('[data-k="run"]');await p.waitForFunction(()=>KV.P.state==="win",null,{timeout:20000});
console.log('minehint',await p.evaluate(()=>[S.kids.mine.dia,KV.P.stars]));await p.click('[data-k="home"]');if(await p.$('[data-k="certOk"]'))await p.click('[data-k="certOk"]');
// terminal: all missions
await p.click('[data-k="term"]');await p.screenshot({path:'k3term0.png'});
const cmds=["pwd","ls","cd station","cat log.txt","cd ..","mkdir rockets","touch rockets/plan.txt","echo launch at noon > rockets/plan.txt","ls -a station","cat station/.secret","grep diamond cave/map.txt","wc -l station/crew.txt","sort station/crew.txt","cp station/crew.txt station/crew_backup.txt","mv notes.txt ideas.txt","rm junk.txt","cat station/crew.txt | sort","find . -name *.key","head -n 3 cave/map.txt","whoami","mkdir base","echo hello > base/hello.txt","tree","fortune","rocket","ls -l","sudo rm -rf /","foo"];
for(const c of cmds){await p.fill('#tin',c);await p.press('#tin','Enter');await p.waitForTimeout(60)}
console.log('term',await p.evaluate(()=>[S.kids.term.lv,KTERM.length,S.kids.term.cwd]));await p.screenshot({path:'k3term.png',fullPage:true});
console.log('termout',await p.evaluate(()=>KV.T.lines.slice(-12).map(l=>l.h.replace(/<[^>]+>/g,"")).join(" ¦ ").slice(0,900)));
// trophies & cert
await p.evaluate(()=>{const k=KS();k.week.secs=4*3600+5;kTrophyCheck();KV={scr:"home"};render()});await p.screenshot({path:'k3cert.png'});
let c=0;while(await p.$('[data-k="certOk"]')&&c<20){await p.click('[data-k="certOk"]');c++}console.log('certs',c,await p.evaluate(()=>Object.keys(S.kids.troph).join(",")));
await p.click('[data-k="trophies"]');await p.screenshot({path:'k3hall.png'});await p.click('[data-k="home"]');
await p.click('[data-k="brain"]');await p.screenshot({path:'k3brain.png',fullPage:true});await p.click('[data-k="home"]');
await p.click('[data-k="sounds"]');await p.click('[data-kvox="robot"]');await p.click('[data-k="tMusic"]');await p.click('[data-k="tRead"]');console.log('sound',await p.evaluate(()=>[S.kids.voice,S.kids.music,S.kids.autoRead]));await p.click('[data-k="tMusic"]');await p.click('[data-k="home"]');
await p.evaluate(()=>{updateReady="Version 999";render()});console.log('updbtn',await p.evaluate(()=>[!!document.querySelector('[data-k="kupd"]'),!!document.querySelector('[data-k="kcheck"]')]));
await p.click('[data-k="grown"]');await p.screenshot({path:'k3grown.png',fullPage:true});
await p.evaluate(()=>{KV={scr:"home"};updateReady="";render()});await p.screenshot({path:'k3home2.png',fullPage:true});
console.log('overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),'errors',JSON.stringify(errs));await b.close()})();
