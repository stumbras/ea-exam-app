const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{const mid=cFen("r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R");const out=[];for(const lv of [2,4,6,8,10,12]){const t=performance.now();const m=cbBest(mid,false,lv);out.push(`lv${lv}: ${Math.round(performance.now()-t)}ms nodes ${cbNodes} move ${m}`)}return out.join("\n")}));
// tactic check: robot should take a hanging queen at lv>=2
console.log('takes hanging queen:',await p.evaluate(()=>{const b=cFen("4k3/8/8/3Q4/8/8/2n5/4K3");const r=[];for(const lv of [2,5,8]){const m=cbBest(b,false,lv);r.push(lv+":"+m)}return r.join(" ")}));
// strength match: lv8 vs lv3 (robot as black lv8, white lv3) 1 game
console.log(await p.evaluate(()=>{let b=cFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"),w=true,res="?";for(let ply=0;ply<160;ply++){const m=cbBest(b,w,w?3:8);if(!m){res=cInCheck(b,w)?(w?"black(lv8) wins":"white(lv3) wins"):"draw";break}b=cMove(b,m[0],m[1]);w=!w}return "lv8 vs lv3: "+res}));
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="Tomas";persist();KV={scr:"gameroom"};render()});await p.waitForTimeout(300);await p.screenshot({path:'tmp/groom.png',fullPage:true});
await p.click('[data-k="chessbot"]');await p.waitForTimeout(300);
await p.click('[data-kcb="sq"][data-i="52"]');await p.click('[data-kcb="sq"][data-i="36"]');await p.waitForTimeout(900);
await p.screenshot({path:'tmp/cb1.png',fullPage:true});console.log('after e4: turn',await p.evaluate(()=>KV.turn+" last "+KV.last));
console.log('errors',JSON.stringify(errs));await b.close()})();
