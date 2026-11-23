# Itaú 360° — Contexto de design

> Wireframes da primeira rodada. Onde divergir (login, hero, temas transversais, selos dos cenários), vale o `context.md` (seção "Identidade visual").

Plataforma de **inteligência política** (Sprint IDP): mostra como decisões do governo eleito (mandato 2027–2030, primeiros 100 dias) chegam ao funding, ao crédito e aos clientes do Itaú. Cada afirmação traz fonte e diz se é **fato**, **nome cotado** ou **hipótese**.

Stack: Vite + TypeScript + Supabase (SPA de 9 "views" em `index.html`, sem router). Site abre **sem login** (somente leitura); login só para a Área editorial.

---

## 1. Funcionalidades

| Área | O que faz |
|---|---|
| Navegação | Sidebar azul com 9 itens em 3 grupos, numerados `01–09`. Breadcrumb no topo. |
| Busca global | Campo no topbar: tema, ator ou análise. |
| Radar 360° | SVG da home com 5 eixos clicáveis (Fiscal, Tributária, Produtivo, Tecnologia, Infra) → abre o tema. |
| Temas | 5 eixos oficiais + 6 temas transversais + dossiês publicados pela equipe. Detalhe: perguntas, canais de impacto no Itaú, fontes. |
| Cenários | A, B, C (qualitativos, **sem % inventado**) + combinações (A+C, B+C). |
| Atores | 9 perfis com foto (P&B → cor no hover), cargo, grupo, status datado, bio, relevância, fontes. Filtro por grupo + busca. |
| Riscos | Tabela Risco / Oportunidade / Misto com canal de impacto, estado e fonte. Filtro + busca. Escala P×I (1–5) e confiança separada. |
| Monitor | Variáveis dos cenários, calendário, indicadores por dimensão, pontos a verificar. |
| Metodologia | Fluxo em 6 etapas, 6 instrumentos, explicação do dossiê, 5 perguntas obrigatórias. |
| Fontes | Docs internos (`public/docs`) + fontes públicas datadas. |
| Área editorial | Login Supabase. Criar/editar perfil de ator, dossiê analítico, listar registros, exportar/importar JSON (upsert). Dossiê só aparece ao público se status = `Publicado`. |
| Uly (mascote) | Assistente flutuante com balão de fala e pose por página; reage a busca vazia etc. |
| Modal | Detalhes de fonte/registro em overlay. |

**Modelo de transmissão** (aparece na home): `Decisão política → Regra / condição econômica → Empresas e famílias → Exposição do banco`.

---

## 2. Cores

### Tokens (`src/style.css`)

| Token | Hex | Uso |
|---|---|---|
| `--paper` | `#f4f0e8` | Fundo da página (papel quente) |
| `--card` | `#fdfbf7` | Painéis, cards, notices |
| `--ink` | `#161d2e` | Texto, réguas |
| `--muted` | `#586174` | Texto secundário, labels |
| `--blue` | `#0a2a6e` | Sidebar, hero, botão padrão, logo |
| `--blue-2` | `#1d4690` | Hover, links, badge azul |
| `--orange` | `#ec7000` | **Sinal**: régua do hero, marcador ativo, botão primário, "360" |
| `--orange-ink` | `#a64a00` | Laranja legível em texto |
| `--line` | `#d8d1c3` | Bordas e divisores |
| `--red` | `#9d3328` | Risco, erro, botão perigo |
| `--green` | `#2c6a4c` | Oportunidade, "links de origem" |
| `--gold` | `#8f6310` | Badge "Acompanhar", "Matriz em atualização" |

Extras: texto na sidebar `#d6ddee`, labels `#8d9cc3`, subtítulo `#a9b6d6`, item ativo `#ffb878`, overlay modal `rgba(10,22,52,.55)`.

**Regras:** laranja nunca em texto pequeno · sem sombras · cantos quase retos (`3px`; botões `10px`) · números e rótulos em mono.

### Semântica

