/** HTML estático da tela. Montado por src/views/index.ts. */
export const sources = /* html */ `
<section class="view" id="view-sources">
  <div class="page-head" data-n="08">
    <div>
      <p class="kicker">Análise e monitoramento</p>
      <h1>Fontes e documentos</h1>
      <p>Cada afirmação do site já traz a fonte ao lado. Aqui está o acervo completo. Ter fonte não prova nada sem conferir o trecho citado.</p>
    </div>
  </div>
  <div class="src-bar ed-only"><button class="btn orange" type="button" data-src-new>+ Adicionar fonte</button></div>
  <div class="section-title">
    <div>
      <h2>Documentos internos do projeto</h2>
      <p>Arquivos incluídos no pacote do site. Abra-os para conferir a página citada.</p>
    </div>
  </div>
  <div class="panel" id="internalSources"></div>
  <div class="section-title breath">
    <div>
      <h2>Fontes públicas utilizadas na atualização dos perfis</h2>
      <p>Fontes institucionais e notícias de referência com data.</p>
    </div>
  </div>
  <div class="panel" id="publicSources"></div>
  <div class="notice blue">A existência de uma fonte não significa que toda a informação dela esteja automaticamente confirmada. Em cada dossiê, a equipe deve registrar o trecho utilizado, a data de consulta e o limite da evidência.</div>
</section>
`
