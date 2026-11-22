const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1400);
const r=await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.sound=false;k.guided=true;k.adultUntil=0;k.passUntil=0;const out=[];let und=0,n=0;
 for(let t=0;t<60;t++){k.warm={done:0,sec:0,n:0,les:1,last:[]};KV={scr:"home"};const fb=document.createElement("button");fb.dataset.kcat="warm";kidsClick(fb);n++;const tx=document.querySelector('#view').innerText;if(/undefined|NaN/.test(tx)){und++;if(out.length<4)out.push(tx.replace(/\s+/g,' ').slice(60,230))}}
 // jobs as step 1 after warm-up
 k.warm={done:1};const rr=kRot();rr.done={};rr.path=["jobs","q:math","q:science"];KV={scr:"home"};const f2=document.createElement("button");f2.dataset.k="jobs";kidsClick(f2);return{n,und,out,jobsScr:KV.scr,ov:!!document.querySelector(".kpassov")}});
console.log(JSON.stringify(r,null,1));await b.close()})();
