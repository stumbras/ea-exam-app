const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
let r=await p.evaluate(()=>{S.set.pace="steady";S.set.xp={nodx1:1};part=1;const T=today();const Q=BANK.filter(i=>i.p==1&&i.t==="q");
  // 90 questions in topics 1-4 only, 70% right; of the right ones, some on length-cued questions
  let k=0;Q.filter(i=>i.d<=4).slice(0,90).forEach(i=>{const okk=(k++%10)<7?1:0;S.it[i.id]=[okk?2:0,T+3,1,okk,okk,0,okk?0:1,Date.now()]});persist();view="home";render();scrollTo(0,0);
  const A=xaAll(),B=xaBasis();const plainOnly=(()=>{const save=XACUE;return null})();
  // the same answers without the two cautions, for comparison
  let w=0,g=0;Q.forEach(i=>{const r=S.it[i.id];if(!r||!r[2])return;const kk=XAW[i.lv||2];w+=kk;g+=kk*(r[3]===r[2]?1:0)});
  return{p:A.p,naive:g/w,n:A.n,un:A.D.filter(x=>!x.n).map(x=>x.name),unP:A.D.filter(x=>!x.n).map(x=>Math.round(x.p*100)),touchedAvg:Math.round(A.D.filter(x=>x.n).reduce((a,x)=>a+x.raw*x.w,0)/A.D.filter(x=>x.n).reduce((a,x)=>a+x.w,0)*100),card:document.querySelector('.xaready').innerText.replace(/\s+/g,' '),cued:B.cued.n,plain:B.plain.n,verdict:A.verdict,sw:document.documentElement.scrollWidth}});
console.log(' ',JSON.stringify(r));
ok('every answered question is counted (90 of 90)',r.n===90);
ok('the figure is well below the plain first-try rate: cautions, topics not started and material not yet seen',r.p<r.naive-0.10&&r.p>r.naive-0.40);
ok('topics not started sit at about 55% of the average of the others (85% x 65%)',r.un.length===2&&r.unP.every(v=>Math.abs(v-Math.round(r.touchedAvg*0.85*0.65))<=2));
ok('the card says what it rests on: number of questions and topics not started',/from 90 questions, 2 topics not started/.test(r.card)&&/Early estimate/.test(r.card)&&r.sw<=392);
await p.screenshot({path:'tmp/s_card.png'});
// a mock far below the figure
r=await p.evaluate(()=>{S.hist.push({t:Date.now(),p:1,m:"mock",n:50,c:15,d:{1:[3,8],2:[3,10],3:[3,10],4:[2,9],5:[2,7],6:[2,6]},lv:{1:[0,0],2:[0,0],3:[0,0]},sec:4000,blank:0});persist();view="home";render();const card=document.querySelector('.xaready').innerText.replace(/\s+/g,' ');document.querySelector('.xaready').click();
  const box=[...document.querySelectorAll('.xad')].find(x=>/How solid is this number/.test(x.innerText));return{card,box:box?box.innerText.replace(/\s+/g,' '):'',marks:box?[...box.querySelectorAll('.xachk')].map(x=>x.classList.contains('y')?'y':'n').join(''):'',sw:document.documentElement.scrollWidth}});
console.log(' ',r.card.slice(0,220));console.log(' ',r.box.slice(0,760));console.log('  marks',r.marks);
ok('when mocks disagree by 8 points or more the card says so and says to trust the mock',/mocks say 30%: trust the mock/.test(r.card));
ok('Diagnosis has a "How solid is this number?" checklist with six checks, one of them the long story questions',r.marks.length===6&&/Long story questions/.test(r.box)&&/90 of \d+ exam questions answered/.test(r.box)&&/Not started: Advising the individual, Specialized returns/.test(r.box)&&/Hard questions, first try/.test(r.box)&&/Recent mocks: 30% over 50 questions/.test(r.box)&&r.sw<=392);
ok('with thin data the checks show crosses and the verdict is "a rough guide"',r.marks[0]==='n'&&r.marks[1]==='n'&&/rough guide/.test(r.box));
await p.screenshot({path:'tmp/s_diag.png',fullPage:true});
ok('no page errors',errs.length===0);if(errs.length)console.log(errs.slice(0,5));await b.close()})();
