const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);await p.evaluate(()=>{try{localStorage.setItem("warnHide","1")}catch(_){};warnHide=true;part=+process_part;view="home";render()}).catch(()=>{});
await p.evaluate(()=>{warnHide=true;part=1;view="home";render()});await p.screenshot({path:'h2.png',fullPage:true});await b.close()})();
