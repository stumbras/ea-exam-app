const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1})).newPage();
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message.slice(0,160)));p.on('console',m=>{if(m.type()==='error')errs.push('CE '+m.text().slice(0,140))});
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
const chk=async name=>{await p.waitForTimeout(300);const r=await p.evaluate(()=>{const v=document.querySelector('#view'),vw=innerWidth;const over=[];for(const el of v.querySelectorAll('*')){const r=el.getBoundingClientRect();if(r.width>0&&r.right>vw+3){let q=el.parentElement,clip=false;while(q&&q!==document.body){const o=getComputedStyle(q);if(/(auto|scroll|hidden)/.test(o.overflowX)){clip=true;break}q=q.parentElement}if(!clip)over.push((el.className||el.tagName).toString().slice(0,24)+':'+Math.round(r.right))}}
 const und=[...v.querySelectorAll('*')].filter(e=>e.children.length===0&&/undefined|NaN|\[object/.test(e.textContent)).map(e=>e.textContent.slice(0,50));const first=v.querySelector('.donext');return{h:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,over:[...new Set(over)].slice(0,4),und:und.slice(0,3),dn:first?Math.round(first.getBoundingClientRect().top+scrollY):null}});
 console.log(name.padEnd(16),String(r.h).padStart(5),'px','donext@'+r.dn,(r.sw>392?' SCROLLX':'')+(r.over.length?' OVER '+r.over.join(','):'')+(r.und.length?' UNDEF '+JSON.stringify(r.und):''));if(errs.length)console.log('   ERR',errs.splice(0).join(' | '))};
const parts=await p.evaluate(()=>Object.keys(PARTS));
for(const pt of parts){await p.evaluate(pt=>{part=isNaN(+pt)?pt:+pt;view="home";sess=null;render();scrollTo(0,0)},pt);await chk('part '+pt+' home');await p.screenshot({path:`tmp/s_part${pt}.png`})}
// start a session in part 1 and answer one
await p.evaluate(()=>{part=1;view="home";render()});await p.click('.donext');await p.waitForTimeout(400);await chk('p1 session');
const ans=await p.evaluate(()=>{const b=[...document.querySelectorAll('#view button')].filter(x=>/^[A-D]\b/.test(x.innerText.trim()));if(b[0]){b[0].click();return b.length}return 0});await p.waitForTimeout(400);await chk('p1 answered('+ans+')');await p.screenshot({path:'tmp/s_sess.png',fullPage:true});
console.log('remaining',errs);await b.close()})();
