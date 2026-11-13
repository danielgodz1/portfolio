import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const desktopFino = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
export const wa = (num, msg) => `https://wa.me/${num || ""}?text=${encodeURIComponent(msg)}`;

/* Curvas autorais (funções puras aceitas pelo GSAP sem plugins extras) */
export const EASE = {
  oficina: (t) => 1 - Math.pow(1 - t, 3.2),
  esquadro: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  deslize: (t) => 1 - Math.pow(1 - t, 4),
  // mola subamortecida para portas, gavetas e respostas táteis
  mola: (t) => {
    if (t <= 0 || t >= 1) return Math.min(1, Math.max(0, t));
    return 1 - Math.exp(-7.5 * t) * Math.cos(t * Math.PI * 2.6);
  },
};

/* ---------- Loop único Lenis + GSAP ticker + pausa com aba oculta ---------- */
let instanciaMotion = null;

export function iniciarMotion({
  cursor = true,
  magnetico = "[data-mag], .btn",
  split = "[data-split]",
  reveal = "[data-rev]",
  contar = "[data-conta]",
} = {}) {
  if (instanciaMotion) return instanciaMotion;

  let lenis = null;
  const ouvintesVis = new Set();

  if (!reduce) {
    document.documentElement.classList.add("anim");
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const aoVisibilidade = (fn) => {
    ouvintesVis.add(fn);
    return () => ouvintesVis.delete(fn);
  };

  document.addEventListener("visibilitychange", () => {
    const oculto = document.hidden;
    if (lenis) oculto ? lenis.stop() : lenis.start();
    if (oculto) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
    ouvintesVis.forEach((fn) => fn(oculto));
  });

  const rolou = () => document.documentElement.classList.toggle("rolou", scrollY > 40);
  addEventListener("scroll", rolou, { passive: true });
  rolou();

  const irPara = (alvo, opts = {}) => {
    const el = typeof alvo === "string" ? $(alvo) : alvo;
    if (!el) return;
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const offset = opts.offset ?? -(pad > 0 ? pad : 64);
    if (lenis && !reduce && !opts.instant) {
      lenis.scrollTo(el, { offset, duration: opts.duration ?? 1.05, ...opts });
    } else {
      const y = el.getBoundingClientRect().top + scrollY + offset;
      window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
    }
  };

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const alvo = $(id);
      if (!alvo) return;
      e.preventDefault();
      irPara(alvo);
    })
  );

  if (split) revelarTexto(split);
  if (reveal) revelarBlocos(reveal);
  if (contar) contadores(contar);
  if (magnetico) botoesMagneticos(magnetico);
  if (cursor) cursorDesktop();

  instanciaMotion = { lenis, irPara, aoVisibilidade, atualizar: () => ScrollTrigger.refresh() };
  return instanciaMotion;
}

