// Pedido pelo WhatsApp (comida): HTML gerado no build. O comportamento está em pedido.js.
// DADOS.pedido = { entrega: true, retirada: true, taxa: 6, minimo: 0, tempo: "40 a 60 min", pagamentos: ["Pix", ...] }
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const valor = (s) => parseFloat(String(s).replace(/[^\d,]/g, "").replace(",", ".")) || 0;
export const reais = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
// lista plana do cardápio: o id é "seção-posição" (ex.: "0-2")
export const itens = (cardapio) =>
  Object.values(cardapio).flatMap((l, g) => l.map(([nome, desc, preco], i) => ({ id: `${g}-${i}`, nome, desc, preco: valor(preco) })));

// botões de quantidade ao lado de cada item do cardápio
export const qtd = (id, nome) => `<div class="qt" data-id="${id}">
  <button type="button" class="qt__menos" aria-label="Tirar um ${esc(nome)}" hidden>−</button>
  <output class="qt__n" hidden>0</output>
  <button type="button" class="qt__mais" aria-label="Adicionar ${esc(nome)} ao pedido">+</button>
</div>`;

export const pedidoHtml = (P = {}) => {
  const modos = [P.entrega !== false && ["entrega", "Entrega", P.taxa ? `taxa de ${reais(P.taxa)}` : "sem taxa"], P.retirada !== false && ["retirada", "Retirar no balcão", "sem taxa"]].filter(Boolean);
  const pags = P.pagamentos || ["Pix", "Cartão", "Dinheiro"];
  return `<button type="button" class="pd-barra" id="pd-barra" hidden><span class="pd-barra__n"></span><b>Ver pedido</b><span class="pd-barra__t"></span></button>
<dialog class="pd" id="pd" aria-labelledby="pd-t" data-lenis-prevent>
  <div class="pd__topo"><h2 id="pd-t">Seu pedido</h2><button type="button" class="pd__x" aria-label="Fechar">×</button></div>
  <form id="pd-f" novalidate>
    <ul class="pd__itens"></ul>
    <p class="pd__vazio">Seu pedido está vazio. Toque no + ao lado dos itens do cardápio.</p>
    <fieldset class="pd__modo"><legend>Como quer receber</legend>${modos.map(([v, t, n], i) => `<label class="pd__op"><input type="radio" name="modo" value="${v}" ${i ? "" : "checked"}><span><b>${t}</b><small>${n}</small></span></label>`).join("")}</fieldset>
    <label class="pd__campo" data-so="entrega">Endereço de entrega<input name="endereco" autocomplete="street-address" placeholder="Rua, número e bairro"></label>
    <fieldset><legend>Pagamento</legend><div class="pd__pags">${pags.map((p, i) => `<label class="pd__chip"><input type="radio" name="pag" value="${esc(p)}" ${i ? "" : "checked"}><span>${esc(p)}</span></label>`).join("")}</div></fieldset>
    <label class="pd__campo" data-so="dinheiro" hidden>Troco para quanto? (opcional)<input name="troco" inputmode="decimal" placeholder="Ex.: 100"></label>
    <label class="pd__campo">Seu nome<input name="cliente" autocomplete="name"></label>
    <label class="pd__campo">Observações (opcional)<textarea name="obs" rows="2" placeholder="Sem cebola, ponto da carne, interfone"></textarea></label>
    <p class="pd__nota">O pedido abre no WhatsApp com tudo escrito. ${P.tempo ? `Tempo médio: ${esc(P.tempo)}.` : ""}</p>
    <p class="pd__erro" role="alert" hidden></p>
    <div class="pd__pe">
      <dl class="pd__soma"><div><dt>Itens</dt><dd class="pd__sub"></dd></div><div class="pd__lt"><dt>Entrega</dt><dd class="pd__taxa"></dd></div><div class="pd__tot"><dt>Total</dt><dd class="pd__total"></dd></div></dl>
      <button type="submit" class="pd__envia">Enviar pedido pelo WhatsApp</button>
    </div>
  </form>
</dialog>`;
};
