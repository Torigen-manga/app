import { Toaster } from "@renderer/components/ui/sonner";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./routes";
import "./style/globals.css";
import { Providers } from "./providers";

// biome-ignore lint/style/noNonNullAssertion: The root element is guaranteed to exist in the HTML.
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Providers>
			<RouterProvider router={router} />
			<Toaster />
		</Providers>
	</StrictMode>
);
