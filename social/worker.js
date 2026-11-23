// Solving Life social connector: a private MCP server on Cloudflare Workers (free plan) that posts to the
// business Facebook Page, Instagram, YouTube and TikTok through their official free APIs.
// Secrets live in Cloudflare only (Worker secret ADMIN, KV namespace SL). Nothing secret is in this file.
// Routes (all private ones carry the ADMIN key in the path):
//   GET  /s/<ADMIN>/            setup page: save app keys, connect each network, see status
//   POST /s/<ADMIN>/save        save app keys from the setup page form
//   GET  /s/<ADMIN>/go/<net>    start sign-in with facebook | instagram | google | tiktok
//   GET  /cb/<net>              sign-in callback (state must match)
//   POST /mcp/<ADMIN>           MCP endpoint (JSON-RPC over HTTP) used by Claude
const GV = "v23.0"; // Meta Graph API version
const HOST = "https://social.solvinglifewith.com";
const H = { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "no-store" };
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function kget(env, k) { const v = await env.SL.get(k); return v ? JSON.parse(v) : null; }
async function kput(env, k, v) { await env.SL.put(k, JSON.stringify(v)); }
async function jfetch(url, opt = {}) {
  const r = await fetch(url, opt); const t = await r.text(); let d; try { d = JSON.parse(t); } catch { d = { raw: t.slice(0, 500) }; }
  if (!r.ok) throw new Error(`${r.status} ${url.split("?")[0]}: ${JSON.stringify(d).slice(0, 600)}`);
  return d;
}
const form = o => new URLSearchParams(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== ""));
const sleep = ms => new Promise(r => setTimeout(r, ms));

