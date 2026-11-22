/* ================= Robot Chess: full games against a robot that gets smarter level by level =================
   Uses the app's move rules (cPseudo, cMove, cInCheck, cMoves). Robot strength by level:
   1 random-ish · 2-3 looks 1 move ahead · 4-6 looks 2 moves ahead · 7-9 looks 3 moves ahead · 10-12 deeper with captures checked.
   Beat it: level up and a ticket. Lose twice in a row: it steps down one level. */
const CBV={P:100,N:320,B:330,R:500,Q:900,K:0};
const CBPST={P:[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
 N:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
 B:[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
 R:[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
 Q:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
 K:[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20]};
function cbEval(b){let s=0;for(let i=0;i<64;i++){const p=b[i];if(!p)continue;const w=cWhite(p),t=p.toUpperCase(),sq=w?i:(7-(i>>3))*8+(i&7);const v=CBV[t]+CBPST[t][sq];s+=w?v:-v}return s} // + good for white
function cbPseudoAll(b,w){const out=[];for(let i=0;i<64;i++){const p=b[i];if(!p||cWhite(p)!==w)continue;for(const t of cPseudo(b,i))if(b[t]!==(w?"k":"K"))out.push([i,t,b[t]?CBV[b[t].toUpperCase()]*10-CBV[p.toUpperCase()]:0])}return out.sort((x,y)=>y[2]-x[2])}
let cbNodes=0,cbStop=0;
function cbSearch(b,w,d,al,be,q){cbNodes++;if(cbNodes>cbStop)return (w?1:-1)*cbEval(b);
  if(d<=0){const sp=(w?1:-1)*cbEval(b);if(!q)return sp;if(sp>=be)return sp;if(sp>al)al=sp;const caps=cbPseudoAll(b,w).filter(m=>b[m[1]]);for(const m of caps){const n=cMove(b,m[0],m[1]);if(cInCheck(n,w))continue;const v=-cbSearch(n,!w,0,-be,-al,q-1);if(v>=be)return v;if(v>al)al=v}return al}
  let any=false;for(const m of cbPseudoAll(b,w)){const n=cMove(b,m[0],m[1]);if(cInCheck(n,w))continue;any=true;const v=-cbSearch(n,!w,d-1,-be,-al,q);if(v>al)al=v;if(al>=be)break}
  if(!any)return cInCheck(b,w)?-100000-d:0;return al}
function cbBest(b,w,lv){const ms=cMoves(b,w);if(!ms.length)return null;
  if(lv<=1){const caps=ms.filter(m=>b[m[1]]);return Math.random()<.35&&caps.length?kPick(caps):kPick(ms)}
  const cfg=[null,null,[1,0,140],[1,0,60],[2,0,90],[2,0,40],[2,2,25],[3,0,35],[3,0,15],[3,2,10],[3,3,0],[4,2,0],[4,3,0]][Math.min(12,lv)];
  const [d,q,noise]=cfg;cbNodes=0;cbStop=lv>=11?60000:35000;
  let best=null,bv=-1e9;const scored=[],per=Math.floor(cbStop/ms.length);cbStop=0;for(const m of ms){cbStop=cbNodes+per;const n=cMove(b,m[0],m[1]);const v=-cbSearch(n,!w,d-1,-1e9,1e9,q)+(noise?(Math.random()*2-1)*noise:0);scored.push([v,m]);if(v>bv){bv=v;best=m}}
  if(lv<=3&&Math.random()<(lv===2?.3:.12))return kPick(ms);return best}
function kCbS(){const k=KS();k.cbot=k.cbot||{lv:1,w:0,l:0,d:0,lossRun:0,best:1};return k.cbot}
function kCbStart(){const C=kCbS();KV={scr:"chessbot",b:cFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"),turn:"w",sel:null,dots:[],last:[],ply:0,over:null,hints:0,think:false,lv:C.lv,msg:""}}
function kCbMat(b){const V={P:1,N:3,B:3,R:5,Q:9,K:0};let w=0,bl=0;for(const p of b){if(!p)continue;if(cWhite(p))w+=V[p];else bl+=V[p.toUpperCase()]}return[w,bl]}
function kCbEnd(g){const b=g.b,side=g.turn==="w";const ms=cMoves(b,side);if(!ms.length)return cInCheck(b,side)?(side?"lost":"won"):"draw";if(b.filter(p=>p&&p.toUpperCase()!=="K").length===0||g.ply>=200)return "draw";return null}
function kCbFinish(res){const g=KV,C=kCbS();g.over=res;if(res==="won"){C.w++;C.lossRun=0;const old=C.lv;C.lv=Math.min(12,C.lv+1);C.best=Math.max(C.best,C.lv);kTix(g.hints?1:2,"beat Robot Lv "+old);try{kRotDone("chess")}catch(_){}k_cbTrophy(old);kBeep("mate");kLine(`Checkmate! You beat robot level ${old}!`,3);g.msg=`🏆 You beat Robot Lv ${old}! The robot is now level ${C.lv}. +${g.hints?1:2} 🎟️`}
  else if(res==="lost"){C.l++;C.lossRun++;g.msg="🤖 The robot won this time.";if(C.lossRun>=2&&C.lv>1){C.lv--;C.lossRun=0;g.msg+=` It steps down to level ${C.lv} so you can practice.`}else g.msg+=" Lose one more and it steps down a level.";kBeep("no")}
  else{C.d++;g.msg="🤝 Draw! Nobody can win.";kBeep("chime")}persist()}
function k_cbTrophy(lv){if(lv>=1)kTrophy("cb1","🤖","Robot beater!","Beat the chess robot.");if(lv>=5)kTrophy("cb5","🦾","Robot master!","Beat the chess robot at level 5.");if(lv>=10)kTrophy("cb10","👑","Grandmaster in training!","Beat the chess robot at level 10.")}
function kCbRobot(){const g=KV;if(g.over||g.turn!=="b")return;g.think=true;render();setTimeout(()=>{if(KV!==g||g.over)return;const m=cbBest(g.b,false,g.lv);g.think=false;if(m){const cap=g.b[m[1]];g.b=cMove(g.b,m[0],m[1]);g.last=[m[0],m[1]];g.ply++;kBeep(cap?"spark":"move");g.msg=cap?`🤖 Robot took your ${KPN[cap.toUpperCase()]}!`:cInCheck(g.b,true)?"⚠️ Check! Protect your king.":""}g.turn="w";const e=kCbEnd(g);if(e)kCbFinish(e);render()},280)}
function kCbClick(d){const g=KV;if(KV.scr!=="chessbot")return;
  if(d.kcb==="new"){kCbStart();return}
  if(d.kcb==="resign"){if(!g.over)kCbFinish("lost");return}
  if(d.kcb==="hint"&&!g.over&&g.turn==="w"){g.hints++;const m=cbBest(g.b,true,Math.min(8,g.lv+2));if(m){g.sel=m[0];g.dots=[m[1]];g.msg="💡 Try this move (the glowing square). Hints give 1 ticket instead of 2 when you win."}return}
  if(d.kcb==="sq"&&!g.over&&g.turn==="w"&&!g.think){const i=+d.i,p=g.b[i];
    if(p&&cWhite(p)){g.sel=i;g.dots=cMoves(g.b,true).filter(m=>m[0]===i).map(m=>m[1]);kBeep("click");return}
    if(g.sel!=null&&g.dots.includes(i)){const cap=g.b[i];g.b=cMove(g.b,g.sel,i);g.last=[g.sel,i];g.sel=null;g.dots=[];g.ply++;g.msg=cap?`Nice! You took the ${KPN[cap.toUpperCase()]}.`:"";kBeep(cap?"coin":"move");g.turn="b";const e=kCbEnd(g);if(e){kCbFinish(e);return}setTimeout(kCbRobot,60);return}
    g.sel=null;g.dots=[]}}
function kCbView(v){const g=KV,C=kCbS();if(!g.b)kCbStart();const G=KV,[mw,mb]=kCbMat(G.b),chk=!G.over&&cInCheck(G.b,G.turn==="w");
  const board=`<div class="kboard">${G.b.map((p,i)=>{const r=i>>3,c=i&7,cls=["ksq",(r+c)%2?"d":"l"];if(i===G.sel)cls.push("sel");if(G.last.includes(i))cls.push("last");if(G.dots.includes(i))cls.push(p?"dot cap":"dot");if(chk&&p===(G.turn==="w"?"K":"k"))cls.push("hint");
    return `<button class="${cls.join(" ")}" data-kcb="sq" data-i="${i}">${p?`<span class="${cWhite(p)?"wp":"bp"}">${KGL[p.toUpperCase()]}&#xFE0E;</span>`:""}${c===0?`<em class="krk1">${8-r}</em>`:""}${r===7?`<em class="kfl">${"abcdefgh"[c]}</em>`:""}</button>`}).join("")}</div>`;
  const ladder=Array.from({length:12},(_,i)=>`<span class="${i+1<C.lv?"on":i+1===C.lv?"cur":""}">${i+1===C.lv?"🤖":i+1<C.lv?"✓":i+1}</span>`).join("");
  v.innerHTML=`<div class="kids">${kToastHtml()}${kTop("🤖 Robot Chess","gameroom")}
   <div class="kcard kcbhero"><div class="kcbh"><span class="kcbbot">🤖</span><div><b>Robot level ${G.lv}</b><div class="ksmall">${["","Just learning","Looks 1 move ahead","Looks 1 move ahead","Looks 2 moves ahead","Looks 2 moves ahead","Checks captures","Looks 3 moves ahead","Looks 3 moves ahead","Sharp tactics","Strong club player","Thinks deep","Robot grandmaster"][G.lv]}</div></div><div class="kcbrec">🏆 ${C.w} · 🤖 ${C.l} · 🤝 ${C.d}</div></div>
    <div class="kcbladder">${ladder}</div></div>
   <div class="kq" style="--sc:#7c3aed"><div class="kqh"><span class="ksub">${G.over?"Game over":G.think?"🤖 Robot is thinking…":G.turn==="w"?"Your move (white)":"Robot's move"}</span><span class="klife">⚖️ ${mw===mb?"Even material":mw>mb?`You +${mw-mb}`:`Robot +${mb-mw}`}</span></div>
    ${chk&&G.turn==="w"?`<div class="kfb no"><b>⚠️ Your king is in check! Move it, block, or capture the attacker.</b></div>`:""}
    ${board}
    ${G.msg?`<div class="kfb ${G.over==="won"?"ok":G.over?"no":""}" style="margin-top:8px"><b>${esc(G.msg)}</b></div>`:""}
    <div class="kpad" style="margin-top:8px">${G.over?`<button class="kbtn big green" data-kcb="new">▶ ${G.over==="won"?"Next robot level":"Play again"}</button>`:`<button class="kbtn ghost" data-kcb="hint">💡 Hint</button><button class="kbtn ghost" data-kcb="resign">🏳️ Give up</button>`}</div>
    <div class="ksmall" style="margin-top:6px;color:#475569">Win to level up the robot (+2 🎟️, +1 with hints). Every level it looks further ahead, up to level 12.</div></div></div>`}
