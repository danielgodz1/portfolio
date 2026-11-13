import { PADRAO, LIMITES, PE, calcular, num, moeda, meses } from "./quantitativo.mjs";
import { linhasPavimentos, quantitativoHtml, ganttHtml, mensagemObra } from "./page.mjs";
import { iniciarPredio } from "./predio.js";

const CHAVE_LS = "cotazero-engenharia-cfg";
const CAMS = ["estr", "hid", "ele", "veda"];
const clamp = (v, def, [a, b], passo = 1) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.min(b, Math.max(a, Math.round(n / passo) * passo));
};

/* Obra virtual: o formulário e a URL mandam no estado; localStorage, quantitativo, cronograma, pavimentos, link do WhatsApp e prédio 3D seguem o estado.
   A rolagem só diz até onde a obra chegou. Devolve getCfg() para o formulário de orçamento. */
export function iniciarObra({ gsap, capitulos, $, $$, reduce, DADOS, wa }) {
  const sec = $("#obra"); if (!sec) return { getCfg: () => ({ ...PADRAO }), mexeu: () => false };
  const form = $("#configurador"), palco = $(".ob__canvas"), corpo = $("#r-corpo");
  const btReset = $("#cfg-resetar"), anuncio = $("#r-anuncio"), svgElev = $("#ob-elevacao");
  const cfg = { ...PADRAO }, cam = { estr: true, hid: true, ele: true, veda: true };
  let corte = PADRAO.andares, selecionado = null, arm = null, armFalhou = false, mexeu = false, timerAnuncio = 0;

  const estadoDaUrl = () => {
    const s = new URLSearchParams(location.search);
    if (!["andares", "L", "D", "corte", "cam"].some((k) => s.has(k))) return null;
    const rawCam = s.get("cam");
    return {
      andares: s.get("andares"), L: s.get("L"), D: s.get("D"), corte: s.get("corte"),
      cam: rawCam == null ? null : rawCam.split(",").filter(Boolean),
    };
  };
  const estadoDoStorage = () => { try { return JSON.parse(localStorage.getItem(CHAVE_LS) || "null"); } catch { return null; } };
  const normalizar = (raw) => {
    if (!raw || typeof raw !== "object") return null;
    const andares = clamp(raw.andares, PADRAO.andares, LIMITES.andares, 1);
    const L = clamp(raw.L, PADRAO.L, LIMITES.L, 2);
    const D = clamp(raw.D, PADRAO.D, LIMITES.D, 2);
    const ct = raw.corte != null && Number.isFinite(Number(raw.corte)) ? Math.min(andares, Math.max(1, Math.round(Number(raw.corte)))) : andares;
    const outCam = { estr: true, hid: true, ele: true, veda: true };
    if (Array.isArray(raw.cam)) {
      for (const k of CAMS) outCam[k] = raw.cam.includes(k);
    } else if (raw.cam && typeof raw.cam === "object") {
      for (const k of CAMS) if (typeof raw.cam[k] === "boolean") outCam[k] = raw.cam[k];
    }
    return { andares, L, D, corte: ct, cam: outCam };
  };
  const linkAtual = () => {
    const u = new URL(location.href);
    u.searchParams.set("andares", String(cfg.andares));
    u.searchParams.set("L", String(cfg.L));
    u.searchParams.set("D", String(cfg.D));
    if (corte < cfg.andares) u.searchParams.set("corte", String(corte));
    else u.searchParams.delete("corte");
    if (CAMS.some((k) => !cam[k])) u.searchParams.set("cam", CAMS.filter((k) => cam[k]).join(","));
    else u.searchParams.delete("cam");
    u.hash = "configurador";
    return u.toString();
  };
  const persistir = (atualizarUrl) => {
    try { localStorage.setItem(CHAVE_LS, JSON.stringify({ ...cfg, corte, cam })); } catch {}
    if (!atualizarUrl) return;
    try {
      const u = new URL(linkAtual());
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch {}
  };
  const anunciarDepois = (texto) => {
    clearTimeout(timerAnuncio);
    timerAnuncio = setTimeout(() => { if (anuncio) anuncio.textContent = texto; }, 450);
  };
  const pintarElevacao = () => {
    if (!svgElev) return;
    const { andares: n, L, D } = cfg, H = n * PE, peW = L, pH = PE;
    const tr = "var(--chumbo)", sin = "var(--sinal)", ag = "var(--agua)", cim = "var(--cimento)";
    svgElev.setAttribute("viewBox", `-16 -12 ${peW + 32} ${H + 28}`);
    let s = "";
    if (cam.estr) {
      s += `<line x1="-8" y1="${H}" x2="${peW + 8}" y2="${H}" stroke="${tr}" stroke-width="0.9"/>`;
      for (const x of [1, peW * 0.5, peW - 1]) s += `<line x1="${x.toFixed(1)}" y1="${H}" x2="${x.toFixed(1)}" y2="${H + 6}" stroke="${tr}" stroke-width="0.7" stroke-dasharray="1.5 1"/>`;
    }
    for (let i = 0; i < n; i++) {
      const y = H - (i + 1) * pH, vis = i < corte, sel = i === selecionado;
      if (!vis) {
        s += `<rect x="0" y="${y.toFixed(1)}" width="${peW}" height="${pH.toFixed(1)}" fill="none" stroke="${cim}" stroke-width="0.4" stroke-dasharray="1.5 1.5"/>`;
        continue;
      }
      if (cam.veda) s += `<rect x="-0.2" y="${y.toFixed(1)}" width="${(peW + 0.4).toFixed(1)}" height="${pH.toFixed(1)}" fill="${sel ? sin : ag}" fill-opacity="${sel ? "0.35" : "0.22"}"/>`;
      if (cam.estr) s += `<rect x="0" y="${y.toFixed(1)}" width="${peW}" height="${pH.toFixed(1)}" fill="${sel ? sin : "none"}" fill-opacity="${sel ? "0.28" : "0"}" stroke="${tr}" stroke-width="0.55"/>`;
      if (cam.hid) s += `<line x1="${(peW * 0.35).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(peW * 0.35).toFixed(1)}" y2="${(y + pH).toFixed(1)}" stroke="${ag}" stroke-width="0.5"/>`;
      if (cam.ele) s += `<line x1="${(peW * 0.65).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(peW * 0.65).toFixed(1)}" y2="${(y + pH).toFixed(1)}" stroke="${sin}" stroke-width="0.5"/>`;
    }
    if (corte >= n && cam.estr) s += `<rect x="${(peW * 0.32).toFixed(1)}" y="-4" width="${(peW * 0.36).toFixed(1)}" height="4" fill="${tr}"/>`;
    s += `<text x="${(peW / 2).toFixed(1)}" y="${H + 12}" text-anchor="middle" font-size="3.4" font-weight="700" fill="${tr}">${L} × ${D} m, ${n} pav. (${num(H, 1)} m)</text>`;
    svgElev.innerHTML = s;
  };
  const escreverForm = (e) => {
    form.elements.andares.value = String(e.andares);
    form.elements.L.value = String(e.L);
    form.elements.D.value = String(e.D);
    form.elements.corte.max = e.andares;
    corte = e.corte;
    form.elements.corte.value = String(corte);
    for (const k of CAMS) cam[k] = e.cam[k];
    $$('input[name="cam"]', form).forEach((el) => { el.checked = !!cam[el.value]; });
  };

  const ler = () => {
    const velho = cfg.andares;
    cfg.andares = +form.elements.andares.value; cfg.L = +form.elements.L.value; cfg.D = +form.elements.D.value;
    const c = form.elements.corte; c.max = cfg.andares;
    corte = corte >= velho || +c.value >= cfg.andares ? cfg.andares : Math.min(corte, cfg.andares);
    if (selecionado != null && selecionado >= cfg.andares) selecionado = null;
    c.value = corte;
    $$('input[name="cam"]', form).forEach((el) => { cam[el.value] = el.checked; });
  };
  const atualiza = (gravar = true, anunciar = true) => {
    $('output[for="cfg-andares"]', form).textContent = cfg.andares; $('output[for="cfg-L"]', form).textContent = cfg.L + " m"; $('output[for="cfg-D"]', form).textContent = cfg.D + " m";
    $('output[for="cfg-corte"]', form).textContent = corte >= cfg.andares ? "todos" : corte + "º andar";
    $("#r-quant").innerHTML = quantitativoHtml(cfg); $("#r-gantt").innerHTML = ganttHtml(cfg); corpo.innerHTML = linhasPavimentos(cfg, selecionado);
    const msg = mensagemObra(cfg, linkAtual());
    const urlZap = wa(DADOS.whatsapp, msg);
    $("#r-zap").href = urlZap;
    const stBt = $("#wa-sticky-bt"); if (stBt) stBt.href = urlZap;
    const ehPadrao = cfg.andares === PADRAO.andares && cfg.L === PADRAO.L && cfg.D === PADRAO.D && corte === PADRAO.andares && CAMS.every((k) => cam[k]);
    if (btReset) btReset.disabled = ehPadrao;
    if (gravar) persistir(true);
    if (anunciar) {
      const r = calcular(cfg);
      anunciarDepois(`${cfg.andares} andares, ${cfg.L} por ${cfg.D} metros, ${num(r.area)} metros quadrados, prazo de ${meses(r.prazo)}, referência ${moeda(r.custo)}.`);
    }
    if (arm) { arm.aplicar(cfg); arm.cortar(corte); arm.camadas(cam); arm.selecionar(selecionado); }
    else if (armFalhou) pintarElevacao();
  };
  form.addEventListener("input", (e) => {
    mexeu = true;
    if (e.target.name === "corte") corte = +e.target.value;
    else if (e.target.name === "cam") {
      cam[e.target.value] = e.target.checked;
      if (arm) arm.camadas({ [e.target.value]: e.target.checked });
      else if (armFalhou) pintarElevacao();
      persistir(true);
      if (btReset) btReset.disabled = cfg.andares === PADRAO.andares && cfg.L === PADRAO.L && cfg.D === PADRAO.D && corte === PADRAO.andares && CAMS.every((k) => cam[k]);
      return;
    }
    ler(); atualiza(true, true);
  });
  form.addEventListener("submit", (e) => e.preventDefault());

  btReset?.addEventListener("click", () => {
    mexeu = true; selecionado = null;
    escreverForm({ ...PADRAO, corte: PADRAO.andares, cam: { estr: true, hid: true, ele: true, veda: true } });
    ler(); atualiza(true, true);
    anunciarDepois("Simulação restaurada ao padrão.");
  });
  $("#r-compartilhar")?.addEventListener("click", async () => {
    const bt = $("#r-compartilhar"), url = linkAtual();
    let ok = false;
    if (navigator.share) { try { await navigator.share({ title: DADOS.nome, text: mensagemObra(cfg), url }); ok = true; } catch (err) { if (err?.name === "AbortError") return; } }
    if (!ok && navigator.clipboard?.writeText) { try { await navigator.clipboard.writeText(url); ok = true; } catch {} }
    if (!ok) {
      const ta = document.createElement("textarea"); ta.value = url; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
    if (bt) { bt.textContent = ok ? "Link copiado!" : "Link pronto na barra"; bt.classList.add("ok"); setTimeout(() => { bt.textContent = "Compartilhar simulação"; bt.classList.remove("ok"); }, 2400); }
    if (anuncio) anuncio.textContent = "Link da simulação copiado.";
  });

  /* lista de pavimentos <-> andar no 3D */
  const idx = (e) => { const b = e.target.closest(".pav-bt"); return b ? +b.dataset.i : null; };
  corpo.addEventListener("pointerover", (e) => { const i = idx(e); if (i != null && arm) arm.destacar(i); });
  corpo.addEventListener("pointerout", (e) => { if (idx(e) != null && arm) arm.destacar(null); });
  corpo.addEventListener("focusin", (e) => { const i = idx(e); if (i != null && arm) arm.destacar(i); });
  corpo.addEventListener("focusout", (e) => { if (idx(e) != null && arm) arm.destacar(null); });
  corpo.addEventListener("click", (e) => {
    const i = idx(e); if (i == null) return;
    selecionado = selecionado === i ? null : i; corpo.innerHTML = linhasPavimentos(cfg, selecionado);
    if (arm) arm.selecionar(selecionado); else if (armFalhou) pintarElevacao();
  });

  palco.addEventListener("keydown", (e) => {
    if (e.key === "+" || e.key === "=" || e.key === "-" || e.key === "_") {
      e.preventDefault(); mexeu = true;
      const prox = clamp(cfg.andares + (e.key === "-" || e.key === "_" ? -1 : 1), cfg.andares, LIMITES.andares, 1);
      if (prox === cfg.andares) return;
      const acomp = corte >= cfg.andares;
      form.elements.andares.value = String(prox);
      corte = acomp ? prox : Math.min(corte, prox);
      form.elements.corte.max = prox; form.elements.corte.value = String(corte);
      ler(); atualiza(true, true);
    }
  });

  /* 3D: só nasce perto da tela; capítulos sem zona morta e respeitando reduce */
  const trig = capitulos({
    trigger: ".ob__passos",
    start: "top 70%",
    end: "bottom 70%",
    etapas: ".ob__passos .passo",
    aoProgresso: (p) => { if (arm) arm.progresso(p); },
  });
  const rs = $("#ob-reset"), acoes = $(".ob__acoes");
  const montar = () => {
    try {
      arm = iniciarPredio({
        canvas: $("canvas", palco), palco, rotulos: $(".ob__rotulos", palco), gsap, reduce,
        aoInteragir: (sim) => {
          if (sim) $(".ob__dica", palco)?.classList.add("oculta");
          if (rs) rs.hidden = !sim;
          if (acoes) acoes.hidden = !sim;
        },
      });
    } catch (e) { arm = null; }
    if (!arm) {
      armFalhou = true;
      $(".ob__falha").hidden = false;
      $(".ob__dica", palco)?.classList.add("oculta");
      if (acoes) acoes.hidden = true;
      $(".ob__teclas")?.setAttribute("hidden", "");
      pintarElevacao();
      return;
    }
    rs?.addEventListener("click", () => arm.resetarVista());
    arm.aoSelecionar((i) => { selecionado = i; corpo.innerHTML = linhasPavimentos(cfg, selecionado); });
    arm.aplicar(cfg); arm.cortar(corte); arm.progresso(reduce ? 1 : trig ? trig.progress : 1);
    arm.camadas(cam);
  };
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); montar(); } }, { rootMargin: "600px 0px" }).observe(palco);

  const boxSticky = $(".wa-sticky");
  if (boxSticky) {
    const vis = { hero: true, cfg: false, zap: false, ct: false };
    const ioS = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.target.classList.contains("hero")) vis.hero = e.isIntersecting;
        else if (e.target.id === "configurador") vis.cfg = e.isIntersecting;
        else if (e.target.id === "r-zap") vis.zap = e.isIntersecting;
        else if (e.target.id === "contato") vis.ct = e.isIntersecting;
      }
      boxSticky.hidden = vis.hero || vis.cfg || vis.zap || vis.ct;
    }, { threshold: 0.05 });
    for (const el of [$(".hero"), $("#configurador"), $("#r-zap"), $("#contato")]) if (el) ioS.observe(el);
  }

  /* o cronograma cresce uma vez ao entrar na tela */
  if (!reduce) gsap.from(".barra", { scaleX: 0, transformOrigin: "left center", duration: 0.9, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: ".gantt", start: "top 80%", once: true } });

  const urlCfg = estadoDaUrl(), lsCfg = urlCfg ? null : estadoDoStorage(), ini = normalizar(urlCfg || lsCfg);
  if (ini) { escreverForm(ini); mexeu = !!urlCfg; }
  ler(); atualiza(false, false);
  return { getCfg: () => ({ ...cfg }), mexeu: () => mexeu };
}
