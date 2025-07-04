import { extensionMethods } from '@renderer/hooks/extensions'
import { useParams } from 'react-router'
import { useLayout } from '@renderer/hooks/preferences/use-layout'
import { cn } from '@renderer/lib/utils'
import { MangaCard } from '@renderer/components/manga-card'
import React from 'react'
import { gridMap } from '@renderer/style/layout-options'
import {
  Menubar,
  MenubarMenu,
  MenubarLabel,
  MenubarItem,
  MenubarTrigger,
  MenubarContent,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator
} from '@renderer/components/ui/menubar'
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'
import { useLoadExtensions } from '@renderer/hooks/extensions/registry'
import { ErrorPage } from '../error'
import LoadingPage from '../loading'

interface ExploreMenuProps {
  id: string | undefined
}

function ExploreMenu({ id }: ExploreMenuProps): React.JSX.Element {
  const { data: info, isLoading } = extensionMethods.useSourceInfo(id)
  const { data: extensions } = useLoadExtensions()

  if (!info && !isLoading) {
    return <div className="text-sm font-medium text-red-500">Source information not available</div>
  }

  return (
    <div className="flex items-center gap-2">
      <Menubar>
        <MenubarLabel className="flex items-center gap-2 select-none">
          <Avatar className="size-6">
            <AvatarImage src={info?.iconUrl} alt={info?.name} />
            <AvatarFallback>{info?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {info?.name}
        </MenubarLabel>
        <MenubarMenu>
          <MenubarTrigger>Change Extensions</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={id}>
              {extensions?.map((ext) => (
                <MenubarRadioItem className="rounded" key={ext.id} value={ext.id}>
                  {ext.name}
                </MenubarRadioItem>
              ))}

              {!extensions?.length && <>No extensions available</>}
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Add Extension...</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export default function ExploreExt(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const { grid, coverStyle } = useLayout()

  const { data: homepage, isLoading, isError, error } = extensionMethods.useHomepage(id)

  if (!id) {
    return <ErrorPage code={400} message="Extension ID is required" />
  }

  if (!homepage && !isLoading) {
    return <ErrorPage code={404} message="Homepage not found" />
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (isError || error) {
    return <ErrorPage code={500} message="Error loading content" />
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-hidden">
      <div
        className={cn(
          'bg-background sticky top-0 z-10 flex h-14 w-full shrink-0 items-center border-b px-2'
        )}
      >
        <ExploreMenu id={id} />
      </div>

      <div className="overflow-y-auto">
        {homepage?.map((section) => (
          <section className="mx-auto w-full max-w-7xl p-2 pb-4" key={section.id}>
            <h1 className="my-3 text-3xl font-semibold">{section.title}</h1>
            <div className={cn('grid w-full gap-4', gridMap(grid))}>
              {section.items.map((item) => (
                <MangaCard
                  key={item.id}
                  property={coverStyle}
                  url={`/manga/${id}/${item.id}`}
                  title={item.title}
                  image={item.image}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
      {!homepage && (
        <div className="flex h-full w-full items-center justify-center text-gray-500">
          No content available
        </div>
      )}
    </div>
  )
}
