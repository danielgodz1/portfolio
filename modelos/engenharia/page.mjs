// ================= CONTEÚDO (troque aqui para cada cliente) =================
// Tudo que está marcado com "EXEMPLO: substituir" é fictício: nome, obras, números, prazos e contatos.
import { PADRAO, LIMITES, PE, calcular, pavimentos, cota, num, moeda, meses } from "./quantitativo.mjs";
import { cenaReal } from "../real.mjs";

export const DADOS = {
  nome: "Cota Zero Engenharia", // EXEMPLO: substituir
  cidade: "Campos do Sul, SP", // EXEMPLO: substituir (cidade fictícia)
  whatsapp: "", // só números com DDI, ex.: 5500000000000. Vazio = o WhatsApp abre e o visitante escolhe o contato
  telefone: "(00) 00000-0000", // EXEMPLO: substituir
  email: "obras@cotazero.example", // EXEMPLO: substituir
  endereco: "Av. das Indústrias, 1200 · Campos do Sul, SP", // EXEMPLO: substituir
  horario: "Seg a sex, 7h30 às 17h30", // EXEMPLO: substituir

  hero: {
    titulo: "Obra boa começa com o número certo.",
    texto: "Projeto estrutural, gerenciamento e execução de edifícios, galpões e obras de infraestrutura. Antes de assinar qualquer coisa, monte uma obra aqui e veja quanto concreto, quanto aço e quantos meses ela pede.",
    botao: "Montar a minha obra",
    zap: "Chamar no WhatsApp",
  },

  // Cena real: obra subindo com a rolagem. Enquanto midia/cena.mp4 não existir, a seção não aparece (o build confere o arquivo).
  cena: {
    video: "midia/cena.mp4", poster: "midia/cena.jpg", credito: "Vídeo gerado com IA (Google Flow)",
    alt: "Time-lapse de um edifício de concreto armado subindo andar por andar, com guindaste, e depois recebendo a fachada de vidro",
    dur: 320,
    passos: [
      ["Fundação.", "Tudo que sobe depende do que fica debaixo da terra."],
      ["Estrutura.", "Pilares, vigas e lajes ganham um andar a cada ciclo."],
      ["Instalações.", "Com a estrutura de pé, água, luz e ar passam antes de a parede fechar."],
      ["Fachada.", "O vidro e a vedação fecham a obra por fora."],
      ["Entrega.", "Vistoria, ajustes e a chave na mão do cliente."],
    ],
  },

  obra: {
    titulo: "Monte a sua obra",
    texto: "Role para ver o prédio subir. No fim, ele é seu: mude os andares e a planta e acompanhe o quantitativo e o cronograma.",
    passos: [
      ["Tudo começa pela fundação", "Sapatas, vigas baldrame e estacas levam a carga do prédio até o solo firme."],
      ["A estrutura sobe, andar por andar", "Pilares, vigas e laje se repetem a cada pavimento. O ciclo de cada laje define o ritmo da obra."],
      ["Por dentro, as instalações", "A água vai pelas prumadas e pelo forro. A elétrica sobe por um shaft próprio, ao lado."],
      ["A fachada fecha a obra", "Vidro e vedação entram quando a estrutura já deu o primeiro respiro."],
      ["Agora é a sua vez", "Mude os andares e a planta, ligue e desligue as camadas e corte o prédio num andar. As contas acompanham."],
    ],
  },

  // EXEMPLO: substituir pelas obras reais do cliente. foto: "midia/obra-N.jpg"
  obras: [
    { nome: "Edifício Aurora", tipo: "Residencial", area: "6.800 m²", extra: "16 andares", prazo: "22 meses", cidade: "Campos do Sul, SP", frase: "Estrutura de concreto armado com subsolo duplo e fachada ventilada.", foto: "midia/obra-1.jpg" },
    { nome: "Viaduto do Vale", tipo: "Infraestrutura", area: "420 m de extensão", extra: "vigas pré-moldadas", prazo: "14 meses", cidade: "Serra Alta, SP", frase: "Vigas içadas à noite para não parar o trânsito da rodovia.", foto: "midia/obra-2.jpg" },
    { nome: "Galpão Logístico Norte", tipo: "Industrial", area: "12.000 m²", extra: "estrutura metálica", prazo: "9 meses", cidade: "Porto Seco, SP", frase: "Piso de alta resistência e cobertura com iluminação zenital.", foto: "midia/obra-3.jpg" },
    { nome: "Fundação do Parque Central", tipo: "Fundações", area: "3.200 m²", extra: "126 estacas", prazo: "6 meses", cidade: "Campos do Sul, SP", frase: "Escavação, contenção e estacas para uma torre comercial.", foto: "midia/obra-4.jpg" },
  ],

  servicos: [
    ["Projeto estrutural", "Concreto armado, protendido e estrutura metálica, com compatibilização entre arquitetura e instalações."],
    ["Gerenciamento de obra", "Planejamento, medição, controle de qualidade e relatório quinzenal do que foi feito e do que falta."],
    ["Fundações e contenções", "Sondagem, escolha da fundação e acompanhamento da execução de estacas e cortinas."],
    ["Orçamento e planejamento", "Quantitativos, composição de custos e cronograma físico-financeiro para decidir antes de comprar."],
    ["Laudos e inspeções", "Vistoria de patologias, laudo de estrutura e inspeção predial com recomendações de reparo."],
    ["Regularização e aprovações", "Alvará, habite-se, ART e a papelada que costuma travar a obra no final."],
  ],
};
// ===========================================================================

