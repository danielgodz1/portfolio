import { gsap, ScrollTrigger, $, $$, reduce, iniciar, abas, passos } from "../core.js";

iniciar();
abas($(".dias"));

/* Hero: anilhas entram uma a uma e a carga sobe de 20 a 140 kg */
const KG = [25, 20, 10, 5];
const n = $(".carga__n");
const total = (k) => 20 + 2 * KG.slice(0, k).reduce((a, b) => a + b, 0);
if (reduce) {
  n.textContent = total(4);
} else {
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: { trigger: ".hero__palco", start: "top top", end: "+=180%", pin: true, scrub: 0.6, anticipatePin: 1 },
  });
  tl.to(".hero__dica", { opacity: 0, duration: 0.3 }, 0);
  KG.forEach((_, i) => {
    tl.from(`.an--e[data-i="${i}"]`, { x: -700, duration: 1 }, i)
      .from(`.an--d[data-i="${i}"]`, { x: 700, duration: 1 }, i)
      .call(() => {}, null, i + 1);
  });
  const conta = { k: 20 };
  tl.to(conta, { k: total(4), duration: 4, ease: "none", onUpdate: () => (n.textContent = Math.round(conta.k / 5) * 5) }, 0);
  tl.to(".barra", { y: 6, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, 4);
}

/* Treinos: cada passo é uma repetição; o anel fecha no fim */
const itens = $$(".mods__lista li");
const anel = $(".anel__p");
passos($(".mods"), $(".mods__palco"), itens.length, (i) => {
  itens.forEach((li) => li.classList.toggle("on", +li.dataset.i === i));
  anel.style.strokeDashoffset = String(1 - (i + 1) / itens.length);
});

/* Faixa: anda sozinha e acelera com a velocidade da rolagem */
if (!reduce) {
  const anda = gsap.to(".faixa__trilho", { xPercent: -50, duration: 18, ease: "none", repeat: -1 });
  ScrollTrigger.create({
    onUpdate: (st) => {
      const v = Math.min(6, 1 + Math.abs(st.getVelocity()) / 400);
      gsap.to(anda, { timeScale: v * (st.direction || 1), duration: 0.2, overwrite: true });
      gsap.to(anda, { timeScale: st.direction || 1, duration: 1, delay: 0.2 });
    },
  });
}
