// Real IRS forms: viewer, Form 1040 explanations, fill-in practice, find the line, links from the text, library.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGEERROR '+e.message.slice(0,220)));p.on('console',m=>{if(m.type()==='error'&&!/404|Failed to load|play\(\)/.test(m.text()))errs.push('CONSOLE '+m.text().slice(0,200))});
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
await p.evaluate(()=>{localStorage.clear()});await p.reload();await p.waitForTimeout(1500);
for(const pt of [1,2,3]){await p.evaluate(pt=>{part=pt;view="home";sess=null;render()},pt);await p.waitForTimeout(300);
  const h=await p.evaluate(()=>({e:!!document.querySelector('.fventry [data-k="f1040"]'),l:!!document.querySelector('.fventry [data-fv="lib"]'),red:Math.round(document.querySelector('.donext').getBoundingClientRect().bottom),sw:document.documentElement.scrollWidth}));
  ok(`part ${pt}: "Form 1040, every box" and "All IRS forms" are on the main page; red button still on the first screen`,h.e&&h.l&&h.red<=844&&h.sw<=392)}
await p.evaluate(()=>{part=4;view="home";render()});await p.waitForTimeout(400);
ok('bookkeeping course main page has the Form 1040 entry',await p.evaluate(()=>!!document.querySelector('#view .fventry [data-k="f1040"]')));
// the 1040
await p.evaluate(()=>{part=1;view="home";render()});await p.waitForTimeout(200);
await (await p.$('.fventry [data-k="f1040"]')).tap();await p.waitForTimeout(1500);
let r=await p.evaluate(()=>{const d=FCACHE.f1040;return{view,n:d&&d.f?d.f.length:0,pages:d&&d.p?d.p.length:0,boxes:document.querySelectorAll('.fvf').length,img:document.querySelector('.fvpage img').naturalWidth,title:document.querySelector('.fvt').innerText,sw:document.documentElement.scrollWidth,tabs:[...document.querySelectorAll('.fvtabs button')].map(x=>x.innerText)}});
ok(`Form 1040 opens: the real page image, ${r.boxes} boxes on page 1 of ${r.n}, ${r.pages} pages`,r.view==="form"&&r.n===199&&r.pages===2&&r.boxes===128&&r.img===1020&&/2025 Form 1040/.test(r.title)&&r.sw<=392&&r.tabs.length===3);
r=await p.evaluate(()=>{const d=FCACHE.f1040;let noIrs=0,noOwn=0,short=0;for(let i=0;i<d.f.length;i++){if(!d.f[i][6])noIrs++;if(!F40X[i])noOwn++;else if(F40X[i].length<25)short++}return{noIrs,noOwn,short,lines:Object.keys(F40L).length,badLine:Object.keys(F40L).filter(l=>!new RegExp('(^|[ .])'+l.replace(/(\d+)([a-z]?)/,'$1$2')+'\\.').test(d.f[F40L[l]][6])&&!['12e','16','28','35a','25a'].includes(l))}});
ok(`every one of the 199 boxes has the IRS wording and a written explanation (missing: ${r.noIrs} / ${r.noOwn})`,r.noIrs===0&&r.noOwn===0);
ok(`the ${r.lines} amount lines point at the right boxes (${r.badLine.join(',')||'all match the IRS line numbers'})`,r.badLine.length===0);
await p.evaluate(()=>{document.querySelector('.fvf[data-i="87"]').click()});await p.waitForTimeout(300);
r=await p.evaluate(()=>{const s=document.getElementById('fvsheet'),bx=document.querySelector('.fvf.on').getBoundingClientRect(),sr=s.getBoundingClientRect();return{txt:s.innerText,pos:getComputedStyle(s).position,vis:bx.bottom<sr.top&&bx.top>50,sw:document.documentElement.scrollWidth}});
ok('tapping line 1a shows "Line 1a", the IRS wording and what it means, in a sheet that does not cover the box',/Line 1a/.test(r.txt)&&/Total amount from Form\(s\) W-2, box 1/.test(r.txt)&&/Wages from box 1 of every Form W-2/.test(r.txt)&&r.pos==="fixed"&&r.vis&&r.sw<=392);
await p.evaluate(()=>{document.querySelector('[data-fv="next"]').click()});await p.waitForTimeout(150);
ok('the › button moves to the next box (1b)',await p.evaluate(()=>/Line 1b/.test(document.getElementById('fvsheet').innerText)));
await p.evaluate(()=>{document.querySelector('[data-fv="pg"][data-n="1"]').click()});await p.waitForTimeout(700);
r=await p.evaluate(()=>({boxes:document.querySelectorAll('.fvf').length,img:document.querySelector('.fvpage img').naturalWidth}));ok(`page 2 shows its ${r.boxes} boxes`,r.boxes===71&&r.img===1020);
const z0=await p.evaluate(()=>document.getElementById('fvpage').getBoundingClientRect().width);await p.evaluate(()=>{document.querySelector('[data-fv="zi"]').click()});await p.waitForTimeout(200);
const z1=await p.evaluate(()=>document.getElementById('fvpage').getBoundingClientRect().width);ok(`zoom in makes the page larger (${Math.round(z0)} -> ${Math.round(z1)} px) and the screen still does not scroll sideways`,z1>z0*1.2&&await p.evaluate(()=>document.documentElement.scrollWidth<=392));
// a link inside the sheet opens another form, and Back returns
await p.evaluate(()=>{document.querySelector('[data-fv="pg"][data-n="0"]').click()});await p.waitForTimeout(400);await p.evaluate(()=>{document.querySelector('.fvf[data-i="87"]').click()});await p.waitForTimeout(400);
r=await p.evaluate(()=>{const l=document.querySelector('#fvsheet .frm');return{has:!!l,k:l&&l.dataset.k,disp:l?getComputedStyle(l).display:''}});ok('form names inside an explanation are links ('+r.k+')',r.has&&/^inline/.test(r.disp));
await p.evaluate(()=>{document.querySelector('#fvsheet .frm').click()});await p.waitForTimeout(1200);
r=await p.evaluate(()=>({k:fv.k,boxes:document.querySelectorAll('.fvf').length,t:document.querySelector('.fvt').innerText}));ok(`the link opens that form (${r.t.replace(/\n/g,' · ')}), ${r.boxes} boxes`,r.k!=="f1040"&&r.boxes>10);
await p.evaluate(()=>{document.querySelector('.fvf').click()});await p.waitForTimeout(250);
r=await p.evaluate(()=>document.getElementById('fvsheet').innerText);ok('a box on another form shows the IRS wording','ON THE FORM'===r.split('\n').find(x=>/ON THE FORM/i.test(x)).toUpperCase()&&r.length>40);
await p.evaluate(()=>{document.querySelector('[data-fv="back"]').click()});await p.waitForTimeout(500);ok('Back returns to Form 1040',await p.evaluate(()=>fv&&fv.k==="f1040"));
// Fill it in
for(const cs of ['c1','c2','c3']){await p.evaluate(cs=>{fv.tab="fill";fv.cs=cs;fv.fill={};fv.res=null;fv.rep=null;fv.sel=-1;fv.pg=0;render()},cs);await p.waitForTimeout(300);
  if(cs==='c1'){await p.evaluate(()=>{document.querySelector('.fvf[data-i="87"]').click()});await p.waitForTimeout(200);await p.fill('#fvin','45,500');await p.evaluate(()=>{document.querySelector('[data-fv="set"]').click()});await p.waitForTimeout(250);
    r=await p.evaluate(()=>({shown:document.querySelector('.fvf[data-i="87"]').innerText,docs:document.querySelectorAll('.fvdoc').length}));ok('Fill it in: the documents are shown and a typed amount appears in the real box ('+r.shown+')',r.shown==="45,500"&&r.docs===3);
    await p.evaluate(()=>{document.querySelector('.fvf[data-i="34"]').click()});await p.waitForTimeout(150);await p.evaluate(()=>{document.querySelector('[data-fv="tick"]').click()});await p.waitForTimeout(200);ok('a checkbox can be ticked',await p.evaluate(()=>fv.fill[34]===1&&document.querySelector('.fvf[data-i="34"]').innerText==="✕"));
    await p.evaluate(()=>{document.querySelector('[data-fv="check"]').click()});await p.waitForTimeout(300);r=await p.evaluate(()=>({rep:fv.rep,txt:(document.querySelector('.fvrep')||{innerText:''}).innerText}));
    ok(`checking a half-done return lists what is missing with the right amounts (${r.rep.ok} of ${r.rep.n})`,r.rep.ok===2&&r.rep.bad>10&&/Line 2b[\s\S]*Blank; it should be \$250/.test(r.txt)&&/1099-INT box 1/.test(r.txt))}
  r=await p.evaluate(cs=>{const c=F40CASES.find(x=>x.id===cs);fv.fill={};c.chk.forEach(i=>fv.fill[i]=1);Object.keys(c.v).forEach(l=>fv.fill[F40L[l]]=String(c.v[l]));fvCheck();const a={ok:fv.rep.ok,n:fv.rep.n,done:S.set.f40[cs]};fv.fill[F40L["25a"]]="999";fv.fill[F40L["4a"]]="5";fvCheck();a.bad=fv.rep.bad;
    const v=c.v,g=k=>v[k]||0;a.math=[g("9")-g("10")===g("11a"),g("11a")===g("11b"),g("12e")+g("13a")+g("13b")===g("14"),Math.max(0,g("11b")-g("14"))===g("15"),g("16")+g("17")===g("18"),g("19")+g("20")===g("21"),Math.max(0,g("18")-g("21"))===g("22"),g("22")+g("23")===g("24"),g("25a")+g("25b")+g("25c")===g("25d"),g("25d")+g("26")+g("32")===g("33"),g("33")>g("24")?g("34")===g("33")-g("24")&&!v["37"]:g("37")===g("24")-g("33")&&!v["34"],g("1z")+g("2b")+g("3b")+g("4b")+g("5b")+g("6b")+g("7a")+g("8")===g("9")];return a},cs);
  ok(`taxpayer ${cs}: the answer key adds up line by line, a fully correct return passes (${r.ok}/${r.n}) and two wrong entries are caught`,r.math.every(Boolean)&&r.ok===r.n&&r.done==="ok"&&r.bad===2)}
