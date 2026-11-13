import { PADRAO, PRESETS, LIMITES, normalizarCfg } from "./pecas.mjs";
import { linhasTabela, resumo, mensagem } from "./tabela.mjs";
import { iniciarArmario } from "./armario.js";

const CHAVE_LS = "veio-marcenaria-cfg";
const CAMPOS = ["L", "A", "P", "portas", "gavetas", "acabamento", "puxador"];
const mesmoCfg = (a, b) => CAMPOS.every((k) => a[k] === b[k]);

/* Configurador: o formulário e a URL mandam no estado; localStorage, tabela, preço, WhatsApp e armário 3D seguem o estado. */
export function iniciarMovel({ gsap, capitulos, irPara, $, $$, reduce, DADOS, wa }) {
  const sec = $("#movel"); if (!sec) return;
  const form = $("#configurador"), palco = $(".mv__canvas"), corpo = $("#r-corpo");
  const btDesfazer = $("#cfg-desfazer"), btReset = $("#cfg-resetar"), anuncio = $("#r-anuncio");
  const cfg = { ...PADRAO }, travados = new Set(), historico = [];
  let arm = null, progresso = reduce ? 1 : 0, timerAnuncio = 0, timerRange = 0, aguardandoRange = false;

  const cfgDaUrl = () => {
    const s = new URLSearchParams(location.search);
    if (!["L", "A", "P", "pt", "gv", "ac", "px"].some((k) => s.has(k))) return null;
    return { L: s.get("L"), A: s.get("A"), P: s.get("P"), portas: s.get("pt"), gavetas: s.get("gv"), acabamento: s.get("ac"), puxador: s.get("px") };
  };
  const cfgDoStorage = () => { try { return JSON.parse(localStorage.getItem(CHAVE_LS) || "null"); } catch { return null; } };
  const paramsDe = (c) => ({ L: c.L, A: c.A, P: c.P, pt: c.portas, gv: c.gavetas, ac: c.acabamento, px: c.puxador });
  const linkAtual = (c) => {
    const u = new URL(location.href);
    for (const [k, v] of Object.entries(paramsDe(c))) u.searchParams.set(k, String(v));
    u.hash = "configurador";
    return u.toString();
  };
  const persistir = (atualizarUrl) => {
    try { localStorage.setItem(CHAVE_LS, JSON.stringify(cfg)); } catch {}
    if (!atualizarUrl) return;
    try {
      const u = new URL(location.href);
      for (const [k, v] of Object.entries(paramsDe(cfg))) u.searchParams.set(k, String(v));
      history.replaceState(null, "", u.pathname + "?" + u.searchParams.toString() + u.hash);
    } catch {}
  };

  const escreverForm = (c) => {
    for (const k of CAMPOS) form.elements[k].value = String(c[k]);
  };
  const ler = () => {
    for (const k of ["L", "A", "P", "portas", "gavetas"]) cfg[k] = +form.elements[k].value;
    cfg.acabamento = form.elements.acabamento.value; cfg.puxador = form.elements.puxador.value;
  };
  const empurrarHist = (snap) => {
    if (historico.length && mesmoCfg(historico[historico.length - 1], snap)) return;
    historico.push(snap);
    if (historico.length > 20) historico.shift();
    if (btDesfazer) btDesfazer.disabled = !historico.length;
  };
  const anunciarDepois = (texto) => {
    clearTimeout(timerAnuncio);
    timerAnuncio = setTimeout(() => { if (anuncio) anuncio.textContent = texto; }, 450);
  };

  const atualiza = (porUsuario = false, comUrl = porUsuario) => {
    for (const k of ["L", "A", "P"]) $(`output[for="cfg-${k}"]`, form).textContent = cfg[k] + " cm";
    const r = resumo(cfg, DADOS), larg = cfg.L / cfg.portas;
    const aviso = larg > 70 ? "Cada porta ficou com mais de 70 cm de largura. Portas largas empenam com o tempo: uma porta a mais resolve." : larg < 25 ? "Cada porta ficou menos de 25 cm de largura. Uma porta a menos fica mais simples de usar." : "";
    const link = linkAtual(cfg);
    $("#r-preco").textContent = r.preco; $("#r-linha").textContent = r.linha;
    corpo.innerHTML = linhasTabela(cfg, travados);
    $("#r-zap").href = wa(DADOS.whatsapp, mensagem(cfg, DADOS, link));
    $(".cfg__aviso").textContent = aviso;
    for (const b of $$(".cfg__preset")) {
      const p = PRESETS.find((x) => x.id === b.dataset.preset);
      b.setAttribute("aria-pressed", String(!!p && mesmoCfg(cfg, p.cfg)));
    }
    const btGav = $(`.mv__acoes button[data-abrir="gaveta"]`);
    if (btGav) { btGav.disabled = cfg.gavetas === 0; if (cfg.gavetas === 0) btGav.setAttribute("aria-pressed", "false"); }
    if (arm) arm.aplicar(cfg);
    if (porUsuario) {
      persistir(comUrl);
      anunciarDepois(`${r.preco}, ${r.linha}${aviso ? ". " + aviso : ""}`);
    } else if (comUrl) {
      persistir(true);
    }
  };

  const desfazer = () => {
    aguardandoRange = false; clearTimeout(timerRange);
    const ant = historico.pop(); if (!ant) return;
    Object.assign(cfg, ant); escreverForm(cfg); atualiza(true, true);
    if (btDesfazer) btDesfazer.disabled = !historico.length;
  };

  const temUrl = cfgDaUrl();
  Object.assign(cfg, normalizarCfg(temUrl || cfgDoStorage() || PADRAO, DADOS));
  escreverForm(cfg);

  form.addEventListener("input", (e) => {
    const antes = { ...cfg };
    ler();
    if (mesmoCfg(antes, cfg)) return;
    if (e.target.type === "range") {
      if (!aguardandoRange) { empurrarHist(antes); aguardandoRange = true; }
      clearTimeout(timerRange);
      timerRange = setTimeout(() => { aguardandoRange = false; }, 600);
    } else {
      aguardandoRange = false; empurrarHist(antes);
    }
    atualiza(true, true);
  });
  form.addEventListener("change", (e) => { if (e.target.type === "range") { aguardandoRange = false; clearTimeout(timerRange); } });
  form.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); desfazer(); } });
  form.addEventListener("submit", (e) => e.preventDefault());

  $$(".cfg__preset").forEach((b) => b.addEventListener("click", () => {
    const p = PRESETS.find((x) => x.id === b.dataset.preset); if (!p || mesmoCfg(cfg, p.cfg)) return;
    aguardandoRange = false; empurrarHist({ ...cfg });
    Object.assign(cfg, normalizarCfg(p.cfg, DADOS)); escreverForm(cfg); atualiza(true, true);
  }));
  btDesfazer?.addEventListener("click", desfazer);
  btReset?.addEventListener("click", () => {
    if (mesmoCfg(cfg, PADRAO)) return;
    aguardandoRange = false; empurrarHist({ ...cfg });
    Object.assign(cfg, PADRAO); escreverForm(cfg); atualiza(true, true);
  });

  const btComp = $("#r-compartilhar");
  btComp?.addEventListener("click", async () => {
    const url = linkAtual(cfg);
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try { await navigator.share({ title: DADOS.marca, text: resumo(cfg, DADOS).linha, url }); return; } catch {}
    }
    let ok = false;
    try { await navigator.clipboard.writeText(url); ok = true; } catch {
      const ta = document.createElement("textarea");
      ta.value = url; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch {}
      ta.remove();
    }
    if (!ok) return;
    btComp.textContent = "Link copiado!"; btComp.classList.add("ok");
    if (anuncio) anuncio.textContent = "Link desta configuração copiado.";
    setTimeout(() => { btComp.textContent = "Compartilhar configuração"; btComp.classList.remove("ok"); }, 2200);
  });

  /* lista de corte <-> peça no 3D: passar o mouse ou focar acende a peça; clicar trava */
  corpo.addEventListener("pointerover", (e) => { const b = e.target.closest(".pc-bt"); if (b && arm) arm.destacar(b.dataset.id); });
  corpo.addEventListener("pointerout", (e) => { if (e.target.closest(".pc-bt") && arm) arm.destacar(null); });
  corpo.addEventListener("focusin", (e) => { const b = e.target.closest(".pc-bt"); if (b && arm) arm.destacar(b.dataset.id); });
  corpo.addEventListener("focusout", (e) => { if (e.target.closest(".pc-bt") && arm) arm.destacar(null); });
  corpo.addEventListener("click", (e) => {
    const b = e.target.closest(".pc-bt"); if (!b) return;
    const sim = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", sim); sim ? travados.add(b.dataset.id) : travados.delete(b.dataset.id);
    if (arm) arm.travar(b.dataset.id, sim);
  });
  $$(".mv__acoes button[data-abrir]").forEach((b) => b.addEventListener("click", () => {
    const sim = b.getAttribute("aria-pressed") !== "true"; if (arm) arm.abrir(b.dataset.abrir, sim);
  }));
  $("#mv-reset")?.addEventListener("click", () => { arm?.resetarVista(); });

  palco.addEventListener("keydown", (ev) => {
    const k = ev.key;
    if (k === "+" || k === "=" || k === "-" || k === "_") {
      ev.preventDefault();
      const campo = ev.altKey ? "P" : ev.shiftKey ? "A" : "L", delta = k === "+" || k === "=" ? 5 : -5;
      const [min, max] = LIMITES[campo], novo = Math.min(max, Math.max(min, cfg[campo] + delta));
      if (novo === cfg[campo]) return;
      empurrarHist({ ...cfg }); cfg[campo] = novo; escreverForm(cfg); atualiza(true, true);
    } else if (k === "p" || k === "P") {
      ev.preventDefault();
      const b = $(`.mv__acoes button[data-abrir="porta"]`);
      arm?.abrir("porta", b?.getAttribute("aria-pressed") !== "true");
    } else if (k === "g" || k === "G") {
      ev.preventDefault();
      if (cfg.gavetas === 0) return;
      const b = $(`.mv__acoes button[data-abrir="gaveta"]`);
      arm?.abrir("gaveta", b?.getAttribute("aria-pressed") !== "true");
    } else if (k === "r" || k === "R" || k === "0") {
      ev.preventDefault();
      arm?.resetarVista();
    }
  });

  // amostras da seção de materiais: "Usar no meu armário"
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-usar]"); if (!b) return;
    if (cfg.acabamento !== b.dataset.usar) {
      empurrarHist({ ...cfg }); form.elements.acabamento.value = b.dataset.usar; ler(); atualiza(true, true);
    }
    irPara("#configurador");
  });

  /* 3D: só nasce perto da tela; capítulos sem zona morta e respeitando reduce */
  const trig = capitulos({
    trigger: ".mv__passos",
    start: "top 68%",
    end: "bottom 62%",
    etapas: ".mv__passos .passo",
    aoProgresso: (p) => { progresso = p; if (arm) arm.progresso(progresso); },
  });
  const montar = () => {
    try {
      arm = iniciarArmario({
        canvas: $("canvas", palco), palco, rotulos: $(".mv__rotulos", palco), gsap, reduce, catalogo: DADOS,
        aoInteragir: (sim) => {
          if (sim) $(".mv__dica", palco)?.classList.add("oculta");
          const rs = $("#mv-reset"); if (rs) rs.hidden = !sim;
        },
        aoAlternar: (tipo, aberto) => {
          const b = $(`.mv__acoes button[data-abrir="${tipo}"]`);
          if (b) b.setAttribute("aria-pressed", String(!!aberto));
        },
      });
    } catch (e) { arm = null; }
    if (!arm) { $(".mv__falha").hidden = false; $(".mv__acoes").hidden = true; return; }
    arm.aplicar(cfg); arm.progresso(reduce ? 1 : trig ? trig.progress : progresso);
    for (const id of travados) arm.travar(id, true);
  };
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); montar(); } }, { rootMargin: "600px 0px" }).observe(palco);
  atualiza(false, !!temUrl);
}
