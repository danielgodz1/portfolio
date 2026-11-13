// ================= CONTEÚDO (troque aqui para cada cliente) =================
// Tudo que está marcado com "EXEMPLO: substituir" é fictício: nome, cidade, preços, prazos e contatos.
import { PADRAO, CHAPA, plano, totais } from "./pecas.mjs";

export const DADOS = {
  nome: "Veio Marcenaria", // EXEMPLO: substituir
  cidade: "Pinhal Alto, SP", // EXEMPLO: substituir (cidade fictícia)
  whatsapp: "", // só números com DDI, ex.: 5500000000000. Vazio = o WhatsApp abre e o visitante escolhe o contato
  telefone: "(00) 00000-0000", // EXEMPLO: substituir
  email: "orcamento@veiomarcenaria.example", // EXEMPLO: substituir
  endereco: "Rua do Cedro, 450 · Pinhal Alto, SP", // EXEMPLO: substituir
  horario: "Seg a sex, 8h às 17h. Sáb, 8h às 12h", // EXEMPLO: substituir

  hero: {
    titulo: "Móvel bom tem a medida da sua casa.",
    texto: "Cozinhas, closets, painéis e escritórios feitos na nossa oficina e montados na sua casa. Monte um armário aqui, veja cada peça e peça o orçamento já com as medidas.",
    botao: "Montar o meu móvel",
    zap: "Chamar no WhatsApp",
  },

  // preco = reais por m² de chapa (EXEMPLO: substituir pela tabela real). tipo "madeira" tem veio; "laca" é cor lisa.
  acabamentos: [
    { id: "freijo", nome: "Freijó", tipo: "madeira", cor: "#C99A5B", veio: "#8F5F2A", preco: 1150, nota: "Veio suave e dourado. Boa para cozinhas e closets." },
    { id: "carvalho", nome: "Carvalho", tipo: "madeira", cor: "#D2B07A", veio: "#A5803F", preco: 1240, nota: "Claro e marcado. Combina com ambientes amplos." },
    { id: "nogueira", nome: "Nogueira", tipo: "madeira", cor: "#6B4A33", veio: "#37231A", preco: 1390, nota: "Escura e de veio fechado. Boa para escritórios." },
    { id: "tauari", nome: "Tauari", tipo: "madeira", cor: "#E4CFA3", veio: "#C3A56E", preco: 980, nota: "Quase branca, de veio discreto. Deixa o ambiente maior." },
    { id: "cumaru", nome: "Cumaru", tipo: "madeira", cor: "#A9683B", veio: "#6E3C1B", preco: 1320, nota: "Avermelhada e quente. Pede poucos móveis ao redor." },
    { id: "laca-branca", nome: "Laca branca", tipo: "laca", cor: "#F1F2EE", preco: 780, nota: "Lisa e fosca. A escolha para cozinhas pequenas." },
    { id: "azul-ferro", nome: "Azul-ferro", tipo: "laca", cor: "#2F4858", preco: 860, nota: "Laca fosca escura. Funciona em ilhas e bancadas." },
    { id: "grafite-fosco", nome: "Grafite fosco", tipo: "laca", cor: "#2B2F2D", preco: 860, nota: "Laca fosca quase preta. Boa para painéis de TV." },
  ],
  // preco = reais por peça, somado à ferragem de cada porta e gaveta (EXEMPLO: substituir)
  puxadores: [
    { id: "cava", nome: "Cava usinada", preco: 0, nota: "Recorte na própria peça. Nada para prender na roupa." },
    { id: "barra", nome: "Barra de alumínio", preco: 38, nota: "Linha reta, fácil de limpar." },
    { id: "gola", nome: "Perfil gola", preco: 65, nota: "Perfil embutido na borda, sem volume." },
    { id: "toque", nome: "Toque (push)", preco: 28, nota: "Abre ao empurrar. Sem puxador aparente." },
  ],

  movel: {
    titulo: "Monte o seu armário",
    passos: [
      ["Escolha a medida", "Largura, altura e profundidade em centímetros. O armário ao lado muda na hora."],
      ["A oficina abre o móvel", "Cada peça tem nome, medida e espessura. É essa lista que vai para a serra."],
      ["O corte é preciso", "Chapa de 2750 por 1850 mm, encaixada para sobrar pouco. Aqui mora a economia."],
      ["Montamos e ajustamos", "Portas e gavetas entram no esquadro, com folga de 3 milímetros entre elas."],
      ["Agora é a sua vez", "Troque madeira, puxador, portas e gavetas. O preço e a lista de corte acompanham."],
    ],
  },

  // EXEMPLO: substituir pelos ambientes reais do cliente
  ambientes: [
    { id: "cozinha", nome: "Cozinha", texto: "Armários que chegam ao teto, gavetões com corrediça soft close e bancada alinhada ao eletro. Medimos com a geladeira e o fogão já na obra.", itens: ["Gavetões de 60 e 80 cm", "Nicho para forno e micro-ondas", "Lixeira embutida", "Iluminação sob os armários"] },
    { id: "closet", nome: "Closet", texto: "Cada cabideiro na altura de quem usa. Gavetas com divisórias para meias, cintos e relógios, e sapateira que cabe o seu número de pares.", itens: ["Cabideiros duplos e longos", "Gavetas com divisórias", "Sapateira com inclinação", "Espelho com luz embutida"] },
    { id: "escritorio", nome: "Escritório", texto: "Bancada na profundidade certa para o monitor, passagem de cabos escondida e estante que aguenta o peso dos livros sem envergar.", itens: ["Bancada de 60 a 70 cm", "Passagem de cabos", "Estante com prateleira reforçada", "Gaveta com chave"] },
    { id: "painel", nome: "Painel de sala", texto: "Painel com ripado ou liso, rack suspenso e espaço para a caixa de som. Fiação fica por dentro, o aparelho fica à vista só quando você quer.", itens: ["Ripado em madeira ou laca", "Rack suspenso", "Fiação embutida", "Nichos com iluminação"] },
  ],

  processo: [
    ["Visita e medição", "Vamos à sua casa, medimos com laser e conversamos sobre o dia a dia do ambiente."],
    ["Projeto e orçamento", "Você recebe o desenho em 3D, a lista de materiais e o valor. Ajustamos até ficar certo."],
    ["Corte e montagem", "Na oficina, cortamos, furamos e montamos o móvel. Você acompanha as fotos."],
    ["Instalação", "Levamos pronto, instalamos em um a três dias e deixamos tudo limpo."],
  ],

  // EXEMPLO: substituir por respostas reais do cliente
  perguntas: [
    ["Quanto tempo leva?", "Entre 35 e 50 dias úteis, da aprovação do projeto à instalação. Cozinhas completas e closets grandes podem levar um pouco mais."],
    ["Qual a diferença entre MDF e madeira maciça?", "O MDF não empena e aceita acabamentos lisos e com veio. A madeira maciça é mais cara e se movimenta com a umidade. Usamos MDF na estrutura e maciça só onde faz sentido, como tampos e frisos."],
    ["As ferragens têm garantia?", "Sim. Dobradiças e corrediças são de marcas de linha profissional e têm garantia de cinco anos. O móvel inteiro tem garantia de um ano contra defeitos de fabricação e montagem."],
    ["Vocês trabalham com o projeto do meu arquiteto?", "Sim. Recebemos o desenho, conferimos as medidas na obra e devolvemos o projeto executivo para aprovação antes de cortar."],
    ["Como funciona o orçamento?", "O valor do configurador é uma estimativa. O orçamento final sai depois da visita, com medidas reais, ferragens e instalação."],
  ],
};
// ===========================================================================

