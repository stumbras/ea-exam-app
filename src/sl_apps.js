/* ---- Solving Life apps (Version 209). One engine, separate installable apps, each opened by its own link:
   ?study (or the plain address) = Solving Life Enrolled Agent Prep (EA Parts 1-3 with the bookkeeping course),
   ?s65 = Solving Life Series 65 Prep, ?edpna = Solving Life EDPNA Prep, ?kids = Solving Life Becoming Genius.
   The choice is kept in localStorage "slApp" like the older kidsLock and courseLock, so a home-screen app that is
   opened later without its query string still opens in the right section. Saved progress keys are not touched. ---- */
(function(){try{if(location.protocol==="http:"&&/solvinglifewith\.com$/.test(location.hostname)){location.replace("https://"+location.host+location.pathname+location.search+location.hash);return}if(/\.github\.io$|\.pages\.dev$|\.workers\.dev$/.test(location.hostname)){const m=location.pathname.replace(/^\/ea-exam-app/,"");location.replace("https://study.solvinglifewith.com"+(m||"/")+location.search+location.hash)}}catch(_){}})();
const SLAPPS={
  s65:{part:5,name:"Solving Life Series 65 Prep",short:"Series 65 Prep",man:"manifest-65.webmanifest",color:"#5b3fb0",icon:"apple-touch-icon-65.png"},
  cble:{part:9,name:"Solving Life Customs Broker Prep",short:"Customs Broker Prep",man:"manifest-cble.webmanifest",color:"#1f5d8c",icon:"apple-touch-icon-cble.png"},
  cit:{part:11,name:"Solving Life Citizenship Test",short:"Citizenship",man:"manifest-cit.webmanifest",color:"#102A49",icon:"apple-touch-icon-cit.png"},
  drive:{part:12,name:"Solving Life Driver's Test",short:"Driver's Test",man:"manifest-drive.webmanifest",color:"#127A68",icon:"apple-touch-icon-drive.png"},
  moto:{part:13,name:"Solving Life Motorcycle Test",short:"Motorcycle",man:"manifest-moto.webmanifest",color:"#7a4a12",icon:"apple-touch-icon-moto.png"},
  cdl:{part:14,name:"Solving Life CDL Prep",short:"CDL Prep",man:"manifest-cdl.webmanifest",color:"#1d4e89",icon:"apple-touch-icon-cdl.png"},
  sie:{part:10,name:"Solving Life SIE Prep",short:"SIE Prep",man:"manifest-sie.webmanifest",color:"#2a7d4f",icon:"apple-touch-icon-sie.png"},
  edpna:{part:6,name:"Solving Life EDPNA Prep",short:"EDPNA Prep",man:"manifest-edpna.webmanifest",color:"#a0521a",icon:"apple-touch-icon-edpna.png"}
};
function SLAPP(){try{const k=localStorage.getItem("slApp")||"";return SLAPPS[k]?k:""}catch(_){return ""}}
function slAppUI(){try{const a=SLAPPS[SLAPP()];if(!a)return;document.title=a.name;
  const m=document.querySelector('link[rel="manifest"]');if(m)m.setAttribute("href",a.man);
  const at=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(at)at.setAttribute("content",a.short);
  const ic=document.querySelector('link[rel="apple-touch-icon"]');if(ic)ic.setAttribute("href",a.icon);
  const tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute("content",a.color)}catch(_){}}
