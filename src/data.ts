import type { Source, Scenario, Actor, Risk, ThemeScenario, Level } from './types'

export const SRC: Record<string, Source> = {
 report:{label:'Relatório Sprint IDP, pp. 3–6',url:'docs/Relatorio_Sprint_Itau_Tom_Academico_Natural.pdf'},
 method:{label:'Roteiro de pesquisa com métodos, pp. 1–3',url:'docs/Roteiro_de_pesquisa_com_metodos.pdf'},
 scenarios:{label:'Cenários para o Itaú: 100 primeiros dias, versão 11/11/2026',url:'docs/Cenarios_Itau_100_dias_Lula4.docx'},
 scenarioNotes:{label:'Construção de cenários, pp. 1–2',url:'docs/Cenarios.pdf'},
 electionPlan:{label:'Roteiro de pesquisa eleitoral, pp. 1–3',url:'docs/roteiro_pesquisa_itau_eleicoes.docx'},
 presentation:{label:'Apresentação intermediária, p. 4',url:'docs/Apresentacao_intermediaria.pdf'},
 tse:{label:'TSE · resultado do 2º turno, 26/10/2026',url:'https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/presidente-do-tse-anuncia-reeleicao-de-lula-e-faz-balanco-do-2o-turno-das-eleicoes-2026'},
 dario:{label:'Ministério da Fazenda · perfil de Dario Durigan',url:'https://www.gov.br/fazenda/pt-br/composicao/ministro/dario-carnevalli-durigan'},
 rafael:{label:'Governo do Piauí · perfil de Rafael Fonteles',url:'https://www.pi.gov.br/governador2/'},
 rafaelNews:{label:'InfoMoney · sinalização de permanência no Piauí',url:'https://www.infomoney.com.br/politica/cotado-para-fazenda-de-lula-rafael-fonteles-sinaliza-permanencia-no-piaui/'},
 camilo:{label:'MEC · currículo de Camilo Santana',url:'https://www.gov.br/mec/pt-br/acesso-a-informacao/institucional/estrutura-organizacional/gabinete-do-ministro/curriculo_camilo_santana.pdf'},
 haddad:{label:'Currículo público de Fernando Haddad',url:'https://www.itaipu.gov.br/sites/default/files/af_df/CV_Fernando_Haddad.pdf'},
 haddadNews:{label:'Folha · saída de Haddad e nomeação de Durigan',url:'https://www1.folha.uol.com.br/mercado/2026/03/quem-e-dario-durigan-novo-ministro-da-fazenda-apos-saida-de-haddad.shtml'},
 boulos:{label:'Secretaria-Geral · currículo de Guilherme Boulos',url:'https://www.gov.br/secretariageral/pt-br/composicao/ministro/guilherme-castro-boulos/%40%40download'},
 messias:{label:'AGU · perfil institucional de Jorge Messias',url:'https://www.gov.br/agu/pt-br/composicao/advogado-geral-da-uniao-1/advogado-geral-da-uniao-0'},
 messiasReject:{label:'Senado · rejeição da indicação de Jorge Messias, 29/04/2026',url:'https://www12.senado.leg.br/noticias/materias/2026/04/29/indicacao-de-jorge-messias-ao-stf-e-rejeitada-pelo-senado'},
 pacheco:{label:'Senado · PDL 995/2026 e nomeação de Rodrigo Pacheco ao TCU',url:'https://www25.senado.leg.br/web/atividade/materias/-/materia/175624'},
 pachecoNews:{label:'Senado · aprovação de Rodrigo Pacheco para o TCU',url:'https://www12.senado.leg.br/noticias/materias/2026/09/02/camara-aprova-indicacao-do-senador-rodrigo-pacheco-para-ministro-do-tcu'},
 pachecoPhoto:{label:'Senado · retrato oficial de Rodrigo Pacheco',url:'https://legis.senado.leg.br/senadores/fotos-oficiais/5732'},
 lulaPhoto:{label:'Wikimedia Commons · foto oficial de Lula, Ricardo Stuckert/PR',url:'https://commons.wikimedia.org/wiki/File:Foto_oficial_de_Luiz_In%C3%A1cio_Lula_da_Silva_(2023%E2%80%932027).jpg'},
 flavioPhoto:{label:'Wikimedia Commons · foto oficial de Flávio Bolsonaro, Agência Senado',url:'https://commons.wikimedia.org/wiki/File:Foto_oficial_do_senador_Fl%C3%A1vio_Bolsonaro_(v._AgSen).jpg'},
 darioPhoto:{label:'Metrópoles · retrato de Dario Durigan (Diogo Zacarias/MF)',url:'https://www.metropoles.com/brasil/lula-oficializa-saida-de-haddad-e-nomeacao-de-durigan-na-fazenda'},
 rafaelPhoto:{label:'Conecta Piauí · fotografia de Rafael Fonteles',url:'https://conectapiaui.com.br/blog/painel-politico/rafael-fonteles-se-reune-com-fernando-haddad-nesta-segunda-10116.html'},
 camiloPhoto:{label:'Wikimedia Commons · Camilo Santana 2023',url:'https://commons.wikimedia.org/wiki/File:Camilo_Santana_2023.jpg'},
 haddadPhoto:{label:'Wikimedia Commons · Fernando Haddad na posse da Fazenda',url:'https://commons.wikimedia.org/wiki/File:Fernando_Haddad_posse_min._da_Fazenda.jpg'},
 boulosPhoto:{label:'TV Cultura · retrato de Guilherme Boulos',url:'https://cultura.uol.com.br/eleicoes/noticias/2024/08/27/778_eleicoes-2024-confira-os-principais-pontos-do-roda-viva-com-guilherme-boulos.html'},
 messiasPhoto:{label:'iG · retrato de Jorge Messias',url:'https://ultimosegundo.ig.com.br/politica/2025-10-20/quem-e-jorge-messias-pode-ser-indicado-ao-stf-por-lula.html'},
 senate:{label:'Senado Federal · portal institucional',url:'https://www12.senado.leg.br/'},
 camara:{label:'Câmara dos Deputados · processo legislativo',url:'https://www.camara.leg.br/entenda-o-processo-legislativo/'},
 bcb:{label:'Banco Central · autonomia e competências',url:'https://www.bcb.gov.br/acessoinformacao/autonomia'},
 ri:{label:'Itaú · Relações com Investidores',url:'https://www.itau.com.br/relacoes-com-investidores/'},
 folhaGoverno:{label:'Folha · PT pede a partidos planos para ministérios e estimativa de votos',url:'https://www1.folha.uol.com.br/poder/2026/11/pt-pede-a-partidos-planos-para-ministerios-e-estimativa-de-votos-para-desenhar-governo-lula-4.shtml'},
 folhavagas:{label:'Folha · vagas em órgãos reguladores e Judiciário',url:'https://www1.folha.uol.com.br/poder/2026/10/futuro-presidente-tera-45-vagas-em-orgaos-reguladores-e-12-no-judiciario-ate-o-fim-de-2027.shtml'}
};
export const scenarios: Scenario[] = [
{id:'A',title:'Continuidade com ajuste fiscal crível',kind:'Ajuste e previsibilidade',definition:'O governo mantém o arcabouço fiscal, apresenta cedo um pacote concreto — com meta de 2027 reafirmada, travas de despesa e revisão de benefícios tributários — e escolhe uma equipe econômica de perfil técnico.',signals:['Pacote enviado ao Congresso nas primeiras semanas.','Fazenda reafirma a meta de superávit.','Queda dos prêmios de risco e convergência das expectativas de inflação.'],support:'Investidores e agentes de mercado que cobram conciliação entre promessas e medidas concretas; equipe econômica favorável à redução gradual do risco.',resistance:'Parte da base governista e de movimentos sociais contrária a cortes; setores afetados por revisão de benefícios fiscais.',itau:['Possível alívio no custo de funding e melhora do ambiente de crédito, com espaço para queda gradual dos juros.','Risco de revisão de benefícios tributários alcançar o setor financeiro — hipótese a verificar em cada medida.','Ambiente potencialmente mais favorável para operações internacionais e atração de capital.'],clients:['Crédito potencialmente mais barato no médio prazo.','PMEs concentradas na adaptação à CBS e ao Simples híbrido.'],sources:['scenarios']},
{id:'B',title:'Continuidade sem ajuste (ganho de tempo)',kind:'Pressão fiscal',definition:'O governo mantém a política fiscal atual, prioriza entregas sociais e aposta no crescimento e na queda de juros para estabilizar a dívida, sem pacote de contenção crível no início do mandato.',signals:['Ausência de medidas concretas até o fim do primeiro trimestre.','Extensão de despesas e compromissos para 2027.','Revisão de metas ou trajetória da dívida em alta.'],support:'Parte da base governista e ministérios da área social, segundo a hipótese construída no documento.',resistance:'Mercado financeiro, analistas e instituições de acompanhamento fiscal, que apontam risco de juros mais altos sem ajuste.',itau:['Juros e prêmio de risco mais altos podem pressionar funding, spread e inadimplência.','Câmbio mais fraco pode afetar resultados e conversão de operações internacionais, dependendo da exposição por país.','Menor apetite de capital estrangeiro, apesar de maior previsibilidade tributária em algumas frentes.'],clients:['Crédito mais caro.','Empresas endividadas e varejo mais sensíveis à desaceleração.'],sources:['scenarios']},
{id:'C',title:'Governabilidade travada',kind:'Impasse institucional',definition:'O governo enfrenta dificuldades de articulação no Congresso e no Senado, atrasando medidas fiscais, a regulamentação tributária e indicações institucionais, mesmo que exista intenção de ajuste.',signals:['Derrotas em votações relevantes.','Atraso em medidas tributárias e regulamentação da CBS.','Novo impasse em indicações institucionais e vacâncias em órgãos-chave.'],support:'Atores que buscam condicionar apoio a negociações, emendas, composição de cargos ou mudanças no texto.',resistance:'Lideranças do Executivo e setores econômicos que dependem de previsibilidade e avanço regulatório.',itau:['Insegurança regulatória na transição tributária, inclusive sobre alíquota financeira, Split Payment e cronograma.','Custo adicional de adaptação de sistemas se regras e prazos mudarem.','Percepção de risco institucional que pode pesar sobre investimento estrangeiro.'],clients:['Incerteza de preços e créditos tributários para empresas.','Risco de retrabalho na adequação à CBS.'],sources:['scenarios','scenarioNotes']}
];
const baseActors: Actor[] = [
{id:'lula',name:'Luiz Inácio Lula da Silva',role:'Presidente da República · mandato 2027–2030',group:'Executivo',status:'Mandato confirmado',photo:'https://upload.wikimedia.org/wikipedia/commons/9/9e/Foto_oficial_de_Luiz_In%C3%A1cio_Lula_da_Silva_%28ombros%29_denoise.jpg',photoCredit:'lulaPhoto',bio:'Foi reeleito no segundo turno de 25 de outubro de 2026, com 64.256.232 votos (51,79% dos válidos), contra Flávio Bolsonaro (48,21%). O resultado é confirmado pelo Tribunal Superior Eleitoral. A formação da equipe e as prioridades do novo mandato permanecem objeto de acompanhamento.',relevance:'A Presidência define prioridades do Executivo e conduz a formação da equipe ministerial. Para o Itaú 360°, o foco é acompanhar sinalizações fiscais, composição ministerial, relação com o Congresso, indicações institucionais e agenda de investimentos.',sources:['tse','lulaPhoto','scenarios']},
{id:'flavio',name:'Flávio Bolsonaro',role:'Candidato derrotado no 2º turno de 2026 · PL',group:'Oposição',status:'Resultado eleitoral confirmado',photo:'https://upload.wikimedia.org/wikipedia/commons/a/ad/Foto_oficial_do_senador_Fl%C3%A1vio_Bolsonaro_%28v._AgSen%29.jpg',photoCredit:'flavioPhoto',bio:'Disputou o segundo turno presidencial de 2026 e obteve 59.826.041 votos (48,21% dos votos válidos), segundo o TSE. O resultado o torna uma referência política relevante para acompanhar a oposição e a reorganização das forças partidárias após a eleição.',relevance:'Acompanhamento da oposição, das bancadas e de eventuais posições sobre política fiscal, tributação, regulação e agenda econômica. Não se atribuem posições específicas sem declaração ou voto documentado.',sources:['tse','flavioPhoto']},
{id:'dario',name:'Dario Carnevalli Durigan',role:'Ministro da Fazenda',group:'Executivo',status:'Cargo oficial · consulta 17/11/2026',photo:'https://images.metroimg.com/2026/03/dario-durigan-1-1.jpg',photoCredit:'darioPhoto',bio:'O Ministério da Fazenda o identifica como titular da pasta. É mestre em Direito pela UnB e bacharel em Direito pela USP. Sua trajetória inclui a Secretaria-Executiva do Ministério da Fazenda, atuação na Casa Civil, na Advocacia-Geral da União, na Prefeitura de São Paulo e no setor privado.',relevance:'É um ator central para o acompanhamento da política fiscal, da agenda tributária, da interlocução com o mercado e da coordenação da equipe econômica. O documento de cenários de 11/11 o menciona entre as possibilidades de continuidade na equipe econômica para 2027; isso não equivale a confirmação de permanência no novo mandato.',sources:['dario','darioPhoto','scenarios']},
{id:'rafael',name:'Rafael Tajra Fonteles',role:'Governador do Piauí',group:'Executivo',status:'Nome cotado em notícia · não confirmado',photo:'https://conectapiaui.com.br/media/image_bank/2023/6/thumbs/governador-rafael-fonteles_rkruF0z.jpeg.1200x0_q95_crop.webp',photoCredit:'rafaelPhoto',bio:'É bacharel em Matemática e mestre em Economia Matemática pelo IMPA. Foi secretário da Fazenda do Piauí de 2015 a 2022 e presidente do Comsefaz por dois mandatos. O governo estadual registra sua eleição em 2022 e posse em janeiro de 2023.',relevance:'Foi citado em notícia como nome cotado para a Fazenda, mas sinalizou intenção de permanecer no governo do Piauí. Portanto, o perfil deve ser tratado como hipótese de composição noticiada, não como indicação ou nomeação.',sources:['rafael','rafaelNews','rafaelPhoto']},
{id:'camilo',name:'Camilo Sobreira de Santana',role:'Ministro da Educação · nome citado para a Casa Civil',group:'Executivo',status:'Cargo atual e hipótese separados',photo:'https://upload.wikimedia.org/wikipedia/commons/4/40/Camilo_Santana_2023.jpg',photoCredit:'camiloPhoto',bio:'Engenheiro agrônomo, professor e mestre em Desenvolvimento e Meio Ambiente pela UFC. Foi governador do Ceará, eleito em 2014 e reeleito em 2018; em 2022 foi eleito senador. O currículo institucional do MEC registra sua nomeação como ministro da Educação em janeiro de 2023.',relevance:'O protótipo Vetor registrou Camilo Santana como um dos nomes mencionados em conversas sobre a composição da Casa Civil, sem definição anunciada. Essa hipótese deve ser mantida separada do cargo institucional documentado.',sources:['camilo','camiloPhoto','scenarios']},
{id:'haddad',name:'Fernando Haddad',role:'Ex-ministro da Fazenda · nome citado para a Casa Civil',group:'Executivo',status:'Hipótese de composição · não confirmada',photo:'https://upload.wikimedia.org/wikipedia/commons/5/52/Fernando_Haddad_posse_min._da_Fazenda.jpg',photoCredit:'haddadPhoto',bio:'Advogado, mestre em Economia e doutor em Filosofia pela USP. Foi ministro da Educação, prefeito de São Paulo e ministro da Fazenda. Deixou o comando da Fazenda em março de 2026, quando Dario Durigan assumiu a pasta, segundo a cobertura da transição ministerial.',relevance:'O protótipo Vetor registra Haddad como nome mencionado em conversas sobre a Casa Civil. Não há, nos documentos consultados, confirmação de nomeação para essa função. A ficha preserva a hipótese com data e fonte.',sources:['haddad','haddadNews','haddadPhoto']},
{id:'boulos',name:'Guilherme Castro Boulos',role:'Ministro da Secretaria-Geral da Presidência',group:'Executivo',status:'Cargo institucional documentado',photo:'https://cultura.uol.com.br/upload/tvcultura/eleicoes/20240827100445_destaquesrodavivaguilhermeboulos.jpg',photoCredit:'boulosPhoto',bio:'Professor, escritor e político. A ficha institucional da Secretaria-Geral o identifica como ministro e registra formação em Filosofia, mestrado em Psiquiatria e especialização em Psicologia Clínica. O material do protótipo anterior também mencionou seu nome como hipótese para a área de Desenvolvimento Social, sem confirmação.',relevance:'A Secretaria-Geral tem relevância para articulação política e diálogo social. A hipótese de mudança de pasta deve ser tratada como especulação histórica, não como decisão formal.',sources:['boulos','boulosPhoto']},
{id:'messias',name:'Jorge Rodrigo Araújo Messias',role:'Advogado-Geral da União',group:'Judiciário / controle',status:'Cargo AGU confirmado · indicação ao STF rejeitada',photo:'https://i0.statig.com.br/bancodeimagens/3f/9m/4l/3f9m4ldorp8z8s6q1apmdeo4n.jpg',photoCredit:'messiasPhoto',bio:'Procurador da Fazenda Nacional, mestre e doutor em Direito pela UnB. Atuou na Casa Civil, no Ministério da Educação e no Ministério da Ciência, Tecnologia e Inovação. A AGU o identifica como Advogado-Geral da União. Sua indicação ao STF foi rejeitada pelo Senado em 29 de abril de 2026, por 42 votos contrários e 34 favoráveis.',relevance:'O episódio é um precedente relevante para avaliar a relação Executivo–Senado, a aprovação de autoridades e a capacidade de coordenação institucional. Não deve ser apresentado como indicação pendente.',sources:['messias','messiasReject','messiasPhoto']},
{id:'pacheco',name:'Rodrigo Otavio Soares Pacheco',role:'Ministro do Tribunal de Contas da União',group:'Judiciário / controle',status:'Nomeação formalizada em setembro de 2026',photo:'https://legis.senado.leg.br/senadores/fotos-oficiais/5732',photoCredit:'pachecoPhoto',bio:'Advogado, foi deputado federal e senador por Minas Gerais e presidiu o Senado Federal em dois biênios. Em setembro de 2026, sua indicação para o TCU foi aprovada pelo Senado e pela Câmara, e o PDL 995/2026 foi transformado no Decreto Legislativo nº 386/2026. Por isso, o perfil anterior que o colocava como alternativa em debate para a vaga do STF está desatualizado.',relevance:'O TCU é relevante para fiscalização e controle da administração pública, execução de políticas e projetos de infraestrutura. Sua trajetória no Senado também é pertinente para a leitura de relações institucionais, mas o cargo atual é no TCU.',sources:['pacheco','pachecoNews','pachecoPhoto']}
,
{id:'ptbase',name:'PT e partidos da base',role:'Partidos de centro e bancadas que negociam a formação do governo',group:'Legislativo',status:'Em negociação · composição não confirmada',photo:'',photoCredit:'',bio:'O PT pediu aos partidos planos para ministérios e estimativa de votos para desenhar o governo. Bancadas e partidos de centro podem apoiar pautas específicas sem aderir integralmente à agenda do governo.',relevance:'Define a capacidade de aprovar medidas fiscais, a regulamentação tributária e as indicações. O apoio pode vir votação a votação, não em bloco.',sources:['folhaGoverno']},
{id:'senado',name:'Senado Federal',role:'Liderança do Senado · aprova indicações a tribunais e agências',group:'Legislativo',status:'Instituição · liderança em acompanhamento',photo:'',photoCredit:'',bio:'Aprova indicações para tribunais e agências. A relação entre governo e Senado condiciona prazos e a agenda fiscal. Em 29 de abril de 2026 rejeitou a indicação de Jorge Messias ao STF.',relevance:'A eleição para a presidência do Senado está em acompanhamento, sem sinal claro de conflito com o Planalto.',sources:['senate','messiasReject']},
{id:'agencias',name:'Agências e órgãos reguladores',role:'45 vagas existentes ou previstas até o fim de 2027',group:'Reguladores',status:'Vagas abertas · indicações pendentes',photo:'',photoCredit:'',bio:'Levantamento jornalístico identificou 45 vagas existentes ou previstas em órgãos reguladores e 12 no Judiciário até o fim de 2027. Parte das indicações enfrenta entraves entre governo e Senado.',relevance:'Observar quórum, prioridades das diretorias e prazos setoriais. O documento de cenários não encontrou fontes confiáveis para nomes cotados.',sources:['folhavagas']}
];
type Aval = Pick<Actor, 'entra' | 'sai' | 'grav' | 'hz' | 'why'>
/** Avaliação qualitativa preliminar de cada ator; editável na Área editorial (vira override no banco). */
const AVAL: Record<string, Aval> = {
 lula:{sai:1,grav:3,hz:3,why:'Mandato confirmado pelo TSE; saída não é cenário. Gravidade alta porque as decisões fiscais e de nomeação passam pela Presidência: o risco é de sinais contraditórios entre gasto e compromisso fiscal.'},
 dario:{sai:2,grav:3,hz:1,why:'Titular da Fazenda. O documento de 11/11 o cita entre as possibilidades de continuidade na equipe econômica, sem confirmar permanência no novo mandato. A pasta tem o maior efeito sobre juros e câmbio.'},
 rafael:{entra:1,grav:3,hz:1,why:'Cotado para a Fazenda, mas sinalizou em 9/11 intenção de continuar no governo do Piauí. Se assumir, a leitura do mercado sobre juros e câmbio depende do nome.'},
 camilo:{entra:2,grav:2,hz:1,why:'Um de dois nomes em discussão para a Casa Civil, que coordena a articulação com o Congresso. Não há definição anunciada.'},
 haddad:{entra:2,grav:2,hz:1,why:'Um de dois nomes em discussão para a Casa Civil. Não há definição anunciada nem nomeação confirmada nos documentos consultados.'},
 boulos:{entra:2,grav:1,hz:1,why:'Nome mencionado para Desenvolvimento Social, sem confirmação oficial. O efeito sobre o Itaú é indireto, via renda e consumo.'},
 messias:{entra:1,grav:1,hz:2,why:'Indicação ao STF rejeitada pelo Senado em 29/4/2026 e sem nova indicação anunciada. O efeito sobre o banco é indireto, via segurança jurídica.'},
 pacheco:{sai:1,grav:2,hz:3,why:'Nomeação ao TCU formalizada em setembro de 2026, sem sinal de saída nos documentos consultados. O TCU fiscaliza a execução de políticas e projetos de infraestrutura.'},
 ptbase:{entra:3,grav:2,hz:1,why:'Partidos de centro cobram espaço no governo e podem apoiar só pautas específicas; a composição define o ritmo da agenda no Congresso.'},
 senado:{grav:2,hz:2,why:'O Senado já barrou uma indicação ao STF e define o ritmo das nomeações em agências. Não há ruptura declarada.'},
 agencias:{entra:2,grav:2,hz:3,why:'Vagas pendentes e indicações com entraves podem reduzir o quórum e atrasar decisões setoriais.'},
}
export const actors: Actor[] = baseActors.map(a => ({ ...a, ...AVAL[a.id] }))
export const risks: Risk[] = [
{title:'Credibilidade fiscal, dívida e despesas',type:'Risco',channel:'Juros longos, prêmio de risco, funding, câmbio e apetite por crédito.',state:'Análise qualitativa preliminar; nota numérica não atribuída no documento de cenários.',src:['scenarios','method']},
{title:'CBS/IBS, Split Payment e alíquota do setor financeiro',type:'Misto',channel:'Custos e sistemas do banco; fluxo de caixa, preço e créditos tributários de clientes.',state:'Pontos regulatórios em implementação; alíquotas específicas ainda exigem conferência.',src:['scenarios','scenarioNotes']},
{title:'Dificuldade de aprovação no Congresso e no Senado',type:'Risco',channel:'Atraso de medidas fiscais, regulamentação tributária e indicações institucionais.',state:'Cenário prospectivo; sinais a acompanhar por votação, relatório e agenda.',src:['scenarios','method']},
{title:'Minerais críticos, terras raras e transição energética',type:'Oportunidade',channel:'Project finance, crédito a fornecedores, câmbio, mercado de capitais e gestão de caixa.',state:'Oportunidade potencial condicionada à execução, licenciamento, energia e financiamento.',src:['report','scenarioNotes']},
{title:'IA, digitalização, fraude e regulação de dados',type:'Misto',channel:'Risco operacional e competitivo; novas soluções e serviços digitais.',state:'Tema de monitoramento contínuo; evidência setorial precisa ser atualizada.',src:['report','method']},
{title:'Escala 6×1 e mudanças nas relações de trabalho',type:'Misto',channel:'Custos de empresas, emprego, renda, consumo e qualidade de crédito.',state:'Debate político; efeito depende do texto, aprovação e regulamentação.',src:['report','electionPlan']},
{title:'Endividamento das famílias e seletividade do crédito',type:'Risco',channel:'Concessões, renegociação, inadimplência, provisões e consumo.',state:'Tema estrutural; indicadores devem ser atualizados com séries oficiais e dados do Itaú disponíveis.',src:['report','method']},
{title:'Investimento estrangeiro e projetos de infraestrutura',type:'Oportunidade',channel:'Financiamento, câmbio, comércio exterior, serviços e fornecedores.',state:'Oportunidade potencial; separar anúncio, decisão, licenciamento e execução.',src:['report','scenarioNotes']},
{title:'Choque externo e geopolítico',type:'Risco',channel:'Câmbio, commodities, fretes, inflação importada e exposição de empresas.',state:'Risco de cauda; manter visível mesmo quando a probabilidade é baixa.',src:['method','report']},
{title:'Expansão de crédito direcionado pelo governo',type:'Misto',channel:'Concorrência com bancos públicos, garantias, distribuição e serviços complementares.',state:'Hipótese do protótipo anterior; atualizar conforme anúncio de programas e regras.',src:['method']}
];
export const variables: [string, string, string][] = [
['Credibilidade fiscal','Pacote de ajuste, meta de 2027, travas de despesa e revisão de benefícios.','scenarios'],
['Equipe econômica','Titularidade da Fazenda, perfil técnico ou político e coordenação da equipe.','scenarios'],
['Governabilidade','Relação com Câmara e Senado, composição das bancadas e capacidade de aprovar medidas.','scenarios'],
['Política monetária','Selic, expectativas de inflação, curva de juros e comunicação do Copom.','scenarios'],
['Agenda tributária','CBS, IBS, Imposto Seletivo, Split Payment e alíquota aplicável ao setor financeiro.','scenarios'],
['Ambiente institucional','Indicações ao STF, agências reguladoras, vacâncias e previsibilidade jurídica.','scenarios']
];
export const timeline: [string, string][] = [
['Novembro–dezembro de 2026','Transição, anúncio de ministros, expectativa de pacote fiscal e possível nova indicação para a vaga do STF.'],
['5 de janeiro de 2027','Posse presidencial — marco indicado no documento de cenários.'],
['Janeiro de 2027','Início da cobrança da CBS e vigência do Simples híbrido, conforme calendário preliminar do documento; confirmar regras e datas oficiais.'],
['Fevereiro–março de 2027','Tramitação de medidas fiscais e MPs; teste de governabilidade e avanço da regulamentação tributária.'],
['Por volta de 15 de abril de 2027','Balanço dos primeiros 100 dias e revisão dos cenários.']
];
export const indicators: [string, string][] = [
['Fiscal','Resultado primário; dívida bruta; meta fiscal; despesas; renúncias e benefícios tributários.'],
['Monetário','IPCA; expectativas; Selic; curva de juros; prêmio de risco e câmbio.'],
['Crédito e banco','Carteira; concessões; spreads; inadimplência; provisões; margem financeira; receitas de serviços e seguros.'],
['Famílias e empresas','Emprego; renda real; endividamento; atrasos; margens; investimento e confiança por setor.'],
['Capital e patrimônio','ROE; lucro; capital regulatório; RWA; captação líquida; ativos sob gestão/administração.'],
['Externo e tecnologia','IED; commodities; fretes; fluxo cambial; fraude; ataques; regulação de dados e adoção de IA.']
];
export const pending: string[] = [
'Alíquota de referência da CBS de 11,3% citada em fonte única: confirmar em fonte oficial ou de ampla circulação.',
'Alíquota final do setor financeiro no texto aprovado: o documento menciona previsão de 10,85% em 2027 e 12,50% em 2033; conferir texto final e regulamentação.',
'Efeito de eventual revisão de benefícios tributários sobre o setor financeiro.',
'Tributação da renda — isenção, dividendos e remessas ao exterior — não verificada na pesquisa de 11/11.',
'Indicações para agências reguladoras: o documento não encontrou fontes confiáveis para nomes cotados.',
'Nível da Selic e resultado do Copom de 4/11/2026: atualizar com a decisão e a série oficial.',
'Composição completa do Congresso e da base de apoio: levantar e registrar fonte e data.'
];
export const methodSteps: [string, string][] = [
['Histórico político','Reconstruir padrões de governos anteriores, prioridades, restrições e resultados de políticas. O histórico oferece contexto, não previsão automática.'],
['Evidências atuais','Ler programas, leis, atos, discursos, entrevistas, indicadores e notícias; registrar data, autoria, estágio e trecho utilizado.'],
['Tendências e incertezas','Identificar forças estruturais, fatores de mudança e incertezas críticas. A matriz CSD organiza certezas, suposições e dúvidas; o mapa de empatia ajuda a compreender incentivos e públicos.'],
['Cenários prospectivos','Construir trajetórias possíveis a partir do contexto, hipóteses e restrições; explicitar sinais que confirmam ou enfraquecem cada cenário.'],
['Impactos para o Itaú','Descrever o mecanismo de transmissão, separando impacto direto sobre o banco e impacto indireto via clientes, setores, emprego, renda, consumo e crédito.'],
['Monitoramento','Acompanhar a passagem de anúncio a negociação, aprovação, regulamentação e execução; atualizar probabilidade, impacto e confiança quando novas evidências surgirem.']
];
export const methodTools: [string, string][] = [
['Matriz CSD','Organiza o que já é conhecido, o que é hipótese e o que ainda precisa ser investigado. Evita tratar suposições como fatos.'],
['Mapa de empatia','Ajuda a estruturar necessidades, incentivos, percepções e restrições de atores ou públicos afetados; deve ser apoiado por evidências.'],
['Pesquisa histórica e documental','Compara experiências anteriores e examina documentos primários e secundários, registrando autoria, data, versão e página.'],
['Mapeamento de atores','Identifica quem decide, influencia, negocia ou pode bloquear; registra competências institucionais e relações.'],
['Benchmarking','Compara práticas, estruturas e abordagens de referência para orientar a forma de organizar a análise, sem copiar conclusões.'],
['Cenários e matrizes','Transforma incertezas em trajetórias plausíveis e prioriza eventos por probabilidade e impacto, com justificativa e confiança separada.']
];
export const internalDocs: [string, string, string][] = [['Relatório Sprint IDP — versão acadêmica natural','Metodologia em seis etapas, cinco eixos, atores, monitoramento, impactos diretos e indiretos.','docs/Relatorio_Sprint_Itau_Tom_Academico_Natural.pdf'],['Roteiro de pesquisa com métodos','Pergunta de pesquisa, recorte de 100 dias, temas, ficha documental, matriz P×I e indicadores.','docs/Roteiro_de_pesquisa_com_metodos.pdf'],['Cenários para o Itaú — 100 primeiros dias','Cenários A/B/C, variáveis determinantes, sinais, impactos e pontos pendentes de verificação.','docs/Cenarios_Itau_100_dias_Lula4.docx'],['Construção de cenários','Cinco perguntas orientadoras e temas de investigação.','docs/Cenarios.pdf'],['Roteiro de pesquisa eleitoral','Pergunta, temas, ficha documental, cenários, indicadores e estrutura de entrega.','docs/roteiro_pesquisa_itau_eleicoes.docx'],['Apresentação intermediária','Lógica de transmissão entre decisão política, setores, clientes e impacto direto/indireto.','docs/Apresentacao_intermediaria.pdf'],['Protótipo Itaú 360° original','Referência de filtros, navegação, cenários, atores, decisões e matriz.','docs/Prototipo_Itaú360.html'],['Protótipo Vetor','Referência editorial de cenários e nomes mencionados em negociações.','docs/Prototipo_Vetor.html'],['Protótipo Radar','Referência complementar de filtragem e fichas de cenário.','docs/Prototipo_Radar.html']];
export const publicDocs: string[] = ['tse','dario','rafael','rafaelNews','camilo','haddad','haddadNews','boulos','messias','messiasReject','pacheco','pachecoNews','pachecoPhoto','folhavagas'];

