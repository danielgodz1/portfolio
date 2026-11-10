import { cenaReal } from "../core.js";
import { gsap, ScrollTrigger, $, $$, reduce, iniciar, wa, abas } from "../core.js";
import { DADOS, reais, OLHO } from "./page.mjs";
import { criaAgenda, proximosDias, rotuloDia } from "../agenda.js";

const { lenis } = iniciar();
const S = Object.fromEntries(DADOS.servicos.map((s) => [s.id, s]));
// nível vem da página (as variantes usam o mesmo código); RAIZ prefixa a mídia quando a página está numa subpasta
const NIVEL = $("main").dataset.nivel, cine = NIVEL === "cinematografico", RAIZ = $("main").dataset.raiz || "";

/* Olho real: a rolagem avança o vídeo (cílios, depois sobrancelha), as linhas de mapeamento
   se desenham por cima e no fim a câmera entra na pupila */
const etapas = $$(".etapas li");
const marca = (i) => etapas.forEach((li) => li.classList.toggle("on", +li.dataset.i === i));
const hv = $(".hero__video"), midia = $(".hero__midia"), svgMapa = $(".hero__mapa");
const largo = matchMedia("(min-width: 960px)");
// no computador o vídeo cobre a tela centralizado; no celular fica preso à direita (o olho está à direita)
const alinhaX = () => (largo.matches ? 0.5 : 1);
const ajustaMapa = () => svgMapa.setAttribute("preserveAspectRatio", (largo.matches ? "xMid" : "xMax") + "YMid slice");
ajustaMapa(); largo.addEventListener("change", ajustaMapa);
if (!cine) {
  // essencial: foto parada com o mapeamento já desenhado
} else if (reduce) {
  hv.preload = "none"; hv.poster = "midia/hero-fim.jpg";
  marca(2); gsap.set(".mapa", { opacity: 0.35 });
} else {
  gsap.set(".guia", { strokeDasharray: "1 1", strokeDashoffset: 1 }); // "1 1" explícito: o tracejado do CSS não pode se misturar
  gsap.set(".ponto", { scale: 0, transformOrigin: "50% 50%" });
  marca(0);
  // posição da pupila na tela, seguindo o mesmo "cover" do vídeo
  const pupila = () => {
    const m = midia.getBoundingClientRect(), p = $(".hero__palco").getBoundingClientRect();
    const s = Math.max(m.width / OLHO.w, m.height / OLHO.h);
    const x = (m.width - OLHO.w * s) * alinhaX() + OLHO.pupila[0] * s, y = (m.height - OLHO.h * s) / 2 + OLHO.pupila[1] * s;
    return { x, y, px: m.left - p.left + x, py: m.top - p.top + y, w: m.width, h: m.height };
  };
  const circulo = (fim) => () => { const c = pupila(); return `circle(${fim ? Math.hypot(innerWidth, innerHeight) : 0}px at ${c.px}px ${c.py}px)`; };
  // vídeo pausado, posicionado pela rolagem (com guarda para não empilhar buscas)
  const prog = { p: 0 };
  let buscando = false;
  const busca = () => {
    if (!hv.duration || buscando) return;
    const t = prog.p * (hv.duration - 0.05);
    if (Math.abs(hv.currentTime - t) < 0.02) return;
    buscando = true; hv.currentTime = t;
  };
  hv.pause();
  hv.addEventListener("seeked", () => { buscando = false; busca(); });
  hv.addEventListener("loadedmetadata", busca);
  gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: ".hero__palco", start: "top top", end: "+=360%", pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: (st) => marca(st.progress < 0.29 ? 0 : st.progress < 0.45 ? 1 : 2),
    },
  })
    .to(prog, { p: 1, duration: 1.6, onUpdate: busca }, 0)
    .to(".guia", { strokeDashoffset: 0, duration: 0.25, stagger: 0.06 }, 0.7)
    .to(".ponto", { scale: 1, duration: 0.08, stagger: 0.06, ease: "back.out(3)" }, 0.9)
    .to(".mapa", { opacity: 0.3, duration: 0.3 }, 1.45)
    .to([".hero__t", ".etapas"], { opacity: 0, duration: 0.25 }, 1.75)
    .to(midia, { scale: 3.2, transformOrigin: () => { const c = pupila(); return `${(c.x / c.w) * 100}% ${(c.y / c.h) * 100}%`; }, duration: 0.75, ease: "power2.in" }, 1.75)
    .fromTo(".mergulho", { clipPath: circulo(false) }, { clipPath: circulo(true), duration: 0.6, ease: "power3.in" }, 1.9);
}

