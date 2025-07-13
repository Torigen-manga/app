import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
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
  useGetLibrary,
  useRemoveCategory,
  useRenameCategory,
  useReorderCategories,
} from "@renderer/hooks/library";
import React from "react";
import { toast } from "sonner";
import { ErrorPage } from "./error";
import { LoadingPage } from "./loading";

export default function Library(): React.JSX.Element {
  const { data, isLoading, error } = useGetLibrary();
  const [categories, setCategories] = React.useState(
    () => data?.categories ?? []
  );
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] =
    React.useState(false);
  const [categoryAlertDialogOpen, setCategoryAlertDialogOpen] =
    React.useState(false);
  const [deleteCategoryData, setDeleteCategoryData] = React.useState<{
    title: string;
    categoryId: string;
  }>({ title: "", categoryId: "" });
  const [reorderMode, setReorderMode] = React.useState(false);

  const useReorder = useReorderCategories();
  const renameCategory = useRenameCategory();
  const deleteCategory = useRemoveCategory();

  const sensors = useSensors(useSensor(PointerSensor));

  React.useEffect(() => {
    if (data?.categories) {
      const sortedCategories = [...data.categories].sort((a, b) => {
        return a.order - b.order;
      });
      setCategories(sortedCategories);
    }
  }, [data?.categories]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = categories.findIndex((cat) => cat.id === active.id);
    const newIndex = categories.findIndex((cat) => cat.id === over.id);

    const newOrder = arrayMove(categories, oldIndex, newIndex);
    setCategories(newOrder);

    try {
      await useReorder.mutateAsync(newOrder.map((cat) => cat.id));
      toast.success("Categories reordered successfully");
    } catch {
      toast.error("Failed to reorder categories. Please try again.");
    }
  };

  const handleRenameCategory = async (categoryId: string, newName: string) => {
    try {
      await renameCategory.mutateAsync({ id: categoryId, name: newName });
      toast.success("Category renamed successfully");
    } catch {
      toast.error("Failed to rename category. Please try again.");
    }
  };

  const handleDeleteCategoryClick = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      setDeleteCategoryData({
        title: category.name,
        categoryId,
      });
      setCategoryAlertDialogOpen(true);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory.mutateAsync(categoryId);
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage code={500} message="Failed to load library data" />;
  }

  if (!data) {
    return <ErrorPage code={500} message="No library data available" />;
  }

  return (
    <main className="flex h-full w-full flex-col">
      <AddCategoryDialog
        onOpenChange={setAddCategoryDialogOpen}
        open={addCategoryDialogOpen}
      />
      <CategoryAlertDialog
        categoryId={deleteCategoryData.categoryId}
        confirmDelete={handleDeleteCategory}
        onOpenChange={setCategoryAlertDialogOpen}
        open={categoryAlertDialogOpen}
        title={deleteCategoryData.title}
      />
      <header className="sticky flex h-12 w-full items-center px-2">
        <Menubar>
          <MenubarLabel className="select-none font-bold text-base">
            Library
          </MenubarLabel>

          <Button
            className="h-full rounded-sm px-2"
            onClick={() => setAddCategoryDialogOpen(true)}
            size="sm"
            variant="ghost"
          >
            Add Category
          </Button>
          <Button
            className="h-full rounded-sm px-2"
            onClick={() => setReorderMode(!reorderMode)}
            size="sm"
            variant={reorderMode ? "default" : "ghost"}
          >
            {reorderMode ? "Done" : "Reorder"}
          </Button>
        </Menubar>
      </header>
      <div className="flex h-full w-full flex-1 flex-col gap-4 overflow-y-scroll px-2 py-4">
        <CategoryCard defaultOpen id="all-entries" title="All Entries">
          {data.entries?.map((entry) => {
            const url = `/manga/${entry.sourceId}/${entry.mangaId}`;

            return (
              <LibraryCard
                image={entry.cover}
                key={entry.id}
                property="shadow"
                title={entry.title}
                unreadCount={entry.cachedTotalChapters || 0}
                url={url}
              />
            );
          })}
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
                onDelete={handleDeleteCategoryClick}
                onRename={handleRenameCategory}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
}
