# Portfólio imersivo + modelos de sites (Daniel dos Santos)

Idioma: português. Respostas enxutas, sem preâmbulo nem recapitulação; em código, mostrar só o trecho alterado; perguntar só se algo bloquear (uma pergunta curta). Encurtar nunca pode cortar números, comandos, limites ou avisos.

## O que é
- Site de portfólio "fora da caixa" (raiz) + 7 modelos de sites imersivos para adaptar e vender a empresas: academia, roupas, perfumes, beleza, restaurante, hamburgueria, pizzaria (`modelos/`).
- Repo: github.com/danielgodz1/portfolio (branch main). Vercel (time `programacao1`) faz deploy automático a cada push. URL: https://portfolio-programacao1.vercel.app (modelos em `/modelos/`). Proteção de login da Vercel está desligada (site público).
- Contatos no site: daniel_santos172@hotmail.com, github.com/danielgodz1, linkedin.com/in/danieldossantos-ti.

## Build e teste
- `npm run build` = `node build.mjs && node modelos/build.mjs` → `dist/`. Só modelos: `node modelos/build.mjs roupas hamburgueria`.
- Sites estáticos de um arquivo (esbuild, fontes em base64, CSS inline). GSAP + ScrollTrigger, um Lenis só (via gsap.ticker), matter-js, three.js, canvas.
- Teste visual (Playwright, instalado neste PC): `python test/modelo.py <slug> <largura> <altura> [reduce]` → sobe um servidor local com Range, salva capturas e `test/<slug>_<d|m|mr>_sheet.png`, mostra overflow e erros. Testar 1440×900, 390×844 e reduce.
- Beleza tem 2 níveis no mesmo código: `dados.json` → `nivel` (essencial | cinematografico) e `tema` {paleta: vinho|nude|lavanda|salvia, fontes: classica|editorial|delicada|moderna}; tabelas em `NIVEIS`, `PALETAS`, `FONTES` do `page.mjs`. O build publica o nível do `dados.json` em `/modelos/beleza/` e as `variantes` em subpastas (`essencial/`, mídia via `../`). Essencial: sacola simples que manda o pedido pronto no WhatsApp (sem agenda nem pagamento; a dona marca o horário). Cinematográfico: vídeos, provador, régua, agenda com horários livres e Pix simulado. O nível "interativo" foi descartado (era igual ao completo). A barra do protótipo troca de nível e de paleta e tem links para o painel e o editor.
- Agenda: `modelos/agenda.js` (camada de dados; hoje modo demo em localStorage com reservas de exemplo, chave `agenda-<slug>`). Painel da dona: `modelos/painel.html` + `painel.js` → `/modelos/painel/?m=<slug>` (agenda, confirmar, atendida, cancelar, bloquear horários). SQL pronto e NÃO aplicado: `supabase/agenda.sql` (índice único por horário, RLS, funções `horarios_ocupados` e `reservar`).
- Ver localmente: `npm run build` e `npm run preview` → http://localhost:4173/modelos/. Build parcial (`node modelos/build.mjs beleza`) não mexe no índice.
- Beleza: conteúdo em `modelos/beleza/dados.json` (importado por `page.mjs`). Editor sem código: `modelos/editar.html` → `/modelos/editar/?m=<slug>` (lê `dist/modelos/<slug>/dados.json`, valida e baixa o JSON novo).

