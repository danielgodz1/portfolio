// ================= CONTEÚDO (troque aqui para cada cliente) =================
// Tudo que está marcado com "EXEMPLO: substituir" é fictício: nome, cidades, números, depoimentos e contatos.
export const DADOS = {
  nome: "Atelier Praça Verde", // EXEMPLO: substituir
  cidade: "Vale Claro, SP", // EXEMPLO: substituir (cidade fictícia)
  whatsapp: "", // só números com DDI, ex.: 5500000000000. Vazio = o WhatsApp abre e o visitante escolhe o contato
  telefone: "(00) 00000-0000", // EXEMPLO: substituir
  email: "contato@atelierexemplo.example", // EXEMPLO: substituir
  endereco: "Rua das Palmeiras, 123 · sala 4 · Vale Claro, SP", // EXEMPLO: substituir
  horario: "Seg a sex, 9h às 18h", // EXEMPLO: substituir

  hero: {
    titulo: "Projetos que cabem na vida de quem mora",
    texto: "Arquitetura e interiores do primeiro traço à entrega das chaves.",
    botao: "Chamar no WhatsApp",
  },

  // Cena real: casa se construindo com a rolagem. Prompt do vídeo em modelos/arquitetura/FLOW.md.
  // Enquanto midia/cena.mp4 não existir, a seção não aparece (o build confere o arquivo).
  cena: {
    video: "midia/cena.mp4", poster: "midia/cena.jpg", credito: "Vídeo gerado com IA (Google Flow)",
    alt: "Uma casa de dois pisos sendo construída: terreno, planta, estrutura, acabamento e casa pronta",
    dur: 320,
    passos: [
      ["Terreno.", "Um lote vazio e o traçado da casa riscado no chão."],
      ["Planta.", "O desenho vira fundação: do papel ao concreto."],
      ["Estrutura.", "Pilares, lajes e telhado tomam forma."],
      ["Acabamento.", "Esquadrias, madeira e paisagismo entram."],
      ["Entrega.", "A casa pronta, na luz da tarde."],
    ],
  },

  maquete: {
    titulo: "Gire a casa. Corte a casa.",
    texto: "A mesma maquete vira fachada, corte e planta. Arraste para girar.",
    modos: [
      ["fachada", "Fachada", "Volumes, esquadrias e telhado como a rua vê."],
      ["corte", "Corte", "A casa aberta ao meio: pisos, escada e ambientes."],
      ["planta", "Planta", "O térreo visto de cima, com paredes e mobiliário."],
    ],
    descricao: "Maquete 3D de um sobrado com varanda e telhado de duas águas. Use as setas do teclado para girar.",
  },

  // EXEMPLO: substituir por projetos reais. tipo: terrea | sobrado | comercial | apto. foto: "midia/projeto-N.jpg" (opcional; sem foto aparece o desenho)
  projetos: [
    { tipo: "terrea", nome: "Casa do Ipê", area: "148 m²", cidade: "Vale Claro, SP", frase: "Um piso só, com jardim para todos os cômodos.", foto: "midia/projeto-1.jpg" },
    { tipo: "sobrado", nome: "Sobrado Cedro", area: "236 m²", cidade: "Serra Dourada, SP", frase: "Suítes no alto, vida social no térreo.", foto: "midia/projeto-2.jpg" },
    { tipo: "comercial", nome: "Café da Esquina", area: "92 m²", cidade: "Porto Nascente, SP", frase: "De depósito a café, sem perder o tijolo aparente.", foto: "midia/projeto-3.jpg" },
    { tipo: "apto", nome: "Apê Jacarandá", area: "74 m²", cidade: "Campo Real, SP", frase: "Paredes que sumiram e luz que entrou.", foto: "midia/projeto-4.jpg" },
  ],

  processo: {
    titulo: "Do risco à obra",
    etapas: [
      ["Briefing", "Conversa sobre rotina, orçamento e sonhos. É aqui que o projeto ganha endereço."],
      ["Estudo preliminar", "Primeiros desenhos, volumes e implantação no terreno."],
      ["Projeto legal", "Documentos e plantas para a aprovação na prefeitura."],
      ["Projeto executivo", "Detalhes de obra, marcenaria, elétrica e hidráulica, prontos para construir."],
      ["Acompanhamento de obra", "Visitas ao canteiro para a casa sair como foi desenhada."],
    ],
  },

  // Antes e depois: sem imagens, o modelo mostra duas ilustrações geradas por código. EXEMPLO: substituir pelas fotos reais do cliente
  antesDepois: {
    antes: "midia/antes.jpg", depois: "midia/depois.jpg", // imagens geradas com IA (Google Flow); troque pelas fotos reais do cliente
    alt: "Sala de estar antes e depois da reforma: de concreto aparente e fios soltos a um ambiente com piso de madeira, sofá e parede terracota",
  },

  // EXEMPLO: substituir pelos números reais do escritório
  numeros: [
    [12, "anos de atuação"],
    [180, "projetos entregues"],
    [9, "cidades atendidas"],
  ],

  // EXEMPLO: substituir por depoimentos reais, com autorização de quem os deu
  depoimentos: [
    ["Mostraram a casa em 3D antes de levantar a primeira parede. Foi como morar nela duas vezes.", "Marina e Caio", "Casa do Ipê"],
    ["O projeto coube no orçamento e a obra saiu no prazo combinado. Ninguém acreditava.", "Renato A.", "Café da Esquina"],
    ["Eles ouviram a rotina da família antes de desenhar. A cozinha virou o coração da casa.", "Helena M.", "Sobrado Cedro"],
  ],
};
// ===========================================================================

