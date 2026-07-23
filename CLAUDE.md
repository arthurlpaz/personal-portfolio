# Personal Portfolio — CLAUDE.md

## Projeto
Portfolio pessoal de Arthur Lincoln da Paz Cristovão — AI/ML Engineer @ NUTES (UEPB/UFCG), Campina Grande, PB.

## Stack
- React 19 + TypeScript + Vite
- Three.js + @react-three/fiber + @react-three/drei (3D background)
- Framer Motion (animações de scroll e transição)
- Tailwind CSS + tailwindcss-animate
- shadcn/ui (componentes em src/components/ui/)
- Fontes: Space Grotesk (display), Inter (body), JetBrains Mono (mono)

## Arquitetura

### Componentes principais (src/components/)
- `NeuralField.tsx` — Canvas Three.js fixo no background. 220 partículas com conexões dinâmicas, reação ao mouse, orbs flutuantes. NÃO modificar sem testar performance.
- `Nav.tsx` — Header glassmorphism com scroll spy e indicador animado (layoutId).
- `Hero.tsx` — Nome, roles, links sociais, CTA. Dados do perfil GitHub: arthurlpaz.
- `About.tsx` — Texto sobre + grid de stats + card "open to work".
- `Expertise.tsx` — 7 domínios técnicos em cards. O último (`llm`, LLMs & Agentes) usa `wide: true` e ocupa a linha inteira para fechar o grid.
- `Projects.tsx` — 6 projetos com filtro por categoria. Dados hardcoded por agora.
- `Timeline.tsx` — Trajetória profissional com linha vertical e marcadores.
- `Contact.tsx` — Links sociais + terminal whoami + footer.

### Design system
- Cores: void (#060a13), deep (#0a1022), navy (#121d35), steel (#4682B4), azure (#8bb8e0), ghost (#e2e8f0), teal (#2dd4bf)
- Classes utilitárias: `.glass`, `.glow-border`, `.text-gradient`, `.font-display`, `.font-mono`
- Padrão: fundo transparente com glassmorphism, sem sombras pesadas

### Regra de conteúdo — ordenação por relevância atual
O perfil é voltado a **IA**. Em toda lista visível (domínios em `Expertise.tsx`,
badges de skill, stats em `About.tsx`, bullets em `Timeline.tsx`, `focus` no
`whoami`, keywords de SEO), o item mais em evidência hoje vem primeiro; legado e
ferramentas de apoio vão para o fim. LLMs e agentes lideram. Ao adicionar
qualquer entrada, reordene em vez de só concatenar no fim.

### Regras
- Todas as animações usam Framer Motion com `useInView({ once: true })`
- Sections seguem o padrão: número + label mono → heading display → conteúdo
- Cards usam `glass glow-border rounded-xl` consistentemente
- Cor primária vem do GitHub profile de Arthur: #4682B4
- Mobile-first responsive (sm, md, lg breakpoints)

## Comandos
```bash
pnpm dev        # dev server http://localhost:5173
pnpm build      # build de produção em dist/
pnpm preview    # preview do build
pnpm lint       # lint com oxlint
```

## Links do Arthur
- GitHub: https://github.com/arthurlpaz
- LinkedIn: https://www.linkedin.com/in/arthurlincolndapaz/
- Email: arthurpcristovao@gmail.com

## TODO (próximas iterações)
- [x] Integrar GitHub API para puxar repos dinamicamente (Projects.tsx, fetch público sem token)
- [ ] Adicionar seção de publicações acadêmicas
- [ ] Dark/light mode toggle
- [ ] Animação de transição entre seções (scroll-snap)
- [x] SEO meta tags completas + og:image (index.html + public/og-image.png)
- [x] Performance: lazy load do Three.js canvas (React.lazy + Suspense em App.tsx)
- [ ] Analytics (Vercel Analytics ou Plausible)
- [ ] i18n (PT-BR / EN toggle)

## CI/CD
- Deploy automático na Vercel via `.github/workflows/deploy.yml` (push na main).
  Requer secrets no repo: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
