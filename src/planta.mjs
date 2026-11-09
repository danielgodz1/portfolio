// Planta de quarto desenhada à mão (SVG). Cada traço .tr é animado pelo scroll.
export const PLANTA = `
<svg class="planta" viewBox="0 0 600 530" role="img" aria-label="Planta de um quarto com guarda-roupa, cama, bancada e porta, desenhada à mão">
  <defs>
    <filter id="lapis" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <pattern id="grade" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-opacity=".13" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="600" height="530" fill="url(#grade)"/>
  <path class="led-fill" d="M46 84 H118 V356 H46 Z"/>
  <g filter="url(#lapis)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path class="tr w" pathLength="1" stroke-width="4.2" d="M460 40 H560 V480 H170 M90 480 H40 V40 H300"/>
    <path class="tr d" pathLength="1" stroke-width="2.4" d="M90 480 V400 A80 80 0 0 1 170 480"/>
    <path class="tr d" pathLength="1" stroke-width="2.4" d="M300 36 H460 M300 44 H460"/>
    <path class="tr g" pathLength="1" stroke-width="2.4" d="M46 84 H118 V356 H46 Z"/>
    <path class="tr g" pathLength="1" stroke-width="2.4" d="M46 154 H118 M46 224 H118 M46 294 H118"/>
    <path class="tr c" pathLength="1" stroke-width="2.4" d="M338 196 H548 V362 H338 Z"/>
    <path class="tr c" pathLength="1" stroke-width="2.4" d="M538 196 V362 M418 196 V362"/>
    <path class="tr c" pathLength="1" stroke-width="2.4" d="M498 208 H530 V272 H498 Z M498 286 H530 V350 H498 Z"/>
    <path class="tr c" pathLength="1" stroke-width="2.4" d="M506 148 H548 V188 H506 Z M506 370 H548 V410 H506 Z"/>
    <path class="tr m" pathLength="1" stroke-width="2.4" d="M284 48 H472 V100 H284 Z"/>
    <path class="tr m" pathLength="1" stroke-width="2.4" d="M376 132 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0"/>
    <path class="tr led" pathLength="1" stroke-width="3.6" stroke="var(--marca)" d="M54 92 V348"/>
  </g>
  <g class="rotulos" font-family="'Instrument Serif', serif" font-style="italic" font-size="21" fill="currentColor" text-anchor="middle">
    <text class="rot" transform="translate(146 222) rotate(-90)">guarda-roupa</text>
    <text class="rot" x="442" y="286">cama</text>
    <text class="rot" x="378" y="82">bancada</text>
    <text class="rot" x="130" y="510">porta</text>
  </g>
</svg>`;

const cab = (id, label, h = 530) => `<svg class="planta" viewBox="0 0 600 ${h}" role="img" aria-label="${label}">
  <defs>
    <filter id="lapis-${id}" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="5" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <pattern id="grade-${id}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-opacity=".13" stroke-width="1"/></pattern>
  </defs>
  <rect width="600" height="${h}" fill="url(#grade-${id})"/>`;
const rot = (t, x, y, a = "middle", extra = "") => `<text class="rot ${extra}" x="${x}" y="${y}" text-anchor="${a}">${t}</text>`;
const txt = `font-family="'Instrument Serif', serif" font-style="italic" font-size="20" fill="currentColor"`;

export const CHECKLIST = cab("ck", "Folha de checklist com itens marcados, um item destacado como não conformidade e uma assinatura, desenhada à mão") + `
  <rect class="led-fill" x="82" y="253" width="316" height="64"/>
  <g filter="url(#lapis-ck)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path class="tr w" pathLength="1" stroke-width="4.2" d="M70 52 H410 V492 H70 Z"/>
    <path class="tr d" pathLength="1" stroke-width="2.4" d="M190 36 H290 V68 H190 Z"/>
    <path class="tr c" pathLength="1" stroke-width="2.4" d="M96 108 h34 v34 h-34 Z M96 188 h34 v34 h-34 Z M96 268 h34 v34 h-34 Z M96 348 h34 v34 h-34 Z"/>
    <path class="tr g" pathLength="1" stroke-width="2.4" d="M152 125 H380 M152 205 H380 M152 285 H380 M152 365 H380"/>
    <path class="tr m" pathLength="1" stroke-width="3.4" d="M102 126 l9 10 l15 -24 M102 206 l9 10 l15 -24 M102 366 l9 10 l15 -24"/>
    <path class="tr d" pathLength="1" stroke-width="2.4" d="M104 450 C128 410 146 480 172 436 S226 446 262 430 M96 470 H300"/>
    <path class="tr led" pathLength="1" stroke-width="3.8" stroke="var(--marca)" d="M102 274 L124 296 M124 274 L102 296"/>
  </g>
  <g ${txt}>
    ${rot("checklist", 428, 130, "start")}${rot("não conformidade", 428, 292, "start")}${rot("assinatura", 428, 452, "start")}
  </g>
</svg>`;

export const FLUXO = cab("fx", "Quatro etapas ligadas por setas, da requisição à conclusão, com um relógio de 48 horas, desenhadas à mão") + `
  <rect class="led-fill" x="40" y="260" width="220" height="100"/>
  <g filter="url(#lapis-fx)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path class="tr w" pathLength="1" stroke-width="3.6" d="M40 70 h220 v100 h-220 Z"/>
    <path class="tr w" pathLength="1" stroke-width="3.6" d="M340 70 h220 v100 h-220 Z"/>
    <path class="tr w" pathLength="1" stroke-width="3.6" d="M340 260 h220 v100 h-220 Z"/>
    <path class="tr w" pathLength="1" stroke-width="3.6" d="M40 260 h220 v100 h-220 Z"/>
    <path class="tr d" pathLength="1" stroke-width="2.6" d="M264 120 H336 M324 110 L336 120 L324 130"/>
    <path class="tr d" pathLength="1" stroke-width="2.6" d="M450 174 V256 M440 244 L450 256 L460 244"/>
    <path class="tr d" pathLength="1" stroke-width="2.6" d="M336 310 H264 M276 300 L264 310 L276 320"/>
    <path class="tr m" pathLength="1" stroke-width="2.6" d="M270 452 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0 M304 452 V430 M304 452 L320 462"/>
    <path class="tr led" pathLength="1" stroke-width="4" stroke="var(--marca)" d="M40 260 h220 v100 h-220 Z"/>
  </g>
  <g ${txt}>
    ${rot("requisição", 150, 126)}${rot("aprovação", 450, 126)}${rot("conferência", 450, 316)}${rot("concluída", 150, 316, "middle", "rot-on")}${rot("48 h", 360, 460, "start")}
  </g>
</svg>`;

export const DESENHOS = { "planta-quarto": PLANTA, checklist: CHECKLIST, fluxo: FLUXO };
