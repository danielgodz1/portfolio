import { mensagemObra } from "./page.mjs";

/* Pedido de orçamento em 3 passos. Não há servidor: o resumo vira uma mensagem de WhatsApp pronta. */
export function iniciarOrcamento({ $, $$, DADOS, wa, obra }) {
  const f = $("#orcamento"); if (!f) return;
  const passos = $$("fieldset[data-passo]", f), rotulo = $("#orc-passo"), erro = $("#orc-erro");
  const voltar = $("[data-voltar]", f), prox = $("[data-prox]", f), enviar = $('button[type="submit"]', f);
  let atual = 0;
  const MSG = { area: "Informe a área aproximada da obra, em metros quadrados.", cidade: "Informe a cidade da obra.", nome: "Informe o seu nome.", zap: "Informe o WhatsApp com DDD, só números (pelo menos 10 dígitos)." };

  const mostra = (i, foco = true) => {
    atual = i; passos.forEach((p, k) => (p.hidden = k !== i));
    rotulo.textContent = `Passo ${i + 1} de ${passos.length}`; erro.textContent = "";
    voltar.hidden = i === 0; prox.hidden = i === passos.length - 1; enviar.hidden = i !== passos.length - 1;
    // o foco só vai para o primeiro campo ao trocar de passo, nunca ao carregar a página
    const primeiro = foco && passos[i].querySelector("input:not([type=radio]), input[type=radio]:checked"); if (primeiro) primeiro.focus({ preventScroll: true });
  };
  const valida = () => {
    for (const inp of $$("input", passos[atual])) {
      if (inp.type === "radio") continue;
      const digitos = inp.name === "zap" ? inp.value.replace(/\D/g, "").length >= 10 : true;
      if (!inp.value.trim() || !inp.checkValidity() || !digitos) { erro.textContent = MSG[inp.name] || "Confira este campo."; inp.focus(); return false; }
    }
    return true;
  };
  prox.addEventListener("click", () => { if (valida()) mostra(atual + 1); });
  voltar.addEventListener("click", () => mostra(atual - 1));
  f.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "radio") { e.preventDefault(); atual < passos.length - 1 ? prox.click() : f.requestSubmit(); } });
  f.addEventListener("submit", (e) => {
    e.preventDefault(); if (!valida()) return;
    const d = new FormData(f);
    let msg = `Olá! Sou ${d.get("nome")}, de ${d.get("cidade")}. Tenho um projeto: ${String(d.get("tipo")).toLowerCase()} de cerca de ${d.get("area")} m², na fase "${String(d.get("fase")).toLowerCase()}". Meu WhatsApp é ${d.get("zap")}.`;
    if (obra && obra.mexeu()) msg += ` ${mensagemObra(obra.getCfg())}`;
    const url = wa(DADOS.whatsapp, msg);
    $("#orc-link").href = url; $("#orc-ok").hidden = false; window.open(url, "_blank", "noopener");
  });
  mostra(0, false);
}
