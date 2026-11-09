from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width":390,"height":844})
    pg.goto("file:///home/claude/portfolio/dist/index.html"); pg.wait_for_timeout(800)
    for y in [1941, 2300, 2650, 2800, 3100]:
        pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(1500)
        r=pg.evaluate("""()=>{const f=document.querySelector('.projeto__figura').getBoundingClientRect();const w=document.querySelector('.planta .w');const cs=getComputedStyle(w);return {y:scrollY,figTop:Math.round(f.top),figBot:Math.round(f.bottom),off:cs.strokeDashoffset,op:cs.opacity,dash:cs.strokeDasharray}}""")
        print(r)
    b.close()
