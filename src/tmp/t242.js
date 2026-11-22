const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=5;view="kids";KV={scr:"land",pick:1};render()});
await p.click('[data-k="msnBuild"]');await p.waitForTimeout(300);await p.click('[data-kmb="tanks:3"]');await p.click('[data-kmb="eng:spark"]');await p.waitForTimeout(200);
console.log('heavy?',await p.evaluate(()=>[kMsnStats(kMsnCfg()).twr.toFixed(2),!!document.querySelector('[data-k="msnFly"][disabled]')]));
await p.click('[data-kmb="tanks:2"]');await p.click('[data-kmb="eng:raptor"]');await p.click('[data-kmb="land:legs"]');await p.waitForTimeout(200);await p.screenshot({path:'k23build.png',fullPage:true});
await p.click('[data-k="msnFly"]');await p.waitForTimeout(400);const q=await p.evaluate(()=>kLnd.Q.a);await p.click(`[data-klq="${q}"]`);await p.waitForTimeout(300);
const ph=()=>p.evaluate(()=>[kLnd.ph,Math.round(kLnd.p),Math.round(kLnd.score),Math.round(kLnd.fuel)]);
await p.waitForTimeout(3500);console.log('after count',await ph());
// fly: hold thrust, steer by assist
let shot=0;
for(let i=0;i<120;i++){await p.evaluate(()=>{kLnd.thr=true});const s=await ph();if(s[0]==="launch"&&s[1]>=36&&!(await p.evaluate(()=>kLnd.sep)))await p.click('#mact');if(s[0]==="launch"&&s[1]>40&&!shot){shot=1;await p.screenshot({path:'k23launch.png'})}if(s[0]!=="launch")break;await p.waitForTimeout(250)}
console.log('orbit?',await ph());await p.evaluate(()=>{kLnd.thr=false});
for(let i=0;i<140;i++){const s=await p.evaluate(()=>[kLnd.ph,kLnd.iss&&kLnd.iss.ry,kLnd.y,kLnd.pt]);if(s[0]!=="orbit")break;if(s[1]){await p.evaluate(()=>{kLnd.thr=kLnd.y>kLnd.iss.ry})}else await p.evaluate(()=>{kLnd.thr=kLnd.y>300});if(s[3]>16&&s[3]<16.3)await p.screenshot({path:'k23orbit.png'});if(s[3]>=24.2)await p.click('#mact');await p.waitForTimeout(200)}
console.log('reentry?',await ph(),await p.evaluate(()=>kLnd.log));await p.evaluate(()=>{kLnd.thr=false});
for(let i=0;i<100;i++){const s=await p.evaluate(()=>[kLnd.ph,kLnd.ra,kLnd.pt]);if(s[0]!=="reentry")break;await p.evaluate(()=>{kLnd.left=kLnd.ra>44;kLnd.right=kLnd.ra<36});if(s[2]>6&&s[2]<6.3)await p.screenshot({path:'k23reentry.png'});await p.waitForTimeout(150)}
await p.evaluate(()=>{kLnd.left=kLnd.right=false});console.log('land?',await ph());
for(let i=0;i<200;i++){const s=await p.evaluate(()=>{const D=kLnd;if(D.over)return null;const r=D.rk,H=$('#kmsn').height,alt=(H-66-r.y-46)/4;if(!D.flipped&&!(D.flipT>0)&&alt<300)kMsnAct();D.thr=D.flipped&&r.vy>40;D.left=r.x>$('#kmsn').width/2+5;D.right=r.x<$('#kmsn').width/2-5;return alt|0});if(s===null)break;await p.waitForTimeout(60)}
await p.waitForTimeout(2200);await p.screenshot({path:'k23end.png',fullPage:true});console.log('end',await p.evaluate(()=>[kLnd.res,kLnd.score,kLnd.stars,JSON.stringify(kLnd.log)]));
console.log('errors',JSON.stringify(errs));await b.close()})();
