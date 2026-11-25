// Offline support for EA Exam APP: the whole app is cached on first open, then served from the device.
// When there is a connection, a newer copy is fetched in the background and used on the next open.
const CACHE="ea-app-v1",FONTS="ea-fonts-v1",AUDIO="ea-audio-v1",FORMS="ea-forms-v1"; // FORMS: IRS/SSA form pages, saved by the app for offline use, kept across updates // AUDIO is filled and read by the app itself
const BASE=self.registration.scope,INDEX=BASE; // the folder address, not index.html: Cloudflare redirects /index.html to /, and a saved redirected copy cannot open a page ("This site can't be reached")
const CORE=[INDEX,BASE+"manifest.webmanifest",BASE+"icon-192.png",BASE+"icon-512.png",BASE+"icon-maskable-512.png",BASE+"apple-touch-icon.png",BASE+"manifest-65.webmanifest",BASE+"manifest-edpna.webmanifest",BASE+"manifest-kids.webmanifest",BASE+"apple-touch-icon-65.png",BASE+"apple-touch-icon-edpna.png",BASE+"icon-65-192.png",BASE+"icon-edpna-192.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==FONTS&&k!==AUDIO&&k!==FORMS).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin===self.location.origin&&(u.pathname.indexOf("/audio/")>=0||u.pathname.indexOf("/video/")>=0))return; // recorded audio: the app keeps its own saved copies
  if(u.origin===self.location.origin&&u.href.startsWith(BASE+"forms/")){ // forms: saved copy first, then the network with a time limit, never a forever spinner
    e.respondWith((async()=>{const key=u.origin+u.pathname,fc=await caches.open(FORMS),hit=await fc.match(key);if(hit)return hit;
      const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),15000);
      try{const res=await fetch(key,{signal:ctl.signal});clearTimeout(t);if(res&&res.ok)fc.put(key,res.clone());return res}catch(_){clearTimeout(t);return new Response("Offline and this form is not saved yet.",{status:503,headers:{"Content-Type":"text/plain"}})}})());
    return}
  if(u.origin===self.location.origin&&/\/version\.json$/.test(u.pathname)){e.respondWith(fetch(r).catch(()=>new Response("{}",{headers:{"Content-Type":"application/json"}})));return}
  if(u.origin===self.location.origin&&r.mode==="navigate"&&/^(ea|65|edpna|kids|cble|sie|admin)(\/(index\.html)?)?$/.test(u.href.slice(BASE.length).split(/[?#]/)[0]))return; // short links /ea/ /65/ /edpna/ /kids/: tiny pages that open the right app
  if(u.origin===self.location.origin&&u.href.startsWith(BASE)){
    const key=(r.mode==="navigate"||u.href===BASE)?INDEX:u.origin+u.pathname;
    e.respondWith((async()=>{const c=await caches.open(CACHE),hit=await c.match(key);
      const net=fetch(key,{cache:"no-cache"}).then(res=>{if(res&&res.ok&&!res.redirected)return c.put(key,res.clone()).then(()=>res);return res}).catch(()=>null);
      if(hit&&!hit.redirected){e.waitUntil(net);return hit}
      const got=await net;if(got&&got.ok&&!got.redirected)return got;try{return await fetch(r)}catch(_){}return hit||new Response("Offline and not saved yet. Open this app once with internet.",{status:503,headers:{"Content-Type":"text/plain"}})})().catch(()=>fetch(r)));
    return}
  if(/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith((async()=>{const c=await caches.open(FONTS),hit=await c.match(r);if(hit)return hit;
      try{const res=await fetch(r);if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res}catch(x){return new Response("",{status:503})}})())}
});
// "Update now" in the app: fetch the newest app file, store it, then tell the open app to reload.
self.addEventListener("message",e=>{if(e.data!=="refresh")return;e.waitUntil((async()=>{const c=await caches.open(CACHE);
  try{const res=await fetch(INDEX,{cache:"reload"});if(res&&res.ok&&!res.redirected)await c.put(INDEX,res.clone())}catch(x){}
  (await self.clients.matchAll()).forEach(x=>x.postMessage("refreshed"))})())});
