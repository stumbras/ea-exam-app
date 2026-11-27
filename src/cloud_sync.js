/* Google sign-in progress sync (web, installed app and store apps). One saved copy per Google account at
   sync.solvinglifewith.com; same origin for EA, Series 65, EDPNA and kids, so one sign-in saves all of them.
   Local progress stays the main copy; the cloud copy is pushed a few seconds after changes and pulled on start. */
(function(){
function csInit(){
if(typeof HOSTED==="undefined"||!HOSTED)return;
const CS_URL="https://sync.solvinglifewith.com",CS_CID="184315933690-kq6qmc1qjsi177ht716s3ignsn0osd4u.apps.googleusercontent.com",CS_K="slCloud";
let cs=null;try{cs=JSON.parse(localStorage.getItem(CS_K)||"null")}catch(_){}
/* Installed iPhone/Android app: Google's pop-up can't report back to a home-screen app, so it uses Google's redirect sign-in.
   The server sends the person back with #gsi=<one-time code>, which is swapped here for the normal sign-in result. */
function csStandalone(){try{return matchMedia("(display-mode: standalone)").matches||navigator.standalone===true}catch(_){return false}}
setTimeout(async()=>{const h=location.hash;if(!/[#&]gsi(err)?=/.test(h))return;const m=h.match(/gsi=([0-9a-f]+)/);history.replaceState(null,"",location.pathname+location.search);
  if(!m){csMsg="Google sign-in did not work. Please try again, or use an email code.";return csModal()}
  try{const{st,j}=await csReq("/gsi/claim",{code:m[1]});if(st!==200||!j.token){csMsg=j.error||"Sign-in did not work. Please try again.";return csModal()}await csDone(j)}catch(_){csMsg="No connection. Please try again.";csModal()}},0);
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
function csLater(ms){if(!cs)return;if(ms){clearTimeout(csT);csT=setTimeout(()=>{csT=0;csPush()},ms);return}if(csT)return;csT=setTimeout(()=>{csT=0;csPush()},60000)} // at most one cloud save a minute while studying (plus one when the app is closed or hidden)
const _persist=window.persist;if(typeof _persist==="function")window.persist=function(){const r=_persist.apply(this,arguments);csLater();return r};
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&cs){clearTimeout(csT);csT=0;csPush()}});
async function csOnCred(resp){csMsg="Checking your Google account…";csModal();
  try{const{st,j}=await csReq("/login",{id_token:resp.credential});if(st!==200||!j.token){csMsg=j.error||"Sign-in did not work. Please try again.";return csModal()}
    await csDone(j)}
  catch(_){csMsg="No connection. Please try again when you're online.";csModal()}}
async function csDone(j){
    cs={token:j.token,email:j.email,name:j.name,last:0,acc:j.access?{access:j.access,usedMs:j.usedMs,limitMs:j.limitMs,at:Date.now()}:null};csSave();csChip();setTimeout(acDraw,50);
    if(csDecide(j.saved)==="pull"){csMsg="Found your saved progress. Loading it…";csModal();return setTimeout(()=>csApply(j.saved.data),600)}
    await csPush();csMsg="Done! Your progress is now saved to "+j.email+". Sign in with the same email on any phone or computer to continue.";csModal()}
let csMailTo="",csMailSent=false;
function csMailHtml(){return csMailSent?`<div style="margin-top:12px"><p style="margin:0 0 6px">We emailed a 6-digit code to <b>${esc(csMailTo)}</b>. Check inbox and spam.</p><input id="cscode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456" style="width:100%;box-sizing:border-box;font-size:22px;letter-spacing:6px;text-align:center;padding:10px;border-radius:12px;border:1px solid #9aa7b2;background:#fff;color:#10202e;-webkit-text-fill-color:#10202e"><div style="display:flex;gap:8px;margin-top:8px"><button id="csverify" style="background:#0f766e;color:#fff;border:0;border-radius:12px;padding:13px 16px;font:700 16px system-ui;flex:1">Sign in</button><button id="csback" style="background:#e3ebf0;color:#10202e;border:1px solid #c9d3db;border-radius:12px;padding:12px 14px;font:700 15px system-ui">Change email</button></div></div>`
  :`<div style="margin-top:12px"><p style="margin:0 0 6px;font-weight:700">Or sign in with an email code</p><input id="csmail" type="email" autocomplete="email" placeholder="you@example.com" value="${esc(csMailTo)}" style="width:100%;box-sizing:border-box;font-size:16px;padding:12px;border-radius:12px;border:1px solid #9aa7b2;background:#fff;color:#10202e;-webkit-text-fill-color:#10202e"><button id="cssend" style="background:#0f766e;color:#fff;border:0;border-radius:12px;padding:13px 16px;font:700 16px system-ui;width:100%;margin-top:8px">Email me a code</button></div>`}
function csMailWire(){const sd=document.getElementById("cssend");if(sd)sd.onclick=async()=>{const e=(document.getElementById("csmail").value||"").trim();if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e)){csMsg="Please type a valid email address.";return csModal()}
    csMailTo=e;csMsg="Sending your code…";csModal();try{const{st,j}=await csReq("/mail/start",{email:e});if(st!==200){csMsg=j.error||"Could not send the code.";return csModal()}csMailSent=true;csMsg="";csModal()}catch(_){csMsg="No connection. Please try again.";csModal()}};
  const v=document.getElementById("csverify");if(v)v.onclick=async()=>{const c=(document.getElementById("cscode").value||"").replace(/\D/g,"");if(c.length!==6){csMsg="Type the 6-digit code from the email.";return csModal()}
    csMsg="Checking your code…";csModal();try{const{st,j}=await csReq("/mail/verify",{email:csMailTo,code:c});if(st!==200||!j.token){csMsg=j.error||"That code did not work.";return csModal()}csMailSent=false;await csDone(j)}catch(_){csMsg="No connection. Please try again.";csModal()}};
  const bk=document.getElementById("csback");if(bk)bk.onclick=()=>{csMailSent=false;csMsg="";csModal()}}
