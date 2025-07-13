import { Loader2 } from "lucide-react";

export function LoadingPage(): React.JSX.Element {
	return (
		<main className="flex h-full w-full flex-col items-center justify-center p-4">
			<div className="font-semibold text-2xl">Loading...</div>
			<Loader2 className="size-6 animate-spin" />
		</main>
	);
}
