import {
  useSourceProvider,
  useHomepage,
  useGetChapters,
  useGetMangaDetails
} from '@renderer/hooks/extensions'
import { Package, Loader2, FolderOpen, Tag, Zap } from 'lucide-react'
import { useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@renderer/components/ui/card'
import { Separator } from '@renderer/components/ui/separator'
import { Link } from 'react-router'

function Home(): React.JSX.Element {
  const source: string = 'src-weebcentral' // This should be dynamically set based on the source you want to use

  const { data: extension } = useSourceProvider(source)
  const { data: homepage } = useHomepage(extension)

  useEffect(() => {
    console.log('Loaded extension:', extension)
    console.log('Homepage: ', homepage)
  }, [extension])

  return (
    <main className="px-4 ">
      {extension?.info && (
        <div>
          <img src={extension.info.iconUrl} alt="" className="size-8" />
          <p>{extension.info.name}</p>
          <p>{extension.info.baseUrl}</p>
          <p>{extension.info.iconUrl}</p>
        </div>
      )}
      <Separator orientation="horizontal" />

      {homepage &&
        homepage.map((section) => (
          <section className="w-full" key={section.id}>
            <h1 className="text-4xl font-semibold my-3">{section.title}</h1>
            <div className="w-full gap-4 grid grid-cols-8">
              {section.items.map((item) => (
                <Link to={`/manga/${source}/${item.id}`} key={item.id}>
                  <div className="p-2 bg-card">
                    <img src={item.image} alt="" className="aspect-2/3 object-cover" />
                    <h3 className="line-clamp-2">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
    </main>
  )
}

export default Home
