const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);await p.evaluate(()=>{if(typeof OPEN!=="undefined")OPEN.moremodes=true;if(typeof render==="function")render()});await p.screenshot({path:'x-start.png',fullPage:true});
 console.log('bank',await p.evaluate(()=>[5,6].map(q=>[BANK.filter(i=>i.p==q&&i.t==="f").length,BANK.filter(i=>i.p==q&&i.t==="q").length,new Set(BANK.filter(i=>i.p==q).map(i=>i.id)).size])));
 console.log('dup answers',await p.evaluate(()=>BANK.filter(i=>i.p>=5&&i.t==="q").filter(i=>{const o=[i.a].concat(i.w||i.o||[]);return new Set(o).size<4}).map(i=>i.id)));
 for(const sec of ['s65','edpna']){await p.click(`[data-sec="${sec}"]`);await p.waitForTimeout(300);
  console.log(sec,await p.evaluate(()=>[document.querySelector('.top h1').textContent,document.querySelector('.dash h2').textContent,!!document.querySelector('[data-mode="calc"]'),document.documentElement.scrollWidth>innerWidth+1,/About the/.test(document.querySelector('#view').innerText)]));
  await p.screenshot({path:`x-${sec}-home.png`,fullPage:true});
  for(const m of ['cards','medium','easy','mix']){const t=await p.$(`#view [data-mode="${m}"]`);if(!t){console.log('no tile',m);continue}await t.click();await p.waitForTimeout(250);
   console.log(' ',m,await p.evaluate(()=>[view,document.querySelector('#view').innerText.replace(/\n+/g,' | ').slice(0,110)]));
   if(m==='medium'&&sec==='s65')await p.screenshot({path:'x-s65-q.png',fullPage:true});
   await p.evaluate(()=>{view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()})}
  // mock
  await p.click('#view [data-mode="mock"]');await p.waitForTimeout(150);console.log('  mock sizes',await p.evaluate(()=>[...document.querySelectorAll('[data-mock]')].map(x=>x.textContent).join(' ; ')));
  await p.click('[data-mock="10"]');await p.waitForTimeout(300);console.log('  mock',await p.evaluate(()=>[view,document.querySelector('#view').innerText.replace(/\n+/g,' | ').slice(0,90)]));
  await p.evaluate(()=>{view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()});
  await p.click('#view [data-mode="lessons"]');await p.waitForTimeout(200);console.log('  slides',await p.evaluate(()=>document.querySelector('#view').innerText.replace(/\n+/g,' | ').slice(0,140)));
  await p.evaluate(()=>{view="home";if(typeof OPEN!=="undefined")OPEN.moremodes=true;render()});await p.click('[data-sec="start"]');await p.waitForTimeout(150)}
 await p.click('[data-sec="ea"]');await p.waitForTimeout(200);console.log('ea',await p.evaluate(()=>[part,document.querySelector('.top h1').textContent,document.querySelectorAll('.ptabs button').length]));
 console.log('errors',errs);await b.close()})();