| Cor | Significado |
|---|---|
| Vermelho | Risco |
| Verde | Oportunidade / fonte confirmada |
| Dourado | Acompanhar / em atualização |
| Azul | Regulatório / informativo |
| Laranja | Destaque, ação primária, versão preliminar |

### Tipografia

- Títulos e números grandes: **Newsreader** (serif, 400–500)
- Corpo/UI: **IBM Plex Sans** (400–700), base 15px/1.6
- Rótulos, badges, datas, índice: **IBM Plex Mono** (UPPERCASE, letter-spacing ~1px)

### Componentes

| Componente | Estilo |
|---|---|
| Botão primário `.btn.orange` | Fundo laranja, texto `#1a0d00`, bold, 12×24px |
| Botão padrão `.btn` | Fundo azul, texto branco |
| Botão secundário | Contorno azul, transparente |
| Botão perigo | Contorno vermelho |
| Badge | Mono 10.5px caps + quadradinho 7×7 na cor |
| Notice | Fundo card, borda esquerda 3px (laranja padrão · azul · vermelha) |
| Painel | Fundo card, borda 1px `--line`, sem sombra |
| Hero | Azul, borda superior 4px laranja, título serif branco |
| Logo | "ITAÚ" bold branco + dial 360° (anel + arco laranja) |

---

## 3. Páginas — ícone, mascote e boneco

Ícones são glifos Unicode (já no HTML como `.ico`, hoje ocultos por CSS — a sidebar mostra o número `01–09`). Para o novo design, usar o ícone ao lado do número ou trocar por SVG equivalente.

### Layout base (todas as páginas)

```
┌────────────┬──────────────────────────────────────────────┐
│ ITAÚ (360) │ Itaú 360° / Página atual   [🔍 Buscar…] [data]│  ← topbar
│ INTELIG.…  ├──────────────────────────────────────────────┤
│            │                                              │
│ INTELIGÊN. │            CONTEÚDO (max 1360px)             │
│ 01 Visão   │                                              │
│ 02 Temas   │                                              │
│ 03 Cenár.  │                                              │
│ 04 Atores  │                                              │
│ ANÁLISE…   │                                              │
│ 05 Riscos  │                                              │
│ 06 Sinais  │                                              │
│ 07 Método  │                                              │
│ 08 Fontes  │                                       ┌────┐ │
│ GESTÃO     │                                       │Uly │ │ ← mascote
│ 09 Editor  │                                       └────┘ │
│ ──────     │                                              │
│ Visitante  │                                              │
│ [Entrar]   │                                              │
└────────────┴──────────────────────────────────────────────┘
 sidebar 272px, azul                       fundo papel
 (mobile: vira barra horizontal, item ativo com sublinhado laranja)
```

---

### 3.0 Login (overlay) · mascote: —

Abre ao clicar em "Entrar" / "Área editorial". Dá para fechar com "Continuar sem entrar".

```
        ┌───────────────────────────┐
        │ ITAÚ (360)                │
        │ INTELIGÊNCIA POLÍTICA·BR  │
        │ Entre para criar e editar │
        │ E-mail  [______________]  │
        │ Senha   [______________]  │
        │ [      ENTRAR (laranja) ] │
        │ [ Continuar sem entrar ]  │
        │ ⚠ erro (vermelho)         │
        └───────────────────────────┘
```

---

### 3.1 Visão executiva — ícone `▦` — Uly: **apresentando**

