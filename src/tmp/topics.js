const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>[1,2,3].map(pt=>'P'+pt+': '+TOPICS[pt].map((t,k)=>t[0]+' '+BANK.filter(i=>i.p==pt&&i.t==='f'&&TOPIC_OF[i.id]===k).length).join(' | ')).join('\n')));await b.close()})();
