// Servidor local para ver o site gerado em dist/ (aceita pedidos de trecho, que o vídeo pela rolagem precisa).
// uso: npm run preview  ->  http://localhost:4173
import http from "node:http";
import { createReadStream, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";
const raiz = process.argv[2] || "dist", porta = +process.argv[3] || 4173;
const tipos = { ".html": "text/html; charset=utf-8", ".mp4": "video/mp4", ".jpg": "image/jpeg", ".webp": "image/webp", ".js": "text/javascript", ".css": "text/css" };
http.createServer((q, r) => {
  let p = normalize(join(raiz, decodeURIComponent(q.url.split("?")[0])));
  if (!p.startsWith(normalize(raiz))) { r.writeHead(403).end(); return; }
  try { if (statSync(p).isDirectory()) p = join(p, "index.html"); var st = statSync(p); } catch { r.writeHead(404).end(); return; }
  const h = { "Content-Type": tipos[extname(p)] || "application/octet-stream", "Accept-Ranges": "bytes" };
  const m = /bytes=(\d*)-(\d*)/.exec(q.headers.range || "");
  if (m) {
    const a = m[1] ? +m[1] : 0, b = m[2] ? +m[2] : st.size - 1;
    r.writeHead(206, { ...h, "Content-Range": `bytes ${a}-${b}/${st.size}`, "Content-Length": b - a + 1 });
    createReadStream(p, { start: a, end: b }).pipe(r);
  } else { r.writeHead(200, { ...h, "Content-Length": st.size }); createReadStream(p).pipe(r); }
}).listen(porta, () => console.log("Site em http://localhost:" + porta + "/modelos/  (Ctrl+C para parar)"));
