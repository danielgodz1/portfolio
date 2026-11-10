// Painel da dona: agenda do estúdio, confirmações e bloqueios. Usa a mesma camada de dados do site (agenda.js).
import { criaAgenda, STATUS, proximosDias, rotuloDia, isoDia } from "./agenda.js";

const m = new URLSearchParams(location.search).get("m") || "beleza";
if (!/^[a-z0-9-]+$/.test(m)) throw new Error("modelo inválido");
const BASE = `../${m}/`;
const $ = (s) => document.querySelector(s);
const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let agenda, D, filtro = "todos", diaBloq = null;
const FILTROS = { todos: "Todos", pendente: "Aguardando", confirmada: "Confirmadas", concluida: "Atendidas", cancelada: "Canceladas" };

const maiuscula = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const somaDias = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return isoDia(d); };

async function pintaAgenda() {
  const hoje = isoDia(new Date()), sete = somaDias(7);
  const todas = await agenda.listar({ de: hoje, ate: somaDias(30) });
  const ativas = todas.filter((r) => ["pendente", "confirmada", "concluida"].includes(r.status));
  const semana = ativas.filter((r) => r.dia <= sete);
  $("#cards").innerHTML = [
    [ativas.filter((r) => r.dia === hoje).length, "Hoje"],
    [semana.length, "Próximos 7 dias"],
    [todas.filter((r) => r.status === "pendente").length, "Aguardando confirmação"],
    [brl(semana.reduce((a, r) => a + r.total, 0)), "Previsto em 7 dias"],
  ].map(([n, t]) => `<div class="card"><b>${n}</b><span>${t}</span></div>`).join("");
  $("#filtros").innerHTML = Object.entries(FILTROS).map(([k, t]) => `<button type="button" class="peq" data-f="${k}" aria-pressed="${k === filtro}">${t}</button>`).join("");
  const lista = todas.filter((r) => (filtro === "todos" ? r.status !== "expirada" : r.status === filtro));
  if (!lista.length) { $("#lista").innerHTML = `<p class="vazio">Nenhum horário ${filtro === "todos" ? "nos próximos 30 dias" : "com essa situação"}.</p>`; return; }
  const porDia = {};
  lista.forEach((r) => (porDia[r.dia] ||= []).push(r));
  $("#lista").innerHTML = Object.entries(porDia).map(([dia, rs]) => `<div class="dia"><h2>${dia === hoje ? "Hoje, " : ""}${maiuscula(rotuloDia(dia, { weekday: "long", day: "numeric", month: "long" }))}</h2>${rs.map(linha).join("")}</div>`).join("");
}

function linha(r) {
  const acoes = [];
  if (r.status === "pendente") acoes.push(`<button type="button" class="peq prim" data-st="confirmada" data-id="${r.id}">Confirmar</button>`);
  if (r.status === "confirmada") acoes.push(`<button type="button" class="peq" data-st="concluida" data-id="${r.id}">Marcar atendida</button>`);
  if (["pendente", "confirmada"].includes(r.status)) acoes.push(`<button type="button" class="peq" data-st="cancelada" data-id="${r.id}">Cancelar</button>`);
  const quando = `${rotuloDia(r.dia, { weekday: "long", day: "numeric", month: "long" })}, às ${r.hora}`, nome = r.cliente.replace(/ \(exemplo\)$/, "");
  const texto = r.status === "confirmada" ? `Olá, ${nome}! Sua reserva no ${D.nome} para ${quando} está confirmada. Até lá!`
    : r.status === "pendente" ? `Olá, ${nome}! Recebemos seu pedido no ${D.nome} para ${quando}. Posso confirmar esse horário?`
    : `Olá, ${nome}! Sobre seu horário no ${D.nome} (${quando}):`;
  const msg = encodeURIComponent(texto);
  acoes.push(`<a class="bt peq" href="https://wa.me/${r.fone}?text=${msg}" target="_blank" rel="noopener">WhatsApp</a>`);
  const pag = r.pagamento === "pix" ? (r.pago ? "sinal pago no Pix" : "Pix aguardando") : "paga no estúdio";
  return `<div class="res"><span class="res__h">${r.hora}</span>
    <div class="res__c"><b>${esc(r.cliente)}</b><small>${esc(r.servicos.map((s) => s.nome).join(", "))} · ${brl(r.total)} · ${pag}${r.obs ? " · " + esc(r.obs) : ""}</small><br><span class="selo selo--${r.status}">${STATUS[r.status]}</span></div>
    <div class="res__acoes">${acoes.join("")}</div></div>`;
}

