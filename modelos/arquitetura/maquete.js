import { WebGLRenderer, Scene, PerspectiveCamera, Color, Group, Mesh, BoxGeometry, SphereGeometry, CylinderGeometry, BufferGeometry, Float32BufferAttribute, MeshLambertMaterial, LineBasicMaterial, LineSegments, EdgesGeometry, AmbientLight, DirectionalLight, Plane, Vector3, DoubleSide } from "three";

/* Maquete 3D de um sobrado (unidade = 1 m). Tudo é paramétrico, sem modelo baixado.
   Fachada, corte e planta são a MESMA geometria: dois planos de recorte (um horizontal, um vertical)
   escondem o que está acima de uma altura (planta) ou na frente de um plano (corte). */

const rad = (g) => (g * Math.PI) / 180;
const lim = (x, a, b) => Math.min(b, Math.max(a, x));

// h: altura do recorte horizontal (9 = nada cortado); v: posição z do recorte vertical (12 = nada cortado)
// poche: 1 pinta as paredes de preto (paredes cortadas, como numa planta de verdade)
const ESTADOS = {
  fachada: { az: 32, el: 15, dist: 25, ty: 3.4, h: 9, v: 12, poche: 0 },
  corte: { az: 0, el: 7, dist: 21, ty: 3.2, h: 9, v: 2.4, poche: 0 },
  planta: { az: 0, el: 84, dist: 21, ty: 0, h: 1.5, v: 12, poche: 1 },
};

