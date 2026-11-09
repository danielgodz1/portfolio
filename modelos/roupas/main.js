import { gsap, ScrollTrigger, $, $$, reduce, iniciar, wa } from "../core.js";
import { DADOS } from "./page.mjs";

iniciar();

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
