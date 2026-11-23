/* Google sign-in progress sync (web, installed app and store apps). One saved copy per Google account at
   sync.solvinglifewith.com; same origin for EA, Series 65, EDPNA and kids, so one sign-in saves all of them.
   Local progress stays the main copy; the cloud copy is pushed a few seconds after changes and pulled on start. */
(function(){
function csInit(){
if(typeof HOSTED==="undefined"||!HOSTED)return;
const CS_URL="https://sync.solvinglifewith.com",CS_CID="184315933690-kq6qmc1qjsi177ht716s3ignsn0osd4u.apps.googleusercontent.com",CS_K="slCloud";
let cs=null;try{cs=JSON.parse(localStorage.getItem(CS_K)||"null")}catch(_){}
let csT=0,csBusy=false,csMsg="";
const csSave=()=>{try{cs?localStorage.setItem(CS_K,JSON.stringify(cs)):localStorage.removeItem(CS_K)}catch(_){}};
const csScore=o=>{try{return typeof spScore==="function"?spScore(o):JSON.stringify(o).length/1000}catch(_){return 0}};
function csChip(){const el=document.getElementById("sync"),tx=document.getElementById("synctext");if(!el||!tx)return;
  el.style.cursor="pointer";el.title=cs?"Progress saved to your Google account":"Sign in with Google to keep your progress on every device";
  el.classList.toggle("ok",!!cs);tx.textContent=cs?("☁️ Saved to "+(cs.email||"your account")):"☁️ Sign in to save progress"}
const _setSync=window.setSync;if(typeof _setSync==="function")window.setSync=function(){_setSync.apply(this,arguments);csChip()};
function csApply(data){try{localStorage.setItem("ea-drill-before-restore",localStorage.getItem(LKEY)||"")}catch(_){}
  try{localStorage.setItem(LKEY,data);sessionStorage.setItem("slCloudPulled","1")}catch(_){}location.reload()}
async function csReq(path,body){const r=await fetch(CS_URL+path,{method:body?"POST":"GET",headers:Object.assign({"content-type":"application/json"},cs&&cs.token?{authorization:"Bearer "+cs.token}:{}),body:body?JSON.stringify(body):undefined});
  const j=await r.json().catch(()=>({}));if(r.status===401&&path!=="/login"){cs=null;csSave();csChip()}return{st:r.status,j}}
function csDecide(saved){ // newer cloud copy with at least as much progress wins; otherwise this device's copy is pushed
  if(!saved||!saved.data)return"push";let o=null;try{o=JSON.parse(saved.data)}catch(_){return"push"}
  if((saved.upd||0)<=(S.upd||0)+3000)return"push";return csScore(o)>=csScore(S)*0.9?"pull":"push"}
async function csPush(){if(!cs||csBusy)return;csBusy=true;try{S.upd=S.upd||Date.now();
  const{st,j}=await csReq("/save",{upd:S.upd,data:JSON.stringify(S)});
  if(st===409&&j.saved){if(csDecide(j.saved)==="pull")return csApply(j.saved.data);S.upd=Date.now();try{localStorage.setItem(LKEY,JSON.stringify(S))}catch(_){}await csReq("/save",{upd:S.upd,data:JSON.stringify(S)})}
  if(st===200){cs.last=Date.now();csSave()}}catch(_){}finally{csBusy=false}}
function csLater(ms){if(!cs)return;clearTimeout(csT);csT=setTimeout(csPush,ms||8000)}
const _persist=window.persist;if(typeof _persist==="function")window.persist=function(){const r=_persist.apply(this,arguments);csLater();return r};
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&cs){clearTimeout(csT);csPush()}});
async function csOnCred(resp){csMsg="Checking your Google account…";csModal();
  try{const{st,j}=await csReq("/login",{id_token:resp.credential});if(st!==200||!j.token){csMsg=j.error||"Sign-in did not work. Please try again.";return csModal()}
    cs={token:j.token,email:j.email,name:j.name,last:0};csSave();csChip();
    if(csDecide(j.saved)==="pull"){csMsg="Found your saved progress. Loading it…";csModal();return setTimeout(()=>csApply(j.saved.data),600)}
    await csPush();csMsg="Done! Your progress is now saved to "+j.email+". Sign in with the same Google account on any phone or computer to continue.";csModal()}
  catch(_){csMsg="No connection. Please try again when you're online.";csModal()}}
