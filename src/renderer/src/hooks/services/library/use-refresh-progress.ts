import { channels } from "@common/index";
import { invoke, on, removeListener } from "@renderer/lib/ipc-methods";
import { useCallback, useEffect, useState } from "react";

interface LibraryRefreshProgress {
	isRefreshing: boolean;
	overallProgress: {
		completed: number;
		total: number;
		errors: number;
	};
	categories: Array<{
		categoryId: string;
		categoryName: string;
		total: number;
		completed: number;
		errors: number;
		isComplete: boolean;
		entries: Array<{
			entryId: string;
			title: string;
			status: "pending" | "updating" | "completed" | "error";
			error?: string;
		}>;
	}>;
	currentCategory?: string;
}

export function useRefreshProgress() {
	const [progress, setProgress] = useState<LibraryRefreshProgress | null>(null);
	const [callbackId] = useState(
		() => `refresh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
	);

	const setupProgressListener = useCallback(async () => {
		try {
			await invoke(channels.library.setRefreshProgressCallback, callbackId);
			const progressChannel = `library-refresh-progress-${callbackId}`;
			const handleProgressUpdate = (
				_: unknown,
				progressData: LibraryRefreshProgress
			) => {
				setProgress(progressData);
			};

			on(progressChannel, handleProgressUpdate);

			return () => {
				removeListener(progressChannel, handleProgressUpdate);
			};
		} catch {
			return () => {
				// No cleanup needed
			};
		}
	}, [callbackId]);

	useEffect(() => {
		let cleanup: (() => void) | undefined;

		setupProgressListener().then((cleanupFn) => {
			cleanup = cleanupFn;
		});

		return () => {
			if (cleanup) {
				cleanup();
			}
		};
	}, [setupProgressListener]);

	const clearProgress = useCallback(() => {
		setProgress(null);
	}, []);

	return {
		progress,
		clearProgress,
	};
}
