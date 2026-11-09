# uso: python3 -I test/modelo.py <slug> <W> <H> [reduce]
import sys
from playwright.sync_api import sync_playwright
from PIL import Image
slug,W,H=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]); red=len(sys.argv)>4
tag=f"{slug}_{'m' if W<900 else 'd'}{'r' if red else ''}"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
    pg=b.new_page(viewport={"width":W,"height":H},has_touch=W<900,reduced_motion="reduce" if red else "no-preference")
    errs=[]; pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
    pg.goto(f"file:///home/claude/portfolio/dist/modelos/{slug}/index.html"); pg.wait_for_timeout(900)
    doc=pg.evaluate("document.documentElement.scrollHeight")
    N=12; shots=[]; y=0
    for i in range(N):
        t=(doc-H)*i/(N-1)
        while y<t: y=min(t,y+H*0.25); pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(70)
        pg.wait_for_timeout(1100)
        f=f"/home/claude/portfolio/test/{tag}_{i}.png"; pg.screenshot(path=f); shots.append(f)
    ov=pg.evaluate("document.documentElement.scrollWidth>innerWidth")
    print(tag,"doc",doc,"overflowX",ov,"erros",errs[:5]); b.close()
sc=0.3 if W>=900 else 0.4
ims=[Image.open(f) for f in shots]; tw,th=int(W*sc),int(H*sc); cols=6
sheet=Image.new("RGB",(tw*cols,th*2),"white")
for i,im in enumerate(ims): sheet.paste(im.resize((tw,th)),((i%cols)*tw,(i//cols)*th))
sheet.save(f"/home/claude/portfolio/test/{tag}_sheet.png")
