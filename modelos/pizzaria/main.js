import { cenaReal } from "../core.js";
import { gsap, ScrollTrigger, $, $$, reduce, iniciar, abas, wa } from "../core.js";
import { DADOS, ITENS } from "./page.mjs";
import { pedido } from "../pedido.js";

const { lenis } = iniciar();
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

/* Pedido pelo WhatsApp */
pedido({ slug: "pizzaria", itens: ITENS, config: DADOS.pedido, whatsapp: DADOS.whatsapp, lenis });

/* por último: as seções fixadas acima precisam ser medidas antes */
cenaReal();
ScrollTrigger.sort();
ScrollTrigger.refresh();
