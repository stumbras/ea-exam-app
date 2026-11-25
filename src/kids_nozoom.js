/* Kids games: no accidental zoom (Version 2026-11-26n).
   Asked for: "on tesla games sometimes screen zooms in too much by accident when playing should just stay full screen".
   In kids mode the page locks the zoom: the viewport is fixed at 1x, double-tap zoom is off, two-finger pinches and
   iOS gesture events are blocked, and text boxes use 16px text so iPhones don't zoom when typing. The adult apps keep normal zoom. */
(function(){const vp=document.querySelector('meta[name="viewport"]'),base=vp?vp.getAttribute("content"):"width=device-width,initial-scale=1,viewport-fit=cover",
  lock="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover";let on=null;
  const kid=()=>document.body&&document.body.classList.contains("kidsmode");
  function sync(){const k=kid();if(k===on)return;on=k;if(vp)vp.setAttribute("content",k?lock:base);
    if(k&&window.visualViewport&&visualViewport.scale>1.01&&vp){vp.setAttribute("content",lock.replace("initial-scale=1","initial-scale=1.0001"));setTimeout(()=>vp.setAttribute("content",lock),60)}}
  const st=document.createElement("style");st.textContent="body.kidsmode{touch-action:manipulation;-webkit-text-size-adjust:100%;overscroll-behavior:none}body.kidsmode canvas{touch-action:none}body.kidsmode button,body.kidsmode .kbtn{touch-action:manipulation}body.kidsmode input,body.kidsmode select,body.kidsmode textarea{font-size:16px!important}";document.head.appendChild(st);
  ["gesturestart","gesturechange","gestureend"].forEach(t=>document.addEventListener(t,e=>{if(kid())e.preventDefault()},{passive:false}));
  document.addEventListener("touchmove",e=>{if(kid()&&(e.touches.length>1||(e.scale&&e.scale!==1)))e.preventDefault()},{passive:false});
  let last=0;document.addEventListener("touchend",e=>{if(!kid())return;const t=Date.now();if(t-last<320&&e.changedTouches.length===1&&!(e.target.closest&&e.target.closest("input,textarea,select")))e.preventDefault();last=t},{passive:false});
  document.addEventListener("dblclick",e=>{if(kid())e.preventDefault()},{passive:false});
  document.addEventListener("wheel",e=>{if(kid()&&e.ctrlKey)e.preventDefault()},{passive:false});
  new MutationObserver(sync).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:["class"]});setTimeout(sync,0)})();
