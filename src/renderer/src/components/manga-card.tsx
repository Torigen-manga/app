import { Link } from 'react-router'
import { coverVariant } from '@renderer/style/cover-variants'
import { cn } from '@renderer/lib/utils'

interface MangaCardProps {
  url: string
  title: string
  image: string
  property?: 'default' | 'shadow' | 'rounded' | 'border'
}

export function MangaCard({ url, title, image, property }: MangaCardProps): React.JSX.Element {
  return (
    <Link
      className={cn(
        'bg-sidebar hover:bg-primary/40 h-full p-2 transition-colors',
        coverVariant({ property })
      )}
      to={url}
    >
      <img src={image} alt={title} className={cn(coverVariant({ property }))} />
      <h3 className="mt-2 line-clamp-2 text-sm">{title}</h3>
    </Link>
  )
}
