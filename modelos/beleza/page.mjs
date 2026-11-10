// ================= CONTEÚDO: fica em dados.json =================
// Para mudar preços, textos e contatos, use a página /modelos/editar/?m=beleza (gera um dados.json novo)
// ou edite dados.json direto. Cada serviço com "forma" aparece no provador de cílios.
import dados from "./dados.json" with { type: "json" };
export const DADOS = structuredClone(dados);
// ===============================================================

/* ---------- níveis e temas ----------
   nivel: "essencial" (leve: foto, preços, sacola que envia o pedido pelo WhatsApp, cursos e dúvidas; a dona marca o horário)
   ou "cinematografico" (tudo: vídeos pela rolagem, provador, régua, agenda com horários livres e Pix). */
export const NIVEIS = { essencial: "Essencial", cinematografico: "Cinematográfico" };
export const PALETAS = {
  vinho: { nome: "Vinho e rosé", rosa: "#f7ece6", cacau: "#3a221d", suave: "#7a5d55", acento: "#8a2440", escuro: "#17100e", linha: "#e3cfc6" },
  nude: { nome: "Nude e caramelo", rosa: "#f5eee6", cacau: "#2f2620", suave: "#6f6056", acento: "#8c5639", escuro: "#1c1612", linha: "#e2d5c8" },
  lavanda: { nome: "Lavanda", rosa: "#f3f0f7", cacau: "#262030", suave: "#665c72", acento: "#5f4488", escuro: "#16121d", linha: "#dcd4e6" },
  salvia: { nome: "Sálvia", rosa: "#eef2ee", cacau: "#1f2a24", suave: "#56635a", acento: "#2f6650", escuro: "#111a15", linha: "#d3ddd5" },
};
const V = "@fontsource-variable/";
export const FONTES = {
  classica: { nome: "Clássica (Gloock + Outfit)", serif: ["Gloock", "@fontsource/gloock/files/gloock-latin-400-normal.woff2"], sans: ["Outfit", V + "outfit/files/outfit-latin-wght-normal.woff2", "100 900"] },
  editorial: { nome: "Editorial (Bodoni Moda + Jost)", serif: ["Bodoni Moda", V + "bodoni-moda/files/bodoni-moda-latin-wght-normal.woff2", "400 900"], sans: ["Jost", V + "jost/files/jost-latin-wght-normal.woff2", "100 900"] },
  delicada: { nome: "Delicada (Cormorant + Manrope)", serif: ["Cormorant Garamond", V + "cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2", "300 700"], sans: ["Manrope", V + "manrope/files/manrope-latin-wght-normal.woff2", "200 800"] },
  moderna: { nome: "Moderna (Instrument Serif + Work Sans)", serif: ["Instrument Serif", "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2"], sans: ["Work Sans", V + "work-sans/files/work-sans-latin-wght-normal.woff2", "100 900"] },
};
const tema = () => ({ p: PALETAS[DADOS.tema?.paleta] || PALETAS.vinho, f: FONTES[DADOS.tema?.fontes] || FONTES.classica });
const nivel = () => (NIVEIS[DADOS.nivel] ? DADOS.nivel : "cinematografico");
let R = ""; // prefixo de caminho: as variantes moram em subpastas e usam a mídia da pasta principal
const u = (c) => (/^(https?:)?\//.test(c) ? c : R + c);
const F = (n) => u(`midia/servicos/${n}.webp`); // antes e depois da lamination

/* Variantes publicadas junto, para mostrar os 3 níveis no protótipo */
export const variantes = [
  { pasta: "essencial", nivel: "essencial", tema: { paleta: "salvia", fontes: "moderna" } },
];
const ORIGINAL = structuredClone(dados);
export const usar = (v) => { // v = null volta ao dados.json
  Object.assign(DADOS, structuredClone(ORIGINAL), v ? { nivel: v.nivel, tema: v.tema } : {});
  R = v ? "../" : "";
  const t = tema();
  meta.fundo = t.p.rosa; meta.acento = t.p.acento;
  meta.rotulo = "Cílios e sobrancelhas · " + NIVEIS[nivel()];
  meta.conceito = { essencial: "Versão leve: foto, preços e sacola que manda o pedido pronto no WhatsApp. Abre rápido em qualquer celular.", cinematografico: "Um olho real ganha cílios e sobrancelha com a rolagem, a câmera mergulha na pupila e há vídeos em cada etapa." }[nivel()];
};
export const fonts = () => { const { f } = tema(); return [f.serif, f.sans]; };
export const cssTema = () => {
  const { p, f } = tema();
  return `:root{--rosa:${p.rosa};--cacau:${p.cacau};--suave:${p.suave};--acento:${p.acento};--escuro:${p.escuro};--linha:${p.linha};--serif:"${f.serif[0]}",Georgia,serif;--sans:"${f.sans[0]}",system-ui,sans-serif}`;
};

export const meta = {
  slug: "beleza", rotulo: "Cílios e sobrancelhas", nome: "Olhar Studio",
  titulo: "Olhar Studio · Cílios, sobrancelhas e cursos",
  descricao: "Prove os efeitos de cílios, veja os preços, monte seu pedido e agende pelo WhatsApp.",
  conceito: "Dois níveis do mesmo site: essencial e cinematográfico, com paleta e fontes à escolha do estúdio.",
  aviso: "Protótipo: marca fictícia, imagens geradas por IA (Google Flow) e preços de referência. Nenhum pagamento é processado.",
  fundo: "#f7ece6", acento: "#8a2440",
  og: "midia/og.jpg", // imagem da prévia ao compartilhar o link (1200×630)
};

/* Barra do protótipo: troca de nível (outra página) e de paleta (na hora) */
export const demoExtra = () => {
  const n = nivel(), raiz = R ? "../" : "";
  const link = (k) => (k === "cinematografico" ? raiz : raiz + k + "/");
  return `<span class="demo__niveis">Nível: ${Object.entries(NIVEIS).map(([k, t]) => (k === n ? `<b>${t}</b>` : `<a href="${link(k)}">${t}</a>`)).join(" · ")} · Para a dona: ${n === "cinematografico" ? `<a href="${raiz}../painel/?m=beleza">painel da agenda</a> · ` : ""}<a href="${raiz}../editar/?m=beleza">editar o site</a></span>
<span class="demo__paletas" aria-label="Experimentar paletas">${Object.entries(PALETAS).map(([k, p]) => `<button type="button" data-paleta="${k}" title="${p.nome}" aria-label="Paleta ${p.nome}" style="--c:${p.acento};--f:${p.rosa}"></button>`).join("")}</span>
<script>document.querySelectorAll(".demo__paletas button").forEach(b=>b.onclick=()=>{const P=${JSON.stringify(PALETAS)}[b.dataset.paleta],r=document.documentElement.style;for(const k of ["rosa","cacau","suave","acento","escuro","linha"])r.setProperty("--"+k,P[k]);});</script>`;
};

/* Dados estruturados para o Google (estabelecimento local) */
export const schema = () => ({
  "@context": "https://schema.org", "@type": "BeautySalon",
  name: DADOS.nome + " " + DADOS.sub, url: DADOS.site, image: DADOS.site + meta.og,
  address: { "@type": "PostalAddress", streetAddress: DADOS.endereco.split(" · ")[0], addressLocality: "Jaú", addressRegion: "SP", addressCountry: "BR" },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "19:00" }],
  priceRange: "R$ 30 a R$ 600",
  makesOffer: DADOS.servicos.map((s) => ({ "@type": "Offer", price: s.preco.toFixed(2), priceCurrency: "BRL", itemOffered: { "@type": "Service", name: s.nome } })),
});

