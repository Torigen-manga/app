import { ExtensionDialog } from "@renderer/components/pages/extensions/info-dialog";
import { Button } from "@renderer/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@renderer/components/ui/card";
import { useLoadExtensions } from "@renderer/hooks/services/extensions/registry";
import { usePreferences } from "@renderer/hooks/services/preferences/use-preferences";
import type { ExtReturnProps } from "@renderer/types/util";
import { Settings2 } from "lucide-react";
import { useState } from "react";
import { ErrorPage } from "./error";
import { LoadingPage } from "./loading";

export default function Extensions(): React.JSX.Element {
	const [ext, setExt] = useState<ExtReturnProps | undefined>(undefined);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { experimentalPreferences } = usePreferences();
	const { data, isLoading, error } = useLoadExtensions();

	const customSourcesAllowed = experimentalPreferences?.enableCustomSources;

	if (isLoading) {
		return <LoadingPage />;
	}

	if (!customSourcesAllowed) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center">
				<h1 className="font-semibold text-primary text-xl">
					Custom Sources Disabled
				</h1>
				<p className="mb-4 text-muted-foreground text-sm">
					Custom sources are disabled in your settings.
				</p>
			</div>
		);
	}

	if (error) {
		return <ErrorPage code={500} message="Failed to load extensions" />;
	}

	if (!data) {
		return <ErrorPage code={404} message="Extensions not found" />;
	}

	function handleExtensionClick(extension: ExtReturnProps) {
		setExt(extension);
		setIsDialogOpen(true);
	}

	return (
		<main className="p-4">
			<ExtensionDialog
				extension={ext}
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			/>
			<h1 className="ml-4 font-semibold text-3xl">Extensions</h1>
			<div className="grid grid-cols-4 gap-4 p-4">
				{data.map((extension) => (
					<Card key={extension.info.id}>
						<CardHeader>
							<CardTitle>{extension.info.name}</CardTitle>
							<CardDescription>
								<p>ID: {extension.info.id}</p>
							</CardDescription>
						</CardHeader>

						<CardContent className="flex justify-between">
							<Button
								onClick={() => handleExtensionClick(extension)}
								variant="outline"
							>
								Info
							</Button>

							<Button size="icon">
								<Settings2 />
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
}
