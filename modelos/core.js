import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const wa = (num, msg) => `https://wa.me/${num || ""}?text=${encodeURIComponent(msg)}`;

/* Liga Lenis + GSAP, revelações [data-rev] e títulos [data-split]. */
export function iniciar() {
  let lenis = null;
  if (!reduce) {
    document.documentElement.classList.add("anim");
    lenis = new Lenis({ lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const alvo = $(id);
        if (alvo) { e.preventDefault(); lenis.scrollTo(alvo); }
      })
    );
  }
  $$("[data-split]").forEach((el) => {
    const t = el.textContent.trim();
    el.setAttribute("aria-label", t);
    el.innerHTML = t.split(/\s+/).map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(" ");
    if (!reduce)
      gsap.from(el.querySelectorAll(".w>span"), {
        yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.05,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
  });
  if (!reduce)
    $$("[data-rev]").forEach((el) =>
      gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })
    );
  return { lenis };
}

/* Abas acessíveis: [role=tablist] com botões [aria-controls]. */
export function abas(lista) {
  const bts = $$('[role="tab"]', lista);
  const ir = (b, foco) => {
    bts.forEach((x) => {
      const on = x === b;
      x.setAttribute("aria-selected", on);
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
    });
    if (foco) b.focus();
  };
  bts.forEach((b, i) => {
    b.addEventListener("click", () => ir(b));
    b.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); ir(bts[(i + d + bts.length) % bts.length], true); }
    });
  });
}

/* Seção fixada que troca de passo com a rolagem. */
export function passos(secao, palco, n, aoMudar, dur = 60) {
  let atual = -1;
  const ir = (i) => { if (i !== atual) { atual = i; aoMudar(i); } };
  if (reduce) { ir(n - 1); return; }
  ir(0);
  ScrollTrigger.create({
    trigger: palco, start: "top top", end: "+=" + n * dur + "%", pin: true, anticipatePin: 1,
    onUpdate: (st) => ir(Math.min(n - 1, Math.floor(st.progress * n))),
  });
}

/* Cena real: <video> controlado pela rolagem (estilo Apple). Sem vídeo, a seção não existe. */
export function cenaReal() {
  $$(".real").forEach((sec) => {
    const v = $("video", sec), palco = $(".real__palco", sec), leg = $$(".real__leg li", sec);
    const marca = (p) => { const i = Math.min(leg.length - 1, Math.floor(p * leg.length)); leg.forEach((l, k) => l.classList.toggle("on", k === i)); };
    if (reduce || !v) { marca(1); leg.forEach((l) => l.classList.add("on")); return; }
    v.pause();
    let alvo = 0, buscando = false;
    const busca = () => {
      if (!v.duration || buscando) return;
      const t = alvo * (v.duration - 0.05);
      if (Math.abs(v.currentTime - t) < 0.02) return;
      buscando = true; v.currentTime = t;
    };
    v.addEventListener("seeked", () => { buscando = false; busca(); });
    v.addEventListener("loadedmetadata", busca);
    marca(0);
    ScrollTrigger.create({
      trigger: palco, start: "top top", end: "+=" + (sec.dataset.dur || 260) + "%", pin: true, anticipatePin: 1,
      onUpdate: (st) => { alvo = st.progress; busca(); marca(st.progress); },
    });
  });
}