```
┌──────────────────────────────────────────────────────────┐
│▀▀▀▀▀▀▀▀▀▀▀▀▀▀ borda laranja 4px ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀│
│ HERO AZUL                                                │
│ ELEIÇÃO 2026 · MANDATO 2027–2030          ╭───────────╮  │
│ Da decisão política ao                    │  RADAR    │  │
│ impacto sobre o negócio.                  │  360°     │  │
│ texto explicativo…                        │ 5 eixos ● │  │
│ relógio                                   ╰───────────╯  │
├──────────┬──────────┬──────────┬──────────┤
│ EIXOS    │ CENÁRIOS │ PERFIS   │ MÉTODOS  │  ← 4 métricas
│ 05       │ 03       │ 09       │ 08+      │
├──────────┴──────────┴──────────┴──────────┘
│ Prioridades de acompanhamento     [Ver todos os temas →]│
│ ┌──────────────────────────────────────────────────────┐│
│ │ Credibilidade fiscal …                    ◼ ACOMPANHAR││
│ │ Reforma tributária (CBS/IBS) …            ◼ REGULATÓRIO││
│ │ Governabilidade …                         ◼ INSTITUC. ││
│ │ Investimento produtivo …                  ◼ OPORTUN.  ││
│ └──────────────────────────────────────────────────────┘│
│ Como a análise chega ao Itaú                             │
│ [Decisão]→[Regra]→[Empresas/famílias]→[Exposição banco]  │
│ ▌ Nota de integridade (borda azul)                       │
└──────────────────────────────────────────────────────────┘
```

---

### 3.2 Temas de análise — ícone `◈` — Uly: **feliz**

