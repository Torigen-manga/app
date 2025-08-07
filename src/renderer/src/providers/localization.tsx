import { getLanguage } from "@renderer/hooks/services/localization/langs/get-language";
import type {
	Languages,
	UITexts,
} from "@renderer/hooks/services/localization/langs/types";
import { createContext, type ReactNode, useContext, useState } from "react";

interface LocalizationContextType {
	readonly currentLanguage: Languages;
	readonly texts: UITexts;
	readonly setLanguage: (language: Languages) => void;
	readonly availableLanguages: readonly Languages[];
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
	undefined
);

interface LocalizationProviderProps {
	readonly children: ReactNode;
	readonly defaultLanguage?: Languages;
}

export function LocalizationProvider({
	children,
	defaultLanguage = "en-us",
}: LocalizationProviderProps) {
	const [currentLanguage, setCurrentLanguage] = useState<Languages>(() => {
		try {
			const savedLanguage = localStorage.getItem("app-language") as Languages;
			return savedLanguage && ["en-us", "pt-br"].includes(savedLanguage)
				? savedLanguage
				: defaultLanguage;
		} catch {
			return defaultLanguage;
		}
	});

	const texts = getLanguage(currentLanguage);

	const setLanguage = (language: Languages) => {
		setCurrentLanguage(language);
		try {
			localStorage.setItem("app-language", language);
		} catch {
			// Handle localStorage errors silently
		}
	};

	const availableLanguages: readonly Languages[] = ["en-us", "pt-br"] as const;

	const value: LocalizationContextType = {
		currentLanguage,
		texts,
		setLanguage,
		availableLanguages,
	};

	return (
		<LocalizationContext.Provider value={value}>
			{children}
		</LocalizationContext.Provider>
	);
}

export function useLocalization(): LocalizationContextType {
	const context = useContext(LocalizationContext);
	if (context === undefined) {
		throw new Error(
			"useLocalization must be used within a LocalizationProvider"
		);
	}
	return context;
}

export function useTexts(): UITexts {
	const { texts } = useLocalization();
	return texts;
}

export function useLanguage(): {
	readonly currentLanguage: Languages;
	readonly setLanguage: (language: Languages) => void;
	readonly availableLanguages: readonly Languages[];
} {
	const { currentLanguage, setLanguage, availableLanguages } =
		useLocalization();
	return { currentLanguage, setLanguage, availableLanguages };
}
