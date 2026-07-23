# Personal Portfolio

A simple personal portfolio.

## Stack

React 19 · TypeScript · Vite · Three.js · Framer Motion · Tailwind CSS

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

## Scripts

```bash
pnpm build      # production build in dist/
pnpm preview    # preview the build
pnpm lint       # oxlint
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which deploys to
Vercel. Requires the `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`
secrets to be set on the repository.

## License

MIT
