const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="T";k.sound=false;k.xp=500;persist();kGuiStart("win");render()});await p.waitForTimeout(300);
await p.screenshot({path:'tmp/g1.png'});
const C=async s=>{await p.click(s);await p.waitForTimeout(150)};
// task1 open files
await C('[data-kg="open"][data-x="files"]');
// task2 make folder Rockets in Documents
await C('[data-kg="cd"][data-x="Documents"]');await C('[data-kg="newdir"]');await p.fill('#kgin','Rockets');await C('[data-kg="ok"]');
// task3 move moon.png
await C('[data-kg="cd"][data-x="Downloads"]');
let i=await p.evaluate(()=>KV.G.fs.Downloads.findIndex(x=>x.n==="moon.png"));await C(`[data-kg="sel"][data-x="${i}"]`);await C('[data-kg="cut"]');
await C('[data-kg="cd"][data-x="Documents"]');i=await p.evaluate(()=>KV.G.fs.Documents.findIndex(x=>x.n==="Rockets"));await C(`[data-kg="sel"][data-x="${i}"]`);await C(`[data-kg="sel"][data-x="${i}"]`);await C('[data-kg="paste"]');
// task4 rename
await C('[data-kg="cd"][data-x="Desktop"]');await C('[data-kg="sel"][data-x="0"]');await C('[data-kg="ren"]');await p.fill('#kgin','homework.txt');await C('[data-kg="ok"]');
// task5 delete old game
i=await p.evaluate(()=>KV.G.fs.Desktop.findIndex(x=>x.n.startsWith("old game")));await C(`[data-kg="sel"][data-x="${i}"]`);await C('[data-kg="del"]');
// task6 restore
await C('[data-kg="cd"][data-x="Trash"]');await C('[data-kg="sel"][data-x="0"]');await C('[data-kg="restore"]');
// 7 wifi
await C('[data-kg="open"][data-x="settings"]');await C('[data-kg="wifi"]');await C('[data-kg="net"][data-x="Home-WiFi"]');
await C('[data-kg="dark"][data-x="1"]');
await p.screenshot({path:'tmp/g2.png'});
await C('[data-kg="open"][data-x="store"]');await C('[data-kg="get"][data-x="Scratch"]');
await C('[data-kg="open"][data-x="task"]');await C('[data-kg="pick"][data-x="0"]');await C('[data-kg="end"]');
await C('.gtaskbar [data-kg="search"]');await p.fill('#kgq','tesla');await C('[data-kg="q"]');await C('.ghit');
await C('[data-kg="open"][data-x="settings"]');await C('[data-kg="upd"]');await C('[data-kg="upd"]');
console.log('win lv',await p.evaluate(()=>kGuiLv("win")),await p.evaluate(()=>kCompPower()));
await p.screenshot({path:'tmp/g3.png'});
// mac + mint look
await p.evaluate(()=>{kGuiStart("mac");render()});await p.waitForTimeout(200);await C('[data-kg="open"][data-x="files"]');await p.screenshot({path:'tmp/g4.png'});
await p.evaluate(()=>{kGuiStart("mint");render()});await p.waitForTimeout(200);await p.screenshot({path:'tmp/g5.png'});
// warm-up alternation: kind gui
await p.evaluate(()=>{const k=KS();k.warmN=0;k.warm=null;k.adultUntil=0;k.passUntil=0;kWarmCheck();KV={scr:"home"};render()});await p.waitForTimeout(300);
console.log('warm',await p.evaluate(()=>JSON.stringify({kind:KS().warm&&KS().warm.kind,lp:KS().warm&&KS().warm.lp})));
await p.screenshot({path:'tmp/g6.png'});
const card=await p.$('.kwarmcard');if(card){console.log('card',await card.evaluate(e=>JSON.stringify(e.dataset)+' '+e.innerText.slice(0,140).replace(/\n/g,' | ')));await card.click();await p.waitForTimeout(300);console.log('scr',await p.evaluate(()=>KV.scr));await p.screenshot({path:'tmp/g7.png'})}
// access check
await p.evaluate(()=>{const k=KS();k.warm.done=1;k.warm.les=1;persist();KV={scr:"home"};render()});
await p.evaluate(()=>{const b=document.createElement("button");b.dataset.k="chessbot";kidsClick(b)});await p.waitForTimeout(400);
await p.screenshot({path:'tmp/g8.png'});
const a=await p.evaluate(()=>KV.logQ&&KV.logQ.Q.a);console.log('logQ',a,await p.evaluate(()=>KV.logQ&&KV.logQ.Q.q));
if(a!=null){await C(`[data-klog="${a}"]`);await p.waitForTimeout(600);console.log('after login scr',await p.evaluate(()=>KV.scr))}
// progress guard: wipe and reload
await p.evaluate(()=>{kSnap();});await p.waitForTimeout(300);
await p.evaluate(()=>{const raw=JSON.parse(localStorage.getItem("eaDrill")||"{}");});
console.log('snaps',await p.evaluate(()=>kSnapList().length),'score',await p.evaluate(()=>kProgScore(KS())));
await p.evaluate(()=>{S.kids={setup:true,name:"T",xp:0};localStorage.setItem(LKEY,JSON.stringify(S));localStorage.setItem("kidsBackup",JSON.stringify(S.kids))});
await p.reload();await p.waitForTimeout(1800);console.log('after wipe xp',await p.evaluate(()=>KS().xp),'gui',await p.evaluate(()=>kGuiLv("win")));
console.log('errors',errs.slice(0,5));await b.close()})();