(function(){try{const sm=location.pathname.match(/\/(ea|65|edpna|kids|cble|sie|cdl|citizenship|driving|motorcycle)\/(index\.html)?$/);if(sm){location.replace("../?"+({ea:"study","65":"s65",edpna:"edpna",kids:"kids",cble:"cble",sie:"sie",cdl:"cdl",citizenship:"cit",driving:"drive",motorcycle:"moto"})[sm[1]]+location.hash);return}}catch(_){}})();
(function(){try{const q=new URLSearchParams(location.search);
  if(q.has("study")||q.has("kids")||q.has("course"))localStorage.removeItem("slApp");
  /* arriving from another site on the plain address (for example solvinglifellc.com/apps) shows every app, not the one this browser used last */
  try{let any=false;for(const k in SLAPPS)if(q.has(k))any=true;const sa=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone;
    const rf=document.referrer?new URL(document.referrer).hostname:"";
    if(!any&&!sa&&rf&&rf!==location.hostname&&!q.has("kids")&&!q.has("course"))localStorage.removeItem("slApp")}catch(_){}
  if(q.has("study")){localStorage.removeItem("kidsLock");localStorage.removeItem("courseLock")}
  for(const k in SLAPPS)if(q.has(k)){localStorage.setItem("slApp",k);localStorage.removeItem("kidsLock");localStorage.removeItem("courseLock")}
  const a=SLAPPS[SLAPP()];if(a){slAppUI();setTimeout(()=>{part=a.part;view="home";render()},0)}}catch(_){}})();
/* inside a locked app there is no "All sections": the section's own home page is home */
const slRenderTabs0=renderTabs;renderTabs=function(){const r=slRenderTabs0.apply(this,arguments);try{const a=SLAPPS[SLAPP()];if(a&&view!=="kids"){
  const t=$("#tabs");if(t){t.hidden=false;t.innerHTML=view==="home"?"":`<button class="bkback go" data-nav="back">‹ Back · ${esc(PARTS[a.part].short)} main page</button>`}}}catch(_){}return r};
document.addEventListener("click",function(e){try{const a=SLAPPS[SLAPP()];if(!a)return;const b=e.target.closest&&e.target.closest('[data-sec="start"]');if(!b)return;
  e.preventDefault();e.stopPropagation();hush();part=a.part;view="home";render();window.scrollTo(0,0)}catch(_){}},true);

/* ---- Driver's Test: one state at a time (Version 2026-11-27o). The bank holds every state; the learner picks one, and the
   study path, drills and practice tests then use road signs, rules of the road and that state only. The motorcycle add-on is a switch.
   PARTS[12].doms lists only the chosen topics, while a lookup of any other topic still answers, so old saved answers never break a page. ---- */
let DRV_ALL={1:["",50],2:["",50]},DRV_CUR={};
function drvGet(k){try{return localStorage.getItem(k)||""}catch(_){return ""}}
function drvState(){const s=drvGet("drvState");return s&&s!=="20"&&DRV_ALL[s]?s:""}
function drvApply(){const s=drvState(),m=drvGet("drvMoto")==="1",c={};
  c[1]=[DRV_ALL[1][0],s?(m?35:40):(m?45:50)];c[2]=[DRV_ALL[2][0],s?(m?30:35):(m?45:50)];if(s)c[s]=[DRV_ALL[s][0],25];if(m)c[20]=[DRV_ALL[20][0],10];DRV_CUR=c;_drvBP.k=""}
