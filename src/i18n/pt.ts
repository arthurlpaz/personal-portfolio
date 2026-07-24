/**
 * Portuguese dictionary. This is the source of truth: `en.ts` is typed against
 * it, so a missing or misspelled key fails the build instead of silently
 * rendering `undefined`.
 */
export const pt = {
  meta: {
    htmlLang: 'pt-BR',
    title: 'Arthur Lincoln da Paz — AI Engineer',
    description:
      'Arthur Lincoln da Paz Cristovão — AI Engineer em Campina Grande. Construindo aplicações de IA em produção: agentes com LLMs, RAG, visão computacional e MLOps.',
  },

  nav: {
    home: 'Início',
    about: 'Sobre',
    expertise: 'Expertise',
    projects: 'Projetos',
    timeline: 'Trajetória',
    contact: 'Contato',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    skipToContent: 'Pular para o conteúdo',
    sections: 'Seções',
    switchTo: 'Switch to English',
  },

  hero: {
    location: '@arthurlpaz · Campina Grande, PB',
    roles: 'AI Engineer · LLMs & Agentes · MLOps',
    introPre:
      'Construo aplicações de IA que chegam em produção — agentes sobre LLMs, RAG e modelos de deep learning, do experimento à API que roda. Hoje em ',
    introEm: 'pesquisa aplicada em IA',
    introPost: ', em Campina Grande.',
    ctaProjects: 'Ver projetos',
    scrollCue: 'scroll',
    scrollAria: 'Rolar para a próxima seção',
  },

  about: {
    label: '01 / Sobre',
    headingPre: 'Construindo pontes entre ',
    headingEm1: 'pesquisa aplicada',
    headingMid: ' e ',
    headingEm2: 'sistemas de produção',
    paragraphs: [
      'Atuo como Engenheiro de IA em pesquisa aplicada na área de saúde, em Campina Grande. Meu trabalho vive na interseção entre pesquisa e engenharia de software, transformando modelos experimentais em pipelines robustos.',
      'O centro do meu trabalho hoje são aplicações sobre LLMs — agentes que usam ferramentas, RAG sobre bases próprias e avaliação sistemática de saídas. Em volta disso seguem visão computacional, séries temporais e dados tabulares. O que muda é o domínio; o método é o mesmo: entender o problema, medir com honestidade e entregar algo que aguenta rodar fora do notebook.',
    ],
    closingPre:
      'Publico artigos acadêmicos e faço peer review em conferências, e ao mesmo tempo construo software de verdade em volta dos modelos: APIs, interfaces e infraestrutura. Uso agentes de código como o ',
    closingEm: 'Claude Code',
    closingPost:
      ' como parte do fluxo de trabalho — não para escrever por mim, mas para acelerar scaffolding, refatoração e revisão. A filosofia é simples: IA boa é IA que funciona.',
    stats: [
      { value: 'LLMs', label: 'Agentes & RAG'},
      { value: 'P&D', label: 'Pesquisa aplicada'},
      { value: 'MLOps', label: 'Pipelines E2E'},
      { value: 'CV', label: 'Visão computacional'},
    ],
  },

  expertise: {
    heading: 'Onde eu me viro bem',
    subheading:
      'As ferramentas e domínios com que trabalho no dia a dia — do treino de modelos até colocá-los rodando em produção.',
    domains: {
      llm: {
        title: 'LLMs & Agentes',
        description:
          'O centro do meu trabalho hoje: agentes que usam ferramentas, RAG sobre bases próprias e avaliação de saídas. Uso agentes de código como o Claude Code no dia a dia.',
        skills: ['Claude Code', 'Claude API', 'Agentes com ferramentas', 'RAG', 'LangGraph', 'Prompt engineering'],
      },
      ml: {
        title: 'Machine Learning',
        description:
          'Deep learning, fine-tuning, ensembles e séries temporais — do baseline honesto ao modelo que entra em produção.',
        skills: ['PyTorch', 'Transformers', 'Fine-tuning', 'scikit-learn', 'XGBoost / LightGBM', 'TensorFlow'],
      },
      mlops: {
        title: 'MLOps & Infra',
        description: 'Pipelines reproduzíveis, versionamento de modelos e CI/CD para ML.',
        skills: ['Docker', 'MLflow', 'GitHub Actions', 'Pydantic', 'Poetry', 'Pre-commit'],
      },
      backend: {
        title: 'Backend & APIs',
        description: 'REST APIs, microserviços, bancos relacionais e vetoriais, Python assíncrono.',
        skills: ['FastAPI', 'Python', 'PostgreSQL / pgvector', 'sqlite-vec', 'Redis', 'Async / httpx'],
      },
      research: {
        title: 'Pesquisa & Dados',
        description: 'Publicações acadêmicas, análise estatística e integração de bases de dados.',
        skills: ['Pandas / EDA', 'Peer Review', 'Testes de hipótese', 'Record Linkage', 'R / Bioestatística', 'LaTeX'],
      },
      frontend: {
        title: 'Frontend & Data Viz',
        description: 'Dashboards, interfaces para ML e visualização de dados e resultados.',
        skills: ['React / TypeScript', 'Vite / Tailwind', 'Streamlit', 'Plotly', 'Matplotlib', 'HTML / CSS'],
      },
    },
  },

  projects: {
    heading: 'Coisas que andei construindo',
    subheading: 'Puxado direto do meu GitHub — então essa lista se atualiza sozinha.',
    all: 'Todos',
    allRepos: 'Todos os repositórios',
    featured: 'Destaques',
    viewOnGitHub: 'Ver no GitHub',
    noDescription: 'Sem descrição por enquanto — o código conta a história.',
    otherLanguage: 'Outros',
    goToFeatured: 'Ir para o destaque',
    updated: 'atualizado',
    fallback: {
      segmentation: {
        title: 'CT Segmentation',
        description:
          'Pipeline de segmentação 3D de tomografia para planejamento cirúrgico. TotalSegmentator + nnU-Net v2 sobre DICOM.',
      },
      forecast: {
        title: 'Volt Forecast',
        description:
          'Plataforma MLOps de previsão de consumo energético: Poetry, Pydantic Settings, logging estruturado e pipeline reproduzível.',
      },
      chatbot: {
        title: 'LLM Memory Chatbot',
        description:
          'Assistente full-stack com FastAPI, LangGraph e SQLite+sqlite-vec para busca híbrida BM25/semântica. Embeddings locais via Ollama.',
      },
    },
    liveFromApi: 'ao vivo pela API',
    fallbackNotice: 'GitHub fora do ar agora — mostrando uma seleção enquanto isso',
    time: {
      today: 'hoje',
      yesterday: 'ontem',
      days: (n: number) => `há ${n} dias`,
      months: (n: number) => `há ${n} ${n === 1 ? 'mês' : 'meses'}`,
      years: (n: number) => `há ${n} ${n === 1 ? 'ano' : 'anos'}`,
    },
  },

  timeline: {
    label: '04 / Trajetória',
    heading: 'De pesquisa a produção',
    present: 'presente',
    current: 'Atual',
    events: [
      {
        period: '2024 – presente',
        title: 'AI Engineer',
        org: 'Pesquisa aplicada em saúde',
        items: [
          'Aplicações sobre LLMs e agentes com ferramentas',
          'Deep learning aplicado a imagens médicas',
          'Modelos experimentais levados até produção',
          'Pesquisa aplicada, publicações e peer review',
        ],
      },
      {
        period: '2024',
        title: 'LLM Applications & MLOps',
        org: 'Projetos independentes',
        items: [
          'Agentes de IA sobre LLMs e orquestração de fluxos',
          'RAG sobre bases próprias com busca vetorial',
          'Desenvolvimento assistido por agentes de código (Claude Code)',
          'Plataformas MLOps com versionamento e deploy de modelos',
        ],
      },
      {
        period: '2023 – 2024',
        title: 'Generative AI & ML Engineering',
        org: 'Projetos & assessments técnicos',
        items: [
          'Avaliação e diagnóstico de sistemas RAG',
          'Assessments técnicos em IA generativa',
          'Classificação e ensembles sobre dados tabulares',
          'Modelagem preditiva ponta a ponta',
        ],
      },
      {
        period: '2022 – 2023',
        title: 'Formação & primeiros projetos',
        org: 'Formação acadêmica',
        items: [
          'Entrada na pesquisa acadêmica em IA',
          'Primeiros modelos de deep learning para classificação',
          'Pipelines de machine learning ponta a ponta',
          'Fundamentos de cloud e infraestrutura',
        ],
      },
    ],
  },

  contact: {
    label: '05 / Contato',
    headingPre: 'Vamos construir algo ',
    headingEm: 'juntos?',
    intro:
      'Trabalho com aplicações sobre LLMs, agentes, AI Engineering e MLOps — e curto trocar ideia sobre pesquisa. Me manda uma mensagem.',
    whoami: {
      name: 'nome',
      role: 'cargo',
      roleValue: 'AI Engineer',
      location: 'local',
      locationValue: 'Campina Grande, PB, Brasil',
      field: 'área',
      fieldValue: 'Pesquisa aplicada em IA',
      focus: 'foco',
    },
    copy: 'copiar',
    copied: 'copiado',
    copyAria: 'Copiar email',
    copiedAria: 'Email copiado',
    footerNote: 'Feito com React, Three.js & muita cafeína ☕',
  },

  palette: {
    placeholder: 'Buscar seção, link ou ação...',
    empty: 'Nada encontrado.',
    goTo: 'Ir para',
    links: 'Links',
    actions: 'Ações',
    copyEmail: 'Copiar email',
    sendEmail: 'Enviar email',
  },

  shortcuts: {
    title: 'Atalhos',
    openPalette: 'Abrir a paleta de comandos',
    showShortcuts: 'Mostrar estes atalhos',
    close: 'Fechar',
    switchLanguage: 'Trocar o idioma',
    hiddenAround: 'Escondido por aí',
    secrets: {
      konami: 'O clássico',
      words: 'sudo, claude, hire, train, 42',
      wordsHint: 'digite uma palavra',
      doubleClick: 'Repete a animação de entrada',
      doubleClickHint: 'duplo clique no nome',
      idle: 'O treino converge sozinho',
      idleHint: 'fique parado 45s',
      console: 'No console do navegador',
    },
  },

  secretWords: {
    sudo: {
      title: 'permission denied',
      description: 'arthur is not in the sudoers file. This incident will be reported.',
    },
    claude: {
      title: '✳ claude code',
      description: 'Ferramenta do dia a dia por aqui. Boa escolha de palavra.',
    },
    hire: {
      title: 'Vaga? Bora conversar.',
      description: 'Email copiado para a área de transferência.',
    },
    train: {
      title: 'Iniciando treino...',
      description: 'Fica parado 45 segundos e ele converge sozinho.',
    },
    answer: {
      title: 'A resposta.',
      description: 'Faltou a pergunta.',
    },
    konami: {
      title: '✓ training converged',
      description: 'Você achou o konami code. Tem mais escondido por aqui.',
    },
  },

  common: {
    backToTop: 'Voltar ao topo',
  },
}

// Deliberately not `as const`: the literal types would make `en` unassignable.
// Structure is still enforced, which is the part that matters.
export type Dictionary = typeof pt
