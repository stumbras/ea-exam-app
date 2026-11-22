/* ================= Robot Chess coach =================
   Real chess training on top of the robot games:
   - every move is graded against the engine's best move (Best / Good / Inaccuracy / Mistake / Blunder) with the reason
     ("the robot can take your knight on f3") and the better move
   - take back a move and try again (counts like a hint: 1 ticket instead of 2 for that win)
   - an advantage bar shows who is ahead and by how much
   - a danger alert marks a piece that is about to be lost (training wheels: only against robot levels 1 to 6)
   - opening names and three opening principles
   - a game review at the end: accuracy, move counts, and the biggest mistake shown on the board */
const CBOPEN={"e2e4":["King's Pawn Opening","Controls the center and frees the bishop and queen."],"d2d4":["Queen's Pawn Opening","Controls the center; the pawn is protected by the queen."],"g1f3":["Réti Opening","Develops a knight first and keeps options open."],"c2c4":["English Opening","Fights for the center from the side."],
 "e2e4 e7e5":["Open Game","Both sides claim the center."],"e2e4 e7e5 g1f3":["King's Knight Opening","Attacks the e5 pawn right away."],"e2e4 e7e5 g1f3 b8c6 f1c4":["Italian Game","The bishop aims at f7, the weakest square near the black king."],
 "e2e4 e7e5 g1f3 b8c6 f1b5":["Ruy Lopez","One of the oldest openings: pressure on the knight that guards e5."],"e2e4 e7e5 g1f3 b8c6 d2d4":["Scotch Game","Opens the center early."],"e2e4 e7e5 f2f4":["King's Gambit","Offers a pawn for a fast attack."],
 "e2e4 c7c5":["Sicilian Defense","Black fights for the center from the side. The most popular reply to e4."],"e2e4 e7e6":["French Defense","Solid: Black plans d5 next."],"e2e4 c7c6":["Caro-Kann Defense","Solid: Black plans d5 next."],"e2e4 d7d5":["Scandinavian Defense","Black challenges the e4 pawn at once."],
 "d2d4 d7d5":["Closed Game","Both sides hold the center."],"d2d4 d7d5 c2c4":["Queen's Gambit","Offers a pawn to pull Black's pawn away from the center."],"d2d4 d7d5 c1f4":["London System","An easy, solid setup: bishop out, then e3 and Nf3."],"d2d4 g8f6":["Indian Defense","Black controls e4 with a knight instead of a pawn."],
 "e2e4 e7e5 g1f3 g8f6":["Petrov's Defense","Black copies and counterattacks e4."],"e2e4 e7e5 d1h5":["Wayward Queen Attack","Careful: an early queen lets Black develop while chasing it."],"e2e4 e7e5 f1c4":["Bishop's Opening","Aims at f7 right away."]};
