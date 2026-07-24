import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Star, GitFork, ArrowUpRight, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useI18n } from '@/i18n/useI18n'
import type { Dictionary } from '@/i18n/pt'

interface Project {
  id: string
  title: string
  repo: string
  description: string
  topics: string[]
  language: string
  color: string
  stars: number
  forks: number
  updatedAt: string
  link: string
  ai: number // AI-relevance score (higher = more clearly an AI/ML project)
}

// Keywords used to detect (and rank up) AI/ML-related repositories.
const AI_KEYWORDS = [
  'ai', 'ml', 'ia', 'neural', 'deep', 'learning', 'llm', 'gpt', 'rag', 'nlp',
  'vision', 'segment', 'forecast', 'churn', 'mnist', 'iris', 'attrition',
  'obesity', 'predict', 'classif', 'regress', 'mlops', 'deploy', 'recognition',
  'image-processing', 'dataset', 'data-analysis', 'pytorch', 'tensorflow',
  'sklearn', 'scikit', 'transformer', 'chatbot', 'agent', 'embedding', 'model',
]

function aiScore(repo: GitHubRepo): number {
  const hay = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')} ${repo.language ?? ''}`.toLowerCase()
  return AI_KEYWORDS.reduce((n, kw) => (hay.includes(kw) ? n + 1 : n), 0)
}

const GITHUB_USER = 'arthurlpaz'

// GitHub linguist-inspired language → accent color map (aligned with design system)
const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  'Jupyter Notebook': '#DA5B0B',
  C: '#8bb8e0',
  'C++': '#f34b7d',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Go: '#00ADD8',
  Rust: '#dea584',
}

const DEFAULT_COLOR = '#4682B4' // steel — Arthur's GitHub profile color

function colorForLanguage(language: string | null): string {
  if (!language) return DEFAULT_COLOR
  return LANGUAGE_COLORS[language] ?? DEFAULT_COLOR
}

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  topics?: string[]
  fork: boolean
  archived: boolean
  pushed_at: string
  updated_at: string
}

const ACRONYMS: Record<string, string> = {
  ml: 'ML', ai: 'AI', mlops: 'MLOps', llm: 'LLM', api: 'API', eda: 'EDA',
  sus: 'SUS', mnist: 'MNIST', ct: 'CT', nlp: 'NLP', ui: 'UI', ux: 'UX',
}

function titleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .map((w) => ACRONYMS[w.toLowerCase()] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Takes the dictionary slice rather than reading context: this is called from
// render paths that already have `t` in hand.
function relativeTime(iso: string, time: Dictionary['projects']['time']): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days <= 0) return time.today
  if (days === 1) return time.yesterday
  if (days < 30) return time.days(days)
  const months = Math.floor(days / 30)
  if (months < 12) return time.months(months)
  return time.years(Math.floor(months / 12))
}

function repoToProject(repo: GitHubRepo, t: Dictionary): Project {
  return {
    id: String(repo.id),
    title: titleCase(repo.name),
    repo: repo.name,
    description: repo.description ?? t.projects.noDescription,
    topics: repo.topics ?? [],
    language: repo.language ?? t.projects.otherLanguage,
    color: colorForLanguage(repo.language),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    link: repo.html_url,
    ai: aiScore(repo),
  }
}

async function fetchProjects(signal: AbortSignal, t: Dictionary): Promise<Project[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
    { headers: { Accept: 'application/vnd.github+json' }, signal },
  )
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`)

  const repos: GitHubRepo[] = await res.json()
  const mapped = repos
    .filter((r) => !r.fork && !r.archived && r.name !== GITHUB_USER)
    .map((repo) => repoToProject(repo, t))
    // AI/ML projects first, then by stars, then most recently pushed
    .sort(
      (a, b) =>
        b.ai - a.ai ||
        b.stars - a.stars ||
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 9)

  if (mapped.length === 0) throw new Error('No public repos returned')
  return mapped
}

// Curated fallback used when the GitHub API is unreachable or rate-limited.
// Built from the dictionary so it follows the active language.
function buildFallback(t: Dictionary): Project[] {
  const base = {
    topics: [] as string[],
    language: 'Python',
    color: colorForLanguage('Python'),
    stars: 0,
    forks: 0,
    updatedAt: new Date().toISOString(),
    link: `https://github.com/${GITHUB_USER}`,
    ai: 4,
  }
  return [
    {
      ...base,
      id: 'segmentation',
      repo: 'protesia-segmentation',
      topics: ['pytorch', 'nnunet', 'medical-imaging', 'dicom', 'segmentation'],
      ...t.projects.fallback.segmentation,
    },
    {
      ...base,
      id: 'forecast',
      repo: 'volt-forecast',
      topics: ['mlops', 'forecasting', 'python', 'poetry', 'pydantic'],
      ...t.projects.fallback.forecast,
    },
    {
      ...base,
      id: 'chatbot',
      repo: 'llm-memory-chatbot',
      topics: ['fastapi', 'langgraph', 'sqlite-vec', 'llm', 'ollama'],
      ...t.projects.fallback.chatbot,
    },
  ]
}

