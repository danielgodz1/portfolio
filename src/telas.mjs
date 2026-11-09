// Emulações dos sistemas reais (dados fictícios). Cada .tela[data-t=n] aparece no passo n.
const nav = (itens, ativos) =>
  `<nav class="s-nav">${itens.map((n, i) => `<span class="s-nav__i" data-ativo="${ativos[i]}">${n}</span>`).join("")}</nav>`;

export const CHECK = {
  id: "flowcheck",
  tema: "check",
  titulo: "FlowCheck",
  passos: [
    ["Painel do dia", "O gestor abre o painel e vê checklists, não conformidades e o que espera aprovação."],
    ["Inspeção em campo", "O técnico marca Conforme, Não conforme ou N/A item a item. A falha ganha foto e descrição."],
    ["IA sugere o plano", "Na aprovação, a IA propõe o plano de ação 5W2H para cada não conformidade."],
    ["Laudo assinado", "O relatório sai em PDF ou Excel, com assinatura digital e carimbo de tempo."],
  ],
  html: `
  ${nav(["Painel / Dashboard", "Executar Checklist", "Aprovações Pendentes", "Relatórios & Exportação"], ["0", "1", "2", "3"])}
  <div class="s-main">
    <div class="tela" data-t="0">
      <h4>Painel / Dashboard</h4>
      <div class="s-kpis"><div><b>14</b><span>checklists hoje</span></div><div class="alerta"><b>3</b><span>não conformidades</span></div><div><b>5</b><span>aguardando aprovação</span></div></div>
      <div class="s-barras" aria-hidden="true"><i style="--h:40%"></i><i style="--h:62%"></i><i style="--h:48%"></i><i style="--h:80%"></i><i style="--h:56%"></i><i style="--h:70%"></i><i style="--h:34%"></i></div>
    </div>
    <div class="tela" data-t="1">
      <h4>Caminhão basculante · pré-operação</h4>
      <ul class="s-itens">
        <li><span>Pneus e calibragem</span><em class="ok">Conforme (C)</em></li>
        <li><span>Freios</span><em class="ok">Conforme (C)</em></li>
        <li class="nc"><span>Luzes e sinalização</span><em class="bad">Não conforme</em></li>
        <li><span>Extintor</span><em class="ok">Conforme (C)</em></li>
      </ul>
      <div class="s-foto"><div class="s-foto__img"></div><span>Foto anexada · farol dianteiro sem funcionar</span></div>
    </div>
    <div class="tela" data-t="2">
      <h4>Aprovações Pendentes</h4>
      <div class="s-card"><b>Luzes e sinalização</b><span class="tag">Não conforme</span>
        <p class="s-plano__t">Plano Sugerido (5W2H):</p>
        <ul class="s-plano"><li><b>O quê</b> Trocar o farol dianteiro</li><li><b>Quem</b> Equipe de manutenção</li><li><b>Quando</b> Antes da próxima operação</li><li><b>Onde</b> Oficina</li><li><b>Por quê</b> Visibilidade e segurança</li></ul>
        <span class="s-btn">Aprovar plano</span></div>
    </div>
    <div class="tela" data-t="3">
      <h4>Relatórios & Exportação</h4>
      <div class="s-folha"><div class="s-folha__t"></div><div class="s-folha__l"></div><div class="s-folha__l c"></div><div class="s-folha__l"></div><div class="s-assina"><svg viewBox="0 0 120 30" aria-hidden="true"><path d="M4 22 C20 4 26 30 40 14 S70 20 90 10 S108 16 116 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg><span>Assinado digitalmente · SHA-256</span></div></div>
      <div class="s-acoes"><span class="s-btn">Exportar PDF</span><span class="s-btn s-btn--ghost">Exportar Excel</span></div>
    </div>
  </div>`,
};

export const REQ = {
  id: "flowrequest",
  tema: "req",
  titulo: "FlowRequest",
  passos: [
    ["Nova requisição", "Em campo, o apontador escolhe o tipo e monta a lista de itens do almoxarifado."],
    ["Aprovação", "A requisição segue o fluxo: criada, aguardando aprovação, aguardando retirada."],
    ["Conclusão automática", "No almoxarifado, 48 horas depois a requisição se conclui sozinha."],
    ["Consumo por setor", "Gestores acompanham o consumo e tiram comprovantes em PDF e planilhas Excel."],
  ],
  html: `
  ${nav(["Painel", "Nova requisição", "Listagem", "Relatórios"], ["", "0", "1", "3"])}
  <div class="s-main">
    <div class="tela" data-t="0">
      <h4>Nova requisição · Almoxarifado</h4>
      <ul class="s-itens s-itens--lista">
        <li><span>Luva de raspa</span><em>4 un</em></li>
        <li><span>Disco de corte 7"</span><em>10 un</em></li>
        <li><span>Fita isolante</span><em>2 un</em></li>
      </ul>
      <span class="s-btn">Enviar requisição</span>
    </div>
    <div class="tela" data-t="1">
      <h4>Acompanhamento</h4>
      <ol class="s-trilho"><li class="f">Criada</li><li class="f">Aguardando aprovação</li><li class="a">Aguardando retirada</li><li>Concluída</li></ol>
      <div class="s-card"><b>Requisição de almoxarifado</b><span>3 itens · setor Manutenção</span></div>
    </div>
    <div class="tela" data-t="2">
      <h4>Auto-conclusão</h4>
      <div class="s-reloj"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" class="trilha"/><circle cx="60" cy="60" r="50" class="prog" pathLength="1"/></svg><b>48 h</b></div>
      <span class="s-status">Concluída</span>
    </div>
    <div class="tela" data-t="3">
      <h4>Consumo por setor</h4>
      <div class="s-hbar" aria-hidden="true"><div><span>Manutenção</span><i style="--w:86%"></i></div><div><span>Oficina</span><i style="--w:62%"></i></div><div><span>Obra</span><i style="--w:44%"></i></div><div><span>Escritório</span><i style="--w:21%"></i></div></div>
      <div class="s-acoes"><span class="s-btn">Comprovante PDF</span><span class="s-btn s-btn--ghost">Planilha Excel</span></div>
    </div>
  </div>`,
};