import { cenaReal } from "../real.mjs";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const reais = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------- olho realista: vídeo do Flow + linhas de mapeamento desenhadas por cima ----------
   Coordenadas no quadro do vídeo (960×540). Olho esquerdo da modelo: a cabeça da sobrancelha fica à direita. */
export const OLHO = { w: 960, h: 540, pupila: [655, 287], asa: [880, 660], cabeca: [866, 128], arco: [615, 66], cauda: [388, 182] };
const mapa = () => {
  const O = OLHO, [ax, ay] = O.asa;
  const reta = ([x, y], k) => `M${ax} ${ay} L${Math.round(ax + (x - ax) * k)} ${Math.round(ay + (y - ay) * k)}`; // da asa do nariz, passando do ponto
  return `<svg class="hero__mapa" viewBox="0 0 ${O.w} ${O.h}" preserveAspectRatio="xMaxYMid slice" aria-hidden="true"><g class="mapa">
    <path class="guia" pathLength="1" d="${reta(O.cabeca, 1.12)}"/><path class="guia" pathLength="1" d="${reta(O.arco, 1.08)}"/><path class="guia" pathLength="1" d="${reta(O.cauda, 1.12)}"/>
    ${[O.cabeca, O.arco, O.cauda].map(([x, y]) => `<circle class="ponto" cx="${x}" cy="${y}" r="7"/>`).join("")}</g></svg>`;
};

