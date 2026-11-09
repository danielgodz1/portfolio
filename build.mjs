import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { build } from "esbuild";
import { SITE, CONTATO, PROJETOS, QUEDA } from "./src/data.mjs";
import { DESENHOS } from "./src/planta.mjs";
import { CHECK, REQ } from "./src/telas.mjs";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const b64 = (p) => readFileSync(p).toString("base64");
const fonts = `
@font-face{font-family:"Bricolage Grotesque";font-style:normal;font-weight:200 800;font-display:swap;src:url(data:font/woff2;base64,${b64("node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2")}) format("woff2");}
@font-face{font-family:"Instrument Serif";font-style:italic;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,${b64("node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2")}) format("woff2");}
`;
const css = readFileSync("src/styles.css", "utf8").replace("/*FONTS*/", fonts);
const js = (await build({ entryPoints: ["src/main.js"], bundle: true, minify: true, format: "iife", write: false, target: "es2019" })).outputFiles[0].text;

/* ---- Hero: bordas de lápis (cada borda é um <svg> para girar sem distorcer) ---- */
const bordaH = (cls) => `<svg class="edge edge--${cls}" viewBox="0 0 1000 14" preserveAspectRatio="none" aria-hidden="true"><path class="a" d="M2 7 L130 6 L280 8 L430 6.2 L590 7.6 L740 6 L890 7.4 L998 6.6"/><path class="b" d="M0 8 L210 7 L440 8.2 L660 7.2 L880 8.1 L1000 7.4"/></svg>`;
const bordaV = (cls) => `<svg class="edge edge--${cls}" viewBox="0 0 14 1000" preserveAspectRatio="none" aria-hidden="true"><path class="a" d="M7 2 L6 150 L8 320 L6.4 500 L7.6 680 L6 850 L7 998"/><path class="b" d="M8 0 L7 240 L8.2 470 L7.2 720 L8 1000"/></svg>`;

/* ---- Projetos ---- */
const figura = (p) => {
  if (p.desenho && DESENHOS[p.desenho])
    return `<figure class="projeto__figura">${DESENHOS[p.desenho]}${p.legenda ? `<figcaption>${esc(p.legenda)}</figcaption>` : ""}<button type="button" class="led-btn" aria-pressed="false" data-on="${esc(p.ledOn || "Acender o LED")}" data-off="${esc(p.ledOff || "Apagar o LED")}" hidden>${esc(p.ledOn || "Acender o LED")}</button></figure>`;
  if (p.imagem) return `<figure class="projeto__figura"><img src="${esc(p.imagem)}" alt="${esc(p.alt || p.nome)}" loading="lazy"></figure>`;
  return `<figure class="projeto__figura"><div class="moldura"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="98" height="98" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><span>${esc(p.nome)}</span></div></figure>`;
};
const emul = (e) => `
<section class="emul emul--${e.tema}" id="emul-${e.id}" data-passos="${e.passos.length}" data-passo="0" aria-labelledby="em-${e.id}">
  <div class="emul__palco">
    <div class="emul__texto">
      <p class="emul__kicker">Por dentro · ${esc(e.titulo)}</p>
      <h3 id="em-${e.id}">O sistema real, passo a passo.</h3>
      <ol class="emul__passos">${e.passos.map(([t, d], i) => `<li data-i="${i}"><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join("")}</ol>
      <p class="emul__aviso">Emulação feita por mim, com dados fictícios.</p>
    </div>
    <div class="emul__janela" aria-hidden="true">
      <div class="jan__barra"><i></i><i></i><i></i><span>${esc(e.titulo)}</span></div>
      <div class="jan__corpo">${e.html}</div>
    </div>
  </div>
</section>`;
const cena3d = `
<section class="cena3d" id="quarto" aria-labelledby="c3-t">
  <div class="cena3d__palco">
    <canvas class="cena3d__tela" aria-hidden="true"></canvas>
    <div class="cena3d__texto">
      <p class="emul__kicker">Império Móveis Planejados</p>
      <h3 id="c3-t">Da planta ao quarto.</h3>
      <p class="cena3d__leg">A mesma linha vira parede, o desenho vira móvel e o LED acende por último. Esta cena é 3D de verdade, feita com Three.js.</p>
    </div>
  </div>
