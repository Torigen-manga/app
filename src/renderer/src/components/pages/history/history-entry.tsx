import type { HistoryEntryWithData } from "@common/index";
import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

export function HistoryLogEntry({ entry }: { entry: HistoryEntryWithData }) {
	const readDate = new Date(entry.log.readAt);
	const isComplete = entry.log.isComplete;

	return (
		<div className="flex h-20 rounded-lg border p-2 transition-colors hover:bg-muted/20">
			<div className="flex w-full min-w-0 justify-between px-3">
				<div className="flex min-w-0 flex-1 flex-col justify-between">
					<div className="flex flex-col">
						<Link
							className="w-fit cursor-pointer truncate font-semibold text-lg hover:underline"
							to={`/manga/${entry.data?.sourceId}/${entry.data?.mangaId}`}
						>
							{entry.data?.title}
						</Link>
						<Link
							className="-mt-1 w-fit font-semibold text-primary text-sm hover:underline"
							to={`/manga/${entry.data?.sourceId}/${entry.data?.mangaId}/chapter/${entry.log.chapterId}`}
						>
							Chapter {entry.log.chapterNumber}
						</Link>
					</div>
					<div className="inline-flex items-center gap-2">
						<p className="text-muted-foreground text-sm">
							Last read page:{" "}
							<span className={cn(isComplete && "line-through")}>
								{entry.log.pageNumber}
							</span>
						</p>
						{isComplete && (
							<span className="inline-flex items-center gap-1 text-primary text-sm">
								Complete
							</span>
						)}
					</div>
				</div>

				<div className="flex flex-col items-end justify-between text-right">
					<p className="font-mono text-muted-foreground text-xs">
						{entry.log.chapterId}
					</p>
					<div className="text-muted-foreground text-sm">
						<p className="font-medium">{readDate.toLocaleDateString()}</p>
						<p className="text-xs">
							{readDate.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>
				</div>
			</div>

			<div className="ml-2 flex h-full items-center justify-center border-l pl-2">
				<Button
					className="cursor-pointer"
					onClick={() => {
						// Dropdown Menu
					}}
					size="icon"
					variant="ghost"
				>
					<Menu size={16} />
				</Button>
			</div>
		</div>
	);
}