## Arquitetura dos modelos
- Cada modelo: `modelos/<slug>/{page.mjs,styles.css,main.js,midia/}`. `page.mjs` tem o bloco `DADOS` (conteúdo) + meta + html().
- `modelos/core.js`: iniciar(), abas(), passos(), `cenaReal()` (vídeo controlado pela rolagem). `modelos/real.mjs`: HTML da cena. `modelos/base.css`: estilos `.real*`.
- `cena = {video, poster, credito, alt, dur, passos:[[titulo,texto]], vertical?, fumaca?}`; vídeo vazio = seção omitida.
- REGRA: `cenaReal()` roda no FIM de cada main.js, seguido de `ScrollTrigger.sort(); ScrollTrigger.refresh();` (senão o vídeo não avança).
- Vídeos de cena começam com `preload="none"` e só carregam a 1,5 tela de distância; com economia de dados ou 2G fica só o pôster (`core.js`).
- `build.mjs`: `meta.og` vira `og:image` absoluta (constante `SITE`) e `export schema()` vira JSON-LD.
- Beleza, hero: vídeo `midia/hero.mp4` (olho real: cílios crescem, depois henna na sobrancelha) controlado pela rolagem, com linhas de mapeamento em SVG por cima. Coordenadas em `OLHO` (quadro 960×540; olho esquerdo da modelo, cabeça da sobrancelha à direita). Celular: bloco 4:3 alinhado à direita (`xMax`); computador: tela cheia (`xMid`). O mergulho usa a pupila de `OLHO`.
- Vídeo por rolagem: `<video muted playsinline>` pausado, `currentTime = progresso*(duration-0.05)` com guarda de seeking. Encode: `ffmpeg -an -vf scale=1280:-2,fps=24 -c:v libx264 -preset veryfast -crf 24 -g 6 -keyint_min 6 -pix_fmt yuv420p -movflags +faststart` + pôster jpg. Script: `modelos/preparar-video.sh`.
- Roupas, arara: fotos do Flow (Nano Banana 2.1, 3:4, upscale 2K, reduzidas a 800 px) dentro de `.peca-fundo` (fundo bege; o `will-change` do `.cabide` isola a camada e o `multiply` precisa do bege ali dentro). Cena: Omni 1.2 Flash 8 s, upscale 1080p, codificada a 1280 px. ffmpeg com libx264 neste PC: `~/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg.exe`.
- Roupas: lookbook usa quadros dos vídeos (`midia/look-N.jpg`, tirados em 4,5 s). Restaurante: no celular os rótulos do prato viram lista (`.prato__leg`). Beleza cinematográfica: link "Preços" no topo e atalho no hero para `#catalogo`.
- Roupas: seção "Troque o look" (`DADOS.colecoes`, 3 vídeos `midia/col-N.mp4` em cross-fade, cor/título/peças trocam; título por letra dentro de `.pal` com nowrap).
- Hamburgueria e pizzaria são clones do restaurante com `prato: {desenho:false}` e cena própria.
- Pedido pelo WhatsApp (hamburgueria e pizzaria, no lugar da reserva): `modelos/pedido.mjs` (HTML no build: `itens()`, `qtd()`, `pedidoHtml()`) + `modelos/pedido.js` (quantidades, barra flutuante, janela, mensagem pronta; guarda em sessionStorage `pedido-<slug>`). Config em `DADOS.pedido = {entrega, retirada, taxa, minimo, tempo, pagamentos}`. Estilos `.qt`, `.pd*` no `base.css` (cores por `--pd-*`).
- `cena` aceita `inicio` (segundos pulados no começo do vídeo) e `legenda: "topo"` (texto no alto, no celular). `iniciar()` põe `.rolou` no `<html>` após 40 px (cabeçalho sólido nos modelos de comida).
- Guia de adaptação a cliente: `modelos/LEIA-ME.md`. Ao entregar a um cliente, remover a linha "Modelo de demonstração" em `modelos/build.mjs`.

## Mídia
- Vídeos gerados no Google Flow (Omni 1.2 Flash, 720p, 8 s = 24 créditos cada) e já aplicados em 1280 px (commit adcbba4). Créditos de IA aparecem em cada modelo.
- Beleza: `cena.mp4` (cílios fio a fio) e `sobr.mp4` (mapeamento + henna, antes da régua) gerados no Flow em 09/11/2026, upscale 1080p, codificados a 1280 px. Neste PC não há ffmpeg com libx264: usei `C:\Program Files\BlueStacks_nxt\ffmpeg.exe` com `-c:v libopenh264 -b:v 2200k -g 6`.
- Originais na pasta Downloads do PC do Daniel (nomes tipo `Model_posing_in_green_studio_*.mp4`, `Assembling_artisan_smash_burger_*.mp4`, `Brush_painting_red_gel_polish_*.mp4`).
- Beleza: só cílios, sobrancelhas, lábios e cursos (unhas removidas). Todas as imagens de `modelos/beleza/midia/servicos/` foram geradas no Google Flow (Nano Banana 2.1, upscale 2K): nenhuma foto real de cliente. Originais 2K na pasta Downloads.
- Sem marcas reais nos modelos (nem Anti Social Social Club, Lattafa, Kikos): prompts dos vídeos dizem "no text, no logos, no brand names".

## Regras de conteúdo
- Portfólio: só fatos reais (FlowCheck e FlowRequest, dos READMEs dos repositórios dele). Emulações e modelos usam dados fictícios.

## Pendências
- Levar o padrão da beleza (dados.json + editor, nível essencial, depoimentos, mapa, og, schema) aos outros modelos; pedido pelo WhatsApp também no restaurante (junto da reserva).
- Roupas: arara com as 6 fotos do Flow (`midia/peca-N.jpg`) e cena `midia/cena.mp4` aplicadas em 10/11/2026.
- Mídia a gerar no Flow:, perfumes (5 frascos), comida (fotos de pratos), academia (3 fotos do espaço), og 1200×630 de todos.
- Abrir os links no ar e testar celular/reduce em todos os 7 modelos (só roupas e hamburgueria foram testados após a troca de vídeo).
- Fotos opcionais (`foto`) em perfumes.
- Template beleza: ligar `agenda.js` ao Supabase e o Pix ao Mercado Pago (webhook numa Edge Function) quando houver contas. Depoimentos atuais são de exemplo. Outros modelos ainda têm o conteúdo dentro do `page.mjs` (podem migrar para `dados.json` e usar o mesmo editor).
- Portfólio: confirmar texto do Império, fotos/URL reais, e se cita a Jaupavi nos projetos Flow.
- Ideia futura: personagem consistente nos vídeos de roupas (gerar imagem-base e reutilizar).
