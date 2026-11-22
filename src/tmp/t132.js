const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
 for(const [w,h,dark] of [[390,844,0],[1280,800,0],[390,844,1]]){const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,colorScheme:dark?'dark':'light'});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(w+': '+e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);if(dark)await p.evaluate(()=>{const d=[...document.querySelectorAll('button')].find(x=>/Dark/.test(x.textContent));d&&d.click()});
 await p.click('[data-sec="bk"]');await p.waitForTimeout(150);if(!dark)await p.screenshot({path:`bk-home-${w}.png`,fullPage:true});
 await p.click('[data-mode="taxsim"]');await p.waitForTimeout(150);await p.screenshot({path:`p10-list-${w}-${dark}.png`,fullPage:true});
 let wide=[];
 for(let i=0;i<10;i++){await p.click(`[data-p10="${i}"]`);for(const t of ['intake','docs','steps','key']){await p.click(`[data-p10tab="${t}"]`);await p.waitForTimeout(30);if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))wide.push(i+t);if((i===2&&t==='docs')||(i===9&&t==='key'))await p.screenshot({path:`p10-${i}-${t}-${w}-${dark}.png`,fullPage:true})}
   if(i<3)await p.click('[data-p10done]');await p.click('[data-p10=""]')}
 console.log(w,dark,'p10 wide:',wide,'matched',await p.evaluate(()=>JSON.stringify(TS().p10)),'stats',await p.evaluate(()=>{const a=bkStats("all");return a.labsDone+'/'+a.labs}));
 // every tab of every guided client for overflow
 wide=[];for(const id of ['rowan','nina','haddad']){await p.click(`[data-tcl="${id}"]`);for(const t of ['guide','office','docs','personal','income','deductions','payments','summary','review','efile']){await p.click(`[data-ttab="${t}"]`);await p.waitForTimeout(30);if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))wide.push(id+t)}if(id==='nina')await p.screenshot({path:`tax-guide-${w}-${dark}.png`,fullPage:true});await p.click('[data-tcl=""]')}
 console.log('tax wide:',wide);
 await p.click('[data-texit]');await p.click('[data-mode="qbo"]');wide=[];for(const t of ['home','new','bank','rec','lists','rep','close']){await p.click(`[data-qtab="${t}"]`);await p.waitForTimeout(30);if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))wide.push(t)}console.log('qbo wide:',wide);
 await p.click('[data-qtab="home"]');await p.screenshot({path:`qbo-home-${w}-${dark}.png`,fullPage:true});
 await ctx.close()}
 console.log('errors',errs);await b.close()})();
