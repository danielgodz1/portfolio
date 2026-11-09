// ================= CONTEÚDO (troque aqui para cada cliente) =================
export const DADOS = {
  // Cena real: vídeo em close (aplicação de cílios, design, esmaltação)
  cena: { video: "", poster: "", alt: "Aplicação de extensão de cílios em close", dur: 240, passos: [["Fio a fio.", "Cada cílio colado um por vez."], ["Com calma.", "Atendimento sem pressa, em sala reservada."], ["Resultado natural.", "No seu formato de olho."]] },
  nome: "Olhar",
  sub: "Studio de beleza",
  whatsapp: "",
  instagram: "https://www.instagram.com/",
  endereco: "Rua Exemplo, 321 · Sala 4 · Jaú, SP",
  horario: "Ter a sáb, 9h às 19h",
  esmaltes: [
    // [nome, cor, cor do texto sobre ela]
    ["Vinho", "#8a2440", "#fff"], ["Nude", "#d9a48f", "#2b1713"], ["Vermelho", "#c8102e", "#fff"],
    ["Chocolate", "#5b3428", "#fff"], ["Lilás", "#a68bc7", "#20152d"], ["Verde-oliva", "#6b7348", "#fff"],
  ],
  servicos: [
    // [grupo, nome, preço em reais, minutos]
    ["Cílios", "Extensão fio a fio", 160, 120], ["Cílios", "Volume brasileiro", 190, 150], ["Cílios", "Manutenção", 90, 60], ["Cílios", "Lash lifting", 120, 60],
    ["Sobrancelhas", "Design com pinça", 45, 30], ["Sobrancelhas", "Design com henna", 60, 45], ["Sobrancelhas", "Brow lamination", 140, 60],
    ["Unhas", "Manicure", 35, 40], ["Unhas", "Pedicure", 40, 45], ["Unhas", "Esmaltação em gel", 70, 60], ["Unhas", "Alongamento em gel", 180, 150],
  ],
};
// ===========================================================================

export const meta = {
  slug: "beleza", rotulo: "Cílios, sobrancelhas e unhas", nome: "Olhar Studio",
  titulo: "Olhar Studio · Cílios, sobrancelhas e unhas",
  descricao: "Extensão de cílios, design de sobrancelhas e unhas. Monte seu horário e agende pelo WhatsApp.",
  conceito: "Um olho se desenha com a rolagem: cílio a cílio, depois o mapeamento e a sobrancelha fio a fio.",
  fundo: "#f7ece6", acento: "#8a2440",
};
export const fonts = [
  ["Gloock", "@fontsource/gloock/files/gloock-latin-400-normal.woff2"],
  ["Outfit", "@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2", "100 900"],
];

import { cenaReal } from "../real.mjs";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const r1 = (n) => Math.round(n * 10) / 10;

/* ---------- desenho do olho (gerado no build) ---------- */
const bez = (t, a, b, c) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t * t * c;
const olho = () => {
  // pálpebra superior: (110,210) (300,80) (490,210)
  let cilios = "";
  for (let i = 0; i < 34; i++) {
    const t = 0.06 + (i / 33) * 0.9;
    const x = bez(t, 110, 300, 490), y = bez(t, 210, 80, 210);
    const dx = 2 * (1 - t) * (300 - 110) + 2 * t * (490 - 300), dy = 2 * (1 - t) * (80 - 210) + 2 * t * (210 - 80);
    const L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L; // normal para fora (para cima)
    const len = 26 + Math.sin(t * Math.PI) * 18 + t * 22;
    const ex = x + nx * len + 10 + t * 26, ey = y + ny * len;
    const cx = x + nx * len * 0.55, cy = y + ny * len * 0.55 - 4;
    cilios += `<path class="cilio" pathLength="1" d="M${r1(x)} ${r1(y)} Q${r1(cx)} ${r1(cy)} ${r1(ex)} ${r1(ey)}"/>`;
  }
  // sobrancelha: linha central (150,96) (370,22) (540,80)
  let fios = "";
  for (let i = 0; i < 70; i++) {
    const t = i / 69;
    const x = bez(t, 150, 370, 540), y = bez(t, 96, 22, 80);
    const larg = (1 - t) * 26 + 6; // mais grossa no início
    const off = (Math.sin(i * 12.9898) * 0.5 + 0.5 - 0.5) * larg;
    const ang = t < 0.6 ? -1.15 + t * 0.9 : -0.6 + (t - 0.6) * 1.6;
    const l = 16 + (1 - t) * 10;
    const sx = x - Math.cos(ang) * l * 0.4, sy = y + off + 6;
    fios += `<path class="fio" pathLength="1" d="M${r1(sx)} ${r1(sy)} l${r1(Math.cos(ang) * l)} ${r1(Math.sin(ang) * l)}"/>`;
  }
  return `<svg class="olho" viewBox="0 0 640 360" role="img" aria-label="Desenho de um olho com cílios e sobrancelha">
    <g class="mapa"><path class="guia" pathLength="1" d="M140 350 L150 0"/><path class="guia" pathLength="1" d="M140 350 L400 0"/><path class="guia" pathLength="1" d="M140 350 L600 40"/>
      <circle class="ponto" cx="150" cy="96" r="6"/><circle class="ponto" cx="378" cy="38" r="6"/><circle class="ponto" cx="540" cy="80" r="6"/></g>
    <path class="sobr-forma" d="M150 116 Q160 84 200 74 Q330 6 540 76 Q545 84 536 86 Q370 34 214 104 Q178 118 150 116 Z"/><g class="sobr">${fios}</g>
    <path class="palp" d="M110 210 Q300 80 490 210 Q300 300 110 210 Z"/>
    <circle class="iris" cx="300" cy="196" r="64"/><circle class="pupila" cx="300" cy="196" r="28"/><circle class="brilho" cx="318" cy="178" r="9"/>
    <path class="dobra" d="M128 176 Q300 46 478 170"/>
    <g class="cilios">${cilios}</g>
  </svg>`;
};

