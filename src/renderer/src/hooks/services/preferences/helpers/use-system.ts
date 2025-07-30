import { usePreferences } from "@renderer/hooks/services/preferences/use-preferences";
import { useCallback } from "react";

export function useSystemBehaviorSettings() {
	const { systemBehaviorPreferences, updateSystemBehaviorPreferences } =
		usePreferences();

	const handleUpdateOnStartupChange = useCallback(
		(value: boolean) => {
			updateSystemBehaviorPreferences({ updateOnStartup: value });
		},
		[updateSystemBehaviorPreferences]
	);

	const handleConfirmRemovalChange = useCallback(
		(value: boolean) => {
			updateSystemBehaviorPreferences({ confirmRemoval: value });
		},
		[updateSystemBehaviorPreferences]
	);

	const handleNotificationsChange = useCallback(
		(value: boolean) => {
			updateSystemBehaviorPreferences({ enableNotifications: value });
		},
		[updateSystemBehaviorPreferences]
	);

	return {
		systemBehaviorPreferences,
		isLoading: !systemBehaviorPreferences,
		handlers: {
			handleUpdateOnStartupChange,
			handleConfirmRemovalChange,
			handleNotificationsChange,
		},
	};
}
