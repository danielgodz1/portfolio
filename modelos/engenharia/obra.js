import { PADRAO } from "./quantitativo.mjs";
import { linhasPavimentos, quantitativoHtml, ganttHtml, mensagemObra } from "./page.mjs";
import { iniciarPredio } from "./predio.js";

/* Obra virtual: o formulário manda no estado; quantitativo, cronograma, pavimentos, link do WhatsApp e prédio 3D seguem o estado.
   A rolagem só diz até onde a obra chegou. Devolve getCfg() para o formulário de orçamento. */
export function iniciarObra({ gsap, ScrollTrigger, $, $$, reduce, DADOS, wa }) {
  const sec = $("#obra"); if (!sec) return { getCfg: () => ({ ...PADRAO }), mexeu: () => false };
  const form = $("#configurador"), palco = $(".ob__canvas"), corpo = $("#r-corpo");
  const cfg = { ...PADRAO }; let corte = PADRAO.andares, selecionado = null, arm = null, mexeu = false;

  const ler = () => {
    const velho = cfg.andares;
    cfg.andares = +form.elements.andares.value; cfg.L = +form.elements.L.value; cfg.D = +form.elements.D.value;
    const c = form.elements.corte; c.max = cfg.andares;
    corte = corte >= velho || +c.value >= cfg.andares ? cfg.andares : Math.min(corte, cfg.andares);
    if (selecionado != null && selecionado >= cfg.andares) selecionado = null;
    c.value = corte;
  };
  const atualiza = () => {
    $('output[for="cfg-andares"]', form).textContent = cfg.andares; $('output[for="cfg-L"]', form).textContent = cfg.L + " m"; $('output[for="cfg-D"]', form).textContent = cfg.D + " m";
    $('output[for="cfg-corte"]', form).textContent = corte >= cfg.andares ? "todos" : corte + "º andar";
    $("#r-quant").innerHTML = quantitativoHtml(cfg); $("#r-gantt").innerHTML = ganttHtml(cfg); corpo.innerHTML = linhasPavimentos(cfg, selecionado);
    $("#r-zap").href = wa(DADOS.whatsapp, mensagemObra(cfg));
    if (arm) { arm.aplicar(cfg); arm.cortar(corte); arm.selecionar(selecionado); }
  };
  form.addEventListener("input", (e) => {
    mexeu = true;
    if (e.target.name === "corte") corte = +e.target.value;
    else if (e.target.name === "cam") { arm && arm.camadas({ [e.target.value]: e.target.checked }); return; }
    ler(); atualiza();
  });
  form.addEventListener("submit", (e) => e.preventDefault());

  /* lista de pavimentos <-> andar no 3D */
  const idx = (e) => { const b = e.target.closest(".pav-bt"); return b ? +b.dataset.i : null; };
  corpo.addEventListener("pointerover", (e) => { const i = idx(e); if (i != null && arm) arm.destacar(i); });
  corpo.addEventListener("pointerout", (e) => { if (idx(e) != null && arm) arm.destacar(null); });
  corpo.addEventListener("focusin", (e) => { const i = idx(e); if (i != null && arm) arm.destacar(i); });
  corpo.addEventListener("focusout", (e) => { if (idx(e) != null && arm) arm.destacar(null); });
  corpo.addEventListener("click", (e) => {
    const i = idx(e); if (i == null) return;
    selecionado = selecionado === i ? null : i; corpo.innerHTML = linhasPavimentos(cfg, selecionado); if (arm) arm.selecionar(selecionado);
  });

  /* 3D: só nasce perto da tela; a rolagem diz até onde a obra chegou */
  const trig = ScrollTrigger.create({ trigger: ".ob__passos", start: "top 70%", end: "bottom 70%", onUpdate: (s) => { if (arm) arm.progresso(s.progress); } });
  const montar = () => {
    try { arm = iniciarPredio({ canvas: $("canvas", palco), palco, rotulos: $(".ob__rotulos", palco), gsap, reduce }); } catch (e) { arm = null; }
    if (!arm) { $(".ob__falha").hidden = false; return; }
    arm.aoSelecionar((i) => { selecionado = i; corpo.innerHTML = linhasPavimentos(cfg, selecionado); });
    arm.aplicar(cfg); arm.cortar(corte); arm.progresso(reduce ? 1 : trig.progress);
    $$('input[name="cam"]', form).forEach((c) => arm.camadas({ [c.value]: c.checked }));
  };
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); montar(); } }, { rootMargin: "600px 0px" }).observe(palco);

  /* o cronograma cresce uma vez ao entrar na tela */
  if (!reduce) gsap.from(".barra", { scaleX: 0, transformOrigin: "left center", duration: 0.9, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: ".gantt", start: "top 80%", once: true } });

  ler(); atualiza();
  return { getCfg: () => ({ ...cfg }), mexeu: () => mexeu };
}