export const meta = {
  slug: "engenharia", rotulo: "Engenharia civil", nome: "Cota Zero Engenharia",
  titulo: "Cota Zero Engenharia · Projeto e execução de obras",
  descricao: "Monte um prédio em 3D, veja concreto, aço, prazo e cronograma, e peça o orçamento pelo WhatsApp.",
  conceito: "Um prédio 3D que sobe andar por andar com a rolagem e recalcula quantitativo, prazo e cronograma enquanto você mexe.",
  fundo: "#F3F4F0", acento: "#FF6A1A",
};
export const fonts = [
  ["Archivo", "@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2", "100 900", "normal", "62% 125%"],
  ["Work Sans", "@fontsource-variable/work-sans/files/work-sans-latin-wght-normal.woff2", "100 900"],
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wa = (msg) => `https://wa.me/${DADOS.whatsapp}?text=${encodeURIComponent(msg)}`;
// só roda no build (Node): sem o arquivo do vídeo em midia/, a cena fica de fora
const existe = (rel) => { try { return process.getBuiltinModule("node:fs").existsSync("modelos/engenharia/" + rel); } catch { return true; } };

export const mensagemObra = (cfg, link = "") => {
  const r = calcular(cfg);
  return `Olá! Simulei uma obra no site: ${cfg.andares} ${cfg.andares === 1 ? "andar" : "andares"}, planta de ${cfg.L} x ${cfg.D} m (${num(r.area)} m² construídos), cerca de ${num(r.concreto)} m³ de concreto, ${num(r.aco / 1000, 1)} t de aço e prazo de ${meses(r.prazo)}. A referência de custo deu ${moeda(r.custo)}. Gostaria de conversar sobre a minha obra.${link ? `\nSimulação: ${link}` : ""}`;
};

/* ---------- quantitativo, pavimentos e cronograma (estado inicial no build; ao vivo no navegador) ---------- */
export const linhasPavimentos = (cfg, sel = null) => pavimentos(cfg).map((p) => `<tr><th scope="row"><button type="button" class="pav-bt" data-i="${p.i}" aria-pressed="${p.i === sel}">${p.nome}</button></th><td>${cota(p.cota)} m</td><td>${num(p.area)}</td><td>${num(p.concreto, 1)}</td></tr>`).join("");

export const quantitativoHtml = (cfg) => {
  const r = calcular(cfg);
  const linha = (rot, val, un) => `<div><dt>${rot}</dt><dd><b>${val}</b> ${un}</dd></div>`;
  return linha("Área construída", num(r.area), "m²") + linha("Concreto", num(r.concreto), "m³") + linha("Aço", num(r.aco / 1000, 1), "toneladas") + linha("Fôrmas", num(r.formas), "m²") + linha("Prazo", num(r.prazo, 1), "meses") + linha("Custo de referência", moeda(r.custo), "");
};

export const ganttHtml = (cfg) => {
  const { cron } = calcular(cfg), T = Math.max(3, Math.ceil(cron.total / 3) * 3);
  const marcas = Array.from({ length: T / 3 + 1 }, (_, i) => `<span style="--x:${((i * 3) / T).toFixed(4)}">${i * 3}</span>`).join("");
  return `<div class="gantt__eixo" aria-hidden="true">${marcas}</div>` + cron.fases.map((f) =>
    `<li class="gantt__linha"><span class="gantt__nome">${f.nome}</span><span class="gantt__trilho"><span class="barra barra--${f.id}" style="--i:${(f.ini / T).toFixed(4)};--f:${(f.dur / T).toFixed(4)}"></span></span><span class="sr">Do mês ${num(f.ini, 1)} ao mês ${num(f.ini + f.dur, 1)}.</span></li>`).join("");
};

const faixa = (k, rot, passo, un) => `<label class="rg"><span class="rg__t">${rot}</span><output for="cfg-${k}">${PADRAO[k]} ${un}</output><input id="cfg-${k}" type="range" name="${k}" min="${LIMITES[k][0]}" max="${LIMITES[k][1]}" step="${passo}" value="${PADRAO[k]}"></label>`;
const camada = (id, nome) => `<label class="cam"><input type="checkbox" name="cam" value="${id}" checked><span>${nome}</span></label>`;

const secaoObra = (D) => {
  const O = D.obra;
  return `<section class="obra" id="obra" aria-labelledby="ob-t">
  <div class="ob__topo"><h2 id="ob-t" data-split>${esc(O.titulo)}</h2><p>${esc(O.texto)}</p></div>
  <div class="ob__grade">
    <div class="ob__palco">
      <div class="ob__canvas" tabindex="0" role="group" aria-label="Prédio em 3D. Arraste para girar, use as setas do teclado, + e − para mudar andares, R para resetar e clique num andar para selecioná-lo.">
        <canvas aria-hidden="true"></canvas><div class="ob__rotulos" aria-hidden="true"></div>
        <p class="ob__dica" aria-hidden="true">Arraste para girar; clique em um andar</p>
        <div class="ob__falha" hidden>
          <svg class="ob__elev" id="ob-elevacao" viewBox="-42 -16 140 160" aria-hidden="true"></svg>
          <p>Seu navegador não abriu o prédio em 3D. O corte esquemático acima, o quantitativo, os pavimentos e o cronograma continuam funcionando.</p>
        </div>
      </div>
      <div class="ob__acoes" hidden><button type="button" id="ob-reset" hidden>Resetar vista</button></div>
      <p class="ob__teclas">No 3D: setas giram; + / − andares; R reseta a vista</p>
    </div>
    <div class="ob__coluna">
      <ol class="ob__passos">${O.passos.slice(0, 4).map(([t, x], i) => `<li class="passo"><span class="passo__n" aria-hidden="true">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(x)}</p></li>`).join("")}</ol>
      <form class="cfg" id="configurador" aria-labelledby="cfg-t">
        <h3 id="cfg-t"><span class="passo__n" aria-hidden="true">5</span>${esc(O.passos[4][0])}</h3><p class="cfg__l">${esc(O.passos[4][1])}</p>
        <div class="cfg__barra"><button type="button" id="cfg-resetar" disabled>Restaurar padrão</button></div>
        <fieldset><legend>Dimensões</legend>${faixa("andares", "Andares", 1, "")}${faixa("L", "Largura", 2, "m")}${faixa("D", "Profundidade", 2, "m")}</fieldset>
        <fieldset><legend>Camadas</legend><div class="cams">${camada("estr", "Estrutura")}${camada("hid", "Hidráulica")}${camada("ele", "Elétrica")}${camada("veda", "Fachada")}</div></fieldset>
        <fieldset><legend>Cortar o prédio</legend><label class="rg"><span class="rg__t">Mostrar até o</span><output for="cfg-corte">${PADRAO.andares}º andar</output><input id="cfg-corte" type="range" name="corte" min="1" max="${PADRAO.andares}" step="1" value="${PADRAO.andares}"></label></fieldset>
        <p class="cfg__aviso" id="r-anuncio" aria-live="polite" aria-atomic="true"></p>
      </form>
      <div class="resumo">
        <h3 class="resumo__t">O que essa obra pede</h3>
        <dl class="quant" id="r-quant">${quantitativoHtml(PADRAO)}</dl>
        <p class="resumo__nota">Estimativa de exemplo, com taxas médias. O número de verdade sai do projeto.</p>
        <div class="resumo__bts">
          <a class="btn" id="r-zap" href="${wa(mensagemObra(PADRAO))}" target="_blank" rel="noopener">Pedir orçamento desta obra</a>
          <button type="button" class="btn btn--vazio" id="r-compartilhar">Compartilhar simulação</button>
        </div>
        <div class="tabela" tabindex="0" role="region" aria-label="Pavimentos, role para ver todos">
          <table><caption>Pavimentos e cotas de nível. Passe o mouse ou foque num andar para vê-lo no prédio; clique para selecionar.</caption>
            <thead><tr><th scope="col">Pavimento</th><th scope="col">Cota</th><th scope="col">Área m²</th><th scope="col">Concreto m³</th></tr></thead>
            <tbody id="r-corpo">${linhasPavimentos(PADRAO)}</tbody></table>
        </div>
      </div>
    </div>
  </div>
  <div class="gantt" id="cronograma" aria-labelledby="gt-t">
    <h3 id="gt-t">Cronograma, em meses</h3><p class="gantt__l">As barras mudam com o número de andares. Instalações e vedação começam antes de a estrutura terminar.</p>
    <ol class="gantt__lista" id="r-gantt">${ganttHtml(PADRAO)}</ol>
  </div>
</section>`;
};

