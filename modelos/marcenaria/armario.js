import { WebGLRenderer, Scene, PerspectiveCamera, Color, Group, Mesh, BoxGeometry, CylinderGeometry, MeshStandardMaterial, MeshBasicMaterial, AmbientLight, DirectionalLight, HemisphereLight, PlaneGeometry, ShadowMaterial, CanvasTexture, SRGBColorSpace, Raycaster, Vector2, Vector3, PCFSoftShadowMap, LineSegments, BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from "three";
import { ESP, ROD, FRENTE, medidas } from "./pecas.mjs";

/* Armário 3D paramétrico (1 unidade = 1 m). As MESMAS medidas da lista de corte (pecas.mjs) viram caixas.
   Estado animado: e = abertura em peças (0 montado, 1 explodido); portas e gavetas abrem por clique ou pela rolagem. */

const rad = (g) => (g * Math.PI) / 180;
const lim = (x, a, b) => Math.min(b, Math.max(a, x));
const suave = (x) => x * x * (3 - 2 * x);
// história da rolagem: [progresso, explosão, abertura de portas e gavetas]
const ROTEIRO = [[0, 0, 0], [0.18, 0, 0], [0.4, 1, 0], [0.6, 1, 0], [0.78, 0, 0], [0.9, 0, 1], [1, 0, 0]];
const NOMES = { lat: "Lateral", topo: "Tampo", base: "Base", rod: "Rodapé", prat: "Prateleira", fundo: "Fundo", porta: "Porta", frente: "Frente de gaveta", gl: "Lado da gaveta", gt: "Traseira", gf: "Fundo da gaveta" };

/* veio da madeira desenhado em canvas (sem foto): faixas de ruído suave mais fios ondulados */
const cacheTex = new Map();
function textura(a, horizontal) {
  const chave = a.id + (horizontal ? "h" : "v");
  if (cacheTex.has(chave)) return cacheTex.get(chave);
  const N = 512, c = document.createElement("canvas"); c.width = c.height = N;
  const g = c.getContext("2d");
  g.fillStyle = a.cor; g.fillRect(0, 0, N, N);
  let semente = [...a.nome].reduce((s, ch) => s + ch.charCodeAt(0), 0) * 7919;
  const rnd = () => ((semente = (semente * 16807) % 2147483647) / 2147483647);
  const pts = Array.from({ length: 48 }, rnd);
  const ruido = (x) => { const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f); return pts[i % 48] * (1 - s) + pts[(i + 1) % 48] * s; };
  g.fillStyle = a.veio;
  for (let x = 0; x < N; x++) { g.globalAlpha = Math.max(0, 0.6 * ruido(x * 0.05) + 0.4 * ruido(x * 0.21 + 9) - 0.32) * 1.15; g.fillRect(x, 0, 1, N); }
  g.strokeStyle = a.veio; g.lineWidth = 1;
  for (let k = 0; k < 110; k++) {
    g.globalAlpha = 0.06 + rnd() * 0.2; g.beginPath();
    const x0 = rnd() * N, amp = 2 + rnd() * 6, f = 0.008 + rnd() * 0.02;
    for (let y = 0; y <= N; y += 8) { const x = x0 + Math.sin(y * f + k) * amp; y ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
  g.globalAlpha = 1;
  let fonte = c;
  if (horizontal) { fonte = document.createElement("canvas"); fonte.width = fonte.height = N; const h = fonte.getContext("2d"); h.translate(N, 0); h.rotate(Math.PI / 2); h.drawImage(c, 0, 0); }
  const t = new CanvasTexture(fonte); t.colorSpace = SRGBColorSpace; t.anisotropy = 4;
  cacheTex.set(chave, t); return t;
}
const HORIZONTAIS = new Set(["topo", "base", "prat", "frente", "gt", "gf", "rod"]);

export function iniciarArmario({ canvas, palco, rotulos, gsap, reduce, catalogo }) {
  const gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
  if (!gl) return null;
  const renderer = new WebGLRenderer({ canvas, context: gl, alpha: true });
  renderer.setClearColor(0x000000, 0); renderer.shadowMap.enabled = true; renderer.shadowMap.type = PCFSoftShadowMap;
  const cena = new Scene(), cam = new PerspectiveCamera(30, 1, 0.1, 60);
  cena.add(new HemisphereLight(0xffffff, 0xb9bcb4, 1.55));
  const sol = new DirectionalLight(0xffffff, 2.3); sol.position.set(2.2, 4.2, 3.2); sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024); sol.shadow.camera.left = -3; sol.shadow.camera.right = 3; sol.shadow.camera.top = 4; sol.shadow.camera.bottom = -1; sol.shadow.bias = -0.0004;
  cena.add(sol, new AmbientLight(0xffffff, 0.15));
  const raiz = getComputedStyle(document.documentElement), cor = (t) => new Color(raiz.getPropertyValue(t).trim());
  const chao = new Mesh(new PlaneGeometry(14, 14), new ShadowMaterial({ opacity: 0.22 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);

  const casa = new Group(); cena.add(casa);
  const matLinha = new LineBasicMaterial({ color: cor("--grafite") });
  const matMetal = new MeshStandardMaterial({ color: 0xcfd2d0, roughness: 0.38, metalness: 0.4 });
  const matFenda = new MeshBasicMaterial({ color: cor("--grafite") });
  const matPorId = {};
  let cfg = null, acab = catalogo.acabamentos[0], partes = [], portasObj = [], gavetasObj = [], cotas = null, rotulosVivos = [];
  const st = { e: 0, abreRoteiro: 0, az: 28, el: 10, destaque: null, travado: new Set() };
  let sujo = true, visivel = true, w = 1, h = 1, alvoY = 1.1, dist = 3.6;

  const matDe = (id) => (matPorId[id] ||= new MeshStandardMaterial({ roughness: 0.62, metalness: 0, transparent: true, opacity: 1 }));
  function pintarMateriais() {
    for (const [id, m] of Object.entries(matPorId)) {
      if (acab.tipo === "madeira") { m.map = textura(acab, HORIZONTAIS.has(id)); m.color.set(0xffffff); }
      else { m.map = null; m.color.set(acab.cor); }
      m.needsUpdate = true;
    }
  }
  function aplicarDestaque() {
    const ativos = new Set([...(st.destaque ? [st.destaque] : []), ...st.travado]);
    for (const [id, m] of Object.entries(matPorId)) {
      const on = ativos.has(id);
      m.emissive.set(on ? cor("--fita") : 0x000000); m.emissiveIntensity = on ? 0.55 : 0;
      m.opacity = ativos.size && !on ? 0.28 : 1;
    }
    sujo = true;
  }

  function limpar() {
    casa.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    casa.clear(); partes = []; portasObj = []; gavetasObj = []; rotulosVivos = [];
  }
  const caixa = (id, w, hh, d, x, y, z, off, pai = casa, extra = {}, registra = true) => {
    const m = new Mesh(new BoxGeometry(w / 100, hh / 100, d / 100), matDe(id));
    m.castShadow = m.receiveShadow = true; m.position.set(x / 100, y / 100, z / 100); m.userData = { id, ...extra }; pai.add(m);
    if (registra) partes.push({ id, obj: m, base: m.position.clone(), off: new Vector3(...off) });
    return m;
  };

  function puxador(tipo, frente, wf, hf, vertical, lado) {
    const z = ESP / 200 + 0.0004, add = (geo, mat, x, y, zz, rz = 0) => { const o = new Mesh(geo, mat); o.position.set(x, y, zz); o.rotation.z = rz; o.castShadow = true; frente.add(o); return o; };
    if (tipo === "cava") {
      if (vertical) add(new BoxGeometry(0.012, Math.min(0.5, hf / 100 * 0.35), 0.002), matFenda, lado * (wf / 200 - 0.03), 0, z);
      else add(new BoxGeometry(Math.min(0.6, wf / 100 * 0.5), 0.014, 0.002), matFenda, 0, hf / 200 - 0.03, z);
    } else if (tipo === "gola") {
      if (vertical) add(new BoxGeometry(0.014, hf / 100 - 0.02, 0.003), matFenda, lado * (wf / 200 - 0.008), 0, z);
      else add(new BoxGeometry(wf / 100 - 0.02, 0.016, 0.003), matFenda, 0, hf / 200 - 0.008, z);
    } else if (tipo === "barra") {
      const c = new CylinderGeometry(0.007, 0.007, vertical ? Math.min(0.45, hf / 100 * 0.4) : Math.min(0.5, wf / 100 * 0.4), 12);
      const o = add(c, matMetal, vertical ? lado * (wf / 200 - 0.05) : 0, vertical ? 0 : hf / 200 - 0.05, z + 0.026, vertical ? 0 : Math.PI / 2);
    } else if (tipo === "toque") {
      add(new CylinderGeometry(0.009, 0.009, 0.003, 14), matMetal, vertical ? lado * (wf / 200 - 0.05) : 0, vertical ? 0 : hf / 200 - 0.05, z + 0.0015).rotation.x = Math.PI / 2;
    }
  }

  function construir(nova) {
    cfg = nova; acab = catalogo.acabamentos.find((a) => a.id === cfg.acabamento) || catalogo.acabamentos[0];
    limpar();
    const { L, A, P, portas, gavetas } = cfg, med = medidas(cfg), dentro = L - 2 * ESP;
    for (const s of [-1, 1]) caixa("lat", ESP, A, P, s * (L / 2 - ESP / 2), A / 2, 0, [s * 0.7, 0, 0]);
    caixa("topo", dentro, ESP, P, 0, A - ESP / 2, 0, [0, 0.55, 0]);
    caixa("base", dentro, ESP, P, 0, ROD + ESP / 2, 0, [0, -0.1, 0]);
    caixa("rod", dentro, ROD, P - 6, 0, ROD / 2, -3, [0, -0.4, 0]);
    caixa("fundo", L - 0.4, A - 0.4, 0.6, 0, A / 2, -P / 2 + 0.3, [0, 0, -0.7]);
    const y0 = ROD + ESP + med.bloco, vao = A - ESP - y0;
    for (let k = 0; k < med.prat; k++) caixa("prat", dentro - 0.2, ESP, P - 2, 0, y0 + ((k + 1) * vao) / (med.prat + 1), -1, [0, (k + 1 - (med.prat + 1) / 2) * 0.16, 0.1]);
    for (let g = 0; g < gavetas; g++) {
      const yc = ROD + ESP + (g + 0.5) * FRENTE, esp = (g - (gavetas - 1) / 2) * 0.14, grupo = new Group(); casa.add(grupo);
      const f = caixa("frente", L - 0.6, FRENTE - 0.4, ESP, 0, yc, P / 2 + ESP / 2, [0, esp, 0.85], grupo, { tipo: "gaveta", idx: g });
      puxador(cfg.puxador, f, L - 0.6, FRENTE - 0.4, false, 0);
      for (const s of [-1, 1]) caixa("gl", 1.5, 12.5, P - 6, s * (dentro / 2 - 2.4), yc - 1, 2.5, [s * 0.25, esp, 0.45], grupo);
      caixa("gt", dentro - 3.2, 12.5, 1.5, 0, yc - 1, 2.5 - (P - 6) / 2 + 0.75, [0, esp, 0.35], grupo);
      caixa("gf", dentro - 3.2, 0.6, P - 6, 0, yc - 7, 2.5, [0, esp - 0.04, 0.45], grupo);
      gavetasObj.push({ grupo, valor: 0, profundidade: (P * 0.55) / 100 });
    }
    for (let i = 0; i < portas; i++) {
      const larg = L / portas - 0.3, esq = -L / 2 + (i * L) / portas + 0.15, dobraEsq = i < portas / 2 && !(portas > 2 && i === portas - 1) ? true : i === 0;
      const lado = dobraEsq ? 1 : -1, pivo = new Group();
      pivo.position.set((dobraEsq ? esq : esq + larg) / 100, (ROD + med.bloco + 0.2 + med.altPortas / 2) / 100, (P / 2 + ESP / 2) / 100);
      casa.add(pivo);
      const porta = caixa("porta", larg, med.altPortas, ESP, (lado * larg) / 2, 0, 0, [0, 0, 0], pivo, { tipo: "porta", idx: i }, false);
      puxador(cfg.puxador, porta, larg, med.altPortas, true, lado); // o puxador fica na borda livre, oposta à dobradiça
      partes.push({ id: "porta", obj: pivo, base: pivo.position.clone(), off: new Vector3((i - (portas - 1) / 2) * 0.28, 0, 1.15) });
      portasObj.push({ pivo, lado, valor: 0 });
    }
    // cotas (visíveis com o armário montado): linhas e rótulos em HTML
    if (cotas) { cena.remove(cotas); cotas.geometry.dispose(); }
    const pos = [], seg = (a, b) => pos.push(...a, ...b), l = L / 200, a = A / 100, p = P / 200;
    seg([-l, -0.05, p + 0.08], [l, -0.05, p + 0.08]); seg([-l, -0.05, p + 0.05], [-l, -0.05, p + 0.11]); seg([l, -0.05, p + 0.05], [l, -0.05, p + 0.11]);
    seg([-l - 0.08, 0, p + 0.08], [-l - 0.08, a, p + 0.08]); seg([-l - 0.05, 0, p + 0.08], [-l - 0.11, 0, p + 0.08]); seg([-l - 0.05, a, p + 0.08], [-l - 0.11, a, p + 0.08]);
    seg([l + 0.08, -0.05, -p], [l + 0.08, -0.05, p]); seg([l + 0.05, -0.05, -p], [l + 0.11, -0.05, -p]); seg([l + 0.05, -0.05, p], [l + 0.11, -0.05, p]);
    const geo = new BufferGeometry(); geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    cotas = new LineSegments(geo, matLinha); cena.add(cotas);
    // rótulos: cotas e nomes das peças principais
    rotulos.innerHTML = "";
    const novo = (txt, classe, ancora, fixo) => { const el = document.createElement("span"); el.className = "mv__rot " + classe; el.textContent = txt; rotulos.appendChild(el); rotulosVivos.push({ el, ancora, fixo }); };
    novo(`${L} cm`, "mv__rot--cota", new Vector3(0, -0.05, p + 0.08), true);
    novo(`${A} cm`, "mv__rot--cota", new Vector3(-l - 0.08, a / 2, p + 0.08), true);
    novo(`${P} cm`, "mv__rot--cota", new Vector3(l + 0.08, -0.05, 0), true);
    for (const id of ["lat", "topo", "base", "rod", "prat", "fundo", "porta", "frente"]) { const pt = partes.find((q) => q.id === id); if (pt) novo(NOMES[id], "mv__rot--peca", pt.obj, false); }
    pintarMateriais(); aplicarDestaque(); enquadrar();
  }
  // distância da câmera: o armário inteiro (e as peças abertas) cabe no quadro, inclusive em telas estreitas
  function enquadrar() {
    if (!cfg) return;
    const aspecto = w / h, ajuste = aspecto < 1.1 ? Math.pow(1.1 / aspecto, 0.9) : 1;
    alvoY = cfg.A / 200; dist = ((Math.max(cfg.A / 100, (cfg.L / 100) * 0.9) * 1.25) / Math.tan(rad(15))) * 0.42 * ajuste + 0.8;
    sujo = true;
  }

  const v = new Vector3();
  function pintar() {
    const e = suave(st.e), abre = (item, usuario) => Math.max(st.abreRoteiro, item.valor);
    for (const pt of partes) pt.obj.position.set(pt.base.x + pt.off.x * e, pt.base.y + pt.off.y * e, pt.base.z + pt.off.z * e);
    for (const pr of portasObj) pr.pivo.rotation.y = -pr.lado * abre(pr) * 1.75;
    for (const g of gavetasObj) g.grupo.position.z = abre(g) * g.profundidade;
    cotas.visible = e < 0.2;
    const d = dist * (1 + 0.45 * e), az = rad(st.az), el = rad(lim(st.el, 3, 55)), ty = alvoY;
    cam.position.set(Math.sin(az) * Math.cos(el) * d, ty + Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d); cam.lookAt(0, ty, 0);
    cam.updateMatrixWorld(); renderer.render(cena, cam);
    for (const r of rotulosVivos) {
      const mostrar = r.fixo ? e < 0.2 : e > 0.5;
      r.el.classList.toggle("on", mostrar);
      if (!mostrar) continue;
      r.fixo ? v.copy(r.ancora) : r.ancora.getWorldPosition(v);
      v.project(cam); r.el.style.transform = `translate(${((v.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * h).toFixed(1)}px)`;
    }
  }
  new ResizeObserver(() => {
    w = Math.max(1, palco.clientWidth); h = Math.max(1, palco.clientHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    enquadrar(); sujo = true;
  }).observe(palco);
  new IntersectionObserver(([x]) => { visivel = x.isIntersecting; sujo = true; }).observe(palco);
  gsap.ticker.add(() => { if (visivel && sujo) { sujo = false; if (cfg) pintar(); } });

  /* arrastar, setas e clique em porta ou gaveta */
  const raio = new Raycaster(), ponto = new Vector2(); let arrasto = null;
  const alterna = (item, aberto) => { gsap.killTweensOf(item); if (reduce) { item.valor = aberto ? 1 : 0; sujo = true; } else gsap.to(item, { valor: aberto ? 1 : 0, duration: 0.6, ease: "power3.out", onUpdate: () => { sujo = true; } }); };
  palco.addEventListener("pointerdown", (ev) => { arrasto = { x: ev.clientX, y: ev.clientY, x0: ev.clientX, y0: ev.clientY }; palco.setPointerCapture(ev.pointerId); palco.classList.add("arrastando"); });
  palco.addEventListener("pointermove", (ev) => { if (!arrasto) return; st.az -= (ev.clientX - arrasto.x) * 0.4; st.el = lim(st.el + (ev.clientY - arrasto.y) * 0.2, 3, 55); arrasto.x = ev.clientX; arrasto.y = ev.clientY; sujo = true; });
  palco.addEventListener("pointerup", (ev) => {
    const mexeu = arrasto && Math.hypot(ev.clientX - arrasto.x0, ev.clientY - arrasto.y0) > 5; arrasto = null; palco.classList.remove("arrastando");
    if (mexeu || !cfg) return;
    const r = canvas.getBoundingClientRect(); ponto.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); raio.setFromCamera(ponto, cam);
    const alvos = []; casa.traverse((o) => { if (o.userData && o.userData.tipo) alvos.push(o); });
    const acerto = raio.intersectObjects(alvos, false)[0]; if (!acerto) return;
    const { tipo, idx } = acerto.object.userData, item = (tipo === "porta" ? portasObj : gavetasObj)[idx]; alterna(item, item.valor < 0.5);
  });
  palco.addEventListener("pointercancel", () => { arrasto = null; palco.classList.remove("arrastando"); });
  palco.addEventListener("keydown", (ev) => {
    const p = { ArrowLeft: [8, 0], ArrowRight: [-8, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[ev.key]; if (!p) return;
    ev.preventDefault(); st.az += p[0]; st.el = lim(st.el + p[1], 3, 55); sujo = true;
  });

  return {
    aplicar(nova) { construir(nova); },
    progresso(p) {
      let i = 1; while (i < ROTEIRO.length - 1 && ROTEIRO[i][0] < p) i++;
      const [p0, e0, a0] = ROTEIRO[i - 1], [p1, e1, a1] = ROTEIRO[i], t = suave(lim((p - p0) / (p1 - p0 || 1), 0, 1));
      st.e = e0 + (e1 - e0) * t; st.abreRoteiro = a0 + (a1 - a0) * t; sujo = true;
    },
    destacar(id) { st.destaque = id; aplicarDestaque(); },
    travar(id, sim) { sim ? st.travado.add(id) : st.travado.delete(id); aplicarDestaque(); },
    abrir(tipo, sim) { for (const it of tipo === "porta" ? portasObj : gavetasObj) alterna(it, sim); },
  };
}
