// Solving Life social connector: a private MCP server on Cloudflare Workers (free plan) that posts to the
// business Facebook Page, Instagram, YouTube and TikTok through their official free APIs.
// Secrets live in Cloudflare only (Worker secret ADMIN, KV namespace SL). Nothing secret is in this file.
// Routes (all private ones carry the ADMIN key in the path):
//   GET  /s/<ADMIN>/            setup page: save app keys, connect each network, see status
//   POST /s/<ADMIN>/save        save app keys from the setup page form
//   GET  /s/<ADMIN>/go/<net>    start sign-in with facebook | instagram | google | tiktok | x
//   GET  /cb/<net>              sign-in callback (state must match)
//   POST /mcp/<ADMIN>           MCP endpoint (JSON-RPC over HTTP) used by Claude
//   GET  /m/<driveId>/<sig>.mp4 public read-only stream of one Google Drive video (sig = HMAC of the id with ADMIN), for Facebook/TikTok to fetch
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
      if (p[0] === "m" && p[1] && p[2]) { const id = p[1]; if (p[2].replace(/\.mp4$/, "") !== await sig(env, id)) return new Response("Not found", { status: 404 }); return await driveStream(env, id, req); }
      if (!env.ADMIN || p[1] !== env.ADMIN) return new Response("Not found", { status: 404 });
      if (p[0] === "s" && req.method === "GET" && !p[2]) return new Response(await setupPage(env, u.searchParams.get("msg")), { headers: H });
      if (p[0] === "s" && p[2] === "save" && req.method === "POST") return await save(req, env);
      if (p[0] === "s" && p[2] === "go" && p[3]) return await startAuth(p[3], env);
      if (p[0] === "s" && p[2] === "tiktok") return new Response(await tiktokPage(env), { headers: H });
      if (p[0] === "s" && p[2] === "reddit") return new Response(await redditPage(env, req, p[3]), { headers: H });
      if (p[0] === "mcp") return await mcp(req, env);
      return new Response("Not found", { status: 404 });
    } catch (e) {
      return new Response(`<p>Something went wrong: ${esc(e.message)}</p><p><a href="/s/${esc(env.ADMIN)}/">Back to setup</a></p>`, { status: 500, headers: H });
    }
  },
  async scheduled(e, env) {
    if (e && e.cron === "21 9 * * *") return ytQueue(env, 5);
    if (e && e.cron === "7 2 * * 3") return xWeekly(env); // weekly X post (paid per post, so once a week)
    if (e && e.cron === "3 1 * * *") return crossPost(env); // when each YouTube video goes public: Facebook Reel + TikTok draft // daily: upload the next scheduled YouTube videos (API quota ~6 uploads/day)
    // weekly: keep the Instagram token fresh (it lasts 60 days)
    const ig = await kget(env, "tok:instagram"); if (!ig || !ig.access_token) return;
    try { const d = await jfetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${ig.access_token}`); ig.access_token = d.access_token; ig.refreshed = Date.now(); await kput(env, "tok:instagram", ig); } catch (_) {}
  }
};

/* ---------------- setup page ---------------- */
const FIELDS = [
  ["meta_app_id", "Meta app ID (for Facebook and Instagram)"], ["meta_app_secret", "Meta app secret", 1], ["meta_config_id", "Meta login configuration ID (optional; from Facebook Login for Business, Configurations)"],
  ["ig_app_id", "Instagram app ID (from the Instagram use case)"], ["ig_app_secret", "Instagram app secret", 1],
  ["google_client_id", "Google OAuth client ID (for YouTube)"], ["google_client_secret", "Google OAuth client secret", 1],
  ["tiktok_client_key", "TikTok client key"], ["tiktok_client_secret", "TikTok client secret", 1],
  ["x_client_id", "X OAuth 2.0 client ID"], ["x_client_secret", "X OAuth 2.0 client secret", 1]
];
async function setupPage(env, msg) {
  const cfg = (await kget(env, "cfg")) || {}, A = env.ADMIN;
  const st = {}; for (const n of ["facebook", "instagram", "google", "tiktok", "x"]) st[n] = await kget(env, "tok:" + n);
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
${row("x", "X (Twitter)", t => t.username ? "@" + t.username : "")}
</table>
<h2>2. App keys</h2><p>Paste each key from the developer pages. Saved keys show as ●●●●; leave a box empty to keep what is saved.</p>
<form method="post" action="/s/${A}/save">${FIELDS.map(([k, l, sec]) => `<label for="${k}">${l}</label><input id="${k}" name="${k}" autocomplete="off" ${sec ? 'type="password"' : ""} placeholder="${cfg[k] ? (sec ? "●●●● saved" : esc(cfg[k])) : ""}">`).join("")}
<p><button type="submit">Save keys</button></p></form>
<h3>Google (YouTube) shortcut</h3><p>Pick the client_secret_….json file you downloaded from Google Cloud. It fills in both Google boxes and saves.</p>
<p><label class="b" style="display:inline-block;cursor:pointer">Choose Google file<input id="gfile" type="file" accept=".json,application/json" style="display:none"></label></p>
<script>document.getElementById("gfile").onchange=async e=>{try{const j=JSON.parse(await e.target.files[0].text()),w=j.web||j.installed;document.getElementById("google_client_id").value=w.client_id;document.getElementById("google_client_secret").value=w.client_secret;document.querySelector("form").submit()}catch(x){alert("That is not the Google client file.")}};</script>
<h2>3. Addresses the developer pages ask for</h2><p>Redirect / callback addresses:<br>${["facebook", "instagram", "google", "tiktok", "x"].map(n => `<code>${HOST}/cb/${n}</code>`).join("<br>")}</p>
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
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + form({ client_id: cfg.google_client_id, redirect_uri: cb, response_type: "code", access_type: "offline", prompt: "consent", state, scope: "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/drive.readonly" }); }
  else if (n === "tiktok") { if (!cfg.tiktok_client_key) throw new Error("Save the TikTok client key first.");
    url = "https://www.tiktok.com/v2/auth/authorize/?" + form({ client_key: cfg.tiktok_client_key, redirect_uri: cb, response_type: "code", state, scope: "user.info.basic,video.upload" }); }
  else if (n === "x") { if (!cfg.x_client_id) throw new Error("Save the X client ID first.");
    const ver = b64u(crypto.getRandomValues(new Uint8Array(48))), ch = b64u(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ver))));
    await env.SL.put("pkce:" + state, ver, { expirationTtl: 900 });
    url = "https://x.com/i/oauth2/authorize?" + form({ response_type: "code", client_id: cfg.x_client_id, redirect_uri: cb, scope: "tweet.read tweet.write users.read media.write offline.access", state, code_challenge: ch, code_challenge_method: "S256" }); }
  else throw new Error("Unknown network");
  return Response.redirect(url, 302);
}
async function callback(n, u, env) {
  const state = u.searchParams.get("state"), code = u.searchParams.get("code");
  const want = state && await env.SL.get("state:" + state), ver = n === "x" && state ? await env.SL.get("pkce:" + state) : null;
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
  } else if (n === "x") {
    const t = await jfetch("https://api.x.com/2/oauth2/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", authorization: "Basic " + btoa(cfg.x_client_id + ":" + cfg.x_client_secret) }, body: form({ grant_type: "authorization_code", code, redirect_uri: cb, code_verifier: ver || "", client_id: cfg.x_client_id }) });
    if (!t.access_token) throw new Error("X sign-in failed: " + JSON.stringify(t).slice(0, 300));
    let username = ""; try { const me = await jfetch("https://api.x.com/2/users/me", { headers: { authorization: "Bearer " + t.access_token } }); username = me.data && me.data.username; } catch (_) {}
    tok = { access_token: t.access_token, refresh_token: t.refresh_token, expires: Date.now() + (t.expires_in || 0) * 1000, username };
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
  if (a.video_url && a.story) { // Facebook Page video story (shows for 24 hours)
    const st = await jfetch(`${base}/video_stories`, { method: "POST", body: form({ upload_phase: "start", access_token: pg.access_token }) });
    await jfetch(`https://rupload.facebook.com/video-upload/${GV}/${st.video_id}`, { method: "POST", headers: { authorization: "OAuth " + pg.access_token, file_url: a.video_url } });
    const fin = await jfetch(`${base}/video_stories`, { method: "POST", body: form({ upload_phase: "finish", video_id: st.video_id, access_token: pg.access_token }) });
    return { network: "facebook", type: "story", page: pg.name, id: fin.post_id || st.video_id };
  }
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
async function ytQueue(env, n) { // KV "ytq": list of youtube_upload argument objects (with drive_id, publish_at, playlist_id); results go to "ytlog"
  const q = (await kget(env, "ytq")) || [], log = (await kget(env, "ytlog")) || [];
  while (n-- > 0 && q.length) { const a = q[0]; try { const r = await ytUpload(env, a); log.push({ at: new Date().toISOString(), title: a.title, id: r.id, publish_at: r.publish_at, playlist: r.playlist }); q.shift(); } catch (err) { log.push({ at: new Date().toISOString(), title: a.title, error: String(err.message).slice(0, 300) }); break; } }
  await kput(env, "ytq", q); await kput(env, "ytlog", log.slice(-200)); return { left: q.length };
}
async function crossPost(env) { // KV "xq": same items as the YouTube schedule; posts the ones whose publish_at has passed
  const q = (await kget(env, "xq")) || [], log = (await kget(env, "xlog")) || [], now = Date.now(), keep = [];
  for (const a of q) {
    if (Date.parse(a.publish_at) > now + 300000) { keep.push(a); continue; }
    const url = a.drive_id ? (await driveLink(env, a)).url : a.video_url, text = a.title + "\n\n" + (a.description || "").replace(/#shorts\s?/g, "");
    const r = { at: new Date().toISOString(), title: a.title };
    if (a.no_facebook) r.facebook = "skipped"; else try { r.facebook = (await fbPost(env, { text, video_url: url, reel: true })).id; } catch (err) { r.facebook = "error: " + String(err.message).slice(0, 200); }
    if (!a.no_facebook) try { r.fb_story = (await fbPost(env, { video_url: url, story: true })).id; } catch (err) { r.fb_story = "error: " + String(err.message).slice(0, 200); }
    r.caption = ttCaption(a); r.video_url = url;
    try { r.tiktok = (await ttDraft(env, { video_url: url })).publish_id; } catch (err) { r.tiktok = "error: " + String(err.message).slice(0, 200); }
    log.push(r);
  }
  await kput(env, "xq", keep); await kput(env, "xlog", log.slice(-200)); return { left: keep.length };
}
async function xWeekly(env) { // KV "xw": list of weekly X posts {text, video_url?}; posts the first one, logs to "xwlog"
  if (!(await kget(env, "tok:x"))) return { skipped: "X not connected" };
  const q = (await kget(env, "xw")) || [], log = (await kget(env, "xwlog")) || []; if (!q.length) return { left: 0 };
  const a = q.shift(), r = { at: new Date().toISOString(), text: a.text.slice(0, 60) };
  try { r.id = (await xPost(env, a)).id; } catch (err) { r.error = String(err.message).slice(0, 200); q.unshift(a); }
  await kput(env, "xw", q); await kput(env, "xwlog", log.concat(r).slice(-100)); return r;
}
async function ytQ(env, a) {
  if (a.action === "xq_replace") { await kput(env, "xq", a.items || []); return { xq: (a.items || []).length }; }
  if (a.action === "xq_get") return { xq: ((await kget(env, "xq")) || []).length, log: ((await kget(env, "xlog")) || []).slice(-15) };
  if (a.action === "xw_replace") { await kput(env, "xw", a.items || []); return { xw: (a.items || []).length }; }
  if (a.action === "xw_get") return { xw: ((await kget(env, "xw")) || []).map(x => x.text.slice(0, 50)), log: ((await kget(env, "xwlog")) || []).slice(-10) };
  if (a.action === "xw_run") return xWeekly(env);
  if (a.action === "rd_replace") { await kput(env, "rd", a.items || []); return { rd: (a.items || []).length, page: "/s/<ADMIN>/reddit" }; }
  if (a.action === "rd_get") return { rd: (await kget(env, "rd")) || [], pool: ((await kget(env, "rdpool")) || []).length };
  if (a.action === "rd_pool") { await kput(env, "rdpool", a.items || []); return { pool: (a.items || []).length }; }
  if (a.action === "run") return ytQueue(env, Math.min(6, a.n || 1));
  let q = (await kget(env, "ytq")) || [];
  if (a.action === "append") q = q.concat(a.items || []); else if (a.action === "replace") q = a.items || [];
  if (a.action !== "get") await kput(env, "ytq", q);
  return { queued: q.length, next: q.slice(0, 10).map(x => [x.publish_at, x.title]), log: ((await kget(env, "ytlog")) || []).slice(-15) };
}
async function sig(env, id) { const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.ADMIN), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return [...new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode("drive:" + id)))].slice(0, 12).map(b => b.toString(16).padStart(2, "0")).join(""); }
async function driveStream(env, id, req) {
  const at = await googleToken(env), h = { authorization: "Bearer " + at }; const rg = req && req.headers.get("range"); if (rg) h.range = rg;
  const r = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media&supportsAllDrives=true`, { headers: h });
  if (!r.ok && r.status !== 206) return new Response("Drive error " + r.status, { status: 502 });
  const o = new Headers(); for (const k of ["content-length", "content-range", "accept-ranges"]) { const v = r.headers.get(k); if (v) o.set(k, v); } o.set("content-type", "video/mp4"); o.set("cache-control", "public, max-age=3600");
  return new Response(r.body, { status: r.status, headers: o });
}
async function driveLink(env, a) { if (!/^[\w-]{10,}$/.test(a.drive_id || "")) throw new Error("drive_id looks wrong"); return { url: `${HOST}/m/${a.drive_id}/${await sig(env, a.drive_id)}.mp4` }; }
async function ytApi(env, a) { // YouTube Data API v3 for the channel: playlists, playlistItems, videos (titles/descriptions), channels (branding)
  const m = (a.method || "GET").toUpperCase(); if (!/^[a-zA-Z]+$/.test(a.resource || "")) throw new Error("resource must be like playlists, playlistItems, videos, channels, search");
  const at = await googleToken(env), q = new URLSearchParams(a.query || {});
  const r = await fetch(`https://www.googleapis.com/youtube/v3/${a.resource}?${q}`, { method: m, headers: { authorization: "Bearer " + at, "content-type": "application/json" }, body: m === "GET" || m === "DELETE" ? undefined : JSON.stringify(a.body || {}) });
  const t = await r.text(); if (!r.ok) throw new Error("YouTube " + r.status + ": " + t.slice(0, 600)); return t ? JSON.parse(t) : { ok: true };
}
async function ytUpload(env, a) {
  const at = await googleToken(env), v = a.drive_id ? await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(a.drive_id)}?alt=media&supportsAllDrives=true`, { headers: { authorization: "Bearer " + at } }) : await fetch(a.video_url); if (!v.ok) throw new Error("Could not download the video: " + v.status);
  const len = Number(v.headers.get("content-length") || 0), type = (v.headers.get("content-type") || "video/mp4").split(";")[0];
  const bytes = len ? null : await v.arrayBuffer(), size = len || bytes.byteLength; // long videos stream straight through without being held in memory
  const meta = { snippet: { title: (a.title || "").slice(0, 100), description: a.description || "", tags: a.tags || [], categoryId: "27" }, status: a.publish_at ? { privacyStatus: "private", publishAt: a.publish_at, selfDeclaredMadeForKids: false } : { privacyStatus: a.privacy || "public", selfDeclaredMadeForKids: false } };
  const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", { method: "POST", headers: { authorization: "Bearer " + at, "content-type": "application/json; charset=UTF-8", "x-upload-content-length": String(size), "x-upload-content-type": type }, body: JSON.stringify(meta) });
  if (!init.ok) throw new Error("YouTube refused the upload: " + (await init.text()).slice(0, 500));
  const r = await fetch(init.headers.get("location"), { method: "PUT", headers: { "content-type": type, "content-length": String(size) }, body: bytes || v.body }); const d = await r.json();
  if (!r.ok) throw new Error("YouTube upload failed: " + JSON.stringify(d).slice(0, 500));
  let playlist; if (a.playlist_id && d.id) { try { await ytApi(env, { resource: "playlistItems", method: "POST", query: { part: "snippet" }, body: { snippet: { playlistId: a.playlist_id, resourceId: { kind: "youtube#video", videoId: d.id } } } }); playlist = a.playlist_id; } catch (e) { playlist = "not added: " + e.message.slice(0, 200); } }
  return { network: "youtube", id: d.id, url: "https://youtu.be/" + d.id, privacy: d.status && d.status.privacyStatus, publish_at: d.status && d.status.publishAt, playlist };
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
  // Our own signed Drive links (HOST/m/<id>/<sig>.mp4) are read straight from Drive: a Worker cannot fetch its own address.
  const own = /^https:\/\/social\.solvinglifewith\.com\/m\/([\w-]{10,})\/([0-9a-f]{24})\.mp4$/.exec(a.video_url || "");
  const v = own && own[2] === await sig(env, own[1]) ? await driveStream(env, own[1]) : await fetch(a.video_url);
  if (!v.ok) throw new Error("Could not download the video (" + v.status + ").");
  const bytes = new Uint8Array(await v.arrayBuffer()), size = bytes.byteLength, chunk = size <= 64e6 ? size : 10e6, count = Math.floor(size / chunk) || 1;
  const init = await jfetch("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", { method: "POST", headers: { authorization: "Bearer " + at, "content-type": "application/json; charset=UTF-8" }, body: JSON.stringify({ source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: chunk, total_chunk_count: count } }) });
  const url = init.data.upload_url;
  for (let i = 0; i < count; i++) { const s = i * chunk, e = i === count - 1 ? size : s + chunk; const r = await fetch(url, { method: "PUT", headers: { "content-type": "video/mp4", "content-range": `bytes ${s}-${e - 1}/${size}` }, body: bytes.slice(s, e) }); if (!r.ok && r.status !== 206 && r.status !== 201) throw new Error("TikTok upload failed: " + r.status); }
  return { network: "tiktok", publish_id: init.data.publish_id, note: "Sent to the TikTok app inbox. Open TikTok, tap the notification, add a sound if you like, and post." };
}
function b64u(b) { return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
async function xToken(env, force) {
  const t = await kget(env, "tok:x"), cfg = (await kget(env, "cfg")) || {}; if (!t) throw new Error("X is not connected.");
  if (!force && t.expires > Date.now() + 120000) return t.access_token;
  const n = await jfetch("https://api.x.com/2/oauth2/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", authorization: "Basic " + btoa(cfg.x_client_id + ":" + cfg.x_client_secret) }, body: form({ grant_type: "refresh_token", refresh_token: t.refresh_token, client_id: cfg.x_client_id }) });
  if (!n.access_token) throw new Error("X token refresh failed: " + JSON.stringify(n).slice(0, 200));
  Object.assign(t, { access_token: n.access_token, refresh_token: n.refresh_token || t.refresh_token, expires: Date.now() + n.expires_in * 1000 }); await kput(env, "tok:x", t); return t.access_token;
}
async function xPost(env, a) { // posts text (links removed: X charges more for links) with an optional MP4 video
  const at = await xToken(env), H2 = { authorization: "Bearer " + at };
  let text = String(a.text || "").replace(/https?:\/\/\S+/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if ([...text].length > 280) text = [...text].slice(0, 277).join("").replace(/\s+\S*$/, "") + "…";
  const body = { text };
  if (a.video_url) {
    const own = /^https:\/\/social\.solvinglifewith\.com\/m\/([\w-]{10,})\/([0-9a-f]{24})\.mp4$/.exec(a.video_url);
    const v = own && own[2] === await sig(env, own[1]) ? await driveStream(env, own[1]) : await fetch(a.video_url);
    if (!v.ok) throw new Error("Could not download the video (" + v.status + ").");
    const bytes = new Uint8Array(await v.arrayBuffer());
    const init = await jfetch("https://api.x.com/2/media/upload/initialize", { method: "POST", headers: { ...H2, "content-type": "application/json" }, body: JSON.stringify({ media_type: "video/mp4", total_bytes: bytes.byteLength, media_category: "tweet_video" }) });
    const id = init.data.id, seg = 4e6;
    for (let i = 0, k = 0; i < bytes.byteLength; i += seg, k++) { const fd = new FormData(); fd.append("segment_index", String(k)); fd.append("media", new Blob([bytes.slice(i, i + seg)], { type: "video/mp4" }), "v.mp4"); const r = await fetch(`https://api.x.com/2/media/upload/${id}/append`, { method: "POST", headers: H2, body: fd }); if (!r.ok) throw new Error("X upload failed: " + r.status + " " + (await r.text()).slice(0, 200)); }
    let fin = await jfetch(`https://api.x.com/2/media/upload/${id}/finalize`, { method: "POST", headers: H2 }), pi = fin.data && fin.data.processing_info;
    for (let n = 0; pi && pi.state !== "succeeded" && n < 30; n++) { if (pi.state === "failed") throw new Error("X video processing failed."); await new Promise(r => setTimeout(r, Math.min(10, pi.check_after_secs || 3) * 1000)); const st = await jfetch(`https://api.x.com/2/media/upload?command=STATUS&media_id=${id}`, { headers: H2 }); pi = st.data && st.data.processing_info; }
    body.media = { media_ids: [id] };
  }
  const p = await jfetch("https://api.x.com/2/tweets", { method: "POST", headers: { ...H2, "content-type": "application/json" }, body: JSON.stringify(body) });
  return { network: "x", id: p.data && p.data.id };
}
// Reddit helper (Reddit's Data API needs manual approval): drafts in KV "rd" = [{id, sub, kind: "post"|"reply", title, text, thread, done}]
// Page /s/<ADMIN>/reddit lists them; "Open in Reddit" opens the subreddit's submit form with title and text filled in.
function ttCaption(a) { // TikTok inbox drafts carry no text, so each video gets a ready caption to paste (max 2200 characters)
  const d = String(a.description || "").replace(/#\w+/g, "").split("\n").filter(l => l.trim() && !/^General info/.test(l)).join("\n").trim();
  const tags = [...new Set((a.tags || []).map(t => "#" + String(t).replace(/[^A-Za-z0-9]/g, "")).filter(t => t.length > 2).concat(["#taxes", "#taxtips", "#moneytips", "#fyp"]))].slice(0, 8).join(" ");
  return (a.title + "\n\n" + d + "\n\n" + tags).slice(0, 2200);
}
async function tiktokPage(env) {
  const log = ((await kget(env, "xlog")) || []).filter(x => x.caption).slice(-7).reverse(), q = ((await kget(env, "xq")) || []).slice(0, 7);
  const card = (h, cap, vid, i) => `<div class="c"><p class="h">${esc(h)}</p><textarea readonly id="c${i}">${esc(cap)}</textarea><p><button onclick="navigator.clipboard.writeText(document.getElementById('c${i}').value);this.textContent='Copied ✓'">Copy caption</button>${vid ? ` <a class="b" href="${esc(vid)}" target="_blank" rel="noopener">Download video</a>` : ""}</p></div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>TikTok captions</title>
<style>body{font:16px/1.45 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:16px;color:#0F1B2D}h1{font-size:24px}.c{border:1px solid #E4E8EE;border-radius:14px;padding:14px;margin:14px 0}.h{font-weight:700;color:#C2410C;margin:0 0 6px}textarea{width:100%;box-sizing:border-box;min-height:170px;font:15px/1.4 system-ui;border:1px solid #CBD2DC;border-radius:10px;padding:10px}button,.b{display:inline-block;font:700 15px system-ui;padding:10px 14px;border-radius:10px;border:0;background:#0F1B2D;color:#fff;text-decoration:none}.b{background:#0f766e}</style></head><body>
<h1>TikTok captions</h1><p>TikTok inbox drafts arrive without text. Open the draft in TikTok, tap the caption box, paste the caption below, then Post. For a whole week at once: download the videos and schedule them in TikTok Studio on a computer.</p>
<h2>Sent to your TikTok inbox</h2>${log.map((x, i) => card(x.at.slice(0, 10) + " · " + x.title, x.caption, x.video_url, "l" + i)).join("") || "<p>Nothing sent yet.</p>"}
<h2>Coming next</h2>${q.map((a, i) => card(String(a.publish_at).slice(0, 10) + " · " + a.title, ttCaption(a), "", "q" + i)).join("")}</body></html>`;
}
async function redditPage(env, req, act) {
  let d = (await kget(env, "rd")) || [];
  if (act && act.startsWith("done-")) { const id = act.slice(5), was = d.find(x => x.id === id && !x.done); d = d.map(x => x.id === id ? { ...x, done: Date.now() } : x);
    if (was) { const pool = (await kget(env, "rdpool")) || [], i = pool.findIndex(x => (x.area || "Taxes") === (was.area || "Taxes")), j = i >= 0 ? i : 0; // next topic from the same area
      if (pool.length) { d.push({ ...pool[j], id: pool[j].id || String(Date.now()) }); pool.splice(j, 1); await kput(env, "rdpool", pool); } }
    await kput(env, "rd", d.filter(x => !x.done).concat(d.filter(x => x.done).slice(-30))); d = (await kget(env, "rd")) || []; }
  const card = x => {
    const sub = String(x.sub || "").replace(/^r\//, ""), sub_u = encodeURIComponent(sub);
    const open = x.kind === "post" ? `https://www.reddit.com/r/${sub_u}/submit?type=TEXT&title=${encodeURIComponent(x.title || "")}&text=${encodeURIComponent(x.text || "")}` : (x.thread || `https://www.reddit.com/r/${sub_u}/search/?q=${encodeURIComponent(x.search || "")}&sort=new`);
    return `<div class="c${x.done ? " d" : ""}"><p class="h">${x.kind === "post" ? "POST" : "REPLY"} · r/${esc(sub)}${x.done ? " · done" : ""}</p>${x.title ? `<h3>${esc(x.title)}</h3>` : ""}${x.search ? `<p class="s">Find a thread: search “${esc(x.search)}”</p>` : ""}
<textarea readonly id="t${esc(x.id)}">${esc(x.text || "")}</textarea>
<p><button onclick="navigator.clipboard.writeText(document.getElementById('t${esc(x.id)}').value);this.textContent='Copied ✓'">Copy text</button> <a class="b" href="${esc(open)}" target="_blank" rel="noopener">${x.kind === "post" ? "Open in Reddit (filled in)" : "Open Reddit"}</a> ${x.done ? "" : `<a class="b g" href="/s/${env.ADMIN}/reddit/done-${esc(x.id)}">Mark done</a>`}</p></div>`;
  };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Reddit helper</title>
<style>body{font:16px/1.45 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:16px;color:#0F1B2D}h1{font-size:24px}.c{border:1px solid #E4E8EE;border-radius:14px;padding:14px;margin:14px 0}.d{opacity:.5}.h{font-weight:700;color:#C2410C;margin:0}.s{color:#555}textarea{width:100%;box-sizing:border-box;min-height:150px;font:15px/1.4 system-ui;border:1px solid #CBD2DC;border-radius:10px;padding:10px}button,.b{display:inline-block;background:#FF4500;color:#fff;border:0;border-radius:10px;padding:10px 14px;font-weight:700;text-decoration:none;font-size:15px;margin:4px 4px 0 0}.g{background:#556}</style></head><body>
<h1>Reddit helper · u/SolvingLifeLLC</h1><p><b>Rule of thumb:</b> 9 helpful answers for every 1 mention of our apps. Never paste the same text twice. Claude writes these to follow each group's rules. Replies: open Reddit, find a matching recent question, paste. Posts: “Open in Reddit” fills in the title and text; check the group's rules, then tap Post.</p>
${(() => { const open = d.filter(x => !x.done), areas = [...new Set(open.map(x => x.area || "Taxes"))]; return areas.map(a => `<h2>${esc(a)}</h2>` + open.filter(x => (x.area || "Taxes") === a).map(card).join("")).join("") || "<p>No drafts waiting. Ask Claude for more Reddit drafts.</p>"; })()}
<h2>Exam talk to watch</h2><p class="s">Newest posts where people discuss studying for each exam: answer questions, learn what confuses people (great ideas for new app cards), and spot which exams people struggle with most.</p>
${[["Tax questions (r/tax)","subreddit:tax"],["Tax questions (r/personalfinance)","subreddit:personalfinance taxes"],["ITIN / nonresident","ITIN W-7 OR nonresident tax return"],["EA / SEE","\"enrolled agent\" exam"],["Series 65","\"series 65\""],["SSDI / EDPNA","SSDI appeal OR EDPNA"],["Customs broker","CBLE OR \"customs broker exam\""],["SIE (next app idea)","\"SIE exam\""],["Series 7","\"series 7\" exam"],["Life & health insurance license","\"life and health\" license exam"],["AFSP / tax preparer","\"annual filing season program\" OR AFTR"],["CPA","CPA exam FAR"],["Real estate license","\"real estate exam\" state"]].map(([n, q]) => `<a class="b" style="margin:4px 4px 0 0" href="https://www.reddit.com/search/?q=${encodeURIComponent(q)}&sort=new" target="_blank" rel="noopener">${esc(n)}</a>`).join("")}
<p class="s">${((await kget(env, "rdpool")) || []).length} more topics ready: each "Mark done" brings the next one from the same area.</p>
${d.some(x => x.done) ? "<h2>Done</h2>" + d.filter(x => x.done).slice(-10).map(card).join("") : ""}</body></html>`;
}
async function status(env) {
  const o = {}; for (const n of ["facebook", "instagram", "google", "tiktok", "x"]) { let t = await kget(env, "tok:" + n); if (!t && n === "instagram") { const fb = await kget(env, "tok:facebook"), p = fb && fb.pages && fb.pages.find(x => x.ig); if (p) t = { username: "linked to the " + p.name + " Page" }; } o[n === "google" ? "youtube" : n] = t ? (n === "facebook" ? { pages: t.pages.map(x => x.name) } : n === "instagram" ? { username: t.username } : n === "google" ? { channel: t.channel } : n === "x" ? { username: t.username } : { name: t.name }) : "not connected"; }
  return o;
}

/* ---------------- MCP ---------------- */
const TOOLS = [
  { name: "social_status", description: "Show which Solving Life accounts (Facebook Page, Instagram, YouTube, TikTok) are connected.", inputSchema: { type: "object", properties: {} } },
  { name: "facebook_post", description: "(story: true with video_url posts a 24-hour Page story) Post to the Solving Life Facebook Page: text, a link, a photo (image_url), a video (video_url) or a Reel (video_url with reel=true). Media must be a public https URL. Posts publicly unless draft=true.", inputSchema: { type: "object", properties: { text: { type: "string" }, link: { type: "string" }, image_url: { type: "string" }, video_url: { type: "string" }, reel: { type: "boolean" }, story: { type: "boolean" }, draft: { type: "boolean" }, page: { type: "string", description: "Page name or id if more than one" } }, required: ["text"] } },
  { name: "instagram_post", description: "Publish to the Solving Life Instagram: a photo (image_url), a Reel (video_url), a Story (story=true) or a carousel (carousel = list of up to 10 image/video URLs). Media must be a public https URL (JPEG images; MP4 videos).", inputSchema: { type: "object", properties: { caption: { type: "string" }, image_url: { type: "string" }, video_url: { type: "string" }, story: { type: "boolean" }, carousel: { type: "array", items: { type: "string" } } } } },
  { name: "youtube_upload", description: "Upload a video (public https MP4 URL) to the Solving Life YouTube channel. Vertical videos under 3 minutes become Shorts. privacy: public, unlisted or private.", inputSchema: { type: "object", properties: { video_url: { type: "string" }, title: { type: "string" }, description: { type: "string" }, tags: { type: "array", items: { type: "string" } }, privacy: { type: "string", enum: ["public", "unlisted", "private"] }, publish_at: { type: "string", description: "Schedule: ISO time when the video goes public (it stays private until then)" }, playlist_id: { type: "string", description: "Add the video to this playlist" }, drive_id: { type: "string", description: "Google Drive file id of the video (instead of video_url)" } }, required: ["title"] } },
  { name: "drive_video_link", description: "Make a public read-only link (for facebook_post / tiktok_send_to_app video_url) to one video in the Solving Life Google Drive.", inputSchema: { type: "object", properties: { drive_id: { type: "string" } }, required: ["drive_id"] } },
  { name: "youtube_api", description: "Manage the Solving Life YouTube channel through YouTube Data API v3: list/create/update playlists, add videos to playlists (playlistItems), update video titles/descriptions/tags (videos, part=snippet), update channel branding (channels, part=brandingSettings), list uploads (search with forMine=true). Give resource, method, query (e.g. part, mine, id) and body.", inputSchema: { type: "object", properties: { resource: { type: "string" }, method: { type: "string", enum: ["GET", "POST", "PUT", "DELETE"] }, query: { type: "object" }, body: { type: "object" } }, required: ["resource"] } },
  { name: "youtube_queue", description: "Daily auto-upload queue for YouTube (5 a day). action: get (queue + recent log), append (items: youtube_upload argument objects with drive_id or video_url, title, description, tags, playlist_id, publish_at), replace (items), run (upload n now).", inputSchema: { type: "object", properties: { action: { type: "string", enum: ["get", "append", "replace", "run", "xq_get", "xq_replace", "xw_get", "xw_replace", "xw_run", "rd_get", "rd_replace", "rd_pool"] }, items: { type: "array", items: { type: "object" } }, n: { type: "number" } }, required: ["action"] } },
  { name: "x_post", description: "Post to the Solving Life X (Twitter) account: text up to 280 characters (links are removed to keep cost low) and an optional public https MP4 video_url.", inputSchema: { type: "object", properties: { text: { type: "string" }, video_url: { type: "string" } }, required: ["text"] } },
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
        const out = n === "social_status" ? await status(env) : n === "facebook_post" ? await fbPost(env, a) : n === "instagram_post" ? await igPost(env, a) : n === "youtube_upload" ? await ytUpload(env, a) : n === "youtube_api" ? await ytApi(env, a) : n === "youtube_queue" ? await ytQ(env, a) : n === "drive_video_link" ? await driveLink(env, a) : n === "tiktok_send_to_app" ? await ttDraft(env, a) : n === "x_post" ? await xPost(env, a) : null;
        if (out === null) return bad(-32602, "Unknown tool " + n);
        return ok({ content: [{ type: "text", text: JSON.stringify(out, null, 1) }] });
      } catch (e) { return ok({ content: [{ type: "text", text: "Error: " + e.message }], isError: true }); }
    }
    return bad(-32601, "Method not found: " + m.method);
  };
  if (Array.isArray(msg)) { const r = (await Promise.all(msg.map(one))).filter(Boolean); return r.length ? J(r) : new Response(null, { status: 202 }); }
  const r = await one(msg); return r ? J(r) : new Response(null, { status: 202 });
}