export const meta = {
  slug: "arquitetura", rotulo: "Arquitetura e interiores", nome: "Atelier Praça Verde",
  titulo: "Atelier Praça Verde · Arquitetura e interiores",
  descricao: "Projetos de casas, reformas e interiores. Veja a maquete em 3D e peça um orçamento pelo WhatsApp.",
  conceito: "A casa se constrói na rolagem: do terreno à entrega, mais uma maquete 3D que vira fachada, corte e planta.",
  fundo: "#f4f1ea", acento: "#a8472a",
};
export const fonts = [
  // sans condensada com eixo de largura (wdth 62 a 125) e serifada só para citações
  ["Archivo", "@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2", "100 900", "normal", "62% 125%"],
  ["Instrument Serif", "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2", "400", "italic"],
];

import { cenaReal } from "../real.mjs";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wa = (msg) => `https://wa.me/${DADOS.whatsapp}?text=${encodeURIComponent(msg)}`;
// só roda no build (Node): sem o arquivo do vídeo em midia/, a cena fica de fora
const existe = (rel) => { try { return process.getBuiltinModule("node:fs").existsSync("modelos/arquitetura/" + rel); } catch { return true; } };

/* ---------- filtro de lápis (traço com leve tremor), compartilhado por todos os desenhos ---------- */
const LAPIS = `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
  <filter id="lapis" filterUnits="userSpaceOnUse" x="-30" y="-30" width="900" height="640">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="lapis-v" filterUnits="userSpaceOnUse" x="-10" y="-10" width="44" height="1020">
    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <pattern id="grade" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-width="1"/></pattern>
</defs></svg>`;

