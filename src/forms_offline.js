/* Forms work offline (Version 2026-11-26n).
   Asked for: "clicked on form number but it kept loading never came up in offline mode" and "make sure all forms load in offline mode too".
   - All forms (about 24 MB: the box lists plus every page picture) are saved on the device in the background the first times the
     app is open with internet, a few at a time, into their own store that app updates never wipe. Form library shows the progress
     and has a "Save all now" button.
   - Opening a form never spins forever: if it can't load in 10 seconds it says why (offline and not saved yet) with "Try again". */
const FOFF="ea-forms-v1";
function foUrl(p){return new URL("forms/"+p,document.baseURI).href}
function foFiles(k){const n=(FORMIDX[k]&&FORMIDX[k][1])||1,a=[k+".json"];for(let i=0;i<n;i++)a.push(k+"-"+i+".webp");return a}
function foLoadSt(){try{return JSON.parse(localStorage.getItem("foSaved")||"{}")}catch(e){return {}}}
let FOSAVED=foLoadSt(),FORUN=false,FONOTE="";
function foDone(){return Object.keys(FORMIDX).filter(k=>FOSAVED[k]).length}
async function foTimed(url,ms){const c=typeof AbortController!=="undefined"?new AbortController():null,t=setTimeout(()=>c&&c.abort(),ms);try{return await fetch(url,c?{signal:c.signal}:{})}finally{clearTimeout(t)}}
async function foGetCached(url){try{if(!self.caches)return null;const c=await caches.open(FOFF);return await c.match(url)}catch(e){return null}}
/* opening one form: saved copy first, then the network with a time limit */
formLoad=async function(k){if(FCACHE[k]&&!FCACHE[k].err)return;delete FCACHE[k];const u=foUrl(k+".json");
  try{let r=await foGetCached(u);if(!r||!r.ok)r=await foTimed(u,10000);if(!r||!r.ok)throw 0;FCACHE[k]=await r.json();foSaveOne(k)}
  catch(e){FCACHE[k]={err:1,off:navigator.onLine===false}}
  if(view==="form"&&fv&&fv.k===k)render()};
async function foSaveOne(k){if(FOSAVED[k]||!self.caches)return true;try{const c=await caches.open(FOFF);
  for(const f of foFiles(k)){const u=foUrl(f);if(await c.match(u))continue;const r=await foTimed(u,30000);if(!r||!r.ok)return false;await c.put(u,r)}
  FOSAVED[k]=1;try{localStorage.setItem("foSaved",JSON.stringify(FOSAVED))}catch(e){}return true}catch(e){return false}}
async function foSaveAll(force){if(FORUN||!self.caches||navigator.onLine===false)return;const cn=navigator.connection;if(!force&&cn&&cn.saveData)return;
  FORUN=true;const ks=Object.keys(FORMIDX).filter(k=>!FOSAVED[k]);let i=0,fails=0;
  const work=async()=>{while(i<ks.length&&fails<20&&navigator.onLine!==false){const k=ks[i++];if(!(await foSaveOne(k)))fails++;if(view==="form"&&fv&&fv.lib)foBar()}};
  try{await Promise.all([work(),work(),work()])}catch(e){}FORUN=false;if(view==="form"&&fv&&fv.lib)foBar()}
function foBarHtml(){const n=foDone(),t=Object.keys(FORMIDX).length;return n>=t?`✓ All ${t} forms saved on this device: they open offline.`:`Saved for offline: ${n} of ${t} forms${FORUN?" (saving now…)":""}. <button class="btn ghost small" data-fv="saveall">Save all now (about 24 MB)</button>`}
function foBar(){const el=document.getElementById("fobar");if(el)el.innerHTML=foBarHtml()}
/* library: show the progress line */
const foLib0=renderFormLib;renderFormLib=function(V){foLib0(V);const top=V.querySelector(".fvtop");if(top){const d=document.createElement("div");d.id="fobar";d.className="small muted";d.style.margin="6px 0";d.innerHTML=foBarHtml();top.after(d)}};
/* clearer message when a form isn't saved yet and there is no internet */
const foForm0=renderForm;renderForm=function(){foForm0();const d=fv&&!fv.lib&&FCACHE[fv.k];if(d&&d.err){const c=document.querySelector("#view .card");if(c&&d.off)c.innerHTML=`<b>You're offline, and this form isn't saved on the device yet.</b><div class="small muted">Forms save themselves while the app is open with internet. Open the forms list once online and tap "Save all now".</div><button class="btn" data-fv="retry">Try again</button>`}};
const foClick0=formClick;formClick=function(b){if(b.dataset.fv==="saveall"){foSaveAll(true);setTimeout(foBar,50);return true}return foClick0(b)};
window.addEventListener("online",()=>setTimeout(()=>foSaveAll(),3000));
setTimeout(()=>foSaveAll(),25000);
