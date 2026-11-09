import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { iniciarQueda } from "./queda.js";
import { iniciarCena3D } from "./cena3d.js";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

try {
  if (!reduce) document.documentElement.classList.add("anim");

  /* ---- Lenis: uma única instância, sincronizada com o GSAP ---- */
  if (!reduce) {
    const lenis = new Lenis({ lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const alvo = $(a.getAttribute("href"));
        if (alvo) { e.preventDefault(); lenis.scrollTo(alvo); }
      })
    );
  }

  /* ---- Linha de progresso ---- */
  if (!reduce) {
    const barra = $(".progresso");
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: (st) => gsap.set(barra, { scaleX: st.progress }) });
  }

  /* ---- Botão do LED (interativo; já visível sem animação) ---- */
  $$(".projeto__figura").forEach((fig) => {
    const btn = $(".led-btn", fig), svg = $(".planta", fig);
    if (!btn || !svg) return;
    btn.hidden = false;
    btn.addEventListener("click", () => {
      const on = svg.classList.toggle("on");
      btn.setAttribute("aria-pressed", on);
      btn.textContent = on ? btn.dataset.off : btn.dataset.on;
    });
  });

  /* ---- Momento 1: a caixa se abre e a frase escapa ---- */
  const hero = $(".hero");
  const caixa = $(".hero__caixa");
  const fuga = $(".l-fuga");
  const escapeX = () => {
    const direita = fuga.offsetLeft + fuga.offsetWidth;
    const ate_a_borda = caixa.clientWidth - direita + fuga.offsetWidth * 0.3;
    const livre = hero.clientWidth * 0.965 - (caixa.offsetLeft + direita); // não sai da tela
    return Math.max(0, Math.min(ate_a_borda, livre));
  };
  const tampa = () => (innerWidth < 900 ? -8 : -14);
  const escapeY = () => caixa.clientHeight - (fuga.offsetTop + fuga.offsetHeight) + fuga.offsetHeight * 0.3;

  if (reduce) {
    gsap.set(".edge--top", { rotation: tampa(), transformOrigin: "0% 50%" });
    gsap.set(".edge--right", { x: "3.5vw" });
    gsap.set(fuga, { x: escapeX(), y: escapeY(), rotation: -4 });
    addEventListener("resize", () => gsap.set(fuga, { x: escapeX(), y: escapeY() }));
  } else {
    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: hero, start: "top top", end: "+=130%",
        pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
      },
    })
      .to(".hero__dica", { opacity: 0, duration: 0.1 }, 0)
      .to(".edge--top", { rotation: tampa, transformOrigin: "0% 50%", duration: 0.45, ease: "power2.in" }, 0.05)
      .to(".edge--right", { x: "3.5vw", duration: 0.4 }, 0.2)
      .to(fuga, { x: escapeX, y: escapeY, rotation: -4, duration: 0.6, ease: "power2.inOut" }, 0.2)
      .to(".hero__intro", { opacity: 1, y: 0, duration: 0.25 }, 0.65);
  }

  /* ---- Momento 2: as ideias caem ---- */
  const palcoQueda = $(".queda__palco");
  if (palcoQueda) iniciarQueda({ palco: palcoQueda, gsap, ScrollTrigger, reduce });

  /* ---- Cena 3D: da planta ao quarto ---- */
  const palco3d = $(".cena3d__palco");
  if (palco3d) iniciarCena3D({ palco: palco3d, canvas: $(".cena3d__tela"), gsap, ScrollTrigger, reduce });

  /* ---- Emulações: a rolagem troca a tela do sistema ---- */
  $$(".emul").forEach((em) => {
    em.classList.add("com-js");
    const n = +em.dataset.passos, telas = $$(".tela", em), lis = $$(".emul__passos li", em), navs = $$(".s-nav__i", em);
    let atual = -1;
    const ir = (i) => {
      if (i === atual) return;
      atual = i; em.dataset.passo = i;
      telas.forEach((t) => t.classList.toggle("on", +t.dataset.t === i));
      lis.forEach((l) => l.classList.toggle("on", +l.dataset.i === i));
      navs.forEach((x) => x.classList.toggle("ativo", x.dataset.ativo === String(i)));
    };
    if (reduce) { ir(n - 1); lis.forEach((l) => l.classList.add("on")); return; }
    ir(0);
    ScrollTrigger.create({
      trigger: $(".emul__palco", em), start: "top top", end: "+=" + n * 70 + "%", pin: true, anticipatePin: 1,
      onUpdate: (st) => ir(Math.min(n - 1, Math.floor(st.progress * n))),
    });
  });

  /* ---- Cursor de lápis (só ponteiro fino) ---- */
  const cur = $(".cursor");
  if (cur && !reduce && matchMedia("(hover: hover)").matches) {
    const mx = gsap.quickTo(cur, "x", { duration: 0.18, ease: "power3" });
    const my = gsap.quickTo(cur, "y", { duration: 0.18, ease: "power3" });
    addEventListener("pointermove", (e) => { cur.classList.add("vivo"); mx(e.clientX); my(e.clientY); });
    document.addEventListener("pointerleave", () => cur.classList.remove("vivo"));
    document.addEventListener("pointerover", (e) => cur.classList.toggle("grande", !!e.target.closest("a, button, .chip")));
  }

  /* ---- Momento 3: a planta se desenha com a rolagem ---- */
  if (!reduce) {
    $$(".projeto[data-desenho]").forEach((proj) => {
      const svg = $(".planta", proj);
      const fig = $(".projeto__figura", proj);
      if (!svg) return;
      gsap.set($$(".tr", svg), { strokeDasharray: 1, strokeDashoffset: 1 });

      gsap.matchMedia().add({ desk: "(min-width: 900px)", mob: "(max-width: 899px)" }, (ctx) => {
        const desk = ctx.conditions.desk;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: desk ? proj : fig,
            start: desk ? "top top" : "top 80%",
            end: desk ? "bottom bottom" : "bottom 45%",
            scrub: 0.5,
          },
        });
        const passo = (sel, ini, dur, esc = 0) => {
          const els = $$(sel, svg);
          if (!els.length) return;
          tl.set(els, { opacity: 1 }, ini);
          tl.to(els, { strokeDashoffset: 0, duration: dur, stagger: esc }, ini);
        };
        passo(".w", 0, 2.2);
        passo(".d", 1.8, 1.2, 0.3);
        passo(".g", 3, 1.6, 0.3);
        passo(".c", 4.4, 2.2, 0.35);
        passo(".m", 6.4, 1.4, 0.3);
        tl.to($$(".rot", svg), { opacity: 1, duration: 0.6, stagger: 0.2 }, 7.8);
        passo(".led", 8.6, 1);
        const leg = $("figcaption", fig);
        if (leg) tl.to(leg, { opacity: 1, duration: 0.4 }, 9.4);
        const bt = $(".led-btn", fig);
        if (bt) tl.to(bt, { opacity: 1, duration: 0.4 }, 9.4);
        tl.to({}, { duration: 0.6 }, 9.8); // respiro no fim
      });
    });
  }
} catch (e) {
  document.documentElement.classList.remove("anim");
  console.error(e);
}