</section>`;
const projeto = (p, i) => `
<section class="projeto" id="${esc(p.id)}"${p.desenho ? ` data-desenho="${esc(p.desenho)}"` : ""} aria-labelledby="t-${esc(p.id)}">
  <div class="projeto__palco">
    <div class="projeto__texto">
      <p class="projeto__num" aria-hidden="true">${String(i + 1).padStart(2, "0")} / ${String(PROJETOS.length).padStart(2, "0")}</p>
      <h2 id="t-${esc(p.id)}">${esc(p.nome)}</h2>
      <p class="projeto__resumo">${esc(p.resumo)}</p>
      ${p.texto.map((t) => `<p class="corpo">${esc(t)}</p>`).join("\n      ")}
      ${[["desafio","O desafio"],["solucao","A solução"],["resultado","O resultado"]].filter(([k])=>p[k]).map(([k,t])=>`<h3 class="estudo">${t}</h3><p class="corpo">${esc(p[k])}</p>`).join("\n      ")}
      <dl class="fatos">${p.fatos.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      ${p.links?.length ? `<p class="projeto__links">${p.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.texto)}</a>`).join("<br>")}</p>` : ""}
    </div>
    ${figura(p)}
  </div>
</section>`;

/* ---- Contato (só o que foi preenchido) ---- */
const itens = [];
if (CONTATO.email) itens.push(`<li><a href="mailto:${esc(CONTATO.email)}">${esc(CONTATO.email)}</a></li>`);
if (CONTATO.whatsapp) itens.push(`<li><a href="https://wa.me/${esc(CONTATO.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a></li>`);
if (CONTATO.instagram) itens.push(`<li><a href="${esc(CONTATO.instagram)}" target="_blank" rel="noopener">Instagram</a></li>`);
if (CONTATO.github) itens.push(`<li><a href="${esc(CONTATO.github)}" target="_blank" rel="noopener">GitHub</a></li>`);
if (CONTATO.linkedin) itens.push(`<li><a href="${esc(CONTATO.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>`);
const contatos = itens.length
  ? `<ul class="contatos">${itens.join("")}</ul>`
  : `<p class="contatos contatos--vazio">Os canais de contato entram aqui.</p>`;

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(SITE.titulo)}</title>
<meta name="description" content="${esc(SITE.descricao)}">
<meta name="theme-color" content="#0f2c7a">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0f2c7a"/><path d="M10 12 H46 M54 20 V54 H10 V12" fill="none" stroke="#dce6ff" stroke-width="5" stroke-linecap="round"/><path d="M20 44 H40" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/></svg>')}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(SITE.titulo)}">
<meta property="og:description" content="${esc(SITE.descricao)}">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Person",name:SITE.nome,jobTitle:"Desenvolvedor web",address:{"@type":"PostalAddress",addressLocality:"Jaú",addressRegion:"SP",addressCountry:"BR"},...(CONTATO.github||CONTATO.linkedin?{sameAs:[CONTATO.github,CONTATO.linkedin].filter(Boolean)}:{})}).replace(/</g,"\\u003c")}</script>
<style>${css}</style>
</head>
<body>
<a class="pular" href="#projetos">Pular para os projetos</a>
<div class="progresso" aria-hidden="true"></div>
<div class="cursor" aria-hidden="true"></div>
<header class="hero" id="topo">
  <div class="hero__barra">
    <span>${esc(SITE.nome)}</span>
    <nav aria-label="Principal"><a href="#projetos">Projetos</a><a href="#contato">Contato</a></nav>
  </div>
  <div class="hero__caixa">
    ${bordaH("top")}${bordaV("right")}${bordaH("bottom")}${bordaV("left")}
    <h1 class="hero__titulo"><span class="l">Sites que</span><span class="l">não cabem</span><span class="l l-fuga">na caixa.</span></h1>
  </div>
  <p class="hero__intro">${esc(SITE.intro)}</p>
  <p class="hero__dica" aria-hidden="true">Role para abrir a caixa.</p>
</header>
<main id="projetos">
<section class="queda" id="ideias" aria-labelledby="queda-t">
  <div class="queda__palco">
    <h2 id="queda-t" class="queda__titulo">${esc(QUEDA.titulo)}</h2>
    <p class="queda__dica" aria-hidden="true">${esc(QUEDA.dica)}</p>
    <ul class="queda__lista">${QUEDA.chips.map((c) => (Array.isArray(c) ? `<li class="chip chip--marca">${esc(c[0])}</li>` : `<li class="chip">${esc(c)}</li>`)).join("")}</ul>
  </div>
</section>
${PROJETOS.map((p, i) => projeto(p, i) + (p.id === "imperio" ? cena3d : "") + ({ flowcheck: emul(CHECK), flowrequest: emul(REQ) }[p.id] || "")).join("\n")}
</main>
<footer class="fim" id="contato">
  <div class="vazia">
    <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100"><rect x="1" y="1" width="98" height="98"/></svg>
    <p>Esta caixa está vazia de propósito. O próximo projeto entra aqui.</p>
  </div>
  <h2>Tem um site que precisa sair da caixa?</h2>
  ${contatos}
  <p class="rodape">${esc(SITE.nome)}, ${esc(SITE.cidade)}</p>
</footer>
<script>${js}</script>
</body>
</html>`;

mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", html);
console.log("dist/index.html", (html.length / 1024).toFixed(0) + " KB");
