import { useTheme } from "@renderer/hooks/preferences/use-theme";
import { createContext, type ReactNode, useContext } from "react";

type ThemeContextType = ReturnType<typeof useTheme>;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const theme = useTheme();
	return (
		<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
	);
}

export function useThemeContext() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useThemeContext must be used within a ThemeProvider");
	}
	return context;
}
