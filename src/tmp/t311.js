const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('C:'+m.text().slice(0,150))});
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
const K=async o=>{await p.evaluate(o=>{const b=document.createElement("button");Object.assign(b.dataset,o);kidsClick(b)},o);await p.waitForTimeout(250)};
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.sound=false;k.xp=500;k.adultUntil=Date.now()+9e5;k.warm={day:kToday(),start:Date.now(),sec:400,n:12,ok:10,done:1,les:1,last:[]};k.lastSeen=Date.now();persist();KV={scr:"home"};render()});
await K({k:"learnhub"});await p.screenshot({path:'tmp/h0.png',fullPage:true});
await K({k:"jobs"});await p.screenshot({path:'tmp/h1.png',fullPage:true});console.log('scr',await p.evaluate(()=>KV.scr));
await K({kj:"hosp"});await p.screenshot({path:'tmp/h2.png',fullPage:true});
await K({kh:"class"});await p.screenshot({path:'tmp/h3.png',fullPage:true});
// tap heart
const tap=async id=>{const r=await p.evaluate(id=>{const g=document.querySelector(`g[data-kbp="${id}"]`);if(!g)return null;g.scrollIntoView({block:"center"});const c=g.children[0];let pt;try{const L=c.getTotalLength(),q=c.getPointAtLength(L*0.3);pt=new DOMPoint(q.x,q.y).matrixTransform(c.getScreenCTM())}catch(_){}const b=c.getBoundingClientRect();if(!(c.classList.contains("bl")||c.classList.contains("tn")))pt={x:b.x+b.width/2,y:b.y+b.height/2};return[pt.x,pt.y]},id);if(!r){console.log('no part',id);return}await p.mouse.click(r[0],r[1]);await p.waitForTimeout(250)};
await tap("liver");console.log('sel',await p.evaluate(()=>KV.sel));await p.screenshot({path:'tmp/h4.png',fullPage:true});
for(const L of["bone","musc","sys"]){await K({kb:"lay",x:L});await p.screenshot({path:`tmp/h5${L}.png`,fullPage:true})}
await K({kb:"turn"});await p.screenshot({path:'tmp/h5back.png',fullPage:true});
// find it on bones
await K({kb:"hosp"});await K({kh:"xray"});
for(let i=0;i<10;i++){const id=await p.evaluate(()=>KV.F&&KV.F.q&&KV.F.q.id);await tap(id);if(i===0)await p.screenshot({path:'tmp/h6.png'});await p.waitForTimeout(1100)}
console.log('find',await p.evaluate(()=>KV.mode+' '+KV.res));
// ER
await K({kb:"hosp"});await K({kh:"er"});await p.screenshot({path:'tmp/h7.png',fullPage:true});
let pid=await p.evaluate(()=>KER[KV.E.i][4]);await tap(pid);console.log('er tap ok',await p.evaluate(()=>KV.E.ans));await K({kb:"ern"});
for(let s=1;s<3;s++){const j=await p.evaluate(()=>{const E=KV.E,C=KER[E.i];return E.o[E.st].indexOf([C[5],C[6],C[7]][E.st])});await K({kb:"era",x:String(j)});if(s===1)await p.screenshot({path:'tmp/h8.png',fullPage:true});await K({kb:"ern"})}
console.log('er',await p.evaluate(()=>KV.mode+' '+KV.res));
// tour
await K({kb:"hosp"});await K({kh:"tour"});await K({kb:"jgo",x:"0"});await p.screenshot({path:'tmp/h9.png',fullPage:true});
for(const id of await p.evaluate(()=>KJOUR[0][3])){await tap(id)}console.log('tour',await p.evaluate(()=>KV.J.st+' '+KV.J.end+' miss '+KV.J.miss));
// germ
await K({kb:"hosp"});await K({kh:"germ"});await K({kb:"gs"});await p.screenshot({path:'tmp/h10.png',fullPage:true});
for(let i=0;i<10;i++){const j=await p.evaluate(()=>KV.G.o.indexOf(KGST[KV.G.i][4][0]));await K({kb:"ga",x:String(j)});await K({kb:"gn"})}console.log('germ',await p.evaluate(()=>KV.res));
// pharmacy
await K({kb:"hosp"});await K({kh:"pharm"});await p.screenshot({path:'tmp/h11.png',fullPage:true});
for(let i=0;i<10;i++){const x=await p.evaluate(()=>KPH[KV.P.order[KV.P.n]][2]);await K({kb:"pa",x});await K({kb:"pn"})}console.log('pharm',await p.evaluate(()=>KV.res));
// OR
await K({kb:"hosp"});await K({kh:"or"});await K({kb:"og",x:"2"});await p.screenshot({path:'tmp/h12.png',fullPage:true});
for(let i=0;i<8;i++)await K({kb:"ot",x:String(i)});console.log('or',await p.evaluate(()=>KV.O.end));await p.screenshot({path:'tmp/h13.png',fullPage:true});
await K({kb:"hosp"});await p.screenshot({path:'tmp/h14.png',fullPage:true});console.log('rep',await p.evaluate(()=>JSON.stringify(kHospRank())));
// cyber
await K({k:"jobs"});await K({kj:"cyber"});await p.screenshot({path:'tmp/j1.png',fullPage:true});
for(let i=0;i<7;i++){const M=await p.evaluate(()=>KCY[KV.C.order[KV.C.n]]);await K({kj2:"judge",x:String(M[3])});if(M[3]){const r=await p.evaluate(()=>KV.C.ro.indexOf(KCY[KV.C.order[KV.C.n]][4]));await K({kj2:"why",x:String(r)})}await K({kj2:"next"})}
const pw=await p.evaluate(()=>KPWQ[KV.C.pw][1]);await K({kj2:"pw",x:String(pw)});await K({kj2:"next"});console.log('cyber',await p.evaluate(()=>KV.C.end));
// court
await K({kj:"court"});const C=await p.evaluate(()=>KCASE[KV.T.i]);for(let j=0;j<C[2].length;j++)await K({kj2:"ev",x:j+":"+C[2][j][1]});await p.screenshot({path:'tmp/j2.png',fullPage:true});await K({kj2:"go"});
for(const O of C[3]){await K({kj2:"obj",x:O[1]});await K({kj2:"go"})}await K({kj2:"ver",x:String(C[4])});await K({kj2:"go"});console.log('court',await p.evaluate(()=>KV.T.end));
// biz
await K({kj:"biz"});await p.screenshot({path:'tmp/j3.png',fullPage:true});await K({kj2:"price",x:"3"});for(let d=0;d<5;d++){await K({kj2:"open"});if(d===0)await p.screenshot({path:'tmp/j4.png',fullPage:true});await K({kj2:"next"})}console.log('biz',await p.evaluate(()=>KV.Z.end));
// circuit
await K({kj:"circ"});await p.screenshot({path:'tmp/j5.png',fullPage:true});
await p.evaluate(()=>{const X=KV.X,sol=KCIR[X.lv].map(r=>[...r].map(c=>KCIRT[c]));X.g.forEach((r,y)=>r.forEach((t,x)=>{if(t&&t[0]!=="B")t[1]=(sol[y][x][1]+3)%4}))});
const cells=await p.evaluate(()=>{const o=[];KV.X.g.forEach((r,y)=>r.forEach((t,x)=>{if(t&&t[0]!=="B")o.push(y+","+x)}));return o});for(const c of cells)await K({kj2:"t",x:c});
console.log('circ',await p.evaluate(()=>KV.X.done+' '+KV.X.end));await p.screenshot({path:'tmp/j6.png',fullPage:true});
console.log('jobs',await p.evaluate(()=>JSON.stringify(KS().jobs)));
// warm choices
await p.evaluate(()=>{const k=KS();k.adultUntil=0;k.passUntil=0;k.warm=null;k.lastSeen=0;kWarmCheck();k.trophyQ=[];KV={scr:"home"};render()});console.log('warm',await p.evaluate(()=>JSON.stringify(KS().warm)+' needed '+kWarmNeeded()));await p.waitForTimeout(300);await p.screenshot({path:'tmp/w1.png'});
console.log('opts',await p.evaluate(()=>[...document.querySelectorAll('.kwopt')].map(b=>JSON.stringify(b.dataset)+b.innerText.replace(/\n/g,' | ')).join('\n')));
// coverage + city menu
await p.click(".kwopt");await p.waitForTimeout(300);console.log("after opt scr",await p.evaluate(()=>KV.scr));await p.screenshot({path:"tmp/w3.png"});await p.evaluate(()=>{KS().adultUntil=Date.now()+9e5;KS().trophyQ=[];KV={scr:"learnhub"};render()});await p.screenshot({path:'tmp/w2.png',fullPage:true});
console.log('errors',errs.slice(0,8));await b.close()})();
