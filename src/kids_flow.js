/* ================= Game time limits and game-to-game flow =================
   Each game gets a set number of minutes (default 12) since the last learning round. Then it rests, and opens
   again after any learning round (quiz, Genius Quiz, lesson, chess puzzle, hacker mission...). A Free Pass or the
   grown-up unlock still works. Warnings come 2 minutes before. */
const KGSCR={city:"city",fly:"fly",land:"fly",drive:"drive",derby:"drive",col:"col",chessbot:"chessbot"};
const KGNAME={city:"Brick Bay",fly:"Pilot School flying",drive:"Tesla Drive",col:"Mars Colony",chessbot:"Robot Chess",mz:"Mechazilla Catch"};
const KGDK={city:"city",fly:"fly",land:"fly",drive:"drive",derby:"drive",col:"col",chessbot:"chessbot"};
function kGLimit(){const k=KS();return k.glimit===0?0:(k.glimit||12)}
function kGKeyNow(){if(KV.scr==="tworld"&&KV.co==="mz")return "mz";return KGSCR[KV.scr]||null}
function kGLearnSum(){try{const r=kRot(),L=["music","learn","term","chess","poker","mj","mc","ast"];let n=0;for(const id in r.done)if(id.startsWith("q:")||L.includes(id))n+=r.done[id];return n+":"+kToday()}catch(_){return "0"}}
function kGState(){const k=KS();k.gt=k.gt||{};k.rest=k.rest||{};return k}
setInterval(()=>{try{if(typeof KS!=="function"||document.visibilityState!=="visible"||!document.querySelector(".kids"))return;const k=kGState(),ls=kGLearnSum();
  if(k.gls!==ls){if(k.gls)k.gt={},k.rest={};k.gls=ls}
  const key=kGKeyNow(),lim=kGLimit();if(!key||!lim)return;if(kPassLeft&&kPassLeft()>0)return;
  k.gt[key]=(k.gt[key]||0)+5;const left=lim*60-k.gt[key];
  if(left<=120&&left>115){kT(`⏳ 2 minutes left in ${KGNAME[key]}. Then do a learning round to unlock it again.`);kLine("Two minutes left!",2)}
  if(left<=0&&!k.rest[key]){k.rest[key]=1;persist();try{if(typeof kCt!=="undefined"&&kCt&&key==="city")kCt.over=kCt.over||0}catch(_){}KV={scr:"home"};render();setTimeout(()=>kRestShow(key),60)}
  if(k.gt[key]%30===0)persist()}catch(_){}},5000);
function kRestKey(d){if(!d)return null;if(d.ktw==="mz")return "mz";if(d.k&&KGDK[d.k])return KGDK[d.k];return null}
function kRestShow(key){document.querySelectorAll(".kpassov").forEach(x=>x.remove());const k=KS(),n=kPassN(),P=kPath(),r=kRot(),nx=P.find(id=>!r.done[id]),I=nx&&kPathInfo(nx);
  const o=document.createElement("div");o.className="kpassov";
  o.innerHTML=`<div class="kpassc"><div style="font-size:46px">⏸️</div><div class="kh" style="margin:4px 0">${esc(KGNAME[key]||"This game")} is resting</div>
   <div class="small" style="margin-bottom:12px">You played ${kGLimit()} minutes. Win one learning round and it opens again, plus you earn 🎟️ tickets!</div>
   ${I?`<button class="kbtn green" data-kpass="go" style="width:100%">▶ Next: ${I.x[1]} ${esc(I.x[2])}</button>`:`<button class="kbtn green" data-k="learnhub" style="width:100%">🎓 Learning Center</button>`}
   <button class="kbtn" data-k="genius" style="width:100%;margin-top:8px">🧠 Daily Genius</button>
   ${n>0?`<button class="kbtn" data-kpass="use" style="width:100%;margin-top:8px">🎫 Use a Free Pass · 10 min (you have ${n})</button>`:""}
   <button class="kbtn ghost" data-kpass="no" style="width:100%;margin-top:8px">OK</button></div>`;
  KV.passAsk=nx||null;KV.passD=null;(document.getElementById("view")||document.body).appendChild(o)}
function kRestCheck(d){const key=kRestKey(d);if(!key)return false;const k=kGState();if(!k.rest[key]||!kGLimit())return false;if(kPassLeft()>0)return false;kBeep("no");kLine(`${KGNAME[key]} is resting. Do a learning round first!`,2);setTimeout(()=>kRestShow(key),0);return true}
