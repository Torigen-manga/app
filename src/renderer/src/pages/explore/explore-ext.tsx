import { useGetExtensionEntry, useSourceProvider, useHomepage } from '@renderer/hooks/extensions'
import { Link, useParams } from 'react-router'

export default function ExploreExt(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div className="text-red-500">Extension ID is required</div>
  }

  const { data: entry, isLoading } = useGetExtensionEntry(id)

  if (isLoading) {
    return <div className="w-full h-full items-center justify-center">Loading extension...</div>
  }

  if (!entry) {
    return <div className="text-red-500">Extension not found</div>
  }

  const { data: source } = useSourceProvider(entry.path)
  const { data: homepage } = useHomepage(source)

  return (
    <div className="flex flex-col">
      {homepage &&
        homepage.map((section) => (
          <section className="w-full" key={section.id}>
            <h1 className="text-4xl font-semibold my-3">{section.title}</h1>
            <div className="w-full gap-4 grid grid-cols-8">
              {section.items.map((item) => (
                <Link to={`/manga/${id}/${item.id}`} key={item.id}>
                  <div className="p-2 bg-card">
                    <img src={item.image} alt="" className="aspect-2/3 object-cover" />
                    <h3 className="line-clamp-2">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
