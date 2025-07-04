import { useParams } from 'react-router'
import { Badge } from '@renderer/components/ui/badge'
import { extensionMethods } from '@renderer/hooks/extensions'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { ChapterTable } from '@renderer/components/chapter-table'
import { Button } from '@renderer/components/ui/button'
import { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@renderer/lib/utils'
import { ErrorPage } from './error'
import LoadingPage from './loading'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import {
  useGetLibrary,
  useAddCategory,
  useAddMangaToLibrary,
  useAddCategoryToEntry,
  useGetEntryId
} from '@renderer/hooks/library'
import { AppManga } from '@common/index'

interface MangaAddDialogProps {
  children: React.ReactNode
  manga: AppManga
}

function MangaAddToLibrary({ children, manga }: MangaAddDialogProps): React.JSX.Element {
  const { data: library } = useGetLibrary()
  const [selectValue, setSelectValue] = useState<string | undefined>()
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const addCategory = useAddCategory()
  const addMangaToLibrary = useAddMangaToLibrary()
  const { data: id } = useGetEntryId(manga.sourceId, manga.mangaId)

  const addCategoryToEntry = useAddCategoryToEntry()

  function reset() {
    setSelectValue(undefined)
    setNewCategoryName('')
    setIsOpen(false)
  }

  const handleAdd = async () => {
    if (selectValue === 'new-ct' && newCategoryName.trim() !== '') {
      await addCategory.mutateAsync(newCategoryName.trim())
      await addMangaToLibrary.mutateAsync(manga)
      await addCategoryToEntry.mutateAsync({
        categoryId: newCategoryName.trim(),
        mangaId: id!
      })

      reset()
      return
    }

    if (selectValue === 'default') {
      await addMangaToLibrary.mutateAsync(manga)
      reset()
      return
    }

    await addMangaToLibrary.mutateAsync(manga)
    await addCategoryToEntry.mutateAsync({
      categoryId: selectValue!,
      mangaId: id!
    })

    reset()
    return
  }

  const isAddDisabled =
    selectValue === undefined || (selectValue === 'new-ct' && newCategoryName.trim().length === 0)

  const CategoryList = useMemo(() => {
    if (!library?.categories.length) {
      return (
        <>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="new-ct">New Category</SelectItem>
        </>
      )
    }

    return (
      <>
        <SelectItem value="default">Default</SelectItem>
        {library.categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
        <SelectItem value="new-ct">New Category</SelectItem>
      </>
    )
  }, [library?.categories])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Library</DialogTitle>
        </DialogHeader>
        <Label htmlFor="library-input">Category Name</Label>
        <Select onValueChange={setSelectValue} value={selectValue!}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>{CategoryList}</SelectContent>
        </Select>
        {selectValue === 'new-ct' && (
          <>
            <Label htmlFor="new-category">New Category Name</Label>
            <Input
              id="new-category"
              placeholder="Enter new category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </>
        )}
        <DialogFooter>
          <Button onClick={handleAdd} disabled={isAddDisabled}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function MangaDetail(): React.JSX.Element {
  const { mangaId, source } = useParams<{
    mangaId: string
    source: string
  }>()
  const { data: manga, isLoading } = extensionMethods.useMangaDetails(source, mangaId)
  const { data: chapters, isLoading: chaptersLoading } = extensionMethods.useMangaChapters(
    source,
    mangaId
  )
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
  }, [descRef.current, isOverflow])

  if (isLoading) {
    return <LoadingPage />
  }

  if (!mangaId || !source) {
    return <ErrorPage code={400} />
  }

  if (!manga && !isLoading) {
    return <ErrorPage code={404} message="Manga not found" />
  }

  if (!manga) return <></>

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

  const appManga: AppManga = {
    sourceId: source,
    mangaId,
    title: manga.title,
    cover: manga.image,
    description: manga.description,
    artists: manga.artists,
    authors: manga.authors,
    status: manga.status,
    url: `${source}/${mangaId}`
  }

  return (
    <main className="flex h-full w-full flex-col items-center overflow-y-auto p-4">
      <div className="flex w-full flex-col gap-2 sm:max-w-2xl md:max-w-4xl md:flex-row">
        <div className="aspect-2/3 max-h-88 w-fit">
          <img src={manga.image} alt="" className="size-full rounded-lg border shadow-xl" />
        </div>
        <div className="max-w-2xl">
          <div className="flex w-full items-start justify-between">
            <h1 className="text-2xl font-bold">{manga.title}</h1>
            <MangaAddToLibrary manga={appManga}>
              <Button variant="outline" className="cursor-pointer">
                Add to Library
              </Button>
            </MangaAddToLibrary>
          </div>
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
      <ChapterTable isLoading={chaptersLoading} data={chapters ?? []} />
    </main>
  )
}
