// Solving Life apps: separate entries for Series 65 and EDPNA, EA as the plain app, kids renamed (Version 209)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
const U='http://localhost:8765/ea-exam-app/';
await p.goto(U+'?study');await p.waitForTimeout(1500);await p.evaluate(()=>{localStorage.clear()});await p.reload();await p.waitForTimeout(1500);
await p.evaluate(()=>{S.it.keep=[1,0,1,1,1,0,0,0];persist()});
const st=async()=>p.evaluate(()=>({part,view,title:document.title,man:document.querySelector('link[rel="manifest"]').getAttribute('href'),h1:(document.querySelector('.top h1')||{}).textContent,tabs:(document.querySelector('#tabs')||{}).innerHTML||"",kids:document.body.classList.contains('kidsmode')}));
await p.goto(U+'?s65');await p.waitForTimeout(1800);let s=await st();
ok(`?s65 opens Series 65 straight away with its own name and manifest (${s.title}; part ${s.part}; ${s.man})`,s.part===5&&s.view==='home'&&s.title==='Solving Life Series 65 Prep'&&s.man==='manifest-65.webmanifest');
ok('inside Series 65 there is no way out to the other sections',!/data-sec="start"/.test(s.tabs));
await p.goto(U);await p.waitForTimeout(1800);s=await st();
ok('opened later without its link it still opens as Series 65 (home-screen launch)',s.part===5&&s.man==='manifest-65.webmanifest');
await p.goto(U+'?edpna');await p.waitForTimeout(1800);s=await st();
ok(`?edpna opens EDPNA with its own name and manifest (${s.title})`,s.part===6&&s.title==='Solving Life EDPNA Prep'&&s.man==='manifest-edpna.webmanifest');
await p.goto(U+'?study');await p.waitForTimeout(1800);s=await st();
ok(`?study is the Enrolled Agent app again, sections available (${s.h1})`,s.man==='manifest.webmanifest'&&await p.evaluate(()=>!localStorage.getItem("slApp")));
await p.goto(U+'?kids');await p.waitForTimeout(2000);s=await st();
ok(`?kids opens the kids app under its new name (${s.title})`,s.kids&&s.title==='Becoming Genius'&&s.man==='manifest-kids.webmanifest');
await p.goto(U+'?study');await p.waitForTimeout(1800);
ok('saved progress is untouched by switching apps',await p.evaluate(()=>{try{return !!S.it.keep}catch(_){return false}}));
for(const [path,want] of [['65/','s65'],['edpna/','edpna'],['kids/','kids'],['ea/','study']]){await p.goto(U+path);await p.waitForTimeout(2000);const g=await p.evaluate(()=>({sl:localStorage.getItem("slApp")||"",k:localStorage.getItem("kidsLock")==="1"}));const got=g.k?'kids':g.sl||'study';ok(`the short link /${path} opens the ${want} app (${got})`,got===want)}
ok('no page errors',errs.length===0);if(errs.length)console.log(errs.slice(0,3));
await b.close()})();
