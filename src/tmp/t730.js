const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const g=GENS.find(x=>x.id==="ge1-schaint");if(!g)return{no:1};let bad=0,four=0,sample=null;for(let i=0;i<400;i++){const o=g.make();if(!o.opts||o.opts.length!==4||new Set(o.opts).size!==4){bad++;continue}four++;
  const m=o.stem.match(/\$([\d,]+)/g).map(x=>+x.replace(/[$,]/g,'')),[inv,mg,mort,sec,cc]=m,want=Math.min(mg,inv)+mort+sec;if(o.ans!==want||o.opts[0]!=="$"+want.toLocaleString("en-US")||mg<=inv)bad++;if(!sample)sample=o}
  return{bad,four,sample,inById:!!BYID["ge1-schaint"],exam:g.exam,p:g.p,d:g.d}});
console.log(JSON.stringify(r,null,1).slice(0,1900));console.log(r.bad===0&&r.four===400&&errs.length===0?'PASS 400 generated versions: four different choices, right answer every time':'FAIL');
await p.evaluate(()=>{part=1;view="home";render();const g=GENS.find(x=>x.id==="ge1-schaint");startSession("qd",10);sess.queue[sess.pos]=mkEntry(g);sess.phase="ask";render()});await p.waitForTimeout(400);
const v=await p.evaluate(()=>({opts:[...document.querySelectorAll('.opt')].map(x=>x.innerText.trim()),stem:document.querySelector('#view').innerText.includes('margin interest'),sw:document.documentElement.scrollWidth}));
console.log((v.opts.length===4&&v.stem&&v.sw<=392?'PASS':'FAIL')+' it shows in a drill with four choices: '+v.opts.join(' / '));
await p.screenshot({path:'tmp/g_schaint.png'});await b.close()})();