const secaoObras = (D) => `<section class="obras" id="obras" aria-labelledby="ob2-t">
  <h2 id="ob2-t" data-split>${esc(D.obrasTitulo || "Obras que saíram do papel.")}</h2>
  <div class="obras__grade">${D.obras.map((o, i) => `<figure class="obra-item obra-item--${i}" data-rev>
    ${o.foto ? `<img src="${esc(o.foto)}" alt="${esc(o.nome)}, ${esc(o.tipo.toLowerCase())}, ${esc(o.cidade)}" loading="lazy">` : `<div class="obra-item__vazio">Foto da obra</div>`}
    <figcaption><h3>${esc(o.nome)}</h3><p>${esc(o.frase)}</p><dl><div><dt>Tipo</dt><dd>${esc(o.tipo)}</dd></div><div><dt>Porte</dt><dd>${esc(o.area)}, ${esc(o.extra)}</dd></div><div><dt>Prazo</dt><dd>${esc(o.prazo)}</dd></div></dl></figcaption>
  </figure>`).join("")}</div>
  <p class="nota">Obras de exemplo. Troque pelas reais, com autorização do cliente para divulgar.</p>
</section>`;

const secaoServicos = (D) => `<section class="servicos" aria-labelledby="sv-t">
  <h2 id="sv-t" data-split>O que a gente faz.</h2>
  <ul class="sv__lista">${D.servicos.map(([t, x]) => `<li data-rev><h3>${esc(t)}</h3><p>${esc(x)}</p></li>`).join("")}</ul>
</section>`;

