const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const U='http://localhost:8765/ea-exam-app/';await p.goto(U);await p.waitForTimeout(2000);await p.evaluate(()=>{delete S.kids;view="start";render()});
await p.click('#kidsbtn');await p.waitForTimeout(150);await p.screenshot({path:'k2setup.png',fullPage:true});
await p.click('[data-k="saveSetup"]');console.log('err shown',await p.evaluate(()=>!!document.querySelector('.kerr')));
await p.fill('#kname','Alex');await p.selectOption('#kbm','3');await p.selectOption('#kbdd','14');await p.selectOption('#kby',String(new Date().getFullYear()-8));await p.click('[data-kav="4"]');await p.click('[data-k="saveSetup"]');
console.log('setup',await p.evaluate(()=>[S.kids.setup,S.kids.name,S.kids.avatar,kAge(S.kids),S.kids.lv.math]));await p.screenshot({path:'k2home.png',fullPage:true});
// engine checks
console.log('mates',await p.evaluate(()=>KMATE.map(m=>{const b=cFen(m[1]);const ok=cMoves(b,true).filter(x=>cMate(cMove(b,x[0],x[1]),false));return (cInCheck(b,false)||cInCheck(b,true)||!ok.length)?"BAD "+m[1]:ok.length}).join(",")));
console.log('puzzles',await p.evaluate(()=>{const out=[];for(let L=1;L<=20;L++){let t0=performance.now(),bad=0,types={};for(let i=0;i<25;i++){const P=kPuzzle(L);types[P.type]=(types[P.type]||0)+1;if(!P.ok.length)bad++;for(const m of P.ok){const n=cMove(P.b,m[0],m[1]);if(P.type==="mate"&&!cMate(n,false))bad++;if(P.type==="cap"&&!P.b[m[1]])bad++;if(P.type==="safe"&&cAttacked(n,m[1],false))bad++}}out.push(L+":"+Object.entries(types).map(x=>x.join("")).join("/")+" bad"+bad+" "+Math.round((performance.now()-t0)/25)+"ms")}return out.join(" | ")}));
console.log('qsweep',await p.evaluate(()=>{const k=KS();let bad=0;for(const s in KSUB)for(let L=1;L<=20;L++){k.lv[s]=L;for(let i=0;i<20;i++){const Q=kQ(s);if(Q.o.length!==4||Q.a<0||new Set(Q.o).size!==4)bad++}}for(const s in KSUB)k.lv[s]=3;return bad}));
// chest + quests
await p.click('[data-k="chest"]',{force:true});console.log('chest',await p.evaluate(()=>[KV.scr,S.kids.chest.n,S.kids.coins]));await p.screenshot({path:'k2chest.png'});await p.click('[data-k="home"]');
// rocket
await p.click('[data-k="rocket"]');for(let i=0;i<10;i++){const r=await p.evaluate(()=>KV.Q.a);await p.click(`[data-ka="${r}"]`);await p.click('[data-k="next"]')}
console.log('rocket',await p.evaluate(()=>[KV.ok,S.kids.rocket.dest,S.kids.inv.moon,S.kids.today.launch]));await p.click('[data-k="home"]');
// mine
await p.click('[data-k="mine"]');await p.evaluate(()=>{const P=KV.P;const key=(x,y,d)=>x+","+y+","+d;const prev=new Map([[key(P.sx,P.sy,0),null]]);let fr=[[P.sx,P.sy,0]],goal=null;
 while(fr.length&&!goal){const nx=[];for(const [x,y,d] of fr){if(x===P.tx&&y===P.ty){goal=[x,y,d];break}const mv=[["L",[x,y,(d+3)%4]],["R",[x,y,(d+1)%4]]];const st=k=>{let cx=x,cy=y;for(let i=0;i<k;i++){cx+=KDIR[d][0];cy+=KDIR[d][1];if(cx<0||cy<0||cx>=P.N||cy>=P.N||P.g[cy][cx])return null}return[cx,cy,d]};const s1=st(1);if(s1)mv.push(["F",s1]);if(P.loop){const s3=st(3);if(s3)mv.push(["F3",s3])}
 for(const [c,m] of mv){const kk=key(...m);if(!prev.has(kk)){prev.set(kk,[key(x,y,d),c]);nx.push(m)}}}fr=nx}
 const prog=[];let kk=key(...goal);while(prev.get(kk)){const [pk,c]=prev.get(kk);prog.unshift(c);kk=pk}P.prog=prog;render()});