/* Catálogo */
abas($(".cat__abas"));

/* Sacola: fonte única do que foi escolhido (nos dois níveis) */
let pintaProvBotao = () => {};
const sacola = new Set();
const total = () => [...sacola].reduce((a, id) => a + S[id].preco, 0);
const pintaSacola = () => {
  $(".sacola-n").textContent = sacola.size;
  $$("[data-add]").forEach((b) => { const on = sacola.has(b.dataset.add); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  pintaProvBotao();
};
const alterna = (id) => { sacola.has(id) ? sacola.delete(id) : sacola.add(id); pintaSacola(); };
document.addEventListener("click", (e) => { const b = e.target.closest("[data-add]"); if (b) alterna(b.dataset.add); });

/* Provador: cada efeito redesenha os cílios (só no cinematográfico) */
if ($(".prov")) {
const efeitos = DADOS.servicos.filter((s) => s.forma);
const NS = "http://www.w3.org/2000/svg";
const gc = $(".prova-cilios");
const N = 40;
const fios = Array.from({ length: N }, () => ["fio-c", "fio-l", "fio-l"].map((c) => { const p = document.createElementNS(NS, "path"); p.setAttribute("class", c); gc.appendChild(p); return p; }));
const bez = (t, a, b, c) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t * t * c;
const n1 = (n) => n.toFixed(1);
const forma = { ...efeitos[0].forma };
const desenha = () => {
  const f = forma;
  fios.forEach(([c, l1, l2], i) => {
    const t = 0.04 + (i / (N - 1)) * 0.93;
    const x = bez(t, 110, 300, 490), y = bez(t, 210, 80, 210);
    const dx = 2 * (1 - t) * 190 + 2 * t * 190, dy = 2 * (1 - t) * -130 + 2 * t * 130;
    const L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L;
    const len = Math.max(8, f.a + f.b * Math.sin(t * Math.PI) + f.c * t * t + f.p * (i % 4 === 0 ? 1 : -0.35));
    const ex = x + nx * len + f.l * t, ey = y + ny * len;
    const cx = x + nx * len * 0.65 - 6 * f.r, cy = y + ny * len * (0.25 + 0.3 * (1 - f.r)) - 2;
    const d = (a) => `M${n1(x)} ${n1(y)}Q${n1(cx + a * 0.4)} ${n1(cy)} ${n1(ex + a)} ${n1(ey)}`;
    c.setAttribute("d", d(0));
    const a = 6 + len * 0.16;
    l1.setAttribute("d", d(-a)); l2.setAttribute("d", d(a));
  });
  const v = gc.style;
  v.setProperty("--dens", f.d.toFixed(2));
  v.setProperty("--tinta", `rgb(${Math.round(247 - 46 * f.m)},${Math.round(236 - 93 * f.m)},${Math.round(230 - 122 * f.m)})`); // fundo escuro: creme ou caramelo
};
desenha();

const provBts = $$(".prov__trilho button");
const provAdd = $("#prov-add");
let provI = 0;
pintaProvBotao = () => {
  const on = sacola.has(efeitos[provI].id);
  provAdd.textContent = on ? "Remover da sacola" : "Adicionar à sacola";
};
const mostra = (i) => {
  if (i === provI && $(".prov__nome").dataset.ok) return;
  provI = i;
  const s = efeitos[i];
  $(".prov__nome").dataset.ok = 1;
  $(".prov__nome").textContent = s.nome;
  $(".prov__texto").textContent = s.texto;
  $(".prov__preco").textContent = reais(s.preco);
  $(".prov__foto").src = RAIZ + s.foto;
  const rail = $(".prov__trilho");
  provBts.forEach((b, k) => { b.setAttribute("aria-pressed", k === i); if (k === i) rail.scrollTo({ left: b.offsetLeft - (rail.clientWidth - b.offsetWidth) / 2, behavior: "smooth" }); });
  pintaProvBotao();
  if (reduce) { Object.assign(forma, s.forma); desenha(); }
  else { gsap.killTweensOf(forma); gsap.to(forma, { ...s.forma, duration: 0.5, ease: "power2.out", onUpdate: desenha }); }
};
provAdd.addEventListener("click", () => alterna(efeitos[provI].id));
let provST = null;
if (!reduce && cine) {
  provST = ScrollTrigger.create({
    trigger: ".prov__palco", start: "top top", end: "+=" + efeitos.length * 45 + "%", pin: true, anticipatePin: 1,
    onUpdate: (st) => mostra(Math.min(efeitos.length - 1, Math.floor(st.progress * efeitos.length))),
  });
}
provBts.forEach((b, i) => b.addEventListener("click", () => {
  if (provST) lenis.scrollTo(provST.start + ((i + 0.5) / efeitos.length) * (provST.end - provST.start));
  else mostra(i);
}));
}

/* Antes e depois */
const ad = $(".ad__quadro");
if (ad) $("input", ad).addEventListener("input", (e) => ad.style.setProperty("--p", e.target.value + "%"));

/* Régua: trilho horizontal preso à rolagem */
if (!reduce && cine && $(".regua")) {
  const tr = $(".regua__trilho");
  const dist = () => Math.max(0, tr.scrollWidth - $(".regua__janela").clientWidth);
  gsap.to(tr, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: ".regua__palco", start: "top top", end: () => "+=" + dist() * 1.1, pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true } });
}

