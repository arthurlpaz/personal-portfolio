import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Self-hosted fonts (replaces the Google Fonts CDN @import — better FCP, no external request)
import '@fontsource-variable/bricolage-grotesque' // display
import '@fontsource-variable/inter' // body
import '@fontsource-variable/jetbrains-mono' // mono
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/context'
import { printConsoleBanner } from './lib/console-banner'

printConsoleBanner()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 min — GitHub data barely changes within a session
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>,
)
