# Portfólio (Daniel dos Santos)

Site de página única, gerado em `dist/index.html` (HTML com CSS, JS e fontes embutidos).

- `src/data.mjs`: textos, contatos e lista de projetos. É aqui que você alimenta o site.
- `src/planta.mjs`: desenho da planta do projeto Império.
- `src/styles.css` e `src/main.js`: visual e animações (GSAP + Lenis).
- `npm install && npm run build` gera `dist/index.html`.

Para publicar: suba a pasta para o GitHub e, na Vercel, use o comando de build `npm run build` e a pasta de saída `dist`.
