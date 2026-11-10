// Gera dist/modelos/<slug>/index.html (arquivo único) para cada modelo e a página índice.
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "node:fs";
import { build } from "esbuild";

export const MODELOS = ["academia", "roupas", "perfumes", "beleza", "restaurante", "hamburgueria", "pizzaria"];
const SITE = "https://portfolio-programacao1.vercel.app"; // domínio usado na prévia de link (og:image)
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const b64 = (p) => readFileSync("node_modules/" + p).toString("base64");
const face = ([fam, file, w = "400", s = "normal"]) =>
  `@font-face{font-family:"${fam}";font-style:${s};font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64(file)}) format("woff2");}`;
const base = readFileSync("modelos/base.css", "utf8");
const icone = (letra, fundo, tinta) =>
  "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${fundo}"/><text x="32" y="44" font-family="Georgia,serif" font-size="36" text-anchor="middle" fill="${tinta}">${letra}</text></svg>`);

const lista = [];
const so = process.argv.slice(2);
for (const slug of so.length ? so : MODELOS) {
  const m = await import(`./${slug}/page.mjs`);
  const css = readFileSync(`modelos/${slug}/styles.css`, "utf8");
  const js = (await build({ entryPoints: [`modelos/${slug}/main.js`], bundle: true, minify: true, format: "iife", write: false, target: "es2019" })).outputFiles[0].text;
  mkdirSync(`dist/modelos/${slug}`, { recursive: true });
  if (existsSync(`modelos/${slug}/midia`)) cpSync(`modelos/${slug}/midia`, `dist/modelos/${slug}/midia`, { recursive: true });
  if (existsSync(`modelos/${slug}/dados.json`)) cpSync(`modelos/${slug}/dados.json`, `dist/modelos/${slug}/dados.json`); // lido pela página /modelos/editar/
  // variantes (ex.: níveis do modelo de beleza) saem em subpastas e usam a mídia da pasta principal
  for (const v of [null, ...(m.variantes || [])]) {
    if (m.usar) m.usar(v);
    const M = m.meta, volta = v ? "../../" : "../";
    const fontes = typeof m.fonts === "function" ? m.fonts() : m.fonts;
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(M.titulo)}</title>
<meta name="description" content="${esc(M.descricao)}">
<meta name="theme-color" content="${M.fundo}">
<link rel="icon" href="${icone(M.nome[0], M.fundo, M.acento)}">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(M.titulo)}"><meta property="og:description" content="${esc(M.descricao)}">
${M.og ? `<meta property="og:image" content="${SITE}/modelos/${slug}/${M.og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">` : ""}
${m.schema ? `<script type="application/ld+json">${JSON.stringify(m.schema()).replace(/</g, "\u003c")}</script>` : ""}
<style>${fontes.map(face).join("")}${base}${css}${m.cssTema ? m.cssTema() : ""}</style>
</head>
<body>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
${m.html()}
<div class="demo"><p>${esc(M.aviso || "Modelo de demonstração: marca, preços e dados fictícios.")} <a href="${volta}">Ver todos os modelos</a></p>${m.demoExtra ? m.demoExtra() : ""}</div>
<script>${js}</script>
</body>
</html>`;
    const pasta = v ? `dist/modelos/${slug}/${v.pasta}` : `dist/modelos/${slug}`;
    mkdirSync(pasta, { recursive: true });
    writeFileSync(`${pasta}/index.html`, html);
    console.log(`${pasta}/index.html`, (html.length / 1024).toFixed(0) + " KB");
    lista.push({ ...M, slug: v ? `${slug}/${v.pasta}` : slug });
  }
  if (m.usar) m.usar(null);
}

const indice = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Modelos de sites imersivos · Daniel dos Santos</title>
<meta name="description" content="Modelos de sites imersivos para academia, loja de roupas, perfumaria, estúdio de beleza, restaurante, hamburgueria e pizzaria.">
<meta name="robots" content="noindex">
<style>
*{box-sizing:border-box}body{margin:0;background:#0f2c7a;color:#f3f5fb;font:400 1.1rem/1.5 system-ui,sans-serif;padding:10vh 6vw}
h1{margin:0;font-size:clamp(2.4rem,7vw,5rem);line-height:.95;letter-spacing:-.03em;max-width:12ch}
p.l{margin:1rem 0 3rem;max-width:44ch;color:#dce6ff}
ol{list-style:none;margin:0;padding:0;border-top:2px solid #8fa8e8}
li a{display:grid;grid-template-columns:3rem 1fr;gap:.2rem 1rem;padding:1.4rem 0;border-bottom:2px solid #8fa8e8;color:inherit;text-decoration:none}
li a:hover b,li a:focus-visible b{color:#ffd23f}a:focus-visible{outline:3px solid #ffd23f;outline-offset:4px}
li span.n{grid-row:span 2;font-style:italic;color:#8fa8e8}b{font-size:clamp(1.5rem,4vw,2.3rem);line-height:1.1}li small{color:#dce6ff;font-size:1rem}
footer{margin-top:4rem;color:#8fa8e8}footer a{color:#fff}
</style></head><body>
<h1>Modelos que não cabem na caixa.</h1>
<p class="l">Pontos de partida para negócios reais. Cada um tem um conceito de rolagem próprio e troca de marca, cores e conteúdo em um único arquivo.</p>
<ol>${lista.map((M, i) => `<li><a href="./${M.slug}/"><span class="n">0${i + 1}</span><b>${esc(M.rotulo)} · ${esc(M.nome)}</b><small>${esc(M.conceito)}</small></a></li>`).join("")}</ol>
<footer><a href="/">Portfólio de Daniel dos Santos</a></footer>
</body></html>`;
// o índice só é refeito no build completo: num build parcial (ex.: só "beleza") ele perderia os outros modelos
if (!so.length) { writeFileSync("dist/modelos/index.html", indice); console.log("dist/modelos/index.html"); }
else console.log("índice mantido (build parcial)");
mkdirSync("dist/modelos/editar", { recursive: true });
cpSync("modelos/editar.html", "dist/modelos/editar/index.html");
// painel da dona: agenda.js + painel.js empacotados dentro do HTML
const painelJs = (await build({ entryPoints: ["modelos/painel.js"], bundle: true, minify: true, format: "iife", write: false, target: "es2019" })).outputFiles[0].text;
mkdirSync("dist/modelos/painel", { recursive: true });
writeFileSync("dist/modelos/painel/index.html", readFileSync("modelos/painel.html", "utf8").replace("/*PAINEL_JS*/", () => painelJs));
console.log("dist/modelos/painel/index.html");