/* ---------- Reveal por palavra (ou linha via máscara) ---------- */
export function revelarTexto(seletor = "[data-split]") {
  $$(seletor).forEach((el) => {
    if (el.dataset.splitOk) return;
    el.dataset.splitOk = "1";
    const texto = el.textContent.trim();
    if (!texto) return;
    el.setAttribute("aria-label", texto);
    el.innerHTML = texto
      .split(/\s+/)
      .map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`)
      .join(" ");
    if (reduce) return;
    const imediato = el.hasAttribute("data-split-hero");
    const cfg = {
      yPercent: 112,
      duration: imediato ? 0.85 : 0.9,
      ease: EASE.oficina,
      stagger: 0.045,
    };
    if (!imediato) {
      cfg.scrollTrigger = { trigger: el, start: "top 90%", once: true };
    }
    gsap.from(el.querySelectorAll(".w > span"), cfg);
  });
}

/* ---------- Reveal de blocos (nunca deixa invisível em reduce) ---------- */
export function revelarBlocos(seletor = "[data-rev]") {
  if (reduce) return;
  const lista = $$(seletor);
  if (!lista.length) return;
  lista.forEach((el) => {
    const atraso = +(el.dataset.revDelay || 0);
    gsap.from(el, {
      y: 26,
      opacity: 0,
      duration: 0.78,
      delay: atraso,
      ease: EASE.oficina,
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
  });
}

/* ---------- Contadores numéricos (preserva vírgula decimal e sufixo) ---------- */
export function contadores(seletor = "[data-conta]") {
  $$(seletor).forEach((el) => {
    const alvo = parseFloat(el.dataset.conta);
    if (Number.isNaN(alvo)) return;
    const dec = +(el.dataset.dec || 0);
    const pref = el.dataset.pref || "";
    const suf = el.dataset.suf || "";
    const fmt = (v) => {
      const s = dec > 0 ? v.toFixed(dec).replace(".", ",") : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return pref + s + suf;
    };
    if (reduce) {
      el.textContent = fmt(alvo);
      return;
    }
    const inicio = parseFloat(el.dataset.de || 0);
    const obj = { v: inicio };
    el.textContent = fmt(inicio);
    gsap.to(obj, {
      v: alvo,
      duration: +(el.dataset.dur || 1.25),
      ease: EASE.oficina,
      onUpdate: () => {
        el.textContent = fmt(obj.v);
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

/* ---------- Capítulos por rolagem: entrada -> hold -> saída sem zonas mortas ---------- */
export function capitulos({ trigger, start = "top 68%", end = "bottom 68%", etapas = [], aoProgresso, aoMudar }) {
  const itens = typeof etapas === "string" ? $$(etapas) : etapas;
  let ativo = -1;
  const marca = (idx) => {
    if (idx === ativo) return;
    ativo = idx;
    itens.forEach((el, i) => el.classList.toggle("is-ativo", i === idx));
    if (aoMudar) aoMudar(idx);
  };

  if (reduce) {
    itens.forEach((el) => el.classList.add("is-ativo"));
    if (aoMudar) aoMudar(Math.max(0, itens.length - 1));
    if (aoProgresso) aoProgresso(1);
    return null;
  }

  marca(0);
  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub: 0.35,
    onUpdate: (st) => {
      const p = st.progress;
      if (aoProgresso) aoProgresso(p, st);
      if (itens.length) {
        const idx = Math.min(itens.length - 1, Math.floor(p * itens.length));
        marca(idx);
      }
    },
  });
}

/* ---------- Indicador de progresso temático (desktop + mobile) ---------- */
export function indicadorProgresso({ trigger = document.body, aoAtualizar }) {
  if (!aoAtualizar) return null;
  if (reduce) {
    aoAtualizar(1);
    return null;
  }
  aoAtualizar(0);
  return ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (st) => aoAtualizar(st.progress),
  });
}

/* ---------- Botões magnéticos (somente desktop com ponteiro fino) ---------- */
export function botoesMagneticos(seletor = "[data-mag], .btn", forca = 0.18) {
  if (reduce || !desktopFino()) return;
  $$(seletor).forEach((el) => {
    if (el.dataset.magOk) return;
    el.dataset.magOk = "1";
    const qx = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const qy = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(-7, Math.min(7, (e.clientX - (r.left + r.width / 2)) * forca));
      const dy = Math.max(-5, Math.min(5, (e.clientY - (r.top + r.height / 2)) * forca));
      qx(dx);
      qy(dy);
    });
    el.addEventListener("pointerleave", () => {
      qx(0);
      qy(0);
    });
  });
}

/* ---------- Cursor técnico discreto (somente desktop com ponteiro fino) ---------- */
export function cursorDesktop() {
  if (reduce || !desktopFino() || $(".prumo-cursor")) return;
  const el = document.createElement("div");
  el.className = "prumo-cursor";
  el.setAttribute("aria-hidden", "true");
  const rot = document.createElement("span");
  el.appendChild(rot);
  document.body.appendChild(el);

  const qx = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3.out" });
  const qy = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3.out" });
  let ativo = false;

  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    if (!ativo) {
      ativo = true;
      el.classList.add("on");
    }
    qx(e.clientX);
    qy(e.clientY);
    const alvo = e.target && e.target.closest ? e.target.closest("[data-cursor], .mv__canvas, .ob__canvas, .maq__palco, .ad__fig, a, button, summary") : null;
    const modo = !alvo ? ""
      : alvo.dataset.cursor ? alvo.dataset.cursor
      : alvo.matches(".mv__canvas, .ob__canvas, .maq__palco") ? "arrastar"
      : alvo.matches(".ad__fig") ? "comparar"
      : "acao";
    el.dataset.modo = modo;
    rot.textContent = modo === "arrastar" ? "Girar" : modo === "comparar" ? "Mover" : "";
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    ativo = false;
    el.classList.remove("on");
  });
}
