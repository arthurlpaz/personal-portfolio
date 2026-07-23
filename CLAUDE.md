# Personal Portfolio — CLAUDE.md

## Project
Personal portfolio for Arthur Lincoln da Paz Cristovão — AI Engineer, Campina Grande, PB.

## Language
- Code, comments, variable names, commit messages and docs: **English**.
- User-facing copy rendered on the page: **Portuguese (pt-BR)** — that is the site's audience.

## Stack
- React 19 + TypeScript + Vite
- Three.js + @react-three/fiber + @react-three/drei (3D background)
- Framer Motion (scroll and transition animations)
- Tailwind CSS + tailwindcss-animate
- shadcn/ui (components under src/components/ui/)
- Fonts: Bricolage Grotesque (display), Inter (body), JetBrains Mono (mono), Fraunces (serif accent)

## Architecture

### Main components (src/components/)
- `ParticleField.tsx` — Fixed Three.js canvas in the background. 220 particles with dynamic connections, mouse reaction, floating orbs. Lazy-loaded from `App.tsx`. Do NOT modify without testing performance.
- `AIMotifs.tsx` — Decorative math/AI motifs (formulas, Gaussian curve, scatter, attention matrix) drifting slowly behind the content, with scroll parallax per depth layer.
- `Nav.tsx` — Glassmorphism header with scroll spy, animated indicator (`layoutId`) and a reading-progress bar.
- `Hero.tsx` — Animated name, roles, social links, CTAs.
- `About.tsx` — Bio copy + stats grid.
- `Expertise.tsx` — 7 technical domains as cards. The first one (`llm`, LLMs & Agentes) uses `wide: true` and spans the full row to lead the grid.
- `Projects.tsx` — Projects pulled from the public GitHub API (no token), with a featured carousel and category filter.
- `Timeline.tsx` — Career trajectory with a scroll-linked progress rail.
- `Contact.tsx` — Social links, whoami terminal with copy-to-clipboard email, footer.
- `ScrollToTop.tsx` — Back-to-top button, appears past the hero.

### Design system
- Colors: void (#060a13), deep (#0a1022), navy (#121d35), steel (#4682B4), azure (#8bb8e0), ghost (#e2e8f0), teal (#2dd4bf)
- Utility classes: `.glass`, `.glow-border`, `.text-gradient`, `.lift`, `.name-breathe`, `.font-display`, `.font-mono`, `.font-serif`
- Pattern: transparent background with glassmorphism, no heavy shadows

### Content rule — order by current relevance
The profile is **AI-oriented**. In every visible list (domains in `Expertise.tsx`,
skill badges, stats in `About.tsx`, bullets in `Timeline.tsx`, `focus` in the
whoami block, SEO keywords), the most prominent item today comes first; legacy
and supporting tools go last. LLMs and agents lead. When adding an entry,
reorder the list instead of appending to the end.

### Content rule — no institutions or employer projects
Do not name institutions (NUTES, UEPB, UFCG) or specific work projects
(ProtesIA, HUAC, DATASUS, client names). Keep the copy at capability level.
This applies to `index.html` meta tags too — they are what Google and link
previews show. Exception: the Projects section lists public GitHub repos by
their real names.

### Rules
- Scroll reveals use Framer Motion with `useInView({ once: true })`
- Sections follow the pattern: number + mono label → display heading → content
- Cards consistently use `glass glow-border rounded-xl`
- Primary color comes from Arthur's GitHub profile: #4682B4
- Mobile-first responsive (sm, md, lg breakpoints)
- Animate transform/opacity only — never layout properties
- `prefers-reduced-motion` must be respected: motion stops, content stays visible
- Interactive elements need a visible `:focus-visible` ring

## Commands
```bash
pnpm dev        # dev server http://localhost:5173
pnpm build      # production build in dist/
pnpm preview    # preview the build
pnpm lint       # lint with oxlint
```

## Arthur's links
- GitHub: https://github.com/arthurlpaz
- LinkedIn: https://www.linkedin.com/in/arthurlincolndapaz/
- Email: arthurpcristovao@gmail.com

## TODO (next iterations)
- [x] Pull repos dynamically from the GitHub API (Projects.tsx, public fetch, no token)
- [ ] Add an academic publications section
- [ ] Dark/light mode toggle
- [ ] Section transition animation (scroll-snap)
- [x] Full SEO meta tags + og:image (index.html + public/og-image.png)
- [x] Performance: lazy load the Three.js canvas (React.lazy + Suspense in App.tsx)
- [x] Analytics (Vercel Analytics + Speed Insights)
- [ ] i18n (pt-BR / EN toggle)

## CI/CD
- Automatic deploy to Vercel via `.github/workflows/deploy.yml` (push to main).
  Requires repo secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
