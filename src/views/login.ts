/** HTML estático da tela. Montado por src/views/index.ts. */
export const login = /* html */ `
<div class="login-screen" id="loginScreen" role="dialog" aria-label="Entrar no Itaú 360°">
  <form class="login-card" id="loginForm">
    <div class="brand-mark" role="img" aria-label="Itaú 360°">ITAÚ<svg class="logo-dial" aria-hidden="true"><use href="#logo-dial"/></svg></div>
    <div class="brand-sub">INTELIGÊNCIA POLÍTICA · BRASIL</div>
    <p class="login-hint">O acesso é só para contas cadastradas. Leitura vê tudo, inclusive rascunhos; Edição também cria e altera; Revisão aprova e publica. Para pedir uma conta, fale com quem administra o projeto.</p>
    <div class="field"><label for="loginEmail">E-mail</label><input id="loginEmail" type="email" required autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false"></div>
    <div class="field"><label for="loginPassword">Senha</label><input id="loginPassword" type="password" required autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false"><label class="show-pass"><input type="checkbox" id="showPass"> Mostrar senha</label></div>
    <button class="btn orange" type="submit">Entrar</button>
    <div class="login-uly"><img src="/uly/apresentando.png" alt="" width="96" height="96">
      <p id="loginUly"></p>
    </div>
    <div class="login-error" id="loginError" role="alert"></div>
  </form>
</div>
`
