import { cenaReal } from "../core.js";
import { gsap, ScrollTrigger, $, $$, reduce, wa, iniciarMotion, indicadorProgresso } from "../motion.js";
import { DADOS } from "./page.mjs";

iniciarMotion();
{
  const barra = $(".prog-topo");
  if (barra && !reduce) indicadorProgresso({ aoAtualizar: (p) => { barra.style.transform = `scaleX(${p.toFixed(4)})`; } });
}

/* Frasco do topo se enche ao abrir */
if (!reduce) gsap.from(".hero .liquido", { scaleY: 0, duration: 2.4, ease: "power2.inOut", delay: 0.3 });

/* Na pele: a rolagem é o tempo. Fundo, névoa e notas mudam por fase */
const palco = $(".pele__palco"), cv = $(".nevoa"), ctx = cv.getContext("2d");
const fases = $$(".fase"), hora = $(".relogio__h"), F = DADOS.fases;
let fase = -1, prog = 0, ativo = false;
const ir = (i) => {
  if (i === fase) return;
  fase = i;
  fases.forEach((f) => f.classList.toggle("on", +f.dataset.i === i));
  palco.style.setProperty("--f", F[i].fundo);
  palco.style.setProperty("--t", F[i].tinta);
};
const fmt = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(Math.floor(min % 60)).padStart(2, "0")}`;
const minutos = (p) => (p < 1 / 3 ? p * 3 * 15 : p < 2 / 3 ? 15 + (p * 3 - 1) * 165 : 180 + (p * 3 - 2) * 300);

/* partículas: muitas no começo, poucas no fim (evaporação) */
const P = [];
let W = 0, H = 0;
const tam = () => { const r = devicePixelRatio > 1 ? 2 : 1; W = palco.clientWidth; H = palco.clientHeight; cv.width = W * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0); };
const nasce = () => ({ x: Math.random() * W, y: H + Math.random() * 40, r: 6 + Math.random() * 26, v: 0.3 + Math.random() * 0.9, d: Math.random() * Math.PI * 2, a: 0 });
const desenha = () => {
  if (!ativo) return;
  const alvo = Math.round(140 * (1 - prog * 0.75));
  while (P.length < alvo) P.push(nasce());
  if (P.length > alvo) P.length = alvo;
  const [r, g, b] = F[Math.max(0, fase)].nevoa;
  ctx.clearRect(0, 0, W, H);
  for (const p of P) {
    p.y -= p.v; p.d += 0.01; p.x += Math.sin(p.d) * 0.4; p.a = Math.min(1, p.a + 0.01);
    if (p.y < -p.r) Object.assign(p, nasce());
    const fade = p.a * Math.min(1, p.y / H + 0.2) * 0.35;
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    grd.addColorStop(0, `rgba(${r},${g},${b},${fade})`); grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  }
};

if (reduce) {
  ir(F.length - 1); hora.textContent = "08:00";
} else {
  tam(); addEventListener("resize", tam);
  ir(0);
  ScrollTrigger.create({
    trigger: palco, start: "top top", end: "+=300%", pin: true, anticipatePin: 1,
    onUpdate: (st) => { prog = st.progress; ir(Math.min(F.length - 1, Math.floor(prog * F.length))); hora.textContent = fmt(minutos(prog)); },
  });
  ScrollTrigger.create({ trigger: ".pele", start: "top bottom", end: "bottom top", onToggle: (s) => (ativo = s.isActive) });
  gsap.ticker.add(desenha);
}

/* Teste: conta a família mais escolhida e sugere o perfume */
const quiz = $("#quiz"), res = $(".resultado");
quiz.addEventListener("submit", (e) => {
  e.preventDefault();
  const conta = {};
  DADOS.quiz.forEach((_, i) => { const v = quiz.querySelector(`[name="q${i}"]:checked`).value; conta[v] = (conta[v] || 0) + 1; });
  const fam = Object.entries(conta).sort((a, b) => b[1] - a[1])[0][0];
  const p = DADOS.colecao.find((x) => x.familia === fam) || DADOS.colecao[0];
  res.innerHTML = `<p>Sua família é</p><h3><em>${fam}</em>. Comece pelo ${p.nome}.</h3><p>${p.notas}.</p><a class="btn" href="${wa(DADOS.whatsapp, `Olá! Fiz o teste no site e deu ${fam}. Quero uma amostra do ${p.nome}.`)}" target="_blank" rel="noopener">Pedir amostra do ${p.nome}</a>`;
  if (!reduce) gsap.from(res.children, { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 });
});

/* por último: as seções fixadas acima precisam ser medidas antes */
cenaReal();
ScrollTrigger.sort();
ScrollTrigger.refresh();
