/** HTML estático da tela. Montado por src/views/index.ts. */
export const risks = /* html */ `
<section class="view" id="view-risks">
  <div class="page-head" data-n="05">
    <div>
      <p class="kicker">Análise e monitoramento</p>
      <h1>Riscos e oportunidades</h1>
      <p>Registro dos eventos e mecanismos que podem afetar o Itaú direta ou indiretamente. A avaliação quantitativa só aparece quando há nota justificada; itens sem pontuação permanecem em análise porque lacuna é melhor que números sem base.</p>
    </div>
    <span class="badge gold">Matriz em atualização</span></div>
  <div class="filterbar"><input id="riskSearch" placeholder="Buscar evento, tema ou impacto…"><select id="riskType"><option value="all">Risco e oportunidade</option><option>Risco</option><option>Oportunidade</option><option>Misto</option></select></div>
  <div class="section-title tight">
    <div>
      <h2>Matriz de probabilidade e gravidade</h2>
      <p>Os cenários temáticos posicionados pela avaliação qualitativa. Quanto mais ao alto e à direita, mais atenção.</p>
    </div>
  </div>
  <div class="panel" id="riskMatrix"></div>
  <div class="section-title">
    <div>
      <h2>Registro de eventos</h2>
      <p>Cada linha traz o canal de impacto e o estado da avaliação.</p>
    </div>
  </div>
  <div class="panel table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th>Evento / questão</th>
          <th>Tipo</th>
          <th>Canal de impacto</th>
          <th>Estado da avaliação</th>
          <th>Fonte</th>
        </tr>
      </thead>
      <tbody id="riskTable"></tbody>
    </table>
  </div>
  <div class="section-title">
    <div>
      <h2>Como interpretar a matriz</h2>
      <p>Critérios do roteiro metodológico do grupo. A nova interpretação será incorporada aqui.</p>
    </div>
  </div>
  <div class="grid rows">
    <div class="panel">
      <h3 style="margin:0 0 5px">Probabilidade</h3>
      <p class="muted" >Baixa, média ou alta, dentro do horizonte analisado, aplicada a propostas que ainda dependem de aprovação ou execução.</p>
    </div>
    <div class="panel">
      <h3 style="margin:0 0 5px">Gravidade para o Itaú</h3>
      <p class="muted" >Baixa, média ou alta, acompanhada do mecanismo de transmissão e da identificação do efeito como risco, oportunidade ou misto.</p>
    </div>
    <div class="panel">
      <h3 style="margin:0 0 5px">Confiança analítica</h3>
      <p class="muted" >Registrada separadamente. Não deve ser multiplicada pela pontuação nem usada para reduzir o risco.</p>
    </div>
  </div>
  <div class="notice">A posição na matriz serve para ordenar prioridades. Não é probabilidade estatística nem estimativa de perda financeira. Eventos pouco prováveis e de impacto elevado devem continuar visíveis.</div>
  <div class="source-line">Fonte metodológica: <a href="#" data-doc="Roteiro_de_pesquisa_com_metodos.pdf">Roteiro de pesquisa com métodos, p. 2</a>.</div>
</section>
`
