import sys
from playwright.sync_api import sync_playwright
from PIL import Image
W,H,tag = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width":W,"height":H}, has_touch=W<900)
    errs=[]
    pg.on("console", lambda m: errs.append(m.text) if m.type in("error","warning") else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file:///home/claude/portfolio/dist/index.html"); pg.wait_for_timeout(800)
    def go(y, wait=400):
        pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(wait)
    doc = pg.evaluate("document.documentElement.scrollHeight")
    # percorre a página rolando em passos (a física depende do tempo)
    shots=[]; y=0; step=H*0.35
    marks = {}
    while y < doc:
        go(y, 250); y += step
    go(0,600)
    info = pg.evaluate("""()=>{const q=s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return r.top+scrollY};return {q:q('.queda'),qh:document.querySelector('.queda').offsetHeight,fc:q('#flowcheck'),fch:document.querySelector('#flowcheck').offsetHeight,fr:q('#flowrequest'),frh:document.querySelector('#flowrequest').offsetHeight,doc:document.documentElement.scrollHeight,chips:document.querySelectorAll('.chip').length}}""")
    q,qh=info['q'],info['qh']
    plan=[]
    # queda: 4 pontos de progresso, rolando continuamente até cada um
    for f in (0.15,0.5,1.0): plan.append(q+f*(qh-H))
    desk=W>=900
    for k in ('fc','fr'):
        t,h=info[k],info[k+'h']
        if desk: plan += [t+0.6*(h-H), t+(h-H)]
        else: plan += [t+0.3*h, t+0.7*h]
    plan.append(doc-H)
    cur=0
    for i,t in enumerate(plan):
        n=max(1,int(abs(t-cur)/(H*0.2)))
        for s in range(1,n+1):
            go(cur+(t-cur)*s/n, 120)
        cur=t; pg.wait_for_timeout(1800)
        f=f"/home/claude/portfolio/test/{tag}_{i}.png"; pg.screenshot(path=f); shots.append(f)
    print(info, errs[:6])
    b.close()
sc=0.5 if W>=900 else 0.45
ims=[Image.open(f) for f in shots]; tw,th=int(W*sc),int(H*sc); cols=4
rows=(len(ims)+cols-1)//cols
sheet=Image.new("RGB",(tw*cols,th*rows),"white")
for i,im in enumerate(ims): sheet.paste(im.resize((tw,th)),((i%cols)*tw,(i//cols)*th))
sheet.save(f"/home/claude/portfolio/test/{tag}_sheet.png")
