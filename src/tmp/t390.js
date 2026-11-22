const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1400);
const res=await p.evaluate(async()=>{const out={dead:[],n:0,warmOpen:0,mustBlockedByWarm:0,afterOk:0,afterBad:[],otherBlocked:0,otherBad:[]};
 const click=d=>{const fb=document.createElement("button");Object.assign(fb.dataset,d);document.querySelectorAll(".kpassov").forEach(x=>x.remove());const before=JSON.stringify(KV);kidsClick(fb);return before};
 const blocked=d=>{KV={scr:"home"};const fb=document.createElement("button");Object.assign(fb.dataset,d);return !!kGate(Object.assign({},fb.dataset))};
 const k=KS();k.setup=1;k.name="Tomas";k.sound=false;k.guided=true;k.adultUntil=0;k.passUntil=0;k.pass=0;
 for(const X of KROT){out.n++;const id=X[0],d=X[3]==="kcat"?{kcat:X[4]}:{k:X[4]};
  // state: warm-up needed, its first step (lesson) already done, path step 1 = this activity, not done
  k.warm={done:0,sec:0,n:0,les:1,last:[]};const r=kRot();r.done={};r.pathBon=0;r.path=[id].concat(KROT.map(y=>y[0]).filter(y=>y!==id&&y!=="q:warm").slice(0,2));
  const warmBlocked=blocked({kcat:"warm"}),mustBlocked=blocked(d);
  if(warmBlocked&&mustBlocked)out.dead.push(id);if(!warmBlocked)out.warmOpen++;if(mustBlocked)out.mustBlockedByWarm++;
  // after the warm-up is done: step 1 must open, another learning activity must be held back
  k.warm.done=1;if(id!=="jobs"&&blocked(d))out.afterBad.push(id);else out.afterOk++;
  const other=KROT.find(y=>y[0]!==id&&!r.path.slice(0,1).includes(y[0])),od=other[3]==="kcat"?{kcat:other[4]}:{k:other[4]};if(blocked(od))out.otherBlocked++;else out.otherBad.push(id+">"+other[0])}
 return out});
console.log(JSON.stringify(res));
ok(`no deadlock for any of the ${res.n} possible step-1 activities (was: every one that the warm-up also blocks)`,res.dead.length===0);
ok('during the warm-up, the warm-up itself always opens',res.warmOpen===res.n);
ok('after the warm-up, step 1 opens',res.afterBad.length===0);
ok('after the warm-up, the Mission Path still holds back other activities until step 1 is won',res.otherBad.length===0);
// the exact case from the report, through the real screens
await p.evaluate(()=>{const k=KS();k.guided=true;k.adultUntil=0;k.passUntil=0;k.warm={done:0,sec:0,n:0,les:1,last:[]};const r=kRot();r.done={};r.path=["music","q:math","q:science"];persist();KV={scr:"home"};render()});await p.waitForTimeout(300);
await p.evaluate(()=>{const fb=document.createElement("button");fb.dataset.k="music";kidsClick(fb)});await p.waitForTimeout(300);
const a1=await p.evaluate(()=>({scr:KV.scr,ov:(document.querySelector(".kpassov")||{}).innerText||""}));console.log(' tap Music Lab ->',a1.scr,'|',a1.ov.replace(/\s+/g,' ').slice(0,90));
await p.evaluate(()=>{document.querySelectorAll(".kpassov").forEach(x=>x.remove());const fb=document.createElement("button");fb.dataset.kcat="warm";kidsClick(fb)});await p.waitForTimeout(400);
const a2=await p.evaluate(()=>({scr:KV.scr,cat:KV.cat,ov:(document.querySelector(".kpassov")||{}).innerText||"",txt:document.querySelector('#view').innerText.replace(/\s+/g,' ').slice(0,120)}));console.log(' tap Brain Warm-up ->',a2.scr,a2.cat,'| overlay:',a2.ov.replace(/\s+/g,' ').slice(0,60),'|',a2.txt);
ok('Brain Warm-up opens its quiz instead of pointing back to Music Lab',!/Step 1 first/.test(a2.ov)&&a2.scr!=="home");
await p.screenshot({path:'tmp/w_warm.png'});
console.log('errors',errs);await b.close()})();
