import { useParams } from 'react-router'
import {
  useSourceProvider,
  useGetMangaDetails,
  useGetExtensionEntry,
  useGetChapters
} from '@renderer/hooks/extensions'
import { Badge } from '@renderer/components/ui/badge'

import { ChapterTable } from '@renderer/components/chapter-table'
import { Button } from '@renderer/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@renderer/lib/utils'
import { ErrorPage } from './error'

export default function MangaDetail() {
  const { mangaId, source } = useParams<{
    mangaId: string
    source: string
  }>()
  const [expanded, setExpanded] = useState(false)
  const [isOverflow, setIsOverflow] = useState(false)
  const descRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const element = descRef.current
    if (element) {
      const originalHeight = element.scrollHeight
      const clampedHeight = element.clientHeight

      if (originalHeight > clampedHeight) {
        setIsOverflow(true)
      }
    }
  })

  const { data: entry, isLoading: entryLoading } = useGetExtensionEntry(source || '')
  const { data: extension } = useSourceProvider(entry?.path || null)

  const { data: chapters } = useGetChapters(extension, mangaId || '')
  const { data: manga, isLoading } = useGetMangaDetails(extension, mangaId || '')

  if (!mangaId || !source) {
    return <ErrorPage code={400} />
  }

  if (!entry && !entryLoading) {
    return <ErrorPage code={404} message={`Extension "${source}" not found`} />
  }

  if (!manga && !isLoading) {
    return <ErrorPage code={404} message="Manga not found" />
  }

  if (!manga) return null

  interface DetailCampProps {
    title: string
    textContent?: string
    children?: React.ReactNode
    className?: string
  }

  function DetailCamp({ title, textContent, children, className }: DetailCampProps) {
    return (
      <div className={cn('flex flex-col', className)}>
        <h2 className="text-primary font-bold">{title}</h2>
        {textContent && <p className="text-sm">{textContent}</p>}
        {children}
      </div>
    )
  }

  return (
    <main className="flex h-full w-full flex-col items-center p-4">
      <div className="flex w-full flex-col gap-2 md:w-4xl md:flex-row">
        <div className="aspect-2/3 h-96 max-h-88 w-fit">
          <img src={manga.image} alt="" className="size-full rounded-lg border shadow-xl" />
        </div>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold">{manga.title}</h1>
          <div className="flex flex-col space-y-2">
            <DetailCamp title="Genres">
              <div className="flex flex-wrap">
                {manga.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="mr-1 mb-1">
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </DetailCamp>

            {manga.artists.length > 0 && (
              <DetailCamp title="Artists" textContent={manga.artists.join(', ')} />
            )}
            {manga.authors.length > 0 && (
              <DetailCamp title="Authors" textContent={manga.authors.join(', ')} />
            )}
            <div>
              <div
                className={cn(
                  'flex items-center',
                  isOverflow ? 'justify-between' : 'justify-start'
                )}
              >
                <h3 className="text-primary text-lg font-bold">Description</h3>
                {isOverflow && (
                  <Button
                    onClick={() => setExpanded(!expanded)}
                    variant="link"
                    className="h-6 w-18 rounded-full"
                  >
                    {expanded ? 'Collapse' : 'Expand'}
                  </Button>
                )}
              </div>
              <p ref={descRef} className={cn(expanded ? '' : 'line-clamp-3')}>
                {manga.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ChapterTable data={chapters ?? []} />
    </main>
  )
}