r=await p.evaluate(()=>{const mid=(x,st)=>{const m=Math.floor(x/50)*50+25,B=st==="hoh"?[[17000,.10],[64850,.12]]:[[11925,.10],[48475,.12]];let t=0,lo=0;for(const [hi,rt] of B){t+=Math.max(0,Math.min(m,hi)-lo)*rt;lo=hi}return Math.round(t+1e-9)};return[mid(30000,"s"),mid(32375,"hoh"),mid(17139,"s"),Math.round(40000*.9235*.153),Math.round(40000*.9235*.153/2),Math.round(Math.min(40000-2826,37174-15750)*.2)]});
ok('the tax amounts in the three cases match the 2025 tables and formulas ('+r.join(', ')+')',r.join()==="3365,3545,1817,5652,2826,4285");
// Find the line
await p.evaluate(()=>{document.querySelector('[data-fv="tab"][data-t="find"]').click()});await p.waitForTimeout(300);
r=await p.evaluate(()=>{const q=fv.fq,want=q.L[0][1][0];fvFindTap(want);const a={st:q.st,ok:q.ok};document.querySelector('[data-fv="fnext"]').click();const w2=fv.fq.L[1][1];const wrong=[87,99,137,154,179].find(x=>!w2.includes(x));fvFindTap(wrong);a.st2=fv.fq.st;a.marked=fv.res[w2[0]]==="ok"&&fv.res[wrong]==="bad";a.n=q.L.length;return a});
ok('Find the line: a right tap counts, a wrong tap shows the right box',r.st==="ok"&&r.ok===1&&r.st2==="bad"&&r.marked&&r.n===10);
ok('every Find-the-line target is a real box whose IRS text fits',await p.evaluate(()=>F40FIND.every(q=>q[1].every(i=>!!FCACHE.f1040.f[i]))));
// library
await p.evaluate(()=>{formLib()});await p.waitForTimeout(300);
r=await p.evaluate(()=>{const q=document.getElementById('fvq');q.value='941';q.oninput();return{rows:document.querySelectorAll('.fvrow').length,vis:[...document.querySelectorAll('.fvrow')].filter(x=>x.style.display!=="none").map(x=>x.querySelector('b').innerText)}});
ok(`library lists ${r.rows} forms and search works (${r.vis.join(', ')})`,r.rows===Object.keys(await p.evaluate(()=>FORMIDX)).length&&r.rows>=220&&r.vis.includes('Form 941')&&r.vis.length<8);
// every form file loads
r=await p.evaluate(async()=>{let bad=[],fields=0,nolab=0,pages=0;for(const k of Object.keys(FORMIDX)){try{const j=await (await fetch('forms/'+k+'.json')).json();if(!j.p.length||j.p.length!==FORMIDX[k][1])bad.push(k);pages+=j.p.length;fields+=j.f.length;nolab+=j.f.filter(f=>!f[6]).length;const im=await fetch('forms/'+k+'-'+(j.p.length-1)+'.webp');if(!im.ok)bad.push(k+':img')}catch(e){bad.push(k+':'+e.message)}}return{bad,fields,nolab,pages,n:Object.keys(FORMIDX).length}});
ok(`all ${r.n} forms load: ${r.pages} pages, ${r.fields} boxes, ${r.fields-r.nolab} with the IRS wording (${r.bad.join(',')||'none broken'})`,r.bad.length===0&&r.fields>28000&&r.nolab<400);
// links from study text
await p.evaluate(()=>{part=1;view="home";sess=null;render();startSession("qd",10)});await p.waitForTimeout(400);
r=await p.evaluate(async()=>{const it=BANK.find(i=>i.p==1&&i.t!=="f"&&i.opts&&i.opts.length===4&&/Form (8332|4868|1040-X|8862|2848)/.test(JSON.stringify(i))&&!/Form (8332|4868|1040-X|8862|2848)/.test(JSON.stringify(i.opts)));if(!it)return null;sess.queue[sess.pos]=mkEntry(it);sess.phase="ask";render();await new Promise(r=>setTimeout(r,200));
  const cur=sess.queue[sess.pos],V=view4(cur,BYID[cur.id]),w=[...document.querySelectorAll('.opt')].find(x=>+x.dataset.opt!==V.ans);w.click();await new Promise(r=>setTimeout(r,300));const l=document.querySelector('#view .frm');return l?{k:l.dataset.k,t:l.innerText,pos:sess.pos,inOpt:!!l.closest('.opt')}:{none:document.querySelector('#view').innerText.slice(0,300)}});