const _drvBP={k:"",l:[]};let drvBP0=null,slRender0=null;
setTimeout(function(){try{DRV_ALL=Object.assign({},PARTS[12].doms);
PARTS[12].doms=new Proxy({},{get:(t,k)=>DRV_CUR[k]||DRV_ALL[k],has:(t,k)=>k in DRV_CUR,ownKeys:()=>Object.keys(DRV_CUR),
  getOwnPropertyDescriptor:(t,k)=>k in DRV_CUR?{value:DRV_CUR[k],enumerable:true,configurable:true,writable:true}:undefined});
try{const sq=new URLSearchParams(location.search).get("st");if(sq){const dm=Object.keys(DRV_ALL).find(d=>d>2&&d!=20&&DRV_ALL[d][0].toLowerCase()===sq.toLowerCase());if(dm){localStorage.setItem("drvState",dm);localStorage.setItem("drvAsked","1")}}}catch(_){}
drvBP0=BP;
BP=function(p){const l=drvBP0(p);if(p==14){const k=Object.keys(CDL_CUR).join(",")+"|"+l.length;if(_cdlBP.k!==k){_cdlBP.k=k;_cdlBP.l=l.filter(i=>i.d in CDL_CUR)}return _cdlBP.l}if(p!=12)return l;const k=Object.keys(DRV_CUR).join(",")+"|"+l.length;if(_drvBP.k!==k){_drvBP.k=k;_drvBP.l=l.filter(i=>i.d in DRV_CUR)}return _drvBP.l};
drvApply();
try{CDL_ALL=Object.assign({},PARTS[14].doms);PARTS[14].doms=new Proxy({},{get:(t,k)=>CDL_CUR[k]||CDL_ALL[k],has:(t,k)=>k in CDL_CUR,ownKeys:()=>Object.keys(CDL_CUR),
  getOwnPropertyDescriptor:(t,k)=>k in CDL_CUR?{value:CDL_CUR[k],enumerable:true,configurable:true,writable:true}:undefined});cdlApply()}catch(e){console.error(e)}
slRender0=render;render=function(){const r=slRender0.apply(this,arguments);try{drvCard()}catch(_){}try{cdlCard()}catch(_){}try{slSupport()}catch(_){}try{slPromo()}catch(_){}try{slRefer()}catch(_){}try{const pb=document.getElementById("podbtn");if(pb)pb.style.display=[1,2,3,5,6,9,10].includes(+part)&&view!=="start"&&view!=="kids"&&view!=="session"?"":"none"}catch(_){}slFreeWords();return r};render()}catch(e){console.error(e)}},0);
/* ---- CDL app (part 14): the learner ticks the endorsements they are testing for and picks a state. Core topics (1-5) and the
   pre-trip topic (11) are always on; 6-10 are endorsements; 12 is Texas-only law, shown when the state is Texas. Weights are
   rescaled to total 100. Same Proxy idea as the driver's test above. ---- */
let CDL_ALL={},CDL_CUR={};const _cdlBP={k:"",l:[]};
const CDL_END=[[6,"Passenger (P)"],[7,"School bus (S)"],[8,"Doubles / triples (T)"],[9,"Tank vehicles (N)"],[10,"Hazardous materials (H)"]];
const CDL_ST="Alabama,Alaska,Arizona,Arkansas,California,Colorado,Connecticut,Delaware,District of Columbia,Florida,Georgia,Hawaii,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Ohio,Oklahoma,Oregon,Pennsylvania,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virginia,Washington,West Virginia,Wisconsin,Wyoming".split(",");
const CDL_STDOM={Texas:12}; /* states with their own verified question set */
function cdlEnds(){return drvGet("cdlEnd").split(",").filter(x=>CDL_END.some(e=>e[0]==x))}
function cdlApply(){const on=["1","2","3","4","5","11"].concat(cdlEnds()),sd=CDL_STDOM[drvGet("cdlState")];if(sd)on.push(String(sd));
  const use=on.filter(d=>CDL_ALL[d]),tot=use.reduce((a,d)=>a+CDL_ALL[d][1],0)||1,c={};let sum=0,big=use[0];
  use.forEach(d=>{const w=Math.max(1,Math.round(CDL_ALL[d][1]*100/tot));c[d]=[CDL_ALL[d][0],w];sum+=w;if(w>c[big][1])big=d});if(big)c[big][1]+=100-sum;CDL_CUR=c;_cdlBP.k=""}
