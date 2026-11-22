const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await (await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:2})).newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1800);
 console.log(await p.evaluate(()=>{const ids=BANK.map(i=>i.id);const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);const o={};for(const i of BANK){const k='P'+i.p+(i.t==='f'?' facts':' q lv'+i.lv);o[k]=(o[k]||0)+1}const badOpt=BANK.filter(i=>i.t==='q'&&new Set(i.opts).size!==i.opts.length).map(i=>i.id);return JSON.stringify({total:BANK.length,dupIds:dup,badOpt,counts:o})}));
 await p.click('[data-mode="easy"]');await p.waitForTimeout(300);
 const seen=[];for(let k=0;k<8;k++){const info=await p.evaluate(()=>{const cur=sess.queue[sess.pos];if(!cur)return null;if(cur.learn)return{learn:cur.learn.length};const it=BYID[cur.id];return{t:it.t,lv:it.lv,typed:!!document.getElementById('typed'),stem:(document.querySelector('.stem,.front')||{}).textContent.slice(0,70),lab:document.querySelector('.meta').textContent}});if(!info)break;seen.push(info);
   if(info.learn){await p.evaluate(()=>{const b=[...document.querySelectorAll('#view button')].find(x=>/quiz|ready|start|continue|next/i.test(x.textContent));b&&b.click()})}
   else{await p.evaluate(()=>{const o=document.querySelector('[data-opt]');o&&o.click()});await p.waitForTimeout(80);await p.evaluate(()=>{const c=document.querySelector('[data-conf]');c&&c.click()});await p.waitForTimeout(80);if(k===0){await p.screenshot({path:'easy-q.png',fullPage:true})}await p.evaluate(()=>{const n=document.getElementById('next')||[...document.querySelectorAll('#view button')].find(x=>/^Next/.test(x.textContent));n&&n.click()})}
   await p.waitForTimeout(120)}
 console.log(JSON.stringify(seen,null,0));
 console.log('typed step in simple mode for a box-4 fact:',await p.evaluate(()=>{const f=BANK.find(i=>i.t==='f'&&i.p==1);S.it[f.id]=[4,today(),5,5,1,0];const a=genFact(f).kind;S.set.simple=false;const b2=genFact(f).kind;S.set.simple=true;return a+' (simple) vs '+b2+' (with typing)'}));
 console.log('errors',errs);await b.close()})();
