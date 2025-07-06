import React from 'react'
import { Menubar, MenubarLabel } from '@renderer/components/ui/menubar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/components/ui/collapsible'
import { cn } from '@renderer/lib/utils'
import { CircleAlert, ChevronDown, Menu } from 'lucide-react'
import { useGetLibrary, useGetEntriesByCategory } from '@renderer/hooks/library'
import { LibraryCard } from '@renderer/components/manga-card'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'
import LoadingPage from './loading'
import { ErrorPage } from './error'

interface CategoryCardProps {
  id: string
  title: string
  children?: React.ReactNode
  draggable?: boolean
  defaultOpen?: boolean
}

function CategoryCard({
  id,
  title,
  children,
  draggable,
  defaultOpen
}: CategoryCardProps): React.JSX.Element {
  const sortable = useSortable({ id })
  const { attributes, listeners, setNodeRef, transform, transition } = sortable
  const [open, setOpen] = React.useState(defaultOpen ? true : false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={draggable ? setNodeRef : undefined} style={draggable ? style : undefined}>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="w-full rounded-lg border transition-all"
      >
        <CollapsibleTrigger
          className={cn(
            'bg-sidebar hover:bg-sidebar/70 flex w-full items-center justify-between rounded-t-lg p-2 transition-colors',
            'cursor-pointer',
            !open && 'rounded-lg',
            open && 'border-b'
          )}
        >
          <div className="flex items-center gap-2">
            {draggable && (
              <Menu
                className="text-primary-foreground size-4 cursor-grab"
                {...attributes}
                {...listeners}
              />
            )}
            <h1 className="text-2xl font-semibold capitalize">{title}</h1>
          </div>
          <ChevronDown className={cn('transition-transform', open && 'rotate-180')} />
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            'bg-accent/25 min-h-40',
            React.Children.count(children) > 0
              ? 'grid grid-cols-8 gap-4 p-2'
              : 'flex items-center justify-center gap-2'
          )}
        >
          {React.Children.count(children) > 0 ? (
            <>{children}</>
          ) : (
            <>
              <CircleAlert className="text-muted-foreground size-6" />
              <h2 className="">No Items Found</h2>
            </>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

interface CategorySectionProps {
  categoryId: string
  categoryName: string
  draggable?: boolean
}

function CategorySection({ categoryId, categoryName, draggable }: CategorySectionProps) {
  const { data: entries, isLoading } = useGetEntriesByCategory(categoryId)

  if (isLoading) {
    return (
      <CategoryCard id={categoryId} title={categoryName} draggable={draggable}>
        <div className="col-span-8 flex items-center justify-center p-4">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      </CategoryCard>
    )
  }

  return (
    <CategoryCard id={categoryId} title={categoryName} draggable={draggable}>
      {entries?.map((entry) => {
        const [sourceId, mangaId] = entry.id.split('-', 2)
        const url = `/manga/${sourceId}/${mangaId}`

        return (
          <LibraryCard
            property="shadow"
            image={entry.cover}
            key={entry.id}
            url={url}
            title={entry.title}
            unreadCount={entry.cachedTotalChapters || 0}
          />
        )
      })}
    </CategoryCard>
  )
}

export default function Library(): React.JSX.Element {
  const { data, isLoading, error } = useGetLibrary()
  const [categories, setCategories] = React.useState(() => data?.categories ?? [])

  const sensors = useSensors(useSensor(PointerSensor))

  React.useEffect(() => {
    if (data?.categories) {
      const sortedCategories = [...data.categories].sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
      setCategories(sortedCategories)
    }
  }, [data?.categories])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = categories.findIndex((cat) => cat.id === active.id)
    const newIndex = categories.findIndex((cat) => cat.id === over.id)

    const newOrder = arrayMove(categories, oldIndex, newIndex)
    setCategories(newOrder)

    // TODO: Implement Zustand action to persist category order
    // updateCategoryOrder(newOrder.map((cat, index) => ({ id: cat.id, order: index })))
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return <ErrorPage code={500} message="Failed to load library data" />
  }

  if (!data) {
    return <ErrorPage code={500} message="No library data available" />
  }

  return (
    <main className="flex h-full w-full flex-col">
      <header className="sticky flex h-12 w-full items-center px-2">
        <Menubar className="w-64">
          <MenubarLabel className="text-base font-bold select-none">Library</MenubarLabel>
        </Menubar>
      </header>
      <div className="flex h-full w-full flex-1 flex-col gap-4 overflow-y-scroll px-2 py-4">
        <CategoryCard defaultOpen id="all-entries" title="All Entries">
          {data.entries?.map((entry) => {
            const [sourceId, mangaId] = entry.id.split('-', 2)
            const url = `/manga/${sourceId}/${mangaId}`

            return (
              <LibraryCard
                property="shadow"
                image={entry.cover}
                key={entry.id}
                url={url}
                title={entry.title}
                unreadCount={entry.cachedTotalChapters || 0}
              />
            )
          })}
        </CategoryCard>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                categoryId={category.id}
                categoryName={category.name}
                draggable
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  )
}
