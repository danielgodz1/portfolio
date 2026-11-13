import { cenaReal } from "../core.js";
import { gsap, ScrollTrigger, $, $$, reduce, wa, iniciarMotion, capitulos, indicadorProgresso } from "../motion.js";
import { DADOS } from "./page.mjs";
import { iniciarObra } from "./obra.js";
import { iniciarOrcamento } from "./orcamento.js";

iniciarMotion(); // Lenis + ticker único + split-text + reveals + cursor/magnético desktop-only
{
  const barra = $(".prog-topo");
  if (barra && !reduce) indicadorProgresso({ aoAtualizar: (p) => { barra.style.transform = `scaleX(${p.toFixed(4)})`; } });
}

const obra = iniciarObra({ gsap, capitulos, $, $$, reduce, DADOS, wa });
iniciarOrcamento({ $, $$, DADOS, wa, obra });

/* "Reduzir movimento": a cena real fica parada na obra pronta */
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
