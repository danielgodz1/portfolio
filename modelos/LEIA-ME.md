# Modelos de sites imersivos

Cinco modelos para adaptar a clientes reais. Cada um vira **um único arquivo HTML** (fontes, CSS e JS embutidos).

| Pasta | Negócio | Conceito |
|---|---|---|
| `academia/` | Academia | A rolagem carrega a barra; treinos como repetições; grade de aulas em abas |
| `roupas/` | Loja de roupas | Arara que balança com a rolagem; provador que combina cores; lookbook |
| `perfumes/` | Perfumaria | A rolagem é o tempo na pele (saída, coração, fundo); teste de família olfativa |
| `beleza/` | Cílios e sobrancelhas | Olho real ganha cílios e sobrancelha com a rolagem; provador de efeitos; régua de preços; sacola e pedido pelo WhatsApp; cursos com certificado |
| `restaurante/` | Restaurante | Brasas no topo; prato que se monta em camadas; cardápio; reserva |

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
