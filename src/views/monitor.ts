/** HTML estático da tela. Montado por src/views/index.ts. */
export const monitor = /* html */ `
<section class="view" id="view-monitor">
  <div class="page-head" data-n="06">
    <div>
      <p class="kicker">Análise e monitoramento</p>
      <h1>Sinais e indicadores</h1>
      <p>O que olhar para saber qual cenário está valendo: da promessa ao anúncio, à votação, à regulamentação e à execução. Sinal novo obriga a rever a análise.</p>
    </div>
  </div>
  <div id="dayRule"></div>
  <div class="grid grid-2">
    <div class="panel">
      <h2 style="margin:0 0 12px">Variáveis que definem os cenários</h2>
      <div class="item-list" id="variablesList"></div>
      <div class="source-line">Fonte: <a href="#" data-doc="Cenarios_att_24_nov.zip">Cenários (último pacote)</a></div>
    </div>
    <div class="panel">
      <h2 style="margin:0 0 12px">Calendário de referência</h2>
      <div class="timeline" id="timeline"></div>
      <div class="source-line">Fonte: <a href="#" data-doc="Cenarios_att_24_nov.zip">Cenários (último pacote)</a></div>
    </div>
  </div>
  <div class="section-title">
    <div>
      <h2>Painel de indicadores por dimensão</h2>
      <p>Indicadores propostos nos materiais do grupo; confirmar séries e metodologia antes de atribuir causalidade.</p>
    </div>
  </div>
  <div class="grid grid-3" id="indicatorGrid"></div>
  <div class="section-title breath">
    <div>
      <h2>Pontos ainda a verificar</h2>
      <p>Itens explicitamente registrados como lacunas no documento de cenários.</p>
    </div>
  </div>
  <div class="panel" id="pendingList"></div>
</section>
`
