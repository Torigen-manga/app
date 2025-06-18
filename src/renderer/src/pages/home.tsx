import {
  useSourceProvider,
} from '@renderer/hooks/extensions'
import { useEffect } from 'react'

function Home(): React.JSX.Element {
  const source: string = 'src-weebcentral'
  const { data: extension } = useSourceProvider(source)

  useEffect(() => {
    console.log('Loaded extension:', extension)
  }, [extension])

  return <main className=""></main>
}

export default Home
