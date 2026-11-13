# Prompt para o Antigravity: continuar o trabalho do portfólio do Daniel

Cole tudo abaixo no Antigravity (agente em modo planejamento). Idioma: português. Respostas enxutas; em código, mostrar só o trecho alterado.

## Contexto
Daniel dos Santos, desenvolvedor web em Jaú, SP. Há dois repositórios no PC (pasta `C:\Users\NT118\antigravity\`):

1. `portfolio/` (github.com/danielgodz1/portfolio, branch main, Vercel time `programacao1`, https://portfolio-programacao1.vercel.app): portfólio antigo + 10 modelos de sites imersivos em `modelos/` (academia, roupas, perfumes, beleza, restaurante, hamburgueria, pizzaria, arquitetura, marcenaria, engenharia). Cada modelo é um HTML único (esbuild, fontes em base64, GSAP + ScrollTrigger + Lenis, three.js). Leia o `CLAUDE.md` da raiz: ele descreve a arquitetura e as regras. Build: `npm run build`. Teste visual: `python test/modelo.py <slug> <largura> <altura> [reduce]`.
2. `portfolio-prumo/` (github.com/danielgodz1/portfolio-prumo, Vercel auto-deploy, https://portfolio-prumo-programacao1.vercel.app): portfólio novo. Next 15, React 19, React Three Fiber + drei + postprocessing, GSAP (ScrollTrigger, SplitText), Lenis. SEM Zustand (estado em `lib/store.ts`). Conceito "O Prumo": pêndulo 3D no hero, andares em linhas atravessados em profundidade Z, telas emuladas dos sistemas FlowCheck e FlowRequest (`lib/telas.js`) e cena 3D "Da planta ao quarto" (`lib/cena3d.js`, Three puro, canvas à parte). Tokens: azul #0F2C7A, papel #ECEEF0, grafite #151817, giz #FFD23F; Bricolage Grotesque (wdth) + IBM Plex Mono só para cotas. Teste: `npx next build && npx next start -p 3100` e Playwright com `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`.

## Regras
- Conteúdo real só do que existe (FlowCheck, FlowRequest, Império, 10 modelos, contatos). Nunca inventar conquistas. Emulações e modelos usam dados fictícios e dizem isso.
- Não apagar conteúdo real; não reconstruir do zero; não alterar marca/copy sem propor antes.
- Perguntar só se algo bloquear. Commits pequenos; não fazer push sem pedir. Commit termina com `Co-Authored-By` do agente.
- Acessibilidade e orçamento: `prefers-reduced-motion` respeitado, foco visível, teclado completo, contraste 4,5:1, sem overflow horizontal em 360 a 1920 px, console limpo, 60 fps desktop / 30+ Android intermediário, DPR clamp, 3D só perto da tela, pausa com aba oculta.
- Proibido o "visual de IA": creme + terracota, preto + neon, rótulos em caixa-alta com tracking, "→", metadados com ponto do meio, uma palavra colorida no título.

## Skills e método (usar antes de codar cada fase)
Se o Antigravity tiver skills instaladas, carregue-as no começo de cada fase; se não tiver, siga os mesmos princípios descritos aqui:
- **frontend-design**: plano curto (cores, tipos, layout, princípios) e revisão contra o "visual de IA" antes de escrever código; o que for genérico, refazer.
- **gsap-web** e **cinematic-scroll-website**: timelines, ScrollTrigger scrub, Lenis movido pelo ticker do GSAP (um loop só), capítulos entrada → hold → saída, storyboard de movimento aprovado antes de implementar.
- **interaction-design**: estados de todo controle (hover, foco, ativo, desabilitado, vazio, erro), microinterações, tempo de resposta; desfazer em vez de confirmar.
- **design-elevation** e **accessible-animation**: refinamento visual e movimento em camadas com `prefers-reduced-motion`.
- **r3f-cena-scroll** (3D dirigido pela rolagem) e **webapp-testing** (Playwright: screenshots por seção em desktop e mobile, console limpo, FPS, teclado, reduce).
Cada fase termina com prints e medidas reais antes de seguir. Se uma skill não existir, não bloquear: aplicar o princípio e dizer na resposta o que foi usado.

## Tarefa A (prioridade, mais rápida): elevar os modelos de marcenaria, arquitetura e engenharia
Piloto: `modelos/marcenaria`. Depois propagar a arquitetura e engenharia. Não reconstruir.
1. Auditoria com Playwright (1440 e 390, reduce): o que está forte, os 10 maiores gaps de UX, upgrades por impacto/esforço. Parar e mostrar antes de codar.
2. Sistema de motion compartilhado (arquivo comum em `modelos/`, mantendo o HTML único): Lenis + scrub, easings autorais, entrada → hold → saída por capítulo sem zonas mortas, indicador de progresso temático, reveal por linha/palavra, contadores, botão magnético e cursor só no desktop.
3. Configurador (marcenaria): arrastar com affordance e gestos touch, estado na URL/localStorage + "compartilhar minha configuração", presets/reset/desfazer, teclado (setas giram, +/- medidas), aria-live nos preços, mensagem de WhatsApp com a configuração completa.
4. Assinatura: linhas-guia entre a lista de corte e as peças no 3D, portas/gavetas com spring, cotas que se desenham ao mudar medidas, preço com dígitos rolando. "Ver na minha sala" (AR) só com asset exportado: propor alternativa antes.
5. Fallback sem WebGL e reduce-motion mantidos e melhorados. CTA do WhatsApp sempre alcançável (sticky discreto no mobile).
6. Verificação final antes/depois (FPS, console, fluxo do WhatsApp com payload correto, teclado, reduce) e plano para estender o sistema aos outros modelos.

## Tarefa B (maior, só depois): "PRUMO // MISSÃO" no `portfolio-prumo`
Auditoria já feita: LCP 280 ms local, CLS 0, JS de abertura ~507 KB gz (acima dos ~300 KB desejados), dois canvases (R3F de fundo + quarto do Império em Three puro). Plano por ato, com checkpoint a cada um:
- Ato 0 contagem (checklist em mono, 3-2-1, ignição) → hero.
- Ato 1 decolagem: foguete low-poly feito em código, câmera numa CatmullRomCurve3 dirigida pelo scroll, HUD (altitude, velocidade, "MISSÃO 01"), exaustão em Points, estrelas em 3 camadas, boost com FOV kick.
- Ato 2 órbita: globo com marcadores Jaú, FlowCheck e Império, mergulho (dolly + nuvens + white-out) e case em overlay HTML. Terra: decisão pendente do Daniel entre textura NASA (KTX2 2k, lazy) ou globo gerado por código (mais leve).
- Ato 3 reentrada: diário de bordo, skills como constelação, contato como canal de transmissão, konami, som opcional (Howler, desligado por padrão). Manter o duplo clique que solta o prumo.
- Migrar o quarto do Império para dentro do canvas único. Um canvas só, persistente. Quality scaler automático. Reduce-motion vira seções estáticas com a mesma arte.
- Direção de arte: espaço profundo #050B1E, cobalto #0F2C7A nas atmosferas, giz #FFD23F como ignição, papel #ECEEF0 no texto.

## Pendências conhecidas (não esquecer)
- `portfolio-prumo`: foto real em `public/daniel.jpg` (rodar com `NEXT_PUBLIC_FOTO=1`), som, distorção WebGL em imagens de projeto (faltam imagens), Lighthouse e FPS em GPU real.
- Prospecção: lista em `C:\Users\NT118\antigravity\prospeccao\`. 6 DMs já enviadas no Instagram (Estyllo, Scudilio, Studio Ste, ÉDicasa, NEW FIT, Guizzardi); follow-up em 20/11/2026 só para quem não respondeu.
- Raiz do `portfolio/`: o texto "Veja 7 modelos" no `build.mjs` precisa virar 10.
