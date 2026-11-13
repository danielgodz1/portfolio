import { abas } from "../core.js";
import { gsap, ScrollTrigger, $, $$, reduce, wa, EASE, iniciarMotion, capitulos, indicadorProgresso } from "../motion.js";
import { DADOS } from "./page.mjs";
import { iniciarMovel } from "./movel.js";

const { irPara } = iniciarMotion(); // Lenis + ticker único + reveals + cursor/magnético desktop-only

/* Plano de corte do hero: peças encaixam na chapa ao abrir */
if (!reduce) {
  gsap.from(".plano .pc__peca", {
    opacity: 0,
    y: -18,
    duration: 0.65,
    stagger: 0.04,
    delay: 0.25,
    ease: EASE.oficina,
    clearProps: "transform,opacity",
  });
}

/* Indicador de progresso temático: fita métrica no desktop + barra no topo no mobile */
{
  const ponteiro = $(".regua__ponteiro"), valor = $(".regua__valor"), barra = $(".prog-topo");
  if ((ponteiro || barra) && !reduce) {
    const altura = () => (ponteiro ? innerHeight - ponteiro.parentElement.getBoundingClientRect().top - 40 : 0);
    indicadorProgresso({
      aoAtualizar: (p) => {
        if (ponteiro) {
          ponteiro.style.transform = `translate3d(0, ${(p * altura()).toFixed(1)}px, 0)`;
          valor.textContent = (p * 2.75).toFixed(2).replace(".", ",") + " m";
        }
        if (barra) barra.style.transform = `scaleX(${p.toFixed(4)})`;
      },
    });
  }
}

iniciarMovel({ gsap, capitulos, irPara, $, $$, reduce, DADOS, wa });
abas($(".amb__abas")); // ambientes em abas acessíveis (setas, Home e End)

/* Pré-carrega fotos das outras abas quando #ambientes se aproxima para evitar flash ao trocar */
{
  const secAmb = $("#ambientes");
  if (secAmb) {
    new IntersectionObserver((es, io) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      $$("#ambientes img[loading='lazy']").forEach((img) => { img.loading = "eager"; });
    }, { rootMargin: "500px 0px" }).observe(secAmb);
  }
}

/* por último: o que foi criado acima precisa ser medido antes */
ScrollTrigger.sort();
ScrollTrigger.refresh();
