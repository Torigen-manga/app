import { cn } from "@renderer/lib/utils";
import { coverVariant } from "@renderer/style/layout-options";
import React from "react";
import { Link } from "react-router";

interface MangaCardProps {
	url: string;
	title: string;
	image: string;
	property?: "default" | "shadow" | "rounded" | "border";
}

interface LibraryCardProps extends MangaCardProps {
	unreadCount?: number;
}

export function LibraryCard({
	url,
	title,
	image,
	property,
	unreadCount,
}: LibraryCardProps) {
	return (
		<div className="relative">
			<MangaCard image={image} property={property} title={title} url={url} />
			{unreadCount !== undefined && unreadCount > 0 && (
				<div className="-top-1 -right-1 absolute flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500 p-1 text-white">
					<p className="text-sm">{unreadCount}</p>
				</div>
			)}
		</div>
	);
}

export function MangaCard({
	url,
	title,
	image,
	property,
}: MangaCardProps): React.JSX.Element {
	const [imageError, setImageError] = React.useState(false);
	const [imageLoaded, setImageLoaded] = React.useState(false);

	const handleImageError = React.useCallback(() => {
		setImageError(true);
	}, []);

	const handleImageLoad = React.useCallback(() => {
		setImageLoaded(true);
	}, []);

	return (
		<Link
			aria-label={`Read ${title}`}
			className={cn(
				"block h-full rounded-lg bg-sidebar p-2 transition-all duration-200 hover:bg-primary/40 focus:bg-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50",
				coverVariant({ property })
			)}
			to={url}
		>
			<div className="relative overflow-hidden">
				{!(imageLoaded || imageError) && (
					<div className="absolute inset-0 animate-pulse rounded-lg bg-muted" />
				)}

				{imageError ? (
					<div
						className={cn(
							"flex aspect-[3/4] items-center justify-center bg-muted text-muted-foreground text-xs",
							coverVariant({ property })
						)}
					>
						No Image
					</div>
				) : (
					// biome-ignore lint/nursery/noNoninteractiveElementInteractions: This is an image element that handles loading and error states.
					<img
						alt={title}
						className={cn(
							"aspect-[3/4] h-auto w-full object-cover transition-opacity duration-200",
							coverVariant({ property }),
							!imageLoaded && "opacity-0"
						)}
						decoding="async"
						loading="lazy"
						onError={handleImageError}
						onLoad={handleImageLoad}
						src={image}
					/>
				)}
			</div>

			<h3 className="mt-2 line-clamp-2 font-medium text-foreground text-sm leading-tight">
				{title}
			</h3>
		</Link>
	);
}
