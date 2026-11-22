const {chromium}=require('playwright');const tag=process.argv[2]||'a';
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";k.sound=false;k.tix=9;k.adultUntil=Date.now()+9e5;k.guided=false;k.rocket.dest=3;k.warm={day:kToday(),start:Date.now(),sec:400,n:12,ok:10,done:1,les:1,last:[],p0:0};k.lastSeen=Date.now();persist();KV={scr:"home"};render()});
// drive
await p.evaluate(()=>{kDriveStart("m3");render()});await p.waitForTimeout(2500);
await p.evaluate(()=>{kDriveSteer(1)});await p.waitForTimeout(120);await p.screenshot({path:`tmp/d_${tag}1.png`});
await p.evaluate(()=>{kDrv.t=26;kDrv.rain=true;kDriveSteer(-1)});await p.waitForTimeout(1500);await p.screenshot({path:`tmp/d_${tag}2.png`});
await p.evaluate(()=>{kDrv.t=48;kDrv.rain=false;kDrv.brake=true;kDriveSteer(-1)});await p.waitForTimeout(700);await p.screenshot({path:`tmp/d_${tag}3.png`});
const fps=await p.evaluate(()=>new Promise(r=>{let n=0;const t0=performance.now();const f=()=>{n++;if(performance.now()-t0<1000)requestAnimationFrame(f);else r(n)};requestAnimationFrame(f)}));console.log('drive fps',fps,'cv',await p.evaluate(()=>{const c=document.querySelector('#kdrv');return c?[c.width,c.height,c.getBoundingClientRect().width].join('x'):null}));
await p.evaluate(()=>{kDrv.t=59.5;kDrv.brake=false});await p.waitForTimeout(1800);await p.screenshot({path:`tmp/d_${tag}4.png`,fullPage:true});
// fly
await p.evaluate(()=>{kDrv=null;kFlyStart(0);KV={scr:"fly"};render()});await p.waitForTimeout(600);for(let i=0;i<8;i++){const ok=await p.evaluate(i=>{const b=document.querySelector(`[data-kfchk="${i}"]`);if(b){b.click();return 1}return 0},i);await p.waitForTimeout(120)}await p.waitForTimeout(900);await p.screenshot({path:`tmp/f_${tag}1.png`});
await p.evaluate(()=>{const F=kFly;F.P.thr=1;});await p.waitForTimeout(9000);await p.evaluate(()=>{kFly.stick.y=kFly.real?-0.5:0.5});await p.waitForTimeout(5000);await p.evaluate(()=>{kFly.stick.y=0;kFly.stick.x=.4});await p.waitForTimeout(2500);await p.screenshot({path:`tmp/f_${tag}2.png`});
console.log('fly',await p.evaluate(()=>JSON.stringify({alt:Math.round(kFly.P.y||kFly.P.alt||0),keys:Object.keys(kFly.P).join(',')})));
const fps2=await p.evaluate(()=>new Promise(r=>{let n=0;const t0=performance.now();const f=()=>{n++;if(performance.now()-t0<1000)requestAnimationFrame(f);else r(n)};requestAnimationFrame(f)}));console.log('fly fps',fps2);
await p.evaluate(()=>{const b=document.createElement('button');b.dataset.kfly='cock';kidsClick(b)});await p.waitForTimeout(800);await p.screenshot({path:`tmp/f_${tag}3.png`});
console.log('errors',errs.slice(0,6));await b.close()})();
