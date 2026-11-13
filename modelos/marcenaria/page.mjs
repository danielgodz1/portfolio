// ================= CONTEÚDO (troque aqui para cada cliente) =================
// Tudo que está marcado com "EXEMPLO: substituir" é fictício: nome, cidade, preços, prazos e contatos.
import { PADRAO, PRESETS, CHAPA, LIMITES, plano, totais } from "./pecas.mjs";
import { linhasTabela, resumo, mensagem } from "./tabela.mjs";

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

  // Foto de detalhe, na seção de materiais (imagem gerada com IA; troque pela foto de uma peça do cliente)
  detalhe: { foto: "midia/detalhe.jpg", alt: "Encaixe em rabo de andorinha numa gaveta de nogueira, aberta pela metade", legenda: "O rabo de andorinha segura a gaveta sem um prego. Cada encaixe é cortado e conferido à mão." },

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
    { id: "cozinha", foto: "midia/cozinha.jpg", alt: "Cozinha com armários planejados em freijó, bancada escura e fita de LED sob os armários", nome: "Cozinha", texto: "Armários que chegam ao teto, gavetões com corrediça soft close e bancada alinhada ao eletro. Medimos com a geladeira e o fogão já na obra.", itens: ["Gavetões de 60 e 80 cm", "Nicho para forno e micro-ondas", "Lixeira embutida", "Iluminação sob os armários"] },
    { id: "closet", foto: "midia/closet.jpg", alt: "Closet com armários em carvalho, cabideiros, gavetas com divisórias e sapateira iluminada", nome: "Closet", texto: "Cada cabideiro na altura de quem usa. Gavetas com divisórias para meias, cintos e relógios, e sapateira que cabe o seu número de pares.", itens: ["Cabideiros duplos e longos", "Gavetas com divisórias", "Sapateira com inclinação", "Espelho com luz embutida"] },
    { id: "escritorio", foto: "midia/escritorio.jpg", alt: "Escritório com bancada e estante embutidas em nogueira, ao lado de uma janela", nome: "Escritório", texto: "Bancada na profundidade certa para o monitor, passagem de cabos escondida e estante que aguenta o peso dos livros sem envergar.", itens: ["Bancada de 60 a 70 cm", "Passagem de cabos", "Estante com prateleira reforçada", "Gaveta com chave"] },
    { id: "painel", foto: "midia/painel.jpg", alt: "Painel de sala com ripado em freijó, rack suspenso grafite e nichos com iluminação", nome: "Painel de sala", texto: "Painel com ripado ou liso, rack suspenso e espaço para a caixa de som. Fiação fica por dentro, o aparelho fica à vista só quando você quer.", itens: ["Ripado em madeira ou laca", "Rack suspenso", "Fiação embutida", "Nichos com iluminação"] },
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
  ${DADOS.acabamentos.filter((a) => a.tipo === "madeira").map((a) => filtroVeio("v-" + a.id, a) + filtroVeio("vp-" + a.id, a, 17) + filtroVeio("va-" + a.id, a, 3)).join("\n  ")}
