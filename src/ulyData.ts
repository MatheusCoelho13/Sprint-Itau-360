// Falas-base da Uly (dicas e curiosidades por tela). O que o site usa vem de content.ts, onde tudo é editável.
export type Mood = 'apresentando' | 'feliz' | 'triste' | 'dormindo' | 'analisando' | 'entediada' | 'raiva' | 'medo'
export const TIPS: Record<string, { mood: Mood; tips: string[] }> = {
  home: { mood: 'apresentando', tips: ['Comece pelos cinco eixos ao lado do título.', 'Use a busca para achar atores e temas.', 'A régua mostra quantos dias faltam para a posse (5/1/2027).'] },
  themes: { mood: 'feliz', tips: ['São 5 eixos de análise. Abra um para ver o dossiê.', 'No dossiê, cada subtema diz como o Itaú pode aproveitar (verde) e com o que ter cuidado (laranja).', 'Filtre os cenários do tema por subtema e por natureza: positivos, negativos, neutros, oportunidades, riscos e pontos de atenção.', 'Os temas transversais abrem um mini dossiê e podem ser editados pela equipe.'] },
  scenarios: { mood: 'analisando', tips: ['Três caminhos possíveis (A, B e C). Eles podem se combinar: A+B, A+C e B+C.', 'Mais abaixo, filtre os cenários temáticos por tipo, tema, subtema, ator, probabilidade, gravidade e horizonte.', 'Toque num tema, subtema ou ator dentro do cartão para ir direto aos cenários e perfis relacionados.', 'Não há porcentagem: sem evidência suficiente, o grupo não atribui número.'] },
  actors: { mood: 'apresentando', tips: ['Clique num perfil para ver trajetória, fontes e a avaliação: chance de entrar, chance de sair e gravidade se continuar.','Filtre por grupo e por horizonte para ver quem muda primeiro.', 'Na aba Mapa de conexões, clique num nó para ver o papel de cada instituição.', 'Caixa tracejada com hachura é nome cotado ou hipótese; caixa cheia é documentado.'] },
  risks: { mood: 'medo', tips: ['Use o filtro para separar riscos de oportunidades.', 'Na matriz, quanto mais ao alto e à direita, mais atenção. Toque no código para abrir o cenário.', 'Posição alta não é prejuízo certo: serve só para priorizar.'] },
  monitor: { mood: 'analisando', tips: ['A régua marca a posse (fato) e os demais marcos (preliminares).', 'Os pontos a verificar estão no fim da página.'] },
  method: { mood: 'feliz', tips: ['Seis etapas: do histórico ao monitoramento.'] },
  sources: { mood: 'analisando', tips: ['Toda informação tem fonte.', 'Ter fonte não é prova: confira o trecho citado.'] },
  guide: { mood: 'apresentando', tips: ['Use Avançar e Voltar para percorrer o tour.', 'Os botões com seta levam direto à tela citada.'] },
  users: { mood: 'analisando', tips: ['Aqui o admin define quem lê, quem edita e quem administra.', 'Desativar não apaga: a pessoa só passa a ver o conteúdo público.', 'Toda mudança fica registrada no fim da página.'] },
  editor: { mood: 'feliz', tips: ['Aqui você cria e edita perfis e dossiês.', 'Tudo fica salvo no Supabase para a equipe ver.'] },
}

export const CURIOS: Record<string, string[]> = {
  home: [
    'Curiosidade: a posse em 5 de janeiro vale a partir de 2027. Até 2023 era 1º de janeiro; a Emenda 111/2021 mudou a data (Constituição, art. 82).',
    'Curiosidade: a expressão "100 primeiros dias" vem do início do governo de Franklin Roosevelt, nos EUA, em 1933.',
  ],
  themes: ['Curiosidade: o IBS substitui o ICMS e o ISS, e a CBS substitui o PIS e a Cofins (Emenda 132/2023).'],
  scenarios: ['Curiosidade: uma medida provisória vale por 60 dias, prorrogáveis por mais 60, e precisa ser votada pelo Congresso para virar lei (art. 62).'],
  actors: ['Curiosidade: o STF tem 11 ministros. O presidente indica, e o Senado aprova por maioria absoluta: 41 dos 81 senadores (art. 101).'],
  risks: ['Curiosidade: emenda constitucional exige 3/5 dos votos, em dois turnos, em cada Casa: 308 deputados e 49 senadores (art. 60).'],
  monitor: ['Curiosidade: o Copom, do Banco Central, decide a Selic em 8 reuniões por ano.'],
  method: ['Curiosidade: a Câmara tem 513 deputados e o Senado tem 81 senadores, 3 por estado e pelo DF (arts. 45 e 46).'],
  sources: ['Curiosidade: a Constituição é a fonte primária de todas as regras citadas nas curiosidades; o texto está no site do Planalto.'],
  guide: [],
  editor: [],
  users: [],
}
