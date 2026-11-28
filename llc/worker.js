// Solving Life LLC site: static files are served by Cloudflare as they are. This small Worker runs only for /media/* and adds
// byte-range support (206 Partial Content), which Workers static assets do not give. iPhone Safari will not play audio or video
// from a host without it, so the podcast episodes and videos need this.
export default {
  async fetch(req, env) {
    const range = req.headers.get("Range");
    const res = await env.ASSETS.fetch(new Request(req.url, { method: "GET" }));
    if (res.status !== 200) return res;
    const h = new Headers(res.headers);
    h.set("Accept-Ranges", "bytes");
    h.set("Access-Control-Allow-Origin", "*");
    const size = +h.get("Content-Length") || 0;
    if (req.method === "HEAD") return new Response(null, { status: 200, headers: h });
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!m || (m[1] === "" && m[2] === "")) return new Response(res.body, { status: 200, headers: h });
    const buf = await res.arrayBuffer(), total = buf.byteLength || size;
    let start, end;
    if (m[1] === "") { const n = Math.min(+m[2], total); start = total - n; end = total - 1; }
    else { start = +m[1]; end = m[2] === "" ? total - 1 : Math.min(+m[2], total - 1); }
    if (start >= total || start > end) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + total, "Accept-Ranges": "bytes" } });
    h.set("Content-Range", "bytes " + start + "-" + end + "/" + total);
    h.set("Content-Length", String(end - start + 1));
    return new Response(buf.slice(start, end + 1), { status: 206, headers: h });
  }
};
