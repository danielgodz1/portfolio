// ================= CONTEÚDO (troque aqui para cada cliente) =================
export const DADOS = {
  // Cena real: o hambúrguer se monta peça por peça conforme a rolagem
  cena: { video: "midia/cena.mp4", poster: "midia/cena.jpg", credito: "Vídeo gerado com IA (Google Flow)", alt: "Hambúrguer artesanal sendo montado camada por camada", dur: 320, inicio: 0.7, legenda: "topo", passos: [["Pão brioche.", "Assado todo dia, selado na chapa."], ["Blend 180 g.", "Carne moída na casa, crosta na chapa quente."], ["Cheddar derretendo.", "Tomate, cebola caramelizada e molho da casa."], ["Fecha e vai.", "Montado na hora. Do jeito que você pediu."]] },
  nome: "Bruto",
  hero: ["Montado na hora,", "peça por peça.", "Hambúrguer artesanal, chapa quente e pão brioche."],
  whatsapp: "",
  // Pedido pelo WhatsApp: taxa em reais (0 = grátis), minimo em reais (0 = sem mínimo). entrega/retirada: false esconde a opção.
  pedido: { entrega: true, retirada: true, taxa: 6, minimo: 0, tempo: "40 a 60 min", pagamentos: ["Pix", "Cartão na entrega", "Dinheiro"] },
  endereco: "Rua Exemplo, 77 · Jaú, SP",
  horarios: [["Ter a qui", "18h às 23h"], ["Sex e sáb", "18h à 1h"], ["Domingo", "18h às 23h"]],
  prato: { desenho: false, nome: "", desc: "", preco: "" },
  cardapio: {
    Burgers: [["Bruto clássico", "blend 180 g, cheddar, alface, tomate, molho da casa", "R$ 38"], ["Smash duplo", "2 × 90 g, queijo prato, cebola na chapa", "R$ 36"], ["Bacon jam", "blend 180 g, geleia de bacon, cheddar", "R$ 44"], ["Veggie", "grão-de-bico, queijo, picles", "R$ 34"]],
    Porções: [["Batata rústica", "alecrim e páprica", "R$ 22"], ["Onion rings", "empanados na hora", "R$ 24"]],
    Bebidas: [["Milkshake", "baunilha, chocolate ou doce de leite", "R$ 22"], ["Refrigerante", "lata", "R$ 7"], ["Limonada suíça", "", "R$ 12"]],
  },
};
// ===========================================================================

export const meta = {
  slug: "hamburgueria", rotulo: "Hamburgueria", nome: "Bruto Burger",
  titulo: "Bruto · Hambúrguer artesanal",
  descricao: "Hambúrguer artesanal montado na hora. Veja o cardápio e peça pelo WhatsApp.",
  conceito: "O hambúrguer se monta peça por peça enquanto você rola, como um vídeo que você controla.",
  fundo: "#111010", acento: "#ffb400",
};
export const fonts = [
  ["Young Serif", "@fontsource/young-serif/files/young-serif-latin-400-normal.woff2"],
  ["Work Sans", "@fontsource-variable/work-sans/files/work-sans-latin-wght-normal.woff2", "100 900"],
];

import { cenaReal } from "../real.mjs";
import { itens, qtd, pedidoHtml, reais } from "../pedido.mjs";
export const ITENS = itens(DADOS.cardapio);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wa = (msg) => `https://wa.me/${DADOS.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ---------- prato visto de cima (gerado no build) ---------- */
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const prato = () => {
  const fatias = Array.from({ length: 6 }, (_, i) => {
    const a = -30 + i * 17, x = 330 + i * 18, y = 230 + i * 30;
    return `<g transform="translate(${x} ${y}) rotate(${a})"><rect class="carne" x="-62" y="-20" width="124" height="40" rx="12"/><path class="gordura" d="M-56 -18 H56"/></g>`;
  }).join("");
  const farofa = Array.from({ length: 70 }, () => {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 70;
    return `<circle cx="${(210 + Math.cos(a) * r * 1.2).toFixed(1)}" cy="${(380 + Math.sin(a) * r * 0.7).toFixed(1)}" r="${(2 + rnd() * 3.5).toFixed(1)}"/>`;
  }).join("");
  const sal = Array.from({ length: 26 }, () => `<rect x="${(310 + rnd() * 150).toFixed(0)}" y="${(210 + rnd() * 190).toFixed(0)}" width="4" height="4" transform="rotate(${(rnd() * 90).toFixed(0)})" transform-origin="center"/>`).join("");
  const folhas = [[180, 250, -20], [215, 225, 30], [240, 262, 80]].map(([x, y, r]) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 Q14 -16 34 0 Q14 16 0 0 Z M2 0 H30"/>`).join("");
  const rot = (cls, txt, x1, y1, x2, y2, anc) => `<g class="rot ${cls}"><path d="M${x1} ${y1} L${x2} ${y2}"/><text x="${x2 + (anc === "end" ? -8 : 8)}" y="${y2 + 6}" text-anchor="${anc}">${txt}</text></g>`;
  return `<svg class="prato" viewBox="-120 0 840 600" role="img" aria-label="Prato visto de cima: purê, picanha fatiada, farofa, chimichurri, folhas e flor de sal">
    <circle class="louca" cx="300" cy="300" r="270"/><circle class="louca2" cx="300" cy="300" r="205"/>
    <path class="c c-pure" d="M150 230 C140 170 230 150 270 190 C310 230 300 320 250 340 C190 365 160 300 150 230 Z"/>
    <g class="c c-carne">${fatias}</g>
    <g class="c c-farofa">${farofa}</g>
    <path class="c c-chimi" pathLength="1" d="M280 180 C340 220 300 260 360 290 S330 360 400 390 S420 440 380 460"/>
    <g class="c c-folhas">${folhas}</g>
    <g class="c c-sal">${sal}</g>
    ${rot("r-pure", "purê de mandioquinha", 170, 200, 40, 120, "end")}
    ${rot("r-carne", "picanha na brasa", 470, 300, 600, 250, "start")}
    ${rot("r-farofa", "farofa de alho", 180, 420, 40, 500, "end")}
    ${rot("r-chimi", "chimichurri", 370, 400, 600, 470, "start")}
    ${rot("r-folhas", "folhas", 215, 225, 120, 60, "end")}
    ${rot("r-sal", "flor de sal", 420, 230, 600, 140, "start")}
  </svg>`;
};