/* ---------- planta do hero: o térreo da casa da maquete, gerado em metros (1 m = 44 px) ---------- */
const U = 44, X = (m) => +(56 + (m + 6) * U).toFixed(1), Z = (m) => +(70 + (m + 4.5) * U).toFixed(1);
const L = (pts) => pts.map(([x, z], i) => `${i ? "L" : "M"}${X(x)} ${Z(z)}`).join(" ");
const RET = (x0, z0, x1, z1) => L([[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) + " Z";
const tr = (cls, sw, d) => `<path class="tr ${cls}" pathLength="1" stroke-width="${sw}" d="${d}"/>`;
const circ = (x, z, r) => `M${(X(x) - r).toFixed(1)} ${Z(z)} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
const rot = (x, z, t, tam = 20) => `<text class="rot" x="${X(x)}" y="${Z(z)}" text-anchor="middle" font-size="${tam}">${t}</text>`;

const planta = () => {
  const degraus = Array.from({ length: 16 }, (_, i) => { const x = 1.6 + (i + 1) * (4.4 / 17); return `M${X(x)} ${Z(-4.3)} V${Z(-3.4)}`; }).join(" ");
  const cadeiras = [-3.5, -2.9, -2.3].flatMap((x) => [RET(x - 0.18, -1.02, x + 0.18, -0.68), RET(x - 0.18, 0.68, x + 0.18, 1.02)]).join(" ");
  return `<svg class="planta" viewBox="-20 0 660 500" role="img" aria-label="Planta de uma casa com sala, cozinha integrada, escada, lavabo e varanda, desenhada a lápis">
  <rect x="-20" width="660" height="500" fill="url(#grade)"/>
  <path class="rot" fill="var(--terracota)" fill-opacity=".09" stroke="none" d="${RET(-6, 1, 2, 4.5)}"/>
  <g filter="url(#lapis)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    ${tr("w", 7, L([[-6, -4.5], [-4.5, -4.5]]))}${tr("w", 7, L([[-3, -4.5], [6, -4.5], [6, 0.5]]))}
    ${tr("w", 7, L([[-6, -4.5], [-6, 0.5]]))}${tr("w", 7, L([[-6, 2.5], [-6, 4.5], [-5, 4.5]]))}
    ${tr("w", 7, L([[-2, 4.5], [0.2, 4.5]]))}${tr("w", 7, L([[1.2, 4.5], [2, 4.5]]))}
    ${tr("p", 5, L([[2, 0.5], [3.2, 0.5]]))}${tr("p", 5, L([[5, 0.5], [6, 0.5]]))}
    ${tr("p", 5, L([[4.4, -3.4], [4.4, -1.2], [4.7, -1.2]]))}${tr("p", 5, L([[5.5, -1.2], [6, -1.2]]))}
    ${tr("j", 1.6, L([[-4.5, -4.56], [-3, -4.56]]) + " " + L([[-4.5, -4.44], [-3, -4.44]]))}
    ${tr("j", 1.6, L([[-6.06, 0.5], [-6.06, 2.5]]) + " " + L([[-5.94, 0.5], [-5.94, 2.5]]))}
    ${tr("j", 1.6, L([[-5, 4.44], [-2, 4.44]]) + " " + L([[-5, 4.56], [-2, 4.56]]))}
    ${tr("j", 1.6, L([[3.2, 0.44], [4.1, 0.44]]) + " " + L([[4.1, 0.56], [5, 0.56]]))}
    ${tr("j acento", 2, L([[0.2, 4.5], [0.2, 3.5]]) + ` M${X(1.2)} ${Z(4.5)} A${U} ${U} 0 0 0 ${X(0.2)} ${Z(3.5)}`)}
    ${tr("j", 1.6, L([[4.7, -1.2], [4.7, -2]]) + ` M${X(5.5)} ${Z(-1.2)} A${U * 0.8} ${U * 0.8} 0 0 0 ${X(4.7)} ${Z(-2)}`)}
    ${tr("p", 2.4, RET(1.6, -4.3, 6, -3.4) + " " + degraus)}
    ${tr("m", 2.2, RET(2.05, 4.2, 2.35, 4.5) + " " + RET(5.65, 4.2, 5.95, 4.5))}
    ${tr("m", 2.2, L([[-5.9, -4.4], [-2.5, -4.4], [-2.5, -3.8], [-5.3, -3.8], [-5.3, -1.8], [-5.9, -1.8]]) + " Z " + RET(-4.4, -4.3, -3.6, -3.9) + " " + circ(-3.1, -4.1, 6) + " " + circ(-2.8, -4.1, 6))}
    ${tr("m", 2.2, RET(-4.6, -2.6, -2.6, -1.8))}
    ${tr("m", 2.2, RET(-3.9, -0.6, -1.9, 0.6) + " " + cadeiras)}
    ${tr("m", 2.2, RET(-5.4, 2.7, -2.6, 3.6) + " " + RET(-4.7, 1.5, -3.5, 2.2))}
    ${tr("m", 2.2, RET(4.9, -3.1, 5.9, -2.6) + " " + circ(5.4, -1.75, 9))}
    ${tr("c", 1.4, L([[-6, -5.35], [6, -5.35]]) + ` M${X(-6)} ${Z(-5.15)} V${Z(-5.55)} M${X(6)} ${Z(-5.15)} V${Z(-5.55)}`)}
    ${tr("c", 1.4, L([[-6.85, -4.5], [-6.85, 4.5]]) + ` M${X(-6.65)} ${Z(-4.5)} H${X(-7.05)} M${X(-6.65)} ${Z(4.5)} H${X(-7.05)}`)}
  </g>
  <path class="rot tracejado" d="${RET(2, 0.5, 6, 4.5)}"/>
  ${rot(0, -5.62, "12,00 m", 18)}
  <text class="rot" transform="translate(${X(-7.2)} ${Z(0)}) rotate(-90)" text-anchor="middle" font-size="18">9,00 m</text>
  ${rot(-3.4, -3.15, "cozinha")}${rot(-5.0, 0.1, "jantar", 17)}${rot(-1.2, 3.4, "sala")}${rot(4, 3.1, "varanda")}${rot(5.2, -2.1, "lavabo", 14)}
</svg>`;
};

/* ---------- desenhos dos projetos (elevações a lápis; use "foto" para trocar por imagem real) ---------- */
const arte = {
  terrea: `<path d="M20 250 H380"/><path d="M60 250 V160 H340 V250"/><path d="M44 160 H356 V146 H44 Z"/><path d="M84 186 H206 V228 H84 Z M145 186 V228"/><path d="M300 200 H330 V228 H300 Z"/><path class="ac" d="M244 250 V178 H280 V250"/><path d="M368 250 V216 M350 216 a18 22 0 1 0 36 0 a18 22 0 1 0 -36 0"/>`,
  sobrado: `<path d="M20 250 H380"/><path d="M70 250 V176 H300 V250"/><path d="M96 176 V92 H344 V176"/><path d="M338 176 V250"/><path d="M84 92 H356 V78 H84 Z"/><path d="M120 112 H200 V152 H120 Z M236 112 H320 V152 H236 Z"/><path d="M92 198 H170 V232 H92 Z"/><path class="ac" d="M206 250 V196 H240 V250"/>`,
  comercial: `<path d="M20 250 H380"/><path d="M50 250 V64 H350 V250"/><path d="M42 64 H358"/><path d="M92 84 H210 V108 H92 Z"/><path d="M72 150 H232 V240 H72 Z M112 150 V240 M152 150 V240 M192 150 V240"/><path class="ac" d="M62 124 H242 L250 150 H54 Z M98 124 L94 150 M134 124 L134 150 M170 124 L174 150 M206 124 L214 150"/><path d="M262 250 V152 H316 V250 M289 152 V250"/><path d="M262 90 H316 V126 H262 Z"/>`,
  apto: `<path d="M20 250 H380"/><path d="M110 250 V28 H290 V250"/>${Array.from({ length: 18 }, (_, i) => { const r = Math.floor(i / 3), c = i % 3; return `<path${r === 2 && c === 1 ? ' class="ac"' : ""} d="M${126 + c * 52} ${44 + r * 34} h38 v22 h-38 Z"/>`; }).join("")}<path d="M184 250 V226 H216 V250"/>`,
};
const desenho = (tipo) => `<svg viewBox="0 0 400 300" aria-hidden="true"><g filter="url(#lapis)" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${arte[tipo]}</g></svg>`;

/* ---------- mapa estático (ilustrativo) ---------- */
const fonteMapa = `font-size="15" fill="var(--grafite-suave)" text-anchor="middle" font-weight="500" font-family="var(--sans)"`;
const mapa = () => `<svg class="mapa" viewBox="0 0 480 360" role="img" aria-label="Mapa ilustrativo: o escritório fica na Rua das Palmeiras, ao lado da praça">
  <rect width="480" height="360" fill="var(--papel)"/>
  ${[[14, 14, 120, 90], [148, 14, 150, 90], [312, 14, 154, 90], [14, 118, 120, 100], [312, 118, 154, 100], [14, 232, 120, 114], [148, 232, 150, 114], [312, 232, 154, 114]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--concreto)"/>`).join("")}
  <rect x="148" y="118" width="150" height="100" fill="var(--papel-2)" stroke="var(--grafite)" stroke-width="1.5" stroke-dasharray="5 4"/>
  ${[[185, 150], [225, 175], [265, 150], [190, 195], [262, 198]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="var(--grafite)" stroke-width="1.6"/>`).join("")}
  <path d="M0 330 L480 30" stroke="var(--papel)" stroke-width="12" fill="none"/>
  <path d="M0 330 L480 30" stroke="var(--concreto-2)" stroke-width="1.5" fill="none" stroke-dasharray="8 6"/>
  <g class="pino"><path d="M398 172 c-16 -20 -26 -32 -26 -46 a26 26 0 1 1 52 0 c0 14 -10 26 -26 46 Z" fill="var(--terracota)"/><circle cx="398" cy="126" r="9" fill="var(--papel)"/></g>
  <text x="74" y="111" ${fonteMapa}>Rua das Palmeiras</text>
  <text x="223" y="146" ${fonteMapa}>Praça Verde</text>
</svg>`;

/* ---------- antes e depois: duas ilustrações do mesmo cômodo (a janela fica no mesmo lugar nas duas) ---------- */
const comodo = (parede, lateralE, lateralD, teto, piso) => `<path d="M0 0 L100 60 V360 L0 500 Z" fill="${lateralE}"/><path d="M800 0 L700 60 V360 L800 500 Z" fill="${lateralD}"/>
  <rect x="100" y="60" width="600" height="300" fill="${parede}"/><path d="M0 0 H800 L700 60 H100 Z" fill="${teto}"/><path d="M0 500 L100 360 H700 L800 500 Z" fill="${piso}"/>`;
const JANELA = `<path d="M460 110 H620 V270 H460 Z M540 110 V270 M460 190 H620"/>`;
const ARESTAS = `<path d="M0 0 L100 60 M800 0 L700 60 M0 500 L100 360 M800 500 L700 360 M100 60 H700 V360 H100 Z"/>`;
const cenaAntes = () => `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  ${comodo("var(--concreto)", "var(--concreto-2)", "var(--concreto-2)", "var(--concreto)", "var(--concreto-2)")}
  <rect x="470" y="120" width="140" height="140" fill="var(--papel)"/>
  <g filter="url(#lapis)" fill="none" stroke="var(--grafite)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    ${ARESTAS}${JANELA}
    <path d="M230 62 l14 46 -12 34 16 40 -8 36"/><path d="M560 300 l20 -30 18 24"/>
    <path d="M300 60 q-14 46 8 78 t-6 62"/><path d="M293 200 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0"/>
    <path d="M150 300 H230 V350 H150 Z" stroke-dasharray="6 5"/>
    <path d="M520 430 h70 l-8 50 h-54 Z M518 430 a37 9 0 1 0 74 0"/>
    <path d="M170 470 l90 -18 M200 482 l70 -14"/>
  </g>
</svg>`;
const cenaDepois = () => `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  ${comodo("var(--papel)", "var(--papel-2)", "var(--papel-2)", "var(--papel)", "var(--papel-2)")}
  <rect x="100" y="60" width="230" height="300" fill="var(--terracota)"/>
  <path d="M250 430 L560 430 L610 485 L200 485 Z" fill="var(--concreto-2)"/>
  <rect x="470" y="120" width="140" height="140" fill="var(--concreto)"/>
  <path d="M440 100 H474 V280 H440 Z M610 100 H644 V280 H610 Z" fill="var(--papel)"/>
  <rect x="225" y="300" width="350" height="62" fill="var(--grafite)"/><rect x="235" y="262" width="330" height="44" fill="var(--grafite-suave)"/>
  <circle cx="660" cy="318" r="34" fill="var(--grafite-suave)"/><rect x="654" y="340" width="12" height="40" fill="var(--grafite)"/>
  <g filter="url(#lapis)" fill="none" stroke="var(--grafite)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    ${ARESTAS}${JANELA}
    ${Array.from({ length: 7 }, (_, i) => `<path stroke-opacity=".35" d="M${100 + i * 100} 360 L${(i * 133.3).toFixed(0)} 500"/>`).join("")}
    <path d="M400 60 V150 M366 150 H434 a34 34 0 0 0 -68 0"/>
    <path d="M150 140 H260 V230 H150 Z M162 152 H248 V218 H162 Z"/>
    <path d="M225 300 H575 M300 262 V300 M400 262 V300 M500 262 V300"/>
  </g>
</svg>`;
const parteAD = (src, alt, svg) => (src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : svg);

const ICONE_CHAT =`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5Z"/><path d="M8.5 9.5c.4 2.6 2.4 4.6 5 5l1.2-1.3-1.8-1-.9.6c-.9-.4-1.6-1.1-2-2l.6-.9-1-1.8Z"/></svg>`;

export const html = () => {
  const D = DADOS;
  const cena = existe(D.cena.video) ? D.cena : { ...D.cena, video: "" };
  // crédito de IA: só aparece para o que realmente está na página
  const temFotos = D.projetos.some((p) => p.foto) || D.antesDepois.antes;
  const credito = cena.video && temFotos ? "Vídeo e imagens gerados com IA (Google Flow)" : cena.video ? D.cena.credito : temFotos ? "Imagens geradas com IA (Google Flow)" : "";
  return `
${LAPIS}
<header class="topo">
  <a class="marca" href="#conteudo">${esc(D.nome)}</a>
  <nav aria-label="Principal"><a href="#projetos">Projetos</a><a href="#processo">Processo</a><a href="#contato">Contato</a></nav>
</header>
<div class="prog-topo" aria-hidden="true"></div>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <div class="hero__texto">
    <h1 id="h1" data-split data-split-hero>${esc(D.hero.titulo)}</h1>
    <p class="hero__l">${esc(D.hero.texto)}</p>
    <a class="btn" href="${wa("Olá! Vim pelo site e gostaria de conversar sobre um projeto.")}" target="_blank" rel="noopener">${esc(D.hero.botao)}</a>
  </div>
  ${planta()}
</section>

${cenaReal(cena)}

<section class="secao maq" id="maquete" aria-labelledby="maq-t">
  <h2 id="maq-t" class="sec-t" data-split>${esc(D.maquete.titulo)}</h2>
  <p class="sec-l">${esc(D.maquete.texto)}</p>
  <div class="maq__palco" tabindex="0" role="group" aria-label="${esc(D.maquete.descricao)}">
    <canvas aria-hidden="true"></canvas>
    <p class="maq__dica" aria-hidden="true">Arraste para girar; setas ajustam ângulo</p>
    <div class="maq__falha" hidden>
      <svg class="maq__elev" viewBox="0 0 360 190" role="img" aria-label="Corte esquemático em dois pavimentos">
        <rect x="30" y="96" width="300" height="68" fill="none" stroke="var(--grafite)" stroke-width="2.5"/>
        <rect x="30" y="34" width="300" height="62" fill="none" stroke="var(--grafite)" stroke-width="2.5"/>
        <path d="M22 34 L338 34 M30 96 L330 96" stroke="var(--grafite)" stroke-width="5"/>
        <line x1="165" y1="34" x2="165" y2="96" stroke="var(--grafite)" stroke-width="2"/>
        <path d="M120 164 L165 96" stroke="var(--terracota)" stroke-width="2.2" stroke-dasharray="4 3"/>
        <rect x="65" y="114" width="42" height="50" fill="none" stroke="var(--terracota)" stroke-width="2"/>
        <rect x="210" y="50" width="76" height="30" fill="none" stroke="var(--terracota)" stroke-width="2"/>
      </svg>
      <p>Seu navegador não abriu a maquete 3D. O corte esquemático, a planta e os desenhos abaixo mostram a mesma casa.</p>
    </div>
  </div>
  <div class="maq__ctrl" role="group" aria-label="Vista da maquete">${D.maquete.modos.map(([id, nome, leg], i) => `<button type="button" data-modo="${id}" data-leg="${esc(leg)}" aria-pressed="${i === 0}">${esc(nome)}</button>`).join("")}<button type="button" id="maq-reset" hidden>Resetar vista</button></div>
  <p class="maq__leg" aria-live="polite">${esc(D.maquete.modos[0][2])}</p>
</section>

<section class="secao" id="projetos" aria-labelledby="proj-t">
  <h2 id="proj-t" class="sec-t" data-split>Projetos</h2>
  <p class="sec-l">Casas, reformas e interiores. Cada um começou com uma conversa e um traço de lápis.</p>
  <ul class="proj__lista">${D.projetos.map((p) => `<li><article class="proj">
    <div class="proj__arte">${p.foto ? `<img src="${esc(p.foto)}" alt="${esc(p.nome)}, ${esc(p.area)}" loading="lazy">` : desenho(p.tipo)}</div>
    <h3>${esc(p.nome)}</h3>
    <p class="proj__meta">${esc(p.area)} · ${esc(p.cidade)}</p>
    <p>${esc(p.frase)}</p>
  </article></li>`).join("")}</ul>
</section>

<section class="secao proc" id="processo" aria-labelledby="proc-t">
  <h2 id="proc-t" class="sec-t" data-split>${esc(D.processo.titulo)}</h2>
  <div class="proc__corpo">
    <svg class="proc__fio" viewBox="0 0 24 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false"><g filter="url(#lapis-v)"><path pathLength="1" d="M12 0 C9 150 15 300 12 450 S9 750 12 1000" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"/></g></svg>
    <ol class="proc__lista">${D.processo.etapas.map(([t, x], i) => `<li class="etapa" data-rev>
      <div class="etapa__marco" aria-hidden="true"><span class="etapa__ponto"></span></div>
      <div><span class="etapa__n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><h3>${esc(t)}</h3><p>${esc(x)}</p></div>
    </li>`).join("")}</ol>
  </div>
</section>

<section class="secao ad" aria-labelledby="ad-t">
  <h2 id="ad-t" class="sec-t" data-split>Antes e depois</h2>
  <p class="sec-l">Arraste para ver o mesmo cômodo antes e depois do projeto.</p>
  <figure class="ad__fig" aria-label="${esc(D.antesDepois.alt)}">
    <div class="ad__img">${parteAD(D.antesDepois.antes, "Antes da reforma", cenaAntes())}</div>
    <div class="ad__img ad__depois">${parteAD(D.antesDepois.depois, "Depois da reforma", cenaDepois())}</div>
    <span class="ad__rot ad__rot--a" aria-hidden="true">Antes</span><span class="ad__rot ad__rot--d" aria-hidden="true">Depois</span>
    <input class="ad__range" type="range" min="0" max="100" step="1" value="50" aria-label="Comparar antes e depois">
    <div class="ad__alca" aria-hidden="true"><span class="ad__bola"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/></svg></span></div>
  </figure>
  <p class="nota">${D.antesDepois.antes ? "Imagens geradas com IA (Google Flow)." : "Ilustração de exemplo."} Troque pelas fotos reais do cliente em <code>antesDepois</code>.</p>
</section>

<section class="secao numeros escuro" aria-labelledby="num-t">
  <h2 id="num-t" class="sec-t" data-split>Em números</h2>
  <dl>${D.numeros.map(([n, r]) => `<div class="num"><dt class="num__r">${esc(r)}</dt><dd class="num__v" data-conta="${n}">${n}</dd></div>`).join("")}</dl>
  <p class="nota">Números de exemplo, para o cliente trocar pelos reais.</p>
</section>

<section class="secao depo" aria-labelledby="dp-t">
  <h2 id="dp-t" class="sec-t" data-split>Quem mora, conta</h2>
  <div class="depo__lista">${D.depoimentos.map(([t, n, p]) => `<figure data-rev><blockquote><p>${esc(t)}</p></blockquote><figcaption>${esc(n)}<span>${esc(p)}</span></figcaption></figure>`).join("")}</div>
  <p class="nota">Depoimentos de exemplo, para trocar por reais (com autorização de quem os deu).</p>
</section>

<section class="secao contato escuro" id="contato" aria-labelledby="ct-t">
  <div>
    <h2 id="ct-t" class="sec-t" data-split>Vamos conversar sobre a sua casa?</h2>
    <dl class="contato__dados">
      <div><dt>WhatsApp</dt><dd><a href="${wa("Olá! Vim pelo site.")}" target="_blank" rel="noopener">${esc(D.telefone)}</a></dd></div>
      <div><dt>E-mail</dt><dd><a href="mailto:${esc(D.email)}">${esc(D.email)}</a></dd></div>
      <div><dt>Endereço</dt><dd>${esc(D.endereco)}</dd></div>
      <div><dt>Horário</dt><dd>${esc(D.horario)}</dd></div>
    </dl>
    <a class="btn" href="${wa("Olá! Quero agendar uma conversa sobre um projeto.")}" target="_blank" rel="noopener">${esc(D.hero.botao)}</a>
  </div>
  <figure class="mapa__fig">${mapa()}<figcaption>Mapa ilustrativo (exemplo).</figcaption></figure>
</section>
</main>
<footer class="rodape escuro">
  <p><b>${esc(D.nome)}</b> · ${esc(D.cidade)}</p>
  <nav aria-label="Rodapé"><a href="#projetos">Projetos</a><a href="#processo">Processo</a><a href="#contato">Contato</a></nav>
  ${credito ? `<p class="rodape__cred">${esc(credito)}</p>` : ""}
</footer>
<a class="wa-flut" href="${wa("Olá! Vim pelo site.")}" target="_blank" rel="noopener" aria-label="Chamar no WhatsApp">${ICONE_CHAT}</a>`;
};
