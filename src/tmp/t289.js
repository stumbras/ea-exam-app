const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const [u,lab] of [['?study','EA'],['?kids','kids'],['?course','course']]){const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(lab+": "+e.stack.slice(0,300)));
 await p.goto('http://localhost:8765/ea-exam-app/'+u);await p.waitForTimeout(1500);
 const v=await p.evaluate(()=>view);let extra="";
 if(lab==="EA"){await p.evaluate(()=>{part=4;view="home";render()});await p.waitForTimeout(200);extra=await p.evaluate(()=>[...document.querySelectorAll('[data-mode="jelab"],[data-mode="firm"],[data-mode="workout"],.bkl-back')].length+" new buttons");
   await p.click('.bkl-back');await p.waitForTimeout(200);extra+=" → "+await p.evaluate(()=>view);
   await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(200);}
 if(lab==="course"){await p.click('[data-bkl="go"]');await p.waitForTimeout(300);extra="continue → "+await p.evaluate(()=>view);await p.click('.bkback');await p.waitForTimeout(200);extra+=" → back: "+await p.evaluate(()=>view)}
 console.log(lab,'view:',v,extra,'title:',await p.title());await ctx.close()}
console.log('errors',JSON.stringify(errs));await b.close()})();