export default {
  async fetch(req, env) {
    const u = new URL(req.url), p = u.pathname.split("/").filter(Boolean);
    try {
      if (p[0] === "cb" && p[1]) return await callback(p[1], u, env);
      if (!env.ADMIN || p[1] !== env.ADMIN) return new Response("Not found", { status: 404 });
      if (p[0] === "s" && req.method === "GET" && !p[2]) return new Response(await setupPage(env, u.searchParams.get("msg")), { headers: H });
      if (p[0] === "s" && p[2] === "save" && req.method === "POST") return await save(req, env);
      if (p[0] === "s" && p[2] === "go" && p[3]) return await startAuth(p[3], env);
      if (p[0] === "mcp") return await mcp(req, env);
      return new Response("Not found", { status: 404 });
    } catch (e) {
      return new Response(`<p>Something went wrong: ${esc(e.message)}</p><p><a href="/s/${esc(env.ADMIN)}/">Back to setup</a></p>`, { status: 500, headers: H });
    }
  },
  async scheduled(_e, env) { // keep the Instagram token fresh (it lasts 60 days; refresh weekly)
    const ig = await kget(env, "tok:instagram"); if (!ig || !ig.access_token) return;
    try { const d = await jfetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${ig.access_token}`); ig.access_token = d.access_token; ig.refreshed = Date.now(); await kput(env, "tok:instagram", ig); } catch (_) {}
  }
};

/* ---------------- setup page ---------------- */
const FIELDS = [
  ["meta_app_id", "Meta app ID (for Facebook and Instagram)"], ["meta_app_secret", "Meta app secret", 1], ["meta_config_id", "Meta login configuration ID (optional; from Facebook Login for Business, Configurations)"],
  ["ig_app_id", "Instagram app ID (from the Instagram use case)"], ["ig_app_secret", "Instagram app secret", 1],
  ["google_client_id", "Google OAuth client ID (for YouTube)"], ["google_client_secret", "Google OAuth client secret", 1],
  ["tiktok_client_key", "TikTok client key"], ["tiktok_client_secret", "TikTok client secret", 1]
];
async function setupPage(env, msg) {
  const cfg = (await kget(env, "cfg")) || {}, A = env.ADMIN;
  const st = {}; for (const n of ["facebook", "instagram", "google", "tiktok"]) st[n] = await kget(env, "tok:" + n);
  const row = (n, label, who) => `<tr><td>${label}</td><td>${st[n] ? `<b style="color:#0B6B58">Connected</b> ${esc(who(st[n]) || "")}` : "Not connected"}</td><td><a class="b" href="/s/${A}/go/${n}">${st[n] ? "Reconnect" : "Connect"}</a></td></tr>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Solving Life posting setup</title>
<style>body{font:16px/1.5 system-ui,sans-serif;margin:0;color:#0F1B2D}main{max-width:720px;margin:0 auto;padding:24px}h1{font-size:26px}table{width:100%;border-collapse:collapse}td{padding:12px 6px;border-bottom:1px solid #E4E8EE;vertical-align:top}
label{display:block;font-weight:600;margin:14px 0 4px}input{width:100%;box-sizing:border-box;padding:12px;font-size:16px;border:1px solid #CBD2DC;border-radius:10px}.b,button{display:inline-block;background:#0E7C66;color:#fff;border:0;border-radius:10px;padding:12px 18px;font-weight:600;text-decoration:none;font-size:16px}.m{background:#E3F4EE;padding:12px;border-radius:10px}</style></head><body><main>
<h1>Solving Life posting setup</h1>${msg ? `<p class="m">${esc(msg)}</p>` : ""}
<h2>1. Accounts</h2><table>
${row("facebook", "Facebook Page", t => (t.pages || []).map(x => x.name).join(", "))}
${row("instagram", "Instagram", t => t.username ? "@" + t.username : "")}
${row("google", "YouTube", t => t.channel || "")}
${row("tiktok", "TikTok", t => t.name || "")}
</table>
<h2>2. App keys</h2><p>Paste each key from the developer pages. Saved keys show as ●●●●; leave a box empty to keep what is saved.</p>
<form method="post" action="/s/${A}/save">${FIELDS.map(([k, l, sec]) => `<label for="${k}">${l}</label><input id="${k}" name="${k}" autocomplete="off" ${sec ? 'type="password"' : ""} placeholder="${cfg[k] ? (sec ? "●●●● saved" : esc(cfg[k])) : ""}">`).join("")}
<p><button type="submit">Save keys</button></p></form>
<h3>Google (YouTube) shortcut</h3><p>Pick the client_secret_….json file you downloaded from Google Cloud. It fills in both Google boxes and saves.</p>
<p><label class="b" style="display:inline-block;cursor:pointer">Choose Google file<input id="gfile" type="file" accept=".json,application/json" style="display:none"></label></p>
<script>document.getElementById("gfile").onchange=async e=>{try{const j=JSON.parse(await e.target.files[0].text()),w=j.web||j.installed;document.getElementById("google_client_id").value=w.client_id;document.getElementById("google_client_secret").value=w.client_secret;document.querySelector("form").submit()}catch(x){alert("That is not the Google client file.")}};</script>
<h2>3. Addresses the developer pages ask for</h2><p>Redirect / callback addresses:<br>${["facebook", "instagram", "google", "tiktok"].map(n => `<code>${HOST}/cb/${n}</code>`).join("<br>")}</p>
<p>Privacy policy: <code>https://solvinglifewith.com/privacy.html</code><br>Terms: <code>https://solvinglifewith.com/terms.html</code><br>Website: <code>https://solvinglifewith.com</code></p>
</main></body></html>`;
}
async function save(req, env) {
  const f = await req.formData(), cfg = (await kget(env, "cfg")) || {};
  for (const [k] of FIELDS) { const v = (f.get(k) || "").trim(); if (v) cfg[k] = v; }
  await kput(env, "cfg", cfg);
  return Response.redirect(`${HOST}/s/${env.ADMIN}/?msg=${encodeURIComponent("Keys saved. Now tap Connect next to each account.")}`, 303);
}

/* ---------------- sign-in ---------------- */
async function startAuth(n, env) {
  const cfg = (await kget(env, "cfg")) || {}, state = crypto.randomUUID(), cb = `${HOST}/cb/${n}`;
  await env.SL.put("state:" + state, n, { expirationTtl: 900 });
  let url;
  if (n === "facebook") { if (!cfg.meta_app_id) throw new Error("Save the Meta app ID first.");
    url = `https://www.facebook.com/${GV}/dialog/oauth?` + form({ client_id: cfg.meta_app_id, redirect_uri: cb, state, ...(cfg.meta_config_id ? { config_id: cfg.meta_config_id } : { scope: "pages_show_list,pages_read_engagement,pages_manage_posts,business_management,instagram_basic,instagram_content_publish" }) }); }
  else if (n === "instagram") { if (!cfg.ig_app_id) throw new Error("Save the Instagram app ID first.");
    url = "https://www.instagram.com/oauth/authorize?" + form({ client_id: cfg.ig_app_id, redirect_uri: cb, response_type: "code", state, scope: "instagram_business_basic,instagram_business_content_publish" }); }
  else if (n === "google") { if (!cfg.google_client_id) throw new Error("Save the Google client ID first.");
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + form({ client_id: cfg.google_client_id, redirect_uri: cb, response_type: "code", access_type: "offline", prompt: "consent", state, scope: "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly" }); }
  else if (n === "tiktok") { if (!cfg.tiktok_client_key) throw new Error("Save the TikTok client key first.");
    url = "https://www.tiktok.com/v2/auth/authorize/?" + form({ client_key: cfg.tiktok_client_key, redirect_uri: cb, response_type: "code", state, scope: "user.info.basic,video.upload" }); }
  else throw new Error("Unknown network");
  return Response.redirect(url, 302);
}
async function callback(n, u, env) {
  const state = u.searchParams.get("state"), code = u.searchParams.get("code");
  const want = state && await env.SL.get("state:" + state);
  if (!want || want !== n) return new Response("This sign-in link has expired. Start again from the setup page.", { status: 400 });
  await env.SL.delete("state:" + state);
  if (!code) return new Response("Sign-in was cancelled: " + esc(u.searchParams.get("error_description") || u.searchParams.get("error") || ""), { status: 400, headers: H });
  const cfg = (await kget(env, "cfg")) || {}, cb = `${HOST}/cb/${n}`; let tok;
  if (n === "facebook") {
    const s = await jfetch(`https://graph.facebook.com/${GV}/oauth/access_token?` + form({ client_id: cfg.meta_app_id, client_secret: cfg.meta_app_secret, redirect_uri: cb, code }));
    const l = await jfetch(`https://graph.facebook.com/${GV}/oauth/access_token?` + form({ grant_type: "fb_exchange_token", client_id: cfg.meta_app_id, client_secret: cfg.meta_app_secret, fb_exchange_token: s.access_token }));
    const pg = await jfetch(`https://graph.facebook.com/${GV}/me/accounts?fields=id,name,access_token,instagram_business_account&limit=50&access_token=${l.access_token}`);
    tok = { user_token: l.access_token, pages: (pg.data || []).map(x => ({ id: x.id, name: x.name, access_token: x.access_token, ig: x.instagram_business_account && x.instagram_business_account.id })) };
  } else if (n === "instagram") {
    const s = await jfetch("https://api.instagram.com/oauth/access_token", { method: "POST", body: form({ client_id: cfg.ig_app_id, client_secret: cfg.ig_app_secret, grant_type: "authorization_code", redirect_uri: cb, code }) });
    const l = await jfetch(`https://graph.instagram.com/access_token?` + form({ grant_type: "ig_exchange_token", client_secret: cfg.ig_app_secret, access_token: s.access_token }));
    const me = await jfetch(`https://graph.instagram.com/${GV}/me?fields=user_id,username&access_token=${l.access_token}`);
    tok = { access_token: l.access_token, user_id: me.user_id || s.user_id, username: me.username, refreshed: Date.now() };
  } else if (n === "google") {
    const t = await jfetch("https://oauth2.googleapis.com/token", { method: "POST", body: form({ client_id: cfg.google_client_id, client_secret: cfg.google_client_secret, redirect_uri: cb, grant_type: "authorization_code", code }) });
    let channel = ""; try { const c = await jfetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", { headers: { authorization: "Bearer " + t.access_token } }); channel = c.items && c.items[0] && c.items[0].snippet.title; } catch (_) {}
    tok = { refresh_token: t.refresh_token, channel };
  } else if (n === "tiktok") {
    const t0 = await jfetch("https://open.tiktokapis.com/v2/oauth/token/", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form({ client_key: cfg.tiktok_client_key, client_secret: cfg.tiktok_client_secret, code, grant_type: "authorization_code", redirect_uri: cb }) });
    const t = (t0 && t0.data && t0.data.access_token) ? t0.data : t0;
    if (!t.access_token) throw new Error("TikTok sign-in failed: " + JSON.stringify(t).slice(0, 300));
    let name = ""; try { const i = await jfetch("https://open.tiktokapis.com/v2/user/info/?fields=display_name", { headers: { authorization: "Bearer " + t.access_token } }); name = i.data && i.data.user && i.data.user.display_name; } catch (_) {}
    tok = { refresh_token: t.refresh_token, access_token: t.access_token, expires: Date.now() + (t.expires_in || 0) * 1000, name };
  }
  await kput(env, "tok:" + n, tok);
  return Response.redirect(`${HOST}/s/${env.ADMIN}/?msg=${encodeURIComponent(n + " connected.")}`, 303);
}

/* ---------------- posting ---------------- */
async function page(env, want) {
  const fb = await kget(env, "tok:facebook"); if (!fb || !fb.pages || !fb.pages.length) throw new Error("Facebook is not connected.");
  return (want && fb.pages.find(x => x.id === want || x.name.toLowerCase().includes(String(want).toLowerCase()))) || fb.pages[0];
}
async function fbPost(env, a) {
  const pg = await page(env, a.page), base = `https://graph.facebook.com/${GV}/${pg.id}`;
  if (a.video_url && a.reel) {
    const st = await jfetch(`${base}/video_reels`, { method: "POST", body: form({ upload_phase: "start", access_token: pg.access_token }) });
    await jfetch(`https://rupload.facebook.com/video-upload/${GV}/${st.video_id}`, { method: "POST", headers: { authorization: "OAuth " + pg.access_token, file_url: a.video_url } });
    const fin = await jfetch(`${base}/video_reels`, { method: "POST", body: form({ upload_phase: "finish", video_id: st.video_id, video_state: a.draft ? "DRAFT" : "PUBLISHED", description: a.text, access_token: pg.access_token }) });
    return { network: "facebook", type: "reel", page: pg.name, id: st.video_id, result: fin };
  }
  if (a.video_url) return { network: "facebook", type: "video", page: pg.name, ...(await jfetch(`${base}/videos`, { method: "POST", body: form({ file_url: a.video_url, description: a.text, published: a.draft ? "false" : "true", access_token: pg.access_token }) })) };
  if (a.image_url) return { network: "facebook", type: "photo", page: pg.name, ...(await jfetch(`${base}/photos`, { method: "POST", body: form({ url: a.image_url, caption: a.text, published: a.draft ? "false" : "true", access_token: pg.access_token }) })) };
  return { network: "facebook", type: "post", page: pg.name, ...(await jfetch(`${base}/feed`, { method: "POST", body: form({ message: a.text, link: a.link, published: a.draft ? "false" : "true", access_token: pg.access_token }) })) };
}
async function igPost(env, a) {
  let ig = await kget(env, "tok:instagram"), G = "https://graph.instagram.com";
  if (!ig) { /* Instagram linked to the Facebook Page: posts through the Page's sign-in (no separate Instagram app needed) */
    const fb = await kget(env, "tok:facebook"), p = fb && fb.pages && fb.pages.find(x => x.ig);
    if (!p) throw new Error("Instagram is not connected. Link the Instagram account to the Facebook Page, then tap Connect Facebook again.");
    ig = { user_id: p.ig, access_token: p.access_token, username: p.name + " (Instagram)" }; G = "https://graph.facebook.com"; }
  const base = `${G}/${GV}/${ig.user_id}`, T = ig.access_token;
  const container = async o => (await jfetch(`${base}/media`, { method: "POST", body: form({ ...o, access_token: T }) })).id;
  const ready = async id => { for (let i = 0; i < 40; i++) { const s = await jfetch(`${G}/${GV}/${id}?fields=status_code,status&access_token=${T}`); if (s.status_code === "FINISHED") return; if (s.status_code === "ERROR") throw new Error("Instagram could not process the media: " + (s.status || "")); await sleep(3000); } throw new Error("Instagram is still processing; try publishing again in a minute."); };
  let id;
  if (a.carousel && a.carousel.length) {
    const kids = []; for (const m of a.carousel.slice(0, 10)) { const k = await container(/\.(mp4|mov)(\?|$)/i.test(m) ? { video_url: m, media_type: "VIDEO", is_carousel_item: "true" } : { image_url: m, is_carousel_item: "true" }); await ready(k); kids.push(k); }
    id = await container({ media_type: "CAROUSEL", children: kids.join(","), caption: a.caption });
  } else if (a.video_url) id = await container({ video_url: a.video_url, media_type: a.story ? "STORIES" : "REELS", caption: a.story ? undefined : a.caption, share_to_feed: a.story ? undefined : "true" });
  else if (a.image_url) id = await container(a.story ? { image_url: a.image_url, media_type: "STORIES" } : { image_url: a.image_url, caption: a.caption });
  else throw new Error("Instagram needs image_url, video_url or carousel.");
  await ready(id);
  const pub = await jfetch(`${base}/media_publish`, { method: "POST", body: form({ creation_id: id, access_token: T }) });
  return { network: "instagram", account: ig.username, id: pub.id };
}
async function googleToken(env) {
  const g = await kget(env, "tok:google"), cfg = (await kget(env, "cfg")) || {}; if (!g || !g.refresh_token) throw new Error("YouTube is not connected.");
  return (await jfetch("https://oauth2.googleapis.com/token", { method: "POST", body: form({ client_id: cfg.google_client_id, client_secret: cfg.google_client_secret, refresh_token: g.refresh_token, grant_type: "refresh_token" }) })).access_token;
}
async function ytUpload(env, a) {
  const at = await googleToken(env), v = await fetch(a.video_url); if (!v.ok) throw new Error("Could not download the video from " + a.video_url);
  const len = Number(v.headers.get("content-length") || 0), type = (v.headers.get("content-type") || "video/mp4").split(";")[0];
  const bytes = len ? null : await v.arrayBuffer(), size = len || bytes.byteLength; // long videos stream straight through without being held in memory
  const meta = { snippet: { title: (a.title || "").slice(0, 100), description: a.description || "", tags: a.tags || [], categoryId: "27" }, status: { privacyStatus: a.privacy || "public", selfDeclaredMadeForKids: false } };
  const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", { method: "POST", headers: { authorization: "Bearer " + at, "content-type": "application/json; charset=UTF-8", "x-upload-content-length": String(size), "x-upload-content-type": type }, body: JSON.stringify(meta) });
  if (!init.ok) throw new Error("YouTube refused the upload: " + (await init.text()).slice(0, 500));
  const r = await fetch(init.headers.get("location"), { method: "PUT", headers: { "content-type": type, "content-length": String(size) }, body: bytes || v.body }); const d = await r.json();
  if (!r.ok) throw new Error("YouTube upload failed: " + JSON.stringify(d).slice(0, 500));
  return { network: "youtube", id: d.id, url: "https://youtu.be/" + d.id, privacy: d.status && d.status.privacyStatus };
}
async function tiktokToken(env, force) {
  const t = await kget(env, "tok:tiktok"), cfg = (await kget(env, "cfg")) || {}; if (!t) throw new Error("TikTok is not connected.");
  if (!force && t.access_token && t.expires > Date.now() + 60000) return t.access_token;
  const n0 = await jfetch("https://open.tiktokapis.com/v2/oauth/token/", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form({ client_key: cfg.tiktok_client_key, client_secret: cfg.tiktok_client_secret, grant_type: "refresh_token", refresh_token: t.refresh_token }) });
  const n = (n0 && n0.data && n0.data.access_token) ? n0.data : n0;
  if (!n.access_token) throw new Error("TikTok refresh failed, reconnect TikTok: " + JSON.stringify(n).slice(0, 300));
  Object.assign(t, { access_token: n.access_token, refresh_token: n.refresh_token || t.refresh_token, expires: Date.now() + n.expires_in * 1000 }); await kput(env, "tok:tiktok", t); return t.access_token;
}
async function ttDraft(env, a, retried) { // sends the video to the TikTok app's inbox; the owner adds sounds and posts from the app
  try { return await ttDraft1(env, a, await tiktokToken(env, retried)); } catch (e) { if (!retried && /access_token_invalid|401/.test(String(e.message))) return ttDraft(env, a, true); throw e; }
}
async function ttDraft1(env, a, at) {
  const v = await fetch(a.video_url); if (!v.ok) throw new Error("Could not download the video.");
  const bytes = new Uint8Array(await v.arrayBuffer()), size = bytes.byteLength, chunk = size <= 64e6 ? size : 10e6, count = Math.floor(size / chunk) || 1;
  const init = await jfetch("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", { method: "POST", headers: { authorization: "Bearer " + at, "content-type": "application/json; charset=UTF-8" }, body: JSON.stringify({ source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: chunk, total_chunk_count: count } }) });
  const url = init.data.upload_url;
  for (let i = 0; i < count; i++) { const s = i * chunk, e = i === count - 1 ? size : s + chunk; const r = await fetch(url, { method: "PUT", headers: { "content-type": "video/mp4", "content-range": `bytes ${s}-${e - 1}/${size}` }, body: bytes.slice(s, e) }); if (!r.ok && r.status !== 206 && r.status !== 201) throw new Error("TikTok upload failed: " + r.status); }
  return { network: "tiktok", publish_id: init.data.publish_id, note: "Sent to the TikTok app inbox. Open TikTok, tap the notification, add a sound if you like, and post." };
}
async function status(env) {
  const o = {}; for (const n of ["facebook", "instagram", "google", "tiktok"]) { let t = await kget(env, "tok:" + n); if (!t && n === "instagram") { const fb = await kget(env, "tok:facebook"), p = fb && fb.pages && fb.pages.find(x => x.ig); if (p) t = { username: "linked to the " + p.name + " Page" }; } o[n === "google" ? "youtube" : n] = t ? (n === "facebook" ? { pages: t.pages.map(x => x.name) } : n === "instagram" ? { username: t.username } : n === "google" ? { channel: t.channel } : { name: t.name }) : "not connected"; }
  return o;
}

/* ---------------- MCP ---------------- */
const TOOLS = [
  { name: "social_status", description: "Show which Solving Life accounts (Facebook Page, Instagram, YouTube, TikTok) are connected.", inputSchema: { type: "object", properties: {} } },
  { name: "facebook_post", description: "Post to the Solving Life Facebook Page: text, a link, a photo (image_url), a video (video_url) or a Reel (video_url with reel=true). Media must be a public https URL. Posts publicly unless draft=true.", inputSchema: { type: "object", properties: { text: { type: "string" }, link: { type: "string" }, image_url: { type: "string" }, video_url: { type: "string" }, reel: { type: "boolean" }, draft: { type: "boolean" }, page: { type: "string", description: "Page name or id if more than one" } }, required: ["text"] } },
  { name: "instagram_post", description: "Publish to the Solving Life Instagram: a photo (image_url), a Reel (video_url), a Story (story=true) or a carousel (carousel = list of up to 10 image/video URLs). Media must be a public https URL (JPEG images; MP4 videos).", inputSchema: { type: "object", properties: { caption: { type: "string" }, image_url: { type: "string" }, video_url: { type: "string" }, story: { type: "boolean" }, carousel: { type: "array", items: { type: "string" } } } } },
  { name: "youtube_upload", description: "Upload a video (public https MP4 URL) to the Solving Life YouTube channel. Vertical videos under 3 minutes become Shorts. privacy: public, unlisted or private.", inputSchema: { type: "object", properties: { video_url: { type: "string" }, title: { type: "string" }, description: { type: "string" }, tags: { type: "array", items: { type: "string" } }, privacy: { type: "string", enum: ["public", "unlisted", "private"] } }, required: ["video_url", "title"] } },
  { name: "tiktok_send_to_app", description: "Send a video (public https MP4 URL) to the Solving Life TikTok app's inbox as a draft; the owner finishes and posts it in the TikTok app.", inputSchema: { type: "object", properties: { video_url: { type: "string" } }, required: ["video_url"] } }
];
async function mcp(req, env) {
  if (req.method === "GET") return new Response("Method not allowed", { status: 405 });
  if (req.method === "DELETE") return new Response(null, { status: 204 });
  const msg = await req.json(), one = async m => {
    if (m.id === undefined || m.id === null) return null; // notifications
    const ok = result => ({ jsonrpc: "2.0", id: m.id, result }), bad = (code, message) => ({ jsonrpc: "2.0", id: m.id, error: { code, message } });
    if (m.method === "initialize") return ok({ protocolVersion: (m.params && m.params.protocolVersion) || "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "solving-life-social", version: "1.0.0" }, instructions: "Posts to the Solving Life LLC business accounts. Always show the owner the exact text and media and get a clear yes before calling a posting tool." });
    if (m.method === "ping") return ok({});
    if (m.method === "tools/list") return ok({ tools: TOOLS });
    if (m.method === "tools/call") {
      const a = (m.params && m.params.arguments) || {}, n = m.params && m.params.name;
      try {
        const out = n === "social_status" ? await status(env) : n === "facebook_post" ? await fbPost(env, a) : n === "instagram_post" ? await igPost(env, a) : n === "youtube_upload" ? await ytUpload(env, a) : n === "tiktok_send_to_app" ? await ttDraft(env, a) : null;
        if (out === null) return bad(-32602, "Unknown tool " + n);
        return ok({ content: [{ type: "text", text: JSON.stringify(out, null, 1) }] });
      } catch (e) { return ok({ content: [{ type: "text", text: "Error: " + e.message }], isError: true }); }
    }
    return bad(-32601, "Method not found: " + m.method);
  };
  if (Array.isArray(msg)) { const r = (await Promise.all(msg.map(one))).filter(Boolean); return r.length ? J(r) : new Response(null, { status: 202 }); }
  const r = await one(msg); return r ? J(r) : new Response(null, { status: 202 });
}
