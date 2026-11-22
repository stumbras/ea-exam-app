const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const U='http://localhost:8765/ea-exam-app/';
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto(U);await p.waitForTimeout(1800);await p.click('[data-sec="ea"]').catch(()=>{});
 await p.click('[data-mode="lessons"]');await p.waitForTimeout(200);
 console.log('list:',await p.evaluate(()=>[document.querySelectorAll('[data-lesunit]').length,document.querySelectorAll('[data-lestopic]').length,document.querySelector('#view h3').textContent]));
 await p.screenshot({path:'u-list.png'});
 // render every slide of every unit, check for overflow and errors
 const res=await p.evaluate(()=>{const out=[];let bad=[];UNITS[1].forEach((u,k)=>{les={unit:k,topic:null,idx:0};for(let i=0;i<u.s.length;i++){les.idx=i;try{render()}catch(e){bad.push(k+':'+i+' '+e.message);continue}
   const sl=document.querySelector('#slide');if(!sl){bad.push(k+':'+i+' no slide');continue}
   if(document.documentElement.scrollWidth>innerWidth+1)bad.push(k+':'+i+' page overflow');
   sl.querySelectorAll('.vis *').forEach(el=>{if(el.scrollWidth>el.clientWidth+2&&getComputedStyle(el).overflow==='visible'&&el.children.length===0)bad.push(k+':'+i+' clip '+el.textContent.slice(0,30))})}
   const pool=BANK.filter(i=>i.p==1&&u.re.test((i.f||i.s)+" "+(i.b||"")));out.push((k+1)+'. '+u.t+' | slides '+u.s.length+' | quiz pool q='+pool.filter(i=>i.t==="q").length+' f='+pool.filter(i=>i.t==="f").length)});return {out,bad}});
 console.log(res.out.join('\n'));console.log('bad:',res.bad);
 const shot=async(k,i,name,dark)=>{await p.evaluate(([k,i,dark])=>{document.documentElement.setAttribute('data-theme',dark?'dark':'light');les={unit:k,topic:null,idx:i};view="lessons";render();window.scrollTo(0,0)},[k,i,dark]);await p.waitForTimeout(120);await p.screenshot({path:name,fullPage:true})};
 await shot(0,2,'u-form.png',false);await shot(0,4,'u-cmp.png',false);await shot(0,6,'u-flow.png',false);await shot(0,8,'u-tiers.png',false);await shot(6,1,'u-time.png',true);await shot(6,2,'u-form8949.png',true);await shot(7,5,'u-calc.png',false);await shot(10,4,'u-1a.png',false);
 // navigation: open unit from list, next, finish, progress saved, unit quiz
 await p.evaluate(()=>{document.documentElement.setAttribute('data-theme','light');les={unit:null,topic:null,idx:0};render()});
 await p.click('[data-lesunit="2"]');await p.click('#lesnext');await p.click('#lesnext');
 console.log('nav:',await p.evaluate(()=>[les.unit,les.idx,JSON.stringify(S.set.les)]));
 await p.click('#lesquiz');await p.waitForTimeout(250);
 console.log('unit quiz:',await p.evaluate(()=>[view,sess&&sess.queue.length,(document.querySelector('.sesshead h2')||{}).textContent,sess.queue.slice(0,4).map(e=>(BYID[e.id].f||BYID[e.id].s).slice(0,50))]));
 await p.evaluate(()=>{sess=null;view="home";render()});
 // read aloud text
 console.log('say:',await p.evaluate(()=>{const sl=UNITS[1][0].s[4];return (sayable(sl.h)+". "+(sl.b||[]).map(sayable).join(". ")+(sl.ex?". Example. "+sayable(sl.ex):"")).slice(0,260)}));
 // part 2 lessons list has no unit rows and no misleading note
 await p.click('[data-part="2"]');await p.click('[data-mode="lessons"]');await p.waitForTimeout(150);
 console.log('part 2:',await p.evaluate(()=>[document.querySelectorAll('[data-lesunit]').length,(document.querySelector('.notice')||{}).textContent]));
 console.log('errors',errs);await b.close()})();
