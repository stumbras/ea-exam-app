const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.guided=false;k.lastSeen=Date.now()-3600e3;k.warm=null;persist()});
await p.reload();await p.waitForTimeout(1800);
console.log('warm needed',await p.evaluate(()=>kWarmNeeded()),'card',!!await p.$('.kwarmcard'),'report',!!await p.$('.krepcard'));
await p.screenshot({path:'tmp/w1.png'});
await p.evaluate(()=>{const fb=document.createElement("button");fb.dataset.k="city";kidsClick(fb)});await p.waitForTimeout(300);
console.log('game blocked → overlay',!!await p.$('.kpassov'),'scr',await p.evaluate(()=>KV.scr));
await p.evaluate(()=>document.querySelectorAll('.kpassov').forEach(x=>x.remove()));
await p.click('.kwarmcard');await p.waitForTimeout(400);console.log('lesson open',await p.evaluate(()=>KV.scr+" "+JSON.stringify(KV.les)));
await p.screenshot({path:'tmp/w2.png'});
// pass the lesson by marking done the same way
await p.evaluate(()=>{const [tr,i]=KV.les;kLearnState().done[tr+i]=1;KS().warm.les=1;persist();render()});await p.waitForTimeout(300);
await p.click('.kwarmtop [data-kcat="warm"]');await p.waitForTimeout(300);
console.log('warm quiz',await p.evaluate(()=>KV.scr+" "+KV.cat+" n"+KV.n+" area "+(KV.Q&&KV.Q.areaN)));
await p.screenshot({path:'tmp/w3.png'});
const areas=[];
for(let i=0;i<10;i++){const st=await p.evaluate(()=>({a:KV.Q&&KV.Q.a,area:KV.Q&&KV.Q.areaN,stage:KV.stage}));if(st.stage!=="play")break;areas.push(st.area);
 await p.evaluate(a=>{const btn=[...document.querySelectorAll('#view button')].find(x=>x.dataset.kans==String(a)||x.dataset.ka==String(a)||x.dataset.kopt==String(a));if(btn)btn.click();else kShowAnswer(true)},st.a);await p.waitForTimeout(150);
 await p.evaluate(()=>{const n=[...document.querySelectorAll('#view button')].find(x=>/next|Next|➡/.test(x.innerText)&&x.dataset.k);if(n)n.click()});await p.waitForTimeout(150)}
console.log('areas asked:',areas.join(" | "));
await p.evaluate(()=>{KS().warm.sec=299});await p.waitForTimeout(2500);
console.log('warm state',await p.evaluate(()=>JSON.stringify({n:KS().warm.n,sec:KS().warm.sec,les:KS().warm.les,done:KS().warm.done})),'needed',await p.evaluate(()=>kWarmNeeded()));
await p.evaluate(()=>{KV={scr:"learnhub"};render()});await p.waitForTimeout(300);await p.screenshot({path:'tmp/w4.png',fullPage:true});
await p.evaluate(()=>{KV={scr:"home"};render()});await p.waitForTimeout(300);await p.screenshot({path:'tmp/w5.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
