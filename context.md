# Itaú 360° — contexto do projeto

Trabalho de sprint (faculdade, IDP). Site de inteligência política: o que o governo eleito em 2026 (Lula, mandato 2027–2030) pode fazer nos primeiros 100 dias e como isso chega ao Itaú (funding, crédito, clientes). Leitor-alvo: quem decide dentro do banco. Conteúdo vem dos PDFs/DOCX em `public/docs/` e de fontes públicas linkadas.

## Stack e como rodar
- Vite 5 + TypeScript, sem framework. HTML estático em `index.html`, telas montadas por template string em `src/ui.ts`.
- Supabase (auth + tabelas `actors`, `analyses`, schema em `supabase/schema.sql`). Sem `.env` o site funciona só com o conteúdo base de `src/data.ts` (aviso no console, normal).
- `npm run dev` (desenvolvimento) · `npm run build` (tsc + vite build) · `npx vite preview`.
- Leitura é pública (só dossiês "Publicado"). Editar exige login. Qualquer usuário autenticado edita; ainda não há papéis nem auditoria.

## Mapa dos arquivos
| Arquivo | Papel |
|---|---|
| `index.html` | casca, login, sidebar, as 9 telas (`#view-*`), radar SVG do hero |
| `src/main.ts` | auth, navegação, eventos, relógio da posse (`heroClock`) |
| `src/ui.ts` | renderização de temas, cenários, atores, riscos, modal de dossiê |
| `src/data.ts` | todo o conteúdo estático: `SRC` (fontes), temas, cenários, atores, riscos |
| `src/editor.ts` / `store.ts` | área editorial e acesso ao Supabase com cache |
| `src/mascot.ts` | Uly, a mascote-guia (poses em `public/uly/`) |
| `src/style.css` | todo o CSS, tokens em `:root` |
| `legacy/index.html` | versão original em arquivo único (localStorage), só referência |

## Regra editorial (o coração do produto)
Toda afirmação tem fonte e um grau de certeza. Três níveis, nunca misturados:
1. **Fato documentado** (cargo oficial, resultado do TSE).
2. **Nome cotado / noticiado** (ex.: Rafael Fonteles na Fazenda).
3. **Hipótese** (cenários A/B/C).

Sem probabilidade numérica inventada: os cenários usam "plausibilidade qualitativa". Itens sem fonte confiável vão para "Pontos ainda a verificar". Não afirmar posição de ator sem declaração ou voto documentado.

## Identidade visual (decisões, para não regredir)
- **Paleta (v3, 23/11/2026):** página branca `#fff`, tinta `#0b1220`, azul Itaú `#0a2a6e`, laranja `#ec7000` só como sinal (nº do menu, posse, topo do hero, logo). O papel creme `#f4f0e8` foi abandonado: creme + serifa + mono em caixa-alta é a cara mais comum de interface gerada. Estrutura vem de réguas de tinta (3px nas seções, 8px no topo de cada página), não de caixas de borda fina.
- **Tipos (v3):** Archivo Narrow nos títulos e na interface (sans estreita, de jornal econômico); Source Serif 4 no texto corrido; IBM Plex Mono só para dado (datas, D0/D100, página citada). Nada de rótulo pequeno em caixa-alta com tracking. Cada título de página leva o folio grande (02–09) igual ao número do menu, via `data-n` em `.page-head`. Sem sombras, cantos retos (2px em botões/campos).
- **O selo diz o grau de certeza:** quadrado cheio = fato; quadrado vazado = hipótese ou a verificar. Cartões de ator com hipótese têm borda tracejada. É a decisão visual mais específica do produto; não trocar por cor decorativa.
- **Radar dos 5 eixos** no hero é navegação (cada eixo abre um tema). O polígono é regular de propósito, não representa dado. Sem animação de varredura.
- **Ritmo variado de propósito:** eixos como índice numerado (`#themeGrid`), indicadores e instrumentos como lista nome | explicação, cenários e atores como cartões. Não voltar tudo para grade de cartões iguais.
- **Uly:** arte própria do grupo. No desktop mora na barra lateral, com área reservada para o balão (não cobre menu nem conteúdo); no celular flutua no canto e `.content` mantém 170px de folga. Só fala ao trocar de tela ou ao ser clicada; balão some em 7 s ou ao toque.
- Cabeçalhos de página sem "eyebrow": o breadcrumb do topo já diz onde o leitor está.
- **O quadrado do selo é só grau de certeza** (v3: sem cor, só forma; ink cheio/vazado) (cheio = documentado, vazado = hipótese/a verificar). Categoria (risco, oportunidade, misto, área) usa `.tag`: texto mono colorido, sem quadrado. Cenários A/B/C são hipóteses: selo vazado nos três, azul único, só a letra os diferencia. Não voltar a colorir A/B/C.
- **Régua dos 100 dias** (`dayRule` em `ui.ts`, Sinais e hero): ancorada na posse de 5/1/2027, posições em % calculadas de datas reais, "hoje" calculado. Sólido = fato (só a posse); tracejado/vazado = calendário preliminar. Não é decoração: se mudar a data da posse, mude `POSSE`. Tem `aria-label` com o resumo.
- **Faixa de certeza** em Atores (`#certStrip`): um quadrado por perfil, mesma regra do selo (`isHyp` em `ui.ts`, usada no cartão, no detalhe e na faixa).
- **Sem ornamento sem dado:** a régua de tracinhos dos cabeçalhos e os rótulos de cabeçalho que não diziam grau de certeza foram removidos. Ficam só "Versão preliminar" (Cenários) e "Matriz em atualização" (Riscos).
- **Ritmo:** escala de espaço irregular em `:root` (`--s-1..--s-6`: 6, 12, 20, 34, 56, 92). Blocos densos usam `.tight`, respiros usam `.breath` em `.section-title`. Temas transversais são lista (tipo | tema | explicação), não grade de 3 cartões.
- **Forma:** sem sombra e sem gradiente decorativo. A única textura é a hachura (`--hatch`), que significa incerteza: cenários e perfis não confirmados ficam em caixa tracejada hachurada; letras A/B/C são vazadas. Caixa cheia de 2px = documentado. Borda de campo `--edge`.
- **Foco:** azul `#0a2a6e` sobre papel (11:1), branco sobre sidebar e hero. O laranja dava 2,7:1 e reprovava 3:1; não usar laranja como foco.
- **Movimento:** troca de tela é fade de 160 ms; nada de quique, overshoot ou loop. Uly sem animação contínua; toque no balão o dispensa. `prefers-reduced-motion` desliga tudo, inclusive a rolagem suave (`motion()` em `ui.ts`).
- **Celular (≤760px):** alvos de 44px, tabela de riscos vira lista rotulada (`data-l` nas células), `.content` mantém 170px de folga para a Uly, régua escalona rótulos.
- **Tipografia:** o par Newsreader + Plex foi trocado na v3 (ver acima). Ao mexer, testar numerais e a legibilidade de Archivo Narrow em 14px (rótulos) e 15px (menu).

