import type { CategoryTable } from "@common/index";
import { categoryMethods } from "@renderer/hooks/services/library";
import { useState } from "react";
import { toast } from "sonner";

export function useCategoryManagement(categories: CategoryTable[]) {
	const [deleteCategoryData, setDeleteCategoryData] = useState<CategoryTable>({
		name: "",
		id: "",
		order: 0,
	});

	const renameCategory = categoryMethods.MUTATIONS.useRenameCategory();
	const deleteCategory = categoryMethods.MUTATIONS.useRemoveCategory();

	async function handleRenameCategory(categoryId: string, newName: string) {
		if (!newName.trim()) {
			toast.error("Category name cannot be empty");
			return;
		}

		try {
			await renameCategory.mutateAsync({
				id: categoryId,
				name: newName.trim(),
			});
		} catch {
			toast.error("Failed to rename category. Please try again.");
		}
	}

	function handleDeleteCategoryClick(categoryId: string) {
		const category = categories.find((cat) => cat.id === categoryId);
		if (category) {
			setDeleteCategoryData({
				name: category.name,
				id: categoryId,
				order: category.order,
			});

			return true;
		}
		return false;
	}

	async function handleDeleteCategory(categoryId: string) {
		try {
			await deleteCategory.mutateAsync(categoryId);
			toast.success("Category deleted successfully");
			setDeleteCategoryData({ name: "", id: "", order: 0 });
		} catch {
			toast.error("Failed to delete category. Please try again.");
		}
	}

	return {
		deleteCategoryData,
		isRenaming: renameCategory.isPending,
		isDeleting: deleteCategory.isPending,
		handleRenameCategory,
		handleDeleteCategoryClick,
		handleDeleteCategory,
	};
}
