const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:860},isMobile:true,hasTouch:true,serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
const U='http://localhost:8765/ea-exam-app/?'+(process.argv[2]||'study');
await p.goto(U,{waitUntil:'load'});await p.waitForTimeout(2500);
const st=()=>p.evaluate(()=>JSON.stringify({view,part,pos:sess&&sess.pos,done:sess&&sess.done,n:sess&&sess.queue&&sess.queue.length,title:sess&&sess.title,dx:!!(sess&&sess.xp&&sess.xp.k==="dx"),saved:(()=>{try{const v=JSON.parse(localStorage.getItem("slDx"+part)||"null");return v?{pos:v.pos,done:v.done,n:v.ids.length}:null}catch(_){return"err"}})()}));
await p.evaluate(()=>{if(view==="start"){const b=document.querySelector('.startcard[data-sec="p1"],.startcard');}});
await p.evaluate(()=>{xpDxStart()});await p.waitForTimeout(500);console.log('started',await st());
const seen=[];
const answer=async(k)=>{for(let i=0;i<k;i++){seen.push(await p.evaluate(()=>sess.queue[sess.pos].id));await p.evaluate(()=>{record(Math.random()<0.6,true)});await p.waitForTimeout(60);await p.evaluate(()=>{sess.pos++;sess.phase="ask";sess.sel=null})}};
await answer(9);console.log('after 9',await st());
await p.evaluate(()=>{finish()});await p.waitForTimeout(500);console.log('quit ->',await p.evaluate(()=>(document.querySelector('.dxr')||{}).innerText||'no dxr'),'| result saved:',await p.evaluate(()=>!!xpDx()));
await p.reload({waitUntil:'load'});await p.waitForTimeout(2500);console.log('home button:',await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/diagnostic/i.test(x.textContent));return b?b.textContent.trim():'none'}),'| next:',await p.evaluate(()=>{try{return xpNext().t}catch(e){return 'err '+e.message}}));
await p.evaluate(()=>{xpDxStart()});await p.waitForTimeout(500);console.log('resumed',await st());
const nextId=await p.evaluate(()=>sess.queue[sess.pos].id);console.log('next question already seen?',seen.includes(nextId));
await answer(15);console.log('after all',await st());await p.evaluate(()=>{finish()});await p.waitForTimeout(500);
console.log('finished ->',(await p.evaluate(()=>(document.querySelector('.dxr')||{}).innerText||'no dxr')).slice(0,60).replace(/\n/g,' '),'| result saved:',await p.evaluate(()=>!!xpDx()),'| snapshot left:',await p.evaluate(()=>localStorage.getItem("slDx"+part)!==null),'| repeats:',seen.length-new Set(seen).size);
console.log('errs',JSON.stringify(errs));await b.close()})()
