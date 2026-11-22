const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push('CE '+m.text().slice(0,160))});
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const probe=()=>p.evaluate(()=>{const v=document.querySelector('#view'),vw=innerWidth;const over=[];for(const el of v.querySelectorAll('*')){const r=el.getBoundingClientRect();if(r.width>0&&r.right>vw+3){let q=el.parentElement,clip=false;while(q&&q!==document.body){if(/(auto|scroll|hidden)/.test(getComputedStyle(q).overflowX)){clip=true;break}q=q.parentElement}if(!clip)over.push((el.className||el.tagName).toString().slice(0,20))}}
 const und=[...v.querySelectorAll('*')].filter(e=>e.children.length===0&&/\bundefined\b|\bNaN\b|\[object/.test(e.textContent)).map(e=>e.textContent.slice(0,60));
 const small=[...v.querySelectorAll('button,a')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&(r.height<30||r.width<30)}).length;
 const tiny=[...v.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim().length>12&&parseFloat(getComputedStyle(e).fontSize)<12).length;
 return{view,h:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,over:[...new Set(over)].slice(0,3),und:und.slice(0,2),btn:v.querySelectorAll('button').length,small,tiny,back:!!document.querySelector('.bkback')}});
const parts=await p.evaluate(()=>Object.keys(PARTS));const seenLabels={};
for(const pt of parts){await p.evaluate(pt=>{part=isNaN(+pt)?pt:+pt;sess=null;view="home";render();scrollTo(0,0)},pt);await p.waitForTimeout(250);
 const home=await probe();const btns=await p.evaluate(()=>[...document.querySelectorAll('#view button')].map((x,i)=>({i,ds:Object.assign({},x.dataset),id:x.id,t:x.innerText.replace(/\s+/g,' ').slice(0,34),dis:x.disabled})).filter(x=>!x.dis));
 console.log(`\n== PART ${pt} home h=${home.h} buttons=${home.btn} small=${home.small} tinytext=${home.tiny}${home.sw>392?' SCROLLX':''}${home.over.length?' OVER '+home.over:''}${home.und.length?' UNDEF '+JSON.stringify(home.und):''}`);
 const tried={};let n=0;
 for(const bt of btns){const key=JSON.stringify(bt.ds)+bt.id;const sig=Object.keys(bt.ds).sort().join(',')+':'+(bt.ds.qd||bt.ds.mode||bt.ds.go||bt.ds.plus||bt.ds.sim||bt.id||'');if(tried[sig])continue;tried[sig]=1;if(/ttsall|reset|import|export|wipe|del|aikey/.test(key+bt.t.toLowerCase()))continue;
  await p.evaluate(pt=>{part=isNaN(+pt)?pt:+pt;sess=null;try{tv.dr=null}catch(e){}view="home";render()},pt);await p.waitForTimeout(60);
  const okc=await p.evaluate(i=>{const x=[...document.querySelectorAll('#view button')][i];if(!x)return false;x.click();return true},bt.i);await p.waitForTimeout(220);
  const r=await probe();n++;const flag=(r.sw>392?' SCROLLX':'')+(r.over.length?' OVER '+r.over:'')+(r.und.length?' UNDEF '+JSON.stringify(r.und):'')+(r.view!=="home"&&!r.back?' NOBACK':'')+(r.h>4500?' LONG':'');
  if(flag||errs.length)console.log(`  [${bt.t}] ${sig} -> ${r.view} h=${r.h}${flag}${errs.length?' ERR '+errs.splice(0).join(' | '):''}`);
  await p.evaluate(()=>{const g=document.getElementById('glpop');if(g)g.remove();const c=document.getElementById('certpop');if(c)c.remove();document.body.classList.remove('glopen')})}
 console.log(`  tried ${n} distinct buttons`)}
console.log('\nleftover errors',errs);await b.close()})();
