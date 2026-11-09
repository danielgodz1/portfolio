// ============================================================
//  CONTEÚDO DO PORTFÓLIO
//  Para adicionar um projeto: copie um objeto de PROJETOS, preencha e
//  rode `node build.mjs`. Se o projeto tiver `imagem`, ela aparece no lugar
//  do desenho; sem imagem nem desenho, aparece uma moldura de lápis.
// ============================================================

export const SITE = {
  nome: "Daniel dos Santos",
  cidade: "Jaú, SP",
  titulo: "Daniel dos Santos, desenvolvedor web",
  descricao:
    "Portfólio de Daniel dos Santos, desenvolvedor web em Jaú, SP. Sites e sistemas com React, Node e Supabase, com movimento e 3D quando a história pede.",
  intro:
    "Eu sou o Daniel, desenvolvedor web em Jaú, SP. Faço sites e sistemas com React, Node e Supabase, e levo movimento e 3D ao navegador quando a história pede.",
};

// Preencha o que quiser mostrar. Campo vazio não aparece no site.
export const CONTATO = {
  email: "daniel_santos172@hotmail.com",
  whatsapp: "", // só números, com DDI: 5514999999999
  instagram: "", // URL completa
  github: "https://github.com/danielgodz1",
  linkedin: "https://www.linkedin.com/in/danieldossantos-ti",
};

// Palavras que caem na cena "ideias caindo". Só o que é verdade nos seus projetos. Marca = destaque amarelo.
export const QUEDA = {
  titulo: "As ideias não cabem na caixa. Elas caem.",
  dica: "Role para soltar. Depois empurre.",
  chips: [
    "React 19", "TypeScript", "Supabase", "PostgreSQL", "Node.js", "Vite", "Tailwind", "Vercel",
    "Three.js", "GSAP", "Lenis", "Zustand", "Groq", "TOTVS RM",
    "checklist", "requisição", "inspeção", "almoxarifado", "aprovação", "assinatura digital",
    "relatório em PDF", "planilha Excel", "configurador 3D", "RLS",
    ["IA", 1], ["3D", 1], ["LED", 1],
  ],
};

export const PROJETOS = [
  {
    id: "imperio",
    nome: "Império Móveis Planejados",
    resumo: "Site e configurador 3D para uma marcenaria de Jaú.",
    texto: [
      "A Império faz móveis planejados em Jaú, SP. Eu cuidei da direção de arte e do código. Tudo parte de uma linha de lápis: ela desenha a planta na abertura, guia a rolagem e contorna o ambiente no 3D.",
    ],
    fatos: [
      ["Cliente", "Império Móveis Planejados, Jaú/SP"],
      ["Meu papel", "Direção de arte e front-end"],
      ["Tecnologia", "React, TypeScript, Three.js, GSAP, Lenis, Zustand"],
      ["Hospedagem", "Vercel"],
    ],
    links: [
      { texto: "Instagram da Império", url: "https://www.instagram.com/imperio.moveis.jau/" },
    ],
    // Estudo de caso (opcional): preencha e aparece. Só escreva o que for verdade.
    desafio: "",
    solucao: "",
    resultado: "",
    desenho: "planta-quarto",
    legenda: "O LED acende por último.",
  },
  {
    id: "flowcheck",
    nome: "FlowCheck",
    resumo: "Checklists e inspeções de segurança do trabalho, com IA, para frotas e obras.",
    texto: [
      "Sistema real, em uso. Equipes de campo executam checklists de veículos, máquinas e equipamentos, registram não conformidades com foto e acompanham tudo numa central de aprovações. A IA sugere o plano de ação 5W2H e o relatório sai em PDF ou Excel.",
    ],
    fatos: [
      ["Tipo", "Sistema web corporativo, em produção"],
      ["Meu papel", "Concepção e desenvolvimento"],
      ["Destaques", "Assinatura digital, homologação externa por link e PIN, segurança por linha (RLS)"],
      ["Tecnologia", "React 19, TypeScript, Vite, Tailwind, Express, Supabase, Groq"],
      ["Hospedagem", "Vercel"],
    ],
    desenho: "checklist",
    legenda: "O amarelo marca o que precisa de atenção.",
    ledOn: "Marcar a não conformidade", ledOff: "Desmarcar",
  },
  {
    id: "flowrequest",
    nome: "FlowRequest",
    resumo: "Requisições de alimentação, almoxarifado, material, peças e hospedagem, do campo à conclusão.",
    texto: [
      "Sistema real, em uso. Apontadores, encarregados, administradores e fornecedores cuidam de todo o ciclo: emissão em campo, aprovação, conferência e fechamento. No almoxarifado, a requisição se conclui sozinha 48 horas depois. Comprovantes em PDF, dados em Excel.",
    ],
    fatos: [
      ["Tipo", "Sistema web corporativo, em produção"],
      ["Meu papel", "Concepção e desenvolvimento"],
      ["Perfis", "Administrador, apontador, encarregado e fornecedor"],
      ["Tecnologia", "React 19, TypeScript, Vite, Tailwind, TanStack Query, Supabase, Recharts"],
      ["Hospedagem", "Vercel"],
    ],
    desenho: "fluxo",
    legenda: "Depois de 48 h, o almoxarifado se conclui sozinho.",
    ledOn: "Concluir a requisição", ledOff: "Reabrir",
  },
];
