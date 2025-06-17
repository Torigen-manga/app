import { useExtensions, useSourceProvider } from '@renderer/hooks/extensions'
import { Package, Loader2, FolderOpen, Tag, Zap } from 'lucide-react'
import { useEffect } from 'react'

function Home(): React.JSX.Element {
  const { registry, loadingRegistry } = useExtensions()
  const { data: extension } = useSourceProvider('src-weebcentral')

  useEffect(() => {
    console.log('Loaded extension:', extension)
    console.log('Homepage: ', extension?.getHomepage())
  }, [extension])

  if (!registry) {
    return <></>
  }

  if (loadingRegistry) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading extensions registry...</p>
        </div>
      </div>
    )
  }

  const extensionCount = Object.keys(registry).length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Extensions Registry</h1>
        </div>
        <p className="text-muted-foreground">Manage and view your installed extensions</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {extensionCount} extension{extensionCount !== 1 ? 's' : ''} installed
          </div>
        </div>
      </div>

      {/* Extensions Grid */}
      {extensionCount === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No extensions installed</h3>
          <p className="text-muted-foreground">Install some extensions to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(registry).map(([key, extension]) => (
            <div
              key={key}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Extension Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{extension.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">v{extension.version}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extension Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Path:</span>
                  <code className="bg-muted transition-colors hover:bg-muted/75 select-none cursor-pointer px-2 py-1 rounded text-xs font-mono flex-1 truncate">
                    {extension.path}
                  </code>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Main:</span>
                  <code className="bg-muted select-none px-2 py-1 rounded text-xs font-mono">
                    {extension.main}
                  </code>
                </div>

                {extension.dependencies && extension.dependencies.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground block mb-2">Dependencies:</span>
                    <div className="flex flex-wrap gap-1">
                      {extension.dependencies.map((dep, index) => (
                        <span
                          key={index}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Raw Data Section (Collapsible) */}
      <details className="mt-12 bg-muted/50 rounded-lg">
        <summary className="cursor-pointer p-4 hover:bg-muted/70 rounded-lg transition-colors">
          <span className="font-medium">View Raw Registry Data</span>
        </summary>
        <div className="p-4 pt-0">
          <pre className="bg-background border rounded-lg p-4 overflow-auto text-sm">
            <code className="font-mono">{JSON.stringify(registry, null, 2)}</code>
          </pre>
        </div>
      </details>
    </div>
  )
}

export default Home
