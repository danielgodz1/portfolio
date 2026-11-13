# Modelos de sites imersivos

Cinco modelos para adaptar a clientes reais. Cada um vira **um único arquivo HTML** (fontes, CSS e JS embutidos).

| Pasta | Negócio | Conceito |
|---|---|---|
| `academia/` | Academia | A rolagem carrega a barra; treinos como repetições; grade de aulas em abas |
| `roupas/` | Loja de roupas | Arara que balança com a rolagem; provador que combina cores; lookbook |
| `perfumes/` | Perfumaria | A rolagem é o tempo na pele (saída, coração, fundo); teste de família olfativa |
| `beleza/` | Cílios e sobrancelhas | Olho real ganha cílios e sobrancelha com a rolagem; provador de efeitos; régua de preços; sacola e pedido pelo WhatsApp; cursos com certificado |
| `restaurante/` | Restaurante | Brasas no topo; prato que se monta em camadas; cardápio; reserva |
| `arquitetura/` | Arquitetura e interiores | A casa se constrói na rolagem (vídeo); maquete 3D que vira fachada, corte e planta; processo em linha de lápis; antes e depois |

## Adaptar para um cliente

**Beleza: 2 níveis.** O mesmo site sai em duas versões, escolhidas no editor (campo "Nível do site"): **Essencial** (foto, preços e sacola que manda o pedido pronto no WhatsApp; a dona marca o horário depois) e **Cinematográfico** (vídeos pela rolagem, provador de cílios, antes e depois, régua de preços, agenda com horários livres e sinal por Pix). Paleta (4) e par de fontes (4) também se escolhem no editor. No protótipo, a barra de baixo troca de nível e experimenta as paletas na hora.

**Agenda e painel (demonstração):** no nível cinematográfico, a cliente vê só os horários livres, reserva e paga o sinal (Pix simulado, prazo de 15 minutos). A dona acompanha em `/modelos/painel/?m=beleza`: confirma, marca atendida, cancela e bloqueia horários. Hoje tudo fica guardado no navegador; para ir ao ar, aplique `supabase/agenda.sql` num projeto Supabase e troque o modo em `modelos/agenda.js`.

**Beleza (sem código):** abra `/modelos/editar/?m=beleza` no site publicado. A dona do estúdio troca nome, WhatsApp, endereço, horários, serviços e preços, cursos, depoimentos e perguntas, e clica em **Baixar dados.json**. Esse arquivo substitui `modelos/beleza/dados.json` no repositório (pelo GitHub, em "Add file > Upload files"); a Vercel publica sozinha. A página valida o WhatsApp e os preços antes de gerar o arquivo e guarda um rascunho no navegador.

Antes de entregar a um estúdio de beleza: troque os depoimentos de exemplo pelos reais (com autorização das clientes), confira as respostas das perguntas frequentes com o estúdio, ajuste `site` no `dados.json` para o domínio final e a constante `SITE` em `modelos/build.mjs` (é ela que monta a imagem da prévia do link).

**Outros modelos:**

1. Abra `modelos/<pasta>/page.mjs` e edite o bloco **CONTEÚDO** (nome, WhatsApp, endereço, preços, itens).
2. Cores e fontes ficam no topo de `styles.css` (`:root`) e em `fonts`/`meta` do `page.mjs`.
3. Rode `npm run build`. O resultado sai em `dist/modelos/<pasta>/index.html`.
4. Para um site próprio do cliente: copie `core.js`, `base.css`, `build.mjs` e a pasta do modelo para um repositório novo.

Fotos: os espaços com listras (`.foto`) são lugares de foto. Troque por `<img>` com `alt` descritivo.

WhatsApp: com `whatsapp: ""` o link abre o WhatsApp e o visitante escolhe o contato. Preencha só números com DDI, ex.: `5514999999999`.

Acessibilidade: todos respeitam "reduzir movimento" (mostram o estado final, sem animação), têm foco visível e controles de teclado.

Remova a linha "Modelo de demonstração" em `modelos/build.mjs` ao entregar ao cliente.

## Fotos e vídeos reais

- **Cena real (vídeo pela rolagem):** em cada `page.mjs`, preencha `cena.video` e `cena.poster` (ex.: `"midia/treino.mp4"`). Coloque os arquivos em `modelos/<pasta>/midia/`. Prepare o vídeo com `bash modelos/preparar-video.sh entrada.mp4 modelos/<pasta>/midia/nome.mp4`. Vídeo vazio = a seção não aparece.
- **Roupas:** campo `foto` em cada peça (PNG sem fundo fica melhor no cabide) e em `looks`.
- **Perfumes:** campo `foto` em cada perfume (PNG sem fundo).
- Use mídia com licença: fotos do próprio cliente ou bancos gratuitos (Pexels, Unsplash, Pixabay).

## Pedido pelo WhatsApp (hamburgueria e pizzaria)

No `page.mjs`, o bloco `pedido` controla a sacola: `taxa` (reais, 0 = grátis), `minimo` (reais, 0 = sem mínimo), `tempo` (texto), `pagamentos` (lista) e `entrega`/`retirada` (`false` esconde a opção). Os itens e preços vêm do próprio `cardapio`. Preencha `whatsapp` com DDI e DDD para o pedido chegar no número da loja.

## Arquitetura: o que trocar para um cliente real

Tudo que é exemplo está marcado com `// EXEMPLO: substituir` no bloco `DADOS` de `modelos/arquitetura/page.mjs`.

1. **Escritório:** `nome`, `cidade`, `whatsapp` (só números, com DDI), `telefone`, `email`, `endereco`, `horario`. O mapa da seção de contato é uma ilustração: troque por um mapa real (imagem ou incorporação) se o cliente quiser.
2. **Projetos:** em `projetos`, troque nome, área, cidade e frase. Sem foto, o card mostra um desenho a lápis do `tipo` (`terrea`, `sobrado`, `comercial` ou `apto`); com `foto: "midia/projeto-1.jpg"` aparece a imagem do cliente.
3. **Antes e depois:** coloque duas fotos do mesmo ângulo em `midia/` e preencha `antesDepois.antes`, `antesDepois.depois` e `antesDepois.alt`. Sem fotos, o modelo mostra duas ilustrações.
4. **Números e depoimentos:** são fictícios. Troque pelos reais (depoimentos só com autorização de quem os deu) ou apague os blocos.
5. **Vídeo da cena (a casa se construindo):** gere no Google Flow com o prompt de `modelos/arquitetura/FLOW.md`, prepare com `preparar-video.sh` e salve como `midia/cena.mp4` e `midia/cena.jpg`. Sem o arquivo, o build omite a seção sozinho. Os 5 passos de texto (`cena.passos`) dividem o vídeo em partes iguais; `cena.dur` define quantas telas de rolagem ele dura.
6. **Maquete 3D:** é uma casa paramétrica genérica, em `modelos/arquitetura/maquete.js` (medidas em metros; fachada, corte e planta usam a mesma geometria). Para mostrar a casa de um projeto real, ajuste as paredes, aberturas e móveis nesse arquivo ou substitua por um modelo exportado do projeto.
7. **Cores:** os tokens ficam no começo de `styles.css` (`--papel`, `--grafite`, `--concreto`, `--terracota`...). `--terracota` é o acento sobre fundo claro e `--terracota-claro`, sobre preto; mantenha 4,5:1 de contraste ao trocar.
8. **Antes de entregar:** remova a linha "Modelo de demonstração" em `modelos/build.mjs`, preencha `meta.og` (imagem 1200x630) e confira os textos de `meta`.
