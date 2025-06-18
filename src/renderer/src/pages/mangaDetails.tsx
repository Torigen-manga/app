import { useParams } from 'react-router'
import {
  useSourceProvider,
  useGetMangaDetails,
  useGetExtensionEntry
} from '@renderer/hooks/extensions'
import { BookOpen, Brush, Star } from 'lucide-react'
import { Badge } from '@renderer/components/ui/badge'
import { Loader2 } from 'lucide-react'

export default function MangaDetail() {
  const { id, source } = useParams<{
    id: string
    source: string
  }>()

  if (!id || !source) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-primary font-bold text-2xl">400 - Bad Request</h1>
        <p className="text-muted-foreground">Missing {id ? 'source' : 'id'}</p>
      </div>
    )
  }
  const { data: entry } = useGetExtensionEntry(source)

  if (!entry) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-primary font-bold text-2xl">404 - Not Found</h1>
        <p className="text-muted-foreground">Extension not found</p>
      </div>
    )
  }

  const { data: extension } = useSourceProvider(entry.path)
  const { data: mangaDetails, isLoading } = useGetMangaDetails(extension, id)

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-xl text-center font-bold text-primary">Loading...</h1>
        <Loader2 className="size-6 animate-spin duration-200" />
      </div>
    )
  }

  if (!mangaDetails) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-primary font-bold text-2xl">404 - Not Found</h1>
        <p className="text-muted-foreground">Manga not found</p>
      </div>
    )
  }

  return (
    <main className="w-full p-4  flex flex-col items-center min-h-full">
      <div className="flex flex-col lg:flex-row max-w-4xl gap-4">
        <img
          className="max-h-96 aspect-2/3 object-cover"
          src={mangaDetails.image}
          alt={mangaDetails.title}
          decoding="async"
        />
        <div className="flex flex-col gap-2 text-sm">
          <div>
            <h1 className="text-2xl font-bold">{mangaDetails.title}</h1>
            <p className="text-sm text-muted-foreground">
              Source: <span className="font-bold">{source}</span>
            </p>
          </div>
          <div className="flex w-full justify-between items-center">
            {mangaDetails.artists.length > 0 && (
              <div className="flex flex-col">
                <p className="inline-flex items-center gap-2 font-bold text-primary">
                  <Brush className="size-4" /> Artists
                </p>
                <p>{mangaDetails.artists.join(', ')}</p>
              </div>
            )}
            {mangaDetails.authors.length > 0 && (
              <div className="flex flex-col justify-self-end">
                <p className="inline-flex items-center gap-2 font-bold text-primary">
                  <BookOpen className="size-4" /> Authors
                </p>
                <p>{mangaDetails.authors.join(', ')}</p>
              </div>
            )}
          </div>
          {mangaDetails.tags.length > 0 && (
            <div>
              <p className="inline-flex items-center gap-2 font-bold text-primary">
                <Star className="size-4" /> Genres
              </p>
              <div className="flex flex-wrap gap-2">
                {mangaDetails.tags.map((tag) => (
                  <Badge variant="outline" key={tag.id}>
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="">
            <h3 className="font-bold text-primary">Description</h3>
            <p>{mangaDetails.description}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
