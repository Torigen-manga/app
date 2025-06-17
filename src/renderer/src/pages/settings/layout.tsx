import { Card, CardContent } from '@renderer/components/ui/card'
import { SettingItem } from '@renderer/components/settings/item'
import { SettingRenderer } from '@renderer/components/settings/renderer'
import { Paintbrush } from 'lucide-react'
import { usePreferences } from '@renderer/hooks/preferences/use-preferences'
import { useTheme } from '@renderer/hooks/preferences/use-theme'

export default function LayoutPreferences() {
  const { layoutPreferences, updateLayoutPreferences } = usePreferences()
  const { theme, setTheme } = useTheme()

  if (!layoutPreferences) return <div>Loading...</div>

  const handleChangeTheme = (value: 'light' | 'dark' | 'system') => {
    updateLayoutPreferences({ theme: value })
    setTheme(value)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="inline-flex items-center gap-4 text-3xl font-bold">
          <Paintbrush />
          Layout & Appearance
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize how your library and manga covers are displayed.
        </p>
      </div>

      <Card className="p-0">
        <CardContent className="px-4">
          <SettingItem title="Grid Size">
            <SettingRenderer
              setting={{
                key: 'grid_size',
                title: 'Grid Size',
                description: 'Choose how many columns to display in library view.',
                type: 'select',
                options: [
                  { value: '4', label: '4' },
                  { value: '6', label: '6' },
                  { value: '8', label: '8' },
                  { value: '10', label: '10' },
                  { value: '12', label: '12' }
                ]
              }}
              value={layoutPreferences.gridSize}
              onChange={(value) => {
                updateLayoutPreferences({
                  gridSize: Number(value)
                })
              }}
            />
          </SettingItem>
          <SettingItem title="Theme" description="Choose the overall theme for the app">
            <SettingRenderer
              setting={{
                key: 'theme',
                title: 'Theme',
                description: 'Choose the overall theme for the app.',
                type: 'select',
                options: [
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' }
                ]
              }}
              value={layoutPreferences.theme}
              onChange={handleChangeTheme}
            />
          </SettingItem>

          <SettingItem title="Cover Style" description="Visual style for manga cover images">
            <SettingRenderer
              setting={{
                key: 'cover_style',
                title: 'Cover Style',
                description: 'Choose the visual style for manga cover images.',
                type: 'select',
                options: [
                  { value: 'default', label: 'Default' },
                  { value: 'rounded', label: 'Rounded' },
                  { value: 'border', label: 'Border' },
                  { value: 'shadow', label: 'Shadow' }
                ]
              }}
              value={layoutPreferences.coverStyle}
              onChange={(value) =>
                updateLayoutPreferences({
                  coverStyle: value
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Show titles under covers"
            description="Display manga titles below cover images"
          >
            <SettingRenderer
              setting={{
                key: 'show_titles',
                title: 'Show titles under covers',
                description: 'Display manga titles below cover images.',
                type: 'switch'
              }}
              value={layoutPreferences.showTitles}
              onChange={(value) =>
                updateLayoutPreferences({
                  showTitles: value
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Compact Mode"
            description="Smaller margins and fonts for denser layout"
          >
            <SettingRenderer
              setting={{
                key: 'compact_mode',
                title: 'Compact Mode',
                description: 'Use smaller margins and fonts for a denser layout.',
                type: 'switch'
              }}
              value={layoutPreferences.compactMode}
              onChange={(value) =>
                updateLayoutPreferences({
                  compactMode: value
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Show read/unread indicators"
            description="Display visual indicators for read and unread manga"
          >
            <SettingRenderer
              setting={{
                key: 'show_read_indicators',
                title: 'Show read/unread indicators',
                description: 'Display visual indicators for read and unread manga.',
                type: 'switch'
              }}
              value={layoutPreferences.showReadIndicator}
              onChange={(value) =>
                updateLayoutPreferences({
                  showReadIndicator: value
                })
              }
            />
          </SettingItem>
        </CardContent>
      </Card>
    </div>
  )
}
