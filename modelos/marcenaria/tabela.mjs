// Textos do configurador (lista de corte, resumo e mensagem de WhatsApp). Rodam no build (estado inicial) e no navegador (ao vivo).
import { pecas, totais, medidas } from "./pecas.mjs";

const mm = (cm) => Math.round(cm * 10);
export const reais = (n) => "R$ " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const dec = (n) => n.toFixed(1).replace(".", ",");

export const linhasTabela = (cfg, travados = new Set()) =>
  pecas(cfg).map((p) => `<tr><th scope="row"><button type="button" class="pc-bt" data-id="${p.id}" aria-pressed="${travados.has(p.id)}">${p.nome}</button></th><td>${p.qtd}</td><td>${mm(p.c)}</td><td>${mm(p.l)}</td><td>${p.esp}</td></tr>`).join("");

export function resumo(cfg, catalogo) {
  const t = totais(cfg, catalogo), m = medidas(cfg);
  return { ...t, prat: m.prat, preco: reais(t.preco), linha: `${t.chapas18} ${t.chapas18 === 1 ? "chapa" : "chapas"} de 18 mm, ${t.pecas} peças e ${dec(t.a18)} m² de MDF` };
}

export function mensagem(cfg, catalogo, link = "") {
  const t = resumo(cfg, catalogo);
  const ac = catalogo.acabamentos.find((a) => a.id === cfg.acabamento) || catalogo.acabamentos[0];
  const px = catalogo.puxadores.find((p) => p.id === cfg.puxador) || catalogo.puxadores[0];
  const gav = cfg.gavetas ? `${cfg.gavetas} ${cfg.gavetas === 1 ? "gaveta" : "gavetas"}` : "sem gavetas";
  const prat = t.prat ? `${t.prat} ${t.prat === 1 ? "prateleira" : "prateleiras"}` : "sem prateleiras internas";
  const largPorta = cfg.L / cfg.portas;
  const alerta = largPorta > 70 ? " (atenção: porta acima de 70 cm)" : largPorta < 25 ? " (atenção: porta abaixo de 25 cm)" : "";
  return `Olá! Montei um armário no site: ${cfg.L} x ${cfg.A} x ${cfg.P} cm (largura x altura x profundidade), acabamento ${ac.nome}, puxador ${px.nome.toLowerCase()}, ${cfg.portas} ${cfg.portas === 1 ? "porta" : "portas"}${alerta}, ${gav} e ${prat}. Resumo: ${t.linha} + ${t.chapas6} ${t.chapas6 === 1 ? "chapa" : "chapas"} de 6 mm. Estimativa: ${t.preco}.${link ? ` Configuração salva: ${link}` : ""} Gostaria de um orçamento.`;
}