const secaoOrcamento = (D) => `<section class="contato escuro" id="contato" aria-labelledby="ct-t">
  <div class="ct__topo"><h2 id="ct-t" data-split>Conte da sua obra em três passos.</h2><p>Sem formulário gigante. O resumo vai direto para o WhatsApp da equipe.</p></div>
  <form class="orc" id="orcamento" novalidate>
    <p class="orc__passo" id="orc-passo" aria-live="polite">Passo 1 de 3</p>
    <fieldset data-passo="1"><legend>Que obra é?</legend>
      <div class="ops">${["Edifício residencial", "Edifício comercial", "Galpão industrial", "Infraestrutura", "Reforma ou ampliação"].map((t, i) => `<label class="op"><input type="radio" name="tipo" value="${t}"${i === 0 ? " checked" : ""}><span>${t}</span></label>`).join("")}</div>
      <label class="campo">Área aproximada em m²<input type="number" name="area" min="20" inputmode="numeric" autocomplete="off" required></label>
    </fieldset>
    <fieldset data-passo="2" hidden><legend>Onde e em que fase?</legend>
      <label class="campo">Cidade<input type="text" name="cidade" autocomplete="address-level2" required></label>
      <div class="ops">${["Só a ideia", "Terreno comprado", "Projeto pronto", "Obra parada"].map((t, i) => `<label class="op"><input type="radio" name="fase" value="${t}"${i === 0 ? " checked" : ""}><span>${t}</span></label>`).join("")}</div>
    </fieldset>
    <fieldset data-passo="3" hidden><legend>Como falamos com você?</legend>
      <label class="campo">Nome<input type="text" name="nome" autocomplete="name" required></label>
      <label class="campo">WhatsApp com DDD<input type="tel" name="zap" inputmode="tel" autocomplete="tel" required></label>
    </fieldset>
    <p class="orc__erro" id="orc-erro" role="alert"></p>
    <div class="orc__bts"><button type="button" class="btn btn--vazio" data-voltar hidden>Voltar</button><button type="button" class="btn" data-prox>Continuar</button><button type="submit" class="btn" hidden>Enviar pelo WhatsApp</button></div>
    <p class="orc__ok" id="orc-ok" hidden>Abrimos o WhatsApp com o seu resumo. Se nada abriu, <a id="orc-link" href="#" target="_blank" rel="noopener">toque aqui</a>.</p>
  </form>
  <dl class="ct__dados"><div><dt>Telefone</dt><dd><a href="${wa("Olá! Vim pelo site.")}" target="_blank" rel="noopener">${esc(D.telefone)}</a></dd></div><div><dt>E-mail</dt><dd><a href="mailto:${esc(D.email)}">${esc(D.email)}</a></dd></div><div><dt>Escritório</dt><dd>${esc(D.endereco)}</dd></div><div><dt>Horário</dt><dd>${esc(D.horario)}</dd></div></dl>
</section>`;

