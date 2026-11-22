const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=3;view="kids";kCtStart();render()});await p.waitForTimeout(800);
await p.evaluate(()=>{const m=kCt.M.marks.police;Object.assign(kCt.me,{x:m.x,y:m.y,vx:0,vy:0})});await p.waitForTimeout(1000);
console.log(await p.evaluate(()=>{kCt.bandit.hits=3;const before=kCt.mis&&kCt.mis.id;return before}));await p.waitForTimeout(100);
console.log(await p.evaluate(()=>[kCt.mis&&kCt.mis.id,kCt.bandit&&kCt.bandit.hits,kCt.money,kCt.tip]));
console.log('errors',JSON.stringify(errs));await b.close()})();
