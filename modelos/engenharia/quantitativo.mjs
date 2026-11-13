// Quantitativo, prazo e cronograma de um prédio de concreto armado. Todas as fórmulas são de EXEMPLO:
// substitua pelas taxas reais do escritório. Funções puras: rodam no build (estado inicial) e no navegador (ao vivo).
export const PE = 3.0;                                 // pé-direito (m)
export const LIMITES = { andares: [3, 20], L: [12, 40], D: [10, 30] };
export const PADRAO = { andares: 8, L: 24, D: 16 };
export const CUSTO_M2 = 3800;                          // EXEMPLO: custo de referência por m² construído

const r1 = (x) => Math.round(x * 10) / 10;

export function calcular({ andares: n, L, D }) {
  const area = L * D * n;
  const concreto = area * (0.21 + 0.004 * n);          // m³
  const aco = concreto * (100 + 2 * n);                // kg
  const formas = area * 2.4;                           // m²
  const cron = cronograma({ andares: n });
  return { area, concreto, aco, formas, prazo: cron.total, custo: area * CUSTO_M2, altura: n * PE, cron };
}

/* Fases em meses. Instalações e vedação começam antes de a estrutura terminar, como numa obra de verdade. */
export function cronograma({ andares: n }) {
  const estr = 0.4 * n, fund = 2, proj = 2;
  const fases = [
    { id: "proj", nome: "Projetos e aprovações", ini: 0, dur: proj },
    { id: "fund", nome: "Fundações", ini: 1.5, dur: fund },
  ];
  const iniEstr = 1.5 + fund;
  fases.push({ id: "estr", nome: "Estrutura", ini: iniEstr, dur: estr });
  const iniInst = iniEstr + estr * 0.5, durInst = 1 + 0.3 * n;
  fases.push({ id: "inst", nome: "Instalações", ini: iniInst, dur: durInst });
  const iniVeda = iniEstr + estr * 0.7, durVeda = 1.5 + 0.25 * n;
  fases.push({ id: "veda", nome: "Vedação e fachada", ini: iniVeda, dur: durVeda });
  const iniAcab = iniInst + durInst * 0.5, durAcab = 2 + 0.25 * n;
  fases.push({ id: "acab", nome: "Acabamentos e entrega", ini: iniAcab, dur: durAcab });
  const total = Math.max(...fases.map((f) => f.ini + f.dur));
  return { fases: fases.map((f) => ({ ...f, ini: r1(f.ini), dur: r1(f.dur) })), total: r1(total) };
}

/* Um pavimento por linha: cota de nível e quantidades daquele andar */
export function pavimentos({ andares: n, L, D }) {
  const area = L * D, conc = area * (0.21 + 0.004 * n);
  return Array.from({ length: n }, (_, i) => ({ i, nome: i === 0 ? "Térreo" : `${i}º andar`, cota: i * PE, area, concreto: conc }));
}

/* Formatação em português */
export const num = (x, d = 0) => x.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
export const cota = (m) => (m >= 0 ? "+" : "-") + num(Math.abs(m), 2);
export const moeda = (x) => {
  if (x >= 1e6) return "R$ " + num(x / 1e6, 1) + " milhões";
  return "R$ " + num(Math.round(x / 1000) * 1000);
};
export const meses = (m) => num(m, 1) + (m === 1 ? " mês" : " meses");
