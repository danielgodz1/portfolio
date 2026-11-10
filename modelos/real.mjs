// HTML da "cena real": só aparece se o modelo tiver um vídeo em midia/.
// cena = { video: "midia/x.mp4", poster: "midia/x.jpg", alt: "descrição", dur: 260, passos: [[título, texto], ...] }
// opcionais: inicio (segundos pulados no começo do vídeo), legenda: "topo" (texto no alto, no celular)
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const cenaReal = (cena, id = "real") => {
  if (!cena || !cena.video) return "";
  return `<section class="real${cena.vertical ? " real--vertical" : ""}${cena.legenda === "topo" ? " real--topo" : ""}" id="${id}" data-dur="${cena.dur || 260}"${cena.inicio ? ` data-ini="${cena.inicio}"` : ""} aria-label="${esc(cena.alt || "")}">
  <div class="real__palco">
    <video muted playsinline preload="none" ${cena.poster ? `poster="${esc(cena.poster)}"` : ""} aria-hidden="true"><source src="${esc(cena.video)}" type="video/mp4"></video>
    ${cena.fumaca ? `<canvas class="real__fumaca" aria-hidden="true"></canvas>` : ""}
    <div class="real__sombra"></div>
    <ol class="real__leg">${(cena.passos || []).map(([t, x]) => `<li><b>${esc(t)}</b>${x ? `<span>${esc(x)}</span>` : ""}</li>`).join("")}</ol>
    ${cena.credito ? `<p class="real__cred">${esc(cena.credito)}</p>` : ""}
  </div>
</section>`;
};
