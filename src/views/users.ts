/** HTML estático da tela. Montado por src/views/index.ts. */
export const users = /* html */ `
<section class="view" id="view-users">
  <div class="page-head">
    <div>
      <p class="kicker">Gestão do conteúdo</p>
      <h1>Usuários e acesso</h1>
      <p>Quem lê, quem edita e quem administra. Só admin vê esta tela; as regras abaixo valem no banco, não só aqui.</p>
    </div>
  </div>
  <div class="u-summary" id="usersSummary"></div>
  <div class="notice hide" id="userMsg" role="alert"></div>
  <div class="filterbar"><input id="userSearch" placeholder="Buscar por e-mail…" autocomplete="off"><select id="userRoleFilter"><option value="all">Todos os papéis</option><option value="admin">Admin</option><option value="editor">Editor</option><option value="observador">Observador</option></select><select id="userStateFilter"><option value="all">Ativos e inativos</option><option value="on">Só ativos</option><option value="off">Só inativos</option></select><span class="small muted" id="userCount"></span></div>
  <div class="panel table-wrap">
    <table class="data-table u-table">
      <thead>
        <tr>
          <th>Usuário</th>
          <th>Papel</th>
          <th>Situação</th>
          <th>Conta criada</th>
        </tr>
      </thead>
      <tbody id="userRows"></tbody>
    </table>
  </div>
  <div class="u-cols">
    <div>
      <div class="section-title tight">
        <div>
          <h2>O que cada papel pode</h2>
        </div>
      </div>
      <table class="data-table matrix">
        <thead>
          <tr>
            <th></th>
            <th>Leitura</th>
            <th>Edição</th>
            <th>Revisão</th>
            <th>Administração</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ler conteúdo publicado e rascunhos</td>
            <td>Sim</td>
            <td>Sim</td>
            <td>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td>Criar, editar e apagar conteúdo</td>
            <td class="no">—</td>
            <td>Sim</td>
            <td class="no">—</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td>Importar JSON, CSV e XML</td>
            <td class="no">—</td>
            <td>Sim</td>
            <td class="no">—</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td>Aprovar (publicar) ou devolver dossiê</td>
            <td class="no">—</td>
            <td class="no">—</td>
            <td>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td>Gerenciar usuários e papéis</td>
            <td class="no">—</td>
            <td class="no">—</td>
            <td class="no">—</td>
            <td>Sim</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <div class="section-title tight">
        <div>
          <h2>Regras de acesso</h2>
        </div>
      </div>
      <ol class="u-rules">
        <li>Conta nova entra com o papel <b>Leitura</b>.</li>
        <li>Quem edita não publica: ficha publicada que é editada volta para <b>revisão</b>; só Revisão e Administração publicam.</li>
        <li>Só <b>Administração</b> muda papel e situação.</li>
        <li>Ninguém altera o próprio papel nem se desativa; assim sempre sobra um admin.</li>
        <li><b>Desativar não apaga</b>: a pessoa mantém a conta, mas deixa de ler o conteúdo.</li>
        <li>Toda mudança de papel ou situação é registrada abaixo.</li>
        <li>Contas novas nascem no Supabase (Authentication &gt; Users); aqui se administra quem já existe.</li>
      </ol>
    </div>
  </div>
  <div class="section-title">
    <div>
      <h2>Últimas alterações</h2>
      <p>As dez mais recentes.</p>
    </div>
  </div>
  <ul class="u-audit" id="auditList"></ul>
</section>
`
