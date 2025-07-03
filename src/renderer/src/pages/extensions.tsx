import { Button } from '@renderer/components/ui/button'
import { usePreferences } from '@renderer/hooks/preferences/use-preferences'
import { Link } from 'react-router'

export default function Extensions(): React.JSX.Element {
  const { experimentalPreferences } = usePreferences()

  const customSourcesAllowed = experimentalPreferences?.enableCustomSources

  if (!customSourcesAllowed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-primary text-xl font-semibold">Custom Sources Disabled</h1>
        <p className="text-muted-foreground mb-4 text-sm">
          Custom sources are disabled in your settings.
        </p>
        <Link to="/settings/experimental">
          <Button variant="outline" className="cursor-pointer">
            Enable Custom Sources
          </Button>
        </Link>
      </div>
    )
  }

  return <>test</>
}