</defs></svg>`;
const preenche = (a, plano) => (a.tipo === "madeira" ? `filter="url(#${plano === "amb" ? "va-" : plano ? "vp-" : "v-"}${a.id})" fill="${a.cor}"` : `fill="${a.cor}"`);

/* ---------- plano de corte do hero: as peças do armário padrão encaixadas numa chapa (em mm) ---------- */
const CODIGO = { lat: "L", topo: "T", base: "B", rod: "R", prat: "P", porta: "D", frente: "F", gl: "g", gt: "t" };
const planoCorte = () => {
  const ac = DADOS.acabamentos.find((a) => a.id === PADRAO.acabamento), W = CHAPA[0] * 10, H = CHAPA[1] * 10;
  const pecas = plano(PADRAO).map((p, i) => {
    const x = Math.round(p.x * 10), y = Math.round(p.y * 10), w = Math.round(p.w * 10), h = Math.round(p.h * 10);
    const grande = w > 1000 && h > 380, medio = w > 230 && h > 90;
    // o filtro do veio troca a cor do traço: o contorno vai num retângulo separado, por cima
    return `<g class="pc__peca"><rect x="${x}" y="${y}" width="${w}" height="${h}" ${preenche(ac, true)}/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="var(--grafite)" stroke-width="6"/>${
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

/* ---------- armário: passos da rolagem, configurador e lista de corte (estado inicial renderizado no build) ---------- */
const amostra = (a, marcado) => `<label class="amostra"><input type="radio" name="acabamento" value="${a.id}"${marcado ? " checked" : ""}><svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" ${preenche(a, false)}/></svg><span>${esc(a.nome)}</span></label>`;
const opcao = (nome, valor, texto, marcado) => `<label class="op"><input type="radio" name="${nome}" value="${valor}"${marcado ? " checked" : ""}><span>${esc(texto)}</span></label>`;
const faixa = (k, rot) => `<label class="rg"><span class="rg__t">${rot}</span><output for="cfg-${k}">${PADRAO[k]} cm</output><input id="cfg-${k}" type="range" name="${k}" min="${LIMITES[k][0]}" max="${LIMITES[k][1]}" step="5" value="${PADRAO[k]}"></label>`;

const secaoMovel = (D) => {
  const r = resumo(PADRAO, D), passos = D.movel.passos;
  return `<section class="movel" id="movel" aria-labelledby="mv-t">
  <div class="mv__topo"><h2 id="mv-t" data-split>${esc(D.movel.titulo)}</h2><p data-rev>Role para ver o armário se abrir em peças. No fim, ele é seu para mexer.</p></div>
  <div class="mv__grade">
    <div class="mv__palco">
      <div class="mv__canvas" tabindex="0" role="group" aria-label="Armário em 3D. Arraste para girar, use as setas do teclado para girar, mais e menos para ajustar largura, P para portas, G para gavetas e R para resetar a vista.">
        <canvas aria-hidden="true"></canvas><div class="mv__rotulos" aria-hidden="true"></div>
        <p class="mv__dica" aria-hidden="true">Arraste para girar; clique na porta ou gaveta</p>
        <div class="mv__falha" hidden>
          <svg class="mv__elev" id="mv-elevacao" role="img" aria-label="Elevação frontal em desenho técnico 2D do armário configurado"></svg>
          <p>Sem WebGL neste navegador: o desenho técnico 2D, a lista de corte e o orçamento continuam ao vivo.</p>
        </div>
      </div>
      <div class="mv__acoes">
        <button type="button" data-abrir="gaveta" aria-pressed="false">Abrir gavetas</button>
        <button type="button" data-abrir="porta" aria-pressed="false">Abrir portas</button>
        <button type="button" id="mv-escala" aria-pressed="false">Ver em escala</button>
        <button type="button" id="mv-reset" data-vista="reset" hidden>Resetar vista</button>
      </div>
      <p class="mv__teclas">Teclado no 3D: setas giram, +/− ajustam largura, P portas, G gavetas, R reseta vista</p>
    </div>
    <div class="mv__coluna">
      <ol class="mv__passos">${passos.slice(0, 4).map(([t, x], i) => `<li class="passo"><span class="passo__n" aria-hidden="true">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(x)}</p></li>`).join("")}</ol>
      <form class="cfg" id="configurador" aria-labelledby="cfg-t">
        <h3 id="cfg-t"><span class="passo__n" aria-hidden="true">5</span>${esc(passos[4][0])}</h3><p class="cfg__l">${esc(passos[4][1])}</p>
        <div class="cfg__barra">
          <div class="cfg__presets" role="group" aria-label="Modelos prontos">${PRESETS.map((p) => `<button type="button" class="cfg__preset" data-preset="${p.id}" aria-pressed="${p.id === "padrao"}">${esc(p.nome)}</button>`).join("")}</div>
          <div class="cfg__hist">
            <button type="button" id="cfg-desfazer" disabled>Desfazer</button>
            <button type="button" id="cfg-resetar">Restaurar padrão</button>
          </div>
        </div>
        <fieldset><legend>Medidas</legend>${faixa("L", "Largura")}${faixa("A", "Altura")}${faixa("P", "Profundidade")}<p class="cfg__aviso" aria-live="polite"></p></fieldset>
        <fieldset><legend>Portas</legend><div class="ops">${[1, 2, 3].map((n) => opcao("portas", n, String(n), n === PADRAO.portas)).join("")}</div></fieldset>
        <fieldset><legend>Gavetas</legend><div class="ops">${[0, 1, 2, 3, 4].map((n) => opcao("gavetas", n, String(n), n === PADRAO.gavetas)).join("")}</div></fieldset>
        <fieldset><legend>Madeira ou laca</legend><div class="amostras">${D.acabamentos.map((a) => amostra(a, a.id === PADRAO.acabamento)).join("")}</div></fieldset>
        <fieldset><legend>Puxador</legend><div class="ops">${D.puxadores.map((p) => opcao("puxador", p.id, p.nome, p.id === PADRAO.puxador)).join("")}</div></fieldset>
      </form>
      <div class="resumo">
        <p class="resumo__preco"><output id="r-preco">${r.preco}</output></p>
        <p class="resumo__linha" id="r-linha">${r.linha}</p>
        <p class="sr" id="r-anuncio" aria-live="polite" aria-atomic="true"></p>
        <p class="resumo__nota">Estimativa de exemplo. O orçamento final sai depois da visita, com medidas reais.</p>
        <div class="resumo__bts">
          <a class="btn" id="r-zap" href="${wa(mensagem(PADRAO, D))}" target="_blank" rel="noopener">Pedir orçamento deste armário</a>
          <button type="button" class="btn btn--vazio" id="r-compartilhar" data-mag>Compartilhar configuração</button>
        </div>
        <div class="tabela" tabindex="0" role="region" aria-label="Lista de corte, role para os lados se precisar">
          <p class="tabela__limpa" hidden><button type="button" id="r-limpar">Limpar peças fixadas</button></p>
          <table><caption>Lista de corte, medidas em milímetros. Passe o mouse ou foque numa peça para vê-la no armário; clique para fixar.</caption>
            <thead><tr><th scope="col">Peça</th><th scope="col">Qtd</th><th scope="col">Comp.</th><th scope="col">Larg.</th><th scope="col">Esp.</th></tr></thead>
            <tbody id="r-corpo">${linhasTabela(PADRAO)}</tbody></table>
        </div>
      </div>
    </div>
  </div>
  <svg class="mv__guia" id="mv-guia" aria-hidden="true"></svg>
</section>`;
};

