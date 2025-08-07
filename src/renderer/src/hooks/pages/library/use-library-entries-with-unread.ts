import type { LibraryEntryTable } from "@common/index";
import { libraryMethods } from "@renderer/hooks/services/library";
import { useMemo } from "react";

export function useLibraryEntriesWithUnreadCounts(
	entries: LibraryEntryTable[]
) {
	const { data: libraryWithUnreadCounts, isLoading } =
		libraryMethods.QUERIES.useGetLibraryWithUnreadCounts();

	const entriesWithUnreadCounts = useMemo(() => {
		if (!libraryWithUnreadCounts) {
			return entries.map((entry) => ({
				...entry,
				unreadCount: 0,
				isLoadingUnreadCount: isLoading,
			}));
		}

		return entries.map((entry) => {
			const entryWithUnread = libraryWithUnreadCounts.find(
				(libEntry) => libEntry.id === entry.id
			);

			return {
				...entry,
				unreadCount: entryWithUnread?.unreadCount || 0,
				isLoadingUnreadCount: false,
			};
		});
	}, [entries, libraryWithUnreadCounts, isLoading]);

	return {
		entries: entriesWithUnreadCounts,
		isLoadingUnreadCounts: isLoading,
	};
}
