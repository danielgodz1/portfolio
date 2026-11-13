import { cenaReal, abas } from "../core.js";
import { gsap, ScrollTrigger, $, $$, reduce, wa, iniciarMotion, indicadorProgresso } from "../motion.js";
import { DADOS } from "./page.mjs";

iniciarMotion();
{
  const barra = $(".prog-topo");
  if (barra && !reduce) indicadorProgresso({ aoAtualizar: (p) => { barra.style.transform = `scaleX(${p.toFixed(4)})`; } });
}
abas($(".abas"));

/* Brasas sobem pelo topo; a rolagem aviva o fogo */
const hero = $(".hero"), cv = $(".brasas"), ctx = cv.getContext("2d");
let W, H, calor = 0.3, ativo = true;
const tam = () => { const r = devicePixelRatio > 1 ? 2 : 1; W = hero.clientWidth; H = hero.clientHeight; cv.width = W * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0); };
const nova = () => ({ x: Math.random() * W, y: H + 10, v: 0.6 + Math.random() * 1.8, s: 1 + Math.random() * 2.6, f: Math.random() * 6, vida: 0 });
const B = [];
const quadro = () => {
  if (!ativo) return;
  const alvo = Math.round(60 + calor * 160);
  while (B.length < alvo) B.push(nova());
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = "lighter";
  for (let i = B.length - 1; i >= 0; i--) {
    const b = B[i];
    b.y -= b.v * (1 + calor); b.f += 0.08; b.x += Math.sin(b.f) * 0.6; b.vida += 1;
    const a = Math.max(0, 1 - (H - b.y) / (H * (0.6 + calor * 0.4))) * (0.6 + Math.sin(b.f * 3) * 0.4);
    if (a <= 0 || b.y < -10) { if (B.length > alvo) B.splice(i, 1); else Object.assign(b, nova()); continue; }
    ctx.fillStyle = `rgba(255,${Math.round(90 + a * 90)},30,${a})`;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.s, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
};
tam(); addEventListener("resize", tam);
if (reduce) {
  for (let i = 0; i < 120; i++) { const b = nova(); b.y = H * (0.4 + Math.random() * 0.6); B.push(b); }
  ativo = true; calor = 0; quadro(); ativo = false;
} else {
  gsap.ticker.add(quadro);
  ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", onToggle: (s) => (ativo = s.isActive),
    onUpdate: (s) => { calor = 0.3 + s.progress * 0.9; hero.style.setProperty("--brilho", s.progress * 28 + "px"); } });
}

/* Prato se monta camada por camada */
const ordem = ["pure", "carne", "farofa", "chimi", "folhas", "sal"];
if (!reduce && $(".montagem")) {
  gsap.set(".c-chimi", { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(".rot", { opacity: 0 });
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: { trigger: ".montagem__palco", start: "top top", end: "+=220%", pin: true, scrub: 0.6, anticipatePin: 1 },
  });
  tl.from(".prato .louca, .prato .louca2", { scale: 0.85, opacity: 0, transformOrigin: "300px 300px", duration: 0.6 }, 0);
  ordem.forEach((k, i) => {
    const t = 0.6 + i;
    if (k === "chimi") tl.to(".c-chimi", { strokeDashoffset: 0, duration: 0.9 }, t);
    else if (k === "carne") tl.from(".c-carne g", { y: -260, opacity: 0, stagger: 0.12, duration: 0.6 }, t);
    else if (k === "farofa" || k === "sal") tl.from(`.c-${k} > *`, { opacity: 0, y: -30, stagger: { each: 0.008, from: "random" }, duration: 0.3 }, t);
    else tl.from(`.c-${k}`, { scale: 0.4, opacity: 0, transformOrigin: "center", transformBox: "fill-box", duration: 0.7 }, t);
    tl.to(`.r-${k}`, { opacity: 1, duration: 0.4 }, t + 0.4);
  });
}

/* Reserva: confere os campos e abre o WhatsApp */
const f = $("#form-res"), erro = $(".erro");
const hoje = new Date(); f.dia.min = hoje.toISOString().slice(0, 10);
f.addEventListener("submit", (e) => {
  e.preventDefault();
  const falta = [["nome", "seu nome"], ["dia", "o dia"], ["hora", "o horário"]].filter(([n]) => !f[n].value.trim());
  [f.nome, f.dia, f.hora].forEach((el) => el.removeAttribute("aria-invalid"));
  if (falta.length) {
    falta.forEach(([n]) => f[n].setAttribute("aria-invalid", "true"));
    erro.textContent = `Preencha ${falta.map((x) => x[1]).join(", ")}.`; erro.hidden = false;
    f[falta[0][0]].focus(); return;
  }
  erro.hidden = true;
  const [a, m, d] = f.dia.value.split("-");
  const msg = `Olá! Gostaria de reservar uma mesa para ${f.pessoas.value} pessoa(s) no dia ${d}/${m}/${a}, às ${f.hora.value}. Nome: ${f.nome.value.trim()}.`;
  window.open(wa(DADOS.whatsapp, msg), "_blank", "noopener");
});

/* por último: as seções fixadas acima precisam ser medidas antes */
cenaReal();
ScrollTrigger.sort();
ScrollTrigger.refresh();
