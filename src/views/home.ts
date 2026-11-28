/** HTML estático da tela. Montado por src/views/index.ts. */
export const home = /* html */ `
<section class="view active" id="view-home">
  <div class="hero front">
    <div class="front-main">
      <p class="kicker">Briefing para o Itaú · referência 17 nov. 2026</p>
      <h1>O que o governo eleito pode mudar em 100 dias, e por onde isso chega ao Itaú.</h1>
      <p class="lede">Pacote fiscal, Congresso e regulamentação tributária decidem o que chega ao funding, ao crédito e aos clientes do banco. Cada afirmação traz a fonte e diz se é fato, nome cotado ou hipótese.</p>
      <p class="hero-clock" id="heroClock"></p>
      <nav class="front-axes" aria-label="Os 5 eixos de análise">
        <h2>Cinco eixos de análise</h2>
        <ul id="axisIndex"></ul>
      </nav>
    </div>
    <aside class="rail" id="rail" aria-label="Sinais a monitorar"></aside>
    <div id="heroRule" class="front-rule"></div>
  </div>
  <section class="overview" id="overview" aria-label="Visão geral"></section>
  <div class="section-title">
    <div>
      <h2>Prioridades de acompanhamento</h2>
      <p>Em ordem do marco mais próximo no calendário de referência. Não é ranking de gravidade: sem evidência, o grupo não atribui nota.</p>
    </div>
    <button class="card-action" data-go="themes">Ver todos os temas →</button></div>
  <div class="panel">
    <div class="item-list" id="priorityList"></div>
  </div>
  <div class="grid" style="margin-top:18px">
    <div class="panel">
      <div class="section-title" style="margin:0 0 20px">
        <div>
          <h2>Como a análise chega ao Itaú</h2>
          <p>Exemplo com a reforma tributária. O mesmo caminho vale para os outros eixos.</p>
        </div>
      </div>
      <ol class="transmit" id="transmitList"></ol>
      <div class="source-line">Fonte: <a href="#" data-doc="Cenarios_Itau_100_dias_Lula4.docx">Cenários 100 dias, p. 1</a> · <a href="#" data-doc="Apresentacao_intermediaria.pdf">Apresentação intermediária, p. 4</a> (modelo). Os efeitos são hipóteses de transmissão, não resultados medidos.</div>
    </div>
  </div>
  <div class="notice blue">Nota de integridade: este ambiente organiza materiais e fontes consultados até 17/11/2026. Estimativas e hipóteses dos documentos de 11/11 permanecem identificadas como preliminares; não são apresentadas como fatos consumados.</div>
</section>
`
