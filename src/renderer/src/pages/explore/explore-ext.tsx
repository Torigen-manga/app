import { extensionMethods } from '@renderer/hooks/extensions'
import { Loader2 } from 'lucide-react'
import { useParams } from 'react-router'
import { useLayout } from '@renderer/hooks/preferences/use-layout'
import { cn } from '@renderer/lib/utils'
import { MangaCard } from '@renderer/components/manga-card'
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'

export default function ExploreExt(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const { grid, coverStyle } = useLayout()

  const testString: string = 'test'

  const { data, isLoading, isError, error } = extensionMethods.useHomepage(id)
  const {} = () => {}

  console.log('Data', data)

  if (!id) {
    return <div className="text-red-500">Extension ID is required</div>
  }

  if (!data && !isLoading) {
    return <div className="text-red-500">Extension not found</div>
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-primary text-2xl">Loading content...</h1>
        <Loader2 className="text-primary mt-4 animate-spin" size={32} />
      </div>
    )
  }

  if (isError || error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-2xl text-red-500">Error loading content</h1>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="flex w-full">
      <div className="w-fit bg-red-400 p-2">
        <div className="bg-card border-border flex min-w-54 items-center gap-2 rounded-xl border p-2">
          <Avatar className="size-8 bg-blue-400">
            <AvatarImage>
              <img src="" alt="" />
            </AvatarImage>
            <AvatarFallback>{testString.charAt(0).toLocaleUpperCase()}</AvatarFallback>
          </Avatar>
          <h1>{testString}</h1>
        </div>
      </div>
      <div className="flex w-full flex-col items-center overflow-y-scroll">
        {data?.map((section) => (
          <section className="w-full max-w-7xl p-2" key={section.id}>
            <h1 className="my-3 text-3xl font-semibold">{section.title}</h1>
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
                <MangaCard
                  property={coverStyle}
                  url={`/manga/${id}/${item.id}`}
                  title={item.title}
                  image={item.image}
                />
              ))}
            </div>
          </section>
        ))}
        {!data && (
          <div className="flex h-full w-full items-center justify-center text-gray-500">
            No content available
          </div>
        )}
      </div>
    </div>
  )
}
