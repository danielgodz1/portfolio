import { PADRAO } from "./pecas.mjs";
import { linhasTabela, resumo, mensagem } from "./tabela.mjs";
import { iniciarArmario } from "./armario.js";

/* Configurador: o formulário manda no estado; tabela, preço, link do WhatsApp e armário 3D seguem o estado.
   A rolagem (ScrollTrigger) só diz o quanto o armário está aberto em peças. */
export function iniciarMovel({ gsap, capitulos, irPara, $, $$, reduce, DADOS, wa }) {
  const sec = $("#movel"); if (!sec) return;
  const form = $("#configurador"), palco = $(".mv__canvas"), corpo = $("#r-corpo");
  const cfg = { ...PADRAO }, travados = new Set(); let arm = null, progresso = reduce ? 1 : 0;

  const ler = () => {
    for (const k of ["L", "A", "P"]) cfg[k] = +form.elements[k].value;
    for (const k of ["portas", "gavetas"]) cfg[k] = +form.elements[k].value;
    cfg.acabamento = form.elements.acabamento.value; cfg.puxador = form.elements.puxador.value;
  };
  const atualiza = () => {
    for (const k of ["L", "A", "P"]) $(`output[for="cfg-${k}"]`, form).textContent = cfg[k] + " cm";
    const r = resumo(cfg, DADOS), larg = cfg.L / cfg.portas;
    $("#r-preco").textContent = r.preco; $("#r-linha").textContent = r.linha;
    corpo.innerHTML = linhasTabela(cfg, travados);
    $("#r-zap").href = wa(DADOS.whatsapp, mensagem(cfg, DADOS));
    $(".cfg__aviso").textContent = larg > 70 ? "Cada porta ficou com mais de 70 cm de largura. Portas largas empenam com o tempo: uma porta a mais resolve." : larg < 25 ? "Cada porta ficou com menos de 25 cm de largura. Uma porta a menos fica mais simples de usar." : "";
    if (arm) arm.aplicar(cfg);
  };
  form.addEventListener("input", () => { ler(); atualiza(); });
  form.addEventListener("submit", (e) => e.preventDefault());

  /* lista de corte <-> peça no 3D: passar o mouse ou focar acende a peça; clicar trava */
  corpo.addEventListener("pointerover", (e) => { const b = e.target.closest(".pc-bt"); if (b && arm) arm.destacar(b.dataset.id); });
  corpo.addEventListener("pointerout", (e) => { if (e.target.closest(".pc-bt") && arm) arm.destacar(null); });
  corpo.addEventListener("focusin", (e) => { const b = e.target.closest(".pc-bt"); if (b && arm) arm.destacar(b.dataset.id); });
  corpo.addEventListener("focusout", (e) => { if (e.target.closest(".pc-bt") && arm) arm.destacar(null); });
  corpo.addEventListener("click", (e) => {
    const b = e.target.closest(".pc-bt"); if (!b) return;
    const sim = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", sim); sim ? travados.add(b.dataset.id) : travados.delete(b.dataset.id);
    if (arm) arm.travar(b.dataset.id, sim);
  });
  $$(".mv__acoes button").forEach((b) => b.addEventListener("click", () => {
    const sim = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", sim); if (arm) arm.abrir(b.dataset.abrir, sim);
  }));
  // amostras da seção de materiais: "Usar no meu armário"
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-usar]"); if (!b) return;
    form.elements.acabamento.value = b.dataset.usar; ler(); atualiza();
    irPara("#configurador");
  });

  /* 3D: só nasce perto da tela; capítulos sem zona morta e respeitando reduce */
  const trig = capitulos({
    trigger: ".mv__passos",
    start: "top 68%",
    end: "bottom 62%",
    etapas: ".mv__passos .passo",
    aoProgresso: (p) => { progresso = p; if (arm) arm.progresso(progresso); },
  });
  const montar = () => {
    try { arm = iniciarArmario({ canvas: $("canvas", palco), palco, rotulos: $(".mv__rotulos", palco), gsap, reduce, catalogo: DADOS }); } catch (e) { arm = null; }
    if (!arm) { $(".mv__falha").hidden = false; $(".mv__acoes").hidden = true; return; }
    arm.aplicar(cfg); arm.progresso(reduce ? 1 : trig ? trig.progress : progresso);
    for (const id of travados) arm.travar(id, true);
  };
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); montar(); } }, { rootMargin: "600px 0px" }).observe(palco);
  ler(); atualiza();
}