/* the checklist is its own page (cdl-pretrip.html); inside the app it opens in a frame so the offline worker cannot swap it for the app shell */
async function cdlPretrip(){try{const t=(await (await fetch("./cdl-pretrip.html")).text()).replace(/<a href="\.\/\?cdl">[^<]*<\/a>/,"");
  const o=document.createElement("div");o.id="cdlpreov";o.style.cssText="position:fixed;inset:0;z-index:99990;background:#f4f7fb;display:flex;flex-direction:column";
  o.innerHTML='<div style="padding:10px 12px;background:#1d4e89"><button type="button" style="font:700 15px system-ui;padding:10px 16px;border-radius:999px;border:0;background:#fff;color:#1d4e89;cursor:pointer">‹ Back to CDL Permit Prep</button></div><iframe title="CDL pre-trip inspection checklist" style="flex:1;border:0;width:100%"></iframe>';
  o.querySelector("button").addEventListener("click",()=>o.remove());o.querySelector("iframe").srcdoc=t;document.body.appendChild(o)}catch(_){location.href="./cdl-pretrip.html"}}
function cdlCard(){const v=document.getElementById("view");if(!v||part!=14||view!=="home"||document.getElementById("cdlcard"))return;
  const st=drvGet("cdlState"),ends=cdlEnds(),has=CDL_STDOM[st];
  const el=document.createElement("section");el.id="cdlcard";el.className="section";
  el.innerHTML=`<div class="card" style="border:2px solid ${st?"var(--line,#cfd8e3)":"#1d4e89"};border-radius:16px;padding:14px 16px">
    <div style="font-weight:800;font-size:1.05rem">${st?"Your CDL tests · "+esc(st):"Set up your CDL tests"}</div>
    ${st?`<div class="small muted" style="margin:4px 0 6px">Core tests${ends.length?" + "+CDL_END.filter(e=>ends.includes(String(e[0]))).map(e=>e[1]).join(", "):", no endorsements"}${has?" + "+esc(st)+" rules":""}</div><details><summary class="small" style="font-weight:700;color:#1d4e89;cursor:pointer;padding:6px 0">Change endorsements or state</summary>`:""}
    <div class="small muted" style="margin:4px 0 10px">General Knowledge, Air Brakes, Combination Vehicles and the pre-trip inspection are always included. Tick the endorsements you are testing for.</div>
    ${CDL_END.map(([d,n])=>`<label class="small" style="display:flex;gap:10px;align-items:center;margin:8px 0;font-weight:600"><input type="checkbox" class="cdlend" value="${d}" ${ends.includes(String(d))?"checked":""} style="width:22px;height:22px"> ${n}</label>`).join("")}
    <label class="small" for="cdlsel" style="display:block;font-weight:700;margin:12px 0 4px">State you are testing in</label>
    <select id="cdlsel" style="width:100%;padding:12px;border-radius:12px;font-size:1rem;border:1px solid #9aa7b6;background:#fff;color:#111"><option value="">Choose your state…</option>${CDL_ST.map(n=>`<option ${st===n?"selected":""}>${n}</option>`).join("")}</select>
    <div class="small muted" style="margin-top:8px">${!st?"CDL knowledge tests come from one national manual, so these questions apply in every state.":has?"Added: "+esc(st)+" special requirements from the official "+esc(st)+" commercial driver handbook.":"The CDL knowledge tests in "+esc(st)+" come from the same national manual these questions were checked against. "+esc(st)+" has no extra state-only question set in the app yet; fees, ages and test counts are set by your state, so confirm them with your state licensing office."}</div>${st?"</details>":""}
    <button type="button" id="cdlpre" style="display:block;width:100%;text-align:left;margin-top:12px;padding:12px 14px;border-radius:12px;border:0;background:#eef4fb;color:#1d4e89;font:800 1rem inherit;cursor:pointer">📋 Pre-trip inspection checklist · tick it off or print it ›</button></div>`;
  v.insertBefore(el,v.firstChild);el.querySelector("#cdlpre").addEventListener("click",cdlPretrip);const dt=el.querySelector("details");if(dt&&window._cdlOpen){dt.open=true}if(dt)dt.addEventListener("toggle",()=>{window._cdlOpen=dt.open});
  el.querySelector("#cdlsel").addEventListener("change",e=>{try{if(e.target.value)localStorage.setItem("cdlState",e.target.value);else localStorage.removeItem("cdlState")}catch(_){}cdlApply();render();window.scrollTo(0,0)});
  el.querySelectorAll(".cdlend").forEach(b=>b.addEventListener("change",()=>{try{localStorage.setItem("cdlEnd",[...el.querySelectorAll(".cdlend")].filter(x=>x.checked).map(x=>x.value).join(","))}catch(_){}cdlApply();render()}))}
