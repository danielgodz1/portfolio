#!/usr/bin/env bash
# Prepara um vídeo para rolar quadro a quadro (sem áudio, keyframes curtos, leve).
# uso: bash modelos/preparar-video.sh entrada.mov modelos/academia/midia/treino.mp4
set -e
ffmpeg -y -i "$1" -an -vf "scale='min(1600,iw)':-2,fps=30" -c:v libx264 -preset veryfast -crf 26 -g 6 -keyint_min 6 -pix_fmt yuv420p -movflags +faststart "$2"
ffmpeg -y -i "$2" -vframes 1 -q:v 4 "${2%.mp4}.jpg"
echo "Pronto: $2 e pôster ${2%.mp4}.jpg"