const olhoProva = () => `<svg class="olho olho--prova" viewBox="60 40 520 270" role="img" aria-label="Desenho do efeito de cílios escolhido">
    <path class="palp" d="M110 210 Q300 80 490 210 Q300 300 110 210 Z"/>
    <circle class="iris" cx="300" cy="196" r="64"/><circle class="pupila" cx="300" cy="196" r="28"/><circle class="brilho" cx="318" cy="178" r="9"/>
    <g class="prova-cilios"></g>
  </svg>`;

const mais = (s) => `<button class="mais" type="button" data-add="${s.id}" aria-pressed="false" aria-label="Adicionar ${esc(s.nome)} à sacola"><span aria-hidden="true"></span></button>`;

/* Essencial: sacola sem agenda nem pagamento; o pedido vai pronto para o WhatsApp e a dona combina o horário */
const pedidoSimples = () => `<dialog class="ck" id="ck" aria-labelledby="ck-t" data-lenis-prevent>
  <div class="ck__topo"><h2 id="ck-t">Seu pedido</h2><button type="button" class="ck__x" id="ck-x" aria-label="Fechar">×</button></div>
  <form id="pd" novalidate>
    <section><ul class="ck__itens"></ul><p class="ck__vazio">Seu pedido está vazio. Toque no + ao lado dos serviços que você quer.</p></section>
    <section>
      <label class="campo">Seu nome (opcional) <input name="cliente" autocomplete="name"></label>
      <label class="campo">Observações (opcional) <textarea name="obs" rows="3" placeholder="Melhor dia ou período, alergias, primeira vez"></textarea></label>
      <p class="ck__nota">O pedido abre no WhatsApp com tudo escrito. O estúdio responde para combinar o dia e o horário.</p>
    </section>
    <p class="ck__erro" role="alert" hidden></p>
    <div class="ck__pe">
      <p class="ck__total"><span>Total estimado</span><b>R$ 0,00</b></p>
      <div class="ck__bts"><button type="submit" class="btn btn--cheio">Enviar pedido pelo WhatsApp</button></div>
    </div>
  </form>
</dialog>`;