function csGis(cb){if(window.google&&google.accounts&&google.accounts.id)return cb();const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=cb;s.onerror=()=>{csMsg="Google sign-in could not load. Check your connection.";csModal()};document.head.appendChild(s)}
function csModal(){let m=document.getElementById("csmodal");if(!m){m=document.createElement("div");m.id="csmodal";document.body.appendChild(m)}
  m.style.cssText="position:fixed;inset:0;z-index:9999;background:rgba(10,15,30,.6);display:flex;align-items:center;justify-content:center;padding:18px";
  const when=cs&&cs.last?new Date(cs.last).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}):"";
  m.innerHTML=`<div style="background:var(--card,#fff);color:var(--ink,#111);max-width:420px;width:100%;border-radius:20px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.35);font:16px/1.45 system-ui,sans-serif">
   <div style="font-size:22px;font-weight:800;margin-bottom:6px">☁️ Keep your progress</div>
   ${cs?`<p style="margin:0 0 10px">Signed in as <b>${esc(cs.email||"")}</b>. Your progress in every Solving Life app saves to your Google account${when?` (last saved ${when})`:""}.</p>
     <div style="display:flex;gap:10px;flex-wrap:wrap"><button id="csnow" class="btn">Save now</button><button id="csout" class="btn ghost">Sign out</button><button id="csx" class="btn ghost">Close</button></div>`
   :`<p style="margin:0 0 12px">Sign in with Google to save your progress and continue on any phone or computer. We only use your name and email to find your saved progress.</p>
     <div id="csbtn" style="min-height:44px;display:flex;justify-content:center"></div>
     <p style="font-size:13px;opacity:.75;margin:12px 0 0">Not signed in, your progress still stays on this device. <a href="https://solvinglifewith.com/privacy.html" target="_blank" rel="noopener">Privacy</a></p>
     <div style="margin-top:12px;text-align:right"><button id="csx" class="btn ghost">Not now</button></div>`}
   ${csMsg?`<p style="margin:12px 0 0;font-weight:600">${esc(csMsg)}</p>`:""}</div>`;
  const close=()=>{m.remove();csMsg=""};m.onclick=e=>{if(e.target===m)close()};
  const x=document.getElementById("csx");if(x)x.onclick=close;
  const o=document.getElementById("csout");if(o)o.onclick=()=>{cs=null;csSave();csChip();try{google.accounts.id.disableAutoSelect()}catch(_){}close()};
  const n=document.getElementById("csnow");if(n)n.onclick=async()=>{csMsg="Saving…";csModal();await csPush();csMsg="Saved.";csModal()};
  if(!cs)csGis(()=>{try{google.accounts.id.initialize({client_id:CS_CID,callback:csOnCred,auto_select:false,ux_mode:"popup"});
    const b=document.getElementById("csbtn");if(b)google.accounts.id.renderButton(b,{theme:"filled_blue",size:"large",shape:"pill",text:"signin_with",width:280})}catch(_){}})}
window.slCloudOpen=csModal;
document.addEventListener("click",e=>{const c=e.target.closest&&e.target.closest("#sync");if(c){e.stopImmediatePropagation();csModal()}},true);
async function csStart(){csChip();if(!cs)return;try{if(sessionStorage.getItem("slCloudPulled")){sessionStorage.removeItem("slCloudPulled");return csLater(2000)}}catch(_){}
  try{const{st,j}=await csReq("/load");if(st!==200)return;if(csDecide(j.saved)==="pull")return csApply(j.saved.data);csLater(3000)}catch(_){}}
function csKid(){const k=document.body.classList.contains("kidsmode");let b=document.getElementById("cskid");
  if(!k){if(b)b.remove();return}if(!b){b=document.createElement("button");b.id="cskid";b.style.cssText="position:fixed;left:10px;bottom:10px;z-index:50;border:0;border-radius:999px;padding:8px 12px;font:600 13px system-ui;background:rgba(255,255,255,.92);color:#123;box-shadow:0 4px 14px rgba(0,0,0,.25)";b.onclick=e=>{e.stopPropagation();csModal()};document.body.appendChild(b)}
  b.textContent=cs?"☁️ Saved":"☁️ Parents: save progress"}
setTimeout(csStart,1200);setInterval(()=>{csChip();csKid()},3000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",csInit);else setTimeout(csInit,0);
})();
