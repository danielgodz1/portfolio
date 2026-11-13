import { ScrollTrigger, iniciar, cenaReal } from "../core.js";

iniciar(); // um único Lenis, ligado ao gsap.ticker

/* por último: as seções fixadas acima precisam ser medidas antes */
cenaReal();
ScrollTrigger.sort();
ScrollTrigger.refresh();