function drvCard(){const v=document.getElementById("view");if(!v||part!=12||view!=="home"||document.getElementById("drvcard"))return;
  const s=drvState(),m=drvGet("drvMoto")==="1",asked=drvGet("drvAsked")==="1";
  const opts=Object.keys(DRV_ALL).filter(d=>d>2&&d!=20).map(d=>[d,DRV_ALL[d][0]]).sort((a,b)=>a[1]<b[1]?-1:1).map(([d,n])=>`<option value="${d}" ${s==d?"selected":""}>${esc(n)}</option>`).join("");
  const el=document.createElement("section");el.id="drvcard";el.className="section";
  el.innerHTML=`<div class="card" style="border:2px solid ${s||asked?"var(--line,#cfd8e3)":"#127A68"};border-radius:16px;padding:14px 16px">
    <div style="font-weight:800;font-size:1.05rem">${s?"Your state: "+esc(DRV_ALL[s][0]):"Which state are you testing in?"}</div>
    <div class="small muted" style="margin:4px 0 10px">${s?"You study road signs, rules of the road and "+esc(DRV_ALL[s][0])+" questions from the official state driver manual.":"Pick it and the app adds that state's own speed limits, parking distances, permit rules and alcohol limits. Signs and rules of the road are the same everywhere."}</div>
    <label class="small" for="drvsel" style="display:block;font-weight:700;margin-bottom:4px">State</label>
    <select id="drvsel" style="width:100%;padding:12px;border-radius:12px;font-size:1rem;border:1px solid #9aa7b6;background:#fff;color:#111"><option value="">${s?"No state (signs and rules only)":"Choose your state…"}</option>${opts}<option value="none">My state is not listed yet</option></select>
    <label class="small" style="display:flex;gap:10px;align-items:center;margin-top:12px;font-weight:600"><input type="checkbox" id="drvmoto" ${m?"checked":""} style="width:22px;height:22px"> Add motorcycle permit questions</label></div>`;
  v.insertBefore(el,v.firstChild);
  el.querySelector("#drvsel").addEventListener("change",e=>{try{const x=e.target.value;localStorage.setItem("drvAsked","1");if(x&&x!=="none")localStorage.setItem("drvState",x);else localStorage.removeItem("drvState")}catch(_){}drvApply();render();window.scrollTo(0,0)});
  el.querySelector("#drvmoto").addEventListener("change",e=>{try{localStorage.setItem("drvMoto",e.target.checked?"1":"0")}catch(_){}drvApply();render()})}
/* free apps say "test", not "exam": the wording a permit or citizenship applicant uses */
const SLWORDS=[[/Mock exam/g,"Practice test"],[/mock exams/g,"practice tests"],[/mock exam/g,"practice test"],[/the exam's own order/g,"the test's own order"],[/of the exam\b/g,"of the test"],[/\bexam date\b/g,"test date"],[/Exam-style/g,"Test-style"],[/the way the exam asks/g,"the way the test asks"],[/\bExam day\b/g,"Test day"],[/Exam dates/g,"Test dates"],[/Test test date/g,"Test date"]];
function slFreeWords(){try{if(!PARTS[part]||!PARTS[part].free)return;const v=document.getElementById("view");if(!v)return;const w=document.createTreeWalker(v,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){let t=n.nodeValue;if(!/xam/.test(t))continue;for(const [a,b] of SLWORDS)t=t.replace(a,b);if(t!==n.nodeValue)n.nodeValue=t}}catch(_){}}
