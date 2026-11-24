// Solving Life progress sync: Google sign-in (ID token) -> one saved copy of the study app progress per Google account.
// Routes: POST /login {id_token} -> {token, email, saved:{upd, data}|null}; GET /load (Bearer token); POST /save (Bearer token) {upd, data}
// Storage: KV binding P, key "u:<google sub>" = {upd, data, email, at}. Session token = HMAC(SECRET) signed "sub.exp".
const ORIGINS = ["https://study.solvinglifewith.com", "https://ea-exam-app.linaskerbelis.workers.dev", "http://localhost:8080"];
const CLIENT_IDS = ["184315933690-kq6qmc1qjsi177ht716s3ignsn0osd4u.apps.googleusercontent.com"];
const MAX = 20 * 1024 * 1024;
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
    try {
      if (u.pathname === "/login" && req.method === "POST") {
        const { id_token } = await req.json();
        const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(id_token || "")); const g = await r.json();
        if (!r.ok || !CLIENT_IDS.includes(g.aud) || !["accounts.google.com", "https://accounts.google.com"].includes(g.iss) || +g.exp * 1000 < Date.now()) return J(req, { error: "Google sign-in could not be checked." }, 401);
        const saved = await env.P.get("u:" + g.sub, "json");
        return J(req, { token: await mkToken(env, g.sub), email: g.email, name: g.given_name || g.name || "", saved: saved ? { upd: saved.upd, data: saved.data } : null });
      }
      const sub = await readToken(env, req); if (!sub) return J(req, { error: "Please sign in again." }, 401);
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
