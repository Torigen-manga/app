import { Badge } from "../ui/badge";

interface ParamBadgeProps {
  value: string;
  onClick: (value: string) => void;
  isSelected: boolean;
}

function ParamBadge({ value, onClick, isSelected }: ParamBadgeProps) {
  return (
    <button
      className="cursor-pointer"
      onClick={() => onClick(value)}
      type="button"
    >
      <Badge variant={isSelected ? "default" : "outline"}>{value}</Badge>
    </button>
  );
}

type TagSelectMMode = "include" | "exclude" | null;

interface TagBadgeProps {
  tag: string;
  mode: TagSelectMMode;
  onChange: (mode: TagSelectMMode) => void;
}

function TagBadge({ tag, mode, onChange }: TagBadgeProps) {
  const cycleMode = () => {
    let next: TagSelectMMode;

    if (mode === null) {
      next = "include";
    } else if (mode === "include") {
      next = "exclude";
    } else {
      next = null;
    }

    onChange(next);
  };

  let variant: "default" | "outline" | "destructive";

  if (mode === "include") {
    variant = "default";
  } else if (mode === "exclude") {
    variant = "destructive";
  } else {
    variant = "outline";
  }

  return (
    <button className="cursor-pointer" onClick={cycleMode} type="button">
      <Badge variant={variant}>{tag}</Badge>
    </button>
  );
}

export { ParamBadge, TagBadge, type TagSelectMMode };
