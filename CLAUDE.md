# Portfólio imersivo + modelos de sites (Daniel dos Santos)

Idioma: português. Respostas enxutas, sem preâmbulo nem recapitulação; em código, mostrar só o trecho alterado; perguntar só se algo bloquear (uma pergunta curta). Encurtar nunca pode cortar números, comandos, limites ou avisos.

## O que é
- Site de portfólio "fora da caixa" (raiz) + 7 modelos de sites imersivos para adaptar e vender a empresas: academia, roupas, perfumes, beleza, restaurante, hamburgueria, pizzaria (`modelos/`).
- Repo: github.com/danielgodz1/portfolio (branch main). Vercel (time `programacao1`) faz deploy automático a cada push. URL: https://portfolio-programacao1.vercel.app (modelos em `/modelos/`). Proteção de login da Vercel está desligada (site público).
- Contatos no site: daniel_santos172@hotmail.com, github.com/danielgodz1, linkedin.com/in/danieldossantos-ti.

## Build e teste
- `npm run build` = `node build.mjs && node modelos/build.mjs` → `dist/`. Só modelos: `node modelos/build.mjs roupas hamburgueria`.
- Sites estáticos de um arquivo (esbuild, fontes em base64, CSS inline). GSAP + ScrollTrigger, um Lenis só (via gsap.ticker), matter-js, three.js, canvas.
- Teste visual (Playwright): `python3 test/modelo.py <slug> <largura> <altura> [reduce]` → capturas + overflow + erros. Testar 1440×900, 390×844 e reduce.

## Arquitetura dos modelos
- Cada modelo: `modelos/<slug>/{page.mjs,styles.css,main.js,midia/}`. `page.mjs` tem o bloco `DADOS` (conteúdo) + meta + html().
- `modelos/core.js`: iniciar(), abas(), passos(), `cenaReal()` (vídeo controlado pela rolagem). `modelos/real.mjs`: HTML da cena. `modelos/base.css`: estilos `.real*`.
- `cena = {video, poster, credito, alt, dur, passos:[[titulo,texto]], vertical?, fumaca?}`; vídeo vazio = seção omitida.
- REGRA: `cenaReal()` roda no FIM de cada main.js, seguido de `ScrollTrigger.sort(); ScrollTrigger.refresh();` (senão o vídeo não avança).
- Vídeo por rolagem: `<video muted playsinline preload="auto">` pausado, `currentTime = progresso*(duration-0.05)` com guarda de seeking. Encode: `ffmpeg -an -vf scale=1280:-2,fps=24 -c:v libx264 -preset veryfast -crf 24 -g 6 -keyint_min 6 -pix_fmt yuv420p -movflags +faststart` + pôster jpg. Script: `modelos/preparar-video.sh`.
- Roupas: seção "Troque o look" (`DADOS.colecoes`, 3 vídeos `midia/col-N.mp4` em cross-fade, cor/título/peças trocam; título por letra dentro de `.pal` com nowrap).
- Hamburgueria e pizzaria são clones do restaurante com `prato: {desenho:false}` e cena própria.
- Guia de adaptação a cliente: `modelos/LEIA-ME.md`. Ao entregar a um cliente, remover a linha "Modelo de demonstração" em `modelos/build.mjs`.

## Mídia
- Vídeos gerados no Google Flow (Omni 1.2 Flash, 720p, 8 s = 24 créditos cada) e já aplicados em 1280 px (commit adcbba4). Créditos de IA aparecem em cada modelo.
- Originais na pasta Downloads do PC do Daniel (nomes tipo `Model_posing_in_green_studio_*.mp4`, `Assembling_artisan_smash_burger_*.mp4`, `Brush_painting_red_gel_polish_*.mp4`).
- Vídeo de unhas gerado e NÃO usado (beleza poderia ganhar 2ª cena).
- Sem marcas reais nos modelos (nem Anti Social Social Club, Lattafa, Kikos): prompts dos vídeos dizem "no text, no logos, no brand names".

## Regras de conteúdo
- Portfólio: só fatos reais (FlowCheck e FlowRequest, dos READMEs dos repositórios dele). Emulações e modelos usam dados fictícios.

## Pendências
- Abrir os links no ar e testar celular/reduce em todos os 7 modelos (só roupas e hamburgueria foram testados após a troca de vídeo).
- Segunda cena de unhas na beleza; fotos opcionais (`foto`) em roupas e perfumes.
- Portfólio: confirmar texto do Império, fotos/URL reais, e se cita a Jaupavi nos projetos Flow.
- Ideia futura: personagem consistente nos vídeos de roupas (gerar imagem-base e reutilizar).
