import { useParams } from 'react-router'
import { Badge } from '@renderer/components/ui/badge'
import { extensionMethods } from '@renderer/hooks/extensions'

import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'

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
  useHasEntry,
  useRemoveMangaFromLibrary
} from '@renderer/hooks/library'
import { AppManga } from '@common/index'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().nonempty({ message: 'Category name is required' }),
  newName: z
    .string()
    .optional()
    .refine((val) => !val || val.trim() !== '', {
      message: 'New category name cannot be neither empty nor whitespace only'
    })
})

interface MangaAddDialogProps {
  children: React.ReactNode
  manga: AppManga
}

function MangaAddToLibrary({ children, manga }: MangaAddDialogProps): React.JSX.Element {
  const { data: library } = useGetLibrary()
  const [selectValue, setSelectValue] = useState<string>('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const addCategory = useAddCategory()
  const addMangaToLibrary = useAddMangaToLibrary()
  const addCategoryToEntry = useAddCategoryToEntry()

  function reset() {
    setSelectValue('')
    setNewCategoryName('')
    setFormError(null)
    setIsOpen(false)
  }

  const handleAdd = async () => {
    const validationResult = categorySchema.safeParse({
      name: selectValue,
      newName: selectValue === 'new-ct' ? newCategoryName : undefined
    })

    if (!validationResult.success) {
      setFormError(validationResult.error.issues[0].message)
      return
    }

    try {
      // First, add the manga to the library
      await addMangaToLibrary.mutateAsync(manga)

      // Generate the library entry ID that the backend will use
      const libraryEntryId = `${manga.sourceId}__${manga.mangaId}`

      if (selectValue === 'new-ct') {
        // Create new category and add manga to it
        const newCategoryId = await addCategory.mutateAsync(newCategoryName.trim())
        await addCategoryToEntry.mutateAsync({
          categoryId: newCategoryId,
          libraryEntryId
        })
      } else if (selectValue !== 'default') {
        // Add manga to existing category
        await addCategoryToEntry.mutateAsync({
          categoryId: selectValue,
          libraryEntryId
        })
      }
      // If 'default' is selected, just adding to library is enough

      reset()
    } catch (error) {
      console.error('Error adding manga to library:', error)
      setFormError('Failed to add manga to library. Please try again.')
    }
  }

  const isAddDisabled =
    selectValue === '' ||
    selectValue === undefined ||
    (selectValue === 'new-ct' && newCategoryName.trim().length === 0) ||
    addMangaToLibrary.isPending ||
    addCategory.isPending ||
    addCategoryToEntry.isPending

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
          <DialogDescription>
            Select a category to add this manga to your library.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="category-select">Category</Label>
            <Select onValueChange={setSelectValue} value={selectValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>{CategoryList}</SelectContent>
            </Select>
          </div>

          {selectValue === 'new-ct' && (
            <div>
              <Label htmlFor="new-category">New Category Name</Label>
              <Input
                id="new-category"
                placeholder="Enter new category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
          )}

          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={reset} disabled={isAddDisabled}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={isAddDisabled}>
            {isAddDisabled ? 'Adding...' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface MangaRemoveFromLibraryProps {
  children: React.ReactNode
  title: string | undefined
  sourceId: string
  mangaId: string
}

function MangaRemoveFromLibrary({
  children,
  sourceId,
  mangaId,
  title
}: MangaRemoveFromLibraryProps) {
  const removeManga = useRemoveMangaFromLibrary()
  const [isOpen, setIsOpen] = useState(false)

  async function handleRemove() {
    try {
      // Use the same ID format as the backend expects
      const libraryEntryId = `${sourceId}__${mangaId}`
      await removeManga.mutateAsync(libraryEntryId)
      setIsOpen(false)
    } catch (error) {
      console.error('Error removing manga from library:', error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Manga from Library</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{title}</strong> from your library? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRemove} disabled={removeManga.isPending}>
            {removeManga.isPending ? 'Removing...' : 'Remove'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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

  // Check if manga exists in library
  const { data: isInLibrary } = useHasEntry(source!, mangaId!)

  useEffect(() => {
    const element = descRef.current
    if (element) {
      const originalHeight = element.scrollHeight
      const clampedHeight = element.clientHeight

      if (originalHeight > clampedHeight) {
        setIsOverflow(true)
      }
    }
  }, [manga?.description])

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
    genres: manga.tags.map((tag) => tag.id),
    status: manga.status
  }

  function CategoryHandler({ isInLibrary }: { isInLibrary: boolean | undefined }) {
    if (!isInLibrary) {
      return (
        <MangaAddToLibrary manga={appManga}>
          <Button variant="outline" className="cursor-pointer">
            Add to Library
          </Button>
        </MangaAddToLibrary>
      )
    }

    return (
      <MangaRemoveFromLibrary title={manga?.title} sourceId={source!} mangaId={mangaId!}>
        <Button variant="outline" className="cursor-pointer">
          Remove from Library
        </Button>
      </MangaRemoveFromLibrary>
    )
  }

  return (
    <main className="flex h-full w-full flex-col items-center overflow-y-auto p-4">
      <div className="flex w-full flex-col gap-2 sm:max-w-2xl md:max-w-4xl md:flex-row">
        <div className="aspect-2/3 max-h-88 w-fit">
          <img
            src={manga.image}
            alt={manga.title}
            className="size-full rounded-lg border shadow-xl"
          />
        </div>
        <div className="max-w-2xl">
          <div className="flex w-full items-start justify-between">
            <h1 className="text-2xl font-bold">{manga.title}</h1>
            <CategoryHandler isInLibrary={isInLibrary} />
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
