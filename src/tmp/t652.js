const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);await p.evaluate(()=>{S.set.pace="steady"});
await p.evaluate(()=>{part=1;view="home";render();scrollTo(0,0)});await p.waitForTimeout(200);
let r=await p.evaluate(()=>{const o=[...document.querySelectorAll('#view .xaready, #view .xaquick, #view .donext')].map(e=>[e.className.split(' ')[0],Math.round(e.getBoundingClientRect().top),Math.round(e.getBoundingClientRect().bottom)]);return{o,sw:document.documentElement.scrollWidth}});console.log(' ',JSON.stringify(r));
ok('top of the page: readiness, Quick 10, red button, all on the first screen',r.o.length===5&&r.o[0][0]==="xaready"&&r.o[1][0]==="xaquick"&&r.o[4][0]==="donext"&&r.o[4][2]<=844&&r.sw<=392);
await p.screenshot({path:'tmp/q_new.png'});
await p.click('.xaquick');await p.waitForTimeout(250);r=await p.evaluate(()=>({n:sess&&sess.queue.length,mode:sess&&sess.mode,title:document.querySelector('.sesshead h2').innerText,note:(document.querySelector('.xanote')||{innerText:''}).innerText}));console.log(' ',JSON.stringify(r));
ok('brand-new learner: it still gives 10 items straight away',r.n===10&&r.mode==="qd"&&/^Quick 10/.test(r.title));
// a learner with history
r=await p.evaluate(()=>{clearInterval(timerId);sess=null;S.set.xp={nodx1:1};const T=today();const seed=(d,acc,n)=>{BANK.filter(i=>i.p==1&&i.d==d&&i.t==="q").slice(0,n).forEach((i,k)=>{const okk=(k%10)<Math.round(acc*10)?1:0;S.it[i.id]=[okk?2:0,T+3,1,okk,okk,0,okk?0:1,Date.now()]})};
  seed(1,0.9,30);seed(2,0.8,40);seed(3,0.4,40);seed(4,0.7,30);seed(5,0.8,20);seed(6,0.8,25);BANK.filter(i=>i.p==1&&i.t==="f").slice(0,30).forEach((i,k)=>{S.it[i.id]=[2,k<8?T-1:T+4,1,1,1,0]});persist();
  const A=xaAll(),runs=[];for(let k=0;k<20;k++){startSession("qd",10);const q=sess.queue.map(e=>BYID[e.id]),tg=sess.quick.tag;runs.push({n:q.length,miss:q.filter(i=>tg[i.id]==="miss").length,due:q.filter(i=>tg[i.id]==="due").length,focus:q.filter(i=>tg[i.id]==="focus").length,focusD:[...new Set(q.filter(i=>tg[i.id]==="focus").map(i=>i.d))].join(""),focusLv:Math.max(0,...q.filter(i=>tg[i.id]==="focus").map(i=>i.lv)),calc:q.filter(i=>i.t==="g").length,fresh:q.filter(i=>{const r=S.it[i.id];return i.t==="q"&&r&&r[4]===1&&r[1]>T}).length,note:sess.note});clearInterval(timerId);sess=null}
  return{top:A.top.d,p3:Math.round(A.D[2].p*100),runs}});
const avg=k=>r.runs.reduce((a,x)=>a+x[k],0)/r.runs.length;console.log('  biggest gain topic',r.top,'at',r.p3+'%','| per drill: misses',avg('miss'),'due',avg('due'),'focus',avg('focus'),'calc',avg('calc'),'| note:',r.runs[0].note);
ok('10 items every time: 3 open misses, no flash-card reviews, 1 calculation, the rest new or on the biggest-gain topic',r.runs.every(x=>x.n===10)&&avg('miss')===3&&avg('due')===0&&avg('focus')>=1&&avg('calc')===1);
ok('the focus questions are from the topic with the biggest gain, at basic or medium level because it scores 40%',r.top==3&&r.runs.every(x=>x.focusD==="3"&&x.focusLv===2));
ok('nothing answered right and not yet due is repeated',avg('fresh')===0);
ok('the drill says what it was built from',/Built for you now: 2 new · 3 misses · \d on Deductions & credits/.test(r.runs[0].note));
// adapts while answering
let rr=null;for(let t=0;t<8;t++){const q=await p.evaluate(()=>{startSession("qd",10);const s=sess,K=s.quick;let swapped=null,raised=null;for(let g=0;g<10&&view==="session"&&sess===s;g++){const cur=s.queue[s.pos];if(!cur)break;s.cp=false;const it=BYID[cur.id],before=s.queue.map(e=>e.id).join();
    if(it.t==="q"&&!swapped&&K.tag[it.id]!=="focus"){record(false,true);if(s.queue.map(e=>e.id).join()!==before.split(",").concat([]).join()&&Object.values(K.tag).includes("sib"))swapped=s.note}
    else if(it.t==="q"&&K.tag[it.id]==="focus"&&!raised){const lv0=s.queue.slice(s.pos+1).filter(e=>K.tag[e.id]==="focus").map(e=>BYID[e.id].lv);record(true,true);const lv1=s.queue.slice(s.pos+1).filter(e=>K.tag[e.id]==="focus").map(e=>BYID[e.id].lv);if(lv1.join()!==lv0.join())raised={lv0,lv1,note:s.note}}
    else record(true,true);advance()}
  return{swapped,raised,view,sib:Object.values(K.tag).filter(x=>x==="sib").length}});rr=rr||q;if(q.sib)rr.sib=q.sib;if(q.raised){rr.raised=q.raised;rr.view=q.view}if(rr.sib&&rr.raised)break;await p.evaluate(()=>{sess=null;view="home"})}r=rr;console.log(' ',JSON.stringify(r));
ok('a miss brings in an easier look-alike from the same lesson',r.sib>=1);
ok('a sure right answer on the focus topic raises the next one a level',!!r.raised&&r.raised.lv1.reduce((a,b)=>a+b,0)>r.raised.lv0.reduce((a,b)=>a+b,0));
r=await p.evaluate(()=>({view,next:!!document.querySelector('.xpnx')}));ok('it ends on the results page with the next step',r.view==="results"&&r.next);
await p.evaluate(()=>{sess=null;view="home";render();scrollTo(0,0)});await p.waitForTimeout(150);await p.screenshot({path:'tmp/q_data.png'});
for(const pt of [5,8]){const q=await p.evaluate(pt=>{part=pt;view="home";render();startSession("qd",10);const o={quick:!!sess.quick,n:sess.queue.length,btn:!!document.querySelector('.xaquick')};clearInterval(timerId);sess=null;view="home";return o},pt);ok(`part ${pt}: its own smart drill is unchanged`,!q.quick&&q.n===10)}
ok('no page errors',errs.length===0);if(errs.length)console.log(errs.slice(0,5));await b.close()})();
