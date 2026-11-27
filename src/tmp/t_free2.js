const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
for(const u of ['citizenship-test','drivers-license-practice-test','free-practice-questions']){await p.goto('file:///home/claude/ea-app/pwa/company/'+u+'.html');await p.waitForTimeout(400);await p.screenshot({path:'tmp/tf_'+u+'.jpg',type:'jpeg',quality:70});
 if(u!='free-practice-questions'){await p.locator('#slacct').scrollIntoViewIfNeeded();await p.screenshot({path:'tmp/tf2_'+u+'.jpg',type:'jpeg',quality:70})}}
console.log('errs',errs);await b.close()})()
