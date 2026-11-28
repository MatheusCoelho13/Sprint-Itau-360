/** HTML estático da tela. Montado por src/views/index.ts. */
export const actors = /* html */ `
<section class="view" id="view-actors">
  <div class="page-head" data-n="04">
    <div>
      <p class="kicker">Inteligência</p>
      <h1>Atores e instituições</h1>
      <p>Quem decide, quem indica e quem pode barrar. Cargo confirmado, nome cotado e hipótese aparecem separados: borda tracejada é o que ainda não é fato.</p>
    </div>
  </div>
  <div class="atab-row" role="tablist"><button class="atab active" role="tab" aria-selected="true" data-atab="dir">Diretório</button><button class="atab" role="tab" aria-selected="false" data-atab="map">Mapa de conexões</button></div>
  <div id="actorDir">
    <div class="filterbar"><input id="actorSearch" placeholder="Buscar ator ou instituição…"><select id="actorFilter"><option value="all">Todos os grupos</option><option>Executivo</option><option>Legislativo</option><option>Judiciário / controle</option><option>Oposição</option><option>Reguladores</option></select><select id="actorHz" aria-label="Horizonte"><option value="all">Todos os horizontes</option><option value="1">Curto prazo</option><option value="2">Médio prazo</option><option value="3">Longo prazo</option></select><span class="small muted" id="actorResults"></span></div>
    <div id="certStrip"></div>
    <div class="actor-grid" id="actorGrid"></div>
  </div>
  <div id="actorMapPane" class="hide">
    <p class="small muted">Conexões ilustrativas do exercício. Clique num nó para ver o papel da instituição; os perfis documentados estão no Diretório.</p>
    <div class="panel actor-mapbox">
      <div class="actor-map" id="actorMap"></div>
      <div class="actor-summary" id="actorMapSummary"></div>
    </div>
  </div>
  <div id="actorDetail"></div>
  <div class="notice blue">Os nomes cotados em documentos de novembro não equivalem a nomeações. Perfis preservam a distinção entre cargo confirmado, nome mencionado pela imprensa e hipótese de composição de governo. Fotografias possuem crédito e link de origem; para publicação comercial ou institucional, conferir as condições de reutilização de cada imagem.</div>
</section>
`
