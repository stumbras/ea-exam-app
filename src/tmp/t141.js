const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);await p.click('[data-sec="s65"]');await p.waitForTimeout(200);
 console.log(await p.evaluate(()=>{let r;try{r=examHtml("").length+' '+/About the/.test(examHtml(""))}catch(e){r='ERR '+e.message}return [r,BANK.filter(i=>i.p>=5&&i.t==="q").filter(i=>new Set(i.opts).size<4).map(i=>i.s.slice(0,40)),/About the/.test(document.querySelector('#view').innerHTML)]}));await b.close()})();
