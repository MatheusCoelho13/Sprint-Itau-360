/** HTML estático da tela. Montado por src/views/index.ts. */
export const method = /* html */ `
<section class="view" id="view-method">
  <div class="page-head" data-n="07">
    <div>
      <p class="kicker">Análise e monitoramento</p>
      <h1>Metodologia de análise</h1>
      <p>Seis etapas, do histórico político ao monitoramento. A regra do grupo: histórico dá contexto e não previsão, e suposição não vira fato.</p>
    </div>
  </div>
  <div class="panel">
    <h2 style="margin:0 0 5px">Fluxo analítico em seis etapas</h2>
    <p class="muted" style="margin:0 0 10px">Esta sequência organiza os métodos e os resultados. Cada etapa produz evidências que alimentam a seguinte.</p>
    <div id="methodSteps"></div>
    <div class="source-line">Fonte: <a href="#" data-doc="Relatorio_Sprint_Itau_Tom_Academico_Natural.pdf">Relatório Sprint, pp. 3–5</a>.</div>
  </div>
  <div class="section-title breath">
    <div>
      <h2>Instrumentos utilizados</h2>
      <p>Ferramentas que aparecem no relatório e nos roteiros de aplicação.</p>
    </div>
  </div>
  <div class="grid grid-3" id="methodTools"></div>
  <div class="section-title">
    <div>
      <h2>O que é o dossiê analítico?</h2>
      <p>Substitui a antiga “ficha de análise” como tela de consulta.</p>
    </div>
  </div>
  <div class="panel">
    <p style="margin-top:0">O dossiê é a página completa de uma análise já realizada. Não é um formulário para o cliente preencher. Ele reúne o raciocínio da equipe e permite que outra pessoa entenda o que está sendo analisado, de onde veio a evidência, quais métodos foram aplicados, como a decisão pode chegar ao Itaú e o que deve ser monitorado.</p>
    <div class="detail-grid">
      <div class="detail-block">
        <h4>1 · Identificação e evidência</h4>
        <p>Questão, recorte temporal, fato ou proposta, status, documento, trecho, página, data e fonte.</p>
      </div>
      <div class="detail-block">
        <h4>2 · Contexto e viabilidade</h4>
        <p>Histórico, tendências, competências institucionais, atores, obstáculos, incentivos e estágio de implementação.</p>
      </div>
      <div class="detail-block">
        <h4>3 · Mecanismo de transmissão</h4>
        <p>Sequência causal entre decisão política, mudança de regra ou condição econômica, setor/cliente afetado e exposição do Itaú.</p>
      </div>
      <div class="detail-block">
        <h4>4 · Avaliação e monitoramento</h4>
        <p>Risco/oportunidade, cenários, probabilidade, impacto, confiança, justificativa, indicadores, sinais e próxima revisão.</p>
      </div>
    </div>
    <div class="source-line">Fontes: <a href="#" data-doc="Roteiro_de_pesquisa_com_metodos.pdf">Roteiro de métodos, pp. 1–3</a> · <a href="#" data-doc="Cenarios.pdf">Construção de cenários, pp. 1–2</a> · <a href="#" data-doc="Apresentacao_intermediaria.pdf">Apresentação, p. 4</a>.</div>
  </div>
  <div class="section-title">
    <div>
      <h2>Perguntas obrigatórias em cada cenário</h2>
    </div>
  </div>
  <div class="grid grid-2">
    <div class="panel">
      <ol style="padding-left:18px">
        <li>O que pode acontecer?</li>
        <li>Por que isso poderia acontecer?</li>
        <li>Qual seria o impacto para o Itaú?</li>
      </ol>
    </div>
    <div class="panel">
      <ol start="4" style="padding-left:18px">
        <li>Como esse impacto chegaria ao banco?</li>
        <li>Quais sinais permitiriam identificar o cenário antecipadamente?</li>
      </ol>
    </div>
  </div>
</section>
`
