const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=2;view="kids";KV={scr:"home"};render()});
console.log('win gen',await p.evaluate(()=>{let ok=0;for(let i=0;i<50;i++)if(mjWin(mjGenWin(),0))ok++;return ok}));
console.log('steps',await p.evaluate(()=>{const r=[];for(let st=0;st<6;st++){let ok=0;for(let i=0;i<20;i++){const Q=mjFix(mjQ(st));if(Q&&Q.o&&Q.o[Q.a])ok++}r.push(st+':'+ok)}return r.join(' ')}));
await p.click('[data-k="mj"]');await p.waitForTimeout(200);
for(let st=0;st<6;st++){await p.evaluate(st=>mjClick({mj:"step",mjs:String(st)}),st);for(let i=0;i<5;i++)await p.evaluate(()=>{mjClick({mja:String(KV.q.a)});mjClick({mj:"snext"})})}
console.log('mj steps',await p.evaluate(()=>JSON.stringify(mjSt().steps)));
await p.evaluate(()=>mjClick({mj:"game"}));await p.waitForTimeout(300);await p.screenshot({path:'k43mj.png'});
let rounds=0;for(let t=0;t<260&&rounds<2;t++){const s=await p.evaluate(()=>{const G=KV.G;if(G.over)return"over";if(G.claim){if(G.claim.win)mjClick({mj:"cwin"});else mjClick({mj:"cpass"});return"claim"}if(G.cur===0&&G.drawn){if(G.canTsumo){mjClick({mj:"tsumo"});return"ts"}const i=G.pl[0].hand.indexOf(mjBestDiscard(G.pl[0].hand));mjClick({mjd:String(i)});return"disc"}return"wait"});
 if(s==="over"){rounds++;console.log('round',await p.evaluate(()=>[KV.G.round,JSON.stringify(KV.G.res),KV.G.pl.map(p=>p.score).join('/'),KV.G.wall.length]));if(rounds===1)await p.screenshot({path:'k43mjend.png'});await p.evaluate(()=>mjClick({mj:"next"}))}
 await p.waitForTimeout(s==="wait"?300:30)}
console.log('errors',JSON.stringify(errs));await b.close()})();