function csGis(cb){if(window.google&&google.accounts&&google.accounts.id)return cb();const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=cb;s.onerror=()=>{csMsg="Google sign-in could not load. Check your connection.";csModal()};document.head.appendChild(s)}
function csInApp(){return /FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|Line\/|TikTok|musical_ly|Snapchat|Twitter|; wv\)/i.test(navigator.userAgent)}
function csModal(){let m=document.getElementById("csmodal");if(!m){m=document.createElement("div");m.id="csmodal";document.body.appendChild(m);if(!document.getElementById("csmodalcss")){const st=document.createElement("style");st.id="csmodalcss";st.textContent="#csmodal .btn{background:#0f766e!important;color:#fff!important;border:0!important}#csmodal .btn.ghost{background:#fff!important;color:#10202e!important;border:2px solid #10202e!important}#csmodal input{background:#fff!important;color:#10202e!important;-webkit-text-fill-color:#10202e}#csmodal a{color:#1d5fd1}";document.head.appendChild(st)}}
  m.style.cssText="position:fixed;inset:0;z-index:9999;background:rgba(10,15,30,.6);display:flex;align-items:center;justify-content:center;padding:18px";
  const when=cs&&cs.last?new Date(cs.last).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}):"";
  m.innerHTML=`<div style="background:#fff;color:#10202e;max-width:420px;width:100%;border-radius:20px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.35);font:16px/1.45 system-ui,sans-serif">
   <div style="font-size:22px;font-weight:800;margin-bottom:6px">☁️ Keep your progress</div>
   ${cs?`<p style="margin:0 0 10px">Signed in as <b>${esc(cs.email||"")}</b>. Your progress in every Solving Life app saves to your Google account${when?` (last saved ${when})`:""}.</p>
     <div style="display:flex;gap:10px;flex-wrap:wrap"><button id="csnow" class="btn">Save now</button><button id="csout" class="btn ghost">Sign out</button><button id="csx" class="btn ghost">Close</button></div>`
   :`<p style="margin:0 0 12px">Sign in with Google or an email code to save your progress and continue on any phone or computer. We only use your name and email to find your saved progress.</p>
     <div id="csbtn" style="min-height:44px;display:flex;justify-content:center"></div>
     ${csMailHtml()}
     <p style="font-size:13px;opacity:.75;margin:12px 0 0">Signing in starts your free hour and saves your progress. <a href="https://solvinglifewith.com/privacy.html" target="_blank" rel="noopener">Privacy</a></p>
     <div style="margin-top:12px;text-align:right"><button id="csx" class="btn ghost">Not now</button></div>`}
   ${csMsg?`<p style="margin:12px 0 0;font-weight:600">${esc(csMsg)}</p>`:""}</div>`;
  const close=()=>{m.remove();csMsg="";setTimeout(()=>{try{acDraw()}catch(_){}},30)};m.onclick=e=>{if(e.target===m)close()};
  const x=document.getElementById("csx");if(x)x.onclick=close;csMailWire();
  const o=document.getElementById("csout");if(o)o.onclick=()=>{cs=null;csSave();csChip();try{google.accounts.id.disableAutoSelect()}catch(_){}close()};
  const n=document.getElementById("csnow");if(n)n.onclick=async()=>{csMsg="Saving…";csModal();await csPush();csMsg="Saved.";csModal()};
  if(!cs&&csInApp()){const b=document.getElementById("csbtn");if(b){const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),u=location.href.replace(/^http:/,"https:"),go=ios?"x-safari-"+u:"intent://"+u.replace(/^https:\/\//,"")+"#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url="+encodeURIComponent(u)+";end";
    b.style.cssText="display:block";b.innerHTML=`<p style="margin:0 0 10px;font-weight:700">Google sign-in does not work inside Messenger, Facebook or Instagram. Use the email code below, or open the app in ${ios?"Safari":"Chrome"} for Google sign-in:</p><a href="${go}" style="display:block;text-align:center;background:#1a73e8;color:#fff;font-weight:800;padding:14px;border-radius:999px;text-decoration:none">Open in ${ios?"Safari":"Chrome"}</a><p style="font-size:13px;margin:10px 0 0;opacity:.8">If nothing happens: tap ••• at the top, then <b>Open in ${ios?"Safari":"browser"}</b>.</p><button id="cscopy" style="background:#e3ebf0;color:#10202e;border:1px solid #c9d3db;border-radius:12px;padding:12px 14px;font:700 15px system-ui;margin-top:8px">Copy link</button>`;
    const cp=document.getElementById("cscopy");if(cp)cp.onclick=()=>{try{navigator.clipboard.writeText(u);cp.textContent="Copied ✓"}catch(_){}}}return}
    if(!cs&&csStandalone()){const b=document.getElementById("csbtn");if(b){const nn=Math.random().toString(36).slice(2),q=new URLSearchParams({client_id:CS_CID,redirect_uri:CS_URL+"/gsi",response_type:"id_token",scope:"openid email profile",response_mode:"form_post",nonce:nn,prompt:"select_account"});
    b.style.cssText="display:block";b.innerHTML=`<a href="https://accounts.google.com/o/oauth2/v2/auth?${q}" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#1a73e8;color:#fff;font:700 16px system-ui;padding:13px;border-radius:999px;text-decoration:none"><span style="background:#fff;border-radius:50%;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;color:#1a73e8;font-weight:900">G</span>Sign in with Google</a>`}}
  else if(!cs)csGis(()=>{try{google.accounts.id.initialize(Object.assign({client_id:CS_CID,callback:csOnCred,auto_select:false,ux_mode:"popup"},csStandalone()?{ux_mode:"redirect",login_uri:CS_URL+"/gsi"}:{}));
    const b=document.getElementById("csbtn");if(b)google.accounts.id.renderButton(b,{theme:"filled_blue",size:"large",shape:"pill",text:"signin_with",width:280,locale:"en"})}catch(_){}})}

