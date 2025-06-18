import {
  useSourceProvider,
  useHomepage,
  useGetExtensionEntry,
  useLoadExtensions
} from '@renderer/hooks/extensions'
import { useEffect } from 'react'
import { Separator } from '@renderer/components/ui/separator'
import { Link } from 'react-router'

function Home(): React.JSX.Element {
  const source: string = 'src-weebcentral'

  const { data: entry } = useGetExtensionEntry('weebcentral')
  const { data: extensions } = useLoadExtensions()

  const { data: extension } = useSourceProvider(source)
  const { data: homepage } = useHomepage(extension)

  useEffect(() => {
    console.log('Loaded extension:', extension)
    console.log('Homepage: ', homepage)
    console.log('Loaded Extensions: ', extensions)
    console.log('Extension entry: ', entry)
  }, [extension])

  return <main className=""></main>
}

export default Home
