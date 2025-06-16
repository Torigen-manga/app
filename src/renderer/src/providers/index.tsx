import { QueryProvider } from './query'
import { ThemeProvider } from './theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  )
}
