// Agenda do estúdio: uma camada de dados só, usada pelo site (cliente reserva) e pelo painel (dona administra).
// Hoje roda em modo "demo": guarda tudo no navegador (localStorage) e começa com reservas de exemplo.
// Para ir ao ar: aplique supabase/agenda.sql e troque o modo para "supabase" (a interface abaixo não muda).

export const STATUS = {
  pendente: "Aguardando confirmação",
  confirmada: "Confirmada",
  concluida: "Atendida",
  cancelada: "Cancelada",
  expirada: "Pix não pago",
};
const ATIVOS = ["pendente", "confirmada", "concluida"]; // ocupam o horário
export const MINUTOS_PIX = 15; // prazo para pagar o sinal antes de o horário voltar a ficar livre

const doisDig = (n) => String(n).padStart(2, "0");
export const isoDia = (d) => `${d.getFullYear()}-${doisDig(d.getMonth() + 1)}-${doisDig(d.getDate())}`;
export const deIso = (s) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d); };
export const rotuloDia = (s, op = { weekday: "short", day: "2-digit", month: "2-digit" }) => deIso(s).toLocaleDateString("pt-BR", op).replace(".", "");

/* Próximos dias de atendimento (padrão: terça a sábado), a partir de hoje + "desde" dias */
export function proximosDias(n, diasSemana = [2, 3, 4, 5, 6], desde = 1) {
  const r = [], d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + desde);
  while (r.length < n) { if (diasSemana.includes(d.getDay())) r.push(isoDia(d)); d.setDate(d.getDate() + 1); }
  return r;
}

/* ---------- modo demonstração ---------- */
const NOMES = ["Ana", "Bia", "Carla", "Duda", "Elis", "Fernanda", "Gabi", "Helô", "Isa", "Júlia"];
function semente(horas, diasSemana, exemplos) {
  const dias = proximosDias(12, diasSemana, 0), agora = Date.now();
  const reservas = [], bloqueios = [];
  let k = 0;
  dias.forEach((dia, i) => {
    horas.forEach((hora, j) => {
      if ((i * 3 + j * 2) % 5 !== 0 || !exemplos.length) return;
      const s = exemplos[(i + j) % exemplos.length];
      const nome = NOMES[k++ % NOMES.length] + " (exemplo)";
      const status = i < 2 || k % 4 ? "confirmada" : "pendente";
      const pagamento = status === "confirmada" && k % 3 === 0 ? "pix" : "estudio"; // Pix de exemplo já vem pago
      reservas.push({ id: "ex" + k, dia, hora, cliente: nome, fone: "5514900000000", obs: "", servicos: [s], total: s.preco, pagamento, pago: pagamento === "pix", status, criadaEm: agora - k * 3600e3 });
    });
  });
  if (dias[4]) bloqueios.push({ id: "b1", dia: dias[4], hora: null, motivo: "Turma de curso (exemplo)" });
  if (dias[1]) bloqueios.push({ id: "b2", dia: dias[1], hora: horas[horas.length - 1], motivo: "Compromisso (exemplo)" });
  return { reservas, bloqueios };
}

export function criaAgenda({ estudio, horas, diasSemana = [2, 3, 4, 5, 6], exemplos = [], modo = "demo" }) {
  if (modo !== "demo") throw new Error('Modo "supabase" ainda não ligado: veja supabase/agenda.sql');
  const CH = `agenda-${estudio}`;
  let mem = null; // reserva para quando o navegador não deixa gravar (aba anônima, bloqueio)
  const le = () => {
    let d = mem;
    try { d = JSON.parse(localStorage.getItem(CH)) || d; } catch {}
    if (!d) { d = semente(horas, diasSemana, exemplos); grava(d); }
    // Pix vencido devolve o horário
    const agora = Date.now();
    let mudou = false;
    d.reservas.forEach((r) => { if (r.status === "pendente" && r.expiraEm && r.expiraEm < agora) { r.status = "expirada"; mudou = true; } });
    if (mudou) grava(d);
    return d;
  };
  const grava = (d) => { mem = d; try { localStorage.setItem(CH, JSON.stringify(d)); } catch {} };
  const novoId = () => Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

  const ocupados = (d, dia) => {
    const o = new Set(d.reservas.filter((r) => r.dia === dia && ATIVOS.includes(r.status)).map((r) => r.hora));
    for (const b of d.bloqueios) if (b.dia === dia) (b.hora ? [b.hora] : horas).forEach((h) => o.add(h));
    if (dia === isoDia(new Date())) { // hoje: horas que já passaram também saem
      const agora = new Date(), min = agora.getHours() * 60 + agora.getMinutes();
      horas.forEach((h) => { const [a, b] = h.split(":").map(Number); if (a * 60 + b <= min) o.add(h); });
    }
    return o;
  };

  return {
    modo,
    horas,
    diasSemana,
    /* horários do dia, com livre: true/false (não expõe dados de clientes) */
    async livres(dia) { const o = ocupados(le(), dia); return horas.map((hora) => ({ hora, livre: !o.has(hora) })); },
    /* cria a reserva; Pix fica pendente até pagar (prazo MINUTOS_PIX), no estúdio fica pendente até a dona confirmar */
    async reservar({ dia, hora, servicos, cliente, fone, obs = "", pagamento }) {
      const d = le();
      if (ocupados(d, dia).has(hora)) throw Object.assign(new Error("Esse horário acabou de ser reservado. Escolha outro."), { codigo: "ocupado" });
      const r = {
        id: novoId(), dia, hora, cliente, fone, obs, servicos,
        total: servicos.reduce((a, s) => a + s.preco, 0), pagamento,
        status: "pendente", criadaEm: Date.now(),
        expiraEm: pagamento === "pix" ? Date.now() + MINUTOS_PIX * 60e3 : null,
      };
      d.reservas.push(r); grava(d);
      return r;
    },
    async pagarPix(id) {
      const d = le(), r = d.reservas.find((x) => x.id === id);
      if (!r || r.status !== "pendente") throw new Error("O prazo do Pix acabou. Faça a reserva de novo.");
      r.status = "confirmada"; r.pago = true; r.expiraEm = null; grava(d);
      return r;
    },
    async listar({ de, ate } = {}) {
      return le().reservas.filter((r) => (!de || r.dia >= de) && (!ate || r.dia <= ate)).sort((a, b) => (a.dia + a.hora).localeCompare(b.dia + b.hora));
    },
    async mudarStatus(id, status) {
      const d = le(), r = d.reservas.find((x) => x.id === id);
      if (r && STATUS[status]) { r.status = status; if (status !== "pendente") r.expiraEm = null; grava(d); }
      return r;
    },
    async bloqueios() { return le().bloqueios.slice().sort((a, b) => (a.dia + (a.hora || "")).localeCompare(b.dia + (b.hora || ""))); },
    async bloquear(dia, hora = null, motivo = "") {
      const d = le();
      if (!d.bloqueios.some((b) => b.dia === dia && b.hora === hora)) d.bloqueios.push({ id: novoId(), dia, hora, motivo });
      grava(d);
    },
    async desbloquear(id) { const d = le(); d.bloqueios = d.bloqueios.filter((b) => b.id !== id); grava(d); },
    /* só na demonstração: volta aos exemplos */
    async recomecar() { grava(semente(horas, diasSemana, exemplos)); },
  };
}
