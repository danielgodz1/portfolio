import { WebGLRenderer, Scene, PerspectiveCamera, Color, Mesh, BoxGeometry, CylinderGeometry, MeshBasicMaterial, EdgesGeometry, LineSegments, LineBasicMaterial, Group, GridHelper } from "three";

/* Da planta ao quarto: as mesmas coordenadas da planta SVG viram volume. progresso 0..1 vem da rolagem. */
const U = 40; // 1 unidade = 40px da planta
const X = (px) => (px - 300) / U, Z = (py) => (py - 260) / U;

export function iniciarCena3D({ palco, canvas, gsap, ScrollTrigger, reduce }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch (e) {
    palco.closest(".cena3d").hidden = true; return;
  }
  const AZUL = 0x0f2c7a, TRACO = 0xdce6ff, PAPEL = 0xf3f5fb, MARCA = 0xffd23f;
  renderer.setClearColor(AZUL);
  const scene = new Scene(); scene.background = new Color(AZUL);
  const cam = new PerspectiveCamera(32, 1, 0.1, 100);

  const peças = []; // {g, ini, dur} sobem do chão
  const mat = (c) => new MeshBasicMaterial({ color: c });
  const linhaTraco = new LineBasicMaterial({ color: TRACO }), linhaAzul = new LineBasicMaterial({ color: AZUL });
  const room = new Group(); scene.add(room);

  // caixa com base no chão (origem embaixo) + arestas
  const caixa = (x0, z0, x1, z1, h, face, linha, ini, dur = 0.18, y0 = 0) => {
    const w = Math.abs(x1 - x0), d = Math.abs(z1 - z0);
    const geo = new BoxGeometry(w, h, d); geo.translate(0, h / 2, 0);
    const m = new Mesh(geo, mat(face));
    m.add(new LineSegments(new EdgesGeometry(geo), linha));
    const g = new Group(); g.add(m);
    g.position.set((x0 + x1) / 2, y0, (z0 + z1) / 2);
    g.scale.y = 0.0001; room.add(g);
    peças.push({ g, ini, dur });
    return g;
  };
  const px = (a, b, c, d, h, face, linha, ini, dur, y0) => caixa(X(a), Z(b), X(c), Z(d), h, face, linha, ini, dur, y0);

  // chão
  const grade = new GridHelper(16, 32, TRACO, TRACO); grade.material.opacity = 0.14; grade.material.transparent = true; grade.position.set(0, -0.01, 0); scene.add(grade);

  // paredes (mesmos eixos da planta; vãos da porta e da janela)
  const H = 2.6, T = 6; // espessura em px
  const P = 0x1b43a8;
  px(40 - T, 40 - T, 300, 40 + T, H, P, linhaTraco, 0.00);           // topo esq
  px(460, 40 - T, 560 + T, 40 + T, H, P, linhaTraco, 0.02);          // topo dir
  px(300, 40 - T, 460, 40 + T, 0.9, P, linhaTraco, 0.04);            // peitoril
  px(300, 40 - T, 460, 40 + T, 0.35, P, linhaTraco, 0.04, 0.18, 2.25); // verga
  px(560 - T, 40 - T, 560 + T, 480 + T, H, P, linhaTraco, 0.06);     // direita
  px(170, 480 - T, 560 + T, 480 + T, H, P, linhaTraco, 0.08);        // baixo (vão da porta 90–170)
  px(40 - T, 480 - T, 90, 480 + T, H, P, linhaTraco, 0.10);
  px(40 - T, 40 - T, 40 + T, 480 + T, H, P, linhaTraco, 0.12);       // esquerda

  // móveis (papel com aresta azul)
  const guarda = px(46, 84, 118, 356, 2.35, PAPEL, linhaAzul, 0.30, 0.2);
  px(284, 48, 472, 100, 0.78, PAPEL, linhaAzul, 0.40, 0.2);          // bancada
  px(338, 196, 548, 362, 0.5, PAPEL, linhaAzul, 0.46, 0.2);          // cama
  px(538, 196, 548 + 4, 362, 1.15, PAPEL, linhaAzul, 0.50, 0.2);     // cabeceira
  px(506, 148, 548, 188, 0.58, PAPEL, linhaAzul, 0.54, 0.16);
  px(506, 370, 548, 410, 0.58, PAPEL, linhaAzul, 0.56, 0.16);
  {
    const geo = new CylinderGeometry(0.42, 0.42, 0.5, 20); geo.translate(0, 0.25, 0);
    const m = new Mesh(geo, mat(PAPEL)); m.add(new LineSegments(new EdgesGeometry(geo), linhaAzul));
    const g = new Group(); g.add(m); g.position.set(X(393), 0, Z(132)); g.scale.y = 0.0001; room.add(g); peças.push({ g, ini: 0.6, dur: 0.14 });
  }

  // LED (amarelo): cresce ao longo do comprimento no fim
  const leds = [];
  const led = (x0, z0, x1, z1, y, ini) => {
    const w = Math.max(Math.abs(x1 - x0), 0.06), d = Math.max(Math.abs(z1 - z0), 0.06);
    const m = new Mesh(new BoxGeometry(w, 0.06, d), mat(MARCA));
    m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
    const g = new Group(); g.add(m); room.add(g); leds.push({ m, g, along: d > w ? "z" : "x", ini });
    m.scale[d > w ? "z" : "x"] = 0.0001;
  };
  led(X(118) + 0.04, Z(84), X(118) + 0.04, Z(356), 2.2, 0.82);          // guarda-roupa
  led(X(284), Z(100) + 0.04, X(472), Z(100) + 0.04, 0.62, 0.86);          // bancada
  led(X(338) - 0.04, Z(196), X(338) - 0.04, Z(362), 0.42, 0.90);          // cama

  const resize = () => {
    const w = palco.clientWidth, h = palco.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
  };
  const render = (p) => {
    const e = (a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
    const sub = e(0, 0.8), ease = 1 - Math.pow(1 - sub, 3);
    const elev = (85 - 52 * ease) * Math.PI / 180, az = (-10 - 38 * ease) * Math.PI / 180;
    const narrow = cam.aspect < 1, r = (narrow ? 64 : 31) - 3 * ease;
    cam.position.set(Math.sin(az) * Math.cos(elev) * r, Math.sin(elev) * r, Math.cos(az) * Math.cos(elev) * r);
    cam.lookAt(narrow ? 0 : -3.6, 0.6 * ease, 0);
    for (const { g, ini, dur } of peças) { const k = e(ini, ini + dur); g.scale.y = Math.max(0.0001, 1 - Math.pow(1 - k, 3)); }
    for (const l of leds) l.m.scale[l.along] = Math.max(0.0001, e(l.ini, l.ini + 0.1));
    renderer.render(scene, cam);
  };

  resize(); addEventListener("resize", () => { resize(); render(estado.p); });
  const estado = { p: reduce ? 1 : 0 };
  render(estado.p);
  if (reduce) return;
  let ativo = false;
  ScrollTrigger.create({
    trigger: palco, start: "top top", end: "+=260%", pin: true, anticipatePin: 1, scrub: 0.6,
    onUpdate: (st) => { estado.p = st.progress; if (ativo) render(estado.p); },
  });
  ScrollTrigger.create({ trigger: palco.closest("section"), start: "top bottom", end: "bottom top", onToggle: (s) => (ativo = s.isActive) });
  render(0);
}
