import { libraryMethods } from "@renderer/hooks/services/library";
import { useState } from "react";
import { toast } from "sonner";

export function useRemoveFromLibrary(sourceId: string, mangaId: string) {
	const removeManga = libraryMethods.MUTATIONS.useRemoveMangaFromLibrary();
	const [isOpen, setIsOpen] = useState(false);

	const handleRemove = async () => {
		try {
			const libraryEntryId = `${sourceId}__${mangaId}`;
			await removeManga.mutateAsync(libraryEntryId);
			setIsOpen(false);
		} catch (error) {
			toast("Failed to remove manga from library", {
				description: (error as Error).message || undefined,
			});
		}
	};

	return {
		isOpen,
		setIsOpen,
		handleRemove,
		isRemoving: removeManga.isPending,
	};
}
