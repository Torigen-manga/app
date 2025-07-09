import {
	type APIResponse,
	type AppPreferences,
	channels,
	type ExperimentalPreferences,
	type LayoutPreferences,
	type LibraryHistoryPreferences,
	type ReaderPreferences,
	type SystemBehaviorPreferences,
} from "@common/index";
import { invoke } from "@renderer/lib/ipcMethods";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const PREFERENCES_QUERY_KEY = ["preferences"] as const;

function usePreferences() {
	const queryClient = useQueryClient();

	const {
		data: preferences,
		isLoading: loading,
		error,
		refetch: reloadPreferences,
	} = useQuery({
		queryKey: PREFERENCES_QUERY_KEY,
		queryFn: async () => {
			const res: APIResponse<AppPreferences> = await invoke(
				channels.preferences.load
			);

			if (!res.success) {
				throw new Error(`Failed to load preferences: ${res.error}`);
			}

			return res.data;
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
	});

	const layoutPreferences = preferences?.layoutPreferences;
	const readerDisplayPreferences = preferences?.readerDisplayPreferences;
	const libraryHistoryPreferences = preferences?.libraryHistoryPreferences;
	const systemBehaviorPreferences = preferences?.systemBehaviorPreferences;
	const experimentalPreferences = preferences?.experimentalPreferences;

	const updatePreferencesMutation = useMutation({
		mutationFn: async (newPreferences: Partial<AppPreferences>) => {
			const currentPreferences = queryClient.getQueryData<AppPreferences>(
				PREFERENCES_QUERY_KEY
			);

			if (!currentPreferences) {
				throw new Error("No current preferences available");
			}

			const updatedPreferences = { ...currentPreferences, ...newPreferences };

			await invoke(channels.preferences.save, updatedPreferences);
			return updatedPreferences;
		},
		onSuccess: (updatedPreferences) => {
			queryClient.setQueryData(PREFERENCES_QUERY_KEY, updatedPreferences);
		},
		onError: (err) => {
			toast.error("Failed to update preferences", {
				description: err instanceof Error ? err.message : "Unknown error",
			});
		},
	});

	const resetPreferences = useMutation({
		mutationFn: async () => {
			await invoke(channels.preferences.reset);
			await queryClient.invalidateQueries({
				queryKey: PREFERENCES_QUERY_KEY,
			});
		},
		onSuccess: (updatedPreferences) => {
			queryClient.setQueryData(PREFERENCES_QUERY_KEY, updatedPreferences);
			toast.success("Preferences reset to default successfully");
		},
		onError: (err) => {
			toast.error("Failed to reset preferences", {
				description: err instanceof Error ? err.message : "Unknown error",
			});
		},
	});

	function updatePreferences(newPreferences: Partial<AppPreferences>) {
		return updatePreferencesMutation.mutateAsync(newPreferences);
	}

	const updateLayoutPreferences = (newLayout: Partial<LayoutPreferences>) => {
		if (!preferences) {
			return;
		}
		return updatePreferences({
			layoutPreferences: { ...preferences.layoutPreferences, ...newLayout },
		});
	};

	const updateReaderPreferences = (newReader: Partial<ReaderPreferences>) => {
		if (!preferences) {
			return;
		}
		return updatePreferences({
			readerDisplayPreferences: {
				...preferences.readerDisplayPreferences,
				...newReader,
			},
		});
	};

	const updateLibraryHistoryPreferences = (
		newHistory: Partial<LibraryHistoryPreferences>
	) => {
		if (!preferences) {
			return;
		}
		return updatePreferences({
			libraryHistoryPreferences: {
				...preferences.libraryHistoryPreferences,
				...newHistory,
			},
		});
	};

	const updateSystemBehaviorPreferences = (
		newSystem: Partial<SystemBehaviorPreferences>
	) => {
		if (!preferences) {
			return;
		}
		return updatePreferences({
			systemBehaviorPreferences: {
				...preferences.systemBehaviorPreferences,
				...newSystem,
			},
		});
	};

	const updateExperimentalPreferences = (
		newExperimental: Partial<ExperimentalPreferences>
	) => {
		if (!preferences) {
			return;
		}
		return updatePreferences({
			experimentalPreferences: {
				...preferences.experimentalPreferences,
				...newExperimental,
			},
		});
	};

	return {
		// Load Preferences
		preferences,
		loading,
		error,
		reloadPreferences,

		// Update Preferences
		updatePreferences,
		isUpdating: updatePreferencesMutation.isPending,
		updateError: updatePreferencesMutation.error,

		// Reset Preferences
		resetPreferences,
		isResetting: resetPreferences.isPending,
		resetError: resetPreferences.error,

		// Specific Preferences
		layoutPreferences,
		readerDisplayPreferences,
		libraryHistoryPreferences,
		systemBehaviorPreferences,
		experimentalPreferences,

		//  Update Specific Preferences
		updateLayoutPreferences,
		updateReaderPreferences,
		updateLibraryHistoryPreferences,
		updateSystemBehaviorPreferences,
		updateExperimentalPreferences,
	};
}

export { usePreferences };
