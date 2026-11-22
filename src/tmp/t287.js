const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,400)));
await p.goto('http://localhost:8765/ea-exam-app/?course&name=Cristy');await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{const G4=GENS.filter(g=>g.p==4);let bad=[];for(const g of G4)for(let k=0;k<40;k++){const c=calcMC(g.make());if(c.opts.length!==4||new Set(c.opts).size!==4||!isFinite(c.ans))bad.push(g.id+":"+c.opts.join("|"))}
 return G4.length+" generators; bad "+bad.length+" "+bad.slice(0,3).join(" ;; ")+"\n"+G4.map(g=>{const c=calcMC(g.make());return g.id+" -> "+c.opts.join(" | ")}).join("\n")}));
await p.click('[data-bkl="tool"][data-k="workout"]');await p.waitForTimeout(300);
console.log('session mode',await p.evaluate(()=>sess&&sess.mode+" "+sess.queue.length+" part "+part));
await p.screenshot({path:'tmp/wk1.png',fullPage:true});
console.log('errors',JSON.stringify(errs));await b.close()})();
