/* ================= Guided mode stays strict, with two limited overrides =================
   Free Pass: earned by finishing the whole daily Mission Path (+1, hold at most 2; a new player starts with 1).
   Using one opens free play for 10 minutes. Grown-up unlock: 30 minutes from the grown-up screen.
   During either, tickets are still earned normally, and step 1 stays required afterwards with its bonus waiting. */
function kPassLeft(){const k=KS();return Math.max(0,(k.passUntil||0)-Date.now())}
function kPassN(){const k=KS();if(k.pass===undefined){k.pass=1;persist()}return k.pass}
function kPathCheck(lines){const r=kRot();if(r.pathBon)return;const P=kPath();if(P.length===3&&P.every(id=>r.done[id])){r.pathBon=1;kTix(2,"🧭 Mission path complete");if(lines)lines.push("🧭 Mission path complete: +2 🎟️ bonus!");kTrophy("path1","🧭","Path finder!","Finished a daily Mission Path.");
  const k=KS(),n=kPassN();if(n<2){k.pass=n+1;persist();if(lines)lines.push("🎫 +1 Free Pass! Use it to skip step 1 for 10 minutes another day.");kLine("Mission path complete! Two bonus tickets and a Free Pass!",3)}else kLine("Mission path complete! Two bonus tickets!",3)}}
function kGate(d){if(kGate0(d))return true;if(typeof kJobsClick==="function"&&kJobsClick(d))return true;return !!(d&&!d.kpass&&!d.kwles&&!d.kwgui&&!d.kwterm&&d.klog===undefined&&typeof kLogGate==="function"&&kLogGate(d))}
function kGate0(d){
  if(d&&d.kpass==="use"){const k=KS();if(kPassN()>0){k.pass--;k.passUntil=Date.now()+10*60000;persist();kT("🎫 Free Pass on: 10 minutes of free play. Step 1 is still waiting, with its bonus tickets.");kBeep("yes");const sv=KV.passD;KV.passD=null;KV.passAsk=null;if(sv)setTimeout(()=>{const fb=document.createElement("button");Object.assign(fb.dataset,sv);kidsClick(fb)},0)}return true}
  if(d&&d.kpass==="go"){const I=KV.passAsk&&kPathInfo(KV.passAsk);KV.passAsk=null;KV.passD=null;if(I)setTimeout(()=>{const fb=document.createElement("button");if(I.x[3]==="kcat")fb.dataset.kcat=I.x[4];else fb.dataset.k=I.x[4];kidsClick(fb)},0);return true}
  if(d&&d.kpass==="no"){KV.passAsk=null;KV.passD=null;return true}
  if(d&&d.k==="tUnlock30"){const k=KS();k.passUntil=Date.now()+30*60000;k.adultUntil=Date.now()+30*60000;persist();kT("🔓 Free play for 30 minutes. Guided mode comes back after.");return true}
  if(d&&d.katc!==undefined&&typeof kAtcAns==="function"){kAtcAns(+d.katc);return true}
  if(d&&d.kwles&&typeof kWarmOpenLes==="function"){kWarmOpenLes(d.kwles);return true}
  if(d&&d.kwgui){kGuiStart(d.kwgui);return true}
  if(d&&d.k==="kSaveFile"){kSaveFile();return true}
  if(d&&d.k==="kLoadFile"){kLoadFile();return true}
  if(d&&d.kwterm){kWarmOpenTerm(d.kwterm);return true}
  if(d&&d.klog!==undefined&&typeof kLogAns==="function"){kLogAns(+d.klog);return true}
  if(d&&typeof kWarmGate==="function"&&kWarmGate(d))return true;
  if(d&&typeof kCt3Click==="function"&&kCt3Click(d))return true;
  if(d&&d.k==="tLimit"){const k=KS(),seq=[12,20,30,0,8],cur=k.glimit===0?0:(k.glimit||12);k.glimit=seq[(seq.indexOf(cur)+1)%seq.length];if(k.glimit===0)k.rest={};persist();kT(k.glimit?`⏳ Game limit: ${k.glimit} minutes per game between learning rounds.`:"⏳ Game limit off.");return true}
  if(typeof kRestCheck==="function"&&kRestCheck(d))return true;
  /* The warm-up comes before the Mission Path. While it is still needed, the warm-up gate above has already stopped the games,
     so the path gate must stay out of the way: otherwise the warm-up says "step 1 first" and step 1 says "warm-up first". */
  if(typeof kWarmNeeded==="function"&&kWarmNeeded())return false;
  const m=kMust();if(!m)return false;const id=kPlayKey(d);if(!id||id===m)return false;const I=kPathInfo(m);if(!I)return false;
  if(kPassLeft()>0)return false;
  kBeep("no");kLine(`First, ${I.x[2]}! Then everything opens.`,2);
  KV.passAsk=m;KV.passD=Object.assign({},d);setTimeout(kPassShow,0);return true}
function kPassShow(){const m=KV.passAsk;if(!m)return;const I=kPathInfo(m);if(!I)return;const n=kPassN();document.querySelectorAll(".kpassov").forEach(x=>x.remove());
  const o=document.createElement("div");o.className="kpassov";
  o.innerHTML=`<div class="kpassc"><div style="font-size:44px">🧭</div><div class="kh" style="margin:4px 0">Step 1 first: ${I.x[1]} ${esc(I.x[2])}</div>
   <div class="small" style="margin-bottom:12px">Win one round of it and everything opens, with bonus tickets.</div>
   <button class="kbtn green" data-kpass="go" style="width:100%">▶ Do step 1 now</button>
   ${n>0?`<button class="kbtn" data-kpass="use" style="width:100%;margin-top:8px">🎫 Use a Free Pass · 10 min (you have ${n})</button>`:`<div class="small" style="margin-top:10px">🎫 No Free Pass right now. Finish a whole Mission Path to earn one.</div>`}
   <button class="kbtn ghost" data-kpass="no" style="width:100%;margin-top:8px">Not now</button></div>`;
  (document.getElementById("view")||document.body).appendChild(o)}