/* ---------- ACCESS: free 60-minute preview per Google account, then full access for people the owner adds in his hub.
   Kids (Becoming Genius) is always free. Not signed in = a sign-in screen on the exam apps. ---------- */
const AC_BUY="https://www.solvinglifellc.com/product-page/all-4-exam-study-apps-12-months-buy-one-get-all";
let acLast=Date.now(),acPend=0,acBusy=false;
["pointerdown","keydown","touchstart","scroll"].forEach(ev=>document.addEventListener(ev,()=>{acLast=Date.now()},{passive:true,capture:true}));
function acKids(){try{return (typeof view!=="undefined"&&view==="kids")||(typeof part!=="undefined"&&typeof PARTS!=="undefined"&&PARTS[part]&&PARTS[part].free&&typeof view!=="undefined"&&view!=="start")||(typeof SLAPP==="function"&&["cit","drive","moto"].includes(SLAPP()))||(typeof SLAPP==="function"&&SLAPP()==="kids")||document.body.classList.contains("kidsmode")}catch(_){return false}}
function acState(){if(!cs)return"out";const a=cs.acc;if(!a)return"unknown";return a.access}
function acLeft(){const a=cs&&cs.acc,m=a?Math.max(0,Math.ceil(((a.limitMs||3600000)-(a.usedMs||0))/60000)):60;return m>=2880?Math.floor(m/1440)+" days":m>=120?Math.floor(m/60)+" h":m+" min"}
async function acCheck(){if(!cs||acBusy)return;acBusy=true;try{const{st,j}=await csReq("/status");if(st===200&&j.access){if(!j.email){cs=null;csSave();csChip()}else{cs.acc=Object.assign(j,{at:Date.now()});csSave()}}}catch(_){}finally{acBusy=false;acDraw()}}
async function acTick(){if(!cs||!cs.acc||cs.acc.access!=="trial"||acPend<5000)return;const ms=acPend;acPend=0;
  try{const{st,j}=await csReq("/tick",{ms});if(st===200&&j.access){cs.acc=Object.assign(j,{at:Date.now()});csSave()}else acPend+=ms}catch(_){acPend+=ms}acDraw()}
