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
- **Paleta:** papel `#f4f0e8`, azul Itaú `#0a2a6e`, laranja `#ec7000`. As cores são da marca; o papel quente é escolha do projeto. Laranja só como sinal (marcadores, 360°), nunca em texto pequeno.
- **Tipos:** Newsreader (títulos), IBM Plex Sans (corpo), IBM Plex Mono (rótulos e números). Sem sombras, cantos quase retos.
- **O selo diz o grau de certeza:** quadrado cheio = fato; quadrado vazado = hipótese ou a verificar. Cartões de ator com hipótese têm borda tracejada. É a decisão visual mais específica do produto; não trocar por cor decorativa.
- **Radar dos 5 eixos** no hero é navegação (cada eixo abre um tema). O polígono é regular de propósito, não representa dado. Sem animação de varredura.
- **Ritmo variado de propósito:** eixos como índice numerado (`#themeGrid`), indicadores e instrumentos como lista nome | explicação, cenários e atores como cartões. Não voltar tudo para grade de cartões iguais.
- **Uly:** arte própria do grupo. Só fala ao trocar de tela ou ao ser clicada; balão some em 7 s. `.content` tem 190px de folga embaixo para ela não cobrir o fim da página.
- Cabeçalhos de página sem "eyebrow": o breadcrumb do topo já diz onde o leitor está.

## Revisão "honest-eye" (23/11/2026)
Veredicto: **MISTO, com base autoral**. Radar, sistema de selos, fonte em cada afirmação e a mascote não são de template. O que ainda lembrava saída de IA e foi mexido:
- Grade de cartões idênticos em eixos, indicadores e instrumentos → índice numerado e listas.
- Faixa de 4 cartões de métrica ("08+" sem sentido) → faixa única com divisórias.
- Hero com trio de selos genéricos e copy sobre "ambiente de inteligência" → frase que diz o que o site faz + contagem real até a posse (5/1/2027).
- Radar com varredura infinita sem função → removida.
- Caixa "Como usar o Itaú 360°" (5 passos óbvios) → removida.
- **Bug de conteúdo:** perfis "não confirmado/a" apareciam com selo verde (a string contém "confirm"). Agora hipótese é testada primeiro (`ui.ts`, `renderActors`).

Segunda rodada: aberturas das 8 telas reescritas para dizer algo (ex.: cenários "partem de uma pergunta: o pacote fiscal sai cedo ou não?"); "Combinações possíveis" virou lista com a chave A+C / B+C como título; matriz P×I virou lista nome | explicação; métrica "08+" trocada por "06 instrumentos" (confere com `methodTools`); tipo "Misto" passou de dourado para azul, porque o quadrado vazado só pode significar hipótese/a verificar.

Ainda pendente: Newsreader + Plex é combinação muito comum em design "editorial" (não trocado de propósito, para não virar outro clichê); badges dos cenários A/B/C usam cor de tom, embora todos sejam hipóteses.

## Pendências conhecidas
- Fotografias vêm de páginas externas (Wikimedia, Metrópoles, iG…). Conferir direitos antes de publicar fora da faculdade.
- Valores tributários (CBS 11,3%, setor financeiro 10,85% em 2027) estão em `pending` como não verificados.
- Papéis de usuário (leitor/editor) e log de auditoria não existem.
- Importar JSON faz upsert e não apaga registros.
- O dev server (`npm run dev`) não aplicou o CSS na aba controlada pela automação do Chrome; o build de produção renderiza normal. Se acontecer no seu navegador, testar com `npx vite preview`.
