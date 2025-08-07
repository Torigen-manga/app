import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { Progress } from "@renderer/components/ui/progress";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  RotateCw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CategoryRefreshProgress {
  categoryId: string;
  categoryName: string;
  total: number;
  completed: number;
  errors: number;
  isComplete: boolean;
  entries: Array<{
    entryId: string;
    title: string;
    status: "pending" | "updating" | "completed" | "error";
    error?: string;
  }>;
}

interface LibraryRefreshProgress {
  isRefreshing: boolean;
  overallProgress: {
    completed: number;
    total: number;
    errors: number;
  };
  categories: CategoryRefreshProgress[];
  currentCategory?: string;
}

interface RefreshProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  progress: LibraryRefreshProgress | null;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="size-4 text-green-500" />;
    case "error":
      return <XCircle className="size-4 text-red-500" />;
    case "updating":
      return <RotateCw className="size-4 animate-spin text-blue-500" />;
    default:
      return <Clock className="size-4 text-gray-400" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "error":
      return "bg-red-100 text-red-800";
    case "updating":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function CategoryProgressItem({
  category,
  isExpanded,
  onToggle,
  isCurrent,
}: {
  category: CategoryRefreshProgress;
  isExpanded: boolean;
  onToggle: () => void;
  isCurrent: boolean;
}) {
  const completionPercentage =
    category.total > 0
      ? Math.round((category.completed / category.total) * 100)
      : 0;

  return (
    <Collapsible onOpenChange={onToggle} open={isExpanded}>
      <CollapsibleTrigger asChild>
        <div
          className={`flex w-full items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50 ${
            isCurrent ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="size-4 flex-shrink-0 text-gray-400" />
            ) : (
              <ChevronRight className="size-4 flex-shrink-0 text-gray-400" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="min-w-0 truncate font-medium"
                  title={category.categoryName}
                >
                  {category.categoryName}
                </span>
                {isCurrent && (
                  <Badge className="flex-shrink-0 text-xs" variant="secondary">
                    Current
                  </Badge>
                )}
              </div>
              <div className="text-gray-600 text-sm">
                {category.completed} of {category.total} completed
                {category.errors > 0 && (
                  <span className="ml-2 text-red-600">
                    • {category.errors} errors
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-medium text-sm">{completionPercentage}%</div>
              {category.isComplete ? (
                <div className="text-green-600 text-xs">Complete</div>
              ) : (
                <div className="text-gray-500 text-xs">In progress</div>
              )}
            </div>
            <Progress className="w-20" value={completionPercentage} />
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2 ml-7 space-y-1">
          <ScrollArea className="max-h-40">
            {category.entries.map((entry) => (
              <div
                className="flex min-w-0 items-center justify-between rounded px-3 py-2 text-sm hover:bg-gray-50"
                key={entry.entryId}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {getStatusIcon(entry.status)}
                  <span className="min-w-0 truncate" title={entry.title}>
                    {entry.title}
                  </span>
                </div>
                <Badge
                  className={`flex-shrink-0 text-xs ${getStatusColor(
                    entry.status
                  )}`}
                  variant="outline"
                >
                  {entry.status}
                </Badge>
              </div>
            ))}
          </ScrollArea>
          {category.entries.some((e) => e.error) && (
            <div className="mt-2 space-y-1">
              <div className="font-medium text-red-600 text-xs">Errors:</div>
              {category.entries
                .filter((e) => e.error)
                .map((entry) => (
                  <div
                    className="px-2 text-red-500 text-xs"
                    key={`error-${entry.entryId}`}
                  >
                    {entry.title}: {entry.error}
                  </div>
                ))}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function RefreshProgressDialog({
  isOpen,
  onClose,
  progress,
}: RefreshProgressDialogProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (progress?.currentCategory) {
      setExpandedCategories(
        (prev) => new Set([...prev, progress.currentCategory as string])
      );
    }
  }, [progress?.currentCategory]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  if (!progress) {
    return null;
  }

  const overallPercentage =
    progress.overallProgress.total > 0
      ? Math.round(
          (progress.overallProgress.completed /
            progress.overallProgress.total) *
            100
        )
      : 0;

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-4xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {progress.isRefreshing && (
              <RotateCw className="size-4 animate-spin" />
            )}
            Library Refresh Progress
          </DialogTitle>
          <DialogDescription>
            {progress.isRefreshing
              ? "Refreshing manga metadata and chapter counts..."
              : "Library refresh completed"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">Overall Progress</span>
              <span className="text-gray-600 text-sm">
                {progress.overallProgress.completed} /{" "}
                {progress.overallProgress.total}
              </span>
            </div>
            <Progress className="mb-2" value={overallPercentage} />
            <div className="flex justify-between text-gray-600 text-sm">
              <span>{overallPercentage}% complete</span>
              {progress.overallProgress.errors > 0 && (
                <span className="text-red-600">
                  {progress.overallProgress.errors} errors
                </span>
              )}
            </div>
          </div>

          {/* Categories Progress */}
          <div className="space-y-2">
            <h3 className="font-medium">Categories</h3>
            <ScrollArea className="max-h-96">
              <div className="space-y-2">
                {progress.categories.map((category) => (
                  <CategoryProgressItem
                    category={category}
                    isCurrent={progress.currentCategory === category.categoryId}
                    isExpanded={expandedCategories.has(category.categoryId)}
                    key={category.categoryId}
                    onToggle={() => toggleCategory(category.categoryId)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Close Button */}
          {!progress.isRefreshing && (
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
