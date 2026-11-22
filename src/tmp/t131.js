const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);await p.click('[data-sec="bk"]');await p.click('[data-mode="qbo"]');
 await p.click('[data-qtab="close"]');await p.waitForTimeout(200);
 console.log(await p.evaluate(()=>[qv.tab,document.querySelectorAll('[data-qcl]').length,document.querySelector('#view').innerText.slice(0,300)]));await b.close()})();
