import sys, json
from playwright.sync_api import sync_playwright
from PIL import Image
W,H,tag = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width":W,"height":H})
    errs=[]
    pg.on("console", lambda m: errs.append(m.text) if m.type in("error","warning") else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file:///home/claude/portfolio/dist/index.html"); pg.wait_for_timeout(800)
    info = pg.evaluate("""()=>{const s=document.querySelector('.projeto');const r=s.getBoundingClientRect();return {top:r.top+scrollY,h:s.offsetHeight,doc:document.documentElement.scrollHeight}}""")
    vh=H; hero_end=1.3*vh
    pos=[0,0.45*hero_end,hero_end+10]
    top,h=info["top"],info["h"]
    desk = W>=900
    if desk: pos += [top+0.05*(h-vh), top+0.45*(h-vh), top+0.75*(h-vh), top+(h-vh)]
    else: pos += [top, top+0.35*h, top+0.6*h]
    pos += [info["doc"]-vh]
    shots=[]
    for i,y in enumerate(pos):
        pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(1300)
        f=f"/home/claude/portfolio/test/{tag}_{i}.png"; pg.screenshot(path=f); shots.append(f)
    print(info, errs[:5])
    b.close()
sc = 0.5 if W>=900 else 0.45
ims=[Image.open(f) for f in shots]
tw,th=int(W*sc),int(H*sc)
cols=4 if W>=900 else 4
rows=(len(ims)+cols-1)//cols
sheet=Image.new("RGB",(tw*cols,th*rows),"white")
for i,im in enumerate(ims): sheet.paste(im.resize((tw,th)),((i%cols)*tw,(i//cols)*th))
sheet.save(f"/home/claude/portfolio/test/{tag}_sheet.png")
