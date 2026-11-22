const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
// distractor quality across all generators
console.log(await p.evaluate(()=>{let bad=[],n=0;for(const g of GENS){for(let k=0;k<20;k++){const c=calcMC(g.make());n++;const u=new Set(c.opts);if(c.opts.length!==4||u.size!==4||c.opts[0]!==c.key)bad.push(g.id+":"+c.opts.join("|"))}}return n+" built, bad "+bad.length+" "+bad.slice(0,5).join(" ;; ")}));
console.log(await p.evaluate(()=>["g1-ss1","g2-fica","g4-x"].map(id=>{const g=GENS.find(x=>x.id===id)||GENS[3];const c=calcMC(g.make());return g.id+" => "+c.opts.join(" | ")}).join("\n")));
await p.evaluate(()=>{part=1;startSession("calc",5)});await p.waitForTimeout(300);
await p.click('[data-calc="hint"]');await p.waitForTimeout(150);
await p.screenshot({path:'tmp/calc1.png',fullPage:true});
await p.click('[data-calc="teach"]');await p.waitForTimeout(200);
await p.screenshot({path:'tmp/calc2.png',fullPage:true});
console.log('after teach queue', await p.evaluate(()=>sess.queue.slice(sess.pos,sess.pos+3).map(e=>e.id+(e.like?"*":"")).join(",")));
await p.click('#next');await p.waitForTimeout(200);
console.log('like entry shows example:', await p.evaluate(()=>!!document.querySelector('.calcteach .related')));
await p.screenshot({path:'tmp/calc3.png',fullPage:true});
console.log('errors',JSON.stringify(errs));await b.close()})();
