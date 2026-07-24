import type { Dictionary } from './pt'

export const en: Dictionary = {
  meta: {
    htmlLang: 'en-US',
    title: 'Arthur Lincoln da Paz — AI Engineer',
    description:
      'Arthur Lincoln da Paz Cristovão — AI Engineer based in Campina Grande, Brazil. Building production AI applications: LLM agents, RAG systems, computer vision and MLOps.',
  },

  nav: {
    home: 'Home',
    about: 'About',
    expertise: 'Expertise',
    projects: 'Projects',
    timeline: 'Timeline',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
    sections: 'Sections',
    switchTo: 'Mudar para português',
  },

  hero: {
    location: '@arthurlpaz · Campina Grande, Brazil',
    roles: 'AI Engineer · LLMs & Agents · MLOps',
    introPre:
      'I build AI systems that make it to production — LLM agents, RAG and deep learning models, from the experiment to the API that actually runs. Currently in ',
    introEm: 'applied AI research',
    introPost: ', in Campina Grande, Brazil.',
    ctaProjects: 'See projects',
    scrollCue: 'scroll',
    scrollAria: 'Scroll to the next section',
  },

  about: {
    label: '01 / About',
    headingPre: 'Building bridges between ',
    headingEm1: 'applied research',
    headingMid: ' and ',
    headingEm2: 'production systems',
    paragraphs: [
      'I work as an AI Engineer in applied healthcare research, in Campina Grande, Brazil. My work lives at the intersection of research and software engineering, turning experimental models into robust pipelines.',
      'The centre of my work today is LLM applications — agents that use tools, RAG over private corpora and systematic output evaluation. Around that sit computer vision, time series and tabular data. The domain changes; the method does not: understand the problem, measure honestly, and ship something that survives outside the notebook.',
    ],
    closingPre:
      'I publish academic papers and peer review at conferences, while building the real software around the models: APIs, interfaces and infrastructure. I use coding agents like ',
    closingEm: 'Claude Code',
    closingPost:
      ' as part of the workflow — not to write for me, but to speed up scaffolding, refactoring and review. The philosophy is simple: good AI is AI that works.',
    stats: [
      { value: 'LLMs', label: 'Agents & RAG' },
      { value: 'R&D', label: 'Applied research' },
      { value: 'MLOps', label: 'E2E pipelines' },
      { value: 'CV', label: 'Computer vision' },
    ],
  },

  expertise: {
    heading: 'Where I do my best work',
    subheading:
      'The tools and domains I work with day to day — from training models to keeping them running in production.',
    domains: {
      llm: {
        title: 'LLMs & Agents',
        description:
          'The centre of my work today: agents that use tools, RAG over private corpora and output evaluation. I use coding agents like Claude Code every day.',
        skills: ['Claude Code', 'Claude API', 'Tool-using agents', 'RAG', 'LangGraph', 'Prompt engineering'],
      },
      ml: {
        title: 'Machine Learning',
        description:
          'Deep learning, fine-tuning, ensembles and time series — from an honest baseline to the model that ships.',
        skills: ['PyTorch', 'Transformers', 'Fine-tuning', 'scikit-learn', 'XGBoost / LightGBM', 'TensorFlow'],
      },
      mlops: {
        title: 'MLOps & Infra',
        description: 'Reproducible pipelines, model versioning and CI/CD for ML.',
        skills: ['Docker', 'MLflow', 'GitHub Actions', 'Pydantic', 'Poetry', 'Pre-commit'],
      },
      backend: {
        title: 'Backend & APIs',
        description: 'REST APIs, microservices, relational and vector databases, async Python.',
        skills: ['FastAPI', 'Python', 'PostgreSQL / pgvector', 'sqlite-vec', 'Redis', 'Async / httpx'],
      },
      research: {
        title: 'Research & Data',
        description: 'Academic publications, statistical analysis and data integration.',
        skills: ['Pandas / EDA', 'Peer Review', 'Hypothesis testing', 'Record Linkage', 'R / Biostatistics', 'LaTeX'],
      },
      frontend: {
        title: 'Frontend & Data Viz',
        description: 'Dashboards, interfaces for ML, and visualisation of data and results.',
        skills: ['React / TypeScript', 'Vite / Tailwind', 'Streamlit', 'Plotly', 'Matplotlib', 'HTML / CSS'],
      },
    },
  },

  projects: {
    heading: 'Things I have been building',
    subheading: 'Pulled straight from my GitHub — so this list keeps itself up to date.',
    all: 'All',
    allRepos: 'All repositories',
    featured: 'Featured',
    viewOnGitHub: 'View on GitHub',
    noDescription: 'No description yet — the code tells the story.',
    otherLanguage: 'Other',
    goToFeatured: 'Go to featured item',
    updated: 'updated',
    fallback: {
      segmentation: {
        title: 'CT Segmentation',
        description:
          '3D CT segmentation pipeline for surgical planning. TotalSegmentator + nnU-Net v2 over DICOM.',
      },
      forecast: {
        title: 'Volt Forecast',
        description:
          'MLOps platform for energy consumption forecasting: Poetry, Pydantic Settings, structured logging and a reproducible pipeline.',
      },
      chatbot: {
        title: 'LLM Memory Chatbot',
        description:
          'Full-stack assistant built on FastAPI, LangGraph and SQLite+sqlite-vec for hybrid BM25/semantic search. Local embeddings via Ollama.',
      },
    },
    liveFromApi: 'live from the API',
    fallbackNotice: 'GitHub is unreachable right now — showing a curated selection instead',
    time: {
      today: 'today',
      yesterday: 'yesterday',
      days: (n: number) => `${n} days ago`,
      months: (n: number) => `${n} ${n === 1 ? 'month' : 'months'} ago`,
      years: (n: number) => `${n} ${n === 1 ? 'year' : 'years'} ago`,
    },
  },

  timeline: {
    label: '04 / Timeline',
    heading: 'From research to production',
    present: 'present',
    current: 'Current',
    events: [
      {
        period: '2024 – present',
        title: 'AI Engineer',
        org: 'Applied healthcare research',
        items: [
          'LLM applications and tool-using agents',
          'Deep learning applied to medical imaging',
          'Experimental models taken through to production',
          'Applied research, publications and peer review',
        ],
      },
      {
        period: '2024',
        title: 'LLM Applications & MLOps',
        org: 'Independent projects',
        items: [
          'AI agents over LLMs and workflow orchestration',
          'RAG over private corpora with vector search',
          'Development assisted by coding agents (Claude Code)',
          'MLOps platforms with model versioning and deployment',
        ],
      },
      {
        period: '2023 – 2024',
        title: 'Generative AI & ML Engineering',
        org: 'Projects & technical assessments',
        items: [
          'Evaluation and diagnosis of RAG systems',
          'Technical assessments in generative AI',
          'Classification and ensembles over tabular data',
          'End-to-end predictive modelling',
        ],
      },
      {
        period: '2022 – 2023',
        title: 'Education & first projects',
        org: 'Academic background',
        items: [
          'First steps into academic AI research',
          'Early deep learning models for classification',
          'End-to-end machine learning pipelines',
          'Cloud and infrastructure fundamentals',
        ],
      },
    ],
  },

  contact: {
    label: '05 / Contact',
    headingPre: "Let's build something ",
    headingEm: 'together?',
    intro:
      'I work with LLM applications, agents, AI Engineering and MLOps — and I enjoy talking about research. Send me a message.',
    whoami: {
      name: 'name',
      role: 'role',
      roleValue: 'AI Engineer',
      location: 'location',
      locationValue: 'Campina Grande, Brazil',
      field: 'field',
      fieldValue: 'Applied AI research',
      focus: 'focus',
    },
    copy: 'copy',
    copied: 'copied',
    copyAria: 'Copy email',
    copiedAria: 'Email copied',
    footerNote: 'Built with React, Three.js & plenty of coffee ☕',
  },

  palette: {
    placeholder: 'Search for a section, link or action...',
    empty: 'Nothing found.',
    goTo: 'Go to',
    links: 'Links',
    actions: 'Actions',
    copyEmail: 'Copy email',
    sendEmail: 'Send email',
  },

  shortcuts: {
    title: 'Shortcuts',
    openPalette: 'Open the command palette',
    showShortcuts: 'Show these shortcuts',
    close: 'Close',
    switchLanguage: 'Switch language',
    hiddenAround: 'Hidden around here',
    secrets: {
      konami: 'The classic',
      words: 'sudo, claude, hire, train, 42',
      wordsHint: 'type a word',
      doubleClick: 'Replays the entrance animation',
      doubleClickHint: 'double-click the name',
      idle: 'The training run converges on its own',
      idleHint: 'stay still for 45s',
      console: 'In the browser console',
    },
  },

  secretWords: {
    sudo: {
      title: 'permission denied',
      description: 'arthur is not in the sudoers file. This incident will be reported.',
    },
    claude: {
      title: '✳ claude code',
      description: 'Daily driver around here. Good choice of word.',
    },
    hire: {
      title: 'Hiring? Let us talk.',
      description: 'Email copied to your clipboard.',
    },
    train: {
      title: 'Starting training run...',
      description: 'Stay still for 45 seconds and it converges on its own.',
    },
    answer: {
      title: 'The answer.',
      description: 'The question is missing.',
    },
    konami: {
      title: '✓ training converged',
      description: 'You found the Konami code. There is more hidden around here.',
    },
  },

  common: {
    backToTop: 'Back to top',
  },
}
