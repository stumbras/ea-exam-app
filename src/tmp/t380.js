const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?course');await p.waitForTimeout(1500);
// ---------- data validation ----------
const v=await p.evaluate(()=>{const bad=[];let n=0,sl=0;const T={A:1,L:1,E:1,R:1,X:1};
 const chkJe=(id,lines,pool)=>{let d=0,c=0;lines.forEach(l=>{if(l[0]==="D")d+=campCents(l[2]);else if(l[0]==="C")c+=campCents(l[2]);else bad.push(id+" side");if(!CAMPACC[l[1]])bad.push(id+" unknown account "+l[1])});if(d!==c)bad.push(id+" unbalanced "+d+" vs "+c);(pool||[]).forEach(a=>{if(!CAMPACC[a])bad.push(id+" unknown pool account "+a);if(lines.some(l=>l[1]===a))bad.push(id+" pool repeats a line account "+a)});if(new Set(lines.map(l=>l[1])).size!==lines.length)bad.push(id+" same account twice")};
 CAMP.forEach(s=>{sl+=s.slides.length;if(s.slides.length<4)bad.push(s.id+" few slides");s.ex.forEach((x,k)=>{n++;const id=s.id+"-"+k;
  if(x[0]==="eq"){if(x[2].length!==3||x[2].some(v=>!["+","-","0"].includes(v)))bad.push(id);const m={"+":1,"-":-1,"0":0};/* sign check: dA = dL + dE in direction when determinable */const a=m[x[2][0]],l=m[x[2][1]],e=m[x[2][2]];if(l+e!==0&&Math.sign(l+e)!==a&&!(l+e===0))bad.push(id+" equation direction");if(l+e===0&&a!==0&&!(l!==0))bad.push(id+" equation direction2")}
  else if(x[0]==="sort"){if(!T[x[2]])bad.push(id);const t=CAMPACC[x[1]];const map={A:"A",CA:"A",L:"L",E:"E",DR:"E",R:"R",G:"X",X:"X"};if(!t)bad.push(id+" unknown "+x[1]);else if(map[t]!==x[2])bad.push(id+" type mismatch")}
  else if(x[0]==="dc"){const t=CAMPACC[x[2]];if(!t){bad.push(id+" unknown "+x[2]);return}const debitUp={A:1,X:1,G:1,DR:1}[t]?1:0;const want=(x[1]==="Increase")===!!debitUp?"D":"C";if(want!==x[3])bad.push(id+" dc mismatch")}
  else if(x[0]==="mc"){if(new Set(x[2]).size!==x[2].length)bad.push(id+" duplicate options");if(x[2].length<2)bad.push(id)}
  else if(x[0]==="je")chkJe(id,x[3],x[4])
  else if(x[0]==="tap"){if(!(x[3]>=0&&x[3]<x[2].length))bad.push(id)}
  else bad.push(id+" kind")})});
 CAMPCAP.docs.concat(CAMPCAP.adj).forEach((d,k)=>chkJe("cap-"+k,d[2],d[3]));
 const B=campCapItems();B.items.forEach((it,k)=>{if(it.x[0]==="mc"&&new Set(it.x[2]).size!==it.x[2].length)bad.push("cap item "+k+" duplicate options: "+it.x[2].join(" | "))});
 const F=B.F;return{bad,n,sl,cap:B.items.length,F:{R:F.R,G:F.G,X:F.X,net:F.net,A:F.A,L:F.Lt,E:F.E},checking:B.L2["Checking"]}});
