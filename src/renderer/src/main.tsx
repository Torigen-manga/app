import { Toaster } from "@renderer/components/ui/sonner";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { appRoutes } from "./route";
import "./style/globals.css";
import { Providers } from "./providers";

// biome-ignore lint/style/noNonNullAssertion: The root element is guaranteed to exist in the HTML.
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Providers>
			<RouterProvider router={appRoutes} />
			<Toaster />
		</Providers>
	</StrictMode>
);
