// ================= CONTEÚDO (troque aqui para cada cliente) =================
export const DADOS = {
  // Cena real: a pizza sai do forno a lenha e a fatia puxa o queijo
  cena: { video: "midia/cena.mp4", poster: "midia/cena.jpg", credito: "Vídeo gerado com IA (Google Flow)", alt: "Pizza saindo do forno a lenha com o queijo esticando", dur: 300, passos: [["Forno a 450 °C.", "Lenha de verdade, 90 segundos de forno."], ["Borda que respira.", "Massa de fermentação lenta, 48 horas."], ["O fio do queijo.", "Muçarela de búfala e manjericão fresco."]] },
  nome: "Forno",
  hero: ["Noventa segundos", "de fogo.", "Pizza napolitana em forno a lenha."],
  whatsapp: "",
  endereco: "Rua Exemplo, 900 · Jaú, SP",
  horarios: [["Ter a qui", "18h às 23h"], ["Sex e sáb", "18h à meia-noite"], ["Domingo", "18h às 23h"]],
  prato: { desenho: false, nome: "", desc: "", preco: "" },
  cardapio: {
    Clássicas: [["Margherita", "tomate San Marzano, muçarela de búfala, manjericão", "R$ 59"], ["Marinara", "tomate, alho, orégano, azeite", "R$ 45"], ["Calabresa", "calabresa artesanal, cebola roxa", "R$ 58"]],
    Especiais: [["Burrata", "burrata inteira, pesto, tomate confit", "R$ 79"], ["Diavola", "salame picante, mel quente", "R$ 68"], ["Funghi", "cogumelos, trufa, parmesão", "R$ 74"]],
    Doces: [["Nutella e morango", "", "R$ 52"], ["Banana e canela", "doce de leite", "R$ 46"]],
    Bebidas: [["Vinho da casa", "taça", "R$ 28"], ["Soda italiana", "", "R$ 14"], ["Água com gás", "", "R$ 7"]],
  },
};
// ===========================================================================

export const meta = {
  slug: "pizzaria", rotulo: "Pizzaria", nome: "Forno",
  titulo: "Forno · Pizza napolitana a lenha",
  descricao: "Pizza napolitana em forno a lenha. Veja o cardápio e reserve pelo WhatsApp.",
  conceito: "A pizza sai do forno e o queijo estica conforme a rolagem.",
  fundo: "#1a0f0c", acento: "#e8452c",
};
export const fonts = [
  ["Young Serif", "@fontsource/young-serif/files/young-serif-latin-400-normal.woff2"],
  ["Work Sans", "@fontsource-variable/work-sans/files/work-sans-latin-wght-normal.woff2", "100 900"],
];

import { cenaReal } from "../real.mjs";
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
  const D = DADOS;
  const abas = Object.keys(D.cardapio);
  return `
<header class="topo"><a class="marca" href="#conteudo">${esc(D.nome)}</a><nav aria-label="Principal"><a href="#cardapio">Cardápio</a><a class="btn" href="#reserva">Reservar</a></nav></header>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <canvas class="brasas" aria-hidden="true"></canvas>
  <h1 id="h1" class="hero__t">${esc(D.hero[0])} <em>${esc(D.hero[1])}</em></h1>
  <p class="hero__l">${esc(D.hero[2])} ${esc(D.endereco)}.</p>
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
  ${abas.map((a, i) => `<div role="tabpanel" id="cp-${i}" aria-labelledby="ct-${i}" ${i ? "hidden" : ""}><ul class="pratos">${D.cardapio[a].map(([n, d, p]) => `<li><div class="linha"><b>${esc(n)}</b><span class="pontos" aria-hidden="true"></span><span class="v">${esc(p)}</span></div>${d ? `<p>${esc(d)}</p>` : ""}</li>`).join("")}</ul></div>`).join("")}
</section>

<section class="reserva" id="reserva" aria-labelledby="res-t">
  <h2 id="res-t" class="sec-t" data-split>Guarde a sua mesa.</h2>
  <form class="form" id="form-res" novalidate>
    <label>Seu nome<input name="nome" autocomplete="name" required></label>
    <label>Dia<input name="dia" type="date" required></label>
    <label>Horário<select name="hora" required><option value="">Escolha</option>${["12:00", "12:30", "13:00", "13:30", "18:00", "19:00", "20:00", "21:00", "22:00"].map((h) => `<option>${h}</option>`).join("")}</select></label>
    <label>Pessoas<select name="pessoas">${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `<option ${n === 2 ? "selected" : ""}>${n}</option>`).join("")}<option>9 ou mais</option></select></label>
    <p class="erro" role="alert" hidden></p>
    <button class="btn btn--brasa" type="submit">Pedir reserva pelo WhatsApp</button>
  </form>
</section>

<footer class="fim">
  <p class="fim__marca">${esc(D.nome)}</p>
  <div><h3>Onde</h3><p>${esc(D.endereco)}</p></div>
  <div><h3>Quando</h3><dl>${D.horarios.map(([d, h]) => `<div><dt>${esc(d)}</dt><dd>${esc(h)}</dd></div>`).join("")}</dl></div>
</footer>
</main>`;
};
