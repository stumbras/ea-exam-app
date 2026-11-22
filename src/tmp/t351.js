const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,150)));const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1200);
await p.evaluate(()=>{part=1;view="home";const k=drillKeys()[0];[0,1,2,3].forEach(i=>dqMark(k,i,i>1));/* 0,1 wrong; 2,3 right */
 const Q=DQ();Q["legacy#0"]={b:0,n:2,c:1,t:Date.now()-3*864e5,lastWrong:0};persist();render()});
const btn=()=>p.evaluate(()=>document.querySelector('[data-tdrgo="_rev"]').textContent+' | disabled='+document.querySelector('[data-tdrgo="_rev"]').disabled);
let t=await btn();console.log(' ',t);ok('just-missed questions rest (button disabled, says back in 10 min)',/2 missed, back in 10 min/.test(t)&&/disabled=true/.test(t));
await p.evaluate(()=>{const Q=DQ();for(const id in Q)if(id!=="legacy#0")Q[id].t-=11*6e4;render()});
t=await btn();console.log(' ',t);ok('after 10 min: 2 due',/2 questions due/.test(t)&&/disabled=false/.test(t));
await p.evaluate(()=>{OPEN.xptools=true;render()});await p.waitForTimeout(200);await p.click('[data-tdrgo="_rev"]');await p.waitForTimeout(300);
// answer q1 right, q2 wrong, then re-ask wrong again
const ans=async right=>{await p.evaluate(right=>{const [dk,qi]=tv.dord[tv.dri],c=DRILL[dk].q[qi][2];const bs=[...document.querySelectorAll('[data-tdra]')];(bs.find(x=>(+x.dataset.tdra===c)===right)).click()},right);await p.waitForTimeout(150);await p.click('[data-tdrn]');await p.waitForTimeout(150)};
await ans(true);await ans(false);await ans(false);
const end=await p.evaluate(()=>document.querySelector('#view').innerText.replace(/\s+/g,' ').slice(0,420));console.log(' ',end);
ok('end screen explains the rule, no instant "Review more"',/10-minute break/.test(end)&&!/Review \d+ more/.test(end));
const st=await p.evaluate(()=>{const k=drillKeys()[0];return{a:dqGet(k,0)||dqGet(k,1),all:[0,1].map(i=>dqGet(k,i)).map(r=>r.b+'/'+r.lastWrong),due:drDueCount(),cool:drCool()}});console.log(' ',JSON.stringify(st));
ok('right-after-miss moved to box 1 (tomorrow), double miss resting',st.all.includes('1/0')&&st.all.includes('0/1')&&st.due===0&&st.cool.n===1);
await p.evaluate(()=>{const Q=DQ();for(const id in Q)Q[id].t-=23.5*36e5;});ok('next day: the 2 misses and the 2 first-time-right ones are due',await p.evaluate(()=>drDueCount())===4);
console.log('errors',errs);await b.close()})();
