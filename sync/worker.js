// Solving Life progress sync: Google sign-in (ID token) -> one saved copy of the study app progress per Google account.
// Routes: POST /login {id_token} -> {token, email, saved:{upd, data}|null}; GET /load (Bearer token); POST /save (Bearer token) {upd, data}
// Storage: KV binding P, key "u:<google sub>" = {upd, data, email, at}. Session token = HMAC(SECRET) signed "sub.exp".
// ACCESS: "g:<email>" = grant {by, at, note} (full access to every exam app); "t:<sub>" = free-preview minutes used (ms);
// "s:<sub>" = {email, name, first, last} sign-in index for the owner's hub. Kids app is always free (not checked here).
// GET /status, POST /tick {ms}: preview meter (60 minutes per Google account). Owner hub: /hub/<ADMIN> (secret ADMIN).
const ORIGINS = ["https://study.solvinglifewith.com", "https://ea-exam-app.linaskerbelis.workers.dev", "http://localhost:8080"];
const CLIENT_IDS = ["184315933690-kq6qmc1qjsi177ht716s3ignsn0osd4u.apps.googleusercontent.com"];
const MAX = 20 * 1024 * 1024;
const PREVIEW_MS = 60 * 60 * 1000;
const ALWAYS = ["linaskerbelis@gmail.com", "info@solvinglifewith.com", "info@solvinglifellc.com", "cristyesplanada@gmail.com"];
async function access(env, sub) {
  const who = await env.P.get("s:" + sub, "json"), email = (who && who.email || "").toLowerCase();
  if (email && (ALWAYS.includes(email) || await env.P.get("g:" + email))) return { access: "full", email };
  const used = +(await env.P.get("t:" + sub)) || 0;
  return { access: used >= PREVIEW_MS ? "expired" : "trial", usedMs: used, limitMs: PREVIEW_MS, email };
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
async function hub(req, env, u) {
  let msg = "";
  if (req.method === "POST") {
    const f = await req.formData(), email = String(f.get("email") || "").trim().toLowerCase(), act = f.get("act");
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      if (act === "add") { await env.P.put("g:" + email, JSON.stringify({ at: Date.now(), note: String(f.get("note") || "").slice(0, 200) })); msg = "Full access given to " + email; }
      else if (act === "remove") { await env.P.delete("g:" + email); msg = "Access removed for " + email; }
      else if (act === "reset") { const l = await env.P.list({ prefix: "s:" }); for (const k of l.keys) { const v = await env.P.get(k.name, "json"); if (v && (v.email || "").toLowerCase() === email) await env.P.delete("t:" + k.name.slice(2)); } msg = "Free hour reset for " + email; }
    } else msg = "Please type a full email address.";
  }
  const g = await env.P.list({ prefix: "g:" }), s = await env.P.list({ prefix: "s:", limit: 1000 });
  const grants = g.keys.map(k => k.name.slice(2)), users = [];
  for (const k of s.keys) { const v = await env.P.get(k.name, "json"); if (v) users.push({ ...v, used: +(await env.P.get("t:" + k.name.slice(2))) || 0 }); }
  users.sort((a, b) => (b.last || 0) - (a.last || 0));
  const full = e => ALWAYS.includes((e || "").toLowerCase()) || grants.includes((e || "").toLowerCase());
  const d = t => t ? new Date(t).toLocaleString("en-US", { timeZone: "America/Denver", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Solving Life app access</title>
<style>body{font:16px/1.45 system-ui,sans-serif;max-width:760px;margin:0 auto;padding:18px;color:#122}h1{font-size:24px}form{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}input{font:inherit;padding:10px;border:1px solid #bbb;border-radius:10px;flex:1;min-width:200px}button{font:inherit;padding:10px 14px;border:0;border-radius:10px;background:#1a6b55;color:#fff;font-weight:700}button.r{background:#a33}button.g{background:#556}table{width:100%;border-collapse:collapse;font-size:14px}td,th{border-bottom:1px solid #ddd;padding:7px 4px;text-align:left}.ok{color:#1a6b55;font-weight:700}.msg{background:#e4f5ec;padding:10px;border-radius:10px}</style></head><body>
<h1>Solving Life app access</h1><p>People who paid get full access to every exam app (EA, Series 65, EDPNA, Customs Broker). Everyone else gets a free 60-minute preview after signing in with Google. The kids app is always free.</p>
${msg ? `<p class="msg">${esc(msg)}</p>` : ""}
<form method="post"><input name="email" type="email" placeholder="customer@gmail.com" required><input name="note" placeholder="note (optional, e.g. paid $49 Nov 24)"><button name="act" value="add">Give full access</button><button class="r" name="act" value="remove">Remove</button><button class="g" name="act" value="reset">Reset free hour</button></form>
<h2>Full access (${grants.length + ALWAYS.length})</h2><p>${ALWAYS.map(esc).join(", ")} (always)${grants.length ? ", " + grants.map(esc).join(", ") : ""}</p>
<h2>People who signed in (${users.length})</h2><table><tr><th>Email</th><th>Access</th><th>Preview used</th><th>Last seen (Denver)</th></tr>
${users.map(x => `<tr><td>${esc(x.email || "")}</td><td>${full(x.email) ? '<span class="ok">Full</span>' : x.used >= PREVIEW_MS ? "Preview used up" : "Preview"}</td><td>${Math.round(x.used / 60000)} min</td><td>${d(x.last)}</td></tr>`).join("")}</table></body></html>`;
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
function cors(req) { const o = req.headers.get("origin"); return { "access-control-allow-origin": ORIGINS.includes(o) ? o : ORIGINS[0], "access-control-allow-headers": "authorization,content-type", "access-control-allow-methods": "GET,POST,OPTIONS", "vary": "origin", "cache-control": "no-store" }; }
const J = (req, o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors(req), "content-type": "application/json" } });
export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
    if (u.pathname.startsWith("/hub/")) { if (!env.ADMIN || u.pathname.split("/")[2] !== env.ADMIN) return new Response("Not found", { status: 404 }); return hub(req, env, u); }
    try {
      if (u.pathname === "/login" && req.method === "POST") {
        const { id_token } = await req.json();
        const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(id_token || "")); const g = await r.json();
        if (!r.ok || !CLIENT_IDS.includes(g.aud) || !["accounts.google.com", "https://accounts.google.com"].includes(g.iss) || +g.exp * 1000 < Date.now()) return J(req, { error: "Google sign-in could not be checked." }, 401);
        const saved = await env.P.get("u:" + g.sub, "json"), prev = await env.P.get("s:" + g.sub, "json");
        await env.P.put("s:" + g.sub, JSON.stringify({ email: g.email, name: g.name || "", first: prev && prev.first || Date.now(), last: Date.now() }));
        return J(req, { token: await mkToken(env, g.sub), email: g.email, name: g.given_name || g.name || "", saved: saved ? { upd: saved.upd, data: saved.data } : null, ...(await access(env, g.sub)) });
      }
      const sub = await readToken(env, req); if (!sub) return J(req, { error: "Please sign in again." }, 401);
      if (u.pathname === "/status") return J(req, await access(env, sub));
      if (u.pathname === "/tick" && req.method === "POST") {
        const a = await access(env, sub); if (a.access === "full") return J(req, a);
        const { ms } = await req.json().catch(() => ({})); const add = Math.max(0, Math.min(+ms || 0, 3 * 60 * 1000));
        await env.P.put("t:" + sub, String(a.usedMs + add)); return J(req, await access(env, sub));
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