/* ---------- materiais ---------- */
const secaoMateriais = (D) => `<section class="materiais escuro" id="materiais" aria-labelledby="mat-t">
  <h2 id="mat-t" data-split>Escolha pelo veio, não pela foto do catálogo.</h2>
  <p class="mat__l" data-rev>Cada amostra abaixo é desenhada pelo código, com o fio na direção real da chapa. Na oficina você pega a peça na mão antes de aprovar.</p>
  ${D.detalhe.foto ? `<figure class="mat__foto" data-rev><img src="${esc(D.detalhe.foto)}" alt="${esc(D.detalhe.alt)}" loading="lazy"><figcaption>${esc(D.detalhe.legenda)}</figcaption></figure>` : ""}
  <ul class="mat__lista">${D.acabamentos.map((a, i) => `<li class="mat" data-rev data-rev-delay="${(i % 4) * 0.05}">
    <svg viewBox="0 0 160 160" aria-hidden="true"><rect width="160" height="160" ${preenche(a, false)}/></svg>
    <h3>${esc(a.nome)}</h3><p>${esc(a.nota)}</p>
    <button type="button" class="mat__usar" data-usar="${a.id}" data-mag>Usar no meu armário<span class="sr"> (${esc(a.nome)})</span></button>
  </li>`).join("")}</ul>
</section>`;

