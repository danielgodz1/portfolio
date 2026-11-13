import { gsap, ScrollTrigger, $, $$, reduce, iniciar, wa, cenaReal } from "../core.js";
import { DADOS } from "./page.mjs";
import { iniciarObra } from "./obra.js";
import { iniciarOrcamento } from "./orcamento.js";

iniciar(); // um único Lenis, ligado ao gsap.ticker

const obra = iniciarObra({ gsap, ScrollTrigger, $, $$, reduce, DADOS, wa });
iniciarOrcamento({ $, $$, DADOS, wa, obra });

/* por último: as seções fixadas acima precisam ser medidas antes */
cenaReal();
ScrollTrigger.sort();
ScrollTrigger.refresh();
