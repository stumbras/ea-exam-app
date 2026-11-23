/* ================= Progress safety: nothing he earns is ever lost =================
   1) every save writes the main copy + kidsBackup (app.html persist)
   2) a daily snapshot (last 5 days) in localStorage + a copy in IndexedDB, refreshed every 2 min and when the app goes to the background
   3) on start, if the progress looks empty or smaller than a saved copy, the biggest copy comes back
   4) grown-ups can save a progress file (share to Files / email) and load it on a new phone */
function kProgScore(k){if(!k||!k.setup)return 0;const T=k.term||{},g=T.gui||{};return (k.xp||0)+Object.keys(k.badges||{}).length*20+((k.chess||{}).solved||0)*5+(T.lv||0)*10+(g.win||0)+(g.mac||0)+(g.mint||0)+Object.keys((kLearnSafe(k).done)||{}).length*10}
function kLearnSafe(k){try{return k.learn||{}}catch(_){return{}}}
function kSnapList(){try{return JSON.parse(localStorage.getItem("kidsSnaps")||"[]")}catch(_){return[]}}
function kIdb(fn){try{const r=indexedDB.open("kidsSave",1);r.onupgradeneeded=()=>{try{r.result.createObjectStore("s")}catch(_){}};r.onsuccess=()=>{try{fn(r.result)}catch(_){}}}catch(_){}}
function kSnap(){const k=S.kids;if(!k||!k.setup)return;const txt=JSON.stringify(k),day=kToday();
  try{let a=kSnapList().filter(x=>x.d!==day);a.push({d:day,sc:kProgScore(k),k:txt});while(a.length>5)a.shift();localStorage.setItem("kidsSnaps",JSON.stringify(a))}catch(_){}
  kIdb(db=>{db.transaction("s","readwrite").objectStore("s").put({sc:kProgScore(k),k:txt,t:Date.now()},"kids")})}
function kRestoreFrom(txt,why){try{const k=JSON.parse(txt);if(!k||!k.setup)return false;S.kids=k;persist();kT(`Progress restored ✅ ${why||""}`);return true}catch(_){return false}}
function kGuardProgress(){const cur=kProgScore(S.kids);let best=null;
  for(const x of kSnapList())if((x.sc||0)>cur*1.25+30&&(!best||x.sc>best.sc))best=x;
  try{const b=localStorage.getItem("kidsBackup");if(b){const bk=JSON.parse(b),sc=kProgScore(bk);if(sc>cur*1.25+30&&(!best||sc>best.sc))best={sc,k:b}}}catch(_){}
  if(best){kRestoreFrom(best.k);try{render()}catch(_){}return}
  kIdb(db=>{const g=db.transaction("s").objectStore("s").get("kids");g.onsuccess=()=>{const v=g.result;if(v&&v.k&&(v.sc||0)>kProgScore(S.kids)*1.25+30){if(kRestoreFrom(v.k))try{render()}catch(_){}}}})}
try{setTimeout(kGuardProgress,600);setInterval(kSnap,120000);setTimeout(kSnap,8000);document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){try{persist()}catch(_){}kSnap()}});window.addEventListener("pagehide",()=>{try{persist()}catch(_){}kSnap()})}catch(_){}
function kSaveText(){return JSON.stringify({app:"rocket-genius",v:1,saved:new Date().toISOString(),kids:S.kids})}
function kSaveFile(){const k=KS(),name=`${(k.name||"kid").replace(/[^a-z0-9]/gi,"")}-progress-${kToday()}.json`,text=kSaveText();
  const done=()=>{k.bkT=Date.now();persist();kT("💾 Progress file saved. Keep it in Files, Google Drive or email.");try{render()}catch(_){}};
  try{const f=new File([text],name,{type:"application/json"});if(navigator.canShare&&navigator.canShare({files:[f]})&&/iPhone|iPad|Android/i.test(navigator.userAgent)){navigator.share({files:[f],title:"Becoming Genius progress"}).then(done).catch(e=>{if(!e||e.name!=="AbortError")kSaveDl(name,text,done)});return}}catch(_){}
  kSaveDl(name,text,done)}
function kSaveDl(name,text,done){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"application/json"}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);done()}catch(_){kT("Couldn't save a file here.")}}
function kLoadFile(){const i=document.createElement("input");i.type="file";i.accept=".json,application/json";i.onchange=()=>{const f=i.files&&i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{let k=null;try{const o=JSON.parse(r.result);k=o.kids||(o.state&&o.state.kids)||null}catch(_){}
    if(!k||!k.setup){kT("That file has no Becoming Genius progress.");return}const now=kProgScore(S.kids),f2=kProgScore(k);
    if(f2<now&&!KV.loadSure){KV.loadSure=1;kT("That file has LESS progress than this phone. Tap Load again to use it anyway.");return}KV.loadSure=0;kSnap();S.kids=k;persist();kSnap();kT("📂 Progress loaded ✅");try{render()}catch(_){}};r.readAsText(f)};i.click()}
function kSaveHtml(){const k=KS(),d=k.bkT?Math.floor((Date.now()-k.bkT)/86400000):null;return `<div class="small" style="margin-top:8px">💾 Progress is saved on this phone automatically, with backup copies. ${d===null?"Save a progress file once so it survives a new phone or a deleted app.":d>7?`Last progress file: ${d} days ago. Save a fresh one.`:`Last progress file: ${d===0?"today":d+" days ago"}.`}</div><button class="kbtn ghost" data-k="kSaveFile">💾 Save progress file</button> <button class="kbtn ghost" data-k="kLoadFile">📂 Load progress file</button>`}