export const html = () => {
  const D = DADOS, n = nivel();
  const cine = n === "cinematografico", simples = n === "essencial";
  const grupos = [...new Set(D.servicos.map((s) => s.grupo))];
  const efeitos = D.servicos.filter((s) => s.forma);
  const regua = D.servicos.filter((s) => s.grupo === "Sobrancelhas");
  const waLink = `https://wa.me/${D.whatsapp}?text=${encodeURIComponent("Olá! Vim pelo site e quero agendar um horário.")}`;
  // hero: vídeo pela rolagem (cinematográfico) ou a foto final com o mapeamento desenhado (demais)
  const midia = cine
    ? `<video class="hero__video" muted playsinline preload="auto" poster="${u("midia/hero-ini.jpg")}" aria-label="Um olho recebe extensão de cílios e depois design de sobrancelha com henna"><source src="${u("midia/hero.mp4")}" type="video/mp4"></video>`
    : `<img class="hero__video" src="${u("midia/hero-fim.jpg")}" alt="Olho com extensão de cílios e sobrancelha desenhada com henna" width="1280" height="720" fetchpriority="high">`;
  const etapas = `<ol class="etapas" aria-label="Etapas">
      <li data-i="0"><b>Fio a fio</b><span>Extensão de cílios aplicada um a um, no seu formato de olho.</span></li>
      <li data-i="1"><b>Mapeamento</b><span>Antes de tirar um pelo, medimos onde sua sobrancelha começa, sobe e termina.</span></li>
      <li data-i="2"><b>Design</b><span>Sobrancelha preenchida fio a fio, com henna ou lamination.</span></li>
    </ol>`;
  const chamada = `<div class="hero__cta"><a class="btn btn--cheio" href="#catalogo">Ver serviços e preços</a><a class="btn" href="${waLink}" target="_blank" rel="noopener">Agendar pelo WhatsApp</a></div>`;
  const cursosSimples = `<section class="cur cur--lista" id="cursos" aria-labelledby="cur-t">
  <h2 id="cur-t" class="sec-t">Cursos com certificado</h2>
  <ul class="cur__simples">${D.cursos.map((c) => `<li><b>${esc(c.nome)}</b><span>${esc(c.texto)}</span></li>`).join("")}</ul>
  <a class="btn btn--claro" href="https://wa.me/${D.whatsapp}?text=${encodeURIComponent("Olá! Quero saber valor e datas dos cursos.")}" target="_blank" rel="noopener">Saber valores e datas</a>
</section>`;
  return `
<header class="topo"><a class="marca" href="#conteudo">${esc(D.nome)}<small>${esc(D.sub)}</small></a><button class="btn" type="button" id="abre-sacola">Sacola <b class="sacola-n">0</b></button></header>
<main id="conteudo" data-nivel="${n}" data-raiz="${R}">
<section class="hero hero--${n}" aria-labelledby="h1">
  <div class="hero__palco">
    <h1 id="h1" class="hero__t">Tudo começa <em>pelo traço.</em></h1>
    <div class="hero__midia">
      ${midia}
      ${mapa()}
    </div>
    ${simples ? chamada : etapas}
    ${cine ? `<div class="mergulho" aria-hidden="true"></div>` : ""}
  </div>
</section>

${cine ? cenaReal({ ...DADOS.cena, video: u(DADOS.cena.video), poster: u(DADOS.cena.poster) }) : ""}

${simples ? "" : `<section class="prov" id="provador" aria-labelledby="prov-t">
  <div class="prov__palco">
    <h2 id="prov-t" class="prov__t">Prove o olhar antes de sentar na cadeira.</h2>
    <div class="prov__olho">${olhoProva()}</div>
    <div class="prov__info" aria-live="polite">
      <img class="prov__foto" src="${u(efeitos[0].foto)}" alt="" width="160" height="200">
      <div>
        <h3 class="prov__nome">${esc(efeitos[0].nome)}</h3>
        <p class="prov__texto">${esc(efeitos[0].texto)}</p>
        <p class="prov__preco">${reais(efeitos[0].preco)}</p>
        <button class="btn btn--claro" type="button" id="prov-add">Adicionar à sacola</button>
      </div>
    </div>
    <div class="prov__trilho" role="group" aria-label="Efeitos de cílios">${efeitos.map((s, i) => `<button type="button" data-i="${i}" aria-pressed="${i ? "false" : "true"}">${esc(s.nome)}</button>`).join("")}</div>
  </div>
</section>

<section class="ad" aria-labelledby="ad-t">
  <h2 id="ad-t" class="sec-t" data-split>Arraste e veja a lamination.</h2>
  <div class="ad__quadro" style="--p:50%">
    <img src="${F("antes")}" alt="Sobrancelha antes da lamination" width="1200" height="645" loading="lazy">
    <img class="ad__depois" src="${F("depois")}" alt="Sobrancelha depois da lamination" width="1200" height="645" loading="lazy">
    <span class="ad__linha" aria-hidden="true"></span>
    <input type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois">
  </div>
  <p class="ad__leg"><span>Antes</span><span>Depois</span></p>
</section>
`}
${cine ? cenaReal({ ...DADOS.cenaSobr, video: u(DADOS.cenaSobr.video), poster: u(DADOS.cenaSobr.poster) }, "real-sobr") : ""}
${simples ? "" : `<section class="regua" id="sobrancelhas" aria-labelledby="regua-t">
  <div class="regua__palco">
    <h2 id="regua-t" class="regua__t">Sobrancelha na régua, do design à micropigmentação.</h2>
    <div class="regua__janela">
      <ol class="regua__trilho">${regua.map((s) => `<li class="rc" data-p="${s.preco}">
        <img src="${u(s.foto)}" alt="${esc(s.nome)}" loading="lazy">
        <h3>${esc(s.nome)}</h3>
        <p>${esc(s.texto)}</p>
        <div class="rc__fim"><b>${reais(s.preco)}</b>${mais(s)}</div>
      </li>`).join("")}</ol>
    </div>
  </div>
</section>`}

<section class="cat" id="catalogo" aria-labelledby="cat-t">
  <h2 id="cat-t" class="sec-t" data-split>Todos os serviços e preços</h2>
  <div class="cat__abas" role="tablist" aria-label="Categorias">${grupos.map((g, i) => `<button role="tab" id="tab-${i}" aria-controls="painel-${i}" aria-selected="${i ? "false" : "true"}" ${i ? 'tabindex="-1"' : ""}>${esc(g)}</button>`).join("")}</div>
  ${grupos.map((g, i) => `<ul class="cat__lista" id="painel-${i}" role="tabpanel" aria-labelledby="tab-${i}" ${i ? "hidden" : ""}>${D.servicos.filter((s) => s.grupo === g).map((s) => `<li class="it">
    <img src="${u(s.mini || s.foto)}" alt="" width="84" height="84" loading="lazy">
    <div><h3>${esc(s.nome)}</h3><p>${esc(s.texto)}</p></div>
    <b>${reais(s.preco)}</b>${mais(s)}
  </li>`).join("")}</ul>`).join("")}
${simples ? `<p class="cat__cta"><button class="btn btn--cheio" type="button" id="ver-pedido">Ver meu pedido</button></p>` : ""}
</section>

${simples ? cursosSimples : `<section class="cur" id="cursos" aria-labelledby="cur-t">
  <div class="cur__txt">
    <h2 id="cur-t" class="sec-t" data-split>Saia daqui com certificado no seu nome.</h2>
    <form class="cur__form" id="cur">
      <label class="campo">Seu nome <input name="nome" maxlength="34" autocomplete="name" placeholder="Digite e veja no certificado"></label>
      <fieldset><legend>Curso</legend>${D.cursos.map((c, i) => `<label class="cur__op"><input type="radio" name="curso" value="${esc(c.nome)}" ${i ? "" : "checked"}><span><b>${esc(c.nome)}</b><small>${esc(c.texto)}</small></span></label>`).join("")}</fieldset>
      <p class="cur__valor">Valor e datas das turmas pelo WhatsApp.</p>
      <button class="btn btn--claro" type="submit">Quero esta turma</button>
    </form>
  </div>
  <figure class="cert" aria-label="Exemplo de certificado">
    <p class="cert__m">${esc(D.nome)} Academy</p>
    <p class="cert__t">Certificado</p>
    <p class="cert__l">Certificamos que</p>
    <p class="cert__n" id="cert-n">Seu nome aqui</p>
    <p class="cert__l">concluiu o curso de</p>
    <p class="cert__c" id="cert-c">${esc(D.cursos[0].nome)}</p>
    <div class="cert__ass"><span>Instrutora responsável</span></div>
    <figcaption>Exemplo de certificado</figcaption>
  </figure>
</section>`}

<section class="depo" aria-labelledby="depo-t">
  <h2 id="depo-t" class="sec-t" data-split>Quem já sentou na cadeira</h2>
  <ul class="depo__lista">${D.depoimentos.filter(([t]) => t).map(([t, n, s]) => `<li><blockquote><p>${esc(t)}</p></blockquote><p class="depo__quem">${esc(n)} · ${esc(s)}</p></li>`).join("")}</ul>
  <p class="depo__nota">Depoimentos de exemplo deste protótipo.</p>
</section>

<section class="faq" id="duvidas" aria-labelledby="faq-t">
  <h2 id="faq-t" class="sec-t" data-split>Antes de agendar</h2>
  <div class="faq__lista">${D.faq.filter(([q, r]) => q && r).map(([q, r]) => `<details><summary>${esc(q)}</summary><p>${esc(r)}</p></details>`).join("")}</div>
</section>

<footer class="fim">
  <p class="fim__marca">${esc(D.nome)}</p>
  <p>${esc(D.endereco)}<br>${esc(D.horario)}</p>
  <p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(D.endereco)}" target="_blank" rel="noopener">Como chegar</a> · <a href="${esc(D.instagram)}" target="_blank" rel="noopener">Instagram</a></p>
</footer>
</main>
<a class="wa" href="${waLink}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/></svg>Agendar pelo WhatsApp</a>
${simples ? pedidoSimples() : `<dialog class="ck" id="ck" aria-labelledby="ck-t" data-lenis-prevent>
  <div class="ck__topo"><h2 id="ck-t">Sua sacola</h2><button type="button" class="ck__x" id="ck-x" aria-label="Fechar">×</button></div>
  <ol class="ck__passos" aria-label="Etapas do pedido"><li>Sacola</li><li>Horário</li><li>Dados</li><li>Pagamento</li></ol>
  <form id="ck-f" novalidate>
    <section data-p="0"><ul class="ck__itens"></ul><p class="ck__vazio">Sua sacola está vazia. Escolha um serviço para continuar.</p></section>
    <section data-p="1" hidden>
      <fieldset><legend>Dia</legend><div class="ck__dias"></div></fieldset>
      <fieldset><legend>Horário</legend><p class="ck__dica">Escolha um dia para ver os horários livres.</p><div class="ck__horas">${D.horas.map((h) => `<label class="chip"><input type="radio" name="hora" value="${h}" disabled><span>${h}<small class="chip__oc">ocupado</small></span></label>`).join("")}</div></fieldset>
    </section>
    <section data-p="2" hidden>
      <label class="campo">Nome completo <input name="cliente" autocomplete="name"></label>
      <label class="campo">WhatsApp <input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(14) 90000-0000"></label>
      <label class="campo">Observações (opcional) <textarea name="obs" rows="3" placeholder="Alergias, primeira vez, manutenção"></textarea></label>
    </section>
    <section data-p="3" hidden>
      <fieldset><legend>Como prefere pagar</legend>
        <label class="pg"><input type="radio" name="pag" value="pix" checked><span><b>Sinal por Pix</b><small class="pg__sinal"></small></span></label>
        <label class="pg"><input type="radio" name="pag" value="estudio"><span><b>No estúdio</b><small>O estúdio confirma o horário pelo WhatsApp.</small></span></label>
        <label class="pg pg--off"><input type="radio" name="pag" value="cartao" disabled><span><b>Cartão</b><small>Em breve, pelo site.</small></span></label>
      </fieldset>
      <dl class="ck__res"></dl>
      <p class="ck__nota">Protótipo: a agenda e o Pix são simulados. Nenhum valor é cobrado.</p>
    </section>
    <section data-p="4" hidden class="ck__pix">
      <p>Pague o sinal de <b class="pix__valor"></b> para garantir o horário. Ele fica reservado por <b class="pix__tempo">15:00</b>.</p>
      <svg class="pix__qr" viewBox="0 0 29 29" role="img" aria-label="QR Code do Pix (exemplo)"><path class="pix__mod" d=""/></svg>
      <label class="campo">Pix copia e cola <input class="pix__codigo" readonly value=""></label>
      <p class="ck__nota">Protótipo: este Pix é um exemplo e não recebe pagamento. Use "Simular pagamento".</p>
    </section>
    <section data-p="5" hidden class="ck__ok">
      <p class="ck__ok-t">Horário reservado.</p>
      <p class="ok__txt"></p>
      <dl class="ck__res ok__res"></dl>
    </section>
    <p class="ck__erro" role="alert" hidden></p>
    <div class="ck__pe">
      <p class="ck__total"><span>Total</span><b>R$ 0,00</b></p>
      <div class="ck__bts">
        <button type="button" class="btn" id="ck-volta" hidden>Voltar</button>
        <button type="button" class="btn btn--cheio" id="ck-sim" hidden>Simular pagamento</button>
        <button type="submit" class="btn btn--cheio" id="ck-seg">Escolher horário</button>
      </div>
    </div>
  </form>
</dialog>`}`;
};