function cbSq(i){return "abcdefgh"[i&7]+(8-(i>>3))}
function cbSan(b,m){const p=b[m[0]].toUpperCase(),cap=b[m[1]];return(p==="P"?(cap?"abcdefgh"[m[0]&7]+"x":""):p+(cap?"x":""))+cbSq(m[1])}
function cbAnalyze(b,w,budget){const ms=cMoves(b,w),out=[];if(!ms.length)return out;cbNodes=0;const per=Math.max(500,Math.floor((budget||26000)/ms.length));for(const m of ms){cbStop=cbNodes+per;const n=cMove(b,m[0],m[1]);out.push([-cbSearch(n,!w,1,-1e9,1e9,2),m])}return out.sort((x,y)=>y[0]-x[0])}
function cbName(p){return(KPN[p.toUpperCase()]||"piece").toLowerCase()}
function kCbCoachOn(){const C=kCbS();return C.coach!==0}
function kCbGrade(pre,m,post){const A=cbAnalyze(pre,true),best=A[0],mine=A.find(x=>x[1][0]===m[0]&&x[1][1]===m[1])||best,loss=Math.max(0,best[0]-mine[0]);
  const cls=loss<25?"best":loss<90?"good":loss<200?"inacc":loss<420?"mist":"blun",same=best[1][0]===m[0]&&best[1][1]===m[1];let why="";
  if(cls==="mist"||cls==="blun"||cls==="inacc"){const R=cbAnalyze(post,false,14000)[0];
    if(best[0]>90000&&mine[0]<90000)why="You missed checkmate in one! 👑";
    else if(R&&R[0]>90000)why="That lets the robot checkmate you.";
    else if(R&&post[R[1][1]]&&cWhite(post[R[1][1]])&&CBV[post[R[1][1]].toUpperCase()]>=300)why=`The robot can take your ${cbName(post[R[1][1]])} on ${cbSq(R[1][1])}.`;
    else if(pre[best[1][1]]&&!cWhite(pre[best[1][1]]))why=`You could have taken the ${cbName(pre[best[1][1]])} on ${cbSq(best[1][1])}.`;
    else why="There was a stronger move."}
  return{cls,loss:Math.round(loss),best:best[1],bestSan:cbSan(pre,best[1]),san:cbSan(pre,m),same,why}}
function kCbTip(g,pre,m){g.tips=g.tips||{};const p=pre[m[0]].toUpperCase(),home=[57,62,58,61].filter(i=>pre[i]&&"NB".includes(pre[i])).length;
  if(g.ply<=14&&p==="Q"&&home>=3&&!g.tips.q){g.tips.q=1;return"Opening tip: bring out knights and bishops before the queen. An early queen gets chased around."}
  if(g.ply<=12&&p!=="P"&&(g.dest||[]).includes(m[0])&&!pre[m[1]]&&!g.tips.t){g.tips.t=1;return"Opening tip: move each piece once. Get all your pieces into the game first."}
  if(p==="N"&&((m[1]&7)===0||(m[1]&7)===7)&&g.ply<=20&&!g.tips.r){g.tips.r=1;return"Tip: a knight on the rim is dim. Knights are strongest near the center."}
  return""}
const kCbStart0=kCbStart;kCbStart=function(){kCbStart0();Object.assign(KV,{hist:[],coach:null,tb:0,rev:null,line:[],dest:[],tips:{},open:null})};
const kCbClick0=kCbClick;
kCbClick=function(d){const g=KV;if(KV.scr!=="chessbot")return;
  if(d.kcb==="coach"){const C=kCbS();C.coach=C.coach===0?1:0;persist();return}
  if(d.kcb==="rev"){g.rev=d.i===""||d.i===undefined?null:+d.i;return}
  if(d.kcb==="back"){if(g.over||g.think||g.turn!=="w"||!(g.hist||[]).length)return;const h=g.hist.pop();g.b=h.b;g.ply=h.ply;g.last=[];g.sel=h.best[0];g.dots=[h.best[1]];g.line=g.line.slice(0,h.ply);g.dest.pop();g.tb=(g.tb||0)+1;g.hints++;g.coach={cls:"back",txt:`↩️ Taken back. The glowing square shows a stronger move (${h.bestSan}). Try it, or find your own.`};g.msg="";g.thr=undefined;kBeep("click");return}
  const pre=g.b,ply=g.ply,sel=g.sel;kCbClick0(d);
  if(d.kcb==="new"){return}
  if(g.ply===ply+1&&d.kcb==="sq"&&sel!=null){const m=[sel,+d.i];g.hist=g.hist||[];g.line=g.line||[];g.dest=g.dest||[];let G=null;try{G=kCbGrade(pre,m,g.b)}catch(_){}
    if(G){const tip=kCbTip(g,pre,m);g.hist.push({b:pre,ply,m,cls:G.cls,loss:G.loss,best:G.best,bestSan:G.bestSan,san:G.san,why:G.why});
      const lab={best:"⭐ Best move!",good:"👍 Good move.",inacc:"🤔 Inaccuracy.",mist:"⚠️ Mistake.",blun:"💥 Blunder!"}[G.cls];
      g.coach={cls:G.cls,txt:`${lab} ${G.san}${G.cls==="best"||G.cls==="good"?"":` · ${G.why} Better: ${G.bestSan}.`}${tip&&(G.cls==="best"||G.cls==="good"||G.cls==="inacc")?" "+tip:""}`}}
    g.line[ply]=cbSq(m[0])+cbSq(m[1]);g.dest.push(m[1]);g.thr=undefined}};