await p.screenshot({path:'k2mine.png'});await p.click('[data-k="run"]');await p.waitForFunction(()=>KV.P.state==="win",null,{timeout:15000});const r0=await p.evaluate(()=>KV.P.lab.a);await p.click(`[data-ka="${r0}"]`);
console.log('mine',await p.evaluate(()=>[S.kids.mine.dia,S.kids.inv.dia,S.kids.mine.lvl]));await p.click('[data-k="home"]');
// chess quest to promotion
await p.click('[data-k="chess"]');await p.screenshot({path:'k2chess.png'});let n=0;
while(await p.evaluate(()=>KV.scr==="chess")&&n<20){n++;const isP=await p.evaluate(()=>!!KV.P);if(isP){const [f,t]=await p.evaluate(()=>KV.P.ok[0]);await p.click(`[data-ksq="${f}"]`);if(n===1)await p.screenshot({path:'k2chesssel.png'});await p.click(`[data-ksq="${t}"]`)}else{const r=await p.evaluate(()=>KV.Q.a);await p.click(`[data-ka="${r}"]`)}await p.click('[data-k="cnext"]')}
console.log('chess',await p.evaluate(()=>[KV.scr,KV.title,S.kids.chess.solved,S.kids.chess.promos,S.kids.chess.lv]));await p.click('[data-k="home"]');
// base
await p.click('[data-k="base"]');await p.click('[data-kpal="wood"]');for(const i of [56,57,58,48])await p.click(`[data-kcell="${i}"]`);await p.click('[data-kpal="dia"]');await p.click('[data-kcell="40"]');await p.click('[data-kpal="erase"]');await p.click('[data-kcell="48"]');
await p.click('[data-kpal="grass"]');await p.click('[data-k="buy"]');console.log('base',await p.evaluate(()=>[S.kids.placed,S.kids.base.filter(Boolean).length,S.kids.inv.grass,S.kids.today.place]));await p.screenshot({path:'k2base.png'});await p.click('[data-k="home"]');
// quests claim
await p.evaluate(()=>{const k=KS();k.today.sub={math:9,eng:9,sci:9,code:9,geo:9};k.today.chess=5;k.today.dia=5;k.today.launch=2;k.today.place=20;k.today.combo=9;render()});
for(const id of await p.evaluate(()=>KS().quest.ids))await p.click(`[data-kq="${id}"]`);console.log('quests',await p.evaluate(()=>[S.kids.questsAll,!!S.kids.badges.quests]));
// grown-up + goal
await p.click('[data-k="grown"]');await p.click('[data-k="goalEdit"]');await p.fill('#kgp','400 Robux');await p.fill('#kgm','120');await p.fill('#kgc','200');await p.click('[data-k="goalSave"]');await p.screenshot({path:'k2grown.png',fullPage:true});
await p.evaluate(()=>{const k=KS();k.secs+=7300;k.chess.st.c+=300;kGoalCheck();kBadges();kUnlocks();KV={scr:"home"};render()});
console.log('goal',await p.evaluate(()=>[Object.keys(S.kids.goal.ms).join(","),S.kids.unl.tesla,S.kids.inv.trophy,!!document.querySelector('.kwin')]));await p.screenshot({path:'k2win.png',fullPage:true});
console.log('overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2));
await p.evaluate(()=>{KV={scr:"grown"};render()});await p.click('[data-k="goalGiven"]');console.log('given',await p.evaluate(()=>[S.kids.goal.hist.length,Object.keys(S.kids.goal.ms).length]));
// kid link
const p2=await ctx.newPage();p2.on('pageerror',e=>errs.push('kid:'+e.message));await p2.goto(U+'?kids');await p2.waitForTimeout(1800);
console.log('kidlink',await p2.evaluate(()=>[view,KLOCK(),getComputedStyle(document.querySelector('.top')).display,!!document.querySelector('[data-k="exit"]'),document.querySelector('link[rel=manifest]').getAttribute('href')]));
await p2.evaluate(()=>{view="start";render()});console.log('forced',await p2.evaluate(()=>view));await p2.screenshot({path:'k2kid.png'});
await p2.goto(U+'?study');await p2.waitForTimeout(1500);console.log('study',await p2.evaluate(()=>[KLOCK(),view]));
console.log('errors',JSON.stringify(errs));await b.close()})();
