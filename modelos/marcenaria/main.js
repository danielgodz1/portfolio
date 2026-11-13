import { gsap, ScrollTrigger, $, $$, reduce, iniciar, wa, abas } from "../core.js";
import { DADOS } from "./page.mjs";
import { iniciarMovel } from "./movel.js";

iniciar(); // um único Lenis, ligado ao gsap.ticker

/* Régua de fita métrica: o ponteiro desce com a página e mostra o quanto da "chapa de 2,75 m" já foi lida */
{
  const ponteiro = $(".regua__ponteiro"), valor = $(".regua__valor");
  if (ponteiro && !reduce) {
    const altura = () => innerHeight - ponteiro.parentElement.getBoundingClientRect().top - 40; // sobra espaço para o valor abaixo da barra
    ScrollTrigger.create({
      trigger: document.body, start: "top top", end: "bottom bottom",
      onUpdate: (s) => {
        ponteiro.style.transform = `translate3d(0, ${s.progress * altura()}px, 0)`;
        valor.textContent = (s.progress * 2.75).toFixed(2).replace(".", ",") + " m";
      },
    });
  }
}

iniciarMovel({ gsap, ScrollTrigger, $, $$, reduce, DADOS, wa });
abas($(".amb__abas")); // ambientes em abas acessíveis (setas, Home e End)

/* por último: o que foi criado acima precisa ser medido antes */
ScrollTrigger.sort();
ScrollTrigger.refresh();