async function pintaBloq() {
  const dias = proximosDias(14, agenda.diasSemana, 0);
  if (!diaBloq || !dias.includes(diaBloq)) diaBloq = dias[0];
  $("#bl-dias").innerHTML = dias.map((d) => `<button type="button" data-dia="${d}" aria-pressed="${d === diaBloq}"><small>${rotuloDia(d, { weekday: "short" })}</small>${rotuloDia(d, { day: "2-digit", month: "2-digit" })}</button>`).join("");
  const bl = await agenda.bloqueios(), rs = (await agenda.listar({ de: diaBloq, ate: diaBloq })).filter((r) => ["pendente", "confirmada", "concluida"].includes(r.status));
  const diaTodo = bl.find((b) => b.dia === diaBloq && !b.hora);
  $("#bl-horas").innerHTML = agenda.horas.map((h) => {
    const r = rs.find((x) => x.hora === h), b = bl.find((x) => x.dia === diaBloq && x.hora === h);
    if (r) return `<button type="button" class="h--res" disabled>${h}<small>${esc(r.cliente)}</small></button>`;
    if (diaTodo) return `<button type="button" class="h--bloq" disabled>${h}<small>dia bloqueado</small></button>`;
    return b ? `<button type="button" class="h--bloq" data-desb="${b.id}">${h}<small>bloqueado · liberar</small></button>`
             : `<button type="button" data-bloq="${h}">${h}<small>livre · bloquear</small></button>`;
  }).join("");
  $("#bl-dia").textContent = diaTodo ? "Liberar o dia inteiro" : "Bloquear o dia inteiro";
  $("#bl-dia").dataset.id = diaTodo ? diaTodo.id : "";
  $("#bl-lista").innerHTML = bl.length ? bl.map((b) => `<li><span><b>${rotuloDia(b.dia)}</b> · ${b.hora || "dia inteiro"}${b.motivo ? " · " + esc(b.motivo) : ""}</span><button type="button" class="peq" data-desb="${b.id}">Remover</button></li>`).join("") : `<li>Nenhum bloqueio marcado.</li>`;
}

const pinta = () => Promise.all([pintaAgenda(), pintaBloq()]);

function liga() {
  $("#lista").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-st]");
    if (!b) return;
    if (b.dataset.st === "cancelada" && !confirm("Cancelar este horário? Ele volta a ficar livre no site.")) return;
    await agenda.mudarStatus(b.dataset.id, b.dataset.st); pinta();
  });
  $("#filtros").addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (b) { filtro = b.dataset.f; pintaAgenda(); } });
  $("#v-bloq").addEventListener("click", async (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.dia) { diaBloq = t.dataset.dia; return pintaBloq(); }
    if (t.dataset.bloq) { await agenda.bloquear(diaBloq, t.dataset.bloq, $("#bl-motivo").value.trim()); return pinta(); }
    if (t.dataset.desb) { await agenda.desbloquear(t.dataset.desb); return pinta(); }
    if (t.id === "bl-dia") {
      if (t.dataset.id) await agenda.desbloquear(t.dataset.id);
      else await agenda.bloquear(diaBloq, null, $("#bl-motivo").value.trim());
      return pinta();
    }
  });
  const abas = [["#t-agenda", "#v-agenda"], ["#t-bloq", "#v-bloq"]];
  abas.forEach(([t, v]) => $(t).addEventListener("click", () => abas.forEach(([t2, v2]) => {
    const on = t2 === t; $(t2).setAttribute("aria-selected", on); $(t2).tabIndex = on ? 0 : -1; $(v2).hidden = !on;
  })));
  $("#recomeca").addEventListener("click", async () => { if (confirm("Apagar as reservas desta demonstração e voltar aos exemplos?")) { await agenda.recomecar(); pinta(); } });
  // reserva feita no site em outra aba aparece aqui sozinha
  addEventListener("storage", (e) => { if (e.key === `agenda-${m}`) pinta(); });
}

const abre = () => { $("#entrar").hidden = true; $("#app").hidden = false; try { sessionStorage.setItem("painel-demo", "1"); } catch {} };
fetch(BASE + "dados.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).then((d) => {
  D = d;
  agenda = criaAgenda({ estudio: m, horas: d.horas, exemplos: d.servicos.map(({ id, nome, preco }) => ({ id, nome, preco })) });
  $("#qual").textContent = d.nome; $("#ver").href = BASE;
  liga(); pinta();
  $("#entra").addEventListener("click", abre);
  try { if (sessionStorage.getItem("painel-demo")) abre(); } catch {}
}).catch(() => { $("#entrar div").innerHTML = `<h1>Painel do estúdio</h1><p>Não encontrei os dados do modelo "${esc(m)}". Confira o endereço da página.</p>`; });
