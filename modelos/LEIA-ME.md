# Modelos de sites imersivos

Cinco modelos para adaptar a clientes reais. Cada um vira **um único arquivo HTML** (fontes, CSS e JS embutidos).

| Pasta | Negócio | Conceito |
|---|---|---|
| `academia/` | Academia | A rolagem carrega a barra; treinos como repetições; grade de aulas em abas |
| `roupas/` | Loja de roupas | Arara que balança com a rolagem; provador que combina cores; lookbook |
| `perfumes/` | Perfumaria | A rolagem é o tempo na pele (saída, coração, fundo); teste de família olfativa |
| `beleza/` | Cílios, sobrancelhas e unhas | Olho que se desenha; esmalte muda a cor do site; agenda que soma preço e tempo |
| `restaurante/` | Restaurante | Brasas no topo; prato que se monta em camadas; cardápio; reserva |

## Adaptar para um cliente

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
