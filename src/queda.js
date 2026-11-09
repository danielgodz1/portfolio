import Matter from "matter-js";

const { Engine, Bodies, Body, Composite, Sleeping } = Matter;

/* Ideias caindo: cada <li.chip> vira um corpo físico. A rolagem solta os chips um a um;
   o ponteiro empurra. Sem movimento (reduce): a pilha já nasce assentada. */
export function iniciarQueda({ palco, gsap, ScrollTrigger, reduce }) {
  const lista = palco.querySelector(".queda__lista");
  const els = [...lista.children];
  if (!els.length) return;
  palco.classList.add("fisica");

  const engine = Engine.create({ enableSleeping: true });
  engine.gravity.y = 1.1;
  let W = palco.clientWidth, H = palco.clientHeight;
  let paredes = [];
  const montarParedes = () => {
    Composite.remove(engine.world, paredes);
    const e = 200;
    paredes = [
      Bodies.rectangle(W / 2, H + e / 2, W * 3, e, { isStatic: true }),
      Bodies.rectangle(-e / 2, -H, e, H * 6, { isStatic: true }),
      Bodies.rectangle(W + e / 2, -H, e, H * 6, { isStatic: true }),
    ];
    Composite.add(engine.world, paredes);
  };
  montarParedes();

  const itens = els
    .map((el) => ({ el, w: el.offsetWidth, h: el.offsetHeight, corpo: null, solto: false }))
    .sort(() => Math.random() - 0.5);

  const soltar = (it, vivo = true) => {
    const { w, h } = it;
    const x = w / 2 + Math.random() * Math.max(1, W - w);
    const y = vivo ? -h - Math.random() * 120 : -h - Math.random() * H * 0.8;
    it.corpo = Bodies.rectangle(x, y, w, h, {
      restitution: 0.32, friction: 0.5, frictionAir: 0.012, chamfer: { radius: 6 },
      angle: (Math.random() - 0.5) * 0.9,
    });
    if (vivo) Body.setVelocity(it.corpo, { x: (Math.random() - 0.5) * 3, y: 2 });
    Composite.add(engine.world, it.corpo);
    it.solto = true;
  };

  const desenhar = () => {
    for (const it of itens) {
      if (!it.solto) continue;
      const { x, y } = it.corpo.position;
      it.el.style.transform = `translate(${(x - it.w / 2).toFixed(1)}px,${(y - it.h / 2).toFixed(1)}px) rotate(${it.corpo.angle.toFixed(3)}rad)`;
    }
  };

  if (reduce) {
    itens.forEach((it) => soltar(it, false));
    for (let i = 0; i < 900; i++) Engine.update(engine, 1000 / 60);
    desenhar();
    return;
  }

  /* rolagem solta os chips (só avança, nunca recolhe) */
  let ativo = false, liberados = 0;
  ScrollTrigger.create({
    trigger: palco, start: "top top", end: "+=170%", pin: true, anticipatePin: 1,
    onUpdate: (st) => {
      const alvo = Math.min(itens.length, Math.floor(st.progress * itens.length * 1.25));
      while (liberados < alvo) soltar(itens[liberados++]);
    },
  });
  ScrollTrigger.create({ trigger: palco.closest("section"), start: "top bottom", end: "bottom top", onToggle: (s) => (ativo = s.isActive) });

  gsap.ticker.add((_, dt) => {
    if (!ativo) return;
    Engine.update(engine, Math.min(16.6, dt || 16));
    desenhar();
  });

  /* ponteiro empurra os chips próximos */
  let ult = null;
  palco.addEventListener("pointermove", (e) => {
    const r = palco.getBoundingClientRect();
    const p = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (ult) {
      const vx = p.x - ult.x, vy = p.y - ult.y;
      for (const it of itens) {
        if (!it.solto) continue;
        const b = it.corpo, dx = b.position.x - p.x, dy = b.position.y - p.y, d = Math.hypot(dx, dy);
        if (d < 130) {
          Sleeping.set(b, false);
          const f = (1 - d / 130) * 0.0016 * b.mass;
          Body.applyForce(b, b.position, { x: vx * f * 6 + (dx / (d || 1)) * f * 20, y: vy * f * 6 - f * 30 });
        }
      }
    }
    ult = p;
  });
  palco.addEventListener("pointerleave", () => (ult = null));

  addEventListener("resize", () => {
    const nw = palco.clientWidth, nh = palco.clientHeight;
    if (nw === W && nh === H) return;
    W = nw; H = nh; montarParedes();
    for (const it of itens) {
      if (!it.solto) continue;
      it.w = it.el.offsetWidth; it.h = it.el.offsetHeight;
      Body.setPosition(it.corpo, { x: Math.min(Math.max(it.corpo.position.x, it.w / 2), W - it.w / 2), y: Math.min(it.corpo.position.y, H - it.h) });
      Sleeping.set(it.corpo, false);
    }
  });
}
