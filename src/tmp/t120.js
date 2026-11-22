const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);
 console.log('start:',await p.evaluate(()=>[view,[...document.querySelectorAll('.startcard b')].map(x=>x.textContent),document.querySelector('.top h1').textContent]));
 await p.screenshot({path:'bk-start.png'});
 console.log('counts:',await p.evaluate(()=>{const c=d=>BANK.filter(i=>i.p==4&&i.d==d);const ids=BANK.map(i=>i.id);return {dupIds:ids.length-new Set(ids).size,facts:[1,2,3,4,5].map(d=>c(d).filter(i=>i.t==="f").length),qs:[1,2,3,4,5].map(d=>c(d).filter(i=>i.t==="q").length),units:UNITS[4].length,slides:UNITS[4].reduce((a,u)=>a+u.s.length,0),labs:LABS.length,labsteps:LABS.reduce((a,o)=>a+o.steps.length,0),p1:BANK.filter(i=>i.p==1).length}}));
 await p.click('[data-sec="bk"]');await p.waitForTimeout(300);
 console.log('bk home:',await p.evaluate(()=>[part,view,[...document.querySelectorAll('.mode.bkm b')].map(x=>x.textContent).join(','),document.querySelector('.gnum b').textContent,document.documentElement.scrollWidth>innerWidth]));
 await p.screenshot({path:'bk-home.png',fullPage:true});
 // every slide of every lesson renders
 console.log('slides:',await p.evaluate(()=>{const bad=[];UNITS[4].forEach((u,k)=>{les={unit:k,topic:null,idx:0};view="lessons";for(let i=0;i<u.s.length;i++){les.idx=i;try{render();if(!document.querySelector('#slide'))bad.push(k+':'+i);if(document.documentElement.scrollWidth>innerWidth+1)bad.push(k+':'+i+' wide')}catch(e){bad.push(k+':'+i+' '+e.message)}}});les=null;view="home";render();return bad}));
 // every lab: walk all steps giving right answers; check panel and finish
 console.log('labs:',await p.evaluate(()=>{const out=[];for(const o of LABS){labOpen(o);view="labs";try{for(let i=0;i<o.steps.length;i++){render();const st=o.steps[i];if(st.type==="num"){if(typeof st.ans!=="number")throw new Error("ans "+i)}else if(!st.opts||st.opts.length<2||new Set(st.opts).size!==st.opts.length)throw new Error("opts "+i);labAnswer(true,"x",0);if(document.documentElement.scrollWidth>innerWidth+1)out.push(o.t+' wide '+i);document.getElementById('labnext').click()}out.push(o.kind+' '+o.steps.length+' '+(document.querySelector('#view h2')||{}).textContent.slice(0,40))}catch(e){out.push('ERR '+o.t+': '+e.message)}}lab=null;view="home";render();return out}));
 console.log('after labs pct:',await p.evaluate(()=>[bkStats("all").labsDone,Math.round(bkStats("all").pct)]));
 // one lab by hand with a wrong answer
 await p.click('[data-mode="labs"]');await p.waitForTimeout(200);await p.screenshot({path:'bk-labs.png',fullPage:true});
 await p.click('[data-lab]');await p.waitForTimeout(200);await p.click('[data-labopt]');await p.click('#labnext');await p.fill('#labin','44,000');await p.click('#labcheck');await p.waitForTimeout(150);
 console.log('wrong num:',await p.evaluate(()=>document.querySelector('.how').innerText.replace(/\n/g,' ')));
 await p.screenshot({path:'bk-lab-step.png',fullPage:true});
 await p.click('#labnext');await p.fill('#labin','250');await p.keyboard.press('Enter');await p.waitForTimeout(150);await p.screenshot({path:'bk-lab-step2.png',fullPage:true});
 await p.click('#lablist');await p.click('#labhome');
 // modes
 for(const m of ['cards','quiz','mix']){await p.click('[data-mode="'+m+'"]');await p.waitForTimeout(250);console.log(m,await p.evaluate(()=>[view,sess&&sess.queue.length,(document.querySelector('.sesshead h2')||{}).textContent,sess&&sess.queue.every(e=>BYID[e.id].p==4)]));await p.evaluate(()=>{sess=null;view="home";render()})}
 await p.click('[data-mode="quiz"]');await p.waitForTimeout(200);await p.screenshot({path:'bk-quiz.png'});await p.evaluate(()=>{sess=null;view="home";render()});
 await p.click('[data-mode="audio"]');await p.waitForTimeout(300);console.log('audio:',await p.evaluate(()=>[view,aud.rec,!!document.querySelector('[data-arec]'),document.querySelector('#view h2').textContent]));
 await p.click('[data-sec="start"]');await p.waitForTimeout(200);await p.click('[data-sec="ea"]');await p.waitForTimeout(300);
 console.log('ea:',await p.evaluate(()=>[part,view,document.querySelectorAll('.ptabs [data-part]').length,document.querySelector('.top h1').textContent,document.querySelector('.dash h2').textContent]));
 await p.screenshot({path:'ea-home.png'});
 await p.click('[data-part="2"]');await p.click('[data-sec="start"]');await p.click('[data-sec="bk"]');await p.click('[data-sec="start"]');await p.click('[data-sec="ea"]');console.log('returns to part',await p.evaluate(()=>part));
 console.log('errors',errs);await b.close()})();
