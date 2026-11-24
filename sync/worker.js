// Solving Life progress sync: Google sign-in (ID token) -> one saved copy of the study app progress per Google account.
// Routes: GET /admin/me (Bearer token of an ADMINS account) -> dashboard data and the private hub link; POST /mail/start {email}, POST /mail/verify {email, code} (6-digit email code via Resend, KV mailkey/mailfrom; e:<email> maps an email to one account so Google and email sign-in share progress); POST /login {id_token} -> {token, email, saved:{upd, data}|null}; GET /load (Bearer token); POST /save (Bearer token) {upd, data}
// Storage: KV binding P, key "u:<google sub>" = {upd, data, email, at}. Session token = HMAC(SECRET) signed "sub.exp".
// ACCESS: "g:<email>" = grant {at, note, until?} (full access to every exam app); "t:<sub>" = free-preview minutes used (ms);
// "s:<sub>" = {email, name, first, last} sign-in index for the owner's hub. Kids app is always free (not checked here).
// GET /status, POST /tick {ms}: preview meter (60 minutes per Google account). Owner hub: /hub/<ADMIN> (secret ADMIN).
// WIX SALES: every 10 minutes (cron) paid Wix Stores orders for the bundle product give the buyer's email 12 months of access.
// The owner pastes a Wix API key (Orders read) in the hub; it is stored in KV "wixkey"; "wixlast" = last order time checked.
const ORIGINS = ["https://study.solvinglifewith.com", "https://ea-exam-app.linaskerbelis.workers.dev", "http://localhost:8080"];
const CLIENT_IDS = ["184315933690-kq6qmc1qjsi177ht716s3ignsn0osd4u.apps.googleusercontent.com"];
const MAX = 20 * 1024 * 1024;
const ALWAYS = ["linaskerbelis@gmail.com", "info@solvinglifewith.com", "info@solvinglifellc.com", "cristyesplanada@gmail.com"];
const ADMINS = ["info@solvinglifewith.com"]; // Google accounts that can open the admin dashboard (study.solvinglifewith.com/admin/)
const WIX_SITE = "8124ca47-5a9e-4015-ad89-7bb92faaf4bf";
const WIX_PRODUCTS = ["3dcbe428-b0f3-4b32-ae59-70a38b0f2279"]; // "All 4 Exam Study Apps – 12 Months (Buy One, Get All)"
const YEAR = 365 * 864e5;
async function cfg(env) { return (await env.P.get("cfg", "json")) || { previewMin: 60 }; }
async function grantOk(env, email) { const g = await env.P.get("g:" + email, "json"); return !!g && (!g.until || g.until > Date.now()); }
async function access(env, sub) {
  const who = await env.P.get("s:" + sub, "json"), email = (who && who.email || "").toLowerCase();
  if (email && (ALWAYS.includes(email) || await grantOk(env, email))) return { access: "full", email };
  const used = +(await env.P.get("t:" + sub)) || 0, bonus = +(await env.P.get("b:" + sub)) || 0, limit = (await cfg(env)).previewMin * 60000 + bonus;
  return { access: used >= limit ? "expired" : "trial", usedMs: used, limitMs: limit, email };
}
async function wixSync(env) {
  const key = await env.P.get("wixkey"); if (!key) return { skipped: "no Wix key" };
  const since = await env.P.get("wixlast") || new Date(Date.now() - 30 * 864e5).toISOString();
  const body = { search: { filter: { $and: [{ paymentStatus: { $eq: "PAID" } }, { updatedDate: { $gt: since } }, { "lineItems.catalogReference.catalogItemId": { $in: WIX_PRODUCTS } }] }, sort: [{ fieldName: "updatedDate", order: "ASC" }], cursorPaging: { limit: 100 } } };
  const r = await fetch("https://www.wixapis.com/ecom/v1/orders/search", { method: "POST", headers: { authorization: key, "wix-site-id": WIX_SITE, "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({})); if (!r.ok) { await env.P.put("wixerr", JSON.stringify({ at: Date.now(), status: r.status, msg: JSON.stringify(j).slice(0, 300) })); return { error: r.status }; }
  let last = since, n = 0;
  for (const o of j.orders || []) {
    const email = String(o.buyerInfo && o.buyerInfo.email || "").trim().toLowerCase();
    if (email) { const prev = await env.P.get("g:" + email, "json"), base = Math.max(Date.now(), prev && prev.until || 0);
      await env.P.put("g:" + email, JSON.stringify({ at: Date.now(), note: "Wix order #" + o.number, until: base + YEAR })); n++; }
    if (o.updatedDate > last) last = o.updatedDate;
  }
  await env.P.put("wixlast", last); await env.P.delete("wixerr"); return { granted: n };
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
async function hub(req, env, u) {
  let msg = "";
  if (req.method === "POST") {
    const f = await req.formData(), act = f.get("act"), email = String(f.get("email") || "").trim().toLowerCase();
    const okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    const subsOf = async e => { const out = [], l = await env.P.list({ prefix: "s:" }); for (const k of l.keys) { const v = await env.P.get(k.name, "json"); if (v && (v.email || "").toLowerCase() === e) out.push(k.name.slice(2)); } return out; };
    if (act === "preview") { const m = Math.max(0, Math.min(10080, Math.round(+f.get("minutes") || 0))); await env.P.put("cfg", JSON.stringify({ ...(await cfg(env)), previewMin: m })); msg = "Free preview is now " + m + " minutes for everyone."; }
    else if (act === "mailkey") { const k = String(f.get("key") || "").trim(), fr = String(f.get("from") || "").trim(); if (k) await env.P.put("mailkey", k); if (fr) await env.P.put("mailfrom", fr); msg = "Email sign-in settings saved."; }
    else if (act === "sociallink") { const l = String(f.get("link") || "").trim(); if (/^https:\/\/social\.solvinglifewith\.com\//.test(l)) { await env.P.put("sociallink", l); msg = "Social media control link saved."; } else msg = "Paste the full social.solvinglifewith.com setup link."; }
    else if (act === "mailtest") { const to = String(f.get("to") || "").trim().toLowerCase(); const r = await sendMail(env, to, "Solving Life test email", "This is a test from your Solving Life apps. Email sign-in codes will look like this: 123456"); msg = r.ok ? "Test email sent to " + to : "Email failed: " + r.error; }
    else if (act === "wixkey") { const k = String(f.get("key") || "").trim(); if (k) { await env.P.put("wixkey", k); const s = await wixSync(env); msg = s.error ? "Key saved, but Wix answered with error " + s.error + ". Check the key's permissions (Wix Stores / eCommerce orders: read)." : "Wix key saved. Paid orders are checked every 10 minutes (" + (s.granted || 0) + " granted now)."; } }
    else if (act === "wixnow") { const s = await wixSync(env); msg = s.skipped ? "Paste the Wix API key first." : s.error ? "Wix error " + s.error : "Checked Wix orders: " + s.granted + " access grant(s)."; }
    else if (act === "code") { const code = String(f.get("code") || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, ""), m = Math.max(0, Math.min(43200, Math.round(+f.get("minutes") || 0)));
      if (code && m) { await env.P.put("c:" + code, JSON.stringify({ minutes: m, note: String(f.get("note") || "").slice(0, 120), at: Date.now(), used: 0 })); msg = "Code " + code + " gives " + m + " extra free minutes."; }
      else if (code) { await env.P.delete("c:" + code); msg = "Code " + code + " removed."; } }
    else if (!okEmail) msg = "Please type a full email address.";
    else if (act === "add") { await env.P.put("g:" + email, JSON.stringify({ at: Date.now(), note: String(f.get("note") || "").slice(0, 200) })); msg = "Full access given to " + email; }
    else if (act === "remove") { await env.P.delete("g:" + email); msg = "Access removed for " + email; }
    else if (act === "reset") { for (const sub of await subsOf(email)) await env.P.delete("t:" + sub); msg = "Free preview reset for " + email; }
    else if (act === "extra") { const add = Math.max(0, Math.min(43200, Math.round(+f.get("minutes") || 60))) * 60000, subs = await subsOf(email);
      for (const sub of subs) await env.P.put("b:" + sub, String((+(await env.P.get("b:" + sub)) || 0) + add)); msg = subs.length ? "Gave " + add / 60000 + " extra free minutes to " + email : email + " has not signed in yet."; }
  }
  const C = await cfg(env), cl = await env.P.list({ prefix: "c:" }), codes = [];
  for (const k of cl.keys) { const v = await env.P.get(k.name, "json"); if (v) codes.push({ code: k.name.slice(2), ...v }); }
  const g = await env.P.list({ prefix: "g:" }), s = await env.P.list({ prefix: "s:", limit: 1000 });
  const grants = [];
  for (const k of g.keys) { const v = await env.P.get(k.name, "json") || {}; grants.push({ email: k.name.slice(2), until: v.until, note: v.note }); }
  const users = [];
  for (const k of s.keys) { const v = await env.P.get(k.name, "json"); if (v) users.push({ ...v, used: +(await env.P.get("t:" + k.name.slice(2))) || 0 }); }
  users.sort((a, b) => (b.last || 0) - (a.last || 0));
  const full = e => ALWAYS.includes((e || "").toLowerCase()) || grants.some(x => x.email === (e || "").toLowerCase() && (!x.until || x.until > Date.now()));
  const d = t => t ? new Date(t).toLocaleString("en-US", { timeZone: "America/Denver", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";
  const mk = await env.P.get("mailkey"), mf = await env.P.get("mailfrom"), wk = await env.P.get("wixkey"), we = await env.P.get("wixerr", "json"), wl = await env.P.get("wixlast");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Solving Life app access</title>
<style>body{font:16px/1.45 system-ui,sans-serif;max-width:760px;margin:0 auto;padding:18px;color:#122}h1{font-size:24px}form{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}input{font:inherit;padding:10px;border:1px solid #bbb;border-radius:10px;flex:1;min-width:200px}button{font:inherit;padding:10px 14px;border:0;border-radius:10px;background:#1a6b55;color:#fff;font-weight:700}button.r{background:#a33}button.g{background:#556}table{width:100%;border-collapse:collapse;font-size:14px}td,th{border-bottom:1px solid #ddd;padding:7px 4px;text-align:left}.ok{color:#1a6b55;font-weight:700}.msg{background:#e4f5ec;padding:10px;border-radius:10px}</style></head><body>
<h1>Solving Life app access</h1><p>People who paid get full access to every exam app (EA, Series 65, EDPNA, Customs Broker). Everyone else gets a free preview after signing in with Google. The kids app is always free.</p>
${msg ? `<p class="msg">${esc(msg)}</p>` : ""}
<form method="post"><input name="email" type="email" placeholder="customer@gmail.com" required><input name="note" placeholder="note (optional, e.g. paid $49 Nov 24)"><button name="act" value="add">Give full access</button><button class="r" name="act" value="remove">Remove</button><button class="g" name="act" value="reset">Reset free hour</button></form>
<form method="post"><input name="minutes" type="number" min="0" max="10080" value="${C.previewMin}" style="max-width:120px"><button name="act" value="preview">Set free preview minutes (everyone)</button></form>
<form method="post"><input name="email" type="email" placeholder="person@gmail.com" required><input name="minutes" type="number" value="60" style="max-width:110px"><button name="act" value="extra">Give extra free minutes</button></form>
<h2>Wix store sales (automatic)</h2><p>Paid orders for "All 4 Exam Study Apps" give the buyer's email 12 months of full access, checked every 10 minutes. Status: ${wk ? '<span class="ok">Wix key saved</span>' : "no Wix key yet"}${wl ? " · checked through " + esc(d(Date.parse(wl))) : ""}${we ? " · last error " + esc(we.status) : ""}</p>
<form method="post"><input name="key" type="password" autocomplete="off" placeholder="${wk ? "●●●● saved (paste a new key to replace)" : "paste the Wix API key"}"><button name="act" value="wixkey">Save Wix key</button><button class="g" name="act" value="wixnow">Check orders now</button></form>
<h2>Email sign-in codes</h2><p>For people who open the app inside Messenger, Facebook or Instagram (Google sign-in is blocked there). Uses Resend (free tier). Status: ${mk ? '<span class="ok">key saved</span>' : "no Resend key yet"} · sender: ${esc(mf || "onboarding@resend.dev (test mode)")}</p>
<form method="post"><input name="key" type="password" autocomplete="off" placeholder="${mk ? "●●●● saved (paste a new key to replace)" : "paste the Resend API key"}"><input name="from" placeholder="Solving Life LLC &lt;login@solvinglifewith.com&gt;" value="${esc(mf || "")}"><button name="act" value="mailkey">Save</button></form>
<form method="post"><input name="to" type="email" placeholder="send a test to…" required><button class="g" name="act" value="mailtest">Send test email</button></form>
<h2>Social media control link</h2><p>Paste your private social.solvinglifewith.com setup link once; the admin dashboard then opens it with one tap. Status: ${await env.P.get("sociallink") ? '<span class="ok">saved</span>' : "not saved yet"}</p>
<form method="post"><input name="link" type="password" autocomplete="off" placeholder="https://social.solvinglifewith.com/s/…"><button name="act" value="sociallink">Save link</button></form>
<h2>Promo codes</h2><p>Share a code in a group or forum; each person can use one code once to get extra free minutes.</p>
<form method="post"><input name="code" placeholder="CODE e.g. REDDIT7" required style="max-width:200px"><input name="minutes" type="number" placeholder="minutes (blank = delete)" style="max-width:190px"><input name="note" placeholder="where it was shared"><button name="act" value="code">Save code</button></form>
<table><tr><th>Code</th><th>Extra minutes</th><th>Used</th><th>Note</th></tr>${codes.map(c => `<tr><td><b>${esc(c.code)}</b></td><td>${c.minutes}</td><td>${c.used || 0}</td><td>${esc(c.note || "")}</td></tr>`).join("")}</table>
<h2>Full access (${grants.length + ALWAYS.length})</h2><p>${ALWAYS.map(esc).join(", ")} (always)</p>
<table><tr><th>Email</th><th>Until</th><th>Note</th></tr>${grants.map(x => `<tr><td>${esc(x.email)}</td><td>${x.until ? esc(d(x.until)) : "no end"}</td><td>${esc(x.note || "")}</td></tr>`).join("")}</table>
<h2>People who signed in (${users.length})</h2><table><tr><th>Email</th><th>Access</th><th>Preview used</th><th>Last seen (Denver)</th></tr>
${users.map(x => `<tr><td>${esc(x.email || "")}</td><td>${full(x.email) ? '<span class="ok">Full</span>' : x.used >= C.previewMin * 60000 ? "Preview used up" : "Preview"}</td><td>${Math.round(x.used / 60000)} min</td><td>${d(x.last)}</td></tr>`).join("")}</table></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html;charset=utf-8", "cache-control": "no-store" } });
}
const enc = new TextEncoder();
const b64u = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function hmac(env, s) { const k = await crypto.subtle.importKey("raw", enc.encode(env.SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return b64u(await crypto.subtle.sign("HMAC", k, enc.encode(s))); }
async function mkToken(env, sub) { const p = sub + "." + (Date.now() + 90 * 864e5); return p + "." + await hmac(env, p); }
async function readToken(env, req) {
  const t = (req.headers.get("authorization") || "").replace(/^Bearer /, ""), i = t.lastIndexOf("."); if (i < 0) return null;
  const p = t.slice(0, i); if (await hmac(env, p) !== t.slice(i + 1)) return null;
  const [sub, exp] = p.split("."); return +exp > Date.now() ? sub : null;
}
async function sendMail(env, to, subject, text) {
  const key = await env.P.get("mailkey"); if (!key) return { ok: false, error: "no email key set" };
  const from = (await env.P.get("mailfrom")) || "Solving Life LLC <onboarding@resend.dev>";
  try { const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: "Bearer " + key, "content-type": "application/json" }, body: JSON.stringify({ from, to: [to], subject, text }) });
    if (r.ok) return { ok: true }; const j = await r.json().catch(() => ({})); return { ok: false, error: (j.message || r.status) + "" }; } catch (e) { return { ok: false, error: "network" }; }
}
const okEmail = e => /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i.test(e);
async function subFor(env, email, fallback) { const m = await env.P.get("e:" + email); if (m) return m; await env.P.put("e:" + email, fallback); return fallback; }
async function signedIn(env, req, sub, email, name) {
  const saved = await env.P.get("u:" + sub, "json"), prev = await env.P.get("s:" + sub, "json");
  await env.P.put("s:" + sub, JSON.stringify({ email, name: name || prev && prev.name || "", first: prev && prev.first || Date.now(), last: Date.now() }));
  return J(req, { token: await mkToken(env, sub), email, name: name || "", saved: saved ? { upd: saved.upd, data: saved.data } : null, ...(await access(env, sub)) });
}
async function adminData(env) {
  const now = Date.now(), DAY = 864e5, C = await cfg(env);
  const s = await env.P.list({ prefix: "s:", limit: 1000 }), g = await env.P.list({ prefix: "g:" }), cl = await env.P.list({ prefix: "c:" });
  let users = 0, a1 = 0, a7 = 0, new7 = 0, trialDone = 0; const recent = [];
  for (const k of s.keys) { const v = await env.P.get(k.name, "json"); if (!v) continue; users++; if (now - (v.last || 0) < DAY) a1++; if (now - (v.last || 0) < 7 * DAY) a7++; if (now - (v.first || 0) < 7 * DAY) new7++;
    const used = +(await env.P.get("t:" + k.name.slice(2))) || 0; if (used >= C.previewMin * 60000) trialDone++; recent.push({ email: v.email || "", last: v.last || 0, first: v.first || 0, usedMin: Math.round(used / 60000) }); }
  recent.sort((x, y) => y.last - x.last);
  let paid = 0, wixPaid = 0; for (const k of g.keys) { const v = await env.P.get(k.name, "json") || {}; if (!v.until || v.until > now) { paid++; if (/Wix order/.test(v.note || "")) wixPaid++; } }
  const codes = []; for (const k of cl.keys) { const v = await env.P.get(k.name, "json"); if (v) codes.push({ code: k.name.slice(2), minutes: v.minutes, used: v.used || 0, note: v.note || "" }); }
  return { users, active24h: a1, active7d: a7, new7d: new7, trialUsedUp: trialDone, fullAccess: paid + ALWAYS.length, wixBuyers: wixPaid, previewMin: C.previewMin, codes,
    wix: { key: !!(await env.P.get("wixkey")), lastChecked: await env.P.get("wixlast"), error: await env.P.get("wixerr", "json") },
    mail: { key: !!(await env.P.get("mailkey")), from: await env.P.get("mailfrom") || "" }, recent: recent.slice(0, 40),
    hub: "https://sync.solvinglifewith.com/hub/" + env.ADMIN, social: await env.P.get("sociallink") || "" };
}
function cors(req) { const o = req.headers.get("origin"); return { "access-control-allow-origin": ORIGINS.includes(o) ? o : ORIGINS[0], "access-control-allow-headers": "authorization,content-type", "access-control-allow-methods": "GET,POST,OPTIONS", "vary": "origin", "cache-control": "no-store" }; }
const J = (req, o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors(req), "content-type": "application/json" } });
export default {
  async scheduled(e, env) { return wixSync(env); },
  async fetch(req, env) {
    const u = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
    if (u.pathname.startsWith("/hub/")) { if (!env.ADMIN || u.pathname.split("/")[2] !== env.ADMIN) return new Response("Not found", { status: 404 }); return hub(req, env, u); }
    try {
      if (u.pathname === "/login" && req.method === "POST") {
        const { id_token } = await req.json();
        const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(id_token || "")); const g = await r.json();
        if (!r.ok || !CLIENT_IDS.includes(g.aud) || !["accounts.google.com", "https://accounts.google.com"].includes(g.iss) || +g.exp * 1000 < Date.now()) return J(req, { error: "Google sign-in could not be checked." }, 401);
        const em = String(g.email || "").toLowerCase(), sub = em ? await subFor(env, em, g.sub) : g.sub;
        return signedIn(env, req, sub, em, g.given_name || g.name || "");
      }
      if (u.pathname === "/mail/start" && req.method === "POST") {
        const { email } = await req.json().catch(() => ({})); const em = String(email || "").trim().toLowerCase();
        if (!okEmail(em)) return J(req, { error: "Please type a valid email address." }, 400);
        const prev = await env.P.get("otp:" + em, "json"); if (prev && Date.now() - prev.sent < 45000) return J(req, { error: "A code was just sent. Wait a minute, then try again." }, 429);
        const n = new Uint32Array(1); crypto.getRandomValues(n); const code = String(n[0] % 1000000).padStart(6, "0");
        const r = await sendMail(env, em, "Your Solving Life sign-in code: " + code, "Your sign-in code is " + code + "\n\nType it in the app within 10 minutes. If you didn't ask for it, ignore this email.\n\nSolving Life LLC");
        if (!r.ok) return J(req, { error: "We couldn't send the email right now. Please use Google sign-in in Safari or Chrome." }, 502);
        await env.P.put("otp:" + em, JSON.stringify({ h: await hmac(env, em + ":" + code), exp: Date.now() + 600000, tries: 0, sent: Date.now() }), { expirationTtl: 900 });
        return J(req, { ok: true });
      }
      if (u.pathname === "/mail/verify" && req.method === "POST") {
        const { email, code } = await req.json().catch(() => ({})); const em = String(email || "").trim().toLowerCase(), c = String(code || "").replace(/\D/g, "");
        const o = await env.P.get("otp:" + em, "json"); if (!o || o.exp < Date.now()) return J(req, { error: "That code expired. Ask for a new one." }, 401);
        if (o.tries >= 5) return J(req, { error: "Too many tries. Ask for a new code." }, 429);
        if (await hmac(env, em + ":" + c) !== o.h) { o.tries++; await env.P.put("otp:" + em, JSON.stringify(o), { expirationTtl: 900 }); return J(req, { error: "Wrong code. Check the email and try again." }, 401); }
        await env.P.delete("otp:" + em); const sub = await subFor(env, em, "m:" + (await hmac(env, "mail:" + em)).slice(0, 24));
        return signedIn(env, req, sub, em, "");
      }
      const sub = await readToken(env, req); if (!sub) return J(req, { error: "Please sign in again." }, 401);
      if (u.pathname === "/admin/me") { const who = await env.P.get("s:" + sub, "json"), em = (who && who.email || "").toLowerCase();
        if (!ADMINS.includes(em)) return J(req, { error: "This account is not an admin. Sign in with " + ADMINS[0] + "." }, 403);
        return J(req, { admin: true, email: em, ...(await adminData(env)) }); }
      if (u.pathname === "/status") return J(req, await access(env, sub));
      if (u.pathname === "/tick" && req.method === "POST") {
        const a = await access(env, sub); if (a.access === "full") return J(req, a);
        const { ms } = await req.json().catch(() => ({})); const add = Math.max(0, Math.min(+ms || 0, 3 * 60 * 1000));
        await env.P.put("t:" + sub, String(a.usedMs + add)); return J(req, await access(env, sub));
      }
      if (u.pathname === "/redeem" && req.method === "POST") {
        const { code } = await req.json().catch(() => ({})); const k = "c:" + String(code || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
        const c = await env.P.get(k, "json"); if (!c) return J(req, { error: "That code is not valid." }, 404);
        if (await env.P.get("r:" + sub)) return J(req, { error: "You have already used a code." }, 409);
        await env.P.put("r:" + sub, k); await env.P.put("b:" + sub, String((+(await env.P.get("b:" + sub)) || 0) + c.minutes * 60000));
        c.used = (c.used || 0) + 1; await env.P.put(k, JSON.stringify(c)); return J(req, { ok: true, added: c.minutes, ...(await access(env, sub)) });
      }
      if (u.pathname === "/load") { const s = await env.P.get("u:" + sub, "json"); return J(req, { saved: s ? { upd: s.upd, data: s.data } : null }); }
      if (u.pathname === "/save" && req.method === "POST") {
        const body = await req.text(); if (body.length > MAX) return J(req, { error: "Progress is too large to save." }, 413);
        const { upd, data } = JSON.parse(body); if (typeof data !== "string") return J(req, { error: "Nothing to save." }, 400);
        const cur = await env.P.get("u:" + sub, "json"); if (cur && cur.upd > upd) return J(req, { conflict: true, saved: { upd: cur.upd, data: cur.data } }, 409);
        await env.P.put("u:" + sub, JSON.stringify({ upd, data, at: Date.now() })); return J(req, { ok: true, upd });
      }
      if (u.pathname === "/delete" && req.method === "POST") { await env.P.delete("u:" + sub); return J(req, { ok: true }); }
      return J(req, { error: "Not found" }, 404);
    } catch (e) { return J(req, { error: "Server error" }, 500); }
  }
};