/* Cursos: o nome digitado aparece no certificado */
const cur = $("#cur");
if (cur) {
const pintaCert = () => { $("#cert-n").textContent = cur.nome.value.trim() || "Seu nome aqui"; $("#cert-c").textContent = cur.curso.value; };
cur.addEventListener("input", pintaCert);
cur.addEventListener("submit", (e) => {
  e.preventDefault();
  const n = cur.nome.value.trim();
  window.open(wa(DADOS.whatsapp, `Olá!${n ? ` Meu nome é ${n}.` : ""} Quero saber valor e datas do curso: ${cur.curso.value}.`), "_blank", "noopener");
});
}

const ck = $("#ck");
$("#ck-x").addEventListener("click", () => ck.close());
ck.addEventListener("click", (e) => {
  const r = e.target.closest("[data-rem]");
  if (r) { sacola.delete(r.dataset.rem); pintaSacola(); pintaItens(); }
  if (e.target === ck) ck.close();
});
const itensHtml = () => [...sacola].map((id) => { const s = S[id]; return `<li><img src="${RAIZ + s.mini}" alt="" width="56" height="56"><span>${s.nome}</span><b>${reais(s.preco)}</b><button type="button" class="ck__rem" data-rem="${id}" aria-label="Remover ${s.nome}">Remover</button></li>`; }).join("");
let pintaItens = () => {};

/* Essencial: pedido simples, sem agenda nem pagamento */
const pd = $("#pd");
if (pd) {
  pintaItens = () => {
    $(".ck__itens").innerHTML = itensHtml();
    $(".ck__vazio").hidden = sacola.size > 0;
    $(".ck__total b").textContent = reais(total());
  };
  const abre = () => { pintaItens(); $(".ck__erro").hidden = true; ck.showModal(); if (lenis) lenis.stop(); };
  $("#abre-sacola").addEventListener("click", abre);
  const ver = $("#ver-pedido");
  if (ver) ver.addEventListener("click", abre);
  ck.addEventListener("close", () => { if (lenis) lenis.start(); });
  pd.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!sacola.size) { const er = $(".ck__erro"); er.textContent = "Escolha pelo menos um serviço."; er.hidden = false; return; }
    const nome = pd.cliente.value.trim(), obs = pd.obs.value.trim();
    const linhas = [...sacola].map((id) => `• ${S[id].nome} (${reais(S[id].preco)})`);
    const msg = `Olá! Vim pelo site.${nome ? ` Meu nome é ${nome}.` : ""}\nTenho interesse em:\n${linhas.join("\n")}\nTotal estimado: ${reais(total())}.${obs ? `\nObservações: ${obs}` : ""}\nPodemos combinar o dia e o horário?`;
    window.open(wa(DADOS.whatsapp, msg), "_blank", "noopener");
  });
}