export function iniciarMaquete({ canvas, palco, gsap, reduce }) {
  // contexto criado aqui para poder avisar o visitante quando o navegador não tem WebGL
  const gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
  if (!gl) return null;
  const renderer = new WebGLRenderer({ canvas, context: gl, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.localClippingEnabled = true;

  const scene = new Scene();
  const cam = new PerspectiveCamera(32, 1, 0.5, 200);
  scene.add(new AmbientLight(0xffffff, 1.5));
  const sol = new DirectionalLight(0xffffff, 2.4); sol.position.set(10, 18, 12); scene.add(sol);

  // cores vêm dos tokens do styles.css (nenhum valor solto aqui)
  const raiz = getComputedStyle(document.documentElement);
  const cor = (token) => new Color(raiz.getPropertyValue(token).trim());
  const est = { ...ESTADOS.fachada };
  const planoH = new Plane(new Vector3(0, -1, 0), est.h), planoV = new Plane(new Vector3(0, 0, -1), est.v);
  const planos = [planoH, planoV];
  const mat = (token, extra = {}) => new MeshLambertMaterial({ color: cor(token), side: DoubleSide, clippingPlanes: planos, ...extra });
  const M = {
    parede: mat("--papel"), laje: mat("--grafite"), piso: mat("--concreto"), terreno: mat("--concreto-2"), pisoExt: mat("--papel-2"),
    acento: mat("--terracota"), movel: mat("--concreto-2"), escuro: mat("--grafite-suave"), vidro: mat("--grafite", { transparent: true, opacity: 0.5 }),
    telhado: mat("--terracota"), arvore: mat("--grafite-suave"),
  };
  const linha = new LineBasicMaterial({ color: cor("--grafite"), clippingPlanes: planos });

  const casa = new Group(); scene.add(casa);
  const caixa = (x0, x1, y0, y1, z0, z1, m, arestas = true) => {
    const geo = new BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
    const p = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
    const malha = new Mesh(geo, m); malha.position.set(...p); casa.add(malha);
    if (arestas) { const l = new LineSegments(new EdgesGeometry(geo, 25), linha); l.position.set(...p); casa.add(l); }
  };
  // parede que corre ao longo de "x" (entre z=p0 e p1) ou de "z" (entre x=p0 e p1), com aberturas {de, ate, base, topo, vidro, porta}
  const parede = (eixo, a0, a1, p0, p1, y0, y1, aberturas, m) => {
    const trecho = (s0, s1, b0, b1, mm = m) => {
      if (s1 - s0 < 0.001 || b1 - b0 < 0.001) return;
      if (eixo === "x") caixa(s0, s1, b0, b1, p0, p1, mm); else caixa(p0, p1, b0, b1, s0, s1, mm);
    };
    const pm = (p0 + p1) / 2;
    let c = a0;
    for (const o of [...aberturas].sort((a, b) => a.de - b.de)) {
      trecho(c, o.de, y0, y1); trecho(o.de, o.ate, y0, o.base); trecho(o.de, o.ate, o.topo, y1);
      const painel = (mm, e) => (eixo === "x" ? caixa(o.de + 0.02, o.ate - 0.02, o.base, o.topo, pm - e, pm + e, mm) : caixa(pm - e, pm + e, o.base, o.topo, o.de + 0.02, o.ate - 0.02, mm));
      if (o.vidro) { painel(M.vidro, 0.02); const m2 = (o.de + o.ate) / 2; eixo === "x" ? caixa(m2 - 0.02, m2 + 0.02, o.base, o.topo, pm - 0.04, pm + 0.04, M.laje, false) : caixa(pm - 0.04, pm + 0.04, o.base, o.topo, m2 - 0.02, m2 + 0.02, M.laje, false); }
      if (o.porta) painel(M.acento, 0.04);
      c = o.ate;
    }
    trecho(c, a1, y0, y1);
  };
  // telhado de duas águas: prisma com a cumeeira ao longo de x
  const prisma = (x0, x1, z0, z1, y0, subida, m) => {
    const zm = (z0 + z1) / 2, A = [x0, y0, z0], B = [x1, y0, z0], C = [x1, y0, z1], D = [x0, y0, z1], E = [x0, y0 + subida, zm], F = [x1, y0 + subida, zm];
    const tris = [D, C, F, D, F, E, A, B, F, A, F, E, A, D, E, B, C, F, A, B, C, A, C, D].flat();
    const geo = new BufferGeometry(); geo.setAttribute("position", new Float32BufferAttribute(tris, 3)); geo.computeVertexNormals();
    const malha = new Mesh(geo, m); casa.add(malha);
    casa.add(new LineSegments(new EdgesGeometry(geo, 25), linha));
  };

  const Y0 = 0.2, YP = 3.0, YL = 3.2, YT = 6.0; // piso do térreo, topo do térreo, topo da laje, teto do 2º piso
  // terreno, calçada e entrada
  caixa(-11, 11, -0.3, 0, -9.5, 10.5, M.terreno);
  caixa(-7.5, 7.5, 0, 0.05, -5.5, 6.5, M.pisoExt, false);
  caixa(0, 1.4, 0, 0.07, 5, 10.5, M.piso, false); caixa(-0.1, 1.5, 0, 0.14, 4.5, 5, M.piso);
  for (const [x, z] of [[-9, 6.5], [8.5, 7.5], [-8.5, -6.5], [9, -6]]) {
    const tronco = new Mesh(new CylinderGeometry(0.15, 0.2, 1.4, 8), M.arvore); tronco.position.set(x, 0.7, z); casa.add(tronco);
    const copa = new Mesh(new SphereGeometry(1.2, 12, 9), M.arvore); copa.position.set(x, 2.5, z); casa.add(copa);
  }

  // térreo
  caixa(-6, 6, 0, Y0, -4.5, 4.5, M.piso);
  parede("x", -6, 6, -4.5, -4.25, Y0, YP, [{ de: -4.5, ate: -3, base: 1.1, topo: 2.2, vidro: 1 }], M.parede);
  parede("z", -4.25, 4.25, -6, -5.75, Y0, YP, [{ de: 0.5, ate: 2.5, base: 0.9, topo: 2.2, vidro: 1 }], M.parede);
  parede("z", -4.25, 0.5, 5.75, 6, Y0, YP, [], M.parede);
  parede("x", -6, 2, 4.25, 4.5, Y0, YP, [{ de: -5, ate: -2, base: Y0, topo: 2.6, vidro: 1 }, { de: 0.2, ate: 1.2, base: Y0, topo: 2.4, porta: 1 }], M.parede);
  parede("x", 2, 6, 0.5, 0.75, Y0, YP, [{ de: 3.2, ate: 5, base: Y0, topo: 2.4, vidro: 1 }], M.parede);
  caixa(2, 2.3, Y0, YP, 4.2, 4.5, M.laje); caixa(5.7, 6, Y0, YP, 4.2, 4.5, M.laje); // pilares da varanda
  parede("z", -3.4, -1.2, 4.4, 4.55, Y0, YP, [], M.parede); // lavabo
  parede("x", 4.4, 6, -1.35, -1.2, Y0, YP, [{ de: 4.7, ate: 5.5, base: Y0, topo: 2.1 }], M.parede);
  const deg = 4.4 / 17, sobe = (YL - Y0) / 17;
  for (let i = 0; i < 17; i++) caixa(1.6 + i * deg, 1.6 + (i + 1) * deg, Y0, Y0 + (i + 1) * sobe, -4.25, -3.4, M.parede); // escada
  // cozinha, jantar e sala
  caixa(-5.9, -2.5, Y0, 1.1, -4.25, -3.65, M.movel); caixa(-5.9, -5.3, Y0, 1.1, -3.65, -1.8, M.movel); caixa(-4.6, -2.6, Y0, 1.1, -2.6, -1.8, M.movel);
  caixa(-5.9, -2.5, 1.1, 1.15, -4.25, -3.65, M.escuro, false); caixa(-5.9, -5.3, 1.1, 1.15, -3.65, -1.8, M.escuro, false); caixa(-4.6, -2.6, 1.1, 1.15, -2.6, -1.8, M.escuro, false);
  caixa(-3.9, -1.9, 0.72, 0.78, -0.6, 0.6, M.escuro); caixa(-3.05, -2.75, Y0, 0.72, -0.15, 0.15, M.escuro);
  for (const x of [-3.5, -2.9, -2.3]) for (const z of [-0.95, 0.95]) caixa(x - 0.2, x + 0.2, Y0, 0.5, z - 0.2, z + 0.2, M.movel);
  caixa(-5.6, -2.4, Y0, Y0 + 0.03, 1.2, 3.9, M.movel, false);
  caixa(-5.4, -2.6, Y0, 0.6, 2.7, 3.6, M.acento); caixa(-5.4, -2.6, 0.6, 1.0, 3.4, 3.6, M.acento); caixa(-4.7, -3.5, Y0, 0.5, 1.5, 2.2, M.escuro);

  // laje (preta, como num corte de verdade), com o vazio da escada
  caixa(-6, 6, YP, YL, -3.4, 4.5, M.laje); caixa(-6, 1.6, YP, YL, -4.5, -3.4, M.laje); caixa(1.6, 6, YP, YL, -4.5, -4.25, M.laje);
  // pavimento superior
  parede("x", -6, 6, -4.5, -4.25, YL, YT, [{ de: -4.8, ate: -3.4, base: 4.3, topo: 5.3, vidro: 1 }, { de: -1, ate: 0.4, base: 4.3, topo: 5.3, vidro: 1 }], M.parede);
  parede("z", -4.25, 4.25, -6, -5.75, YL, YT, [{ de: -1, ate: 1, base: 4.1, topo: 5.4, vidro: 1 }], M.parede);
  parede("z", -4.25, 4.25, 5.75, 6, YL, YT, [{ de: -1, ate: 1.5, base: 4.1, topo: 5.4, vidro: 1 }], M.parede);
  parede("x", -6, 6, 4.25, 4.5, YL, YT, [{ de: -5, ate: -2.4, base: 4.1, topo: 5.4, vidro: 1 }, { de: -0.2, ate: 2.2, base: 4.1, topo: 5.4, vidro: 1 }, { de: 3.4, ate: 5.6, base: YL, topo: 5.5, vidro: 1 }], M.parede);
  parede("z", -3.4, 4.25, -0.5, -0.35, YL, YT, [{ de: 0, ate: 0.9, base: YL, topo: 5.3 }], M.parede);
  parede("x", -5.75, -0.5, -3.4, -3.25, YL, YT, [{ de: -3.8, ate: -3, base: YL, topo: 5.3 }], M.parede);
  parede("x", -0.35, 3.2, -3.4, -3.25, YL, YT, [{ de: 0.8, ate: 1.6, base: YL, topo: 5.3 }], M.parede);
  parede("z", 1.5, 4.25, 3.2, 3.35, YL, YT, [], M.parede);
  caixa(-4.2, -2.4, YL, 3.7, 0.8, 3, M.movel); caixa(-4.2, -2.4, 3.7, 3.78, 1.6, 3, M.acento); caixa(-4.2, -2.4, 3.7, 4.3, 0.8, 0.95, M.escuro);
  caixa(-5.7, -4.9, YL, 5.6, -3, -1, M.movel); caixa(0.5, 2, YL, 3.65, 1.8, 3.8, M.movel);
  caixa(3.9, 5.6, YL, 3.7, 2, 2.8, M.acento); caixa(4.2, 5.3, YL, 3.6, 0.2, 0.8, M.escuro);
  prisma(-6.6, 6.6, -5.1, 5.1, YT, 2, M.telhado);

  /* ---------- câmera, estado e laço de desenho ---------- */
  let modo = "fachada", auto = !reduce, sujo = true, visivel = true, tween = null, w = 1, h = 1, interagiu = false;
  const papel = cor("--papel"), grafite = cor("--grafite");
  const pintar = () => {
    planoH.constant = est.h; planoV.constant = est.v;
    M.parede.color.copy(papel).lerp(grafite, est.poche);
    const asp = w / h, d = est.dist * (asp < 1.3 ? Math.pow(1.3 / asp, 0.95) : 1);
    const el = rad(lim(est.el, 3, 87)), az = rad(est.az);
    cam.position.set(Math.sin(az) * Math.cos(el) * d, est.ty + Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
    cam.lookAt(0, est.ty, 0);
    renderer.render(scene, cam);
  };
  new ResizeObserver(() => {
    w = Math.max(1, palco.clientWidth); h = Math.max(1, palco.clientHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix(); sujo = true;
  }).observe(palco);
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; sujo = true; }).observe(palco); // só desenha enquanto está na tela
  gsap.ticker.add(() => {
    if (!visivel) return;
    if (auto) { est.az += 0.05 * gsap.ticker.deltaRatio(); sujo = true; } // giro lento até o visitante mexer
    if (sujo) { sujo = false; pintar(); }
  });

  const girando = () => tween && tween.isActive();
  const ir = (nome) => {
    const alvo = ESTADOS[nome];
    modo = nome; auto = !reduce && nome === "fachada" && !interagiu;
    if (tween) tween.kill();
    if (reduce) { Object.assign(est, alvo); sujo = true; return; }
    const da = ((((alvo.az - est.az) + 180) % 360) + 360) % 360 - 180; // gira pelo caminho mais curto
    tween = gsap.to(est, { ...alvo, az: est.az + da, duration: 1.3, ease: "power3.inOut", onUpdate: () => { sujo = true; } });
  };

  /* arrastar (mouse e toque) e setas do teclado */
  let arrasto = null;
  palco.addEventListener("pointerdown", (e) => { arrasto = { x: e.clientX, y: e.clientY }; palco.setPointerCapture(e.pointerId); auto = false; interagiu = true; palco.classList.add("arrastando"); });
  palco.addEventListener("pointermove", (e) => {
    if (!arrasto) return;
    if (!girando()) {
      est.az -= (e.clientX - arrasto.x) * 0.4;
      if (modo === "fachada") est.el = lim(est.el + (e.clientY - arrasto.y) * 0.25, 4, 70);
      sujo = true;
    }
    arrasto = { x: e.clientX, y: e.clientY };
  });
  const solta = () => { arrasto = null; palco.classList.remove("arrastando"); };
  palco.addEventListener("pointerup", solta); palco.addEventListener("pointercancel", solta);
  palco.addEventListener("keydown", (e) => {
    const p = { ArrowLeft: [8, 0], ArrowRight: [-8, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[e.key];
    if (!p || girando()) return;
    e.preventDefault(); auto = false; interagiu = true;
    est.az += p[0]; if (modo === "fachada") est.el = lim(est.el + p[1], 4, 70);
    sujo = true;
  });

  return { modo: ir };
}
