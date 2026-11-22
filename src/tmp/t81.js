const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const U='http://localhost:8765/ea-exam-app/';
 const ctx=await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:2,colorScheme:'light'});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto(U);await p.waitForTimeout(1800);await p.click('[data-sec="ea"]').catch(()=>{});
 console.log('fresh home top:',await p.evaluate(()=>[...document.querySelectorAll('#view > section')].slice(0,3).map(s=>(s.querySelector('h2,h3,b')||{}).textContent).join(' | ')));
 await p.screenshot({path:'home-fresh.png'});
 // a learner who is strong everywhere except domain 6
 await p.evaluate(()=>{const qs=BANK.filter(i=>i.p==1);let k=0;for(const it of qs){if(k++%3)continue;const bad=String(it.d)==="6"||(String(it.d)==="2"&&k%4===0);grade(it,bad?0:2,undefined)}persist();render()});
 await p.waitForTimeout(300);await p.screenshot({path:'home-used.png'});
 const info=await p.evaluate(()=>({weakest:weakestDomain(1),rec:recList(1).slice(0,2).map(r=>r.mode+':'+(r.f||'')+' '+r.t),dash:document.querySelector('.dash').innerText.replace(/\n+/g,' / '),tiles:[...document.querySelectorAll('.modes.tiles .mode')].map(x=>x.querySelector('b').textContent+(x.classList.contains('next')?' [NEXT]':'')).join(' | ')}));
 console.log(JSON.stringify(info,null,1));
 // what is visible without scrolling
 console.log('visible without scroll:',await p.evaluate(()=>[...document.querySelectorAll('.dash, .modes.tiles .mode')].filter(e=>{const r=e.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0}).map(e=>e.classList.contains('dash')?'DASH('+(e.getBoundingClientRect().bottom<innerHeight?'whole':'part')+')':e.querySelector('b').textContent).join(' | ')));
 // smart session
 await p.click('[data-mode="smart"]');await p.click('[data-smart="20"]');await p.waitForTimeout(300);
 console.log('smart 20:',await p.evaluate(()=>{const ids=sess.queue.map(e=>BYID[e.id]||GENS.find(g=>g.id===e.id));const t=today();const c={missed:0,due:0,weakQ:0,otherQ:0,calc:0,newFact:0};for(const i of ids){const r=S.it[i.id];if(i.t==="g")c.calc++;else if(r&&r[4]===0)c.missed++;else if(i.t==="q"&&i.lv>=2)(String(i.d)==="6"||String(i.d)==="2")?c.weakQ++:c.otherQ++;else if(r&&r[1]<=t)c.due++;else if(!r)c.newFact++}return JSON.stringify(c)+' total '+ids.length+' | first tag: '+(document.querySelector('.why')||{}).textContent+' | title: '+document.querySelector('#view h2').textContent}));
 await p.screenshot({path:'smart-card.png'});
 await p.evaluate(()=>{sess=null;view="home";render()});
 // spacing: a fact answered right goes away; a missed one is due today
 console.log('spacing:',await p.evaluate(()=>{const t=today();const f=BANK.filter(i=>i.p==1&&i.t==="f"&&!S.it[i.id]);grade(f[0],2);grade(f[1],0);const a=S.it[f[0].id],m=S.it[f[1].id];grade(f[0],2);const a2=S.it[f[0].id].slice();return `right once: box ${a[0]}→ due in ${a[1]-t}d | missed: box ${m[0]} due in ${m[1]-t}d | right again (early): box ${a2[0]} due in ${a2[1]-t}d`}));
 // theme switch
 const before=await p.evaluate(()=>getComputedStyle(document.body).color);await p.click('#themebtn');await p.waitForTimeout(150);
 console.log('theme: attr',await p.evaluate(()=>document.documentElement.getAttribute('data-theme')),'| text colour changed',before!==await p.evaluate(()=>getComputedStyle(document.body).color),'| button says',await p.evaluate(()=>document.getElementById('themebtn').textContent));
 await p.screenshot({path:'home-dark.png'});await p.reload();await p.waitForTimeout(1200);await p.click('[data-sec="ea"]').catch(()=>{});console.log('theme kept after reload:',await p.evaluate(()=>document.documentElement.getAttribute('data-theme')),'| overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 console.log('errors',errs);await b.close()})();