console.log('steps exercises',v.n,'slides',v.sl,'capstone items',v.cap);console.log('capstone numbers',JSON.stringify(v.F),'checking',v.checking);
ok('all exercise data valid'+(v.bad.length?': '+v.bad.join('; '):''),v.bad.length===0);
ok('capstone balance sheet balances (A = L + E)',v.F.A===v.F.L+v.F.E);
ok('capstone figures as designed (net loss 438.50, assets 16,854.50, cash 7,274.50)',v.F.net===-43850&&v.F.A===1685450&&v.checking===727450);
// ---------- course home ----------
const land=await p.evaluate(()=>({go:document.querySelector('.bkl-go').innerText.replace(/\s+/g,' '),tile:document.querySelectorAll(".bkl-tool[data-camp=track]").length===4,h:document.documentElement.scrollHeight,sk:!!document.querySelector('#bkskills')}));console.log(' home:',land.go,'| height',land.h);
ok('course home has the Bootcamp tile and folded skills',land.tile&&land.sk);
// module 1 not done -> next is module 1 lesson; open hub via stage 2
await p.click('.bkl-st[data-m="2"]');await p.waitForTimeout(300);ok('stage 2 opens the Bootcamp hub',await p.evaluate(()=>view==="camp"&&cv.scr==="hub"));
await p.screenshot({path:'tmp/m_hub.png',fullPage:true});
ok('back bar present on the hub',await p.evaluate(()=>!!document.querySelector('.bkback.go')));
// ---------- lesson ----------
await p.click('.donext');await p.waitForTimeout(250);ok('red button starts step 1 lesson',await p.evaluate(()=>cv.scr==="learn"&&cv.step===0));await p.screenshot({path:'tmp/m_learn.png',fullPage:true});
for(let k=0;k<10;k++){if(await p.$('[data-camp="fwd"]')){await p.click('[data-camp="fwd"]');await p.waitForTimeout(80)}}
await p.click('.cnav [data-camp="do"]');await p.waitForTimeout(250);ok('lesson ends in practice',await p.evaluate(()=>cv.scr==="do"&&cv.items.length>=8));
// ---------- play helper ----------
const play=async(right,shot)=>{let guard=0;while(guard++<120){const st=await p.evaluate(()=>cv.scr);if(st!=="do"&&st!=="cap")break;
  const kind=await p.evaluate(()=>cv.items[cv.i].x[0]);const wrongNow=!right(guard);
  if(shot&&!shot[kind]){shot[kind]=1;await p.screenshot({path:'tmp/m_ex_'+kind+'.png',fullPage:true})}
  await p.evaluate(wrong=>{const x=cv.items[cv.i].x,c=cv.cur,cl=(sel)=>document.querySelector(sel).click();
   if(x[0]==="eq"){x[2].forEach((v,j)=>{const pick=wrong&&j===0?(v==="+"?"-":"+"):v;cl(`[data-camp="eq"][data-j="${j}"][data-v="${pick}"]`)});cl('[data-camp="eqgo"]')}
   else if(x[0]==="sort"){const v=wrong?(x[2]==="A"?"L":"A"):x[2];cl(`[data-camp="pick"][data-v="${v}"]`)}
   else if(x[0]==="dc"){const v=wrong?(x[3]==="D"?"C":"D"):x[3];cl(`[data-camp="pick"][data-v="${v}"]`)}
   else if(x[0]==="mc"){cl(`[data-camp="pick"][data-v="${wrong?1:0}"]`)}
   else if(x[0]==="tap"){cl(`[data-camp="pick"][data-v="${wrong?(x[3]===0?1:0):x[3]}"]`)}
   else if(x[0]==="je"){for(let k=0;k<x[3].length;k++){const want=x[3][k][1];const bs=[...document.querySelectorAll('[data-camp="acc"]')];const b=wrong&&k===0?bs.find(z=>z.dataset.v!==want):bs.find(z=>z.dataset.v===want);b.click()}}},wrongNow);
  await p.waitForTimeout(40);if(shot&&!shot[kind+'fb']){shot[kind+'fb']=1;await p.screenshot({path:'tmp/m_fb_'+kind+'.png',fullPage:true})}
  await p.click('[data-camp="next"]');await p.waitForTimeout(40)}};
const shot={};
// step 1: fail on purpose (4 wrong)
await play(g=>g>4,shot);let r=await p.evaluate(()=>({scr:cv.scr,pct:cv.pct,ok:cv.ok,total:cv.total,st:campS().st.eq}));console.log(' step1 fail run',JSON.stringify(r));
ok('4 misses: not passed, missed ones were re-asked',r.scr==="res"&&r.pct<0.8&&!r.st.ok);await p.screenshot({path:'tmp/m_res_fail.png',fullPage:true});
await p.click('.cnav [data-camp="do"]');await p.waitForTimeout(200);await play(()=>true);r=await p.evaluate(()=>({scr:cv.scr,pct:cv.pct,st:campS().st.eq}));ok('retry all right: step passed',r.scr==="res"&&r.pct===1&&r.st.ok===1);await p.screenshot({path:'tmp/m_res_pass.png',fullPage:true});
// remaining steps via the red button
for(let s=1;s<12;s++){await p.click('.donext');await p.waitForTimeout(150);const where=await p.evaluate(()=>cv.scr+':'+cv.step);if(!where.startsWith('learn:'+s)){ok('step '+(s+1)+' opens its lesson (got '+where+')',false);break}
 await p.evaluate(()=>{const i=cv.step;document.querySelector('.bkback');const b=document.createElement('button');b.dataset.camp="do";b.dataset.i=i;extraClick(b)});await p.waitForTimeout(100);await play(()=>true,shot)}
