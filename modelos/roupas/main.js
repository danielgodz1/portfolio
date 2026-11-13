import { cenaReal } from "../core.js";
import { gsap, ScrollTrigger, $, $$, reduce, wa, iniciarMotion, indicadorProgresso } from "../motion.js";
import { DADOS } from "./page.mjs";

const { lenis } = iniciarMotion();
{
  const barra = $(".prog-topo");
  if (barra && !reduce) indicadorProgresso({ aoAtualizar: (p) => { barra.style.transform = `scaleX(${p.toFixed(4)})`; } });
}

/* Troque o look: vídeo, cor, título e peças mudam juntos */
{
  const C = DADOS.colecoes, sec = $(".look"), vs = $$(".look__v"), bts = $$(".look__bts button");
  const titulo = $(".look__t"), nome = $(".look__nome"), pecas = $(".look__pecas");
  let atual = -1;
  const ir = (i) => {
    if (i === atual) return;
    atual = i;
    const c = C[i];
    vs.forEach((v, k) => {
      const on = k === i;
      v.classList.toggle("on", on);
      if (on) { if (!reduce) v.play().catch(() => {}); } else v.pause();
    });
    bts.forEach((b, k) => b.setAttribute("aria-pressed", k === i));
    sec.style.setProperty("--look", c.cor); sec.style.setProperty("--look-t", c.tinta);
    nome.textContent = c.nome;
    pecas.innerHTML = c.pecas.map((p) => `<li>${p}</li>`).join("");
    if (reduce) { titulo.textContent = c.titulo; return; }
    gsap.to(titulo, { yPercent: -30, opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => {
      titulo.innerHTML = c.titulo.split(" ").map((w) => `<span class="pal">${w.split("").map((ch) => `<span class="ch">${ch}</span>`).join("")}</span>`).join(" ");
      titulo.setAttribute("aria-label", c.titulo);
      gsap.set(titulo, { yPercent: 0, opacity: 1 });
      gsap.from(titulo.querySelectorAll(".ch"), { yPercent: 110, rotate: 8, opacity: 0, duration: 0.6, ease: "power4.out", stagger: 0.025 });
    } });
    gsap.from(pecas.children, { y: 12, opacity: 0, stagger: 0.06, duration: 0.4, delay: 0.2 });
  };
  ir(0);
  let st = null;
  if (!reduce) {
    st = ScrollTrigger.create({
      trigger: ".look__palco", start: "top top", end: "+=" + C.length * 70 + "%", pin: true, anticipatePin: 1,
      onUpdate: (s) => ir(Math.min(C.length - 1, Math.floor(s.progress * C.length))),
    });
  }
  bts.forEach((b, k) => b.addEventListener("click", () => {
    if (st) { const y = st.start + (st.end - st.start) * ((k + 0.5) / C.length); lenis ? lenis.scrollTo(y) : window.scrollTo({ top: y }); }
    ir(k);
  }));
}

/* Costura em volta da tela se faz ao carregar */
if (!reduce) gsap.from(".costura rect", { strokeDashoffset: 1, strokeDasharray: "0 1", duration: 2.2, ease: "power2.inOut" });

/* Etiqueta pendurada: balança com o movimento do ponteiro */
const tag = $(".tag");
if (!reduce && tag) {
  let ultX = null;
  addEventListener("pointermove", (e) => {
    if (ultX !== null) {
      const v = Math.max(-30, Math.min(30, (e.clientX - ultX) * 0.9));
      gsap.to(tag, { rotation: -v, duration: 0.25, overwrite: true, onComplete: () => gsap.to(tag, { rotation: 0, duration: 2.4, ease: "elastic.out(1, 0.25)" }) });
    }
    ultX = e.clientX;
  });
  gsap.fromTo(tag, { rotation: 18 }, { rotation: 0, duration: 3, ease: "elastic.out(1, 0.2)", delay: 0.4 });
}

/* Arara: rolagem vertical anda a arara de lado; as peças balançam com a velocidade */
const trilho = $(".arara__trilho");
const cabides = $$(".cabide");
if (!reduce) {
  const dist = () => Math.max(0, trilho.scrollWidth - innerWidth);
  const balanco = cabides.map((c) => gsap.quickTo(c, "rotation", { duration: 0.6, ease: "power3" }));
  let parado;
  gsap.to(trilho, {
    x: () => -dist(), ease: "none",
    scrollTrigger: {
      trigger: ".arara__palco", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (st) => {
        const r = Math.max(-14, Math.min(14, st.getVelocity() / 140));
        balanco.forEach((q, i) => q(r * (0.8 + (i % 3) * 0.15)));
        clearTimeout(parado);
        parado = setTimeout(() => cabides.forEach((c) => gsap.to(c, { rotation: 0, duration: 2, ease: "elastic.out(1, 0.3)" })), 90);
      },
    },
  });
} else {
  trilho.style.flexWrap = "wrap"; trilho.style.width = "auto";
}

/* Provador: troca cor e tipo, monta a mensagem */
const f = $("#prov-form");
const cima = $(".p-cima path");
const calca = $(".b-calca"), saia = $(".b-saia");
const res = $(".prov__res"), btn = $("#prov-wa");
const atualiza = () => {
  const c = f.querySelector('[name="cima"]:checked'), b = f.querySelector('[name="baixo"]:checked');
  const t = f.querySelector('[name="tipo"]:checked').value;
  cima.setAttribute("fill", c.value);
  [calca, saia].forEach((el) => { el.style.opacity = el === (t === "saia" ? saia : calca) ? 1 : 0; el.querySelector("path").setAttribute("fill", b.value); });
  const txt = `Camisa ${c.dataset.nome.toLowerCase()} com ${t === "saia" ? "saia" : "calça"} ${b.dataset.nome.toLowerCase()}`;
  res.textContent = txt + ".";
  btn.href = wa(DADOS.whatsapp, `Olá! Quero provar este look: ${txt}.`);
};
f.addEventListener("change", atualiza);
atualiza();

/* Lookbook: as fotos se abrem como uma cortina */
if (!reduce)
  $$(".foto").forEach((el, i) =>
    gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "power3.inOut", delay: i * 0.12, scrollTrigger: { trigger: el, start: "top 85%" } })
  );

/* por último: as seções fixadas acima precisam ser medidas antes */
cenaReal();
ScrollTrigger.sort();
ScrollTrigger.refresh();