/* Cinematográfico: sacola, horário (agenda), dados, pagamento, Pix e confirmação */
const f = $("#ck-f");
if (f) {
const agenda = criaAgenda({ estudio: "beleza", horas: DADOS.horas, exemplos: DADOS.servicos.map(({ id, nome, preco }) => ({ id, nome, preco })) });
const TITULOS = ["Sua sacola", "Escolha o horário", "Seus dados", "Pagamento", "Pague o sinal", "Tudo certo"];
const SEGUE = ["Escolher horário", "Informar dados", "Ir para pagamento", "Reservar horário", "", "Avisar o estúdio pelo WhatsApp"];
let passo = 0, reserva = null, relogio = 0;
const quando = (dia, hora) => `${rotuloDia(dia, { weekday: "long", day: "numeric", month: "long" })}, às ${hora}`;

$(".ck__dias").innerHTML = proximosDias(10, agenda.diasSemana).map((dia) =>
  `<label class="chip chip--dia"><input type="radio" name="dia" value="${dia}"><span><small>${rotuloDia(dia, { weekday: "short" })}</small>${rotuloDia(dia, { day: "2-digit", month: "2-digit" })}</span></label>`).join("");
// ao escolher o dia, a agenda diz quais horários ainda estão livres
const pintaHoras = async () => {
  const dia = f.dia.value;
  if (!dia) return;
  const lista = await agenda.livres(dia), n = lista.filter((x) => x.livre).length;
  $(".ck__dica").textContent = n ? `${n} ${n > 1 ? "horários livres" : "horário livre"} em ${rotuloDia(dia, { weekday: "long", day: "numeric", month: "long" })}.` : "Esse dia está lotado. Escolha outro.";
  lista.forEach(({ hora, livre }) => {
    const inp = f.querySelector(`[name="hora"][value="${hora}"]`);
    inp.disabled = !livre; inp.closest(".chip").classList.toggle("chip--oc", !livre);
    if (!livre && inp.checked) inp.checked = false;
  });
};
$(".ck__dias").addEventListener("change", pintaHoras);

pintaItens = () => {
  $(".ck__itens").innerHTML = itensHtml();
  $(".ck__vazio").hidden = sacola.size > 0;
  $(".ck__total b").textContent = reais(total());
  $(".pg__sinal").textContent = `Sinal de ${reais(total() * DADOS.sinal)} agora, o restante no dia.`;
};
const resumo = (alvo, r) => {
  alvo.innerHTML = [["Serviços", r.servicos.map((s) => s.nome).join(", ")], ["Quando", quando(r.dia, r.hora)], ["Para", r.cliente], ["Total", reais(r.total)]]
    .concat(r.id ? [["Código", r.id]] : []).map(([k, v]) => `<dt>${k}</dt><dd>${String(v).replace(/</g, "&lt;")}</dd>`).join("");
};
const itensSacola = () => [...sacola].map((id) => ({ id, nome: S[id].nome, preco: S[id].preco }));

// Pix de exemplo: QR desenhado só para a demonstração (não é um código válido)
const qr = (semente) => {
  let d = "", h = 0;
  for (const c of semente) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const olho = (x, y) => (d += `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`);
  olho(0, 0); olho(22, 0); olho(0, 22);
  for (let y = 0; y < 29; y++) for (let x = 0; x < 29; x++) {
    if ((x < 8 && y < 8) || (x > 20 && y < 8) || (x < 8 && y > 20)) continue;
    h = (h * 1103515245 + 12345) >>> 0;
    if (h & 0x10000) d += `M${x} ${y}h1v1h-1z`;
  }
  $(".pix__mod").setAttribute("d", d);
};
const contaPix = () => {
  clearInterval(relogio);
  const passa = () => {
    const falta = Math.max(0, reserva.expiraEm - Date.now()), m = Math.floor(falta / 60e3), s = Math.floor((falta % 60e3) / 1e3);
    $(".pix__tempo").textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    if (!falta) { clearInterval(relogio); vai(1); pintaHoras(); erro("O prazo do Pix acabou e o horário foi liberado. Escolha de novo."); }
  };
  passa(); relogio = setInterval(passa, 1000);
};

const vai = (p) => {
  passo = p;
  $$("section[data-p]", ck).forEach((s) => (s.hidden = +s.dataset.p !== p));
  $("#ck-t").textContent = TITULOS[p];
  $$(".ck__passos li", ck).forEach((l, i) => l.classList.toggle("on", i <= p));
  $("#ck-seg").textContent = SEGUE[p];
  $("#ck-seg").hidden = p === 4;
  $("#ck-volta").hidden = p === 0 || p >= 4;
  $("#ck-sim").hidden = p !== 4;
  $(".ck__erro").hidden = true;
  if (p === 3) resumo($(".ck__res"), { servicos: itensSacola(), dia: f.dia.value, hora: f.hora.value, cliente: f.cliente.value.trim(), total: total() });
  if (p === 4) { $(".pix__valor").textContent = reais(reserva.total * DADOS.sinal); $(".pix__codigo").value = `00020126EXEMPLO${reserva.id}5204000053039865802BR5913${DADOS.nome.toUpperCase()}6304DEMO`; qr(reserva.id); contaPix(); }
  if (p === 5) {
    clearInterval(relogio);
    $(".ok__txt").textContent = reserva.status === "confirmada" ? "Sinal pago. Seu horário está confirmado." : "O estúdio vai confirmar seu horário pelo WhatsApp.";
    resumo($(".ok__res"), reserva);
    sacola.clear(); pintaSacola();
  }
  ck.scrollTop = 0;
};
const erro = (m) => { const e = $(".ck__erro"); e.textContent = m; e.hidden = false; };
const valida = () => {
  if (passo === 0 && !sacola.size) return "Escolha pelo menos um serviço.";
  if (passo === 1 && (!f.dia.value || !f.hora.value)) return "Escolha o dia e um horário livre.";
  if (passo === 2 && f.cliente.value.trim().length < 2) return "Informe seu nome.";
  if (passo === 2 && f.fone.value.replace(/\D/g, "").length < 10) return "Informe um WhatsApp com DDD.";
  return "";
};
const envia = () => {
  const r = reserva;
  const msg = `Olá! Fiz a reserva ${r.id} pelo site: ${r.servicos.map((s) => s.nome).join(", ")}, ${quando(r.dia, r.hora)}. Total: ${reais(r.total)}. ${r.status === "confirmada" ? "Sinal pago por Pix." : "Pagamento no estúdio."}${r.obs ? ` Observações: ${r.obs}.` : ""}`;
  window.open(wa(DADOS.whatsapp, msg), "_blank", "noopener");
};
f.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (passo === 5) { envia(); return; }
  const m = valida();
  if (m) { erro(m); return; }
  if (passo < 3) { vai(passo + 1); return; }
  try {
    reserva = await agenda.reservar({ dia: f.dia.value, hora: f.hora.value, servicos: itensSacola(), cliente: f.cliente.value.trim(), fone: f.fone.value.replace(/\D/g, ""), obs: f.obs.value.trim(), pagamento: f.pag.value });
    vai(reserva.pagamento === "pix" ? 4 : 5);
  } catch (err) {
    if (err.codigo === "ocupado") { await pintaHoras(); vai(1); }
    erro(err.message);
  }
});
$("#ck-volta").addEventListener("click", () => vai(passo - 1));
$("#ck-sim").addEventListener("click", async () => {
  try { reserva = await agenda.pagarPix(reserva.id); vai(5); } catch (err) { erro(err.message); }
});
ck.addEventListener("close", () => { clearInterval(relogio); if (lenis) lenis.start(); });
$("#abre-sacola").addEventListener("click", () => { pintaItens(); vai(0); ck.showModal(); if (lenis) lenis.stop(); });
}

/* por último: as seções fixadas acima precisam ser medidas antes */
cenaReal();
ScrollTrigger.sort();
ScrollTrigger.refresh();
