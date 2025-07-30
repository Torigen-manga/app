import { useState } from "react";

export function useLibraryDialogs() {
	const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
	const [categoryAlertDialogOpen, setCategoryAlertDialogOpen] = useState(false);

	const openAddCategoryDialog = () => setAddCategoryDialogOpen(true);
	const closeAddCategoryDialog = () => setAddCategoryDialogOpen(false);

	const openDeleteDialog = () => setCategoryAlertDialogOpen(true);
	const closeDeleteDialog = () => setCategoryAlertDialogOpen(false);

	return {
		// Add Category Dialog
		addCategoryDialogOpen,
		setAddCategoryDialogOpen,
		openAddCategoryDialog,
		closeAddCategoryDialog,

		// Delete Category Dialog
		categoryAlertDialogOpen,
		setCategoryAlertDialogOpen,
		openDeleteDialog,
		closeDeleteDialog,
	};
}
