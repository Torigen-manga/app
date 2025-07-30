import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LibraryCard } from "@renderer/components/cards";
import {
  CategoryCard,
  CategorySection,
} from "@renderer/components/library/category";
import {
  AddCategoryDialog,
  CategoryAlertDialog,
} from "@renderer/components/library/dialogs";
import { Button } from "@renderer/components/ui/button";
import { Menubar, MenubarLabel } from "@renderer/components/ui/menubar";
import {
  useCategoryManagement,
  useCategoryReorder,
  useDragAndDrop,
  useLibraryData,
  useLibraryDialogs,
} from "@renderer/hooks/pages/library";
import type React from "react";
import { ErrorPage } from "./error";
import { LoadingPage } from "./loading";

export default function Library(): React.JSX.Element {
  const { data, isLoading, error, hasData } = useLibraryData();

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
      <header className="sticky flex h-12 w-full items-center border-b px-2">
        <Menubar>
          <MenubarLabel className="select-none font-bold text-base">
            Library
          </MenubarLabel>

          <Button
            className="h-full rounded-sm px-2"
            onClick={openAddCategoryDialog}
            size="sm"
            variant="ghost"
          >
            Add Category
          </Button>
          <Button
            className="h-full rounded-sm px-2"
            disabled={isReordering}
            onClick={toggleReorderMode}
            size="sm"
            variant={reorderMode ? "default" : "ghost"}
          >
            {reorderMode ? "Done" : "Reorder"}
          </Button>
        </Menubar>
      </header>
      <div className="flex h-full w-full flex-1 flex-col gap-4 overflow-y-scroll px-2 py-4">
        <CategoryCard defaultOpen id="all-entries" title="All Entries">
          {data.entries.map((entry) => (
            <LibraryCard
              image={entry.cover}
              key={entry.id}
              mangaId={entry.mangaId}
              property="shadow"
              source={entry.sourceId}
              title={entry.title}
              unreadCount={entry.cachedTotalChapters || 0}
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
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
}