/* ---------- ambientes: elevações desenhadas por código (troque por fotos em "foto") ---------- */
const ELEV = {
  // R(x, y, w, h): retângulo com veio; o contorno vai num retângulo à parte (o filtro do veio apagaria o traço)
  cozinha: (R, ln) => `<path d="M10 240 H390" ${ln}/>${[0, 1, 2, 3].map((i) => R(20 + i * 90, 150, 86, 86) + `<path d="M${28 + i * 90} 164 V190" ${ln}/>`).join("")}
    <rect x="14" y="138" width="372" height="12" fill="var(--grafite)"/>${[0, 1, 2, 3, 4].map((i) => R(20 + i * 72, 28, 70, 96) + `<path d="M${28 + i * 72} 110 V84" ${ln}/>`).join("")}`,
  closet: (R, ln) => `<rect x="20" y="20" width="360" height="220" fill="none" ${ln}/><path d="M140 20 V240 M260 20 V240" ${ln}/>
    <path d="M30 56 H130" ${ln}/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${42 + i * 20} 56 l8 16 h-16 Z" ${ln}/>`).join("")}
    ${[56, 106, 156].map((y) => `<path d="M150 ${y} H250" ${ln}/>`).join("")}<path d="M270 56 H370" ${ln}/>${[0, 1, 2].map((i) => R(272, 150 + i * 30, 96, 28)).join("")}
    ${R(30, 170, 100, 62)}${R(150, 190, 100, 42)}`,
  escritorio: (R, ln) => `${R(40, 150, 320, 12)}${R(50, 162, 12, 78)}${R(290, 162, 60, 78)}${[0, 1, 2].map((i) => `<path d="M290 ${188 + i * 26} H350" ${ln}/>`).join("")}
    <rect x="150" y="82" width="100" height="58" fill="var(--grafite)"/><path d="M200 140 V150 M180 150 H220" ${ln}/>${[0, 1, 2].map((i) => R(30, 42 + i * 28, 84, 8) + R(40, 28 + i * 28, 8, 14) + R(52, 30 + i * 28, 6, 12)).join("")}`,
  painel: (R, ln) => `${Array.from({ length: 32 }, (_, i) => `<rect x="${40 + i * 10}" y="20" width="6" height="190" ${R.cor}/>`).join("")}<rect x="120" y="52" width="160" height="90" fill="var(--grafite)"/>${R(96, 172, 208, 28)}<path d="M96 200 V208 M304 200 V208" ${ln}/>`,
};
const NOME_AMB = { cozinha: "uma cozinha", closet: "um closet", escritorio: "um escritório", painel: "um painel de sala" };
const elevacao = (id, a) => {
  const ln = 'stroke="var(--grafite)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"', cor = preenche(a, "amb");
  const R = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${cor}/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" ${ln}/>`;
  R.cor = cor;
  return `<svg viewBox="0 0 400 260" role="img" aria-label="Desenho de ${NOME_AMB[id]} sob medida"><g fill="none">${ELEV[id](R, ln)}</g></svg>`;
};

