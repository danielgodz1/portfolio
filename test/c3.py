import sys
from playwright.sync_api import sync_playwright
from PIL import Image
W,H,tag=int(sys.argv[1]),int(sys.argv[2]),sys.argv[3]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(viewport={"width":W,"height":H},has_touch=W<900)
    errs=[]; pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
    pg.goto("file:///home/claude/portfolio/dist/index.html"); pg.wait_for_timeout(800)
    doc=pg.evaluate("document.documentElement.scrollHeight")
    y=0
    while y<doc: pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(100); y+=H*0.4
    pg.evaluate("scrollTo(0,0)"); pg.wait_for_timeout(500)
    top=pg.evaluate("document.getElementById('quarto').getBoundingClientRect().top+scrollY")
    span=2.6*H; shots=[]
    pg.evaluate(f"scrollTo(0,{top-H*0.5})"); pg.wait_for_timeout(300)
    for i,f in enumerate((0.02,0.25,0.5,0.75,1.0)):
        pg.evaluate(f"scrollTo(0,{top+f*span})"); pg.wait_for_timeout(1800)
        fn=f"/home/claude/portfolio/test/{tag}_{i}.png"; pg.screenshot(path=fn); shots.append(fn)
    print(errs[:5], pg.evaluate("document.getElementById('quarto').hidden")); b.close()
sc=0.4 if W>=900 else 0.45
ims=[Image.open(f) for f in shots]; tw,th=int(W*sc),int(H*sc)
sheet=Image.new("RGB",(tw*5,th),"white")
for i,im in enumerate(ims): sheet.paste(im.resize((tw,th)),(i*tw,0))
sheet.save(f"/home/claude/portfolio/test/{tag}_sheet.png")