// ---------- avaliação qualitativa, temas e subtemas ----------
export const NIVEL = ['', 'Baixa', 'Média', 'Alta']
export const HORIZONTE = ['', 'Curto prazo', 'Médio prazo', 'Longo prazo']
/** Termo de ator dos cenários → grupo do diretório de atores (sem entrada: busca por texto). */
export const TERMO_GRUPO: Record<string, string> = { Governo: 'Executivo', Congresso: 'Legislativo', Reguladores: 'Reguladores' }
export const GRUPO_TERMO: Record<string, string> = { Executivo: 'Governo', Legislativo: 'Congresso', Oposição: 'Congresso', Reguladores: 'Reguladores' }

const T = (id: string, t: string, tp: ThemeScenario['tp'], tm: string[], sub: string[], pb: string[], at: string[], p: Level, c: Level, g: Level, h: Level, r: string, why: string, est: string, ch: string[], op: string[], ri: string[], mo: string[], src: string[]): ThemeScenario =>
  ({ id, t, tp, tm, sub, pb, at, p, c, g, h, r, why, est, ch, op, ri, mo, src })
export const themeScenarios: ThemeScenario[] = [
T('CT1','Recuperação da confiança e ajuste fiscal','Favorável',['Fiscal','Investimento estrangeiro'],['Responsabilidade fiscal e meta','Política monetária e juros','Fluxo de capital'],['Baixa renda','Classe média','Alta renda','PMEs','Grandes empresas','Estrangeiros'],['Governo','Congresso','Investidores externos'],2,2,1,2,
 'Governo estabiliza a relação com o Congresso e sinaliza compromisso fiscal.',
 'A reeleição com 51,79% dá fôlego ao governo, mas o Congresso mais conservador e a falta de medidas fiscais críveis limitam a confiança plena.',
 'Análise qualitativa preliminar; nota numérica não atribuída no documento de cenários.',
 ['Menor prêmio de risco e câmbio mais previsível','Possível queda dos juros futuros','Famílias retomam financiamentos','Empresas retomam projetos adiados','Estrangeiros ampliam exposição ao Brasil'],
 ['Financiamento empresarial e imobiliário','Gestão de patrimônio e investimentos','Câmbio e proteção financeira','Infraestrutura e projetos produtivos'],
 ['Euforia sem execução fiscal real'],
 ['Resultado fiscal','Dívida pública','Expectativas de inflação','Curva de juros','Fluxo de capital estrangeiro','Articulação do governo'],['scenarios','method']),
T('CT2','Deterioração fiscal, juros altos e baixo crescimento','Desfavorável',['Fiscal','Endividamento'],['Dívida pública','Política monetária e juros','Inadimplência'],['Baixa renda','Classe média','PMEs','Grandes empresas'],['Governo','Congresso','Banco Central'],2,3,3,2,
 'Despesas fora de controle, conflitos políticos e falta de medidas fiscais críveis elevam o risco percebido.',
 'Depende de despesas e conflitos sem resposta fiscal. O equilíbrio fiscal é a principal preocupação do estudo, mas não há sinal de ruptura.',
 'Análise qualitativa preliminar; nota numérica não atribuída no documento de cenários.',
 ['Crédito mais caro para famílias e empresas','Consumo e investimento em queda','Mais renegociações','Dificuldade de pagar dívidas','Clientes priorizam liquidez'],
 ['Aplicações conservadoras','Renegociação estruturada'],
 ['Alta da inadimplência','Menor demanda por crédito','Deterioração de carteiras empresariais','Volatilidade cambial e financeira'],
 ['Atrasos por faixa','Concentração setorial','Clientes expostos a juros','Testes de estresse'],['scenarios','method']),
T('CT3','Mudanças na renda, no trabalho e no consumo','Misto',['Trabalho'],['Escala 6×1','Emprego e custos','Renda e salários'],['Baixa renda','Classe média','PMEs'],['Governo','Congresso','Sindicatos e empresas'],2,2,2,2,
 'Políticas salariais, transferências e mudança de jornada alteram renda e consumo.',
 'A escala 6×1 e a política de renda estão em debate, sem regra aprovada; o efeito só aparece após a regulamentação.',
 'Debate político; efeito depende do texto, aprovação e regulamentação.',
 ['Renda maior: mais cartões, pagamentos, turismo e serviços','Custos maiores sem produtividade: preços altos e menos contratação','Consumo pode beneficiar pequenos negócios locais'],
 ['Adquirência e soluções de pagamento','Capital de giro para pequenos negócios','Financiamento de automação'],
 ['Margens apertadas','Menor contratação','Dificuldade financeira em setores intensivos em mão de obra'],
 ['Renda real','Emprego por setor','Inflação de serviços','Custos trabalhistas','Produtividade'],['report','electionPlan']),
T('CT4','Endividamento elevado e crédito mais seletivo','Misto',['Endividamento'],['Inadimplência','Renegociação','Portabilidade'],['Baixa renda','Classe média','PMEs'],['Governo','Banco Central','Reguladores','Bancos'],3,2,2,1,
 'Renda comprometida segue alta e reguladores ou governo reorganizam o mercado de crédito.',
 'O endividamento das famílias já é alto hoje; falta apenas a mudança regulatória ou de mercado.',
 'Tema estrutural; indicadores devem ser atualizados com séries oficiais e dados do Itaú disponíveis.',
 ['Menos compras parceladas','Mais renegociação e portabilidade','Bancos mais criteriosos','Setores dependentes de consumo financiado perdem demanda'],
 ['Renegociação responsável','Educação e organização financeira','Investimentos de baixo risco','Serviços de gestão de orçamento'],
 ['Perda de relacionamento para concorrentes ou plataformas digitais se faltar solução adequada'],
 ['Endividamento e atrasos','Portabilidade','Concessões','Medidas regulatórias'],['report','method']),
T('CT5','Investimento estrangeiro em setores estratégicos','Oportunidade',['Investimento estrangeiro','Infraestrutura','Data centers'],['Fluxo de capital','Minerais críticos e terras raras','Energia renovável e descarbonização','Energia e conectividade'],['Grandes empresas','Estrangeiros','PMEs'],['Governo','Investidores externos','Órgãos de licenciamento'],2,3,1,3,
 'Energia, minerais críticos, data centers e infraestrutura atraem capital.',
 'Há anúncios (minerais críticos, energia, data centers), mas dependem de licença, energia e financiamento.',
 'Oportunidade potencial; separar anúncio, decisão, licenciamento e execução.',
 ['Grandes projetos exigem financiamento','Fornecedores nacionais entram em novas cadeias','Maior fluxo cambial'],
 ['Financiamento de projetos de grande porte','Câmbio e comércio exterior','Gestão de caixa para estrangeiras','Emissões e mercado de capitais','Atendimento a fornecedores'],
 ['Projeto anunciado não sai por falta de licença, energia, infraestrutura, segurança jurídica ou financiamento','Crescimento concentrado em poucas regiões'],
 ['Execução, não anúncios','Licenciamento','Cronograma','IED'],['report','scenarioNotes']),
T('CT6','Choque externo e geopolítico','Risco',['Choques externos'],['Câmbio','Commodities e fretes','Geopolítica'],['Baixa renda','Classe média','Grandes empresas','PMEs'],['Governos estrangeiros','Investidores externos','Mercados de commodities'],2,3,3,2,
 'Conflitos, sanções, disputas comerciais e interrupções logísticas afetam o Brasil mesmo sem participação direta.',
 'Choques externos independem do governo e são imprevisíveis; não há sinal específico agora.',
 'Risco de cauda; manter visível mesmo quando a probabilidade é baixa.',
 ['Famílias: combustíveis, alimentos e importados mais caros','Agro: fertilizantes e insumos oscilam','Indústria: custos e interrupções','Exportadores: novos mercados com mais volatilidade','Importadores: mais proteção cambial e capital de giro'],
 ['Hedge e gestão cambial','Financiamento ao comércio exterior','Apoio à reorganização de cadeias'],
 ['Inflação importada','Volatilidade cambial'],
 ['Câmbio','Commodities','Fretes','Sanções'],['method','report']),
T('CT7','IA e digitalização transformam o banco','Misto',['Tecnologia'],['Inteligência artificial','Dados e cibersegurança','Transformação digital'],['Classe média','Alta renda','PMEs','Baixa renda'],['Big techs','Reguladores','Fraudadores','Bancos'],3,3,2,1,
 'Assistentes de IA podem comparar taxas e escolher produtos, reduzindo a dependência do app do banco.',
 'IA e fraudes digitais já avançam, e a pressão competitiva é de curto prazo.',
 'Tema de monitoramento contínuo; evidência setorial precisa ser atualizada.',
 ['Pressão sobre tarifas e spreads','Menor fidelidade de alguns clientes','Mais deepfakes, golpes e fraude de identidade'],
 ['Personalização de produtos','Banco como infraestrutura financeira integrada à vida digital','Segurança e autenticação como diferencial'],
 ['Fraudes','Competição digital','Perda de relacionamento'],
 ['Fraudes e ataques','Regulação de dados','Adoção de assistentes de IA'],['report','method']),
T('CT8','Expansão do crédito direcionado pelo governo','Misto',['Crédito direcionado','Fiscal'],['Programas e garantias','Bancos públicos'],['PMEs','Grandes empresas','Baixa renda'],['Governo','Bancos públicos','Congresso'],3,2,2,1,
 'Programas públicos ampliam linhas subsidiadas e garantias para certos setores.',
 'Linhas subsidiadas são um instrumento rápido do Executivo, embora volumes e garantias ainda não estejam definidos.',
 'Hipótese do protótipo anterior; atualizar conforme anúncio de programas e regras.',
 ['Empresas obtêm condições melhores','Bancos públicos ganham participação','Parte da demanda por crédito privado é deslocada'],
 ['Pagamentos, distribuição e garantias','Serviços complementares','Parcerias com programas'],
 ['Concorrência direta com crédito subsidiado'],
 ['Novos programas','Volumes dos bancos públicos','Garantias oferecidas'],['method']),
T('CT9','Transição da reforma tributária (CBS/IBS)','Misto',['Tributário'],['CBS e IBS','Split Payment','Regras do setor financeiro'],['PMEs','Grandes empresas','Classe média'],['Governo','Congresso','Reguladores'],3,3,2,1,
 'Regulamentação, alíquotas, Split Payment e cronograma da CBS e do IBS mudam custos e sistemas do banco e o fluxo de caixa dos clientes.',
 'CBS e IBS estão em fase de teste em 2026 e a transição exige preparação operacional; as alíquotas específicas ainda dependem de confirmação (ver Pontos ainda a verificar).',
 'Pontos regulatórios em implementação; alíquotas específicas ainda exigem conferência.',
 ['Adaptação de sistemas e processos do banco','Fluxo de caixa, preço e créditos tributários dos clientes mudam com o Split Payment','Alíquota do setor financeiro ainda exige conferência'],
 ['Serviços de pagamento e conciliação ligados ao Split Payment (hipótese)','Capital de giro para empresas durante a transição'],
 ['Retrabalho se regras e prazos mudarem','Custo adicional de adaptação de sistemas'],
 ['Regulamentação da CBS e do IBS','Cronograma de vigência','Alíquota do setor financeiro','Split Payment'],['scenarios','scenarioNotes']),
T('CT10','Reindustrialização e política industrial','Oportunidade',['Produtivo'],['Reindustrialização','Política industrial','Atração de investimentos'],['Grandes empresas','PMEs','Estrangeiros'],['Governo','Investidores externos','Bancos públicos'],2,2,1,3,
 'Política industrial e reindustrialização podem ampliar a demanda por crédito, câmbio e estruturação financeira, se os instrumentos e a execução saírem do papel.',
 'Faltam instrumentos de incentivo, critérios e cronograma definidos: a oportunidade depende de execução, não de anúncio.',
 'Oportunidade potencial; separar anúncio, decisão, licenciamento e execução.',
 ['Empresas investidoras e fornecedores locais demandam capital de giro e financiamento de investimento','Cadeias produtivas exigem câmbio, seguros e gestão de caixa'],
 ['Project finance e crédito empresarial','Capital de giro e financiamento de fornecedores','Câmbio, comércio exterior e mercado de capitais'],
 ['Anúncio sem execução','Crédito público subsidiado concorrendo com o privado'],
 ['Instrumentos de incentivo e critérios','Cadeias produtivas beneficiadas','Condições de financiamento público'],['report','scenarioNotes']),
]

