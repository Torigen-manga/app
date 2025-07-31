import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { Slider } from "@renderer/components/ui/slider";
import { Switch } from "@renderer/components/ui/switch";
import type { Any, Preferences } from "@renderer/types/preferences";
import { FolderOpen } from "lucide-react";

interface SettingRendererProps {
  setting: Preferences;
  value: Any;
  onChange: (value: Any) => void;
}

export function SettingRenderer({
  setting,
  value,
  onChange,
}: SettingRendererProps) {
  switch (setting.type) {
    case "select": {
      const selectValue = value?.toString() || "";
      const options = setting.options || [];

      return (
        <Select onValueChange={onChange} value={selectValue}>
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
      );
    }

    case "switch":
      return <Switch checked={value} onCheckedChange={onChange} />;

    case "slider":
      return (
        <div className="w-46">
          <Slider
            max={setting.max}
            min={setting.min}
            onValueChange={(values) => onChange(values[0])}
            step={setting.step}
            value={[value]}
          />
        </div>
      );

    case "input":
      return (
        <Input
          className="w-46"
          onChange={(e) => onChange(e.target.value)}
          placeholder={setting.placeholder}
          value={value}
        />
      );

    case "folder":
      return (
        <Button
          className="w-46"
          onClick={() => {
            // TODO: Implement folder selection logic
          }}
          variant="outline"
        >
          <FolderOpen className="size-4" />
          Select
        </Button>
      );

    default:
      return null;
  }
}
