/* ================= Retina-sharp game canvases =================
   Every game canvas was drawn at 1 pixel per CSS pixel, so it looked soft on an iPhone (3 device pixels per CSS pixel).
   This gives each canvas a backing store at up to 2x, keeps its logical size for the game code (cv.width still
   answers the logical width), and scales the drawing once. No game loop needs to change. */
let KHD_MAX=2;try{if(localStorage.getItem("kHdLow")==="1")KHD_MAX=1.5}catch(_){}
function kHdSetup(cv){try{if(!cv||cv._hd)return;const d=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,"width"),dh=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,"height");if(!d||!d.set)return;
  const W=cv.width,H=cv.height,r=Math.max(1,Math.min(KHD_MAX,window.devicePixelRatio||1));if(r<=1.01||!W||!H){cv._hd=1;return}
  d.set.call(cv,Math.round(W*r));dh.set.call(cv,Math.round(H*r));Object.defineProperty(cv,"width",{get:()=>W,configurable:true});Object.defineProperty(cv,"height",{get:()=>H,configurable:true});
  if(!cv.style.width){cv.style.width=W+"px";cv.style.height="auto";cv.style.aspectRatio=W+" / "+H}
  const c=cv.getContext("2d");c.setTransform(r,0,0,r,0,0);c.imageSmoothingQuality="high";cv._hd=r}catch(_){}}
function kHdHook(v){try{(v||document).querySelectorAll("canvas[id]").forEach(cv=>{if(/^k(drv|dby|fly|land|msn|ast|cty)$/.test(cv.id))kHdSetup(cv)})}catch(_){}}
// safety valve: if a phone cannot hold a smooth frame rate at this sharpness, step the canvas down once and remember it
function kHdWatch(cv){if(!cv||cv._hdw||!(cv._hd>1))return;cv._hdw=1;let n=0,slow=0,last=0;const tick=ts=>{if(!cv.isConnected||document.visibilityState!=="visible")return;if(last){const d=ts-last;if(d<200){n++;if(d>27)slow++}}last=ts;
    if(n>=150){if(slow/n>.45){try{const d=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,"width"),dh=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,"height"),W=cv.width,H=cv.height,r=cv._hd>1.5?1.5:1;
        d.set.call(cv,Math.round(W*r));dh.set.call(cv,Math.round(H*r));cv.getContext("2d").setTransform(r,0,0,r,0,0);cv._hd=r;KHD_MAX=r;localStorage.setItem("kHdLow","1")}catch(_){}}return}
    requestAnimationFrame(tick)};setTimeout(()=>requestAnimationFrame(tick),1500)}
const kHdHook0=kHdHook;kHdHook=function(v){kHdHook0(v);try{(v||document).querySelectorAll("canvas[id]").forEach(cv=>kHdWatch(cv))}catch(_){}};
