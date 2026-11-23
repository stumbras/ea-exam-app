/* ---- Solving Life apps (Version 209). One engine, separate installable apps, each opened by its own link:
   ?study (or the plain address) = Solving Life Enrolled Agent Prep (EA Parts 1-3 with the bookkeeping course),
   ?s65 = Solving Life Series 65 Prep, ?edpna = Solving Life EDPNA Prep, ?kids = Solving Life Becoming Genius.
   The choice is kept in localStorage "slApp" like the older kidsLock and courseLock, so a home-screen app that is
   opened later without its query string still opens in the right section. Saved progress keys are not touched. ---- */
const SLAPPS={
  s65:{part:5,name:"Solving Life Series 65 Prep",short:"Series 65 Prep",man:"manifest-65.webmanifest",color:"#5b3fb0",icon:"apple-touch-icon-65.png"},
  edpna:{part:6,name:"Solving Life EDPNA Prep",short:"EDPNA Prep",man:"manifest-edpna.webmanifest",color:"#a0521a",icon:"apple-touch-icon-edpna.png"}
};
function SLAPP(){try{const k=localStorage.getItem("slApp")||"";return SLAPPS[k]?k:""}catch(_){return ""}}
function slAppUI(){try{const a=SLAPPS[SLAPP()];if(!a)return;document.title=a.name;
  const m=document.querySelector('link[rel="manifest"]');if(m)m.setAttribute("href",a.man);
  const at=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(at)at.setAttribute("content",a.short);
  const ic=document.querySelector('link[rel="apple-touch-icon"]');if(ic)ic.setAttribute("href",a.icon);
  const tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute("content",a.color)}catch(_){}}
(function(){try{const sm=location.pathname.match(/\/(ea|65|edpna|kids)\/(index\.html)?$/);if(sm){location.replace("../?"+({ea:"study","65":"s65",edpna:"edpna",kids:"kids"})[sm[1]]+location.hash);return}}catch(_){}})();
(function(){try{const q=new URLSearchParams(location.search);
  if(q.has("study")||q.has("kids")||q.has("course"))localStorage.removeItem("slApp");
  if(q.has("study")){localStorage.removeItem("kidsLock");localStorage.removeItem("courseLock")}
  for(const k in SLAPPS)if(q.has(k)){localStorage.setItem("slApp",k);localStorage.removeItem("kidsLock");localStorage.removeItem("courseLock")}
  const a=SLAPPS[SLAPP()];if(a){slAppUI();setTimeout(()=>{part=a.part;view="home";render()},0)}}catch(_){}})();
/* inside a locked app there is no "All sections": the section's own home page is home */
const slRenderTabs0=renderTabs;renderTabs=function(){const r=slRenderTabs0.apply(this,arguments);try{const a=SLAPPS[SLAPP()];if(a&&view!=="kids"){
  const t=$("#tabs");if(t){t.hidden=false;t.innerHTML=view==="home"?"":`<button class="bkback go" data-nav="back">‹ Back · ${esc(PARTS[a.part].short)} main page</button>`}}}catch(_){}return r};
document.addEventListener("click",function(e){try{const a=SLAPPS[SLAPP()];if(!a)return;const b=e.target.closest&&e.target.closest('[data-sec="start"]');if(!b)return;
  e.preventDefault();e.stopPropagation();hush();part=a.part;view="home";render();window.scrollTo(0,0)}catch(_){}},true);
