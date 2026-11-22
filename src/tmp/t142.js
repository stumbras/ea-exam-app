const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);
 console.log(await p.evaluate(()=>[5,6].map(q=>({f:BANK.filter(i=>i.p==q&&i.t==="f").length,q:BANK.filter(i=>i.p==q&&i.t==="q").length,g:GENS.filter(g=>g.p==q).length}))));
 // run every generator 300 times: check numbers are finite and the key matches the answer
 console.log(await p.evaluate(()=>{const bad=[];for(const g of GENS.filter(g=>g.p>=5))for(let k=0;k<300;k++){const o=g.make();if(!isFinite(o.ans)||/NaN|undefined|Infinity/.test(o.stem+o.key+o.steps))bad.push(g.id+': '+o.stem.slice(0,60)+' | '+o.key);}return bad.slice(0,8).concat(['bad='+bad.length])}));
 console.log(await p.evaluate(()=>GENS.filter(g=>g.p>=5).map(g=>{const o=g.make();return g.id+' → '+o.key}).join(' ; ')));
 await p.click('[data-sec="s65"]');await p.waitForTimeout(200);const c=await p.$('#view [data-mode="calc"]');console.log('calc tile',!!c, await p.evaluate(()=>{const t=document.querySelector('#view [data-mode="calc"] p');return t?t.textContent.slice(0,80):''}));
 await c.click();await p.waitForTimeout(250);await p.screenshot({path:'x-calc.png',fullPage:true});
 const st=await p.evaluate(()=>[view,document.querySelector('#view').innerText.replace(/\n+/g,' | ').slice(0,200)]);console.log(st);
 console.log('errors',errs);await b.close()})();
