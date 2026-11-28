/** HTML estático da tela. Montado por src/views/index.ts. */
export const themes = /* html */ `
<section class="view" id="view-themes">
  <div class="page-head" data-n="02">
    <div>
      <p class="kicker">Inteligência</p>
      <h1>Temas de análise</h1>
      <p>Cinco frentes de política pública que podem mexer com o balanço do Itaú. Cada uma tem uma explicação curta, os subtemas e, no dossiê, como o banco pode aproveitar e com o que ter cuidado.</p>
    </div>
  </div>
  <div class="field theme-search"><label for="themeSearch">Buscar tema</label><input id="themeSearch" type="search" placeholder="Ex.: reforma tributária, crédito, fiscal" autocomplete="off"></div>
  <div class="grid grid-2" id="themeGrid"></div>
  <div class="section-title tight">
    <div>
      <h2>Dossiês publicados pela equipe</h2>
      <p>Análises adicionais criadas na área editorial e liberadas para consulta.</p>
    </div>
  </div>
  <div class="grid grid-2" id="customDossierGrid"></div>
  <div class="section-title breath">
    <div>
      <h2>Temas transversais</h2>
      <p>Assuntos que atravessam mais de um eixo. Tudo muda ao longo do tempo: a equipe edita e cria temas na Área editorial, e cada um abre um mini dossiê.</p>
    </div>
    <button type="button" class="card-action" data-new-topic>+ Novo tema transversal</button></div>
  <div class="grid grid-3" id="crossThemes"></div>
  <div id="themeDetail"></div>
</section>
`
