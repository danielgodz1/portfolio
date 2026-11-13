import { WebGLRenderer, Scene, PerspectiveCamera, Color, Group, Mesh, BoxGeometry, CylinderGeometry, MeshStandardMaterial, AmbientLight, DirectionalLight, HemisphereLight, PlaneGeometry, ShadowMaterial, Vector3, Vector2, Raycaster, PCFSoftShadowMap } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { PE, pavimentos, cota, num } from "./quantitativo.mjs";

/* Prédio de concreto armado paramétrico (1 unidade = 1 m). Cada pavimento é um grupo com a base em y = 0 local,
   então escalar o grupo em y faz o andar "crescer" a partir do piso. A rolagem diz até onde a obra chegou;
   camadas (estrutura, hidráulica, elétrica, fachada) e o corte por andar são escolhas da pessoa. */

const rad = (g) => (g * Math.PI) / 180;
const lim = (x, a, b) => Math.min(b, Math.max(a, x));
const suave = (x) => x * x * (3 - 2 * x);

const caixa = (w, h, d, x, y, z) => { const g = new BoxGeometry(w, h, d); g.translate(x, y, z); return g; };
const tubo = (r, comp, x, y, z, eixo) => { const g = new CylinderGeometry(r, r, comp, 10); if (eixo === "x") g.rotateZ(Math.PI / 2); if (eixo === "z") g.rotateX(Math.PI / 2); g.translate(x, y, z); return g; };

