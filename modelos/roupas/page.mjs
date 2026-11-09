// ================= CONTEÚDO (troque aqui para cada cliente) =================
export const DADOS = {
  // Cena real: vídeo da coleção (modelo andando, tecido em movimento)
  cena: { video: "midia/cena.mp4", poster: "midia/cena.jpg", credito: "Vídeo: cottonbro studio / Pexels", alt: "Modelo vestindo peças da coleção", dur: 220, passos: [["Tecido natural.", "Linho, algodão e sarja."], ["Costura à vista.", "Acabamento que dura."], ["Feito pra usar.", "Do trabalho ao fim de semana."]] },
  nome: "Avesso",
  whatsapp: "",
  instagram: "https://www.instagram.com/",
  endereco: "Rua Exemplo, 456 · Centro · Jaú, SP",
  horario: "Seg a sex, 9h às 19h · Sáb, 9h às 14h",
  colecao: [
    // tipo: camisa | vestido | calca | jaqueta | saia | regata
    // foto (opcional): "midia/peca-1.png" (de preferência PNG sem fundo). Com foto, o desenho some.
    { nome: "Camisa de linho", preco: "R$ 189", cor: "#d9c7a5", tipo: "camisa" },
    { nome: "Vestido midi", preco: "R$ 249", cor: "#7b2d26", tipo: "vestido" },
    { nome: "Calça alfaiataria", preco: "R$ 219", cor: "#3b3d40", tipo: "calca" },
    { nome: "Jaqueta de sarja", preco: "R$ 299", cor: "#5f6b4a", tipo: "jaqueta" },
    { nome: "Saia plissada", preco: "R$ 179", cor: "#c9a227", tipo: "saia" },
    { nome: "Regata canelada", preco: "R$ 89", cor: "#f4f1ea", tipo: "regata" },
  ],
  provador: {
    cima: [["Linho areia", "#d9c7a5"], ["Branco", "#f4f1ea"], ["Vinho", "#7b2d26"], ["Oliva", "#5f6b4a"]],
    baixo: [["Grafite", "#3b3d40"], ["Mostarda", "#c9a227"], ["Jeans", "#3d5a80"], ["Cru", "#e6dcc8"]],
  },
  // looks: [legenda, foto opcional "midia/look-1.jpg"]
  looks: [["Look 01 · Linho e grafite", ""], ["Look 02 · Vinho de ponta a ponta", ""], ["Look 03 · Oliva no fim de semana", ""]],
};
// ===========================================================================

export const meta = {
  slug: "roupas", rotulo: "Loja de roupas", nome: "Avesso",
  titulo: "Avesso · Roupas que mostram como são feitas",
  descricao: "Nova coleção, provador virtual e atendimento pelo WhatsApp.",
  conceito: "Uma arara de verdade: as peças balançam com a velocidade da rolagem, e o provador combina cores.",
  fundo: "#f1ece3", acento: "#c8231b",
};
export const fonts = [
  ["Bodoni Moda", "@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-wght-normal.woff2", "400 900"],
  ["Bodoni Moda", "@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-wght-italic.woff2", "400 900", "italic"],
  ["Manrope", "@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2", "200 800"],
];

import { cenaReal } from "../real.mjs";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wa = (msg) => `https://wa.me/${DADOS.whatsapp}?text=${encodeURIComponent(msg)}`;

// silhuetas (viewBox 0 0 200 260)
export const PECA = {
  camisa: "M70 20 L100 34 L130 20 L176 44 L162 96 L142 88 L142 236 L58 236 L58 88 L38 96 L24 44 Z",
  regata: "M74 18 Q100 44 126 18 L140 22 L146 70 L146 236 L54 236 L54 70 L60 22 Z",
  jaqueta: "M68 16 L100 40 L132 16 L182 44 L168 150 L146 144 L146 240 L54 240 L54 144 L32 150 L18 44 Z",
  vestido: "M76 16 Q100 36 124 16 L134 20 L138 90 L172 244 L28 244 L62 90 L66 20 Z",
  calca: "M58 16 L142 16 L150 244 L110 244 L100 96 L90 244 L50 244 Z",
  saia: "M64 30 L136 30 L176 226 L24 226 Z",
};
const costuras = {
  camisa: "M100 34 V236", jaqueta: "M100 40 V240", calca: "M58 30 H142", saia: "M64 44 H136", vestido: "M62 90 H138", regata: "M54 70 H146",
};
const peca = (tipo, cor, cls = "") =>
  `<svg class="peca ${cls}" viewBox="0 0 200 260" aria-hidden="true"><path d="${PECA[tipo]}" fill="${cor}"/><path class="cost" d="${PECA[tipo]}"/><path class="cost" d="${costuras[tipo]}"/></svg>`;

