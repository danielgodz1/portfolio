import { gsap, ScrollTrigger, $, $$, reduce, iniciar, cenaReal } from "../core.js";
import { iniciarMaquete } from "./maquete.js";

iniciar(); // um único Lenis, ligado ao gsap.ticker

/* Hero: a planta se desenha a lápis ao carregar (com "reduzir movimento" ela já nasce pronta) */
if (!reduce) {
  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, delay: 0.2 });
  [[".w", 1.5, 0.1], [".p", 1.1, 0.08], [".j", 0.8, 0.05], [".m", 1.1, 0.04], [".c", 0.9, 0.08]].forEach(([sel, dur, stagger], i) =>
    tl.fromTo(`.planta .tr${sel}`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, stagger }, i ? "-=0.5" : 0));
  tl.from(".planta .rot", { opacity: 0, duration: 0.8, stagger: 0.05 }, "-=0.6");
}

/* Números: contam até o valor quando entram na tela (o HTML já traz o valor final) */
if (!reduce)
  $$(".num__v").forEach((el) => {
    const o = { v: 0 };
    el.textContent = "0";
    gsap.to(o, { v: +el.dataset.n, duration: 1.8, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });

/* Processo: o fio de lápis se desenha com a rolagem e cada etapa acende seu ponto */
{
  const fio = $(".proc__fio path");
  if (fio && !reduce)
    gsap.fromTo(fio, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".proc__lista", start: "top 65%", end: "bottom 65%", scrub: 0.5 } });
  if (!reduce)
    $$(".etapa").forEach((el) => ScrollTrigger.create({ trigger: el, start: "top 65%", onEnter: () => el.classList.add("feita"), onLeaveBack: () => el.classList.remove("feita") }));
}

/* Antes e depois: o <input range> manda; o CSS lê --pn (clip-path e transform) */
{
  const fig = $(".ad__fig"), rg = $(".ad__range");
  if (fig && rg) {
    const poe = (v) => {
      fig.style.setProperty("--pn", v);
      rg.setAttribute("aria-valuetext", v <= 5 ? "Só o antes" : v >= 95 ? "Só o depois" : `Divisão em ${Math.round(v)} por cento`);
    };
    rg.addEventListener("input", () => poe(+rg.value));
    poe(50);
    if (!reduce) {
      // ao entrar na tela, o "depois" é revelado uma vez
      const o = { v: 100 };
      poe(100); rg.value = 100;
      gsap.to(o, { v: 50, duration: 1.4, ease: "power3.inOut", onUpdate: () => { poe(o.v); rg.value = o.v; }, scrollTrigger: { trigger: fig, start: "top 75%", once: true } });
    }
  }
}

/* Maquete 3D: só é montada quando a seção chega perto da tela (um único renderer, um único canvas) */
{
  const palco = $(".maq__palco");
  if (palco) {
    const bts = $$(".maq__ctrl button"), leg = $(".maq__leg");
    const montar = () => {
      let maq = null;
      try { maq = iniciarMaquete({ canvas: $("canvas", palco), palco, gsap, reduce }); } catch (e) { maq = null; }
      if (!maq) { $(".maq__falha").hidden = false; $(".maq__ctrl").hidden = true; leg.hidden = true; return; }
      bts.forEach((b) => b.addEventListener("click", () => {
        bts.forEach((x) => x.setAttribute("aria-pressed", x === b));
        leg.textContent = b.dataset.leg;
        maq.modo(b.dataset.modo);
      }));
    };
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); montar(); } }, { rootMargin: "600px 0px" }).observe(palco);
  }
}

/* "Reduzir movimento": a cena fica parada na casa pronta (último quadro), sem pin e sem scrub */
if (reduce) {
  const v = $(".real video");
  if (v) {
    v.addEventListener("loadedmetadata", () => { v.currentTime = Math.max(0, v.duration - 0.05); }, { once: true });
    v.preload = "auto"; v.load();
  }
}

/* por último: as seções fixadas acima precisam ser medidas antes */
cenaReal();
ScrollTrigger.sort();
ScrollTrigger.refresh();
