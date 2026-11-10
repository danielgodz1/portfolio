# Mídia da loja de roupas no Google Flow

Tudo combina com as 3 coleções que já estão no site (Ácida, Noturna, Gelo). Em todos os prompts: sem texto, sem logo, sem marca.

## 1. Peças da arara (6 imagens, Nano Banana, quadro 4:5, upscale 2K)

Mesmo estilo nas 6: foto de produto "ghost mannequin", peça sozinha, de frente, fundo branco liso.

Base (cole antes de cada peça):
> Ghost mannequin product photo of a single garment, front view, centered, floating, no person, no hanger, pure white seamless background, soft even studio light, subtle natural shadows inside the fabric, high detail fabric texture, visible exposed stitching, no text, no logos, no brand names, no labels.

| Arquivo | Complemento do prompt |
|---|---|
| `peca-1.jpg` | Oversized heavyweight hoodie in acid lime green (#c8f03c), dropped shoulders, kangaroo pocket, thick ribbed cuffs. |
| `peca-2.jpg` | Wide-leg cargo pants in lime green (#b7d43a), large side cargo pockets, relaxed fit, elastic hem. |
| `peca-3.jpg` | Cropped black puffer jacket, glossy nylon, high collar, oversized quilted panels. |
| `peca-4.jpg` | Black-graphite cargo pants with silver metal buckle straps, tactical style, wide leg. |
| `peca-5.jpg` | Ice-blue (#bfe3ff) oversized puffer jacket with rounded quilted panels and hood. |
| `peca-6.jpg` | Cream wide-leg trousers, soft heavy cotton, clean front, relaxed fit. |

## 2. Vídeo da cena (Omni, 720p, 8 s, upscale 1080p)

Arquivo: `cena.mp4` (o pôster `cena.jpg` sai do primeiro quadro).

> Slow cinematic macro shots in a tailoring studio: a sewing machine stitches a thick seam on an acid lime green heavyweight hoodie, the needle moving fast, then the camera pulls back as hands turn the hoodie inside out revealing exposed seams, then the finished oversized hoodie hangs on a clothing rail swinging gently. Warm off-white studio background, soft light, shallow depth of field, smooth continuous camera motion, no text, no logos, no brand names.

## Depois de gerar

1. Baixe e coloque os arquivos em `modelos/roupas/midia/` com os nomes acima (as 6 peças podem ir como estão, em JPG).
2. Me peça "aplica as fotos da arara": eu preencho `foto` em cada peça, codifico o vídeo em 1280 px (`modelos/preparar-video.sh`), ligo a cena e testo.