/** Votos do 2º turno (TSE). O percentual oficial do site vem do banco (view election_result); isto é só reserva se o banco estiver fora. */
export const ELEICAO = [
  { candidate: 'Luiz Inácio Lula da Silva', party: 'PT', votes: 64256232 },
  { candidate: 'Flávio Bolsonaro', party: 'PL', votes: 59826041 },
]

/** Dias corridos até a posse (5/1/2027), pela data local; negativo depois dela. */
export const diasAtePosse = (): number => {
  const n = new Date()
  return Math.round((new Date(2027, 0, 5).getTime() - new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime()) / 864e5)
}
/** "falta 1 dia" / "faltam 39 dias" */
export const faltam = (d: number): string => `${d === 1 ? 'falta' : 'faltam'} ${d} ${d === 1 ? 'dia' : 'dias'}`

// ---------- Planalto: movimentações do governo e em que etapa estão ----------
// Texto do protótipo do grupo (Itaú360), avaliação qualitativa preliminar; a equipe atualiza a etapa na Área editorial.
export const ETAPAS = ['Em debate', 'Em negociação', 'Indicação ou anúncio', 'Votação', 'Regulamentação', 'Em vigor']
export interface Movimento { title: string; stage: string; next: string; risk: string; itau: string; actors: string[]; src: string[] }
export const movimentos: Movimento[] = [
{title:'Definição da Fazenda e da equipe econômica',stage:'Em negociação',next:'Escolha do nome para a Fazenda: segue aberto, e Fonteles sinalizou permanecer no Piauí.',risk:'Sinal fiscal fraco ou demora na definição.',itau:'A escolha define a leitura do mercado sobre juros e câmbio, canais que movem funding e apetite por crédito.',actors:['Dario Carnevalli Durigan','Rafael Tajra Fonteles'],src:['scenarios','rafaelNews']},
{title:'Composição da Esplanada (Casa Civil e Desenvolvimento Social)',stage:'Em negociação',next:'Resposta dos partidos ao pedido do PT de planos para ministérios e estimativa de votos.',risk:'Concessões ao centro elevam o custo político e fiscal.',itau:'Quanto mais concessões, maior o risco de sinais contraditórios entre gasto e compromisso fiscal.',actors:['PT e partidos da base','Guilherme Castro Boulos'],src:['scenarios']},
{title:'Vaga do STF (Messias · Pacheco)',stage:'Em debate',next:'Escolha do nome para a vaga de Barroso e votação no Senado. Precedente: o Senado rejeitou Messias em abril.',risk:'Novo impasse entre Planalto e Senado.',itau:'Afeta a segurança jurídica, não diretamente o banco.',actors:['Jorge Rodrigo Araújo Messias','Rodrigo Otavio Soares Pacheco','Senado Federal'],src:['scenarios','messiasReject']},
{title:'Preenchimento das 45 vagas em órgãos reguladores',stage:'Indicação ou anúncio',next:'Indicações do Planalto e sabatinas no Senado; são 45 vagas até o fim de 2027.',risk:'Falta de quórum atrasa decisões setoriais.',itau:'Parte das indicações já enfrenta entraves, o que tende a atrasar decisões regulatórias que tocam o banco.',actors:['Agências e órgãos reguladores','Senado Federal'],src:['scenarios']},
{title:'Regulamentação da reforma tributária (IBS e CBS)',stage:'Regulamentação',next:'Ajustes de regulamentação e preparação operacional da transição. Calendário preliminar: confirmar datas oficiais.',risk:'Custos operacionais e mudança de regras para o banco e os clientes.',itau:'Custos e sistemas do banco; fluxo de caixa, preço e créditos tributários dos clientes.',actors:[],src:['scenarios','scenarioNotes']},
{title:'Eleição para a presidência do Senado',stage:'Em debate',next:'Definição da liderança do Senado, que condiciona indicações e a pauta fiscal.',risk:'Liderança em conflito com o Planalto.',itau:'Sem sinal claro de conflito por ora; o efeito vem pelo ritmo das indicações e da pauta fiscal.',actors:['Senado Federal'],src:['scenarios']},
{title:'Fim da escala 6×1',stage:'Em debate',next:'Debate no Congresso, sem regra aprovada; o efeito depende de regulamentação.',risk:'Custos para empresas, emprego e consumo.',itau:'Indireto: passa por renda, consumo e custos das empresas clientes.',actors:[],src:['scenarios']},
]
