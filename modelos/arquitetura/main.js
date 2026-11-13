import { cenaReal } from "../core.js";
import { gsap, ScrollTrigger, $, $$, reduce, iniciarMotion, indicadorProgresso } from "../motion.js";
import { iniciarMaquete } from "./maquete.js";

iniciarMotion({ magnetico: ".btn, .maq__ctrl button" }); // Lenis, split-text, reveal, contadores, cursor desktop
{
  const barra = $(".prog-topo");
  if (barra && !reduce) indicadorProgresso({ aoAtualizar: (p) => { barra.style.transform = `scaleX(${p.toFixed(4)})`; } });
}

/* Hero: a planta se desenha a lápis ao carregar (com "reduzir movimento" ela já nasce pronta) */
if (!reduce) {
  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, delay: 0.2 });
  [[".w", 1.5, 0.1], [".p", 1.1, 0.08], [".j", 0.8, 0.05], [".m", 1.1, 0.04], [".c", 0.9, 0.08]].forEach(([sel, dur, stagger], i) =>
    tl.fromTo(`.planta .tr${sel}`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, stagger }, i ? "-=0.5" : 0));
  tl.from(".planta .rot", { opacity: 0, duration: 0.8, stagger: 0.05 }, "-=0.6");
}

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
    const bts = $$(".maq__ctrl button[data-modo]"), leg = $(".maq__leg"), rs = $("#maq-reset");
    const sincModo = (id) => {
      const ativo = bts.find((x) => x.dataset.modo === id); if (!ativo) return;
      bts.forEach((x) => x.setAttribute("aria-pressed", String(x === ativo)));
      leg.textContent = ativo.dataset.leg;
    };
    const montar = () => {
      let maq = null;
      try {
        maq = iniciarMaquete({
          canvas: $("canvas", palco), palco, gsap, reduce,
          aoInteragir: (sim) => {
            if (sim) $(".maq__dica", palco)?.classList.add("oculta");
            if (rs) rs.hidden = !sim;
          },
          aoModo: sincModo,
        });
      } catch (e) { maq = null; }
      if (!maq) {
        $(".maq__falha").hidden = false;
        $(".maq__dica", palco)?.classList.add("oculta");
        $(".maq__ctrl").hidden = true; leg.hidden = true; return;
      }
      bts.forEach((b) => b.addEventListener("click", () => { sincModo(b.dataset.modo); maq.modo(b.dataset.modo); }));
      rs?.addEventListener("click", () => maq.resetarVista());
    };
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); montar(); } }, { rootMargin: "600px 0px" }).observe(palco);
  }
}

/* WhatsApp flutuante não concorre quando o contato está visível */
{
  const fl = $(".wa-flut"), ct = $("#contato");
  if (fl && ct) new IntersectionObserver(([e]) => { fl.hidden = e.isIntersecting; }, { threshold: 0.08 }).observe(ct);
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
