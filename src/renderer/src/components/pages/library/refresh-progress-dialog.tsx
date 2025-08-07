import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { Progress } from "@renderer/components/ui/progress";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { cn } from "@renderer/lib/utils";
import { CheckCircle, Clock, Eye, RotateCw, XCircle } from "lucide-react";
import { useState } from "react";

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
      return "border-primary";
    case "error":
      return "border-destructive";
    case "updating":
      return "bg-accent";
    default:
      return "bg-gray-100";
  }
}

function CategoryOverviewItem({
  category,
  isCurrent,
  onViewDetails,
}: {
  category: CategoryRefreshProgress;
  isCurrent: boolean;
  onViewDetails: () => void;
}) {
  const completionPercentage =
    category.total > 0
      ? Math.round((category.completed / category.total) * 100)
      : 0;

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-lg border p-3 text-primary-foreground transition-colors hover:bg-muted",
        isCurrent && "border-primary bg-primary/15"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
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
          <div className="text-muted-foreground text-sm">
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
        <Button onClick={onViewDetails} size="sm" variant="outline">
          <Eye className="mr-1 size-4" />
          View
        </Button>
      </div>
    </div>
  );
}

function CategoryDetailDialog({
  isOpen,
  onClose,
  category,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryRefreshProgress | null;
}) {
  if (!category) {
    return null;
  }

  const completionPercentage =
    category.total > 0
      ? Math.round((category.completed / category.total) * 100)
      : 0;

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {!category.isComplete && (
              <RotateCw className="size-4 animate-spin" />
            )}
            {category.categoryName} - Progress Details
          </DialogTitle>
          <DialogDescription>
            Detailed progress for entries in this category
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Summary */}
          <div className="rounded border p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">Category Progress</span>
              <span className="text-gray-600 text-sm">
                {category.completed} / {category.total}
              </span>
            </div>
            <Progress className="mb-2" value={completionPercentage} />
            <div className="flex justify-between text-primary-foreground text-sm">
              <span>{completionPercentage}% complete</span>
              {category.errors > 0 && (
                <span className="text-red-600">{category.errors} errors</span>
              )}
            </div>
          </div>

          {/* Entries List */}
          <div className="space-y-2">
            <h3 className="font-medium">Entries</h3>
            <ScrollArea className="max-h-96">
              <div className="space-y-1">
                {category.entries.map((entry) => (
                  <div
                    className="flex min-w-0 items-center justify-between rounded px-3 py-2 text-sm hover:bg-muted"
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
              </div>
            </ScrollArea>
          </div>

          {category.entries.some((e) => e.error) && (
            <div className="space-y-2">
              <h3 className="font-medium text-red-600">Error Details</h3>
              <ScrollArea className="max-h-32">
                <div className="space-y-1">
                  {category.entries
                    .filter((e) => e.error)
                    .map((entry) => (
                      <div
                        className="rounded bg-red-50 px-2 py-1 text-red-500 text-xs"
                        key={`error-${entry.entryId}`}
                      >
                        <strong>{entry.title}:</strong> {entry.error}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RefreshProgressDialog({
  isOpen,
  onClose,
  progress,
}: RefreshProgressDialogProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryRefreshProgress | null>(null);
  const [showCategoryDetail, setShowCategoryDetail] = useState(false);

  const handleViewCategoryDetails = (category: CategoryRefreshProgress) => {
    setSelectedCategory(category);
    setShowCategoryDetail(true);
  };

  const handleCloseCategoryDetail = () => {
    setShowCategoryDetail(false);
    setSelectedCategory(null);
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
    <>
      {/* Main Progress Dialog */}
      <Dialog onOpenChange={onClose} open={isOpen && !showCategoryDetail}>
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
            <div className="rounded border p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">Overall Progress</span>
                <span className="text-gray-600 text-sm">
                  {progress.overallProgress.completed} /{" "}
                  {progress.overallProgress.total}
                </span>
              </div>
              <Progress className="mb-2" value={overallPercentage} />
              <div className="flex justify-between text-primary-foreground text-sm">
                <span>{overallPercentage}% complete</span>
                {progress.overallProgress.errors > 0 && (
                  <span className="text-red-600">
                    {progress.overallProgress.errors} errors
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Categories</h3>
              <ScrollArea className="max-h-96">
                <div className="space-y-2">
                  {progress.categories.map((category) => (
                    <CategoryOverviewItem
                      category={category}
                      isCurrent={
                        progress.currentCategory === category.categoryId
                      }
                      key={category.categoryId}
                      onViewDetails={() => handleViewCategoryDetails(category)}
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

      {/* Category Detail Dialog */}
      <CategoryDetailDialog
        category={selectedCategory}
        isOpen={showCategoryDetail}
        onClose={handleCloseCategoryDetail}
      />
    </>
  );
}
