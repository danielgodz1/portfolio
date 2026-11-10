// Pedido pelo WhatsApp: quantidades no cardápio, barra flutuante e a janela do pedido.
// Uso: pedido({ slug, itens, config: DADOS.pedido, whatsapp, lenis })
import { $, $$, wa } from "./core.js";
const reais = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function pedido({ slug, itens, config = {}, whatsapp, lenis }) {
  const dlg = $("#pd"), f = $("#pd-f"), barra = $("#pd-barra");
  if (!dlg) return;
  const I = Object.fromEntries(itens.map((i) => [i.id, i]));
  const chave = "pedido-" + slug;
  let Q = {};
  try { Q = JSON.parse(sessionStorage.getItem(chave)) || {}; } catch {}
  for (const id of Object.keys(Q)) if (!I[id] || !(Q[id] > 0)) delete Q[id];

  const n = () => Object.values(Q).reduce((a, b) => a + b, 0);
  const sub = () => Object.entries(Q).reduce((a, [id, q]) => a + I[id].preco * q, 0);
  const taxa = () => (f.modo.value === "entrega" ? config.taxa || 0 : 0);
  const erro = (m) => { const e = $(".pd__erro"); e.textContent = m || ""; e.hidden = !m; };

  const pinta = () => {
    try { sessionStorage.setItem(chave, JSON.stringify(Q)); } catch {}
    $$(".qt").forEach((el) => {
      const q = Q[el.dataset.id] || 0;
      $(".qt__n", el).textContent = q;
      $(".qt__n", el).hidden = $(".qt__menos", el).hidden = !q;
      el.classList.toggle("on", q > 0);
    });
    const t = n();
    barra.hidden = !t;
    $(".pd-barra__n").textContent = t;
    $(".pd-barra__t").textContent = reais(sub());
    $$(".pd-n").forEach((el) => (el.textContent = t));
    $(".pd__itens").innerHTML = Object.entries(Q).map(([id, q]) =>
      `<li><span class="pd__nome">${I[id].nome}</span><b>${reais(I[id].preco * q)}</b><div class="qt on" data-id="${id}"><button type="button" class="qt__menos" aria-label="Tirar um ${I[id].nome}">−</button><output class="qt__n">${q}</output><button type="button" class="qt__mais" aria-label="Mais um ${I[id].nome}">+</button></div></li>`).join("");
    $(".pd__vazio").hidden = t > 0;
    const entrega = f.modo.value === "entrega";
    $$('[data-so="entrega"]', f).forEach((el) => (el.hidden = !entrega));
    $$('[data-so="dinheiro"]', f).forEach((el) => (el.hidden = f.pag.value !== "Dinheiro"));
    $(".pd__lt").hidden = !entrega;
    $(".pd__sub").textContent = reais(sub());
    $(".pd__taxa").textContent = taxa() ? reais(taxa()) : "grátis";
    $(".pd__total").textContent = reais(sub() + taxa());
  };

  document.addEventListener("click", (e) => {
    const b = e.target.closest(".qt button");
    if (!b) return;
    const id = b.closest(".qt").dataset.id, d = b.classList.contains("qt__mais") ? 1 : -1;
    Q[id] = Math.max(0, Math.min(20, (Q[id] || 0) + d));
    if (!Q[id]) delete Q[id];
    erro(""); pinta();
    // ao zerar um item dentro da janela, o botão some: devolve o foco
    if (!b.isConnected || b.hidden) (dlg.open ? $(".pd__x") : $(`.qt[data-id="${id}"] .qt__mais`))?.focus();
  });
  f.addEventListener("change", pinta);

  const abre = () => { erro(""); pinta(); dlg.showModal(); if (lenis) lenis.stop(); };
  barra.addEventListener("click", abre);
  $$("[data-abre-pedido]").forEach((b) => b.addEventListener("click", abre));
  $(".pd__x").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { if (lenis) lenis.start(); });

  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const entrega = f.modo.value === "entrega";
    if (!n()) return erro("Escolha pelo menos um item do cardápio.");
    if (config.minimo && sub() < config.minimo) return erro(`O pedido mínimo é de ${reais(config.minimo)}.`);
    if (entrega && !f.endereco.value.trim()) { erro("Informe o endereço de entrega."); f.endereco.focus(); return; }
    if (!f.cliente.value.trim()) { erro("Informe seu nome."); f.cliente.focus(); return; }
    const linhas = Object.entries(Q).map(([id, q]) => `• ${q}× ${I[id].nome} (${reais(I[id].preco * q)})`);
    const troco = f.pag.value === "Dinheiro" && f.troco.value.trim() ? ` (troco para R$ ${f.troco.value.trim()})` : "";
    const msg = [
      "Olá! Quero fazer um pedido:", ...linhas, "",
      entrega ? `Entrega: ${f.endereco.value.trim()}` : "Retirada no balcão",
      entrega && taxa() ? `Taxa de entrega: ${reais(taxa())}` : "",
      `Total: ${reais(sub() + taxa())}`,
      `Pagamento: ${f.pag.value}${troco}`,
      `Nome: ${f.cliente.value.trim()}`,
      f.obs.value.trim() ? `Obs.: ${f.obs.value.trim()}` : "",
    ].filter((l, i) => l || i === linhas.length + 1).join("\n");
    window.open(wa(whatsapp, msg), "_blank", "noopener");
  });
  pinta();
}