export function iniciarPredio({ canvas, palco, rotulos, gsap, reduce }) {
  const gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
  if (!gl) return null;
  const renderer = new WebGLRenderer({ canvas, context: gl, alpha: true });
  renderer.setClearColor(0x000000, 0); renderer.shadowMap.enabled = true; renderer.shadowMap.type = PCFSoftShadowMap;
  const cena = new Scene(), cam = new PerspectiveCamera(30, 1, 0.5, 400);
  cena.add(new HemisphereLight(0xffffff, 0xb4b8b2, 1.5));
  const sol = new DirectionalLight(0xffffff, 2.4); sol.position.set(30, 60, 40); sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -50, right: 50, top: 70, bottom: -30, far: 200 }); sol.shadow.bias = -0.0006;
  cena.add(sol, new AmbientLight(0xffffff, 0.15));
  const raiz = getComputedStyle(document.documentElement), cor = (t) => new Color(raiz.getPropertyValue(t).trim());
  const mat = (c, extra = {}) => new MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0, ...extra });
  const M = {
    vidro: mat(cor("--agua").lerp(new Color(0xffffff), 0.65), { transparent: true, opacity: 0.3, roughness: 0.1, depthWrite: false }),
    agua: mat(cor("--agua"), { roughness: 0.5 }), luz: mat(cor("--sinal"), { roughness: 0.5 }), concreto: mat(cor("--cimento")),
    terra: mat(cor("--aco"), { transparent: true, opacity: 0.14, depthWrite: false }),
  };
  const chao = new Mesh(new PlaneGeometry(260, 260), new ShadowMaterial({ opacity: 0.2 })); chao.rotation.x = -Math.PI / 2; chao.position.y = 0.01; chao.receiveShadow = true; cena.add(chao);

  const predio = new Group(); cena.add(predio);
  const st = { az: 34, el: 16, p: 1, destaque: null, selecionado: null, corte: 99, camadas: { estr: true, hid: true, ele: true, veda: true } };
  let cfg = null, pavs = [], fund = null, topo = null, sujo = true, visivel = true, w = 1, h = 1, alvoY = 12, dist = 60, aoSel = () => {};
  const vivos = [];                                     // rótulos em HTML (nome, posição 3D)

  function limpar() { predio.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); predio.clear(); pavs = []; fund = topo = null; }
  const malha = (geos, material, pai, userData = {}) => { const m = new Mesh(mergeGeometries(geos, false), material); m.castShadow = m.receiveShadow = true; m.userData = userData; pai.add(m); return m; };

  function construir(nova) {
    cfg = nova; limpar();
    const { andares: n, L, D } = cfg, H = n * PE;
    const nx = Math.ceil(L / 6) + 1, nz = Math.ceil(D / 6) + 1;
    const xs = Array.from({ length: nx }, (_, i) => -L / 2 + (i * L) / (nx - 1)), zs = Array.from({ length: nz }, (_, i) => -D / 2 + (i * D) / (nz - 1));
    const nucleo = { x: 0, z: -D / 2 + 3.6, w: 5, d: 4.2 };
    // fundação: sapatas, vigas baldrame, estacas e laje de piso; terreno em corte (translúcido)
    fund = new Group(); predio.add(fund);
    const fg = [caixa(L + 1, 0.2, D + 1, 0, -0.1, 0)], eg = [];
    for (const x of xs) for (const z of zs) { fg.push(caixa(1.5, 0.8, 1.5, x, -0.5, z)); eg.push(tubo(0.25, 8, x, -4.8, z)); }
    for (const z of zs) fg.push(caixa(L, 0.5, 0.3, 0, -0.35, z)); for (const x of xs) fg.push(caixa(0.3, 0.5, D, x, -0.35, 0));
    malha(fg, M.concreto, fund); malha(eg, M.concreto, fund);
    const terra = new Mesh(new BoxGeometry(L + 22, 9, D + 22), M.terra); terra.position.y = -4.5; fund.add(terra);
    // pavimentos
    const matsE = [], matsL = [];
    for (let i = 0; i < n; i++) {
      const g = new Group(); g.position.y = i * PE; predio.add(g);
      const me = mat(cor("--cimento")), ml = mat(cor("--cimento")); matsE.push(me); matsL.push(ml);
      const pg = [];
      for (const x of xs) for (const z of zs) pg.push(caixa(0.45, PE - 0.2, 0.45, x, (PE - 0.2) / 2, z));
      for (const z of zs) pg.push(caixa(L, 0.4, 0.25, 0, PE - 0.4, z)); for (const x of xs) pg.push(caixa(0.25, 0.4, D, x, PE - 0.4, 0));
      for (const [dx, dz, ww, dd] of [[0, -nucleo.d / 2, nucleo.w, 0.25], [0, nucleo.d / 2, nucleo.w, 0.25], [-nucleo.w / 2, 0, 0.25, nucleo.d], [nucleo.w / 2, 0, 0.25, nucleo.d]]) pg.push(caixa(ww, PE - 0.2, dd, nucleo.x + dx, (PE - 0.2) / 2, nucleo.z + dz));
      const estr = malha(pg, me, g, { andar: i }), laje = new Mesh(new BoxGeometry(L + 0.4, 0.2, D + 0.4), ml);
      laje.position.y = PE - 0.1; laje.castShadow = laje.receiveShadow = true; laje.userData = { andar: i }; g.add(laje);
      const vg = [caixa(L + 0.2, PE - 0.7, 0.05, 0, (PE - 0.7) / 2 + 0.1, D / 2 + 0.12), caixa(L + 0.2, PE - 0.7, 0.05, 0, (PE - 0.7) / 2 + 0.1, -D / 2 - 0.12), caixa(0.05, PE - 0.7, D + 0.2, L / 2 + 0.12, (PE - 0.7) / 2 + 0.1, 0), caixa(0.05, PE - 0.7, D + 0.2, -L / 2 - 0.12, (PE - 0.7) / 2 + 0.1, 0)];
      const veda = malha(vg, M.vidro, g); veda.castShadow = false; veda.receiveShadow = false;
      const hid = malha([tubo(0.13, PE, nucleo.x - 2.9, PE / 2, nucleo.z), tubo(0.06, L * 0.85, 0, PE - 0.75, D * 0.2, "x"), tubo(0.06, L * 0.85, 0, PE - 0.75, -D * 0.2, "x")], M.agua, g);
      const ele = malha([caixa(0.25, PE, 0.25, nucleo.x + 2.9, PE / 2, nucleo.z), tubo(0.05, D * 0.85, L * 0.22, PE - 0.82, 0, "z"), tubo(0.05, D * 0.85, -L * 0.22, PE - 0.82, 0, "z")], M.luz, g);
      pavs.push({ g, estr, laje, veda, hid, ele, me, ml });
    }
    // cobertura: platibanda, caixa d'água e casa de máquinas
    topo = new Group(); topo.position.y = H; predio.add(topo);
    malha([caixa(L + 0.4, 1, 0.25, 0, 0.5, D / 2 + 0.1), caixa(L + 0.4, 1, 0.25, 0, 0.5, -D / 2 - 0.1), caixa(0.25, 1, D, L / 2 + 0.1, 0.5, 0), caixa(0.25, 1, D, -L / 2 - 0.1, 0.5, 0), caixa(nucleo.w, 2.8, nucleo.d, nucleo.x, 1.4, nucleo.z), tubo(1.8, 2.6, L * 0.28, 1.3, D * 0.2)], M.concreto, topo);
    // rótulos
    rotulos.innerHTML = ""; vivos.length = 0;
    const novo = (txt, fixo, ancora, classe) => { const el = document.createElement("span"); el.className = "ob__rot " + classe; el.textContent = txt; rotulos.appendChild(el); const r = { el, ancora, fixo }; vivos.push(r); return r; };
    novo(`${L} m`, true, new Vector3(0, 0, D / 2 + 2.2), "ob__rot--cota"); novo(`${D} m`, true, new Vector3(L / 2 + 2.2, 0, 0), "ob__rot--cota"); novo(`${num(H, 2)} m`, true, new Vector3(-L / 2 - 2, H / 2, D / 2 + 2), "ob__rot--cota");
    st.rotSel = novo("", true, new Vector3(-L / 2 - 1.6, 0, D / 2 + 1.6), "ob__rot--sel");
    aplicarDestaque(); enquadrar(); progresso(st.p, true);
  }
  function enquadrar() {
    if (!cfg) return;
    const H = cfg.andares * PE, diag = Math.hypot(cfg.L, cfg.D), aspecto = w / h;
    alvoY = H * 0.42; dist = Math.max(H * 1.15, (diag * 0.95) / Math.max(0.6, aspecto)) / 0.536 + diag * 0.35; sujo = true;
  }

  function aplicarDestaque() {
    pavs.forEach((p, i) => { const on = i === st.destaque || i === st.selecionado; for (const m of [p.me, p.ml]) { m.emissive.set(on ? cor("--sinal") : 0x000000); m.emissiveIntensity = on ? 0.55 : 0; } });
    if (st.rotSel) {
      const i = st.selecionado; st.rotSel.el.textContent = i == null ? "" : `${i === 0 ? "Térreo" : i + "º andar"}  ${cota(i * PE)} m`;
      if (i != null) st.rotSel.ancora.y = (i + 0.5) * PE;
      st.rotSel.el.dataset.vazio = i == null ? "1" : "0";
    }
    sujo = true;
  }
  function progresso(p, forca) {
    st.p = p; if (!cfg) return;
    const n = cfg.andares, f = suave(lim(p / 0.12, 0, 1)), pisos = n * suave(lim((p - 0.12) / 0.43, 0, 1)), inst = n * suave(lim((p - 0.55) / 0.17, 0, 1)), veda = n * suave(lim((p - 0.72) / 0.2, 0, 1));
    fund.scale.y = Math.max(0.001, f); fund.visible = f > 0.001 && st.camadas.estr;
    pavs.forEach((pv, i) => {
      const cresce = lim(pisos - i, 0, 1), corta = i < st.corte;
      pv.g.visible = cresce > 0.001 && corta; pv.g.scale.y = Math.max(0.001, cresce);
      pv.estr.visible = pv.laje.visible = st.camadas.estr; pv.hid.visible = st.camadas.hid && i < inst; pv.ele.visible = st.camadas.ele && i < inst; pv.veda.visible = st.camadas.veda && i < veda;
    });
    topo.visible = p > 0.93 && st.camadas.estr && st.corte >= n; sujo = true;
  }

  const v = new Vector3();
  function pintar() {
    const az = rad(st.az), el = rad(lim(st.el, 3, 70));
    cam.position.set(Math.sin(az) * Math.cos(el) * dist, alvoY + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist); cam.lookAt(0, alvoY, 0);
    cam.updateMatrixWorld(); renderer.render(cena, cam);
    for (const r of vivos) {
      const vazio = r.el.dataset.vazio === "1" || (r.el.classList.contains("ob__rot--cota") && st.p < 0.95);
      r.el.classList.toggle("on", !vazio); if (vazio) continue;
      v.copy(r.ancora).project(cam); r.el.style.transform = `translate(${((v.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * h).toFixed(1)}px)`;
    }
  }
  new ResizeObserver(() => { w = Math.max(1, palco.clientWidth); h = Math.max(1, palco.clientHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); enquadrar(); }).observe(palco);
  new IntersectionObserver(([x]) => { visivel = x.isIntersecting; sujo = true; }).observe(palco);
  gsap.ticker.add(() => { if (visivel && sujo && cfg) { sujo = false; pintar(); } });

  /* arrastar, setas e clique num andar */
  const raio = new Raycaster(), ponto = new Vector2(); let arrasto = null;
  palco.addEventListener("pointerdown", (e) => { arrasto = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY }; palco.setPointerCapture(e.pointerId); palco.classList.add("arrastando"); });
  palco.addEventListener("pointermove", (e) => { if (!arrasto) return; st.az -= (e.clientX - arrasto.x) * 0.4; st.el = lim(st.el + (e.clientY - arrasto.y) * 0.2, 3, 70); arrasto.x = e.clientX; arrasto.y = e.clientY; sujo = true; });
  palco.addEventListener("pointerup", (e) => {
    const mexeu = arrasto && Math.hypot(e.clientX - arrasto.x0, e.clientY - arrasto.y0) > 5; arrasto = null; palco.classList.remove("arrastando");
    if (mexeu || !cfg) return;
    const r = canvas.getBoundingClientRect(); ponto.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); raio.setFromCamera(ponto, cam);
    const alvos = []; pavs.forEach((p) => { if (p.g.visible) alvos.push(p.estr, p.laje); });
    const hit = raio.intersectObjects(alvos, false)[0]; if (hit) { st.selecionado = hit.object.userData.andar; aplicarDestaque(); aoSel(st.selecionado); }
  });
  palco.addEventListener("pointercancel", () => { arrasto = null; palco.classList.remove("arrastando"); });
  palco.addEventListener("keydown", (e) => {
    const m = { ArrowLeft: [8, 0], ArrowRight: [-8, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[e.key]; if (!m) return;
    e.preventDefault(); st.az += m[0]; st.el = lim(st.el + m[1], 3, 70); sujo = true;
  });

  return {
    aplicar(nova) { construir(nova); },
    progresso(p) { progresso(p); },
    camadas(obj) { Object.assign(st.camadas, obj); progresso(st.p); },
    cortar(ate) { st.corte = ate; progresso(st.p); },
    destacar(i) { st.destaque = i; aplicarDestaque(); },
    selecionar(i) { st.selecionado = i; aplicarDestaque(); },
    aoSelecionar(fn) { aoSel = fn; },
  };
}