if(r&&r.none){console.log('  no link in:',r.none);r=null}
ok('in a drill, a form named in the question or explanation is a link'+(r?` ("${r.t}")`:''),!!r&&!r.inOpt);
if(r){const pos=r.pos;await p.evaluate(()=>{document.querySelector('#view .frm').click()});await p.waitForTimeout(900);const a=await p.evaluate(()=>({view,k:fv&&fv.k}));await p.evaluate(()=>{document.querySelector('[data-fv="back"]').click()});await p.waitForTimeout(400);const z=await p.evaluate(()=>({view,pos:sess&&sess.pos,phase:sess&&sess.phase}));
  ok('tapping it opens the form, and Back returns to the same question',a.view==="form"&&a.k===r.k&&z.view==="session"&&z.pos===pos&&z.phase==="shown")}
await p.evaluate(()=>{sess=null;view="home";render();startSession("mock",20)});await p.waitForTimeout(600);
ok('in a mock exam nothing is linked',await p.evaluate(()=>view==="session"&&sess.mode==="mock"&&document.querySelectorAll('#view .frm').length===0));
await p.evaluate(()=>{sess=null;view="lessons";les={unit:null,topic:null,idx:0};render()});await p.waitForTimeout(300);
r=await p.evaluate(async()=>{let n=0,tot=0;for(let k=0;k<UNITS[1].length&&k<8;k++){lesOpen("u",k);await new Promise(r=>setTimeout(r,120));for(let s=0;s<4;s++){tot+=document.querySelectorAll('#view .frm').length;n++;const nx=[...document.querySelectorAll('#view button')].find(x=>/^Next|Next ›|Next$/.test(x.innerText.trim()));if(!nx)break;nx.click();await new Promise(r=>setTimeout(r,120))}}return{n,tot}}).catch(e=>({err:String(e)}));
console.log('  lessons:',JSON.stringify(r));
ok('lesson slides link the forms they mention',r&&r.tot>0);
ok('no page errors',errs.length===0);if(errs.length)console.log([...new Set(errs)].slice(0,6).join('\n'));
await b.close()})();
