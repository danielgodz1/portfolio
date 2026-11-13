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
      ["Terreno.", "Tudo começa em um lote vazio e em boas perguntas."],
      ["Planta.", "O desenho marca o chão antes de qualquer tijolo."],
      ["Estrutura.", "Fundação, pilares e paredes tomam forma."],
      ["Acabamento.", "Esquadrias, revestimentos e paisagismo entram."],
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
    { tipo: "terrea", nome: "Casa do Ipê", area: "148 m²", cidade: "Vale Claro, SP", frase: "Um piso só, com jardim para todos os cômodos.", foto: "" },
    { tipo: "sobrado", nome: "Sobrado Cedro", area: "236 m²", cidade: "Serra Dourada, SP", frase: "Suítes no alto, vida social no térreo.", foto: "" },
    { tipo: "comercial", nome: "Café da Esquina", area: "92 m²", cidade: "Porto Nascente, SP", frase: "De depósito a café, sem perder o tijolo aparente.", foto: "" },
    { tipo: "apto", nome: "Apê Jacarandá", area: "74 m²", cidade: "Campo Real, SP", frase: "Paredes que sumiram e luz que entrou.", foto: "" },
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
    antes: "", depois: "", // "midia/antes.jpg" e "midia/depois.jpg"
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

export const html = () => {
  const D = DADOS;
  const cena = existe(D.cena.video) ? D.cena : { ...D.cena, video: "" };
  return `
<header class="topo">
  <a class="marca" href="#conteudo">${esc(D.nome)}</a>
  <nav aria-label="Principal"><a href="#projetos">Projetos</a><a href="#processo">Processo</a><a href="#contato">Contato</a></nav>
</header>
<main id="conteudo">
<section class="hero" aria-labelledby="h1">
  <div class="hero__texto">
    <h1 id="h1">${esc(D.hero.titulo)}</h1>
    <p class="hero__l">${esc(D.hero.texto)}</p>
    <a class="btn" href="${wa("Olá! Vim pelo site e gostaria de conversar sobre um projeto.")}" target="_blank" rel="noopener">${esc(D.hero.botao)}</a>
  </div>
</section>

${cenaReal(cena)}
</main>
<footer class="rodape" id="contato">
  <p>${esc(D.nome)} · ${esc(D.cidade)}</p>
  ${cena.video ? `<p class="rodape__cred">${esc(D.cena.credito)}</p>` : ""}
</footer>`;
};
