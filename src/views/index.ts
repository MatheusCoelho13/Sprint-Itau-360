import { sprite } from './sprite'
import { login } from './login'
import { header } from './header'
import { home } from './home'
import { themes } from './themes'
import { scenarios } from './scenarios'
import { actors } from './actors'
import { risks } from './risks'
import { monitor } from './monitor'
import { planalto } from './planalto'
import { method } from './method'
import { sources } from './sources'
import { guide } from './guide'
import { users } from './users'
import { editor } from './editor'
import { mascot } from './mascot'
import { modal } from './modal'

/** Ordem das telas = ordem do menu. Cada uma é um arquivo em src/views/. */
const views = [home, themes, scenarios, actors, risks, monitor, planalto, method, sources, guide, users, editor]

/** Monta a página inteira dentro do <body>. Tem de rodar antes de qualquer módulo que procure elementos (ver o 1º import de main.ts). */
document.body.insertAdjacentHTML('afterbegin', `
${sprite}
${login}
<div class="app" id="appShell">
${header}
<main class="main">
  <div class="content wrap">
${views.join('\n')}
  </div>
</main>
${mascot}
</div>
${modal}
`)