const secaoAmbientes = (D) => {
  const a = D.acabamentos[0];
  return `<section class="ambientes" id="ambientes" aria-labelledby="amb-t">
  <h2 id="amb-t" data-split>Cada ambiente pede uma conversa diferente.</h2>
  <div class="amb__abas" role="tablist" aria-label="Ambientes">${D.ambientes.map((m, i) => `<button type="button" role="tab" id="aba-${m.id}" aria-controls="amb-${m.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(m.nome)}</button>`).join("")}</div>
  ${D.ambientes.map((m, i) => `<div class="amb" id="amb-${m.id}" role="tabpanel" aria-labelledby="aba-${m.id}"${i ? " hidden" : ""}>
    <div class="amb__arte">${m.foto ? `<img src="${esc(m.foto)}" alt="${esc(m.alt || m.nome)}" loading="lazy">` : elevacao(m.id, a)}</div>
    <div class="amb__texto"><h3>${esc(m.nome)}</h3><p>${esc(m.texto)}</p>
      <ul>${m.itens.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <a class="btn" href="${wa(`Olá! Quero um orçamento de ${m.nome.toLowerCase()} sob medida.`)}" target="_blank" rel="noopener">Pedir orçamento de ${esc(m.nome.toLowerCase())}</a></div>
  </div>`).join("")}
</section>`;
};

const secaoProcesso = (D) => `<section class="processo" aria-labelledby="proc-t">
  <h2 id="proc-t" data-split>Da primeira medida à última dobradiça.</h2>
  <ol class="proc__lista">${D.processo.map(([t, x], i) => `<li data-rev data-rev-delay="${i * 0.06}"><span class="passo__n" aria-hidden="true">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(x)}</p></li>`).join("")}</ol>
</section>`;

const secaoPerguntas = (D) => `<section class="perguntas" aria-labelledby="perg-t">
  <h2 id="perg-t" data-split>O que mais perguntam antes de fechar.</h2>
  <div class="perg__lista">${D.perguntas.map(([q, r], i) => `<details data-rev data-rev-delay="${i * 0.04}"><summary>${esc(q)}</summary><p>${esc(r)}</p></details>`).join("")}</div>
</section>`;

const secaoContato = (D) => `<section class="contato escuro" id="contato" aria-labelledby="ct-t">
  <h2 id="ct-t" data-split>Seu móvel começa com uma medida.</h2>
  <div class="ct__corpo">
    <p class="ct__l">Mande o armário que você montou aqui, uma foto do ambiente ou só as medidas. A gente responde no mesmo dia útil.</p>
    <a class="btn" href="${wa("Olá! Vim pelo site e gostaria de agendar uma visita para medir.")}" target="_blank" rel="noopener">Chamar no WhatsApp</a>
    <dl class="ct__dados">
      <div><dt>Telefone</dt><dd><a href="${wa("Olá! Vim pelo site.")}" target="_blank" rel="noopener">${esc(D.telefone)}</a></dd></div>
      <div><dt>E-mail</dt><dd><a href="mailto:${esc(D.email)}">${esc(D.email)}</a></dd></div>
      <div><dt>Oficina</dt><dd>${esc(D.endereco)}</dd></div>
      <div><dt>Horário</dt><dd>${esc(D.horario)}</dd></div>
    </dl>
  </div>
</section>`;

export const html = () => {
  const D = DADOS;
  return `
${DEFS()}
<header class="topo">
  <a class="marca" href="#conteudo">${esc(D.nome)}</a>
  <nav aria-label="Principal"><a href="#movel">Monte o seu</a><a href="#materiais">Materiais</a><a href="#ambientes">Ambientes</a><a href="#contato">Contato</a></nav>
</header>
<div class="prog-topo" aria-hidden="true"></div>
<aside class="regua" aria-hidden="true"><div class="regua__fita"></div><div class="regua__ponteiro"><span class="regua__valor">0,00 m</span></div></aside>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <div class="hero__texto">
    <h1 id="h1" data-split data-split-hero>${esc(D.hero.titulo)}</h1>
    <p class="hero__l" data-rev>${esc(D.hero.texto)}</p>
    <div class="hero__bts" data-rev data-rev-delay="0.1"><a class="btn" href="#movel">${esc(D.hero.botao)}</a><a class="btn btn--vazio" href="${wa("Olá! Vim pelo site e gostaria de pedir um orçamento de móvel sob medida.")}" target="_blank" rel="noopener">${esc(D.hero.zap)}</a></div>
  </div>
  <figure class="hero__plano">${planoCorte()}<figcaption>Primeira de <span data-conta="${totais(PADRAO, D).chapas18}">${totais(PADRAO, D).chapas18}</span> chapas de <span data-conta="${CHAPA[0] * 10}">${CHAPA[0] * 10}</span> x <span data-conta="${CHAPA[1] * 10}">${CHAPA[1] * 10}</span> mm para um armário de ${PADRAO.L} x ${PADRAO.A} x ${PADRAO.P} cm. O plano de corte é a primeira coisa que a serra recebe.</figcaption></figure>
</section>

${secaoMovel(D)}

${secaoMateriais(D)}

${secaoAmbientes(D)}

${secaoProcesso(D)}

${secaoPerguntas(D)}

${secaoContato(D)}
</main>
<div class="wa-sticky" hidden><a class="btn" id="wa-sticky" href="${wa(mensagem(PADRAO, D))}" target="_blank" rel="noopener">Orçamento WhatsApp</a></div>
<footer class="rodape escuro">
  <p><b>${esc(D.nome)}</b>, ${esc(D.cidade)}</p>
  <nav aria-label="Rodapé"><a href="#movel">Monte o seu</a><a href="#materiais">Materiais</a><a href="#ambientes">Ambientes</a><a href="#contato">Contato</a></nav>
  ${D.ambientes.some((a) => a.foto) || D.detalhe.foto ? `<p class="rodape__cred">Imagens geradas com IA (Google Flow)</p>` : ""}
</footer>`;
};
