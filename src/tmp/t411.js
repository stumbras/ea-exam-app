const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?course');await p.waitForTimeout(1400);
await p.evaluate(()=>{campT("bk");const s=campS();["eq","acct"].forEach(x=>s.st[x]={l:1,ok:1,best:.9,n:1});s.st.dc={l:1};campOpen("bk")});await p.waitForTimeout(300);await p.screenshot({path:'tmp/r_hub.png',fullPage:true});
console.log(await p.evaluate(()=>document.documentElement.scrollHeight));
await p.click('button.cstep.mini[data-i="5"]');await p.waitForTimeout(200);console.log('tap unread step ->',await p.evaluate(()=>cv.scr+':'+cv.step));
await p.evaluate(()=>campOpen("bk"));await p.waitForTimeout(150);await p.click('button.cstep.mini[data-i="0"]');await p.waitForTimeout(200);console.log('tap passed step ->',await p.evaluate(()=>cv.scr+':'+cv.step));
await p.evaluate(()=>{campOpen("qb")});await p.click('.donext');await p.waitForTimeout(100);await p.click('[data-camp="fwd"]');await p.click('[data-camp="fwd"]');await p.click('[data-camp="fwd"]');await p.click('.cnav [data-camp="do"]');await p.waitForTimeout(200);await p.screenshot({path:'tmp/r_q1.png'});
await b.close()})();
