import type { AppManga } from "@common/index";
import {
	categoryMethods,
	libraryMethods,
} from "@renderer/hooks/services/library";
import { useMemo, useState } from "react";
import z from "zod";

const categorySchema = z.object({
	name: z.string().nonempty({ message: "Category name is required" }),
	newName: z
		.string()
		.optional()
		.refine((val) => !val || val.trim() !== "", {
			message: "New category name cannot be neither empty nor whitespace only",
		}),
});

export function useLibraryDialog(manga: AppManga) {
	const { data: library } = libraryMethods.QUERIES.useGetLibrary();
	const [selectValue, setSelectValue] = useState<string>("");
	const [newCategoryName, setNewCategoryName] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [addToCategory, setAddToCategory] = useState(false);

	const addCategory = categoryMethods.MUTATIONS.useAddCategory();
	const addMangaToLibrary = libraryMethods.MUTATIONS.useAddMangaToLibrary();
	const addCategoryToEntry = categoryMethods.MUTATIONS.useAddCategoryToEntry();

	const categoryList = useMemo(() => {
		if (!library?.categories.length) {
			return [{ id: "new-ct", name: "New Category" }];
		}

		return [
			...library.categories.map((cat) => ({ id: cat.id, name: cat.name })),
			{ id: "new-ct", name: "New Category" },
		];
	}, [library?.categories]);

	const isAddDisabled = useMemo(() => {
		return (
			addMangaToLibrary.isPending ||
			addCategory.isPending ||
			addCategoryToEntry.isPending ||
			(addToCategory &&
				(selectValue === "" ||
					(selectValue === "new-ct" && newCategoryName.trim().length === 0)))
		);
	}, [
		addMangaToLibrary.isPending,
		addCategory.isPending,
		addCategoryToEntry.isPending,
		addToCategory,
		selectValue,
		newCategoryName,
	]);

	const reset = () => {
		setSelectValue("");
		setNewCategoryName("");
		setFormError(null);
		setIsOpen(false);
		setAddToCategory(false);
	};

	const handleAdd = async () => {
		try {
			if (!addToCategory) {
				await addMangaToLibrary.mutateAsync(manga);
				reset();
				return;
			}

			const validationResult = categorySchema.safeParse({
				name: selectValue,
				newName: selectValue === "new-ct" ? newCategoryName : undefined,
			});

			if (!validationResult.success) {
				setFormError(validationResult.error.issues[0].message);
				return;
			}

			await addMangaToLibrary.mutateAsync(manga);

			const libraryEntryId = `${manga.sourceId}__${manga.mangaId}`;

			if (selectValue === "new-ct") {
				const newCategoryId = await addCategory.mutateAsync(
					newCategoryName.trim()
				);
				await addCategoryToEntry.mutateAsync({
					categoryId: newCategoryId,
					libraryEntryId,
				});
			} else {
				await addCategoryToEntry.mutateAsync({
					categoryId: selectValue,
					libraryEntryId,
				});
			}

			reset();
		} catch {
			setFormError("Failed to add manga to library. Please try again.");
		}
	};

	return {
		selectValue,
		setSelectValue,
		newCategoryName,
		setNewCategoryName,
		formError,
		isOpen,
		setIsOpen,
		addToCategory,
		setAddToCategory,

		categoryList,
		isAddDisabled,

		handleAdd,
		reset,
	};
}