export const html = () => {
  const D = DADOS;
  const swatch = (grupo, [n, c], i) =>
    `<label class="sw"><input type="radio" name="${grupo}" value="${c}" data-nome="${esc(n)}" ${i ? "" : "checked"}><span style="--c:${c}"></span><b>${esc(n)}</b></label>`;
  return `
<svg class="costura" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100"><rect x="0.8" y="0.8" width="98.4" height="98.4" pathLength="1"/></svg>
<header class="topo">
  <a class="marca" href="#conteudo">${esc(D.nome)}</a>
  <nav aria-label="Principal"><a href="#arara">Coleção</a><a href="#provador">Provador</a><a href="#etiqueta">Loja</a></nav>
</header>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <p class="hero__k">Coleção outono · 26</p>
  <h1 id="h1" class="hero__t"><span>Vista</span> <em>do</em> <span>avesso.</span></h1>
  <p class="hero__l">Peças que mostram como são feitas: costura aparente, tecido natural, caimento pensado. Role e passe pela arara.</p>
  <div class="tag" aria-hidden="true"><span class="tag__fio"></span><div class="tag__corpo"><b>${esc(D.nome)}</b><span>100% feito com calma</span><span>tam. P · M · G</span></div></div>
</section>

${cenaReal(DADOS.cena)}
<section class="arara" id="arara" aria-labelledby="arara-t">
  <div class="arara__palco">
    <h2 id="arara-t" class="sec-t">A arara <em>de agora</em></h2>
    <div class="arara__cano" aria-hidden="true"></div>
    <ul class="arara__trilho">${D.colecao.map((p) => `<li class="cabide">
      <svg class="gancho" viewBox="0 0 120 60" aria-hidden="true"><path d="M60 4 a8 8 0 1 1 -8 8 M60 20 V26 L8 56 H112 L60 26"/></svg>
      ${p.foto ? `<img class="peca peca--foto" src="${esc(p.foto)}" alt="${esc(p.nome)}" loading="lazy">` : peca(p.tipo, p.cor)}
      <div class="etq"><h3>${esc(p.nome)}</h3><p>${esc(p.preco)}</p><a href="${wa(`Olá! Tenho interesse na peça: ${p.nome} (${p.preco}).`)}" target="_blank" rel="noopener">Reservar <span class="sr">${esc(p.nome)}</span></a></div>
    </li>`).join("")}</ul>
  </div>
</section>

<section class="provador" id="provador" aria-labelledby="prov-t">
  <h2 id="prov-t" class="sec-t" data-split>Provador</h2>
  <p class="sec-l">Combine as cores antes de vir. A gente separa o look para você.</p>
  <div class="prov">
    <div class="prov__espelho" aria-hidden="true">
      ${peca("camisa", D.provador.cima[0][1], "p-cima")}
      <div class="p-baixo">${peca("calca", D.provador.baixo[0][1], "b-calca")}${peca("saia", D.provador.baixo[0][1], "b-saia")}</div>
    </div>
    <form class="prov__ctrl" id="prov-form">
      <fieldset><legend>Parte de cima</legend><div class="sws">${D.provador.cima.map((x, i) => swatch("cima", x, i)).join("")}</div></fieldset>
      <fieldset><legend>Parte de baixo</legend>
        <div class="tipo"><label><input type="radio" name="tipo" value="calca" checked><span>Calça</span></label><label><input type="radio" name="tipo" value="saia"><span>Saia</span></label></div>
        <div class="sws">${D.provador.baixo.map((x, i) => swatch("baixo", x, i)).join("")}</div>
      </fieldset>
      <p class="prov__res" aria-live="polite"></p>
      <a class="btn" id="prov-wa" href="#" target="_blank" rel="noopener">Separar este look</a>
    </form>
  </div>
</section>

<section class="looks" aria-labelledby="looks-t">
  <h2 id="looks-t" class="sec-t" data-split>Lookbook</h2>
  <div class="looks__grade">${D.looks.map(([l, f], i) => `<figure class="look look--${i}"><div class="foto">${f ? `<img src="${esc(f)}" alt="${esc(l)}" loading="lazy">` : `<span>Foto do look ${String(i + 1).padStart(2, "0")}</span>`}</div><figcaption>${esc(l)}</figcaption></figure>`).join("")}</div>
</section>

<footer class="etiqueta" id="etiqueta" aria-labelledby="etq-t">
  <div class="etiqueta__corpo">
    <h2 id="etq-t">${esc(D.nome)}</h2>
    <p class="simbolos" aria-hidden="true"><span>◯</span><span>△</span><span>▢</span><span>⊡</span></p>
    <dl>
      <div><dt>Onde</dt><dd>${esc(D.endereco)}</dd></div>
      <div><dt>Quando</dt><dd>${esc(D.horario)}</dd></div>
      <div><dt>Fale</dt><dd><a href="${wa("Olá! Vim pelo site.")}" target="_blank" rel="noopener">WhatsApp</a> · <a href="${esc(D.instagram)}" target="_blank" rel="noopener">Instagram</a></dd></div>
    </dl>
    <p class="cuidado">Lavar à mão. Secar à sombra. Usar muito.</p>
  </div>
</footer>
</main>`;
};
