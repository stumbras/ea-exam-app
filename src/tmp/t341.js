const {chromium}=require('playwright');const tag=process.argv[2]||'a';const list=(process.argv[3]||'fly,drive,city,land,genius,tworld').split(',');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.sound=false;k.tix=40;k.xp=900;k.adultUntil=Date.now()+9e6;k.passUntil=Date.now()+9e6;k.guided=false;k.rocket.dest=3;k.fly={lv:2,done:{0:1,1:1},stars:{0:3,1:2},flights:5,pts:120};k.warm={day:kToday(),start:Date.now(),sec:400,n:12,ok:10,done:1,les:1,last:[],p0:0};k.lastSeen=Date.now();persist();KV={scr:"home"};render()});
for(const k of list){await p.evaluate(k=>{KV={scr:"home"};try{kDrv=null;kFly=null;kLnd=null}catch(_){ }render();const b=document.createElement("button");b.dataset.k=k;kidsClick(b)},k);await p.waitForTimeout(500);console.log(k,await p.evaluate(()=>document.documentElement.scrollHeight));await p.screenshot({path:`tmp/b_${tag}_${k}.png`,fullPage:true})}
console.log('errors',errs.slice(0,5));await b.close()})();
