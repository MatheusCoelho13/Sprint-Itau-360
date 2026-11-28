/** HTML estático da tela. Montado por src/views/index.ts. */
export const header = /* html */ `
<div class="p-util">
  <div class="wrap">
 <span class="p-util-note">Versão de demonstração · documentos do Sprint IDP e fontes públicas, referência 11/11/2026.</span>
    <div class="p-util-right"><button class="u-link" id="helpBtn" type="button">Ajuda</button><span id="userEmail" class="user-email"></span><span id="userRole" class="role-chip"></span><button class="u-cta" id="authBtn" type="button">Entrar</button></div>
  </div>
</div>
<header class="p-head">
  <div class="wrap">
    <div class="brand">
      <div class="brand-mark" role="img" aria-label="Itaú 360°">ITAÚ<svg class="logo-dial" aria-hidden="true"><use href="#logo-dial"/></svg></div>
      <div class="brand-sub">INTELIGÊNCIA POLÍTICA · BRASIL</div>
    </div>
    <div class="search"><input id="globalSearch" placeholder="Buscar tema, ator ou análise…" autocomplete="off"></div>
    <div class="date-pill">Atualização de referência · 17 nov. 2026</div>
  </div>
</header>
<nav class="p-nav" aria-label="Seções do site">
  <div class="wrap">
 <button class="pnav active" data-view="home">Visão executiva</button>
 <button class="pnav" data-view="themes">Temas</button>
 <button class="pnav" data-view="scenarios">Cenários</button>
 <button class="pnav" data-view="actors">Atores</button>
 <button class="pnav" data-view="risks">Riscos e oportunidades</button>
 <button class="pnav" data-view="monitor">Sinais</button>
 <button class="pnav" data-view="planalto">Planalto</button>
 <button class="pnav" data-view="method">Metodologia</button>
 <button class="pnav" data-view="sources">Fontes</button>
 <button class="pnav" data-view="guide">Guia</button>
 <span class="p-nav-admin hide" id="navEditor"><button class="pnav" data-view="editor">Área editorial</button><button class="pnav hide" id="navUsers" data-view="users">Usuários</button></span>
</div>
</nav>
<span id="crumbName" hidden>Visão executiva</span>
`