export const html = () => {
  const D = DADOS;
  const grupos = [...new Set(D.servicos.map((s) => s[0]))];
  const dedos = [[3.2, 5.2, 18], [3.6, 5.8, 6], [3.8, 6.2, 0], [3.6, 5.8, 10], [3, 4.6, 32]];
  return `
<header class="topo"><a class="marca" href="#conteudo">${esc(D.nome)}<small>${esc(D.sub)}</small></a><a class="btn" href="#agenda">Agendar</a></header>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <div class="hero__palco">
    <h1 id="h1" class="hero__t">Tudo começa <em>pelo traço.</em></h1>
    <div class="hero__olho">${olho()}</div>
    <ol class="etapas" aria-label="Etapas">
      <li data-i="0"><b>Fio a fio</b><span>Extensão de cílios aplicada um a um, no seu formato de olho.</span></li>
      <li data-i="1"><b>Mapeamento</b><span>Antes de tirar um pelo, medimos onde sua sobrancelha começa, sobe e termina.</span></li>
      <li data-i="2"><b>Design</b><span>Sobrancelha preenchida fio a fio, com henna ou lamination.</span></li>
    </ol>
  </div>
</section>

${cenaReal(DADOS.cena)}
<section class="unhas" id="unhas" aria-labelledby="unhas-t">
  <h2 id="unhas-t" class="sec-t" data-split>Escolha a cor. O site muda junto.</h2>
  <div class="unhas__grade">
    <div class="mao" aria-hidden="true">${dedos.map(([w, h, r], i) => `<div class="dedo" style="--w:${w}rem;--h:${h}rem;--r:${r}deg;--i:${i}"><div class="unha"></div></div>`).join("")}</div>
    <form class="unhas__ctrl">
      <fieldset><legend>Esmalte</legend><div class="esm">${D.esmaltes.map(([n, c, t], i) => `<label><input type="radio" name="esm" value="${c}" data-t="${t}" ${i ? "" : "checked"}><span style="--c:${c}"></span><b>${esc(n)}</b></label>`).join("")}</div></fieldset>
      <fieldset><legend>Formato</legend><div class="fmt">${[["amendoada", "Amendoada"], ["redonda", "Redonda"], ["quadrada", "Quadrada"]].map(([v, n], i) => `<label><input type="radio" name="fmt" value="${v}" ${i ? "" : "checked"}><span>${n}</span></label>`).join("")}</div></fieldset>
    </form>
  </div>
</section>

<section class="agenda" id="agenda" aria-labelledby="ag-t">
  <h2 id="ag-t" class="sec-t" data-split>Monte seu horário</h2>
  <form class="ag" id="ag">
    <div class="ag__lista">${grupos.map((g) => `<fieldset><legend>${esc(g)}</legend>${D.servicos.filter((s) => s[0] === g).map(([, n, p, m]) => `<label class="srv"><input type="checkbox" name="srv" value="${esc(n)}" data-p="${p}" data-m="${m}"><span class="srv__n">${esc(n)}</span><span class="srv__i">${m} min · R$ ${p}</span></label>`).join("")}</fieldset>`).join("")}</div>
    <aside class="ag__resumo" aria-live="polite">
      <p class="ag__k">Seu horário</p>
      <p class="ag__total"><b class="ag__p">R$ 0</b><span class="ag__m">0 min</span></p>
      <label class="ag__dia">Melhor dia <select name="dia"><option>Terça</option><option>Quarta</option><option>Quinta</option><option>Sexta</option><option>Sábado</option></select></label>
      <label class="ag__dia">Período <select name="per"><option>Manhã</option><option>Tarde</option></select></label>
      <p class="ag__erro" hidden>Escolha pelo menos um serviço.</p>
      <button class="btn btn--cheio" type="submit">Enviar pelo WhatsApp</button>
    </aside>
  </form>
</section>

<footer class="fim">
  <p class="fim__marca">${esc(D.nome)}</p>
  <p>${esc(D.endereco)}<br>${esc(D.horario)}</p>
  <p><a href="${esc(D.instagram)}" target="_blank" rel="noopener">Instagram</a></p>
</footer>
</main>`;
};
