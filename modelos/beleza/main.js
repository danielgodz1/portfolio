import { gsap, ScrollTrigger, $, $$, reduce, iniciar, wa } from "../core.js";
import { DADOS } from "./page.mjs";

iniciar();

/* Olho: cílios, mapeamento e sobrancelha se desenham com a rolagem */
const etapas = $$(".etapas li");
const marca = (i) => etapas.forEach((li) => li.classList.toggle("on", +li.dataset.i === i));
if (reduce) {
  marca(2); gsap.set(".mapa", { opacity: 0.35 });
} else {
  gsap.set([".cilio", ".fio", ".guia"], { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(".ponto", { scale: 0, transformOrigin: "50% 50%" });
  marca(0);
  gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: ".hero__palco", start: "top top", end: "+=220%", pin: true, scrub: 0.6, anticipatePin: 1,
      onUpdate: (st) => marca(st.progress < 0.38 ? 0 : st.progress < 0.62 ? 1 : 2),
    },
  })
    .to(".cilio", { strokeDashoffset: 0, duration: 0.12, stagger: 0.012 }, 0)
    .to(".guia", { strokeDashoffset: 0, duration: 0.25, stagger: 0.08 }, 0.55)
    .to(".ponto", { scale: 1, duration: 0.08, stagger: 0.08, ease: "back.out(3)" }, 0.75)
    .to(".fio", { strokeDashoffset: 0, duration: 0.06, stagger: 0.008 }, 1.0)
    .to(".sobr-forma", { opacity: 0.55, duration: 0.4 }, 1.05)
    .to(".mapa", { opacity: 0.25, duration: 0.3 }, 1.5);
}

/* Unhas: a cor escolhida vira o acento do site inteiro */
const raiz = document.documentElement;
const fu = $(".unhas__ctrl");
const aplica = () => {
  const e = fu.querySelector('[name="esm"]:checked');
  raiz.style.setProperty("--acento", e.value);
  raiz.style.setProperty("--sobre", e.dataset.t);
  $(".mao").dataset.fmt = fu.querySelector('[name="fmt"]:checked').value;
};
fu.addEventListener("change", aplica);
aplica();

/* Agenda: soma preço e tempo, manda a lista pelo WhatsApp */
const ag = $("#ag");
const atualiza = () => {
  const sel = $$('[name="srv"]:checked', ag);
  const p = sel.reduce((a, x) => a + +x.dataset.p, 0), m = sel.reduce((a, x) => a + +x.dataset.m, 0);
  $(".ag__p").textContent = `R$ ${p}`;
  $(".ag__m").textContent = m >= 60 ? `cerca de ${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}` : `${m} min`;
  if (sel.length) $(".ag__erro").hidden = true;
  return sel;
};
ag.addEventListener("change", atualiza);
ag.addEventListener("submit", (e) => {
  e.preventDefault();
  const sel = atualiza();
  if (!sel.length) { $(".ag__erro").hidden = false; return; }
  const msg = `Olá! Quero agendar: ${sel.map((x) => x.value).join(", ")}. Melhor dia: ${ag.dia.value}, ${ag.per.value.toLowerCase()}. Total estimado: ${$(".ag__p").textContent}.`;
  window.open(wa(DADOS.whatsapp, msg), "_blank", "noopener");
});
