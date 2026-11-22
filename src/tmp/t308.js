const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="T";k.sound=false;k.warm={day:kToday(),sec:250,n:0,ok:0,done:0,les:1,last:[]};persist();kShowStart("warm");render()});await p.waitForTimeout(300);
await p.screenshot({path:'tmp/w3.png'});
const areas=[];for(let i=0;i<14;i++){const st=await p.evaluate(()=>({a:KV.Q&&KV.Q.a,area:KV.Q&&KV.Q.areaN,stage:KV.stage,i:KV.i}));if(st.stage!=="play")break;areas.push(st.area);
 try{await p.waitForSelector(`[data-ka="${st.a}"]:not([disabled])`,{timeout:6000})}catch(_){break}await p.click(`[data-ka="${st.a}"]`);await p.waitForTimeout(400);
 await p.waitForTimeout(300);const nx=await p.$('[data-k="next"]');if(nx)await nx.click();
 for(let t=0;t<12;t++){await p.waitForTimeout(250);const j=await p.evaluate(()=>KV.i+":"+KV.stage);if(j!==st.i+":play")break}}
console.log('areas:',areas.join(" | "));
console.log('warm',await p.evaluate(()=>JSON.stringify(KS().warm)),'stage',await p.evaluate(()=>KV.stage));
await p.evaluate(()=>{KS().warm.sec=Math.max(KS().warm.sec,300);KV.stage="play"});await p.waitForTimeout(1600);
console.log('done?',await p.evaluate(()=>KS().warm.done),'needed',await p.evaluate(()=>kWarmNeeded()),'tix',await p.evaluate(()=>KS().tix));
await p.evaluate(()=>{KV={scr:"learnhub"};render()});await p.waitForTimeout(300);await p.screenshot({path:'tmp/w4.png',fullPage:true});
await p.evaluate(()=>{KV={scr:"home"};render()});await p.waitForTimeout(300);await p.screenshot({path:'tmp/w5.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
