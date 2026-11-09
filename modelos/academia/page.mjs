// ================= CONTEÚDO (troque aqui para cada cliente) =================
export const DADOS = {
  // Cena real: vídeo de treino controlado pela rolagem (coloque o arquivo em modelos/academia/midia/)
  cena: { video: "", poster: "", alt: "Aluno fazendo levantamento na academia", dur: 260, passos: [["Pega a barra.", "Aquecimento com o professor do lado."], ["Coloca a carga.", "Progressão planejada, semana a semana."], ["Levanta.", "Técnica antes do peso. Sempre."]] },
  nome: "Ferro",
  whatsapp: "", // só números com DDI, ex.: 5514999999999 (vazio = o visitante escolhe o contato)
  endereco: "Rua Exemplo, 123 · Centro · Jaú, SP",
  horarios: [["Seg a sex", "5h às 23h"], ["Sábado", "8h às 14h"], ["Domingo", "8h às 12h"]],
  modalidades: [
    ["Musculação", "Equipamentos para todos os níveis e professor no salão o dia todo."],
    ["Funcional", "Circuitos curtos com o peso do corpo, em grupo."],
    ["Cross", "Força e condicionamento com levantamentos e ginástica."],
    ["Luta", "Muay thai e boxe, do básico ao sparring."],
    ["Bike", "Aula coletiva de ciclismo indoor, com música."],
    ["Mobilidade", "Alongamento e controle de movimento para treinar melhor."],
  ],
  grade: {
    Seg: [["06:00", "Funcional", "Sala 2"], ["07:00", "Bike", "Sala 1"], ["18:30", "Cross", "Box"], ["20:00", "Muay thai", "Tatame"]],
    Ter: [["06:00", "Cross", "Box"], ["12:00", "Mobilidade", "Sala 2"], ["19:00", "Boxe", "Tatame"]],
    Qua: [["06:00", "Funcional", "Sala 2"], ["07:00", "Bike", "Sala 1"], ["18:30", "Cross", "Box"], ["20:00", "Muay thai", "Tatame"]],
    Qui: [["06:00", "Cross", "Box"], ["12:00", "Mobilidade", "Sala 2"], ["19:00", "Boxe", "Tatame"]],
    Sex: [["06:00", "Funcional", "Sala 2"], ["18:00", "Bike", "Sala 1"], ["19:00", "Cross", "Box"]],
    Sáb: [["09:00", "Cross", "Box"], ["10:30", "Funcional ao ar livre", "Praça"]],
  },
  planos: [
    { nome: "Mensal", preco: "R$ 129", nota: "por mês", itens: ["Musculação livre", "1 aula experimental de cada modalidade"] },
    { nome: "Trimestral", preco: "R$ 109", nota: "por mês, em 3 meses", itens: ["Musculação livre", "Aulas coletivas à vontade", "Avaliação física"] },
    { nome: "Anual", preco: "R$ 89", nota: "por mês, em 12 meses", itens: ["Tudo do trimestral", "Luta incluída", "Leve um amigo 1x por mês"] },
  ],
};
// ===========================================================================

export const meta = {
  slug: "academia", rotulo: "Academia", nome: "Ferro Academia",
  titulo: "Ferro Academia · Treino de verdade em Jaú",
  descricao: "Musculação, funcional, cross, luta e bike. Agende sua aula experimental grátis.",
  conceito: "A rolagem carrega a barra: cada anilha que entra soma peso.",
  fundo: "#0e0e0e", acento: "#ff4d00",
};
export const fonts = [
  ["Anton", "@fontsource/anton/files/anton-latin-400-normal.woff2"],
  ["Archivo", "@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2", "100 900"],
];

import { cenaReal } from "../real.mjs";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wa = (msg) => `https://wa.me/${DADOS.whatsapp}?text=${encodeURIComponent(msg)}`;

// barra: anilhas de 25, 20, 10 e 5 kg (pares)
const ANILHAS = [[25, 200, 26], [20, 176, 24], [10, 132, 20], [5, 96, 16]];
const anilhas = () => {
  let x = 224, out = "";
  ANILHAS.forEach(([kg, h, w], i) => {
    x -= w + 2;
    const y = 110 - h / 2, xr = 1000 - x - w;
    out += `<rect class="an an--e" data-i="${i}" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>`;
    out += `<rect class="an an--d" data-i="${i}" x="${xr}" y="${y}" width="${w}" height="${h}" rx="3"/>`;
  });
  return out;
};

