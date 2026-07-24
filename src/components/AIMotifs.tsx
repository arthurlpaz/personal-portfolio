import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useKonami } from '@/hooks/useKonami'

/**
 * Subtle background layer of AI / math / statistics motifs — vectors, a Gaussian
 * curve, a scatter + regression line, an attention matrix and a few formulas.
 * Purely decorative and non-interactive.
 *
 * Motion model: each motif drifts along its own slow, open path. The x, y,
 * rotation and opacity tracks run at deliberately mismatched durations, so the
 * combined loop only closes after several minutes — the field reads as
 * continuously moving rather than as a bobbing loop. On top of that, scroll
 * drives a small parallax offset per depth layer, so the background feels
 * further away than the content. Everything is transform/opacity only.
 */

const STEEL = '#4682B4'
const AZURE = '#8bb8e0'
const TEAL = '#2dd4bf'
const VIOLET = '#a78bfa'
const CORAL = '#d97757'
const GHOST = '#e2e8f0'

// Gaussian bell-curve path (statistics motif), generated once.
const bell = (() => {
  const pts = Array.from({ length: 49 }, (_, i) => {
    const x = i * 2.5
    const y = 60 - 46 * Math.exp(-Math.pow((x - 60) / 20, 2))
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return {
    line: 'M' + pts.join(' L'),
    area: 'M0,60 L' + pts.join(' L') + ' L120,60 Z',
  }
})()

function Distribution() {
  return (
    <svg width="140" height="82" viewBox="0 0 120 70" fill="none">
      <path d={bell.area} fill={TEAL} opacity="0.06" />
      <line x1="0" y1="60" x2="120" y2="60" stroke={AZURE} strokeWidth="0.6" opacity="0.5" />
      <line x1="60" y1="14" x2="60" y2="60" stroke={AZURE} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
      <path d={bell.line} fill="none" stroke={TEAL} strokeWidth="1.2" />
      <text x="52" y="69" fill={AZURE} fontSize="6" fontFamily="monospace">μ</text>
    </svg>
  )
}

function Vectors() {
  // A small vector field: arrows from a shared origin.
  const arrows = [
    { x: 70, y: 20 },
    { x: 78, y: 46 },
    { x: 50, y: 62 },
    { x: 22, y: 40 },
  ]
  return (
    <svg width="110" height="88" viewBox="0 0 90 72" fill="none">
      <defs>
        <marker id="vhead" markerWidth="6" markerHeight="6" refX="4.5" refY="3" orient="auto">
          <path d="M0,0 L5,3 L0,6 Z" fill={STEEL} />
        </marker>
      </defs>
      {arrows.map((a, i) => (
        <line
          key={i}
          x1="20"
          y1="52"
          x2={a.x}
          y2={a.y}
          stroke={STEEL}
          strokeWidth="1.1"
          markerEnd="url(#vhead)"
        />
      ))}
      <circle cx="20" cy="52" r="1.8" fill={AZURE} />
      <text x="2" y="14" fill={STEEL} fontSize="7" fontFamily="monospace">v⃗</text>
    </svg>
  )
}

function Scatter() {
  // Scatter points with a fitted regression line (ML/stats motif).
  const pts = [
    [8, 54], [18, 50], [26, 44], [33, 47], [42, 38],
    [50, 34], [58, 31], [67, 26], [76, 22], [86, 16],
  ]
  return (
    <svg width="120" height="80" viewBox="0 0 100 64" fill="none">
      <line x1="4" y1="60" x2="96" y2="60" stroke={AZURE} strokeWidth="0.6" opacity="0.4" />
      <line x1="4" y1="4" x2="4" y2="60" stroke={AZURE} strokeWidth="0.6" opacity="0.4" />
      <line x1="6" y1="56" x2="92" y2="14" stroke={TEAL} strokeWidth="1" strokeDasharray="4 3" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.7" fill={STEEL} />
      ))}
    </svg>
  )
}

// Deterministic pseudo-random so the matrix looks organic but never re-renders
// differently between mounts.
const attnCells = Array.from({ length: 36 }, (_, i) => {
  const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
  return { r, c: i % 6, row: Math.floor(i / 6) }
})

