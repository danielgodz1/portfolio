// ================= CONTEÚDO (troque aqui para cada cliente) =================
export const DADOS = {
  // Cena real: vídeo do frasco (borrifo, líquido, luz)
  cena: { video: "midia/cena.mp4", poster: "midia/cena.jpg", credito: "Vídeo: Tima Miroshnichenko / Pexels", alt: "Frasco de perfume sendo borrifado", dur: 240, passos: [["Um borrifo.", ""], ["Uma nuvem.", ""], ["Uma lembrança.", ""]] },
  nome: "Nota",
  whatsapp: "",
  endereco: "Rua Exemplo, 789 · Centro · Jaú, SP",
  horario: "Seg a sáb, 9h às 19h",
  // a jornada na pele (o fundo e a névoa mudam de cor em cada fase)
  fases: [
    { nome: "Saída", tempo: "0 a 15 minutos", notas: ["bergamota", "limão siciliano", "pimenta rosa"], texto: "O primeiro contato. Notas leves e brilhantes que evaporam rápido.", fundo: "#eef1dc", tinta: "#2a2f12", nevoa: [214, 196, 60] },
    { nome: "Coração", tempo: "15 minutos a 3 horas", notas: ["jasmim", "rosa", "flor de laranjeira"], texto: "A alma do perfume. Aparece quando a saída se despede.", fundo: "#f4dfe2", tinta: "#4a1624", nevoa: [214, 96, 128] },
    { nome: "Fundo", tempo: "3 horas em diante", notas: ["sândalo", "âmbar", "baunilha"], texto: "O que fica na pele e na memória até o fim do dia.", fundo: "#2b1b14", tinta: "#f3e3cf", nevoa: [226, 150, 70] },
  ],
  // foto (opcional): "midia/frasco-1.png" (PNG sem fundo). Com foto, o desenho do frasco some.
  colecao: [
    { nome: "Manhã", familia: "Cítrica", notas: "Bergamota, neroli, almíscar", preco: "R$ 289", ml: "50 ml", cor: "#e3d25a", forma: "alto" },
    { nome: "Jardim", familia: "Floral", notas: "Rosa, peônia, cedro", preco: "R$ 319", ml: "50 ml", cor: "#e59bb0", forma: "redondo" },
    { nome: "Madeira", familia: "Amadeirada", notas: "Vetiver, sândalo, cardamomo", preco: "R$ 349", ml: "50 ml", cor: "#9b6a3c", forma: "quadrado" },
    { nome: "Noite", familia: "Oriental", notas: "Âmbar, baunilha, oud", preco: "R$ 389", ml: "50 ml", cor: "#5a2340", forma: "baixo" },
  ],
  quiz: [
    { p: "Qual destes momentos é mais você?", r: [["Café da manhã na varanda", "Cítrica"], ["Fim de tarde num jardim", "Floral"], ["Livro e manta no sofá", "Amadeirada"], ["Jantar à luz de velas", "Oriental"]] },
    { p: "Que textura você prefere?", r: [["Linho fresco", "Cítrica"], ["Seda", "Floral"], ["Couro macio", "Amadeirada"], ["Veludo", "Oriental"]] },
    { p: "Quando você mais usaria?", r: [["No calor do dia", "Cítrica"], ["Em encontros", "Floral"], ["No trabalho", "Amadeirada"], ["À noite", "Oriental"]] },
  ],
};
// ===========================================================================

export const meta = {
  slug: "perfumes", rotulo: "Perfumaria", nome: "Nota Perfumaria",
  titulo: "Nota · Perfumaria autoral",
  descricao: "Perfumes autorais e um teste para descobrir sua família olfativa.",
  conceito: "A rolagem é o tempo na pele: saída, coração e fundo, com a névoa evaporando.",
  fundo: "#1d1220", acento: "#e29646",
};
export const fonts = [
  ["Cormorant Garamond", "@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2", "300 700"],
  ["Cormorant Garamond", "@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-italic.woff2", "300 700", "italic"],
  ["Jost", "@fontsource-variable/jost/files/jost-latin-wght-normal.woff2", "100 900"],
];

import { cenaReal } from "../real.mjs";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wa = (msg) => `https://wa.me/${DADOS.whatsapp}?text=${encodeURIComponent(msg)}`;

