const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1000);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=2;view="kids";KV={scr:"home"};render()});await p.waitForTimeout(200);
console.log('path',await p.evaluate(()=>kPath().join(',')+' | '+[...document.querySelectorAll('.kpathb')].length));await p.screenshot({path:'k42home.png',clip:{x:0,y:0,width:390,height:900}});
// poker steps: answer all correctly for steps 0..6
await p.evaluate(()=>{KV={scr:"poker",mode:"home"};render()});
for(let st=0;st<7;st++){await p.evaluate(st=>pk2Click({pk2:"step",pk2s:String(st)}),st);for(let i=0;i<5;i++){await p.evaluate(()=>{const a=KV.q.a;pk2Click({pk2a:String(a)});pk2Click({pk2:"snext"})})}}
console.log('steps',await p.evaluate(()=>JSON.stringify(pk2St().steps)),await p.evaluate(()=>S.kids.tix));
await p.evaluate(()=>{KV={scr:"poker",mode:"home"};render()});await p.screenshot({path:'k42pk.png',fullPage:true});
// table: play 6 hands with simple strategy
await p.evaluate(()=>pk2Click({pk2:"table"}));await p.waitForTimeout(300);
for(let h=0;h<6;h++){for(let t=0;t<40;t++){const s=await p.evaluate(()=>{const T=KV.T;if(T.over)return"over";if(T.cur!==0)return"wait";const me=T.seats[0],call=T.toCall-me.bet;if(T.eq>.6&&Math.random()<.5)pk2Click({pk2:"rhalf"}),pk2Click({pk2:"raise"});else if(call===0)pk2Click({pk2:"check"});else if(T.eq>.35)pk2Click({pk2:"call"});else pk2Click({pk2:"fold"});return"acted"});if(s==="over")break;await p.waitForTimeout(s==="wait"?700:50)}
 const r=await p.evaluate(()=>{const T=KV.T;return [T.hand,T.msg,T.seats.map(s=>s.chips).join('/'),T.seats.reduce((a,s)=>a+s.chips,0)]});console.log('hand',JSON.stringify(r));if(h===1)await p.screenshot({path:'k42table.png'});await p.evaluate(()=>pk2Click({pk2:"deal"}))}
console.log('errors',JSON.stringify(errs));await b.close()})();
