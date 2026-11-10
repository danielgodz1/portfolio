# uso: python test/modelo.py <slug> <W> <H> [reduce]
# Abre dist/modelos/<slug>/ num servidor local com suporte a vídeo (Range), rola a página
# em 12 paradas, salva capturas e uma folha-resumo em test/, e mostra overflow lateral e erros.
import sys, threading, functools, os
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
slug, W, H = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); red = len(sys.argv) > 4
tag = f"{slug.replace('/', '-')}_{'m' if W < 900 else 'd'}{'r' if red else ''}"

class Faixa(SimpleHTTPRequestHandler):
    """Servidor estático que responde a pedidos de trecho (o vídeo precisa disso para avançar)."""
    def log_message(self, *a): pass
    def send_head(self):
        rng = self.headers.get("Range")
        caminho = self.translate_path(self.path)
        if not rng or not os.path.isfile(caminho): return super().send_head()
        tam = os.path.getsize(caminho)
        a, _, b = rng.replace("bytes=", "").partition("-")
        a = int(a or 0); b = int(b) if b else tam - 1
        f = open(caminho, "rb"); f.seek(a)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(caminho)); self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {a}-{b}/{tam}"); self.send_header("Content-Length", str(b - a + 1)); self.end_headers()
        self.copyfile = lambda src, dst, n=b - a + 1: self._envia(src, dst, n)
        return f
    def _envia(self, src, dst, n):
        try: dst.write(src.read(n))
        except ConnectionError: pass  # o navegador cancela trechos ao pular no vídeo

srv = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Faixa, directory=str(RAIZ / "dist")))
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{srv.server_address[1]}/modelos/{slug}/"

with sync_playwright() as p:
    linux = Path("/usr/bin/google-chrome").exists()
    b = p.chromium.launch(**({"executable_path": "/usr/bin/google-chrome", "args": ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]} if linux else {}))
    pg = b.new_page(viewport={"width": W, "height": H}, has_touch=W < 900, reduced_motion="reduce" if red else "no-preference")
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.goto(url); pg.wait_for_timeout(900)
    doc = pg.evaluate("document.documentElement.scrollHeight")
    N = 12; shots = []; y = 0
    for i in range(N):
        t = (doc - H) * i / (N - 1)
        while y < t:
            y = min(t, y + H * 0.25); pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(70)
        pg.wait_for_timeout(1100)
        f = RAIZ / "test" / f"{tag}_{i}.png"; pg.screenshot(path=str(f)); shots.append(f)
    ov = pg.evaluate("document.documentElement.scrollWidth>innerWidth")
    print(tag, "doc", doc, "overflowX", ov, "erros", errs[:5]); b.close()
srv.shutdown()

sc = 0.3 if W >= 900 else 0.4
tw, th = int(W * sc), int(H * sc); cols = 6
sheet = Image.new("RGB", (tw * cols, th * 2), "white")
for i, f in enumerate(shots): sheet.paste(Image.open(f).resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
sheet.save(RAIZ / "test" / f"{tag}_sheet.png")
