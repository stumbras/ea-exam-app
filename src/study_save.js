/* ================= Study progress safety =================
   Review finding: months of study progress lived in one browser storage entry, with only a manual export. If the browser
   cleared its storage (low disk space, "clear site data", a reinstall) everything was gone.
   Now: 1) the app asks the browser to keep its storage (persistent storage);
        2) a copy of the whole progress goes into a second store (IndexedDB) once a day and whenever the app is closed,
           and the last 7 days are kept;
        3) on start, if a kept copy holds clearly more progress than what is on the device, a sheet offers to restore it;
        4) Settings and history lists the copies with a Restore button each.
   The kids' progress is never rolled back by a restore: whichever side has more is kept. */
function spScore(s){try{const c=x=>Object.keys(x||{}).length,st=s.set||{};let n=c(s.it)+(s.hist||[]).length*2+c(st.les)*3+c(st.gls);["camp","campqb","campt1","campt2"].forEach(k=>{if(st[k])n+=c(st[k].st)*10});return n}catch(_){return 0}}
function spDb(fn,fail){try{const r=indexedDB.open("studySave",1);r.onupgradeneeded=()=>{try{r.result.createObjectStore("s")}catch(_){}};r.onsuccess=()=>{try{fn(r.result)}catch(_){fail&&fail()}};r.onerror=()=>{fail&&fail()}}catch(_){fail&&fail()}}
let spLast=0;
function spSnap(force){try{if(!S.upd||(!force&&S.upd<=spLast))return;const sc=spScore(S);if(sc<5)return;const key="d"+today(),txt=JSON.stringify(S);spLast=S.upd;
  spDb(db=>{const tx=db.transaction("s","readwrite"),os=tx.objectStore("s"),g=os.get(key);g.onsuccess=()=>{const old=g.result;if(old&&old.sc>sc*1.25+25&&old.t>((S.set&&S.set.spKeep)||0))return; /* a much smaller state never replaces today's copy unless the learner chose to keep it */
    os.put({t:Date.now(),sc,s:txt},key)};const kq=os.getAllKeys();kq.onsuccess=()=>{const ks=(kq.result||[]).filter(k=>/^d\d+$/.test(k)).sort((a,b)=>+a.slice(1)-+b.slice(1));while(ks.length>7)os.delete(ks.shift())}})}catch(_){}}
function spList(cb){spDb(db=>{const os=db.transaction("s").objectStore("s"),out=[],cq=os.openCursor();cq.onsuccess=()=>{const c=cq.result;if(c){out.push({k:c.key,t:c.value.t,sc:c.value.sc});c.continue()}else cb(out.sort((a,b)=>b.t-a.t))};cq.onerror=()=>cb([])},()=>cb([]))}
function spRestore(key,done){spDb(db=>{const g=db.transaction("s").objectStore("s").get(key);g.onsuccess=()=>{try{const v=g.result,o=JSON.parse(v.s),kidsNow=S.kids;
    try{localStorage.setItem("ea-drill-before-restore",JSON.stringify(S))}catch(_){}
    S=Object.assign(blank(),o);try{if(kidsNow&&typeof kProgScore==="function"&&kProgScore(kidsNow)>=kProgScore(S.kids))S.kids=kidsNow}catch(_){}
    persist();spLast=S.upd;done&&done(true)}catch(_){done&&done(false)}};g.onerror=()=>done&&done(false)},()=>done&&done(false))}
function spWhen(t){const d=new Date(t);return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+", "+d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}
function spGuard(){spList(list=>{try{const cur=spScore(S),after=(S.set&&S.set.spKeep)||0,best=list.filter(x=>x.t>after).sort((a,b)=>b.sc-a.sc)[0];if(!best||best.sc<=cur*1.25+25)return;if(document.getElementById("sppop"))return;
  const o=document.createElement("div");o.id="sppop";o.innerHTML=`<div class="glsheet"><div class="glgrab"></div><div class="glt" style="font-size:20px">A saved copy has more progress</div><p>This device shows <b>${cur}</b> points of study progress. An automatic copy from <b>${esc(spWhen(best.t))}</b> has <b>${best.sc}</b>. That usually means the browser cleared this app's storage.</p><button class="btn pri" data-sp="restore" data-k="${esc(best.k)}" style="width:100%;min-height:50px">Restore the saved copy</button><button class="btn ghost small" data-sp="keep" style="width:100%;margin-top:8px">Keep what is on this device</button></div>`;document.body.appendChild(o)}catch(_){}})}
function spBox(){const box=document.getElementById("spbox");if(!box)return;spList(list=>{const b=document.getElementById("spbox");if(!b)return;
  b.innerHTML=`<b>Automatic safety copies</b><div class="small muted">A copy of all progress is kept on this device once a day for 7 days, separate from the main save. It protects against the browser clearing storage. It does not replace a backup file when you change phones.</div>${list.length?list.map(x=>`<div class="sprow"><span>${esc(spWhen(x.t))}<i>${x.sc} points</i></span><button class="btn small" data-sp="ask" data-k="${esc(x.k)}">Restore</button></div>`).join(""):`<div class="small">No copy yet. The first one is made after a few answers.</div>`}`})}
const spExtraClick0=extraClick;extraClick=function(b){const d=b.dataset;if(d.sp===undefined)return spExtraClick0(b);const pop=()=>{const o=document.getElementById("sppop");if(o)o.remove()};
  if(d.sp==="keep"){S.set.spKeep=Date.now();persist();pop();return true}
  if(d.sp==="ask"){if(b.dataset.sure){spRestore(d.k,ok=>{view="home";render();window.scrollTo(0,0)})}else{b.dataset.sure="1";b.textContent="Tap again to restore";b.classList.add("pri")}return true}
  if(d.sp==="restore"){spRestore(d.k,ok=>{pop();try{render()}catch(_){}});return true}
  return true};
const spRenderHome0=renderHome;renderHome=function(){spRenderHome0();try{const dt=[...document.querySelectorAll("#view details")].find(x=>/Settings and history/.test((x.querySelector("summary")||{}).textContent||""));if(dt&&!document.getElementById("spbox")){const c=document.createElement("div");c.id="spbox";c.className="card";c.style.margin="0 12px 12px";dt.appendChild(c);spBox()}}catch(_){}};
try{setTimeout(spGuard,900);setTimeout(()=>spSnap(),15000);setInterval(()=>spSnap(),300000);
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")spSnap()});window.addEventListener("pagehide",()=>spSnap());
  if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(_){}
