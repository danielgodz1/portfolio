from playwright.sync_api import sync_playwright
from PIL import Image
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width":1440,"height":900}, reduced_motion="reduce")
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file:///home/claude/portfolio/dist/index.html"); pg.wait_for_timeout(800)
    pg.screenshot(path="test/r0.png")
    y=pg.evaluate("document.querySelector('.projeto').getBoundingClientRect().top+scrollY")
    pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(500); pg.screenshot(path="test/r1.png")
    print("scrollHeight",pg.evaluate("document.documentElement.scrollHeight"), errs)
    pg.set_viewport_size({"width":390,"height":844}); pg.goto("file:///home/claude/portfolio/dist/index.html"); pg.wait_for_timeout(600)
    # teclado: tab até o primeiro link
    pg.keyboard.press("Tab"); print("focus:", pg.evaluate("document.activeElement.textContent"))
    b.close()
a=Image.open("test/r0.png").resize((720,450)); c=Image.open("test/r1.png").resize((720,450))
s=Image.new("RGB",(1440,450)); s.paste(a,(0,0)); s.paste(c,(720,0)); s.save("test/r_sheet.png")