const FRASCO = {
  alto: { corpo: "M62 70 h76 v150 a12 12 0 0 1 -12 12 h-52 a12 12 0 0 1 -12 -12 Z", tampa: "M84 22 h32 v40 h-32 Z" },
  redondo: { corpo: "M100 72 a74 74 0 1 1 -0.1 0 Z", tampa: "M82 26 h36 v40 h-36 Z" },
  quadrado: { corpo: "M40 80 h120 v136 h-120 Z", tampa: "M76 30 h48 v42 h-48 Z" },
  baixo: { corpo: "M30 120 Q30 100 50 100 H150 Q170 100 170 120 V210 Q170 230 150 230 H50 Q30 230 30 210 Z", tampa: "M80 46 h40 v46 h-40 Z" },
};
export const frasco = (forma, cor, id) => {
  const f = FRASCO[forma];
  return `<svg class="frasco" viewBox="0 0 200 250" aria-hidden="true"><defs><clipPath id="cl-${id}"><path d="${f.corpo}"/></clipPath></defs>
  <rect class="liquido" clip-path="url(#cl-${id})" x="0" y="40" width="200" height="210" fill="${cor}"/>
  <path class="vidro" d="${f.corpo}"/><path class="tampa" d="${f.tampa}"/><path class="gargalo" d="M92 ${forma === "baixo" ? 92 : forma === "quadrado" ? 72 : 62} h16 v10 h-16 Z"/></svg>`;
};

export const html = () => {
  const D = DADOS;
  return `
<header class="topo"><a class="marca" href="#conteudo">${esc(D.nome)}</a><nav aria-label="Principal"><a href="#pele">Na pele</a><a href="#colecao">Coleção</a><a href="#teste">Teste</a></nav></header>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <div class="hero__frasco">${frasco("alto", "#e29646", "hero")}</div>
  <h1 id="h1" class="hero__t">Um perfume é feito de <em>tempo.</em></h1>
  <p class="hero__l">Role devagar. Cada tela é uma hora a mais na pele.</p>
</section>

${cenaReal(DADOS.cena)}
<section class="pele" id="pele" aria-labelledby="pele-t">
  <div class="pele__palco">
    <canvas class="nevoa" aria-hidden="true"></canvas>
    <p class="relogio" aria-hidden="true"><span class="relogio__h">00:00</span> na pele</p>
    <h2 id="pele-t" class="sr">A jornada do perfume na pele</h2>
    <ol class="fases">${D.fases.map((f, i) => `<li class="fase" data-i="${i}">
      <p class="fase__tempo">${esc(f.tempo)}</p>
      <h3>${esc(f.nome)}</h3>
      <p class="fase__notas">${f.notas.map((n) => `<span>${esc(n)}</span>`).join("")}</p>
      <p class="fase__txt">${esc(f.texto)}</p>
    </li>`).join("")}</ol>
  </div>
</section>

<section class="colecao" id="colecao" aria-labelledby="col-t">
  <h2 id="col-t" class="sec-t" data-split>A coleção</h2>
  <ul class="frascos">${D.colecao.map((p, i) => `<li class="item" data-rev>
    ${p.foto ? `<img class="frasco frasco--foto" src="${esc(p.foto)}" alt="Frasco do perfume ${esc(p.nome)}" loading="lazy">` : frasco(p.forma, p.cor, "c" + i)}
    <p class="item__fam">${esc(p.familia)}</p>
    <h3>${esc(p.nome)}</h3>
    <p class="item__notas">${esc(p.notas)}</p>
    <p class="item__preco">${esc(p.preco)} <span>· ${esc(p.ml)}</span></p>
    <a class="link" href="${wa(`Olá! Quero saber mais sobre o perfume ${p.nome}.`)}" target="_blank" rel="noopener">Pedir uma amostra <span class="sr">de ${esc(p.nome)}</span></a>
  </li>`).join("")}</ul>
</section>

<section class="teste" id="teste" aria-labelledby="teste-t">
  <h2 id="teste-t" class="sec-t" data-split>Qual é a sua nota?</h2>
  <p class="sec-l">Três perguntas, nenhuma resposta errada.</p>
  <form class="quiz" id="quiz">
    ${D.quiz.map((q, i) => `<fieldset><legend><span>${i + 1}</span> ${esc(q.p)}</legend><div class="opcoes">${q.r.map(([t, v]) => `<label><input type="radio" name="q${i}" value="${esc(v)}" required><span>${esc(t)}</span></label>`).join("")}</div></fieldset>`).join("")}
    <button class="btn" type="submit">Ver meu resultado</button>
    <div class="resultado" aria-live="polite"></div>
  </form>
</section>

<footer class="fim">
  <h2 class="fim__t" data-split>Venha sentir de perto.</h2>
  <p>${esc(D.endereco)}<br>${esc(D.horario)}</p>
  <a class="btn" href="${wa("Olá! Quero agendar uma visita para conhecer os perfumes.")}" target="_blank" rel="noopener">Agendar visita pelo WhatsApp</a>
</footer>
</main>`;
};
