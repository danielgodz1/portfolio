import { gsap, ScrollTrigger, $, $$, reduce, iniciar, cenaReal } from "../core.js";

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