function acBadge(show){let b=document.getElementById("acbadge");if(!show){if(b)b.remove();return}
  if(!b){b=document.createElement("button");b.id="acbadge";b.style.cssText="position:fixed;right:10px;bottom:10px;z-index:60;border:0;border-radius:999px;padding:8px 13px;font:700 13px system-ui;background:#ffd666;color:#3a2a00;box-shadow:0 4px 14px rgba(0,0,0,.25)";b.onclick=()=>window.open(AC_BUY,"_blank");document.body.appendChild(b)}
  b.textContent="Free preview · "+acLeft()+" left · Get full access"}
function acWall(kind){let w=document.getElementById("acwall");if(!kind){if(w)w.remove();return}
  if(w&&w.dataset.k===kind)return;if(!w){w=document.createElement("div");w.id="acwall";document.body.appendChild(w)}w.dataset.k=kind;
  w.style.cssText="position:fixed;inset:0;z-index:9000;background:linear-gradient(160deg,#0f2e47,#1a6b55);color:#fff;display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto";
  const kidsLink=`<p style="margin:16px 0 0;font-size:14px;opacity:.85">The kids app is always free: <a style="color:#ffd666" href="./?kids">Becoming Genius</a></p>`;
  w.innerHTML=kind==="out"?`<div style="max-width:440px;text-align:center;font:16px/1.5 system-ui,sans-serif">
    <div style="font-size:44px">🎓</div><div style="font:700 13px system-ui;letter-spacing:.08em;text-transform:uppercase;opacity:.8">${(document.title||"Solving Life Academy").replace(/[<>&"]/g,"")}</div><h2 style="font-size:26px;margin:6px 0">Start your free hour</h2>
    <p>Sign in with Google or an email code to study free for 60 minutes. Your progress is saved to your account and follows you to every phone and computer.</p>
    <button id="acin" style="border:0;border-radius:999px;padding:14px 22px;font:800 17px system-ui;background:#ffd666;color:#3a2a00;margin-top:8px">Sign in (Google or email)</button>
    <p style="margin:14px 0 0"><a style="color:#ffd666" href="${AC_BUY}" target="_blank" rel="noopener">See full access options</a></p>${kidsLink}</div>`
  :`<div style="max-width:440px;text-align:center;font:16px/1.5 system-ui,sans-serif">
    <div style="font-size:44px">⏰</div><h2 style="font-size:26px;margin:6px 0">Your free hour is done</h2>
    <p>Hope it helped! Get full access to every Solving Life exam app (EA, Series 65, EDPNA and Customs Broker), always updated, with your progress kept.</p>
    <a href="${AC_BUY}" target="_blank" rel="noopener" style="display:inline-block;border-radius:999px;padding:14px 22px;font:800 17px system-ui;background:#ffd666;color:#3a2a00;text-decoration:none;margin-top:8px">Get full access: $49 for all 5 apps</a>
    <p style="font-size:14px;margin:8px 0 0;opacity:.9">Pay with the same email you signed in with (<b>${esc(cs&&cs.email||"")}</b>). Access opens in about a minute: come back and tap "I already paid".</p>
    <p style="margin:14px 0 0;display:flex;gap:6px;justify-content:center;flex-wrap:wrap"><input id="accode" placeholder="Have a code?" style="border:0;border-radius:999px;padding:10px 14px;font:600 15px system-ui;width:150px;text-transform:uppercase"><button id="acapply" style="border:0;border-radius:999px;padding:10px 14px;font:700 15px system-ui;background:#fff;color:#0f2e47">Apply</button></p>
    <p style="margin:10px 0 0"><button id="acre" style="background:none;border:1px solid #fff8;color:#fff;border-radius:999px;padding:9px 14px;font:600 14px system-ui">I already paid: check again</button></p>
    <p style="font-size:14px;opacity:.85">Signed in as ${esc(cs&&cs.email||"")} · <a style="color:#ffd666" href="#" id="acsw">use another account</a></p>${kidsLink}</div>`;
  const i=document.getElementById("acin");if(i)i.onclick=()=>csModal();
  const r=document.getElementById("acre");if(r)r.onclick=async()=>{r.textContent="Checking…";await acCheck();if(acState()!=="full")r.textContent="Not yet. Message us at info@solvinglifellc.com with this email."};
  const ap=document.getElementById("acapply");if(ap)ap.onclick=async()=>{const c=(document.getElementById("accode").value||"").trim();if(!c)return;ap.textContent="…";
    try{const{st,j}=await csReq("/redeem",{code:c});if(st===200&&j.access){cs.acc=Object.assign(j,{at:Date.now()});csSave();acDraw()}else{ap.textContent=j.error||"Not valid";return}}catch(_){ap.textContent="Offline"}};
  const sw=document.getElementById("acsw");if(sw)sw.onclick=e=>{e.preventDefault();cs=null;csSave();csChip();acDraw();csModal()}}
