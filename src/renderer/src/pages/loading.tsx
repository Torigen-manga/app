import { Loader2 } from 'lucide-react'

export default function LoadingPage(): React.JSX.Element {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="text-2xl font-semibold">Loading...</div>
      <Loader2 className="size-6 animate-spin" />
    </main>
  )
}
