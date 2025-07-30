import { usePreferences } from "@renderer/hooks/services/preferences/use-preferences";
import { useCallback } from "react";

export function useExperimentalSettings() {
	const { experimentalPreferences, updateExperimentalPreferences } =
		usePreferences();

	const handleCustomSourcesChange = useCallback(
		(value: boolean) => {
			updateExperimentalPreferences({ enableCustomSources: value });
		},
		[updateExperimentalPreferences]
	);

	const handleDebugLoggingChange = useCallback(
		(value: boolean) => {
			updateExperimentalPreferences({ enableDebugLogging: value });
		},
		[updateExperimentalPreferences]
	);

	const handleHardwareAccelerationChange = useCallback(
		(value: boolean) => {
			updateExperimentalPreferences({ hardwareAcceleration: value });
		},
		[updateExperimentalPreferences]
	);

	return {
		experimentalPreferences,
		isLoading: !experimentalPreferences,
		handlers: {
			handleCustomSourcesChange,
			handleDebugLoggingChange,
			handleHardwareAccelerationChange,
		},
	};
}