const AC_ON=/(^|\.)solvinglifewith\.com$|\.workers\.dev$|\.github\.io$/.test(location.hostname);
function acDraw(){if(!AC_ON||acKids()){acWall(null);acBadge(false);return}const st=acState();
  if(st==="out"){acBadge(false);if(!document.getElementById("csmodal"))acWall("out");else acWall(null);return}
  if(st==="expired"){acBadge(false);acWall("expired");return}
  acWall(null);acBadge(st==="trial")}
setInterval(()=>{if(cs&&cs.acc&&cs.acc.access==="trial"&&!acKids()&&document.visibilityState==="visible"&&Date.now()-acLast<120000)acPend+=15000},15000);
setInterval(acTick,180000);setInterval(acDraw,4000);setInterval(acCheck,10*60000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")acTick();else acCheck()});
window.slAccess={check:acCheck,draw:acDraw};
window.slCloudOpen=csModal;
document.addEventListener("click",e=>{const c=e.target.closest&&e.target.closest("#sync");if(c){e.stopImmediatePropagation();csModal()}},true);
async function csStart(){csChip();try{acDraw()}catch(_){}if(!cs)return;acCheck();try{if(sessionStorage.getItem("slCloudPulled")){sessionStorage.removeItem("slCloudPulled");return csLater(2000)}}catch(_){}
  try{const{st,j}=await csReq("/load");if(st!==200)return;if(csDecide(j.saved)==="pull")return csApply(j.saved.data);csLater(3000)}catch(_){}}
function csKid(){const k=document.body.classList.contains("kidsmode");let b=document.getElementById("cskid");
  if(!k){if(b)b.remove();return}if(!b){b=document.createElement("button");b.id="cskid";b.style.cssText="position:fixed;left:10px;bottom:10px;z-index:50;border:0;border-radius:999px;padding:8px 12px;font:600 13px system-ui;background:rgba(255,255,255,.92);color:#123;box-shadow:0 4px 14px rgba(0,0,0,.25)";b.onclick=e=>{e.stopPropagation();csModal()};document.body.appendChild(b)}
  b.textContent=cs?("☁️ Saved"):"🔐 Parents: save progress";b.title=cs?("Saved to "+(cs.email||"Google")):"Sign in with Google to save progress";b.style.background=cs?"rgba(255,255,255,.85)":"#1a73e8";b.style.color=cs?"#123":"#fff";b.style.padding=cs?"6px 10px":"9px 13px";b.style.fontSize=cs?"12px":"13.5px";b.style.opacity=cs?".8":"1";document.body.style.paddingBottom="56px"}
setTimeout(csStart,1200);setInterval(()=>{csChip();csKid()},3000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",csInit);else setTimeout(csInit,0);
})();
