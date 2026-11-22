const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
console.log(await p.evaluate(ids=>BANK.filter(i=>ids.includes(i.id)).map(i=>i.id+' | '+(i.f||i.s)+' | '+(i.b||'').slice(0,90)).join('\n'),process.argv.slice(2)));await b.close()})();