function AttentionMatrix() {
  // 6x6 attention heatmap — the transformer motif.
  return (
    <svg width="96" height="96" viewBox="0 0 66 66" fill="none">
      {attnCells.map((cell, i) => (
        <rect
          key={i}
          x={cell.c * 11}
          y={cell.row * 11}
          width="9.5"
          height="9.5"
          rx="1"
          fill={VIOLET}
          opacity={0.12 + cell.r * 0.55}
        />
      ))}
      <text x="0" y="65" fill={VIOLET} fontSize="6" fontFamily="monospace">QKᵀ</text>
    </svg>
  )
}

function Relu() {
  // ReLU activation, drawn on a small pair of axes.
  return (
    <svg width="104" height="70" viewBox="0 0 88 58" fill="none">
      <line x1="4" y1="46" x2="84" y2="46" stroke={AZURE} strokeWidth="0.6" opacity="0.4" />
      <line x1="44" y1="6" x2="44" y2="52" stroke={AZURE} strokeWidth="0.6" opacity="0.4" />
      <path d="M6,46 L44,46 L82,10" fill="none" stroke={STEEL} strokeWidth="1.3" />
      <text x="52" y="56" fill={STEEL} fontSize="6" fontFamily="monospace">max(0,x)</text>
    </svg>
  )
}

// Loss-landscape contours: nested, slightly irregular ellipses around a
// minimum. Generated once so every mount draws the same surface.
const contours = Array.from({ length: 5 }, (_, i) => {
  const t = i + 1
  const rx = 9 * t
  const ry = 6.4 * t
  // Squash each ring a little differently so the surface reads as organic
  // rather than as a set of perfect concentric ellipses.
  const skew = 1 + Math.sin(t * 1.7) * 0.16
  return { rx, ry: ry * skew, opacity: 0.5 - i * 0.07 }
})

function LossLandscape() {
  // The only closed-curve form in the field. The dashed path is a gradient
  // descent trajectory: it overshoots, corrects, and settles at the minimum.
  const descent = 'M12,14 L34,30 L24,44 L44,49 L38,56 L48,57.5 L45.5,60 L49,60.5'
  return (
    <svg width="132" height="108" viewBox="0 0 100 82" fill="none">
      <g transform="translate(50 60)">
        {contours.map((c, i) => (
          <ellipse
            key={i}
            rx={c.rx}
            ry={c.ry}
            fill="none"
            stroke={i === 0 ? TEAL : STEEL}
            strokeWidth={i === 0 ? 1 : 0.7}
            opacity={c.opacity}
          />
        ))}
      </g>
      <path d={descent} fill="none" stroke={TEAL} strokeWidth="0.9" strokeDasharray="3 2.5" />
      <circle cx="12" cy="14" r="1.6" fill={AZURE} />
      <circle cx="50" cy="60" r="2" fill={TEAL} />
      <text x="2" y="78" fill={STEEL} fontSize="6" fontFamily="monospace">J(θ)</text>
    </svg>
  )
}

// A twelve-ray burst. Deliberately a generic geometric glyph rather than a
// traced brand logo: an approximate logo reads worse than an honest mark.
// Swap in the official SVG from the vendor press kit if exact branding is wanted.
const burstRays = Array.from({ length: 12 }, (_, i) => (i * 360) / 12)

function ToolBadge({ label, glyph, color }: { label: string; glyph: 'burst' | 'hex'; color: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono whitespace-nowrap">
      <svg width="16" height="16" viewBox="-10 -10 20 20" fill="none" aria-hidden>
        {glyph === 'burst' ? (
          burstRays.map((deg) => (
            <rect
              key={deg}
              x="-0.9"
              y="-8.5"
              width="1.8"
              height="7"
              rx="0.9"
              fill={color}
              transform={`rotate(${deg})`}
            />
          ))
        ) : (
          <>
            <path
              d="M0,-8.5 L7.4,-4.25 L7.4,4.25 L0,8.5 L-7.4,4.25 L-7.4,-4.25 Z"
              stroke={color}
              strokeWidth="1.3"
              fill="none"
            />
            <circle r="2" fill={color} />
          </>
        )}
      </svg>
      {label}
    </span>
  )
}

// A tokenised sentence — the step every LLM pipeline starts with.
const tokens = ['[CLS]', 'the', 'model', 'ships', '[SEP]']

