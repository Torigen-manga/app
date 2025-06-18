import { useLoadExtensions } from '@renderer/hooks/extensions'
import { Button } from '@renderer/components/ui/button'
import { Link } from 'react-router'

export default function Explore(): React.JSX.Element {
  const { data, isLoading } = useLoadExtensions()

  if (isLoading) {
    return <div className="w-full h-full items-center justify-center">Loading extensions...</div>
  }

  if (!data && !isLoading) {
    return <div className="text-red-500">Failed to load extensions</div>
  }

  if (data) {
    return (
      <div className="w-full h-full items-center justify-center flex flex-col">
        <h1 className="mb-4 font-bold text-4xl">Select a extension</h1>
        {data.map((ext) => (
          <Link to={`/explore/${ext.id}`}>
            <Button variant="outline" className="px-2 cursor-pointer" key={ext.id}>
              <img src={ext.iconUrl} alt="" className="size-8" />
              {ext.name}
            </Button>
          </Link>
        ))}
      </div>
    )
  }

  return <>test</>
}
