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
window.slPromo=function(){try{if(typeof PARTS==="undefined"||!PARTS[part]||!PARTS[part].free)return;if(!["home","results"].includes(view))return;
  const v=document.getElementById("view");if(!v||document.getElementById("slpromo"))return;const fs=set(part);if(!fs.length)return;
  const el=document.createElement("section");el.id="slpromo";el.className="section";
  const where=view==="results"?"results":"home";
  el.innerHTML=`<div class="small" style="font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.7;margin:6px 2px 0">${where==="results"?"Next steps from Solving Life":"More from Solving Life"}</div>`+(where==="results"?fs.slice(0,2):fs).map(f=>f(PARTS[part].x+"_"+where)).join("");
  v.appendChild(el)}catch(_){}};
})();
