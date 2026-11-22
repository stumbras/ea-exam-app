const {chromium}=require('playwright');const fs=require('fs');
const mock=fs.readFileSync('t70.js','utf8').match(/const mock=`([\s\S]*?)`;/)[1];
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();p.on('pageerror',e=>console.log('PAGEERR',e.message));p.on('console',m=>console.log('LOG',m.text().slice(0,300)));
 await p.addInitScript(mock);await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
 await p.evaluate(()=>{const o=say;window.say=async function(t){try{return await o(t)}catch(e){console.log('say threw',JSON.stringify(e),e&&e.message,e&&e.stack&&e.stack.slice(0,200));throw e}};openAudio()});
 await p.click('#audstart');await p.waitForTimeout(2500);console.log('spoken',await p.evaluate(()=>window.__spoken.length),await p.evaluate(()=>typeof window.speechSynthesis.getVoices+' '+(window.speechSynthesis.speak.toString().slice(0,40))));
 await b.close()})();