function TokenStrip() {
  return (
    <svg width="176" height="34" viewBox="0 0 148 28" fill="none">
      {tokens.map((t, i) => {
        const x = i * 29.5
        return (
          <g key={t}>
            <rect x={x} y="2" width="27" height="14" rx="2.5" stroke={VIOLET} strokeWidth="0.7" fill="none" />
            <text x={x + 13.5} y="11.5" fill={VIOLET} fontSize="5.4" fontFamily="monospace" textAnchor="middle">
              {t}
            </text>
            <line x1={x + 13.5} y1="16" x2={x + 13.5} y2="22" stroke={VIOLET} strokeWidth="0.5" opacity="0.6" />
            <circle cx={x + 13.5} cy="24" r="1.4" fill={VIOLET} opacity="0.7" />
          </g>
        )
      })}
    </svg>
  )
}

// Hierarchy — the one structural form the field was missing.
function DecisionTree() {
  const edges = [
    [42, 10, 20, 30], [42, 10, 64, 30],
    [20, 30, 8, 52], [20, 30, 32, 52],
    [64, 30, 54, 52], [64, 30, 78, 52],
  ]
  const leaves = [8, 32, 54, 78]
  return (
    <svg width="116" height="86" viewBox="0 0 88 64" fill="none">
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STEEL} strokeWidth="0.8" opacity="0.7" />
      ))}
      <circle cx="42" cy="10" r="3" fill={TEAL} />
      <circle cx="20" cy="30" r="2.4" fill={STEEL} />
      <circle cx="64" cy="30" r="2.4" fill={STEEL} />
      {leaves.map((x) => (
        <rect key={x} x={x - 2.2} y="49.5" width="4.4" height="4.4" rx="0.8" fill={AZURE} opacity="0.8" />
      ))}
      <text x="46" y="16" fill={AZURE} fontSize="5" fontFamily="monospace">x&lt;t</text>
    </svg>
  )
}

