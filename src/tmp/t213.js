// Kids: header button, home, all 3 games, many questions at every level, no errors, phone width
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);await p.evaluate(()=>{view="start";render()});
await p.screenshot({path:'kstart.png'});
await p.click('#kidsbtn');await p.waitForTimeout(200);console.log('view',await p.evaluate(()=>view));await p.screenshot({path:'khome.png',fullPage:true});
// generator sweep: every subject, every level
console.log('sweep',await p.evaluate(()=>{const k=KS();let bad=[];for(const s in KSUB)for(let L=1;L<=20;L++){k.lv[s]=L;for(let i=0;i<25;i++){const Q=kQ(s);if(Q.o.length!==4||Q.a<0||new Set(Q.o).size!==4||Q.o.some(o=>o===""||o==="NaN"||o==="undefined"))bad.push(s+L+":"+Q.q.slice(0,40)+"|"+Q.o.join("/"))}}for(const s in KSUB)k.lv[s]=1;return bad.slice(0,8).concat(["bad="+bad.length])}));
// rocket
await p.click('[data-k="rocket"]');for(let i=0;i<10;i++){const right=await p.evaluate(()=>KV.Q.a);await p.click(`[data-ka="${i<8?right:(right+1)%4}"]`);await p.click('[data-k="next"]')}
console.log('rocket',await p.evaluate(()=>[KV.done,KV.right,KS().rocket.dest,Object.keys(KS().badges).join(",")]));await p.screenshot({path:'krocket.png'});
// rover: solve with BFS path by brute force
await p.click('[data-k="home"]');await p.click('[data-k="rover"]');await p.waitForTimeout(100);
const solved=await p.evaluate(()=>{const P=KV.P;const key=(x,y,d)=>x+","+y+","+d;const prev=new Map([[key(P.sx,P.sy,0),null]]);let fr=[[P.sx,P.sy,0]],goal=null;
 while(fr.length&&!goal){const nx=[];for(const [x,y,d] of fr){if(x===P.tx&&y===P.ty){goal=[x,y,d];break}const mv=[["L",[x,y,(d+3)%4]],["R",[x,y,(d+1)%4]]];const st=k=>{let cx=x,cy=y;for(let i=0;i<k;i++){cx+=KDIR[d][0];cy+=KDIR[d][1];if(cx<0||cy<0||cx>=P.N||cy>=P.N||P.g[cy][cx])return null}return[cx,cy,d]};const s1=st(1);if(s1)mv.push(["F",s1]);if(P.loop){const s3=st(3);if(s3)mv.push(["F3",s3])}
 for(const [c,m] of mv){const kk=key(...m);if(!prev.has(kk)){prev.set(kk,[key(x,y,d),c]);nx.push(m)}}}fr=nx}
 const prog=[];let kk=key(...goal);while(prev.get(kk)){const [pk,c]=prev.get(kk);prog.unshift(c);kk=pk}P.prog=prog;render();return prog.length+"/"+P.best});
console.log('rover prog',solved);await p.click('[data-k="run"]');await p.waitForTimeout(9000);console.log('rover',await p.evaluate(()=>[KV.P.state,KV.P.stars,!!KV.P.lab]));await p.screenshot({path:'krover.png'});
// trip
await p.click('[data-k="home"]');await p.click('[data-k="trip"]');for(let i=0;i<3;i++){if(!await p.$('[data-k="charge"]:not([disabled])'))break;await p.click('[data-k="charge"]');const r=await p.evaluate(()=>KV.Q.a);await p.click(`[data-ka="${r}"]`);await p.click('[data-k="next"]')}
const can=await p.$('[data-k="drive"]:not([disabled])');if(can){await can.click();await p.waitForTimeout(200);const r=await p.evaluate(()=>KV.arrive.Q.a);await p.click(`[data-ka="${r}"]`);await p.screenshot({path:'ktrip.png'});await p.click('[data-k="tripDone"]')}
console.log('trip',await p.evaluate(()=>[KS().trip.stop,KS().trip.bat]));
await p.click('[data-k="home"]');await p.click('[data-k="badges"]');console.log('badges view ok');await p.click('[data-k="home"]');await p.click('[data-k="exit"]');console.log('exit',await p.evaluate(()=>view));
console.log('overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),'errors',JSON.stringify(errs));await b.close()})();
