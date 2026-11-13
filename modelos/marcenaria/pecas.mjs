// Peças de um armário sob medida. Medidas em cm. Funções puras: rodam no build (plano de corte do hero)
// e no navegador (lista de corte e orçamento ao vivo, e o próprio desenho 3D).
export const ESP = 1.8;            // espessura das chapas de MDF (18 mm)
export const ROD = 8;              // altura do rodapé
export const FRENTE = 18;          // altura de cada frente de gaveta
export const CHAPA = [275, 185];   // chapa inteira, 2750 x 1850 mm
export const LIMITES = { L: [60, 240], A: [80, 260], P: [35, 65] };
export const PADRAO = { L: 120, A: 220, P: 55, portas: 2, gavetas: 3, acabamento: "freijo", puxador: "cava" };

const r1 = (x) => Math.round(x * 10) / 10;

/* Alturas que o desenho e a lista de corte compartilham */
export function medidas({ L, A, P, portas, gavetas }) {
  const bloco = gavetas * FRENTE;                       // bloco de gavetas, de baixo para cima
  const altPortas = r1(A - ROD - bloco - 0.4);          // as portas cobrem o vão acima das gavetas
  const util = A - ROD - bloco - 2 * ESP;               // altura útil para prateleiras
  const prat = Math.max(0, Math.min(6, Math.floor(util / 32) - 1));
  return { bloco, altPortas, prat, L, A, P, portas, gavetas };
}

/* Lista de corte: [{ id, nome, qtd, c, l, esp }] (c = comprimento, l = largura, em cm; esp em mm) */
export function pecas(cfg) {
  const { L, A, P, portas, gavetas } = cfg, m = medidas(cfg);
  const dentro = L - 2 * ESP;
  const lista = [
    { id: "lat", nome: "Lateral", qtd: 2, c: A, l: P, esp: 18 },
    { id: "topo", nome: "Tampo", qtd: 1, c: dentro, l: P, esp: 18 },
    { id: "base", nome: "Base", qtd: 1, c: dentro, l: P, esp: 18 },
    { id: "rod", nome: "Rodapé", qtd: 1, c: dentro, l: ROD, esp: 18 },
    { id: "prat", nome: "Prateleira", qtd: m.prat, c: dentro - 0.2, l: P - 2, esp: 18 },
    { id: "fundo", nome: "Fundo", qtd: 1, c: A - 0.4, l: L - 0.4, esp: 6 },
    { id: "porta", nome: "Porta", qtd: portas, c: m.altPortas, l: L / portas - 0.3, esp: 18 },
    { id: "frente", nome: "Frente de gaveta", qtd: gavetas, c: L - 0.6, l: FRENTE - 0.4, esp: 18 },
    { id: "gl", nome: "Lateral de gaveta", qtd: gavetas * 2, c: P - 6, l: 12.5, esp: 15 },
    { id: "gt", nome: "Traseira de gaveta", qtd: gavetas, c: dentro - 3.2, l: 12.5, esp: 15 },
    { id: "gf", nome: "Fundo de gaveta", qtd: gavetas, c: P - 6, l: dentro - 3.2, esp: 6 },
  ];
  return lista.filter((p) => p.qtd > 0).map((p) => ({ ...p, c: r1(p.c), l: r1(p.l) }));
}

/* Áreas, chapas e preço de exemplo. catalogo = { acabamentos: [{id, preco}], puxadores: [{id, preco}] } */
export function totais(cfg, catalogo) {
  const lista = pecas(cfg);
  const area = (fino) => lista.filter((p) => (p.esp <= 6) === fino).reduce((s, p) => s + (p.qtd * p.c * p.l) / 10000, 0);
  const a18 = area(false), a6 = area(true), chapaM2 = (CHAPA[0] * CHAPA[1]) / 10000;
  const acab = catalogo.acabamentos.find((a) => a.id === cfg.acabamento) || catalogo.acabamentos[0];
  const puxa = catalogo.puxadores.find((p) => p.id === cfg.puxador) || catalogo.puxadores[0];
  const ferragens = cfg.gavetas * (170 + puxa.preco) + cfg.portas * (2 * 28 + puxa.preco);
  const material = a18 * acab.preco + a6 * 90;
  const bruto = material + ferragens;
  return {
    a18, a6, chapas18: Math.ceil((a18 * 1.18) / chapaM2), chapas6: Math.ceil((a6 * 1.15) / chapaM2),
    pecas: lista.reduce((s, p) => s + p.qtd, 0), preco: Math.round((bruto * 1.15) / 10) * 10,
  };
}

/* Plano de corte da primeira chapa: peças de 15 e 18 mm encaixadas por guilhotina (cortes de ponta a ponta,
   como a serra faz), podendo girar 90 graus. Devolve [{id, nome, x, y, w, h}] em cm; o que não cabe vai para as próximas chapas. */
export function plano(cfg) {
  const itens = [];
  for (const p of pecas(cfg).filter((q) => q.esp >= 15))
    for (let i = 0; i < p.qtd; i++) itens.push({ id: p.id, nome: p.nome, w: Math.max(p.c, p.l), h: Math.min(p.c, p.l) });
  itens.sort((a, b) => b.w * b.h - a.w * a.h);
  const SERRA = 0.4; let livres = [{ x: 0, y: 0, w: CHAPA[0], h: CHAPA[1] }]; const saida = [];
  for (const it of itens) {
    let melhor = null;
    livres.forEach((f, i) => { for (const [w, h] of [[it.w, it.h], [it.h, it.w]]) {
      if (w <= f.w && h <= f.h) { const sobra = Math.min(f.w - w, f.h - h); if (!melhor || sobra < melhor.sobra) melhor = { i, w, h, sobra }; }
    } });
    if (!melhor) continue;                              // não coube nesta chapa
    const f = livres[melhor.i], { w, h } = melhor;
    saida.push({ id: it.id, nome: it.nome, x: f.x, y: f.y, w, h });
    livres.splice(melhor.i, 1);
    const dir = { x: f.x + w + SERRA, y: f.y, w: f.w - w - SERRA, h }, baixo = { x: f.x, y: f.y + h + SERRA, w: f.w, h: f.h - h - SERRA };
    if (dir.w > 1 && dir.h > 1) livres.push(dir);
    if (baixo.w > 1 && baixo.h > 1) livres.push(baixo);
  }
  return saida;
}