export const meta = {
  slug: "marcenaria", rotulo: "Marcenaria sob medida", nome: "Veio Marcenaria",
  titulo: "Veio Marcenaria · Móveis sob medida",
  descricao: "Monte seu armário em 3D, veja as peças e peça o orçamento no WhatsApp já com as medidas.",
  conceito: "Um armário 3D que se abre em peças com a rolagem e vira configurador, com lista de corte e preço ao vivo.",
  fundo: "#E5E7E2", acento: "#F2C200",
};
export const fonts = [
  ["Bricolage Grotesque", "@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wdth-normal.woff2", "200 800", "normal", "75% 100%"],
  ["Jost", "@fontsource-variable/jost/files/jost-latin-wght-normal.woff2", "100 900"],
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wa = (msg) => `https://wa.me/${DADOS.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ---------- veio da madeira por filtro SVG (sem foto): ruído esticado no sentido do fio, em duas cores ---------- */
const canal = (hex, i) => (parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255).toFixed(3);
// escala: o ruído é medido em unidades do desenho; 1 para amostras (viewBox 160), ~17 para o plano (viewBox em mm)
const filtroVeio = (id, a, escala = 1) => `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="${(0.012 / escala).toFixed(5)} ${(0.34 / escala).toFixed(5)}" numOctaves="3" seed="${3 + a.nome.length}" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0.4 0.4 0.4 0 0  0.4 0.4 0.4 0 0  0.4 0.4 0.4 0 0  0 0 0 0 1" result="l"/>
    <feComponentTransfer in="l" result="c"><feFuncR type="table" tableValues="${canal(a.veio, 0)} ${canal(a.cor, 0)} ${canal(a.cor, 0)}"/><feFuncG type="table" tableValues="${canal(a.veio, 1)} ${canal(a.cor, 1)} ${canal(a.cor, 1)}"/><feFuncB type="table" tableValues="${canal(a.veio, 2)} ${canal(a.cor, 2)} ${canal(a.cor, 2)}"/></feComponentTransfer>
    <feComposite in="c" in2="SourceGraphic" operator="in"/>
  </filter>`;
const DEFS = () => `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
  ${DADOS.acabamentos.filter((a) => a.tipo === "madeira").map((a) => filtroVeio("v-" + a.id, a) + filtroVeio("vp-" + a.id, a, 17)).join("\n  ")}
</defs></svg>`;
const preenche = (a, plano) => (a.tipo === "madeira" ? `filter="url(#${plano ? "vp-" : "v-"}${a.id})" fill="${a.cor}"` : `fill="${a.cor}"`);

/* ---------- plano de corte do hero: as peças do armário padrão encaixadas numa chapa (em mm) ---------- */
const CODIGO = { lat: "L", topo: "T", base: "B", rod: "R", prat: "P", porta: "D", frente: "F", gl: "g", gt: "t" };
const planoCorte = () => {
  const ac = DADOS.acabamentos.find((a) => a.id === PADRAO.acabamento), W = CHAPA[0] * 10, H = CHAPA[1] * 10;
  const pecas = plano(PADRAO).map((p, i) => {
    const x = Math.round(p.x * 10), y = Math.round(p.y * 10), w = Math.round(p.w * 10), h = Math.round(p.h * 10);
    const grande = w > 1000 && h > 380, medio = w > 230 && h > 90;
    // o filtro do veio troca a cor do traço: o contorno vai num retângulo separado, por cima
    return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" ${preenche(ac, true)}/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="var(--grafite)" stroke-width="6"/>${
      grande ? `<text x="${x + 40}" y="${y + h / 2 - 6}" class="pc__cod">${CODIGO[p.id] || ""}</text><text x="${x + 40}" y="${y + h / 2 + 62}" class="pc__med">${w} x ${h}</text>`
      : medio ? `<text x="${x + w / 2}" y="${y + h / 2 + 22}" text-anchor="middle" class="pc__cod pc__cod--p">${CODIGO[p.id] || ""}</text>` : ""}</g>`;
  }).join("");
  const marcas = Array.from({ length: CHAPA[0] / 5 + 1 }, (_, i) => {
    const cm = i * 5, x = cm * 10, c = cm % 25 === 0 ? 56 : cm % 10 === 0 ? 38 : 22;
    return `<path d="M${x} -170 V${-170 + c}" stroke="var(--grafite)" stroke-width="${cm % 25 === 0 ? 5 : 3}"/>${cm % 25 === 0 ? `<text x="${x + 10}" y="-100" class="pc__num">${cm}</text>` : ""}`;
  }).join("");
  return `<svg class="plano" viewBox="-190 -260 ${W + 280} ${H + 350}" role="img" aria-label="Plano de corte de uma chapa de MDF de 2750 por 1850 milímetros com as peças de um armário encaixadas">
  <rect x="0" y="-170" width="${W}" height="80" fill="var(--fita)"/>${marcas}
  <rect x="0" y="0" width="${W}" height="${H}" fill="var(--bancada)" stroke="var(--grafite)" stroke-width="8"/>${pecas}
  <path d="M-80 0 V${H} M-110 0 H-50 M-110 ${H} H-50" stroke="var(--grafite)" stroke-width="5" fill="none"/><text transform="translate(-122 ${H / 2}) rotate(-90)" text-anchor="middle" class="pc__num">${H} mm</text>
</svg>`;
};

