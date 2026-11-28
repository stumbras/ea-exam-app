/* Cross-promotion in the free apps (Citizenship, Driver's, Motorcycle): links to the paid study apps and to Solving Life LLC tax services.
   Only solvinglifellc.com links. No EA representation or audit services are advertised. */
(function(){
const LLC="https://www.solvinglifellc.com",BUNDLE=LLC+"/product-page/all-4-exam-study-apps-12-months-buy-one-get-all",CDL=LLC+"/product-page/cdl-permit-prep-app-12-months";
const ut=(u,c)=>u+(u.includes("?")?"&":"?")+"utm_source=study_app&utm_medium=free_app&utm_campaign="+c;
const card=(bg,ic,t,d,btn,u,c)=>`<a href="${ut(u,c)}" target="_blank" rel="noopener" class="slpromo" style="display:flex;gap:12px;align-items:center;text-decoration:none;color:#fff;background:${bg};border-radius:16px;padding:14px 16px;margin:10px 0;box-shadow:0 4px 14px rgba(0,0,0,.15)">
  <div style="flex:none;width:46px;height:46px;border-radius:12px;background:rgba(255,255,255,.16);display:grid;place-items:center;font-size:24px">${ic}</div>
  <div style="flex:1;min-width:0"><div style="font-weight:800;font-size:1rem;line-height:1.3">${t}</div><div style="font-size:.86rem;opacity:.92;margin-top:2px;line-height:1.4">${d}</div>
  <div style="display:inline-block;margin-top:8px;background:#fff;color:#111;font-weight:800;font-size:.85rem;padding:6px 12px;border-radius:999px">${btn} ›</div></div></a>`;
const TAX=c=>card("linear-gradient(135deg,#0f3a4f,#127A68)","🧾","Tax returns from $60","Single $60 · married filing jointly $80 · with kids $100. One state return included. We beat any posted price by $20.","See prices",LLC+"/pricing",c);
const CDLC=c=>card("linear-gradient(135deg,#1d4e89,#0f2f57)","🚛","Going for a CDL?","CDL Permit Prep: General Knowledge, Air Brakes, Combination and every endorsement. $10 for 12 months.","Get CDL Prep",CDL,c);
const ALL=c=>card("linear-gradient(135deg,#5b3fb0,#2a1f66)","🎓","Study for a career license","Enrolled Agent, Series 65, SIE, Customs Broker, EDPNA and CDL. All apps for 12 months: $49.","See all apps",BUNDLE,c);
function set(p){return p==11?[TAX,ALL]:p==12||p==13?[CDLC,TAX,ALL]:[]}

const SOC=[["YouTube","https://www.youtube.com/@solvinglifellc","#ff0000"],["TikTok","https://www.tiktok.com/@solvinglifellc","#111"],["Instagram","https://www.instagram.com/solvinglifellc/","#c13584"],["Facebook","https://www.facebook.com/solvinglifellc","#1877f2"],["X","https://x.com/solvinglifellc","#111"]];
const pill=(t,u,bg)=>`<a href="${u}" target="_blank" rel="noopener" data-soc="${t}" style="display:inline-flex;align-items:center;min-height:36px;padding:6px 13px;border-radius:999px;background:${bg};color:#fff;font-weight:800;font-size:.85rem;text-decoration:none">${t}</a>`;
function shareApp(b){const d={title:"Free practice test",text:"Free practice test that helped me study:",url:location.origin+location.pathname+"?"+(PARTS[part].x||"")};
  if(navigator.share)navigator.share(d).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(d.url).then(()=>{b.textContent="Link copied ✓"}).catch(()=>{})}
window.slSupport=function(){try{if(typeof PARTS==="undefined"||!PARTS[part]||!PARTS[part].free||view!=="home")return;const v=document.getElementById("view");if(!v||document.getElementById("slsupport"))return;
  let min=false;try{min=localStorage.getItem("slSupMin")==="1"}catch(_){}
  const el=document.createElement("section");el.id="slsupport";el.className="section";
  const name=PARTS[part].x==="cit"?"citizenship test":PARTS[part].x==="moto"?"motorcycle test":"driver's test";
  el.innerHTML=min?`<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;background:#fff7e0;border:1px solid #f2d27a;border-radius:14px;padding:10px 12px"><b style="font-size:.9rem;flex:1;min-width:150px">💛 Free from Solving Life LLC</b><button type="button" class="slshare" style="min-height:36px;border:0;border-radius:999px;padding:6px 13px;background:#127A68;color:#fff;font-weight:800">Share</button><button type="button" class="slsupx" style="min-height:36px;border:0;border-radius:999px;padding:6px 13px;background:#eee;font-weight:700">Follow us</button></div>`:
  `<div style="background:linear-gradient(135deg,#fff7e0,#ffe9b8);border:1px solid #f2d27a;border-radius:16px;padding:14px 16px;color:#3b2a00">
   <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><div style="font-weight:900;font-size:1.05rem">💛 This ${name} is free</div><button type="button" class="slsupmin" aria-label="Make smaller" style="border:0;background:transparent;font-size:1.1rem;min-width:36px;min-height:36px;cursor:pointer">✕</button></div>
   <div style="font-size:.9rem;line-height:1.45;margin:4px 0 10px">Made by Solving Life LLC, a small tax and education business. No ads, no sign-up needed. Keep it free: follow us, share it with a friend who is studying, and come to us for your tax return.</div>
   <div style="display:flex;flex-wrap:wrap;gap:6px">${SOC.map(x=>pill(x[0],x[1],x[2])).join("")}</div>
   <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px"><button type="button" class="slshare" style="min-height:40px;border:0;border-radius:10px;padding:8px 14px;background:#127A68;color:#fff;font-weight:800">📤 Share with a friend</button><a href="https://www.solvinglifellc.com/pricing?utm_source=study_app&utm_medium=free_app&utm_campaign=support_banner" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;min-height:40px;border-radius:10px;padding:8px 14px;background:#0f3a4f;color:#fff;font-weight:800;text-decoration:none">🧾 Tax returns from $60</a></div></div>`;
  {const rf=document.getElementById("drvcard");if(rf&&rf.parentNode===v)v.insertBefore(el,rf.nextSibling);else v.insertBefore(el,v.firstChild)}
  el.querySelectorAll(".slshare").forEach(b=>b.addEventListener("click",()=>shareApp(b)));
  const mn=el.querySelector(".slsupmin");if(mn)mn.addEventListener("click",()=>{try{localStorage.setItem("slSupMin","1")}catch(_){}el.remove();slSupport()});
  const ex=el.querySelector(".slsupx");if(ex)ex.addEventListener("click",()=>{try{localStorage.removeItem("slSupMin")}catch(_){}el.remove();slSupport()});
  el.querySelectorAll("[data-soc]").forEach(a=>a.addEventListener("click",()=>{try{localStorage.setItem("slSupMin","1")}catch(_){}}))}catch(_){}};
/* after a good score: the moment people are happiest to share and follow */
window.slCheer=function(pct){try{if(!PARTS[part]||!PARTS[part].free||pct<80)return "";
  return `<div style="background:#eafaf3;border:1px solid #9fe1cb;border-radius:14px;padding:12px 14px;margin:10px 0"><b>🎉 ${pct}%: that's a passing score!</b><div class="small" style="margin:4px 0 8px">Know someone studying for the same test? Send them this free app, and follow us for more free tests.</div><div style="display:flex;flex-wrap:wrap;gap:6px"><button type="button" onclick="slShareApp(this)" style="min-height:36px;border:0;border-radius:999px;padding:6px 13px;background:#127A68;color:#fff;font-weight:800">📤 Share</button>${SOC.slice(0,4).map(x=>pill(x[0],x[1],x[2])).join("")}</div></div>`}catch(_){return ""}};
window.slShareApp=shareApp;

/* Free CDL Prep for referrals (no reward for follows or shares on social platforms: their rules forbid it) */
async function refCard(el){const box=el.querySelector(".slrefbox");if(!box)return;
  const app=PARTS[part].x||"drive";
  if(typeof cs==="undefined"||!cs){box.innerHTML=`<div style="font-size:.9rem;margin:6px 0 8px">Sign in (free) to get your personal invite link.</div><button type="button" class="slrefin" style="min-height:40px;border:0;border-radius:10px;padding:8px 14px;background:#1d4e89;color:#fff;font-weight:800">Sign in to get my link</button>`;
    box.querySelector(".slrefin").addEventListener("click",()=>{try{slCloudOpen()}catch(_){}});return}
  box.innerHTML='<div class="small">Loading your link…</div>';const j=await refInfoGet();if(!j){box.innerHTML='<div class="small">Could not load your link. Check your connection.</div>';return}
  const url="https://study.solvinglifewith.com/?"+app+"&ref="+j.code,left=j.need-(j.count%j.need),done=j.rewards>=j.max;
  const until=j.cdlUntil>Date.now()?`<div style="font-weight:800;color:#0b6b3a;margin-bottom:6px">✓ CDL Prep is open for you until ${new Date(j.cdlUntil).toLocaleDateString()}</div>`:"";
  box.innerHTML=`${until}<div style="font-size:.9rem;margin:4px 0 8px">${done?"You have earned every free month. Thank you!":`<b>${j.count}</b> friend${j.count===1?"":"s"} joined · ${left} more for your next free month`}</div>
   <div style="display:flex;gap:6px;flex-wrap:wrap"><input readonly value="${url}" style="flex:1;min-width:160px;font-size:14px;padding:8px;border-radius:8px;border:1px solid #9aa7b6"><button type="button" class="slrefsh" style="min-height:40px;border:0;border-radius:10px;padding:8px 14px;background:#1d4e89;color:#fff;font-weight:800">Share link</button></div>`;
  box.querySelector(".slrefsh").addEventListener("click",e=>{const d={title:"Free practice test",text:"I'm using this free practice test. Try it:",url};if(navigator.share)navigator.share(d).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>{e.target.textContent="Copied ✓"})})}
window.slRefer=function(){try{if(typeof PARTS==="undefined"||!PARTS[part]||view!=="home")return;const x=PARTS[part].x;if(!["drive","moto","cit","cdl"].includes(x))return;
  const v=document.getElementById("view");if(!v||document.getElementById("slrefer"))return;
  const el=document.createElement("section");el.id="slrefer";el.className="section";
  el.innerHTML=`<div style="border:2px solid #1d4e89;border-radius:16px;padding:14px 16px;background:#eef4fb;color:#0f2f57"><div style="font-weight:900;font-size:1.02rem">🚛 Get CDL Prep free: invite 2 friends</div>
   <div style="font-size:.88rem;line-height:1.45;margin:4px 0 6px">Send your link to friends who are studying. When 2 of them open it and sign in for the first time, you get 30 days of CDL Permit Prep free (worth $10). Up to 3 free months.</div><div class="slrefbox"></div></div>`;
  const sup=document.getElementById("slsupport"),dc=document.getElementById("drvcard")||document.getElementById("cdlcard");
  const pr=document.getElementById("slpromo");if(pr&&pr.parentNode===v)v.insertBefore(el,pr);else v.appendChild(el);refCard(el)}catch(_){}};
window.slPromo=function(){try{if(typeof PARTS==="undefined"||!PARTS[part]||!PARTS[part].free)return;if(!["home","results"].includes(view))return;
  const v=document.getElementById("view");if(!v||document.getElementById("slpromo"))return;const fs=set(part);if(!fs.length)return;
  const el=document.createElement("section");el.id="slpromo";el.className="section";
  const where=view==="results"?"results":"home";
  el.innerHTML=`<div class="small" style="font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.7;margin:6px 2px 0">${where==="results"?"Next steps from Solving Life":"More from Solving Life"}</div>`+(where==="results"?fs.slice(0,2):fs).map(f=>f(PARTS[part].x+"_"+where)).join("");
  v.appendChild(el)}catch(_){}};
})();
