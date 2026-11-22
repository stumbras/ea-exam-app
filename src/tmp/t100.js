const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);await p.click('[data-sec="ea"]').catch(()=>{});
 // capture what the read-aloud button would say, for one slide of each drawing kind
 await p.evaluate(()=>{window.__said=[];say=function(t){window.__said.push(t);return Promise.resolve()};unlockSpeech=function(){};hush=function(){}});
 for(const [k,i] of [[0,2],[0,4],[0,6],[0,8],[6,1],[7,5],[3,1]]){await p.evaluate(([k,i])=>{les={unit:k,topic:null,idx:i};view="lessons";render()},[k,i]);await p.click('#lessay');await p.waitForTimeout(300)}
 const said=await p.evaluate(()=>window.__said);said.forEach(t=>console.log('-',t.slice(0,330)));
 console.log('count',said.length,'double periods',said.filter(t=>/\.\s*\./.test(t)).length,'errors',errs);await b.close()})();
