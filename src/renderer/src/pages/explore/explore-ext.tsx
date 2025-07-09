import { MangaCard } from "@renderer/components/cards";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarTrigger,
} from "@renderer/components/ui/menubar";
import { extensionMethods } from "@renderer/hooks/extensions";
import { useLoadExtensions } from "@renderer/hooks/extensions/registry";
import { useLayout } from "@renderer/hooks/preferences/use-layout";
import { cn } from "@renderer/lib/utils";
import { gridMap } from "@renderer/style/layout-options";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { useParams } from "react-router";
import { ErrorPage } from "../error";
import LoadingPage from "../loading";

interface ExploreMenuProps {
	id: string | undefined;
}

function ExploreMenu({ id }: ExploreMenuProps): React.JSX.Element {
	const { data: info, isLoading } = extensionMethods.useSourceInfo(id);
	const { data: extensions } = useLoadExtensions();

	if (!(info || isLoading)) {
		return (
			<div className="font-medium text-red-500 text-sm">
				Source information not available
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Menubar>
				<MenubarLabel className="flex select-none items-center gap-2">
					<Avatar className="size-6">
						<AvatarImage alt={info?.name} src={info?.iconUrl} />
						<AvatarFallback>{info?.name.charAt(0)}</AvatarFallback>
					</Avatar>
					{info?.name}
				</MenubarLabel>
				<MenubarMenu>
					<MenubarTrigger>Change Extensions</MenubarTrigger>
					<MenubarContent>
						<MenubarRadioGroup value={id}>
							{extensions?.map((ext) => (
								<MenubarRadioItem
									className="rounded"
									key={ext.id}
									value={ext.id}
								>
									{ext.name}
								</MenubarRadioItem>
							))}

							{!extensions?.length && <span>No extensions available</span>}
						</MenubarRadioGroup>
						<MenubarSeparator />
						<MenubarItem inset>Add Extension...</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		</div>
	);
}

export default function ExploreExt(): React.JSX.Element {
	const { id } = useParams<{ id: string }>();
	const { grid, coverStyle } = useLayout();

	const {
		data: homepage,
		isLoading,
		isError,
		error,
	} = extensionMethods.useHomepage(id);

	if (!id) {
		return <ErrorPage code={400} message="Extension ID is required" />;
	}

	if (!(homepage || isLoading)) {
		return <ErrorPage code={404} message="Homepage not found" />;
	}

	if (isLoading) {
		return <LoadingPage />;
	}

	if (isError || error) {
		return <ErrorPage code={500} message="Error loading content" />;
	}

	return (
		<div className="relative flex h-full w-full flex-col overflow-y-hidden">
			<div
				className={cn(
					"sticky top-0 z-10 flex h-14 w-full shrink-0 items-center border-b bg-background px-2"
				)}
			>
				<ExploreMenu id={id} />
			</div>

			<div className="overflow-y-auto">
				{homepage?.map((section) => (
					<section
						className="mx-auto w-full max-w-7xl p-2 pb-4"
						key={section.id}
					>
						<div className="flex items-center justify-between">
							<h1 className="my-3 font-semibold text-3xl">{section.title}</h1>
							<Button variant="outline">
								View More <ArrowRight />
							</Button>
						</div>
						<div className={cn("grid w-full gap-4", gridMap(grid))}>
							{section.items.map((item) => (
								<MangaCard
									image={item.image}
									key={item.id}
									property={coverStyle}
									title={item.title}
									url={`/manga/${id}/${item.id}`}
								/>
							))}
						</div>
					</section>
				))}
			</div>
			{!homepage && (
				<div className="flex h-full w-full items-center justify-center text-gray-500">
					No content available
				</div>
			)}
		</div>
	);
}
