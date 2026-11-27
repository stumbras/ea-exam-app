const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
for(const u of ['citizenship-test','drivers-license-practice-test','free-practice-questions']){await p.goto('file:///home/claude/ea-app/pwa/company/'+u+'.html');await p.waitForTimeout(500);console.log(u,await p.evaluate(()=>document.getElementById('slacct').innerText.slice(0,80).replace(/\n/g,' | ')))}
await p.locator('#slacct').scrollIntoViewIfNeeded();await p.screenshot({path:'tmp/t_free.png'});
await p.goto('file:///home/claude/ea-app/pwa/admin/index.html');await p.waitForTimeout(500);console.log('admin errs',errs.length,errs.slice(0,3));await b.close()})()
