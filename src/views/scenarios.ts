/** HTML estático da tela. Montado por src/views/index.ts. */
export const scenarios = /* html */ `
<section class="view" id="view-scenarios">
  <div class="page-head" data-n="03">
    <div>
      <p class="kicker">Inteligência</p>
      <h1>Cenários</h1>
      <p>Como o novo governo pode evoluir e por onde isso chega ao Itaú. Primeiro a visão ampla: três caminhos de política fiscal e institucional e as combinações entre eles. Depois, os cenários temáticos, que você filtra por tipo, tema, subtema, ator, probabilidade, gravidade e horizonte.</p>
    </div>
    <span class="badge orange">Versão preliminar · 11/11/2026</span></div>
  <div class="notice">As fontes de cenário indicam que não devem ser atribuídas probabilidades numéricas sem evidência suficiente. Por isso, esta versão apresenta plausibilidade qualitativa (baixa, média, alta) e sinais de confirmação, sem inventar percentuais.</div>
  <div class="section-title tight">
    <div>
      <h2>Três caminhos</h2>
      <p>Cada um parte de uma pergunta: o pacote fiscal sai nas primeiras semanas ou não, e o Congresso deixa passar?</p>
    </div>
  </div>
  <div class="scn-grid" id="scenarioGrid"></div>
  <div class="section-title tight">
    <div>
      <h2>Comparação lado a lado</h2>
      <p>As condições e os efeitos são qualitativos. As versões ficam identificadas nas fontes.</p>
    </div>
  </div>
  <div class="scn-compare" id="scenarioCompare"></div>
  <div class="section-title tight">
    <div>
      <h2>Combinações possíveis</h2>
      <p>Os cenários não são mutuamente excludentes: A+B, A+C e B+C.</p>
    </div>
  </div>
  <div class="combos" id="scenarioCombos"></div>
  <div class="section-title breath" id="scnList">
    <div>
      <h2>Cenários temáticos</h2>
      <p>Tipo inclui riscos e oportunidades. Escolha mais de uma opção no mesmo grupo para somar; grupos diferentes se cruzam.</p>
    </div>
  </div>
  <div class="filterbar"><input id="scnSearch" type="search" placeholder="Buscar: juros, fraude, hedge, energia…" autocomplete="off" aria-label="Buscar cenários"><select id="scnOrder" aria-label="Ordenar"><option value="id">Ordem: CT1–CT8</option><option value="p">Maior probabilidade</option><option value="g">Maior gravidade</option><option value="c">Maior complexidade</option><option value="h">Mais próximo (horizonte)</option></select></div>
  <details class="filters" open><summary>Filtros <span class="small muted">(tipo, tema, subtema, público, ator, nível e horizonte)</span></summary>
  <div id="scnFilters" class="fgrid"></div>
  </details>
  <div class="res"><span id="scnCount" aria-live="polite"></span><button type="button" class="card-action" id="scnClear">Limpar filtros</button></div>
  <div class="scn-grid" id="scnGrid"></div>
  <div class="notice blue">Probabilidade, gravidade e complexidade são avaliações qualitativas preliminares do grupo, não previsões. CT1–CT8 vêm do protótipo Itaú 360° e ainda serão revistos com as fontes mais recentes.</div>
</section>
`