export const html = () => {
  const D = DADOS, P = D.pedido || {};
  const abas = Object.keys(D.cardapio);
  return `
<div class="prog-topo" aria-hidden="true"></div>
<header class="topo"><a class="marca" href="#conteudo">${esc(D.nome)}</a><nav aria-label="Principal"><a href="#cardapio">Cardápio</a><button class="btn" type="button" data-abre-pedido>Pedido <b class="pd-n">0</b></button></nav></header>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <canvas class="brasas" aria-hidden="true"></canvas>
  <h1 id="h1" class="hero__t">${esc(D.hero[0])} <em>${esc(D.hero[1])}</em></h1>
  <p class="hero__l">${esc(D.hero[2])} ${esc(D.endereco)}.</p>
  <p class="hero__cta"><a class="btn btn--brasa" href="#cardapio">Fazer pedido</a></p>
</section>

${cenaReal(DADOS.cena)}
${D.prato.desenho === false ? "" : `<section class="montagem" aria-labelledby="pr-t">
  <div class="montagem__palco">
    <div class="montagem__texto">
      <p class="k">O prato da casa</p>
      <h2 id="pr-t">${esc(D.prato.nome)}</h2>
      <p>${esc(D.prato.desc)}</p>
      <p class="preco">${esc(D.prato.preco)}</p>
    </div>
    <div class="montagem__prato">${prato()}</div>
  </div>
</section>`}

<section class="cardapio" id="cardapio" aria-labelledby="card-t">
  <h2 id="card-t" class="sec-t" data-split>Cardápio</h2>
  <div class="abas" role="tablist" aria-label="Seções do cardápio">${abas.map((a, i) => `<button role="tab" id="ct-${i}" aria-controls="cp-${i}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${esc(a)}</button>`).join("")}</div>
  ${abas.map((a, i) => `<div role="tabpanel" id="cp-${i}" aria-labelledby="ct-${i}" ${i ? "hidden" : ""}><ul class="pratos">${D.cardapio[a].map(([n, d, p], j) => `<li><div><div class="linha"><b>${esc(n)}</b><span class="pontos" aria-hidden="true"></span><span class="v">${esc(p)}</span></div>${d ? `<p>${esc(d)}</p>` : ""}</div>${qtd(`${i}-${j}`, n)}</li>`).join("")}</ul></div>`).join("")}
</section>

<section class="como" id="pedir" aria-labelledby="como-t">
  <h2 id="como-t" class="sec-t" data-split>Peça sem sair do sofá.</h2>
  <ol class="como__passos">
    <li><b>Monte</b><span>Toque no + dos itens do cardápio.</span></li>
    <li><b>Escolha</b><span>${[P.entrega !== false && `Entrega${P.taxa ? ` (${reais(P.taxa)})` : " grátis"}`, P.retirada !== false && "retirada no balcão"].filter(Boolean).join(" ou ")}. ${esc((P.pagamentos || []).join(", "))}.</span></li>
    <li><b>Envie</b><span>O pedido chega pronto no nosso WhatsApp.${P.tempo ? ` Tempo médio: ${esc(P.tempo)}.` : ""}</span></li>
  </ol>
  <p class="como__bts"><a class="btn btn--brasa" href="#cardapio">Ver o cardápio</a><button class="btn" type="button" data-abre-pedido>Ver meu pedido</button></p>
</section>

<footer class="fim">
  <p class="fim__marca">${esc(D.nome)}</p>
  <div><h3>Onde</h3><p>${esc(D.endereco)}</p></div>
  <div><h3>Quando</h3><dl>${D.horarios.map(([d, h]) => `<div><dt>${esc(d)}</dt><dd>${esc(h)}</dd></div>`).join("")}</dl></div>
</footer>
</main>
${pedidoHtml(P)}`;
};
