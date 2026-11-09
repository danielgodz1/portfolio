// Gera dist/modelos/<slug>/index.html (arquivo único) para cada modelo e a página índice.
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "node:fs";
import { build } from "esbuild";

export const MODELOS = ["academia", "roupas", "perfumes", "beleza", "restaurante", "hamburgueria", "pizzaria"];
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
  const M = m.meta;
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
<style>${m.fonts.map(face).join("")}${base}${css}</style>
</head>
<body>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
${m.html()}
<p class="demo">Modelo de demonstração: marca, preços e dados fictícios. <a href="../">Ver todos os modelos</a></p>
<script>${js}</script>
</body>
</html>`;
  mkdirSync(`dist/modelos/${slug}`, { recursive: true });
  if (existsSync(`modelos/${slug}/midia`)) cpSync(`modelos/${slug}/midia`, `dist/modelos/${slug}/midia`, { recursive: true });
  writeFileSync(`dist/modelos/${slug}/index.html`, html);
  console.log(`dist/modelos/${slug}/index.html`, (html.length / 1024).toFixed(0) + " KB");
  lista.push(M);
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
<p class="l">Cinco pontos de partida para negócios reais. Cada um tem um conceito de rolagem próprio e troca de marca, cores e conteúdo em um único arquivo.</p>
<ol>${lista.map((M, i) => `<li><a href="./${M.slug}/"><span class="n">0${i + 1}</span><b>${esc(M.rotulo)} · ${esc(M.nome)}</b><small>${esc(M.conceito)}</small></a></li>`).join("")}</ol>
<footer><a href="/">Portfólio de Daniel dos Santos</a></footer>
</body></html>`;
writeFileSync("dist/modelos/index.html", indice);
console.log("dist/modelos/index.html");