r=await p.evaluate(()=>({passed:campPassed(),next:campNextInfo()}));ok('12 steps passed, next is the capstone',r.passed===12&&r.next&&r.next.cap===1);
console.log(' kinds seen:',Object.keys(shot).filter(k=>!/fb$/.test(k)).join(', '));
// capstone: leave midway and resume
await p.click('.donext');await p.waitForTimeout(200);ok('capstone starts',await p.evaluate(()=>cv.scr==="cap"&&cv.total===31));
let cnt=0;const playN=async n=>{cnt=0;await play(g=>{cnt++;return true})};
for(let k=0;k<5;k++){await p.evaluate(()=>{const x=cv.items[cv.i].x;for(let j=0;j<x[3].length;j++){[...document.querySelectorAll('[data-camp="acc"]')].find(z=>z.dataset.v===x[3][j][1]).click()}});await p.waitForTimeout(30);await p.click('[data-camp="next"]');await p.waitForTimeout(30)}
await p.click('[data-camp="hub"]');await p.waitForTimeout(150);ok('progress saved when leaving (item 6 next)',await p.evaluate(()=>campS().cap.i===5&&campS().cap.ok===5));
await p.click('[data-camp="cap"]');await p.waitForTimeout(150);ok('capstone resumes at item 6',await p.evaluate(()=>cv.scr==="cap"&&cv.i===5&&cv.ok===5));
// play to the trial balance and screenshot the visuals
for(let g=0;g<60;g++){const st=await p.evaluate(()=>cv.scr==="cap"?cv.lab[cv.i]+'|'+cv.i:'x');if(st==='x')break;const lab=st.split('|')[0];if(!shot[lab]){shot[lab]=1;await p.screenshot({path:'tmp/m_cap_'+lab.replace(/\s+/g,'_')+'.png',fullPage:true})}
 await p.evaluate(()=>{const x=cv.items[cv.i].x;if(x[0]==="mc")document.querySelector('[data-camp="pick"][data-v="0"]').click();else for(let j=0;j<x[3].length;j++){[...document.querySelectorAll('[data-camp="acc"]')].find(z=>z.dataset.v===x[3][j][1]).click()}});await p.waitForTimeout(25);await p.click('[data-camp="next"]');await p.waitForTimeout(25)}
r=await p.evaluate(()=>({scr:cv.scr,pct:cv.pct,done:campS().cap.done,all:campDone(),txt:document.querySelector('#view').innerText.replace(/\s+/g,' ').slice(0,200)}));console.log(' capstone result',JSON.stringify(r));
ok('capstone passed and Bootcamp complete',r.scr==="capres"&&r.pct===1&&r.done===1&&r.all);await p.screenshot({path:'tmp/m_cap_done.png',fullPage:true});
// after completion
await p.click('[data-camp="hub"]');await p.waitForTimeout(150);
const nx=await p.evaluate(()=>bkNext());console.log(' next after Bootcamp (module 1 untouched):',nx.k,nx.t);
const sk=await p.evaluate(()=>bkSkillVals().map(v=>Math.round(v*100)));console.log(' skills %',sk.join(','));ok('skills map credits the Bootcamp',sk[1]===100&&sk[3]===100&&sk[5]===100&&sk[6]===100&&sk[2]===100);
const stt=await p.evaluate(()=>({m2:bkStats(2),all:bkStats("all")}));console.log(' module 2 stats',JSON.stringify(stt.m2));
// reload: progress persists
await p.reload();await p.waitForTimeout(1500);ok('progress survives a reload',await p.evaluate(()=>campDone()&&campPassed()===13));
// study app (not course mode) reaches the Bootcamp too
const p2=await (await b.newContext({viewport:{width:390,height:844}})).newPage();p2.on('pageerror',e=>errs.push('P2 '+e.message.slice(0,200)));await p2.goto('http://localhost:8765/ea-exam-app/?study');await p2.waitForTimeout(1300);
await p2.evaluate(()=>{part=BK;view="home";/* pretend module 1 lessons are read so module 2 is next */(UNITS[BK]||[]).forEach((u,k)=>{if(u.d==1){S.set.les=S.set.les||{};S.set.les["u"+BK+"-"+k]=u.s.length-1}});BANK.filter(i=>i.p==BK&&i.d==1).forEach(i=>{S.it[i.id]=[3,today()+5,1,1,1,0]});render()});await p2.waitForTimeout(300);
const dn=await p2.evaluate(()=>{const d=document.querySelector('.donext');return d?d.innerText.replace(/\s+/g,' '):null});console.log(' study app next:',dn);ok('study app next step is the Bootcamp once module 1 is done',/Bootcamp step 1/.test(dn||''));
await p2.click('.donext');await p2.waitForTimeout(300);ok('it opens the step 1 lesson',await p2.evaluate(()=>view==="camp"&&cv.scr==="learn"));
await p2.click('.bkback.go');await p2.waitForTimeout(200);ok('Back returns to the course main page',await p2.evaluate(()=>view==="home"));
console.log('errors',errs);await b.close()})();
