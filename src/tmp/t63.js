const pw=require('playwright');
(async()=>{for(const name of ['webkit','firefox']){try{const b=await pw[name].launch();const ctx=await b.newContext({viewport:{width:430,height:900}});const p=await ctx.newPage();
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(4000);
 await p.evaluate(()=>{for(let k=0;k<6;k++)grade(BANK[k],2);persist()});
 await ctx.setOffline(true);await p.reload();await p.waitForTimeout(2500);
 console.log(name,'OFFLINE |',await p.evaluate(()=>document.querySelector('#view .ledger').innerText.slice(0,120)),'| items',await p.evaluate(()=>Object.keys(S.it).length));await b.close()}catch(e){console.log(name,'not available:',String(e.message).split('\n')[0].slice(0,120))}}})();
