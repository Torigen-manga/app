import type { SearchParams, Tag } from "@torigen/mounter";
import { motion } from "motion/react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { ParamBadge, TagBadge, type TagSelectMMode } from "./badges";

interface ParametersCompProps {
  onChange: (key: string, value: string | number | boolean) => void;
  parameters: Record<string, string | number | boolean | string[]>;
  searchParamsMetadata: Record<string, SearchParams>;
  includedTags: Tag[];
  excludedTags: Tag[];
  setIncludedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setExcludedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  tags: Tag[];
  source: string;
}

function ParameterComp({
  onChange,
  parameters,
  searchParamsMetadata,
  includedTags,
  excludedTags,
  setIncludedTags,
  setExcludedTags,
  tags,
  source,
}: ParametersCompProps) {
  return (
    <motion.div
      animate={{ opacity: source ? 1 : 0 }}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      initial={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      {tags.length > 0 && (
        <div className="space-y-2 rounded-lg border p-2">
          <h3 className="font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              let mode: TagSelectMMode = null;

              if (includedTags.some((t) => t.id === tag.id)) {
                mode = "include";
              } else if (excludedTags.some((t) => t.id === tag.id)) {
                mode = "exclude";
              }

              return (
                <TagBadge
                  key={tag.id}
                  mode={mode}
                  onChange={(newMode) => {
                    setIncludedTags((prev) =>
                      newMode === "include"
                        ? [...prev.filter((t) => t.id !== tag.id), tag]
                        : prev.filter((t) => t.id !== tag.id)
                    );
                    setExcludedTags((prev) =>
                      newMode === "exclude"
                        ? [...prev.filter((t) => t.id !== tag.id), tag]
                        : prev.filter((t) => t.id !== tag.id)
                    );
                  }}
                  tag={tag.label}
                />
              );
            })}
          </div>
        </div>
      )}

      {Object.entries(searchParamsMetadata || {}).map(([key, param]) => (
        <div className="space-y-2 rounded-lg border p-2" key={key}>
          <h3 className="font-semibold">{param.title}</h3>

          {param.type === "string" && (
            <Input
              className="rounded-lg"
              onChange={(e) => onChange(key, e.target.value)}
              value={(parameters[key] as string) || ""}
            />
          )}

          {param.type === "number" && (
            <Input
              className="rounded-lg"
              max={param.max}
              min={param.min}
              onChange={(e) => onChange(key, Number.parseFloat(e.target.value))}
              type="number"
              value={(parameters[key] as number) || ""}
            />
          )}

          {param.type === "boolean" && (
            <Checkbox
              checked={parameters[key] as boolean}
              className="rounded-lg"
              onCheckedChange={(c) => onChange(key, c === true)}
            />
          )}

          {param.type === "select" && param.options && (
            <div className="flex flex-wrap gap-2">
              {param.options.map((option) => (
                <ParamBadge
                  isSelected={parameters[key] === option}
                  key={option}
                  onClick={(value) => onChange(key, value)}
                  value={option}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

export { ParameterComp };
