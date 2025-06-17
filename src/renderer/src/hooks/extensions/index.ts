// import type { Section, SourceProvider } from '@torigen/mounter'
import type { Registry } from '@shared/types'
import { invoke } from '@renderer/config/ipc'
import { useQuery } from '@tanstack/react-query'
import { SourceProvider } from '@torigen/mounter'
import { ElectronRequestManager } from '@renderer/providers/electron-req'

async function extensionFetchProvider(path: string): Promise<SourceProvider> {
  const url = `app://extensions/${path}/bundle.js`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch source provider from ${url}: ${res.statusText}`)
  }

  const content = await res.text()

  const blob = new Blob([content], { type: 'application/javascript' })
  const scriptUrl = URL.createObjectURL(blob)

  try {
    const module = await import(/* @vite-ignore */ scriptUrl)

    if (!module.default) {
      throw new Error(
        `Extension '${path}' does not have a default export (expected a Source class).`
      )
    }

    type SourceClassConstructor = new (requestManager: ElectronRequestManager) => SourceProvider
    const SourceClass = module.default as SourceClassConstructor

    const requestManager = new ElectronRequestManager()

    const sourceInstance = new SourceClass(requestManager)

    return sourceInstance
  } finally {
    URL.revokeObjectURL(scriptUrl)
  }
}

function useSourceProvider(path: string | null) {
  return useQuery({
    queryKey: ['source-provider', path],
    queryFn: () => extensionFetchProvider(path!),
    enabled: !!path,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

function useExtensions() {
  const {
    data: extensions,
    isLoading: loadingExtensions,
    error: extensionsError
  } = useQuery({
    queryKey: ['extensions'],
    queryFn: async () => {
      const extensions: string[] = await invoke('extensions:load')
      return extensions
    }
  })

  const {
    data: registry,
    isLoading: loadingRegistry,
    error: registryError
  } = useQuery({
    queryKey: ['extensions:registry'],
    queryFn: async () => {
      const registry: Registry = await invoke('extensions:load-registry')
      return registry
    }
  })

  return {
    // extensions
    extensions,
    loadingExtensions,
    extensionsError,

    // registry
    registry,
    loadingRegistry,
    registryError
  }
}

export { useExtensions, useSourceProvider }