export const html = () => {
  const D = DADOS;
  const dias = Object.keys(D.grade);
  return `
<header class="topo">
  <a class="marca" href="#conteudo">${esc(D.nome.toUpperCase())}</a>
  <nav aria-label="Principal"><a href="#modalidades">Treinos</a><a href="#aulas">Aulas</a><a href="#planos">Planos</a></nav>
  <a class="btn" href="${wa("Olá! Quero agendar uma aula experimental.")}" target="_blank" rel="noopener">Aula grátis</a>
</header>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <div class="hero__palco">
    <h1 id="h1" class="hero__t"><span>Cada rolagem</span> <span>é uma repetição.</span></h1>
    <svg class="barra" viewBox="0 0 1000 220" aria-hidden="true">
      <rect class="ferro" x="20" y="104" width="960" height="12" rx="4"/>
      <rect class="ferro" x="20" y="96" width="210" height="28" rx="4"/>
      <rect class="ferro" x="770" y="96" width="210" height="28" rx="4"/>
      <rect class="trava" x="224" y="84" width="10" height="52" rx="2"/>
      <rect class="trava" x="766" y="84" width="10" height="52" rx="2"/>
      ${anilhas()}
    </svg>
    <p class="carga" aria-hidden="true"><span class="carga__n">20</span><span class="carga__u">kg na barra</span></p>
    <p class="hero__dica" aria-hidden="true">Role para carregar</p>
  </div>
</section>

${cenaReal(DADOS.cena)}
<section class="mods" id="modalidades" aria-labelledby="mods-t">
  <div class="mods__palco">
    <h2 id="mods-t" class="sec-t">Treinos</h2>
    <svg class="anel" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="anel__f"/><circle cx="60" cy="60" r="54" class="anel__p" pathLength="1"/></svg>
    <ol class="mods__lista">${D.modalidades.map(([n, t], i) => `<li data-i="${i}"><span class="rep">${String(i + 1).padStart(2, "0")}</span><h3>${esc(n)}</h3><p>${esc(t)}</p></li>`).join("")}</ol>
  </div>
</section>

<section class="aulas" id="aulas" aria-labelledby="aulas-t">
  <h2 id="aulas-t" class="sec-t" data-split>Grade de aulas</h2>
  <div class="dias" role="tablist" aria-label="Dia da semana">${dias.map((d, i) => `<button role="tab" id="tab-${i}" aria-controls="dia-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${d}</button>`).join("")}</div>
  ${dias.map((d, i) => `<div role="tabpanel" id="dia-${i}" aria-labelledby="tab-${i}" ${i ? "hidden" : ""}><ul class="grade">${D.grade[d].map(([h, a, s]) => `<li><time>${h}</time><b>${esc(a)}</b><span>${esc(s)}</span></li>`).join("")}</ul></div>`).join("")}
</section>

<section class="planos" id="planos" aria-labelledby="planos-t">
  <h2 id="planos-t" class="sec-t" data-split>Escolha sua carga</h2>
  <ol class="fichas">${D.planos.map((p, i) => `<li class="ficha" data-rev>
    <p class="ficha__n">Plano ${String(i + 1).padStart(2, "0")}</p>
    <h3>${esc(p.nome)}</h3>
    <p class="ficha__p"><b>${esc(p.preco)}</b> <span>${esc(p.nota)}</span></p>
    <ul>${p.itens.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <a class="btn btn--linha" href="${wa(`Olá! Quero saber mais sobre o plano ${p.nome}.`)}" target="_blank" rel="noopener">Quero o ${esc(p.nome.toLowerCase())}</a>
  </li>`).join("")}</ol>
</section>

<section class="fim" aria-labelledby="fim-t">
  <div class="faixa" aria-hidden="true"><div class="faixa__trilho">${"SEM DESCULPA · MAIS UMA · ".repeat(6)}</div></div>
  <h2 id="fim-t" class="fim__t" data-split>A primeira aula é por nossa conta.</h2>
  <a class="btn btn--grande" href="${wa("Olá! Quero agendar uma aula experimental.")}" target="_blank" rel="noopener">Agendar pelo WhatsApp</a>
  <div class="info">
    <div><h3>Endereço</h3><p>${esc(D.endereco)}</p></div>
    <div><h3>Horários</h3><dl>${D.horarios.map(([d, h]) => `<div><dt>${esc(d)}</dt><dd>${esc(h)}</dd></div>`).join("")}</dl></div>
  </div>
</section>
</main>`;
};
