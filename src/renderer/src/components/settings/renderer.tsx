import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Switch } from '@renderer/components/ui/switch'
import { Slider } from '@renderer/components/ui/slider'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'
import { FolderOpen } from 'lucide-react'
import { Preferences } from '@renderer/types/preferences'

interface SettingRendererProps {
  setting: Preferences
  value: any
  onChange: (value: any) => void
}

export function SettingRenderer({ setting, value, onChange }: SettingRendererProps) {
  switch (setting.type) {
    case 'select':
      const selectValue = value?.toString() || ''
      const options = setting.options || []

      return (
        <Select value={selectValue} onValueChange={onChange}>
          <SelectTrigger className="w-46">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'switch':
      return <Switch checked={value} onCheckedChange={onChange} />

    case 'slider':
      return (
        <div className="w-46">
          <Slider
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
            min={setting.min}
            max={setting.max}
            step={setting.step}
          />
        </div>
      )

    case 'input':
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={setting.placeholder}
          className="w-46"
        />
      )

    case 'folder':
      return (
        <Button
          variant="outline"
          onClick={() => {
            // TODO: Implement folder selection logic
          }}
          className="w-46"
        >
          <FolderOpen className="size-4" />
          Select
        </Button>
      )

    default:
      return null
  }
}
