import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from "@renderer/components/ui/alert-dialog";
import { categoryMethods } from "@renderer/hooks/services/library";
import React from "react";
import { Button } from "../../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";

interface AddCategoryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function AddCategoryDialog({
	open,
	onOpenChange,
}: AddCategoryDialogProps): React.JSX.Element {
	const [categoryName, setCategoryName] = React.useState<string>("");
	const addCategory = categoryMethods.MUTATIONS.useAddCategory();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await addCategory.mutateAsync(categoryName);
		onOpenChange(false);
	};

	const isDisabled = categoryName.trim() === "";

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogTitle>Add Category</DialogTitle>
				<DialogDescription>
					<Input
						onChange={(e) => setCategoryName(e.target.value)}
						placeholder="Category name"
						value={categoryName}
					/>
				</DialogDescription>
				<DialogFooter>
					<Button disabled={isDisabled} onClick={handleSubmit}>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface CategoryAlertDialogProps {
	categoryId: string;
	title: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	confirmDelete: (categoryId: string) => void;
}

function CategoryAlertDialog({
	categoryId,
	title,
	open,
	onOpenChange,
	confirmDelete,
}: CategoryAlertDialogProps): React.JSX.Element {
	function handleDelete() {
		confirmDelete(categoryId);
		onOpenChange(false);
	}

	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogTitle>Delete Category</AlertDialogTitle>
				<AlertDialogDescription>
					Are you sure you want to delete <strong>{title}</strong>? This action
					cannot be undone.
				</AlertDialogDescription>
				<div className="mt-4 flex justify-end gap-2">
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-600 text-white hover:bg-red-700"
						onClick={handleDelete}
					>
						Delete
					</AlertDialogAction>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export { AddCategoryDialog, CategoryAlertDialog };
