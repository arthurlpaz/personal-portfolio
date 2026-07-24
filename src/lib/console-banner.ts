/**
 * Anyone who opens devtools on a portfolio is either a developer or a
 * recruiter with a technical bent — the two audiences worth talking to. This
 * is the cheapest possible message to them.
 */
export function printConsoleBanner() {
  const heading = [
    'color:#2dd4bf',
    'font-family:monospace',
    'font-size:13px',
    'line-height:1.35',
  ].join(';')

  const body = ['color:#8bb8e0', 'font-family:monospace', 'font-size:12px'].join(';')
  const dim = ['color:#4a5568', 'font-family:monospace', 'font-size:11px'].join(';')

  console.log(
    `%c
   ┌───────────────────────────────┐
   │  A R T H U R   L I N C O L N  │
   │  AI Engineer                  │
   └───────────────────────────────┘
`,
    heading,
  )
  // English regardless of the page language: the console is a developer
  // surface, and the codebase convention is English.
  console.log(
    '%cYou opened devtools. Respect.\n' +
      'If you got this far, we should probably talk.\n' +
      'arthurpcristovao@gmail.com',
    body,
  )
  console.log(
    '%chint: ⌘K opens the command palette. the konami code does something.\n' +
      'and there is an API here: type  arthur.help()',
    dim,
  )

  installConsoleApi()
}

/**
 * A callable object on `window`. Costs nothing, and the one visitor who tries
 * `arthur.help()` is exactly the visitor worth impressing.
 */
function installConsoleApi() {
  const style = 'color:#8bb8e0;font-family:monospace;font-size:12px'
  const ok = 'color:#2dd4bf;font-family:monospace;font-size:12px'

  const api = {
    help() {
      console.log(
        '%carthur.whoami()   — who I am\n' +
          'arthur.stack()    — what I work with\n' +
          'arthur.contact()  — how to reach me\n' +
          'arthur.hire()     — copies my email\n' +
          'arthur.source()   — the code behind this page',
        style,
      )
      return undefined
    },
    whoami() {
      return {
        name: 'Arthur Lincoln da Paz Cristovão',
        role: 'AI Engineer',
        location: 'Campina Grande, PB, Brasil',
        focus: ['LLM Apps', 'Agents', 'RAG', 'MLOps', 'Computer Vision'],
      }
    },
    stack() {
      return {
        llm: ['Claude Code', 'Claude API', 'LangGraph', 'RAG'],
        ml: ['PyTorch', 'Transformers', 'scikit-learn'],
        infra: ['Docker', 'MLflow', 'FastAPI', 'PostgreSQL'],
      }
    },
    contact() {
      return {
        email: 'arthurpcristovao@gmail.com',
        github: 'https://github.com/arthurlpaz',
        linkedin: 'https://www.linkedin.com/in/arthurlpaz/',
      }
    },
    hire() {
      navigator.clipboard?.writeText('arthurpcristovao@gmail.com').catch(() => {})
      console.log('%c✓ email copied. talk soon.', ok)
      return undefined
    },
    source() {
      return 'https://github.com/arthurlpaz/personal-portfolio'
    },
  }

  Object.defineProperty(window, 'arthur', { value: api, writable: false, configurable: true })
}
