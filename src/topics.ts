import type { Sub, Topic } from './types'

// Conteúdo-base dos temas. Tudo aqui é editável na Área editorial (vira override no banco).
// Efeitos para o Itaú são hipóteses de análise, não resultados medidos.

/** Passos de "como aprofundar": servem a qualquer tema; o editor pode trocar por tema. */
const DEEPEN = [
  'Reunir a evidência documental mais recente: lei, ato, discurso ou dado oficial, com data e página.',
  'Identificar a competência institucional: quem decide, quem pode bloquear e em que etapa está (anúncio, tramitação, regulamentação ou execução).',
  'Descrever o mecanismo de transmissão até o Itaú, separando o efeito direto no banco do efeito indireto via clientes.',
  'Definir os indicadores que confirmam ou enfraquecem cada caminho e registrar a data da próxima revisão.',
  'Registrar na Área editorial, com fonte em cada afirmação, e marcar o que é fato, nome cotado ou hipótese.',
]
const S = (t: string, how: string, care: string): Sub => ({ t, how, care })

export const baseTopics: Topic[] = [
  {
    id: 'fiscal', kind: 'eixo', n: '01', short: 'Fiscal', title: 'Política fiscal e orçamentária',
    desc: 'Responsabilidade fiscal, trajetória da dívida, arcabouço, gastos públicos, resultado primário, política monetária e juros.',
    about: 'Reúne o que o governo gasta, arrecada e deve, e o que o Banco Central faz com os juros. É o tema que mais pesa sobre o custo do dinheiro: um sinal fiscal fraco encarece o crédito e a captação do banco; um sinal crível os barateia.',
    subs: [
      S('Responsabilidade fiscal e meta', 'Pacote crível e meta de 2027 reafirmada reduzem o prêmio de risco: abrem espaço para crédito mais barato, financiamento empresarial e câmbio mais previsível.', 'Anúncio sem execução. Acompanhar se o pacote chega ao Congresso e se as travas de despesa saem do papel.'),
      S('Dívida pública', 'Trajetória estável sustenta o apetite de investidores e o fluxo de capital; clientes de gestão de patrimônio buscam alternativas de renda fixa.', 'Dívida em alta empurra os juros longos e o custo de captação do banco.'),
      S('Arcabouço e gastos', 'Regras claras de despesa dão previsibilidade para planejar crédito e carteira.', 'Revisão de metas ou despesas fora do arcabouço aumentam o risco percebido.'),
      S('Resultado primário', 'Superávit reafirmado é sinal de compromisso e melhora a leitura do mercado sobre os juros futuros.', 'Resultado abaixo da meta, arrecadação frustrada ou mudança de trajetória.'),
      S('Política monetária e juros', 'Queda gradual da Selic reabre financiamentos de famílias e empresas e projetos adiados.', 'Juros altos por mais tempo pressionam inadimplência e demanda por crédito. Observar expectativas de inflação e a comunicação do Copom.'),
    ],
    questions: ['Qual é a credibilidade do pacote fiscal e da meta de 2027?', 'Quais despesas, receitas e benefícios podem ser revistos?', 'Como a trajetória da dívida e as expectativas fiscais afetam juros longos, funding e apetite por crédito?'],
    channels: ['Prêmio de risco e curva de juros', 'Custo de funding, spreads e concessão de crédito', 'Câmbio, fluxo de capital e investimento estrangeiro'],
    itau: 'O efeito direto pode aparecer no custo de captação, no preço do crédito, no resultado financeiro e na exposição cambial. Indiretamente, juros e atividade alteram a capacidade de pagamento de famílias e empresas.',
    deepen: DEEPEN, sources: ['scenarios', 'report'],
  },
  {
    id: 'tax', kind: 'eixo', n: '02', short: 'Tributário', title: 'Política tributária',
    desc: 'Reforma do consumo, CBS, IBS, tributação da renda, revisão de benefícios fiscais, arrecadação e regras específicas do setor financeiro.',
    about: 'Mudanças em impostos que atingem o banco, os clientes e os sistemas: a reforma do consumo (CBS e IBS), a tributação da renda e a revisão de benefícios. É o tema mais ligado a calendário e a trabalho operacional.',
    subs: [
      S('CBS e IBS', 'Clientes empresariais vão precisar de orientação e soluções para a transição; o banco pode apoiar o capital de giro nesse período.', 'Em 2026 estão em fase de teste; alíquotas e prazos ainda exigem confirmação oficial. Risco de retrabalho de sistemas se as regras mudarem.'),
      S('Split Payment', 'O recolhimento no momento do pagamento muda o fluxo de caixa das empresas e abre espaço para serviços de pagamento e conciliação.', 'Exige adaptação de sistemas e processos do banco; cronograma ainda em definição.'),
      S('Tributação da renda', 'Mudanças em isenção e dividendos redirecionam decisões de investimento e de gestão de patrimônio.', 'Ponto não verificado na pesquisa de 11/11. Não tratar como decisão.'),
      S('Benefícios fiscais', 'A revisão pode reorientar setores e produtos de crédito incentivado.', 'O alcance sobre o setor financeiro é hipótese a verificar em cada medida.'),
      S('Regras do setor financeiro', 'Definição clara da alíquota dá previsibilidade para preço e planejamento.', 'O documento de cenários cita previsão de 10,85% em 2027 e 12,50% em 2033; conferir o texto final e a regulamentação.'),
    ],
    questions: ['Qual é o estágio de regulamentação e implementação de CBS e IBS?', 'Quais alíquotas e regras específicas ainda dependem de definição?', 'Como Split Payment e mudanças tributárias afetam sistemas, custos e clientes?'],
    channels: ['Obrigações tributárias e sistemas do banco', 'Custo de adaptação operacional e compliance', 'Preços, fluxo de caixa e créditos tributários de empresas clientes'],
    itau: 'A análise precisa separar a incidência tributária direta sobre o banco dos efeitos sobre empresas, prestadores, varejo e consumidores. As alíquotas citadas nos documentos estão identificadas como pontos a confirmar, não como valores finais.',
    deepen: DEEPEN, sources: ['scenarios', 'method', 'electionPlan'],
  },
  {
    id: 'productive', kind: 'eixo', n: '03', short: 'Produtivo', title: 'Desenvolvimento produtivo e reindustrialização',
    desc: 'Política industrial, cadeias produtivas, competitividade, produtos de maior valor agregado e atração de investimentos.',
    about: 'Política industrial e incentivos para produzir mais e com mais valor agregado. Para o banco, o efeito costuma chegar primeiro pelas empresas que investem e pelos fornecedores, antes de aparecer no balanço.',
    subs: [
      S('Reindustrialização', 'Empresas que ampliam a produção demandam crédito, câmbio e seguros.', 'Setores incentivados podem receber crédito público subsidiado, que concorre com o privado.'),
      S('Política industrial', 'Programas com critérios claros permitem desenhar produtos e parcerias.', 'Instrumentos e critérios ainda indefinidos; anúncio não é execução.'),
      S('Competitividade', 'Exportadores e importadores ganham com gestão cambial e financiamento ao comércio exterior.', 'Custos de energia, logística e câmbio podem corroer a competitividade e a capacidade de pagamento dos clientes.'),
      S('Atração de investimentos', 'Investidores estrangeiros precisam de câmbio, gestão de caixa e financiamento local.', 'Projeto anunciado pode não sair por falta de licença, energia ou segurança jurídica.'),
    ],
    questions: ['Quais setores podem receber incentivos, financiamento ou apoio público?', 'Quais cadeias produtivas podem se expandir e demandar capital?', 'Quais restrições de infraestrutura, licenciamento e segurança jurídica podem impedir a execução?'],
    channels: ['Project finance e crédito empresarial', 'Capital de giro e financiamento de fornecedores', 'Câmbio, comércio exterior, mercado de capitais e gestão de caixa'],
    itau: 'A oportunidade pode surgir antes de um efeito direto sobre o banco: empresas investidoras, fornecedores locais e investidores estrangeiros podem demandar crédito, câmbio, pagamentos, seguros e estruturação financeira.',
    deepen: DEEPEN, sources: ['report', 'scenarioNotes'],
  },
  {
    id: 'technology', kind: 'eixo', n: '04', short: 'Tecnologia', title: 'Tecnologia e inovação',
    desc: 'Inteligência artificial, transformação digital, soberania tecnológica, dados, biotecnologia, fármacos avançados e inovação.',
    about: 'IA, digitalização, dados e inovação. É o tema que mais mistura ameaça e oportunidade: o mesmo avanço que melhora o atendimento aumenta as fraudes e a concorrência.',
    subs: [
      S('Inteligência artificial', 'Personalização de produtos e um banco integrado à vida digital do cliente.', 'Assistentes de IA podem comparar taxas e escolher produtos, reduzindo a fidelidade e pressionando tarifas e spreads.'),
      S('Transformação digital', 'O banco como infraestrutura financeira de plataformas e parceiros.', 'Perda de relacionamento para plataformas digitais e big techs.'),
      S('Dados e cibersegurança', 'Segurança e autenticação como diferencial competitivo.', 'Mais deepfakes, golpes e fraude de identidade; regras de dados mudam custos de conformidade.'),
      S('Biotecnologia e fármacos', 'Financiamento de pesquisa e de produção de alto valor agregado.', 'Depende de compras públicas, capacidade produtiva e regulação. Acompanhar antes de assumir demanda.'),
      S('Soberania tecnológica', 'Projetos nacionais de infraestrutura de dados podem demandar financiamento.', 'Requisitos aplicáveis a dados e tecnologia ainda em definição.'),
    ],
    questions: ['Quais políticas podem acelerar IA, digitalização e infraestrutura de dados?', 'Quais exigências regulatórias afetam dados, cibersegurança e serviços digitais?', 'Que empresas, cadeias e projetos de biotecnologia ou fármacos avançados podem demandar financiamento?'],
    channels: ['Risco operacional, fraude e cibersegurança', 'Concorrência, distribuição digital e relacionamento com clientes', 'Financiamento de inovação, pesquisa e produção de alto valor agregado'],
    itau: 'O eixo reúne riscos operacionais e oportunidades comerciais. A análise deve distinguir a transformação interna do banco, as mudanças competitivas no setor financeiro e os novos mercados de financiamento.',
    deepen: DEEPEN, sources: ['report', 'scenarioNotes'],
  },
  {
    id: 'infrastructure', kind: 'eixo', n: '05', short: 'Infraestrutura', title: 'Infraestrutura e transição energética',
    desc: 'Novo PAC, concessões, PPPs, energia renovável, descarbonização, biocombustíveis, minerais críticos e terras raras.',
    about: 'Obras, concessões, energia e minerais críticos que dependem de licença, capital privado e cronograma. É onde mais se confunde anúncio com execução.',
    subs: [
      S('Novo PAC', 'Fornecedores e prestadores de serviço precisam de capital de giro e garantias.', 'Avaliar orçamento, modelagem e cronograma executável antes de contar com a demanda.'),
      S('Concessões e PPPs', 'Financiamento de projetos, emissões e mercado de capitais.', 'Modelagem fraca ou atraso de licitações adia a demanda.'),
      S('Energia renovável e descarbonização', 'Project finance e crédito a cadeias de energia limpa.', 'Licenciamento e infraestrutura de conexão podem atrasar os projetos.'),
      S('Biocombustíveis', 'Crédito a produtores e à cadeia de insumos.', 'Dependem de incentivos e regras ainda não definidos.'),
      S('Minerais críticos e terras raras', 'Câmbio, comércio exterior e financiamento a projetos de grande porte.', 'Dependem de licença, energia e segurança jurídica; o crescimento tende a se concentrar em poucas regiões.'),
    ],
    questions: ['Quais projetos têm orçamento, modelagem e cronograma executável?', 'Quais dependem de concessões, licenciamento, energia ou capital privado?', 'Quais cadeias de minerais críticos e transição energética podem atrair investimento nacional e estrangeiro?'],
    channels: ['Financiamento de projetos e estruturação de capital', 'Financiamento a fornecedores e cadeias de serviços', 'Câmbio, seguros, mercado de capitais e gestão de caixa'],
    itau: 'O banco pode participar como financiador, estruturador ou provedor de serviços a empresas, investidores e fornecedores. A análise deve separar anúncio de investimento, decisão formal, licenciamento, contratação e execução.',
    deepen: DEEPEN, sources: ['report', 'scenarioNotes'],
  },

  // ---------- temas transversais: atravessam mais de um eixo ----------
  {
    id: 'trabalho', kind: 'transversal', short: 'Trabalho', title: 'Trabalho e escala 6×1', type: 'Misto',
    desc: 'Debate sobre jornada, custos empresariais, emprego, produtividade e consumo. Efeito depende do texto, da tramitação e da regulamentação.',
    about: 'Mudanças na jornada e na renda alteram custos das empresas, emprego e consumo. Não há regra aprovada: o efeito só aparece depois da tramitação e da regulamentação.',
    subs: [
      S('Escala 6×1', 'Setores que reorganizam a jornada podem demandar capital de giro e financiamento de automação.', 'Debate sem regra aprovada; o efeito depende do texto, da tramitação e da regulamentação.'),
      S('Emprego e custos', 'Renda maior sustenta cartões, pagamentos e serviços.', 'Custos maiores sem produtividade apertam margens e a contratação em setores intensivos em mão de obra.'),
      S('Renda e salários', 'Pequenos negócios locais podem ganhar com consumo maior: adquirência e capital de giro.', 'O efeito só aparece depois da regulamentação.'),
    ],
    questions: ['Qual é o estágio do debate e o que o texto prevê?', 'Quais setores têm mais mão de obra e menos margem para absorver custos?'],
    channels: ['Custos e margens das empresas clientes', 'Renda, consumo e qualidade do crédito'],
    itau: 'Efeito indireto: chega ao banco pela renda das famílias, pelo consumo e pelas margens das empresas, e daí para a qualidade do crédito.',
    deepen: DEEPEN, sources: ['report', 'electionPlan'],
  },
  {
    id: 'endividamento', kind: 'transversal', short: 'Endividamento', title: 'Endividamento e crédito', type: 'Risco / oportunidade',
    desc: 'Endividamento familiar, renegociação, seletividade de crédito, inadimplência e eventuais medidas regulatórias ou programas públicos.',
    about: 'A renda das famílias já está muito comprometida com dívidas. O tema acompanha atrasos, renegociação e a possibilidade de o governo ou os reguladores reorganizarem o mercado de crédito.',
    subs: [
      S('Inadimplência', 'Segmentar a carteira e antecipar ofertas de renegociação.', 'Atrasos por faixa e concentração setorial; renda comprometida elevada.'),
      S('Renegociação', 'Renegociação responsável e educação financeira ajudam a manter o relacionamento.', 'Medidas regulatórias podem reorganizar o mercado de crédito.'),
      S('Portabilidade', 'Oferta competitiva de portabilidade pode captar clientes.', 'Perda de clientes para concorrentes e plataformas digitais se faltar solução adequada.'),
    ],
    questions: ['Como estão atrasos e concessões por faixa de renda?', 'Há medidas regulatórias ou programas públicos em preparação?'],
    channels: ['Concessões, provisões e inadimplência', 'Consumo e demanda por crédito'],
    itau: 'Efeito direto na carteira de crédito e nas provisões. Indicadores devem vir de séries oficiais e de dados do Itaú disponíveis.',
    deepen: DEEPEN, sources: ['report', 'method'],
  },
  {
    id: 'investimento-estrangeiro', kind: 'transversal', short: 'Investimento estrangeiro', title: 'Investimento estrangeiro', type: 'Oportunidade',
    desc: 'Entrada de capital em minerais críticos, energia, data centers e infraestrutura; oportunidades condicionadas a execução, licença e segurança jurídica.',
    about: 'Capital de fora pode financiar projetos e movimentar o câmbio, mas só chega com previsibilidade fiscal, licença e segurança jurídica. Anúncio não é investimento realizado.',
    subs: [
      S('Fluxo de capital', 'Câmbio, gestão de caixa e emissões para empresas estrangeiras.', 'O fluxo depende de previsibilidade fiscal e jurídica.'),
      S('Licenciamento e execução', 'Financiar projetos quando há licença e cronograma.', 'Separar anúncio, decisão, licenciamento e execução.'),
    ],
    questions: ['Quais projetos anunciados têm licença, energia e financiamento?', 'O que muda no fluxo cambial se a confiança melhorar ou piorar?'],
    channels: ['Câmbio e comércio exterior', 'Financiamento de projetos e mercado de capitais'],
    itau: 'Oportunidade para financiamento, câmbio e serviços a estrangeiras e fornecedores, condicionada à execução.',
    deepen: DEEPEN, sources: ['report', 'scenarios'],
  },
  {
    id: 'externo', kind: 'transversal', short: 'Choques externos', title: 'Choques externos e geopolítica', type: 'Risco',
    desc: 'Conflitos, sanções, comércio, commodities, fretes e cadeias de suprimento podem afetar câmbio, inflação, empresas e clientes.',
    about: 'Eventos fora do Brasil que chegam por preços, câmbio e logística. Não dependem do governo e são difíceis de prever, mas devem ficar visíveis mesmo quando a probabilidade é baixa.',
    subs: [
      S('Câmbio', 'Hedge e gestão cambial para empresas expostas.', 'Volatilidade cambial afeta resultados e clientes importadores.'),
      S('Commodities e fretes', 'Financiamento ao comércio exterior e apoio à reorganização de cadeias.', 'Inflação importada e custos de insumos e logística.'),
      S('Geopolítica', 'Apoio a clientes que buscam novos mercados.', 'Sanções e disputas comerciais mudam rotas e a volatilidade.'),
    ],
    questions: ['Quais clientes têm mais exposição a câmbio, commodities e fretes?'],
    channels: ['Câmbio e inflação importada', 'Capital de giro de importadores e exportadores'],
    itau: 'Efeito principalmente indireto, via câmbio, inflação e custos de clientes.',
    deepen: DEEPEN, sources: ['report', 'method'],
  },
  {
    id: 'credito-direcionado', kind: 'transversal', short: 'Crédito direcionado', title: 'Crédito direcionado e bancos públicos', type: 'Misto',
    desc: 'Programas subsidiados, garantias e mudanças de concorrência por linhas de crédito podem alterar demanda e condições de mercado.',
    about: 'Linhas subsidiadas e garantias públicas são um instrumento rápido do Executivo. Podem ajudar clientes e, ao mesmo tempo, deslocar parte da demanda por crédito privado.',
    subs: [
      S('Programas e garantias', 'Parcerias com programas, pagamentos, distribuição e serviços complementares.', 'Concorrência direta com crédito subsidiado.'),
      S('Bancos públicos', 'Serviços complementares aos clientes que usam linhas públicas.', 'Bancos públicos ganham participação e deslocam demanda.'),
    ],
    questions: ['Quais programas e garantias foram anunciados, com que volume?'],
    channels: ['Demanda por crédito privado', 'Condições de mercado e concorrência'],
    itau: 'Pode reduzir a demanda por crédito privado em certos setores; abre espaço para parcerias e serviços.',
    deepen: DEEPEN, sources: ['method'],
  },
  {
    id: 'datacenters', kind: 'transversal', short: 'Data centers', title: 'Data centers e soberania digital', type: 'Oportunidade / risco',
    desc: 'Investimento em infraestrutura digital depende de energia, conectividade, segurança jurídica, regulação de dados e financiamento.',
    about: 'Data centers atraem capital, mas exigem muita energia e conectividade e dependem de regras de dados. É um ponto de encontro entre os eixos de tecnologia e infraestrutura.',
    subs: [
      S('Energia e conectividade', 'Financiamento de projetos e de fornecedores de energia e redes.', 'Sem energia e conectividade o projeto não sai.'),
      S('Regulação de dados', 'Soluções de segurança e conformidade para clientes.', 'Regras de dados e soberania ainda em definição.'),
      S('Financiamento', 'Project finance e mercado de capitais para a infraestrutura digital.', 'Separar anúncio de investimento de contratação e execução.'),
    ],
    questions: ['Quais projetos de data center têm energia, conectividade e licença?'],
    channels: ['Financiamento de projetos', 'Risco regulatório e operacional'],
    itau: 'Oportunidade de financiamento e serviços, com risco regulatório e de execução.',
    deepen: DEEPEN, sources: ['report', 'scenarioNotes'],
  },
]