// A 3x3 kernel sweeping a feature map. The only motif with motion of its own,
// so it reads as computation rather than as another static diagram.
function ConvKernel() {
  const cells = Array.from({ length: 36 }, (_, i) => ({ c: i % 6, r: Math.floor(i / 6) }))
  return (
    <svg width="100" height="100" viewBox="0 0 72 72" fill="none">
      {cells.map(({ c, r }, i) => (
        <rect
          key={i}
          x={c * 12}
          y={r * 12}
          width="10.5"
          height="10.5"
          rx="1"
          fill={STEEL}
          opacity={0.1 + (Math.abs(Math.sin(i * 7.3)) % 1) * 0.3}
        />
      ))}
      <motion.rect
        width="34.5"
        height="34.5"
        rx="1.5"
        fill="none"
        stroke={TEAL}
        strokeWidth="1.2"
        animate={{ x: [0, 36, 36, 0, 0], y: [0, 0, 36, 36, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }}
      />
    </svg>
  )
}

// Observed series continuing into a dashed forecast with a confidence band.
function Forecast() {
  const obs = 'M2,40 L12,34 L22,37 L32,28 L42,31 L52,22'
  const fut = 'M52,22 L62,18 L72,12 L82,9'
  return (
    <svg width="128" height="72" viewBox="0 0 88 52" fill="none">
      <path d="M52,22 L82,3 L82,15 L52,22 Z" fill={TEAL} opacity="0.07" />
      <line x1="2" y1="46" x2="86" y2="46" stroke={AZURE} strokeWidth="0.6" opacity="0.4" />
      <line x1="52" y1="4" x2="52" y2="46" stroke={AZURE} strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
      <path d={obs} fill="none" stroke={STEEL} strokeWidth="1.2" />
      <path d={fut} fill="none" stroke={TEAL} strokeWidth="1.2" strokeDasharray="3 2" />
      <text x="56" y="51" fill={TEAL} fontSize="5" fontFamily="monospace">t+n</text>
    </svg>
  )
}

function Formula({ children }: { children: ReactNode }) {
  return <span className="font-mono whitespace-nowrap">{children}</span>
}

interface Motif {
  el: ReactNode
  style: CSSProperties
  color?: string
  size?: number
  /** Base cycle length in seconds for the vertical track. */
  dur: number
  delay: number
  /** Travel amplitude in px — horizontal and vertical. */
  dx: number
  dy: number
  /** Parallax strength, 0 = pinned, 1 = full. Reads as distance. */
  depth: number
}

const motifs: Motif[] = [
  { el: <Distribution />, style: { top: '11%', right: '5%' }, dur: 76, delay: 0, dx: 34, dy: 26, depth: 0.35 },
  { el: <Vectors />, style: { top: '46%', left: '3%' }, dur: 88, delay: 1.2, dx: 28, dy: 30, depth: 0.55 },
  { el: <Scatter />, style: { bottom: '22%', left: '6%' }, dur: 71, delay: 0.6, dx: 40, dy: 24, depth: 0.4 },
  { el: <AttentionMatrix />, style: { top: '58%', right: '13%' }, dur: 94, delay: 2.4, dx: 30, dy: 34, depth: 0.7 },
  { el: <LossLandscape />, style: { top: '20%', right: '28%' }, dur: 85, delay: 3.8, dx: 30, dy: 26, depth: 0.6 },
  { el: <TokenStrip />, style: { top: '76%', left: '30%' }, dur: 99, delay: 5.1, dx: 36, dy: 20, depth: 0.8 },
  { el: <DecisionTree />, style: { top: '88%', right: '34%' }, dur: 81, delay: 6.3, dx: 28, dy: 22, depth: 0.45 },
  { el: <ConvKernel />, style: { top: '63%', left: '15%' }, dur: 107, delay: 5.7, dx: 26, dy: 30, depth: 0.75 },
  { el: <Forecast />, style: { top: '4%', right: '17%' }, dur: 89, delay: 7.1, dx: 34, dy: 20, depth: 0.5 },
  { el: <ToolBadge label="claude code" glyph="burst" color={CORAL} />, style: { top: '41%', right: '20%' }, color: CORAL, size: 12, dur: 92, delay: 2.2, dx: 32, dy: 24, depth: 0.7 },
  { el: <ToolBadge label="codex" glyph="hex" color={GHOST} />, style: { top: '9%', left: '24%' }, color: GHOST, size: 12, dur: 105, delay: 4.6, dx: 34, dy: 22, depth: 0.55 },
  { el: <Relu />, style: { top: '34%', left: '38%' }, dur: 103, delay: 3.1, dx: 44, dy: 22, depth: 0.85 },
  { el: <Formula>σ(z) = 1 / (1 + e⁻ᶻ)</Formula>, style: { top: '30%', right: '7%' }, color: AZURE, size: 13, dur: 82, delay: 0.3, dx: 36, dy: 20, depth: 0.5 },
  { el: <Formula>ŷ = Wx + b</Formula>, style: { bottom: '26%', right: '9%' }, color: TEAL, size: 14, dur: 67, delay: 1.6, dx: 30, dy: 26, depth: 0.3 },
  { el: <Formula>∇θ J(θ)</Formula>, style: { top: '68%', left: '4%' }, color: AZURE, size: 15, dur: 91, delay: 0.9, dx: 26, dy: 18, depth: 0.45 },
  { el: <Formula>P(y | x) = softmax(z)</Formula>, style: { top: '15%', left: '7%' }, color: STEEL, size: 12, dur: 98, delay: 2, dx: 38, dy: 22, depth: 0.6 },
  { el: <Formula>[ w₁ w₂ · · wₙ ]</Formula>, style: { bottom: '40%', left: '2%' }, color: STEEL, size: 12, dur: 74, delay: 1.1, dx: 24, dy: 16, depth: 0.25 },
  { el: <Formula>Σ ∂L/∂w</Formula>, style: { top: '82%', right: '10%' }, color: TEAL, size: 14, dur: 86, delay: 0.4, dx: 32, dy: 20, depth: 0.65 },
  { el: <Formula>argmin ‖y − ŷ‖²</Formula>, style: { top: '52%', left: '46%' }, color: VIOLET, size: 12, dur: 109, delay: 4.2, dx: 46, dy: 28, depth: 0.9 },
  { el: <Formula>H(p) = −Σ p log p</Formula>, style: { top: '5%', left: '42%' }, color: AZURE, size: 12, dur: 96, delay: 3.5, dx: 40, dy: 24, depth: 0.75 },
  { el: <Formula>x ~ 𝒩(μ, σ²)</Formula>, style: { bottom: '6%', right: '30%' }, color: TEAL, size: 13, dur: 79, delay: 2.8, dx: 34, dy: 22, depth: 0.5 },
]

function Drifter({ m, index }: { m: Motif; index: number }) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Deeper motifs travel further as the page scrolls; alternating sign keeps the
  // field from sliding as one block.
  const shift = m.depth * 120 * (index % 2 === 0 ? -1 : 1)
  const parallax = useTransform(scrollYProgress, [0, 1], [0, shift])

  if (reduced) {
    return (
      <div
        className="absolute"
        style={{ ...m.style, color: m.color, fontSize: m.size, opacity: 0.14 }}
      >
        {m.el}
      </div>
    )
  }

  return (
    <motion.div className="absolute" style={{ ...m.style, y: parallax }}>
      <motion.div
        style={{ color: m.color, fontSize: m.size }}
        animate={{
          x: [0, m.dx, m.dx * 0.2, -m.dx * 0.7, 0],
          y: [0, -m.dy * 0.8, -m.dy, m.dy * 0.5, 0],
          rotate: [0, 1.6, -1.2, 0.8, 0],
          opacity: [0.09, 0.17, 0.12, 0.18, 0.09],
        }}
        transition={{
          // Mismatched, near-coprime cycle lengths: the paths never visually
          // re-align, so the drift reads as organic instead of looped.
          x: { duration: m.dur * 1.41, repeat: Infinity, ease: 'easeInOut', delay: m.delay },
          y: { duration: m.dur, repeat: Infinity, ease: 'easeInOut', delay: m.delay },
          rotate: { duration: m.dur * 1.83, repeat: Infinity, ease: 'easeInOut', delay: m.delay },
          opacity: { duration: m.dur * 0.61, repeat: Infinity, ease: 'easeInOut', delay: m.delay },
        }}
      >
        {m.el}
      </motion.div>
    </motion.div>
  )
}