const kCbRobot0=kCbRobot;
kCbRobot=function(){const g=KV,pre=g.b,ply=g.ply;kCbRobot0();const iv=setInterval(()=>{if(KV!==g){clearInterval(iv);return}if(!g.think){clearInterval(iv);if(g.ply===ply+1&&g.last&&g.last.length===2){g.line=g.line||[];g.line[ply]=cbSq(g.last[0])+cbSq(g.last[1]);
        let nm=null;for(let n=Math.min(g.line.length,5);n>=1;n--){const k=g.line.slice(0,n).join(" ");if(CBOPEN[k]){nm=CBOPEN[k];break}}if(nm&&g.ply<=10&&(!g.open||g.open[0]!==nm[0])){g.open=nm;g.openT=g.ply}
        g.thr=undefined;try{render()}catch(_){}}}},60)};
function kCbEval(g){if(g.evPly===g.ply&&g.ev!==undefined)return g.ev;let v=0;try{cbNodes=0;cbStop=6000;const w=g.turn==="w";v=(w?1:-1)*cbSearch(g.b,w,1,-1e9,1e9,2)}catch(_){v=cbEval(g.b)}g.evPly=g.ply;return g.ev=v}
function kCbThreat(g){if(g.thr!==undefined&&g.thrPly===g.ply)return g.thr;g.thrPly=g.ply;g.thr=null;try{const A=cbAnalyze(g.b,false,12000)[0];if(A){const t=A[1][1],p=g.b[t];if(p&&cWhite(p)&&p!=="K"&&CBV[p]>=300&&A[0]+cbEval(g.b)>170)g.thr={sq:t,p}}}catch(_){}return g.thr}
function kCbReview(g){const H=g.hist||[];if(!H.length)return"";const n=H.length,acc=Math.round(H.reduce((a,h)=>a+100*Math.exp(-h.loss/260),0)/n),cnt=c=>H.filter(h=>h.cls===c).length;
  let worst=-1;H.forEach((h,i)=>{if((h.cls==="mist"||h.cls==="blun")&&(worst<0||h.loss>H[worst].loss))worst=i});const C=kCbS();if(!g.accSaved){g.accSaved=1;C.accBest=Math.max(C.accBest||0,acc);C.games=(C.games||0)+1;persist();if(acc>=85&&n>=12)kTrophy("cbacc","🎯","Sharp shooter!","Played a chess game with 85% accuracy or better.")}
  return `<div class="kcbrev"><div class="ktriph">📊 GAME REVIEW</div><div class="ktripg"><div><b>${acc}%</b><span>accuracy</span></div><div><b>${cnt("best")}</b><span>⭐ best</span></div><div><b>${cnt("mist")}</b><span>⚠️ mistakes</span></div><div><b>${cnt("blun")}</b><span>💥 blunders</span></div></div>
   ${worst>=0?`<div class="ksmall" style="color:#e5e7eb">Biggest miss: move ${Math.floor(H[worst].ply/2)+1}, you played <b>${esc(H[worst].san)}</b>. ${esc(H[worst].why)} Better: <b>${esc(H[worst].bestSan)}</b>.</div><button class="kbtn small" data-kcb="rev" data-i="${worst}" style="margin-top:6px">🔍 Show me on the board</button>`:`<div class="ksmall" style="color:#e5e7eb">No big mistakes. That is how strong players win: fewer mistakes than the other side.</div>`}
   <div class="ksmall" style="color:#9fb4d8;margin-top:6px">Best accuracy so far: ${C.accBest||acc}%${g.tb?` · take-backs this game: ${g.tb}`:""}</div></div>`}