function RepoLink({ href, className = '' }: { href: string; className?: string }) {
  const { t } = useI18n()
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/link inline-flex items-center gap-1.5 rounded text-sm text-azure/80 transition-colors hover:text-azure ${className}`}
    >
      {t.projects.viewOnGitHub}
      <ArrowUpRight
        className="w-3.5 h-3.5 transition-transform duration-300
          group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
      />
    </a>
  )
}

function ProjectCard({
  project,
  index,
  featured,
}: {
  project: Project
  index: number
  featured?: boolean
}) {
  const { t } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.06 }}
      className={featured ? 'md:col-span-2' : ''}
    >
      <Card
        className="group lift relative h-full overflow-hidden border-border/60 bg-card/60 backdrop-blur-xl"
        // --pc carries the project colour into hover states that Tailwind
        // cannot express statically.
        style={{ borderTopColor: `${project.color}66`, ['--pc' as string]: project.color }}
      >
        {/* Wash in the project's own colour, bleeding down from the top edge. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500
            group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${project.color}1f 0%, transparent 70%)`,
          }}
          aria-hidden
        />
        <CardContent className={`relative ${featured ? 'p-7' : 'p-6'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: project.color }}
                  aria-hidden
                />
                <span className="font-mono text-xs text-muted-foreground truncate">
                  {project.language}
                </span>
                <span className="font-mono text-xs text-muted-foreground/50">·</span>
                <span className="font-mono text-xs text-muted-foreground/60">
                  {relativeTime(project.updatedAt, t.projects.time)}
                </span>
              </div>
              <h3
                className={`font-display font-bold text-foreground transition-colors duration-300
                  group-hover:text-[var(--pc)] ${featured ? 'text-2xl' : 'text-xl'}`}
              >
                {project.title}
              </h3>
              <p className="font-mono text-xs text-muted-foreground/70 mt-0.5">
                {GITHUB_USER}/{project.repo}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-mono text-xs text-muted-foreground">
              {project.ai > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 text-teal px-2 py-0.5">
                  <Sparkles className="w-3 h-3" /> IA
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5" /> {project.stars}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5" /> {project.forks}
              </span>
            </div>
          </div>

          <p
            className={`text-muted-foreground leading-relaxed mt-4 ${
              featured ? 'text-[15px] max-w-2xl' : 'text-sm line-clamp-3'
            }`}
          >
            {project.description}
          </p>

          {project.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {project.topics.slice(0, featured ? 8 : 4).map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="font-mono text-[11px] font-normal bg-secondary/60 text-muted-foreground hover:bg-secondary"
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/50">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-foreground/80 hover:text-foreground hover:bg-secondary/60"
                >
                  Detalhes
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-foreground flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: project.color }}
                    />
                    {project.title}
                  </DialogTitle>
                  <DialogDescription className="font-mono text-xs">
                    {GITHUB_USER}/{project.repo} · {project.language}
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                {project.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.topics.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="font-mono text-[11px] font-normal"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground font-mono">
                  <span className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" /> {project.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" /> {project.forks}
                    </span>
                  </span>
                  <span>{t.projects.updated} {relativeTime(project.updatedAt, t.projects.time)}</span>
                </div>
                <RepoLink href={project.link} className="mt-1" />
              </DialogContent>
            </Dialog>

            <RepoLink href={project.link} className="ml-auto" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProjectSkeleton({ featured }: { featured?: boolean }) {
  return (
    <div className={featured ? 'md:col-span-2' : ''}>
      <Card className="h-full border-border/60 bg-card/40 animate-pulse">
        <CardContent className="p-6 space-y-4">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-6 w-2/3 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted/60" />
          <div className="h-3 w-5/6 rounded bg-muted/60" />
          <div className="flex gap-1.5 pt-2">
            <div className="h-5 w-12 rounded bg-muted" />
            <div className="h-5 w-16 rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <Card className="relative h-full overflow-hidden border-border/60 bg-card/60 backdrop-blur-xl">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{ background: project.color }}
      />
      <CardContent className="relative flex h-full min-h-[320px] flex-col p-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: project.color }} aria-hidden />
          <span className="font-mono text-xs text-muted-foreground">{project.language}</span>
          {project.ai > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 font-mono text-xs text-teal">
              <Sparkles className="h-3 w-3" /> IA
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{project.title}</h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground/70">
          {GITHUB_USER}/{project.repo}
        </p>

        <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{project.description}</p>

        {project.topics.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.topics.slice(0, 6).map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="bg-secondary/60 font-mono text-[11px] font-normal text-muted-foreground"
              >
                {t}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-5 border-t border-border/50 pt-5 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5" /> {project.stars}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" /> {project.forks}
          </span>
          <RepoLink href={project.link} className="ml-auto" />
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturedCarousel({ projects }: { projects: Project[] }) {
  const { t } = useI18n()
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const [count, setCount] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setSelected(api.selectedScrollSnap())
    const onSelect = () => setSelected(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  // Lightweight autoplay (no extra plugin) — pauses on hover/focus.
  useEffect(() => {
    if (!api || paused) return
    const id = setInterval(() => api.scrollNext(), 4500)
    return () => clearInterval(id)
  }, [api, paused])

  return (
    <div
      className="mb-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          ✦ {t.projects.featured}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground/50">
          {selected + 1} / {count}
        </span>
      </div>

      <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }}>
        <CarouselContent className="-ml-4">
          {projects.map((project) => (
            <CarouselItem key={project.id} className="pl-4 basis-full sm:basis-4/5 lg:basis-3/5">
              <FeaturedCard project={project} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden border-border bg-card/80 text-foreground hover:bg-secondary sm:flex" />
        <CarouselNext className="hidden border-border bg-card/80 text-foreground hover:bg-secondary sm:flex" />
      </Carousel>

      <div className="mt-5 flex items-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            aria-label={`${t.projects.goToFeatured} ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === selected ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const ALL = '__all__'

export default function Projects() {
  const { t, lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [filter, setFilter] = useState(ALL)

  // `lang` is part of the key because the mapped projects embed localised
  // fallbacks for repos with no description or language.
  const query = useQuery({
    queryKey: ['github-repos', GITHUB_USER, lang],
    queryFn: ({ signal }) => fetchProjects(signal, t),
  })

  // On error (rate limit / offline) fall back to the curated list so it's never empty.
  const projects: Project[] =
    query.status === 'success' ? query.data : query.status === 'error' ? buildFallback(t) : []
  const status: 'loading' | 'live' | 'fallback' =
    query.status === 'pending' ? 'loading' : query.status === 'error' ? 'fallback' : 'live'

  const languages = [ALL, ...Array.from(new Set(projects.map((p) => p.language)))]
  const filtered = filter === ALL ? projects : projects.filter((p) => p.language === filter)

  // Featured = top AI/ML projects (fall back to top overall if none scored)
  const aiProjects = projects.filter((p) => p.ai > 0)
  const featuredList = (aiProjects.length ? aiProjects : projects).slice(0, 6)
  const showCarousel = filter === ALL && featuredList.length >= 2

  return (
    <section id="projects" className="py-28 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
        >
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              {t.projects.heading}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">{t.projects.subheading}</p>
          </div>

          {status !== 'loading' && languages.length > 1 && (
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-secondary/40 flex-wrap h-auto">
                {languages.map((value) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    {value === ALL ? t.projects.all : value}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </motion.div>

        {status !== 'loading' && showCarousel && <FeaturedCarousel projects={featuredList} />}

        {status === 'loading' ? (
          <div className="grid md:grid-cols-2 gap-4">
            <ProjectSkeleton featured />
            <ProjectSkeleton />
            <ProjectSkeleton />
          </div>
        ) : (
          <>
            {showCarousel && (
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
                {t.projects.allRepos}
              </p>
            )}
            <motion.div layout className="grid md:grid-cols-2 gap-4">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </>
        )}

        <p className="font-mono text-xs text-muted-foreground/50 mt-8">
          {status === 'live' && `↳ github.com/${GITHUB_USER} · ${t.projects.liveFromApi}`}
          {status === 'fallback' && `↳ ${t.projects.fallbackNotice}`}
        </p>
      </div>
    </section>
  )
}
