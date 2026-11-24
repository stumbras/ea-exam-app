const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(2000);
const r=await p.evaluate(async()=>{view="audio";let applied=false;const o=window.applyUpdate;window.applyUpdate=()=>{applied=true};BUILD_SAVE=BUILD;
 const f=window.fetch;window.fetch=()=>Promise.resolve({ok:true,json:()=>({v:"zzz"})});checkUpdate();await new Promise(r=>setTimeout(r,300));const a1=applied,u1=updateReady;
 view="home";checkUpdate();await new Promise(r=>setTimeout(r,300));window.fetch=f;return {duringAudio:a1,updReadyDuring:u1,afterHome:applied||updateReady==="zzz"}});
console.log(r,errs);await b.close()})();