```
┌──────────────────────────────────────────────────────────┐
│ Temas de análise                     ◼ 5 EIXOS OFICIAIS  │
│ descrição…                                               │
│ ┌─────────────────────┐ ┌─────────────────────┐          │
│ │ 01 Fiscal e orçam.  │ │ 02 Tributária       │          │
│ │ desc…         [abrir]│ │ desc…        [abrir]│          │
│ ├─────────────────────┤ ├─────────────────────┤          │
│ │ 03 Produtivo        │ │ 04 Tecnologia       │          │
│ ├─────────────────────┤ └─────────────────────┘          │
│ │ 05 Infra/energia    │                                  │
│ └─────────────────────┘                                  │
│ Dossiês publicados pela equipe   (grid 2 col, dinâmico)  │
│ Temas transversais               (grid 3 col, 6 cards)   │
│ ┌ DETALHE DO TEMA (ao clicar) ───────────────────────────┐│
│ │ Perguntas de investigação · Canais p/ Itaú · Fontes    ││
│ └────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

---

### 3.3 Cenários 100 dias — ícone `⌁` — Uly: **analisando**

```
┌──────────────────────────────────────────────────────────┐
│ Cenários para os primeiros 100 dias  ◼ PRELIMINAR 11/11  │
│ ▌ Aviso: sem probabilidades numéricas sem evidência      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│ │ A        │ │ B        │ │ C        │                   │
│ │ Ajuste   │ │ Sem      │ │ Governa- │                   │
│ │ fiscal   │ │ ajuste   │ │ bilidade │                   │
│ │ crível   │ │          │ │ travada  │                   │
│ │──────────│ │──────────│ │──────────│                   │
│ │ tipo  ver│ │ tipo  ver│ │ tipo  ver│                   │
│ └──────────┘ └──────────┘ └──────────┘                   │
│ ┌ DETALHE: definição · sinais · apoio · resistência ·    │
│ │          impacto Itaú · clientes · fontes ┐            │
│ Combinações possíveis                                    │
│ ┌ A + C · Ajuste anunciado, tramitação lenta ┐ ┌ B + C ┐ │
└──────────────────────────────────────────────────────────┘
```

---

### 3.4 Mapa de atores — ícone `♙` — Uly: **apresentando**

```
┌──────────────────────────────────────────────────────────┐
│ Atores e instituições                  ◼ PERFIS C/ REFER.│
│ [🔍 Buscar ator…] [Todos os grupos ▾]   9 resultados     │
│ ┌────────────────┬────────────────┬────────────────┐     │
│ │ ┌────┐ Lula    │ ┌────┐ Flávio  │ ┌────┐ Dario   │     │
│ │ │foto│ cargo   │ │foto│ cargo   │ │foto│ cargo   │     │
│ │ └────┘ ◼status │ └────┘ ◼status │ └────┘ ◼status │     │
│ ├────────────────┼────────────────┼────────────────┤     │
│ │ Rafael         │ Camilo         │ Haddad         │     │
│ ├────────────────┼────────────────┼────────────────┤     │
│ │ Boulos         │ Messias        │ Pacheco        │     │
│ └────────────────┴────────────────┴────────────────┘     │
│  foto 76×94, P&B → cor no hover                          │
│ ┌ DETALHE: foto 170×206 | nome, cargo, bio, relevância,  │
│ │          fontes, crédito da foto ┐                     │
│ ▌ Nota: nome cotado ≠ nomeação (borda azul)              │
└──────────────────────────────────────────────────────────┘
```

Grupos: Executivo · Legislativo · Judiciário / controle · Oposição (+ Reguladores, Setor privado no editor).

---

### 3.5 Riscos e oportunidades — ícone `▤` — Uly: **medo**

```
┌──────────────────────────────────────────────────────────┐
│ Riscos e oportunidades              ◼ MATRIZ EM ATUALIZ. │
│ [🔍 Buscar evento…] [Risco e oportunidade ▾]             │
│ ┌──────────────────────────────────────────────────────┐ │
│ │EVENTO      │TIPO     │CANAL    │ESTADO     │FONTE    │ │
│ │────────────┼─────────┼─────────┼───────────┼─────────│ │
│ │Credib. fisc│◼ RISCO  │Juros…   │Qualitat.  │link     │ │
│ │CBS/IBS     │◼ MISTO  │Custos…  │Em impl.   │link     │ │
│ │Minerais    │◼ OPORT. │Project… │Condicion. │link     │ │
│ │… (10 linhas)                                         │ │
│ └──────────────────────────────────────────────────────┘ │
│ Como interpretar a matriz                                │
│ [Probabilidade 1–5] [Impacto 1–5] [Confiança B/M/A]      │
│ ▌ P×I ordena prioridade; não é perda financeira          │
└──────────────────────────────────────────────────────────┘
```

Cores do tipo: Risco = vermelho · Oportunidade = verde · Misto = dourado.

---

### 3.6 Sinais e indicadores — ícone `◷` — Uly: **analisando**

```
┌──────────────────────────────────────────────────────────┐
│ Sinais e indicadores              ◼ MONITORAMENTO CONTÍNUO│
│ ┌ Variáveis dos cenários ─┐ ┌ Calendário de referência ─┐│
│ │ Credibilidade fiscal    │ │ │ NOV–DEZ 2026            ││
│ │ Equipe econômica        │ │ ■ transição…              ││
│ │ Governabilidade         │ │ ■ 5 JAN 2027 posse        ││
│ │ Política monetária      │ │ ■ JAN 2027 CBS            ││
│ │ Agenda tributária       │ │ ■ FEV–MAR tramitação      ││
│ │ Amb. institucional      │ │ ■ ~15 ABR balanço 100 dias││
│ └─────────────────────────┘ └───────────────────────────┘│
│ Painel de indicadores por dimensão                       │
│ [Fiscal][Monetário][Crédito e banco]                     │
│ [Famílias/empresas][Capital][Externo e tecnologia]       │
│ Pontos ainda a verificar                                 │
│ ┌ • item • item • item (7 lacunas) ┐                     │
└──────────────────────────────────────────────────────────┘
```

Timeline: linha vertical 2px, marcador quadrado laranja.

---

### 3.7 Metodologia — ícone `⌘` — Uly: **feliz**

```
┌──────────────────────────────────────────────────────────┐
│ Metodologia de análise          ◼ METODOLOGIA DO SPRINT  │
│ ┌ Fluxo analítico em seis etapas ────────────────────────┐│
│ │ 1 Histórico político                                   ││
│ │ 2 Evidências atuais                                    ││
│ │ 3 Tendências e incertezas                              ││
│ │ 4 Cenários prospectivos                                ││
│ │ 5 Impactos para o Itaú                                 ││
│ │ 6 Monitoramento                                        ││
│ └────────────────────────────────────────────────────────┘│
│ Instrumentos: [Matriz CSD][Mapa empatia][Pesq. histórica] │
│               [Mapeamento atores][Benchmarking][Cenários] │
│ O que é o dossiê analítico?                              │
│ ┌ [1 Identificação] [2 Contexto] [3 Transmissão] [4 Aval.]┐│
│ Perguntas obrigatórias em cada cenário  (1–3 | 4–5)      │
└──────────────────────────────────────────────────────────┘
```

---

### 3.8 Fontes e documentos — ícone `↗` — Uly: **analisando**

```
┌──────────────────────────────────────────────────────────┐
│ Fontes e documentos                  ◼ LINKS DE ORIGEM   │
│ Documentos internos do projeto                           │
│ ┌ 📄 Relatório Sprint …                    [abrir ↗]     │
│ │ 📄 Cenários 100 dias · 📄 Roteiro · 📄 Apresentação …  │
│ Fontes públicas (perfis)                                 │
│ ┌ TSE · Fazenda · Senado · Câmara · notícias com data … ┐│
│ ▌ Ter fonte ≠ confirmado: registrar trecho e data        │
└──────────────────────────────────────────────────────────┘
```

---

### 3.9 Área editorial — ícone `✎` — Uly: **feliz** — exige login

```
┌──────────────────────────────────────────────────────────┐
│ Área editorial                    ◼ EDITOR · AUTENTICADO │
│ ▌ Registros salvos no Supabase, compartilhados           │
│ [Novo perfil de ator]│ Novo dossiê │ Conteúdos cadastrados│
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  (aba ativa: sublinhado laranja)         │
│ ┌ Aba 1 — Perfil ────────────────────────────────────────┐│
│ │ Nome [____]        Cargo [____]                        ││
│ │ Grupo [▾]          Status [▾]                          ││
│ │ Biografia [__________________________]                ││
│ │ Relevância [_________________________]                ││
│ │ URL foto [____]    Crédito foto [____]                 ││
│ │ Fontes (título | URL, uma por linha) [___]             ││
│ │ Data/obs [____]                                        ││
│ │ [SALVAR PERFIL]  [Limpar formulário]                   ││
│ └────────────────────────────────────────────────────────┘│
│ Aba 2 — Dossiê: título, eixo, status, tipo de efeito,    │
│   pergunta, evidências, atores, transmissão, impacto,    │
│   cenários, sinais, avaliação P/I/confiança, fontes,     │
│   autor, próxima revisão                                 │
│ Aba 3 — Lista de registros (editar/excluir) +            │
│   [Exportar JSON] [Importar JSON]                        │
└──────────────────────────────────────────────────────────┘
```

Status do dossiê: Em elaboração · Em revisão · **Publicado** · Arquivado. Tipo: Risco · Oportunidade · Misto · Monitoramento.

---

## 4. Mascote Uly

Assistente de cenários e riscos. PNGs em `public/uly/`: `apresentando`, `feliz`, `triste`, `analisando`, `medo`, `raiva` (usadas) + `dormindo`, `entediada` (existem, sem uso). Fica no canto inferior direito com balão de fala; a pose muda por página (ver títulos acima). Cada clique mostra a próxima dica. Não fala porcentagem sem evidência.

## 5. Dados (Supabase)

- `actors(id, record jsonb, is_override, created_by, created_at, updated_at)`
- `analyses(id, record jsonb, created_by, created_at, updated_at)`
- RLS: anônimo lê atores e só dossiês `Publicado`; autenticado lê/escreve tudo.
- Papéis (leitor/editor) e auditoria **ainda não existem**.

## 6. Ressalvas de conteúdo (manter no design)

- Sem probabilidade numérica sem evidência.
- Nome cotado ≠ nomeação; distinguir cargo confirmado, notícia e hipótese.
- Fotos têm crédito + link; conferir direitos antes de publicar.
- Versão de demonstração; referência documental principal 11/11/2026, atualização 17/11/2026.
