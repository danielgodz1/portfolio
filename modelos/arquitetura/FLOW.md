# Vídeo da cena no Google Flow (arquitetura)

Um só vídeo: a casa se constrói enquanto o visitante rola. Em todos os prompts: sem texto, sem logo, sem marca, sem pessoas.

## Cena (Omni 1.2 Flash, 720p, 8 s, upscale 1080p)

Arquivo: `cena.mp4` (o pôster `cena.jpg` sai do primeiro quadro; se preferir, use o quadro final, que é mais bonito enquanto o vídeo carrega).

> Time-lapse architectural visualization, a single modern two-story house on an empty lot, camera slowly orbiting. Sequence: bare land, ground plan lines drawn on the soil, foundation and concrete structure rising, walls and roof assembled, finishes and landscaping appearing, completed house at golden hour. Clean minimal style, warm natural light, no text, no logos, no brand names, no people, no watermark. 8 seconds.

As 5 etapas do texto (Terreno, Planta, Estrutura, Acabamento, Entrega) dividem o vídeo em partes iguais.

## Depois de gerar

1. Baixe e prepare: `bash modelos/preparar-video.sh entrada.mp4 modelos/arquitetura/midia/cena.mp4` (gera também `cena.jpg`). Neste PC o ffmpeg com libx264 fica em `~/ffmpeg-master-latest-win64-gpl-shared/bin/`.
2. Rode `node modelos/build.mjs arquitetura`: com `midia/cena.mp4` presente, a seção aparece sozinha.
3. Para ajustar a duração da rolagem, mude `cena.dur` no `page.mjs` (320 = 3,2 telas de rolagem).