const kCbView0=kCbView;
kCbView=function(v){const g=KV;if(g.scr==="chessbot"&&g.b&&g.rev!=null&&g.hist&&g.hist[g.rev]){const h=g.hist[g.rev],save={b:g.b,last:g.last,dots:g.dots,sel:g.sel,msg:g.msg};g.b=h.b;g.last=[h.m[0],h.m[1]];g.sel=h.best[0];g.dots=[h.best[1]];g.msg="";
    try{kCbView0(v)}finally{Object.assign(g,save)}const q=v.querySelector(".kq");if(q){const bd=q.querySelector(".kboard");if(bd)bd.insertAdjacentHTML("beforebegin",`<div class="kcbco mist">🔍 Move ${Math.floor(h.ply/2)+1}: you played <b>${esc(h.san)}</b> (the two marked squares). ${esc(h.why)} The glowing piece and dot show the better move: <b>${esc(h.bestSan)}</b>.</div>`);
      const pad=q.querySelector(".kpad");if(pad)pad.innerHTML=`<button class="kbtn big" data-kcb="rev" data-i="">◀ Back to the result</button>`}return}
  kCbView0(v);try{const G=KV,q=v.querySelector(".kq"),bd=q&&q.querySelector(".kboard");if(!bd)return;const C=kCbS(),on=kCbCoachOn();
    const ev=kCbEval(G),pct=Math.round(50+50*Math.tanh(ev/420)),lab=Math.abs(ev)>90000?"mate":(ev>=0?"+":"−")+(Math.abs(ev)/100).toFixed(1);
    bd.insertAdjacentHTML("beforebegin",`<div class="kcbev" title="Who is ahead"><i style="width:${pct}%"></i><span class="l">You</span><b>${lab}</b><span class="r">Robot</span></div>${G.open&&G.ply<=12?`<div class="kcbop">📖 <b>${esc(G.open[0])}</b> · ${esc(G.open[1])}</div>`:""}`);
    if(!G.over&&G.turn==="w"&&!G.think&&on&&G.lv<=6){const T=kCbThreat(G);if(T){const sq=bd.querySelector(`[data-i="${T.sq}"]`);if(sq)sq.classList.add("kthr");bd.insertAdjacentHTML("afterend",`<div class="kcbco mist">🚨 Your ${cbName(T.p)} on ${cbSq(T.sq)} is in danger! Move it, defend it, or take the attacker.</div>`)}}
    if(G.coach&&on)bd.insertAdjacentHTML("afterend",`<div class="kcbco ${G.coach.cls}">${esc(G.coach.txt)}</div>`);
    const pad=q.querySelector(".kpad");if(pad&&!G.over){const can=(G.hist||[]).length&&G.turn==="w"&&!G.think;pad.insertAdjacentHTML("beforeend",`<button class="kbtn ghost" data-kcb="back" ${can?"":"disabled"}>↩️ Take back</button><button class="kbtn ${on?"green":"ghost"}" data-kcb="coach">🧑‍🏫 Coach ${on?"ON":"OFF"}</button>`)}
    if(G.over&&pad)pad.insertAdjacentHTML("beforebegin",kCbReview(G));
    const note=q.querySelector(".kpad+.ksmall")||[...q.querySelectorAll(".ksmall")].pop();if(note&&!G.over)note.textContent=`Win to level up the robot (+2 🎟️, +1 if you used a hint or a take-back). ${G.lv<=6?"Danger alerts help until robot level 6.":"From level 7 there are no danger alerts: you spot the threats."}`}catch(_){}};
