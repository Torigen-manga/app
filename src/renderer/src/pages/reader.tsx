import { useParams } from 'react-router'
import { useGetChapter, useGetExtensionEntry, useSourceProvider } from '@renderer/hooks/extensions'

export default function Reader(): React.JSX.Element {
  const { source, mangaId, chapterId } = useParams()
  const { data: entry } = useGetExtensionEntry(source || '')
  const { data: extension } = useSourceProvider(entry?.path || null)
  const { data: chapter, isLoading } = useGetChapter(extension, mangaId || '', chapterId || '')

  return (
    <div className="flex flex-col">
      {chapter?.pages.map((page) => <img key={page} src={page} alt={page.length.toString()} />)}
    </div>
  )
}
