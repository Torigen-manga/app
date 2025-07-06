import { Link } from 'react-router'
import { coverVariant } from '@renderer/style/layout-options'
import { cn } from '@renderer/lib/utils'
import React from 'react'

interface MangaCardProps {
  url: string
  title: string
  image: string
  property?: 'default' | 'shadow' | 'rounded' | 'border'
}

interface LibraryCardProps extends MangaCardProps {
  unreadCount?: number
}

export function LibraryCard({ url, title, image, property, unreadCount }: LibraryCardProps) {
  return (
    <div className="relative">
      <MangaCard url={url} title={title} image={image} property={property} />
      {unreadCount !== undefined && unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500 p-1 text-white">
          <p className="text-sm">{unreadCount}</p>
        </div>
      )}
    </div>
  )
}

export function MangaCard({ url, title, image, property }: MangaCardProps): React.JSX.Element {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const handleImageError = React.useCallback(() => {
    setImageError(true)
  }, [])

  const handleImageLoad = React.useCallback(() => {
    setImageLoaded(true)
  }, [])

  return (
    <Link
      className={cn(
        'bg-sidebar hover:bg-primary/40 focus:bg-primary/40 focus:ring-primary/50 block h-full rounded-lg p-2 transition-all duration-200 focus:ring-2 focus:outline-none',
        coverVariant({ property })
      )}
      to={url}
      aria-label={`Read ${title}`}
    >
      <div className="relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="bg-muted absolute inset-0 animate-pulse rounded-lg" />
        )}

        {imageError ? (
          <div
            className={cn(
              'bg-muted text-muted-foreground flex aspect-[3/4] items-center justify-center text-xs',
              coverVariant({ property })
            )}
          >
            No Image
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className={cn(
              'aspect-[3/4] h-auto w-full object-cover transition-opacity duration-200',
              coverVariant({ property }),
              !imageLoaded && 'opacity-0'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <h3 className="text-foreground mt-2 line-clamp-2 text-sm leading-tight font-medium">
        {title}
      </h3>
    </Link>
  )
}
