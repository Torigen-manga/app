import { Link } from 'react-router'

interface MangaCardProps {
  url: string
  title: string
  image: string
}

export function MangaCard({ url, title, image }: MangaCardProps): React.JSX.Element {
  return (
    <Link className="bg-sidebar hover:bg-sidebar/45 h-full p-2 transition-colors" to={url}>
      <img src={image} alt={title} />
      <h3 className="mt-2 line-clamp-2 text-sm">{title}</h3>
    </Link>
  )
}