## Revisão "honest-eye" (23/11/2026)
Veredicto: **MISTO, com base autoral**. Radar, sistema de selos, fonte em cada afirmação e a mascote não são de template. O que ainda lembrava saída de IA e foi mexido:
- Grade de cartões idênticos em eixos, indicadores e instrumentos → índice numerado e listas.
- Faixa de 4 cartões de métrica ("08+" sem sentido) → faixa única com divisórias.
- Hero com trio de selos genéricos e copy sobre "ambiente de inteligência" → frase que diz o que o site faz + contagem real até a posse (5/1/2027).
- Radar com varredura infinita sem função → removida.
- Caixa "Como usar o Itaú 360°" (5 passos óbvios) → removida.
- **Bug de conteúdo:** perfis "não confirmado/a" apareciam com selo verde (a string contém "confirm"). Agora hipótese é testada primeiro (`ui.ts`, `renderActors`).

Segunda rodada: aberturas das 8 telas reescritas para dizer algo (ex.: cenários "partem de uma pergunta: o pacote fiscal sai cedo ou não?"); "Combinações possíveis" virou lista com a chave A+C / B+C como título; matriz P×I virou lista nome | explicação; métrica "08+" trocada por "06 instrumentos" (confere com `methodTools`); tipo "Misto" passou de dourado para azul, porque o quadrado vazado só pode significar hipótese/a verificar.

Terceira rodada (honest-eye, 23/11/2026): badges dos cenários A/B/C viraram hipótese vazada (resolvido); régua dos 100 dias, faixa de certeza e lista de transversais; foco, alvos de 44px, tabela de riscos no celular e Uly sem loop; abertura da home reescrita; "Verificação pendente" ×7 virou o texto do próprio item. Newsreader + Plex mantidos de propósito (ver Identidade visual).

## Pendências conhecidas
- Área editorial: o formulário só foi conferido visualmente (sem login/`.env`); testar com Supabase real depois das mudanças de raio e foco.
- Sem `.env` o primeiro render do conteúdo-base agora é imediato; antes levava ~10 s (chamada ao Supabase falhando).
- Dossiê de ator: ainda não há ligação ator → impacto no Itaú (os dados só têm `relevance` em texto livre).
- Fotografias vêm de páginas externas (Wikimedia, Metrópoles, iG…). Conferir direitos antes de publicar fora da faculdade.
- Valores tributários (CBS 11,3%, setor financeiro 10,85% em 2027) estão em `pending` como não verificados.
- Papéis de usuário (leitor/editor) e log de auditoria não existem.
- Importar JSON faz upsert e não apaga registros.
- O dev server (`npm run dev`) não aplicou o CSS na aba controlada pela automação do Chrome; o build de produção renderiza normal. Se acontecer no seu navegador, testar com `npx vite preview`.
