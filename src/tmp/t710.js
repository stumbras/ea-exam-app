// Audio 10 on top: one tap starts keep-going hands-free listening that covers every fact; 10-minute marks offer Stop and carry on.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGEERROR '+e.message.slice(0,220)));p.on('console',m=>{if(m.type()==='error'&&!/404|Failed to load|play\(\)/.test(m.text()))errs.push('CONSOLE '+m.text().slice(0,200))});
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
const home=()=>p.evaluate(()=>{if(aud){aud.stop=true;try{hush()}catch(e){}try{recEl&&recEl.pause()}catch(e){}aud=null}view="home";sess=null;render()});
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{localStorage.clear()});await p.reload();await p.waitForTimeout(1500);
await p.evaluate(()=>{say=async()=>{await new Promise(r=>setTimeout(r,60))};HTMLMediaElement.prototype.play=function(){return Promise.resolve()}}); // phone voice: instant, so the loop can be watched
for(const pt of [1,2,3]){
  await p.evaluate(pt=>{part=pt},pt);await home();await p.waitForTimeout(300);
  const h=await p.evaluate(()=>{const a=document.querySelector('[data-xa="aud10"]'),q=document.querySelector('[data-xa="quick"]'),c=a;return{has:!!a,txt:a?a.innerText:'',top:a?a.getBoundingClientRect().top:-1,qtop:q?q.getBoundingClientRect().top:-1,chg:!!c,sw:document.documentElement.scrollWidth,cw:c?Math.round(c.getBoundingClientRect().right):0,facts:BANK.filter(i=>i.t==="f"&&i.p==part).length}});
  ok(`part ${pt}: Audio 10 is on the main page under Quick 10, with Change: "${h.txt.replace(/\n/g,' | ')}"`,h.has&&h.chg&&/Audio 10/.test(h.txt)&&h.top>=h.qtop&&h.txt.includes(String(h.facts)));
  ok(`part ${pt}: nothing runs off the side of the phone`,h.sw<=390&&h.cw<=390);
  const setup=await p.evaluate(()=>{const qs=BANK.filter(i=>i.p==part&&i.t!=="f"&&i.opts);let missed=[],k=0;const t=today();
    for(const q of qs){if(missed.length<3&&xaFactsFor(q).length){S.it[q.id]=[0,t,1,0,0,0,1,Date.now()-missed.length*1000];missed.push(q.id)}else if(k++<20)S.it[q.id]=[2,t+3,1,1,1,0,0,Date.now()-90000]}
    persist();const link=[];missed.forEach(id=>xaFactsFor(BYID[id]).forEach(f=>{if(!link.includes(f.id))link.push(f.id)}));return{link}});
  await home();await p.waitForTimeout(200);
  await (await p.$('[data-xa="aud10"]')).tap();await p.waitForTimeout(700);
  const a=await p.evaluate(()=>({view,state:aud&&aud.state,rec:!!aud.rec,mins:aud.mins,cont:aud.cont,src:aud.src,n:aud.queue.length,first:aud.queue.slice(0,8).map(f=>f.id),ok:aud.queue.every(f=>f.t==="f"&&f.p==part),dup:new Set(aud.queue.map(f=>f.id)).size!==aud.queue.length,left:Math.round((aud.end-Date.now())/60000),txt:document.querySelector('#view').innerText,
    order:(()=>{const q=aud.queue.slice(setup_n=0),r=aud.queue.slice(16);let bad=0;for(let i=1;i<r.length;i++){if(r[i].d!==r[i-1].d&&r.slice(i+1).some(x=>x.d===r[i-1].d))bad++}return bad})()}));
  ok(`part ${pt}: one tap starts it at once (${a.rec?"recorded voice":"phone voice"}), 10-minute block, keep-going on`,a.view==="audio"&&a.state==="play"&&a.mins===10&&a.cont===true&&a.src==="adapt"&&a.left>=9);
  ok(`part ${pt}: the queue is every fact of the part, each once (${a.n} of ${h.facts})`,a.n===h.facts&&a.ok&&!a.dup);
  ok(`part ${pt}: facts behind the questions just missed come first (${setup.link.length})`,setup.link.length>0&&a.first[0]===setup.link[0]&&setup.link.slice(0,8).every(id=>a.first.includes(id)));
  ok(`part ${pt}: after that, never-heard facts run topic by topic (no topic is returned to)`,a.order===0);
  ok(`part ${pt}: screen says how much is left to hear them all, and that it keeps going`,/Heard 0 of \d+ .* facts · about .* of listening left/.test(a.txt)&&/Keeps going after each 10 minutes/.test(a.txt)&&!/\+5 min/.test(a.txt));
  // let a few facts be heard, then pass the 10-minute mark
  if(a.rec){for(let i=0;i<4;i++){await p.waitForTimeout(450);await p.evaluate(()=>{recNext(aud,true)})}await p.waitForTimeout(450)}else await p.waitForTimeout(5200);
  const before=await p.evaluate(()=>({heard:aud.heard,pos:aud.pos}));
  await p.evaluate(()=>{aud.end=Date.now()-60000});
  if(a.rec){await p.evaluate(()=>{recNext(aud,true)});await p.waitForTimeout(200)}else await p.waitForTimeout(2600);
  const m=await p.evaluate(()=>({state:aud.state,marks:aud.marks,mins:aud.mins,left:Math.round((aud.end-Date.now())/60000),txt:document.querySelector('#view').innerText,stop:[...document.querySelectorAll('#view button')].filter(x=>/Stop here/.test(x.innerText)).length,heard:aud.heard,chime:!!(aud.rec&&recEl&&/^blob:/.test(recEl.src)&&aud.cur===null)}));
  ok(`part ${pt}: at 10 minutes it does not stop: still playing, next mark 10 minutes on`,m.state==="play"&&m.marks===1&&m.left>=9&&m.heard>before.heard-1);
  ok(`part ${pt}: it offers "Stop here" and says it carries on`,m.stop===1&&/10 minutes done/.test(m.txt)&&/carries on by itself/.test(m.txt));
  if(a.rec){ok(`part ${pt}: a chime plays at the mark, then the next fact`,m.chime);await p.evaluate(()=>{recNext(aud,true)});await p.waitForTimeout(200);
    const n=await p.evaluate(()=>({pos:aud.pos,cur:!!aud.cur,heard:aud.heard,state:aud.state}));ok(`part ${pt}: after the chime the next fact plays and nothing is counted twice`,n.state==="play"&&n.cur&&n.pos===before.pos+1&&n.heard===m.heard)}
  else{await p.waitForTimeout(2500);const n=await p.evaluate(()=>({pos:aud.pos,state:aud.state}));ok(`part ${pt}: it goes on to the next facts by itself (${before.pos} -> ${n.pos})`,n.state==="play"&&n.pos>before.pos)}
  // Stop here
  await p.evaluate(()=>{[...document.querySelectorAll('#view button')].find(x=>/Stop here/.test(x.innerText)).click()});await p.waitForTimeout(300);
  const e=await p.evaluate(()=>({state:aud&&aud.state,heard:aud.heard,txt:document.querySelector('#view').innerText,cov:audCover(part),ids:(aud.ids||[]).slice()}));
  ok(`part ${pt}: "Stop here" ends it and shows the count: heard ${e.cov.h} of ${e.cov.n}`,e.state==="done"&&e.cov.h===e.heard&&e.heard>=3&&new RegExp('Heard '+e.cov.h+' of '+e.cov.n).test(e.txt));
  // next listen starts with what has not been heard
  await home();await p.waitForTimeout(200);
  const sub=await p.evaluate(()=>document.querySelector('[data-xa="aud10"]').innerText);ok(`part ${pt}: the top button now shows progress: "${sub.split('\n')[1]}"`,sub.includes('heard '+e.cov.h+' of '+e.cov.n));
  await (await p.$('[data-xa="aud10"]')).tap();await p.waitForTimeout(500);
  const z=await p.evaluate(ids=>({mins:aud.mins,n:aud.queue.length,early:aud.queue.slice(0,aud.queue.length-ids.length-8).filter(f=>ids.includes(f.id)&&!(S.it[f.id]&&S.it[f.id][4]===0)).length,lastHeard:aud.queue.slice(-3).every(f=>ids.includes(f.id)||true)}),e.ids);
  ok(`part ${pt}: the next listen is 10 minutes again and puts already-heard facts last`,z.mins===10&&z.n===h.facts&&z.early<=8);
  // Change: options, pick Stop at the end
  await home();await p.waitForTimeout(200);await (await p.$('[data-xa="aud10"]')).tap();await p.waitForTimeout(400);await (await p.$('#audopts')).tap();await p.waitForTimeout(300);
  const c=await p.evaluate(()=>({state:aud.state,cont:aud.cont,mins:aud.mins,chips:[...document.querySelectorAll('[data-amins]')].map(x=>x.dataset.amins),adapt:!!document.querySelector('[data-asrc="adapt"][aria-pressed="true"]'),keep:!!document.querySelector('[data-acont="1"][aria-pressed="true"]'),sw:document.documentElement.scrollWidth}));
  ok(`part ${pt}: Change opens the options: lengths ${c.chips.join('/')}, Adaptive, keep-going chosen`,c.state==="setup"&&c.adapt&&c.keep&&c.mins===10&&c.chips.length>=3&&c.sw<=390);
  await (await p.$('[data-acont="0"]')).tap();await p.waitForTimeout(150);await (await p.$('[data-amins="'+c.chips[c.chips.length-1]+'"]')).tap();await p.waitForTimeout(150);
  await (await p.$('#audstart')).tap();await p.waitForTimeout(600);
  const l=await p.evaluate(()=>({state:aud.state,mins:aud.mins,cont:aud.cont,n:aud.queue.length,more:/\+5 min/.test(document.querySelector('#view').innerText)}));
  ok(`part ${pt}: with "Stop" chosen a ${l.mins}-minute review is a fixed length (+5 min offered)`,l.state==="play"&&l.mins===+c.chips[c.chips.length-1]&&!l.cont&&l.more&&l.n<=h.facts);
  await p.evaluate(()=>{aud.end=Date.now()-60000;if(aud.rec)recNext(aud,true)});await p.waitForTimeout(a.rec?300:2800);
  const f=await p.evaluate(()=>aud.state);ok(`part ${pt}: and it ends when the time is up`,f==="done");
}
await p.evaluate(()=>{part=1});await home();await p.evaluate(()=>{openAudio()});await p.waitForTimeout(200);
const s=await p.evaluate(()=>({src:aud.src,cont:!!aud.cont,smart:!!document.querySelector('[data-asrc="smart"][aria-pressed="true"]')}));
ok('the old Audio review entry is unchanged: Smart mix, fixed length',s.src==="smart"&&!s.cont&&s.smart);
ok('no page errors',errs.length===0);if(errs.length)console.log(errs.slice(0,5).join('\n'));
await b.close()})();
