import { libraryMethods } from "@renderer/hooks/services/library";
import { useMemo } from "react";

export function useLibraryData() {
	const { data, isLoading, error } = libraryMethods.QUERIES.useGetLibrary();

	const processedData = useMemo(() => {
		if (!data) {
			return null;
		}

		return {
			...data,
			entries: data.entries || [],
			categories: data.categories || [],
		};
	}, [data]);

	return {
		data: processedData,
		isLoading,
		error,
		hasData: !!processedData,
	};
}
