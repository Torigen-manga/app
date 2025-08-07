import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LibraryCard } from "@renderer/components/cards";
import {
  AddCategoryDialog,
  CategoryAlertDialog,
  CategoryCard,
  CategorySection,
  RefreshProgressDialog,
} from "@renderer/components/pages/library";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import {
  useCategoryManagement,
  useCategoryReorder,
  useDragAndDrop,
  useLibraryData,
  useLibraryDialogs,
  useLibraryEntriesWithUnreadCounts,
} from "@renderer/hooks/pages/library";
import { libraryMethods } from "@renderer/hooks/services/library";
import { GripVertical, Plus, RotateCw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ErrorPage } from "./error";
import { LoadingPage } from "./loading";

export default function Library(): React.JSX.Element {
  const { data, isLoading, error, hasData } = useLibraryData();

  const refreshAllMutation = libraryMethods.MUTATIONS.useRefreshAllLibrary();
  const { data: isRefreshing } =
    libraryMethods.QUERIES.useIsLibraryRefreshing();
  const { progress: refreshProgress, clearProgress } =
    libraryMethods.QUERIES.useRefreshProgress();
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);

  const {
    categories,
    reorderMode,
    isReordering,
    handleDragEnd,
    toggleReorderMode,
  } = useCategoryReorder(data?.categories);

  const {
    deleteCategoryData,
    handleRenameCategory,
    handleDeleteCategoryClick,
    handleDeleteCategory,
  } = useCategoryManagement(categories);

  const {
    addCategoryDialogOpen,
    setAddCategoryDialogOpen,
    openAddCategoryDialog,
    categoryAlertDialogOpen,
    setCategoryAlertDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
  } = useLibraryDialogs();

  const { sensors } = useDragAndDrop();

  useEffect(() => {
    if (refreshProgress?.isRefreshing) {
      setShowRefreshDialog(true);
    }
  }, [refreshProgress?.isRefreshing]);

  useEffect(() => {
    if (refreshAllMutation.isPending) {
      setShowRefreshDialog(true);
    }
  }, [refreshAllMutation.isPending]);

  const [searchParam, setSearchParam] = useState("");

  const filteredEntries = useMemo(() => {
    if (!searchParam.trim()) {
      return data?.entries || [];
    }

    const searchLower = searchParam.toLowerCase().trim();
    return (data?.entries || []).filter((entry) =>
      entry.title.toLowerCase().includes(searchLower)
    );
  }, [data?.entries, searchParam]);

  const { entries: entriesWithUnreadCounts } =
    useLibraryEntriesWithUnreadCounts(filteredEntries);

  const handleDeleteClick = (categoryId: string) => {
    const shouldOpenDialog = handleDeleteCategoryClick(categoryId);
    if (shouldOpenDialog) {
      openDeleteDialog();
    }
  };

  const handleConfirmDelete = async (categoryId: string) => {
    await handleDeleteCategory(categoryId);
    closeDeleteDialog();
  };

  const handleRefreshLibrary = async () => {
    setShowRefreshDialog(true);
    try {
      await refreshAllMutation.mutateAsync();
      const hasProgressOrIsRefreshing = refreshProgress || isRefreshing;
      if (!hasProgressOrIsRefreshing) {
        setShowRefreshDialog(false);
      }
    } catch {
      setShowRefreshDialog(false);
    }
  };

  const handleCloseRefreshDialog = () => {
    const isRefreshActive = isRefreshing || refreshAllMutation.isPending;
    if (!isRefreshActive) {
      setShowRefreshDialog(false);
      clearProgress();
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage code={500} message="Failed to load library data" />;
  }

  if (!(hasData && data)) {
    return <ErrorPage code={500} message="No library data available" />;
  }

  return (
    <main className="flex h-full w-full flex-col">
      <AddCategoryDialog
        onOpenChange={setAddCategoryDialogOpen}
        open={addCategoryDialogOpen}
      />
      <CategoryAlertDialog
        categoryId={deleteCategoryData.id}
        confirmDelete={handleConfirmDelete}
        onOpenChange={setCategoryAlertDialogOpen}
        open={categoryAlertDialogOpen}
        title={deleteCategoryData.name}
      />
      <RefreshProgressDialog
        isOpen={showRefreshDialog}
        onClose={handleCloseRefreshDialog}
        progress={refreshProgress}
      />
      <header className="sticky top-0 z-10 border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-bold text-3xl tracking-tight">Library</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium">{data.entries.length}</span>
                <span>manga</span>
              </div>
              <span className="text-muted-foreground/50">•</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">{categories.length}</span>
                <span>categories</span>
              </div>
              {searchParam && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="font-medium">
                      {filteredEntries.length}
                    </span>
                    <span>matches</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                className="w-54 pr-9 pl-9 transition-all xl:w-72"
                onChange={(e) => setSearchParam(e.target.value)}
                placeholder="Search your manga library..."
                value={searchParam}
              />
              {searchParam && (
                <button
                  className="-translate-y-1/2 absolute top-1/2 right-3 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setSearchParam("")}
                  type="button"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="gap-2 border-border/50 transition-colors hover:border-border"
                disabled={isRefreshing || refreshAllMutation.isPending}
                onClick={handleRefreshLibrary}
                size="sm"
                variant="outline"
              >
                <RotateCw
                  className={`size-4 ${
                    isRefreshing || refreshAllMutation.isPending
                      ? "animate-spin"
                      : ""
                  }`}
                />
                {isRefreshing || refreshAllMutation.isPending
                  ? "Refreshing..."
                  : "Refresh"}
              </Button>
              <Button
                className="gap-2 border-border/50 transition-colors hover:border-border"
                onClick={openAddCategoryDialog}
                size="sm"
                variant="outline"
              >
                <Plus className="size-4" />
                Add Category
              </Button>
              <Button
                className="gap-2 border-border/50 transition-colors hover:border-border"
                disabled={isReordering}
                onClick={toggleReorderMode}
                size="sm"
                variant={reorderMode ? "default" : "outline"}
              >
                <GripVertical className="size-4" />
                {reorderMode ? "Done" : "Reorder"}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex h-full w-full flex-1 flex-col gap-6 overflow-y-scroll p-6">
        <CategoryCard
          id="all-entries"
          searchParam={searchParam}
          title="All Entries"
        >
          {entriesWithUnreadCounts.map((entry) => (
            <LibraryCard
              image={entry.cover}
              key={entry.id}
              mangaId={entry.mangaId}
              source={entry.sourceId}
              title={entry.title}
              unreadCount={entry.unreadCount}
            />
          ))}
        </CategoryCard>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((category) => (
              <CategorySection
                categoryId={category.id}
                categoryName={category.name}
                draggable={reorderMode}
                key={category.id}
                onDelete={handleDeleteClick}
                onRename={handleRenameCategory}
                reorderMode={reorderMode}
                searchParam={searchParam}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
}
