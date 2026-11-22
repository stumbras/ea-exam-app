const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ctx=await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:2,hasTouch:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1800);
 await p.click('[data-mode="lessons"]');await p.waitForTimeout(200);
 console.log('topics:',await p.evaluate(()=>[...document.querySelectorAll('.topicrow')].map(x=>x.innerText.replace(/\n+/g,' · ')).slice(0,4).join(' || ')),'| count',await p.evaluate(()=>document.querySelectorAll('.topicrow').length));
 await p.screenshot({path:'les-topics.png'});
 await p.click('[data-lestopic="5"]');await p.waitForTimeout(200);
 console.log('slide 1:',await p.evaluate(()=>document.getElementById('slide').innerText.replace(/\n+/g,' / ').slice(0,260)));
 await p.screenshot({path:'les-slide.png',fullPage:true});
 await p.click('#lesnext');await p.click('#lesnext');await p.waitForTimeout(150);console.log('after 2x next:',await p.evaluate(()=>document.querySelector('.num').textContent));
 await p.click('#lesprev');console.log('after prev:',await p.evaluate(()=>document.querySelector('.num').textContent));
 await p.click('#lestopics');await p.waitForTimeout(150);console.log('resume label:',await p.evaluate(()=>document.querySelector('[data-lestopic="5"] small').textContent));
 await p.click('[data-lestopic="5"]');console.log('resumed at:',await p.evaluate(()=>document.querySelector('.num').textContent));
 await p.click('#lesquiz');await p.waitForTimeout(250);console.log('quiz:',await p.evaluate(()=>view+' '+sess.mode+' '+sess.queue.length+' items, all in topic: '+sess.queue.every(e=>e.learn||TOPIC_OF[e.id]===5)));
 // every slide in every part renders
 console.log(await p.evaluate(()=>{sess=null;let n=0,empty=0,noHow=0;for(const pt of [1,2,3]){part=pt;view="lessons";for(let k=0;k<TOPICS[pt].length;k++){const d=lesDeck(k);for(let i=0;i<d.length;i++){les={topic:k,idx:i};renderLessons();n++;if(!document.querySelector('#slide .front').textContent)empty++;if(!document.querySelector('#slide .how'))noHow++}}}part=1;les=null;view="home";render();return n+' slides rendered, empty '+empty+', without how-it-works '+noHow}));
 console.log('overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'errors',errs);await b.close()})();
