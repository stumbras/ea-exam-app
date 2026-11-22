const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
const K=async o=>{await p.evaluate(o=>{const b=document.createElement("button");Object.assign(b.dataset,o);kidsClick(b)},o);await p.waitForTimeout(300)};
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.sound=false;k.tix=5;k.warm={day:kToday(),start:Date.now(),sec:400,n:12,ok:10,done:1,les:1,last:[],p0:0};k.lastSeen=Date.now();k.guided=false;persist();KV={scr:"home"};render()});
await p.screenshot({path:'tmp/k1.png',fullPage:true});
// fly with access check
await K({k:"fly"});console.log('fly gate',await p.evaluate(()=>!!KV.logQ));let a=await p.evaluate(()=>KV.logQ&&KV.logQ.Q.a);if(a!=null){await K({klog:String(a)});await p.waitForTimeout(600)}console.log('scr',await p.evaluate(()=>KV.scr));
await K({k:"home"});await K({k:"drive"});a=await p.evaluate(()=>KV.logQ&&KV.logQ.Q.a);if(a!=null){await K({klog:String(a)});await p.waitForTimeout(600)}console.log('drive scr',await p.evaluate(()=>KV.scr+' pick '+KV.pick));
await K({k:"fly"});console.log('fly 2nd time gate?',await p.evaluate(()=>!!KV.logQ),await p.evaluate(()=>KV.scr));
// city buildings
await p.evaluate(()=>{KS().logged={city:(KS().warm.start)};KV={scr:"home"};render()});await K({k:"city"});await p.waitForTimeout(400);
const info=await p.evaluate(()=>{try{const D=kCt;const keys=Object.keys(D||{});const arr=(D&&(D.blds||D.B||D.bs||D.builds))||null;return JSON.stringify({keys:keys.slice(0,40),has:!!arr})}catch(e){return 'err '+e.message}});console.log(info);
console.log('errors',errs.slice(0,6));await b.close()})();
