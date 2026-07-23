# Neural Portfolio

Portfolio pessoal — Arthur Lincoln da Paz Cristovão  
AI/ML Engineer @ NUTES (UEPB/UFCG)

## Stack

- **React 19** + TypeScript
- **Vite** (build tool)
- **Three.js** + React Three Fiber (3D neural network background)
- **Framer Motion** (scroll animations)
- **Tailwind CSS** + shadcn/ui (design system)
- **Space Grotesk** / **JetBrains Mono** (typography)

## Rodando local

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Deploy

Push para o GitHub e conecte na **Vercel** — detecta o Vite automaticamente.

## Estrutura

```
src/
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── NeuralField.tsx # 3D particle network (Three.js)
│   ├── Nav.tsx         # Glassmorphism navigation
│   ├── Hero.tsx        # Hero section with animated intro
│   ├── About.tsx       # About + stats cards
│   ├── Expertise.tsx   # Skills grid (expandable cards)
│   ├── Projects.tsx    # Project cards with filter
│   ├── Timeline.tsx    # Career trajectory
│   └── Contact.tsx     # Contact + footer
├── hooks/
├── lib/
├── App.tsx
├── main.tsx
└── index.css           # Custom theme + Tailwind
```

## Licença

MIT
