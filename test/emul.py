import sys
from playwright.sync_api import sync_playwright
from PIL import Image
W,H,tag=int(sys.argv[1]),int(sys.argv[2]),sys.argv[3]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    pg=b.new_page(viewport={"width":W,"height":H},has_touch=W<900)
    errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto("file:///home/claude/portfolio/dist/index.html"); pg.wait_for_timeout(800)
    doc=pg.evaluate("document.documentElement.scrollHeight")
    y=0
    while y<doc: pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(120); y+=H*0.4
    shots=[]
    for em in ("emul-flowcheck","emul-flowrequest"):
        top=pg.evaluate(f"document.getElementById('{em}').getBoundingClientRect().top+scrollY")
        n=4; span=n*0.7*H
        pg.evaluate(f"scrollTo(0,{top-H*0.5})"); pg.wait_for_timeout(300)
        for i in range(n):
            t=top+(i+0.5)/n*span
            pg.evaluate(f"scrollTo(0,{t})"); pg.wait_for_timeout(2300)
            f=f"/home/claude/portfolio/test/{tag}_{len(shots)}.png"; pg.screenshot(path=f); shots.append(f)
    print(errs[:5]); b.close()
sc=0.5 if W>=900 else 0.45
ims=[Image.open(f) for f in shots]; tw,th=int(W*sc),int(H*sc)
sheet=Image.new("RGB",(tw*4,th*2),"white")
for i,im in enumerate(ims): sheet.paste(im.resize((tw,th)),((i%4)*tw,(i//4)*th))
sheet.save(f"/home/claude/portfolio/test/{tag}_sheet.png")