export const html = () => {
  const D = DADOS;
  const cena = existe(D.cena.video) ? D.cena : { ...D.cena, video: "" };
  const temFotos = D.obras.some((o) => o.foto);
  const credito = cena.video && temFotos ? "Vídeo e imagens gerados com IA (Google Flow)" : cena.video ? D.cena.credito : temFotos ? "Imagens geradas com IA (Google Flow)" : "";
  return `
<header class="topo">
  <a class="marca" href="#conteudo">${esc(D.nome)}</a>
  <nav aria-label="Principal"><a href="#obra">Obra virtual</a><a href="#obras">Obras</a><a href="#cronograma">Cronograma</a><a href="#contato">Contato</a></nav>
</header>
<div class="prog-topo" aria-hidden="true"></div>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <h1 id="h1" data-split data-split-hero>${esc(D.hero.titulo)}</h1>
  <div class="hero__base"><p class="hero__l">${esc(D.hero.texto)}</p>
    <div class="hero__bts"><a class="btn" href="#obra">${esc(D.hero.botao)}</a><a class="btn btn--vazio" href="${wa("Olá! Vim pelo site e gostaria de conversar sobre uma obra.")}" target="_blank" rel="noopener">${esc(D.hero.zap)}</a></div></div>
</section>

${cenaReal(cena)}

${secaoObra(D)}

${secaoObras(D)}

${secaoServicos(D)}

${secaoOrcamento(D)}
</main>
<div class="wa-sticky" hidden><a class="btn" id="wa-sticky-bt" href="${wa(mensagemObra(PADRAO))}" target="_blank" rel="noopener">Orçamento no WhatsApp</a></div>
<footer class="rodape escuro">
  <p><b>${esc(D.nome)}</b>, ${esc(D.cidade)}</p>
  <nav aria-label="Rodapé"><a href="#obra">Obra virtual</a><a href="#obras">Obras</a><a href="#cronograma">Cronograma</a><a href="#contato">Contato</a></nav>
  ${credito ? `<p class="rodape__cred">${esc(credito)}</p>` : ""}
</footer>`;
};