const TOTAL_EPOCHS = 50

/**
 * A training run ticking in the corner. Unlike the rest of the field, which is
 * abstract maths, this suggests work actually happening — and it speaks the
 * same monospace language as the `$ whoami` block in the contact section.
 * The curves are closed-form, not random: loss decays, accuracy saturates.
 */
const IDLE_MS = 45_000

function TrainingLog({ boost }: { boost: number }) {
  const reduced = useReducedMotion()
  const [epoch, setEpoch] = useState(7)
  const [converged, setConverged] = useState(false)

  useEffect(() => {
    if (reduced || converged) return
    const id = setInterval(() => setEpoch((e) => (e % TOTAL_EPOCHS) + 1), 3200)
    return () => clearInterval(id)
  }, [reduced, converged])

  // Easter egg: stand still long enough and the run finishes. It restarts on
  // the next interaction, so an idle tab is never stuck on the end state.
  useEffect(() => {
    if (reduced) return
    let timer = 0
    const arm = () => {
      clearTimeout(timer)
      if (converged) setConverged(false)
      timer = window.setTimeout(() => setConverged(true), IDLE_MS)
    }
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }))
    arm()
    return () => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, arm))
    }
  }, [reduced, converged])

  // Konami jumps the run straight to the finish line.
  useEffect(() => {
    if (boost > 0) setConverged(true)
  }, [boost])

  const shown = converged ? TOTAL_EPOCHS : epoch
  const loss = (0.86 * Math.exp(-shown / 13) + 0.019).toFixed(4)
  const acc = (0.62 + 0.33 * (1 - Math.exp(-shown / 11))).toFixed(3)

  return (
    <div
      className="absolute bottom-6 left-6 font-mono text-[11px] whitespace-nowrap transition-opacity duration-1000"
      style={{ color: converged ? TEAL : AZURE, opacity: converged ? 0.34 : 0.14 }}
    >
      <span style={{ color: TEAL }}>{converged ? '✓' : '▸'}</span> epoch{' '}
      {String(shown).padStart(2, '0')}/{TOTAL_EPOCHS}
      {' · '}loss {loss}
      {' · '}val_acc {acc}
      {converged && ' · converged'}
    </div>
  )
}

export default function AIMotifs() {
  const konami = useKonami()
  const [glow, setGlow] = useState(false)

  // The whole field lights up for a few seconds, then settles back. Kept
  // transient on purpose: a permanent filter would keep an extra composited
  // layer alive for the rest of the session.
  useEffect(() => {
    if (konami === 0) return
    setGlow(true)
    const t = setTimeout(() => setGlow(false), 7000)
    return () => clearTimeout(t)
  }, [konami])

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none transition-[filter] duration-1000"
      style={{ filter: glow ? 'brightness(3.2) saturate(1.4)' : 'none' }}
      aria-hidden
    >
      {motifs.map((m, i) => (
        <Drifter key={i} m={m} index={i} />
      ))}
      <TrainingLog boost={konami} />
    </div>
  )
}
