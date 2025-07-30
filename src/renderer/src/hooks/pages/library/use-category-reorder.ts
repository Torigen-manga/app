import type { CategoryTable } from "@common/index";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { categoryMethods } from "@renderer/hooks/services/library";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCategoryReorder(initialCategories: CategoryTable[] = []) {
	const [categories, setCategories] = useState<CategoryTable[]>([]);
	const [reorderMode, setReorderMode] = useState(false);
	const useReorder = categoryMethods.MUTATIONS.useReorderCategories();

	useEffect(() => {
		if (initialCategories.length > 0) {
			const sortedCategories = [...initialCategories].sort(
				(a, b) => a.order - b.order
			);
			setCategories(sortedCategories);
		}
	}, [initialCategories]);

	async function handleDragEnd(event: DragEndEvent) {
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
			toast.success("Categories reordered successfully", {
				description: "Your categories have been reordered.",
			});
		} catch {
			setCategories(categories);
			toast.error("Failed to reorder categories. Please try again.");
		}
	}

	function toggleReorderMode() {
		setReorderMode(!reorderMode);
	}

	return {
		categories,
		reorderMode,
		isReordering: useReorder.isPending,
		handleDragEnd,
		toggleReorderMode,
	};
}
