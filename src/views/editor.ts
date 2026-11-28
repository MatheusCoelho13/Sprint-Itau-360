/** HTML estático da tela. Montado por src/views/index.ts. */
export const editor = /* html */ `
<section class="view" id="view-editor">
  <div class="page-head" data-n="09">
    <div>
      <p class="kicker">Gestão do conteúdo</p>
      <h1>Área editorial</h1>
      <p>Para a equipe: criar e atualizar perfis e dossiês sem perder o vínculo entre o texto e a fonte.</p>
    </div>
  </div>
  <div class="notice blue">Os registros criados aqui são salvos no Supabase e compartilhados entre todos os usuários autenticados.</div>
  <div class="editor-tabs"><button class="editor-tab active" data-etab="actor">Novo perfil de ator</button><button class="editor-tab" data-etab="analysis">Novo dossiê analítico</button><button class="editor-tab" data-etab="topic">Tema ou subtema</button><button class="editor-tab" data-etab="all">Todo o conteúdo</button><button class="editor-tab" data-etab="history">Histórico</button><button class="editor-tab" data-etab="content">Conteúdos cadastrados</button></div>
  <div id="editorActor" class="panel">
    <form id="actorForm"><input type="hidden" id="editActorId">
      <div class="form-grid">
        <div class="field"><label>Nome completo</label><input id="aName" required placeholder="Nome do ator"></div>
        <div class="field"><label>Cargo / posição</label><input id="aRole" required placeholder="Cargo ou posição institucional"></div>
        <div class="field"><label>Grupo</label><select id="aGroup"><option>Executivo</option><option>Legislativo</option><option>Judiciário / controle</option><option>Oposição</option><option>Reguladores</option><option>Setor privado</option></select></div>
        <div class="field"><label>Status da informação</label><select id="aStatus"><option>Confirmado</option><option>Histórico / ex-ocupante</option><option>Em verificação</option></select></div>
        <div class="field full"><label>Biografia e trajetória (com fatos verificáveis)</label><textarea id="aBio" required placeholder="Resumo biográfico, trajetória, experiência e competências..."></textarea></div>
        <div class="field full"><label>Relevância para as análises do Itaú</label><textarea id="aRelevance" placeholder="Competências, influência, capacidade de decisão ou bloqueio e temas relacionados..."></textarea></div>
        <div class="field full"><label>Avaliação do ator (qualitativa, opcional)</label>
          <p class="small muted" style="margin:0">Entrar e sair se referem ao cargo ou à pasta em discussão. Gravidade é o efeito para o Itaú se o ator continuar no papel atual.</p>
        </div>
        <div class="field"><label>Chance de entrar</label><select id="aEntra"><option value="">Não se aplica</option><option value="1">Baixa</option><option value="2">Média</option><option value="3">Alta</option></select></div>
        <div class="field"><label>Chance de sair</label><select id="aSai"><option value="">Não se aplica</option><option value="1">Baixa</option><option value="2">Média</option><option value="3">Alta</option></select></div>
        <div class="field"><label>Gravidade se continuar</label><select id="aGrav"><option value="">Não avaliada</option><option value="1">Baixa</option><option value="2">Média</option><option value="3">Alta</option></select></div>
        <div class="field"><label>Horizonte</label><select id="aHz"><option value="">Não definido</option><option value="1">Curto prazo</option><option value="2">Médio prazo</option><option value="3">Longo prazo</option></select></div>
        <div class="field full"><label>Por quê (justificativa da avaliação)</label><textarea id="aWhy" placeholder="Fato ou sinal que sustenta a avaliação, com data. Sem fonte, deixe em branco."></textarea></div>
        <div class="field"><label>URL da fotografia</label><input id="aPhoto" placeholder="https://..."></div>
        <div class="field"><label>Crédito / origem da fotografia</label><input id="aPhotoCredit" placeholder="Instituição, fotógrafo e link"></div>
        <div class="field full"><label>Fontes (uma por linha: título | URL)</label><textarea id="aSources" placeholder="Perfil institucional | https://...
Notícia de referência | https://..."></textarea></div>
        <div class="field full"><label>Data de referência / observações</label><input id="aDate" placeholder="Ex.: consultado em 17/11/2026; nome cotado em notícia de 11/11"></div>
      </div>
      <div class="btn-row"><button class="btn orange" type="submit">Salvar perfil</button><button class="btn secondary" type="button" id="actorReset">Limpar formulário</button></div>
    </form>
  </div>
  <div id="editorAnalysis" class="panel hide">
    <form id="analysisForm"><input type="hidden" id="editAnalysisId">
      <div class="form-grid">
        <div class="field"><label>Título do dossiê</label><input id="dTitle" required placeholder="Ex.: Credibilidade fiscal e custo de funding"></div>
        <div class="field"><label>Eixo temático</label><select id="dTheme"><option>Política fiscal e orçamentária</option><option>Política tributária</option><option>Desenvolvimento produtivo e reindustrialização</option><option>Tecnologia e inovação</option><option>Infraestrutura e transição energética</option><option>Transversal</option></select></div>
        <div class="field"><label>Status (só Revisão e Administração publicam)</label><select id="dStatus"><option>Em elaboração</option><option>Em revisão</option><option>Devolvido</option><option>Publicado</option><option>Arquivado</option></select></div>
        <div class="field"><label>Tipo de efeito</label><select id="dType"><option>Risco</option><option>Oportunidade</option><option>Misto</option><option>Monitoramento</option></select></div>
        <div class="field full"><label>Pergunta analítica</label><textarea id="dQuestion" required placeholder="Qual pergunta esta análise responde? Qual é o recorte temporal?"></textarea></div>
        <div class="field full"><label>Contexto e evidências</label><textarea id="dEvidence" required placeholder="Fatos, documentos, estágio, tendências e incertezas identificadas..."></textarea></div>
        <div class="field full"><label>Viabilidade institucional e atores</label><textarea id="dActors" placeholder="Quem decide, quem influencia, competências, incentivos, obstáculos e status..."></textarea></div>
        <div class="field full"><label>Transmissão dos impactos</label><textarea id="dTransmission" placeholder="Decisão → mudança de regra/condição → setores e clientes → exposição do Itaú..."></textarea></div>
        <div class="field full"><label>Impactos diretos e indiretos para o Itaú</label><textarea id="dImpact" placeholder="Operações, custos, receitas, crédito, renda, consumo, clientes, setores..."></textarea></div>
        <div class="field full"><label>Cenários, riscos e oportunidades</label><textarea id="dScenarios" placeholder="Alternativas, condições de ocorrência, riscos e oportunidades..."></textarea></div>
        <div class="field full"><label>Sinais e indicadores</label><textarea id="dSignals" placeholder="O que observar para confirmar, enfraquecer ou revisar a análise..."></textarea></div>
        <div class="field full"><label>Probabilidade / impacto / confiança e justificativa</label><textarea id="dAssessment" placeholder="Não atribuir nota sem evidência. Se houver nota, justificar em separado e indicar horizonte."></textarea></div>
        <div class="field full"><label>Fontes (uma por linha: título | URL)</label><textarea id="dSources" placeholder="Documento oficial | https://...
Relatório interno, p. X | docs/arquivo.pdf"></textarea></div>
        <div class="field full"><label>Motivo da devolução (preenchido por quem revisa)</label><textarea id="dReturn" placeholder="O que precisa mudar antes de publicar. Só é usado com o status Devolvido."></textarea></div>
        <div class="field"><label>Autor / responsável</label><input id="dAuthor" placeholder="Responsável pela análise"></div>
        <div class="field"><label>Próxima revisão</label><input id="dReview" placeholder="DD/MM/AAAA ou gatilho"></div>
      </div>
      <div class="btn-row"><button class="btn orange" type="submit">Salvar dossiê</button><button class="btn secondary" type="button" id="analysisReset">Limpar formulário</button></div>
    </form>
  </div>
  <div id="editorTopic" class="panel hide">
    <form id="topicForm"><input type="hidden" id="editTopicId">
      <div class="form-grid">
        <div class="field full">
          <p class="small muted" style="margin:0">Edita os 5 eixos e os temas transversais (inclusive os subtemas). Para criar um tema novo, deixe o formulário vazio: ele entra como transversal. Mudar o nome curto ou o nome de um subtema desliga os cenários que o citam.</p>
        </div>
        <div class="field"><label>Título do tema</label><input id="tTitle" required placeholder="Ex.: Trabalho e escala 6×1"></div>
        <div class="field"><label>Nome curto (usado nos filtros e nos cenários)</label><input id="tShort" placeholder="Ex.: Trabalho"></div>
        <div class="field"><label>Tipo de efeito (temas transversais)</label><input id="tType" placeholder="Risco, Oportunidade, Misto…"></div>
        <div class="field full"><label>Mini explicação (aparece na lista de temas)</label><textarea id="tDesc" required></textarea></div>
        <div class="field full"><label>O que é este tema (explicação geral)</label><textarea id="tAbout"></textarea></div>
        <div class="field full"><label>Leitura para o Itaú</label><textarea id="tItau"></textarea></div>
        <div class="field full"><label>Subtemas (um por linha: título | como o Itaú pode aproveitar | com o que ter cuidado)</label><textarea id="tSubs" rows="7" placeholder="Escala 6×1 | Setores que reorganizam a jornada podem demandar capital de giro | Debate sem regra aprovada"></textarea></div>
        <div class="field full"><label>Perguntas de investigação (uma por linha)</label><textarea id="tQuestions"></textarea></div>
        <div class="field full"><label>Canais de transmissão (um por linha: caminhos pelos quais a decisão chega ao banco)</label><textarea id="tChannels"></textarea></div>
        <div class="field full"><label>Como aprofundar (um passo por linha)</label><textarea id="tDeepen"></textarea></div>
        <div class="field full"><label>Fontes (uma por linha: título | URL)</label><textarea id="tSources" placeholder="Documento oficial | https://..."></textarea></div>
      </div>
      <div class="btn-row"><button class="btn orange" type="submit">Salvar tema</button><button class="btn secondary" type="button" id="topicReset">Limpar formulário</button></div>
    </form>
  </div>
  <div id="editorAll" class="panel hide">
    <p class="small muted" style="margin:0 0 12px">Aqui você edita todo o resto do site: cenários, riscos, calendário, indicadores, metodologia, fontes, visão executiva, tour, falas da Uly e os textos fixos das telas. Itens da base podem ser editados, ocultados e restaurados; itens novos podem ser criados e excluídos. Atores, dossiês e temas têm abas próprias.</p>
    <div class="field"><label for="kindSel">O que editar</label><select id="kindSel"></select></div>
    <div id="kindList"></div>
    <form id="kindForm" class="hide"></form>
  </div>
  <div id="editorHistory" class="panel hide">
    <p class="small muted" style="margin:0 0 12px">Quem criou, alterou ou excluiu cada registro, e quando. As 100 mudanças mais recentes.</p>
    <div id="historyList"></div>
  </div>
  <div id="editorContent" class="panel hide">
    <div class="editor-layout">
      <div>
        <h3 style="margin-top:0">Registros do editor</h3>
        <div id="editorRecords"></div>
      </div>
      <div>
        <h3 style="margin-top:0">Importar e exportar</h3>
        <p class="muted">Importe perfis e dossiês de um documento <strong>Word (.docx)</strong>, <strong>PDF</strong> ou <strong>texto (.txt)</strong>, ou de uma planilha <strong>CSV</strong> / arquivo <strong>XML</strong>. Cada documento vira um dossiê em elaboração. Os registros são conferidos antes e só então gravados no banco compartilhado. Quem já existe com o mesmo <code>id</code> é atualizado; nada é apagado.</p>
        <div class="btn-row"><label class="btn" for="importFile" style="cursor:pointer">Escolher arquivo</label><input id="importFile" type="file" accept=".docx,.pdf,.txt,.csv,.xml" class="hide"></div>
        <div id="importReport" class="import-report" aria-live="polite"></div>
        <p class="small muted" style="margin-top:14px">Modelos para preencher: <a href="#" data-tpl="csv-actor">CSV de perfis</a> · <a href="#" data-tpl="csv-analysis">CSV de dossiês</a> · <a href="#" data-tpl="xml">XML</a>. Num documento, use linhas <code>Pergunta: …</code>, <code>Evidência: …</code> etc. para preencher cada campo; sem elas, a 1ª linha é o título e o resto é a evidência. Em CSV, várias fontes na mesma célula se separam por <code>;;</code> ou quebra de linha. Sem <code>status</code>, perfil entra como "Em verificação" e dossiê como "Em elaboração".</p>
        <p class="small muted" id="exportMessage"></p>
      </div>
    </div>
  </div>
</section>
`
