import { useGetExtensionEntry, useSourceProvider, useHomepage } from '@renderer/hooks/extensions'
import { Loader2 } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useLayout } from '@renderer/hooks/preferences/use-layout'
import { cn } from '@renderer/lib/utils'
import { MangaCard } from '@renderer/components/manga-card'

export default function ExploreExt(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()

  const { data: entry, isLoading: entryLoading, error: entryError } = useGetExtensionEntry(id || '')
  const { data: source, isLoading: sourceLoading } = useSourceProvider(entry?.path || null)
  const { data: homepage, isLoading: homepageLoading } = useHomepage(source || undefined)
  const { grid } = useLayout()

  if (!id) {
    return <div className="text-red-500">Extension ID is required</div>
  }

  if (entryError) {
    return <div className="text-red-500">Error loading extension: {entryError.message}</div>
  }

  if (entryLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-lg font-semibold">Loading extension...</h1>
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (!entryLoading && !entry) {
    return <div className="text-red-500">Extension not found</div>
  }

  if (sourceLoading || homepageLoading) {
    return <div className="flex h-full w-full items-center justify-center">Loading content...</div>
  }

  return (
    <div className="flex flex-col overflow-y-scroll">
      {homepage?.map((section) => (
        <section className="w-full p-2" key={section.id}>
          <h1 className="my-3 text-4xl font-semibold">{section.title}</h1>
          <div
            className={cn(
              'grid w-full grid-cols-4 gap-4',
              grid === 6 && 'grid-cols-6',
              grid === 8 && 'grid-cols-8',
              grid === 10 && 'grid-cols-10',
              grid === 12 && 'grid-cols-12'
            )}
          >
            {section.items.map((item) => (
              <MangaCard url={`/manga/${id}/${item.id}`} title={item.title} image={item.image} />
            ))}
          </div>
        </section>
      ))}
      {!homepage && (
        <div className="flex h-full w-full items-center justify-center text-gray-500">
          No content available
        </div>
      )}
    </div>
  )
}