export const html = () => {
  const D = DADOS;
  return `
${DEFS()}
<header class="topo">
  <a class="marca" href="#conteudo">${esc(D.nome)}</a>
  <nav aria-label="Principal"><a href="#movel">Monte o seu</a><a href="#materiais">Materiais</a><a href="#ambientes">Ambientes</a><a href="#contato">Contato</a></nav>
</header>
<aside class="regua" aria-hidden="true"><div class="regua__fita"></div><div class="regua__ponteiro"><span class="regua__valor">0,00 m</span></div></aside>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <div class="hero__texto">
    <h1 id="h1">${esc(D.hero.titulo)}</h1>
    <p class="hero__l">${esc(D.hero.texto)}</p>
    <div class="hero__bts"><a class="btn" href="#movel">${esc(D.hero.botao)}</a><a class="btn btn--vazio" href="${wa("Olá! Vim pelo site e gostaria de pedir um orçamento de móvel sob medida.")}" target="_blank" rel="noopener">${esc(D.hero.zap)}</a></div>
  </div>
  <figure class="hero__plano">${planoCorte()}<figcaption>Primeira de ${totais(PADRAO, D).chapas18} chapas de 2750 x 1850 mm para um armário de ${PADRAO.L} x ${PADRAO.A} x ${PADRAO.P} cm. O plano de corte é a primeira coisa que a serra recebe.</figcaption></figure>
</section>
</main>
<footer class="rodape" id="contato">
  <p><b>${esc(D.nome)}</b>, ${esc(D.cidade)}</p>
</footer>`;
};
