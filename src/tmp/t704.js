const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:375,height:667},hasTouch:true,isMobile:true});const p=await ctx.newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{part=1;view="home";render();document.querySelector('.xaquick').click()});await p.waitForTimeout(300);
console.log(JSON.stringify(await p.evaluate(()=>{const out=[];const walk=(el,d)=>{if(d>3)return;[...el.children].forEach(c=>{const r=c.getBoundingClientRect();if(r.height>0)out.push(" ".repeat(d)+c.tagName.toLowerCase()+(c.id?"#"+c.id:"")+(c.className&&typeof c.className==="string"?"."+c.className.split(" ").join("."):"")+" y"+Math.round(r.top)+" h"+Math.round(r.height));if(r.height>40)walk(c,d+1)})};walk(document.body,0);return out.slice(0,40)}),null,1));
await b.close()})();
